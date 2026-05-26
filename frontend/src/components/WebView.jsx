import { useEffect, useRef, useState } from 'react';

export default function WebView({ url, theme }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [key, setKey] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    setError(false);
    setKey((k) => k + 1);
    const timeout = setTimeout(() => setLoading(false), 9000);
    return () => clearTimeout(timeout);
  }, [url]);

  if (!url) {
    return (
      <div className="flex-1 flex items-center justify-center text-white/40 text-sm">
        ยังไม่ได้ตั้งค่า URL หลัก
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-hidden bg-black">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
          style={{ background: theme.bg_color || '#0b0118' }}>
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-white/15 border-t-fuchsia-400 animate-spin" />
            <div className="text-white/40 text-xs">กำลังโหลด...</div>
          </div>
        </div>
      ) : null}
      {error ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 px-6 text-center"
          style={{ background: theme.bg_color || '#0b0118' }}>
          <div className="text-3xl">⚠️</div>
          <div className="text-white/80 text-sm">ไม่สามารถโหลดเนื้อหาได้</div>
          <div className="text-white/40 text-xs">เว็บปลายทางอาจบล็อก iframe — ลองเปิดในเบราว์เซอร์</div>
          <button
            onClick={() => { setError(false); setLoading(true); setKey(k => k + 1); }}
            className="mt-2 px-4 py-2 rounded-full bg-white/10 text-white text-xs border border-white/15"
          >ลองใหม่</button>
        </div>
      ) : null}
      <iframe
        key={key}
        ref={ref}
        src={url}
        title="content"
        className="w-full h-full border-0 block"
        allow="clipboard-write; encrypted-media; geolocation; payment"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoading(false)}
        onError={() => { setLoading(false); setError(true); }}
      />
    </div>
  );
}
