import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { getProducts, deleteProduct } from '../../services/adminApi';
import { DeleteModal, EmptyState, FilterTabs, PageHeader, SearchInput } from '../components/AdminUI';

export default function AdminProducts() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deleteTarget, setDelete] = useState(null);
  const [category, setCategory]   = useState('All');
  const [search, setSearch]       = useState('');

  useEffect(() => {
    getProducts()
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const catTabs = categories.map(c => ({
    value: c, label: c,
    count: c === 'All' ? products.length : products.filter(p => p.category === c).length,
  }));

  const filtered = useMemo(() => products
    .filter(p => category === 'All' || p.category === category)
    .filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.artist?.name?.toLowerCase().includes(search.toLowerCase())),
    [products, category, search]
  );

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteTarget._id);
      setProducts(prev => prev.filter(p => p._id !== deleteTarget._id));
    } catch {}
    setDelete(null);
  };

  return (
    <div>
      <PageHeader title="Products" sub={`${products.length} total products`}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search product or artisan..." />
      </PageHeader>

      <div className="mb-6 overflow-x-auto pb-1">
        <FilterTabs tabs={catTabs} active={category} onChange={setCategory} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl animate-pulse" style={{ background: 'rgba(232,213,176,0.4)' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="📦" message="No products found" sub="Try a different category or search term" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <motion.div key={product._id} layout
                initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.93 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 26 }}
                whileHover={{ y: -6 }}
                className="group rounded-2xl overflow-hidden"
                style={{ background: 'white', border: '1px solid rgba(232,213,176,0.35)', boxShadow: '0 2px 0 rgba(232,213,176,0.4), 0 4px 20px rgba(44,26,14,0.06)' }}>
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-[#F5ECD8]">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🎨</div>
                  )}
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-1 rounded-lg"
                    style={{ background: 'rgba(251,245,236,0.9)', color: '#7B5C3A' }}>
                    {product.category}
                  </span>
                  <span className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
                </div>
                {/* Info */}
                <div className="p-5">
                  <p className="font-bold text-[#1A0A02] text-sm leading-snug truncate mb-0.5">{product.name}</p>
                  <p className="text-xs font-medium mb-3 truncate" style={{ color: '#9B7A52' }}>
                    by {product.artist?.name || '—'}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#C0522B] text-lg">₹{product.price?.toLocaleString('en-IN')}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                      </span>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setDelete(product)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ color: '#C0B090' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.08)'; e.currentTarget.style.color = '#F43F5E'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C0B090'; }}>
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <DeleteModal open={!!deleteTarget} onClose={() => setDelete(null)} onConfirm={handleDelete} label={deleteTarget?.name} />
    </div>
  );
}
