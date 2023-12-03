import React, { useState } from 'react';
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
      console.error('Failed to store token', error);
    }
  };

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
  const [searchQuery, setSearchQuery] = useState('');
  const [matchingLocations, setMatchingLocations] = useState([]);

  const handleSearch = (query) => {
    // Perform your search logic here and update matchingLocations state
    // For simplicity, let's assume we have a list of locations
    const allLocations = ['Location A', 'Location B', 'Location C', 'Location D'];
    const filteredLocations = allLocations.filter((location) =>
      location.toLowerCase().includes(query.toLowerCase())
    );
    setMatchingLocations(filteredLocations);
  };

  const handleLocationPress = (location) => {
    // Navigate to the listing page with the selected location
    navigation.navigate('ListingPage', { category, location });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="location" size={24} color="#000" />
        <Text style={styles.categoryText}>{category}</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for places..."
          placeholderTextColor="#777"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            handleSearch(text);
          }}
        />
      </View>

      <FlatList
        data={matchingLocations}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleLocationPress(item)}>
            <View style={styles.locationItem}>
              <Text>{item}</Text>
            </View>
          </TouchableOpacity>
        )}
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
});

export default CategoryPage;
