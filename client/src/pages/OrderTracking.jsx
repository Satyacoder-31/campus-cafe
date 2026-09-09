import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, RotateCcw, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import OrderTimeline from '../components/OrderTimeline';

const STATUS_LABELS = { placed: 'Order Placed', confirmed: 'Confirmed', preparing: 'Preparing', ready: 'Ready for Pickup', completed: 'Completed', cancelled: 'Cancelled' };
const STATUS_COLORS = { placed: 'bg-blue-100 text-blue-700', confirmed: 'bg-indigo-100 text-indigo-700', preparing: 'bg-amber-100 text-amber-700', ready: 'bg-green-100 text-green-700', completed: 'bg-stone-100 text-stone-600', cancelled: 'bg-red-100 text-red-700' };

export default function OrderTracking() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [eta, setEta] = useState(0);

  const fetchOrder = () => {
    api.get(`/orders/track/${orderNumber}`)
      .then((r) => { setOrder(r.data); setEta(r.data.estimatedTime); setLoading(false); })
      .catch(() => { setError('Order not found'); setLoading(false); });
  };

  useEffect(() => {
    fetchOrder();
    // Auto-refresh every 15s for live tracking feel
    const interval = setInterval(fetchOrder, 15000);
    return () => clearInterval(interval);
  }, [orderNumber]);

  // ETA countdown
  useEffect(() => {
    if (eta <= 0) return;
    const t = setTimeout(() => setEta(eta - 1), 60000);
    return () => clearTimeout(t);
  }, [eta]);

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-stone-500">Loading order...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="text-center card p-12 max-w-sm">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="font-display font-bold text-xl text-primary mb-2">Order Not Found</h2>
        <p className="text-stone-500 text-sm mb-6">{error}</p>
        <button onClick={() => navigate('/my-orders')} className="btn-primary">View My Orders</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 bg-cafe-bg">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-stone-500 hover:text-primary transition-colors mb-6 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">Order Tracking</h1>
            <p className="text-stone-500 mt-1 font-mono text-lg">{order.orderNumber}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`status-badge ${STATUS_COLORS[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </span>
            <button onClick={fetchOrder} className="p-2 rounded-full hover:bg-cafe-border transition-colors" title="Refresh">
              <RotateCcw className="w-4 h-4 text-stone-500" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Timeline */}
          <div className="card p-8">
            <h3 className="font-bold text-stone-800 mb-6">Order Status</h3>
            {order.status !== 'cancelled' ? (
              <OrderTimeline status={order.status} />
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">❌</div>
                <p className="font-semibold text-error">Order Cancelled</p>
              </div>
            )}
          </div>

          {/* Order details */}
          <div className="space-y-4">
            {/* ETA card */}
            {['placed', 'confirmed', 'preparing'].includes(order.status) && eta > 0 && (
              <div className="card p-6 bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-600">Estimated Ready In</p>
                    <p className="font-display font-bold text-2xl text-primary">{eta} min</p>
                  </div>
                </div>
              </div>
            )}
            {order.status === 'ready' && (
              <div className="card p-6 bg-green-50 border-green-200">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="font-bold text-green-700 text-lg">Your order is ready!</p>
                  <p className="text-green-600 text-sm">Please collect from the counter</p>
                </div>
              </div>
            )}

            {/* Items */}
            <div className="card p-6">
              <h3 className="font-bold text-stone-800 mb-4">Ordered Items</h3>
              <div className="space-y-3">
                {order.items.map((oi) => (
                  <div key={oi.id} className="flex items-center gap-3">
                    <img src={oi.foodItem.image} alt={oi.foodItem.name} className="w-12 h-12 rounded-xl object-cover shrink-0"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100'; }} />
                    <div className="flex-1">
                      <p className="font-medium text-stone-800 text-sm">{oi.foodItem.name}</p>
                      <p className="text-xs text-stone-500">× {oi.quantity} · ₹{oi.price} each</p>
                    </div>
                    <span className="font-semibold text-primary text-sm">₹{(oi.price * oi.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-cafe-border mt-4 pt-4">
                <div className="flex justify-between text-sm text-stone-500 mb-1"><span>Subtotal</span><span>₹{order.subtotal.toFixed(0)}</span></div>
                {order.discount > 0 && <div className="flex justify-between text-sm text-green-600 mb-1"><span>Discount</span><span>-₹{order.discount.toFixed(0)}</span></div>}
                <div className="flex justify-between text-sm text-stone-500 mb-2"><span>Tax</span><span>₹{order.tax.toFixed(0)}</span></div>
                <div className="flex justify-between font-bold text-primary"><span>Total Paid</span><span>₹{order.total.toFixed(0)}</span></div>
              </div>
            </div>

            {/* Order info */}
            <div className="card p-6">
              <h3 className="font-bold text-stone-800 mb-4">Order Details</h3>
              <div className="space-y-2 text-sm">
                {[
                  ['Payment', order.paymentMethod?.toUpperCase()],
                  ['Pickup', order.pickupType === 'table' ? `Table ${order.tableNumber}` : 'Counter'],
                  ['Ordered at', new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-stone-500">{label}</span>
                    <span className="font-medium text-stone-700">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
