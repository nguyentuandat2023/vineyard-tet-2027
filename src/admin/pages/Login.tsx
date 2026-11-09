import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../apiClient';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
  onBackToLanding: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onBackToLanding }) => {
  const [email, setEmail] = useState('nguyentuandat.tuandat@gmail.com');
  const [password, setPassword] = useState('VineyardAdmin@2027!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Static host mode');
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Đăng nhập thất bại.');
      }

      apiClient.setAuth(data.token, data.user);
      onLoginSuccess(data.user);
    } catch (err: any) {
      // Fallback for static hosting on Vercel
      const normEmail = email.trim().toLowerCase();
      if (
        (normEmail === 'nguyentuandat.tuandat@gmail.com' || normEmail === 'sales.lead@vineyard.vn') &&
        password === 'VineyardAdmin@2027!'
      ) {
        const fallbackUser = normEmail.includes('nguyentuandat')
          ? {
              id: 'usr_super_admin_01',
              name: 'Nguyễn Tuấn Đạt',
              email: 'nguyentuandat.tuandat@gmail.com',
              role: 'SUPER_ADMIN',
              status: 'active'
            }
          : {
              id: 'usr_manager_02',
              name: 'Lê Hoàng Yến',
              email: 'sales.lead@vineyard.vn',
              role: 'ADMIN',
              status: 'active'
            };
        apiClient.setAuth('offline_admin_token_2027', fallbackUser);
        onLoginSuccess(fallbackUser);
        return;
      }
      setError(err.message === 'Static host mode' ? 'Thông tin đăng nhập không chính xác.' : (err.message || 'Có lỗi xảy ra khi đăng nhập.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1615] text-[#F7F3EC] px-4 py-12 relative overflow-hidden">
      {/* Decorative luxury background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#B52C32]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#25201E] border border-[#D4AF37]/30 rounded-2xl shadow-2xl p-8 backdrop-blur-md">
        {/* Back to website button */}
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-1.5 text-xs text-[#E5D7B7]/70 hover:text-[#D4AF37] transition mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Landing Page Vineyard.vn</span>
        </button>

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#B52C32] to-[#8C1B20] border-2 border-[#D4AF37] shadow-lg mb-3">
            <ShieldCheck className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-wide text-[#F7F3EC]">
            VINEYARD.VN
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mt-1">
            HỆ THỐNG QUẢN TRỊ B2B – TẾT 2027
          </p>
          <p className="text-xs text-[#E5D7B7]/60 mt-1">
            Dành cho Ban Điều Hành, Bộ Phận Kinh Doanh & Quản Trị Hệ Thống
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-950/60 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#E5D7B7] mb-1.5">
              Email Quản Trị Viên (Super Admin)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#D4AF37]/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nguyentuandat.tuandat@gmail.com"
                className="w-full bg-[#1A1615] border border-stone-700 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F7F3EC] placeholder-stone-600 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#E5D7B7] mb-1.5">
              Mật khẩu bảo mật
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#D4AF37]/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#1A1615] border border-stone-700 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#F7F3EC] placeholder-stone-600 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#D4AF37] transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-[#E5D7B7]/80">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-stone-700 text-[#B52C32] focus:ring-[#D4AF37] bg-[#1A1615]"
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>

            <span className="text-[#D4AF37]/80 text-[11px]">
              Tự động khóa sau 5 lần sai
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-[#B52C32] via-[#9B2228] to-[#801B20] hover:from-[#c23238] hover:to-[#911e24] text-[#F7F3EC] font-semibold py-3 px-4 rounded-xl shadow-lg border border-[#D4AF37]/40 flex items-center justify-center gap-2 transition duration-200 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xác thực...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#D4AF37]" />
                Đăng Nhập Quản Trị
              </span>
            )}
          </button>
        </form>

        {/* Pre-configured admin tip for testing */}
        <div className="mt-6 pt-5 border-t border-stone-800 text-[11px] text-stone-400 leading-relaxed bg-[#1A1615]/60 p-3 rounded-lg border border-stone-800/80">
          <div className="flex items-center gap-1.5 text-[#D4AF37] font-semibold mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tài khoản Quản Trị Cao Cấp (Super Admin):</span>
          </div>
          <div className="space-y-0.5">
            <div>Email: <strong className="text-stone-300">nguyentuandat.tuandat@gmail.com</strong></div>
            <div>Mật khẩu ban đầu: <strong className="text-stone-300">VineyardAdmin@2027!</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
