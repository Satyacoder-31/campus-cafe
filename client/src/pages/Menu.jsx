import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import FoodCard from '../components/FoodCard';
import FoodDetailModal from '../components/FoodDetailModal';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    vegFilter: searchParams.get('veg') || 'all', // all | veg | nonveg
    sort: searchParams.get('sort') || 'popular',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  useEffect(() => {
    api.get('/menu/categories').then((r) => setCategories([{ id: 0, name: 'All', icon: '🍽️' }, ...r.data])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category !== 'All') params.category = filters.category;
    if (filters.vegFilter === 'veg') params.isVeg = 'true';
    if (filters.vegFilter === 'nonveg') params.isVeg = 'false';
    if (filters.sort) params.sort = filters.sort;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;

    api.get('/menu', { params }).then((r) => {
      setItems(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [filters]);

  const setFilter = (key, val) => setFilters((prev) => ({ ...prev, [key]: val }));

  const clearFilters = () => setFilters({ search: '', category: 'All', vegFilter: 'all', sort: 'popular', maxPrice: '' });

  const hasActiveFilters = filters.search || filters.category !== 'All' || filters.vegFilter !== 'all' || filters.maxPrice;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-cafe-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-2">Our Menu</p>
          <h1 className="section-title">What's Cooking Today</h1>
          <p className="section-subtitle">Fresh, made-to-order meals for every mood</p>
        </div>

        {/* Search + Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input value={filters.search} onChange={(e) => setFilter('search', e.target.value)}
              placeholder="Search for food..."
              className="input-field pl-12" />
            {filters.search && (
              <button onClick={() => setFilter('search', '')} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-stone-400 hover:text-stone-600" />
              </button>
            )}
          </div>
          {/* Sort */}
          <div className="relative">
            <select value={filters.sort} onChange={(e) => setFilter('sort', e.target.value)}
              className="input-field appearance-none pr-10 cursor-pointer bg-white min-w-[180px]">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          </div>
          {/* Filters toggle */}
          <button onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-medium text-sm transition-all ${filtersOpen || hasActiveFilters ? 'bg-primary text-white border-primary' : 'bg-white border-cafe-border text-stone-600 hover:border-primary hover:text-primary'}`}>
            <SlidersHorizontal className="w-4 h-4" /> Filters
            {hasActiveFilters && <span className="w-2 h-2 bg-secondary rounded-full" />}
          </button>
        </div>

        {/* Extended filters */}
        {filtersOpen && (
          <div className="bg-white rounded-2xl p-5 mb-6 border border-cafe-border shadow-card animate-slide-up">
            <div className="flex flex-wrap gap-4 items-end">
              {/* Veg filter */}
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-2 block">Food Type</label>
                <div className="flex gap-2">
                  {[['all', 'All'], ['veg', '🟢 Veg Only'], ['nonveg', '🔴 Non-Veg']].map(([val, label]) => (
                    <button key={val} onClick={() => setFilter('vegFilter', val)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filters.vegFilter === val ? 'bg-primary text-white' : 'bg-cafe-bg text-stone-600 hover:bg-cafe-border'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Max price */}
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-2 block">Max Price: {filters.maxPrice ? `₹${filters.maxPrice}` : 'Any'}</label>
                <input type="range" min="20" max="200" step="10" value={filters.maxPrice || 200}
                  onChange={(e) => setFilter('maxPrice', e.target.value === '200' ? '' : e.target.value)}
                  className="w-36 accent-primary" />
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-error hover:text-red-700 font-medium">
                  <X className="w-4 h-4" /> Clear All
                </button>
              )}
            </div>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-thin">
          {categories.map((cat) => (
            <button key={cat.name} onClick={() => setFilter('category', cat.name)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border shrink-0
                ${filters.category === cat.name ? 'tab-active border-primary shadow-md' : 'tab-inactive border-cafe-border'}`}>
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-stone-500 text-sm mb-5">{items.length} {items.length === 1 ? 'item' : 'items'} found</p>
        )}

        {/* Food grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="skeleton h-48 w-full" />
                <div className="bg-white p-4 space-y-2">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-full rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display font-bold text-xl text-primary mb-2">No items found</h3>
            <p className="text-stone-500 mb-6">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <FoodCard key={item.id} item={item} onClick={setSelectedItem} />
            ))}
          </div>
        )}
      </div>

      {selectedItem && <FoodDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}
