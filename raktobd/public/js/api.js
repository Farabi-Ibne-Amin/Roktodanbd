// API helper functions for RoktoDanBD

const API_BASE = '/api';

const getHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || 'Something went wrong');
    error.status = response.status;
    error.details = data.details || null;
    throw error;
  }
  return data;
};

const api = {
  // Public routes
  getDonors: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE}/donors?${query}`);
    return handleResponse(response);
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE}/donors/stats`);
    return handleResponse(response);
  },

  getDistricts: async () => {
    const response = await fetch(`${API_BASE}/districts`);
    return handleResponse(response);
  },

  getRequests: async () => {
    const response = await fetch(`${API_BASE}/requests`);
    return handleResponse(response);
  },

  createBkashPayment: async (paymentData) => {
    const response = await fetch(`/api/donations/donate/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });
    return handleResponse(response);
  },

  submitRequest: async (requestData) => {
    const response = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(requestData),
    });
    return handleResponse(response);
  },

  submitThalassemia: async (thalassemiaData) => {
    const response = await fetch(`${API_BASE}/thalassemia`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(thalassemiaData),
    });
    return handleResponse(response);
  },

  register: async (formData) => {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: getHeaders(true), // Content-Type is boundary automatically handled by browser for FormData
      body: formData,
    });
    return handleResponse(response);
  },

  // Auth routes
  login: async (credentials) => {
    const response = await fetch(`${API_BASE}/user/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userPhone', data.phone);
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPhone');
    window.location.hash = '#/login';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // User Dashboard routes (require auth)
  getProfile: async () => {
    const response = await fetch(`${API_BASE}/user/profile`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE}/user/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  getDonations: async () => {
    const response = await fetch(`${API_BASE}/user/donations`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  logDonation: async (donationData) => {
    const response = await fetch(`${API_BASE}/user/donation`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(donationData),
    });
    return handleResponse(response);
  },

  donatedToday: async () => {
    const response = await fetch(`${API_BASE}/user/donated-today`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }
};

window.api = api;
