import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text ,FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';
//import Ionicons from 'react-native-vector-icons/Ionicons'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import axios from 'axios';

export default function CreateJoin() {
  const [unit_name, setName] = useState('');
  const [unit_id, setunitId] = useState('');
  const [workers, setWorkers] = useState([]);
  const [uid,setUId]=useState();
 
  const retrieveToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        console.log('Token retrieved successfully');
        const decodedToken = jwt_decode(token);
        const { name, id } = decodedToken;
        setUId(decodedToken.userId)
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
      await retrieveToken(); 
    };
    fetchData();
  }, [])

  useEffect(() => { 
    const fetchWorkers = async () => {
      console.log('id',uid);
      try {
        if(uid){
          const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/user/chat/workers`, {
            userId: uid,
          });
        console.log('successful', response.data);
        }
        //socket.emit("createRoom", response.data.chatId);
        // You may want to update the state or perform additional actions based on the response
      } catch (error) {
        console.error('Error adding request for:', error);
      }
    };

    fetchWorkers();
  }, [uid]); 
 
  return (
    <View style={styles.container}>
       <Text>list</Text>
       {/* <FlatList
        data={workers}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>{item.id}</Text> 
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      /> */}
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
  topbutton: {
    display: 'flex',
    flexDirection: 'row',
    left: 100,
    bottom: 20,
  },
  topButton: {
    width: 60,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#A06D95',
  },
  nonselectedButton: {
    borderWidth: 2,
    borderColor: '#8B1874',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D9D9D9',
    padding: 5,
  },
  selectedButtonText: {
    color: '#fff',
  },
  nonselectedButtonText: {
    color: '#8B1874',
  },
  label: {
    borderWidth: 2,
    borderColor: '#8B1874',
    width: 329,
    height: 580,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginbtn: {
    backgroundColor: '#A06D95',
    borderRadius: 10,
    padding: 5,
    width: 140,
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
  inputname: {
    borderWidth: 0.5,
    borderColor: '#433C41',
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
    marginTop: 10,
  },

  loginText1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B1874',
    marginBottom: 20,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#A06D95',
    width: 329,
    height: 42,
    position: 'absolute',
    bottom: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
  },
  navbarButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  icon: { 
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});
