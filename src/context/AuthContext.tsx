import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock OTP for demo - in production, this will be Firebase/Supabase
const DEMO_OTP = '123456';
const DEMO_USERS: Record<string, User> = {
  '9175551001': { id: '1', name: 'Demo User', phone: '9175551001', email: 'demo@example.com', isAdmin: false },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Legacy email/password login (kept for backward compatibility)
  const login = (email: string, _password: string) => {
    if (email === 'admin@dubai.com') {
      setUser({ id: '1', name: 'Admin', phone: '9171234567', email, isAdmin: true });
    } else {
      setUser({ id: '2', name: email.split('@')[0], phone: '9179999999', email, isAdmin: false });
    }
    return true;
  };

  const signup = (name: string, email: string, _password: string) => {
    setUser({ id: Date.now().toString(), name, phone: '9179999999', email, isAdmin: false });
    return true;
  };

  // Phone-based OTP login
  const loginWithPhone = async (phoneNumber: string): Promise<{ success: boolean; message: string }> => {
    try {
      // TODO: Replace with Firebase/Supabase sendOTP() call
      // Example: await firebase.auth().signInWithPhoneNumber(phoneNumber);
      console.log(`OTP sent to ${phoneNumber}. Demo OTP: ${DEMO_OTP}`);
      return { success: true, message: 'OTP sent successfully to your phone number.' };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { success: false, message: 'Failed to send OTP. Please try again.' };
    }
  };

  const verifyOTP = async (phoneNumber: string, otp: string, name?: string): Promise<{ success: boolean; message: string; user?: User }> => {
    try {
      // TODO: Replace with Firebase/Supabase verifyOTP() call
      // Example: const result = await confirmationResult.confirm(otp);
      if (otp === DEMO_OTP) {
        let existingUser = DEMO_USERS[phoneNumber];
        
        if (!existingUser) {
          // Create new user if doesn't exist
          existingUser = {
            id: Date.now().toString(),
            name: name || 'User',
            phone: phoneNumber,
            isAdmin: false,
          };
          DEMO_USERS[phoneNumber] = existingUser;
        }

        setUser(existingUser);
        return { success: true, message: 'Login successful!', user: existingUser };
      } else {
        return { success: false, message: 'Invalid OTP. Please try again.' };
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { success: false, message: 'Failed to verify OTP. Please try again.' };
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithPhone, verifyOTP, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
