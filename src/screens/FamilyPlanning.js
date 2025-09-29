// src/screens/FamilyPlanning.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { languages } from '../lang';
import { syncPending } from '../services/syncService';

export default function FamilyPlanning({ navigation, route }) {
  const { language } = route.params;
  const lang = languages[language];

  const [clientId, setClientId] = useState('');
  const [coupleName, setCoupleName] = useState('');
  const [contact, setContact] = useState('');
  const [method, setMethod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [village, setVillage] = useState('');
  const [notes, setNotes] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');

  useEffect(() => {
    const generateClientId = async () => {
      const raw = await AsyncStorage.getItem('familyPlanning');
      const list = raw ? JSON.parse(raw) : [];
      const idNum = (list.length + 1).toString().padStart(5, '0');
      setClientId(`FP${idNum}`);
    };
    generateClientId();
  }, []);

  const saveLocal = async () => {
    if (!coupleName || !contact || !method || !village) {
      alert('Please fill all required fields');
      return;
    }

    const raw = await AsyncStorage.getItem('familyPlanning');
    const list = raw ? JSON.parse(raw) : [];
    list.push({ clientId, coupleName, contact, method, startDate, followUp, village, notes, bloodGroup, status:'PENDING' });
    await AsyncStorage.setItem('familyPlanning', JSON.stringify(list));
    alert(`${lang.familyPlanning} saved locally`);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':null} keyboardVerticalOffset={80}>
      <ScrollView style={styles.container} contentContainerStyle={{paddingBottom:20}} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.label}>Client ID</Text>
          <Text style={styles.clientId}>{clientId}</Text>

          <Text style={styles.label}>Couple Name *</Text>
          <TextInput style={styles.input} value={coupleName} onChangeText={setCoupleName} />

          <Text style={styles.label}>Contact Number *</Text>
          <TextInput style={styles.input} value={contact} onChangeText={setContact} keyboardType="phone-pad" />

          <Text style={styles.label}>Method Adopted *</Text>
          <TextInput style={styles.input} value={method} onChangeText={setMethod} />

          <Text style={styles.label}>Start Date</Text>
          <TextInput style={styles.input} value={startDate} onChangeText={setStartDate} />

          <Text style={styles.label}>Follow-up Date</Text>
          <TextInput style={styles.input} value={followUp} onChangeText={setFollowUp} />

          <Text style={styles.label}>Village / Area *</Text>
          <TextInput style={styles.input} value={village} onChangeText={setVillage} />

          <Text style={styles.label}>Notes / Counseling</Text>
          <TextInput style={styles.input} value={notes} onChangeText={setNotes} />

          <Text style={styles.label}>Blood Group</Text>
          <TextInput style={styles.input} value={bloodGroup} onChangeText={setBloodGroup} />

          <Button title={lang.saveLocally} color="#00b33c" onPress={saveLocal} />
          <View style={{height:10}} />
          <Button title={lang.syncNow} color="#0073e6" onPress={() => syncPending()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:'#f0fff0'},
  card:{backgroundColor:'#fff',padding:16,borderRadius:10,margin:16, shadowColor:'#000',shadowOpacity:0.1,shadowRadius:8},
  input:{borderWidth:1,borderColor:'#00b33c',borderRadius:8,marginBottom:12,padding:10},
  label:{fontWeight:'bold',marginBottom:4,color:'#00b33c'},
  clientId:{fontSize:16, fontWeight:'bold', marginBottom:12, color:'#00b33c'}
});
