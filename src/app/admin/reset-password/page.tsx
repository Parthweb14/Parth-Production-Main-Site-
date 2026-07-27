'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, KeyRound, AlertTriangle, ArrowRight, CheckCircle, Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  
  const [token, setToken] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token'));
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!token) {
      setErrorMsg('Token missing from URL.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newUsername, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password.');
      }
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/login');
      }, 3000);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-8 rounded-3xl border border-white/10 bg-[#121214]/60 backdrop-blur-xl">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Invalid Reset Link</h2>
          <p className="text-sm text-zinc-400">The password reset token is missing from the link. Please request a new recovery link from the login page.</p>
          <button onClick={() => router.push('/admin/login')} className="mt-6 h-10 px-6 rounded-xl bg-zinc-900 border border-white/10 text-xs font-bold hover:bg-zinc-800 transition">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 font-outfit flex items-center justify-center p-4 selection:bg-[#3A8FB8]/25 overflow-hidden">
      {/* Background visual neon nodes */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#3A8FB8]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#3A8FB8]/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-[450px] rounded-3xl border border-white/10 bg-[#121214]/60 p-8 shadow-2xl backdrop-blur-xl md:p-10 z-10 transition-all duration-300">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0a1524] to-[#3A8FB8] p-0.5 shadow-lg shadow-[#3A8FB8]/20 mb-4 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-[#09090b] rounded-2xl flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Parth Production Logo" className="w-12 h-12 object-contain" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-white" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>RESET CREDENTIALS</h1>
          <p className="text-xs text-zinc-550 tracking-widest mt-1 uppercase">Set your new administrator logins</p>
        </div>

        {errorMsg && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {success ? (
          <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-6 text-center space-y-3">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />
            <h3 className="font-bold text-md text-white">Credentials Updated Successfully</h3>
            <p className="text-xs text-zinc-400">Your admin credentials have been reset. Redirecting to login portal...</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">New Username</label>
              <div className="relative">
                <input 
                  type="text" 
                  required 
                  placeholder="admin" 
                  value={newUsername} 
                  onChange={(e) => setNewUsername(e.target.value)} 
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-black/40 text-base md:text-sm text-white placeholder-zinc-600 focus:border-[#3A8FB8] focus:outline-none transition-colors duration-200"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">New Password</label>
              <div className="relative">
                <input 
                  type={showPass ? 'text' : 'password'} 
                  required 
                  placeholder="••••••••" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="w-full h-12 pl-11 pr-11 rounded-xl border border-white/10 bg-black/40 text-base md:text-base md:text-sm text-white placeholder-zinc-650 focus:border-[#3A8FB8] focus:outline-none transition-colors duration-200"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">Confirm New Password</label>
              <div className="relative">
                <input 
                  type={showPass ? 'text' : 'password'} 
                  required 
                  placeholder="••••••••" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-black/40 text-base md:text-base md:text-sm text-white placeholder-zinc-650 focus:border-[#3A8FB8] focus:outline-none transition-colors duration-200"
                />
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-gradient-to-r from-[#0a1524] to-[#3A8FB8] text-sm font-bold text-white flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(58,143,184,0.28)] transition-all duration-250 cursor-pointer disabled:opacity-40">
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Confirm Reset & Sign In
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
