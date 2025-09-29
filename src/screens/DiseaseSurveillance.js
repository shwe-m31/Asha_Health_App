// src/screens/DiseaseSurveillance.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { languages } from '../lang';
import { syncPending } from '../services/syncService';

export default function DiseaseSurveillance({ navigation, route }) {
  const { language } = route.params;
  const lang = languages[language];

  const [clientId, setClientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [disease, setDisease] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [village, setVillage] = useState('');
  const [notes, setNotes] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');

  useEffect(() => {
    const generateClientId = async () => {
      const raw = await AsyncStorage.getItem('diseaseSurveillance');
      const list = raw ? JSON.parse(raw) : [];
      const idNum = (list.length + 1).toString().padStart(5, '0');
      setClientId(`DS${idNum}`);
    };
    generateClientId();
  }, []);

  const saveLocal = async () => {
    if (!patientName || !age || !gender || !village) {
      alert('Please fill all required fields');
      return;
    }

    const raw = await AsyncStorage.getItem('diseaseSurveillance');
    const list = raw ? JSON.parse(raw) : [];
    list.push({
      clientId,
      patientName,
      age,
      gender,
      disease,
      reportDate,
      village,
      notes,
      bloodGroup,
      status:'PENDING'
    });
    await AsyncStorage.setItem('diseaseSurveillance', JSON.stringify(list));
    alert(`${lang.diseaseSurveillance} saved locally`);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':null} keyboardVerticalOffset={80}>
      <ScrollView style={styles.container} contentContainerStyle={{paddingBottom:20}} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.label}>Client ID</Text>
          <Text style={styles.clientId}>{clientId}</Text>

          <Text style={styles.label}>Patient Name *</Text>
          <TextInput style={styles.input} value={patientName} onChangeText={setPatientName} />

          <Text style={styles.label}>Age *</Text>
          <TextInput style={styles.input} value={age} onChangeText={setAge} />

          <Text style={styles.label}>Gender *</Text>
          <TextInput style={styles.input} value={gender} onChangeText={setGender} />

          <Text style={styles.label}>Disease / Symptoms</Text>
          <TextInput style={styles.input} value={disease} onChangeText={setDisease} />

          <Text style={styles.label}>Date of Report</Text>
          <TextInput style={styles.input} value={reportDate} onChangeText={setReportDate} />

          <Text style={styles.label}>Village / Area *</Text>
          <TextInput style={styles.input} value={village} onChangeText={setVillage} />

          <Text style={styles.label}>ASHA Notes</Text>
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
