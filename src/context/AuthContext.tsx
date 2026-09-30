import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { auth, ADMIN_EMAIL } from '../firebase/config';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  authError: string | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  authError: null,
  login: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  clearError: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = Boolean(user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());

  const login = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      if (userCredential.user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        await signOut(auth);
        throw new Error('অননুমোদিত অ্যাকাউন্ট। শুধুমাত্র সহৃদয় ফাউন্ডেশনের অনুমোদিত প্রশাসক এই প্যানেলে প্রবেশ করতে পারেন।');
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let message = 'লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'ভুল পাসওয়ার্ড বা ইমেইল প্রদান করা হয়েছে। অনুগ্রহ করে সঠিক তথ্য দিন।';
      } else if (err.code === 'auth/user-not-found') {
        message = 'এই ইমেইলের কোনো প্রশাসক অ্যাকাউন্ট পাওয়া যায়নি।';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'অতিরিক্ত ব্যর্থ চেষ্টার কারণে সাময়িকভাবে ব্লক করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।';
      } else if (err.code === 'auth/invalid-email') {
        message = 'ইমেইল ফরম্যাট সঠিক নয়।';
      } else if (err.message) {
        message = err.message;
      }
      setAuthError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const resetPassword = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: any) {
      console.error("Password reset error:", err);
      let message = 'পাসওয়ার্ড রিসেট ইমেইল পাঠানো সম্ভব হয়নি।';
      if (err.code === 'auth/user-not-found') {
        message = 'এই ইমেইলে কোনো অ্যাকাউন্ট নিবন্ধিত নেই।';
      } else if (err.code === 'auth/invalid-email') {
        message = 'সঠিক ইমেইল ঠিকানা দিন।';
      }
      setAuthError(message);
      throw new Error(message);
    }
  };

  const clearError = () => setAuthError(null);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, authError, login, logout, resetPassword, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
