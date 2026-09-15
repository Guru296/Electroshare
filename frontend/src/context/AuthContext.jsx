import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login as loginApi } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Assuming the JWT has roles or role, and sub/email.
        // Adjust these fields based on standard Spring Security JWT
        setUser({
          ...decoded,
          email: decoded.sub, // Spring often puts username/email in 'sub'
        });
      } catch (error) {
        console.error('Invalid token', error);
        logout();
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await loginApi(credentials);
      // Backend might return just the token as a string, or an object like { token: '...' }
      // Assuming it's { token: '...' } or just the token string directly.
      const jwtToken = typeof response === 'string' ? response : (response.token || response.jwt || response.accessToken);
      
      if (jwtToken) {
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => {
    if (!user) return false;
    // Check various common ways Spring puts roles in JWT
    const roles = user.roles || user.role || user.authorities || [];
    if (Array.isArray(roles)) {
      return roles.includes('ADMIN') || roles.includes('ROLE_ADMIN');
    }
    return roles === 'ADMIN' || roles === 'ROLE_ADMIN';
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
