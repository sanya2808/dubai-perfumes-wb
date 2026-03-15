import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  loginWithPhone: (phoneNumber: string, recaptchaContainerId: string) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (otp: string, name?: string) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Sync Firebase Auth user with our app's User model
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        } else {
          // If no doc exists (e.g. first login via phone), create a minimal user object
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            phone: firebaseUser.phoneNumber || '',
            email: firebaseUser.email || '',
            isAdmin: firebaseUser.email === 'admin@dubai.com', // Simple check
          };
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, _password: string): Promise<{ success: boolean; message: string }> => {
    try {
      await signInWithEmailAndPassword(auth, email, _password);
      return { success: true, message: 'Login successful' };
    } catch (error: any) {
      console.error('Error logging in:', error);
      return { success: false, message: error.message };
    }
  };

  const signup = async (name: string, email: string, _password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, _password);
      
      const newUser: User = {
        id: firebaseUser.uid,
        name,
        email,
        phone: '', 
        isAdmin: email === 'admin@dubai.com',
      };

      // Store in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      setUser(newUser);
      
      return { success: true, message: 'Account created successfully' };
    } catch (error: any) {
      console.error('Error signing up:', error);
      return { success: false, message: error.message };
    }
  };

  const loginWithPhone = async (phoneNumber: string, recaptchaContainerId: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Setup Recaptcha
      const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
        size: 'invisible',
      });

      // Firebase expects phone number with country code, e.g., +919876543210
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      setConfirmationResult(result);
      
      return { success: true, message: 'OTP sent successfully to your phone number.' };
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      let message = 'Failed to send OTP. Please try again.';
      if (error.code === 'auth/invalid-phone-number') message = 'Invalid phone number format.';
      if (error.code === 'auth/too-many-requests') message = 'Too many attempts. Please try again later.';
      return { success: false, message };
    }
  };

  const verifyOTP = async (otp: string, name?: string): Promise<{ success: boolean; message: string; user?: User }> => {
    try {
      if (!confirmationResult) {
        return { success: false, message: 'No active OTP session. Please send OTP first.' };
      }

      const { user: firebaseUser } = await confirmationResult.confirm(otp);
      
      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      let currentUser: User;

      if (userDoc.exists()) {
        currentUser = userDoc.data() as User;
      } else {
        // Create new user record
        currentUser = {
          id: firebaseUser.uid,
          name: name || 'User',
          phone: firebaseUser.phoneNumber || '',
          isAdmin: false,
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), currentUser);
      }

      setUser(currentUser);
      return { success: true, message: 'Login successful!', user: currentUser };
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      let message = 'Invalid OTP. Please try again.';
      if (error.code === 'auth/code-expired') message = 'OTP expired. Please request a new one.';
      return { success: false, message };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithPhone, verifyOTP, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
