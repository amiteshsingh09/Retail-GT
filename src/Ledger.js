import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Text, StyleSheet, FlatList, Button, Animated, ActivityIndicator, Modal } from "react-native";
import axios from "axios";
import { Calendar } from 'react-native-calendars';
import { useRoute, useNavigation } from '@react-navigation/native'; // Import useNavigation
import { local_URL } from './Constants';
import { FontAwesome } from '@expo/vector-icons';

export const Ledger = () => {
  const route = useRoute();
  const navigation = useNavigation(); // Get the navigation object
  const { customerName, customerId , username , userId } = route.params;
  const [ledgerData, setLedgerData] = useState([]);
  const [totalReceivable, setTotalReceivable] = useState(0);
  const [totalReceipt, setTotalReceipt] = useState(0);
  const [overallBalance, setOverallBalance] = useState(0);
  const [lastReceipt, setLastReceipt] = useState(0);
  const [lastReceiptDate, setLastReceiptDate] = useState('');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [formattedFromDate, setFormattedFromDate] = useState('');
  const [formattedToDate, setFormattedToDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarType, setCalendarType] = useState('');
  const [loading, setLoading] = useState(false);
  const [cnAdjusted, setCnAdjusted] = useState(0);
  const [fromDateButtonText, setFromDateButtonText] = useState('Select From Date');
  const [toDateButtonText, setToDateButtonText] = useState('Select To Date');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const animatedValues = useRef([]).current;

  useEffect(() => {
    const today = new Date();
    const pastWeek = new Date();
    pastWeek.setDate(today.getDate() - 10);
  
    setFromDate(pastWeek);
    setToDate(today);
    setFormattedFromDate(pastWeek.toISOString().split('T')[0]);
    setFormattedToDate(today.toISOString().split('T')[0]);
    setFromDateButtonText(pastWeek.toISOString().split('T')[0]);
    setToDateButtonText(today.toISOString().split('T')[0]);

    fetchLedgerData(pastWeek, today);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    fetchLedgerData(fromDate, toDate);

    animatedValues.splice(0, animatedValues.length, ...ledgerData.map(() => new Animated.Value(0)));

    Animated.stagger(
      50,
      animatedValues.map(anim =>
        Animated.spring(anim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [fromDate, toDate]);

  const handleNavigateToList = (customer) => {
    navigation.navigate('Order', {
      customerName: customerName,
      customerId: customerId,
      username: username,
      userId: userId,
     
      // Ensure to provide other necessary parameters or fetch them as needed
    });
  };

  const fetchLedgerData = async (fromDate, toDate) => {
    setLoading(true);
    try {
        const formattedFromDate = fromDate.toISOString().split('T')[0].replace(/-/g, '');
        const formattedToDate = toDate.toISOString().split('T')[0].replace(/-/g, '');
        const response = await axios.get(
            `${local_URL}/api/Ledger/Get/L111/${customerId}/${formattedFromDate}/${formattedToDate}`
        );
        const sortedData = response.data.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
        
        const cumulativeBalances = sortedData.reduce((acc, item) => {
            const receivable = item.receivable || 0;
            const receipt = item.receipt || 0;
            const balance = receivable - receipt;

            const lastBalance = acc.length > 0 ? acc[acc.length - 1].cumulativeBalance : 0;
            const cumulativeBalance = lastBalance + balance;

            const formattedDate = item.businessDate.slice(0, 10);

            acc.push({ ...item, balance, cumulativeBalance, formattedDate });
            return acc;
        }, []);
        
        setLedgerData(cumulativeBalances);

        const totalReceivable = cumulativeBalances.reduce((sum, item) => sum + (item.receivable || 0), 0);
        const totalReceipt = cumulativeBalances.reduce((sum, item) => sum + (item.receipt || 0), 0);
        const overallBalance = totalReceivable - totalReceipt;

        // Calculate CN Adjusted based on receipt amounts
        const totalCreditNote = cumulativeBalances.reduce((sum, item) => sum + (item.cNissued || 0), 0);
        const cnAdjusted = totalReceipt - totalCreditNote;

        const lastReceipt = cumulativeBalances
            .filter(item => item.receipt > 0)
            .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))[0]?.receipt || 0;

        const lastReceiptItem = cumulativeBalances.find(item => item.receipt === lastReceipt);
        if (lastReceiptItem) {
            setLastReceiptDate(lastReceiptItem.formattedDate);
        } else {
            setLastReceiptDate('');
        }

        setTotalReceivable(totalReceivable);
        setTotalReceipt(totalReceipt);
        setOverallBalance(overallBalance);
        setLastReceipt(lastReceipt);
        setCnAdjusted(cnAdjusted); // Set CN Adjusted based on receipt amount

    } catch (error) {
        console.error('Error fetching ledger data:', error);
    } finally {
        setLoading(false);
    }
};

  
  

  const handleDateChange = (day) => {
    const selectedDate = new Date(day.dateString);
    if (calendarType === 'fromDate') {
      setFormattedFromDate(day.dateString);
      setFromDate(selectedDate);
      setFromDateButtonText(day.dateString);
    } else if (calendarType === 'toDate') {
      setFormattedToDate(day.dateString);
      setToDate(selectedDate);
      setToDateButtonText(day.dateString);
    }
    setShowCalendar(false);
  };

  const openCalendar = (type) => {
    setCalendarType(type);
    setShowCalendar(true);
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.entry}>
        <View style={styles.inputRow}>
          <View style={styles.inputColumn}>
            <Text style={styles.columnText}>{item.isO_Number}</Text>
            <Text style={styles.columnText}>₹{item.cNissued}</Text>
          </View>
          <View style={styles.inputColumn}>
            <Text style={styles.columnText}>{item.businessDate}</Text>
            <Text style={styles.columnTextR}>₹{item.receivable} </Text>
          </View>
          <View style={styles.inputColumn}>
            <Text style={styles.columnText}>{item.transTypeID}</Text>
            <Text style={styles.columnTextB}>₹{item.receipt} </Text>
          </View>
          <View style={styles.inputColumn}>
            <Text style={styles.columnText}>{item.refSale}</Text>
            <Text style={styles.columnTextB}>₹{item.cumulativeBalance}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loaderText}>Loading...</Text>
        </View>
      )}
      <View style={{ flexDirection:'row',justifyContent:'space-between'}}>
      <Animated.Text style={[styles.customerName, { opacity: fadeAnim }]}>{customerName}</Animated.Text>
      <View style={{justifyContent:'center'}}>
      {/* <TouchableOpacity onPress={() => handleNavigateToList({ customerId })} style={styles.orderButton}>
      <FontAwesome name='shopping-cart' size={25} color="#fff" />
      </TouchableOpacity> */}
      </View>
    </View>
      <View style={styles.datePickerContainer}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Button onPress={() => openCalendar('fromDate')} title={fromDateButtonText} />
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Button onPress={() => openCalendar('toDate')} title={toDateButtonText} />
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showCalendar}
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Calendar
              current={calendarType === 'fromDate' ? formattedFromDate : formattedToDate}
              minDate={'2000-01-01'}
              maxDate={'2099-12-31'}
              onDayPress={handleDateChange}
              markedDates={{
                [calendarType === 'fromDate' ? formattedFromDate : formattedToDate]: { selected: true, selectedColor: '#3498db' },
              }}
            />
            <Button title="Close" onPress={() => setShowCalendar(false)} />
          </View>
        </View>
      </Modal>

      <View style={styles.summaryContainer}>
  <Animated.View style={[styles.section, styles.receiptSection, { transform: [{ scale: scaleAnim }] }]}>
    <Text style={styles.sectionHeader}>Last Receipt</Text>
    <Text style={styles.sectionText}>₹{lastReceipt}</Text>
    <Text style={styles.sectionText}>{lastReceiptDate}</Text>
  </Animated.View>
  <Animated.View style={[styles.section, styles.balanceSection, { transform: [{ scale: scaleAnim }] }]}>
    <Text style={styles.sectionHeader}>Overall Balance</Text>
    <Text style={styles.sectionText}>₹{overallBalance}</Text>
  </Animated.View>
  {/* <Animated.View style={[styles.section, styles.cnAdjustedSection, { transform: [{ scale: scaleAnim }] }]}>
    <Text style={styles.sectionHeader}>CN Adjusted</Text>
    <Text style={styles.sectionText}>₹{cnAdjusted}</Text>
  </Animated.View> */}
