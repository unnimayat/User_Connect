import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
export default function Details() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const navigation = useNavigation();

  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      console.log('Token stored successfully');
      console.log(token)
 
    } catch (error) {
      console.error('Failed to store token', error);
    }
  };

  const retrieveToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); 
      if (token) {
        console.log('Token retrieved successfully');
        return token;
      } else {
        console.log('Token not found');
        return null;
      }
    } catch (error) {
      console.error('Failed to retrieve token', error);
      return null;
    }
  };

  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem('token');
      console.log('Token removed successfully');
    } catch (error) {
      console.error('Failed to remove token', error);
    }
  };
  const handleButtonPress = () => {
    console.log(process.env.EXPO_PUBLIC_API_URL)
    console.log('details page');
  };

  const handleTimeChange = (value) => {
    setTime(value);
  };

  const handleDateChange = (value) => {
    setDate(value);
  }; 

  return (
    <View style={styles.container}>
      <View style={styles.label}>
        <Text style={styles.loginText1}>Enter Details</Text>
        <TextInput
          style={styles.inputname}
          placeholder="Enter Time"
          placeholderTextColor="#fff"
          value={time}
          onChangeText={handleTimeChange}
        />
        <TextInput
          style={styles.inputname}
          placeholder="Enter date"
          placeholderTextColor="#fff"
          value={date}
          secureTextEntry={true}
          onChangeText={handleDateChange}
        /> 
        <TouchableOpacity style={styles.loginbtn} onPress={handleButtonPress}>
          <Text style={styles.loginText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background color
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    borderWidth: 2,
    borderColor: '#fff', // White border color
    width: 270,
    height: 500,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newlogin: {
    width: 243,
    height: 41,
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    lineHeight: 18, 
    color: 'white', // White text color
    padding: 10,
    fontSize: 12,  // Slightly lighter color for borders
    marginTop: 10,
    marginLeft:340,
  },
  inputname: {
    width: 243,
    height: 41,
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    lineHeight: 18,
    color: '#fff', // White text color
    padding: 10,
    fontSize: 12,
    borderWidth: 0.5,
    borderColor: '#ddd', // Slightly lighter color for borders
    marginTop: 10,
  },
  loginbtn: {
    backgroundColor: '#fff', // White background color
    borderRadius: 10,
    padding: 5,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    top: 40,
  },
  loginText: {
    color: '#000', // Black text color
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText1: {
    top: -100,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // White text color
  },
});
