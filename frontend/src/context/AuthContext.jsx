import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('decor_admin_token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('decor_admin_user') || 'null'));
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login/', { username, password });
      const { token, username: uname, email } = response.data;
      const userData = { username: uname, email };

      setToken(token);
      setUser(userData);

      localStorage.setItem('decor_admin_token', token);
      localStorage.setItem('decor_admin_user', JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.error || 'Invalid credentials. Please try again.';
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('decor_admin_token');
    localStorage.removeItem('decor_admin_user');
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoggedIn: !!token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
