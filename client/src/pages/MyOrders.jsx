import { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Package, Clock, ChevronRight, RotateCcw, Filter } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const STATUS_COLORS = { placed: 'bg-blue-100 text-blue-700', confirmed: 'bg-indigo-100 text-indigo-700', preparing: 'bg-amber-100 text-amber-700', ready: 'bg-green-100 text-green-700', completed: 'bg-stone-100 text-stone-600', cancelled: 'bg-red-100 text-red-700' };
const STATUS_LABELS = { placed: 'Placed', confirmed: 'Confirmed', preparing: 'Preparing', ready: '🎉 Ready!', completed: 'Completed', cancelled: 'Cancelled' };

export default function MyOrders() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/orders/me').then((r) => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [user]);

  const reorder = (order) => {
    order.items.forEach((oi) => addItem(oi.foodItem));
    toast.success('Items added to cart!');
    navigate('/checkout');
  };

  const active = orders.filter((o) => ['placed', 'confirmed', 'preparing', 'ready'].includes(o.status));
  const filteredOrders = filter === 'all' ? orders : filter === 'active' ? active : orders.filter((o) => o.status === filter);

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-cafe-bg">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title">My Orders</h1>
            <p className="text-stone-500 mt-1">{orders.length} total orders</p>
          </div>
          {active.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-secondary bg-secondary/10 px-3 py-1.5 rounded-full border border-secondary/20 animate-pulse-slow">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              {active.length} Active
            </div>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {[['all', 'All Orders'], ['active', 'Active'], ['completed', 'Completed'], ['cancelled', 'Cancelled']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${filter === val ? 'bg-primary text-white border-primary' : 'bg-white text-stone-600 border-cafe-border hover:border-primary/40'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="card p-6"><div className="space-y-2"><div className="skeleton h-5 w-1/3 rounded" /><div className="skeleton h-4 w-full rounded" /><div className="skeleton h-4 w-2/3 rounded" /></div></div>)}</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 card p-12">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="font-display font-bold text-xl text-primary mb-2">No orders yet</h3>
            <p className="text-stone-500 text-sm mb-6">Your order history will appear here</p>
            <Link to="/menu" className="btn-primary">Order Something Delicious</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="card overflow-hidden">
                {/* Order header */}
                <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-cafe-bg transition-colors"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-primary font-mono text-sm">{order.orderNumber}</p>
                        <span className={`status-badge ${STATUS_COLORS[order.status]}`}>{STATUS_LABELS[order.status]}</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · {order.items.length} item(s) · ₹{order.total.toFixed(0)}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-stone-400 transition-transform ${expanded === order.id ? 'rotate-90' : ''}`} />
                </div>

                {/* Expanded details */}
                {expanded === order.id && (
                  <div className="border-t border-cafe-border px-5 pb-5 pt-4 animate-slide-up">
                    <div className="space-y-3 mb-4">
                      {order.items.map((oi) => (
                        <div key={oi.id} className="flex items-center gap-3">
                          <img src={oi.foodItem.image} alt={oi.foodItem.name} className="w-11 h-11 rounded-lg object-cover shrink-0"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100'; }} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-stone-800">{oi.foodItem.name}</p>
                            <p className="text-xs text-stone-500">× {oi.quantity}</p>
                          </div>
                          <span className="text-sm font-semibold text-primary">₹{(oi.price * oi.quantity).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-4">
                      {['placed', 'confirmed', 'preparing', 'ready'].includes(order.status) && (
                        <Link to={`/track/${order.orderNumber}`} className="btn-primary flex-1 text-center text-sm !py-2.5">
                          Track Order
                        </Link>
                      )}
                      <button onClick={() => reorder(order)}
                        className="btn-outline flex-1 flex items-center justify-center gap-1.5 text-sm !py-2.5">
                        <RotateCcw className="w-4 h-4" /> Reorder
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
