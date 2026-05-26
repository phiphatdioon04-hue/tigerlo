import db, { upsertRow } from './db.js';
import bcrypt from 'bcryptjs';

const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

const existing = db.prepare('SELECT id FROM admins WHERE username = ?').get(adminUsername);
if (!existing) {
  const hash = bcrypt.hashSync(adminPassword, 10);
  db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run(adminUsername, hash);
  console.log(`Created admin: ${adminUsername} / ${adminPassword}`);
} else {
  console.log(`Admin "${adminUsername}" already exists, skipping.`);
}

upsertRow('main_url', { url: 'https://www.tiger88.ai/' });

upsertRow('top_bar', {
  enabled: 1,
  logo_url: '/logo.webp',
  title: '',
  button_text: 'เข้าสู่ระบบ',
  button_url: '',
  button_color: '#14b8a6',
  button_action: 'sheet'
});

upsertRow('bottom_sheet', {
  enabled: 1,
  auto_show: 1,
  delay_ms: 1500,
  show_once: 1,
  logo_url: '/logo.webp',
  title: 'ยินดีต้อนรับสู่ TIGER',
  subtitle: 'เข้าสู่ระบบหรือสมัครสมาชิกเพื่อรับโบนัสต้อนรับ',
  login_text: 'เข้าสู่ระบบ',
  login_url: 'https://lin.ee/6YTRdbw',
  register_text: 'สมัครสมาชิก',
  register_url: 'https://lin.ee/6YTRdbw',
  primary_text: 'รับโบนัสเลย',
  primary_url: 'https://lin.ee/6YTRdbw',
  phone_field_enabled: 1
});

upsertRow('floating_button', {
  enabled: 1,
  text: 'สมัครรับโบนัส',
  icon: '🎁',
  url: 'https://example.com/promo',
  action: 'iframe',
  position: 'bottom-right',
  color: '#f59e0b'
});

upsertRow('theme', {
  bg_color: '#0a0e1a',
  primary_color: '#f59e0b',
  button_color: '#14b8a6',
  text_color: '#ffffff',
  border_radius: 28,
  shadow: '0 20px 60px rgba(245, 158, 11, 0.3)',
  font: 'Inter, system-ui, sans-serif',
  rounded_frame: 1
});

upsertRow('pwa_settings', {
  site_name: 'TIGER',
  short_name: 'TIGER',
  favicon_url: '/icon.svg',
  app_icon_url: '/icon.svg',
  manifest_name: 'TIGER',
  install_prompt_enabled: 1,
  splash_color: '#0a0e1a'
});

upsertRow('settings', {
  site_title: 'TIGER',
  meta_description: 'Mobile web app'
});

console.log('Seed done.');
process.exit(0);
