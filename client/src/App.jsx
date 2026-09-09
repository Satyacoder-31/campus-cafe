import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import OrderManagement from './pages/admin/OrderManagement';
import MenuManagement from './pages/admin/MenuManagement';
import Inventory from './pages/admin/Inventory';
import UserManagement from './pages/admin/UserManagement';

// Layout wrapper for student-facing pages
function StudentLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { fontFamily: 'Inter', background: '#FFFAF5', color: '#292524', border: '1px solid #F3E8D8', borderRadius: '12px', boxShadow: '0 4px 24px rgba(91,50,30,0.12)' },
              success: { iconTheme: { primary: '#16A34A', secondary: '#fff' } },
              error: { iconTheme: { primary: '#DC2626', secondary: '#fff' } },
            }}
          />

          <Routes>
            {/* Student pages */}
            <Route path="/" element={<StudentLayout><Home /></StudentLayout>} />
            <Route path="/menu" element={<StudentLayout><Menu /></StudentLayout>} />
            <Route path="/checkout" element={<StudentLayout><Checkout /></StudentLayout>} />
            <Route path="/track/:orderNumber" element={<StudentLayout><OrderTracking /></StudentLayout>} />
            <Route path="/my-orders" element={<StudentLayout><MyOrders /></StudentLayout>} />
            <Route path="/profile" element={<StudentLayout><Profile /></StudentLayout>} />
            <Route path="/about" element={<StudentLayout><About /></StudentLayout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin pages */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="menu" element={<MenuManagement />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
          </Routes>
          <Analytics />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
