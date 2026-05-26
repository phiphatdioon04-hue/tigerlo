function shade(hex, amt) {
  try {
    const c = (hex || '#a855f7').replace('#', '');
    const n = parseInt(c.length === 3 ? c.split('').map(x => x + x).join('') : c, 16);
    let r = (n >> 16) + amt;
    let g = ((n >> 8) & 0xff) + amt;
    let b = (n & 0xff) + amt;
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  } catch { return hex; }
}

export default function FloatingButton({ config, onAction }) {
  if (!config?.enabled) return null;
  const pos = config.position || 'bottom-right';
  const posClass =
    pos === 'bottom-center' ? 'left-1/2 -translate-x-1/2 bottom-6'
    : pos === 'bottom-left' ? 'left-4 bottom-6'
    : 'right-4 bottom-6';

  const color = config.color || '#a855f7';

  return (
    <button
      onClick={() => onAction(config.action || 'iframe', config.url)}
      className={`absolute z-20 ${posClass} px-4 py-3 rounded-full text-white font-semibold text-sm flex items-center gap-2 active:scale-95 transition`}
      style={{
        background: `linear-gradient(135deg, ${color}, ${shade(color, -28)})`,
        boxShadow: `0 14px 32px ${color}77, 0 0 0 1px ${color}44 inset`
      }}
    >
      {config.icon ? <span className="text-base leading-none">{config.icon}</span> : null}
      <span>{config.text || ''}</span>
    </button>
  );
}
