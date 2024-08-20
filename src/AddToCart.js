import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { local_URL } from './Constants';

export const AddToCart = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { onOrderPlaced } = route.params;
  const queryParams = route.params ? new URLSearchParams(route.params) : null;
  const itemDetails = queryParams ? JSON.parse(decodeURIComponent(queryParams.get('itemDetails'))) : [];
  const totalQuantity = queryParams ? queryParams.get('totalQuantity') : 0;
  const rate = queryParams ? queryParams.get('rate') : 0;
  const totalPrice = queryParams ? queryParams.get('totalPrice') : 0;
  const customerName = queryParams ? queryParams.get('customerName') : '';
  const branchId = queryParams ? queryParams.get('branchId') : '';
  const userName = queryParams ? queryParams.get('userName') : '';
  const customerId = queryParams ? queryParams.get('customerId') : '';
  const { username, userId, userRole } = route.params || {};
  const totalProduct = queryParams ? queryParams.get('totalProduct') : 0;

  const handleEdit = () => {
    navigation.navigate('Order', {
      onOrderPlaced: onOrderPlaced,
      userId: userId
    });
  };

  const handleOrderNow = async () => {
    const currentDate = new Date();
    const deliveryScheduleDate = new Date(currentDate.setDate(currentDate.getDate() + 2)).toISOString();

    const dataToSend = {
      custID: customerId,
      channelID: "string", 
      orderTakenByEmpId: userId,
      transTypeId: "string",
      deliveryScheduleDate: deliveryScheduleDate,
      remarks: "string", 
      createdUserID: userId, 
      gtOrderDetails: itemDetails.map((item, index) => ({
        lineNumber: (index + 1).toString().padStart(3, '0'),
        itemId: item.itemId,
        qty: item.quantity,
        rate: item.rate,
      }))
    };

    try {
      const response = await axios.post(`${local_URL}/api/SaleOrder/`, dataToSend);
      console.log('Order placed successfully:', response.data);
      onOrderPlaced();
      Toast.show({
        type: 'success',
        text1: 'Order placed successfully',
        position: 'top',
        autoHide: true,
        visibilityTime: 900,
        onHide: () => {
          navigation.navigate('General Trading', {
            username: username,
            userId: userId,
            userRole: userRole
          });
        }
      });
    } catch (error) {
      console.error('Error placing order:', error);
      Toast.show({
        type: 'error',
        text1: 'Error placing order',
        position: 'top',
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{customerName}</Text>
      <View style={styles.card}>
        <Text style={styles.subHeader}>Item Details</Text>
        {itemDetails.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemText}>Item Name: {item.itemName}</Text>
            <View style={{flex:1 , flexDirection:'row' , justifyContent:'flex-start' ,}}>
            <Text style={styles.itemText1}>Quantity: {item.quantity}</Text>
            <Text style={styles.itemText1}>Price: {item.rate}</Text>
            
            </View>
            
            <Text style={styles.itemText}>Amount: {item.price.toFixed(2)}</Text>
          </View>
        ))}
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>Total Items: {itemDetails.length}</Text>
        <Text style={styles.summaryText}>Total Quantity: {totalQuantity}</Text>
        <Text style={styles.summaryText}>Total Amount: {totalPrice}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Edit" onPress={handleEdit} color="#007BFF" />
        <Button title="Order Now" onPress={handleOrderNow} color="#28A745" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  itemText1: {
    fontSize: 16,
    marginRight:40,
    color: '#333',
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});





















// export const OrderReturn = () => {
//   //   const navigation = useNavigation();
//   //   const route = useRoute();
//   //   const cameraRef = useRef(null);
//   //   const [items, setItems] = useState([]);
//   //   const [quantities, setQuantities] = useState({});
//   //   const [branchName, setBranchName] = useState("");
//   //   const [searchTerm, setSearchTerm] = useState("");
//   //   const [userId, setUserId] = useState("");
//   //   const [loading, setLoading] = useState(false);
//   //   const [customerName, setCustomerName] = useState("");
//   //   const [hasPermission, setHasPermission] = useState(null);
//   //   const [showCamera, setShowCamera] = useState(false);
//   //   const [scanned, setScanned] = useState(false);
  
    
//   //   const { customerId, username, userRole , onOrderPlaced} = route.params || {};
  
   
//   //   useEffect(() => {
//   //     const { branchName: branchNameParam, userId: userIdParam, customerName: customerNameParam } = route.params || {};
  
