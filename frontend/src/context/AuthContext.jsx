import React, { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../services/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Check auth status on mount or token change
  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const response = await axiosInstance.get('/auth/me');
          if (response.data.success) {
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
        } catch (error) {
          console.error('Auth verification failed:', error);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  // Login action
  const login = useCallback(async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;
        
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setToken(newToken);
        setUser(userData);
        
        return { success: true, user: userData };
      } else {
        return { success: false, error: response.data.error || 'Login failed' };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Invalid credentials or server error';
      return { success: false, error: errorMessage };
    }
  }, []);

  // Logout action
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
