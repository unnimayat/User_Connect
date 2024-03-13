// CreateJoin.js

import React from 'react';
import { useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import { useState } from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
//const navigation = useNavigation();
const handleHomePress = () => {
  // Handle navigation to home
};




const CategoryCard = ({ category, onPress }) => {
  const icons = {
    plumber: 'tools', // You can replace 'tools' with the appropriate icon name
    Electrician: 'bolt',
    'House Keeping': 'broom',
    Mechanic: 'wrench',
    Beautician: 'cut',
    carpentry: 'hammer',
  };

  return (
    <TouchableOpacity style={styles.categoryLabel} onPress={onPress}>
      <FontAwesome5 name={icons[category]} size={40} color="#000000" style={styles.categoryIcon} />
      <Text style={styles.categoryText}>{category}</Text>
    </TouchableOpacity>
  );
};


const CreateJoin = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('')
  const handleCategoryPress = (category) => {
    navigation.navigate('category', { category });
  };
  const handleProfilePress = () => {
    // Handle navigation to profile
    navigation.navigate('profile');
  };
  const handleCreatePress = () => {
    // Handle navigation to create
    //navigation.navigate('feed');
    navigation.navigate('createjoin'); 
  };
  const categories = [
    'plumber',
    'Electrician',
    'House Keeping',
    'Mechanic',
    'Beautician',
    'carpentry',
  ];

  // const storeToken = async (token) => {
  //   try {
  //     await AsyncStorage.setItem('token', token);
  //     console.log('Token stored successfully');
  //     console.log(token)

  //     // Decode the token to get user details

  //     // const decodedToken = jwt_decode(token);
  //     // const { name, id } = decodedToken;

  //     // Store user details in AsyncStorage
  //     // await AsyncStorage.setItem('userId', id);
  //     // await AsyncStorage.setItem('username', name);

  //   } catch (error) {
  //     console.error('Failed to store token', error); console.log();
  //   }
  // };

  const retrieveToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        console.log('Token retrieved successfully');
        const decodedToken = jwt_decode(token);
        const { username, password } = decodedToken;
        console.log(username)
        setUsername(username);
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
    };
    fetchData();
  }, [])

  const handleLocation = () => {
    navigation.navigate('map')
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="location" size={24} color="white" style={{ marginLeft: 10 }} onPress={handleLocation} />
        <Text style={styles.categoryText2}>location</Text>
        <Text style={styles.categoryText3}>{username}</Text>
      </View>
      {/* <hr style={{ color: "white", width: "100%", height: 0.5 }} /> */}
      <ScrollView contentContainerStyle={styles.categoryContainer}>
        <View style={styles.columnContainer}>
          <View style={styles.column}>
            {categories.slice(0, Math.ceil(categories.length / 2)).map((category, index) => (
              <CategoryCard key={index} category={category} onPress={() => handleCategoryPress(category)} />
            ))}
          </View>
          <View style={styles.column}>
            {categories.slice(Math.ceil(categories.length / 2)).map((category, index) => (
              <CategoryCard key={index} category={category} onPress={() => handleCategoryPress(category)} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navbarButton} onPress={handleHomePress}>
          <Ionicons name="home-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navbarButton} onPress={handleCreatePress}>
          <Ionicons name="create-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navbarButton} onPress={handleProfilePress}>
          <Ionicons name="person-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
  },
  columnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
  categoryContainer: {
    padding: 10,
    backgroundColor: "black"
  },
  categoryLabel: {
    width: 150,
    height: 250,
    marginBottom: 10,
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#000000',
    width: '100%',
    height: 42,
    position: 'absolute',
    bottom: 0,
  },
  navbarButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 0,
    marginTop: 10,
    backgroundColor: "black"
  },
  categoryText2: {
    fontSize: 16,
    fontWeight: 'normal',
    color: "white",
    marginLeft: 10,
  },
  categoryText3: {
    fontSize: 16,
    fontWeight: 'normal',
    color: "white",
    marginLeft: 180,
  },

  categoryLabel: {
    width: 150,
    height: 250,
    marginBottom: 10,
    borderRadius: 15,
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CreateJoin;