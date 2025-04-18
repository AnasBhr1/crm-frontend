import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_URL } from '../config/constants';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  
  // Setup axios default header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);
  
  // Check if token is valid on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        // Check if token is expired
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        
        if (isExpired) {
          logout();
          return;
        }
        
        // Fetch current user data
        const response = await axios.get(`${API_URL}/api/me`);
        setUser(response.data);
      } catch (error) {
        console.error('Error verifying token:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    
    verifyToken();
  }, [token]);
  
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      
      const userData = await axios.get(`${API_URL}/api/me`);
      setUser(userData.data);
      
      toast.success('Successfully logged in!');
      return userData.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      throw error;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };
  
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};