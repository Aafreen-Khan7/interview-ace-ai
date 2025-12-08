import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '@/types/interview';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'interview_platform_users';
const CURRENT_USER_KEY = 'interview_platform_current_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): Record<string, { password: string; profile: UserProfile }> => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : {};
  };

  const saveUsers = (users: Record<string, { password: string; profile: UserProfile }>) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = getUsers();
    const userRecord = users[email.toLowerCase()];

    if (!userRecord) {
      return { success: false, error: 'No account found with this email' };
    }

    if (userRecord.password !== password) {
      return { success: false, error: 'Incorrect password' };
    }

    setUser(userRecord.profile);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userRecord.profile));
    return { success: true };
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = getUsers();
    const emailLower = email.toLowerCase();

    if (users[emailLower]) {
      return { success: false, error: 'An account with this email already exists' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    const newProfile: UserProfile = {
      id: crypto.randomUUID(),
      email: emailLower,
      name,
      createdAt: new Date(),
      totalInterviews: 0,
      averageScore: 0,
      streakDays: 0,
      badges: [],
    };

    users[emailLower] = { password, profile: newProfile };
    saveUsers(users);
    setUser(newProfile);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newProfile));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

    // Also update in users storage
    const users = getUsers();
    if (users[user.email]) {
      users[user.email].profile = updatedUser;
      saveUsers(users);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
