import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, ScrollView  } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { useNavigation } from '@react-navigation/native';
import Modal from "./Modal";
const { width } = Dimensions.get('window');

const Bidding = ({ route }) => {
  const { workerId } = route.params;
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false); 
  const [newMessage, setNewMessage] = useState('');
  const [id, setid] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');
 
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
  
const [message, setMessage] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Function to get current time
  const getCurrentTime = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  };

  const [messages, setMessages] = useState([]);
   

  // Function to handle sending message
  const sendMessage = () => {
    if (message.trim() !== '') {
      const currentTime = getCurrentTime();
      const newMessage = {
        id: messages.length + 1,
        text: message,
        time: currentTime,
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };
   
  setInterval(() => {
    setCurrentTime(getCurrentTime());
  }, 60000);
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}> 
        <View style={styles.head}>
            <Text style={styles.heading}>Chat With {workerId}</Text>
            <TouchableOpacity style={styles.sendButton}  onPress={() => setVisible(true)}>
              <Text style={styles.sendButtonText}>Bid</Text>
            </TouchableOpacity>
        </View> 
        <View>
        {/* <View style={styles.profileIcon}>
          <Text>Profile Icon</Text>
        </View> */}

        <ScrollView style={styles.chatContainer}>
        {messages.map((msg) => (
          <View key={msg.id} style={styles.messageContainer}>
            <View style={styles.profileIcon}>
              {/* Profile Icon */}
              {/* You can place your profile icon component here */}
              {/* <Text>Profile Icon</Text> */}
            </View>
            <View style={styles.messageContent}>
              {/* Time */}
              <Text style={styles.timeText}>{msg.time}</Text>
              {/* Message Text */}
              <Text style={styles.messageText}>{msg.text}</Text>
              
            </View>
          </View>
        ))}
      </ScrollView>
      {/* Bidding Chat Messages */}
       
      {visible ? <Modal setVisible={setVisible} /> : ""}
      
      {/* Message Input and Send Button */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
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
  head:{ 
     
    backgroundColor: 'white',
    width:'100%',
    height:40, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading:{
    color: 'black',
    fontWeight: 'bold',
    fontSize:18,
    padding:10,
    
  },
  profileIcon: {
    alignItems: 'center',
    marginBottom: 10,
  },
  chatContainer: {
    flex: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  profileIcon: {
    marginRight: 10,
    // Profile icon styles
  },
  messageContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    margin:5,
  },
  messageText: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
  },
  timeText: {
    marginTop: 0,
    fontSize: 12,
    color: '#888',
    padding: 5,
    borderRadius: 10,
  }, 
  chatContainer: {
    flex: 1,
    marginBottom: 10,
    // Chat messages styles 
    color:'blue'
    },
  timeContainer: {  
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',  
    width:'100%',
    bottom:'17%',
    padding:'4%'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
   
  },
  sendButton: {
    backgroundColor: 'black',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Bidding;