//   //     const fetchStoredData = async () => {
//   //       if (userIdParam) {
//   //         setUserId(userIdParam.toString());
//   //         await AsyncStorage.setItem("userId", userIdParam.toString());
//   //       } else {
//   //         const storedUserId = await AsyncStorage.getItem("userId");
//   //         if (storedUserId) {
//   //           setUserId(storedUserId);
//   //         }
//   //       }
  
//   //       if (branchNameParam) {
//   //         setBranchName(branchNameParam);
//   //         await AsyncStorage.setItem("branchName", branchNameParam);
//   //       } 
//   //       if (customerNameParam) {
//   //         setCustomerName(customerNameParam);
//   //       } else {
//   //         const storedBranchName = await AsyncStorage.getItem("branchName");
//   //         if (storedBranchName) {
//   //           setBranchName(storedBranchName);
//   //         }
//   //       }
//   //     };
  
//   //     fetchStoredData();
//   //   }, [route.params]);
  
//   //   useEffect(() => {
//   //     setLoading(true);
  
//   //     axios
//   //       .get(`${local_URL}/api/GTSale/${customerId}`)
//   //       .then((response) => {
//   //         const slicedData = response.data.slice(0, 20);
//   //         setItems(slicedData);
//   //         const initialQuantities = {};
//   //         slicedData.forEach(async (item) => {
//   //           const storedQuantity = await AsyncStorage.getItem(item.batchNumber);
//   //           initialQuantities[item.batchNumber] ="";
//   //         });
//   //         setLoading(false);
//   //         setQuantities(initialQuantities);
//   //       })
//   //       .catch((error) => {
//   //         setLoading(false);
//   //         console.error("Error fetching item details:", error);
//   //       });
//   //   }, [customerId]);
  
//   //   useEffect(() => {
//   //     (async () => {
//   //       const { status } = await Camera.requestCameraPermissionsAsync();
//   //       setHasPermission(status === 'granted');
//   //     })();
//   //   }, []);
  
    
//   //   useFocusEffect(
//   //     useCallback(() => {
//   //       return () => {
//   //         items.forEach(async (item) => {
//   //           await AsyncStorage.removeItem(item.batchNumber);
//   //         });
//   //         setQuantities({});
//   //       };
//   //     }, [items])
//   //   );
  
    
//   //   const handleQuantityChange = useCallback(async (batchNumber, quantity) => {
//   //     const newQuantities = {
//   //       ...quantities,
//   //       [batchNumber]: quantity,
//   //     };
//   //     setQuantities(newQuantities);
//   //     await AsyncStorage.setItem(batchNumber, quantity);
//   //   }, [quantities]);
  
//   //   const incrementQuantity = useCallback((batchNumber) => {
//   //     const currentQuantity = parseInt(quantities[batchNumber]) || 0;
//   //     const stockQty = items.find(item => item.batchNumber === batchNumber)?.stockQty || 0;
//   //     if (currentQuantity < stockQty) {
//   //       handleQuantityChange(batchNumber, (currentQuantity + 1).toString());
//   //     }
//   //   }, [quantities, items, handleQuantityChange]);
  
//   //   const decrementQuantity = useCallback((batchNumber) => {
//   //     const currentQuantity = parseInt(quantities[batchNumber]) || 0;
//   //     if (currentQuantity > 0) {
//   //       handleQuantityChange(batchNumber, (currentQuantity - 1).toString());
//   //     }
//   //   }, [quantities, handleQuantityChange]);
  
//   //   const toggleCamera = useCallback(() => {
//   //     setShowCamera(!showCamera);
//   //     setScanned(false);
//   //   }, [showCamera]);
  
//   //   const handleQRCodeScanned = useCallback(({ type, data }) => {
//   //     setScanned(true);
//   //     const scannedBatchNumber = data.trim(); 
//   //     const item = items.find(item => item.batchNumber === scannedBatchNumber);
      
//   //     if (item) {
        
//   //       const currentQuantity = parseInt(quantities[scannedBatchNumber]) || 0;
//   //       if (currentQuantity < item.stockQty) {
//   //         handleQuantityChange(scannedBatchNumber, (currentQuantity + 1).toString());
//   //         Alert.alert('Success', `Added 1 to item: ${item.itemName}`);
//   //       } else {
//   //         Alert.alert('Warning', `Cannot add more. Max quantity (${item.stockQty}) reached for ${item.itemName}`);
//   //       }
//   //     } else {
//   //       Alert.alert('Error', `Batch number ${scannedBatchNumber} not found in the current list`);
//   //     }
//   //     setShowCamera(false);
//   //   }, [items, quantities, handleQuantityChange]);
  
