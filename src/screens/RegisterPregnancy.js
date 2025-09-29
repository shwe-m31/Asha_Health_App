// src/screens/RegisterPregnancy.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { languages } from '../lang';
import { syncPending } from '../services/syncService';

export default function RegisterPregnancy({ navigation, route }) {
  const { language } = route.params;
  const lang = languages[language];

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [edd, setEdd] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [notes, setNotes] = useState('');
  const [clientId, setClientId] = useState('');

  useEffect(() => {
    const generateClientId = async () => {
      const raw = await AsyncStorage.getItem('pregnancy');
      const list = raw ? JSON.parse(raw) : [];
      const idNum = (list.length + 1).toString().padStart(5, '0');
      setClientId(`P${idNum}`);
    };
    generateClientId();
  }, []);

  const saveLocal = async () => {
    if (!name || !age || !bloodGroup || !edd || !phone || !village) {
      alert('Please fill all required fields');
      return;
    }
    const raw = await AsyncStorage.getItem('pregnancy');
    const list = raw ? JSON.parse(raw) : [];
    list.push({ clientId, name, age, bloodGroup, edd, phone, village, notes, status: 'PENDING' });
    await AsyncStorage.setItem('pregnancy', JSON.stringify(list));
    alert(`${lang.registerPregnancy} saved locally`);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={styles.card}>
        <Text style={styles.label}>Client ID</Text>
        <Text style={styles.clientId}>{clientId}</Text>

        <Text style={styles.label}>Mother Name *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Age *</Text>
        <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />

        <Text style={styles.label}>Blood Group *</Text>
        <TextInput style={styles.input} value={bloodGroup} onChangeText={setBloodGroup} />

        <Text style={styles.label}>Expected Delivery Date *</Text>
        <TextInput style={styles.input} value={edd} onChangeText={setEdd} placeholder="DD/MM/YYYY" />

        <Text style={styles.label}>Phone Number *</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <Text style={styles.label}>Village / Area *</Text>
        <TextInput style={styles.input} value={village} onChangeText={setVillage} />

        <Text style={styles.label}>ASHA Notes / High-Risk Status</Text>
        <TextInput style={styles.input} value={notes} onChangeText={setNotes} placeholder="Optional notes" />

        <Button title="Save Locally" color="#00b33c" onPress={saveLocal} />
        <View style={{ height: 10 }} />
        <Button title="Sync Now" color="#0073e6" onPress={() => syncPending()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0fff0', padding: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  label: { fontWeight: 'bold', marginBottom: 4, color: '#00b33c' },
  input: { borderWidth: 1, borderColor: '#00b33c', borderRadius: 8, marginBottom: 12, padding: 10 },
  clientId: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#00b33c' },
});
