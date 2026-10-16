import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(api.getToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.auth.me();
        if (data.user) {
          setUser(data.user);
        }
      } catch (_) {
        // Token expired or invalid
        api.setToken(null);
        setTokenState(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    const data = await api.auth.login({ email, password: pass });
    if (data.token) {
      api.setToken(data.token);
      setTokenState(data.token);
    }
    setUser(data.user);
  };

  const register = async (name: string, email: string, pass: string): Promise<void> => {
    const data = await api.auth.register({ name, email, password: pass });
    if (data.token) {
      api.setToken(data.token);
      setTokenState(data.token);
    }
    setUser(data.user);
  };

  const logout = async (): Promise<void> => {
    try {
      await api.auth.logout();
    } catch (_) {}
    api.setToken(null);
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
