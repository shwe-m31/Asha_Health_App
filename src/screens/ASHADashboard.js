// src/screens/ASHADashboard.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { languages } from '../lang';

export default function ASHADashboard({ navigation, route }) {
  const { language } = route.params;
  const lang = languages[language];

  const [profile, setProfile] = useState({
    name: '',
    ashaId: '',
    dob: '',
    gender: '',
    phone: '',
    email: '',
    village: '',
    householdsVisited: 0,
    pendingTasks: 0,
  });

  const [profileTemp, setProfileTemp] = useState(profile);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [patientsByModule, setPatientsByModule] = useState({});

  // Load profile
  const loadProfile = async () => {
    const raw = await AsyncStorage.getItem('ashaProfile');
    if (raw) {
      const p = JSON.parse(raw);
      setProfile({ ...p, householdsVisited: 0, pendingTasks: 0, recentVisits: 0 });
      setProfileTemp(p);
    }
  };
  
  // Load and group patients by module
  const loadPatients = async () => {
    const modules = ['pregnancy', 'childHealth', 'familyPlanning', 'diseaseSurveillance', 'referrals', 'healthAwareness'];
    let grouped = {};
    let allPatientsCount = 0;
    let pendingCount = 0;

    for (let mod of modules) {
      const raw = await AsyncStorage.getItem(mod);
      if (raw) {
        const arr = JSON.parse(raw).map((i) => ({
          clientId: i.clientId || 'Unknown ID',
          bloodGroup: i.bloodGroup || '',
          module: mod,
          ...i
        }));
        grouped[mod] = arr;
        allPatientsCount += arr.length;
        pendingCount += arr.filter(p => p.status === 'PENDING').length;
      } else {
        grouped[mod] = [];
      }
    }

    setPatientsByModule(grouped);
    setProfile(prev => ({ ...prev, householdsVisited: allPatientsCount, pendingTasks: pendingCount, recentVisits: allPatientsCount ? 5 : 0 }));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProfile();
      loadPatients();
    });
    return unsubscribe;
  }, [navigation]);

  const saveProfile = async () => {
    const updatedProfile = { ...profile, ...profileTemp };
    await AsyncStorage.setItem('ashaProfile', JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
    setProfileModalVisible(false);
  };

  const deletePatient = async (module, clientIdToDelete) => {
  Alert.alert(
    lang.confirmDeletion || 'Confirm Deletion',
    lang.areYouSureToDelete || 'Are you sure you want to delete this entry? This action cannot be undone.',
    [
      { text: lang.cancel || 'Cancel', style: 'cancel' },
      {
        text: lang.delete || 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const raw = await AsyncStorage.getItem(module);
            if (!raw) return;

            let currentList = JSON.parse(raw);
            // Filter out the patient by clientId
            const updatedList = currentList.filter(p => 
              p.clientId.toString() !== clientIdToDelete.toString()
            );

            await AsyncStorage.setItem(module, JSON.stringify(updatedList));
            loadPatients();
            Alert.alert('Success', 'Patient entry deleted successfully.');
          } catch (error) {
            console.error('Error deleting patient:', error);
            Alert.alert('Error', 'Failed to delete entry. Please try again.');
          }
        },
      },
    ],
    { cancelable: true }
  );
};


  const CardButton = ({ title, color, onPress }) => (
    <TouchableOpacity style={[styles.cardButton, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.cardButtonText}>{title}</Text>
    </TouchableOpacity>
  );
  
  // Helper: readable module name
  const moduleNames = {
    pregnancy: lang.registerPregnancy,
    childHealth: lang.childHealth,
    familyPlanning: lang.familyPlanning,
    diseaseSurveillance: lang.diseaseSurveillance,
    referrals: lang.referrals,
    healthAwareness: lang.healthAwareness
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.welcome}>{lang.welcome}, {profile.name}</Text>
          <Text style={styles.stats}>{lang.householdsVisited}: {profile.householdsVisited}</Text>
          <Text style={styles.stats}>{lang.pendingTasks}: {profile.pendingTasks}</Text>
          <Text style={styles.stats}>{lang.recentVisits}: {profile.recentVisits}</Text>
          <Text style={styles.stats}>{lang.area}: {profile.village}</Text>
        </View>
        <TouchableOpacity onPress={() => setProfileModalVisible(true)}>
          <View style={styles.profilePlaceholder}>
            <AntDesign name="user" size={30} color="#0073e6" />
          </View>
          <Text style={styles.editText}>{lang.profile}</Text>
        </TouchableOpacity>
      </View>

      {/* Patients grouped by module */}
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
        {Object.keys(patientsByModule).map((mod) => (
          <View key={mod}>
            {patientsByModule[mod].length > 0 && (
              <>
                <Text style={styles.moduleHeader}>{moduleNames[mod]}</Text>
                {patientsByModule[mod].map((p, idx) => (
                  <View key={idx} style={styles.card}>
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.cardTitle}>
                        {p.name || p.childName || p.coupleName || p.patientName || 'Unknown'}
                      </Text>
                      <TouchableOpacity 
                        style={styles.deleteButton} 
                        onPress={() => deletePatient(mod, p.clientId)} // Use the new delete function
                      >
                        <Text style={styles.deleteButtonText}>del</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.cardTitle}>{p.name || p.childName || p.coupleName || p.patientName || 'Unknown'}</Text>
                    <Text style={styles.cardSubtitle}>Client ID: {p.clientId} | Blood Group: {p.bloodGroup}</Text>
                    {p.age && <Text>Age: {p.age}</Text>}
                    {p.gender && <Text>Gender: {p.gender}</Text>}
                    {p.phone && <Text>Phone: {p.phone}</Text>}
                    {p.village && <Text>Village: {p.village}</Text>}
                    {p.status && <Text>Status: {p.status}</Text>}
                    {p.dob && <Text>DOB: {p.dob}</Text>}
                    {p.edd && <Text>EDD: {p.edd}</Text>}
                    {p.method && <Text>Method: {p.method}</Text>}
                    {p.disease && <Text>Disease: {p.disease}</Text>}
                    {p.referredTo && <Text>Referred To: {p.referredTo}</Text>}
                    {p.notes && <Text>Notes: {p.notes}</Text>}
                    {p.weight && <Text>Weight: {p.weight}</Text>}
                    {p.height && <Text>Height: {p.height}</Text>}
                    {p.participants && <Text>Participants: {p.participants}</Text>}
                    {p.targetGroup && <Text>Target Group: {p.targetGroup}</Text>}
                  </View>
                ))}
              </>
            )}
          </View>
        ))}
        {Object.values(patientsByModule).every(arr => arr.length === 0) &&
          <Text style={{ textAlign: 'center', marginTop: 20 }}>{lang.noEntries}</Text>
        }
      </ScrollView>

      {/* Floating "+" button */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
        <AntDesign name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Modules modal */}
      <Modal transparent animationType="slide" visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{lang.addNewEntry}</Text>
          <CardButton title={lang.registerPregnancy} color="#0073e6" onPress={() => { setModalVisible(false); navigation.navigate('RegisterPregnancy', { language }); }} />
          <CardButton title={lang.childHealth} color="#00b33c" onPress={() => { setModalVisible(false); navigation.navigate('ChildHealth', { language }); }} />
          <CardButton title={lang.familyPlanning} color="#0073e6" onPress={() => { setModalVisible(false); navigation.navigate('FamilyPlanning', { language }); }} />
          <CardButton title={lang.diseaseSurveillance} color="#00b33c" onPress={() => { setModalVisible(false); navigation.navigate('DiseaseSurveillance', { language }); }} />
          <CardButton title={lang.referrals} color="#0073e6" onPress={() => { setModalVisible(false); navigation.navigate('Referrals', { language }); }} />
          <CardButton title={lang.healthAwareness} color="#00b33c" onPress={() => { setModalVisible(false); navigation.navigate('HealthAwareness', { language }); }} />
        </View>
      </Modal>

      {/* Profile edit modal */}
      <Modal transparent animationType="slide" visible={profileModalVisible}>
        <TouchableWithoutFeedback onPress={() => setProfileModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <ScrollView>
            {[
              { key: 'name', label: 'Full Name' },
              { key: 'ashaId', label: 'ASHA ID' },
              { key: 'age', label: 'Age' },
              { key: 'gender', label: 'Gender' },
              { key: 'bloodGroup', label: 'Blood Group' },
              { key: 'phone', label: 'Phone' },
              { key: 'email', label: 'Email' },
              { key: 'village', label: 'Village / Area' }
            ].map(field => (
              <View key={field.key} style={{ marginBottom: 12 }}>
                <Text style={{ color: '#0073e6', fontWeight: 'bold', marginBottom: 4 }}>{field.label}</Text>
                <TextInput
                  style={styles.input}
                  value={String(profileTemp[field.key] || '')}
                  onChangeText={(text) => setProfileTemp({ ...profileTemp, [field.key]: text })}
                />
              </View>
            ))}
            <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
              <Text style={styles.saveButtonText}>{lang.saveProfile}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#f0f8ff' },
  welcome: { fontSize: 20, fontWeight: 'bold', color: '#0073e6' },
  stats: { fontSize: 14, color: '#00b33c', marginTop: 2 },
  profilePlaceholder: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#0073e6', justifyContent: 'center', alignItems: 'center' },
  editText: { fontSize: 12, color: '#0073e6', textAlign: 'center' },
  container: { flex: 1, paddingHorizontal: 12, paddingTop: 8 },
  floatingButton: { position: 'absolute', bottom: 24, right: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: '#0073e6', justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContent: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#f0f8ff', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' },
  cardButton: { padding: 16, borderRadius: 10, marginVertical: 6, alignItems: 'center' },
  cardButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#0073e6' },
  moduleHeader: { fontSize: 18, fontWeight: 'bold', color: '#0073e6', marginVertical: 8 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, width: '100%', maxWidth: 360, alignSelf: 'center' },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4, // Add a little space below the title row
  },
  cardTitle: { fontWeight: 'bold', fontSize: 16, color: '#0073e6', flexShrink: 1 },
  cardSubtitle: { fontSize: 14, color: '#00b33c', flexShrink: 1 },
  deleteButton: {
    backgroundColor: '#19a564ff', // Red color for delete
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 12 },
  saveButton: { backgroundColor: '#0073e6', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
