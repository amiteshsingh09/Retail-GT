import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, ToastAndroid, ActivityIndicator } from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { local_URL } from "./Constants";
import * as Animatable from 'react-native-animatable'; // Ensure correct import for Animatable
import { FontAwesome } from '@expo/vector-icons'; // Ensure correct import for FontAwesome
import AsyncStorage from "@react-native-async-storage/async-storage";


export const Itemlist = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [branchName, setBranchName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const [customerId, setCustomerId] = useState(route.params?.customerId || ''); // Initialize customerId with route param
  const { username, userRole, onOrderPlaced } = route.params || {};

  useEffect(() => {
    const { branchName: branchNameParam, userId: userIdParam, customerName: customerNameParam, customerId: customerIdParam } = route.params || {};
    // console.log("Route params:", route.params);

    const fetchStoredData = async () => {
      if (userIdParam) {
        setUserId(userIdParam.toString());
        await AsyncStorage.setItem("userId", userIdParam.toString());
        // console.log("Set userId:", userIdParam);
      } else {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
          // console.log("Fetched stored userId:", storedUserId);
        }
      }

      if (branchNameParam) {
        setBranchName(branchNameParam);
        await AsyncStorage.setItem("branchName", branchNameParam);
        // console.log("Set branchName:", branchNameParam);
      }
      if (customerNameParam) {
        setCustomerName(customerNameParam); 
        // console.log("Set customerName:", customerNameParam);
      }
      if (customerIdParam) {
        setCustomerId(customerIdParam);
        // console.log("Set customerId:", customerIdParam);
      } else {
        const storedBranchName = await AsyncStorage.getItem("branchName");
        if (storedBranchName) {
          setBranchName(storedBranchName);
          // console.log("Fetched stored branchName:", storedBranchName);
        }
      }
    };
    fetchStoredData();
  }, [route.params]);

  const saveDataWithTimestamp = async (key, data) => {
    const timestamp = new Date().toISOString();
    const dataWithTimestamp = JSON.stringify({ data, timestamp });
    await AsyncStorage.setItem(key, dataWithTimestamp);
  };



  const getDataWithTimestamp = async (key) => {
    const storedData = await AsyncStorage.getItem(key);
    if (storedData) {
      const { data, timestamp } = JSON.parse(storedData);
      const storedTime = new Date(timestamp);
      const currentTime = new Date();
      const timeDiff = currentTime - storedTime;
      const tenHoursInMilliseconds = 10 * 60 * 60 * 1000; // 10 hours in milliseconds
  
      if (timeDiff > tenHoursInMilliseconds) {
        // Data is older than 10 hours
        return null;
      }
  
      return data;
    }
    return null;
  };
  

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${local_URL}/api/GTItem/ALL/ALL/${customerId}/ALL`)
      .then((response) => {
        setItems(response.data);
        // console.log("Fetched items:", response.data);
        const initialQuantities = {};
        response.data.forEach(async (item) => {
          const storedQuantity = await AsyncStorage.getItem(item.itemID);
          initialQuantities[item.itemID] = "";
        });
        // console.log("Initial quantities:", initialQuantities);
      setLoading(false);
    })
      .catch((error) => {
        console.error("Error fetching item details:", error);
        setLoading(false);
      });
  }, [customerId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
  
      // Try to get cached data
      const cachedItems = await getDataWithTimestamp('items');
      if (cachedItems) {
        setItems(cachedItems);
        setLoading(false);
      } else {
        // Fetch new data from API
        axios
          .get(`${local_URL}/api/GTItem/ALL/ALL/${customerId}/ALL`)
          .then((response) => {
            setItems(response.data);
            saveDataWithTimestamp('items', response.data); // Save data with timestamp
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching item details:", error);
            setLoading(false);
          });
      }
    };
  
    fetchData();
  }, [customerId]);

  
  const handleQuantityChange = async (itemId, quantity) => {
    const newQuantities = {
      ...quantities,
      [itemId]: quantity,
    };
    setQuantities(newQuantities);
    await AsyncStorage.setItem(itemId, quantity);
    // console.log(`Quantity changed for item ${itemId}: ${quantity}`);
  };

  const incrementQuantity = (itemId) => {
    const currentQuantity = parseInt(quantities[itemId]) || 0;
    handleQuantityChange(itemId, (currentQuantity + 1).toString());
    // console.log(`Incremented quantity for item ${itemId}`);
  };

  const decrementQuantity = (itemId) => {
    const currentQuantity = parseInt(quantities[itemId]) || 0;
    if (currentQuantity > 0) {
      handleQuantityChange(itemId, (currentQuantity - 1).toString());
      // console.log(`Decremented quantity for item ${itemId}`);
    }
  };

  const calculateTotal = () => {
    let totalQuantity = 0;
    let totalPrice = 0;
    items.forEach((item) => {
      const quantity = parseInt(quantities[item.itemID]) || 0;
      const amount = quantity * item.rate;
      totalQuantity += quantity;
      totalPrice += amount;
    });
    return { totalQuantity, totalPrice };
  };

  const handleAddToCart = () => {
    const itemsWithQuantity = items.filter((item) => parseInt(quantities[item.itemID]) > 0);
  
    if (itemsWithQuantity.length === 0) {
     
      if (ToastAndroid) {
        ToastAndroid.show("Please add items to the cart first", ToastAndroid.SHORT);
      } else {
        console.warn("ToastAndroid is not available");
      }
      return;
    }
  
    const { totalQuantity, totalPrice } = calculateTotal(itemsWithQuantity);
  
    const itemDetails = itemsWithQuantity.map((item) => {
      const quantity = parseInt(quantities[item.itemID]) || 0;
      const price = item.rate * quantity;
      return {
        itemId: item.itemID,
        itemName: item.itemName,
        quantity,
        price,
        rate:item.rate,
        userId,
        username,
        userRole,
      };
    });
  
    navigation.navigate("Cart", {
      itemDetails: encodeURIComponent(JSON.stringify(itemDetails)),
      totalQuantity,
      totalPrice,
      customerName,
      userId,
      customerId,
      username,
      userRole,
      onOrderPlaced,
    });
  };
  

  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => a.itemName.localeCompare(b.itemName));


  const handleCustomerPageNavigation = async () => {
    await AsyncStorage.clear();
    navigation.navigate("General Trading", { username, userId, userRole });
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      <View style={styles.header}>
        <Animatable.Text animation="fadeIn" style={styles.branchName}>{customerName}</Animatable.Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by item name"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity onPress={handleCustomerPageNavigation}>
          <FontAwesome name="home" style={styles.icon} />
        </TouchableOpacity>
      </View>

      <Animatable.View animation="fadeInDown" style={styles.itemRows}>
        <Text style={{ marginLeft: 6, color: 'white' }}>Item Name</Text>
        <Text style={{ marginLeft: 16, color: 'white' }}>Rate</Text>
        <Text style={{ marginLeft: 20, color: 'white' }}>Quantity</Text>
        <Text style={{ marginRight: 6, color: 'white' }}>Amount</Text>
      </Animatable.View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.itemID.toString()}
        renderItem={({ item }) => {
          const historyValuesArray = item.historyValues.split(',').map(v => parseFloat(v).toFixed(2));
          const displayValues = historyValuesArray.slice(-4);

          return (
            <Animatable.View animation="fadeInUp" duration={500} style={styles.itemContainer}>
              <View style={styles.itemRow}>
                <Text style={styles.itemName}>{item.itemName}</Text>
                <Text style={styles.itemMRP}>₹{item.rate.toFixed(2)}</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => decrementQuantity(item.itemID)} style={styles.quantityButton}>
                    <FontAwesome name='minus' style={styles.quantityIcon} />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.quantityInput}
                    keyboardType="numeric"
                    value={quantities[item.itemID] || ""}
                    onChangeText={(text) => handleQuantityChange(item.itemID, text.replace(/\D/g, ''))}
                  />
                  <TouchableOpacity onPress={() => incrementQuantity(item.itemID)} style={styles.quantityButton}>
                    <FontAwesome name='plus' style={styles.quantityIcon} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemAmount}>
                  {isNaN(parseInt(quantities[item.itemID])) || isNaN(item.rate)
                    ? "--"
                    : ((parseInt(quantities[item.itemID]) || 0) * item.rate).toFixed(2)}
                </Text>
              </View>
              {displayValues.length > 0 && (
                <Text style={styles.itemHistory}>
                  Last {displayValues.length} Order{displayValues.length > 1 ? 's ' : ''}: {
                    displayValues.map(value => {
                      const num = Number(value);
                      return Number.isInteger(num) ? num.toString() : num.toFixed(2);
                    }).join(', ')
                  }
                </Text>
              )}
            </Animatable.View>
          );
        }}
        ListFooterComponent={
          <Animatable.View animation="fadeInUp" duration={500} style={styles.footer}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalQuantity}>{calculateTotal().totalQuantity}</Text>
            <Text style={styles.totalPrice}>{calculateTotal().totalPrice}</Text>
          </Animatable.View>
        }
      />

      <View style={styles.buttonContainer}>
        <Button title="Add to Cart" onPress={handleAddToCart} color="#4CAF50" />
      </View>
    </View>
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
    flex:2,
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
    minWidth:100,
    maxWidth:150,
    
    },
  icon: {
    flex:1,
    fontSize: 24,
    color: "black",
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
    fontSize: 13,
    textAlign: 'center'
  },
  itemHistory: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    marginBottom: 5,
    fontStyle: 'italic',
  },
  itemName: {
    flex: 2,
    fontSize: 16,
    textAlign: 'left',
    marginRight:5
  },
  itemMRP: {
    flex: 1,
    fontSize: 14,
    textAlign: 'left',
    alignItems:'flex-start',
    marginLeft:3,
    padding:5,
  },
  quantityContainer: {
    flex: 2,
    flexDirection:'row',
    justifyContent:'center',
    alignItems: 'center',
    textAlign:'center',
    marginRight:5
  },


  quantityIcon: {
    fontSize: 16,
    color: "blue",
    margin:5
   
  },
  quantityInput: {
    padding: 3,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
    maxWidth:50,
    flex:1
  },
  itemAmount: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
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
});


























// import React, { useState, useEffect } from "react";
// import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from "react-native";
// import axios from "axios";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { local_URL } from "./Constants";
// import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// import { faHome, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { FontAwesome } from '@expo/vector-icons';


// export const Itemlist = () => {
  
//   const navigation = useNavigation();
//   const route = useRoute();
//   const [items, setItems] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [branchName, setBranchName] = useState("");
//   const [customerName, setCustomerName] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [userId, setUserId] = useState("");
//   const { customerId , setCustomerId } = route.params || {};
//   const { username , userRole } = route.params || {};
//   const { onOrderPlaced } = route.params;

//   useEffect(() => {
//     const { branchName: branchNameParam, userId: userIdParam , customerName: customerNameParam , customerId:customerIdParam} = route.params || {};
//     console.log("Route params:", route.params);
//   const { customerId, username, userRole } = route.params || {};
//   console.log("customerId:", customerId);
//   console.log("username:", username);
//   console.log("userRole:", userRole);
//     const fetchStoredData = async () => {
//       if (userIdParam) {
//         setUserId(userIdParam.toString());
//         await AsyncStorage.setItem("userId", userIdParam.toString());
//         console.log("Set userId:", userIdParam);
//       } else {
//         const storedUserId = await AsyncStorage.getItem("userId");
//         if (storedUserId) {
//           setUserId(storedUserId);
//           console.log("Fetched stored userId:", storedUserId);
//         }
//       }

//       if (branchNameParam) {
//         setBranchName(branchNameParam);
//         await AsyncStorage.setItem("branchName", branchNameParam);
//         console.log("Set branchName:", branchNameParam);
//       } if (customerNameParam) {
        
//         setCustomerName(customerNameParam); // Set customerName from route params
//         console.log("Set customerName:", customerNameParam);
//       }
//       if (customerIdParam) {
//         setCustomerId(customerIdParam); // Set customerName from route params
//         console.log("Set customerId:", customerIdParam);
//       }
//       else {
//         const storedBranchName = await AsyncStorage.getItem("branchName");
//         if (storedBranchName) {
//           setBranchName(storedBranchName);
//           console.log("Fetched stored branchName:", storedBranchName);
//         }
//       }
//     };

//     fetchStoredData();
//   }, [route.params]);

 

//   useEffect(() => {
//     axios
//       .get(`http://ibuat-lb-01-407954316.ap-south-2.elb.amazonaws.com/api/GTItem/ALL/ALL/${customerId}/ALL`)
//       .then((response) => {
//         setItems(response.data);
//         console.log("Fetched items:", response.data);
//         const initialQuantities = {};
//         response.data.forEach(async (item) => {
//           const storedQuantity = await AsyncStorage.getItem(item.itemID);
//           initialQuantities[item.itemID] = "";
//         });
//         console.log("Initial quantities:", initialQuantities);
//         console.log("-----",userRole);
        
       
//       })
//       .catch((error) => {
//         console.error("Error fetching item details:", error);
//       });
//   }, [customerId]);

  

