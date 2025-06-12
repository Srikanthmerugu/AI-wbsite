import React, { useState } from 'react';
import { FiLock, FiUnlock } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../config/config';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';

const TwoFactorToggle = ({ userId, isTwoFactorEnabled, onToggle }) => {
    const { token } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle2FA = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(
                `${API_BASE_URL}/api/v1/company/user/auth/enable-disable/2fa/${userId}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to toggle 2FA');
            }

            onToggle(userId, !isTwoFactorEnabled);
            toast.success(
                `2FA has been ${isTwoFactorEnabled ? 'disabled' : 'enabled'} for user`,
                {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );
        } catch (error) {
            console.error('2FA toggle error:', error);
            toast.error(error.message || 'Failed to toggle 2FA');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                className={`text-gray-600 hover:text-gray-900 mr-3 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleToggle2FA}
                disabled={isLoading}
                data-tooltip-id={`twofa-tooltip-${userId}`}
                data-tooltip-content={isTwoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            >
                {isTwoFactorEnabled ? (
                    <FiUnlock className="inline text-gray-400" size={20} />

                ) : (
                    <FiLock className="inline text-blue-500" size={20} />

                )}
            </button>
            <Tooltip id={`twofa-tooltip-${userId}`} />
        </>
    );
};

export default TwoFactorToggle;