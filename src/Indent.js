// import React, { useState, useEffect, useCallback } from "react";
// import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, ToastAndroid, ActivityIndicator } from "react-native";
// import { Picker } from '@react-native-picker/picker';
// import axios from "axios";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { FontAwesome } from '@expo/vector-icons';


// export const Indent = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const [quantities, setQuantities] = useState({});
//   const [branchName, setBranchName] = useState("");
//   const [customerName, setCustomerName] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [userId, setUserId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [fromLocation, setFromLocation] = useState("");
//   const [categoryItems, setCategoryItems] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);

//   const customerId = route.params?.customerId || ''; 
//   const { username, userRole, onOrderPlaced } = route.params || {};

//   const locationOptions = [
//     { id: 'R622', name: 'Vihirgaon Godown' },
//     { id: 'R638', name: 'Vihirgaon Dress Plant' },
//   ];

//   useEffect(() => {
//     const fetchStoredData = async () => {
//       const storedUserId = await AsyncStorage.getItem("userId");
//       setUserId(storedUserId || '');

//       const storedBranchName = await AsyncStorage.getItem("branchName");
//       setBranchName(storedBranchName || '');
//     };

//     fetchStoredData();
//   }, []);

//   useEffect(() => {
//     if (fromLocation) {
//       fetchItemsByLocation(fromLocation);
//     } else {
//       setCategoryItems([]);
//     }
//   }, [fromLocation]);

//   const fetchItemsByLocation = async (locationId) => {
//     setLoading(true);
//     setRefreshing(true);
//     let endpoint = '';

//     if (locationId === 'R622') {
//       endpoint = 'https://ibretailapi.abisaio.com/api/itemByParm/GetbyCategory/R622/ALL';
//     } else if (locationId === 'R638') {
//       endpoint = 'https://ibretailapi.abisaio.com/api/itemByParm/GetbyCategory/R638/ALL';
//     } else {
//       setLoading(false);
//       setRefreshing(false);
//       return;
//     }

//     try {
//       const response = await axios.get(endpoint);
//       setCategoryItems(response.data);
//       const initialQuantities = {};
//       response.data.forEach(item => {
//         initialQuantities[item.itemID] = {
//           kg: "",
//           nos: "",
//           sellByWeight: item.sellByWeight,
//           altQtyEnabled: item.altQtyEnabled
//         };
//       });
//       setQuantities(initialQuantities);
//     } catch (error) {
//       console.error("Error fetching items by location:", error);
//       setCategoryItems([]);
//     }
//     setLoading(false);
//     setRefreshing(false);
//   };

//   const handleQuantityChange = async (itemId, type, quantity) => {
//     const newQuantities = {
//       ...quantities,
//       [itemId]: {
//         ...quantities[itemId],
//         [type]: quantity,
//       },
//     };
//     setQuantities(newQuantities);
//     await AsyncStorage.setItem(itemId, JSON.stringify(newQuantities[itemId]));
//   };
  

//   const calculateTotal = () => {
//     let totalQuantity = 0;
//     let totalPrice = 0;
//     categoryItems.forEach((item) => {
//       const kgQuantity = parseInt(quantities[item.itemID]?.kg) || 0;
//       const nosQuantity = parseInt(quantities[item.itemID]?.nos) || 0;
//       const quantity = item.sellByWeight ? kgQuantity : nosQuantity;
//       const amount = quantity * item.rate;
//       totalQuantity += quantity;
//       totalPrice += amount;
//     });
//     return { totalQuantity, totalPrice };
//   };

//   const handleAddToCart = () => {
//     const itemsWithQuantity = categoryItems.filter((item) => {
//       const quantity = item.sellByWeight ? parseFloat(quantities[item.itemID]?.kg) : parseInt(quantities[item.itemID]?.nos);
//       return quantity > 0;
//     });

//     if (itemsWithQuantity.length === 0) {
//       ToastAndroid.show("Please add items to the cart first", ToastAndroid.SHORT);
//       return;
//     }

//     const { totalQuantity, totalPrice } = calculateTotal();

