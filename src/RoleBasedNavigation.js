// import React, { useState, useEffect } from 'react';
// import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView, StatusBar, FlatList, TextInput } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { local_URL } from './Constants';

// export const RoleBasedNavigation = ({ route }) => {
//   const { userId, userName, userRole } = route.params;
//   const navigation = useNavigation();
//   const [branchData, setBranchData] = useState([]);
//   const [filteredBranchData, setFilteredBranchData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     if (userRole === 'AMGR1') {
//       const fetchData = async () => {
//         try {
//           const response = await fetch(`${local_URL}/api/ApprovalRequest/GetSummary/PN`);
//           const data = await response.json();
//           setBranchData(data);
//           setFilteredBranchData(data);
//         } catch (error) {
//           console.error('Error fetching branch data:', error);
//         }
//       };
//       fetchData();
//     }
//   }, [userRole]);

//   const navigateToBeatScreen = () => {
//     navigation.navigate('General Trading', { userId, username: userName, userRole });
//   };

//   const navigateToDelivery = () => {
//     navigation.navigate('DeliveryList', { userId, username: userName, userRole });
//   };

//   const navigateToIndent = () => {
//     navigation.navigate('Indent Request', { userId, username: userName, userRole });
//   };

//   const navigateToRequestApprovalScreen = (branchId) => {
//     navigation.navigate('Sale Cancellation Request', { userId, username: userName, userRole, branchId });
//   };

//   const handleLogout = async () => {
//     try {
//       navigation.reset({
//         index: 0,
//         routes: [{ name: 'Login' }],
//       });
//     } catch (error) {
//       console.error('Error during logout:', error);
//       Alert.alert('Logout Error', 'An error occurred while logging out. Please try again.');
//     }
//   };

//   const handleSearch = (text) => {
//     setSearchTerm(text);
//     const filteredBranches = branchData.filter(branch =>
//       branch.requestBranchId.toLowerCase().includes(text.toLowerCase()) ||
//       branch.requestBranchName.toLowerCase().includes(text.toLowerCase())
//     );
//     setFilteredBranchData(filteredBranches);
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.branchItem}
//       onPress={() => navigateToRequestApprovalScreen(item.requestBranchId)}
//     >
//       <Text style={styles.branchId}>{item.requestBranchId}</Text>
//       <Text style={styles.branchName}>{item.requestBranchName}</Text>
//       <Text style={styles.requestCount}>{item.requestCount}</Text>
//     </TouchableOpacity>
//   );



//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" />
//       <LinearGradient
//         colors={['white', '#f5f5f5']}
//         style={styles.gradient}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 0, y: 1 }}
//       >
//         <View style={styles.header}>
//           <View style={styles.userInfoContainer}>
//             <Text style={styles.userInfoText}>User Name: {userName}</Text>
//           </View>
//           <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
//             <Text style={styles.logoutButtonText}>Logout</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.buttonContainer}>
//           {userRole === 'SLPAX' && (
//             <TouchableOpacity style={styles.button} onPress={navigateToBeatScreen}>
//               <Text style={styles.buttonText}>Go to General Trading</Text>
//             </TouchableOpacity>
//           )}
//           {userRole === 'DLPAX' && (
//             <TouchableOpacity style={styles.button} onPress={navigateToDelivery}>
//               <Text style={styles.buttonText}>Go to Delivery Screen</Text>
//             </TouchableOpacity>
//           )}
//           {userRole === 'AMGR1' && (
//             <View style={styles.amgr1Container}>
//               {/* <TouchableOpacity style={styles.button} onPress={navigateToIndent}>
//                 <Text style={styles.buttonText}>Go to Beat Screen</Text>
//               </TouchableOpacity> */}
//               <TextInput
//                 style={styles.searchInput}
//                 placeholder="Search Branch ID or Name"
//                 value={searchTerm}
//                 onChangeText={handleSearch}
//               />
//               <View style={styles.listHeader}>
//                 <Text style={styles.listHeaderText}>Branch ID</Text>
//                 <Text style={styles.listHeaderText1}>Branch Name</Text>
//                 <Text style={styles.listHeaderText}>Request Count</Text>
//               </View>
//               <FlatList
//                 data={filteredBranchData}
//                 renderItem={renderItem}
//                 keyExtractor={(item, index) => `${item.requestBranchId}_${index}`}
//                 style={styles.branchList}
//               />
//             </View>
//           )}
//           {userRole === 'ADMIN' && (
//             <TouchableOpacity style={styles.button} onPress={navigateToBeatScreen}>
//               <Text style={styles.buttonText}>Go to General Trading</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
    
//   },
//   gradient: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     paddingTop: 50,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//     paddingHorizontal: 20,
//     marginBottom: 30,
//   },
//   userInfoContainer: {
//     flex: 1,
//   },
//   branchItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//     backgroundColor: 'white',
//     marginBottom:1,
//   },
//   branchId: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     flex: 1,
//   },
//   branchName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     flex: 2,
//   },
//   requestCount: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#008751',
//     flex: 1,
//     textAlign: 'right',
//   },
//   userInfoText: {
//     fontSize: 18,
//     color: '#008751',
//     fontWeight: 'bold',
//   },
//   logoutButton: {
//     backgroundColor: '#ff3b30',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     elevation: 3,
//   },
//   logoutButtonText: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   buttonContainer: {
//     width: '90%',
    
//   },
//   button: {
//     backgroundColor: '#008751',
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 20,
    
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600'
//     ,
//   },
//   searchInput: {
//     backgroundColor: '#f0f0f0',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 25,
//     marginBottom: 20,
//     marginTop: 15,
//     fontSize: 16,
//   },
//   amgr1Container: {
//     width: '100%',
    
