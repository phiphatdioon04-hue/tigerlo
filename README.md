# Neon App Wrapper — Mobile-First WebView PWA

PWA ที่ห่อเว็บใดก็ได้ให้กลายเป็นแอปมือถือ — ทุก URL, ปุ่ม, โลโก้, ธีม, popup แก้ได้จาก Admin Panel ไม่มี hardcode

**Stack:** React + Tailwind (Vite) / Node + Express / SQLite / JWT / PWA

```
websize/
├── backend/        Express + SQLite + JWT
│   ├── server.js
│   ├── db.js
│   ├── seed.js
│   └── middleware/auth.js
├── frontend/       React + Tailwind + PWA
│   ├── src/
│   │   ├── App.jsx              ← mobile app container
│   │   ├── components/          ← TopBar, WebView, BottomSheet, FloatingButton, Loading
│   │   └── admin/               ← Login + AdminApp dashboard
│   └── public/                  ← icon.svg, sw.js, manifest.webmanifest
└── README.md
```

---

## ติดตั้งและรัน (ครั้งแรก)

ต้องมี **Node.js 18+**

### 1) Backend

```powershell
cd D:\websize\backend
npm install
npm run seed       # สร้าง admin (admin / admin123) + seed ค่าเริ่มต้น
npm run dev        # เซิร์ฟเวอร์รันที่ http://localhost:3001
```

### 2) Frontend (เปิด terminal ใหม่)

```powershell
cd D:\websize\frontend
npm install
npm run dev        # เปิดที่ http://localhost:5173
```

- เว็บผู้ใช้: http://localhost:5173/
- Admin Login: http://localhost:5173/admin/login
- API: http://localhost:3001/api/...

Default admin: **admin / admin123** (เปลี่ยนได้ด้วยตัวแปร env `ADMIN_USERNAME`, `ADMIN_PASSWORD` ตอน seed)

---

## โปรดักชัน (build แล้วเสิร์ฟด้วย backend อย่างเดียว)

```powershell
cd D:\websize\frontend
npm run build      # สร้าง dist/
cd ..\backend
$env:JWT_SECRET="ใส่ secret ของจริง"
npm start          # backend จะเสิร์ฟ frontend/dist อัตโนมัติที่ http://localhost:3001
```

PWA ต้องใช้ HTTPS บนโดเมนจริง — ใช้ Nginx/Caddy/Cloudflare เป็น reverse proxy ไปที่ port 3001

---

## โครงสร้างฐานข้อมูล (SQLite)

| ตาราง | หน้าที่ |
|--------|---------|
| `admins` | บัญชี admin (username, password_hash) |
| `main_url` | URL หลักที่จะแสดงใน iframe |
| `top_bar` | logo, title, ปุ่ม, action |
| `bottom_sheet` | popup เด้ง: title, ปุ่ม login/register/primary, delay, show_once |
| `floating_button` | ปุ่มลอย: ข้อความ, ไอคอน, สี, ตำแหน่ง, action |
| `theme` | สี, border radius, shadow, font, rounded frame |
| `pwa_settings` | manifest name, app icon, splash color, install prompt |
| `settings` | site title, meta description |

ตารางทุกตัวยกเว้น `admins` เก็บแถวเดียว (`id = 1`) เพื่อใช้เป็น config singleton

---

## API

### Public (ไม่ต้อง auth)

| Method | Endpoint | คืนค่า |
|--------|----------|--------|
| GET | `/api/public/settings` | settings + pwa + theme |
| GET | `/api/public/main-url` | URL หลัก |
| GET | `/api/public/ui-config` | **ทุกอย่างที่ frontend ต้องใช้** |
| GET | `/manifest.webmanifest` | PWA manifest (สร้างแบบ dynamic จาก DB) |

### Admin (ต้องส่ง `Authorization: Bearer <token>`)

| Method | Endpoint |
|--------|----------|
| POST | `/api/admin/login` → คืน `{ token }` |
| GET / PUT | `/api/admin/main-url` |
| GET / PUT | `/api/admin/top-bar` |
| GET / PUT | `/api/admin/bottom-sheet` |
| GET / PUT | `/api/admin/floating-button` |
| GET / PUT | `/api/admin/theme` |
| GET / PUT | `/api/admin/pwa` |
| GET / PUT | `/api/admin/settings` |

---

## Action types (ใช้กับปุ่มทุกที่ Top Bar / Bottom Sheet / Floating Button)

| action | พฤติกรรม |
|---------|-----------|
| `iframe` | เปลี่ยน URL ของ iframe หลัก |
| `newtab` | เปิดในแท็บใหม่ |
| `redirect` | redirect ทั้งหน้า |
| `popup` | เปิดเป็น popup iframe ทับซ้อน |
| `install` | trigger PWA install prompt (Top Bar เท่านั้น) |
| `sheet` | เปิด Bottom Sheet |

---

## คุณสมบัติฝั่งผู้ใช้

- ✅ App container max-width 430px + จัดกลางบน desktop + safe-area iOS
- ✅ Top bar (logo, title, ปุ่ม) เปิด/ปิด/แก้ทั้งหมดได้จาก admin
- ✅ iframe เต็มพื้นที่ที่เหลือ + loading state + error state
- ✅ Bottom sheet slide-up + backdrop blur + ช่องเบอร์โทร (ออปชัน) + delay + show-once-per-session
- ✅ Floating button — ข้อความ/ไอคอน/สี/ตำแหน่ง/action แก้ได้
- ✅ Popup iframe overlay เมื่อ action = popup
- ✅ PWA — service worker + manifest dynamic + install prompt
- ✅ Dark purple / neon gradient theme — premium feel ทุก border โค้งมน

---

## ปรับเปลี่ยนค่า

1. เข้า http://localhost:5173/admin/login
2. login (admin / admin123)
3. เลือกแท็บที่ต้องการ → แก้ค่า → กด **บันทึก**
4. เปิด `/` ในแท็บใหม่เพื่อดูผล (อาจต้อง hard refresh)

---

## เปลี่ยน admin password

```powershell
cd D:\websize\backend
$env:ADMIN_USERNAME="newadmin"
$env:ADMIN_PASSWORD="strong-password"
# ลบ admin เดิมก่อน:
node -e "import('./db.js').then(m=>m.default.prepare('DELETE FROM admins').run())"
npm run seed
```

หรือใช้ DB tool เปิด `backend/data.db` แล้วแก้เอง (ต้อง bcrypt hash)

---

## Troubleshooting

**iframe โหลดเว็บปลายทางไม่ได้ / ถูก redirect / blank**
- เว็บปลายทางตั้ง `X-Frame-Options: DENY` หรือ `Content-Security-Policy: frame-ancestors` → ไม่สามารถบายพาสได้ ต้องใช้ปุ่ม "เปิดในเบราว์เซอร์" (action = `newtab`)

**Service Worker ไม่อัปเดต**
- เปลี่ยน `CACHE = 'neon-app-v1'` ใน [frontend/public/sw.js](frontend/public/sw.js) เป็น `v2`, `v3` ทุกครั้งที่ deploy

**ลืม admin password**
- ลบ `backend/data.db` แล้วรัน `npm run seed` ใหม่ (จะรีเซ็ตทุกอย่างกลับเป็นค่าเริ่มต้น)
