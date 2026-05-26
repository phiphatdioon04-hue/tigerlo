export default function Loading({ label = 'กำลังโหลด...' }) {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1408 50%, #3d2a0a 100%)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-700 animate-pulse" />
          <div className="absolute inset-2 rounded-2xl bg-[#0a0e1a] flex items-center justify-center">
            <div className="w-7 h-7 rounded-full border-2 border-white/15 border-t-amber-400 animate-spin" />
          </div>
        </div>
        <div className="text-white/60 text-sm">{label}</div>
      </div>
    </div>
  );
}
