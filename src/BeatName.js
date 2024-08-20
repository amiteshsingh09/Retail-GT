// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, TouchableOpacity,Modal, FlatList, StyleSheet, Button, TouchableWithoutFeedback } from 'react-native';
// import axios from 'axios';
// import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
// import { FontAwesome } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';
// import { local_URL } from './Constants';



// const CustomPicker = ({ selectedValue, onValueChange, beats }) => {
//   const [isPickerVisible, setIsPickerVisible] = useState(false);
//   const handleSelect = (value) => {
//     onValueChange(value);
//     setIsPickerVisible(false);
//   };

//   return (
//     <View style={styles.pickerContainer}>
//       <TouchableOpacity 
//         style={styles.pickerButton} 
//         onPress={() => setIsPickerVisible(!isPickerVisible)}
//       >
//         <Text style={styles.pickerButtonText}>
//           {selectedValue ? beats.find(beat => beat.beatId === selectedValue)?.beatName : "Select Beat"}
//         </Text>
//         <FontAwesome name={isPickerVisible ? "chevron-up" : "chevron-down"} size={16} color="#007BFF" />
//       </TouchableOpacity>
//       {isPickerVisible && (
//         <Modal
//         transparent
//         visible={isPickerVisible}
//         onRequestClose={() => setIsPickerVisible(false)}
//       >
//         <TouchableOpacity
//             style={styles.modalOverlay}
//             onPress={() => setIsPickerVisible(false)}
//           >
//         <View style={styles.pickerDropdown}>
//           <FlatList
//             data={[{ beatId: '', beatName: 'Select Beat' }, ...beats]}
//             keyExtractor={(item) => item.beatId}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={styles.pickerItem}
//                 onPress={() => handleSelect(item.beatId)
//                 }
//               >
//                 <Text style={[
//                   styles.pickerItemText,
//                   selectedValue === item.beatId && styles.pickerItemTextSelected
//                 ]}>
//                   {item.beatName}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           />
          
//         </View>
//         </TouchableOpacity>
//         </Modal>
//       )}
//     </View>
//   );
// };


// export const Beat = () => {
//   const [beats, setBeats] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [expandedCustomer, setExpandedCustomer] = useState(null);
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { username, userId } = route.params;
//   const [loggedInUser, setLoggedInUser] = useState(username || '');
//   const [showUserProfile, setShowUserProfile] = useState(false);
//   const [selectedBeat, setSelectedBeat] = useState('');
//   const [cartItems, setCartItems] = useState([]);
//   const [customerActions, setCustomerActions] = useState({});
//   const customerActionsRef = useRef({});
//   const [userRole, setUserRole] = useState('');
//   const [latestOrderItems, setLatestOrderItems] = useState({});

//   useEffect(() => {
//     axios.get(`${local_URL}/api/Beat/0001`)
//       .then(response => {
//         setBeats(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching beats:', error);
//       });

//     setLoggedInUser(username || '');

//     // Assuming userRole is passed from the previous screen
//     const { userRole: role } = route.params;
//     setUserRole(role || ''); // Set default role if not provided

//   }, [username, route.params]);

//   useEffect(() => {
//     const fetchCustomers = () => {
//       const url = selectedBeat === '00001'
//         ? `${local_URL}/api/Customer/L111/FS/00001/` // Fetch all customers for "Ajni"
//         : `${local_URL}/api/Customer/${selectedBeat}/FS/00001/`; // Fetch customers for selected beat

//       axios.get(url)
//         .then(response => {
//           if (Array.isArray(response.data.branches)) {
//             setCustomers(response.data.branches);
//           } else {
//             console.error('Expected an array of customers:', response.data);
//             setCustomers([]);
//           }
//         })
//         .catch(error => {
//           console.error('Error fetching customers:', error);
//           setCustomers([]);
//         });
//     };

//     const resetCart = () => {
//       setCartItems([]);
//     };

//     if (selectedBeat) {
//       fetchCustomers();
//       customerActionsRef.current = {};
//       setCustomerActions({});
//     } else {
//       setCustomers([]);
//     }

//     resetCart();
//   }, [selectedBeat]);

//   useFocusEffect(
//     React.useCallback(() => {
//       if (route.params?.latestOrderItems) {
//         setLatestOrderItems(prevItems => ({
//           ...prevItems,
//           [route.params.customerId]: route.params.latestOrderItems
//         }));
        
//         navigation.setParams({ latestOrderItems: undefined, customerId: undefined });
//       }
//     }, [route.params?.latestOrderItems, route.params?.customerId])
//   );

//   const handleLogout = () => {
//     setBeats([]);
//     setCustomers([]);
//     setExpandedCustomer(null);
//     setLoggedInUser('');
//     setShowUserProfile(false);
//     setSelectedBeat('');
//     resetCart();

//     navigation.reset({
//       index: 0,
//       routes: [{ name: 'Login' }],
//     });
//   };

//   const resetCart = () => {
//     setCartItems([]);
//   };

//   const toggleUserProfile = () => {
//     setShowUserProfile(!showUserProfile);
//   };

