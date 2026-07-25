'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, AlertTriangle, ArrowRight, CheckCircle, X } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Auth loading states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forgot password modal states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // If already logged in, redirect to admin immediately
  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Invalid login credentials. Please try again.');
      }

      login(data.token, data.user);
      router.push('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match.');
      return;
    }
    setForgotLoading(true);
    setForgotError(null);
    setForgotSuccess(false);

    try {
      const res = await fetch('/api/auth/recovery-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recoveryKey, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password.');
      }
      setForgotSuccess(true);
    } catch (err: any) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 font-outfit flex items-center justify-center p-4 selection:bg-[#d4af37]/30 overflow-hidden">
      
      {/* Background visual neon nodes */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-yellow-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Glassmorphic card wrapper */}
      <div className="relative w-full max-w-[450px] rounded-3xl border border-white/10 bg-[#121214]/60 p-8 shadow-2xl backdrop-blur-xl md:p-10 z-10 transition-all duration-300">
        
        {/* Logo and brand name */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#d4af37] to-[#f59e0b] p-0.5 shadow-lg shadow-[#d4af37]/20 mb-4 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-[#09090b] rounded-2xl flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Parth Production Logo" className="w-12 h-12 object-contain" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-white uppercase" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
            PARTH PRODUCTION
          </h1>
          <p className="text-xs text-zinc-500 tracking-widest mt-1 uppercase font-semibold">
            Admin Console Portal
          </p>
        </div>

        {/* Display Alert banners */}
        {errorMsg && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">
              Username or Email
            </label>
            <div className="relative">
              <input 
                type="text"
                required
                placeholder="admin@parthproduction.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-black/40 text-base md:text-sm text-white placeholder-zinc-600 focus:border-[#d4af37] focus:outline-none transition-colors duration-200"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                Password
              </label>
              <button 
                type="button" 
                onClick={() => {
                  setShowForgotModal(true);
                  setForgotSuccess(false);
                  setForgotError(null);
                  setRecoveryKey('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="text-[10px] font-bold text-zinc-400 hover:text-white transition duration-200 cursor-pointer uppercase tracking-widest"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-black/40 text-base md:text-base md:text-sm text-white placeholder-zinc-650 focus:border-[#d4af37] focus:outline-none transition-colors duration-200"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f59e0b] text-sm font-bold text-black flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-250 cursor-pointer disabled:opacity-40"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                Sign In to Console
                <ArrowRight className="w-4 h-4 text-black" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-[420px] rounded-3xl border border-white/10 bg-zinc-950 p-6 md:p-8 shadow-2xl space-y-6">
            <button 
              onClick={() => setShowForgotModal(false)}
              className="absolute right-6 top-6 w-8 h-8 rounded-full border border-white/5 hover:border-white/20 bg-black/20 flex items-center justify-center hover:bg-zinc-900 transition-colors"
            >
              <X className="w-4 h-4 text-zinc-400 hover:text-white" />
            </button>

            <div className="space-y-2 pr-8">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Reset Console Password</h3>
              <p className="text-xs text-zinc-400">Enter your Master Recovery Key to instantly configure a new password for the console.</p>
            </div>

            {forgotError && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-400">
                <AlertTriangle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">{forgotError}</p>
              </div>
            )}

            {forgotSuccess ? (
              <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-6 text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />
                <h4 className="font-bold text-sm text-white">Password Reset Successful</h4>
                <p className="text-xs text-zinc-450 leading-relaxed">Your admin password has been updated. You can now close this modal and log in with your new password.</p>
                <button 
                  onClick={() => setShowForgotModal(false)}
                  className="mt-4 w-full h-10 rounded-xl bg-zinc-850 text-xs font-bold text-white hover:bg-zinc-700 transition"
                >
                  Close Modal
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">Master Recovery Key</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required 
                      placeholder="" 
                      value={recoveryKey} 
                      onChange={(e) => setRecoveryKey(e.target.value)} 
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-black/40 text-base md:text-base md:text-sm text-white placeholder-zinc-650 focus:border-[#d4af37] focus:outline-none transition"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">New Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      required 
                      placeholder="••••••••" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-black/40 text-base md:text-base md:text-sm text-white placeholder-zinc-650 focus:border-[#d4af37] focus:outline-none transition"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">Confirm Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      required 
                      placeholder="••••••••" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-black/40 text-base md:text-base md:text-sm text-white placeholder-zinc-650 focus:border-[#d4af37] focus:outline-none transition"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={forgotLoading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f59e0b] text-xs font-bold text-black flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition disabled:opacity-40"
                >
                  {forgotLoading ? (
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      Reset Password Now
                      <ArrowRight className="w-4 h-4 text-black" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