//   const handleQuantityChange = async (itemId, quantity) => {
//     const newQuantities = {
//       ...quantities,
//       [itemId]: quantity,
//     };
//     setQuantities(newQuantities);
//     await AsyncStorage.setItem(itemId, quantity);
//     console.log(`Quantity changed for item ${itemId}: ${quantity}`);

//   };

//   const incrementQuantity = (itemId) => {
//     const currentQuantity = parseInt(quantities[itemId]) || 0;
//     handleQuantityChange(itemId, (currentQuantity + 1).toString());
//     console.log(`Incremented quantity for item ${itemId}`);
//   };

//   const decrementQuantity = (itemId) => {
//     const currentQuantity = parseInt(quantities[itemId]) || 0;
//     if (currentQuantity > 0) {
//       handleQuantityChange(itemId, (currentQuantity - 1).toString());
//       console.log(`Decremented quantity for item ${itemId}`);
 
//     }
//   };

//   const calculateTotal = () => {
//     let totalQuantity = 0;
//     let totalPrice = 0;
//     items.forEach((item) => {
//       const quantity = parseInt(quantities[item.itemID]) || 0;
//       const amount = quantity * item.rate;
//       totalQuantity += quantity;
//       totalPrice += amount;
//     });
//     return { totalQuantity, totalPrice };
//   };

