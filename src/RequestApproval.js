// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
// import axios from 'axios';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { Picker } from '@react-native-picker/picker';
// import Toast from 'react-native-toast-message';
// import { local_URL } from './Constants';

// export const RequestApproval = () => {
//   const [customers, setCustomers] = useState([]);
//   const [showUserProfile, setShowUserProfile] = useState(false);
//   const navigation = useNavigation();
//   const [submittedItems, setSubmittedItems] = useState({});
//   const route = useRoute();
//   const { username, branchId } = route.params;
//   const [loggedInUser, setLoggedInUser] = useState(username || '');
//   const [loading, setLoading] = useState(false);
//   const [expandedItemId, setExpandedItemId] = useState(null);
//   const [remarks, setRemarks] = useState({});

//   useEffect(() => {
//     fetchCustomers();
//   }, [branchId]);

//   const fetchCustomers = () => {
//     setLoading(true);
//     axios.get(`${local_URL}/api/ApprovalRequest/Get/PN`)
//       .then(response => {
//         const filteredCustomers = response.data.filter(customer => customer.requestBranchId === branchId);
//         setCustomers(filteredCustomers);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching customers:', error);
//         setLoading(false);
//       });
//   };

//   const handleRemarkChange = (requestUniqueId, text) => {
//     setRemarks(prevRemarks => ({
//       ...prevRemarks,
//       [requestUniqueId]: text,
//     }));
//   };

//   const handleLogout = () => {
//     setCustomers([]);
//     setLoggedInUser('');
//     setShowUserProfile(false);
//     navigation.reset({
//       index: 0,
//       routes: [{ name: 'Login' }],
//     });
//   };

//   const handleSubmit = async (requestUniqueId, approvalStatusCode) => {
//     if (approvalStatusCode === '') {
//       console.error('Invalid status selected');
//       Toast.show({
//         type: 'error',
//         text1: 'Please select a valid status',
//         position: 'top',
//       });
//       return;
//     }
//     const customer = customers.find(c => c.requestUniqueId === requestUniqueId);
//     const payload = {
//       requestUniqueId: customer.requestUniqueId,
//       approverUserId: loggedInUser,
//       approvalStatusCode: approvalStatusCode,
//       approverRemarks: remarks[requestUniqueId] || "Remark"
//     };

//     try {
//       const response = await axios.post(`${local_URL}/api/ApprovalRequest/Edit`, payload);
//       console.log(`Status updated for ${requestUniqueId}:`, response.data);

//       setSubmittedItems(prev => ({
//         ...prev,
//         [requestUniqueId]: true
//       }));

//       setCustomers(prevCustomers =>
//         prevCustomers.map(c =>
//           c.requestUniqueId === requestUniqueId
//             ? { ...c, approvalStatusCode: approvalStatusCode }
//             : c
//         )
//       );

//     } catch (error) {
//       console.error(`Error updating status for ${requestUniqueId}:`, error);
//     }
//   };

//   const toggleUserProfile = () => {
//     setShowUserProfile(!showUserProfile);
//   };

//   const updateCustomerStatus = (requestUniqueId, newStatus) => {
//     setCustomers(prevCustomers =>
//       prevCustomers.map(customer =>
//         customer.requestUniqueId === requestUniqueId
//           ? { ...customer, approvalStatusCode: newStatus }
//           : customer
//       )
//     );
//   };

//   const handleOverlayPress = () => {
//     if (showUserProfile) {
//       setShowUserProfile(false);
//     }
//   };

//   const renderCustomerItem = ({ item }) => {
//     const cleanedRefTransId = item.refTransId.replace(/^0+/, '') || '0';
//     const requestDate = new Date(item.requestDate).toISOString().split('T')[0];
//     const currentRemark = remarks[item.requestUniqueId] || '';

