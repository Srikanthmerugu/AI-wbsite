// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [resetToken, setResetToken] = useState(null);
  const navigate = useNavigate();

  // Check for token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch('http://91.108.104.205:8000/auth/user-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
        setIsAuthenticated(true);
        setUserEmail(email);
                console.log(email, "comming fro the login lone-52")

        toast.success("Login successful");
        navigate('/');
        return true;
      }
      else if (response.ok && data.password_reset_token) {
        localStorage.setItem('resetToken', data.password_reset_token);
        setResetToken(data.password_reset_token);
        setUserEmail(email);
        navigate(`/reset-password/${data.password_reset_token}`);
        return true;
      }
      else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      const response = await fetch('http://91.108.104.205:8000/auth/request-reset-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Password reset link sent to your email');
        return true;
      } else {
        throw new Error(data.message || 'Failed to send reset link');
      }
    } catch (error) {
      toast.error(error.message || 'Network error. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      const response = await fetch(`http://91.108.104.205:8000/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_password: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Password reset successfully! You can now login with your new password.');
        localStorage.removeItem('resetToken');
        setResetToken(null);
        navigate('/login');
        return true;
      } else {
        throw new Error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error(error.message || 'Network error. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setUserEmail('');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ 
      token,
      isAuthenticated,
      loading,
      userEmail,
      resetToken,
      login,
      logout,
      requestPasswordReset,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};