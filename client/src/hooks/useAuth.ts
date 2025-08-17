import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { ADMIN_TOKEN_KEY } from '@/lib/auth';

export interface User {
  id: number;
  fullName: string;
  email: string;
  userType: 'customer' | 'engineer' | 'admin' | 'editor';
  emailVerified: boolean;
  phone?: string;
  address?: string;
  city?: string;
  postcode?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // /api/auth/me returns { id, email }
        setUser({
          id: data.id,
          email: data.email,
          fullName: '',
          userType: 'admin',
          emailVerified: true,
        } as any);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem('user_data');
        setToken(null);
      }
    } catch (error) {
      // Token is invalid, remove it
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem('user_data');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem(ADMIN_TOKEN_KEY, authToken);
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem('user_data');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!token, // trust JWT validation for admin gating
    login,
    logout,
    token,
  };
}