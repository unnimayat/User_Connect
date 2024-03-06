import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import { t } from 'i18next';

export default function SendInvitation() {
  const [name, setName] = useState('');
  const [id,setId]=useState('')
  const [inviteId, setinviteId] = useState('');
  const [inviteName,setInviteName]=useState('')
  const navigation = useNavigation();
  const retrieveToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        console.log('Token retrieved successfully');
        const decodedToken = jwt_decode(token);
        const { name, id } = decodedToken;
        console.log(name)
        console.log(id)
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

  useEffect(() => {
    const fetchData = async () => {
      const { name, id } = await retrieveToken();
      console.log(id);
      setId(id);
    };
    fetchData();
  }, [])
  // useEffect(()=>{
  //   if(id){
      
  //   }
  // },[id])
  const handleNameChange = (value) => {
    setInviteName(value);
  };

  const handleIdChange = (value) => {
    setinviteId(value);
  };

  const handleButtonPress = () => {
    axios.post(`${process.env.API_URL}/addusers`, { userId:id,id:inviteId })
      .then(response => {
        console.log(id)
        console.log(response)
        if (response) {
          // Login successful, navigate to the next screen
           navigation.navigate('unit')
        } else {
          console.log('added unsuccessfully');
        }
      })
      .catch(error => {
        console.log('error');
      });

  };


  return (
    <View style={styles.container}>
      <View style={styles.label}>
        <Text style={styles.loginText1}>{t("ADD MEMBER")}</Text>
        <TextInput
          style={styles.inputname}
          placeholder={t("Enter Name")}
          placeholderTextColor="#9B6D92"
          value={inviteName}
          onChangeText={handleNameChange}
        />
        <TextInput
          style={styles.inputname}
          placeholder={t("Enter Id")}
          placeholderTextColor="#9B6D92"
          value={inviteId}
          onChangeText={handleIdChange}
        />
        <TouchableOpacity style={styles.loginbtn} onPress={handleButtonPress}>
          <Text style={styles.loginText}>{t("Invite")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    borderWidth: 2,
    borderColor: '#8B1874',
    width: 309,
    height: 607,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputname: {
    width: 243,
    height: 41,
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    lineHeight: 18,
    color: '#8B1874',
    padding: 10,
    fontSize: 12,
    borderWidth: 0.5,
    borderColor: '#433C41',
    marginTop: 10,
  },
  loginbtn: {
    backgroundColor: '#A06D95',
    borderRadius: 10,
    padding: 5,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    top: 40,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText1: {
    top: -50,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B1874',
    marginBottom:80,
  }
});
