import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
const retrieveToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      console.log('Token retrieved successfully');
      const decodedToken = jwt_decode(token);
      const { name, id } = decodedToken;
      console.log(name);
      console.log(id);
      return { name, id };
    } else {
      console.log('Token not found');
      return null;
    }
  } catch (error) {
    console.error('Failed to retrieve token', error);
    return null;
  }
};

const Profile = () => {
  const [uname, setUname] = useState('');
  const [amount, setAmount] = useState(0);
  const [uid, setUId] = useState('');
  const [userid, setUserId] = useState('');
  const [isadmin, setIsadmin] = useState(false);
  const [paymentId,setpaymentId]=useState('');
  const [description,setDescription]=useState('');
  const [paymentlist, setpaymentlist] = useState([]);
  const [invitestatus, setInvitestatus] = useState(null)
  const navigation = useNavigation();
 
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    // try {
    //   const response = await axios.get('https://api.example.com/user');
    //   setUser(response.data);
    // } catch (error) {
    //   console.error('Error fetching user details:', error);
    // }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username:</Text>
      {/* <Text style={styles.text}>{user.username}</Text> */}
      
      <Text style={styles.label}>Email:</Text>
      {/* <Text style={styles.text}>{user.email}</Text> */}
      
      <Text style={styles.label}>Address:</Text>
      {/* <Text style={styles.text}>{user.address}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  
});
export default Profile;