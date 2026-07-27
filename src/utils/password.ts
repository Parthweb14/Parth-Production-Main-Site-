import {
  createHash,
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from 'crypto';

const HASH_PREFIX = 'scrypt$';
const RECOVERY_PREFIX = 'scryptrk$';
/** Stronger than Node defaults: N=2^15, r=8, p=1 */
const SCRYPT_N = 32768;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64;
const SCRYPT_OPTS = { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P, maxmem: 64 * 1024 * 1024 };

function scryptKey(password: string, salt: string): Buffer {
  return scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_OPTS);
}

function otpPepper(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_RECOVERY_KEY || 'parth-otp-pepper';
}

/** Cached dummy hash so failed logins still pay full scrypt cost (anti-enumeration timing). */
let dummyHashCache: string | null = null;
function dummyPasswordHash(): string {
  if (!dummyHashCache) {
    dummyHashCache = hashPassword('__timing-pad-not-a-real-password__');
  }
  return dummyHashCache;
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptKey(password, salt).toString('hex');
  return `${HASH_PREFIX}${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored) return false;

  if (stored.startsWith(HASH_PREFIX)) {
    const parts = stored.split('$');
    const salt = parts[1];
    const hash = parts[2];
    if (!salt || !hash) return false;
    const next = scryptKey(password, salt);
    const prev = Buffer.from(hash, 'hex');
    if (prev.length !== next.length) return false;
    return timingSafeEqual(prev, next);
  }

  // Legacy plaintext — still constant-time length-safe compare; migrate away on login.
  const a = Buffer.from(password);
  const b = Buffer.from(stored);
  if (a.length !== b.length) {
    timingSafeEqual(a, a); // burn a tiny bit of time
    return false;
  }
  return timingSafeEqual(a, b);
}

/**
 * Always runs a full password verify (dummy hash if user unknown)
 * so response timing does not leak whether the username exists.
 */
export function verifyPasswordAntiEnum(
  password: string,
  stored: string | null | undefined,
  userMatched: boolean
): boolean {
  const hash = userMatched && stored ? stored : dummyPasswordHash();
  const ok = verifyPassword(password, hash);
  return Boolean(userMatched && ok);
}

export function isHashedPassword(stored: string): boolean {
  return stored.startsWith(HASH_PREFIX);
}

/** Recovery keys: scrypt (slow), not bare SHA-256. */
export function hashRecoveryKey(key: string): string {
  const normalized = key.trim().toLowerCase();
  const salt = randomBytes(16).toString('hex');
  const hash = scryptKey(normalized, salt).toString('hex');
  return `${RECOVERY_PREFIX}${salt}$${hash}`;
}

function verifyScryptBlob(input: string, stored: string, prefix: string): boolean {
  if (!stored.startsWith(prefix)) return false;
  const rest = stored.slice(prefix.length);
  const [salt, hash] = rest.split('$');
  if (!salt || !hash) return false;
  const next = scryptKey(input, salt);
  const prev = Buffer.from(hash, 'hex');
  if (prev.length !== next.length) return false;
  return timingSafeEqual(prev, next);
}

export function verifyRecoveryKey(input: string, storedHash?: string | null): boolean {
  const normalized = input.trim().toLowerCase();
  const envKey = process.env.ADMIN_RECOVERY_KEY;

  // Env key: compare via scrypt of a derived fixed salt from HMAC (no plaintext env in DB)
  if (envKey) {
    const envNorm = envKey.trim().toLowerCase();
    // Constant-time-ish: hash both with same salt derived from pepper
    const salt = createHmac('sha256', otpPepper()).update('recovery-env-salt').digest('hex').slice(0, 32);
    const a = scryptKey(normalized, salt);
    const b = scryptKey(envNorm, salt);
    if (a.length === b.length && timingSafeEqual(a, b)) return true;
  }

  if (storedHash) {
    if (storedHash.startsWith(RECOVERY_PREFIX)) {
      if (verifyScryptBlob(normalized, storedHash, RECOVERY_PREFIX)) return true;
    } else {
      // Legacy unsalted SHA-256 recovery hashes
      const inputHash = createHash('sha256').update(normalized).digest('hex');
      const a = Buffer.from(inputHash, 'hex');
      const c = Buffer.from(storedHash, 'hex');
      if (a.length === c.length && timingSafeEqual(a, c)) return true;
    }
  }
  return false;
}

/** Cryptographically random 8-char OTP (no ambiguous chars). Never log this. */
export function generateOtp(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(8);
  let out = '';
  for (let i = 0; i < 8; i++) out += alphabet[bytes[i]! % alphabet.length];
  return out;
}

/** Store only HMAC hash of OTP — never plaintext. */
export function hashOtp(otp: string): string {
  return createHmac('sha256', otpPepper()).update(String(otp).trim().toUpperCase()).digest('hex');
}

export function verifyOtp(input: string, storedHash?: string | null): boolean {
  if (!storedHash) return false;
  const next = Buffer.from(hashOtp(input), 'hex');
  const prev = Buffer.from(storedHash, 'hex');
  if (prev.length !== next.length) return false;
  return timingSafeEqual(prev, next);
}

/** Long single-use reset token (for email links) — hash before storage. */
export function generateResetToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashResetToken(token: string): string {
  return createHmac('sha256', otpPepper()).update(String(token).trim()).digest('hex');
}

export function verifyResetToken(input: string, storedHash?: string | null): boolean {
  if (!storedHash) return false;
  const next = Buffer.from(hashResetToken(input), 'hex');
  const prev = Buffer.from(storedHash, 'hex');
  if (prev.length !== next.length) return false;
  return timingSafeEqual(prev, next);
}

export function passwordMeetsPolicy(password: string): boolean {
  return typeof password === 'string' && password.length >= 12;
}

export const PASSWORD_POLICY_MSG = 'Password must be at least 12 characters.';
