import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface LoginAttempt {
  id: string;
  adminEmail: string;
  timestamp: Date;
  success: boolean;
  ipAddress: string;
  device: string;
  location: string;
}

export interface AdminSecurityState {
  failedAttempts: Map<string, number>; // email -> count
  lockedAccounts: Map<string, Date>; // email -> unlock time
  loginHistory: LoginAttempt[];
  currentOTP: string | null;
  otpExpiresAt: Date | null;
  suspiciousLoginDetected: boolean;
  lastLoginInfo: {
    ipAddress: string;
    device: string;
    location: string;
    timestamp: Date;
  } | null;
}

interface AdminAuthSecurityContextType {
  state: AdminSecurityState;
  checkFailedAttempts: (email: string) => boolean;
  recordFailedAttempt: (email: string, ipAddress: string, device: string, location: string) => void;
  recordSuccessfulLogin: (email: string, ipAddress: string, device: string, location: string) => void;
  isAccountLocked: (email: string) => boolean;
  generateOTP: (email: string) => string;
  verifyOTP: (email: string, otp: string) => boolean;
  resetFailedAttempts: (email: string) => void;
  detectSuspiciousLogin: (email: string, newIp: string, newDevice: string, newLocation: string) => boolean;
}

const AdminAuthSecurityContext = createContext<AdminAuthSecurityContextType | undefined>(undefined);

const STORAGE_KEY = 'adminAuthSecurityState';

const getInitialState = (): AdminSecurityState => ({
  failedAttempts: new Map(),
  lockedAccounts: new Map(),
  loginHistory: [],
  currentOTP: null,
  otpExpiresAt: null,
  suspiciousLoginDetected: false,
  lastLoginInfo: null,
});

const loadState = (): AdminSecurityState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return getInitialState();
    
    const parsed = JSON.parse(saved);
    return {
      failedAttempts: new Map(Object.entries(parsed.failedAttempts || {}).map(([k, v]) => [k, Number(v)])),
      lockedAccounts: new Map(Object.entries(parsed.lockedAccounts || {}).map(([k, v]) => [k, new Date(v as string)])),
      loginHistory: (parsed.loginHistory || []).map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp)
      })),
      currentOTP: parsed.currentOTP || null,
      otpExpiresAt: parsed.otpExpiresAt ? new Date(parsed.otpExpiresAt) : null,
      suspiciousLoginDetected: parsed.suspiciousLoginDetected || false,
      lastLoginInfo: parsed.lastLoginInfo ? {
        ...parsed.lastLoginInfo,
        timestamp: new Date(parsed.lastLoginInfo.timestamp)
      } : null,
    };
  } catch (error) {
    return getInitialState();
  }
};

