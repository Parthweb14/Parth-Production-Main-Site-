import { isIP } from 'net';
import { lookup } from 'dns/promises';

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'metadata.google.internal',
  'metadata',
]);

function isPrivateIp(ip: string): boolean {
  if (ip === '::1' || ip === '0:0:0:0:0:0:0:1') return true;
  if (ip.startsWith('fe80:') || ip.startsWith('fc') || ip.startsWith('fd')) return true;

  const v4 = ip.includes('.') ? ip : null;
  if (!v4) return false;
  const parts = v4.split('.').map((p) => Number(p));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  return false;
}

/**
 * Reject SMTP hosts that resolve to private/link-local/metadata addresses (SSRF).
 */
export async function assertSafeSmtpHost(host: string): Promise<string> {
  const cleaned = String(host || '')
    .trim()
    .toLowerCase()
    .replace(/^\[|\]$/g, '');

  if (!cleaned || cleaned.length > 253) {
    throw new Error('Invalid SMTP host.');
  }
  if (BLOCKED_HOSTNAMES.has(cleaned)) {
    throw new Error('SMTP host is not allowed.');
  }
  if (cleaned.endsWith('.local') || cleaned.endsWith('.internal')) {
    throw new Error('SMTP host is not allowed.');
  }

  const ipVersion = isIP(cleaned);
  if (ipVersion) {
    if (isPrivateIp(cleaned)) throw new Error('SMTP host is not allowed.');
    return cleaned;
  }

  if (!/^[a-z0-9.-]+$/.test(cleaned) || cleaned.includes('..')) {
    throw new Error('Invalid SMTP host.');
  }

  try {
    const results = await lookup(cleaned, { all: true, verbatim: true });
    if (!results.length) throw new Error('SMTP host could not be resolved.');
    for (const row of results) {
      if (isPrivateIp(row.address)) {
        throw new Error('SMTP host is not allowed.');
      }
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes('not allowed')) throw err;
    if (err instanceof Error && err.message.includes('could not be resolved')) throw err;
    throw new Error('SMTP host could not be resolved.');
  }

  return cleaned;
}
