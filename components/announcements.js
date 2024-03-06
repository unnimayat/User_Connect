import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { useNavigation } from '@react-navigation/native';

import { useTranslation } from 'react-i18next';
const { width } = Dimensions.get('window');

const MyScreen = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [id, setid] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');

  const options = [
    { label: 'english', value: 'en' },
    { label: 'malayalam', value: 'mal' }
  ];

  const { t, i18n } = useTranslation();
  const retrieveToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        console.log('Token retrieved successfully');
        const decodedToken = jwt_decode(token);
        const { name, id } = decodedToken;
        console.log(name);
        console.log(id);
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
      const { name: currentUserName, id } = await retrieveToken();
      console.log(id);
      setid(id);
      setCurrentUserName(currentUserName);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (id !== '') {
      axios
        .get(`${process.env.API_URL}/announcements/${id}`)
        .then((response) => {
          console.log(123);
          setMessages(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Failed to retrieve messages...', error);
        });
    }
  }, [id]);

  const handleAddMessage = () => {
    if (newMessage.trim() !== '') {
      const message = {
        message: newMessage,
        senderName: currentUserName, // Set the sender as current user's name
      };
      setMessages([...messages, message]);
      setNewMessage('');
      axios
        .post(`${process.env.API_URL}/announcements`, { id, message:message.message })
        .then((response) => {
          console.log('Response data:', response.data);
          setMessages([...messages, message]);
          setNewMessage('');
          console.log(response);
        })
        .catch((error) => {
          console.error('Failed to add message', error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>{t("Announcements")}</Text>
      </View>

      <View style={styles.messageBox}>
        {messages.map((message, index) => (
          <View key={index} style={[styles.messageItem, styles.messageContainer]}>
            <Text style={styles.messageSender}>
              {message.senderName === currentUserName ? 'You' : message.senderName}
            </Text>
            <Text style={styles.messageContent}>{message.message}</Text>
          </View>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="type..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleAddMessage}>
          <MaterialIcons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  headingContainer: { 
    width: 365,
    height: 40,
    left: 0,
    top: 0,
    backgroundColor: '#A06D95',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  messageBox: { 
    width: 365,
    height: 500,
    left: 0,
    top: 58,
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
  },
  messageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#8B1874',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: '#FFFFFF',
  },
  messageSender: {
    fontWeight: 'bold',
    marginRight: 0,
  },
  messageContent: {
    color: 'black',
    marginRight: 0,
  },
  messageContainer: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    shadowColor: '#8B1874',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    width: 350,
    height: 40,
    left: 0,
    bottom: 20,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: '#8B1874',
  },
  sendButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#8B1874',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default MyScreen;