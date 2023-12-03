// CreateJoin.js

import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
  const handleCategoryPress = (category) => {
    navigation.navigate('category', { category });
  };
  const categories = [
    'Category 1',
    'Category 2',
    'Category 3',
    'Category 4',
    'Category 5',
    'Category 6',
    'Category 7',
    'Category 8',
  ];

  return (
    <View style={styles.container}>
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
});

export default CreateJoin;
