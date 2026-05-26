export default function TopBar({ config, theme, onAction }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 border-b border-white/5 safe-top"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {config.logo_url ? (
          <img
            src={config.logo_url}
            alt=""
            className="h-9 w-auto max-w-[160px] object-contain"
          />
        ) : null}
        {config.title ? (
          <div className="text-white text-sm font-semibold tracking-wide truncate">
            {config.title}
          </div>
        ) : null}
      </div>
      {config.button_text ? (
        <button
          onClick={() => onAction(config.button_action || 'iframe', config.button_url)}
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg active:scale-95 transition whitespace-nowrap"
          style={{
            background: `linear-gradient(135deg, ${config.button_color || theme.primary_color || '#a855f7'}, ${theme.button_color || '#7c3aed'})`,
            boxShadow: `0 8px 20px ${(config.button_color || theme.primary_color || '#a855f7')}55`
          }}
        >
          {config.button_text}
        </button>
      ) : null}
    </div>
  );
}
