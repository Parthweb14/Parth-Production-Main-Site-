'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AlertTriangle, CheckCircle, X, Eye, EyeOff, Lock } from 'lucide-react';
import TurnstileWidget, { captchaUiEnabled } from '@/components/TurnstileWidget';
import { normalizeIdentity, sanitizePassword } from '@/utils/credentialSanitize';
import { LOGO_LOGIN_PNG } from '@/utils/media';

function pasteClean(e: React.ClipboardEvent<HTMLInputElement>, apply: (v: string) => void) {
  e.preventDefault();
  const raw = e.clipboardData.getData('text') || '';
  apply(raw);
}

const inputClass =
  'h-11 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-base text-white outline-none transition-all placeholder:text-zinc-500 focus:border-[#3A8FB8] focus:ring-2 focus:ring-[#3A8FB8]/15 md:text-sm';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotCaptchaToken, setForgotCaptchaToken] = useState<string | null>(null);

  const year = new Date().getFullYear();

  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  const onCaptcha = useCallback((token: string | null) => {
    setCaptchaToken(token);
  }, []);

  const onForgotCaptcha = useCallback((token: string | null) => {
    setForgotCaptchaToken(token);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const cleanEmail = normalizeIdentity(email);
    const cleanPassword = sanitizePassword(password);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
          captchaToken: captchaToken || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.captchaRequired || res.status === 429) {
          setCaptchaRequired(true);
        }
        throw new Error(data.error || 'Invalid login credentials. Please try again.');
      }

      login(null, data.user);
      router.push('/admin');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Connection error. Please try again.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNew = sanitizePassword(newPassword);
    const cleanConfirm = sanitizePassword(confirmPassword);
    if (cleanNew !== cleanConfirm) {
      setForgotError('Passwords do not match.');
      return;
    }
    if (!cleanNew) {
      setForgotError('Password cannot be empty.');
      return;
    }
    setForgotLoading(true);
    setForgotError(null);
    setForgotSuccess(false);

    try {
      const res = await fetch('/api/auth/recovery-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recoveryKey: sanitizePassword(recoveryKey) || recoveryKey.trim(),
          newPassword: cleanNew,
          captchaToken: forgotCaptchaToken || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Unable to reset password with the provided details.');
      }
      setForgotSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Request failed.';
      setForgotError(message);
    } finally {
      setForgotLoading(false);
    }
  };

  const showCaptcha = captchaUiEnabled() && captchaRequired;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-950 via-[#050a12] to-black p-4 text-white selection:bg-[#3A8FB8]/25">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-[#0a0c10]/85 px-6 pb-7 pt-4 shadow-2xl backdrop-blur-xl sm:px-8 sm:pt-5">
          <div className="mb-3 text-center sm:mb-4">
            <div className="mx-auto flex h-11 items-center justify-center leading-none sm:h-12">
              <img
                src={LOGO_LOGIN_PNG}
                alt="Parth Production"
                width={1862}
                height={504}
                decoding="async"
                fetchPriority="high"
                className="h-full w-auto max-w-[min(100%,240px)] object-contain object-center sm:max-w-[280px]"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-950/50 px-4 py-2.5 text-sm font-medium text-red-400">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">Email</label>
              <input
                type="text"
                required
                autoFocus
                autoComplete="username"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onPaste={(e) => pasteClean(e, (raw) => setEmail(normalizeIdentity(raw)))}
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onPaste={(e) => pasteClean(e, (raw) => setPassword(sanitizePassword(raw)))}
                  spellCheck={false}
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 transition-colors hover:text-zinc-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {(showCaptcha || captchaUiEnabled()) && (
              <TurnstileWidget onToken={onCaptcha} className="flex justify-center" />
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-[#3A8FB8] text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition-all hover:bg-[#2f7aa0] disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in…
                </span>
              ) : (
                'LOGIN'
              )}
            </button>

            <div className="text-center text-xs">
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
                className="text-zinc-400 transition-colors hover:text-zinc-200"
              >
                Forgot password?
              </button>
            </div>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-white/50">
          © {year} Parth Production / Powered by{' '}
          <a
            href="https://trishulhub.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-white/70 underline hover:text-white"
          >
            Trishulhub
          </a>
        </p>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md space-y-6 rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition hover:bg-white/5 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-2 pr-8">
              <h3 className="text-lg font-semibold tracking-tight text-white">Reset password</h3>
              <p className="text-sm text-zinc-400">
                Enter your master recovery key to set a new admin password.
              </p>
            </div>

            {forgotError && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-950/50 p-3.5 text-sm text-red-400">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <p className="leading-relaxed">{forgotError}</p>
              </div>
            )}

            {forgotSuccess ? (
              <div className="space-y-3 rounded-lg border border-green-500/20 bg-green-500/10 p-6 text-center">
                <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
                <h4 className="text-sm font-semibold text-white">Password reset successful</h4>
                <p className="text-xs leading-relaxed text-zinc-400">
                  Your admin password has been updated. Close this and log in with your new
                  password.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="mt-2 h-10 w-full rounded-lg bg-[#3A8FB8] text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-[#2f7aa0]"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-300">
                    Master recovery key
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      autoComplete="off"
                      value={recoveryKey}
                      onChange={(e) => setRecoveryKey(e.target.value)}
                      onPaste={(e) => pasteClean(e, (raw) => setRecoveryKey(sanitizePassword(raw)))}
                      className={`${inputClass} pl-10`}
                    />
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-300">New password</label>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onPaste={(e) => pasteClean(e, (raw) => setNewPassword(sanitizePassword(raw)))}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-300">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onPaste={(e) =>
                      pasteClean(e, (raw) => setConfirmPassword(sanitizePassword(raw)))
                    }
                    className={inputClass}
                  />
                </div>

                {captchaUiEnabled() && (
                  <TurnstileWidget onToken={onForgotCaptcha} className="flex justify-center" />
                )}

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="h-11 w-full rounded-lg bg-[#3A8FB8] text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition-all hover:bg-[#2f7aa0] disabled:opacity-50"
                >
                  {forgotLoading ? 'Resetting…' : 'Reset password'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