//   const handleAddToCart = () => {
//     const itemsWithQuantity = items.filter((item) => parseInt(quantities[item.itemID]) > 0);
//     const { totalQuantity, totalPrice } = calculateTotal(itemsWithQuantity);
  
//     const itemDetails = encodeURIComponent(
//       JSON.stringify(
//         itemsWithQuantity.map((item) => {
//           const quantity = parseInt(quantities[item.itemID]) || 0;
//           const price = item.rate * quantity;
//           return {
//             itemId: item.itemID,
//             itemName: item.itemName,
//             quantity,
//             price,
//             userId,
//             username,
//             userRole,
//           };
//         })
//       )
//     );
  
//     const branchId = route.params?.branchId; // Ensure branchId is correctly obtained
//     console.log("branchId:", branchId);
//     console.log("Navigating to AddToCart screen with parameters:");
//     console.log("itemDetails:", itemDetails);
//     console.log("totalQuantity:", totalQuantity);
//     console.log("totalPrice:", totalPrice);
//     console.log("customerName:", customerName);
//     console.log("userId:", userId);
//     console.log("branchId:", branchId);
//     console.log("customerId:", customerId);
//     console.log("username:", username);
//     console.log("userRole:", userRole);
  
//     navigation.navigate("AddToCart", {
//       itemDetails,
//       totalQuantity,
//       totalPrice,
//       customerName,
//       userId,
//       branchId, 
//       customerId,
//       username,
//       userRole,
//       onOrderPlaced: onOrderPlaced,
//     });
//     console.log("userId", userId);
//     console.log("username", username);
//     console.log("userRole", userRole);
//   };

