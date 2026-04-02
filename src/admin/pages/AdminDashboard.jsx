import { useState, useEffect } from 'react';
import {
  Users, Hammer, ShoppingBag, IndianRupee,
  TrendingUp, TrendingDown, Monitor, Smartphone, Tablet,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts';
import { getStats, getKarigars, getOrders } from '../../services/adminApi';
import { StatusBadge } from '../components/AdminUI';
import { Link } from 'react-router-dom';

/* ─── Card style ─────────────────────────────────────────────── */
const card = {
  background: 'white',
  border: '1px solid #E2E8F0',
  borderRadius: 20,
  boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
};

/* ─── Custom chart tooltip ───────────────────────────────────── */
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-xl text-xs font-semibold"
      style={{ background: '#1E293B', color: 'white', boxShadow: '0 8px 24px rgba(15,23,42,0.2)' }}>
      {label && <p className="mb-1 opacity-50">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
}

/* ─── Stat card ──────────────────────────────────────────────── */
function StatCard({ title, value, icon: Icon, gradient, growth, delay }) {
  const positive = growth >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 22 }}
      whileHover={{ y: -5, boxShadow: '0 20px 48px rgba(15,23,42,0.12)' }}
      className="relative overflow-hidden cursor-default select-none"
      style={{ ...card, minHeight: 148 }}
    >
      {/* Gradient top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: gradient }} />
      {/* Soft tint wash */}
      <div className="absolute inset-0 opacity-[0.03] rounded-2xl" style={{ background: gradient }} />
      {/* Decorative blob */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-[0.07]"
        style={{ background: gradient }} />

      <div className="relative p-6 flex flex-col justify-between" style={{ minHeight: 148 }}>
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: gradient, boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}>
            <Icon size={22} color="white" strokeWidth={1.8} />
          </div>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
            style={{
              background: positive ? '#F0FDF4' : '#FFF1F2',
              color: positive ? '#16A34A' : '#E11D48',
              border: `1px solid ${positive ? '#BBF7D0' : '#FECDD3'}`,
            }}>
            {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {positive ? '+' : ''}{growth}%
          </span>
        </div>
        <div>
          <p className="text-3xl font-extrabold text-slate-800 leading-none tracking-tight mb-1.5">{value}</p>
          <p className="text-sm font-semibold text-slate-400">{title}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── White card wrapper ─────────────────────────────────────── */
function Card({ children, className = '', style = {} }) {
  return (
    <div className={`overflow-hidden ${className}`} style={{ ...card, ...style }}>
      {children}
    </div>
  );
}

function CardHeader({ title, sub, action }) {
  return (
    <div className="px-6 py-5 flex items-center justify-between"
      style={{ borderBottom: '1px solid #F1F5F9' }}>
      <div>
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        {sub && <p className="text-xs mt-0.5 font-semibold text-indigo-400">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* ─── Static data ────────────────────────────────────────────── */
const trendData = [
  { month: 'Jan', orders: 12, revenue: 18 },
  { month: 'Feb', orders: 19, revenue: 27 },
  { month: 'Mar', orders: 15, revenue: 22 },
  { month: 'Apr', orders: 28, revenue: 41 },
  { month: 'May', orders: 24, revenue: 35 },
  { month: 'Jun', orders: 33, revenue: 52 },
  { month: 'Jul', orders: 41, revenue: 63 },
];

const categoryData = [
  { name: 'Pottery',   sales: 42 },
  { name: 'Textiles',  sales: 67 },
  { name: 'Jewellery', sales: 38 },
  { name: 'Paintings', sales: 55 },
  { name: 'Woodcraft', sales: 29 },
];

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'];

const deviceData = [
  { label: 'Desktop', pct: 58, icon: Monitor,    color: '#6366f1' },
  { label: 'Mobile',  pct: 32, icon: Smartphone,  color: '#8b5cf6' },
  { label: 'Tablet',  pct: 10, icon: Tablet,      color: '#10b981' },
];

/* ─── Main ───────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const [stats, setStats]       = useState({ totalUsers: 0, totalKarigars: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [karigars, setKarigars] = useState([]);
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([getStats(), getKarigars(), getOrders()])
      .then(([s, k, o]) => {
        setStats(s);
        setKarigars(Array.isArray(k) ? k : []);
        setOrders(Array.isArray(o) ? o : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pieData = [
    { name: 'Users',    value: stats.totalUsers    || 1 },
    { name: 'Karigars', value: stats.totalKarigars || 1 },
    { name: 'Products', value: stats.totalProducts || 1 },
    { name: 'Orders',   value: stats.totalOrders   || 1 },
  ];

  const statCards = [
    { title: 'Total Users',    value: stats.totalUsers.toLocaleString('en-IN'),      icon: Users,       gradient: 'linear-gradient(135deg,#6366f1,#4338ca)', growth: 12,  delay: 0    },
    { title: 'Total Karigars', value: stats.totalKarigars.toLocaleString('en-IN'),   icon: Hammer,      gradient: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', growth: 8,   delay: 0.07 },
    { title: 'Total Orders',   value: stats.totalOrders.toLocaleString('en-IN'),     icon: ShoppingBag, gradient: 'linear-gradient(135deg,#10b981,#059669)', growth: 23,  delay: 0.14 },
    { title: 'Total Revenue',  value: `₹${(stats.totalRevenue/1000).toFixed(1)}k`,   icon: IndianRupee, gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', growth: -3,  delay: 0.21 },
  ];

  const activityFeed = [
    ...orders.slice(0, 3).map(o => ({
      id: 'o_' + o._id,
      icon: '🛒',
      text: `Order #KH-${o._id?.slice(-4).toUpperCase()} placed by ${o.user?.name || 'Customer'}`,
      time: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '—',
      color: '#10b981',
    })),
    ...karigars.slice(0, 3).map(k => ({
      id: 'k_' + k._id,
      icon: '🧑🎨',
      text: `${k.name} registered as a karigar`,
      time: k.createdAt ? new Date(k.createdAt).toLocaleDateString('en-IN') : '—',
      color: '#6366f1',
    })),
  ].slice(0, 6);

  return (
    <div className="space-y-8">

      {/* ── Heading ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard</h2>
        <p className="text-sm mt-1.5 font-semibold text-indigo-400">
          Welcome back, ArtX — here's what's happening today
        </p>
      </motion.div>

      {/* ── Stat Cards ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl animate-pulse bg-slate-100" style={{ height: 148 }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statCards.map(c => <StatCard key={c.title} {...c} />)}
        </div>
      )}

      {/* ── Charts Row 1: Line + Donut ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="xl:col-span-2">
          <Card>
            <CardHeader title="Orders & Revenue Trend" sub="Monthly overview — last 7 months" />
            <div className="p-6">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#CBD5E1' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#94A3B8', paddingTop: 12 }} />
                  <Line type="monotone" dataKey="orders" name="Orders" stroke="#6366f1" strokeWidth={2.5}
                    dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#6366f1', strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="revenue" name="Revenue (₹k)" stroke="#8b5cf6" strokeWidth={2.5}
                    dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#8b5cf6', strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
          <Card>
            <CardHeader title="Platform Distribution" sub="Users · Karigars · Products · Orders" />
            <div className="p-6 flex flex-col items-center">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={72}
                    paddingAngle={3} dataKey="value" strokeWidth={0}
                    animationBegin={200} animationDuration={900}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip content={<ChartTip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full space-y-2 mt-2">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                      <span className="text-xs font-semibold text-slate-500">{d.name}</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: PIE_COLORS[i] }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ── Charts Row 2: Bar + Session/Device ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}
          className="xl:col-span-2">
          <Card>
            <CardHeader title="Sales by Category" sub="Top performing craft categories" />
            <div className="p-6">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={categoryData} barSize={36} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#CBD5E1' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="sales" name="Sales" radius={[8, 8, 0, 0]}
                    fill="url(#barGradLight)" animationBegin={300} animationDuration={900} />
                  <defs>
                    <linearGradient id="barGradLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex flex-col gap-4">

          {/* Session stats */}
          <Card>
            <CardHeader title="Session Stats" sub="Today's activity" />
            <div className="p-5 space-y-4">
              {[
                { label: 'Active Sessions', value: '142',    color: '#6366f1', pct: 72 },
                { label: 'Avg. Duration',   value: '4m 32s', color: '#8b5cf6', pct: 55 },
                { label: 'Bounce Rate',     value: '28%',    color: '#10b981', pct: 28 },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-500">{s.label}</span>
                    <span className="text-xs font-bold" style={{ color: s.color }}>{s.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${s.pct}%` }}
                      transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full" style={{ background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Device stats */}
          <Card>
            <CardHeader title="Device Breakdown" />
            <div className="p-5 space-y-3">
              {deviceData.map(d => (
                <div key={d.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${d.color}14` }}>
                    <d.icon size={15} style={{ color: d.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-500">{d.label}</span>
                      <span className="text-xs font-bold" style={{ color: d.color }}>{d.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${d.pct}%` }}
                        transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full" style={{ background: d.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ── Orders Table + Activity Feed ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className="xl:col-span-2">
          <Card>
            <CardHeader
              title="Recent Orders"
              sub={`${orders.length} total orders`}
              action={
                <Link to="/admin/orders"
                  className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  style={{ color: '#6366f1', background: '#EEF2FF' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#E0E7FF'}
                  onMouseLeave={e => e.currentTarget.style.background = '#EEF2FF'}>
                  View all →
                </Link>
              }
            />
            {orders.length === 0 ? (
              <p className="text-center py-12 text-sm font-medium text-slate-400">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                      {['Order ID', 'Buyer', 'Product', 'Amount', 'Status'].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 7).map((order, i) => (
                      <motion.tr key={order._id}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.04 }}
                        className="transition-colors cursor-default"
                        style={{ borderBottom: '1px solid #F8FAFC' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F8FAFF'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td className="px-6 py-4 font-mono text-xs font-bold text-indigo-500">
                          #KH-{order._id?.slice(-4).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">{order.user?.name || 'Customer'}</td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-400 max-w-[140px] truncate">
                          {order.products?.[0]?.product?.name || '—'}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-800">
                          ₹{(order.totalPrice || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={order.isDelivered ? 'Delivered' : order.isPaid ? 'Shipped' : 'Processing'} />
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card style={{ height: '100%' }}>
            <CardHeader title="Activity Feed" sub="Latest platform events"
              action={
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                  style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }}>
                  <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.6 }}
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Live
                </span>
              }
            />
            <div className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: 420 }}>
              {activityFeed.length === 0 ? (
                <p className="text-center py-10 text-sm text-slate-400">No activity yet</p>
              ) : (
                activityFeed.map((act, i) => (
                  <motion.div key={act.id}
                    initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.65 + i * 0.06, type: 'spring', stiffness: 260, damping: 24 }}
                    className="flex items-start gap-3 p-3 rounded-xl transition-colors cursor-default"
                    onMouseEnter={e => e.currentTarget.style.background = '#F8FAFF'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                        style={{ background: `${act.color}12`, border: `1px solid ${act.color}25` }}>
                        {act.icon}
                      </div>
                      {i < activityFeed.length - 1 && (
                        <div className="w-px flex-1 mt-1 bg-slate-100" style={{ minHeight: 12 }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pb-2">
                      <p className="text-xs font-semibold text-slate-700 leading-snug">{act.text}</p>
                      <p className="text-[10px] mt-1 font-semibold text-indigo-400">{act.time}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