export const AdminAuthSecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AdminSecurityState>(loadState());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      failedAttempts: Object.fromEntries(state.failedAttempts),
      lockedAccounts: Object.fromEntries(Array.from(state.lockedAccounts.entries()).map(([k, v]) => [k, v.toISOString()])),
      loginHistory: state.loginHistory,
      currentOTP: state.currentOTP,
      otpExpiresAt: state.otpExpiresAt ? state.otpExpiresAt.toISOString() : null,
      suspiciousLoginDetected: state.suspiciousLoginDetected,
      lastLoginInfo: state.lastLoginInfo,
    }));
  }, [state]);

  // Check if account is locked
  const isAccountLocked = useCallback((email: string) => {
    const unlockTime = state.lockedAccounts.get(email);
    if (!unlockTime) return false;

    if (new Date() > unlockTime) {
      // Lock has expired
      setState(prev => {
        const newLocked = new Map(prev.lockedAccounts);
        newLocked.delete(email);
        return { ...prev, lockedAccounts: newLocked };
      });
      return false;
    }

    return true;
  }, [state.lockedAccounts]);

  // Check failed attempts
  const checkFailedAttempts = useCallback((email: string) => {
    return isAccountLocked(email);
  }, [isAccountLocked]);

  // Record failed login attempt
  const recordFailedAttempt = useCallback((email: string, ipAddress: string, device: string, location: string) => {
    setState(prev => {
      const newFailedAttempts = new Map(prev.failedAttempts);
      const currentCount = (newFailedAttempts.get(email) || 0) + 1;
      newFailedAttempts.set(email, currentCount);

      let newLockedAccounts = new Map(prev.lockedAccounts);
      
      // Lock account if 5 failed attempts
      if (currentCount >= 5) {
        const unlockTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        newLockedAccounts.set(email, unlockTime);
      }

      // Add to login history
      const newLoginHistory = [
        ...prev.loginHistory,
        {
          id: `login_${Date.now()}`,
          adminEmail: email,
          timestamp: new Date(),
          success: false,
          ipAddress,
          device,
          location,
        },
      ];

      return {
        ...prev,
        failedAttempts: newFailedAttempts,
        lockedAccounts: newLockedAccounts,
        loginHistory: newLoginHistory,
      };
    });
  }, []);

  // Record successful login
  const recordSuccessfulLogin = useCallback((email: string, ipAddress: string, device: string, location: string) => {
    setState(prev => {
      const newFailedAttempts = new Map(prev.failedAttempts);
      newFailedAttempts.delete(email); // Reset failed attempts on success

      const newLoginHistory = [
        ...prev.loginHistory,
        {
          id: `login_${Date.now()}`,
          adminEmail: email,
          timestamp: new Date(),
          success: true,
          ipAddress,
          device,
          location,
        },
      ];

      return {
        ...prev,
        failedAttempts: newFailedAttempts,
        loginHistory: newLoginHistory,
        lastLoginInfo: {
          ipAddress,
          device,
          location,
          timestamp: new Date(),
        },
      };
    });
  }, []);

  // Detect suspicious login
  const detectSuspiciousLogin = useCallback((email: string, newIp: string, newDevice: string, newLocation: string) => {
    if (!state.lastLoginInfo) {
      // First login ever, not suspicious
      return false;
    }

    const isDifferentIP = state.lastLoginInfo.ipAddress !== newIp;
    const isDifferentDevice = state.lastLoginInfo.device !== newDevice;
    const isDifferentLocation = state.lastLoginInfo.location !== newLocation;

    // Suspicious if any combination of new IP, device, or location
    return isDifferentIP || isDifferentDevice || isDifferentLocation;
  }, [state.lastLoginInfo]);

  // Generate OTP
  const generateOTP = useCallback((email: string) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    setState(prev => ({
      ...prev,
      currentOTP: otp,
      otpExpiresAt: expiresAt,
      suspiciousLoginDetected: true,
    }));

    // In production, send OTP via email
    console.log(`OTP for ${email}: ${otp}`);

    return otp;
  }, []);

  // Verify OTP
  const verifyOTP = useCallback((email: string, otp: string) => {
    if (!state.currentOTP || !state.otpExpiresAt) {
      return false;
    }

    if (new Date() > state.otpExpiresAt) {
      // OTP expired
      setState(prev => ({
        ...prev,
        currentOTP: null,
        otpExpiresAt: null,
      }));
      return false;
    }

    if (state.currentOTP === otp) {
      setState(prev => ({
        ...prev,
        currentOTP: null,
        otpExpiresAt: null,
        suspiciousLoginDetected: false,
      }));
      return true;
    }

    return false;
  }, [state.currentOTP, state.otpExpiresAt]);

  // Reset failed attempts
  const resetFailedAttempts = useCallback((email: string) => {
    setState(prev => {
      const newFailedAttempts = new Map(prev.failedAttempts);
      newFailedAttempts.delete(email);
      return { ...prev, failedAttempts: newFailedAttempts };
    });
  }, []);

  const value: AdminAuthSecurityContextType = {
    state,
    checkFailedAttempts,
    recordFailedAttempt,
    recordSuccessfulLogin,
    isAccountLocked,
    generateOTP,
    verifyOTP,
    resetFailedAttempts,
    detectSuspiciousLogin,
  };

  return (
    <AdminAuthSecurityContext.Provider value={value}>
      {children}
    </AdminAuthSecurityContext.Provider>
  );
};

export const useAdminAuthSecurity = () => {
  const context = useContext(AdminAuthSecurityContext);
  if (!context) {
    throw new Error('useAdminAuthSecurity must be used within AdminAuthSecurityProvider');
  }
  return context;
};
