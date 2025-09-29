// src/screens/ASHARegistration.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { languages } from '../lang';

export default function ASHARegistration({ navigation, route }) {
  const { language } = route.params;
  const lang = languages[language];

  const [name, setName] = useState('');
  const [ashaId, setAshaId] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [village, setVillage] = useState('');
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  useEffect(() => {
    const checkRegistered = async () => {
      const stored = await AsyncStorage.getItem('ashaProfile');
      if (stored) setAlreadyRegistered(true);
    };
    checkRegistered();
  }, []);

  const registerASHA = async () => {
  if (!name || !ashaId || !age || !phone || !village) {
    alert('Please fill all required fields');
    return;
  }

  const data = { name, ashaId, age, gender, bloodGroup, phone, email, village };

  try {
    const response = await fetch('http://10.10.100.167:8080/healthapp/api/asha/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.success) {
      await AsyncStorage.setItem('ashaProfile', JSON.stringify(result.data)); // store backend response
      navigation.replace('ASHADashboard', { language });
    } else {
      alert('Registration failed: ' + result.message);
    }
  } catch (error) {
    console.error(error);
    alert('Failed to connect to server. Make sure backend is running.');
  }
};



  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>{lang.ashaRegistration}</Text>

      {/* Basic details */}
      <Text style={styles.label}>Full Name *</Text>
      <TextInput style={styles.input} placeholder="Enter full name" value={name} onChangeText={setName} />

      <Text style={styles.label}>ASHA ID *</Text>
      <TextInput style={styles.input} placeholder="Enter your ASHA ID" value={ashaId} onChangeText={setAshaId} />

      {/* Age + Gender side by side */}
      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Age *</Text>
          <TextInput
            style={[styles.input, { height: 50 }]}
            placeholder="Enter age"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Gender *</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={gender} onValueChange={(itemValue) => setGender(itemValue)}>
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </View>
      </View>

      {/* Blood group */}
      <Text style={styles.label}>Blood Group *</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={bloodGroup} onValueChange={(itemValue) => setBloodGroup(itemValue)}>
          <Picker.Item label="A+" value="A+" />
          <Picker.Item label="A-" value="A-" />
          <Picker.Item label="B+" value="B+" />
          <Picker.Item label="B-" value="B-" />
          <Picker.Item label="O+" value="O+" />
          <Picker.Item label="O-" value="O-" />
          <Picker.Item label="AB+" value="AB+" />
          <Picker.Item label="AB-" value="AB-" />
        </Picker>
      </View>

      {/* Contact */}
      <Text style={styles.label}>Phone Number *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter mobile number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <Text style={styles.label}>Email (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Location */}
      <Text style={styles.label}>Village / Area *</Text>
      <TextInput style={styles.input} placeholder="Enter village/area" value={village} onChangeText={setVillage} />

      <Button title="Register ASHA" color="#0073e6" onPress={registerASHA} />

      {alreadyRegistered && (
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.replace('ASHADashboard', { language })}>
          <Text style={{ color: '#00b33c', textAlign: 'center', fontWeight: 'bold' }}>
            Already Registered? Go to Dashboard
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0073e6',
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#0073e6',
  },
  input: {
    borderWidth: 1,
    borderColor: '#0073e6',
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#0073e6',
    borderRadius: 8,
    marginBottom: 12,
    height:50,
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  half: {
    flex: 1,
    marginRight: 8,
  },
});
