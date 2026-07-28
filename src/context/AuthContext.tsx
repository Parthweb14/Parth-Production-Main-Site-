'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface SiteSettings {
  email: string;
  phone_1: string;
  phone_2: string;
  address: string;
  smtp_host?: string;
  smtp_port?: string;
  smtp_user?: string;
  smtp_pass?: string;
  from_email?: string;
}

interface CustomUser {
  id: string;
  email?: string;
  username?: string;
}

interface AuthContextType {
  user: CustomUser | null;
  token: string | null;
  loading: boolean;
  login: (token: string | null, user: CustomUser) => void;
  logout: () => void;
  siteSettings: SiteSettings;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    email: 'parthproduction123@gmail.com',
    phone_1: '9537330003',
    phone_2: '8866655651',
    address: 'Gaurav Path Road, Palanpur, Surat, Gujarat',
  });

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/public/data');
        if (res.ok) {
          const data = await res.json();
          if (data.settings && typeof data.settings === 'object') {
            setSiteSettings((prev) => {
              const next = { ...prev, ...data.settings };
              if (!next.phone_1) next.phone_1 = prev.phone_1;
              if (!next.email) next.email = prev.email;
              if (!next.address) next.address = prev.address;
              return next;
            });
          }
        }
      } catch (err) {
        console.error('Failed to load site settings:', err);
      }

      try {
        const sessionRes = await fetch('/api/auth/session', { credentials: 'include' });
        if (sessionRes.ok) {
          const session = await sessionRes.json();
          if (session.authenticated && session.user) {
            setUser(session.user);
            // Cookie is HttpOnly — keep a non-secret session marker for admin API bodies that still expect `token`
            setToken('cookie-session');
          }
        }
      } catch (err) {
        console.error('Session verify error:', err);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const login = (_newToken: string | null, newUser: CustomUser) => {
    setToken('cookie-session');
    setUser(newUser);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // ignore
    }
    setToken(null);
    setUser(null);
    window.location.href = '/admin/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, siteSettings }}>
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