//     return (
//       <View style={styles.customerRow}>
//         <View style={styles.customerNameContainer}>
//           <View style={styles.textContainer}>
//             <Text style={styles.itemText}>Bill Number #{cleanedRefTransId}</Text>
//             <Text style={styles.itemText}>Total Amt: {item.transAmount}</Text>
//             <Text style={styles.itemText}>Channel: {item.channelId}</Text>
//             <Text style={styles.itemText}>Pricing: {item.pricingSchemeID}</Text>
//             <Text style={styles.itemText}>Req Remarks: {item.requesterRemarks}</Text>
//             <Text style={styles.itemText}>Req Date: {requestDate}</Text>
//           </View>
//           <View style={styles.actionContainer}>
//             <Text style={styles.statusText}>
//               Status: <Text style={styles.statusValue}>{item.approvalStatusCode}</Text>
//             </Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={item.approvalStatusCode || ''}
//                 style={styles.picker}
//                 onValueChange={(value) => updateCustomerStatus(item.requestUniqueId, value)}
//                 enabled={!submittedItems[item.requestUniqueId]}
//               >
//                 <Picker.Item label="Select" value="" style={styles.disabledOption} enabled={false} />
//                 <Picker.Item label="Approve" value="OK" />
//                 <Picker.Item label="Reject" value="RJ" />
//               </Picker>
//             </View>
//             <TouchableOpacity
//               onPress={() => handleSubmit(item.requestUniqueId, item.approvalStatusCode)}
//               disabled={
//                 submittedItems[item.requestUniqueId] ||
//                 item.approvalStatusCode === '' ||
//                 (item.approvalStatusCode !== 'OK' && item.approvalStatusCode !== 'RJ')
//               }
//             >
//               <Text style={[
//                 styles.submitButton,
//                 submittedItems[item.requestUniqueId] ? styles.submittedButton : null
//               ]}>
//                 {submittedItems[item.requestUniqueId] ? 'Submitted' : 'Submit'}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         <TextInput
//           style={styles.remarkInput}
//           placeholder="Enter remark"
//           value={currentRemark}
//           onChangeText={(text) => handleRemarkChange(item.requestUniqueId, text)}
//         />
//         <View style={{ flex: 1, flexDirection: 'row', marginBottom: 5 }}>
//           <View style={{ width: 200 }}>
//             <TouchableOpacity
//               style={styles.dropdownButton}
//               onPress={() => setExpandedItemId(expandedItemId === item.requestUniqueId ? null : item.requestUniqueId)}
//             >
//               <Text style={styles.dropdownButtonText}>
//                 {expandedItemId === item.requestUniqueId ? 'Hide Items' : 'Show Items'}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         {expandedItemId === item.requestUniqueId && item.approvalRequestItems && (
//           <View style={styles.itemsContainer}>
//             <View style={styles.itemRows}>
//               <Text style={{ textAlign: 'center', color: 'black', flex: 2 }}>Item Name</Text>
//               <Text style={{ textAlign: 'center', color: 'black', flex: 1 }}>Quantity</Text>
//               <Text style={{ textAlign: 'center', color: 'black', flex: 1 }}>Rate</Text>
//             </View>
//             {item.approvalRequestItems.map((subItem, index) => (
//               <View key={index} style={styles.itemDetail}>
//                 <Text style={styles.itemDetailText1}>{subItem.itemName}</Text>
//                 <Text style={styles.itemDetailText}>{subItem.qty}</Text>
//                 <Text style={styles.itemDetailText}>{subItem.rate}</Text>
//               </View>
//             ))}
//           </View>
//         )}
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {loading && <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />}
//       <FlatList
//         data={customers}
//         keyExtractor={(item) => item.requestUniqueId.toString()}
//         contentContainerStyle={styles.flatListContent}
//         renderItem={renderCustomerItem}
//       />
//       <Toast />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   customerRow: {
//     backgroundColor: '#ffffff',
//     borderRadius: 8,
//     marginBottom: 1,
//     padding: 3,
//     shadowColor: '#000000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     overflow: 'hidden',
//   },
//   customerNameContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   textContainer: {
//     flex: 2,
//     textAlign: 'center',
//     justifyContent: 'center',
//     marginRight: 16,
//   },
//   actionContainer: {
//     flex: 1,
//     alignItems: 'center',
//     marginBottom: 30
//   },
//   itemText: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: '#333333',
//   },
//   statusText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#555555',
//     marginBottom: 20,
//     marginTop: 20
//   },
//   statusValue: {
//     color: '#e74c3c',
//   },
//   dropdownButton: {
//     backgroundColor: '#3498db',
//     padding: 10,
//     borderRadius: 8,
//     marginTop: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 2,
//     color: '#3498db',
//     flex: 1,
//     width: 120,
//     textAlign: 'center'
//   },
//   dropdownButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#3498db',
//     borderRadius: 8,
//     marginBottom: 12,
//     backgroundColor: '#ffffff',
//     overflow: 'hidden',
//   },
//   picker: {
//     height: 50,
//     width: 120,
//   },
//   disabledOption: {
//     color: '#999999',
//   },
//   remarkInput: {
//     borderWidth: 1,
//     borderColor: '#3498db',
//     borderRadius: 8,
//     padding: 5,
//     marginBottom: 6,
//     fontSize: 16,
//     minHeight: 60,
//     backgroundColor: '#ffffff',
//   },
//   submitButton: {
//     backgroundColor: '#2ecc71',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 18,
//     alignItems: 'center',
//     marginTop: 12,
//     elevation: 2,
//     color: 'white',
//     flex: 1,
//     width: 120,
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   submittedButton: {
//     backgroundColor: '#95a5a6',
//     fontWeight: 'bold',
//   },
//   itemsContainer: {
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     marginTop: 10,
//   },
//   itemDetail: {
//     padding: 12,
//     borderColor: '#e0e0e0',
//     flexDirection: 'row',
//     flex: 1
//   },
//   itemRows: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     fontSize: 16,
//   },
//   itemDetailText1: {
//     fontSize: 14,
//     marginRight: 8,
//     color: '#333333',
//     marginBottom: 4,
//     flex: 2,
//     textAlign: 'center'
//   },
//   itemDetailText: {
//     fontSize: 14,
//     marginRight: 8,
//     color: '#333333',
//     marginBottom: 4,
//     flex: 1,
//     textAlign: 'center'
//   },
//   loader: {
//     marginTop: 20,
//   },
// });

















// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Button, ActivityIndicator } from 'react-native';
// import axios from 'axios';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { FontAwesome } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';
// import { local_URL } from './Constants';

// export const RequestApproval = () => {
//   const [customers, setCustomers] = useState([]);
//   const [showUserProfile, setShowUserProfile] = useState(false);
//   const navigation = useNavigation();
//   const [submittedItems, setSubmittedItems] = useState({});
//   const route = useRoute();
//   const { username, branchId } = route.params;
//   const [loggedInUser, setLoggedInUser] = useState(username || '');
//   const [loading, setLoading] = useState(false);
//   const [expandedItemId, setExpandedItemId] = useState(null);
//   const [remarks, setRemarks] = useState({});

//   useEffect(() => {
//     fetchCustomers();
//   }, [branchId]);

//   const fetchCustomers = () => {
//     setLoading(true);
//     axios.get(`${local_URL}/api/ApprovalRequest/Get/PN`)
//       .then(response => {
//         const filteredCustomers = response.data.filter(customer => customer.requestBranchId === branchId);
//         setCustomers(filteredCustomers);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching customers:', error);
//         setLoading(false);
//       });
//   };

  

//   const handleRemarkChange = (requestUniqueId, text) => {
//     setRemarks(prevRemarks => ({
//       ...prevRemarks,
//       [requestUniqueId]: text,
//     }));
//   };

//   const handleLogout = () => {
//     setCustomers([]);
//     setLoggedInUser('');
//     setShowUserProfile(false);
//     navigation.reset({
//       index: 0,
//       routes: [{ name: 'Login' }],
//     });
//   };

//   const handleSubmit = async (requestUniqueId, approvalStatusCode) => {
//     if (approvalStatusCode !== 'OK' && approvalStatusCode !== 'RJ') {
//       console.error('Invalid status selected');
//       return;
//     }
//     const customer = customers.find(c => c.requestUniqueId === requestUniqueId);
//     const payload = {
//       requestUniqueId: customer.requestUniqueId,
//       approverUserId: loggedInUser,
//       approvalStatusCode: approvalStatusCode,
//       approverRemarks: remarks[requestUniqueId] || "Remark"
//     };

//     try {
//       const response = await axios.post(`${local_URL}/api/ApprovalRequest/Edit`, payload);
//       console.log(`Status updated for ${requestUniqueId}:`, response.data);

//       setSubmittedItems(prev => ({
//         ...prev,
//         [requestUniqueId]: true
//       }));

//       setCustomers(prevCustomers =>
//         prevCustomers.map(c =>
//           c.requestUniqueId === requestUniqueId
//             ? { ...c, approvalStatusCode: approvalStatusCode }
//             : c
//         )
//       );

//     } catch (error) {
//       console.error(`Error updating status for ${requestUniqueId}:`, error);
//     }
//   };

//   const toggleUserProfile = () => {
//     setShowUserProfile(!showUserProfile);
//   };

//   const updateCustomerStatus = (requestUniqueId, newStatus) => {
//     setCustomers(prevCustomers =>
//       prevCustomers.map(customer =>
//         customer.requestUniqueId === requestUniqueId
//           ? { ...customer, approvalStatusCode: newStatus }
//           : customer
//       )
//     );
//   };

//   const handleOverlayPress = () => {
//     if (showUserProfile) {
//       setShowUserProfile(false);
//     }
//   };

//   const renderCustomerItem = ({ item }) => {
//     const cleanedRefTransId = item.refTransId.replace(/^0+/, '') || '0';
//     const requestDate = new Date(item.requestDate).toISOString().split('T')[0];
//     const currentRemark = remarks[item.requestUniqueId] || '';

//     return (
//       <View style={styles.customerRow}>
//         <View style={styles.customerNameContainer}>
//           <View style={styles.textContainer}>
//             <Text style={styles.itemText}>Bill Number #{cleanedRefTransId}</Text>
//             <Text style={styles.itemText}>Total Amt: {item.transAmount}</Text>
//             <Text style={styles.itemText}>Channel: {item.channelId}</Text>
//             <Text style={styles.itemText}>Pricing: {item.pricingSchemeID}</Text>
//             <Text style={styles.itemText}>Req Remarks: {item.requesterRemarks}</Text>
//             <Text style={styles.itemText}>Req Date: {requestDate}</Text>
//           </View>
//           <View style={styles.actionContainer}>
//             <Text style={styles.statusText}>
            
//             </Text>
            
              
            
            
//             <TouchableOpacity
//               onPress={() => handleSubmit(item.requestUniqueId, item.approvalStatusCode)}
//               disabled={
//                 submittedItems[item.requestUniqueId] ||
//                 item.approvalStatusCode === '' ||
//                 (item.approvalStatusCode !== 'OK' && item.approvalStatusCode !== 'RJ')
//               }
//             >
//             </TouchableOpacity>
//           </View>
//         </View>
//         <View>
//         <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={item.approvalStatusCode || ''}
//                 style={styles.picker}
//                 onValueChange={(value) => updateCustomerStatus(item.requestUniqueId, value)}
//                 enabled={!submittedItems[item.requestUniqueId]}
//               >
//              <Picker.Item label="Select" value="" style={styles.disabledOption}  />
//                <Picker.Item label="Approve" value="OK" />
//                 <Picker.Item label="Reject" value="RJ" />
//               </Picker>
//               </View>
//               <TextInput
//               style={styles.remarkInput}
//               placeholder="Enter remark"
//               value={currentRemark}
//               onChangeText={(text) => handleRemarkChange(item.requestUniqueId, text)}
//             /></View>
            
            
//         <View style={{flex:1 , flexDirection:'row' , marginBottom:8}}>
//           <View style={{width:200}}>
//             <TouchableOpacity
//             style={styles.dropdownButton}
//             onPress={() => setExpandedItemId(expandedItemId === item.requestUniqueId ? null : item.requestUniqueId)}
//             >
//             <Text style={styles.dropdownButtonText}>
//             {expandedItemId === item.requestUniqueId ? 'Hide Items' : 'Show Items'}
//             </Text>
//             </TouchableOpacity>
//           </View>
//             <View style={{flex:1, width:200 , alignItems:'center'}}>
//               <Text style={[
//                 styles.submitButton,
//                 submittedItems[item.requestUniqueId] ? styles.submittedButton : null
//               ]}>
//                 {submittedItems[item.requestUniqueId] ? 'Submitted' : 'Submit'}
//               </Text>
//             </View>
//         </View>
//         {expandedItemId === item.requestUniqueId && item.approvalRequestItems && (
//           <View style={styles.itemsContainer}>
//               <View style={styles.itemRows}>
//                 <Text style={{ textAlign:'center', color:'black' ,flex:2}}>Item Name</Text>
//                 <Text style={{ textAlign:'center', color:'black' ,flex:1}}>Quantity</Text>
//                 <Text style={{ textAlign:'center', color:'black',flex:1 }}>Rate</Text>
                
//                 </View>
//             {item.approvalRequestItems.map((subItem, index) => (
//               <View key={index} style={styles.itemDetail}>
//                 <Text style={styles.itemDetailText1}>{subItem.itemName}</Text>
//                 <Text style={styles.itemDetailText}>{subItem.qty}</Text>
//                 <Text style={styles.itemDetailText}>{subItem.rate}</Text>
//               </View>
//             ))}
//           </View>
//         )}
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.itemRows}>
//       </View>
//       {loading && <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />}
//       <FlatList
//         data={customers}
//         keyExtractor={(item) => item.requestUniqueId.toString()}
//         contentContainerStyle={styles.flatListContent}
//         renderItem={renderCustomerItem}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
    
