import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import axios from 'axios'; // Import axios for making HTTP requests
import jwt_decode from 'jwt-decode'; // Import jwt-decode for decoding JWT tokens

import { useTranslation } from 'react-i18next';
const { width } = Dimensions.get('window');

const MyScreen = () => {
  const [minutes, setMinutes] = useState([]);
  const [newMinutes, setNewMinutes] = useState('');
  const today = new Date().toLocaleDateString(); // Get today's date
  const [id, setId] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');
  
  const [isadmin, setIsadmin] = useState(false);

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
    if (id !== '') {
      axios.get(`https://backendshg-0jzh.onrender.com/users/${id}/hasadminAccess`).then(response => {
        setIsadmin(response.data.hasAdminAccess)
        console.log(isadmin)
      })
      .catch(error => {
        // Handle the error
        if (error.response && error.response.status === 404) {
          // Handle the 404 error
          console.log('Not Found');
        }
        else {
          // Handle other errors
          console.log('Error:', error.message);
        }
      })
    }
  }, [id])

  useEffect(() => {
    const fetchData = async () => {
      const { name: currentUserName, id } = await retrieveToken();
      console.log(id);
      setId(id);
      setCurrentUserName(currentUserName);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (id !== '') {
      axios
        .get(`https://backendshg-0jzh.onrender.com/minutes/${id}`)
        .then((response) => {
          console.log(123);
          setMinutes(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Failed to retrieve minutes...', error);
        });
    }
  }, [id]);

  // useEffect(()=>{
  //   handleAddMinutes();
  // },[id]);

  const handleAddMinutes = () => {
    if (newMinutes.trim() !== '') {
      // const formattedMinutes = newMinutes.split('\n');
      const newMessage = {
        message: newMinutes,
        date: new Date().toISOString().split('T')[0],
      };
      

      setMinutes([...minutes, newMessage]);

      setNewMinutes('');
      
      
      console.log('hii')
      if(id!==''){
        axios
        .post('https://backendshg-0jzh.onrender.com/minutes', { id, message:newMessage.message})
        .then((response) => {
          console.log('hello')
          console.log('Response data:..', response.data);
          setMinutes([...minutes, newMessage]); // Update the state with newMessage instead of message
          setNewMinutes('');
          console.log(response);
        })
        .catch((error) => {
          console.error('Failed to add message', error);
        });
      }
      
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>{t("Minutes")}</Text>
      </View>
      <View style={styles.dateContainer}></View>
      <View style={styles.minutesContainer}>
        {/* {minutes.map((minute, index) => (
          <TouchableOpacity key={index} style={styles.minuteCard}>
            {minute.message.map((point, pointIndex) => (
              <Text key={pointIndex} style={styles.minutePoint}>
                {point}
              </Text>
            ))}
          </TouchableOpacity>
        ))} */}
        {minutes.map((minute, index) => (
  <TouchableOpacity key={index} style={styles.minuteCard}>
    <Text style={styles.minutePoint}>{minute.message}</Text>
  </TouchableOpacity>
))}

      </View>
      { isadmin &&
      <View style={styles.inputContainer}>
      <Text style={styles.dateText}>{today}</Text>
      <Text style={styles.inputLabel}></Text>
      <TextInput
        style={styles.input}
        placeholder="Add minutes here..."
        value={newMinutes}
        onChangeText={setNewMinutes}
        multiline={true} // Allow multiple lines input
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddMinutes}>
        <Text style={styles.addButtonText}>{t("Add")}</Text>
      </TouchableOpacity>
    </View> }
      
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
    width: 450,
    height: 40,
    backgroundColor: '#A06D95',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateContainer: {
    marginTop: 10,
  },
  dateText: {
    
    position: 'absolute',
    top: 15,
    right: 40,
    color: '#777777',
    fontSize: 15,
    
    
  },
  minutesContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  minuteCard: {
    width: 350,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 10,
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
  minutePoint: {
    fontSize: 16,
    marginLeft: 10,
  },
  inputContainer: {
    position: 'absolute',
    width: 400,
    height: 100,
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
    bottom: '50%',
    left: '50%',
    transform: [{ translateX: -190.5 }, { translateY: 240 }],
    zIndex: 1,
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
    marginBottom:-90
    
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 70,
    borderRadius: 8,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: '#A06D95',
  },
  addButton: {
    width: 100,
    height: 60,
    borderRadius: 4,
    backgroundColor: '#8B1874',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    height:40,
    left:-15,
    marginBottom:-20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
   
  },
});

export default MyScreen;