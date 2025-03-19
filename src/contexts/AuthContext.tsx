import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { getCurrentUser, setCurrentUser, createUser } from '@/lib/localStorage';

type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on initial render
    const user = getCurrentUser();
    setCurrentUserState(user);
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    try {
      // Simulate Google sign-in with a mock user
      const mockUser = createUser(
        'Demo User', 
        'demo@example.com', 
        'https://ui-avatars.com/api/?name=Demo+User&background=random'
      );
      
      setCurrentUserState(mockUser);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // In a real app, we would validate the password here
      // For this demo, we'll just create/get a user with this email
      const mockUser = createUser(
        email.split('@')[0], // Use part of email as name
        email,
        'https://ui-avatars.com/api/?name=' + email.split('@')[0] + '&background=random'
      );
      
      setCurrentUserState(mockUser);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // Create a new user in localStorage
      const newUser = createUser(
        name,
        email,
        'https://ui-avatars.com/api/?name=' + name.replace(' ', '+') + '&background=random'
      );
      
      setCurrentUserState(newUser);
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear user from localStorage
      setCurrentUser(null);
      setCurrentUserState(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  // Update localStorage whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      setCurrentUser(currentUser);
    }
  }, [currentUser]);

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};