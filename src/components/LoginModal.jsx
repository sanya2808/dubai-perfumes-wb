import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, KeyRound, User, Loader, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const LoginModal = () => {
  const { isLoginModalOpen, closeLoginModal, loginWithPhone, verifyOTP } = useAuth();

  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setStep('phone');
    setName('');
    setPhone('');
    setOtp('');
    setError('');
    setSuccess('');
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    closeLoginModal();
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!phone.trim()) { setError('Please enter your phone number.'); return; }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) { setError('Please enter a valid 10-digit phone number.'); return; }

    setLoading(true);
    const result = await loginWithPhone(digits);
    setLoading(false);

    if (result.success) {
      setSuccess('OTP sent! Check your SMS.');
      setStep('otp');
    } else {
      setError(result.message);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }

    setLoading(true);
    const result = await verifyOTP(phone.replace(/\D/g, ''), otp, name);
    setLoading(false);

    if (result.success) {
      // Store login status
      localStorage.setItem('userLoggedIn', 'true');
      setSuccess('Login successful!');
      // Modal auto-closes via AuthContext; clean up form after brief delay
      setTimeout(() => resetForm(), 500);
    } else {
      setError(result.message);
    }
  };

  // ─── Shared input style ───────────────────────────────────────────────────
  const inputBase = {
    width: '100%',
    padding: '11px 12px 11px 38px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(198,169,107,0.2)',
    borderRadius: 8,
    color: '#f5f5f5',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const inputFocusStyle = `
    .lm-input:focus {
      border-color: rgba(198,169,107,0.65) !important;
      box-shadow: 0 0 0 3px rgba(198,169,107,0.12);
    }
    .lm-input::placeholder { color: rgba(255,255,255,0.28); }
  `;

  // ─── Gold button style ───────────────────────────────────────────────────
  const goldBtn = {
    width: '100%',
    padding: '12px 0',
    background: loading
      ? 'rgba(198,169,107,0.5)'
      : 'linear-gradient(135deg, #C6A96B 0%, #E8D5A3 50%, #B8954A 100%)',
    border: 'none',
    borderRadius: 8,
    color: '#0a0806',
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    cursor: loading ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'opacity 0.2s, transform 0.15s',
  };

  return (
    <>
      {/* Scoped focus/placeholder styles */}
      <style>{inputFocusStyle}</style>

      <AnimatePresence>
        {isLoginModalOpen && (
          /* ── Overlay ─────────────────────────────────────── */
          <motion.div
            key="lm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              /* Issue 1 fix: lighter overlay, website still visible */
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          >
            {/* Hidden reCAPTCHA anchor for Firebase phone auth */}
            <div id="recaptcha-container" style={{ position: 'absolute', bottom: 0, left: 0 }} />

            {/* ── Modal Card ──────────────────────────────────── */}
            <motion.div
              key="lm-card"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                width: '90%',          /* Issue 7: 90% on mobile */
                maxWidth: 380,         /* Issue 2: max-width 380px */
                borderRadius: 14,      /* Issue 2: 14px corners */
                overflow: 'hidden',
                background: '#111009',
                border: '1px solid rgba(198,169,107,0.18)',
                /* Issue 2: softer shadow */
                boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(198,169,107,0.06)',
              }}
            >
              {/* Gold shimmer top bar */}
              <div style={{
                height: 2,
                background: 'linear-gradient(90deg, transparent, #C6A96B 30%, #E8D5A3 50%, #C6A96B 70%, transparent)',
              }} />

              {/* ── Header ──────────────────────────────────── */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px 16px',
                borderBottom: '1px solid rgba(198,169,107,0.1)',
              }}>
                <div>
                  <p style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: '#C6A96B',
                    marginBottom: 4,
                  }}>
                    Welcome
                  </p>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f5f5f5', margin: 0 }}>
                    {step === 'phone' ? 'Sign In / Register' : 'Verify Your Phone'}
                  </h2>
                </div>

                {/* Issue 6: bigger, clearer close button */}
                <button
                  onClick={handleClose}
                  aria-label="Close login modal"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: '1px solid rgba(198,169,107,0.25)',
                    background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(198,169,107,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.2s, color 0.2s, border-color 0.2s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(198,169,107,0.15)';
                    e.currentTarget.style.color = '#C6A96B';
                    e.currentTarget.style.borderColor = 'rgba(198,169,107,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = 'rgba(198,169,107,0.8)';
                    e.currentTarget.style.borderColor = 'rgba(198,169,107,0.25)';
                  }}
                >
                  <X size={17} />
                </button>
              </div>

              {/* ── Body — Issue 2: clean 24px padding ───── */}
              <div style={{ padding: 24 }}>

                {/* Alerts */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        padding: '10px 12px',
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.25)',
                        borderRadius: 8,
                        marginBottom: 16,
                      }}
                    >
                      <AlertCircle size={15} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
                      <p style={{ fontSize: 12, color: '#f87171', margin: 0 }}>{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        padding: '10px 12px',
                        background: 'rgba(34,197,94,0.08)',
                        border: '1px solid rgba(34,197,94,0.25)',
                        borderRadius: 8,
                        marginBottom: 16,
                      }}
                    >
                      <CheckCircle size={15} style={{ color: '#4ade80', flexShrink: 0, marginTop: 1 }} />
                      <p style={{ fontSize: 12, color: '#4ade80', margin: 0 }}>{success}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Issue 4: Step forms with AnimatePresence ── */}
                <AnimatePresence mode="wait">

                  {/* Step 1: Name + Phone */}
                  {step === 'phone' && (
                    <motion.form
                      key="step-phone"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.18 }}
                      onSubmit={handleSendOTP}
                    >
                      {/* Name field */}
                      <div style={{ marginBottom: 14 }}>
                        <label style={{
                          display: 'block',
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          color: 'rgba(198,169,107,0.7)',
                          marginBottom: 6,
                        }}>
                          Full Name
                        </label>
                        <div style={{ position: 'relative' }}>
                          <User
                            size={14}
                            style={{
                              position: 'absolute', left: 12,
                              top: '50%', transform: 'translateY(-50%)',
                              color: 'rgba(198,169,107,0.5)',
                              pointerEvents: 'none',
                            }}
                          />
                          {/* Issue 3: premium input styling */}
                          <input
                            type="text"
                            className="lm-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Ahmed Hassan"
                            autoComplete="name"
                            style={inputBase}
                          />
                        </div>
                      </div>

                      {/* Phone field */}
                      <div style={{ marginBottom: 20 }}>
                        <label style={{
                          display: 'block',
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          color: 'rgba(198,169,107,0.7)',
                          marginBottom: 6,
                        }}>
                          Phone Number
                        </label>
                        <div style={{ position: 'relative' }}>
                          <Phone
                            size={14}
                            style={{
                              position: 'absolute', left: 12,
                              top: '50%', transform: 'translateY(-50%)',
                              color: 'rgba(198,169,107,0.5)',
                              pointerEvents: 'none',
                            }}
                          />
                          <input
                            type="tel"
                            className="lm-input"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="10-digit mobile number"
                            inputMode="numeric"
                            autoComplete="tel"
                            style={inputBase}
                          />
                        </div>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 5 }}>
                          OTP will be sent via SMS (India +91)
                        </p>
                      </div>

                      {/* Issue 5: gold gradient Send OTP button with loading state */}
                      <button
                        type="submit"
                        disabled={loading}
                        style={goldBtn}
                        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = '0.88'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                        onMouseDown={(e) => { if (!loading) e.currentTarget.style.transform = 'scale(0.98)'; }}
                        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        {loading
                          ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Sending OTP…</>
                          : <><Phone size={15} /> Send OTP</>
                        }
                      </button>
                    </motion.form>
                  )}

                  {/* Step 2: OTP — Issue 4: phone input hidden, OTP shown */}
                  {step === 'otp' && (
                    <motion.form
                      key="step-otp"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ duration: 0.18 }}
                      onSubmit={handleVerifyOTP}
                    >
                      {/* Phone confirmation chip */}
                      <div style={{
                        padding: '9px 14px',
                        background: 'rgba(198,169,107,0.07)',
                        border: '1px solid rgba(198,169,107,0.18)',
                        borderRadius: 8,
                        marginBottom: 18,
                        textAlign: 'center',
                      }}>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                          OTP sent to{' '}
                          <strong style={{ color: '#E8D5A3' }}>+91 {phone}</strong>
                        </p>
                      </div>

                      {/* OTP input */}
                      <div style={{ marginBottom: 20 }}>
                        <label style={{
                          display: 'block',
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          color: 'rgba(198,169,107,0.7)',
                          marginBottom: 6,
                        }}>
                          Enter OTP
                        </label>
                        <div style={{ position: 'relative' }}>
                          <KeyRound
                            size={14}
                            style={{
                              position: 'absolute', left: 12,
                              top: '50%', transform: 'translateY(-50%)',
                              color: 'rgba(198,169,107,0.5)',
                              pointerEvents: 'none',
                            }}
                          />
                          <input
                            type="text"
                            className="lm-input"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="• • • • • •"
                            inputMode="numeric"
                            maxLength={6}
                            autoFocus
                            style={{
                              ...inputBase,
                              textAlign: 'center',
                              fontFamily: 'monospace',
                              fontSize: 22,
                              fontWeight: 700,
                              letterSpacing: '0.5em',
                              paddingLeft: 12,
                            }}
                          />
                        </div>
                        <p style={{ fontSize: 11, color: 'rgba(198,169,107,0.55)', marginTop: 6, textAlign: 'center' }}>
                          Demo: use <strong style={{ color: '#C6A96B' }}>123456</strong>
                        </p>
                      </div>

                      {/* Verify OTP button */}
                      <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        style={{
                          ...goldBtn,
                          background: (loading || otp.length !== 6)
                            ? 'rgba(198,169,107,0.28)'
                            : 'linear-gradient(135deg, #C6A96B 0%, #E8D5A3 50%, #B8954A 100%)',
                          cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                        }}
                        onMouseEnter={(e) => { if (!loading && otp.length === 6) e.currentTarget.style.opacity = '0.88'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                        onMouseDown={(e) => { if (!loading && otp.length === 6) e.currentTarget.style.transform = 'scale(0.98)'; }}
                        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        {loading
                          ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Verifying…</>
                          : <><CheckCircle size={15} /> Verify OTP</>
                        }
                      </button>

                      {/* Back link */}
                      <button
                        type="button"
                        onClick={() => { setStep('phone'); setOtp(''); setError(''); setSuccess(''); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 5,
                          width: '100%',
                          marginTop: 14,
                          fontSize: 12,
                          color: '#C6A96B',
                          fontWeight: 600,
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          opacity: 0.75,
                          transition: 'opacity 0.15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.75'; }}
                      >
                        <ArrowLeft size={12} /> Change Phone Number
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div style={{
                padding: '0 24px 20px',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', margin: 0, letterSpacing: '0.03em' }}>
                  By continuing you agree to our Terms &amp; Privacy Policy
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyframe for loading spinner (no Tailwind animate-spin dependency) */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default LoginModal;
