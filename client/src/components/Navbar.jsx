import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Coffee, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/useAuth';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setProfileOpen(false); };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/my-orders', label: 'My Orders' },
    { to: '/about', label: 'About' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-xl text-primary block leading-none">Campus</span>
                <span className="font-display font-bold text-xl text-secondary block leading-none">Café</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to} end={to === '/'}
                  className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${isActive ? 'text-primary bg-primary/10' : `${scrolled ? 'text-stone-700' : 'text-stone-800'} hover:text-primary hover:bg-primary/5`}`}>
                  {label}
                </NavLink>
              ))}
              {isAdmin && (
                <NavLink to="/admin" className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${isActive ? 'text-primary bg-primary/10' : 'text-stone-700 hover:text-primary hover:bg-primary/5'}`}>
                  Admin
                </NavLink>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <button onClick={() => setCartOpen(true)} className="relative p-2.5 rounded-full hover:bg-primary/10 transition-colors group">
                <ShoppingCart className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                  <span className="notif-dot animate-bounce-in">{itemCount}</span>
                )}
              </button>

              {/* Profile */}
              {user ? (
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-primary/10 transition-colors">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{user.name[0]}</span>
                    </div>
                    <span className="hidden md:block text-sm font-semibold text-stone-700">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-4 h-4 text-stone-500" />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-card-hover border border-cafe-border py-2 animate-slide-up z-50">
                      <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-cafe-bg hover:text-primary transition-colors">
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link to="/my-orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-cafe-bg hover:text-primary transition-colors">
                        <ShoppingCart className="w-4 h-4" /> My Orders
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-cafe-bg hover:text-primary transition-colors">
                          <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}
                      <hr className="my-1.5 border-cafe-border" />
                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-red-50 transition-colors w-full text-left">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="btn-primary !py-2 !px-5 text-sm">Login</Link>
              )}

              {/* Mobile hamburger */}
              <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-full hover:bg-primary/10 transition-colors">
                {isOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5 text-primary" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-cafe-border animate-slide-up bg-white/95 backdrop-blur-md -mx-4 px-4">
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to} end={to === '/'} onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `block px-4 py-3 rounded-xl text-sm font-semibold mb-1 ${isActive ? 'bg-primary text-white' : 'text-stone-700 hover:bg-cafe-bg'}`}>
                  {label}
                </NavLink>
              ))}
              {isAdmin && (
                <NavLink to="/admin" onClick={() => setIsOpen(false)} className={({ isActive }) => `block px-4 py-3 rounded-xl text-sm font-semibold mb-1 ${isActive ? 'bg-primary text-white' : 'text-stone-700 hover:bg-cafe-bg'}`}>
                  Admin Dashboard
                </NavLink>
              )}
            </div>
          )}
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Click outside to close profile */}
      {profileOpen && <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />}
    </>
  );
}
