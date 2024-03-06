import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';

import { useTranslation } from 'react-i18next';
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

const Dashboard = ({ route }) => {
  const [uname, setUname] = useState('');
  const [amount, setAmount] = useState(0);
  const [uid, setUId] = useState('');
  const [paymentlist, setpaymentlist] = useState([]);
  const [isadmin, setIsadmin] = useState(false);
  const navigation = useNavigation();
  const { name, id, unit } = route.params;
  console.log(route)

  const handleHomePress = () => {
    navigation.navigate('feed');
  };
  const handleProfilePress = () => {
    navigation.navigate('profile');
  };
  const handleCreatePress = () => {
    navigation.navigate('createjoin');
  };
  const handleEditPress = () => {
    navigation.navigate('editprofile');
  };
  const options = [
    { label: 'english', value: 'en' },
    { label: 'malayalam', value: 'mal' }
  ];

  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (uid !== '') {
      axios.get(`${process.env.API_URL}/users/${uid}/hasadminAccess`).then(response => {
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
  }, [uid])

  useEffect(() => {
    const fetchData = async () => {
      const { name, id } = await retrieveToken();
      console.log(id);
      setUId(id);
      setUname(name);
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (route && route.params && route.params.member) {
      // const { name, id } = route.params.member;
      // setUId(id);
      setUname(name);
    }
  }, [route]);

  const handleAddMessage = () => {
    axios
      .post(`${process.env.API_URL}/makepayment`, { userID: uid, id: id, amt: amount })
      .then(response => {
        console.log(response.data);
        navigation.navigate('unit')
      })
      .catch(error => {
        console.log('Error:', error);
      });
  };

  useEffect(() => {
    if (uid !== '') {
      axios.post(`${process.env.API_URL}/listpayment`, { userID: uid, id: id })
        .then(response => {
          console.log(response.data)
          const data = Array.isArray(response.data) ? response.data : [response.data];
          setpaymentlist(data);
          console.log(paymentlist)
        })
        .catch(error => {
          console.log('Error: ', error)
        });
    }
  }, [uid])

  const currentDate = new Date().toLocaleDateString();

  // Sample data for the table
   

  return (
    <View style={styles.container}>
      {/* Upper div */}
      <View style={styles.upperDiv}>
        <View style={styles.upperLeft}>
          <View style={styles.profileCircle}>
            <Ionicons name="person-circle-outline" size={120} color="#A06D95" style={styles.proicon}/>
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.id}>{id}</Text>
            <Text style={styles.id}>{unit}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
            <Ionicons name="pencil-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lower div */}
      <View style={styles.lowerDiv}>
        <View style={styles.contents}>
          {/* Table */}
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>{t("Date")}</Text>
              <Text style={styles.headerCell}>{t("Amount Paid")}</Text>
            </View>
            {paymentlist?.map((data, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>{data.date}</Text>
                <Text style={styles.tableCell}>{data.amount}</Text>
              </View>
            ))}
          </View>

          {/* Message Box */}
          {isadmin && <View style={styles.messageBox}>
            <Text style={styles.date}>{currentDate}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("Enter the amount paid")}
              value={amount === 0 ? '' : amount.toString()}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleAddMessage}>
              <MaterialIcons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>}
        </View>
      </View>

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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#A06D95',
    width: 329,
    height: 42,
    position: 'absolute',
    bottom: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
  },
  navbarButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  upperDiv: {
    backgroundColor: '#A06D95',
    width: 329,
    height: '35%',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
  },
  upperLeft: {
    flex: 1,
    alignItems: 'center',
    top: 120,
  },
  proicon:{
    justifyContent:'center',
    alignItems:'center',
    top:-10,
    right:6
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
  }, 
  profileCircle: {
    width: 110,
    height: 110,
    borderRadius: 75,
    backgroundColor: '#FFFFFF',
    borderColor: '#868686',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    left:100,
    top:0,
  }, 
  tableContainer: { 
    width: '100%', 
  },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: 5,
    backgroundColor: '#F8F8F8',
    borderRadius: 4,
    padding: 10,
    width:'100%',
  },
  headerCell: {
    flex: 1,
    fontSize: 14,
    color: '#8B1874',
    textAlign: 'center',
    width: 150,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 8,
    borderRadius: 4,
    padding: 0,
    backgroundColor: '#F8F8F8',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
  },
  messageBox: {
    position: 'absolute',
    width: 320,
    height: 80,
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
    bottom: '50%',
    left: '50%',
    transform: [{ translateX: -60.5 }, { translateY: 150 }],
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
  },

  messageBox: {
    position: 'absolute',
    width: 320,
    height: 80,
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
    bottom: '50%',
    left: '50%',
    transform: [{ translateX: -160.5 }, { translateY: 240 }],
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
  },
  date: {
    position: 'absolute',
    top: 2,
    right: 2,
    color: '#777777',
    fontSize: 12,
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
    marginLeft: 15,
  },
  info: {
    position: 'absolute',
    left: 10,
    top: -25,
    width: '100%',
  },
  name: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  id: {
    fontSize: 16,
    color: 'white',
  },
  contents: {
    flexDirection: 'column',
    right: 0,
    top: 0, 
  },
  lowerDiv: { 
    flex: 1,
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom:300,
  },
});

export default Dashboard;