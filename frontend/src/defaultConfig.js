// Fallback config used when backend API is unreachable (e.g. static-only deploy)
// Mirrors backend/seed.js defaults so the UI still looks alive.
export const DEFAULT_CONFIG = {
  main_url: {
    url: 'https://www.shakehandscreen.com/'
  },
  top_bar: {
    enabled: 1,
    logo_url: '/logo.webp',
    title: '',
    button_text: 'เข้าสู่ระบบ',
    button_url: '',
    button_color: '#14b8a6',
    button_action: 'sheet'
  },
  bottom_sheet: {
    enabled: 1,
    auto_show: 1,
    delay_ms: 1500,
    show_once: 1,
    logo_url: '/logo.webp',
    title: 'ยินดีต้อนรับสู่ TIGER',
    subtitle: 'เข้าสู่ระบบหรือสมัครสมาชิกเพื่อรับโบนัสต้อนรับ',
    login_text: 'เข้าสู่ระบบ',
    login_url: 'https://example.com/login',
    register_text: 'สมัครสมาชิก',
    register_url: 'https://example.com/register',
    primary_text: 'รับโบนัสเลย',
    primary_url: 'https://example.com/bonus',
    phone_field_enabled: 1
  },
  floating_button: {
    enabled: 1,
    text: 'สมัครรับโบนัส',
    icon: '🎁',
    url: 'https://example.com/promo',
    action: 'iframe',
    position: 'bottom-right',
    color: '#f59e0b'
  },
  theme: {
    bg_color: '#0a0e1a',
    primary_color: '#f59e0b',
    button_color: '#14b8a6',
    text_color: '#ffffff',
    border_radius: 28,
    shadow: '0 25px 70px rgba(245, 158, 11, 0.28)',
    font: 'Inter, system-ui, sans-serif',
    rounded_frame: 1
  },
  pwa: {
    site_name: 'TIGER',
    short_name: 'TIGER',
    manifest_name: 'TIGER',
    splash_color: '#0a0e1a',
    install_prompt_enabled: 1
  },
  settings: {
    site_title: 'TIGER',
    meta_description: 'Mobile web app'
  }
};
