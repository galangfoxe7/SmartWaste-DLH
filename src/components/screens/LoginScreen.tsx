import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Lock, Eye, EyeOff, ArrowRight, Info, HelpCircle } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [nip, setNip] = useState('19890412 201402 1 003');
  const [password, setPassword] = useState('surabaya2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 400);
  };

  const handleQuickDemo = () => {
    setNip('19890412 201402 1 003');
    setPassword('surabaya2026');
    onLoginSuccess();
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 overflow-y-auto px-5 py-6">
      {/* Top Branding */}
      <div>
        {/* DLH Badge & City Identity */}
        <div className="pt-2 text-center flex flex-col items-center">
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/15 border-2 border-white">
              <ShieldCheck className="w-9 h-9 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
              DLH
            </div>
          </div>

          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            SmartWaste Surabaya
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-[280px]">
            Sistem Cerdas Optimasi Rute & Armada Pengangkutan Sampah Dinas Lingkungan Hidup
          </p>
        </div>

        {/* Login Form Card */}
        <form onSubmit={handleSubmit} className="mt-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              NIP / ID Petugas Lapangan
            </label>
            <div className="relative flex items-center">
              <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                required
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="Contoh: 19890412 201402 1 003"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kata Sandi
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi dinas"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between mb-5">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 border-slate-300"
              />
              <span>Ingat perangkat ini</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-xs font-medium text-emerald-800 hover:text-emerald-900 underline underline-offset-2"
            >
              Lupa Sandi?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-900/15 transition cursor-pointer"
          >
            {isLoading ? (
              <span>Memverifikasi NIP...</span>
            ) : (
              <>
                <span>Masuk Petugas Lapangan</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="mt-4 bg-emerald-50/80 rounded-xl p-3 border border-emerald-200/80">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-emerald-900">Akses Pengujian Prototipe</p>
              <p className="text-emerald-700 text-[11px] mt-0.5">
                Gunakan kredensial pengemudi armada Truk Kompaktor A07 (Brip. Agus Santoso).
              </p>
              <button
                type="button"
                onClick={handleQuickDemo}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-900 transition shadow-xs"
              >
                <span>Masuk Instan (Demo Mode)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info & SDGs */}
      <div className="pt-6 pb-2 text-center text-slate-400 text-[11px]">
        <p className="font-medium text-slate-600">Pemerintah Kota Surabaya</p>
        <p className="mt-0.5">Dinas Lingkungan Hidup • ITATS 2026</p>
        <p className="text-[10px] text-slate-400 mt-1">Mendukung SDG 11 Kota Berkelanjutan & SDG 12 Konsumsi Bertanggung Jawab</p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Bantuan Akses Akun</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Untuk reset kata sandi petugas DLH, silakan hubungi <strong>Pusat Kendali Operasional DLH Surabaya (Command Center 112 / Ext. 304)</strong> atau supervisor seksi armada Anda.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
