import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { useAdminAuthSecurity } from '@/context/AdminAuthSecurityContext';
import { getTimeRemaining, isOTPExpired } from '@/utils/adminAuthUtils';

interface OTPVerificationModalProps {
  email: string;
  onVerifySuccess: () => void;
  onClose: () => void;
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  email,
  onVerifySuccess,
  onClose,
}) => {
  const { state, verifyOTP } = useAdminAuthSecurity();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!state.otpExpiresAt) return;

    const interval = setInterval(() => {
      const remaining = getTimeRemaining(state.otpExpiresAt!);
      setTimeRemaining(remaining);

      if (remaining === 'Expired') {
        clearInterval(interval);
        setError('OTP has expired. Please request a new one.');
      }
    }, 1000);

    setTimeRemaining(getTimeRemaining(state.otpExpiresAt));

    return () => clearInterval(interval);
  }, [state.otpExpiresAt]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    if (isOTPExpired(state.otpExpiresAt)) {
      setError('OTP has expired');
      return;
    }

    setIsVerifying(true);
    setError('');

    // Simulate verification delay
    setTimeout(() => {
      if (verifyOTP(email, otp)) {
        setVerified(true);
        setTimeout(() => {
          onVerifySuccess();
        }, 1500);
      } else {
        setError('Invalid OTP. Please try again.');
        setOtp('');
      }
      setIsVerifying(false);
    }, 800);
  };

  const handleOtpChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(numericValue);
    setError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl max-w-md w-full border border-amber-500/20"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Suspicious Login Detected</h2>
              <p className="text-sm text-gray-400">Verify your identity to continue</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {verified ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center justify-center space-y-3"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="w-16 h-16 text-green-500" />
              </motion.div>
              <p className="text-white font-semibold">Verification Successful!</p>
              <p className="text-gray-400 text-sm">You can now access your admin panel</p>
            </motion.div>
          ) : (
            <>
              {/* Description */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <p className="text-sm text-gray-300">
                  We detected an unusual login attempt from a new device or location. 
                  Please check your email for a 6-digit OTP to verify your identity.
                </p>
              </div>

              {/* OTP Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-200">
                  Enter OTP Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => handleOtpChange(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  disabled={verified || isOTPExpired(state.otpExpiresAt)}
                  className={`w-full px-4 py-3 bg-slate-700 border-2 rounded-lg text-center text-2xl font-bold tracking-widest transition-all ${
                    error
                      ? 'border-red-500 text-red-400'
                      : otp.length === 6
                        ? 'border-green-500 text-white'
                        : 'border-gray-600 text-white focus:border-amber-500'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  autoFocus
                />
              </div>

              {/* Timer */}
              {state.otpExpiresAt && (
                <div className={`flex items-center justify-center gap-2 text-sm font-medium ${
                  isOTPExpired(state.otpExpiresAt) ? 'text-red-400' : 'text-amber-400'
                }`}>
                  <Clock className="w-4 h-4" />
                  OTP expires in: {timeRemaining}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </motion.div>
              )}

              {/* Demo OTP Note */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-xs text-blue-300">
                  Demo OTP: <span className="font-mono font-bold">123456</span>
                  <br />
                  (Check browser console for actual OTP)
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-4 border-t border-amber-500/20 flex gap-3">
          <button
            onClick={onClose}
            disabled={isVerifying || verified}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-600 text-gray-200 font-medium hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            disabled={otp.length !== 6 || isVerifying || verified || isOTPExpired(state.otpExpiresAt)}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-slate-900 transition-all ${
              otp.length === 6 && !isVerifying && !isOTPExpired(state.otpExpiresAt)
                ? 'bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700'
                : 'bg-gray-600 opacity-50 cursor-not-allowed'
            }`}
          >
            {isVerifying ? (
              <span className="inline-flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full"
                />
                Verifying...
              </span>
            ) : verified ? (
              'Verified'
            ) : (
              'Verify OTP'
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OTPVerificationModal;