//   },
  
//   customerRow: {
//     backgroundColor: '#ffffff',
//     borderRadius: 8,
//     marginBottom: 5,
//     padding: 3,
//     shadowColor: '#000000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     overflow: 'hidden',
//   },
//   customerNameContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   textContainer: {
//     flex: 2,
//     textAlign:'center',
//     justifyContent:'center',
//     marginRight: 16,
//   },
//   actionContainer: {
//     flex: 1,
//     alignItems:'center',
//     marginBottom:30

//   },
//   itemText: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: '#333333',
//   },
//   statusText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#555555',
//     marginBottom:20,
//     marginTop:20
//   },
//   statusValue: {
//     color: '#e74c3c',
//   },
//   dropdownButton: {
//     backgroundColor: '#3498db',
//     padding: 10,
//     borderRadius: 8,
//     marginTop: 10,
//     borderRadius: 18,
//     alignItems: 'center',
//     justifyContent:'center',
//     marginTop: 12,
//     elevation: 2,
//     color:'#3498db',
//     flex:1,
//     width:120,
//     textAlign:'center'

//   },
//   dropdownButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#3498db',
//     borderRadius: 8,
//     marginBottom: 12,
//     backgroundColor: '#ffffff',
//     overflow: 'hidden',
    
//      justifyContent:'center',
//      alignContent:'center',
    