//   },
//   listHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: '#e0e0e0',
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//   },
//   listHeaderText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     flex: 1,
//     textAlign: 'center',
//   },
//   listHeaderText1: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     flex: 3,
//     textAlign: 'center',
//   },
//   branchList: {
//     maxHeight: 400,
//     width: '100%',
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
// });

// export default RoleBasedNavigation;









import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView, StatusBar, FlatList, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { FontAwesome } from '@expo/vector-icons';
import { local_URL } from './Constants';

export const RoleBasedNavigation = ({ route }) => {
  const { userId, userName, userRole } = route.params;
  const navigation = useNavigation();
  const [branchData, setBranchData] = useState([]);
  const [filteredBranchData, setFilteredBranchData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const username = userName;

  const fetchBranchData = useCallback(async () => {
    try {
      const response = await fetch(`${local_URL}/api/ApprovalRequest/GetSummary/PN`);
      const data = await response.json();
      setBranchData(data);
      setFilteredBranchData(data);
    } catch (error) {
      console.error('Error fetching branch data:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (userRole === 'AMGR1') {
        fetchBranchData();
      }
    }, [fetchBranchData, userRole])
  );

  const navigateToBeatScreen = () => {
    navigation.navigate('General Trading', { userId, username, userRole });
  };

  const navigateToDelivery = () => {
    navigation.navigate('DeliveryList', { userId, username, userRole });
  };

  const navigateToCollection = () => {
    navigation.navigate('Collection', { userId, username, userRole });
  };

  const navigateToIndent = () => {
    navigation.navigate('Indent Request', { userId, username, userRole });
    console.log("--------",username);
  };

  const navigateToRequestApprovalScreen = (branchId) => {
    navigation.navigate('Sale Cancellation Request', { userId, username, userRole, branchId });
  };

  const handleLogout = async () => {
    try {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Logout Error', 'An error occurred while logging out. Please try again.');
    }
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    const filteredBranches = branchData.filter(branch =>
      branch.requestBranchId.toLowerCase().includes(text.toLowerCase()) ||
      branch.requestBranchName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredBranchData(filteredBranches);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => navigateToRequestApprovalScreen(item.requestBranchId)}>
      <Animatable.View animation="fadeInUp" delay={index * 100} style={styles.branchItem}>
        <Text style={styles.branchId}>{item.requestBranchId}</Text>
        <Text style={styles.branchName}>{item.requestBranchName}</Text>
        <Text style={styles.requestCount}>{item.requestCount}</Text>
      </Animatable.View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#f0f8ff', '#e6f3ff']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Animatable.View animation="fadeIn" style={styles.header}>
          <View style={styles.userInfoContainer}>
            <Text style={styles.userInfoText}>User Name: {userName}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </Animatable.View>
        <View style={styles.buttonContainer}>
          {userRole === 'SLPAX' && (
            <Animatable.View animation="bounceIn">
              <TouchableOpacity style={styles.button} onPress={navigateToBeatScreen}>
                <FontAwesome name="shopping-cart" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Go to General Trading</Text>
                {/* <Text style={styles.buttonText}>Indent</Text> */}
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={navigateToIndent}>
                <FontAwesome name="shopping-cart" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Indent</Text>
               </TouchableOpacity>
              {/* <TouchableOpacity style={styles.button} onPress={navigateToCollection}>
                <FontAwesome name="book" size={20} color="#fff" style={styles.buttonIcon} /> */}
                {/* <Text style={styles.buttonText}>Go to Collection</Text> */}
              {/* </TouchableOpacity> */}
            </Animatable.View>
          )}
          {userRole === 'DLPAX' && (
            <Animatable.View animation="bounceIn">
              <TouchableOpacity style={styles.button} onPress={navigateToDelivery}>
                <Text style={styles.buttonText}>Go to Delivery Screen</Text>
              </TouchableOpacity>
            </Animatable.View>
          )}
          {userRole === 'AMGR1' && (
            <Animatable.View animation="fadeInUp" style={styles.amgr1Container}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search Branch ID or Name"
                value={searchTerm}
                onChangeText={handleSearch}
              />
              <Animatable.View animation="fadeIn" style={styles.listHeader}>
                <Text style={styles.listHeaderText}>Branch ID</Text>
                <Text style={styles.listHeaderText1}>Branch Name</Text>
                <Text style={styles.listHeaderText}>Request Count</Text>
              </Animatable.View>
              <FlatList
                data={filteredBranchData}
                renderItem={renderItem}
                keyExtractor={(item) => item.requestBranchId} 
                style={styles.branchList}
              />
            </Animatable.View>
          )}
          {userRole === 'ADMIN' && (
            <Animatable.View animation="bounceIn">
              <TouchableOpacity style={styles.button} onPress={navigateToBeatScreen}>
                <FontAwesome name="shopping-cart" size={20} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Go to General Trading</Text>
              </TouchableOpacity>
            </Animatable.View>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  userInfoContainer: {
    flex: 1,
  },
  userInfoText: {
    fontSize: 18,
    color: '#008751',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonContainer: {
    width: '90%',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#008751',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  amgr1Container: {
    width: '100%',
  },
  searchInput: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 20,
    marginTop: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#008751',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  listHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  listHeaderText1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 3,
    textAlign: 'center',
  },
  branchList: {
    maxHeight: 400,
    width: '100%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  branchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  branchId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  branchName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 3,
  },
  requestCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#008751',
    flex: 1,
    textAlign: 'right',
  },
});

export default RoleBasedNavigation;
