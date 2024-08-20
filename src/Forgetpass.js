import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput, Image, Button, Alert } from "react-native";
import {local_URL} from './Constants'

export const Forget = ({ navigation }) => {
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showPasswordInputs, setShowPasswordInputs] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendOtp = () => {
    if (!mobileNumber && mobileNumber == "") {
      Alert.alert("Please enter your mobile number.");
      return;
    }
    // Simulate sending OTP
    console.log(`Sending OTP to ${mobileNumber}`);
    setShowOtpInput(true);
  };

  const handleVerifyOtp = () => {
    if (!otp) {
      Alert.alert("Please enter the OTP.");
      return;
    }
    // Simulate OTP verification
    console.log(`Verifying OTP: ${otp}`);
    setShowOtpInput(false);
    setShowPasswordInputs(true);
  };

  const handleResetPassword = () => {
    if (newPassword === confirmPassword && newPassword.length > 0) {
      console.log("Password reset successful");
      navigation.navigate("Login");
    } else {
      Alert.alert("Passwords do not match or are empty.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/Logo.png')}
            style={styles.logo}
          />
        </View>
        <Text style={styles.title}>Forgot Password</Text>
        {!showOtpInput && !showPasswordInputs && (
          <>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              placeholder="Enter Your Mobile Number"
              placeholderTextColor="#000000"
            />
            <View style={styles.buttonContainer}>
              <Button 
                title="Send OTP" 
                onPress={handleSendOtp} 
              />
            </View>
          </>
        )}
        {showOtpInput && !showPasswordInputs && (
          <>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={otp} 
              onChangeText={setOtp}
              placeholder="Enter OTP"
              placeholderTextColor="#000000"
            />
            <View style={styles.buttonContainer}>
              <Button 
                title="Verify OTP" 
                onPress={handleVerifyOtp} 
              />
            </View>
          </>
        )}
        {showPasswordInputs && (
          <>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New Password"
              placeholderTextColor="#000000"
            />
            <TextInput
              style={styles.input}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
              placeholderTextColor="#000000"
            />
            <View style={styles.buttonContainer}>
              <Button 
                title="Reset Password" 
                onPress={handleResetPassword} 
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 120,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 30,
    margin: 15,
    textAlign: 'center',
  },
  input: {
    height: 50,
    marginTop: 10,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#D9D9D9',
  },
  buttonContainer: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
});

