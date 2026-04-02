import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Inter', system-ui, sans-serif; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.25); border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.45); }
      `}</style>

      <div className="min-h-screen flex" style={{ background: '#F1F5F9' }}>
        {/* Subtle ambient tints */}
        <div className="fixed inset-0 pointer-events-none z-0" style={{
          backgroundImage: `
            radial-gradient(ellipse 55% 40% at 0% 0%, rgba(99,102,241,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 45% 35% at 100% 100%, rgba(139,92,246,0.05) 0%, transparent 60%)
          `,
        }} />

        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="px-8 py-8 min-h-full max-w-screen-2xl mx-auto w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
}