//   const fetchCustomers = () => {
//     const url = selectedBeat === '00001'
//       ? `${local_URL}/api/Customer/L111/FS/00001/` // Fetch all customers for "Ajni"
//       : `${local_URL}/api/Customer/${selectedBeat}/FS/00001/`; // Fetch customers for selected beat

//     axios.get(url)
//       .then(response => {
//         if (Array.isArray(response.data.branches)) {
//           setCustomers(response.data.branches);
//         } else {
//           console.error('Expected an array of customers:', response.data);
//           setCustomers([]);
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching customers:', error);
//         setCustomers([]);
//       });
//   };

//   const handleNavigateToLedger = (customer) => {
//     navigation.navigate('Ledger', {
//       customerName: customer.customerName,
//       customerId: customer.customerCode,
//       username: loggedInUser,
//       userId: userId,
//     });

//     resetCart();
//   };

//   const updateCustomerAction = (customerId, status, color) => {
//     customerActionsRef.current = {
//       ...customerActionsRef.current,
//       [customerId]: { status, color }
//     };
//     setCustomerActions({ ...customerActionsRef.current });
//   };

//   const handleItemlistClicked = (customerId) => {
//     const currentAction = customerActionsRef.current[customerId];
//     if (!currentAction || currentAction.status !== 'ordered') {
//       updateCustomerAction(customerId, 'itemlist', '#ffbf00');
//     }
//   };

//   const handleOrderPlaced = (customerId, orderItems) => {
//     updateCustomerAction(customerId, 'ordered', 'green');
//     setLatestOrderItems(prevItems => ({
//       ...prevItems,
//       [customerId]: orderItems
//     }));
//   };

//   const handleNavigateToList = (customer) => {
//     handleItemlistClicked(customer.customerCode);
//     navigation.navigate('Itemlist', {
//       customerName: customer.customerName,
//       customerId: customer.customerCode,
//       username: loggedInUser,
//       userId: userId,
//       userRole: userRole,
//       onOrderPlaced: (orderItems) => {
//         handleOrderPlaced(customer.customerCode, orderItems);
//         navigation.navigate('Beat', {
//           latestOrderItems: orderItems,
//           customerId: customer.customerCode
//         });
//       },
//     });
//     resetCart();
//   };

//   const handleNavigateToReturn = (customer) => {
//     navigation.navigate('Sale Return', {
//       customerId: customer.customerCode,
//       customerName: customer.customerName,
//       username: loggedInUser,
//       userId: userId,
//       userRole: userRole
//     });
//     resetCart();
//   };

//   const renderOrderedItems = (customer) => {
//     const items = latestOrderItems[customer.customerCode];
//     if (!items || items.length === 0) return null;

//     return (
//       <View style={styles.orderedItemsContainer}>
//         <Text style={styles.orderedItemsHeader}>Latest Ordered Items:</Text>
//         {items.map((item, index) => (
//           <Text key={index} style={styles.orderedItem}>
//             {item.itemName} - Quantity: {item.quantity}, Price: ₹{item.price.toFixed(2)}
//           </Text>
//         ))}
//       </View>
//     );
//   };

//   const handleViewMore = (customer) => {
//     if (expandedCustomer === customer) {
//       setExpandedCustomer(null);
//     } else {
//       setExpandedCustomer(customer);
//     }
//   };

//   const handleOverlayPress = () => {
//     if (showUserProfile) {
//       setShowUserProfile(false);
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={handleOverlayPress}>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <CustomPicker
//             selectedValue={selectedBeat}
//             onValueChange={(itemValue) => setSelectedBeat(itemValue)}
//             beats={beats}
//           />
//           <View>
//             <TouchableOpacity onPress={toggleUserProfile} style={styles.userProfile}>
//               <FontAwesome name='user' size={40} />
//             </TouchableOpacity>
//           </View>
//           {/* {showUserProfile && (
//             <View style={styles.userProfileMenu}>
//               <Text style={{ fontSize: 24, marginBottom: 6 }}>User: {loggedInUser}</Text>
//               <Button title="Logout" onPress={handleLogout} />
//             </View>
//           )} */}
//         </View>
//         <View style={styles.itemRows}>
//           <Text style={styles.headerText}>Customer Name</Text>
//         </View>
//         <FlatList
//           data={customers}
//           keyExtractor={(item) => item.customerCode.toString()}
//           renderItem={({ item }) => (
//             <View>
//               <View style={styles.customerRow}>
//                 <View style={styles.indicatorContainer}>
//                   <View style={[
//                     styles.indicator,
//                     { backgroundColor: customerActions[item.customerCode]?.color || 'red' }
//                   ]} />
//                 </View>
//                 <View style={styles.customerNameContainer}>
//                   <TouchableOpacity onPress={() => handleViewMore(item)}>
//                     <Text style={styles.itemText}>{item.customerName}</Text>
//                   </TouchableOpacity>
//                 </View>
//                 {userRole === 'SLPAX' && (
//                   <>
//                     <TouchableOpacity onPress={() => handleNavigateToLedger(item)} style={styles.orderButton}>
//                       <FontAwesome name='address-book' size={25} />
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => handleNavigateToList(item)} style={styles.orderButton}>
//                       <FontAwesome name='shopping-cart' size={25} />
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => handleNavigateToReturn(item)} style={styles.returnButton}>
//                       <FontAwesome name='reply' size={25} />
//                     </TouchableOpacity>
//                   </>
//                 )}
//                 {userRole === 'ADMIN' && (
//                   <TouchableOpacity onPress={() => handleNavigateToLedger(item)} style={styles.orderButton}>
//                     <FontAwesome name='address-book' size={25} />
//                   </TouchableOpacity>
//                 )}
                
