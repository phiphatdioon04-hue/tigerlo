import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminGet, adminPut } from '../api.js';

const SECTIONS = [
  { id: 'main-url', label: 'Main URL', icon: '🌐' },
  { id: 'top-bar', label: 'Top Bar', icon: '⬆️' },
  { id: 'bottom-sheet', label: 'Bottom Sheet', icon: '⬇️' },
  { id: 'floating-button', label: 'Floating Button', icon: '🎯' },
  { id: 'theme', label: 'Theme', icon: '🎨' },
  { id: 'pwa', label: 'PWA / SEO', icon: '📱' },
  { id: 'settings', label: 'Settings', icon: '⚙️' }
];

const FIELD_HINTS = {
  enabled: { type: 'bool', label: 'เปิดใช้งาน' },
  auto_show: { type: 'bool', label: 'แสดงอัตโนมัติ' },
  show_once: { type: 'bool', label: 'แสดงครั้งเดียวต่อ session' },
  phone_field_enabled: { type: 'bool', label: 'เปิดช่องเบอร์โทร' },
  rounded_frame: { type: 'bool', label: 'กรอบโค้งมน (App Frame)' },
  install_prompt_enabled: { type: 'bool', label: 'เปิด install prompt' },
  delay_ms: { type: 'number', label: 'Delay ก่อนแสดง (ms)' },
  border_radius: { type: 'number', label: 'Border Radius (px)' },
  button_action: { type: 'select', label: 'Action ปุ่ม', options: ['iframe', 'newtab', 'redirect', 'popup', 'install', 'sheet'] },
  action: { type: 'select', label: 'Action', options: ['iframe', 'newtab', 'redirect', 'popup'] },
  position: { type: 'select', label: 'ตำแหน่ง', options: ['bottom-right', 'bottom-center', 'bottom-left'] },
  bg_color: { type: 'color', label: 'สีพื้นหลัง' },
  primary_color: { type: 'color', label: 'สีหลัก (Primary)' },
  button_color: { type: 'color', label: 'สีปุ่ม' },
  text_color: { type: 'color', label: 'สีข้อความ' },
  color: { type: 'color', label: 'สี' },
  splash_color: { type: 'color', label: 'Splash Color' },
  url: { type: 'url', label: 'URL' },
  logo_url: { type: 'url', label: 'Logo URL' },
  button_url: { type: 'url', label: 'Button URL' },
  login_url: { type: 'url', label: 'Login URL' },
  register_url: { type: 'url', label: 'Register URL' },
  primary_url: { type: 'url', label: 'Primary URL' },
  favicon_url: { type: 'url', label: 'Favicon URL' },
  app_icon_url: { type: 'url', label: 'App Icon URL' },
  meta_description: { type: 'textarea', label: 'Meta Description' },
  subtitle: { type: 'textarea', label: 'Subtitle' },
  shadow: { type: 'text', label: 'Shadow (CSS)' },
  font: { type: 'text', label: 'Font Family' },
  icon: { type: 'text', label: 'Icon / Emoji' }
};

const LABELS = {
  title: 'หัวเรื่อง',
  button_text: 'ข้อความปุ่ม',
  text: 'ข้อความ',
  login_text: 'ข้อความ Login',
  register_text: 'ข้อความ Register',
  primary_text: 'ข้อความปุ่มหลัก',
  site_name: 'ชื่อเว็บ',
  short_name: 'Short Name',
  manifest_name: 'Manifest Name',
  site_title: 'Site Title'
};

