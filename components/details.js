import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

export default function Details({ route }) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [period, setPeriod] = useState('');

  const navigation = useNavigation();
  const { bidId } = route.params;

  const handleButtonPress = async () => {
    try {
      // Combine date and time inputs
      const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes} ${period}`;
      const dateTimeObject = moment(dateTimeString, 'YYYY-MM-DDTHH:mm A').toDate();

      // Send the date and time as a single Date object
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/appointment/accept-request/${bidId}`, {
        date: dateTimeObject
      });

      console.log('Response:', response);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Enter Details</Text>

        {/* Date input: Day, Month, Year */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="DD"
            value={day}
            onChangeText={setDay}
            keyboardType="numeric"
            maxLength={2}
          />
          <TextInput
            style={styles.input}
            placeholder="MM"
            value={month}
            onChangeText={setMonth}
            keyboardType="numeric"
            maxLength={2}
          />
          <TextInput
            style={styles.input}
            placeholder="YYYY"
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        {/* Time input: Hours, Minutes, and AM/PM Picker */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="HH"
            value={hours}
            onChangeText={setHours}
            keyboardType="numeric"
            maxLength={2}
          />
          <TextInput
            style={styles.input}
            placeholder="MM"
            value={minutes}
            onChangeText={setMinutes}
            keyboardType="numeric"
            maxLength={2}
          />
          <TextInput
            style={styles.input}
            placeholder="AM/PM"
            value={period}
            onChangeText={setPeriod}
            maxLength={2}
          />
          {/* <Picker
            selectedValue={period}
            onValueChange={(value) => setPeriod(value)}
            style={styles.picker}
          >
            <Picker.Item label="AM" value="AM" />
            <Picker.Item label="PM" value="PM" />
          </Picker> */}
        </View>

        {/* Submit button */}
        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background color
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    padding: 20,
    borderWidth: 2,
    borderColor: '#fff', // White border color
    borderRadius: 10,
    width: 300,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // White text color
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    width: 80,
    height: 40,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    color: '#000',
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  picker: {
    width: 80,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#fff',
    color: '#000',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#fff', // White background color
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000', // Black text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});
