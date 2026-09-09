import { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return { ...state, items: state.items.map((i) => i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i) };
      }
      return { ...state, items: [...state.items, { ...action.item, quantity: 1, addOns: [] }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'UPDATE_QTY': {
      if (action.qty <= 0) return { ...state, items: state.items.filter((i) => i.id !== action.id) };
      return { ...state, items: state.items.map((i) => i.id === action.id ? { ...i, quantity: action.qty } : i) };
    }
    case 'CLEAR':
      return { ...state, items: [], coupon: null, discount: 0 };
    case 'SET_COUPON':
      return { ...state, coupon: action.coupon, discount: action.discount };
    case 'REMOVE_COUPON':
      return { ...state, coupon: null, discount: 0 };
    default:
      return state;
  }
};

const TAX_RATE = 0.05;

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], coupon: null, discount: 0 }, () => {
    try {
      const saved = localStorage.getItem('cc_cart');
      return saved ? JSON.parse(saved) : { items: [], coupon: null, discount: 0 };
    } catch { return { items: [], coupon: null, discount: 0 }; }
  });

  // Persist cart
  useEffect(() => { localStorage.setItem('cc_cart', JSON.stringify(state)); }, [state]);

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', item });
    toast.success(`${item.name} added to cart!`, {
      icon: '🛒',
      style: { fontFamily: 'Inter', background: '#FFFAF5', color: '#292524', border: '1px solid #F3E8D8' },
    });
  };
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', id });
  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty });
  const clearCart = () => dispatch({ type: 'CLEAR' });
  const setCoupon = (coupon, discount) => dispatch({ type: 'SET_COUPON', coupon, discount });
  const removeCoupon = () => dispatch({ type: 'REMOVE_COUPON' });

  const subtotal = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal - state.discount + tax;
  const itemCount = state.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ ...state, subtotal, tax, total, itemCount, addItem, removeItem, updateQty, clearCart, setCoupon, removeCoupon }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
