import { useState, useEffect } from 'react';
import { Plus, Minus, Star, X, Leaf, Drumstick, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/useAuth';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function FoodDetailModal({ item: initialItem, onClose }) {
  const { addItem, items, updateQty } = useCart();
  const { user } = useAuth();
  const [item, setItem] = useState(initialItem);
  const [qty, setQty] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const cartItem = items.find((i) => i.id === item.id);
  const cartQty = cartItem?.quantity || 0;
  const addOns = item.addOns ? JSON.parse(item.addOns) : [];
  const ingredients = item.ingredients ? JSON.parse(item.ingredients) : [];

  useEffect(() => {
    api.get(`/menu/${item.id}`).then((r) => setItem(r.data)).catch(() => {});
  }, [item.id]);

  const handleAddToCart = () => {
    if (!user) { toast.error('Please login to add items to cart'); return; }
    for (let i = 0; i < qty; i++) addItem(item);
    onClose();
  };

  const submitReview = async () => {
    if (!user) { toast.error('Login to submit a review'); return; }
    setSubmitting(true);
    try {
      await api.post(`/menu/${item.id}/review`, { rating: reviewRating, comment: reviewText });
      toast.success('Review submitted!');
      setReviewText('');
      const updated = await api.get(`/menu/${item.id}`);
      setItem(updated.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit review');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-cafe-bg rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto animate-slide-up">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-md transition-all">
          <X className="w-5 h-5 text-stone-600" />
        </button>

        {/* Image */}
        <div className="relative h-64 md:h-80 overflow-hidden rounded-t-3xl bg-cafe-border">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600'; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 flex gap-2">
            {item.isVeg ? <span className="badge-veg"><Leaf className="w-3 h-3" /> VEG</span>
              : <span className="badge-nonveg"><Drumstick className="w-3 h-3" /> NON-VEG</span>}
            {item.isSpecial && <span className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full">⭐ Today's Special</span>}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="font-display font-bold text-2xl text-primary">{item.name}</h2>
              <p className="text-stone-500 text-sm mt-1">{item.category?.name}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-2xl text-primary">₹{item.price}</p>
              {item.calories && <p className="text-xs text-stone-400">{item.calories} cal</p>}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">{[1,2,3,4,5].map((s) => <Star key={s} className={`w-4 h-4 ${s <= Math.round(item.rating) ? 'star-filled fill-amber-400' : 'star-empty'}`} />)}</div>
            <span className="text-sm text-stone-600 font-medium">{item.rating?.toFixed(1)} ({item.ratingCount} reviews)</span>
          </div>

          <p className="text-stone-600 leading-relaxed mb-6">{item.description}</p>

          {/* Ingredients */}
          {ingredients.length > 0 && (
            <div className="mb-5">
              <h4 className="font-semibold text-stone-800 text-sm mb-2.5">Ingredients</h4>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ing) => (
                  <span key={ing} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{ing}</span>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons */}
          {addOns.length > 0 && (
            <div className="mb-5">
              <h4 className="font-semibold text-stone-800 text-sm mb-2.5">Add-ons & Customization</h4>
              <div className="flex flex-wrap gap-2">
                {addOns.map((ao) => (
                  <span key={ao.name} className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium border border-secondary/20">
                    {ao.name} {ao.price > 0 ? `+₹${ao.price}` : ao.price < 0 ? `-₹${Math.abs(ao.price)}` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Cart */}
          {item.isAvailable ? (
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-3 bg-primary/10 rounded-full px-4 py-2">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-dark transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-primary text-lg w-8 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-dark transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Add {qty} to Cart — ₹{(item.price * qty).toFixed(0)}
              </button>
            </div>
          ) : (
            <div className="mt-6 text-center py-4 bg-stone-100 rounded-2xl text-stone-500 font-semibold">Currently Unavailable</div>
          )}

          {/* Reviews */}
          <div className="mt-8 border-t border-cafe-border pt-6">
            <h4 className="font-bold text-stone-800 mb-4">Customer Reviews</h4>
            {item.reviews?.length === 0 ? (
              <p className="text-stone-400 text-sm">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-4 max-h-48 overflow-y-auto pr-1">
                {item.reviews?.map((r) => (
                  <div key={r.id} className="bg-white rounded-xl p-4 border border-cafe-border">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-sm text-stone-800">{r.user?.name}</span>
                      <div className="flex">{[1,2,3,4,5].map((s) => <Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />)}</div>
                    </div>
                    {r.comment && <p className="text-sm text-stone-600">{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Write review */}
            {user && (
              <div className="mt-4 bg-white rounded-xl p-4 border border-cafe-border">
                <p className="font-semibold text-sm text-stone-800 mb-3">Write a review</p>
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map((s) => (
                    <button key={s} onClick={() => setReviewRating(s)}>
                      <Star className={`w-5 h-5 cursor-pointer transition-colors ${s <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300 hover:text-amber-300'}`} />
                    </button>
                  ))}
                </div>
                <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Share your experience..."
                  className="input-field text-sm resize-none h-20 mb-3" />
                <button onClick={submitReview} disabled={submitting} className="btn-primary !py-2 text-sm w-full">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
