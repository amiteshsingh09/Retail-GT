import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, ToastAndroid, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from '@expo/vector-icons';
import { local_URL } from './Constants';
import { CameraView, Camera } from 'expo-camera';
import { BranchList } from "./CustomerList";

export const OrderReturn = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const cameraRef = useRef(null);

  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [branchName, setBranchName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [recentlyScannedItem, setRecentlyScannedItem] = useState(null);
  const [saleId, setSaleId] = useState(""); 
  const { customerId, username, userRole } = route.params || {};


  useEffect(() => {
    const { branchName: branchNameParam, userId: userIdParam, customerName: customerNameParam , saleId : saleIdParam } = route.params || {};

    const fetchStoredData = async () => {
      if (userIdParam) {
        setUserId(userIdParam.toString());
        await AsyncStorage.setItem("userId", userIdParam.toString());
      } else {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
        }
      }

      if (branchNameParam) {
        setBranchName(branchNameParam);
        await AsyncStorage.setItem("branchName", branchNameParam);
      } 
      if (customerNameParam) {
        setCustomerName(customerNameParam);
      } else {
        const storedBranchName = await AsyncStorage.getItem("branchName");
        if (storedBranchName) {
          setBranchName(storedBranchName);
        }
      }
      if (saleIdParam) {
        setSaleId(saleIdParam); // Set saleId if provided
      }
    };

    fetchStoredData();
  }, [route.params]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${local_URL}/api/GTSale/${customerId}`);
          console.log('',customerId)
          const slicedData = response.data.slice(0, 20);
          setItems(slicedData);
          const initialQuantities = {};
          for (const item of slicedData) {
            const storedQuantity = await AsyncStorage.getItem(item.batchNumber);
            initialQuantities[item.batchNumber] = " ";
          }
        } catch (error) {
          console.error("Error fetching item details:", error);
        } finally {
          setLoading(false);
        }
      };

      if (customerId) {
        fetchData();
      }
  
      return () => {
        // Cleanup if needed
      };
    }, [customerId])
  );

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleQuantityChange = useCallback(async (batchNumber, quantity) => {
    const newQuantities = {
      ...quantities,
      [batchNumber]: quantity,
    };
    setQuantities(newQuantities);
    await AsyncStorage.setItem(batchNumber, quantity);
  }, [quantities]);

  const incrementQuantity = useCallback((batchNumber) => {
    const currentQuantity = parseInt(quantities[batchNumber]) || 0;
    const stockQty = items.find(item => item.batchNumber === batchNumber)?.stockQty || 0;
    if (currentQuantity < stockQty) {
      handleQuantityChange(batchNumber, (currentQuantity + 1).toString());
    }
  }, [quantities, items, handleQuantityChange]);

  const decrementQuantity = useCallback((batchNumber) => {
    const currentQuantity = parseInt(quantities[batchNumber]) || 0;
    if (currentQuantity > 0) {
      handleQuantityChange(batchNumber, (currentQuantity - 1).toString());
    }
  }, [quantities, handleQuantityChange]);

  const toggleCamera = useCallback(() => {
    setShowCamera(!showCamera);
    setScanned(false);
  }, [showCamera]);

  const handleBarCodeScanned = useCallback(({ type, data }) => {
    setScanned(true);
    const scannedBatchNumber = data.trim();
    const item = items.find(item => item.batchNumber === scannedBatchNumber);
    
    if (item) {
      const currentQuantity = parseInt(quantities[scannedBatchNumber]) || 0;
      if (currentQuantity < item.stockQty) {
        handleQuantityChange(scannedBatchNumber, (currentQuantity + 1).toString());
        Alert.alert('Success', `Added 1 to item: ${item.itemName}`);
        
        setRecentlyScannedItem(item);
        
        const updatedItems = [
          item,
          ...items.filter(i => i.batchNumber !== scannedBatchNumber)
        ];
        setItems(updatedItems);
      } else {
        Alert.alert('Warning', `Cannot add more. Max quantity (${item.stockQty}) reached for ${item.itemName}`);
      }
    } else {
      Alert.alert('Error', `Batch number ${scannedBatchNumber} not found in the current list`);
    }
    
    setShowCamera(false);
  }, [items, quantities, handleQuantityChange]);

  const handleReturnOrder = useCallback(() => {
    const itemsWithQuantity = items.filter((item) => parseInt(quantities[item.batchNumber]) > 0);
    if (itemsWithQuantity.length === 0) {
      if (ToastAndroid) {
        ToastAndroid.show("Please add items to the cart first", ToastAndroid.SHORT);
      } else {
        console.warn("ToastAndroid is not available");
      }
      return;
    }
    const { totalQuantity, totalPrice } = calculateTotal();

    const itemDetails = JSON.stringify(
      itemsWithQuantity.map((item, index) => {
        const quantity = parseInt(quantities[item.batchNumber]) || 0;
        const price = item.rate * quantity;
        
        return {
          itemId: item.itemId,
          batchNumber: item.batchNumber,
          itemName: item.itemName,
          branchName: item.branchName,
          quantity,
          price,
          saleId:item.saleId,
          lineNumber: (index + 1).toString().padStart(3, '0'),
          branchId: item.branchId, 
        };
        
      }
      
    )
    );

    navigation.navigate("Return Cart", {
      itemDetails,
      totalQuantity,
      totalPrice,
      customerName,
      branchName,
      saleId,
      userId,
      userRole,
      customerId,
      username,
    });
    console.log("--------",saleId);
    
  }, [items, saleId,quantities, navigation, customerName, branchName, userId, userRole, customerId, username]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    return `${day} ${month}`;
  };

  const calculateTotal = useCallback(() => {
    let totalQuantity = 0;
    let totalPrice = 0;
    items.forEach((item) => {
      const quantity = parseInt(quantities[item.batchNumber]) || 0;
      const amount = quantity * item.rate;
      totalQuantity += quantity;
      totalPrice += amount;
    });
    return { totalQuantity, totalPrice };
  }, [items, quantities]);

  const filteredItems = useMemo(() => {
    let filtered = items.filter((item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (recentlyScannedItem) {
      filtered = [
        recentlyScannedItem,
        ...filtered.filter(item => item.batchNumber !== recentlyScannedItem.batchNumber)
      ];
    }
    
    return filtered;
  }, [items, searchTerm, recentlyScannedItem]);

  useEffect(() => {
    if (recentlyScannedItem) {
      const timer = setTimeout(() => {
        setRecentlyScannedItem(null);
      }, 5000); // Reset after 5 seconds
  
      return () => clearTimeout(timer);
    }
  }, [recentlyScannedItem]);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      {showCamera ? (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          >
            <View style={styles.overlay}>
              <View style={styles.unfocusedContainer}></View>
              <View style={styles.focusedContainer}>
                <View style={styles.focusedBorder} />
              </View>
              <View style={styles.unfocusedContainer}></View>
            </View>
          </CameraView>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton} onPress={toggleCamera}>
              <Text style={styles.controlText}>Close QR Scanner</Text>
            </TouchableOpacity>
            {scanned && (
              <TouchableOpacity style={styles.controlButton} onPress={() => setScanned(false)}>
                <Text style={styles.controlText}>Scan Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.branchName}>{customerName}</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by item name"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <TouchableOpacity style={styles.button} onPress={toggleCamera}>
              <FontAwesome name='qrcode' size={40} style={{color:'white', justifyContent:'center', alignItems:'center', textAlign:'center'}} />
            </TouchableOpacity>
          </View>
          <View style={{flex:1}}>
            <View style={styles.itemRows}>
              <Text style={styles.rtext}>Item Name</Text>
              <Text style={styles.rtext}>Batch Number</Text>
              <Text style={styles.rtext}>Sale Date</Text>
              <Text style={styles.rtext}>Stock Quantity</Text>
              <Text style={styles.rtext}>Return Quantity</Text>
            </View>
            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.batchNumber.toString()}
              renderItem={({ item }) => (
                <View style={styles.itemRowContainer}>
                  <Text style={styles.itemName}>{item.itemName}</Text>
                  <View style={styles.detailsRow}>
                    <Text style={styles.batchNumber}>{item.batchNumber}</Text>
                    <Text style={styles.saleDate}>{formatDate(item.saleDate)}</Text>
                    <Text style={styles.batchNumber}>₹{item.rate}</Text>
                    <Text style={styles.itemMRP}>{item.stockQty}</Text>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity onPress={() => decrementQuantity(item.batchNumber)} style={styles.quantityButton}>
                        <FontAwesome name='minus' style={styles.quantityIcon} />
                      </TouchableOpacity>
                      <TextInput
                        style={styles.quantityInput}
                        keyboardType="numeric"
                        value={quantities[item.batchNumber] || ""}
                        onChangeText={(text) => {
                          if (!isNaN(text) && parseInt(text) <= item.stockQty) {
                            handleQuantityChange(item.batchNumber, text.replace(/\D/g, ''));
                          } else if (text === "") {
                            handleQuantityChange(item.batchNumber, "");
                          }
                        }}
                      />
                      <TouchableOpacity onPress={() => incrementQuantity(item.batchNumber)} style={styles.quantityButton}>
                        <FontAwesome name='plus' style={styles.quantityIcon} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
              extraData={recentlyScannedItem}
              ListFooterComponent={
                <View style={styles.footer}>
                  <Text style={styles.totalText}>Total</Text>
                  <Text style={styles.totalQuantity}>{calculateTotal().totalQuantity}</Text>
                  <Text style={styles.totalPrice}>{calculateTotal().totalPrice}</Text>
                </View>
              }
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Return Order" onPress={handleReturnOrder} color="#4CAF50" />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  buttonContainer: {
    marginTop: 10,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    flexDirection: 'column',
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  focusedContainer: {
    flex: 6,
  },
  focusedBorder: {
    flex: 1,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 10,
    margin: 30,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  controlButton: {
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
  },
  controlText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  branchName: {
    fontSize: 20,
    fontWeight: "bold",
    flex:2
  },
  searchInput: {
    flex: 1,
    padding: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  itemRows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#4CAF50',
    fontSize: 16,
  },
  
  batchNumber: {
    flex: 2,
    fontSize: 15,
    marginLeft: 4,
    textAlign:'left',
    justifyContent:'center'
  },
  batchNumber1: {
    flex: 2,
    fontSize: 15,
    marginLeft: 4,
    textAlign:'left',
    
  },
  
  quantityContainer: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButton: {
    padding: 5,
  },
  quantityIcon: {
    fontSize: 16,
    color: "blue",
  },
  quantityInput: {
    padding: 3,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    textAlign: "center",
    maxWidth: 50,
    width: 40,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  totalQuantity: {
    fontSize: 20,
  },
  totalPrice: {
    fontSize: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
  rtext: {
    flex: 1,
    textAlign: "center",
    color:'white'
  },
  rtextb: {
    flex: 1,
    textAlign: "center",
  },
  itemRowContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  batchContainer: {
    flex: 1,
  },
  batchNumber: {
    fontSize: 14,
  },
  saleDate: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  button: {
    backgroundColor:'#4CAF50',
    width:40,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginRight:10
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonC: {
    
    backgroundColor:'#4CAF50',
    width:100,
    height:60,
    justifyContent:'center',
    right:0,
    bottom:0,
  },
  buttonTextC: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign:'center',
    justifyContent:'center',

  },
  itemMRP: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
    marginRight:4
  },
  quantityContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  quantityButton: {
    padding: 5,
  },
  quantityIcon: {
    fontSize: 16,
    color: "blue",
  },
  quantityInput: {
    padding: 3,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    textAlign: "center",
    maxWidth: 50,
    width: 40,
  },
});
