import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { adminLogin } from '../services/adminApi';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAdminAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7F1E8' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8"
        style={{ border: '1px solid rgba(232,213,176,0.6)' }}>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#C0522B] flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">क</div>
          <h1 className="text-2xl font-bold text-[#1A0A02]">Karigar Hub Admin</h1>
          <p className="text-sm text-[#9B7A52] mt-1">Sign in to the admin panel</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#1A0A02] mb-1.5">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B7A52]" />
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="admin@karigarhub.com" required
                className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#C0522B] transition-colors"
                style={{ borderColor: 'rgba(232,213,176,0.8)' }} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1A0A02] mb-1.5">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B7A52]" />
              <input type={showPass ? 'text' : 'password'} value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" required
                className="w-full pl-10 pr-12 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#C0522B] transition-colors"
                style={{ borderColor: 'rgba(232,213,176,0.8)' }} />
              <button type="button" onClick={() => setShowPass(p => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9B7A52] hover:text-[#C0522B]">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white transition-all disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #C0522B, #8B3A1A)' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-4 rounded-xl text-center text-xs text-[#9B7A52]"
          style={{ background: '#FDF6EC', border: '1px solid rgba(232,213,176,0.5)' }}>
          <p className="font-semibold text-[#1A0A02] mb-1">Admin Credentials</p>
          <p>Email: <span className="font-mono text-[#C0522B]">admin@karigarhub.com</span></p>
          <p>Password: <span className="font-mono text-[#C0522B]">Admin@123</span></p>
        </div>
      </motion.div>
    </div>
  );
}
