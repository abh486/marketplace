// src/api/vaultApi.js
import api from './apiClient';

const vaultApi = {
  createVault() {
    return api.post('/vault/create');
  },
  getVaultInfo() {
    return api.get('/vault/info');
  },
  testConnection() {
    return api.get('/vault/test-connection');
  },
  getAllUsersVaultStatus() {
    return api.get('/vault/all-users');
  },
};

export default vaultApi;
