import { useState } from 'react';
import { Link, NavLink, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, Package, Users, Coffee, Menu, X, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/menu', icon: UtensilsCrossed, label: 'Menu' },
  { to: '/admin/inventory', icon: Package, label: 'Inventory' },
  { to: '/admin/users', icon: Users, label: 'Users' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-cafe-border flex flex-col transform transition-transform lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-cafe-border">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <Coffee className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-base text-primary leading-none">Campus Café</p>
            <p className="text-xs text-stone-400 leading-none mt-0.5">Admin Panel</p>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}><X className="w-4 h-4 text-stone-400" /></button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}>
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Admin profile */}
        <div className="p-4 border-t border-cafe-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">{user.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-800 truncate">{user.name}</p>
              <p className="text-xs text-stone-400 truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="flex-1 text-xs text-center py-1.5 rounded-lg text-stone-500 hover:bg-cafe-bg transition-colors">← Student View</Link>
            <button onClick={handleLogout} className="flex items-center gap-1 text-xs text-error px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-cafe-border px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-cafe-bg">
            <Menu className="w-5 h-5 text-stone-600" />
          </button>
          <div className="hidden lg:flex items-center gap-1 text-xs text-stone-400">
            <span>Admin</span><ChevronRight className="w-3 h-3" /><span className="text-stone-600 font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-stone-500 font-medium">Canteen Open</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