//                 {/* {customerActions[item.customerCode]?.status === 'ordered' && (
//                   <TouchableOpacity onPress={() => setExpandedCustomer(expandedCustomer === item ? null : item)} style={styles.viewMoreButton}>
//                     <Text style={styles.viewMoreText}>
//                       {expandedCustomer === item ? 'Hide' : 'View Order'}
//                     </Text>
//                   </TouchableOpacity>
//                 )} */}

//               </View>
//               {expandedCustomer === item && renderOrderedItems(item)}
//             </View>
//           )}
//         />
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f8f8f8',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     height: 70,
//     alignItems: 'center',
//     marginBottom: 16,
//     zIndex: 2,
//     marginTop: 10,
//     backgroundColor: 'white',
//     paddingHorizontal: 10, 
//     },
//     pickerContainer: {
//       width: 250,
//       zIndex: 1000,
//     },
//     pickerButton: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       backgroundColor: '#fff',
//       borderWidth: 1,
//       borderColor: '#4CAF50',
//       borderRadius: 8,
//       padding: 12,
//       height: 50,
//     },
//     pickerButtonText: {
//       fontSize: 16,
//       color: '#333',
//     },
//     pickerDropdown: {
//       width: '100%',
//       backgroundColor: '#fff',
//       borderWidth: 1,
//       borderColor: '#4CAF50',
//       borderRadius: 8,
//       maxHeight: 200,
//       overflow: 'hidden',
//     },
//     pickerItem: {
//       padding: 12,
//       borderBottomWidth: 1,
//       borderBottomColor: '#eee',
//     },
//     pickerItemText: {
//       fontSize: 16,
//       color: '#333',
//     },
//     pickerItemTextSelected: {
//       fontWeight: 'bold',
//       color: '#007BFF',
//     },
//     modalOverlay: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       backgroundColor: 'rgba(0,0,0,0.3)',
//     },
//   userProfile: {
//     flexDirection: 'row',
//     marginRight: 6,
//     padding: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,
//     borderRadius: 40,
//     backgroundColor: 'white',
//     borderColor:'green'
//   },
//   userProfileMenu: {
//     position: 'absolute',
//     top: 25,
//     right: 23,
//     borderRadius: 4,
//     padding: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,
//     backgroundColor: 'white',
//   },
//   itemRows: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 8,
//     borderRadius:15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     backgroundColor: 'green', 
//   },
//   indicator: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
   
//   },
//   customerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderBottomColor: '#ccc',
//     borderBottomWidth: 1,
//   },
//   indicatorContainer: {
//     marginRight: 10,
//   },
//   indicator: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//   },
//   customerNameContainer: {
//     flex: 1,
//   },
//   itemText: {
//     fontSize: 16,
//   },
//   orderButton: {
//     backgroundColor: '#007BFF',
//     paddingVertical: 8,
//     paddingHorizontal: 8,
//     borderRadius: 15,
//     maxWidth: 50,
//     minWidth: 40,
//     marginRight: 8,

//   },
//   returnButton: {
//     backgroundColor: '#FF6347',
//     paddingVertical: 8,
//     paddingHorizontal: 8,
//     borderRadius: 15,
//     maxWidth: 50,
//     minWidth: 40,
//   },
// });













// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, Button, TouchableWithoutFeedback } from 'react-native';
// import axios from 'axios';
// import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
// import { FontAwesome } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';
// import { local_URL } from './Constants';
// import * as Animatable from 'react-native-animatable';

// const CustomPicker = ({ selectedValue, onValueChange, beats }) => {
//   const [isPickerVisible, setIsPickerVisible] = useState(false);
//   const handleSelect = (value) => {
//     onValueChange(value);
//     setIsPickerVisible(false);
//   };