//   },
//   picker: {
//     justifyContent:'center',
//      alignContent:'center',
//     height: 45,
   
//   },
//   remarkInput: {
//     borderWidth: 1,
//     borderColor: '#3498db',
//     borderRadius: 8,
//     padding: 5,
//     fontSize: 16,
//     minHeight:45,
//     backgroundColor: '#ffffff',
//   },
//   disabledOption: {
//     color: '#999999',
//   },
//   submitButton: {
//     backgroundColor: '#2ecc71',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 18,
//     alignItems: 'center',
//     marginTop: 12,
//     elevation: 2,
//     color:'white',
//     flex:1,
//     width:120,
//     textAlign:'center',
//     fontWeight: 'bold',
//   },
//   submittedButton: {
//     backgroundColor: '#95a5a6',
//     fontWeight: 'bold',
//   },
//   itemsContainer: {
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     marginTop: 10,
//   },
//   itemDetail: {
//     padding: 12,
//     borderColor: '#e0e0e0',
//     flexDirection:'row',
//     flex:1
//   },
//   itemRows: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     fontSize: 16,
//   },
//   itemDetailText1: {
//     fontSize: 14,
//     marginRight:8,
//     color: '#333333',
//     marginBottom: 4,
//     flex:2,
//     textAlign:'center'
//   },
//   itemDetailText: {
//     fontSize: 14,
//     marginRight:8,
//     color: '#333333',
//     marginBottom: 4,
//     flex:1,
//     textAlign:'center'

//   },
// });





























// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Button, ActivityIndicator } from 'react-native';
// import axios from 'axios';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { FontAwesome } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';
// import { local_URL } from './Constants';

// export const RequestApproval = () => {
//   const [customers, setCustomers] = useState([]);
//   const [showUserProfile, setShowUserProfile] = useState(false);
//   const navigation = useNavigation();
//   const [submittedItems, setSubmittedItems] = useState({});
//   const route = useRoute();
//   const { username, branchId } = route.params;
//   const [loggedInUser, setLoggedInUser] = useState(username || '');
//   const [loading, setLoading] = useState(false);
//   const [expandedItemId, setExpandedItemId] = useState(null);
//   const [remarks, setRemarks] = useState({});

//   useEffect(() => {
//     fetchCustomers();
//   }, [branchId]);

//   const fetchCustomers = () => {
//     setLoading(true);
//     axios.get(`${local_URL}/api/ApprovalRequest/Get/PN`)
//       .then(response => {
//         const filteredCustomers = response.data.filter(customer => customer.requestBranchId === branchId);
//         setCustomers(filteredCustomers);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching customers:', error);
//         setLoading(false);
//       });
//   };

  

//   const handleRemarkChange = (requestUniqueId, text) => {
//     setRemarks(prevRemarks => ({
//       ...prevRemarks,
//       [requestUniqueId]: text,
//     }));
//   };

//   const handleLogout = () => {
//     setCustomers([]);
//     setLoggedInUser('');
//     setShowUserProfile(false);
//     navigation.reset({
//       index: 0,
//       routes: [{ name: 'Login' }],
//     });
//   };

//   const handleSubmit = async (requestUniqueId, approvalStatusCode) => {
//     if (approvalStatusCode !== 'OK' && approvalStatusCode !== 'RJ') {
//       console.error('Invalid status selected');
//       return;
//     }
//     const customer = customers.find(c => c.requestUniqueId === requestUniqueId);
//     const payload = {
//       requestUniqueId: customer.requestUniqueId,
//       approverUserId: loggedInUser,
//       approvalStatusCode: approvalStatusCode,
//       approverRemarks: remarks[requestUniqueId] || "Remark"
//     };

