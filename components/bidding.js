import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { useNavigation } from '@react-navigation/native';
import Modal from "./Modal";
import socket from "../utils/socket";

const { width } = Dimensions.get('window');

const Bidding = ({ route }) => {
  const { workerId } = route.params;
  const navigation = useNavigation();
  const [userId, setUserId] = useState('');
  const [uid, setUId] = useState('');
  const [username, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [roomId, setRoomId] = useState('');
  const [workername, setWorkerName] = useState('');
  const [messages, setMessages] = useState([]);
  const [label, setLabel] = useState("");
  const [timer, setTimer] = useState(300);
  const generateID = () => Math.random().toString(36).substring(2, 10);

  const retrieveToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        console.log('Token retrieved successfully');
        const decodedToken = jwt_decode(token);
        console.log(userId)
        const { username, password } = decodedToken;
        setUserId(username);
        setUId(decodedToken.userId)
        console.log("uid", uid)
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


  useEffect(() => {
    console.log("Hey")
    socket.on('room', (message) => {
      console.log(message)
    })
    socket.on('roomMessage', (message) => {
      console.log('Received message in the room:', message);
      // Handle the received message, e.g., display it in the UI
    });
  }, [socket])

  useEffect(() => {
    async function fetchData(){
      try {
        if (uid) {
          const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/user/chat`, {
            userId: uid,
            workerId,
          });
          console.log('Chat opened successfully', response.data);
          setRoomId(response.data.chatId);
          setWorkerName(response.data.workerName)
          setMessages(response.data.messages)
          // socket.emit("createRoom", response.data.chatId);
        }

      } catch (error) {
        console.error('Error adding request:', error);
      }
    }
    fetchData();
  }, [uid])

  const closeBid = () => {};
  // Function to get current time
  const getCurrentTime = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  };

  // Function to handle sending message
  const sendMessage = () => {
    console.log("message",message)
    if (message.trim() !== '') {
      const currentTime = getCurrentTime();
      const newMessage = {
        id: generateID(),   
        sender: { role: 'user' },
        contentType: 'text',
        content: { text: message },
        timestamp: currentTime
      };
      socket.emit('message', { room_id: roomId, newMessage})
      setMessages([...messages, newMessage]);
      console.log(messages)
      setMessage('');
    }

  };
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = () => {
    console.log({ amount });
    setLabel(`Amount: $${amount}`);
  };


  setInterval(() => {
    setCurrentTime(getCurrentTime());
  }, 60000);
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.heading}>Chat With {workername}</Text>
        <TouchableOpacity style={styles.sendButton} onPress={() => setVisible(true)}>
          <Text style={styles.sendButtonText}>Bid</Text>
        </TouchableOpacity>
      </View>
      <View>
        {/* <View style={styles.profileIcon}>
          <Text>Profile Icon</Text>
        </View> */}

        <ScrollView style={styles.chatContainer}>
          {messages?.map((msg) => (
           msg.contentType==="text"?( <View key={msg.id} style={styles.messageContainer}>
              <View style={styles.profileIcon}>
                {/* Profile Icon */}
                {/* You can place your profile icon component here */}
                {/* <Text>Profile Icon</Text> */}
              </View>
              <View style={styles.messageContent}>
                {/* Time */}
                <Text style={styles.timeText}>{msg.timestamp}</Text>
                {/* Message Text */}
                <Text style={styles.messageText}>{msg.content.text}</Text>

              </View>
            </View>):
              (<View key={msg.id}>
                <View style={styles.labelContainer}>
                  <Text style={styles.labelText}>{label}</Text>
                  <Text style={styles.timerText}>
                    Timer: {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}{timer % 60}
                  </Text>
                  <View style={styles.acceptRejectContainer}>
                    <Pressable style={styles.acceptButton} onPress={closeBid}>
                      <Text style={styles.modaltext}>ACCEPT</Text>
                    </Pressable>
                    <Pressable style={styles.rejectButton} onPress={closeBid}>
                      <Text style={styles.modaltext}>REJECT</Text>
                    </Pressable>
                  </View>
                </View> 
            </View>)
          ))}
        </ScrollView>
        {/* Bidding Chat Messages */}

        {visible ? <Modal setVisible={setVisible} roomId={roomId}/> : ""}

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
  head: {

    backgroundColor: 'white',
    width: '100%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,

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
    margin: 5,
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
    color: 'blue'
  },
  timeContainer: {
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    bottom: '17%',
    padding: '4%'
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
  labelContainer: {
    marginTop: 20,
    alignItems: "center",
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    paddingVertical: 10,
  },
  labelText: {
    fontSize: 18,
    marginBottom: 10,
  },
  timerText: {
    fontSize: 16,
    marginBottom: 10,
  },
  acceptRejectContainer: {
    flexDirection: "row",
  },
  acceptButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  rejectButton: {
    backgroundColor: "grey",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  modaltext: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default Bidding;