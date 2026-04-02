import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Ban } from 'lucide-react';
import { getUsers, deleteUser } from '../../services/adminApi';
import { StatusBadge, DeleteModal, TableCard, Th, Tr, Td, EmptyState, FilterTabs, PageHeader, SearchInput, ActionBtn } from '../components/AdminUI';

const tabs = [
  { value: 'all',   label: 'All Users' },
  { value: 'user',  label: 'Buyers'    },
  { value: 'admin', label: 'Admins'    },
];

export default function AdminUsers() {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deleteTarget, setDelete] = useState(null);
  const [filter, setFilter]       = useState('all');
  const [search, setSearch]       = useState('');

  useEffect(() => {
    getUsers()
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tabsWithCount = tabs.map(t => ({
    ...t,
    count: t.value === 'all' ? users.length : users.filter(u => (u.role || 'user') === t.value).length,
  }));

  const filtered = useMemo(() => users
    .filter(u => filter === 'all' || (u.role || 'user') === filter)
    .filter(u => !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())),
    [users, filter, search]
  );

  const handleDelete = async () => {
    try {
      await deleteUser(deleteTarget._id);
      setUsers(prev => prev.filter(u => u._id !== deleteTarget._id));
    } catch {}
    setDelete(null);
  };

  return (
    <div>
      <PageHeader title="Users" sub={`${users.length} registered users on the platform`}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search name or email..." />
      </PageHeader>

      <div className="mb-6 overflow-x-auto pb-1">
        <FilterTabs tabs={tabsWithCount} active={filter} onChange={setFilter} />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: 'rgba(232,213,176,0.4)' }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="👤" message="No users found" sub="Try adjusting your search or filter" />
      ) : (
        <TableCard>
          <thead>
            <tr>
              <Th>User</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Location</Th>
              <Th>Role</Th>
              <Th>Joined</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, i) => {
              const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
              return (
                <Tr key={user._id}>
                  <Td>
                    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#3B82F6] flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        {user.profileImage ? <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" /> : initials}
                      </div>
                      <p className="font-semibold text-[#1A0A02] text-sm whitespace-nowrap">{user.name}</p>
                    </motion.div>
                  </Td>
                  <Td className="text-xs font-medium" style={{ color: '#7B5C3A' }}>{user.email}</Td>
                  <Td className="text-xs font-medium" style={{ color: '#7B5C3A' }}>{user.phone || '—'}</Td>
                  <Td>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                      style={{ background: '#F5ECD8', color: '#7B5C3A' }}>
                      {user.address?.city || user.address?.state || '—'}
                    </span>
                  </Td>
                  <Td>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role || 'user'}
                    </span>
                  </Td>
                  <Td className="text-xs font-medium whitespace-nowrap" style={{ color: '#9B7A52' }}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—'}
                  </Td>
                  <Td>
                    <div className="flex items-center gap-0.5">
                      <ActionBtn variant="danger" icon={Trash2} title="Delete user" onClick={() => setDelete(user)} />
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
