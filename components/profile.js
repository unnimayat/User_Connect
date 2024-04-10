import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, TextInput ,Image} from 'react-native';
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

const Profile = () => {
  const [uname, setUname] = useState('');
  const [amount, setAmount] = useState(0);
  const [uid, setUId] = useState('');
  const [userid, setUserId] = useState('');
  const [isadmin, setIsadmin] = useState(false);
  const [paymentId,setpaymentId]=useState('');
  const [description,setDescription]=useState('');
  const [paymentlist, setpaymentlist] = useState([]);
  const [invitestatus, setInvitestatus] = useState(null)
  const navigation = useNavigation();
 
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    // try {
    //   const response = await axios.get('https://api.example.com/user');
    //   setUser(response.data);
    // } catch (error) {
    //   console.error('Error fetching user details:', error);
    // }
  };

  // if (!user) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}> 
    <View style={styles.head}>
        <Text style={styles.heading}>Profile</Text>
        <TouchableOpacity style={styles.sendButton} onPress   >
          <Text style={styles.sendButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.profileContainer}>
        <Image
          source={require('./profile.png')}  
          style={styles.profileImage}
        />
        <Text style={styles.userName}>John Doe</Text>  
      </View>  
      <View style={styles.bottom}>
        <Text style={styles.Item}>Email: userEmail</Text>
        <Text style={styles.Item}>Address: userAddress</Text>
        <Text style={styles.Item}>Rating: userRating</Text>
      </View>
        
    </View>
  );
};

const styles = StyleSheet.create({ container: {
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
profileContainer: {
  alignItems: 'center',
},
profileImage: {
  width: 150,
  height: 150,
  borderRadius: 75,
  marginBottom: 20,
}, 
userName: {
  fontSize: 24,
  fontWeight: 'bold',
},
userInfo: {
  fontSize: 16,
  marginBottom: 10,
},
bottom:{
  marginTop:150,
},
Item: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
  paddingVertical: 12,
  fontSize: 16,
  fontWeight: 'bold',
  width:300
},
});
export default Profile;