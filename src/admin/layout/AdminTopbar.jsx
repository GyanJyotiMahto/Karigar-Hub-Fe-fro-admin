import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, ChevronDown, LogOut, Settings, User, Check } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth } from '../../context/AdminAuthContext';

const pageMeta = {
  '/admin':           { title: 'Dashboard',  sub: 'Overview of your platform'       },
  '/admin/users':     { title: 'Users',      sub: 'Manage registered users'         },
  '/admin/karigars':  { title: 'Karigars',   sub: 'Manage artisan accounts'         },
  '/admin/products':  { title: 'Products',   sub: 'Manage product listings'         },
  '/admin/orders':    { title: 'Orders',     sub: 'Track and manage orders'         },
  '/admin/reviews':   { title: 'Reviews',    sub: 'Manage ratings & reviews'        },
  '/admin/returns':   { title: 'Returns',    sub: 'Handle return & refund requests' },
  '/admin/activity':  { title: 'Activity',   sub: 'Real-time platform activity'     },
};

const notifications = [
  { id: 1, text: '2 new karigars pending approval', time: '5m ago',  unread: true,  icon: '🧑‍🎨' },
  { id: 2, text: 'Order #KH-7821 has been shipped', time: '12m ago', unread: true,  icon: '📦'   },
  { id: 3, text: 'New user registered from Mumbai',  time: '1h ago',  unread: false, icon: '👤'   },
  { id: 4, text: 'Revenue milestone: ₹42L reached',  time: '3h ago',  unread: false, icon: '🎉'   },
];

const dropVariants = {
  hidden:  { opacity: 0, y: 8, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 420, damping: 30 } },
  exit:    { opacity: 0, y: 6, scale: 0.97, transition: { duration: 0.15 } },
};

const dropStyle = {
  background: 'white',
  border: '1px solid #E2E8F0',
  boxShadow: '0 16px 48px rgba(15,23,42,0.12)',
  borderRadius: 16,
};

export default function AdminTopbar({ onMenuClick }) {
  const [dropOpen, setDropOpen]   = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs]       = useState(notifications);
  const { admin, logout }         = useAdminAuth();
  const navigate                  = useNavigate();
  const location                  = useLocation();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const page    = pageMeta[location.pathname] || { title: 'Admin', sub: '' };
  const unread  = notifs.filter(n => n.unread).length;
  const dropRef = useRef(null);
  const notifRef = useRef(null);

  const initials = admin?.name
    ? admin.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A';

  useEffect(() => {
    const h = e => {
      if (dropRef.current  && !dropRef.current.contains(e.target))  setDropOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 px-6 h-16"
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 1px 8px rgba(15,23,42,0.06)',
      }}>

      {/* Hamburger */}
      <button onClick={onMenuClick}
        className="lg:hidden flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
        style={{ background: '#F1F5F9' }}
        onMouseEnter={e => e.currentTarget.style.background = '#E2E8F0'}
        onMouseLeave={e => e.currentTarget.style.background = '#F1F5F9'}>
        <Menu size={18} style={{ color: '#475569' }} />
      </button>

      {/* Page title */}
      <div className="min-w-0 flex-shrink-0">
        <h1 className="font-bold text-slate-800 text-base leading-tight tracking-tight">{page.title}</h1>
        <p className="text-xs mt-0.5 font-semibold" style={{ color: '#6366f1' }}>{page.sub}</p>
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(v => !v); setDropOpen(false); }}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: '#F8FAFC', color: '#64748B' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
            onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}>
            <Bell size={17} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500"
                style={{ boxShadow: '0 0 0 2px white' }} />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div variants={dropVariants} initial="hidden" animate="visible" exit="exit"
                className="absolute right-0 top-full mt-2 w-80 overflow-hidden z-50"
                style={dropStyle}>
                <div className="px-4 py-3 flex items-center justify-between"
                  style={{ background: '#F8FAFF', borderBottom: '1px solid #E2E8F0' }}>
                  <div className="flex items-center gap-2">
                    <Bell size={13} style={{ color: '#6366f1' }} />
                    <span className="font-bold text-slate-800 text-sm">Notifications</span>
                    {unread > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white bg-indigo-500">{unread}</span>
                    )}
                  </div>
                  <button onClick={() => setNotifs(n => n.map(x => ({ ...x, unread: false })))}
                    className="flex items-center gap-1 text-xs font-bold"
                    style={{ color: '#6366f1' }}>
                    <Check size={10} /> Mark read
                  </button>
                </div>
                {notifs.map((n, i) => (
                  <motion.div key={n.id}
                    initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors"
                    style={{ borderBottom: '1px solid #F1F5F9', background: n.unread ? '#FAFBFF' : 'white' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F8FAFF'}
                    onMouseLeave={e => e.currentTarget.style.background = n.unread ? '#FAFBFF' : 'white'}>
                    <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 bg-slate-100">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-snug ${n.unread ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>{n.text}</p>
                      <p className="text-[10px] mt-0.5 font-semibold text-indigo-400">{n.time}</p>
                    </div>
                    {n.unread && <span className="w-2 h-2 rounded-full mt-1 flex-shrink-0 bg-indigo-500" />}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-5 bg-slate-200" />

        {/* Profile */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => { setDropOpen(v => !v); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl transition-all"
            style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
            onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 0 2px rgba(99,102,241,0.25)' }}>
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">{admin?.name || 'Admin'}</p>
              <p className="text-[10px] font-semibold" style={{ color: '#6366f1' }}>Super Admin</p>
            </div>
            <ChevronDown size={11} style={{ color: '#94A3B8' }}
              className={`transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {dropOpen && (
              <motion.div variants={dropVariants} initial="hidden" animate="visible" exit="exit"
                className="absolute right-0 top-full mt-2 w-52 overflow-hidden z-50"
                style={dropStyle}>
                <div className="px-4 py-3.5 flex items-center gap-3"
                  style={{ background: '#F8FAFF', borderBottom: '1px solid #E2E8F0' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{admin?.name || 'Admin'}</p>
                    <p className="text-[10px] font-semibold text-indigo-400">{admin?.email || ''}</p>
                  </div>
                </div>
                {[
                  { icon: User,     label: 'My Profile' },
                  { icon: Settings, label: 'Settings'   },
                ].map(({ icon: Icon, label }) => (
                  <button key={label} onClick={() => setDropOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors text-slate-600"
                    onMouseEnter={e => e.currentTarget.style.background = '#F8FAFF'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-indigo-50">
                      <Icon size={13} style={{ color: '#6366f1' }} />
                    </div>
                    {label}
                  </button>
                ))}
                <div style={{ borderTop: '1px solid #F1F5F9' }}>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors"
                    onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-50">
                      <LogOut size={13} className="text-red-400" />
                    </div>
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
