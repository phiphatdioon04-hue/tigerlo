import { useEffect, useState } from 'react';

function isStandalone() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

function isIOS() {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Capture beforeinstallprompt globally (Android Chrome / Edge)
let savedPrompt = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    savedPrompt = e;
  });
  window.addEventListener('appinstalled', () => {
    savedPrompt = null;
    try { sessionStorage.setItem('install_banner_dismissed', '1'); } catch {}
  });
}

export default function InstallBanner({ logo, appName = 'TIGER' }) {
  const [visible, setVisible] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    try {
      if (sessionStorage.getItem('install_banner_dismissed')) return;
    } catch {}
    setVisible(true);
  }, []);

  const handleInstall = async () => {
    if (savedPrompt) {
      try {
        savedPrompt.prompt();
        const { outcome } = await savedPrompt.userChoice;
        if (outcome === 'accepted') setVisible(false);
      } catch {}
      savedPrompt = null;
    } else if (isIOS()) {
      setShowIOSGuide(true);
    } else {
      alert('เปิดเมนูเบราว์เซอร์ (⋮) → Add to Home Screen / ติดตั้งแอป');
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    try { sessionStorage.setItem('install_banner_dismissed', '1'); } catch {}
  };

  if (!visible && !showIOSGuide) return null;

  return (
    <>
      {visible ? (
        <div
          className="absolute top-0 left-0 right-0 z-20 px-3 py-2 flex items-center gap-2.5 animate-fade-in"
          style={{
            paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.5rem)',
            background: 'linear-gradient(180deg, rgba(10,14,26,0.96) 0%, rgba(10,14,26,0.86) 100%)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(245,158,11,0.35)'
          }}
        >
          {logo ? (
            <img src={logo} alt="" className="h-7 w-auto max-w-[80px] object-contain shrink-0" />
          ) : null}
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-semibold leading-tight">ติดตั้ง {appName} เป็นแอป</div>
            <div className="text-white/55 text-[10px] leading-tight mt-0.5">เปิดเร็วขึ้น เหมือนแอปจริง</div>
          </div>
          <button
            onClick={handleInstall}
            className="px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow-lg active:scale-95 transition shrink-0"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              boxShadow: '0 6px 16px rgba(245,158,11,0.45)'
            }}
          >
            ติดตั้ง
          </button>
          <button
            onClick={handleDismiss}
            aria-label="close"
            className="w-7 h-7 rounded-full bg-white/10 text-white text-sm hover:bg-white/20 transition shrink-0"
          >×</button>
        </div>
      ) : null}

      {showIOSGuide ? (
        <div
          className="absolute inset-0 z-[60] bg-black/80 flex items-end justify-center p-4 animate-fade-in"
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="rounded-3xl p-5 w-full max-w-sm border mb-10"
            style={{
              background: 'linear-gradient(180deg, #1a1408 0%, #0a0e1a 100%)',
              borderColor: 'rgba(245,158,11,0.35)',
              boxShadow: '0 -25px 60px rgba(245,158,11,0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-white font-bold text-base">เพิ่ม {appName} ลงหน้าจอ</div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-7 h-7 rounded-full bg-white/10 text-white text-sm"
                aria-label="close"
              >×</button>
            </div>
            <ol className="text-white/85 text-sm space-y-3 pl-0 list-none">
              <li className="flex gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0">1</span>
                <span>กดไอคอน <b>แชร์</b> <span className="inline-block px-1.5 py-0.5 rounded bg-white/10 text-white">⬆️</span> ที่ด้านล่างของ Safari</span>
              </li>
              <li className="flex gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0">2</span>
                <span>เลื่อนหา <b>"Add to Home Screen"</b> หรือ <b>"เพิ่มไปยังหน้าจอโฮม"</b></span>
              </li>
              <li className="flex gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0">3</span>
                <span>กด <b>Add</b> ที่มุมขวาบน</span>
              </li>
            </ol>
            <div className="mt-4 text-amber-300/80 text-xs">
              ✨ เปิดจากหน้า Home — เร็วกว่า ไม่มี toolbar แบบเปิดในเบราว์เซอร์
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