//     const itemDetails = itemsWithQuantity.map((item , index) => {
//       const kg = parseFloat(quantities[item.itemID]?.kg) || 0;
//       const nos = parseInt(quantities[item.itemID]?.nos) || 0;
//       const price = item.rate * (item.sellByWeight ? kg : nos);
//       return {
//         itemId: item.itemID,
//         itemName: item.itemName,
//         kg,
//         nos,
//         price,
//         lineNumber: (index + 1).toString().padStart(3, '0'),
//         sellByWeight: item.sellByWeight,
//         altQtyEnabled: item.altQtyEnabled,
//         fromLocation: fromLocation,
//         userId,
//         username,
//         userRole,
//         fromLocation,
//       };
//     });

//     navigation.navigate("Indent Cart", {
//       itemDetails: encodeURIComponent(JSON.stringify(itemDetails)),
//       totalQuantity,
//       totalPrice,
//       customerName,
//       userId,
//       customerId,
//       username,
//       userRole,
//       onOrderPlaced,
//       branchId: fromLocation,
//     });
//   };

//   const handleCustomerPageNavigation = async () => {
//     await AsyncStorage.clear();
//     navigation.navigate("General Trading", { username, userId, userRole });
//   };

//   const handleFirstPickerChange = (itemValue) => {
//     setFromLocation(itemValue);
//   };

//   const handleRefresh = useCallback(async () => {
//     if (fromLocation) {
//       setRefreshing(true);
//       await fetchItemsByLocation(fromLocation);
//     }
//   }, [fromLocation]);

//   const getTextInputStyles = (item) => {
//     const isKgEnabled = item.altQtyEnabled || (item.sellByWeight && !item.altQtyEnabled);
//     const isNosEnabled = item.altQtyEnabled || (!item.sellByWeight && !item.altQtyEnabled);

//     return {
//       kgStyle: {
//         borderColor: isKgEnabled ? '#4CAF50' : '#ccc',
//         backgroundColor: !isKgEnabled ? '#e0e0e0' : '#fff',
//       },
//       nosStyle: {
//         borderColor: isNosEnabled ? '#4CAF50' : '#ccc',
//         backgroundColor: !isNosEnabled ? '#e0e0e0' : '#fff',
//       },
//     };
//   };

//   const sortedCategoryItems = [...categoryItems]
//     .filter(item => item.itemName.toLowerCase().includes(searchTerm.toLowerCase()))
//     .sort((a, b) => a.itemName.localeCompare(b.itemName));

//   return (
//     <View style={styles.container}>
//       {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
//       <View style={styles.header}>
//         <Text style={styles.branchName}>{branchName || 'Poonam Bazar'}</Text>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search by item name"
//           value={searchTerm}
//           onChangeText={setSearchTerm}
//         />
//         <TouchableOpacity onPress={handleCustomerPageNavigation}>
//           <FontAwesome name="home" style={styles.icon} />
//         </TouchableOpacity>
//       </View>
//       <View style={{ flexDirection: 'row' }}>
//         <View style={{ flex: 1 }}>
//           <View style={styles.pickerContainer}>
//             <Text style={styles.pickerLabel}>Select Type:</Text>
//             <Picker
//               selectedValue="IBST"
//               style={styles.picker}
//               enabled={false}
//             >
//               <Picker.Item label="IBST" value="IBST" />
//             </Picker>
//           </View>
//         </View>
//         <View style={styles.pickerContainer}>
//           <Text style={styles.pickerLabel}>From Location:</Text>
//           <Picker
//             selectedValue={fromLocation}
//             style={styles.picker}
//             onValueChange={handleFirstPickerChange}
//           >
//             <Picker.Item label="Select Location" value="" />
//             {locationOptions.map((location) => (
//               <Picker.Item key={location.id} label={location.name} value={location.id} />
//             ))}
//           </Picker>
//         </View>
//       </View>
//       {categoryItems.length > 0 && (
//         <>
//           <View style={styles.itemRows}>
//             <Text style={styles.itemColumn}>Item Name</Text>
//             <Text style={styles.itemColumn}>Nos</Text>
//             <Text style={styles.itemColumn}>Weight</Text>
//           </View>

//           <FlatList
//         data={sortedCategoryItems}
//         keyExtractor={(item) => item.itemID.toString()}
//         renderItem={({ item }) => {
//           const { kg, nos, sellByWeight, altQtyEnabled } = quantities[item.itemID] || {};
//           const { kgStyle, nosStyle } = getTextInputStyles(item);

