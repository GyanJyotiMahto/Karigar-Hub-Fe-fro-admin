import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Package } from 'lucide-react';
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
    .filter(p => !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.artist?.name?.toLowerCase().includes(search.toLowerCase())),
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
    <div className="space-y-6">
      <PageHeader title="Products" sub={`${products.length} total products`} icon={Package}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search product or artisan…" />
      </PageHeader>

      <FilterTabs tabs={catTabs} active={category} onChange={setCategory} />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl animate-pulse bg-slate-200" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="📦" message="No products found" sub="Try a different category or search term" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <motion.div key={product._id} layout
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03, type: 'spring', stiffness: 300, damping: 26 }}
                whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(15,23,42,0.1)' }}
                className="rounded-2xl overflow-hidden bg-white"
                style={{ border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(15,23,42,0.05)' }}>

                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-slate-300">🎨</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.92)', color: '#475569' }}>
                    {product.category}
                  </span>
                  <span className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full border-2 border-white ${product.stock > 0 ? 'bg-emerald-400' : 'bg-red-400'}`} />
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="font-bold text-slate-800 text-sm leading-snug truncate">{product.name}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5 mb-3 truncate">
                    by {product.artist?.name || '—'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-extrabold text-indigo-600 text-base">₹{product.price?.toLocaleString('en-IN')}</p>
                      <p className={`text-[10px] font-bold mt-0.5 ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </p>
                    </div>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setDelete(product)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors text-slate-300"
                      onMouseEnter={e => { e.currentTarget.style.background = '#FFF1F2'; e.currentTarget.style.color = '#F43F5E'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#CBD5E1'; }}>
                      <Trash2 size={14} />
                    </motion.button>
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
