import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
export default function SignIn() {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const navigation = useNavigation();

  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      console.log('Token stored successfully');
      console.log(token)

      // Decode the token to get user details

      // const decodedToken = jwt_decode(token);
      // const { name, id } = decodedToken;

      // Store user details in AsyncStorage
      // await AsyncStorage.setItem('userId', id);
      // await AsyncStorage.setItem('username', name);

    } catch (error) {
      console.error('Failed to store token', error);
    }
  };

  const retrieveToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      // const userId = await AsyncStorage.getItem('userId');
      // const username = await AsyncStorage.getItem('username');
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


  const handleNameChange = (value) => {
    setName(value);
  };

  const handleIdChange = (value) => {
    setId(value);
  };

  const handleButtonPress = () => {
    // Handle the login logic and navigate to the next screen
    axios.post('https://backendshg-0jzh.onrender.com/signin', { name, id })
    .then(response => {
      console.log(response);

      if (response.data.status) {
        // Perform any additional logic for sign-in success, e.g., set user session
        console.log('Sign-in successful');
        const token = response.data.token;
        storeToken(token);
        // Navigate to the desired screen (replace 'dashboard' with your target screen)
        navigation.navigate('login');
      } else {
        // Handle sign-in failure
        console.log('Sign-in unsuccessful');
      }
    })
    .catch(error => {
      console.log('Error during sign-in', error);
    });
  };
  const handleLogin = () => {
    // Handle the login logic and navigate to the next screen
    navigation.navigate('login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.label}>
        <Text style={styles.loginText1}>Sign In</Text>
        <TextInput
          style={styles.inputname}
          placeholder="Enter Name"
          placeholderTextColor="#fff"
          value={name}
          onChangeText={handleNameChange}
        />
        <TextInput
          style={styles.inputname}
          placeholder="Enter Id"
          placeholderTextColor="#fff"
          value={id}
          secureTextEntry={true}
          onChangeText={handleIdChange}
        />
         <Text  style={styles.newlogin} onPress={handleLogin}>Login?</Text>
        <TouchableOpacity style={styles.loginbtn} onPress={handleButtonPress}>
          <Text style={styles.loginText}>Sign In</Text>
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
