import { turso } from './turso';

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
  resetCount?: number;
  recoveryKey?: string;
  resetPeriodStart?: number | null;
  recoveryKeys?: string[];
}

const DEFAULT_SETTINGS: SiteSettings = {
  email: 'parthproduction123@gmail.com',
  phone_1: '9537330003',
  phone_2: '8866655651',
  address: 'Gaurav Path Road, Palanpur, Surat, Gujarat'
};

const DEFAULT_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  passwordHash: 'meet@_999', // Matches Kadam's admin password hash
  resetToken: null,
  resetTokenExpiry: null,
  resetCount: 0,
  recoveryKey: 'PARTH-777-RESET',
  resetPeriodStart: null,
  recoveryKeys: ['PARTH-777-RESET', 'PARTH-PRODUCTION-RECOVER-99', 'PARTH-SECURE-ADMIN-77']
};

async function getValue(key: string, defaultValue: any): Promise<any> {
  try {
    const rs = await turso.execute({
      sql: 'SELECT value FROM site_kv WHERE key = ?',
      args: [key]
    });
    if (rs.rows.length > 0) {
      const valStr = rs.rows[0].value as string;
      return JSON.parse(valStr);
    }
    return defaultValue;
  } catch (err) {
    console.error(`Turso getValue error for key: ${key}`, err);
    return defaultValue;
  }
}

async function setValue(key: string, value: any): Promise<void> {
  try {
    // Ensure table exists
    await turso.execute('CREATE TABLE IF NOT EXISTS site_kv (key TEXT PRIMARY KEY, value TEXT)');
    await turso.execute({
      sql: 'INSERT OR REPLACE INTO site_kv (key, value) VALUES (?, ?)',
      args: [key, JSON.stringify(value)]
    });
  } catch (err) {
    console.error(`Turso setValue error for key: ${key}`, err);
  }
}

export const vercelDb = {
  async getSettings(): Promise<SiteSettings> {
    return getValue('settings', DEFAULT_SETTINGS);
  },
  async setSettings(settings: SiteSettings): Promise<void> {
    await setValue('settings', settings);
  },
  async getImages(): Promise<DBImage[]> {
    return getValue('images', []);
  },
  async setImages(images: DBImage[]): Promise<void> {
    await setValue('images', images);
  },
  async getVideos(): Promise<DBVideo[]> {
    return getValue('videos', []);
  },
  async setVideos(videos: DBVideo[]): Promise<void> {
    await setValue('videos', videos);
  },
  async getServices(): Promise<DBServiceImage[]> {
    return getValue('services', []);
  },
  async setServices(services: DBServiceImage[]): Promise<void> {
    await setValue('services', services);
  },
  async getVibrants(): Promise<DBVibrant[]> {
    return getValue('vibrants', []);
  },
  async setVibrants(vibrants: DBVibrant[]): Promise<void> {
    await setValue('vibrants', vibrants);
  },
  async getCredentials(): Promise<AdminCredentials> {
    return getValue('credentials', DEFAULT_CREDENTIALS);
  },
  async setCredentials(credentials: AdminCredentials): Promise<void> {
    await setValue('credentials', credentials);
  }
};