//   const filteredItems = items.filter((item) =>
//     item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleCustomerPageNavigation = async () => {
//     await AsyncStorage.clear();
//     const { username, userId } = route.params || {};
//     navigation.navigate("Beat", { username, userId , userRole });
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.branchName}>{customerName}</Text>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search by item name"
//           value={searchTerm}
//           onChangeText={setSearchTerm}
//         />
//         <TouchableOpacity onPress={handleCustomerPageNavigation}>
//           <FontAwesomeIcon icon={faHome} style={styles.icon} />
//         </TouchableOpacity>
//       </View>
      
//       <View style={styles.itemRows}>
//         <Text style={{marginLeft:6}}>Item Name</Text>
//         <Text>Rate</Text>
//         <Text style={{marginLeft:30 }}>Quantity</Text>
//         <Text style={{marginRight:6}}>Amount</Text>
//       </View>

//       <FlatList
//         data={filteredItems}
//         keyExtractor={(item) => item.itemID.toString()}
//         renderItem={({ item }) => {
          
//           const historyValuesArray = item.historyValues.split(',').map(v => parseFloat(v).toFixed(2));
//           const displayValues = historyValuesArray.slice(-4); 
      
//           return (
//             <View>
//               <View style={styles.itemRow}>
//                 <Text style={styles.itemName}>{item.itemName} @{item.mrp}</Text>
//                 <Text style={styles.itemMRP}>₹{item.rate.toFixed(2)}</Text>
//                 <View style={styles.quantityContainer}>
//                   <TouchableOpacity onPress={() => decrementQuantity(item.itemID)} style={styles.quantityButton}>
//                     <FontAwesome name='minus' style={styles.quantityIcon} />
//                   </TouchableOpacity>
//                   <TextInput
//                     style={styles.quantityInput}
//                     keyboardType="numeric"
//                     value={quantities[item.itemID] || ""}
//                     onChangeText={(text) => handleQuantityChange(item.itemID, text.replace(/\D/g, ''))}
//                   />
//                   <TouchableOpacity onPress={() => incrementQuantity(item.itemID)} style={styles.quantityButton}>
//                     <FontAwesome name='plus' style={styles.quantityIcon} />
//                   </TouchableOpacity>
//                 </View>
//                 <Text style={styles.itemAmount}>
//                   {isNaN(parseInt(quantities[item.itemID])) || isNaN(item.rate)
//                     ? "--"
//                     : ((parseInt(quantities[item.itemID]) || 0) * item.rate).toFixed(2)}
//                 </Text>
//               </View>
//               {displayValues.length > 0 && (
//                 <Text style={styles.itemHistory}>
//                   Last {displayValues.length} value{displayValues.length > 1 ? 's' : ''}: ₹{displayValues.join(', ')}
//                 </Text>
//               )}
//             </View>
//           );
//         }}
//         ListFooterComponent={
//           <View style={styles.footer}>
//             <Text style={styles.totalText}>Total</Text>
//             <Text style={styles.totalQuantity}>{calculateTotal().totalQuantity}</Text>
//             <Text style={styles.totalPrice}>{calculateTotal().totalPrice}</Text>
//           </View>
//         }
//       />

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
//     flex:2,
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
//     minWidth:100,
//     maxWidth:150,
    
