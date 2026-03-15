import { useState, useEffect } from 'react';
import SEO from '@/components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { useAdminAuthSecurity } from '@/context/AdminAuthSecurityContext';
import OTPVerificationModal from '@/components/OTPVerificationModal';
import { getBrowserInfo, getIPAddress, getLocation, getMinutesUntilUnlock } from '@/utils/adminAuthUtils';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState<'otp' | 'email'>('otp');
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  
  // OTP login state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Email login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Admin security states
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [browserInfo, setBrowserInfo] = useState('');
  const [location, setLocation] = useState('');

  const { loginWithPhone, verifyOTP, login, signup } = useAuth();
  const { 
    isAccountLocked, 
    recordFailedAttempt, 
    recordSuccessfulLogin,
    detectSuspiciousLogin,
    generateOTP,
  } = useAdminAuthSecurity();
  const navigate = useNavigate();

  // Initialize device info on mount
  useEffect(() => {
    setBrowserInfo(getBrowserInfo());
    const ip = getIPAddress();
    setIpAddress(ip);
    setLocation(getLocation(ip));
  }, []);

  // Handle OTP login
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!phone.trim()) {
      setError('Please enter a phone number');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    const result = await loginWithPhone(phone);
    setLoading(false);

    if (result.success) {
      setSuccess(result.message);
      setStep('verify');
    } else {
      setError(result.message);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    const result = await verifyOTP(phone, otp, name);
    setLoading(false);

    if (result.success) {
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setError(result.message);
    }
  };

  // Handle Email login with admin security
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Admin authentication with security features
    if (email === 'admin@dubai.com') {
      // Check if account is locked
      if (isAccountLocked(email)) {
        setError("Account locked due to multiple failed login attempts. Try again later.");
        return;
      }

      // Check password
      if (password === 'admin123') {
        // Check for suspicious login
        const isSuspicious = detectSuspiciousLogin(email, ipAddress, browserInfo, location);
        
        if (isSuspicious) {
          // Generate OTP and show verification modal
          generateOTP(email);
          setSelectedEmail(email);
          setShowOTPModal(true);
          setSuccess('OTP sent to your email. Please verify to continue.');
        } else {
          // Direct login for trusted device
          recordSuccessfulLogin(email, ipAddress, browserInfo, location);
          login(email, password);
          setSuccess('Admin login successful! Redirecting...');
          setTimeout(() => {
            navigate('/admin');
          }, 1500);
        }
      } else {
        // Record failed attempt
        recordFailedAttempt(email, ipAddress, browserInfo, location);
        setError('Invalid email or password');
      }
    } else {
      // Regular user login
      if (isSignup) {
        signup(name, email, password);
        navigate('/dashboard');
      } else {
        login(email, password);
        navigate('/dashboard');
      }
    }
  };

  const handleOTPVerifySuccess = () => {
    recordSuccessfulLogin(selectedEmail, ipAddress, browserInfo, location);
    login(selectedEmail, password);
    setShowOTPModal(false);
    setSuccess('Admin login successful! Redirecting...');
    setTimeout(() => {
      navigate('/admin');
    }, 1500);
  };

  return (
    <div className="luxury-container py-20">
      <SEO title="Sign In" description="Log in to your Dubai Perfumes account to manage orders and track your favorites." path="/login" />
      <AnimatePresence>
        {showOTPModal && (
          <OTPVerificationModal
            email={selectedEmail}
            onVerifySuccess={handleOTPVerifySuccess}
            onClose={() => setShowOTPModal(false)}
          />
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <p className="text-accent-font text-sm tracking-[0.3em] uppercase text-primary mb-2">Welcome</p>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {loginMethod === 'otp' 
              ? (step === 'phone' ? 'Phone Login' : 'Verify OTP')
              : (isSignup ? 'Create Account' : 'Sign In')}
          </h1>
          <div className="gold-divider mt-4" />
        </div>

        {/* Login Method Selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setLoginMethod('otp');
              setStep('phone');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 px-4 rounded text-sm font-semibold uppercase tracking-wider transition-all ${
              loginMethod === 'otp'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-foreground hover:border-primary'
            }`}
          >
            OTP Login
          </button>
          <button
            onClick={() => {
              setLoginMethod('email');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 px-4 rounded text-sm font-semibold uppercase tracking-wider transition-all ${
              loginMethod === 'email'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-foreground hover:border-primary'
            }`}
          >
            Email Login
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
          >
            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-500">{error}</p>
          </motion.div>
        )}

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3"
          >
            <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-500">{success}</p>
          </motion.div>
        )}

        {/* OTP Login Form */}
        {loginMethod === 'otp' && (
          <form onSubmit={step === 'phone' ? handleSendOTP : handleVerifyOTP} className="bg-card rounded-lg p-8 shadow-luxury-card space-y-5">
            {step === 'phone' ? (
              <>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g., Ahmed Hassan"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="e.g., 9175551234"
                    inputMode="numeric"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Enter your 10-digit phone number</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    inputMode="numeric"
                    maxLength={6}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-center text-lg tracking-widest"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Check your SMS for the 6-digit code</p>
                  <p className="text-xs text-primary mt-2">Demo OTP: 123456</p>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full px-8 py-4 bg-primary text-primary-foreground font-semibold uppercase tracking-wider text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader size={18} className="animate-spin" />}
              {step === 'phone' ? 'Send OTP' : 'Verify OTP'}
            </button>

            {step === 'verify' && (
              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  setError('');
                  setSuccess('');
                }}
                className="w-full text-center text-sm text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Change Phone Number
              </button>
            )}
          </form>
        )}

        {/* Email Login Form */}
        {loginMethod === 'email' && (
          <form onSubmit={handleEmailSubmit} className="bg-card rounded-lg p-8 shadow-luxury-card space-y-5">
            {isSignup && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Full Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {!isSignup && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
                />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
            )}

            <button
              type="submit"
              className="btn-premium w-full px-8 py-4 bg-primary text-primary-foreground font-semibold uppercase tracking-wider text-sm rounded"
            >
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
            <p className="text-center text-sm text-muted-foreground">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                {isSignup ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
            {!isSignup && (
              <p className="text-center text-xs text-muted-foreground">
                Demo: Use <strong className="text-primary">admin@dubai.com</strong> (password: <strong className="text-primary">admin123</strong>) for admin access with enhanced security
              </p>
            )}
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
