// src/pages/Setup2FA.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLock, FiCopy, FiCheck, FiArrowLeft } from 'react-icons/fi';
import QRCode from 'react-qr-code';
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
        setQrCodeData(data.qr_code_url || '');
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Loading 2FA Setup...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Setup Two-Factor Authentication</h2>
          <p className="mt-2 text-sm text-gray-600">
            Secure your account with an extra layer of protection
          </p>
          {userEmail && (
            <p className="mt-1 text-sm text-gray-500">
              For account: <span className="font-medium">{userEmail}</span>
            </p>
          )}
        </div>

        <div className="mt-8 space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Step 1: Scan QR Code</h3>
            <p className="mt-1 text-sm text-gray-500">
              Open your authenticator app (Google Authenticator, Authy, etc.) and scan this QR code
            </p>

            {qrCodeData ? (
              <div className="mt-4 flex justify-center">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <QRCode 
                    value={qrCodeData}
                    size={200}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
              </div>
            ) : (
              <p className="text-red-500 mt-4">QR code not available</p>
            )}

            {setupData?.secret_key && (
              <>
                <p className="mt-4 text-sm text-gray-500">
                  Can't scan the code? Enter this secret manually:
                </p>
                <div className="mt-2 px-4 py-2 bg-gray-100 rounded-md font-mono text-sm break-all">
                  {setupData.secret_key}
                </div>
              </>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900">Step 2: Enter Verification Code</h3>
            <p className="mt-1 text-sm text-gray-500">
              Enter the 6-digit code from your authenticator app
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="code" className="sr-only">Verification Code</label>
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
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center font-mono text-xl tracking-widest"
                  placeholder="123456"
                  disabled={contextLoading}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={contextLoading}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${contextLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {contextLoading ? 'Verifying...' : 'Verify & Complete Setup'}
                </button>
              </div>
            </form>
          </div>

          {backupCodes.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">Backup Codes</h3>
              <p className="mt-1 text-sm text-gray-500">
                Save these codes in a secure place. Each code can be used once if you lose access to your authenticator app.
              </p>

              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="font-mono text-sm text-center py-1 bg-white rounded">
                      {code}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleCopyCodes}
                  className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center"
            >
              <FiArrowLeft className="mr-1" />
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup2FA;