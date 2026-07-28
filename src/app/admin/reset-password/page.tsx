'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, KeyRound, AlertTriangle, ArrowRight, CheckCircle, Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();

  const [otp, setOtp] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!otp.trim()) {
      setErrorMsg('Enter the verification code from your email.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!newPassword) {
      setErrorMsg('Password cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otp.trim(), newUsername, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password.');
      }
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/login');
      }, 3000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 font-outfit flex items-center justify-center p-4 selection:bg-[#3A8FB8]/25 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#3A8FB8]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#3A8FB8]/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-[450px] rounded-3xl border border-white/10 bg-[#121214]/60 p-8 shadow-2xl backdrop-blur-xl md:p-10 z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0a1524] to-[#3A8FB8] p-0.5 shadow-lg shadow-[#3A8FB8]/20 mb-4 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-[#09090b] rounded-2xl flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Parth Production Logo" className="w-12 h-12 object-contain" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-white">RESET CREDENTIALS</h1>
          <p className="text-xs text-zinc-550 tracking-widest mt-1 uppercase">
            Enter the email code — never shared in the URL
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {success ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-sm text-white">Credentials updated. Redirecting to login…</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.toUpperCase())}
                placeholder="Email verification code"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-zinc-600 focus:border-[#3A8FB8] focus:outline-none tracking-widest"
                required
              />
            </div>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="New username"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-zinc-600 focus:border-[#3A8FB8] focus:outline-none"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type={showPass ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full h-12 pl-11 pr-11 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-zinc-600 focus:border-[#3A8FB8] focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                aria-label="Toggle password"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type={showPass ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-zinc-600 focus:border-[#3A8FB8] focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#0a1524] to-[#3A8FB8] text-sm font-bold text-white flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(58,143,184,0.28)] transition disabled:opacity-40"
            >
              {loading ? 'Updating…' : 'Update credentials'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
