import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import db, { getRow, upsertRow } from './db.js';
import { signToken, requireAuth } from './middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// --- PUBLIC ---
app.get('/api/public/settings', (_req, res) => {
  res.json({
    settings: getRow('settings'),
    pwa: getRow('pwa_settings'),
    theme: getRow('theme')
  });
});

app.get('/api/public/main-url', (_req, res) => {
  res.json(getRow('main_url'));
});

app.get('/api/public/ui-config', (_req, res) => {
  res.json({
    main_url: getRow('main_url'),
    top_bar: getRow('top_bar'),
    bottom_sheet: getRow('bottom_sheet'),
    floating_button: getRow('floating_button'),
    theme: getRow('theme'),
    pwa: getRow('pwa_settings'),
    settings: getRow('settings')
  });
});

// Dynamic manifest reflecting PWA settings
app.get('/manifest.webmanifest', (_req, res) => {
  const pwa = getRow('pwa_settings') || {};
  const theme = getRow('theme') || {};
  const settings = getRow('settings') || {};
  res.json({
    id: '/',
    name: pwa.manifest_name || pwa.site_name || 'App',
    short_name: pwa.short_name || 'App',
    description: settings.meta_description || 'Mobile web app',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'fullscreen'],
    background_color: pwa.splash_color || theme.bg_color || '#0a0e1a',
    theme_color: pwa.splash_color || theme.bg_color || '#0a0e1a',
    orientation: 'portrait',
    lang: 'th',
    dir: 'ltr',
    categories: ['entertainment', 'games', 'lifestyle'],
    prefer_related_applications: false,
    icons: [
      { src: '/icons/launchericon-48x48.png',   sizes: '48x48',   type: 'image/png', purpose: 'any' },
      { src: '/icons/launchericon-72x72.png',   sizes: '72x72',   type: 'image/png', purpose: 'any' },
      { src: '/icons/launchericon-96x96.png',   sizes: '96x96',   type: 'image/png', purpose: 'any' },
      { src: '/icons/launchericon-144x144.png', sizes: '144x144', type: 'image/png', purpose: 'any' },
      { src: '/icons/launchericon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/launchericon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/launchericon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/launchericon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  });
});

// --- AUTH ---
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  const row = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = signToken({ id: row.id, username: row.username });
  res.json({ token, username: row.username });
});

// --- ADMIN CRUD ---
const SLUG_TO_TABLE = {
  'settings': 'settings',
  'main-url': 'main_url',
  'top-bar': 'top_bar',
  'bottom-sheet': 'bottom_sheet',
  'floating-button': 'floating_button',
  'theme': 'theme',
  'pwa': 'pwa_settings'
};

for (const [slug, table] of Object.entries(SLUG_TO_TABLE)) {
  app.get(`/api/admin/${slug}`, requireAuth, (_req, res) => {
    res.json(getRow(table) || {});
  });
  app.put(`/api/admin/${slug}`, requireAuth, (req, res) => {
    const row = upsertRow(table, req.body || {});
    res.json(row);
  });
}

// --- Serve frontend build (optional, for production) ---
const distDir = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
