const API_BASE = '/api';

const getAuthToken = () => {
  return localStorage.getItem('winter_arc_token') || '';
};

export const apiCall = async (endpoint, method = 'GET', body = null) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    
    // Check if unauthorized
    if (response.status === 401) {
      // Clear token if invalid
      if (endpoint !== '/auth/login' && endpoint !== '/auth/register') {
        localStorage.removeItem('winter_arc_token');
        localStorage.removeItem('winter_arc_user');
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error.message);
    throw error;
  }
};
