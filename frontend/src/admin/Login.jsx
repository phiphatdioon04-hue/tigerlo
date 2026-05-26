import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api.js';

export default function AdminLogin() {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const { token } = await adminLogin(u, p);
      localStorage.setItem('admin_token', token);
      nav('/admin');
    } catch {
      setErr('username หรือ password ไม่ถูกต้อง');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-[#0b0118] via-[#16032b] to-[#2a0a4d] p-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-black/40 backdrop-blur-xl p-7 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-700 flex items-center justify-center text-white font-bold">N</div>
          <div>
            <div className="text-white text-xl font-bold leading-tight">Admin Panel</div>
            <div className="text-white/50 text-xs">เข้าสู่ระบบเพื่อจัดการ</div>
          </div>
        </div>
        <input
          value={u}
          onChange={(e) => setU(e.target.value)}
          placeholder="Username"
          autoComplete="username"
          className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-fuchsia-500/60 mb-3"
        />
        <input
          type="password"
          value={p}
          onChange={(e) => setP(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-fuchsia-500/60 mb-4"
        />
        {err ? <div className="text-rose-300 text-xs mb-3">{err}</div> : null}
        <button
          disabled={busy}
          className="w-full py-3 rounded-2xl text-white font-semibold bg-gradient-to-br from-fuchsia-500 to-violet-700 active:scale-[0.98] disabled:opacity-60 shadow-lg"
        >
          {busy ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
        <div className="text-white/40 text-xs text-center mt-4">Default: admin / admin123</div>
      </form>
    </div>
  );
}
