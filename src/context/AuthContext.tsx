import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { dbService } from '../services/db';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, address?: string) => Promise<{ success: boolean; error?: string }>;
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

  const login = async (email: string, pass: string) => {
    const res = await dbService.login(email, pass);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthModalOpen(false);
      return { success: true };
    }
    return { success: false, error: res.error || 'Failed to login' };
  };

  const register = async (name: string, email: string, phone: string, address?: string) => {
    const res = await dbService.register(name, email, phone, address);
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
