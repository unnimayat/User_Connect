import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ScrollView ,Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
export default function Activedetails({route}) {
  const [activeWorker, setActiveWorker] = useState([]);
  const [uid, setUid] = useState();
  const navigation = useNavigation();
  const { worker ,amt} = route.params;
  console.log('worker details',worker);
  const retrieveToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        console.log('Token retrieved successfully');
        const decodedToken = jwt_decode(token);
        const { userId } = decodedToken;
        setUid(userId);
        return userId;
      } else {
        console.log('Token not found');
        return null;
      }
    } catch (error) {
      console.error('Failed to retrieve token', error);
      return null;
    }
  };

  const handleWorkDone = () => {
    Alert.alert(
      'Confirm Work Done',
      'Are you sure you want to mark this work as done?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Mark as Done',
          onPress: () => {
            // Add your logic here for marking the work as done
            console.log('Work marked as done');
            navigation.navigate('feedback');
          },
        },
      ],
      { cancelable: false }
    );
  };
  const handlePay=()=>{

  }
  const handleFeedback=()=>{
    navigation.navigate('feedback');
  }
  useEffect(() => {
    const fetchData = async () => {
      await retrieveToken();
    };
    fetchData();
  }, []);
 
  return (
    <View style={styles.container}>
      <View style={styles.workerListContainer}>
        <Text style={styles.heading}>Worker Details</Text>

        <View style={styles.workerInfoContainer}>
          <View style={styles.workerNameContainer}>
            <Icon name="account-circle" size={24} color="#333" style={{ marginRight: 8 }} />
            <Text style={styles.workerName}>{worker.username}</Text>
            <Text style={styles.workeramount}>Rs.{amt}</Text>
          </View>
          <View style={styles.detailContainer}>
            <View>
              <Text style={styles.semilight}>Profession</Text>
              <Text style={styles.light}>{worker.profession}</Text>
            </View>
            <View style={styles.horizontalLine} />
            <View>
              <Text style={styles.semilight}>ID</Text>
              <Text style={styles.light}>{worker._id}</Text>
            </View>
            <View style={styles.horizontalLine} />
            <View>
              <Text style={styles.semilight}>Email</Text>
              <Text style={styles.light}>{worker.email}</Text>
            </View>
            <View style={styles.horizontalLine} />
            <View>
              <Text style={styles.semilight}>Amount</Text>
              <Text style={styles.light}>{amt}</Text>
            </View>
          </View>
          <View style={styles.btncontainer}>
            <TouchableOpacity style={styles.buttonLeft} onPress={handlePay}>
                <Text style={styles.buttonText}>Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonRight} onPress={handleFeedback}>
                <Text style={styles.buttonText}>Feed Back</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={styles.button} onPress={handleWorkDone}>
                <Text style={styles.buttonText}>Work Done</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    padding:10
  },
  workerListContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    padding: 16,
    marginTop: -20,
  },
  
  workerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 1.5)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  workerInfoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  workerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  btncontainer: {
    display:'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  workerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 0,
    color: 'grey', // Darker text color
    padding:5
  },
  workeramount: {
    marginLeft:"50%",
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 1,
    color: '#d6c25a', // Darker text color
  }, 
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  detailContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'left',
    paddingHorizontal: 20,
  },
  horizontalLine: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    width: '100%',
    marginVertical: 10,
  },
  semilight: {
    fontSize: 16,
    fontWeight: '200',
    marginBottom: 4,
    color: '#333',
  },
  light: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 10,
    color: 'black',
  },
  button: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginTop: 90,
    marginBottom: 0,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonLeft: {
    backgroundColor: '#d6c25a',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    marginTop: 10,
  },
  buttonRight: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
    marginTop: 10,
  },
});