//     try {
//       const response = await axios.post(`${local_URL}/api/ApprovalRequest/Edit`, payload);
//       console.log(`Status updated for ${requestUniqueId}:`, response.data);

//       setSubmittedItems(prev => ({
//         ...prev,
//         [requestUniqueId]: true
//       }));

//       setCustomers(prevCustomers =>
//         prevCustomers.map(c =>
//           c.requestUniqueId === requestUniqueId
//             ? { ...c, approvalStatusCode: approvalStatusCode }
//             : c
//         )
//       );

//     } catch (error) {
//       console.error(`Error updating status for ${requestUniqueId}:`, error);
//     }
//   };

//   const toggleUserProfile = () => {
//     setShowUserProfile(!showUserProfile);
//   };

//   const updateCustomerStatus = (requestUniqueId, newStatus) => {
//     setCustomers(prevCustomers =>
//       prevCustomers.map(customer =>
//         customer.requestUniqueId === requestUniqueId
//           ? { ...customer, approvalStatusCode: newStatus }
//           : customer
//       )
//     );
//   };

//   const handleOverlayPress = () => {
//     if (showUserProfile) {
//       setShowUserProfile(false);
//     }
//   };

//   const renderCustomerItem = ({ item }) => {
//     const cleanedRefTransId = item.refTransId.replace(/^0+/, '') || '0';
//     const requestDate = new Date(item.requestDate).toISOString().split('T')[0];
//     const currentRemark = remarks[item.requestUniqueId] || '';

//     return (
//       <View style={styles.customerRow}>
//         <View style={styles.customerNameContainer}>
//           <View style={styles.textContainer}>
//             <Text style={styles.itemText}>Bill Number #{cleanedRefTransId}</Text>
//             <Text style={styles.itemText}>Total Amt: {item.transAmount}</Text>
//             <Text style={styles.itemText}>Req Date: {requestDate}</Text>
//           </View>
//           <View style={styles.actionContainer}>
           
//             <View  style={styles.pickerContainer1}>
//             <Text style={styles.itemText}>CustomerName: {item.customerName}</Text>
//             <Text style={styles.itemText}>Channel: {item.channelId}</Text>
//             <Text style={styles.itemText}>Pricing: {item.pricingSchemeID}</Text>
//             </View>
//             <TouchableOpacity
//               onPress={() => handleSubmit(item.requestUniqueId, item.approvalStatusCode)}
//               disabled={
//                 submittedItems[item.requestUniqueId] ||
//                 item.approvalStatusCode === '' ||
//                 (item.approvalStatusCode !== 'OK' && item.approvalStatusCode !== 'RJ')
//               }
//             >
//             </TouchableOpacity>
//           </View>
//         </View>
//         <View>
//         <Text style={styles.itemText}>Req Remarks: {item.requesterRemarks}</Text>
//         <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={item.approvalStatusCode || ''}
//                 style={styles.picker}
//                 onValueChange={(value) => updateCustomerStatus(item.requestUniqueId, value)}
//                 enabled={!submittedItems[item.requestUniqueId]}
//               >
//              <Picker.Item label="Select" value="" style={styles.disabledOption}  />
//                <Picker.Item label="Approve" value="OK" />
//                 <Picker.Item label="Reject" value="RJ" />
//               </Picker>
//               </View>
//               <TextInput
//               style={styles.remarkInput}
//               placeholder="Enter remark"
//               value={currentRemark}
//               onChangeText={(text) => handleRemarkChange(item.requestUniqueId, text)}
//             /></View>
            
            
//         <View style={{flex:1 , flexDirection:'row' , marginBottom:8}}>
//           <View style={{width:200}}>
//             <TouchableOpacity
//             style={styles.dropdownButton}
//             onPress={() => setExpandedItemId(expandedItemId === item.requestUniqueId ? null : item.requestUniqueId)}
//             >
//             <Text style={styles.dropdownButtonText}>
//             {expandedItemId === item.requestUniqueId ? 'Hide Items' : 'Show Items'}
//             </Text>
//             </TouchableOpacity>
//           </View>
//             <View style={{flex:1, width:200 , alignItems:'center'}}>
//               <Text style={[
//                 styles.submitButton,
//                 submittedItems[item.requestUniqueId] ? styles.submittedButton : null
//               ]}>
//                 {submittedItems[item.requestUniqueId] ? 'Submitted' : 'Submit'}
//               </Text>
//             </View>
//         </View>
//         {expandedItemId === item.requestUniqueId && item.approvalRequestItems && (
//           <View style={styles.itemsContainer}>
//               <View style={styles.itemRows}>
//                 <Text style={{ textAlign:'center', color:'blue' ,flex:2}}>Item Name</Text>
//                 <Text style={{ textAlign:'center', color:'blue' ,flex:1}}>Quantity</Text>
//                 <Text style={{ textAlign:'center', color:'blue',flex:1 }}>Rate</Text>
//                 </View>
//             {item.approvalRequestItems.map((subItem, index) => (
//               <View key={index} style={styles.itemDetail}>
//                 <Text style={styles.itemDetailText1}>{subItem.itemName}</Text>
//                 <Text style={styles.itemDetailText}>{subItem.qty}</Text>
//                 <Text style={styles.itemDetailText}>{subItem.rate}</Text>
//               </View>
//             ))}
//           </View>
//         )}
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.itemRows}>
//       </View>
//       {loading && <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />}
//       <FlatList
//         data={customers}
//         keyExtractor={(item) => item.requestUniqueId.toString()}
//         contentContainerStyle={styles.flatListContent}
//         renderItem={renderCustomerItem}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 10,
//   },
//   customerRow: {
//     backgroundColor: '#ffffff',
//     borderRadius: 8,
//     marginBottom: 10,
//     padding: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   customerNameContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 8,
//   },
//   textContainer: {
//     flex: 1,
//     marginRight: 16,
//   },
//   actionContainer: {
//     flex: 1,
//   },
//   itemText: {
//     fontSize: 16,
//     marginBottom: 4,
//     color: '#333',
//   },
//   dropdownButton: {
//     backgroundColor: '#3498db',
//     padding: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   dropdownButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#3498db',
//     borderRadius: 8,
//     marginBottom: 12,
//     backgroundColor: '#fff',
//   },
 
