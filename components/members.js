import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { useTranslation } from 'react-i18next';
const MemberListPage = () => {
  const navigation = useNavigation();
  const [members, setMembers] = useState([]);
  const [id, setId] = useState('');
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
        const { id } = decodedToken;
        console.log(id);
        return id;
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
      const id = await retrieveToken();
      console.log(id);
      setId(id);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (id !== '') {
      axios
        .post('https://backendshg-0jzh.onrender.com/members', { id })
        .then(response => {
          console.log(response.data.members);
          setMembers(response.data.members); // Store members data in the state
        })
        .catch(error => {
          console.log('Error fetching members:', error);
        });
    }
  }, [id]);

  const fetchMemberDetails = (id) => {
    const url = `https://backendshg-0jzh.onrender.com/dashboard/${id}`;
    axios
      .get(url)
      .then(response => {
        const memberData = response.data;
        const { unitName,memberName } = memberData;
        console.log(response.data)
        console.log('Member Details:', {unitName,memberName});
        navigation.navigate('dashboard', { name:memberName, id:id, unit:unitName }); // Navigate to 'Dashboard' screen with member details as route parameters
      })
      .catch(error => {
        console.log('Error fetching member details:', error);
      });
  };

  const handleMemberPress = (member) => {
    fetchMemberDetails(member.id);
  };

  const renderMemberItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.memberItem} onPress={() => handleMemberPress(item)}>
        <Text style={styles.memberCell}>{item.name}</Text>
        <Text style={styles.memberCell}>{item.id}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>{t("Member List")}</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>{t("Name")}</Text>
        <Text style={styles.headerCell}>{t("ID")}</Text>
      </View>
      <FlatList
        data={members}
        renderItem={renderMemberItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F0F0',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#8B1874',
  },
  tableHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    backgroundColor: '#F8F8F8',
    borderRadius: 4,
    padding: 10,
  },
  headerCell: {
    flex: 1,
    fontSize: 16,
    color: '#8B1874',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  memberItem: {
    flexDirection: 'row',
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 10,
  },
  memberCell: {
    flex: 1,
    fontSize: 14,
    color: '#A06D95',
    textAlign: 'center',
  },
});

export default MemberListPage;