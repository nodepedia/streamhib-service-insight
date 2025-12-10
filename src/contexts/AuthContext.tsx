import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: string;
  plan: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      const response = await api.login(identifier, password);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.register(name, email, password);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true };
      }
      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    api.clearToken();
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      isAuthenticated: !!user && !!token,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
