'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchPublicData } from '@/utils/publicDataCache';
import { warmVideosFromPublicData } from '@/utils/videoPriority';

interface SiteSettings {
  email: string;
  phone_1: string;
  phone_2: string;
  address: string;
  map_query?: string;
  hours_label?: string;
  hours_text?: string;
  base_city?: string;
  studio_label?: string;
  contact_eyebrow?: string;
  contact_title?: string;
  contact_italic?: string;
  contact_description?: string;
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

const DEFAULT_SETTINGS: SiteSettings = {
  email: 'parthproduction123@gmail.com',
  phone_1: '9537330003',
  phone_2: '8866655651',
  address: 'Gaurav Path Road, Palanpur, Surat, Gujarat',
  map_query: 'Parth Production, Surat',
  hours_label: 'Hours',
  hours_text: 'Open for bookings',
  base_city: 'Surat, Gujarat',
  studio_label: 'Parth Production Studio',
  contact_eyebrow: 'Book the floor',
  contact_title: 'Tell us the',
  contact_italic: 'date & the vibe.',
  contact_description:
    'Share venue, guest count, and energy — sound, light, SFX, truss, fireworks, DJ. One crew. One system.',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    async function checkSession() {
      try {
        const data = await fetchPublicData();
        warmVideosFromPublicData(data);
        if (data.settings) {
          setSiteSettings({
            ...DEFAULT_SETTINGS,
            ...(data.settings as SiteSettings),
          });
        }
      } catch (err) {
        console.error('Failed to load site settings:', err);
      }

      // Session check only matters for admin — skip blocking the marketing homepage
      const onAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
      if (onAdmin) {
        try {
          const sessionRes = await fetch('/api/auth/session', { credentials: 'include' });
          if (sessionRes.ok) {
            const session = await sessionRes.json();
            if (session.authenticated && session.user) {
              setUser(session.user);
              setToken('cookie-session');
            }
          }
        } catch (err) {
          console.error('Session verify error:', err);
        }
      }
      setLoading(false);
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