//   //   const handleReturnOrder = useCallback(() => {
//   //     const itemsWithQuantity = items.filter((item) => parseInt(quantities[item.batchNumber]) > 0);
//   //     if (itemsWithQuantity.length === 0) {
//   //       if (ToastAndroid) {
//   //         ToastAndroid.show("Please add items to the cart first", ToastAndroid.SHORT);
//   //       } else {
//   //         console.warn("ToastAndroid is not available");
//   //       }
//   //       return;
//   //     }
//   //     const { totalQuantity, totalPrice } = calculateTotal();
  
//   //     const itemDetails = JSON.stringify(
//   //       itemsWithQuantity.map((item, index) => {
//   //         const quantity = parseInt(quantities[item.batchNumber]) || 0;
//   //         const price = item.rate * quantity;
          
//   //         return {
//   //           itemId: item.itemId,
//   //           batchNumber: item.batchNumber,
//   //           itemName: item.itemName,
//   //           branchName: item.branchName,
//   //           quantity,
//   //           price,
//   //           lineNumber: (index + 1).toString().padStart(3, '0'),
//   //           branchId: item.branchId,
//   //           saleId: item.saleId,
//   //         };
//   //       })
//   //     );
  
//   //     navigation.navigate("ReturnCart", {
//   //       itemDetails,
//   //       totalQuantity,
//   //       totalPrice,
//   //       onOrderPlaced:onOrderPlaced,
//   //       customerName,
//   //       branchName,
//   //       userId,
//   //       userRole,
//   //       customerId,
//   //       username
//   //     });
//   //   }, [items, quantities, navigation, customerName, branchName, userId, userRole, customerId, username]);
  
//   //   // Utility functions
//   //   const formatDate = (dateString) => {
//   //     const date = new Date(dateString);
//   //     const day = date.getDate();
//   //     const month = date.toLocaleString('default', { month: 'long' });
//   //     return `${day} ${month}`;
//   //   };
  
//   //   const calculateTotal = useCallback(() => {
//   //     let totalQuantity = 0;
//   //     let totalPrice = 0;
//   //     items.forEach((item) => {
//   //       const quantity = parseInt(quantities[item.batchNumber]) || 0;
//   //       const amount = quantity * item.rate;
//   //       totalQuantity += quantity;
//   //       totalPrice += amount;
//   //     });
//   //     return { totalQuantity, totalPrice };
//   //   }, [items, quantities]);
  
