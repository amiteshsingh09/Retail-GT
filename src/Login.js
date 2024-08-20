// import React, { useState } from 'react';
// import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, Dimensions } from 'react-native';
// import axios from 'axios';
// import { useNavigation } from '@react-navigation/native';
// import Toast from 'react-native-toast-message';
// import { LinearGradient } from 'expo-linear-gradient';
// import { local_URL } from './Constants';


// export const Login = () => {
//   const { height, width } = Dimensions.get('window');
//   const navigation = useNavigation();

//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const saveData = async () => {
//     setLoading(true);
//     if (!name.trim() || !password.trim()) {
//       Toast.show({
//         type: 'error',
//         text1: 'Invalid credentials',
//         text2: 'Please enter both username and password',
//         position: 'top'
//       });
//       setLoading(false);
//       return;
//     }
//     try {
//       const response = await axios.get(`${local_URL}/api/Login/Get/${name}/${password}`, {
//         username: name,
//         password: password,
//       });
  
//       if (response.status === 200) {
//         const { userId, userRole , userName } = response.data; 
//         if (userId) {
//           Toast.show({
//             type: 'success',
//             text1: 'Login successful',
//             position: 'top',
//             autoHide: true,
//             visibilityTime: 500,
//             onHide: () => {
//               navigation.navigate('Home', { userId, userName, userRole });
//             },
//           });
//         } else {
//           Toast.show({
//             type: 'error',
//             text1: 'User ID not found',
//             text2: 'Please check your credentials',
//             position: 'top'
//           });
//         }
//       } else {
//         console.error('Login error:', response.data.message);
//         Toast.show({
//           type: 'error',
//           text1: 'Login failed',
//           text2: 'Please try again',
//           position: 'top'
//         });
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         Toast.show({
//           type: 'error',
//           text1: 'Invalid credentials',
//           position: 'top'
//         });
//       } else {
//         Toast.show({
//           type: 'error',
//           text1: 'Internal server error',
//           position: 'top'
//         });
//         console.error('Internal server error:', error.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <LinearGradient
//       colors={['#008751', '#FFDE59']}
//       style={styles.gradient}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 0, y: 1 }}
//     >
//       <View style={styles.container}>
//         <View style={styles.card}>
//           <View style={styles.logoContainer}>
//             <Image
//               source={require('../assets/Logo.png')}
//               style={styles.logo}
//             />
//           </View>
//           <View style={styles.texts}>
//             <TextInput
//               style={styles.input}
//               value={name}
//               onChangeText={(text) => setName(text)}
//               placeholder="Username"
//               placeholderTextColor="#000000"
//             />
//           </View>
//           <View style={styles.texts}>
//             <TextInput
//               style={styles.input}
//               placeholder="Password"
//               placeholderTextColor="#000000"
//               secureTextEntry
//               onChangeText={(text) => setPassword(text)}
//               value={password}
//             />
//           </View>
//           <TouchableOpacity style={styles.button} onPress={saveData} disabled={loading}>
//             <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Login'}</Text>
//           </TouchableOpacity>
//           {/* <TouchableOpacity style={styles.buttons} onPress={() => navigation.navigate("Forget")}>
//             <Text style={styles.buttonTexts}>Forget Password?</Text>
//           </TouchableOpacity> */}
//         </View>
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   gradient: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     padding: 20,
//     width: '80%',
//     maxWidth: 500,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   texts: {
//     marginBottom: 5,
//     width: '100%',
//   },
//   logoContainer: {
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   logo: {
//     width: '90%',
//     height: 120,
//     resizeMode: 'contain',
//   },
//   input: {
//     width: '100%',
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 10,
//     marginTop: 15,
//     paddingHorizontal: 10,
//     backgroundColor: '#D9D9D9',
//     minHeight: 55,
//   },
//   button: {
//     backgroundColor: '#17C05B',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 15,
//     width: '80%',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 20,
//     marginLeft: 28,
//     shadowColor: '#000',
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     width: '100%',
//     textAlign: 'center',
//   },
//   buttonTexts: {
//     color: 'black',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 5,
//   },
//   buttons: {
//     flexDirection: 'row',
//     marginTop: 10,
//   },
// });






import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import * as Keychain from 'react-native-keychain';
import { local_URL } from './Constants';

export const Login = () => {
  const { height, width } = Dimensions.get('window');
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load stored credentials on component mount
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        setName(credentials.username);
        setPassword(credentials.password);
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
    }
  };

  const saveCredentials = async (username, password) => {
    try {
      await Keychain.setGenericPassword(username, password);
      Toast.show({
        type: 'success',
        text1: 'Credentials saved',
        text2: 'Your credentials have been saved successfully',
        position: 'top'
      });
    } catch (error) {
      console.error('Error saving credentials:', error);
      Toast.show({
        type: 'error',
        text1: 'Error saving credentials',
        position: 'top'
      });
    }
  };

  const handleSaveCredentials = async () => {
    // Optionally ask user if they want to save their credentials
    // For simplicity, we’ll save credentials automatically
    await saveCredentials(name, password);
  };

  const saveData = async () => {
    setLoading(true);
    if (!name.trim() || !password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Invalid credentials',
        text2: 'Please enter both username and password',
        position: 'top'
      });
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${local_URL}/api/Login/Get/${name}/${password}`, {
        username: name,
        password: password,
      });
  
      if (response.status === 200) {
        const { userId, userRole, userName } = response.data; 
        if (userId) {
          Toast.show({
            type: 'success',
            text1: 'Login successful',
            position: 'top',
            autoHide: true,
            visibilityTime: 500,
            onHide: async () => {
              await handleSaveCredentials(); // Save credentials on successful login
              navigation.navigate('Home', { userId, userName, userRole });
            },
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'User ID not found',
            text2: 'Please check your credentials',
            position: 'top'
          });
        }
      } else {
        console.error('Login error:', response.data.message);
        Toast.show({
          type: 'error',
          text1: 'Login failed',
          text2: 'Please try again',
          position: 'top'
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Toast.show({
          type: 'error',
          text1: 'Invalid credentials',
          position: 'top'
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Internal server error',
          position: 'top'
        });
        console.error('Internal server error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#008751', '#FFDE59']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/Logo.png')}
              style={styles.logo}
            />
          </View>
          <View style={styles.texts}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder="Username"
              placeholderTextColor="#000000"
            />
          </View>
          <View style={styles.texts}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#000000"
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
              value={password}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={saveData} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Login'}</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.buttons} onPress={() => navigation.navigate("Forget")}>
            <Text style={styles.buttonTexts}>Forget Password?</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  texts: {
    marginBottom: 5,
    width: '100%',
  },
  logoContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: '90%',
    height: 120,
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 15,
    paddingHorizontal: 10,
    backgroundColor: '#D9D9D9',
    minHeight: 55,
  },
  button: {
    backgroundColor: '#17C05B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginLeft: 28,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
  buttonTexts: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 10,
  },
});
