import React from 'react';
import { View, Text, Button, StyleSheet, Image, ImageBackground } from 'react-native';
import { languages } from '../lang';

export default function LanguageSelection({ navigation }) {
  return (
    <ImageBackground
      source={require('../../assets/background.png')}  // ✅ background image
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image source={require('../../assets/logo.jpg')} style={styles.logo} />
        <Text style={styles.title}>{languages.en.selectLanguage}</Text>

        <Button
          title="English"
          color="#0073e6"
          onPress={() => navigation.navigate('RoleSelection', { language: 'en' })}
        />

        <View style={{ height: 10 }} />

        <Button
          title="தமிழ்"
          color="#00b33c"
          onPress={() => navigation.navigate('RoleSelection', { language: 'ta' })}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)', // transparent white box
    borderRadius: 20,
    padding: 25,
    width: '85%',
  },
  logo: { width: 120, height: 120, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
});
