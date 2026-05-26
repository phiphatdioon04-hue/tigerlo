import { useEffect, useState, useCallback } from 'react';
import { publicGet } from './api.js';
import TopBar from './components/TopBar.jsx';
import WebView from './components/WebView.jsx';
import BottomSheet from './components/BottomSheet.jsx';
import FloatingButton from './components/FloatingButton.jsx';
import Loading from './components/Loading.jsx';

let deferredInstall = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstall = e;
  });
}
function triggerInstall() {
  if (deferredInstall) {
    deferredInstall.prompt();
    deferredInstall.userChoice.finally(() => { deferredInstall = null; });
  } else {
    alert('แอปนี้ติดตั้งได้จากเมนูเบราว์เซอร์ (Add to Home Screen)');
  }
}

export default function App() {
  const [config, setConfig] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [popupUrl, setPopupUrl] = useState(null);

  useEffect(() => {
    publicGet('ui-config').then((c) => {
      setConfig(c);
      setIframeUrl(c.main_url?.url || '');
      if (c.pwa?.site_name) document.title = c.pwa.site_name;
    }).catch(() => setConfig({}));
  }, []);

  useEffect(() => {
    if (!config?.bottom_sheet?.enabled || !config.bottom_sheet.auto_show) return;
    const shownKey = 'sheet_shown';
    if (config.bottom_sheet.show_once && sessionStorage.getItem(shownKey)) return;
    const t = setTimeout(() => {
      setSheetOpen(true);
      if (config.bottom_sheet.show_once) sessionStorage.setItem(shownKey, '1');
    }, config.bottom_sheet.delay_ms || 1500);
    return () => clearTimeout(t);
  }, [config]);

  const handleAction = useCallback((action, url) => {
    if (action === 'install') return triggerInstall();
    if (action === 'sheet') return setSheetOpen(true);
    if (!url) return;
    switch (action) {
      case 'newtab': window.open(url, '_blank', 'noopener'); break;
      case 'redirect': window.location.href = url; break;
      case 'popup': setPopupUrl(url); break;
      case 'iframe':
      default: setIframeUrl(url); setSheetOpen(false); break;
    }
  }, []);

  if (!config) return <Loading />;

  const theme = config.theme || {};
  const rounded = theme.rounded_frame ? Math.max(0, theme.border_radius || 0) : 0;

  return (
    <div
      className="min-h-[100dvh] w-full flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0b0118 0%, #16032b 50%, #2a0a4d 100%)' }}
    >
      <div
        className="relative w-full max-w-[430px] h-[100dvh] md:h-[92dvh] md:max-h-[920px] overflow-hidden md:my-4 flex flex-col"
        style={{
          background: theme.bg_color || '#0b0118',
          color: theme.text_color || '#fff',
          borderRadius: rounded,
          boxShadow: theme.shadow || '0 25px 70px rgba(168, 85, 247, 0.4)',
          border: rounded ? '1px solid rgba(168, 85, 247, 0.15)' : 'none',
          fontFamily: theme.font || undefined
        }}
      >
        {config.top_bar?.enabled ? (
          <TopBar config={config.top_bar} theme={theme} onAction={handleAction} />
        ) : null}

        <WebView url={iframeUrl} theme={theme} />

        {config.floating_button?.enabled ? (
          <FloatingButton config={config.floating_button} onAction={handleAction} />
        ) : null}

        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          config={config.bottom_sheet}
          theme={theme}
          onAction={handleAction}
        />

        {popupUrl ? (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm animate-fade-in p-4">
            <div className="relative w-full h-[82%] rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl">
              <button
                onClick={() => setPopupUrl(null)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/70 text-white text-lg border border-white/15"
              >×</button>
              <iframe src={popupUrl} title="popup" className="w-full h-full border-0" />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