//   //   // Filtered items
//   //   const filteredItems = items.filter((item) =>
//   //     item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
//   //   );
  
    
//   //   return (
//   //     <View style={styles.container}>
//   //       {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
//   //       {showCamera ? (
//   //   <View style={styles.cameraContainer}>
//   //     <Camera
//   //       ref={cameraRef}
//   //       style={styles.camera}
//   //       type={CameraType.back}
//   //       barCodeScannerSettings={{
//   //         barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
//   //       }}
//   //       onBarCodeScanned={scanned ? undefined : handleQRCodeScanned}
//   //     >
//   //       <View style={styles.overlay}>
//   //         <View style={styles.unfocusedContainer}></View>
//   //         <View style={styles.focusedContainer}>
//   //           <View style={styles.focusedBorder} />
//   //         </View>
//   //         <View style={styles.unfocusedContainer}></View>
//   //       </View>
//   //     </Camera>
//   //     <View style={styles.controls}>
//   //       <TouchableOpacity style={styles.controlButton} onPress={toggleCamera}>
//   //         <Text style={styles.controlText}>Close QR Scanner</Text>
//   //       </TouchableOpacity>
//   //       {scanned && (
//   //         <TouchableOpacity style={styles.controlButton} onPress={() => setScanned(false)}>
//   //           <Text style={styles.controlText}>Scan Again</Text>
//   //         </TouchableOpacity>
//   //       )}
//   //     </View>
//   //   </View>
//   // ) : (
//   //         <>
//   //           <View style={styles.header}>
//   //             <Text style={styles.branchName}>{customerName}</Text>
//   //             <TextInput
//   //               style={styles.searchInput}
//   //               placeholder="Search by item name"
//   //               value={searchTerm}
//   //               onChangeText={setSearchTerm}
//   //             />
//   //             <TouchableOpacity style={styles.button} onPress={toggleCamera}>
//   //             <FontAwesome name='qrcode' size={40} style={{color:'white' , justifyContent:'center' , alignItems:'center' , textAlign:'center'}} />
//   //             </TouchableOpacity>
//   //           </View>
//   //           <View style={{flex:1}}>
//   //             <View style={styles.itemRows}>
//   //               <Text style={styles.rtext}>Item Name</Text>
//   //               <Text style={styles.rtext}>Batch Number</Text>
//   //               <Text style={styles.rtext}>Sale Date</Text>
//   //               <Text style={styles.rtext}>Stock Quantity</Text>
//   //               <Text style={styles.rtext}>Return Quantity</Text>
//   //             </View>
//   //             <FlatList
//   //               data={filteredItems}
//   //               keyExtractor={(item) => item.batchNumber.toString()}
//   //               renderItem={({ item }) => (
//   //                 <View style={styles.itemRowContainer}>
//   //                   <Text style={styles.itemName}>{item.itemName}</Text>
//   //                   <View style={styles.detailsRow}>
//   //                     <Text style={styles.batchNumber}>{item.batchNumber}</Text>
//   //                     <Text style={styles.saleDate}>{formatDate(item.saleDate)}</Text>
//   //                     <Text style={styles.batchNumber}>₹{item.rate}</Text>
//   //                     <Text style={styles.itemMRP}>{item.stockQty}</Text>
//   //                     <View style={styles.quantityContainer}>
//   //                       <TouchableOpacity onPress={() => decrementQuantity(item.batchNumber)} style={styles.quantityButton}>
//   //                         <FontAwesome name='minus' style={styles.quantityIcon} />
//   //                       </TouchableOpacity>
//   //                       <TextInput
//   //                         style={styles.quantityInput}
//   //                         keyboardType="numeric"
//   //                         value={quantities[item.batchNumber] || ""}
//   //                         onChangeText={(text) => {
//   //                           if (!isNaN(text) && parseInt(text) <= item.stockQty) {
//   //                             handleQuantityChange(item.batchNumber, text.replace(/\D/g, ''));
//   //                           } else if (text === "") {
//   //                             handleQuantityChange(item.batchNumber, "");
//   //                           }
//   //                         }}
//   //                       />
//   //                       <TouchableOpacity onPress={() => incrementQuantity(item.batchNumber)} style={styles.quantityButton}>
//   //                         <FontAwesome name='plus' style={styles.quantityIcon} />
//   //                       </TouchableOpacity>
//   //                     </View>
//   //                   </View>
//   //                 </View>
//   //               )}
//   //               ListFooterComponent={
//   //                 <View style={styles.footer}>
//   //                   <Text style={styles.totalText}>Total</Text>
//   //                   <Text style={styles.totalQuantity}>{calculateTotal().totalQuantity}</Text>
//   //                   <Text style={styles.totalPrice}>{calculateTotal().totalPrice}</Text>
//   //                 </View>
//   //               }
//   //             />
//   //           </View>
//   //           <View style={styles.buttonContainer}>
//   //             <Button title="Return Order" onPress={handleReturnOrder} color="#4CAF50" />
//   //           </View>
//   //         </>
//   //       )}
//   //     </View>
//   //   );
//   // };
  
//   // useEffect(() => {
//   //   const { items: passedItems, quantities: passedQuantities } = route.params || {};
    
//   //   if (passedItems && passedQuantities) {
//   //     setItems(passedItems);
//   //     setQuantities(passedQuantities);
//   //     setLoading(false);
//   //   } else {
//   //     setLoading(true);
//   //     axios
//   //       .get(`${local_URL}/api/GTSale/${customerId}`)
//   //       .then((response) => {
//   //         const slicedData = response.data.slice(0, 20);
//   //         setItems(slicedData);
//   //         const initialQuantities = {};
//   //         slicedData.forEach((item) => {
//   //           initialQuantities[item.batchNumber] = "";
//   //         });
//   //         setQuantities(initialQuantities);
//   //         setLoading(false);
//   //       })
//   //       .catch((error) => {
//   //         setLoading(false);
//   //         console.error("Error fetching item details:", error);
//   //       });
//   //   }
//   // }, [customerId, route.params]);



























// import React from 'react';
// import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import axios from 'axios';
// import Toast from 'react-native-toast-message';

// export const AddToCart = () => {
//   const navigation = useNavigation();
//   const route = useRoute();

