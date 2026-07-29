import { turso } from './turso';
import { hashPassword, hashRecoveryKey } from './password';

export interface SiteSettings {
  email: string;
  phone_1: string;
  phone_2: string;
  address: string;
  smtp_host?: string;
  smtp_port?: string;
  smtp_user?: string;
  smtp_pass?: string;
  from_email?: string;
}

export interface DBImage {
  id: string;
  category: string;
  image_url: string;
  order_index: number;
}

export interface DBVideo {
  id: string;
  title: string;
  video_url: string;
  order_index: number;
}

export interface DBServiceImage {
  id: number;
  service_title: string;
  image_url: string;
}

export interface DBVibrant {
  id: string;
  title: string;
  image_url: string;
  order_index: number;
}

export interface AdminCredentials {
  username: string;
  passwordHash: string;
  resetToken?: string | null;
  resetTokenExpiry?: number | null;
  otpCode?: string | null;
  otpExpiry?: number | null;
  otpAttempts?: number;
  credentialsVersion?: number;
  resetCount?: number;
  recoveryKey?: string;
  recoveryKeyHash?: string;
  resetPeriodStart?: number | null;
  recoveryKeys?: string[];
  /** Set when email OTP ownership is proven (credential change / reset). */
  emailVerifiedAt?: number | null;
  /** Account usable for login only after email ownership proof or operator bootstrap. */
  active?: boolean;
}

const DEFAULT_SETTINGS: SiteSettings = {
  email: 'parthproduction123@gmail.com',
  phone_1: '9537330003',
  phone_2: '8866655651',
  address: 'Gaurav Path Road, Palanpur, Surat, Gujarat',
};

function bootstrapCredentials(): AdminCredentials {
  const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  const recovery = process.env.ADMIN_RECOVERY_KEY;
  return {
    username: process.env.ADMIN_BOOTSTRAP_USERNAME || 'admin',
    // Only used when DB has no credentials row — never a known default password in source
    passwordHash: bootstrapPassword ? hashPassword(bootstrapPassword) : hashPassword(randomBootstrapFallback()),
    resetToken: null,
    resetTokenExpiry: null,
    resetCount: 0,
    recoveryKeyHash: recovery ? hashRecoveryKey(recovery) : undefined,
    resetPeriodStart: null,
    // Operator-provisioned bootstrap is active; otherwise inactive until recovery/OTP
    active: Boolean(bootstrapPassword),
    emailVerifiedAt: null,
  };
}

function randomBootstrapFallback(): string {
  // Unusable until ADMIN_BOOTSTRAP_PASSWORD or recovery reset is used
  return `unset-${Date.now()}-${Math.random()}`;
}

async function getValue(key: string, defaultValue: unknown): Promise<unknown> {
  // Fail closed on DB/parse errors — never silently fall back to bootstrap secrets.
  const rs = await turso.execute({
    sql: 'SELECT value FROM site_kv WHERE key = ?',
    args: [key],
  });
  if (rs.rows.length > 0) {
    return JSON.parse(rs.rows[0].value as string);
  }
  return defaultValue;
}

async function setValue(key: string, value: unknown): Promise<void> {
  try {
    await turso.execute('CREATE TABLE IF NOT EXISTS site_kv (key TEXT PRIMARY KEY, value TEXT)');
    await turso.execute({
      sql: 'INSERT OR REPLACE INTO site_kv (key, value) VALUES (?, ?)',
      args: [key, JSON.stringify(value)],
    });
  } catch (err) {
    console.error(`Turso setValue error for key: ${key}`, err);
    throw err;
  }
}

export const vercelDb = {
  async getSettings(): Promise<SiteSettings> {
    return (await getValue('settings', DEFAULT_SETTINGS)) as SiteSettings;
  },
  async setSettings(settings: SiteSettings): Promise<void> {
    await setValue('settings', settings);
  },
  async getImages(): Promise<DBImage[]> {
    return (await getValue('images', [])) as DBImage[];
  },
  async setImages(images: DBImage[]): Promise<void> {
    await setValue('images', images);
  },
  async getVideos(): Promise<DBVideo[]> {
    return (await getValue('videos', [])) as DBVideo[];
  },
  async setVideos(videos: DBVideo[]): Promise<void> {
    await setValue('videos', videos);
  },
  async getServices(): Promise<DBServiceImage[]> {
    return (await getValue('services', [])) as DBServiceImage[];
  },
  async setServices(services: DBServiceImage[]): Promise<void> {
    await setValue('services', services);
  },
  async getVibrants(): Promise<DBVibrant[]> {
    return (await getValue('vibrants', [])) as DBVibrant[];
  },
  async setVibrants(vibrants: DBVibrant[]): Promise<void> {
    await setValue('vibrants', vibrants);
  },
  async getCredentials(): Promise<AdminCredentials> {
    const stored = (await getValue('credentials', null)) as AdminCredentials | null;
    if (!stored) return bootstrapCredentials();
    return stored;
  },
  async setCredentials(credentials: AdminCredentials): Promise<void> {
    await setValue('credentials', credentials);
  },
  async getRateLimit(key: string): Promise<unknown> {
    return getValue(key, null);
  },
  async setRateLimit(key: string, value: unknown): Promise<void> {
    await setValue(key, value);
  },
};
