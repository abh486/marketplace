// src/screens/Auth/BackendLoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import authApi from '../api/authApi'; // adjust path if your file is elsewhere

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Provide email and password');
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      // success path depends on backend payload
      if (res?.data?.success) {
        Alert.alert('Logged in', 'Success');
        // navigate to Home (or Wallet) — replace route name if different
        navigation.replace('Home');
      } else {
        const errMsg = res?.data?.error || JSON.stringify(res?.data) || 'Login failed';
        Alert.alert('Login failed', errMsg);
      }
    } catch (err) {
      // axios error object contains response.data when server returned JSON error
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
      const msg = serverMsg || err.message || 'Login failed';
      Alert.alert('Login error', String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Backend Login (test)</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />

      <View style={{ marginTop: 12 }}>
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Button title="Login" onPress={handleLogin} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, flex: 1, justifyContent: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, marginTop: 10 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
});
