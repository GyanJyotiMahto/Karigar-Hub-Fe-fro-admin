import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Trash2 } from 'lucide-react';
import { getKarigars, verifyKarigar, deleteKarigar } from '../../services/adminApi';
import { StatusBadge, DeleteModal, TableCard, Th, Tr, Td, EmptyState, FilterTabs, PageHeader, SearchInput } from '../components/AdminUI';

const tabs = [
  { value: 'all',      label: 'All'      },
  { value: 'verified', label: 'Verified' },
  { value: 'pending',  label: 'Pending'  },
];

export default function AdminKarigars() {
  const [karigars, setKarigars] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [deleteTarget, setDelete] = useState(null);
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');

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
    .filter(k => !search || k.name?.toLowerCase().includes(search.toLowerCase()) || k.category?.toLowerCase().includes(search.toLowerCase())),
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

  return (
    <div>
      <PageHeader title="Karigars" sub={`${karigars.filter(k => !k.isVerified).length} pending verification`}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search karigar or craft..." />
      </PageHeader>

      <div className="mb-6 overflow-x-auto pb-1">
        <FilterTabs tabs={tabsWithCount} active={filter} onChange={setFilter} />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: 'rgba(232,213,176,0.4)' }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="🧑‍🎨" message="No karigars found" sub="Try adjusting your search or filter" />
      ) : (
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
            {filtered.map((k, i) => {
              const initials = k.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
              return (
                <Tr key={k._id}>
                  <Td>
                    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#C0522B] flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        {k.profileImage ? <img src={k.profileImage} alt={k.name} className="w-full h-full object-cover" /> : initials}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1A0A02] text-sm whitespace-nowrap">{k.name}</p>
                        <p className="text-[10px]" style={{ color: '#9B7A52' }}>{k.email}</p>
                      </div>
                    </motion.div>
                  </Td>
                  <Td>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                      style={{ background: '#F5ECD8', color: '#7B5C3A' }}>{k.address?.state || '—'}</span>
                  </Td>
                  <Td className="text-sm font-medium max-w-[140px] truncate" style={{ color: '#7B5C3A' }}>{k.category || '—'}</Td>
                  <Td className="text-sm font-medium max-w-[140px] truncate" style={{ color: '#7B5C3A' }}>{k.businessName || '—'}</Td>
                  <Td>
                    <StatusBadge status={k.isVerified ? 'approved' : 'pending'} />
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1.5">
                      {!k.isVerified && (
                        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                          onClick={() => handleVerify(k._id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold"
                          style={{ background: '#F0FDF4', color: '#15803D', border: '1px solid rgba(34,197,94,0.2)' }}>
                          <CheckCircle size={12} /> Verify
                        </motion.button>
                      )}
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setDelete(k)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ color: '#9B7A52' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.08)'; e.currentTarget.style.color = '#F43F5E'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9B7A52'; }}>
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </TableCard>
      )}

      <DeleteModal open={!!deleteTarget} onClose={() => setDelete(null)} onConfirm={handleDelete} label={deleteTarget?.name} />
    </div>
  );
}
