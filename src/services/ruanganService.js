
import api from './api';

export const ruanganService = {
  // Get all ruangan
  getAll: async () => {
    const response = await api.get('/api/Ruangan');
    return response.data;
  },

  // Get ruangan by ID
  getById: async (id) => {
    const response = await api.get(`/api/Ruangan/${id}`);
    return response.data;
  },

  // Create ruangan
  create: async (data) => {
    const response = await api.post('/api/Ruangan', data);
    return response.data;
  },

  // Update ruangan
  update: async (id, data) => {
    const response = await api.put(`/api/Ruangan/${id}`, data);
    return response.data;
  },

  // Delete ruangan
  delete: async (id) => {
    await api.delete(`/api/Ruangan/${id}`);
  },
};