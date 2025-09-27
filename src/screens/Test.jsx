import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import apiClient from '../api/apiClient'; // adjust the path if needed

const TestApiScreen = () => {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    apiClient.get('/')
      .then(res => setMessage(res.data))
      .catch(err => setMessage('Error: ' + err.message));
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18 }}>{message}</Text>
    </View>
  );
};

export default TestApiScreen;
