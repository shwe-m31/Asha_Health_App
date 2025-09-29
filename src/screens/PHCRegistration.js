// src/screens/PHCRegistration.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { languages } from '../lang';

export default function PHCRegistration({ navigation, route }) {
  const { language } = route.params;
  const lang = languages[language];

  const [fullName, setFullName] = useState('');
  const [phcId, setPhcId] = useState('');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [areaCovered, setAreaCovered] = useState('');
  const [age, setAge] = useState('');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  useEffect(() => {
    const checkRegistered = async () => {
      const stored = await AsyncStorage.getItem('phcProfile');
      if (stored) {
        const data = JSON.parse(stored);
        setFullName(data.fullName || '');
        setPhcId(data.phcId || '');
        setDesignation(data.designation || '');
        setPhone(data.phone || '');
        setEmail(data.email || '');
        setAreaCovered(data.areaCovered || '');
        setAge(data.age || '');
        setBloodGroup(data.bloodGroup || 'A+');
        setAlreadyRegistered(true);
      }
    };
    checkRegistered();
  }, []);

  const registerPHC = async () => {
    if (!fullName || !phcId || !designation || !phone || !areaCovered) {
      alert('Please fill all required fields');
      return;
    }
    const data = { fullName, phcId, designation, phone, email, areaCovered, age, bloodGroup };
    await AsyncStorage.setItem('phcProfile', JSON.stringify(data));
    navigation.replace('PHCDashboard', { language });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>{lang.phcRegistration || 'PHC Registration'}</Text>

      <Text style={styles.label}>Full Name *</Text>
      <TextInput style={styles.input} placeholder="Enter full name" value={fullName} onChangeText={setFullName} />

      <Text style={styles.label}>PHC ID / Employee ID *</Text>
      <TextInput style={styles.input} placeholder="Enter PHC ID" value={phcId} onChangeText={setPhcId} />

      <Text style={styles.label}>Designation *</Text>
      <TextInput style={styles.input} placeholder="Enter designation" value={designation} onChangeText={setDesignation} />

      {/* Age + Blood Group side by side */}
      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={[styles.input, { height: 50 }]}
            placeholder="Enter age"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Blood Group</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={bloodGroup} onValueChange={setBloodGroup}>
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
        </View>
      </View>

      <Text style={styles.label}>Phone Number *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
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

      <Text style={styles.label}>Area Covered *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter villages/region"
        value={areaCovered}
        onChangeText={setAreaCovered}
      />

      <Button title={lang.save || 'Register PHC'} color="#0073e6" onPress={registerPHC} />

      {alreadyRegistered && (
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.replace('PHCDashboard', { language })}>
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
    height: 50,
    justifyContent: 'center',
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
