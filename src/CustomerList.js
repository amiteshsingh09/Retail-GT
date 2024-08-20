import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Button, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import {local_URL } from './Constants'

export const BranchList = () => {
  const [beats, setBeats] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { username, userId } = route.params;
  const [loggedInUser, setLoggedInUser] = useState(username || '');
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedBeat, setSelectedBeat] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [cartItems, setCartItems] = useState([]);

  const timeSlots = [
    { label: '10-12', value: '10-12' },
    { label: '12-2', value: '12-2' },
    { label: '2-4', value: '2-4' },
    { label: '4-6', value: '4-6' },
    { label: '6-8', value: '6-8' },
    { label: '8-10', value: '8-10' },
  ];

  useEffect(() => {
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
        ? `${local_URL}/api/Customer/L111/FS/00001/` // Fetch all customers for "Ajni"
        : `${local_URL}/api/GTSale/0020054235`; // Fetch customers for selected beat

      axios.get(url)
        .then(response => {
          if (Array.isArray(response.data.branches)) {
            // Filter customers based on selected time slot
            const filteredCustomers = selectedTimeSlot 
              ? response.data.branches.filter(customer => customer.timeSlot === selectedTimeSlot)
              : response.data.branches;
            setCustomers(filteredCustomers);
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

    if (selectedBeat) {
      fetchCustomers();
    } else {
      setCustomers([]);
    }
    resetCart();
  }, [selectedBeat, selectedTimeSlot]);

  const resetCart = () => {
    setCartItems([]);
  };

  const handleLogout = () => {
    setBeats([]);
    setCustomers([]);
    setExpandedCustomer(null);
    setLoggedInUser('');
    setShowUserProfile(false);
    setSelectedBeat('');
    setSelectedTimeSlot('');
    resetCart();

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const toggleUserProfile = () => {
    setShowUserProfile(!showUserProfile);
  };

  const handleNavigateToLedger = (customer) => {
    navigation.navigate('Ledger', {
      customerName: customer.customerName,
      customerId: customer.customerCode,
      username: loggedInUser,
      userId: userId,
    });

    resetCart();
  };

  const handleNavigateToList = (customer) => {
    navigation.navigate('Order', {
      customerName: customer.customerName,
      customerId: customer.customerCode,
      username: loggedInUser,
      userId: userId,
    });

    resetCart();
  };

  const handleNavigateToReturn = (customer) => {
    navigation.navigate('Sale Return', {
      customerId: customer.customerCode,
      customerName: customer.customerName,
      username: loggedInUser,
      userId: userId,
    });

    resetCart();
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
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedBeat}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedBeat(itemValue)}
            >
              <Picker.Item label="Select Branch" value=""/>
              {beats.map(beat => (
                <Picker.Item key={beat.beatId} label={beat.beatName} value={beat.beatId} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedTimeSlot}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedTimeSlot(itemValue)}
            >
              <Picker.Item label="Select Time Slot" value=""/>
              {timeSlots.map(slot => (
                <Picker.Item key={slot.value} label={slot.label} value={slot.value} />
              ))}
            </Picker>
          </View>
          <View>
            <TouchableOpacity onPress={toggleUserProfile} style={styles.userProfile}>
              <FontAwesome name='user' size={40} />
            </TouchableOpacity>
          </View>
          {showUserProfile && (
            <View style={styles.userProfileMenu}>
              <Text style={{ fontSize: 24, marginBottom: 6 }}>User: {loggedInUser}</Text>
              <Button title="Logout" onPress={handleLogout} />
            </View>
          )}
        </View>
        <View style={styles.itemRows}>
          <Text style={styles.headerText}>Order List</Text>
        </View>
        {/* Render the list of customers */}
        <FlatList
          data={customers}
          keyExtractor={(item) => item.customerCode.toString()}
          renderItem={({ item }) => (
            <View style={styles.customerRow}>
              <View style={styles.customerNameContainer}>
                <Text style={styles.itemText}>{item.customerName}</Text>
                <TouchableOpacity onPress={() => handleViewMore(item)}>
                  <Text style={styles.itemText1}>View More</Text>
                </TouchableOpacity>
                {expandedCustomer === item && (
                  <View>
                    <Text>Product :- Chicken </Text>
                    <Text>Status :- Shipped  </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        />
      </View>
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
    paddingHorizontal: 5, // Added paddingHorizontal for better spacing
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 4,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginLeft: 10,
  },
  picker: {
    height: 40,
    width: 120,
    marginLeft: 5,
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
    borderColor:'green'
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
    borderRadius:15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'green', // Adjusted backgroundColor for header row
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  customerNameContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,

  },
  itemText1: {
    fontSize: 16,
    color:'blue'
  },
  orderButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
    maxWidth: 50,
    minWidth: 40,
    marginRight: 8,
    
  },
  returnButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
    maxWidth: 50,
    minWidth: 40,
  },
});













// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Button } from 'react-native';
// import axios from 'axios';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { FontAwesome } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';
// import { local_URL } from './Constants';

// export const Beat = () => {
  
//   const [searchTerm, setSearchTerm] = useState('');
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

//   useEffect(() => {
//     axios.get(`${local_URL}/api/Beats`)
//       .then(response => {
//         setBeats(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching beats:', error);
//       });

//     setLoggedInUser(username || '');
//   }, [username]);

//   useEffect(() => {
//     if (selectedBeat) {
//       axios.get(`${local_URL}/api/Beat/${selectedBeat}`)
//         .then(response => {
//           setCustomers(response.data);
//         })
//         .catch(error => {
//           console.error('Error fetching customers:', error);
//         });
//     } else {
//       setCustomers([]);
//     }
//     resetCart(); // Reset cart items when selectedBeat changes
//   }, [selectedBeat]);

//   const resetCart = () => {
//     setCartItems([]); // Function to reset cart items
//   };

//   const handleLogout = () => {
//     setSearchTerm('');
//     setBeats([]);
//     setCustomers([]);
//     setExpandedCustomer(null);
//     setLoggedInUser('');
//     setShowUserProfile(false);
//     setSelectedBeat('');
//     resetCart(); // Reset cart items on logout

//     navigation.reset({
//       index: 0,
//       routes: [{ name: 'Login' }],
//     });
//   };

//   const toggleUserProfile = () => {
//     setShowUserProfile(!showUserProfile);
//   };

//   const handleNavigateToList = (customer) => {
//     navigation.navigate('Itemlist', {
//       customerName: customer.CustomerName,
//       customerId: customer.CustomerId,
//       username: loggedInUser,
//       userId: userId,
//     });
    
//     resetCart(); 
//   };

//   const handleNavigateToReturn = (customer) => {
//     navigation.navigate('OrderReturn', {
//       customerId: customer.CustomerId,
//       customerName: customer.CustomerName,
//       username: loggedInUser,
//       userId: userId,
//     });
    
//     resetCart();
//   };

//   const handleViewMore = (customer) => {
//     if (expandedCustomer === customer) {
//       setExpandedCustomer(null);
//     } else {
//       setExpandedCustomer(customer);
//     }
//   };

//   const filteredCustomers = customers.filter(customer =>
//     customer.CustomerName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.pickerContainer}>
//           <Picker
//             selectedValue={selectedBeat}
//             style={styles.picker}
//             onValueChange={(itemValue) => setSelectedBeat(itemValue)}
//           >
//             <Picker.Item label="Select Beat" value="" />
//             {beats.map(beat => (
//               <Picker.Item key={beat.BeatId} label={beat.BeatName} value={beat.BeatId} />
//             ))}
//           </Picker>
//         </View>
//         <View style={styles.userProfile}>
//           <TouchableOpacity onPress={toggleUserProfile}>
//             <FontAwesome name='user' size={40} />
//           </TouchableOpacity>
//         </View>
//         {showUserProfile && (
//           <View style={styles.userProfileMenu}>
//             <Text style={{ fontSize: 24, marginBottom: 6 }}>User: {loggedInUser}</Text>
//             <Button title="Logout" onPress={handleLogout} />
//           </View>
//         )}
//       </View>
//       <View style={styles.itemRows}>
//         <Text style={styles.headerText}>Customer Name</Text>
//       </View>
//       <FlatList
//         data={filteredCustomers}
//         keyExtractor={(item) => item.CustomerId.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.customerRow}>
//             <View style={styles.customerNameContainer}>
//               <TouchableOpacity onPress={() => handleViewMore(item)}>
//                 <Text style={styles.itemText}>{item.CustomerName}</Text>
//               </TouchableOpacity>
//             </View>
//             <TouchableOpacity onPress={() => handleNavigateToList(item)} style={styles.orderButton}>
//               <FontAwesome name='shopping-cart' size={25} />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => handleNavigateToReturn(item)} style={styles.returnButton}>
//               <FontAwesome name='reply' size={25} />
//             </TouchableOpacity>
//           </View>
//         )}
//       />
//     </View>
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
//     backgroundColor: '#e0e0e0',
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//     backgroundColor: '#fff',
//     overflow: 'hidden',
//     marginLeft: 10,
//   },
//   picker: {
//     height: 40,
//     width: 250,
//     marginLeft: 10,
//   },
//   userProfile: {
//     flexDirection: 'row',
//     marginRight: 6,
//     position: 'relative',
//   },
//   userProfileMenu: {
//     position: 'absolute',
//     top: 25,
//     right: 23,
//     backgroundColor: '#fff',
//     borderRadius: 4,
//     padding: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,
//   },
//   itemRows: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     backgroundColor: 'green',
//     fontSize: 16,
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
//     borderRadius: 4,
//     maxWidth: 50,
//     minWidth: 40,
//     marginRight: 8,
//   },
//   returnButton: {
//     backgroundColor: '#FF6347',
//     paddingVertical: 8,
//     paddingHorizontal: 8,
//     borderRadius: 4,
//     maxWidth: 50,
//     minWidth: 40,
//   },
// });










// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
// import axios from 'axios';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { FontAwesome } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';
// import { local_URL } from './Constants';

// export const BranchList = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [branches, setBranches] = useState([]);
//   const [expandedCustomer, setExpandedCustomer] = useState(null);
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { username, userId } = route.params;
//   const [loggedInUser, setLoggedInUser] = useState(username || '');
//   const [showUserProfile, setShowUserProfile] = useState(false);
//   const [selectedValue, setSelectedValue] = useState('');

//   useEffect(() => {
//     axios.get(`${local_URL}/api/branches`)
//       .then(response => {
//         setBranches(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching branches:', error);
//       });

//     setLoggedInUser(username || '');
//   }, [username]);

//   const handleLogout = () => {
//     navigation.navigate('Login');
//   };

//   const toggleUserProfile = () => {
//     setShowUserProfile(!showUserProfile);
//   };

//   const handleNavigateToList = (customer) => {
//     navigation.navigate('Itemlist', {
//       branchName: customer.BranchName,
//       branchId: customer.BranchCode,
//       username: loggedInUser,
//       userId: userId,
//     });
//   };

//   const handleViewMore = (customer) => {
//     if (expandedCustomer === customer) {
//       setExpandedCustomer(null);
//     } else {
//       setExpandedCustomer(customer);
//     }
//   };

//   const filteredBranches = branches.filter(branch =>
//     branch.BranchName.toLowerCase().includes(searchTerm.toLowerCase()) &&
//     (selectedValue === '' || branch.BranchCode === selectedValue)
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TextInput
//           placeholder="Search Customer Name"
//           value={searchTerm}
//           onChangeText={(text) => setSearchTerm(text)}
//           style={styles.searchInput}
//         />
//         <Picker
//           selectedValue={selectedValue}
//           style={styles.picker}
//           onValueChange={(itemValue) => setSelectedValue(itemValue)}
//         >
//           <Picker.Item label="All" value=""  />
//           {branches.map(branch => (
//             <Picker.Item key={branch.BranchCode} label={branch.BranchName} value={branch.BranchCode} />
//           ))}
//         </Picker>
//         <View style={styles.userProfile}>
//           <TouchableOpacity onPress={toggleUserProfile}>
//             <FontAwesome name='user' size={40} />
//           </TouchableOpacity>
//         </View>
//         {showUserProfile && (
//           <View style={styles.userProfileMenu}>
//             <Text style={{fontSize:30 }}>User: {loggedInUser}</Text>
//             <Button title="Logout" onPress={handleLogout} />
//           </View>
//         )}
//       </View>
//       <View style={styles.itemRows}>
//         <Text>Customer Code</Text>
//         <Text>Customer Name</Text>
//         <Text>Action</Text>
//       </View>
//       <FlatList
//         data={filteredBranches}
//         keyExtractor={(item) => item.BranchCode}
//         renderItem={({ item }) => (
//           <>
//             <View style={styles.itemRow}>
//               <View style={styles.itemText}>
//                 <Text style={styles.itemText}>{item.BranchCode}</Text>
//               </View>
//               <View style={styles.itemText}>
//                 <TouchableOpacity onPress={() => handleNavigateToList(item)}>
//                   <Text style={styles.itemText}>{item.CustoerName}</Text>
//                 </TouchableOpacity>
//               </View>
//               <View style={styles.itemText}>
//                 <TouchableOpacity onPress={() => handleViewMore(item)}>
//                   <FontAwesome name={expandedCustomer === item ? 'toggle-up' : 'toggle-down'} size={24} />
//                 </TouchableOpacity>
//               </View>
//             </View>
//             {expandedCustomer === item && (
//               <View style={styles.customerDetails}>
//                 <Text style={styles.detailText}>Customer Name: {item.BranchName}</Text>
//                 <Text style={styles.detailText}>Customer Code: {item.BranchCode}</Text>
//               </View>
//             )}
//           </>
//         )}
//       />
//     </View>
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
//     alignItems: 'center',
//     marginBottom: 16,
//     zIndex: 2,
//   },
//   searchInput: {
//     flex: 1,
//     padding: 8,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//     marginRight: 8,
//     maxWidth:250
//   },
//   picker: {
//     height: 40,
//     width: 70,
//     marginRight: 8,
//   },
//   userProfile: {
//     flexDirection: 'row',
//     position: 'relative',
//   },
//   userProfileMenu: {
//     position: 'absolute',
//     top: 25,
//     right: 23,
//     backgroundColor: '#fff',
//     borderRadius: 4,
//     padding: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,
//   },
//   itemRows: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     backgroundColor: 'green',
//     fontSize: 16,
//   },
//   itemRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     textAlign: 'center',
//     padding: 6,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     flex: 1,
//     flexWrap: 'wrap',
//   },
//   itemText: {
//     fontSize: 16,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     padding: 2,
//     textAlign: 'center',
//     height: 'auto',
//     minHeight: 40,
//     maxWidth: 130,
//   },
//   customerDetails: {
//     padding: 8,
//     backgroundColor: '#e0e0e0',
//   },
//   detailText: {
//     fontSize: 14,
//   },
// });
















// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
// import axios from 'axios';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { FontAwesome } from '@expo/vector-icons';
// import { Picker } from '@react-native-picker/picker';
// import { local_URL } from './Constants';

// export const Customer = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [branches, setBranches] = useState([]);
//   const [expandedCustomer, setExpandedCustomer] = useState(null);
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { username, userId } = route.params;
//   const [loggedInUser, setLoggedInUser] = useState(username || '');
//   const [showUserProfile, setShowUserProfile] = useState(false);
//   const [selectedValue, setSelectedValue] = useState('');

//   useEffect(() => {
//     axios.get(`${local_URL}/api/branches`)
//       .then(response => {
//         setBranches(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching branches:', error);
//       });

//     setLoggedInUser(username || '');
//   }, [username]);

//   const handleLogout = () => {
//     navigation.navigate('Login');
//   };

//   const toggleUserProfile = () => {
//     setShowUserProfile(!showUserProfile);
//   };

//   const handleNavigateToList = (customer) => {
//     navigation.navigate('Itemlist', {
//       branchName: customer.BranchName,
//       branchId: customer.BranchCode,
//       username: loggedInUser,
//       userId: userId,
//     });
//   };

//   const handleViewMore = (customer) => {
//     if (expandedCustomer === customer) {
//       setExpandedCustomer(null);
//     } else {
//       setExpandedCustomer(customer);
//     }
//   };

//   const filteredBranches = branches.filter(branch =>
//     branch.BranchName.toLowerCase().includes(searchTerm.toLowerCase()) &&
//     (selectedValue === '' || branch.BranchCode === selectedValue)
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TextInput
//           placeholder="Search Customer Name"
//           value={searchTerm}
//           onChangeText={(text) => setSearchTerm(text)}
//           style={styles.searchInput}
//         />
//         <Picker
//           selectedValue={selectedValue}
//           style={styles.picker}
//           onValueChange={(itemValue) => setSelectedValue(itemValue)}
//         >
//           <Picker.Item label="All" value=""  />
//           {branches.map(branch => (
//             <Picker.Item key={branch.BranchCode} label={branch.BranchName} value={branch.BranchCode} />
//           ))}
//         </Picker>
//         <View style={styles.userProfile}>
//           <TouchableOpacity onPress={toggleUserProfile}>
//             <FontAwesome name='user' size={40} />
//           </TouchableOpacity>
//         </View>
//         {showUserProfile && (
//           <View style={styles.userProfileMenu}>
//             <Text style={{fontSize:30 }}>User: {loggedInUser}</Text>
//             <Button title="Logout" onPress={handleLogout} />
//           </View>
//         )}
//       </View>
//       <View style={styles.itemRows}>
//         <Text>Customer Code</Text>
//         <Text>Customer Name</Text>
//         <Text>Action</Text>
//       </View>
//       <FlatList
//         data={filteredBranches}
//         keyExtractor={(item) => item.BranchCode}
//         renderItem={({ item }) => (
//           <>
//             <View style={styles.itemRow}>
//               <View style={styles.itemText}>
//                 <Text style={styles.itemText}>{item.BranchCode}</Text>
//               </View>
//               <View style={styles.itemText}>
//                 <TouchableOpacity onPress={() => handleNavigateToList(item)}>
//                   <Text style={styles.itemText}>{item.CustoerName}</Text>
//                 </TouchableOpacity>
//               </View>
//               <View style={styles.itemText}>
//                 <TouchableOpacity onPress={() => handleViewMore(item)}>
//                   <FontAwesome name={expandedCustomer === item ? 'toggle-up' : 'toggle-down'} size={24} />
//                 </TouchableOpacity>
//               </View>
//             </View>
//             {expandedCustomer === item && (
//               <View style={styles.customerDetails}>
//                 <Text style={styles.detailText}>Customer Name: {item.BranchName}</Text>
//                 <Text style={styles.detailText}>Customer Code: {item.BranchCode}</Text>
//               </View>
//             )}
//           </>
//         )}
//       />
//     </View>
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
//     alignItems: 'center',
//     marginBottom: 16,
//     zIndex: 2,
//   },
//   searchInput: {
//     flex: 1,
//     padding: 8,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 4,
//     marginRight: 8,
//     maxWidth:250
//   },
//   picker: {
//     height: 40,
//     width: 70,
//     marginRight: 8,
//   },
//   userProfile: {
//     flexDirection: 'row',
//     position: 'relative',
//   },
//   userProfileMenu: {
//     position: 'absolute',
//     top: 25,
//     right: 23,
//     backgroundColor: '#fff',
//     borderRadius: 4,
//     padding: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,
//   },
//   itemRows: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     backgroundColor: 'green',
//     fontSize: 16,
//   },
//   itemRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     textAlign: 'center',
//     padding: 6,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     flex: 1,
//     flexWrap: 'wrap',
//   },
//   itemText: {
//     fontSize: 16,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     padding: 2,
//     textAlign: 'center',
//     height: 'auto',
//     minHeight: 40,
//     maxWidth: 130,
//   },
//   customerDetails: {
//     padding: 8,
//     backgroundColor: '#e0e0e0',
//   },
//   detailText: {
//     fontSize: 14,
//   },
// });
