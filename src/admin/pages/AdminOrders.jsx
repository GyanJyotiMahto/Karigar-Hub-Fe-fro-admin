import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getOrders } from '../../services/adminApi';
import { StatusBadge, TableCard, Th, Tr, Td, EmptyState, FilterTabs, PageHeader } from '../components/AdminUI';

const tabs = [
  { value: 'all',       label: 'All'       },
  { value: 'pending',   label: 'Pending'   },
  { value: 'delivered', label: 'Delivered' },
];

const metrics = [
  { key: 'all',       label: 'Total',     color: '#7B5C3A', bg: '#F5ECD8' },
  { key: 'pending',   label: 'Pending',   color: '#B45309', bg: '#FFFBEB' },
  { key: 'delivered', label: 'Delivered', color: '#15803D', bg: '#F0FDF4' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    getOrders()
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getStatus = (o) => o.isDelivered ? 'delivered' : o.isPaid ? 'shipped' : 'pending';

  const tabsWithCount = tabs.map(t => ({
    ...t,
    count: t.value === 'all' ? orders.length : orders.filter(o => getStatus(o) === t.value).length,
  }));

  const filtered = useMemo(() =>
    filter === 'all' ? orders : orders.filter(o => getStatus(o) === filter),
    [orders, filter]
  );

  const revenue = orders.filter(o => o.isDelivered).reduce((s, o) => s + (o.totalPrice || 0), 0);

  return (
    <div>
      <PageHeader title="Orders" sub={`${orders.length} total orders`} />

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-8">
        {metrics.map((m, i) => (
          <motion.div key={m.key} whileHover={{ y: -2 }}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="flex flex-col items-center py-4 px-3 rounded-2xl cursor-pointer"
            style={{ background: filter === m.key ? m.bg : 'white', border: `1px solid ${filter === m.key ? m.color + '30' : 'rgba(232,213,176,0.35)'}`, boxShadow: '0 2px 0 rgba(232,213,176,0.4)' }}
            onClick={() => setFilter(m.key)}>
            <p className="font-bold text-xl leading-none" style={{ color: m.color }}>
              {m.key === 'all' ? orders.length : orders.filter(o => getStatus(o) === m.key).length}
            </p>
            <p className="text-[10px] font-semibold mt-1" style={{ color: '#9B7A52' }}>{m.label}</p>
          </motion.div>
        ))}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="flex flex-col items-center py-4 px-3 rounded-2xl"
          style={{ background: '#FDF4EC', border: '1px solid rgba(192,82,43,0.2)' }}>
          <p className="font-bold text-xl leading-none" style={{ color: '#C0522B' }}>₹{(revenue / 1000).toFixed(1)}k</p>
          <p className="text-[10px] font-semibold mt-1" style={{ color: '#9B7A52' }}>Revenue</p>
        </motion.div>
      </motion.div>

      <div className="mb-6 overflow-x-auto pb-1">
        <FilterTabs tabs={tabsWithCount} active={filter} onChange={setFilter} />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: 'rgba(232,213,176,0.4)' }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="🛒" message="No orders found" sub="Try a different filter" />
      ) : (
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
            {filtered.map((order, i) => (
              <Tr key={order._id}>
                <Td>
                  <span className="font-mono text-xs font-bold" style={{ color: '#C0522B' }}>
                    #KH-{order._id?.slice(-4).toUpperCase()}
                  </span>
                </Td>
                <Td className="font-semibold text-[#1A0A02] whitespace-nowrap">{order.user?.name || 'Customer'}</Td>
                <Td className="text-sm font-medium max-w-[160px] truncate" style={{ color: '#7B5C3A' }}>
                  {order.products?.[0]?.product?.name || '—'}
                </Td>
                <Td className="font-bold text-[#1A0A02] whitespace-nowrap">₹{(order.totalPrice || 0).toLocaleString('en-IN')}</Td>
                <Td className="text-xs font-medium whitespace-nowrap" style={{ color: '#9B7A52' }}>
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—'}
                </Td>
                <Td>
                  <StatusBadge status={order.isDelivered ? 'Delivered' : order.isPaid ? 'Shipped' : 'Processing'} />
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableCard>
      )}
    </div>
  );
}
