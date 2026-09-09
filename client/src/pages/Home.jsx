import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, Star, Clock, Leaf, ChefHat, Zap, Shield, TrendingUp } from 'lucide-react';
import api from '../api/axios';
import FoodCard from '../components/FoodCard';
import FoodDetailModal from '../components/FoodDetailModal';

const HERO_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80';

const REVIEWS = [
  { name: 'Priya R.', id: 'CS2023045', text: 'The masala dosa here is legendary! Best campus food I\'ve had.', rating: 5, avatar: '🎓' },
  { name: 'Arjun M.', id: 'EC2022078', text: 'Love the cold coffee — perfect pick-me-up after long lectures!', rating: 5, avatar: '📚' },
  { name: 'Sneha P.', id: 'ME2024012', text: 'Super affordable prices and the food quality is consistently good.', rating: 4, avatar: '🏆' },
  { name: 'Karthik V.', id: 'CS2023089', text: 'The paneer roll is my go-to. Never disappoints!', rating: 5, avatar: '🌟' },
];

const FEATURES = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Average prep time of just 12 minutes. Order, wait, enjoy.' },
  { icon: Leaf, title: 'Fresh Everyday', desc: 'Ingredients sourced fresh every morning. No compromises.' },
  { icon: Shield, title: 'Hygiene First', desc: 'FSSAI certified kitchen with daily sanitation checks.' },
  { icon: TrendingUp, title: 'Student Prices', desc: 'Meals starting at ₹20. Designed for your college budget.' },
];

export default function Home() {
  const [specials, setSpecials] = useState([]);
  const [popular, setPopular] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    api.get('/menu/specials').then((r) => setSpecials(r.data)).catch(() => {});
    api.get('/menu?sort=popular').then((r) => setPopular(r.data.slice(0, 4))).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="Campus Café food" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white pt-20">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 text-sm font-medium mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Open Now · Closes at 8:00 PM
          </div>
          <h1 className="font-display font-bold text-5xl md:text-7xl leading-tight mb-4 animate-slide-up">
            Good Food.<br />
            <span className="text-secondary">Great Campus.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Fresh, affordable meals made for your college day. Order online, skip the queue.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/menu" className="btn-secondary flex items-center gap-2 text-base !px-8 !py-4">
              Explore Menu <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/menu" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-primary text-base !px-8 !py-4">
              Order Now
            </Link>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[['500+', 'Daily Orders'], ['30+', 'Menu Items'], ['4.8★', 'Rating']].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="font-display font-bold text-2xl md:text-3xl text-white">{num}</p>
                <p className="text-white/70 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-white/70 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── Today's Specials ─────────────────────────────────── */}
      {specials.length > 0 && (
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-2">Limited Time</p>
              <h2 className="section-title">Today's Specials</h2>
              <p className="section-subtitle">Chef's handpicked items — fresh and special every day</p>
            </div>
            <Link to="/menu" className="btn-ghost hidden md:flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specials.slice(0, 6).map((item) => (
              <FoodCard key={item.id} item={item} onClick={setSelectedItem} />
            ))}
          </div>
        </section>
      )}

      {/* ── Popular Items ─────────────────────────────────────── */}
      {popular.length > 0 && (
        <section className="py-16 bg-white">
          <div className="px-4 max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-2">Student Favourites</p>
                <h2 className="section-title">Most Popular</h2>
                <p className="section-subtitle">What your fellow students are ordering right now</p>
              </div>
              <Link to="/menu?sort=popular" className="btn-ghost hidden md:flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popular.map((item) => (
                <FoodCard key={item.id} item={item} onClick={setSelectedItem} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Categories ───────────────────────────────────────── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-2">Browse</p>
          <h2 className="section-title">Food Categories</h2>
          <p className="section-subtitle">From morning chai to evening desserts</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            { name: 'Breakfast', icon: '🌅', color: 'bg-orange-50 hover:bg-orange-100 border-orange-200' },
            { name: 'South Indian', icon: '🥘', color: 'bg-amber-50 hover:bg-amber-100 border-amber-200' },
            { name: 'North Indian', icon: '🍛', color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200' },
            { name: 'Snacks', icon: '🍟', color: 'bg-red-50 hover:bg-red-100 border-red-200' },
            { name: 'Fast Food', icon: '🍔', color: 'bg-rose-50 hover:bg-rose-100 border-rose-200' },
            { name: 'Chinese', icon: '🍜', color: 'bg-purple-50 hover:bg-purple-100 border-purple-200' },
            { name: 'Beverages', icon: '☕', color: 'bg-brown-50 hover:bg-stone-100 border-stone-200 bg-stone-50' },
            { name: 'Desserts', icon: '🍰', color: 'bg-pink-50 hover:bg-pink-100 border-pink-200' },
          ].map((cat) => (
            <Link key={cat.name} to={`/menu?category=${cat.name}`}
              className={`${cat.color} border rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer`}>
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-xs font-semibold text-stone-700 text-center leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Why Choose Us ──────────────────────────────────────── */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-2">Why Campus Café</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white">More than just a canteen</h2>
            <p className="text-white/70 text-lg mt-2">We're your second home on campus</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center group">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary transition-colors duration-300">
                  <Icon className="w-7 h-7 text-secondary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Student Reviews ─────────────────────────────────────── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-2">Testimonials</p>
          <h2 className="section-title">What Students Say</h2>
          <p className="section-subtitle">Real feedback from your campus community</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((r) => (
            <div key={r.name} className="card p-6 hover:scale-[1.02]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">{r.avatar}</div>
                <div>
                  <p className="font-semibold text-stone-800 text-sm">{r.name}</p>
                  <p className="text-xs text-stone-400">{r.id}</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < r.rating ? 'star-filled fill-amber-400' : 'star-empty'}`} />
                ))}
              </div>
              <p className="text-sm text-stone-600 leading-relaxed italic">"{r.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Opening Hours ──────────────────────────────────────── */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h2 className="section-title mb-2">Opening Hours</h2>
          <p className="text-stone-500 mb-8">We're here when hunger strikes</p>
          <div className="card p-8 max-w-md mx-auto">
            {[['Monday – Friday', '7:00 AM – 8:00 PM', true], ['Saturday', '8:00 AM – 4:00 PM', true], ['Sunday', 'Closed', false]].map(([day, time, open]) => (
              <div key={day} className="flex justify-between items-center py-3 border-b border-cafe-border last:border-0">
                <span className="font-medium text-stone-700">{day}</span>
                <span className={`font-semibold text-sm ${open ? 'text-primary' : 'text-stone-400'}`}>{time}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="btn-primary">Order Now</Link>
            <Link to="/about" className="btn-outline">Learn More</Link>
          </div>
        </div>
      </section>

      {/* Food Detail Modal */}
      {selectedItem && <FoodDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}
