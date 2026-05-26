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
          className="absolute left-0 right-0 bottom-0 z-40 px-5 pt-4 pb-7 animate-slide-up safe-bottom"
          style={{
            background: 'linear-gradient(180deg, #1a0530 0%, #0b0118 100%)',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            boxShadow: '0 -25px 60px rgba(168, 85, 247, 0.35)',
            borderTop: '1px solid rgba(168, 85, 247, 0.25)'
          }}
        >
          <div className="w-12 h-1.5 rounded-full bg-white/15 mx-auto mb-4" />

          <div className="flex items-center gap-3 mb-5">
            {config.logo_url ? (
              <img src={config.logo_url} alt="" className="w-11 h-11 rounded-2xl shadow-lg" />
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
                className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-fuchsia-500/60 transition"
              />
            </div>
          ) : null}

          {config.primary_text ? (
            <button
              onClick={() => onAction('iframe', appendPhone(config.primary_url))}
              className="w-full py-3.5 rounded-2xl text-white font-semibold mb-2.5 active:scale-[0.98] transition"
              style={{
                background: `linear-gradient(135deg, ${theme.primary_color || '#a855f7'}, ${theme.button_color || '#7c3aed'})`,
                boxShadow: `0 12px 32px ${(theme.primary_color || '#a855f7')}66`
              }}
            >
              {config.primary_text}
            </button>
          ) : null}

          <div className="grid grid-cols-2 gap-2.5">
            {config.login_text ? (
              <button
                onClick={() => onAction('iframe', config.login_url)}
                className="py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-medium active:scale-[0.98] transition"
              >
                {config.login_text}
              </button>
            ) : null}
            {config.register_text ? (
              <button
                onClick={() => onAction('iframe', config.register_url)}
                className="py-3 rounded-2xl text-white text-sm font-medium active:scale-[0.98] transition"
                style={{
                  background: 'rgba(168, 85, 247, 0.18)',
                  border: '1px solid rgba(168, 85, 247, 0.45)'
                }}
              >
                {config.register_text}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