//   return (
//     <View style={styles.pickerContainer}>
//       <TouchableOpacity
//         style={styles.pickerButton}
//         onPress={() => setIsPickerVisible(!isPickerVisible)}
//       >
//         <Text style={styles.pickerButtonText}>
//           {selectedValue ? beats.find(beat => beat.beatId === selectedValue)?.beatName : "Select Beat"}
//         </Text>
//         <FontAwesome name={isPickerVisible ? "chevron-up" : "chevron-down"} size={16} color="#007BFF" />
//       </TouchableOpacity>
//       {isPickerVisible && (
//         <Modal
//           transparent
//           visible={isPickerVisible}
//           onRequestClose={() => setIsPickerVisible(false)}
//         >
//           <TouchableOpacity
//             style={styles.modalOverlay}
//             onPress={() => setIsPickerVisible(false)}
//           >
//             <Animatable.View animation="fadeIn" style={styles.pickerDropdown}>
//               <FlatList
//                 data={[{ beatId: '', beatName: 'Select Beat' }, ...beats]}
//                 keyExtractor={(item) => item.beatId}
//                 renderItem={({ item }) => (
//                   <TouchableOpacity
//                     style={styles.pickerItem}
//                     onPress={() => handleSelect(item.beatId)}
//                   >
//                     <Text style={[
//                       styles.pickerItemText,
//                       selectedValue === item.beatId && styles.pickerItemTextSelected
//                     ]}>
//                       {item.beatName}
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               />
//             </Animatable.View>
//           </TouchableOpacity>
//         </Modal>
//       )}
//     </View>
//   );
// };

// export const Beat = () => {
//   const [beats, setBeats] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [expandedCustomer, setExpandedCustomer] = useState(null);
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { username, userId, userRole: role } = route.params;
//   const [loggedInUser, setLoggedInUser] = useState(username || '');
//   const [showUserProfile, setShowUserProfile] = useState(false);
//   const [selectedBeat, setSelectedBeat] = useState('');
//   const [cartItems, setCartItems] = useState([]);
//   const [customerActions, setCustomerActions] = useState({});
//   const customerActionsRef = useRef({});
//   const [userRole, setUserRole] = useState(role || '');
//   const [latestOrderItems, setLatestOrderItems] = useState({});

//   useEffect(() => {
//     axios.get(`${local_URL}/api/Beat/0001`)
//       .then(response => {
//         setBeats(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching beats:', error);
//       });

//     setLoggedInUser(username || '');
//   }, [username]);

//   useEffect(() => {
//     const fetchCustomers = () => {
//       const url = selectedBeat === '00001'
//         ? `${local_URL}/api/Customer/L111/FS/00001/`
//         : `${local_URL}/api/Customer/${selectedBeat}/FS/00001/`;

//       axios.get(url)
//         .then(response => {
//           if (Array.isArray(response.data.branches)) {
//             setCustomers(response.data.branches);
//           } else {
//             console.error('Expected an array of customers:', response.data);
//             setCustomers([]);
//           }
//         })
//         .catch(error => {
//           console.error('Error fetching customers:', error);
//           setCustomers([]);
//         });
//     };

//     const resetCart = () => {
//       setCartItems([]);
//     };

//     if (selectedBeat) {
//       fetchCustomers();
//       customerActionsRef.current = {};
//       setCustomerActions({});
//     } else {
//       setCustomers([]);
//     }

//     resetCart();
//   }, [selectedBeat]);

//   useFocusEffect(
//     React.useCallback(() => {
//       if (route.params?.latestOrderItems) {
//         setLatestOrderItems(prevItems => ({
//           ...prevItems,
//           [route.params.customerId]: route.params.latestOrderItems
//         }));

//         navigation.setParams({ latestOrderItems: undefined, customerId: undefined });
//       }
//     }, [route.params?.latestOrderItems, route.params?.customerId])
//   );

//   const handleLogout = () => {
//     setBeats([]);
//     setCustomers([]);
//     setExpandedCustomer(null);
//     setLoggedInUser('');
//     setShowUserProfile(false);
//     setSelectedBeat('');
//     resetCart();

//     navigation.reset({
//       index: 0,
//       routes: [{ name: 'Login' }],
//     });
//   };

//   const resetCart = () => {
//     setCartItems([]);
//   };

//   const toggleUserProfile = () => {
//     setShowUserProfile(!showUserProfile);
//   };

//   const fetchCustomers = () => {
//     const url = selectedBeat === '00001'
//       ? `${local_URL}/api/Customer/L111/FS/00001/`
//       : `${local_URL}/api/Customer/${selectedBeat}/FS/00001/`;

//     axios.get(url)
//       .then(response => {
//         if (Array.isArray(response.data.branches)) {
//           setCustomers(response.data.branches);
//         } else {
//           console.error('Expected an array of customers:', response.data);
//           setCustomers([]);
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching customers:', error);
//         setCustomers([]);
//       });
//   };

//   const handleNavigateToLedger = (customer) => {
//     navigation.navigate('Ledger', {
//       customerName: customer.customerName,
//       customerId: customer.customerCode,
//       username: loggedInUser,
//       userId: userId,
//     });

//     resetCart();
//   };

//   const updateCustomerAction = (customerId, status, color) => {
//     const currentAction = customerActionsRef.current[customerId];
//     if (currentAction && currentAction.color === 'green') {
//       customerActionsRef.current = {
//         ...customerActionsRef.current,
//         [customerId]: { status, color: 'green' }
//       };
//     } else {
//       customerActionsRef.current = {
//         ...customerActionsRef.current,
//         [customerId]: { status, color }
//       };
//     }
//     setCustomerActions({ ...customerActionsRef.current });
//   };

