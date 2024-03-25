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
 
  
 
  
  const handleCreatePress = () => {
    console.log("Pressed join channel")
    console.log(invitestatus)
    if (invitestatus === 2) {
      navigation.navigate('unit');
    }
    else { navigation.navigate('history'); }
  };

    

 
  return (
    <View style={styles.container}>
       <Text>Profile</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
});
export default Profile;