//   picker: {
//     height: 45,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   remarkInput: {
//     borderWidth: 1,
//     borderColor: '#3498db',
//     borderRadius: 8,
//     padding: 8,
//     fontSize: 16,
//     minHeight: 45,
//     backgroundColor: '#fff',
//     marginBottom: 8,
//   },
//   submitButton: {
//     backgroundColor: '#2ecc71',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 12,
//     elevation: 2,
//     color: '#fff',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   submittedButton: {
//     backgroundColor: '#95a5a6',
//   },
//   itemsContainer: {
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     marginTop: 10,
//     padding: 10,
//   },
//   itemDetail: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   itemDetailText1: {
//     fontSize: 14,
//     color: '#333',
//     flex: 2,
//     textAlign: 'center',
//   },
//   itemDetailText: {
//     fontSize: 14,
//     color: '#333',
//     flex: 1,
//     textAlign: 'center',
//   },
//   itemRows: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     fontSize: 16,
//   },
// });















// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
// import axios from 'axios';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { Picker } from '@react-native-picker/picker';
// import { local_URL } from './Constants';

// export const RequestApproval = () => {
//   const [customers, setCustomers] = useState([]);
//   const [submittedItems, setSubmittedItems] = useState({});
//   const route = useRoute();
//   const { username, branchId } = route.params;
//   const [loggedInUser, setLoggedInUser] = useState(username || '');
//   const [loading, setLoading] = useState(false);
//   const [expandedItemId, setExpandedItemId] = useState(null);
//   const [remarks, setRemarks] = useState({});

//   const navigation = useNavigation();

//   useEffect(() => {
//     fetchCustomers();
//   }, [branchId]);

//   const fetchCustomers = () => {
//     setLoading(true);
//     axios.get(`${local_URL}/api/ApprovalRequest/Get/PN`)
//       .then(response => {
//         const filteredCustomers = response.data.filter(customer => customer.requestBranchId === branchId);
//         setCustomers(filteredCustomers);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching customers:', error);
//         setLoading(false);
//       });
//   };

//   const handleRemarkChange = (requestUniqueId, text) => {
//     setRemarks(prevRemarks => ({
//       ...prevRemarks,
//       [requestUniqueId]: text,
//     }));
//   };

//   const handleSubmit = async (requestUniqueId) => {
//     const customer = customers.find(c => c.requestUniqueId === requestUniqueId);
//     const approvalStatusCode = customer.approvalStatusCode;

//     if (approvalStatusCode !== 'OK' && approvalStatusCode !== 'RJ') {
//       console.error('Invalid status selected');
//       return;
//     }

//     const payload = {
//       requestUniqueId: customer.requestUniqueId,
//       approverUserId: loggedInUser,
//       approvalStatusCode: approvalStatusCode,
//       approverRemarks: remarks[requestUniqueId] || "Remark"
//     };

//     try {
//       const response = await axios.post(`${local_URL}/api/ApprovalRequest/Edit`, payload);
//       console.log(`Status updated for ${requestUniqueId}:`, response.data);

//       setSubmittedItems(prev => ({
//         ...prev,
//         [requestUniqueId]: true
//       }));

//       setCustomers(prevCustomers =>
//         prevCustomers.map(c =>
//           c.requestUniqueId === requestUniqueId
//             ? { ...c, approvalStatusCode: approvalStatusCode }
//             : c
//         )
//       );

//     } catch (error) {
//       console.error(`Error updating status for ${requestUniqueId}:`, error);
//     }
//   };

//   const updateCustomerStatus = (requestUniqueId, newStatus) => {
//     setCustomers(prevCustomers =>
//       prevCustomers.map(customer =>
//         customer.requestUniqueId === requestUniqueId
//           ? { ...customer, approvalStatusCode: newStatus }
//           : customer
//       )
//     );
//   };

//   const renderCustomerItem = ({ item }) => {
//     const cleanedRefTransId = item.refTransId.replace(/^0+/, '') || '0';
//     const requestDate = new Date(item.requestDate).toISOString().split('T')[0];
//     const currentRemark = remarks[item.requestUniqueId] || '';

