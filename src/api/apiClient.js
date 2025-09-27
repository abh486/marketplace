// src/api/apiClient.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const getBase = () => {
  // Default for Android emulator. Change if you use a device or iOS simulator.
  if (Platform.OS === 'android') return 'http://10.0.2.2:5000/api';
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBase(),
  timeout: 15000,
});

// Attach token from AsyncStorage to every request (if present)
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers = config.headers || {};
        // Avoid overriding if already set
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      console.warn('apiClient: failed to read token from storage', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Basic 401 handler: remove token and pass the error back
api.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    try {
      const status = error?.response?.status;
      if (status === 401) {
        // Token invalid/expired — clear stored token so next login is required
        await AsyncStorage.removeItem('accessToken');
        // Also remove default Authorization if set
        if (api.defaults.headers && api.defaults.headers.common) {
          delete api.defaults.headers.common.Authorization;
        }
        console.warn('apiClient: 401 received — cleared stored accessToken');
      }
    } catch (e) {
      console.warn('apiClient: error in response interceptor', e);
    }
    return Promise.reject(error);
  }
);

export default api;
