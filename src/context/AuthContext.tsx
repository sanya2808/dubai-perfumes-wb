import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  loginWithPhone: (phoneNumber: string) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (phoneNumber: string, otp: string, name?: string) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  isAuthenticated: boolean;
  // Login modal state
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo OTP for fallback (when Firebase phone auth is not fully configured)
const DEMO_OTP = '123456';

// localStorage keys
const LS_USER_KEY = 'dubai_user';

const loadUserFromStorage = (): User | null => {
  try {
    const raw = localStorage.getItem(LS_USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

const saveUserToStorage = (user: User) => {
  localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
  localStorage.setItem('userLoggedIn', 'true');
};

const clearUserFromStorage = () => {
  localStorage.removeItem(LS_USER_KEY);
  localStorage.removeItem('userLoggedIn');
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(loadUserFromStorage);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Sync user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      saveUserToStorage(user);
    }
  }, [user]);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  // Legacy email/password login (kept for admin access)
  const login = (email: string, _password: string) => {
    if (email === 'admin@dubai.com') {
      const adminUser: User = { id: '1', name: 'Admin', phone: '9171234567', email, isAdmin: true };
      setUser(adminUser);
      saveUserToStorage(adminUser);
    } else {
      const regularUser: User = { id: '2', name: email.split('@')[0], phone: '9179999999', email, isAdmin: false };
      setUser(regularUser);
      saveUserToStorage(regularUser);
    }
    return true;
  };

  const signup = (name: string, email: string, _password: string) => {
    const newUser: User = { id: Date.now().toString(), name, phone: '9179999999', email, isAdmin: false };
    setUser(newUser);
    saveUserToStorage(newUser);
    return true;
  };

  // Phone-based OTP login – tries Firebase first, falls back to demo OTP
  const loginWithPhone = async (phoneNumber: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Try Firebase phone auth
      const { auth } = await import('@/firebase');
      const { RecaptchaVerifier, signInWithPhoneNumber } = await import('firebase/auth');

      // Create invisible reCAPTCHA (attached to a hidden div that LoginModal provides)
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) throw new Error('reCAPTCHA container not found');

      // Clear any existing verifier
      if ((window as any).__recaptchaVerifier) {
        (window as any).__recaptchaVerifier.clear();
      }

      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      (window as any).__recaptchaVerifier = verifier;

      // Format: add +91 country code if not present
      const formatted = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const confirmationResult = await signInWithPhoneNumber(auth, formatted, verifier);
      (window as any).__confirmationResult = confirmationResult;

      return { success: true, message: 'OTP sent successfully to your phone number.' };
    } catch (firebaseError) {
      // Firebase not configured or quota exceeded → fall back to demo mode
      console.warn('Firebase phone auth unavailable, using demo OTP:', firebaseError);
      console.log(`Demo OTP for ${phoneNumber}: ${DEMO_OTP}`);
      return { success: true, message: `OTP sent! (Demo mode: use ${DEMO_OTP})` };
    }
  };

  const verifyOTP = async (
    phoneNumber: string,
    otp: string,
    name?: string
  ): Promise<{ success: boolean; message: string; user?: User }> => {
    try {
      // Try Firebase confirmation first
      const confirmationResult = (window as any).__confirmationResult;
      if (confirmationResult) {
        const result = await confirmationResult.confirm(otp);
        const firebaseUser = result.user;
        const newUser: User = {
          id: firebaseUser.uid,
          name: name || firebaseUser.displayName || 'User',
          phone: phoneNumber,
          isAdmin: false,
        };
        setUser(newUser);
        saveUserToStorage(newUser);
        closeLoginModal();
        return { success: true, message: 'Login successful!', user: newUser };
      }
    } catch {
      // Firebase verify failed – fall through to demo OTP check
    }

    // Demo OTP fallback
    if (otp === DEMO_OTP) {
      const newUser: User = {
        id: Date.now().toString(),
        name: name || 'User',
        phone: phoneNumber,
        isAdmin: false,
      };
      setUser(newUser);
      saveUserToStorage(newUser);
      closeLoginModal();
      return { success: true, message: 'Login successful!', user: newUser };
    }

    return { success: false, message: 'Invalid OTP. Please try again.' };
  };

  const logout = () => {
    setUser(null);
    clearUserFromStorage();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        loginWithPhone,
        verifyOTP,
        logout,
        isAuthenticated: !!user,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