//   const handleItemlistClicked = (customerId) => {
//     const currentAction = customerActionsRef.current[customerId];
//     if (!currentAction || currentAction.status !== 'ordered') {
//       updateCustomerAction(customerId, 'Order', '#ffbf00');
//     }
//   };

//   const handleOrderPlaced = (customerId, orderItems) => {
//     updateCustomerAction(customerId, 'ordered', 'green');
//     setLatestOrderItems(prevItems => ({
//       ...prevItems,
//       [customerId]: orderItems
//     }));
//   };

//   const handleNavigateToList = (customer) => {
//     handleItemlistClicked(customer.customerCode);
//     navigation.navigate('Order', {
//       customerName: customer.customerName,
//       customerId: customer.customerCode,
//       username: loggedInUser,
//       userId: userId,
//       userRole: userRole,
//       onOrderPlaced: (orderItems) => {
//         handleOrderPlaced(customer.customerCode, orderItems);
//         navigation.navigate('General Trading', {
//           latestOrderItems: orderItems,
//           customerId: customer.customerCode
//         });
//       },
//     });
//     resetCart();
//   };

//   const handleNavigateToReturn = (customer) => {
//     updateCustomerAction(customer.customerCode, 'return', '#FFBF00'); // Amber color
//     navigation.navigate('Sale Return', {
//       customerId: customer.customerCode,
//       customerName: customer.customerName,
//       username: loggedInUser,
//       userId: userId,
//       userRole: userRole
//     });
//     resetCart();
//   };

//   const renderOrderedItems = (customer) => {
//     const items = latestOrderItems[customer.customerCode];
//     if (!items || items.length === 0) return null;

//     return (
//       <Animatable.View animation="fadeIn" style={styles.orderedItemsContainer}>
//         <Text style={styles.orderedItemsHeader}>Latest Ordered Items:</Text>
//         {items.map((item, index) => (
//           <Text key={index} style={styles.orderedItem}>
//             {item.itemName} - Quantity: {item.quantity}, Price: ₹{item.price.toFixed(2)}
//           </Text>
//         ))}
//       </Animatable.View>
//     );
//   };

//   const handleViewMore = (customer) => {
//     if (expandedCustomer === customer) {
//       setExpandedCustomer(null);
//     } else {
//       setExpandedCustomer(customer);
//     }
//   };

