import { useState } from 'react';
import { Star, Plus, Minus, Heart, Leaf, Drumstick } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

export default function FoodCard({ item, onClick }) {
  const { addItem, items, updateQty } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const cartItem = items.find((i) => i.id === item.id);
  const qty = cartItem?.quantity || 0;

  const fallbackImg = `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500`;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    addItem(item);
  };
  const handleQty = (e, delta) => {
    e.stopPropagation();
    updateQty(item.id, qty + delta);
  };

  return (
    <div onClick={() => onClick?.(item)}
      className="card group cursor-pointer overflow-hidden hover:scale-[1.02] transition-all duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-cafe-border">
        <img
          src={imgError ? fallbackImg : item.image}
          alt={item.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Veg/Non-veg badge */}
        <div className="absolute top-3 left-3">
          {item.isVeg ? (
            <span className="badge-veg"><Leaf className="w-3 h-3" /> VEG</span>
          ) : (
            <span className="badge-nonveg"><Drumstick className="w-3 h-3" /> NON-VEG</span>
          )}
        </div>
        {/* Today's Special badge */}
        {item.isSpecial && (
          <div className="absolute top-3 right-3 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full">
            ⭐ Special
          </div>
        )}
        {/* Unavailable overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-black/50 px-3 py-1 rounded-full">Currently Unavailable</span>
          </div>
        )}
        {/* Favorite button */}
        <button onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-sm transition-colors opacity-0 group-hover:opacity-100">
          <Heart className="w-4 h-4 text-stone-400 hover:text-red-500 hover:fill-red-500 transition-colors" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-stone-800 group-hover:text-primary transition-colors leading-tight">{item.name}</h3>
          <span className="price-tag shrink-0">₹{item.price}</span>
        </div>

        <p className="text-xs text-stone-500 line-clamp-2 mb-3 leading-relaxed">{item.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(item.rating) ? 'star-filled fill-amber-400' : 'star-empty'}`} />
            ))}
          </div>
          <span className="text-xs text-stone-500">({item.ratingCount})</span>
        </div>

        {/* Add to cart */}
        {item.isAvailable && (
          <div className="flex items-center justify-between">
            {qty === 0 ? (
              <button onClick={handleAdd}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary-dark active:scale-95 transition-all w-full justify-center shadow-md hover:shadow-lg">
                <Plus className="w-4 h-4" /> Add to Cart
              </button>
            ) : (
              <div className="flex items-center gap-3 w-full justify-center bg-primary/10 rounded-full px-4 py-1.5">
                <button onClick={(e) => handleQty(e, -1)} className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors active:scale-90">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-primary w-6 text-center">{qty}</span>
                <button onClick={(e) => handleQty(e, 1)} className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors active:scale-90">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