//     },
//   icon: {
//     flex:1,
//     fontSize: 24,
//     color: "black",
//   },
//   itemRows: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     backgroundColor: 'green',
//     fontSize: 16,
//   },
//   itemRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 8,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//     fontSize: 13,
//     textAlign: 'center'
//   },
//   itemHistory: {
//     fontSize: 14,
//     color: '#666',
//     marginLeft: 10,
//     marginBottom: 5,
//     fontStyle: 'italic',
//   },
//   itemName: {
//     flex: 2,
//     fontSize: 16,
//     textAlign: 'left',
//     marginRight:5
//   },
//   itemMRP: {
//     flex: 1,
//     fontSize: 16,
//     textAlign: 'left',
//     alignItems:'flex-start',
//     marginLeft:3,
//     padding:5,
//   },
//   quantityContainer: {
//     flex: 2,
//     flexDirection:'row',
//     justifyContent:'center',
//     alignItems: 'center',
//     textAlign:'center',
//     marginRight:5
//   },


//   quantityIcon: {
//     fontSize: 16,
//     color: "blue",
//     margin:5
   
//   },
//   quantityInput: {
//     padding: 3,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 5,
//     textAlign: 'center',
//     maxWidth:50,
//     flex:1
//   },
//   itemAmount: {
//     flex: 1,
//     fontSize: 16,
//     textAlign: 'right',
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




