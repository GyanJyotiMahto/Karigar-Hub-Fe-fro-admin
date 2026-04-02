import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Hammer, Package,
  ShoppingBag, Activity, LogOut, Settings,
  Star, RotateCcw,
} from 'lucide-react';

const navItems = [
  { to: '/admin',          icon: LayoutDashboard, label: 'Dashboard', end: true  },
  { to: '/admin/users',    icon: Users,           label: 'Users',     badge: null },
  { to: '/admin/karigars', icon: Hammer,          label: 'Karigars',  badge: 2   },
  { to: '/admin/products', icon: Package,         label: 'Products',  badge: null },
  { to: '/admin/orders',   icon: ShoppingBag,     label: 'Orders',    badge: 5   },
  { to: '/admin/reviews',  icon: Star,            label: 'Reviews',   badge: null },
  { to: '/admin/returns',  icon: RotateCcw,       label: 'Returns',   badge: null },
  { to: '/admin/activity', icon: Activity,        label: 'Activity',  badge: null },
];

export default function AdminSidebar({ open, onClose }) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 lg:hidden"
            style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}
        style={{
          background: 'white',
          borderRight: '1px solid #E2E8F0',
          boxShadow: '4px 0 24px rgba(15,23,42,0.06)',
        }}
      >
        {/* Indigo top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />

        {/* ── Logo ── */}
        <div className="px-6 py-6 flex-shrink-0" style={{ borderBottom: '1px solid #F1F5F9' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
              }}>
              K
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm tracking-tight">Karigar Hub</p>
              <p className="text-[10px] font-bold tracking-[0.18em] mt-0.5" style={{ color: '#6366f1' }}>ADMIN PANEL</p>
            </div>
          </div>
        </div>

        {/* ── Admin profile ── */}
        <div className="px-4 py-4 flex-shrink-0" style={{ borderBottom: '1px solid #F1F5F9' }}>
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl"
            style={{ background: '#F8FAFF', border: '1px solid #E0E7FF' }}>
            <div className="relative flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80"
                alt="Admin"
                className="w-9 h-9 rounded-xl object-cover"
                style={{ boxShadow: '0 0 0 2px rgba(99,102,241,0.3)' }}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400"
                style={{ border: '2px solid white' }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800 truncate">ArtX Admin</p>
              <p className="text-[11px] truncate mt-0.5 font-medium" style={{ color: '#6366f1' }}>Super Admin</p>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto">
          <p className="px-3 mb-3 text-[10px] font-bold tracking-[0.2em] uppercase select-none text-slate-400">
            Main Menu
          </p>
          <div className="space-y-1">
            {navItems.map(({ to, icon: Icon, label, end, badge }) => (
              <NavLink key={to} to={to} end={end} onClick={onClose} className="block">
                {({ isActive }) => (
                  <motion.div
                    whileHover={{ x: isActive ? 0 : 3 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors duration-150"
                    style={isActive ? {
                      background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)',
                      border: '1px solid #C7D2FE',
                      color: '#4338CA',
                      fontWeight: 600,
                    } : {
                      color: '#64748B',
                      fontWeight: 500,
                      border: '1px solid transparent',
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeBar"
                        className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full"
                        style={{ background: 'linear-gradient(180deg, #6366f1, #8b5cf6)' }}
                      />
                    )}

                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={isActive
                        ? { background: '#E0E7FF' }
                        : { background: '#F8FAFC' }
                      }>
                      <Icon size={16}
                        style={isActive ? { color: '#6366f1' } : { color: '#94A3B8' }}
                      />
                    </div>

                    <span className="flex-1">{label}</span>

                    {badge && (
                      <span className="min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        {badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </NavLink>
            ))}
          </div>

          {/* Settings */}
          <div className="mt-6">
            <p className="px-3 mb-3 text-[10px] font-bold tracking-[0.2em] uppercase select-none text-slate-400">System</p>
            <NavLink to="/admin/settings" className="block">
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: 3, backgroundColor: '#F8FAFC' }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm"
                  style={{ color: isActive ? '#4338CA' : '#64748B', border: '1px solid transparent', fontWeight: 500 }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-50">
                    <Settings size={16} style={{ color: '#94A3B8' }} />
                  </div>
                  <span>Settings</span>
                </motion.div>
              )}
            </NavLink>
          </div>
        </nav>

        {/* ── Bottom stats + logout ── */}
        <div className="px-4 pb-6 pt-4 flex-shrink-0" style={{ borderTop: '1px solid #F1F5F9' }}>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Users',   val: '1.2k' },
              { label: 'Orders',  val: '8.6k' },
              { label: 'Revenue', val: '₹42L' },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center py-2.5 rounded-xl"
                style={{ background: '#F8FAFF', border: '1px solid #E0E7FF' }}>
                <p className="text-xs font-bold text-slate-700">{s.val}</p>
                <p className="text-[9px] mt-0.5 font-semibold" style={{ color: '#6366f1' }}>{s.label}</p>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ backgroundColor: '#FEF2F2' }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors"
            style={{ color: '#94A3B8' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-50">
              <LogOut size={15} style={{ color: '#F87171' }} />
            </div>
            <span className="font-medium text-slate-500">Sign out</span>
          </motion.button>
        </div>
      </aside>
    </>
  );
}
