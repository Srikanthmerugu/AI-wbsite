// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config/config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [resetToken, setResetToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [twoFASetupToken, setTwoFASetupToken] = useState(null);
  const [twoFALoginToken, setTwoFALoginToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Check for token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setCurrentUser(userData);
          setUserEmail(userData.user_email || '');
          setUserId(userData.user_id || null);
        } catch (e) {
          console.error("Failed to parse user data", e);
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/company/user/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.access_token) {
        // Standard login success
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('currentUser', JSON.stringify(data));
        setToken(data.access_token);
        setIsAuthenticated(true);
        setCurrentUser(data);
        setUserEmail(email);
        setUserId(data.user_id || null);
        toast.success("Login successful");
        navigate('/');
        return true;
      }
      else if (data.password_reset_token) {
        // Password reset required
        localStorage.setItem('resetToken', data.password_reset_token);
        setResetToken(data.password_reset_token);
        setUserEmail(email);
        navigate(`/reset-password/${data.password_reset_token}`);
        return true;
      }
      else if (data.token_type === "2FA_setup_token") {
        // 2FA setup required
        localStorage.setItem('twoFASetupToken', data["2FA_setup_token"]);
        localStorage.setItem('userId', data.user_id);
        setTwoFASetupToken(data["2FA_setup_token"]);
        setUserEmail(email);
        setUserId(data.user_id);
        navigate(`/setup-2fa/${data["2FA_setup_token"]}`);
        return true;
      }
      else if (data.token_type === "2FA_login_token" || data.token_type === "2FA_setup_login") {
        // 2FA verification required
        localStorage.setItem('twoFALoginToken', data["2FA_login_token"]);
        setTwoFALoginToken(data["2FA_login_token"]);
        setUserEmail(email);
        setUserId(data.user_id);
        navigate('/verify-2fa');
        return true;
      }
      else {
        throw new Error(data.message || 'Login failed - unknown response');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verify2FALogin = async (code) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('twoFALoginToken');
      if (!token) {
        throw new Error('No 2FA token found');
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/company/user/auth/2fa/login/${token}/${code}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.access_token) {
           localStorage.setItem('token', data.access_token);
        localStorage.setItem('currentUser', JSON.stringify(data));
        setToken(data.access_token);
        setIsAuthenticated(true);
        setCurrentUser(data);
        // setUserEmail(email);
        // setUserId(data.user_id || null);
        toast.success("Login successful");
        navigate('/');
        return true;
      } else {
        throw new Error(data.message || '2FA verification failed');
      }
    } catch (error) {
      toast.error(error.message || '2FA verification failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const setup2FA = async (twoFASetupToken) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/company/user/auth/2fa/setup/${twoFASetupToken}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      console.log("2FA Setup Response:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to setup 2FA');
      }

      return data;
    } catch (error) {
      toast.error(error.message || 'Failed to setup 2FA');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const complete2FASetup = async (verificationCode) => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('twoFASetupToken');
      
      if (!userId || !token) {
        throw new Error('Missing required tokens for 2FA setup');
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/company/user/auth/2fa/verify/${userId}/${verificationCode}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      const data = await response.json();
      // debugger
      if (response.ok) {
        // debugger
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('currentUser', JSON.stringify(data));
        localStorage.removeItem('twoFASetupToken');
        localStorage.removeItem('userId');
        setToken(data.access_token);
        setIsAuthenticated(true);
        setCurrentUser(data);
        setTwoFASetupToken(null);
        toast.success("2FA setup completed successfully!");
        return true;
      } else {
        throw new Error(data.message || '2FA setup failed');
      }
    } catch (error) {
      // debugger
      toast.error(error.message || 'Failed to complete 2FA setup');
      // debugger
      return false;
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/company/user/auth/request-reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Password reset link sent to your email');
        return true;
      } else {
        throw new Error(data.message || 'Failed to request password reset');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to request password reset');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/company/user/auth/reset-password/${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ new_password: newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Password reset successfully');
        navigate('/login');
        return true;
      } else {
        throw new Error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('twoFASetupToken');
    localStorage.removeItem('twoFALoginToken');
    localStorage.removeItem('userId');
    setToken(null);
    setIsAuthenticated(false);
    setUserEmail('');
    setCurrentUser(null);
    setTwoFASetupToken(null);
    setTwoFALoginToken(null);
    setUserId(null);
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
      currentUser,
      twoFASetupToken,
      twoFALoginToken,
      userId,
      login,
      logout,
      setup2FA,
      verify2FALogin,
      complete2FASetup,
      requestPasswordReset,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};