///////////////////////////////*****************////////////////////////????????? */





// import React, { useState, useEffect } from "react";
// import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from "react-native";
// import axios from "axios";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { local_URL } from "./Constants";
// import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// import { faHome, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { FontAwesome } from '@expo/vector-icons';

// export const Itemlist = () => {
  
//   const navigation = useNavigation();
//   const route = useRoute();
//   const [items, setItems] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [branchName, setBranchName] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [userId, setUserId] = useState("");
//   const { customerId } = route.params || {};
//   const { username } = route.params || {};

//   useEffect(() => {
//     const { branchName: branchNameParam, userId: userIdParam } = route.params || {};

//     const fetchStoredData = async () => {
//       if (userIdParam) {
//         setUserId(userIdParam.toString());
//         await AsyncStorage.setItem("userId", userIdParam.toString());
//       } else {
//         const storedUserId = await AsyncStorage.getItem("userId");
//         if (storedUserId) {
//           setUserId(storedUserId);
//         }
//       }

//       if (branchNameParam) {
//         setBranchName(branchNameParam);
//         await AsyncStorage.setItem("branchName", branchNameParam);
//       } else {
//         const storedBranchName = await AsyncStorage.getItem("branchName");
//         if (storedBranchName) {
//           setBranchName(storedBranchName);
//         }
//       }
//     };

//     fetchStoredData();
//   }, [route.params]);

 

//   useEffect(() => {
//     axios
//       .get(http://172.16.2.21:8081/api/GTItem/ALL/ALL/ALL/ALL)
//       .then((response) => {
//         setItems(response.data);
//         const initialQuantities = {};
//         response.data.forEach(async (item) => {
//           const storedQuantity = await AsyncStorage.getItem(item.itemID);
//           initialQuantities[item.itemID] = storedQuantity || "";
//         });
        
        
       
//       })
//       .catch((error) => {
//         console.error("Error fetching item details:", error);
//       });
//   }, []);

  

//   const handleQuantityChange = async (itemId, quantity) => {
//     const newQuantities = {
//       ...quantities,
//       [itemId]: quantity,
//     };
//     setQuantities(newQuantities);
//     await AsyncStorage.setItem(itemId, quantity);
//   };

//   const incrementQuantity = (itemId) => {
//     const currentQuantity = parseInt(quantities[itemId]) || 0;
//     handleQuantityChange(itemId, (currentQuantity + 1).toString());
//   };

//   const decrementQuantity = (itemId) => {
//     const currentQuantity = parseInt(quantities[itemId]) || 0;
//     if (currentQuantity > 0) {
//       handleQuantityChange(itemId, (currentQuantity - 1).toString());
//     }
//   };

//   const calculateTotal = () => {
//     let totalQuantity = 0;
//     let totalPrice = 0;
//     items.forEach((item) => {
//       const quantity = parseInt(quantities[item.itemID]) || 0;
//       const amount = quantity * item.dayRate;
//       totalQuantity += quantity;
//       totalPrice += amount;
//     });
//     return { totalQuantity, totalPrice };
//   };

//   const handleAddToCart = () => {
//     const itemsWithQuantity = items.filter((item) => parseInt(quantities[item.itemID]) > 0);
//     const { totalQuantity, totalPrice } = calculateTotal(itemsWithQuantity);

//     const itemDetails = encodeURIComponent(
//       JSON.stringify(
//         itemsWithQuantity.map((item) => {
//           const quantity = parseInt(quantities[item.itemID]) || 0;
//           const price = item.dayRate * quantity;
//           return {
//             itemId: item.itemID,
//             itemName: item.itemName,
//             quantity,
//             price,
//             userId,
//             username,
//           };
//         })
//       )
//     );

