import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Users } from 'lucide-react';
import { getUsers, deleteUser } from '../../services/adminApi';
import {
  StatusBadge, DeleteModal, TableCard, Th, Tr, Td,
  EmptyState, FilterTabs, PageHeader, SearchInput, ActionBtn, SkeletonRow,
} from '../components/AdminUI';

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
    .filter(u => !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())),
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
    <div className="space-y-6">
      <PageHeader
        title="Users"
        sub={`${users.length} registered users on the platform`}
        icon={Users}
      >
        <SearchInput value={search} onChange={setSearch} placeholder="Search name or email…" />
      </PageHeader>

      <FilterTabs tabs={tabsWithCount} active={filter} onChange={setFilter} />

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
          {loading ? (
            [...Array(5)].map((_, i) => <SkeletonRow key={i} cols={7} />)
          ) : filtered.length === 0 ? (
            <tr>
              <td colSpan={7}>
                <EmptyState icon="👤" message="No users found" sub="Try adjusting your search or filter" />
              </td>
            </tr>
          ) : filtered.map((user, i) => {
            const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
            return (
              <Tr key={user._id}>
                <Td>
                  <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 2px 8px rgba(99,102,241,0.25)' }}>
                      {user.profileImage
                        ? <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover rounded-xl" />
                        : initials}
                    </div>
                    <span className="font-semibold text-slate-800 text-sm whitespace-nowrap">{user.name}</span>
                  </motion.div>
                </Td>
                <Td className="text-slate-500 text-xs">{user.email}</Td>
                <Td className="text-slate-500 text-xs">{user.phone || '—'}</Td>
                <Td>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                    {user.address?.city || user.address?.state || '—'}
                  </span>
                </Td>
                <Td>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'}`}>
                    {user.role || 'user'}
                  </span>
                </Td>
                <Td className="text-slate-400 text-xs whitespace-nowrap">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—'}
                </Td>
                <Td>
                  <ActionBtn variant="danger" icon={Trash2} title="Delete user" onClick={() => setDelete(user)} />
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