//           return (
//             <View style={styles.itemRow}>
//               <Text style={styles.itemName}>{item.itemName}</Text>
//               <View style={styles.quantityContainer}>
//                 <TextInput
//                   style={[styles.quantityInput, nosStyle]}
//                   keyboardType="numeric"
//                   value={nos}
//                   onChangeText={(text) => handleQuantityChange(item.itemID, 'nos', text.replace(/\D/g, ''))}
//                   editable={altQtyEnabled || (!sellByWeight && !altQtyEnabled)}
//                 />
//               </View>
//               <View style={styles.quantityContainer}>
//                 <TextInput
//                   style={[styles.quantityInput, kgStyle]}
//                   keyboardType="numeric"
//                   value={kg}
//                   onChangeText={(text) => {
//                     const formattedText = text.replace(/[^0-9.]/g, '');
//                     const parts = formattedText.split('.');
//                     if (parts.length > 2) {
//                       text = parts[0] + '.' + parts[1];
//                     }
//                     handleQuantityChange(item.itemID, 'kg', text.replace(/\D/g, ''));
//                   }}
//                   editable={altQtyEnabled || (sellByWeight && !altQtyEnabled)}
//                 />
//                 <Text> kg</Text>
//               </View>
//             </View>
//           );
//         }}
             
//             // ListFooterComponent={
//             //   <View style={styles.footer}>
//             //     <Text style={styles.totalText}>Total</Text>
//             //     <Text style={styles.totalQuantity}>{calculateTotal().totalQuantity}</Text>
//             //     <Text style={styles.totalPrice}>{calculateTotal().totalPrice}</Text>
//             //   </View>
//             // }
//             refreshing={refreshing}
//             onRefresh={handleRefresh}
//           />
//         </>
//       )}
//       <View style={styles.buttonContainer}>
//         <Button title="Add to Cart" onPress={handleAddToCart} color="#4CAF50" />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: "#f5f5f5",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   branchName: {
//     flex: 2,
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   searchInput: {
//     flex: 2,
//     padding: 8,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 5,
//     marginLeft: 10,
//     marginRight: 10,
//     minWidth: 100,
//     maxWidth: 150,
//   },
//   icon: {
//     flex: 1,
//     fontSize: 24,
//     color: "black",
//   },
//   pickerContainer: {
//     marginVertical: 5,
//   },
//   pickerLabel: {
//     fontSize: 18,
//     marginBottom: 4,
//   },
//   picker: {
//     height: 50,
//     width: '80%',
//   },
//   itemRows: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     backgroundColor: '#4CAF50',
//   },
//   itemColumn: {
//     color: 'white',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   loader: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   itemRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 8,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//   },
//   itemName: {
//     flex: 2,
//     fontSize: 16,
//     textAlign: 'left',
//   },
//   quantityContainer: {
//     flex: 2,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   quantityInput: {
//     padding: 3,
//     borderWidth: 1,
//     borderRadius: 5,
//     textAlign: 'center',
//     maxWidth: 50,
//     flex: 1,
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 10,
//     backgroundColor: "#f5f5f5",
//   },
//   totalText: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   totalQuantity: {
//     fontSize: 20,
//   },
//   totalPrice: {
//     fontSize: 20,
//   },
//   buttonContainer: {
//     marginTop: 10,
//   },
// });




















import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, ToastAndroid, ActivityIndicator } from "react-native";
import { Picker } from '@react-native-picker/picker';
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

// Custom Picker component
const CustomPicker = ({ selectedValue, onValueChange, options }) => (
  <View style={styles.customPickerContainer}>
    <Picker
      selectedValue={selectedValue}
      style={styles.customPicker}
      onValueChange={onValueChange}
    >
      {options.map(option => (
        <Picker.Item key={option.id} label={option.name} value={option.id} />
      ))}
    </Picker>
  </View>
);

