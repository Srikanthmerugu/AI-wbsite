// src/pages/Setup2FA.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLock, FiCopy, FiCheck, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { LoginBG, offRobo } from '../assets/Assets';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config/config';

const Setup2FA = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { userEmail, complete2FASetup, loading: contextLoading } = useContext(AuthContext);
  
  // State
  const [qrCodeData, setQrCodeData] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [setupData, setSetupData] = useState(null);

  // Fetch QR code and backup codes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/company/user/auth/2fa/setup/${token}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch 2FA setup data');
        }

        const data = await response.json();
        setSetupData(data);
        setQrCodeData(data.qr_code_base64 || '');
        setBackupCodes(data.backup_codes || []);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load 2FA setup data');
        toast.error(err.message || 'Failed to load 2FA setup data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  // Handle copy backup codes
  const handleCopyCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Backup codes copied to clipboard');
  };

  // Submit verification code
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit verification code');
      return;
    }

    try {
      const success = await complete2FASetup(verificationCode);
      if (success) {
        toast.success('2FA setup completed successfully!');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to complete 2FA setup');
    }
  };

  if (loading || contextLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted className="w-full h-full object-cover">
            <source src={LoginBG} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-sky-900 opacity-70"></div>
        </div>
        <div className="text-center z-10 text-white">
          <h2 className="text-xl font-semibold">Loading 2FA Setup...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted className="w-full h-full object-cover">
            <source src={LoginBG} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-sky-900 opacity-70"></div>
        </div>
        <div className="text-center z-10 bg-white bg-opacity-90 p-8 rounded-xl">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Video Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted className="w-full h-full object-cover">
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

      {/* 2FA Setup Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative right-15 z-10 w-full max-w-md bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sky-900 mb-2">Setup Two-Factor Authentication</h1>
          <p className="text-sky-600">Secure your account with an extra layer of protection</p>
          {userEmail && (
            <p className="mt-1 text-sm text-sky-500">
              For account: <span className="font-medium">{userEmail}</span>
            </p>
          )}
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-sky-700">Step 1: Scan QR Code</h3>
            <p className="mt-1 text-sm text-sky-500">
              Open your authenticator app (Google Authenticator, Authy, etc.) and scan this QR code
            </p>

            {qrCodeData ? (
              <div className="mt-4 flex justify-center">
                <div className="p-4 bg-white rounded-lg">
                  <img
                    src={`data:image/png;base64,${qrCodeData}`}
                    alt="2FA QR Code"
                    className="rounded-lg w-48 h-48 object-contain"
                  />
                </div>
              </div>
            ) : (
              <p className="text-red-500 mt-4">QR code not available</p>
            )}

            {setupData?.secret_key && (
              <>
                <p className="mt-4 text-sm text-sky-500">
                  Can't scan the code? Enter this secret manually:
                </p>
                <div className="mt-2 px-4 py-2 bg-sky-50 rounded-md font-mono text-sm break-all text-sky-800">
                  {setupData.secret_key}
                </div>
              </>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium text-sky-700">Step 2: Enter Verification Code</h3>
            <p className="mt-1 text-sm text-sky-500">
              Enter the 6-digit code from your authenticator app
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-sky-700 mb-1">
                  Verification Code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="6"
                  autoComplete="off"
                  required
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setVerificationCode(value.slice(0, 6));
                  }}
                  className="block w-full px-3 py-2.5 border border-sky-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-center font-mono text-xl tracking-widest"
                  placeholder="123456"
                  disabled={contextLoading}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={contextLoading}
                  className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200 ${contextLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {contextLoading ? 'Verifying...' : 'Verify & Complete Setup'}
                </button>
              </div>
            </form>
          </div>

          {backupCodes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-sky-700">Backup Codes</h3>
              <p className="mt-1 text-sm text-sky-500">
                Save these codes in a secure place. Each code can be used once if you lose access to your authenticator app.
              </p>

              <div className="mt-4 bg-sky-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="font-mono text-sm text-center py-2 bg-white rounded">
                      {code}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleCopyCodes}
                  className="mt-4 w-full flex items-center justify-center px-4 py-2.5 border border-sky-300 rounded-lg shadow-sm text-sm font-medium text-sky-700 bg-white hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                  {copied ? (
                    <>
                      <FiCheck className="mr-2 text-green-500" />
                      Copied! 
                    </>
                  ) : (
                    <>
                      <FiCopy className="mr-2" />
                      Copy All Codes
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-sky-600 hover:text-sky-500 flex items-center justify-center"
            >
              <FiArrowLeft className="mr-1" />
              Back to login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Setup2FA;