//   const queryParams = route.params ? new URLSearchParams(route.params) : null;
//   const itemDetails = queryParams ? JSON.parse(decodeURIComponent(queryParams.get('itemDetails'))) : [];
//   const totalQuantity = queryParams ? queryParams.get('totalQuantity') : 0;
//   const totalPrice = queryParams ? queryParams.get('totalPrice') : 0;
//   const customerName = queryParams ? queryParams.get('customerName') : '';
//   const branchId = queryParams ? queryParams.get('branchId') : '';
//   const userId = queryParams ? queryParams.get('userId') : '';
//   const userName = queryParams ? queryParams.get('userName') : '';

//   const handleEdit = () => {
//     navigation.navigate('Itemlist');
//   };

//   const handleOrderNow = async () => {
//     const dataToSend = {
//       saleOrderId: "", 
//       saleOrderDate: new Date().toISOString(),
//       branchId: branchId,
//       custID: userId,
//       channelID: "string", 
//       channelRefId: "string", 
//       orderTakenByBranchId: "B101",
//       orderTakenByEmpId: "string", 
//       discountCode: "string", 
//       totalDiscountAmount: 0,
//       productTotal: 0,
//       totalAmount: 0,
//       remarks: "string", 
//       isO_Number: "", 
//       deleted: "N",
//       posted: true,
//       createdUserID: "string", 
//       createdDate: new Date().toISOString(),
//       modifiedUserID: "",
//       modifiedDate: new Date().toISOString(),
//       deletedUserID: "",
//       deletedDate: new Date().toISOString(),
//       postedUserID: "",
//       postedDate: new Date().toISOString(),
//       saleOrderDetails: itemDetails.map((item, index) => ({
//         lineNumber: (index + 1).toString().padStart(3, '0'),
//         itemId: item.itemId,
//         taxCatagoryId: "0000000000", 
//         taxStructureCode: "", 
//         isSet: false,
//         setItemId: "",
//         isSetFreeItem: false,
//         isOfferItem: false,
//         qty: item.quantity,
//         dayRate: item.dayRate || 0, 
//         rate: item.price,
//         unitMRP: item.unitMRP || 0, 
//         productAmount: item.productAmount || 0, 
//         taxPercent: item.taxPercent || 0, 
//         discountPercent: item.discountPercent || 0, 
//         discountAmount: item.discountAmount || 0, 
//         lineDiscountCode: "", 
//         lineDiscountRate: 0,
//         lineDiscountAmount: 0,
//         taxableSubtotal: item.taxableSubtotal || 0, 
//         taxAmount: item.taxAmount || 0,   
//         totalAmount: 0,
//         deleted: "N",
//         dml: "I"
//       }))
//     };

