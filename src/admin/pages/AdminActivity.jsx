import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { getUsers, getKarigars, getOrders } from '../../services/adminApi';
import { PageHeader, EmptyState } from '../components/AdminUI';

const typeConfig = {
  order:   { label: 'Order',   bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE', dot: '#6366f1', icon: '🛒'   },
  karigar: { label: 'Karigar', bg: '#FFFBEB', color: '#B45309', border: '#FDE68A', dot: '#F59E0B', icon: '🧑🎨' },
  user:    { label: 'User',    bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0', dot: '#22C55E', icon: '👤'   },
};

export default function AdminActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([getUsers(), getKarigars(), getOrders()])
      .then(([users, karigars, orders]) => {
        const acts = [];

        (Array.isArray(users) ? users : []).forEach(u => {
          if (u.role !== 'admin') acts.push({
            id: 'u_' + u._id, type: 'user',
            message: `${u.name} registered as a buyer`,
            time: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—',
            ts: new Date(u.createdAt || 0).getTime(),
          });
        });

        (Array.isArray(karigars) ? karigars : []).forEach(k => {
          acts.push({
            id: 'k_' + k._id, type: 'karigar',
            message: `${k.name} registered as a karigar${k.category ? ` (${k.category})` : ''}`,
            time: k.createdAt ? new Date(k.createdAt).toLocaleDateString('en-IN') : '—',
            ts: new Date(k.createdAt || 0).getTime(),
          });
        });

        (Array.isArray(orders) ? orders : []).forEach(o => {
          acts.push({
            id: 'o_' + o._id, type: 'order',
            message: `Order #KH-${o._id?.slice(-4).toUpperCase()} placed by ${o.user?.name || 'Customer'} — ₹${(o.totalPrice || 0).toLocaleString('en-IN')}`,
            time: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '—',
            ts: new Date(o.createdAt || 0).getTime(),
          });
        });

        acts.sort((a, b) => b.ts - a.ts);
        setActivities(acts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Activity Feed" sub="Real-time registrations and orders" icon={Activity}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
          <motion.span animate={{ opacity: [1, 0.25, 1] }} transition={{ repeat: Infinity, duration: 1.6 }}
            className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-bold text-emerald-700">Live</span>
        </div>
      </PageHeader>

      {loading ? (
        <div className="space-y-3 max-w-2xl">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl animate-pulse bg-slate-200" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <EmptyState icon="📋" message="No activity yet" sub="Activity will appear as users register and place orders." />
      ) : (
        <div className="max-w-2xl">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-5 bottom-5 w-px bg-slate-200" />

            <div className="space-y-3">
              {activities.map((act, i) => {
                const cfg = typeConfig[act.type] || typeConfig.user;
                return (
                  <motion.div key={act.id}
                    initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03, type: 'spring', stiffness: 260, damping: 26 }}
                    className="relative flex items-start gap-4 pl-14">

                    {/* Icon */}
                    <div className="absolute left-0 w-10 h-10 rounded-2xl flex items-center justify-center text-base flex-shrink-0"
                      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                      {cfg.icon}
                    </div>

                    {/* Card */}
                    <div className="flex-1 rounded-2xl px-4 py-3 bg-white transition-colors"
                      style={{ border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(15,23,42,0.04)' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F8FAFF'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium text-slate-700 leading-snug flex-1">{act.message}</p>
                        <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap flex-shrink-0 mt-0.5">{act.time}</span>
                      </div>
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                          style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                          <span className="w-1 h-1 rounded-full" style={{ background: cfg.dot }} />
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
