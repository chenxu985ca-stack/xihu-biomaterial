import { useState } from 'react';
import { LogIn, AlertCircle, Loader2, Shield } from 'lucide-react';
import { adminLogin } from '../lib/db';

/**
 * 管理后台登录页面
 * 使用 Supabase Auth 邮箱+密码登录
 */
export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('请输入邮箱和密码');
      return;
    }

    setLoading(true);
    const { data, error: loginError } = await adminLogin(email.trim(), password);

    if (loginError) {
      setError(loginError.message === 'Invalid login credentials'
        ? '邮箱或密码错误'
        : loginError.message || '登录失败，请稍后重试');
      setLoading(false);
      return;
    }

    if (data?.session) {
      onLoginSuccess();
    } else {
      setError('登录失败，请确认您有管理员权限');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-graphite-50 px-4">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-graphite-200 bg-white shadow-sm">
            <Shield size={24} className="text-graphite-700" />
          </div>
          <h1 className="font-heading text-xl font-bold tracking-precision text-graphite-900">
            西湖巴尔
          </h1>
          <p className="mt-1 text-sm text-graphite-400">内容管理系统</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-sm font-semibold text-graphite-700">管理员登录</h2>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
              <AlertCircle size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-graphite-500">
                邮箱
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm text-graphite-800 placeholder:text-graphite-300 focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire-400 transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-graphite-500">
                密码
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm text-graphite-800 placeholder:text-graphite-300 focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire-400 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={14} className="animate-spin" /> 登录中...</>
              ) : (
                <><LogIn size={14} /> 登录</>
              )}
            </button>
          </div>
        </form>

        {/* Back to site */}
        <div className="mt-4 text-center">
          <a href={import.meta.env.BASE_URL} className="text-xs text-graphite-400 hover:text-graphite-600 transition-colors">
            ← 返回网站首页
          </a>
        </div>
      </div>
    </div>
  );
}
