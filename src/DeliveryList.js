import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
} from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import {local_URL} from './Constants'

export const DeliveryList = () => {
  const [submittedItems, setSubmittedItems] = useState({});
  const [branches, setBranches] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [trips, setTrips] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { username } = route.params;
  const [loggedInUser, setLoggedInUser] = useState(username || '');
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedTrip, setSelectedTrip] = useState('');
  const [status, setStatus] = useState('');
  const [tempStatus, setTempStatus] = useState({});

  useEffect(() => {
    axios
      .get(`${local_URL}/api/Store/1/LZ`)
      .then((response) => {
        setBranches(response.data);
      })
      .catch((error) => {
        console.error('Error fetching branches:', error);
      });

    setLoggedInUser(username || '');
  }, [username]);

  useEffect(() => {
    if (selectedBranch) {
      const url = `${local_URL}/api/TripPlan/${selectedBranch}/20240501/20240716`;

      axios
        .get(url)
        .then((response) => {
          if (Array.isArray(response.data)) {
            setTrips(response.data);
          } else {
            console.error('Expected an array of trips:', response.data);
            setTrips([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching trips:', error);
          setTrips([]);
        });
    } else {
      setTrips([]);
      setCustomers([]);
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (selectedTrip) {
      const fetchCustomers = () => {
        const url = `${local_URL}/api/DeliveryStatus/Get/${selectedTrip}`;

        axios
          .get(url)
          .then((response) => {
            if (Array.isArray(response.data)) {
              const formattedData = response.data.map((customer) => ({
                ...customer,
                deliveryScheduleDate: customer.deliveryScheduleDate
                  ? formatDate(customer.deliveryScheduleDate)
                  : 'N/A',
              }));
              setCustomers(formattedData);
            } else {
              console.error('Expected an array of customers:', response.data);
              setCustomers([]);
            }
          })
          .catch((error) => {
            console.error('Error fetching customers:', error);
            setCustomers([]);
          });
      };

      fetchCustomers();
    } else {
      setCustomers([]);
    }
  }, [selectedTrip]);

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    return dateTimeString.split('T')[0];
  };

  const updateCustomerStatus = (lineNumber, newStatus) => {
    const updatedCustomers = customers.map((customer) =>
      customer.lineNumber === lineNumber ? { ...customer, deliveryStatusId: newStatus } : customer
    );
    setCustomers(updatedCustomers);
  };

  const submitStatusUpdate = async (lineNumber) => {
    const customer = customers.find((c) => c.lineNumber === lineNumber);
  
    if (!customer) {
      console.error('Customer not found!');
      return;
    }
  
    const { transId, transTypeID, customerName } = customer;
    const tripId = selectedTrip;
    const branchId = selectedBranch;
    const userId = '1000111';
  
    const deliveryStatusId = tempStatus[lineNumber] || customer.deliveryStatusId;
  
    console.log(
      `Submitting for Line: ${lineNumber}, Trip ID: ${tripId}, Branch ID: ${branchId}, TransId: ${transId}, Delivery Status: ${deliveryStatusId}`
    );
  
    if (!deliveryStatusId || !transId) {
      console.error('Missing deliveryStatusId or transId');
      return;
    }
  
    const url = `${local_URL}/api/DeliveryStatus/PostDeliveryStatus?TripId=${tripId}&BranchId=${branchId}&TransTypeId=${transTypeID}&TransId=${transId}&NewDeliveryStatusCode=${deliveryStatusId}&UserId=${userId}`;
  
    try {
      const response = await axios.post(url);
      console.log(`Status updated for ${lineNumber}:`, response.data);
  
      // Update the actual customer status
      updateCustomerStatus(lineNumber, deliveryStatusId);
  
      // Clear the temporary status
      setTempStatus(prev => {
        const newTemp = {...prev};
        delete newTemp[lineNumber];
        return newTemp;
      });
  
      // Mark the item as submitted
      setSubmittedItems(prev => ({...prev, [lineNumber]: true}));
  
      // Show success toast
      Toast.show({
        type: 'success',
        text1: `Status updated for ${customerName}`,
        visibilityTime: 2500,
        autoHide: true,
      });
    } catch (error) {
      console.error(`Error updating status for ${lineNumber}:`, error);
      // Show error toast
      Toast.show({
        type: 'error',
        text1: `Error updating status for ${lineNumber}`,
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => setShowUserProfile(false)}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedBranch}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedBranch(itemValue)}
            >
              <Picker.Item label="Select Branch" value="" />
              {branches.map((branch) => (
                <Picker.Item key={branch.branchID} label={branch.branchName} value={branch.branchID} />
              ))}
            </Picker>
          </View>
          {selectedBranch && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedTrip}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedTrip(itemValue)}
              >
                <Picker.Item label="Select Trip" value="" />
                {trips.map((trip) => (
                  <Picker.Item
                    key={trip.tripID}
                    label={`${trip.tripID} - ${trip.vehicleNo}`}
                    value={trip.tripID}
                  />
                ))}
              </Picker>
            </View>
          )}
          <View>
            <TouchableOpacity
              onPress={() => setShowUserProfile(!showUserProfile)}
              style={styles.userProfile}
            >
              <FontAwesome name="user" size={40} />
            </TouchableOpacity>
          </View>
          {showUserProfile && (
            <View style={styles.userProfileMenu}>
              <Text style={{ fontSize: 24, marginBottom: 6 }}>User: {loggedInUser}</Text>
              <Button
                title="Logout"
                onPress={() =>
                  navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
                }
              />
            </View>
          )}
        </View>
        <View style={styles.itemRows}>
          <Text style={styles.headerText}>Customer Name</Text>
        </View>
        <FlatList
          data={customers}
          keyExtractor={(item) =>
            item.lineNumber ? item.lineNumber.toString() : Math.random().toString()
          }
          renderItem={({ item }) => (
            <View style={styles.customerNameContainer}>
              <View style={styles.Text}>
                <Text style={styles.itemText}>Name - {item.customerName}</Text>
                <Text style={styles.itemText}>Address - {item.customerAddress}</Text>
                <Text style={styles.itemText}>{item.placeName}</Text>
                <Text style={styles.itemText}>Mob No. - {item.mobile}</Text>
                <Text style={styles.itemText}>Bill No.- {item.transId}</Text>
                <Text style={styles.itemText1}>Amount - ₹{item.amountToCollect}</Text>
              </View>
              <View style={styles.Text2}>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      fontSize: 17,
                      textAlign: 'center',
                      marginBottom: 7,
                      color: 'blue',
                    }}
                  >
                    Status:
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      textAlign: 'center',
                      marginBottom: 7,
                      color: 'red',
                    }}
                  >
                    {' '}
                    {item.deliveryStatusId}
                  </Text>
                </View>
                <View style={styles.pickerContainer1}>
                <Picker
  selectedValue={tempStatus[item.lineNumber] || item.deliveryStatusId}
  style={styles.picker1}
  onValueChange={(value) => {
    if (item.deliveryStatusId !== 'CL' && item.deliveryStatusId !== 'CN') {
      console.log(
        `Selecting status for Line: ${item.lineNumber}, New Status: ${value}`
      );
      setTempStatus(prev => ({...prev, [item.lineNumber]: value}));
    }
  }}
  enabled={!submittedItems[item.lineNumber] && item.deliveryStatusId !== 'CN' && item.deliveryStatusId !== 'CL'}
