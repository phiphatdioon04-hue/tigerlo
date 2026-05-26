import { useState } from 'react';

export default function BottomSheet({ open, onClose, config, theme, onAction }) {
  const [phone, setPhone] = useState('');
  if (!config?.enabled) return null;

  const appendPhone = (url) => {
    if (!url || !phone) return url;
    try {
      const u = new URL(url);
      u.searchParams.set('phone', phone);
      return u.toString();
    } catch { return url; }
  };

  return (
    <>
      {open ? (
        <div
          className="absolute inset-0 z-30 bg-black/65 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
        />
      ) : null}
      {open ? (
        <div
          className="absolute left-0 right-0 bottom-0 z-40 px-5 pt-4 animate-slide-up"
          style={{
            background: 'linear-gradient(180deg, #16110a 0%, #0a0e1a 100%)',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            boxShadow: '0 -25px 60px rgba(245, 158, 11, 0.25)',
            borderTop: '1px solid rgba(245, 158, 11, 0.28)',
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2.5rem)'
          }}
        >
          <div className="w-12 h-1.5 rounded-full bg-white/15 mx-auto mb-4" />

          <div className="flex items-center gap-3 mb-5">
            {config.logo_url ? (
              <img
                src={config.logo_url}
                alt=""
                className="h-11 w-auto max-w-[180px] object-contain"
              />
            ) : null}
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold text-base truncate">{config.title || 'ยินดีต้อนรับ'}</div>
              {config.subtitle ? (
                <div className="text-white/60 text-xs mt-0.5 line-clamp-2">{config.subtitle}</div>
              ) : null}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 text-white text-base hover:bg-white/20 transition"
              aria-label="close"
            >×</button>
          </div>

          {config.phone_field_enabled ? (
            <div className="mb-3">
              <input
                type="tel"
                inputMode="numeric"
                placeholder="เบอร์โทรศัพท์"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-amber-400/60 transition"
              />
            </div>
          ) : null}

          {config.primary_text ? (
            <a
              href={appendPhone(config.primary_url) || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3.5 rounded-2xl text-white font-semibold mb-2.5 active:scale-[0.98] transition text-center"
              style={{
                background: `linear-gradient(135deg, ${theme.primary_color || '#f59e0b'}, ${theme.button_color || '#d97706'})`,
                boxShadow: `0 12px 32px ${(theme.primary_color || '#f59e0b')}66`
              }}
            >
              {config.primary_text}
            </a>
          ) : null}

          <div className="grid grid-cols-2 gap-2.5">
            {config.login_text ? (
              <a
                href={config.login_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-medium active:scale-[0.98] transition"
              >
                {config.login_text}
              </a>
            ) : null}
            {config.register_text ? (
              <a
                href={config.register_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3 rounded-2xl text-white text-sm font-medium active:scale-[0.98] transition"
                style={{
                  background: 'rgba(20, 184, 166, 0.18)',
                  border: '1px solid rgba(20, 184, 166, 0.45)'
                }}
              >
                {config.register_text}
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