</View>

      <View style={styles.header}>
        <View style={styles.inputRow}>
          <View style={styles.inputColumn}>
            <Text style={styles.headerText}>Doc No</Text>
            <Text style={styles.headerText}>CN Issue</Text>
          </View>
          <View style={styles.inputColumn}>
            <Text style={styles.headerText}>Date</Text>
            <Text style={styles.headerText}>Receivable</Text>
          </View>
          <View style={styles.inputColumn}>
            <Text style={styles.headerText}>TransType</Text>
            <Text style={styles.headerText}>Receipt</Text>
          </View>
          <View style={styles.inputColumn}>
            <Text style={styles.headerText}>Ref Sale</Text>
            <Text style={styles.headerText}>Balance</Text>
          </View>
        </View>
      </View>

      <View style={styles.flatListContainer}>
        <FlatList
          data={ledgerData}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.parentSaleID}-${index}`}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>No ledger data available</Text>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f3f6',
  },
  header: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    padding: 8,
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  headerText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
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
  customerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#4a4a4a',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    alignContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#5d6d7e',
    fontWeight: '600',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  section: {
    borderRadius: 15,
    padding: 12,
    flex: 1,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  sectionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  receiptSection: {
    backgroundColor: '#e8f8f5',
  },
  balanceSection: {
    backgroundColor: '#f0f3f4',
  },
  entry: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#3498db',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputColumn: {
    flex: 1,
    alignItems: 'center',
  },
  columnText: {
    fontSize: 12,
    color: '#34495e',
  },
  columnTextB: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '600',
  },
  columnTextR: {
    fontSize: 14,
    color: '#c0392b',
    fontWeight: '600',
  },
  flatListContainer: {
    flex: 1,
  },
  emptyListText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 18,
    color: '#3498db',
  },
});


export default Ledger;








// CN Adjusted


// const fetchLedgerData = async (fromDate, toDate) => {
//   setLoading(true);
//   try {
//       const formattedFromDate = fromDate.toISOString().split('T')[0].replace(/-/g, '');
//       const formattedToDate = toDate.toISOString().split('T')[0].replace(/-/g, '');
//       const response = await axios.get(
//           `${local_URL}/api/Ledger/Get/L111/${customerId}/${formattedFromDate}/${formattedToDate}`
//       );
//       const sortedData = response.data.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
      
//       const cumulativeBalances = sortedData.reduce((acc, item) => {
//           const receivable = item.receivable || 0;
//           const receipt = item.receipt || 0;
//           const balance = receivable - receipt;

//           const lastBalance = acc.length > 0 ? acc[acc.length - 1].cumulativeBalance : 0;
//           const cumulativeBalance = lastBalance + balance;

//           const formattedDate = item.businessDate.slice(0, 10);

//           acc.push({ ...item, balance, cumulativeBalance, formattedDate });
//           return acc;
//       }, []);

//       setLedgerData(cumulativeBalances);

//       const totalReceivable = cumulativeBalances.reduce((sum, item) => sum + (item.receivable || 0), 0);
//       const totalReceipt = cumulativeBalances.reduce((sum, item) => sum + (item.receipt || 0), 0);
//       const overallBalance = totalReceivable - totalReceipt;

//       // Calculate CN Adjusted based on receipt and paymentGatewayName
//       const totalReceiptAmount = cumulativeBalances.reduce((sum, item) => sum + (item.receipt || 0), 0);
//       const totalReceiptWithCN = cumulativeBalances
//           .filter(item => item.paymentGatewayName === 'receipt')
//           .reduce((sum, item) => sum + (item.receipt || 0), 0);

//       const cnAdjusted = totalReceiptAmount - totalReceiptWithCN;

//       const lastReceipt = cumulativeBalances
//           .filter(item => item.receipt > 0)
//           .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))[0]?.receipt || 0;

//       const lastReceiptItem = cumulativeBalances.find(item => item.receipt === lastReceipt);
//       if (lastReceiptItem) {
//           setLastReceiptDate(lastReceiptItem.formattedDate);
//       } else {
//           setLastReceiptDate('');
//       }

//       setTotalReceivable(totalReceivable);
//       setTotalReceipt(totalReceiptAmount); // Update with total receipt amount
//       setOverallBalance(overallBalance);
//       setLastReceipt(lastReceipt);
//       setCnAdjusted(cnAdjusted); // Set CN Adjusted based on the receipt amount

//   } catch (error) {
//       console.error('Error fetching ledger data:', error);
//   } finally {
//       setLoading(false);
//   }
// };