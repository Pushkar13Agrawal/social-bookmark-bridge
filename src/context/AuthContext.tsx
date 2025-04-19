
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, getCurrentUser, logoutUser } from '@/utils/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  setCurrentUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const setCurrentUser = (user: User) => {
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