//     try {
//       const response = await axios.post('http://172.16.2.21:8081/api/SaleOrder/', dataToSend);
//       console.log('Order placed successfully:', response.data);
//       Toast.show({
//         type: 'success',
//         text1: 'Order placed successfully',
//         position: 'top',
//         autoHide:true,
//         visibilityTime: 900,
//         onHide:()=>{
//         navigation.navigate('Beat', {
//         username: response.data.username,
//         userId: response.data.userId
//       })}
//     });
//     } catch (error) {
//       console.error('Error placing order:', error);
//       Toast.show({
//         type: 'error',
//         text1: 'Error placing order',
//         position: 'top',
//       });
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.header}>{customerName}</Text>
//       <View style={styles.card}>
//         <Text style={styles.subHeader}>Item Details</Text>
//         {itemDetails.map((item, index) => ( 
//           <View key={index} style={styles.item}>
//             <Text style={styles.itemText}>Item Name: {item.itemName}</Text>
//             <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
//             <Text style={styles.itemText}>Price: {item.price.toFixed(2)}</Text>
//           </View>
//         ))}
//       </View>
//       <View style={styles.summaryCard}>
//         <Text style={styles.summaryText}>Total Items: {itemDetails.length}</Text>
//         <Text style={styles.summaryText}>Total Quantity: {totalQuantity}</Text>
//         <Text style={styles.summaryText}>Total Price: {totalPrice}</Text>
//       </View>
//       <View style={styles.buttonContainer}>
//         <Button title="Edit" onPress={handleEdit} color="#007BFF" />
//         <Button title="Order Now" onPress={handleOrderNow} color="#28A745" />
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   subHeader: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   item: {
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//     paddingVertical: 8,
//   },
//   itemText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   summaryCard: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   summaryText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
// });


// import React from 'react';
// import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import axios from 'axios';
// import Toast from 'react-native-toast-message';

// export const AddToCart = () => {
//   const navigation = useNavigation();
//   const route = useRoute();

//   const queryParams = route.params ? new URLSearchParams(route.params) : null;
//   const itemDetails = queryParams ? JSON.parse(decodeURIComponent(queryParams.get('itemDetails'))) : [];
//   const totalQuantity = queryParams ? queryParams.get('totalQuantity') : 0;
//   const totalPrice = queryParams ? queryParams.get('totalPrice') : 0;
//   const customerName = queryParams ? queryParams.get('customerName') : '';
//   const branchId = queryParams ? queryParams.get('branchId') : '';
//   const userId = queryParams ? queryParams.get('userId') : '';
//   const userName = queryParams ? queryParams.get('userName') : '';

//   const handleEdit = () => {
//     navigation.navigate('Itemlist');
//   };

//   const handleOrderNow = async () => {
//     const dataToSend = {
//       saleOrderId: "", // Fill in with appropriate value
//       saleOrderDate: new Date().toISOString(),
//       branchId: branchId,
//       custID: userId,
//       channelID: "string", // Fill in with appropriate value
//       channelRefId: "string", // Fill in with appropriate value
//       orderTakenByBranchId: "B101",
//       orderTakenByEmpId: "string", // Fill in with appropriate value
//       discountCode: "string", // Fill in with appropriate value
//       totalDiscountAmount: 0,
//       productTotal: 0,
//       totalAmount: 0,
//       remarks: "string", // Fill in with appropriate value
//       isO_Number: "", // Fill in with appropriate value
//       deleted: "N",
//       posted: true,
//       createdUserID: "string", // Fill in with appropriate value
//       createdDate: new Date().toISOString(),
//       modifiedUserID: "",
//       modifiedDate: new Date().toISOString(),
//       deletedUserID: "",
//       deletedDate: new Date().toISOString(),
//       postedUserID: "",
//       postedDate: new Date().toISOString(),
//       saleOrderDetails: itemDetails.map((item, index) => ({
//         lineNumber: (index + 1).toString().padStart(3, '0'),
//         itemId: item.itemId,
//         taxStructureId:"", //
//         taxStructureCode:'',//
//         isSet: false,
//         setItemId: "",
//         isSetFreeItem: false,
//         isOfferItem: false,
//         qty: item.quantity,
//         dayRate:'',
//         rate:'',
//         unitMRP:'',
//         productAmount:'',
//         taxPercentage:'',
//         discountPercentage:'',
//         lineDiscountCode: "", // Fill in with appropriate value
//         lineDiscountRate: 0,
//         lineDiscountAmount: 0,
//         taxableSubtotal:'',
//         taxAmount:'',
//         totalAmount: 0,
//         deleted: "N",
//         dml: "I"
//       }))
//     };

//     try {
//       const response = await axios.post('http://172.16.2.21:8081/api/SaleOrder/', dataToSend);
//       console.log('Order placed successfully:', response.data);
//       navigation.navigate('Beat', {
//         username: response.data.username,
//         userId: response.data.userId
//       });
      
//     } catch (error) {
//       console.error('Error placing order:', error);
//       Toast.show({
//         type: 'error',
//         text1: 'Error placing order',
//         position: 'top',
//       });
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.header}>{customerName}</Text>
//       <View style={styles.card}>
//         <Text style={styles.subHeader}>Item Details</Text>
//         {itemDetails.map((item, index) => ( 
//           <View key={index} style={styles.item}>
//             <Text style={styles.itemText}>Item Name: {item.itemName}</Text>
//             <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
//             <Text style={styles.itemText}>Price: {item.price.toFixed(2)}</Text>
//           </View>
//         ))}
//       </View>
//       <View style={styles.summaryCard}>
//         <Text style={styles.summaryText}>Total Items: {itemDetails.length}</Text>
//         <Text style={styles.summaryText}>Total Quantity: {totalQuantity}</Text>
//         <Text style={styles.summaryText}>Total Price: {totalPrice}</Text>
//       </View>
//       <View style={styles.buttonContainer}>
//         <Button title="Edit" onPress={handleEdit} color="#007BFF" />
//         <Button title="Order Now" onPress={handleOrderNow} color="#28A745" />
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   subHeader: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   item: {
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//     paddingVertical: 8,
//   },
//   itemText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   summaryCard: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   summaryText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
// });



