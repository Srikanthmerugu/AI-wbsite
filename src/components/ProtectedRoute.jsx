// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {  useAuth } from '../context/AuthContext';
import Loader from './Loading/Loading';

const ProtectedRoute = ({ children }) => {
  // const { isAuthenticated, loading } = useContext(AuthContext);
    const { isAuthenticated,loading, userData, logout } = useAuth();


  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;