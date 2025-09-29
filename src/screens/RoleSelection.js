import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { languages } from '../lang';

export default function RoleSelection({ navigation, route }) {
  const { language } = route.params;
  const lang = languages[language];

  return (
    <ImageBackground
      source={require('../../assets/background.png')}   // 👈 add your background image here
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Text style={styles.title}>{lang.selectRole}</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#0073e6' }]}
          onPress={() => navigation.navigate('ASHARegistration', { language })}
        >
          <Text style={styles.buttonText}>{lang.asha}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#00b33c' }]}
          onPress={() => navigation.navigate('PHCRegistration', { language })}
        >
          <Text style={styles.buttonText}>{lang.phc}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.8)', // optional: fade white layer for readability
  },
  title: {
    fontSize: 22,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0073e6',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 10,
    width: '70%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
