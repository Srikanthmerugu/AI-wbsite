// src/pages/ResetPasswordPage.js
import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { LoginBG, offRobo } from '../assets/Assets';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { resetPassword, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const success = await resetPassword(token, newPassword);
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Video Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          className="w-full h-full object-cover"
        >
          <source src={LoginBG} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-sky-900 opacity-70"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative left-0 z-15 h-[500px] w-full max-w-md bg-opacity-90 rounded-xl"
      >
        <img src={offRobo} alt="Robot" className="h-full w-full object-contain" />
      </motion.div>

      {/* Reset Password Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative right-15 z-10 w-full max-w-md bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sky-900 mb-2">Reset Your Password</h1>
          <p className="text-sky-600">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-sky-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-sky-400" />
              </div>
              <input
                id="new-password"
                name="new-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2.5 border border-sky-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sky-800 placeholder-sky-400"
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5 text-sky-400 hover:text-sky-600" />
                ) : (
                  <FiEye className="h-5 w-5 text-sky-400 hover:text-sky-600" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-sky-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-sky-400" />
              </div>
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2.5 border border-sky-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sky-800 placeholder-sky-400"
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <FiEyeOff className="h-5 w-5 text-sky-400 hover:text-sky-600" />
                ) : (
                  <FiEye className="h-5 w-5 text-sky-400 hover:text-sky-600" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-sky-600 hover:text-sky-500 flex items-center justify-center"
            >
              <FiArrowLeft className="mr-1" />
              Back to login
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;