'use client';

// Sistema de autenticación simple con usuario hardcoded

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@digitaltwin.local';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'shelly2024';

const AUTH_KEY = 'digital-twin-auth';

export interface AuthUser {
  email: string;
  isAuthenticated: boolean;
}

export const auth = {
  // Login
  login: (email: string, password: string): boolean => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const user: AuthUser = {
        email,
        isAuthenticated: true,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      }
      return true;
    }
    return false;
  },

  // Logout
  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_KEY);
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return false;
    
    try {
      const user: AuthUser = JSON.parse(stored);
      return user.isAuthenticated === true;
    } catch {
      return false;
    }
  },

  // Get current user
  getUser: (): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return null;
    
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },
};

