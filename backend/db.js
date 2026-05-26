import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'data.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS main_url (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    url TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS top_bar (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    enabled INTEGER DEFAULT 1,
    logo_url TEXT,
    title TEXT,
    button_text TEXT,
    button_url TEXT,
    button_color TEXT,
    button_action TEXT
  );

  CREATE TABLE IF NOT EXISTS bottom_sheet (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    enabled INTEGER DEFAULT 1,
    auto_show INTEGER DEFAULT 1,
    delay_ms INTEGER DEFAULT 1500,
    show_once INTEGER DEFAULT 1,
    logo_url TEXT,
    title TEXT,
    subtitle TEXT,
    login_text TEXT,
    login_url TEXT,
    register_text TEXT,
    register_url TEXT,
    primary_text TEXT,
    primary_url TEXT,
    phone_field_enabled INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS floating_button (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    enabled INTEGER DEFAULT 1,
    text TEXT,
    icon TEXT,
    url TEXT,
    action TEXT,
    position TEXT,
    color TEXT
  );

  CREATE TABLE IF NOT EXISTS theme (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    bg_color TEXT,
    primary_color TEXT,
    button_color TEXT,
    text_color TEXT,
    border_radius INTEGER,
    shadow TEXT,
    font TEXT,
    rounded_frame INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS pwa_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    site_name TEXT,
    short_name TEXT,
    favicon_url TEXT,
    app_icon_url TEXT,
    manifest_name TEXT,
    install_prompt_enabled INTEGER DEFAULT 1,
    splash_color TEXT
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    site_title TEXT,
    meta_description TEXT
  );
`);

export default db;

export function getRow(table) {
  return db.prepare(`SELECT * FROM ${table} WHERE id = 1`).get();
}

export function upsertRow(table, fields) {
  const clean = { ...fields };
  delete clean.id;
  const keys = Object.keys(clean);
  if (keys.length === 0) return getRow(table);
  const cols = keys.join(', ');
  const placeholders = keys.map(() => '?').join(', ');
  const updates = keys.map(k => `${k} = excluded.${k}`).join(', ');
  const values = keys.map(k => clean[k]);
  db.prepare(
    `INSERT INTO ${table} (id, ${cols}) VALUES (1, ${placeholders}) ` +
    `ON CONFLICT(id) DO UPDATE SET ${updates}`
  ).run(...values);
  return getRow(table);
}
