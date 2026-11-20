import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { dbService } from '../services/db';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOtp: (phone: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  sendOtp: (phone: string) => Promise<{ success: boolean; message?: string; devOtp?: string; error?: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  register: (name: string, phone: string, password: string, email?: string, address?: string, otp?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'register';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const existing = dbService.getCurrentUser();
    if (existing) {
      setUser(existing);
    }
  }, []);

  const login = async (identifier: string, pass: string) => {
    const res = await dbService.login(identifier, pass);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthModalOpen(false);
      return { success: true };
    }
    return { success: false, error: res.error || 'Failed to login' };
  };

  const loginWithOtp = async (phone: string, otp: string) => {
    const res = await dbService.loginWithOtp(phone, otp);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthModalOpen(false);
      return { success: true };
    }
    return { success: false, error: res.error || 'Invalid OTP code' };
  };

  const sendOtp = async (phone: string) => {
    return await dbService.sendOtp(phone);
  };

  const verifyOtp = async (phone: string, otp: string) => {
    return await dbService.verifyOtp(phone, otp);
  };

  const register = async (name: string, phone: string, password: string, email = '', address = '', otp = '') => {
    const res = await dbService.register(name, phone, password, email, address, otp);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthModalOpen(false);
      return { success: true };
    }
    return { success: false, error: res.error || 'Failed to register' };
  };

  const logout = () => {
    dbService.logout();
    setUser(null);
  };

  const updateProfile = (updated: Partial<User>) => {
    const updatedUser = dbService.updateCurrentUser(updated);
    if (updatedUser) {
      setUser(updatedUser);
    }
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || user?.email === 'admin@mrbun.in',
        login,
        loginWithOtp,
        sendOtp,
        verifyOtp,
        register,
        logout,
        updateProfile,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
