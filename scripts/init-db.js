const { createClient } = require('@libsql/client');
const { randomBytes, scryptSync } = require('crypto');

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url || !authToken) {
  console.error('Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN');
  process.exit(1);
}

const client = createClient({ url, authToken });

/** Must match src/utils/password.ts (N=32768, r=8, p=1). */
const SCRYPT_OPTS = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64, SCRYPT_OPTS).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

function hashRecoveryKey(key) {
  const normalized = String(key).trim().toLowerCase();
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(normalized, salt, 64, SCRYPT_OPTS).toString('hex');
  return `scryptrk$${salt}$${hash}`;
}

const DEFAULT_SETTINGS = {
  email: 'parthproductionweb@gmail.com',
  phone_1: '9537330003',
  phone_2: '8866655651',
  address: 'Gaurav Path Road, Palanpur, Surat, Gujarat'
};

const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
const recovery = process.env.ADMIN_RECOVERY_KEY;
if (!bootstrapPassword) {
  console.error('Set ADMIN_BOOTSTRAP_PASSWORD to seed admin credentials');
  process.exit(1);
}

const DEFAULT_CREDENTIALS = {
  username: process.env.ADMIN_BOOTSTRAP_USERNAME || 'admin',
  passwordHash: hashPassword(bootstrapPassword),
  resetCount: 0,
  recoveryKeyHash: recovery ? hashRecoveryKey(recovery) : undefined,
  resetPeriodStart: null
};

const DEFAULT_IMAGES = [
  { id: '1', category: 'Road Shows', image_url: '/images/Untitled-design-13.png', order_index: 0 },
  { id: '2', category: 'Festivals', image_url: '/images/Untitled-design-18_tdjp2b.png', order_index: 1 },
  { id: '3', category: 'Concerts', image_url: '/images/Untitled-design-21_atubxz.png', order_index: 2 },
  { id: '4', category: 'Corporate', image_url: '/images/Untitled-design-20_sm7myc.png', order_index: 3 },
  { id: '5', category: 'Concerts', image_url: '/images/Untitled-design-17_ubz6ho.png', order_index: 4 },
  { id: '6', category: 'Weddings', image_url: '/images/Untitled-design-15_bdfxt9.png', order_index: 5 },
  { id: '7', category: 'Festivals', image_url: '/images/Untitled-design-14_ogyqmd.png', order_index: 6 },
  { id: '8', category: 'Festivals', image_url: '/images/Untitled-design-32_atcfrs.png', order_index: 7 },
  { id: '9', category: 'Corporate', image_url: '/images/Untitled-design-25_f2t475.png', order_index: 8 }
];

const DEFAULT_VIDEOS = [
  { id: '1', title: 'Our Stage in Action', video_url: '/videos/download_2_sispkn.mp4', order_index: 0 },
  { id: '2', title: 'Concert Light Rig', video_url: '/videos/Trim-1.mp4', order_index: 1 },
  { id: '4', title: 'Festival Pyrotechnics', video_url: '/videos/Trim-6.mp4', order_index: 2 },
  { id: '5', title: 'Neon Laser Show', video_url: '/videos/Untitled_design_2_pbfqf3.mp4', order_index: 3 },
  { id: '6', title: 'VIP Night Setup', video_url: '/videos/Untitled_design_3_lw9eld.mp4', order_index: 4 },
  { id: '3', title: 'Wedding Entrance', video_url: '/videos/Trim-3-1.mp4', order_index: 5 }
];

const DEFAULT_SERVICES = [
  { id: 1, service_title: 'WEDDINGS', image_url: '/images/Untitled-design-15_bdfxt9.png' },
  { id: 2, service_title: 'CONCERTS', image_url: '/images/Untitled-design-20_sm7myc.png' },
  { id: 3, service_title: 'FESTIVALS', image_url: '/images/Untitled-design-32_atcfrs.png' },
  { id: 4, service_title: 'CORPORATE EVENTS', image_url: '/images/Untitled-design-17_ubz6ho.png' },
  { id: 5, service_title: 'ROAD SHOWS', image_url: '/images/Untitled-design-13.png' },
  { id: 6, service_title: 'PRIVATE PARTIES', image_url: '/images/ChatGPT_Image_Jul_8_2026_02_29_02_PM_dfrv2l.png' },
  { id: 7, service_title: 'SFX & PYROTECHNICS', image_url: '/images/ChatGPT_Image_Jul_8_2026_02_56_39_PM_nux2y0.png' },
  { id: 8, service_title: 'STAGE SETUP', image_url: '/images/ChatGPT_Image_Jul_8_2026_02_34_55_PM_nbkkog.png' },
  { id: 9, service_title: 'EVENT MANAGEMENT', image_url: '/images/Untitled-design-17.png' }
];

const DEFAULT_VIBRANTS = [
  { id: '1', title: 'FESTIVALS', image_url: '/images/Untitled-design-20_sm7myc.png', order_index: 0 },
  { id: '2', title: 'CONCERT', image_url: '/images/Untitled-design-14_ogyqmd.png', order_index: 1 },
  { id: '3', title: 'WEDDING', image_url: '/images/Untitled-design-13.png', order_index: 2 },
  { id: '4', title: 'ROAD SHOWS', image_url: '/images/Untitled-design-32_atcfrs.png', order_index: 3 },
  { id: '5', title: 'LIVE EVENT', image_url: '/images/Untitled-design-25_f2t475.png', order_index: 4 }
];

async function main() {
  console.log('Connecting to Turso...');
  await client.execute('CREATE TABLE IF NOT EXISTS site_kv (key TEXT PRIMARY KEY, value TEXT)');

  const data = [
    { key: 'settings', value: DEFAULT_SETTINGS },
    { key: 'credentials', value: DEFAULT_CREDENTIALS },
    { key: 'images', value: DEFAULT_IMAGES },
    { key: 'videos', value: DEFAULT_VIDEOS },
    { key: 'services', value: DEFAULT_SERVICES },
    { key: 'vibrants', value: DEFAULT_VIBRANTS }
  ];

  for (const item of data) {
    console.log(`Seeding key: ${item.key}...`);
    await client.execute({
      sql: 'INSERT OR REPLACE INTO site_kv (key, value) VALUES (?, ?)',
      args: [item.key, JSON.stringify(item.value)]
    });
  }

  console.log('Seeding completed successfully!');
  process.exit(0);
}

main().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