>
  <Picker.Item label="select" value="" />
  <Picker.Item label="Close" value="CL" />
  <Picker.Item label="Cancel" value="CN" />
</Picker>
</View>
<TouchableOpacity
  onPress={() => {
    console.log(
      `Submitting status for Line: ${item.lineNumber}, Status: ${tempStatus[item.lineNumber] || item.deliveryStatusId}`
    );
    submitStatusUpdate(item.lineNumber);
  }}
  disabled={
    submittedItems[item.lineNumber] ||
    item.deliveryStatusId === 'CL' ||
    item.deliveryStatusId === 'CN' ||
    ((tempStatus[item.lineNumber] || item.deliveryStatusId) !== 'CL' &&
     (tempStatus[item.lineNumber] || item.deliveryStatusId) !== 'CN')
  }
>
  <Text style={[
    styles.submitButton,
    submittedItems[item.lineNumber] ? styles.submittedButton : null,
    (item.deliveryStatusId === 'CL' || item.deliveryStatusId === 'CN') ? styles.disabledButton : null
  ]}>
    {submittedItems[item.lineNumber] ? 'Submitted' : 
     (item.deliveryStatusId === 'CL' || item.deliveryStatusId === 'CN') ? 'Closed' : 'Submit'}
  </Text>
</TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    height: 70,
    zIndex: 2,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 4,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginLeft: 8,
    flex: 1,
  },
  submittedButton: {
    backgroundColor: '#cccccc',
  },
  pickerContainer1: {
    borderWidth: 0.5,
    borderColor: 'green',
    borderRadius: 4,
    backgroundColor: '#fff',
    overflow: 'visible',
  },
  picker: {
    height: 50,
    width: 'auto',
  },
  picker1: {
    height: 50,
    width: 135,
  },
  userProfile: {
    flexDirection: 'row',
    marginRight: 6,
    marginLeft: 10,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 40,
    backgroundColor: 'white',
    borderColor: 'green',
    flex: 1,
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
    flex: 1,
    marginLeft: 4,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#ccc',
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
  customerNameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  Text: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'center',
  },
  Text2: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 14,
    margin: 1,
    textAlign: 'center',
  },
  itemText1: {
    fontSize: 16,
    margin: 1,
    fontWeight: 'bold',
    color: 'red',
  },
  submitButton: {
    backgroundColor: '#17C05B',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 15,
    marginLeft: 4,
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 7,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    textAlign: 'center',
  },
});
