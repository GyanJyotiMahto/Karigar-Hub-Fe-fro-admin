import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Trash2, Hammer } from 'lucide-react';
import { getKarigars, verifyKarigar, deleteKarigar } from '../../services/adminApi';
import {
  StatusBadge, DeleteModal, TableCard, Th, Tr, Td,
  EmptyState, FilterTabs, PageHeader, SearchInput, SkeletonRow,
} from '../components/AdminUI';

const tabs = [
  { value: 'all',      label: 'All'      },
  { value: 'verified', label: 'Verified' },
  { value: 'pending',  label: 'Pending'  },
];

export default function AdminKarigars() {
  const [karigars, setKarigars]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deleteTarget, setDelete] = useState(null);
  const [filter, setFilter]       = useState('all');
  const [search, setSearch]       = useState('');

  useEffect(() => {
    getKarigars()
      .then(data => setKarigars(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tabsWithCount = tabs.map(t => ({
    ...t,
    count: t.value === 'all' ? karigars.length
      : t.value === 'verified' ? karigars.filter(k => k.isVerified).length
      : karigars.filter(k => !k.isVerified).length,
  }));

  const filtered = useMemo(() => karigars
    .filter(k => filter === 'all' || (filter === 'verified' ? k.isVerified : !k.isVerified))
    .filter(k => !search ||
      k.name?.toLowerCase().includes(search.toLowerCase()) ||
      k.category?.toLowerCase().includes(search.toLowerCase())),
    [karigars, filter, search]
  );

  const handleVerify = async (id) => {
    try {
      await verifyKarigar(id);
      setKarigars(prev => prev.map(k => k._id === id ? { ...k, isVerified: true } : k));
    } catch {}
  };

  const handleDelete = async () => {
    try {
      await deleteKarigar(deleteTarget._id);
      setKarigars(prev => prev.filter(k => k._id !== deleteTarget._id));
    } catch {}
    setDelete(null);
  };

  const pending = karigars.filter(k => !k.isVerified).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Karigars"
        sub={pending > 0 ? `${pending} pending verification` : `${karigars.length} total karigars`}
        icon={Hammer}
      >
        <SearchInput value={search} onChange={setSearch} placeholder="Search karigar or craft…" />
      </PageHeader>

      <FilterTabs tabs={tabsWithCount} active={filter} onChange={setFilter} />

      <TableCard>
        <thead>
          <tr>
            <Th>Karigar</Th>
            <Th>State</Th>
            <Th>Category</Th>
            <Th>Business</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            [...Array(5)].map((_, i) => <SkeletonRow key={i} cols={6} />)
          ) : filtered.length === 0 ? (
            <tr>
              <td colSpan={6}>
                <EmptyState icon="🧑‍🎨" message="No karigars found" sub="Try adjusting your search or filter" />
              </td>
            </tr>
          ) : filtered.map((k, i) => {
            const initials = k.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'K';
            return (
              <Tr key={k._id}>
                <Td>
                  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 2px 8px rgba(245,158,11,0.25)' }}>
                      {k.profileImage
                        ? <img src={k.profileImage} alt={k.name} className="w-full h-full object-cover" />
                        : initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm whitespace-nowrap">{k.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{k.email}</p>
                    </div>
                  </motion.div>
                </Td>
                <Td>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                    {k.address?.state || '—'}
                  </span>
                </Td>
                <Td className="text-slate-600 text-sm max-w-[140px] truncate">{k.category || '—'}</Td>
                <Td className="text-slate-500 text-sm max-w-[140px] truncate">{k.businessName || '—'}</Td>
                <Td>
                  <StatusBadge status={k.isVerified ? 'approved' : 'pending'} />
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    {!k.isVerified && (
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => handleVerify(k._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                        style={{ background: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#DCFCE7'}
                        onMouseLeave={e => e.currentTarget.style.background = '#F0FDF4'}>
                        <CheckCircle size={12} /> Verify
                      </motion.button>
                    )}
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setDelete(k)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors text-slate-400"
                      onMouseEnter={e => { e.currentTarget.style.background = '#FFF1F2'; e.currentTarget.style.color = '#F43F5E'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94A3B8'; }}>
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </Td>
              </Tr>
            );
          })}
        </tbody>
      </TableCard>

      <DeleteModal open={!!deleteTarget} onClose={() => setDelete(null)} onConfirm={handleDelete} label={deleteTarget?.name} />
    </div>
  );
}
