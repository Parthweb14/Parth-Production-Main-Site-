/**
 * Reset admin password in Turso using the same scrypt params as src/utils/password.ts
 * Usage: node scripts/reset-admin-password.mjs 'YourNewPassword123'
 */
import { createClient } from '@libsql/client';
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';
import { readFileSync } from 'fs';

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
}

const SCRYPT_OPTS = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const KEYLEN = 64;

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, KEYLEN, SCRYPT_OPTS).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

function verifyPassword(password, stored) {
  const parts = String(stored).split('$');
  if (parts[0] !== 'scrypt' || !parts[1] || !parts[2]) return false;
  const next = scryptSync(password, parts[1], KEYLEN, SCRYPT_OPTS);
  const prev = Buffer.from(parts[2], 'hex');
  return prev.length === next.length && timingSafeEqual(prev, next);
}

const password = process.argv[2];
if (!password || password.length < 1) {
  console.error('Usage: node scripts/reset-admin-password.mjs <password>');
  process.exit(1);
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const rs = await client.execute({ sql: 'SELECT value FROM site_kv WHERE key = ?', args: ['credentials'] });
if (!rs.rows.length) {
  console.error('No credentials row found');
  process.exit(1);
}
const cred = JSON.parse(rs.rows[0].value);
cred.passwordHash = hashPassword(password);
cred.active = true;
cred.credentialsVersion = (cred.credentialsVersion || 0) + 1;
cred.otpCode = null;
cred.otpExpiry = null;
cred.otpAttempts = 0;

await client.execute({
  sql: 'INSERT INTO site_kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
  args: ['credentials', JSON.stringify(cred)],
});

console.log(JSON.stringify({
  ok: true,
  username: cred.username,
  verifyOk: verifyPassword(password, cred.passwordHash),
}, null, 2));
