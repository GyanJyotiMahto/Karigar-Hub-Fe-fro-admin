import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { getOrders } from '../../services/adminApi';
import {
  StatusBadge, TableCard, Th, Tr, Td,
  EmptyState, FilterTabs, PageHeader, SkeletonRow,
} from '../components/AdminUI';

const tabs = [
  { value: 'all',       label: 'All'       },
  { value: 'pending',   label: 'Pending'   },
  { value: 'shipped',   label: 'Shipped'   },
  { value: 'delivered', label: 'Delivered' },
];

export default function AdminOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    getOrders()
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getStatus = o => o.isDelivered ? 'delivered' : o.isPaid ? 'shipped' : 'pending';

  const tabsWithCount = tabs.map(t => ({
    ...t,
    count: t.value === 'all' ? orders.length : orders.filter(o => getStatus(o) === t.value).length,
  }));

  const filtered = useMemo(() =>
    filter === 'all' ? orders : orders.filter(o => getStatus(o) === filter),
    [orders, filter]
  );

  const revenue = orders.filter(o => o.isDelivered).reduce((s, o) => s + (o.totalPrice || 0), 0);

  const statPills = [
    { label: 'Total Orders',     value: orders.length,                                          color: '#6366f1', bg: '#EEF2FF', border: '#C7D2FE' },
    { label: 'Pending',          value: orders.filter(o => getStatus(o) === 'pending').length,  color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
    { label: 'Shipped',          value: orders.filter(o => getStatus(o) === 'shipped').length,  color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
    { label: 'Delivered',        value: orders.filter(o => getStatus(o) === 'delivered').length,color: '#15803D', bg: '#F0FDF4', border: '#BBF7D0' },
    { label: 'Revenue',          value: `₹${(revenue / 1000).toFixed(1)}k`,                    color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" sub={`${orders.length} total orders`} icon={ShoppingBag} />

      {/* Stat pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statPills.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col items-center py-4 px-3 rounded-2xl text-center"
            style={{ background: s.bg, border: `1px solid ${s.border}` }}>
            <p className="text-xl font-extrabold leading-none" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[11px] font-semibold mt-1.5 text-slate-500">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <FilterTabs tabs={tabsWithCount} active={filter} onChange={setFilter} />

      <TableCard>
        <thead>
          <tr>
            <Th>Order ID</Th>
            <Th>Customer</Th>
            <Th>Product</Th>
            <Th>Amount</Th>
            <Th>Date</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            [...Array(5)].map((_, i) => <SkeletonRow key={i} cols={6} />)
          ) : filtered.length === 0 ? (
            <tr>
              <td colSpan={6}>
                <EmptyState icon="🛒" message="No orders found" sub="Try a different filter" />
              </td>
            </tr>
          ) : filtered.map((order, i) => (
            <Tr key={order._id}>
              <Td>
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="font-mono text-xs font-bold" style={{ color: '#6366f1' }}>
                  #KH-{order._id?.slice(-4).toUpperCase()}
                </motion.span>
              </Td>
              <Td className="font-semibold text-slate-800 whitespace-nowrap">{order.user?.name || 'Customer'}</Td>
              <Td className="text-slate-500 text-sm max-w-[160px] truncate">
                {order.products?.[0]?.product?.name || '—'}
              </Td>
              <Td className="font-bold text-slate-800 whitespace-nowrap">
                ₹{(order.totalPrice || 0).toLocaleString('en-IN')}
              </Td>
              <Td className="text-slate-400 text-xs whitespace-nowrap">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—'}
              </Td>
              <Td>
                <StatusBadge status={order.isDelivered ? 'Delivered' : order.isPaid ? 'Shipped' : 'Processing'} />
              </Td>
            </Tr>
          ))}
        </tbody>
      </TableCard>
    </div>
  );
}
