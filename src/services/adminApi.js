const BASE = 'http://localhost:5001/api';

const req = async (path, options = {}) => {
  const token = localStorage.getItem('adminToken');
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// Auth
export const adminLogin = (body) => req('/admin/login', { method: 'POST', body: JSON.stringify(body) });

// Users
export const getUsers    = ()    => req('/admin/users');
export const deleteUser  = (id)  => req(`/admin/users/${id}`, { method: 'DELETE' });

// Karigars
export const getKarigars    = ()    => req('/artists');
export const verifyKarigar  = (id)  => req(`/admin/artists/${id}/verify`, { method: 'PUT' });
export const deleteKarigar  = (id)  => req(`/artists/${id}`, { method: 'DELETE' });

// Products
export const getProducts   = ()    => req('/products');
export const deleteProduct = (id)  => req(`/products/${id}`, { method: 'DELETE' });

// Orders
export const getOrders = () => req('/admin/orders');

// Stats — derived from above calls
export const getStats = async () => {
  const [users, karigars, products, orders] = await Promise.all([
    getUsers(), getKarigars(), getProducts(), getOrders(),
  ]);
  return {
    totalUsers:    Array.isArray(users)    ? users.length    : 0,
    totalKarigars: Array.isArray(karigars) ? karigars.length : 0,
    totalProducts: Array.isArray(products) ? products.length : 0,
    totalOrders:   Array.isArray(orders)   ? orders.length   : 0,
    totalRevenue:  Array.isArray(orders)   ? orders.filter(o => o.isDelivered).reduce((s, o) => s + (o.totalPrice || 0), 0) : 0,
  };
};