//   const handleOverlayPress = () => {
//     if (showUserProfile) {
//       setShowUserProfile(false);
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={handleOverlayPress}>
//       <Animatable.View animation="fadeIn" style={styles.container}>
//         <Animatable.View animation="fadeInDown" style={styles.header}>
//           <CustomPicker
//             selectedValue={selectedBeat}
//             onValueChange={(itemValue) => setSelectedBeat(itemValue)}
//             beats={beats}
//           />
//           <View>
//             {/* <TouchableOpacity onPress={toggleUserProfile} style={styles.userProfile}>
//               <FontAwesome name='user' size={40} />
//             </TouchableOpacity> */}
//           </View>
//           {/* {showUserProfile && (
//             <View style={styles.userProfileMenu}>
//               <Text style={{ fontSize: 24, marginBottom: 6 }}>User: {loggedInUser}</Text>
//               <Button title="Logout" onPress={handleLogout} />
//             </View>
//           )} */}
//         </Animatable.View>
//         {/* <Animatable.View animation="fadeInUp" style={styles.itemRows}>
//           <Text style={styles.headerText}>Customer Name</Text>
//         </Animatable.View> */}
//         <FlatList
//           data={customers}
//           keyExtractor={(item) => item.customerCode.toString()}
//           renderItem={({ item }) => (
//             <Animatable.View animation="fadeInUp" duration={500} style={styles.customerContainer}>
//               <View style={styles.customerRow}>
//                 <View style={styles.indicatorContainer}>
//                   <Animatable.View
//                     animation="pulse"
//                     easing="ease-out"
//                     iterationCount="infinite"
//                     style={[
//                       styles.indicator,
//                       { backgroundColor: customerActions[item.customerCode]?.color || 'red' }
//                     ]}
//                   />
//                 </View>
//                 <View style={styles.customerNameContainer}>
//                   <TouchableOpacity onPress={() => handleViewMore(item)}>
//                     <Text style={styles.itemText}>{item.customerName}</Text>
//                   </TouchableOpacity>
//                 </View>
//                 {userRole === 'SLPAX' && (
//                   <>
//                     <TouchableOpacity onPress={() => handleNavigateToLedger(item)} style={styles.ledger}>
//                       <FontAwesome name='address-book' size={25} color="#fff" />
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => handleNavigateToList(item)} style={styles.orderButton}>
//                       <FontAwesome name='shopping-cart' size={25} color="#fff" />
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => handleNavigateToReturn(item)} style={styles.returnButton}>
//                       <FontAwesome name='reply' size={25} color="#fff" />
//                     </TouchableOpacity>
//                   </>
//                 )}
//                 {userRole === 'ADMIN' && (
//                   <TouchableOpacity onPress={() => handleNavigateToLedger(item)} style={styles.orderButton}>
//                     <FontAwesome name='address-book' size={25} color="#fff" />
//                   </TouchableOpacity>
//                 )}
//               </View>
//               {expandedCustomer === item && renderOrderedItems(item)}
//             </Animatable.View>
//           )}
//         />
//       </Animatable.View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f8f8f8',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     height: 70,
//     alignItems: 'center',
//     marginBottom: 16,
//     zIndex: 2,
//     marginTop: 10,
//     backgroundColor: 'white',
//     paddingHorizontal: 10,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 3,
//   },
//   pickerContainer: {
//     width: 250,
//     zIndex: 1000,
//   },
//   pickerButton: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#4CAF50',
//     borderRadius: 8,
//     padding: 12,
//     height: 50,
//   },
//   pickerButtonText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   pickerDropdown: {
//     width: '80%',
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#4CAF50',
//     borderRadius: 8,
//     maxHeight: 200,
//     overflow: 'hidden',
//   },
//   pickerItem: {
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   pickerItemText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   pickerItemTextSelected: {
//     fontWeight: 'bold',
//     color: '#007BFF',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },
//   userProfile: {
//     flexDirection: 'row',
//     marginRight: 6,
//     padding: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,
//     borderRadius: 40,
//     backgroundColor: 'white',
//     borderColor: 'green'
//   },
//   userProfileMenu: {
//     position: 'absolute',
//     top: 25,
//     right: 23,
//     borderRadius: 4,
//     padding: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,
//     backgroundColor: 'white',
//   },
//   itemRows: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 8,
//     borderRadius: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     backgroundColor: 'green',
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   customerContainer: {
//     marginBottom: 4,
//   },
//   customerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderBottomColor: '#ccc',
//     borderBottomWidth: 1,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 3,
//   },
//   indicatorContainer: {
//     marginRight: 10,
//   },
//   indicator: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//   },
//   customerNameContainer: {
//     flex: 1,
//   },
//   itemText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   orderButton: {
//     backgroundColor: 'green',
//     paddingVertical: 8,
//     paddingHorizontal: 8,
//     borderRadius: 15,
//     maxWidth: 50,
//     minWidth: 40,
//     marginRight: 8,
//   },
//   ledger: {
//     backgroundColor: '#007BFF',
//     paddingVertical: 8,
//     paddingHorizontal: 8,
//     borderRadius: 15,
//     maxWidth: 50,
//     minWidth: 40,
//     marginRight: 8,
//   },
//   returnButton: {
//     backgroundColor: '#FF6347',
//     paddingVertical: 8,
//     paddingHorizontal: 8,
//     borderRadius: 15,
//     maxWidth: 50,
//     minWidth: 40,
//   },
//   orderedItemsContainer: {
//     backgroundColor: '#f9f9f9',
//     borderRadius: 10,
//     padding: 10,
//     marginTop: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 3,
//   },
//   orderedItemsHeader: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#333',
//   },
//   orderedItem: {
//     fontSize: 14,
//     color: '#555',
//   },
// });

// export default Beat;










import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, Button, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { local_URL } from './Constants';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomPicker = ({ selectedValue, onValueChange, beats }) => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const handleSelect = (value) => {
    onValueChange(value);
    setIsPickerVisible(false);
  };

  return (
    <View style={styles.pickerContainer}>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setIsPickerVisible(!isPickerVisible)}
      >
        <Text style={styles.pickerButtonText}>
          {selectedValue ? beats.find(beat => beat.beatId === selectedValue)?.beatName : "Select Beat"}
        </Text>
        <FontAwesome name={isPickerVisible ? "chevron-up" : "chevron-down"} size={16} color="#007BFF" />
      </TouchableOpacity>
      {isPickerVisible && (
        <Modal
          transparent
          visible={isPickerVisible}
          onRequestClose={() => setIsPickerVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setIsPickerVisible(false)}
          >
            <Animatable.View animation="fadeIn" style={styles.pickerDropdown}>
              <FlatList
                data={[{ beatId: '', beatName: 'Select Beat' }, ...beats]}
                keyExtractor={(item) => item.beatId}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pickerItem}
                    onPress={() => handleSelect(item.beatId)}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      selectedValue === item.beatId && styles.pickerItemTextSelected
                    ]}>
                      {item.beatName}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </Animatable.View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

export const Beat = () => {
  const [beats, setBeats] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { username, userId, userRole: role } = route.params;
  const [loggedInUser, setLoggedInUser] = useState(username || '');
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedBeat, setSelectedBeat] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [customerActions, setCustomerActions] = useState({});
  const customerActionsRef = useRef({});
  const [userRole, setUserRole] = useState(role || '');
  const [latestOrderItems, setLatestOrderItems] = useState({});

  useEffect(() => {
    // Fetch beats
    axios.get(`${local_URL}/api/Beat/0001`)
      .then(response => {
        setBeats(response.data);
      })
      .catch(error => {
        console.error('Error fetching beats:', error);
      });

    setLoggedInUser(username || '');
  }, [username]);

  useEffect(() => {
    const fetchCustomers = () => {
      const url = selectedBeat === '00001'
        ? `${local_URL}/api/Customer/L111/FS/00001/`
        : `${local_URL}/api/Customer/${selectedBeat}/FS/00001/`;

      axios.get(url)
        .then(response => {
          if (Array.isArray(response.data.branches)) {
            setCustomers(response.data.branches);
          } else {
            console.error('Expected an array of customers:', response.data);
            setCustomers([]);
          }
        })
        .catch(error => {
          console.error('Error fetching customers:', error);
          setCustomers([]);
        });
    };

    const resetCart = () => {
      setCartItems([]);
    };

    if (selectedBeat) {
      fetchCustomers();
      customerActionsRef.current = {};
      setCustomerActions({});
    } else {
      setCustomers([]);
    }

    resetCart();
  }, [selectedBeat]);

  const [storedCustomerActions, setStoredCustomerActions] = useState({}); // State to hold retrieved customer actions

  useEffect(() => {
    const loadCustomerActions = async () => {
      try {
        const storedActions = await AsyncStorage.getItem('customerActions');
        if (storedActions) {
          const parsedActions = JSON.parse(storedActions);
          customerActionsRef.current = parsedActions;
          setCustomerActions(parsedActions);
        }
      } catch (error) {
        console.error('Error loading customer actions:', error);
      }
    };

    loadCustomerActions();
  }, []);


  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.latestOrderItems) {
        setLatestOrderItems(prevItems => ({
          ...prevItems,
          [route.params.customerId]: route.params.latestOrderItems
        }));

        navigation.setParams({ latestOrderItems: undefined, customerId: undefined });
      }
    }, [route.params?.latestOrderItems, route.params?.customerId])
  );

  
  useEffect(() => {
    const loadCustomerActions = async () => {
      try {
        const storedActions = await AsyncStorage.getItem('customerActions');
        if (storedActions) {
          const parsedActions = JSON.parse(storedActions);
          customerActionsRef.current = parsedActions;
          setCustomerActions(parsedActions);
        }
      } catch (error) {
        console.error('Error loading customer actions:', error);
      }
    };

    loadCustomerActions();
  }, []);
  

  const handleLogout = async () => {
    setBeats([]);
    setCustomers([]);
    setExpandedCustomer(null);
    setLoggedInUser('');
    setShowUserProfile(false);
    setSelectedBeat('');
    resetCart();
  
    // Clear AsyncStorage
    try {
      await AsyncStorage.removeItem('customerActions');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };
  

  const resetCart = () => {
    setCartItems([]);
  };

  const toggleUserProfile = () => {
    setShowUserProfile(!showUserProfile);
  };

  const fetchCustomers = () => {
    const url = selectedBeat === '00001'
      ? `${local_URL}/api/Customer/L111/FS/00001/`
      : `${local_URL}/api/Customer/${selectedBeat}/FS/00001/`;

    axios.get(url)
      .then(response => {
        if (Array.isArray(response.data.branches)) {
          setCustomers(response.data.branches);
        } else {
          console.error('Expected an array of customers:', response.data);
          setCustomers([]);
        }
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
        setCustomers([]);
      });
  };

  const handleNavigateToLedger = (customer) => {
   
    navigation.navigate('Ledger', {
      customerName: customer.customerName,
      customerId: customer.customerCode,
      username: loggedInUser,
      userId: userId,
      userRole: userRole,
      onOrderPlaced: (orderItems) => {
        handleOrderPlaced(customer.customerCode, orderItems);
        navigation.navigate('General Trading', {
          latestOrderItems: orderItems,
          customerId: customer.customerCode
        });
      },
    });

    resetCart();
  };

  const updateCustomerAction = async (customerId, status, color) => {
    const currentAction = customerActionsRef.current[customerId];
    if (currentAction && currentAction.color === 'green') {
      customerActionsRef.current = {
        ...customerActionsRef.current,
        [customerId]: { status, color: 'green' } // Ensure green is retained if already set
      };
    } else {
      customerActionsRef.current = {
        ...customerActionsRef.current,
        [customerId]: { status, color }
      };
    }
  
    const updatedActions = { ...customerActionsRef.current };
    setCustomerActions(updatedActions);
  
    try {
      await AsyncStorage.setItem('customerActions', JSON.stringify(updatedActions));
    } catch (error) {
      console.error('Error saving customer actions:', error);
    }
  };
  

  const handleItemlistClicked = (customerId) => {
    const currentAction = customerActionsRef.current[customerId];
    if (!currentAction || currentAction.status !== 'ordered') {
      updateCustomerAction(customerId, 'Order', '#ffbf00'); // Yellow color
    }
  };

  const handleOrderPlaced = (customerId, orderItems) => {
    updateCustomerAction(customerId, 'ordered', 'green'); // Green color
    setLatestOrderItems(prevItems => ({
      ...prevItems,
      [customerId]: orderItems
    }));
  };
  

  const handleNavigateToList = (customer) => {
    handleItemlistClicked(customer.customerCode);
    navigation.navigate('Order', {
      customerName: customer.customerName,
      customerId: customer.customerCode,
      username: loggedInUser,
      userId: userId,
      userRole: userRole,
      onOrderPlaced: (orderItems) => {
        handleOrderPlaced(customer.customerCode, orderItems);
        navigation.navigate('General Trading', {
          latestOrderItems: orderItems,
          customerId: customer.customerCode
        });
      },
    });
    resetCart();
  };

  const handleNavigateToReturn = (customer) => {
    updateCustomerAction(customer.customerCode, 'return', '#FFBF00'); 
    navigation.navigate('Sale Return', {
      customerId: customer.customerCode,
      customerName: customer.customerName,
      username: loggedInUser,
      userId: userId,
      userRole: userRole
    });
    resetCart();
  };

  const renderOrderedItems = (customer) => {
    const items = latestOrderItems[customer.customerCode];
    if (!items || items.length === 0) return null;

    return (
      <Animatable.View animation="fadeIn" style={styles.orderedItemsContainer}>
        <Text style={styles.orderedItemsHeader}>Latest Ordered Items:</Text>
        {items.map((item, index) => (
          <Text key={index} style={styles.orderedItem}>
            {item.itemName} - Quantity: {item.quantity}, Price: ₹{item.price.toFixed(2)}
          </Text>
        ))}
      </Animatable.View>
    );
  };

  const handleViewMore = (customer) => {
    if (expandedCustomer === customer) {
      setExpandedCustomer(null);
    } else {
      setExpandedCustomer(customer);
    }
  };

  const handleOverlayPress = () => {
    if (showUserProfile) {
      setShowUserProfile(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOverlayPress}>
      <Animatable.View animation="fadeIn" style={styles.container}>
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <CustomPicker
            selectedValue={selectedBeat}
            onValueChange={(itemValue) => setSelectedBeat(itemValue)}
            beats={beats}
          />
          <View>
            {/* User profile button (commented out) */}
          </View>
          {/* User profile menu (commented out) */}
        </Animatable.View>
        <FlatList
          data={customers}
          keyExtractor={(item) => item.customerCode.toString()}
          renderItem={({ item }) => (
            <Animatable.View animation="fadeInUp" duration={500} style={styles.customerContainer}>
              <View style={styles.customerRow}>
                <View style={styles.indicatorContainer}>
                  <Animatable.View
                    animation="pulse"
                    easing="ease-out"
                    iterationCount="infinite"
                    style={[
                      styles.indicator,
                      { backgroundColor: customerActions[item.customerCode]?.color || 'red' }
                    ]}
                  />
                </View>
                <View style={styles.customerNameContainer}>
                  <TouchableOpacity onPress={() => handleViewMore(item)}>
                    <Text style={styles.itemText}>{item.customerName}</Text>
                  </TouchableOpacity>
                </View>
                {userRole === 'SLPAX' && (
                  <>
                    <TouchableOpacity onPress={() => handleNavigateToLedger(item)} style={styles.ledger}>
                      <FontAwesome name='book' size={25} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNavigateToList(item)} style={styles.orderButton}>
                      <FontAwesome name='shopping-cart' size={25} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNavigateToReturn(item)} style={styles.returnButton}>
                      <FontAwesome name='reply' size={25} color="#fff" />
                    </TouchableOpacity>
                  </>
                )}
                {userRole === 'ADMIN' && (
                  <TouchableOpacity onPress={() => handleNavigateToLedger(item)} style={styles.orderButton}>
                    <FontAwesome name='address-book' size={25} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
              {expandedCustomer === item && renderOrderedItems(item)}
            </Animatable.View>
          )}
        />
      </Animatable.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 70,
    alignItems: 'center',
    marginBottom: 16,
    zIndex: 2,
    marginTop: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  pickerContainer: {
    width: 250,
    zIndex: 1000,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    height: 50,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  pickerDropdown: {
    width: '80%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    maxHeight: 200,
    overflow: 'hidden',
  },
  pickerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#333',
  },
  pickerItemTextSelected: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  userProfile: {
    flexDirection: 'row',
    marginRight: 6,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 40,
    backgroundColor: 'white',
    borderColor: 'green'
  },
  userProfileMenu: {
    position: 'absolute',
    top: 25,
    right: 23,
    borderRadius: 4,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: 'white',
  },
  itemRows: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'green',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  customerContainer: {
    marginBottom: 4,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  indicatorContainer: {
    marginRight: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  customerNameContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  orderButton: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 15,
    maxWidth: 50,
    minWidth: 40,
    marginRight: 8,
  },
  ledger: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 15,
    maxWidth: 50,
    minWidth: 40,
    marginRight: 8,
  },
  returnButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 15,
    maxWidth: 50,
    minWidth: 40,
  },
  orderedItemsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  orderedItemsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  orderedItem: {
    fontSize: 14,
    color: '#555',
  },
});

export default Beat;
