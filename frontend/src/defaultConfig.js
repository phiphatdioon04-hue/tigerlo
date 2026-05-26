// Fallback config used when backend API is unreachable (e.g. static-only deploy)
// Mirrors backend/seed.js defaults so the UI still looks alive.
export const DEFAULT_CONFIG = {
  main_url: {
    url: 'https://www.shakehandscreen.com/'
  },
  top_bar: {
    enabled: 1,
    logo_url: '/icon.svg',
    title: 'NEON APP',
    button_text: 'ติดตั้ง',
    button_url: '',
    button_color: '#a855f7',
    button_action: 'install'
  },
  bottom_sheet: {
    enabled: 1,
    auto_show: 1,
    delay_ms: 1500,
    show_once: 1,
    logo_url: '/icon.svg',
    title: 'ยินดีต้อนรับ',
    subtitle: 'เข้าสู่ระบบหรือสมัครสมาชิกเพื่อใช้งานทุกฟีเจอร์',
    login_text: 'เข้าสู่ระบบ',
    login_url: 'https://example.com/login',
    register_text: 'สมัครสมาชิก',
    register_url: 'https://example.com/register',
    primary_text: 'ต่อไป',
    primary_url: 'https://example.com/start',
    phone_field_enabled: 1
  },
  floating_button: {
    enabled: 1,
    text: 'สมัครเลย',
    icon: '🎁',
    url: 'https://example.com/promo',
    action: 'iframe',
    position: 'bottom-right',
    color: '#a855f7'
  },
  theme: {
    bg_color: '#0b0118',
    primary_color: '#a855f7',
    button_color: '#7c3aed',
    text_color: '#ffffff',
    border_radius: 28,
    shadow: '0 25px 70px rgba(168, 85, 247, 0.4)',
    font: 'Inter, system-ui, sans-serif',
    rounded_frame: 1
  },
  pwa: {
    site_name: 'Neon App',
    short_name: 'Neon',
    manifest_name: 'Neon App',
    splash_color: '#0b0118',
    install_prompt_enabled: 1
  },
  settings: {
    site_title: 'Neon App',
    meta_description: 'Mobile web app wrapper'
  }
};
