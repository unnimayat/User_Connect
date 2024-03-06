 
 import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';  
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import axios from 'axios';  
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Platform } from 'react-native';


import { useTranslation } from 'react-i18next';
const Attendance = () => {
  const navigation = useNavigation();
  
  const [isLoading,setIsLoading]=useState(false);
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = currentDate.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(formattedDate);
  const [initial,setInitial]=useState(true);
  const [show, setShow] = useState(true); 
  // earlier it was useState('') this makes selectedDate useless
  const [text, setText] = useState(formattedDate);
  const [uid, setUId] = useState('') 
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
    handleDateChange(formattedDate)
  }, [])

  useEffect(() => {
    // Fetch attendance data from the endpoint
    console.log(text)
    if (uid != '' && text!=='' && text.length===10) {
      setIsLoading(true)
      axios.get(`${process.env.API_URL}/attendance/${uid}/${text}`)
        .then(response => {
          console.log(text);
          console.log("First")
          const attendanceData = response.data;
          console.log("second")
          console.log(response.data.presentUsers);
          setStudents(response.data.presentUsers);
          console.log('third')
          console.log(students)
          setIsLoading(false)

        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [ text,uid]);

  const toggleAttendance = (index) => {
    const updatedStudents = [...students];
    updatedStudents[index].present = !updatedStudents[index].present;
    setStudents(updatedStudents);
  };

  const handleInitialChange=()=>{
    setInitial(false);
  }
  const handleButtonTodayPress = () => {
    setShow(!show);
  };
  const handleDateChange = () => {
    // setShow(!show);
  };
  const handleSaveButtonPress = () => { 
    const postData = {
      id: uid,
      date: text,
      presentUsers: students.map((student) => ({
        name: student.name,
        id: student.id,
        present: student.present ? 1 : 0,
      })),
    };
    console.log(postData);

    // Make the POST request to the server
    axios
      .post(`${process.env.API_URL}/attendance`, postData)
      .then((response) => {
        // Handle the response if needed
        console.log('Attendance data saved successfully');
        navigation.navigate('unit');
      })
      .catch((error) => {
        console.error('Failed to save attendance data', error);
      });
    navigation.navigate('unit');
  };
 

  return isLoading ? (<ScrollView>{/*isloading*/}</ScrollView>) : (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.today}>
        {initial ? (
          <TouchableOpacity onPress={handleInitialChange} style={styles.todaybtn}>
            <Text style={styles.todayText}>{selectedDate}</Text>
            {Platform.OS !== 'web' && (
              <Ionicons name="search" size={24} color="#8B1874" onPress={handleDateChange} />
            )}
          </TouchableOpacity>
        ) :  (
          <View style={styles.todaybtn}>
            <TextInput
              style={styles.todayText}
              placeholder="yyyy-mm-dd"
              value={text}
              onChangeText={setText}
              onFocus={handleDateChange}
              editable={show}
            />
            {Platform.OS !== 'web' && (
              <Ionicons name="search" size={24} color="#8B1874" onPress={handleDateChange} />
            )}
          </View>
        )}
      </View>
  
      <View style={styles.center}>
        <View style={styles.tableContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>{t("ID")}</Text>
            <Text style={styles.headerCell}>{t("Name")}</Text>
            <Text style={styles.headerCell}>{t("Attendance")}</Text>
          </View>
          {students?.map((student, index) => (
            <TouchableOpacity
              key={student.id}
              style={styles.row}
              onPress={() => toggleAttendance(index)}
            >
              <Text style={styles.cell}>{student.id}</Text>
              <Text style={styles.cell}>{student.name}</Text>
              <View style={styles.attendanceCell}>
                <TouchableOpacity
                  style={[
                    styles.radioBtn,
                    student.present && styles.radioBtnSelected,
                  ]}
                  onPress={() => toggleAttendance(index)}
                >
                  {/* The problem!!!! */}
                {/* {student.present && <View style={styles.radioBtnInner} />} */}
                </TouchableOpacity>
                <Text>
                  {student.present ? 'Present' : 'Absent'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.savebtn} onPress={handleSaveButtonPress}>
          <Text style={styles.saveText}>{t("SAVE")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </ScrollView>
  
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  today: {
    width: 200,
    height: 50,
    left: 32,
    top: 26,
    flexDirection: 'row',
    alignItems: 'center',
  },
  todaybtn: {
    borderWidth: 1,
    borderColor: '#8B1874',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    padding: 5,
  },
  todayText: { 
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 16,
    lineHeight: 29,
    color: '#8B1874',
    marginRight: 5,
  },
  selectedDate: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 16,
    lineHeight: 29,
    color: '#8B1874',
  },
  tableContainer: {
    top: 10,
    borderRadius: 10,
    margin: 20,
    width: 329,
    height: 520,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    padding: 5,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    color: '#8B1874',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 5,
  },
  cell: {
    flex: 1,
  },
  attendanceCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioBtn: {
    width: 10,
    height: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#A06D95',
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioBtnSelected: {
    backgroundColor: '#A06D95',
  },
  radioBtnInner: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  attendanceText: {
    fontWeight: '400',
    color: '#A06D95',
  },
  savebtn: {
    backgroundColor: '#A06D95',
    borderRadius: 10,
    padding: 5,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 10,
    position: 'absolute',
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datepicker: {
    color: '#A06D95',
    backgroundColor: '#A06D95',
  },
});

export default Attendance;
