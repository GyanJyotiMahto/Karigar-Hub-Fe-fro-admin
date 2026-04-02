import { createContext, useContext, useState } from 'react';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const token = localStorage.getItem('adminToken');
    const name = localStorage.getItem('adminName');
    return token ? { token, name } : null;
  });

  const login = (data) => {
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminName', data.name);
    setAdmin(data);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