//     const customerName = branchName;
//     const branchId = route.params?.branchId;

//     navigation.navigate("AddToCart", {
//       itemDetails,
//       totalQuantity,
//       totalPrice,
//       customerName,
//       userId,
//       branchId,
//       customerId,
//       username
//     });
//     console.log("userId", userId);
//     console.log("username", username);
//   };

//   const filteredItems = items.filter((item) =>
//     item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleCustomerPageNavigation = async () => {
//     await AsyncStorage.clear();
//     const { username, userId } = route.params || {};
//     navigation.navigate("Beat", { username, userId });
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.branchName}>{branchName}</Text>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search by item name"
//           value={searchTerm}
//           onChangeText={setSearchTerm}
//         />
//         <TouchableOpacity onPress={handleCustomerPageNavigation}>
//           <FontAwesomeIcon icon={faHome} style={styles.icon} />
//         </TouchableOpacity>
//       </View>
      
//       <View style={styles.itemRows}>
//         <Text style={{marginLeft:6}}>Item Name</Text>
//         <Text>Price</Text>
//         <Text style={{marginLeft:30 }}>Quantity</Text>
//         <Text style={{marginRight:6}}>Amount</Text>
//       </View>

//       <FlatList
//         data={filteredItems}
//         keyExtractor={(item) => item.itemID.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.itemRow}>
//             <Text style={styles.itemName}>{item.itemName}</Text>
//             <Text style={styles.itemMRP}>₹{item.dayRate}</Text>
//             <View style={styles.quantityContainer}>
//               <TouchableOpacity onPress={() => decrementQuantity(item.itemID)} style={styles.quantityButton}>
//                 <FontAwesome name='minus' style={styles.quantityIcon} />
//               </TouchableOpacity>
//               <TextInput
//               style={styles.quantityInput}
//               keyboardType="numeric"
//               value={quantities[item.itemID] || ""}
//               onChangeText={(text) => handleQuantityChange(item.itemID, text.replace(/\D/g, ''))}
//               />

//               <TouchableOpacity onPress={() => incrementQuantity(item.itemID)} style={styles.quantityButton}>
//                 <FontAwesome name='plus' style={styles.quantityIcon} />
//               </TouchableOpacity>
//             </View>
//             <Text style={styles.itemAmount}>
//               {isNaN(parseInt(quantities[item.itemID])) || isNaN(item.dayRate)
//                 ? "--"
//                 : (parseInt(quantities[item.itemID]) || 0) * item.dayRate} 
//             </Text>
//           </View>
//         )}
//         ListFooterComponent={
//           <View style={styles.footer}>
//             <Text style={styles.totalText}>Total</Text>
//             <Text style={styles.totalQuantity}>{calculateTotal().totalQuantity}</Text>
//             <Text style={styles.totalPrice}>{calculateTotal().totalPrice}</Text>
//           </View>
//         }
//       />

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
//     flex:2,
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
//     minWidth:100,
//     maxWidth:150,
    
//     },
//   icon: {
//     flex:1,
//     fontSize: 24,
//     color: "black",
//   },
//   itemRows: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     backgroundColor: 'green',
//     fontSize: 16,
//   },
//   itemRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 8,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//     fontSize: 13,
//     textAlign: 'center'
//   },
//   itemName: {
//     flex: 2,
//     fontSize: 16,
//     textAlign: 'left',
//     marginRight:5
//   },
//   itemMRP: {
//     flex: 1,
//     fontSize: 16,
//     textAlign: 'left',
//     alignItems:'flex-start',
//     marginLeft:3,
//     padding:5,
//   },
//   quantityContainer: {
//     flex: 2,
//     flexDirection:'row',
//     justifyContent:'center',
//     alignItems: 'center',
//     textAlign:'center',
//     marginRight:5
//   },


//   quantityIcon: {
//     fontSize: 16,
//     color: "blue",
//     margin:5
   
//   },
//   quantityInput: {
//     padding: 3,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 5,
//     textAlign: 'center',
//     maxWidth:50,
//     flex:1
//   },
//   itemAmount: {
//     flex: 1,
//     fontSize: 16,
//     textAlign: 'right',
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
