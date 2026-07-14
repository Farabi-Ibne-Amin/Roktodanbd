// Admin API Helper for RoktoDanBD

const API_BASE = '/api/admin';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const token = localStorage.getItem('adminToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      // Automatic logout on token expiry or invalidation
      adminApi.logout();
      adminToast.error('Session expired. Please log in again.');
    }
    const error = new Error(data.error || 'Something went wrong');
    error.status = response.status;
    throw error;
  }
  return data;
};

const adminApi = {
  // Authentication
  login: async (credentials) => {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem('adminToken', data.token);
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    window.location.hash = '#/login';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },

  // Users / Donors management
  getUsers: async () => {
    const response = await fetch(`${API_BASE}/users`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getUserDetails: async (id) => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  approveUser: async (id, payload = {}) => {
    const response = await fetch(`${API_BASE}/users/${id}/approve`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(response);
  },

  rejectUser: async (id, payload = {}) => {
    const response = await fetch(`${API_BASE}/users/${id}/reject`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(response);
  },

  suspendUser: async (id, payload = {}) => {
    const response = await fetch(`${API_BASE}/users/${id}/suspend`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(response);
  },

  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Requests management
  getRequests: async () => {
    const response = await fetch(`${API_BASE}/requests`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  updateRequest: async (id, payload) => {
    const response = await fetch(`${API_BASE}/requests/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(response);
  },

  // Stats
  getStats: async () => {
    const response = await fetch(`${API_BASE}/stats`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Donations logs
  getDonations: async () => {
    const response = await fetch(`${API_BASE}/donations`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Thalassemia management
  getThalassemia: async () => {
    const response = await fetch(`${API_BASE}/thalassemia`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  updateThalassemia: async (id, status) => {
    const response = await fetch(`${API_BASE}/thalassemia/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  // Settings
  getSettings: async () => {
    const response = await fetch(`${API_BASE}/settings`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  updateSettings: async (settings) => {
    const response = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(settings)
    });
    return handleResponse(response);
  }
};

window.adminApi = adminApi;

// Toast alerts helper for Admin
const adminToast = {
  show: (message, type = 'success') => {
    const container = document.getElementById('admin-toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    toast.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()" style="color:inherit; font-weight:700; margin-left:12px;">&times;</button>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  },
  success: (m) => adminToast.show(m, 'success'),
  error: (m) => adminToast.show(m, 'error'),
  info: (m) => adminToast.show(m, 'info')
};
window.adminToast = adminToast;