export default function AdminApp() {
  const nav = useNavigate();
  const [active, setActive] = useState('main-url');
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) nav('/admin/login');
  }, [nav]);

  useEffect(() => {
    setDraft(null);
    adminGet(active)
      .then((d) => setDraft(d || {}))
      .catch((err) => {
        if (String(err.message).includes('Unauthorized')) {
          localStorage.removeItem('admin_token');
          nav('/admin/login');
        }
      });
  }, [active, nav]);

  const updateField = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const saved = await adminPut(active, draft);
      setDraft(saved);
      setSavedAt(Date.now());
    } catch (err) {
      alert('บันทึกไม่สำเร็จ: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    nav('/admin/login');
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#0b0118] via-[#16032b] to-[#1a0533] text-white">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-700 flex items-center justify-center font-bold">N</div>
            <div>
              <div className="text-xl font-bold leading-tight">Admin Panel</div>
              <div className="text-white/50 text-xs">จัดการ App Wrapper</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener" className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition">
              👁️ Preview
            </a>
            <button onClick={logout} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition">
              Logout
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-[240px_1fr] gap-4">
          <nav className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar md:overflow-visible">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`px-4 py-2.5 rounded-2xl text-sm text-left whitespace-nowrap border transition flex items-center gap-2 ${
                  active === s.id
                    ? 'bg-gradient-to-r from-fuchsia-500/25 to-violet-700/25 border-fuchsia-500/50 text-white shadow-lg'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </nav>

          <div className="bg-black/40 backdrop-blur border border-white/10 rounded-3xl p-5 md:p-6">
            {!draft ? (
              <div className="text-white/40 py-8 text-center">กำลังโหลด...</div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.keys(draft)
                    .filter((k) => k !== 'id')
                    .map((key) => (
                      <Field key={key} k={key} v={draft[key]} onChange={(v) => updateField(key, v)} />
                    ))}
                </div>
                <div className="flex items-center gap-3 mt-7 pt-5 border-t border-white/10">
                  <button
                    onClick={save}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-2xl text-white font-semibold bg-gradient-to-br from-fuchsia-500 to-violet-700 disabled:opacity-60 shadow-lg active:scale-[0.98]"
                  >
                    {saving ? 'กำลังบันทึก...' : '💾 บันทึก'}
                  </button>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener"
                    className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition"
                  >
                    👁️ Preview
                  </a>
                  {savedAt && Date.now() - savedAt < 3000 ? (
                    <div className="text-emerald-300 text-sm">✓ บันทึกแล้ว</div>
                  ) : null}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ k, v, onChange }) {
  const hint = FIELD_HINTS[k] || guessType(k, v);
  const label = hint.label || LABELS[k] || k.replace(/_/g, ' ');
  const fullSpan =
    hint.type === 'textarea' ||
    hint.type === 'url' ||
    k === 'shadow' ||
    k === 'meta_description';

  const wrap = (children) => (
    <div className={fullSpan ? 'sm:col-span-2' : ''}>
      <div className="text-xs text-white/55 mb-1.5 font-medium">{label}</div>
      {children}
    </div>
  );

  if (hint.type === 'bool') {
    return (
      <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/[0.07] transition">
        <span className="text-sm text-white/80">{label}</span>
        <div className="relative inline-block w-11 h-6">
          <input
            type="checkbox"
            checked={!!v}
            onChange={(e) => onChange(e.target.checked ? 1 : 0)}
            className="peer absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="absolute inset-0 rounded-full bg-white/10 peer-checked:bg-gradient-to-r peer-checked:from-fuchsia-500 peer-checked:to-violet-600 transition" />
          <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white peer-checked:translate-x-5 transition" />
        </div>
      </label>
    );
  }

  if (hint.type === 'select') {
    return wrap(
      <select
        value={v || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-fuchsia-500/60"
      >
        <option value="">—</option>
        {hint.options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    );
  }

  if (hint.type === 'color') {
    return wrap(
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={v || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-11 rounded-xl bg-transparent border border-white/10 cursor-pointer"
        />
        <input
          value={v || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#a855f7"
          className="flex-1 px-3 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white outline-none text-sm focus:border-fuchsia-500/60"
        />
      </div>
    );
  }

  if (hint.type === 'number') {
    return wrap(
      <input
        type="number"
        value={v ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        className="w-full px-3 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-fuchsia-500/60"
      />
    );
  }

  if (hint.type === 'textarea') {
    return wrap(
      <textarea
        value={v ?? ''}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full px-3 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white outline-none resize-none focus:border-fuchsia-500/60"
      />
    );
  }

  return wrap(
    <input
      value={v ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={hint.type === 'url' ? 'https://...' : ''}
      className="w-full px-3 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-fuchsia-500/60"
    />
  );
}

function guessType(key, v) {
  if (typeof v === 'number' && (key.endsWith('_ms') || key.includes('radius'))) return { type: 'number' };
  if (key.endsWith('_color') || key === 'color') return { type: 'color' };
  if (key.endsWith('_url') || key === 'url') return { type: 'url' };
  return { type: 'text' };
}
