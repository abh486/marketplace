// src/api/authApi.js
import api from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authApi = {
  // email/password login
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    // backend is expected to return { success: true, token: "<jwt>", user: {...} }
    if (res?.data?.token) {
      await AsyncStorage.setItem('accessToken', res.data.token);
      // set default header for immediate subsequent requests
      api.defaults.headers.common = api.defaults.headers.common || {};
      api.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
    }
    return res;
  },

  register: async (name, email, password, role = 'INVESTOR') => {
    const res = await api.post('/auth/register', { name, email, password, role });
    if (res?.data?.token) {
      await AsyncStorage.setItem('accessToken', res.data.token);
      api.defaults.headers.common = api.defaults.headers.common || {};
      api.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
    }
    return res;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore network failure on logout
    } finally {
      await AsyncStorage.removeItem('accessToken');
      if (api.defaults.headers && api.defaults.headers.common) {
        delete api.defaults.headers.common.Authorization;
      }
    }
  },

  getProfile: async () => api.get('/auth/profile'),
};

export default authApi;
