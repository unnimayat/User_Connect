
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
export default function EditProfile() {
  
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSaveProfile = () => { 
    navigation.navigate('dashboard');
  };
  
  const options = [
    { label: 'english', value: 'en' },
    { label: 'malayalam', value: 'mal' }
  ];

  const { t, i18n } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.label}>
      <Text style={styles.heading}>Profile</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={24} color="#8B1874" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          underlineColorAndroid="transparent" 
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={24} color="#8B1874" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          underlineColorAndroid="transparent" 
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="call-outline" size={24} color="#8B1874" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          underlineColorAndroid="transparent" 
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save</Text>
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
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'#8B1874'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#8B1874',
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#8B1874',
    borderWidth: 0, // Set border width to 0
    outlineWidth: 0, // Remove outline (for Chrome and Safari)
    outlineColor: 'transparent', // Remove outline (for Firefox)
  },
  saveButton: {
    backgroundColor: '#A06D95',
    borderRadius: 10, 
    padding:5,
    width:100,   
    justifyContent: 'center',
    alignItems: 'center',
    top:40,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent:'center',
    alignItems:'center',
  },
});
