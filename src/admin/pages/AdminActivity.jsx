import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUsers, getKarigars, getOrders } from '../../services/adminApi';
import { PageHeader } from '../components/AdminUI';

const typeConfig = {
  order:   { label: 'Order',   bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0', line: '#22C55E', icon: '🛒' },
  karigar: { label: 'Karigar', bg: '#FFFBEB', color: '#B45309', border: '#FDE68A', line: '#F59E0B', icon: '🧑‍🎨' },
  user:    { label: 'User',    bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE', line: '#3B82F6', icon: '👤' },
};

export default function AdminActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getUsers(), getKarigars(), getOrders()])
      .then(([users, karigars, orders]) => {
        const acts = [];

        // User registrations
        (Array.isArray(users) ? users : []).forEach(u => {
          if (u.role !== 'admin') {
            acts.push({
              id: 'u_' + u._id,
              type: 'user',
              message: `${u.name} registered as a buyer`,
              time: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—',
              ts: new Date(u.createdAt || 0).getTime(),
            });
          }
        });

        // Karigar registrations
        (Array.isArray(karigars) ? karigars : []).forEach(k => {
          acts.push({
            id: 'k_' + k._id,
            type: 'karigar',
            message: `${k.name} registered as a karigar (${k.category || 'Craft'})`,
            time: k.createdAt ? new Date(k.createdAt).toLocaleDateString('en-IN') : '—',
            ts: new Date(k.createdAt || 0).getTime(),
          });
        });

        // Orders
        (Array.isArray(orders) ? orders : []).forEach(o => {
          acts.push({
            id: 'o_' + o._id,
            type: 'order',
            message: `Order #KH-${o._id?.slice(-4).toUpperCase()} placed by ${o.user?.name || 'Customer'} — ₹${(o.totalPrice || 0).toLocaleString('en-IN')}`,
            time: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '—',
            ts: new Date(o.createdAt || 0).getTime(),
          });
        });

        // Sort newest first
        acts.sort((a, b) => b.ts - a.ts);
        setActivities(acts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Activity Feed" sub="Real registrations and orders from the platform">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
          <motion.span animate={{ opacity: [1, 0.25, 1] }} transition={{ repeat: Infinity, duration: 1.6 }}
            className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs font-bold text-green-700">Live</span>
        </div>
      </PageHeader>

      {loading ? (
        <div className="space-y-3 max-w-2xl">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: 'rgba(232,213,176,0.4)' }} />)}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📋</p>
          <p className="font-semibold text-[#1A0A02]">No activity yet</p>
          <p className="text-sm mt-1" style={{ color: '#9B7A52' }}>Activity will appear as users register and place orders.</p>
        </div>
      ) : (
        <div className="max-w-2xl">
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(180deg, rgba(192,82,43,0.25) 0%, rgba(232,213,176,0.15) 100%)' }} />
            <div className="space-y-5">
              {activities.map((act, i) => {
                const cfg = typeConfig[act.type] || typeConfig.user;
                return (
                  <motion.div key={act.id}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, type: 'spring', stiffness: 240, damping: 24 }}
                    className="relative flex items-start gap-4 pl-14">
                    <div className="absolute left-0 w-10 h-10 rounded-2xl flex items-center justify-center text-base flex-shrink-0"
                      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, boxShadow: `0 2px 12px ${cfg.line}22` }}>
                      {cfg.icon}
                    </div>
                    <motion.div whileHover={{ x: 4 }}
                      className="flex-1 rounded-2xl px-4 py-3.5"
                      style={{ background: 'white', border: '1px solid rgba(232,213,176,0.35)', boxShadow: '0 2px 0 rgba(232,213,176,0.35)' }}>
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium text-[#1A0A02] leading-snug flex-1">{act.message}</p>
                        <span className="text-[10px] font-semibold whitespace-nowrap flex-shrink-0 mt-0.5" style={{ color: '#B8956A' }}>{act.time}</span>
                      </div>
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                          style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                          <span className="w-1 h-1 rounded-full" style={{ background: cfg.line }} />
                          {cfg.label}
                        </span>
                      </div>
                    </motion.div>
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
