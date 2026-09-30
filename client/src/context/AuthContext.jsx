import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiCall } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('winter_arc_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('winter_arc_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const userData = await apiCall('/auth/me');
          setUser(userData);
          localStorage.setItem('winter_arc_user', JSON.stringify(userData));
        } catch (err) {
          console.error('Failed to verify token:', err);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await apiCall('/auth/login', 'POST', { email, password });
    setToken(data.token);
    setUser(data);
    localStorage.setItem('winter_arc_token', data.token);
    localStorage.setItem('winter_arc_user', JSON.stringify(data));
    return data;
  };

  const register = async (userData) => {
    const data = await apiCall('/auth/register', 'POST', userData);
    setToken(data.token);
    setUser(data);
    localStorage.setItem('winter_arc_token', data.token);
    localStorage.setItem('winter_arc_user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('winter_arc_token');
    localStorage.removeItem('winter_arc_user');
  };

  const updateProfile = async (profileData) => {
    const updated = await apiCall('/user/profile', 'PUT', profileData);
    setUser(prev => ({ ...prev, ...updated }));
    localStorage.setItem('winter_arc_user', JSON.stringify({ ...user, ...updated }));
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: Boolean(user && token)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
