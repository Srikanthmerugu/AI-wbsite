// src/pages/Verify2FA.js
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLock, FiArrowLeft } from 'react-icons/fi';

const Verify2FA = () => {
  const { twoFALoginToken, userEmail, verify2FALogin, loading } = useContext(AuthContext);
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a 2FA token, if not redirect to login
    if (!twoFALoginToken) {
      navigate('/login');
    }
  }, [twoFALoginToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    try {
      await verify2FALogin(code);
    } catch (error) {
      toast.error(error.message || '2FA verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Two-Factor Authentication</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit code from your authenticator app
          </p>
          <p className="mt-1 text-sm text-gray-500">
            For account: <span className="font-medium">{userEmail}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="code" className="sr-only">2FA Code</label>
              <input
                id="code"
                name="code"
                type="text"
                autoComplete="off"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="6"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center font-mono text-xl tracking-widest"
                placeholder="••••••"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                'Verifying...'
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <FiLock className="h-5 w-5 text-blue-300" />
                  </span>
                  Verify Code
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center"
          >
            <FiArrowLeft className="mr-1" />
            Back to login
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Having trouble? Contact support for assistance.</p>
        </div>
      </div>
    </div>
  );
};

export default Verify2FA;