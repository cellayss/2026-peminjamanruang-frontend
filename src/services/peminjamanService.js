
import api from './api';


export const PeminjamanStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
  Completed: 3,
};


export const getStatusName = (status) => {
  const statusMap = {
    0: 'Pending',
    1: 'Approved',
    2: 'Rejected',
    3: 'Completed',
  };
  return statusMap[status] || 'Unknown';
};

export const peminjamanService = {
  // Get all peminjaman
  getAll: async () => {
    const response = await api.get('/api/Peminjaman');
    return response.data;
  },

  // Get peminjaman by ID
  getById: async (id) => {
    const response = await api.get(`/api/Peminjaman/${id}`);
    return response.data;
  },

  // Create peminjaman
  create: async (data) => {
    const response = await api.post('/api/Peminjaman', data);
    return response.data;
  },

  // Update status
  updateStatus: async (id, status) => {
    const response = await api.put(`/api/Peminjaman/${id}/status`, status, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Delete peminjaman
  delete: async (id) => {
    await api.delete(`/api/Peminjaman/${id}`);
  },
};