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
  email: string;
}

interface AuthContextType {
  user: CustomUser | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: CustomUser) => void;
  logout: () => void;
  siteSettings: SiteSettings;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    email: 'kadamproduction123@gmail.com',
    phone_1: '9537330003',
    phone_2: '8866655651',
    address: 'Gaurav Path Road, Palanpur, Surat, Gujarat'
  });

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/public/data');
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setSiteSettings(data.settings);
          }
        }
      } catch (err) {
        console.error('Failed to load site settings:', err);
      }

      try {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(c => c.trim().startsWith('admin_token='));
        if (tokenCookie) {
          const val = tokenCookie.split('=')[1];
          if (val) {
            // Client-side decode of custom Base64 token payload
            const payload = JSON.parse(atob(val));
            if (Date.now() < payload.exp) {
              setToken(val);
              setUser({ id: 'admin-id-1', email: 'kadamproductionweb@gmail.com' });
            } else {
              // Clear expired cookie
              document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            }
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

  const login = (newToken: string, newUser: CustomUser) => {
    setToken(newToken);
    setUser(newUser);
    document.cookie = `admin_token=${newToken}; path=/; SameSite=Strict; Secure`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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
