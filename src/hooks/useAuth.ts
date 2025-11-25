'use client';

import { useState, useEffect } from 'react';
import { auth, type AuthUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check auth status on mount
    const currentUser = auth.getUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    const success = auth.login(email, password);
    if (success) {
      const user = auth.getUser();
      setUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    auth.logout();
    setUser(null);
    router.push('/login');
  };

  const isAuthenticated = auth.isAuthenticated();

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  };
}

