import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
//import Ionicons from 'react-native-vector-icons/Ionicons'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import axios from 'axios';

export default function CreateJoin() {
  const [unit_name, setName] = useState('');
  const [unit_id, setunitId] = useState('');
  const [createLabel, setCreateLabel] = useState(true);
  const [joinLabel, setJoinLabel] = useState(false);
  const navigation = useNavigation();
  const [uid, setUId] = useState(''); 
  const [unitid, setId] = useState(''); 
  const [invitestatus, setInvitestatus] = useState(null)
  const [invitation,setInvitation]=useState(false);

  
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
        console.log(name)
        console.log(id)
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
      const { name, id } = await retrieveToken();
      console.log(id);
      setUId(id);
    };
    fetchData();
  }, [])

  useEffect(() => {
    if (uid != '') {
      axios.get(`${process.env.API_URL}/users/${uid}/invited`)
        .then(response => {
          const { is_invited } = response.data;
          console.log(is_invited)
          setInvitestatus(is_invited)
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [uid]);

  const handleNameChange = (value) => {
    setName(value);
  };

  const handleIdChange = (value) => {
    setId(value);
  };
  const handleUnitIdChange = (value) => {
    setunitId(value);
  };

  const handleButtonCreatePress = () => {
    setCreateLabel(true);
    setJoinLabel(false);
  };

  const handleButtonJoinPress = () => {
    setCreateLabel(false);
    setJoinLabel(true);
    axios.get(`${process.env.API_URL}/invitedunits/${uid}`)
    .then(response=>{
      console.log(response);
      const {unitId,unitName}=response.data;
      setInvitation(true);
      setName(unitName);
      setunitId(unitId);
    })
  };


const handleButtonJoin=()=>{
axios.post(`${process.env.API_URL}/joinunit`,{unitId:unit_id,userId:uid})
.then(response=>{
  console.log(response);
  console.log('hi');
  navigation.navigate('unit')
})
  }
  const handleButtonPress = () => {
    axios.post(`${process.env.API_URL}/createunit`, { unit_name, uid })
      .then(response => {
        console.log(response)
        if (response.data.status) {
          // Login successful, navigate to the next screen
          console.log(response.data.status)
          navigation.navigate('unit');
        } else {
          console.log('Creation unsuccessful');
        }
      })
      .catch(error => {
        console.log('error');
      });
    navigation.navigate('createjoin');
  };

  const handleHomePress = () => {
    navigation.navigate('feed');
  };
  const handleProfilePress = () => {
    navigation.navigate('profile');
  };
  const handleCreatePress = () => {
    console.log("Pressed join channel")
    console.log(invitestatus)
    if (invitestatus === 2) {
      navigation.navigate('unit');
    }
    else { navigation.navigate('createjoin'); }
  };

  return (
    <View style={styles.container}>
      {/* button */}
      <View style={styles.topbutton}>
        <TouchableOpacity
          style={[styles.topButton, createLabel ? styles.selectedButton : styles.nonselectedButton]}
          onPress={handleButtonCreatePress}
        >
          <Text style={[styles.buttonText, createLabel ? styles.selectedButtonText : styles.nonselectedButtonText]}>{t("CREATE")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.topButton, joinLabel ? styles.selectedButton : styles.nonselectedButton]}
          onPress={handleButtonJoinPress}
        >
          <Text style={[styles.buttonText, joinLabel ? styles.selectedButtonText : styles.nonselectedButtonText]}>{t("JOIN")}</Text>
        </TouchableOpacity>
      </View>

      {/* label */}
      {createLabel ? (
        <View style={styles.label}>
          <Text style={styles.loginText1}>{t('CREATE')}</Text>
          <TextInput
            style={styles.inputname}
            placeholder={t("Enter Unit Name")}
            placeholderTextColor="#9B6D92"
            value={unit_name}
            onChangeText={handleNameChange}
          />
          <TextInput
            style={styles.inputname}
            placeholder={t("Enter Unit Id")}
            placeholderTextColor="#9B6D92"
            value={unit_id}
            onChangeText={handleUnitIdChange}
          />
          <TouchableOpacity style={styles.loginbtn} onPress={handleButtonPress}>
            <Text style={styles.loginText}>{t('CREATE')}</Text>
          </TouchableOpacity>
        </View>
      ) : (<View>{ invitation?(
        <View style={styles.label}>
          <Text style={styles.loginText1}>{t("JOIN")}</Text>
          <View style={styles.container}>
            <Icon name="drafts" size={30} color="#A06D95" style={styles.icon} />
            <Text style={styles.loginText1}>Invitation from Group {unit_name}</Text>
            <TouchableOpacity style={styles.loginbtn} onPress={handleButtonJoin}>
            <Text style={styles.loginText}>{t("JOIN")}</Text>
          </TouchableOpacity>
          </View>
        </View>
      ):(<View style={styles.label}>
        <Text style={styles.loginText1}>{t("Sorry You have no invitation")}</Text>
      </View>)
        
      }</View>)}

      {/* navbar */}
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
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topbutton: {
    display: 'flex',
    flexDirection: 'row',
    left: 100,
    bottom: 20,
  },
  topButton: {
    width: 60,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#A06D95',
  },
  nonselectedButton: {
    borderWidth: 2,
    borderColor: '#8B1874',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D9D9D9',
    padding: 5,
  },
  selectedButtonText: {
    color: '#fff',
  },
  nonselectedButtonText: {
    color: '#8B1874',
  },
  label: {
    borderWidth: 2,
    borderColor: '#8B1874',
    width: 329,
    height: 580,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginbtn: {
    backgroundColor: '#A06D95',
    borderRadius: 10,
    padding: 5,
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
    top: 40,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputname: {
    borderWidth: 0.5,
    borderColor: '#433C41',
    width: 243,
    height: 41,
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    lineHeight: 18,
    color: '#8B1874',
    padding: 10,
    fontSize: 12,
    marginTop: 10,
  },

  loginText1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B1874',
    marginBottom: 20,
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
  icon: { 
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});
