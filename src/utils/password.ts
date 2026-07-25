import { createHash, randomBytes, randomInt, scryptSync, timingSafeEqual } from 'crypto';

const HASH_PREFIX = 'scrypt$';

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${HASH_PREFIX}${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored) return false;

  if (stored.startsWith(HASH_PREFIX)) {
    const [, salt, hash] = stored.split('$');
    if (!salt || !hash) return false;
    const next = scryptSync(password, salt, 64);
    const prev = Buffer.from(hash, 'hex');
    if (prev.length !== next.length) return false;
    return timingSafeEqual(prev, next);
  }

  const a = Buffer.from(password);
  const b = Buffer.from(stored);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function isHashedPassword(stored: string): boolean {
  return stored.startsWith(HASH_PREFIX);
}

export function hashRecoveryKey(key: string): string {
  return createHash('sha256').update(key.trim().toLowerCase()).digest('hex');
}

export function verifyRecoveryKey(input: string, storedHash?: string | null): boolean {
  const envKey = process.env.ADMIN_RECOVERY_KEY;
  if (!envKey) return false;

  const inputHash = hashRecoveryKey(input);
  const envHash = hashRecoveryKey(envKey);
  const a = Buffer.from(inputHash, 'hex');
  const b = Buffer.from(envHash, 'hex');
  if (a.length === b.length && timingSafeEqual(a, b)) return true;

  if (storedHash) {
    const c = Buffer.from(storedHash, 'hex');
    if (a.length === c.length && timingSafeEqual(a, c)) return true;
  }
  return false;
}

export function generateOtp(): string {
  return randomInt(100000, 1000000).toString();
}
