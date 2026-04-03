import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { adminLogin } from '../services/adminApi';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminLogin() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { login }             = useAdminAuth();
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await adminLogin(form);
      login(data);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#F8FAFC' }}>

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-10"
        style={{ background: 'linear-gradient(160deg, #4338ca 0%, #6366f1 50%, #8b5cf6 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-lg">K</div>
          <div>
            <p className="text-white font-bold text-sm">Karigar Hub</p>
            <p className="text-white/60 text-[10px] font-semibold tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>

        <div>
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-6">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white leading-tight mb-3">
            Manage your<br />platform with ease
          </h2>
          <p className="text-white/65 text-sm leading-relaxed">
            Monitor users, karigars, products, and orders — all from one secure dashboard.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3">
            {[
              { label: 'Users',    val: 'Manage' },
              { label: 'Karigars', val: 'Verify'  },
              { label: 'Orders',   val: 'Track'   },
              { label: 'Products', val: 'Control' },
            ].map(item => (
              <div key={item.label} className="px-4 py-3 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <p className="text-white font-bold text-sm">{item.val}</p>
                <p className="text-white/55 text-xs mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-xs">© {new Date().getFullYear()} Karigar Hub. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>K</div>
            <div>
              <p className="font-bold text-slate-800 text-sm">Karigar Hub</p>
              <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#6366f1' }}>Admin Panel</p>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-400 font-medium mb-8">Sign in to your admin account</p>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-xl text-sm font-medium text-red-600 flex items-center gap-2"
              style={{ background: '#FFF1F2', border: '1px solid #FECDD3' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@karigarhub.com" required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium focus:outline-none transition-all text-slate-800"
                  style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0' }}
                  onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" required
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm font-medium focus:outline-none transition-all text-slate-800"
                  style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0' }}
                  onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-60 mt-2"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}
              onMouseEnter={e => !loading && (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
