/**
 * Optional Cloudflare Turnstile verification.
 * When TURNSTILE_SECRET_KEY is unset, captcha is skipped (rate-limit lockout still applies).
 * When set, locked / high-risk requests must pass captchaToken.
 */

export async function verifyCaptchaToken(
  token: string | null | undefined,
  request: Request
): Promise<{ ok: boolean; skipped: boolean }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return { ok: true, skipped: true };
  }

  if (!token || typeof token !== 'string' || token.length < 10) {
    return { ok: false, skipped: false };
  }

  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      undefined;

    const body = new URLSearchParams();
    body.set('secret', secret);
    body.set('response', token);
    if (ip) body.set('remoteip', ip);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return { ok: Boolean(data.success), skipped: false };
  } catch (err) {
    console.error('CAPTCHA verify error', err);
    return { ok: false, skipped: false };
  }
}

export function captchaConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}
