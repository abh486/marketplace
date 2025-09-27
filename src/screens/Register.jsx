import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const API_URL = 'http://10.0.2.2:5000/api/auth/register';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();     // capture raw text
      let data;
      try { data = JSON.parse(text); }   // parse if valid JSON
      catch { throw new Error(text); }

      if (!res.ok) throw new Error(data.error || 'Registration failed');
      Alert.alert('Success', 'Account created!');
      navigation.navigate('Login');      // go back to login
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}
