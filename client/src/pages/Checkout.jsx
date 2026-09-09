import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { CreditCard, Smartphone, Banknote, MapPin, Clock, CheckCircle, Copy } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/useAuth';
import api from '../api/axios';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Pay via any UPI app' },
  { id: 'card', label: 'Card', icon: CreditCard, desc: 'Debit / Credit card' },
  { id: 'cash', label: 'Cash at Counter', icon: Banknote, desc: 'Pay when you pick up' },
];

export default function Checkout() {
  const { items, subtotal, tax, total, discount, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [pickupType, setPickupType] = useState('counter');
  const [tableNumber, setTableNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);

  if (!user) return <Navigate to="/login" replace />;

  if (items.length === 0 && !orderPlaced) return <Navigate to="/menu" replace />;

  const placeOrder = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ id: i.id, quantity: i.quantity, addOns: i.addOns || [] })),
        paymentMethod, pickupType, tableNumber, notes, couponCode: coupon,
      });
      clearCart();
      setOrderPlaced(data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally { setLoading(false); }
  };

  // Order success screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-cafe-bg flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center animate-slide-up">
          <div className="card p-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h1 className="font-display font-bold text-2xl text-primary mb-2">Order Placed!</h1>
            <p className="text-stone-500 mb-6">Your order is confirmed. We'll have it ready soon!</p>

            <div className="bg-primary/5 rounded-2xl p-5 mb-6 border border-primary/20">
              <p className="text-xs text-stone-500 mb-1">Order Number</p>
              <div className="flex items-center justify-center gap-2">
                <p className="font-display font-bold text-2xl text-primary">{orderPlaced.orderNumber}</p>
                <button onClick={() => { navigator.clipboard.writeText(orderPlaced.orderNumber); toast.success('Copied!'); }}
                  className="text-stone-400 hover:text-primary transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-3 text-stone-500 text-sm">
                <Clock className="w-4 h-4 text-secondary" />
                Estimated time: ~{orderPlaced.estimatedTime} minutes
              </div>
            </div>

            <div className="space-y-2.5">
              <button onClick={() => navigate(`/track/${orderPlaced.orderNumber}`)} className="btn-primary w-full">
                Track Your Order
              </button>
              <button onClick={() => navigate('/menu')} className="btn-outline w-full">Order More Food</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-cafe-bg">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="section-title mb-1">Checkout</h1>
        <p className="section-subtitle mb-8">Review your order and pay</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pickup Type */}
            <div className="card p-6">
              <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-secondary" /> Pickup Option</h3>
              <div className="grid grid-cols-2 gap-3">
                {[['counter', '🏪', 'Counter Pickup', 'Collect from canteen counter'], ['table', '🪑', 'Table Pickup', 'Delivered to your table']].map(([val, emoji, label, desc]) => (
                  <button key={val} onClick={() => setPickupType(val)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${pickupType === val ? 'border-primary bg-primary/5' : 'border-cafe-border hover:border-primary/40'}`}>
                    <div className="text-2xl mb-1">{emoji}</div>
                    <p className="font-semibold text-sm text-stone-800">{label}</p>
                    <p className="text-xs text-stone-500">{desc}</p>
                  </button>
                ))}
              </div>
              {pickupType === 'table' && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">Table Number</label>
                  <input value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} placeholder="e.g. T-12"
                    className="input-field" />
                </div>
              )}
            </div>

            {/* Payment */}
            <div className="card p-6">
              <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-secondary" /> Payment Method</h3>
              <div className="space-y-3">
                {PAYMENT_METHODS.map(({ id, label, icon: Icon, desc }) => (
                  <button key={id} onClick={() => setPaymentMethod(id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${paymentMethod === id ? 'border-primary bg-primary/5' : 'border-cafe-border hover:border-primary/40'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === id ? 'bg-primary text-white' : 'bg-cafe-bg text-stone-500'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-stone-800">{label}</p>
                      <p className="text-xs text-stone-500">{desc}</p>
                    </div>
                    <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === id ? 'border-primary' : 'border-stone-300'}`}>
                      {paymentMethod === id && <div className="w-3 h-3 bg-primary rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="card p-6">
              <h3 className="font-bold text-stone-800 mb-3">Special Instructions</h3>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any dietary requirements or special requests?"
                className="input-field resize-none h-24 text-sm" />
            </div>
          </div>

          {/* Right — Order summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-bold text-stone-800 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100'; }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                      <p className="text-xs text-stone-500">× {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">₹{(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-cafe-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-stone-600"><span>Subtotal</span><span>₹{subtotal.toFixed(0)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600 font-medium"><span>Discount ({coupon})</span><span>-₹{discount.toFixed(0)}</span></div>}
                <div className="flex justify-between text-stone-600"><span>GST (5%)</span><span>₹{tax.toFixed(0)}</span></div>
                <div className="flex justify-between font-bold text-primary text-base pt-2 border-t border-cafe-border">
                  <span>Total</span><span>₹{total.toFixed(0)}</span>
                </div>
              </div>

              <button onClick={placeOrder} disabled={loading}
                className="btn-primary w-full mt-5 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing Order...</> : `Confirm Order — ₹${total.toFixed(0)}`}
              </button>
              <p className="text-xs text-stone-400 text-center mt-3">
                {paymentMethod === 'cash' ? 'Pay at counter when collecting your order' : `Pay ₹${total.toFixed(0)} via ${paymentMethod.toUpperCase()}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
