const BASE_URL = '/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: 'An error occurred' };
    }
    
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
      return null;
    }
    
    throw new Error(errorData.message || 'API request failed');
  }
  
  return response.json();
};

export const api = {
  get: async (endpoint) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: getAuthHeader()
      });
      return handleResponse(response);
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  },

  post: async (endpoint, data) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  },

  put: async (endpoint, data) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      return handleResponse(response);
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  }
};