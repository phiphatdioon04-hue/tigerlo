export default function TopBar({ config, theme, onAction }) {
  const hasLogo = !!config.logo_url;
  const hasTitle = !!config.title;
  const hasButton = !!config.button_text;
  const buttonOnly = !hasLogo && !hasTitle && hasButton;

  // Button-only mode → float above iframe, no background bar
  if (buttonOnly) {
    return (
      <button
        onClick={() => onAction(config.button_action || 'iframe', config.button_url)}
        className="absolute z-20 right-3 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg active:scale-95 transition whitespace-nowrap"
        style={{
          top: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)',
          background: `linear-gradient(135deg, ${config.button_color || theme.primary_color || '#f59e0b'}, ${theme.button_color || '#d97706'})`,
          boxShadow: `0 8px 20px ${(config.button_color || theme.primary_color || '#f59e0b')}66, 0 0 0 1px rgba(255,255,255,0.1) inset`
        }}
      >
        {config.button_text}
      </button>
    );
  }

  // Full bar mode (with logo / title)
  return (
    <div
      className="flex items-center justify-between px-4 py-3 border-b border-white/5 safe-top"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {hasLogo ? (
          <img
            src={config.logo_url}
            alt=""
            className="h-9 w-auto max-w-[160px] object-contain"
          />
        ) : null}
        {hasTitle ? (
          <div className="text-white text-sm font-semibold tracking-wide truncate">
            {config.title}
          </div>
        ) : null}
      </div>
      {hasButton ? (
        <button
          onClick={() => onAction(config.button_action || 'iframe', config.button_url)}
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg active:scale-95 transition whitespace-nowrap"
          style={{
            background: `linear-gradient(135deg, ${config.button_color || theme.primary_color || '#f59e0b'}, ${theme.button_color || '#d97706'})`,
            boxShadow: `0 8px 20px ${(config.button_color || theme.primary_color || '#f59e0b')}55`
          }}
        >
          {config.button_text}
        </button>
      ) : null}
    </div>
  );
}
