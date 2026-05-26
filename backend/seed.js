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

upsertRow('main_url', { url: 'https://www.shakehandscreen.com/' });

upsertRow('top_bar', {
  enabled: 1,
  logo_url: '/icon.svg',
  title: 'NEON APP',
  button_text: 'ติดตั้ง',
  button_url: '',
  button_color: '#a855f7',
  button_action: 'install'
});

upsertRow('bottom_sheet', {
  enabled: 1,
  auto_show: 1,
  delay_ms: 1500,
  show_once: 1,
  logo_url: '/icon.svg',
  title: 'ยินดีต้อนรับ',
  subtitle: 'เข้าสู่ระบบหรือสมัครสมาชิกเพื่อใช้งานทุกฟีเจอร์',
  login_text: 'เข้าสู่ระบบ',
  login_url: 'https://example.com/login',
  register_text: 'สมัครสมาชิก',
  register_url: 'https://example.com/register',
  primary_text: 'ต่อไป',
  primary_url: 'https://example.com/start',
  phone_field_enabled: 1
});

upsertRow('floating_button', {
  enabled: 1,
  text: 'สมัครเลย',
  icon: '🎁',
  url: 'https://example.com/promo',
  action: 'iframe',
  position: 'bottom-right',
  color: '#a855f7'
});

upsertRow('theme', {
  bg_color: '#0b0118',
  primary_color: '#a855f7',
  button_color: '#7c3aed',
  text_color: '#ffffff',
  border_radius: 28,
  shadow: '0 20px 60px rgba(168, 85, 247, 0.35)',
  font: 'Inter, system-ui, sans-serif',
  rounded_frame: 1
});

upsertRow('pwa_settings', {
  site_name: 'Neon App',
  short_name: 'Neon',
  favicon_url: '/icon.svg',
  app_icon_url: '/icon.svg',
  manifest_name: 'Neon App',
  install_prompt_enabled: 1,
  splash_color: '#0b0118'
});

upsertRow('settings', {
  site_title: 'Neon App',
  meta_description: 'Mobile web app wrapper'
});

console.log('Seed done.');
process.exit(0);
