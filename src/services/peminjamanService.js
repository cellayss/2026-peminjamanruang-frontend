
import api from './api';

// Status enum
export const PeminjamanStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
  Completed: 3,
};

// Helper untuk nama status
export const getStatusName = (status) => {
  const statusMap = {
    0: 'Pending',
    1: 'Approved',
    2: 'Rejected',
    3: 'Completed',
  };
  return statusMap[status] || 'Unknown';
};

// Helper untuk class CSS status
export const getStatusClass = (status) => {
  const classMap = {
    0: 'status-pending',
    1: 'status-approved',
    2: 'status-rejected',
    3: 'status-completed',
  };
  return classMap[status] || '';
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

  // Create new peminjaman
  create: async (data) => {
    const response = await api.post('/api/Peminjaman', data);
    return response.data;
  },

  // Update status
  updateStatus: async (id, status) => {
  return await api.put(
    `/api/Peminjaman/${id}/status`,
    { status }
  );
  },

  update: async (id, data) => {
    const response = await api.put(`/api/Peminjaman/${id}`, data);
    return response.data;
  },

  // Delete peminjaman
  delete: async (id) => {
    await api.delete(`/api/Peminjaman/${id}`);
  },
};