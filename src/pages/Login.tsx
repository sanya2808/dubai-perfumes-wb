import { useState, useEffect } from 'react';
import SEO from '@/components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { useAdminAuthSecurity } from '@/context/AdminAuthSecurityContext';
import OTPVerificationModal from '@/components/OTPVerificationModal';
import { getBrowserInfo, getIPAddress, getLocation } from '@/utils/adminAuthUtils';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState<'otp' | 'email'>('otp');
  const [otpStep, setOtpStep] = useState<'phone' | 'verify'>('phone');
  
  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI states
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  useEffect(() => {
    setBrowserInfo(getBrowserInfo());
    const ip = getIPAddress();
    setIpAddress(ip);
    setLocation(getLocation(ip));
  }, []);

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
    const result = await loginWithPhone(phone, 'recaptcha-container');
    setLoading(false);

    if (result.success) {
      setSuccess(result.message);
      setOtpStep('verify');
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

    setLoading(true);
    const result = await verifyOTP(otp, name);
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Admin authentication with security features
    if (email === 'admin@dubai.com') {
      if (isAccountLocked(email)) {
        setError("Account locked due to multiple failed login attempts. Try again later.");
        setLoading(false);
        return;
      }

      if (password === 'admin123') {
        const isSuspicious = detectSuspiciousLogin(email, ipAddress, browserInfo, location);
        
        if (isSuspicious) {
          generateOTP(email);
          setSelectedEmail(email);
          setShowOTPModal(true);
          setSuccess('OTP sent to your email. Please verify to continue.');
          setLoading(false);
        } else {
          recordSuccessfulLogin(email, ipAddress, browserInfo, location);
          const result = await login(email, password);
          if (result.success) {
            setSuccess('Admin login successful! Redirecting...');
            setTimeout(() => navigate('/admin'), 1500);
          } else {
            setError(result.message);
            setLoading(false);
          }
        }
      } else {
        recordFailedAttempt(email, ipAddress, browserInfo, location);
        setError('Invalid email or password');
        setLoading(false);
      }
    } else {
      // Regular user logic
      const result = isSignup 
        ? await signup(name, email, password)
        : await login(email, password);
      
      setLoading(false);
      if (result.success) {
        setSuccess(isSignup ? 'Account created! Redirecting...' : 'Login successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setError(result.message);
      }
    }
  };

  const handleOTPVerifySuccess = async () => {
    recordSuccessfulLogin(selectedEmail, ipAddress, browserInfo, location);
    await login(selectedEmail, password);
    setShowOTPModal(false);
    setSuccess('Admin login successful! Redirecting...');
    setTimeout(() => navigate('/admin'), 1500);
  };

  return (
    <div className="luxury-container py-20">
      <SEO 
        title={loginMethod === 'otp' ? 'Phone Login' : (isSignup ? 'Create Account' : 'Sign In')} 
        description="Access your Dubai Perfumes account." 
        path="/login" 
      />
      
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
              ? (otpStep === 'phone' ? 'Phone Login' : 'Verify OTP')
              : (isSignup ? 'Create Account' : 'Sign In')}
          </h1>
          <div className="gold-divider mt-4" />
        </div>

        {/* Method Selector */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => {
              setLoginMethod('otp');
              setOtpStep('phone');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 px-4 rounded text-sm font-semibold uppercase tracking-wider transition-all ${
              loginMethod === 'otp' ? 'bg-primary text-primary-foreground shadow-gold-glow' : 'bg-card border border-border text-foreground hover:border-primary'
            }`}
          >
            OTP Login
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod('email');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 px-4 rounded text-sm font-semibold uppercase tracking-wider transition-all ${
              loginMethod === 'email' ? 'bg-primary text-primary-foreground shadow-gold-glow' : 'bg-card border border-border text-foreground hover:border-primary'
            }`}
          >
            Email Login
          </button>
        </div>

        {/* Global Alert messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4">
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
                <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-500">{success}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {loginMethod === 'otp' ? (
            <motion.div key="otp-method" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <form onSubmit={otpStep === 'phone' ? handleSendOTP : handleVerifyOTP} className="bg-card rounded-lg p-8 shadow-luxury-card space-y-5">
                {otpStep === 'phone' ? (
                  <>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Ahmed Hassan"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="e.g. 9876543210"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1">We will send a 6-digit OTP code to this number.</p>
                      <div id="recaptcha-container" className="mt-2"></div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block text-center">Verification Code</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="0 0 0 0 0 0"
                      className="w-full px-4 py-4 bg-background border border-border rounded-lg text-2xl text-center tracking-[0.5em] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-center">Please enter the code sent to {phone}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-premium w-full py-4 bg-primary text-primary-foreground flex items-center justify-center gap-2 rounded font-bold uppercase tracking-widest text-sm"
                >
                  {loading && <Loader className="animate-spin" size={16} />}
                  {otpStep === 'phone' ? 'Send OTP' : 'Verify & Login'}
                </button>

                {otpStep === 'verify' && (
                  <button type="button" onClick={() => setOtpStep('phone')} className="w-full text-center text-xs text-primary hover:underline">
                    Use a different number
                  </button>
                )}
              </form>
            </motion.div>
          ) : (
            <motion.div key="email-method" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <form onSubmit={handleEmailSubmit} className="bg-card rounded-lg p-8 shadow-luxury-card space-y-5">
                {isSignup && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
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
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {!isSignup && (
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
                    />
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Keep me signed in</span>
                  </label>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-premium w-full py-4 bg-primary text-primary-foreground flex items-center justify-center gap-2 rounded font-bold uppercase tracking-widest text-sm"
                >
                  {loading && <Loader className="animate-spin" size={16} />}
                  {isSignup ? 'Create Account' : 'Sign In'}
                </button>

                <div className="text-center pt-2">
                  <p className="text-xs text-muted-foreground">
                    {isSignup ? 'Already have an account?' : 'New to Dubai Perfumes?'}
                    <button
                      type="button"
                      onClick={() => setIsSignup(!isSignup)}
                      className="ml-2 text-primary font-bold hover:underline"
                    >
                      {isSignup ? 'Sign In Instead' : 'Create One'}
                    </button>
                  </p>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Login;
