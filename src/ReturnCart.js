// ReturnCart.js
import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {local_URL} from './Constants'

export const ReturnCart = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { itemDetails, saleId ,totalQuantity, totalPrice, customerName, branchId , userId, customerId , username , userRole} = route.params || {};

  const parsedItemDetails = typeof itemDetails === 'string' ? JSON.parse(itemDetails) : itemDetails;

  const handleEdit = () => {
    navigation.navigate('Sale Return',{
      username:username,
      userId:userId
    });
  };
  
  console.log("hello", {username})

  const handleOrderNow = async () => {
    const dataToSend = {
      customerID: customerId,
      parentSaleBranchID: branchId,
      parentSaleID: "string",
      returnByEmpID: customerId,
      remarks: 'string',
      createdUserID: customerId,
      retDetails: parsedItemDetails.map((item) => ({
        lineNumber: item.lineNumber,
        parentSaleBranchId: item.branchId,
        parentSaleId: item.saleId,
        parentSaleLineNumber: item.lineNumber,
        itemId: item.itemId,
        batchNumber: item.batchNumber,
        itemStatusId: "OK",
        qty: item.quantity,
      }))
    };

    try {
      const response = await axios.post(`${local_URL}/api/GTSaleReturn`, dataToSend);
      console.log('Order placed successfully:', response.data);
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
            userRole : userRole
          });
          console.log("userId", userId);
          console.log("userId", username);
          console.log("userRole", userRole);
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
        {parsedItemDetails.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemText}>Batch Number: {item.batchNumber}</Text>
            <Text style={styles.itemText}>Item Name: {item.itemName}</Text>
            <View style={{flex:1 , flexDirection:'row'}}>
            
            <Text style={styles.itemText1}>Quantity: {item.quantity}</Text>
            <Text style={styles.itemText1}>Price: {item.price.toFixed(2)}</Text>
            </View>
            
          </View>
        ))}
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>Total Items: {parsedItemDetails.length}</Text>
        <Text style={styles.summaryText}>Total Quantity: {totalQuantity}</Text>
        <Text style={styles.summaryText}>Total Price: {totalPrice}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Edit" onPress={handleEdit} color="#007BFF" />
        <Button title="Return Order" onPress={handleOrderNow} color="#28A745" />
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
    flex:1,
    color: '#333',
  },
  itemText1: {
    fontSize: 16,
    color: '#333',
    flex:1,
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



// ReturnCart.js
// import React from 'react';
// import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import axios from 'axios';
// import Toast from 'react-native-toast-message';
// import {local_URL} from './Constants'

// export const ReturnCart = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { onOrderPlaced } = route.params;
 
  
//   const { itemDetails, totalQuantity, totalPrice, customerName, branchId, userId, customerId , username , userRole} = route.params;

//   const parsedItemDetails = typeof itemDetails === 'string' ? JSON.parse(itemDetails) : itemDetails;

//   const handleEdit = () => {
//     navigation.navigate('OrderReturn', {
//       onOrderPlaced: onOrderPlaced,
//       userId: userId,
//       customerId: customerId,
//       username: username,
//       userRole: userRole,
//       customerName: customerName, 
//       items: parsedItemDetails, 
//       quantities: parsedItemDetails.reduce((acc, item) => {
//         acc[item.batchNumber] = item.quantity.toString();
//         return acc;
//       }, {})
//     });
//   };
  
//   console.log("hello", {username})

//   const handleOrderNow = async () => {
//     const dataToSend = {
//       customerID: customerId,
//       parentSaleBranchID: "string",
//       parentSaleID: "string",
//       returnByEmpID: "" ,
//       remarks: 'string',
//       createdUserID: 'string',
//       retDetails: parsedItemDetails.map((item) => ({
//         lineNumber: item.lineNumber,
//         parentSaleBranchId: item.branchId,
//         parentSaleId: item.saleId,
//         parentSaleLineNumber: item.lineNumber,
//         itemId: item.itemId,
//         batchNumber: item.batchNumber,
//         itemStatusId: "OK",
//         qty: item.quantity,
//       }))
//     };

//     try {
//       const response = await axios.post(`${local_URL}/api/GTSaleReturn`, dataToSend);
//       console.log('Order placed successfully:', response.data);
//       onOrderPlaced();
//       Toast.show({
//         type: 'success',
//         text1: 'Order placed successfully',
//         position: 'top',
//         autoHide: true,
//         visibilityTime: 900,
//         onHide: () => {
//           navigation.navigate('Beat', {
//             username: username,
//             userId: userId,
//             userRole : userRole
//           });
//           console.log("userId", userId);
//           console.log("userId", username);
//           console.log("userRole", userRole);
//         }
        
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
//         {parsedItemDetails.map((item, index) => (
//           <View key={index} style={styles.item}>
//             <Text style={styles.itemText}>Batch Number: {item.batchNumber}</Text>
//             <Text style={styles.itemText}>Item Name: {item.itemName}</Text>
//             <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
//             <Text style={styles.itemText}>Price: {item.price.toFixed(2)}</Text>
//           </View>
//         ))}
//       </View>
//       <View style={styles.summaryCard}>
//         <Text style={styles.summaryText}>Total Items: {parsedItemDetails.length}</Text>
//         <Text style={styles.summaryText}>Total Quantity: {totalQuantity}</Text>
//         <Text style={styles.summaryText}>Total Price: {totalPrice}</Text>
//       </View>
//       <View style={styles.buttonContainer}>
//         <Button title="Edit" onPress={handleEdit} color="#007BFF" />
//         <Button title="Return Order" onPress={handleOrderNow} color="#28A745" />
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
