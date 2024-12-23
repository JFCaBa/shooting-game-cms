
const BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token
    ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    : {
        'Content-Type': 'application/json',
      };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      console.warn('Unauthorized access. Redirecting to login...');
      localStorage.removeItem('token');
      window.location.href = '/'; // Redirect to the login page
      return null;
    }

    if (response.headers.get('Content-Type')?.includes('application/json')) {
      const error = await response.json();
      throw new Error(error.message || `Request failed with status ${response.status}`);
    } else {
      throw new Error(`Unexpected response: ${response.statusText}`);
    }
  }

  if (response.headers.get('Content-Type')?.includes('application/json')) {
    return response.json();
  }

  return response.text(); // Return plain text for non-JSON responses
};

export const api = {
  get: async (endpoint) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: getAuthHeader(),
      });
      return await handleResponse(response);
    } catch (err) {
      console.error(`[API GET] ${endpoint} -`, err.message);
      throw err;
    }
  },

  post: async (endpoint, data) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (err) {
      console.error(`[API POST] ${endpoint} -`, err.message);
      throw err;
    }
  },

  put: async (endpoint, data) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (err) {
      console.error(`[API PUT] ${endpoint} -`, err.message);
      throw err;
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      return await handleResponse(response);
    } catch (err) {
      console.error(`[API DELETE] ${endpoint} -`, err.message);
      throw err;
    }
  },
};