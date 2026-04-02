import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { X, AlertTriangle, TrendingUp } from 'lucide-react';

// ── Animated counter ──────────────────────────────────────────────────────────
export function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    let raf;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4); // ease-out quart
      setCount(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setCount(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return count;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
export function StatCard({ title, value, icon: Icon, gradient, prefix = '', suffix = '', growth }) {
  const count = useCounter(typeof value === 'number' ? value : 0);
  const display = typeof value === 'number'
    ? `${prefix}${count.toLocaleString('en-IN')}${suffix}`
    : value;

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 20px 48px rgba(15,23,42,0.12)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="relative overflow-hidden rounded-2xl cursor-default select-none bg-white"
      style={{
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
        minHeight: 148,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: gradient }} />
      <div className="absolute inset-0 opacity-[0.03] rounded-2xl" style={{ background: gradient }} />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-[0.07]" style={{ background: gradient }} />

      <div className="relative p-6 flex flex-col justify-between" style={{ minHeight: 148 }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: gradient, boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}>
          <Icon size={22} color="white" strokeWidth={1.8} />
        </div>
        <div>
          <p className="text-3xl font-extrabold text-slate-800 leading-none tracking-tight mb-1.5">{display}</p>
          <p className="text-sm font-semibold text-slate-400">{title}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
const badgeMap = {
  approved:   { bg: '#F0FDF4', color: '#15803D', dot: '#22C55E', border: 'rgba(34,197,94,0.2)'   },
  pending:    { bg: '#FFFBEB', color: '#B45309', dot: '#F59E0B', border: 'rgba(245,158,11,0.2)'  },
  rejected:   { bg: '#FFF1F2', color: '#BE123C', dot: '#F43F5E', border: 'rgba(244,63,94,0.2)'   },
  active:     { bg: '#F0FDF4', color: '#15803D', dot: '#22C55E', border: 'rgba(34,197,94,0.2)'   },
  blocked:    { bg: '#FFF1F2', color: '#BE123C', dot: '#F43F5E', border: 'rgba(244,63,94,0.2)'   },
  Delivered:  { bg: '#F0FDF4', color: '#15803D', dot: '#22C55E', border: 'rgba(34,197,94,0.2)'   },
  Shipped:    { bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6', border: 'rgba(59,130,246,0.2)'  },
  Processing: { bg: '#FFFBEB', color: '#B45309', dot: '#F59E0B', border: 'rgba(245,158,11,0.2)'  },
  Pending:    { bg: '#FFFBEB', color: '#B45309', dot: '#F59E0B', border: 'rgba(245,158,11,0.2)'  },
  Cancelled:  { bg: '#FFF1F2', color: '#BE123C', dot: '#F43F5E', border: 'rgba(244,63,94,0.2)'   },
};

export function StatusBadge({ status }) {
  const s = badgeMap[status] || { bg: '#F8FAFC', color: '#64748B', dot: '#94A3B8', border: 'rgba(148,163,184,0.2)' };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold capitalize whitespace-nowrap"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
      {status}
    </span>
  );
}

// ── Toggle ────────────────────────────────────────────────────────────────────
export function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} role="switch" aria-checked={checked}
      className="relative flex-shrink-0 focus:outline-none rounded-full"
      style={{ width: 40, height: 22 }}>
      <motion.div
        animate={{ background: checked ? 'linear-gradient(135deg, #D4622F, #B03A18)' : '#D4C4B0' }}
        transition={{ duration: 0.18 }}
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: checked ? '0 2px 10px rgba(192,82,43,0.38)' : 'inset 0 1px 3px rgba(0,0,0,0.1)' }}
      />
      <motion.div
        animate={{ x: checked ? 19 : 2 }}
        transition={{ type: 'spring', stiffness: 600, damping: 35 }}
        className="absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.22)' }}
      />
    </button>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────
export function DeleteModal({ open, onClose, onConfirm, label = 'this item' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(8,3,0,0.65)', backdropFilter: 'blur(10px)' }}
          onClick={onClose}>
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl overflow-hidden"
            style={{ background: 'white', boxShadow: '0 40px 100px rgba(0,0,0,0.3)' }}>
            <div className="h-1" style={{ background: 'linear-gradient(90deg, #F43F5E, #E11D48)' }} />
            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #FFF1F2, #FFE4E6)' }}>
                  <AlertTriangle size={24} style={{ color: '#F43F5E' }} />
                </div>
                <button onClick={onClose}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                  <X size={15} />
                </button>
              </div>
              <h3 className="font-display font-bold text-[#1A0A02] text-xl mb-2">Delete Confirmation</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#7B5C3A' }}>
                You're about to permanently delete{' '}
                <span className="font-bold text-[#1A0A02]">"{label}"</span>.
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={onClose}
                  className="flex-1 py-2.5 rounded-2xl text-sm font-semibold transition-all"
                  style={{ border: '1.5px solid rgba(232,213,176,0.7)', color: '#5C3317', background: 'white' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FBF5EC'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                  Cancel
                </button>
                <button onClick={onConfirm}
                  className="flex-1 py-2.5 rounded-2xl text-sm font-bold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #F43F5E, #E11D48)', boxShadow: '0 4px 16px rgba(244,63,94,0.35)' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  Yes, Delete
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
export function SkeletonRow({ cols = 5 }) {
  return (
    <tr className="animate-pulse" style={{ borderBottom: '1px solid #F1F5F9' }}>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3.5 rounded-full bg-slate-100" style={{ width: `${48 + (i * 19) % 38}%` }} />
        </td>
      ))}
    </tr>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon = '🏺', message = 'No data found', sub = '' }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-5"
        style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
        {icon}
      </div>
      <p className="font-bold text-slate-800 text-lg mb-1.5">{message}</p>
      {sub && <p className="text-sm font-semibold text-slate-400">{sub}</p>}
    </motion.div>
  );
}

