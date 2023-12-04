import React, { useState } from 'react';

import { useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
const CategoryPage = ({ route }) => {
  const { category } = route.params;
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
      console.error('Failed to store token', error);console.log();
    }
  };
  const [userId,setUserId]=useState('');
  const [workerId,setWorkerId]=useState('')
  const [username,setUserName]=useState('')
  const retrieveToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        console.log('Token retrieved successfully');
        const decodedToken = jwt_decode(token);
        const { username, password } = decodedToken;
        setUserId(decodedToken.userId);
        console.log(username) 
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
  }, [])
  const [searchQuery, setSearchQuery] = useState('');
  const [matchingLocations, setMatchingLocations] = useState([]);
  const [matchingWorkers, setMatchingWorkers] = useState([]);
  const [location,setLocation]=useState('');
  const handleSearch = async () => {
    try {
      // Call the backend route to fetch matching workers
      const response = await fetch(`https://connect-q46w.onrender.com/emp/workers/${category}/${location}`);
      const workers = await response.json();
      console.log('Matching workers:', workers);
      // Assuming you have a state variable like matchingWorkers to store the result
      setMatchingWorkers(workers);
    } catch (error) {
      console.error('Error fetching workers:', error);
      // Handle errors as needed
    }
  };
  const handleBook = async (workerId) =>{
    // Perform booking logic using the studentId
    // For example, you can navigate to a booking screen or show a confirmation message
    const response = await axios.post('https://connect-q46w.onrender.com/request/add-request', {
  userId ,
   workerId 
});


    // Handle the response as needed
    console.log('Request added successfully:', response.data); 
    // Add your logic here
  };

  // const handleLocationPress = (location) => {
  //   // Navigate to the listing page with the selected location
  //   navigation.navigate('ListingPage', { category, location });
  // };
  const renderItem = ({ item }) => ( 
    <View style={styles.studentItem}>
      {/* Student Avatar (you can replace this with an image) */}
      <View style={styles.studentAvatar} />
      
      {/* Student Information */}
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>ID: {item.empid}</Text>
        <Text style={styles.studentDetails}>Name: {item.username}</Text> 
        {/* Add more details as needed */}
      </View>
      <TouchableOpacity
      style={styles.bookButton}
      onPress={() => handleBook(item._id)} // Replace with your booking logic
    >
      <Text style={styles.bookButtonText}>Book</Text>
    </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="location" size={24} color="#000"  />
        <Text style={styles.categoryText}>{category}</Text>
      </View>
      
      <View style={styles.searchContainer}> 
      <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} onPress={() => handleSearch()} />

        <TextInput
          style={styles.searchInput}
          placeholder="Search for places..."
          placeholderTextColor="#777"
          value={location}
          onChangeText={(location) => {
            setLocation(location);
          }}
        />
      </View>
      {/* <FlatList
        data={matchingWorkers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleLocationPress(item)}>
            <View style={styles.workerItem}>
              <Text>ID: {item.id}</Text>
              <Text>Name: {item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      /> */}
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
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
    backgroundColor: '#e0e0e0', // You can set a background color or use an image
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentDetails: {
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
  locationItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  bookButton: {
    backgroundColor: 'black', // Button background color
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 'auto', // Move the button to the right side
  },
  
  bookButtonText: {
    color: '#fff', // Button text color
    fontWeight: 'bold',
  },
});

export default CategoryPage;
