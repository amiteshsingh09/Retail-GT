import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { local_URLD } from './Constants';

export const IndentCart = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { onOrderPlaced } = route.params || {};
  const itemDetails = route.params?.itemDetails ? JSON.parse(decodeURIComponent(route.params.itemDetails)) : [];
  const totalQuantity = route.params?.totalQuantity || 0;
  const totalPrice = route.params?.totalPrice || 0;
  const customerName = route.params?.customerName || '';
  const branchId = route.params?.branchId || '';
  const fromLocation = route.params?.fromLocation || '';
  const { username, userId, userRole } = route.params || {};

  const handleEdit = () => {
    navigation.navigate('Indent Request', {
      onOrderPlaced: onOrderPlaced,
      userId: userId,
      username: username,
      userRole: userRole
    });
    console.log("--------",username);
  };

  const handleOrderNow = async () => {
    const dataToSend = {
      indentId: "",
      branchId: "R111",
      indentType: "INDENT",
      toBranchType: "IBST",
      toBranchId: branchId,
      businessDate: new Date().toISOString(),
      remarks: "",
      isO_Number: "",
      deleted: "",
      posted: true,
      createdUserID: userId,
      createdDate: new Date().toISOString(),
      modifiedUserID: "",
      modifiedDate: new Date().toISOString(),
      deletedUserID: "",
      deletedDate: new Date().toISOString(),
      postedUserID: "",
      postedDate: new Date().toISOString(),
      piDetails: itemDetails.map((item) => {
        let qty, altQty;
        
        if (item.sellByWeight) {
          if (item.altQtyEnabled) {
            qty = item.kg.toString();
            altQty = item.nos.toString();
          } else {
            qty = item.kg.toString();
            altQty = '0';
          }
        } else {
          qty = item.nos.toString();
          altQty = '0';
        }
  
        return {
          lineNumber: item.lineNumber,
          itemName: item.itemName,
          nos: "",
          kgs: "",
          rate: item.rate || 0,
          remarks: "",
          deleted: "N",
          itemID: item.itemId,
          currentStockQty: 0,
          currentStockAltQty: 0,
          createdUserId: "",
          createdDate: new Date().toISOString(),
          modifiedUserId: "",
          modifiedDate: new Date().toISOString(),
          deletedUserId: "",
          deletedDate: new Date().toISOString(),
          altQtyEnabled: item.altQtyEnabled,
          sellByWeight: item.sellByWeight,
          dml: "I",
          qty: qty,
          altQty: altQty,
        };
      }),
    };
  
    try {
      const response = await axios.post(`${local_URLD}/api/PI`, dataToSend);
      console.log('Order placed successfully:', response.data);
      Toast.show({
        type: 'success',
        text1: 'Order placed successfully',
        position: 'top',
        autoHide: true,
        visibilityTime: 900,
        onHide: () => {
          navigation.navigate('Home', {
            userName: username,
            userId: userId,
            userRole: userRole,
          });
        },
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
            <Text style={styles.itemText}>Item ID: {item.itemId}</Text>
            {item.kg > 0 && <Text style={styles.itemText}>Weight: {item.kg} kg</Text>}
            {item.nos > 0 && <Text style={styles.itemText}>Number of Items: {item.nos}</Text>}
          </View>
        ))}
      </View>
      {/* <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>Total Items: {itemDetails.length}</Text>
        <Text style={styles.summaryText}>Total Quantity: {totalQuantity}</Text>
        <Text style={styles.summaryText}>Total Price: {totalPrice}</Text>
      </View> */}
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
