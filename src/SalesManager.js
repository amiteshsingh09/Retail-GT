import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Button, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import {local_URL} from './Constants'


export const SalesManager = () => {
  const [branches, setBranches] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { username, userId } = route.params;
  const [loggedInUser, setLoggedInUser] = useState(username || '');
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedBranches, setSelectedBranches] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    axios.get(`${local_URL}/api/Store/1/LZ`)
      .then(response => {
        setBranches(response.data);
      })
      .catch(error => {
        console.error('Error fetching beats:', error);
      });

    setLoggedInUser(username || '');
  }, [username]);

  useEffect(() => {
    const fetchCustomers = () => {
      const url = `${local_URL}/api/orderstatus/get/${selectedBranches}/1/1`;
  
      axios.get(url)
        .then(response => {
          if (Array.isArray(response.data)) {
            const formattedData = response.data.map(customer => ({
              ...customer,
              deliveryScheduleDate: formatDate(customer.deliveryScheduleDate),
              
            }));
            setCustomers(formattedData);
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
  
    if (selectedBranches) {
      fetchCustomers();
    } else {
      setCustomers([]);
    }
    resetCart();
  }, [selectedBranches]);

  const resetCart = () => {
    setCartItems([]);
  };

  const formatDate = (dateTimeString) => {
    return dateTimeString.split('T')[0];
  };

  

  const handleLogout = () => {
    setBranches([]);
    setCustomers([]);
    setExpandedCustomer(null);
    setLoggedInUser('');
    setShowUserProfile(false);
    setSelectedBranches('');
    resetCart();

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const toggleUserProfile = () => {
    setShowUserProfile(!showUserProfile);
  };

//   const handleNavigateToLedger = (customer) => {
//     navigation.navigate('Ledger', {
//       customerName: customer.customerName,
//       customerId: customer.customerCode,
//       username: loggedInUser,
//       userId: userId,
//     });

//     resetCart();
//   };

//   const handleNavigateToList = (customer) => {
//     navigation.navigate('Itemlist', {
//       customerName: customer.customerName,
//       customerId: customer.customerCode,
//       username: loggedInUser,
//       userId: userId,
//     });

//     resetCart();
//   };

//   const handleNavigateToReturn = (customer) => {
//     navigation.navigate('OrderReturn', {
//       customerId: customer.customerCode,
//       customerName: customer.customerName,
//       username: loggedInUser,
//       userId: userId,
//     });

//     resetCart();
//   };

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
              selectedValue={selectedBranches}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedBranches(itemValue)}
            >
              <Picker.Item label="Select Branches" value=""/>
              {branches.map(branch => (
                <Picker.Item key={branch.branchID} label={branch.branchName} value={branch.branchID} />
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
          <Text style={styles.headerText}>Customer Name</Text>
        </View> 
        <FlatList
          data={customers}
          keyExtractor={(item) => item.saleOrderId.toString()}
          renderItem={({ item }) => (
            <View style={styles.customerRow}>
              <View style={styles.customerNameContainer}>
                <View style={styles.Text}>
                  <Text style={styles.itemText}>{item.custName}</Text>
                  <Text style={styles.itemText}>{item.customerAddress}</Text>
                  <Text style={styles.itemText}>{item.mobile}</Text>
                  <Text style={styles.itemText}>{item.deliveryScheduleDate}</Text>
                  </View>
                  <View style={styles.Text2}>
                <Text style={{fontSize:16 , justifyContent:'center' , textAlign:'center' }}>Status</Text>
                <Text style={{fontSize:16 , justifyContent:'center' , textAlign:'center', color:'blue' }}>{item.orderStatusId}</Text>
                <Text style={{fontSize:15 , justifyContent:'center' , textAlign:'center' }}>{item.timeSlotName}</Text>
              </View>
              </View>
              {/* <TouchableOpacity onPress={() => handleNavigateToLedger(item)} style={styles.orderButton}>
                <FontAwesome name='address-book' size={25} />
              </TouchableOpacity> */}
              
              {/* <TouchableOpacity onPress={() => handleNavigateToReturn(item)} style={styles.returnButton}>
                <FontAwesome name='reply' size={25} />
              </TouchableOpacity> */}
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
    paddingHorizontal: 10, // Added paddingHorizontal for better spacing
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
    width: 250,
    marginLeft: 10,
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  customerNameContainer: {
    flex: 1,
    flexDirection:'row'

  },
  Text: {
    flex:2,
    flexDirection:'column'
  },
  Text2: {
    flex:1,
    flexDirection:'column'
  },
  itemText: {
    fontSize: 14,
    margin:1
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