// ── Page Wrapper ──────────────────────────────────────────────────────────────
export function PageWrapper({ children }) {
  return <div>{children}</div>;
}

// ── Page Header ───────────────────────────────────────────────────────────────
export function PageHeader({ title, sub, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-10">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">{title}</h2>
        {sub && <p className="text-sm mt-1.5 font-semibold text-indigo-400">{sub}</p>}
      </div>
      {children && <div className="flex items-center gap-2.5 flex-shrink-0">{children}</div>}
    </div>
  );
}

// ── Search Input ──────────────────────────────────────────────────────────────
import { Search } from 'lucide-react';
export function SearchInput({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative w-full sm:w-64">
      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
      <input
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none transition-all text-slate-700"
        style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0' }}
        onFocus={e => { e.target.style.background = 'white'; e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
        onBlur={e => { e.target.style.background = '#F8FAFC'; e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
      />
    </div>
  );
}

// ── Section Card ──────────────────────────────────────────────────────────────
export function SectionCard({ children, className = '' }) {
  return (
    <div className={`rounded-2xl overflow-hidden bg-white ${className}`}
      style={{
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
      }}>
      {children}
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
export function SectionHeader({ title, sub, to, children }) {
  return (
    <div className="px-6 py-5 flex items-center justify-between"
      style={{ borderBottom: '1px solid #F1F5F9' }}>
      <div>
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        {sub && <p className="text-xs mt-0.5 font-semibold text-indigo-400">{sub}</p>}
      </div>
      {to && (
        <Link to={to} className="flex items-center gap-1 text-xs font-bold group transition-all text-indigo-500"
          onMouseEnter={e => e.currentTarget.style.color = '#4338CA'}
          onMouseLeave={e => e.currentTarget.style.color = '#6366f1'}>
          View all
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
      {children}
    </div>
  );
}

// ── Table Card ────────────────────────────────────────────────────────────────
export function TableCard({ children }) {
  return (
    <SectionCard>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">{children}</table>
      </div>
    </SectionCard>
  );
}

export function Th({ children, className = '' }) {
  return (
    <th className={`px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider whitespace-nowrap text-slate-400 ${className}`}
      style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
      {children}
    </th>
  );
}

export function Tr({ children, onClick }) {
  return (
    <motion.tr
      whileHover={{ backgroundColor: '#F8FAFF' }}
      transition={{ duration: 0.12 }}
      onClick={onClick}
      className="cursor-default"
      style={{ borderBottom: '1px solid #F8FAFC' }}>
      {children}
    </motion.tr>
  );
}

export function Td({ children, className = '' }) {
  return <td className={`px-6 py-4 text-sm text-slate-700 ${className}`}>{children}</td>;
}

// ── Filter Tabs ───────────────────────────────────────────────────────────────
export function FilterTabs({ tabs, active, onChange }) {
  return (
    <div className="inline-flex gap-1 p-1 rounded-xl bg-slate-100" style={{ border: '1px solid #E2E8F0' }}>
      {tabs.map(tab => (
        <button key={tab.value} onClick={() => onChange(tab.value)}
          className="relative px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 whitespace-nowrap"
          style={{ color: active === tab.value ? '#4338CA' : '#64748B' }}>
          {active === tab.value && (
            <motion.div layoutId="filterPill" className="absolute inset-0 rounded-lg bg-white"
              style={{ boxShadow: '0 1px 4px rgba(15,23,42,0.08)', border: '1px solid #C7D2FE' }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            {tab.label}
            {tab.count != null && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  background: active === tab.value ? '#EEF2FF' : '#E2E8F0',
                  color: active === tab.value ? '#6366f1' : '#94A3B8',
                }}>
                {tab.count}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

// ── Action Button ─────────────────────────────────────────────────────────────
export function ActionBtn({ onClick, variant = 'ghost', icon: Icon, label, title }) {
  const styles = {
    ghost:   { color: '#9B7A52', hoverBg: 'rgba(232,213,176,0.4)' },
    danger:  { color: '#F43F5E', hoverBg: 'rgba(244,63,94,0.08)'  },
    success: { color: '#16A34A', hoverBg: 'rgba(22,163,74,0.08)'  },
    warning: { color: '#D97706', hoverBg: 'rgba(217,119,6,0.08)'  },
    info:    { color: '#2563EB', hoverBg: 'rgba(37,99,235,0.08)'  },
  };
  const s = styles[variant] || styles.ghost;
  return (
    <motion.button
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
      onClick={onClick} title={title}
      className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
      style={{ color: s.color }}
      onMouseEnter={e => e.currentTarget.style.background = s.hoverBg}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      {Icon && <Icon size={14} />}
      {label && <span className="text-xs font-semibold">{label}</span>}
    </motion.button>
  );
}
