import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import socket from "../utils/socket";

const CategoryPage = ({ route }) => {
  const { category } = route.params;
  const navigation = useNavigation();

  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      console.log('Token stored successfully');
      console.log(token);
    } catch (error) {
      console.error('Failed to store token', error);
    }
  };

  const [userId, setUserId] = useState('');
  const [uid, setUId] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [username, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [matchingLocations, setMatchingLocations] = useState([]);
  const [matchingWorkers, setMatchingWorkers] = useState([]);
  const [location, setLocation] = useState('');

  const retrieveToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        console.log('Token retrieved successfully');
        const decodedToken = jwt_decode(token);
        const { username, password } = decodedToken;
        setUserId(username);
        setUId(decodedToken.userId)
        console.log("username", username);
        return { username, password };
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
      const { username, password } = await retrieveToken();
      console.log(username);
      setUserName(username);
    };
    fetchData();
  }, []);

  useEffect(()=>{
    console.log("Hey")
    socket.on('room',(message)=>{
      console.log(message)
    })
    socket.on('roomMessage', (message) => {
      console.log('Received message in the room:', message);
      // Handle the received message, e.g., display it in the UI
    });
  },[socket])

  const handleSearch = async (category) => {
    console.log(category)
    let requestBody = {
      profession: category,
      userId: userId,
    }
    console.log(requestBody)
    axios.post(`${process.env.EXPO_PUBLIC_API_URL}/emp/listworkers`, requestBody)
      .then(response => {
        console.log(response.data);
        setMatchingWorkers(response.data)
      })
      .catch(error => {
        console.log('Error:', error);
      });
  };

  const handleBook = async (workerId) => {
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/user/chat`, {
        userId: uid,
        workerId,
      });
      console.log('Chat opened successfully', response.data);
      socket.emit("createRoom", response.data.chatId);
      // You may want to update the state or perform additional actions based on the response
    } catch (error) {
      console.error('Error adding request:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.workerItem}>
      <View style={styles.workerAvatar} />
      <View style={styles.workerInfo}>
        <Text style={styles.workerName}>ID: {item.empid}</Text>
        <Text style={styles.workerDetails}>Name: {item.username}</Text>
      </View>
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => handleBook(item._id)}
      >
        <Text style={styles.bookButtonText}>CHAT</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="location" size={24} color="#000" />
        <Text style={styles.categoryText}>{category}</Text>
      </View>

      <View>
        <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} onPress={() => handleSearch(category)} />
        <Text>Click for gigs</Text>
        {/* <TextInput
          style={styles.searchInput}
          placeholder="Search for people"
          placeholderTextColor="#777"
          value={location}
          onChangeText={(location) => setLocation(location)}
        /> */}
      </View>

      <FlatList
        data={matchingWorkers}
        keyExtractor={(item) => item.empid.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  workerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  workerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
    backgroundColor: '#e0e0e0',
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  workerDetails: {
    fontSize: 14,
    color: '#666',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#000',
  },
  bookButton: {
    backgroundColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CategoryPage;