//     return (
//       <View style={styles.customerRow}>
//         <View style={styles.customerNameContainer}>
//           <View style={styles.textContainer}>
//             <Text style={styles.itemText}>Bill Number #{cleanedRefTransId}</Text>
//             <Text style={styles.itemText}>Total Amt: {item.transAmount}</Text>
//             <Text style={styles.itemText}>Req Date: {requestDate}</Text>
//           </View>
//           <View style={styles.actionContainer}>
//             <View style={styles.pickerContainer1}>
//               <Text style={styles.itemText}>CustomerName: {item.customerName}</Text>
//               <Text style={styles.itemText}>Channel: {item.channelId}</Text>
//               <Text style={styles.itemText}>Pricing: {item.pricingSchemeID}</Text>
//             </View>
//           </View>
//         </View>
//         <Text style={styles.itemText}>Req Remarks: {item.requesterRemarks}</Text>
//         <View style={styles.pickerContainer}>
//           <Picker
//             selectedValue={item.approvalStatusCode || ''}
//             style={styles.picker}
//             onValueChange={(value) => updateCustomerStatus(item.requestUniqueId, value)}
//             enabled={!submittedItems[item.requestUniqueId]}
//           >
//             <Picker.Item label="Select" value="" style={styles.disabledOption} />
//             <Picker.Item label="Approve" value="OK" />
//             <Picker.Item label="Reject" value="RJ" />
//           </Picker>
//         </View>
//         <TextInput
//           style={styles.remarkInput}
//           placeholder="Enter remark"
//           value={currentRemark}
//           onChangeText={(text) => handleRemarkChange(item.requestUniqueId, text)}
//         />
//         <View style={{ flexDirection: 'row', marginBottom: 8 }}>
//           <View style={{ flex: 1 }}>
//             <TouchableOpacity
//               style={styles.dropdownButton}
//               onPress={() => setExpandedItemId(expandedItemId === item.requestUniqueId ? null : item.requestUniqueId)}
//             >
//               <Text style={styles.dropdownButtonText}>
//                 {expandedItemId === item.requestUniqueId ? 'Hide Items' : 'Show Items'}
//               </Text>
//             </TouchableOpacity>
//           </View>
//           <View style={{ flex: 1, alignItems: 'center' }}>
//             <TouchableOpacity
//               style={[
//                 styles.submitButton,
//                 submittedItems[item.requestUniqueId] ? styles.submittedButton : null
//               ]}
//               onPress={() => handleSubmit(item.requestUniqueId)}
//               disabled={
//                 submittedItems[item.requestUniqueId] ||
//                 item.approvalStatusCode === '' ||
//                 (item.approvalStatusCode !== 'OK' && item.approvalStatusCode !== 'RJ')
//               }
//             >
//               <Text style={styles.submitButtonText}>
//                 {submittedItems[item.requestUniqueId] ? 'Submitted' : 'Submit'}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         {expandedItemId === item.requestUniqueId && item.approvalRequestItems && (
//           <View style={styles.itemsContainer}>
//             <View style={styles.itemRows}>
//               <Text style={{ textAlign: 'center', color: 'blue', flex: 2 }}>Item Name</Text>
//               <Text style={{ textAlign: 'center', color: 'blue', flex: 1 }}>Quantity</Text>
//               <Text style={{ textAlign: 'center', color: 'blue', flex: 1 }}>Rate</Text>
//             </View>
//             {item.approvalRequestItems.map((subItem, index) => (
//               <View key={index} style={styles.itemDetail}>
//                 <Text style={styles.itemDetailText1}>{subItem.itemName}</Text>
//                 <Text style={styles.itemDetailText}>{subItem.qty}</Text>
//                 <Text style={styles.itemDetailText}>{subItem.rate}</Text>
//               </View>
//             ))}
//           </View>
//         )}
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {loading && <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />}
//       <FlatList
//         data={customers}
//         keyExtractor={(item) => item.requestUniqueId.toString()}
//         contentContainerStyle={styles.flatListContent}
//         renderItem={renderCustomerItem}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 10,
//   },
//   customerRow: {
//     backgroundColor: '#ffffff',
//     borderRadius: 8,
//     marginBottom: 10,
//     padding: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   customerNameContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 8,
//   },
//   textContainer: {
//     flex: 1,
//     marginRight: 16,
//   },
//   actionContainer: {
//     flex: 1,
//   },
//   itemText: {
//     fontSize: 16,
//     marginBottom: 4,
//     color: '#333',
//   },
//   dropdownButton: {
//     backgroundColor: '#3498db',
//     padding: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   dropdownButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#3498db',
//     borderRadius: 8,
//     marginBottom: 12,
//     backgroundColor: '#fff',
//   },
//   picker: {
//     height: 45,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   remarkInput: {
//     borderWidth: 1,
//     borderColor: '#3498db',
//     borderRadius: 8,
//     padding: 8,
//     fontSize: 16,
//     minHeight: 45,
//     backgroundColor: '#fff',
//     marginBottom: 8,
//   },
//   submitButton: {
//     backgroundColor: '#2ecc71',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 12,
//     elevation: 2,
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   submittedButton: {
//     backgroundColor: '#95a5a6',
//   },
//   itemsContainer: {
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     marginTop: 10,
//     padding: 10,
//   },
//   itemDetail: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   itemDetailText1: {
//     fontSize: 14,
//     color: '#333',
//     flex: 2,
//     textAlign: 'center',
//   },
//   itemDetailText: {
//     fontSize: 14,
//     color: '#333',
//     flex: 1,
//     textAlign: 'center',
//   },
//   itemRows: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     fontSize: 16,
//   },
// });









import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import * as Animatable from 'react-native-animatable';
import { local_URL } from './Constants';

export const RequestApproval = () => {
  const [customers, setCustomers] = useState([]);
  const [submittedItems, setSubmittedItems] = useState({});
  const route = useRoute();
  const { username, branchId } = route.params;
  const [loggedInUser, setLoggedInUser] = useState(username || '');
  const [loading, setLoading] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [remarks, setRemarks] = useState({});

  const navigation = useNavigation();

  useEffect(() => {
    fetchCustomers();
  }, [branchId]);

  const fetchCustomers = () => {
    setLoading(true);
    axios.get(`${local_URL}/api/ApprovalRequest/Get/PN`)
      .then(response => {
        const filteredCustomers = response.data.filter(customer => customer.requestBranchId === branchId);
        setCustomers(filteredCustomers);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
        setLoading(false);
      });
  };

  const handleRemarkChange = (requestUniqueId, text) => {
    setRemarks(prevRemarks => ({
      ...prevRemarks,
      [requestUniqueId]: text,
    }));
  };

  const handleSubmit = async (requestUniqueId) => {
    const customer = customers.find(c => c.requestUniqueId === requestUniqueId);
    const approvalStatusCode = customer.approvalStatusCode;

    if (approvalStatusCode !== 'OK' && approvalStatusCode !== 'RJ') {
      console.error('Invalid status selected');
      return;
    }

    const payload = {
      requestUniqueId: customer.requestUniqueId,
      approverUserId: loggedInUser,
      approvalStatusCode: approvalStatusCode,
      approverRemarks: remarks[requestUniqueId] || "Remark"
    };

    try {
      const response = await axios.post(`${local_URL}/api/ApprovalRequest/Edit`, payload);
      console.log(`Status updated for ${requestUniqueId}:`, response.data);

      setSubmittedItems(prev => ({
        ...prev,
        [requestUniqueId]: true
      }));

      setCustomers(prevCustomers =>
        prevCustomers.map(c =>
          c.requestUniqueId === requestUniqueId
            ? { ...c, approvalStatusCode: approvalStatusCode }
            : c
        )
      );

    } catch (error) {
      console.error(`Error updating status for ${requestUniqueId}:`, error);
    }
  };

  const updateCustomerStatus = (requestUniqueId, newStatus) => {
    setCustomers(prevCustomers =>
      prevCustomers.map(customer =>
        customer.requestUniqueId === requestUniqueId
          ? { ...customer, approvalStatusCode: newStatus }
          : customer
      )
    );
  };

  const renderCustomerItem = ({ item }) => {
    const cleanedRefTransId = item.refTransId.replace(/^0+/, '') || '0';
    const requestDate = new Date(item.requestDate)
    const formattedDate = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long' }).format(requestDate);
    const currentRemark = remarks[item.requestUniqueId] || '';

    return (
      <Animatable.View animation="fadeIn" duration={500} style={styles.customerRow}>
        <View style={styles.customerNameContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.itemText}>Bill <Text style={{color:'#333', fontSize:14.5}}>#{cleanedRefTransId}</Text> </Text>
            <Text style={styles.itemText}>Total Amt: <Text style={{color:'#333', fontSize:14.5}}>₹{item.transAmount}</Text></Text>
            <Text style={styles.itemText}>Req Date: <Text style={{color:'#333', fontSize:14.5}}>{formattedDate}</Text></Text>
          </View>
          <View style={styles.actionContainer}>
            <Text style={styles.itemText}>Customer: <Text style={{color:'#333' , fontSize:14}}>{item.customerName}</Text></Text>
            <Text style={styles.itemText}>Channel: <Text style={{color:'#333', fontSize:14.5}}>{item.channelId}</Text></Text>
            <Text style={styles.itemText}>Pricing: <Text style={{color:'#333', fontSize:14.5}}>{item.pricingSchemeID}</Text></Text>
          </View>
        </View>
        <Text style={styles.itemText}>Req Remarks: <Text style={{color:'#333', fontSize:14.5}}>{item.requesterRemarks}</Text></Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={item.approvalStatusCode || ''}
            style={styles.picker}
            onValueChange={(value) => updateCustomerStatus(item.requestUniqueId, value)}
            enabled={!submittedItems[item.requestUniqueId]}
          >
            <Picker.Item label="Select" value="" />
            <Picker.Item label="Approve" value="OK" />
            <Picker.Item label="Reject" value="RJ" />
          </Picker>
        </View>
        <TextInput
          style={styles.remarkInput}
          placeholder="Enter remark"
          value={currentRemark}
          onChangeText={(text) => handleRemarkChange(item.requestUniqueId, text)}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setExpandedItemId(expandedItemId === item.requestUniqueId ? null : item.requestUniqueId)}
          >
            <Text style={styles.dropdownButtonText}>
              {expandedItemId === item.requestUniqueId ? 'Hide Items' : 'Show Items'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.submitButton,
              submittedItems[item.requestUniqueId] ? styles.submittedButton : null,
              (!item.approvalStatusCode || (item.approvalStatusCode !== 'OK' && item.approvalStatusCode !== 'RJ')) ? styles.disabledButton : null
            ]}
            onPress={() => handleSubmit(item.requestUniqueId)}
            disabled={
              submittedItems[item.requestUniqueId] ||
              !item.approvalStatusCode ||
              (item.approvalStatusCode !== 'OK' && item.approvalStatusCode !== 'RJ')
            }
          >
            <Text style={styles.submitButtonText}>
              {submittedItems[item.requestUniqueId] ? 'Submitted' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
        {expandedItemId === item.requestUniqueId && item.approvalRequestItems && (
          <Animatable.View animation="fadeIn" duration={300} style={styles.itemsContainer}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemHeaderText}>Item Name</Text>
              <Text style={styles.itemHeaderText}>Quantity</Text>
              <Text style={styles.itemHeaderText}>Rate</Text>
            </View>
            {item.approvalRequestItems.map((subItem, index) => (
              <View key={index} style={styles.itemDetail}>
                <Text style={styles.itemDetailText}>{subItem.itemName}</Text>
                <Text style={styles.itemDetailText}>{subItem.qty}</Text>
                <Text style={styles.itemDetailText}>₹{subItem.rate}</Text>
              </View>
            ))}
          </Animatable.View>
        )}
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />}
      <FlatList
        data={customers}
        keyExtractor={(item) => item.requestUniqueId.toString()}
        contentContainerStyle={styles.flatListContent}
        renderItem={renderCustomerItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  customerRow: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  customerNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  actionContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#3498db',
    fontWeight:'bold'
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  remarkInput: {
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    minHeight: 50,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dropdownButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  dropdownButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submittedButton: {
    backgroundColor: '#95a5a6',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
    opacity: 0.7,
  },
  itemsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 15,
    padding: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemHeaderText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
    textAlign: 'center',
  },
  itemDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemDetailText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContent: {
    paddingVertical: 10,
  },
});