export const Indent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [quantities, setQuantities] = useState({});
  const [branchName, setBranchName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fromLocation, setFromLocation] = useState("");
  const [categoryItems, setCategoryItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const customerId = route.params?.customerId || ''; 
  const { username, userRole, onOrderPlaced } = route.params || {};

  const locationOptions = [
    { id: 'R622', name: 'Vihirgaon Godown' },
    { id: 'R638', name: 'Vihirgaon Dress Plant' },
  ];

  useEffect(() => {
    const fetchStoredData = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      setUserId(storedUserId || '');

      const storedBranchName = await AsyncStorage.getItem("branchName");
      setBranchName(storedBranchName || '');
    };

    fetchStoredData();
  }, []);

  useEffect(() => {
    if (fromLocation) {
      fetchItemsByLocation(fromLocation);
    } else {
      setCategoryItems([]);
    }
  }, [fromLocation]);

  const fetchItemsByLocation = async (locationId) => {
    setLoading(true);
    setRefreshing(true);
    let endpoint = '';

    if (locationId === 'R622') {
      endpoint = 'https://ibretailapi.abisaio.com/api/itemByParm/GetbyCategory/R622/ALL';
    } else if (locationId === 'R638') {
      endpoint = 'https://ibretailapi.abisaio.com/api/itemByParm/GetbyCategory/R638/ALL';
    } else {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const response = await axios.get(endpoint);
      setCategoryItems(response.data);
      const initialQuantities = {};
      response.data.forEach(item => {
        initialQuantities[item.itemID] = {
          kg: "",
          nos: "",
          sellByWeight: item.sellByWeight,
          altQtyEnabled: item.altQtyEnabled
        };
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error("Error fetching items by location:", error);
      setCategoryItems([]);
    }
    setLoading(false);
    setRefreshing(false);
  };

  const handleQuantityChange = async (itemId, type, quantity) => {
    const newQuantities = {
      ...quantities,
      [itemId]: {
        ...quantities[itemId],
        [type]: quantity,
      },
    };
    setQuantities(newQuantities);
    await AsyncStorage.setItem(itemId, JSON.stringify(newQuantities[itemId]));
  };

  const calculateTotal = () => {
    let totalQuantity = 0;
    let totalPrice = 0;
    categoryItems.forEach((item) => {
      const kgQuantity = parseInt(quantities[item.itemID]?.kg) || 0;
      const nosQuantity = parseInt(quantities[item.itemID]?.nos) || 0;
      const quantity = item.sellByWeight ? kgQuantity : nosQuantity;
      const amount = quantity * item.rate;
      totalQuantity += quantity;
      totalPrice += amount;
    });
    return { totalQuantity, totalPrice };
  };

  const handleAddToCart = () => {
    const itemsWithQuantity = categoryItems.filter((item) => {
      const quantity = item.sellByWeight ? parseFloat(quantities[item.itemID]?.kg) : parseInt(quantities[item.itemID]?.nos);
      return quantity > 0;
    });

    if (itemsWithQuantity.length === 0) {
      ToastAndroid.show("Please add items to the cart first", ToastAndroid.SHORT);
      return;
    }

    const { totalQuantity, totalPrice } = calculateTotal();

    const itemDetails = itemsWithQuantity.map((item , index) => {
      const kg = parseFloat(quantities[item.itemID]?.kg) || 0;
      const nos = parseInt(quantities[item.itemID]?.nos) || 0;
      const price = item.rate * (item.sellByWeight ? kg : nos);
      return {
        itemId: item.itemID,
        itemName: item.itemName,
        kg,
        nos,
        price,
        lineNumber: (index + 1).toString().padStart(3, '0'),
        sellByWeight: item.sellByWeight,
        altQtyEnabled: item.altQtyEnabled,
        fromLocation: fromLocation,
        userId,
        username,
        userRole,
        fromLocation,
      };
    });

    navigation.navigate("Indent Cart", {
      itemDetails: encodeURIComponent(JSON.stringify(itemDetails)),
      totalQuantity,
      totalPrice,
      customerName,
      userId,
      customerId,
      username,
      userRole,
      onOrderPlaced,
      branchId: fromLocation,
    });
    console.log("--------",userId);
    
    
  };

  const handleCustomerPageNavigation = async () => {
    await AsyncStorage.clear();
    navigation.navigate("General Trading", { username, userId, userRole });
  };

  const handleFirstPickerChange = (itemValue) => {
    setFromLocation(itemValue);
  };

  const handleRefresh = useCallback(async () => {
    if (fromLocation) {
      setRefreshing(true);
      await fetchItemsByLocation(fromLocation);
    }
  }, [fromLocation]);

  const getTextInputStyles = (item) => {
    const isKgEnabled = item.altQtyEnabled || (item.sellByWeight && !item.altQtyEnabled);
    const isNosEnabled = item.altQtyEnabled || (!item.sellByWeight && !item.altQtyEnabled);

    return {
      kgStyle: {
        borderColor: isKgEnabled ? '#4CAF50' : '#ccc',
        backgroundColor: !isKgEnabled ? '#e0e0e0' : '#fff',
      },
      nosStyle: {
        borderColor: isNosEnabled ? '#4CAF50' : '#ccc',
        backgroundColor: !isNosEnabled ? '#e0e0e0' : '#fff',
      },
    };
  };

  const sortedCategoryItems = [...categoryItems]
    .filter(item => item.itemName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.itemName.localeCompare(b.itemName));

  return (
    <Animatable.View style={styles.container} animation="fadeIn" duration={500}>
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      <Animatable.View style={styles.header} animation="slideInDown" duration={500}>
        <Text style={styles.branchName}>{branchName || 'Poonam Bazar'}</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by item name"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {/* <TouchableOpacity onPress={handleCustomerPageNavigation}>
          <FontAwesome name="home" style={styles.icon} />
        </TouchableOpacity> */}
      </Animatable.View>
      <Animatable.View style={styles.pickerWrapper} animation="fadeIn" duration={500}>
        <View style={{ flex: 1 }}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Select Type:</Text>
            <CustomPicker
              selectedValue="IBST"
              onValueChange={() => {}}
              options={[{ id: 'IBST', name: 'IBST' }]}
            />
          </View>
        </View>
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>From Location:</Text>
          <CustomPicker
            selectedValue={fromLocation}
            onValueChange={handleFirstPickerChange}
            options={[{ id: '', name: 'Select Location' }, ...locationOptions]}
          />
        </View>
      </Animatable.View>
      {categoryItems.length > 0 && (
        <>
          <Animatable.View style={styles.itemRows} animation="fadeIn" duration={500}>
            <Text style={styles.itemColumn}>Item Name</Text>
            <Text style={styles.itemColumn}>Nos</Text>
            <Text style={styles.itemColumn}>Weight</Text>
          </Animatable.View>

          <FlatList
            data={sortedCategoryItems}
            keyExtractor={(item) => item.itemID.toString()}
            renderItem={({ item }) => {
              const { kg, nos, sellByWeight, altQtyEnabled } = quantities[item.itemID] || {};
              const { kgStyle, nosStyle } = getTextInputStyles(item);

              return (
                <Animatable.View animation="fadeIn" duration={500} style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.itemName}</Text>
                  <View style={styles.quantityContainer}>
                    <TextInput
                      style={[styles.quantityInput, nosStyle]}
                      keyboardType="numeric"
                      value={nos}
                      onChangeText={(text) => handleQuantityChange(item.itemID, 'nos', text.replace(/\D/g, ''))}
                      editable={altQtyEnabled || (!sellByWeight && !altQtyEnabled)}
                    />
                  </View>
                  <View style={styles.quantityContainer}>
                    <TextInput
                      style={[styles.quantityInput, kgStyle]}
                      keyboardType="numeric"
                      value={kg}
                      onChangeText={(text) => {
                        const formattedText = text.replace(/[^0-9.]/g, '');
                        const parts = formattedText.split('.');
                        if (parts.length > 2) {
                          text = parts[0] + '.' + parts[1];
                        }
                        handleQuantityChange(item.itemID, 'kg', text.replace(/\D/g, ''));
                      }}
                      editable={altQtyEnabled || (sellByWeight && !altQtyEnabled)}
                    />
                    <Text> kg</Text>
                  </View>
                </Animatable.View>
              );
            }}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        </>
      )}
      <Animatable.View style={styles.buttonContainer} animation="fadeInUp" duration={500}>
        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </Animatable.View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  branchName: {
    flex: 2,
    fontSize: 20,
    fontWeight: "bold",
  },
  searchInput: {
    flex: 2,
    padding: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    minWidth: 100,
    maxWidth: 150,
  },
  icon: {
    flex: 1,
    fontSize: 24,
    color: "black",
  },
  customPickerContainer: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  customPicker: {
    height: 50,
    width: '100%',
    paddingHorizontal: 10,
    color: '#333',
  },
  pickerContainer: {
    marginVertical: 4,
    marginHorizontal:4,
    flex: 1,
  },
  pickerLabel: {
    fontSize: 18,
    marginBottom: 2,
  },
  pickerWrapper: {
    flexDirection: 'row',
  },
  itemRows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#4CAF50',
  },
  itemColumn: {
    flex:1,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
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
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemName: {
    flex: 2,
    fontSize: 16,
    textAlign: 'left',
  },
  quantityContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityInput: {
    padding: 3,
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
    maxWidth: 50,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
