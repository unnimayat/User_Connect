import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text ,FlatList,ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
//import Ionicons from 'react-native-vector-icons/Ionicons'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import axios from 'axios';

export default function Active() {
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
        console.log('successful', response.data.workers);
        setWorkers(response.data.workers)
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
    <View style={styles.mapContainer}>
     
  </View>
    <View style={styles.workerListContainer}> 
    <Text style={styles.heading}>Active Appointments</Text>

    <ScrollView>
      <FlatList
        data={workers}
         
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.workerItem}>
            <Text style={styles.workerName}>{item.name}</Text> 
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  </View>
  </View>
  );
}



const styles = StyleSheet.create({
  
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20, // Adjust margin as needed
  },
  workerListContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    padding: 16,
    marginTop: -20,
  },
  workerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 12,
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  workerAmount: {
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: { 
    margin:10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
