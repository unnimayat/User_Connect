// CreateJoin.js
import MapView, { UrlTile, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import React from 'react';
import { useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import { useState } from 'react';
const handleHomePress = () => {
  // Handle navigation to home
};

const handleCreatePress = () => {
  // Handle navigation to create
};

const handleProfilePress = () => {
  // Handle navigation to profile
};



const CreateJoin = () => {
  const navigation = useNavigation();
  const [username,setUsername]=useState('')
  const handleCategoryPress = (category) => {
    navigation.navigate('category', { category });
  };const [location, setLocation] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);

  const categories = [
    'plumber',
    'Category 2',
    'Category 3',
    'Category 4',
    'Category 5',
    'Category 6',
    'Category 7',
    'Category 8',
  ];
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
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setMarkerPosition({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    })();
  }, []);

  const handleMarkerPress = (e) => {
    setMarkerPosition(e.nativeEvent.coordinate);
    console.log(markerPosition)
  };

  const handleSearch = async () => {
    try {
      const response = await Location.geocodeAsync(searchText);
      if (response.length > 0) {
        const { latitude, longitude } = response[0];
        setMarkerPosition({ latitude, longitude });
        // Animate to the new marker position
        mapRef.current.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      console.error('Error performing geocoding:', error);
    }
  };

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const renderMapView = () => {
    return (
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location?.coords.latitude || 0,
            longitude: location?.coords.longitude || 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <UrlTile urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
          {markerPosition && (
            <Marker
              coordinate={markerPosition}
              title="Your Location"
              onPress={handleMarkerPress}
              draggable
            />
          )}
        </MapView>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter a place"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
          <Button title="Search" onPress={handleSearch} />
        </View>
        <Text style={styles.paragraph}>{text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <Ionicons name="location" size={24} color="white"  style={{ marginLeft:0}} onPress={() => setShowMap(true)} />
          {showMap && renderMapView()}
          <Text style={styles.categoryText2}>location</Text>
          <Text style={styles.categoryText3}>{username}</Text>
      </View>
      <hr style={{color:"white",width:"100%",height:0.5}}/>
      <ScrollView contentContainerStyle={styles.categoryContainer}>
        <View style={styles.columnContainer}>
          <View style={styles.column}>
            {categories.slice(0, Math.ceil(categories.length / 2)).map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryLabel}
                onPress={() => handleCategoryPress(category)}
              >
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.column}>
            {categories.slice(Math.ceil(categories.length / 2)).map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryLabel}
                onPress={() => handleCategoryPress(category)}
              >
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
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
    alignItems: 'center',
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
    padding: 16,
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
    marginBottom: 3,
    marginTop:5
  },
  categoryText2: {
    fontSize: 16,
    fontWeight: 'normal', 
    color:"white",
    marginRight:-100,
  },
  categoryText3: {
    fontSize: 16,
    fontWeight: 'normal', 
    color:"white",
    marginRight:-330,
  },
});

export default CreateJoin;
