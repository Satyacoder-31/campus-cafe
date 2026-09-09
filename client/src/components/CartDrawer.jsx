import { X, Plus, Minus, ShoppingBag, Trash2, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function CartDrawer({ open, onClose }) {
  const { items, subtotal, tax, total, discount, coupon, itemCount, updateQty, removeItem, clearCart, setCoupon, removeCoupon } = useCart();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleCheckout = () => { onClose(); navigate('/checkout'); };

  const applyDiscount = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const { data } = await api.post('/coupons/validate', { code: couponInput, subtotal });
      setCoupon(couponInput.toUpperCase(), data.discount);
      toast.success(`Coupon applied! You save ₹${data.discount.toFixed(0)}`);
      setCouponInput('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid coupon');
    } finally { setCouponLoading(false); }
  };

  if (!open) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-cafe-bg shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cafe-border bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-display font-bold text-lg text-primary">Your Cart</h2>
            {itemCount > 0 && <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{itemCount}</span>}
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button onClick={clearCart} className="text-xs text-stone-400 hover:text-error transition-colors flex items-center gap-1">
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-full hover:bg-cafe-border transition-colors">
              <X className="w-5 h-5 text-stone-600" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="font-display font-bold text-xl text-primary mb-2">Your cart is empty</h3>
              <p className="text-stone-500 text-sm mb-6">Add some delicious items from our menu!</p>
              <button onClick={() => { onClose(); navigate('/menu'); }} className="btn-primary">Browse Menu</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-white rounded-xl p-3 shadow-sm border border-cafe-border">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover shrink-0"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200'; }} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-stone-800 truncate">{item.name}</h4>
                  <p className="text-primary font-bold text-sm mt-0.5">₹{item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-2 bg-primary/10 rounded-full px-2 py-1">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-dark transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-primary w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-dark transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-xs text-stone-500 ml-auto font-semibold">₹{(item.price * item.quantity).toFixed(0)}</span>
                    <button onClick={() => removeItem(item.id)} className="text-stone-300 hover:text-error transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-cafe-border bg-white px-5 py-5">
            {/* Coupon */}
            <div className="mb-4">
              {coupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2 text-green-700 text-sm font-semibold">
                    <Tag className="w-4 h-4" /> {coupon} applied — Saved ₹{discount.toFixed(0)}
                  </div>
                  <button onClick={removeCoupon} className="text-green-500 hover:text-green-700"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Coupon code (try FIRST50)"
                    className="input-field text-sm py-2 flex-1" onKeyDown={(e) => e.key === 'Enter' && applyDiscount()} />
                  <button onClick={applyDiscount} disabled={couponLoading}
                    className="btn-secondary !py-2 !px-4 text-sm whitespace-nowrap">Apply</button>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="space-y-1.5 text-sm mb-4">
              <div className="flex justify-between text-stone-600"><span>Subtotal</span><span>₹{subtotal.toFixed(0)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600 font-medium"><span>Discount</span><span>-₹{discount.toFixed(0)}</span></div>}
              <div className="flex justify-between text-stone-600"><span>Tax (5%)</span><span>₹{tax.toFixed(0)}</span></div>
              <div className="flex justify-between font-bold text-primary text-base pt-2 border-t border-cafe-border">
                <span>Total</span><span>₹{total.toFixed(0)}</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="btn-primary w-full text-center">
              Proceed to Checkout →
            </button>
            <p className="text-xs text-stone-400 text-center mt-2">Free pickup from canteen counter</p>
          </div>
        )}
      </div>
    </>
  );
}
