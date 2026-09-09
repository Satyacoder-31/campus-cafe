import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Star, Leaf, Drumstick, Search } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', description: '', price: '', categoryId: '', isVeg: true, isAvailable: true, isSpecial: false, calories: '', image: '', ingredients: '', addOns: '' };

export default function MenuManagement() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchItems = () => {
    api.get('/admin/menu').then((r) => { setItems(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
    api.get('/menu/categories').then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditing(null); setShowForm(true); };
  const openEdit = (item) => {
    setForm({
      name: item.name, description: item.description, price: item.price, categoryId: item.categoryId,
      isVeg: item.isVeg, isAvailable: item.isAvailable, isSpecial: item.isSpecial,
      calories: item.calories || '', image: item.image || '',
      ingredients: item.ingredients ? JSON.parse(item.ingredients).join(', ') : '',
      addOns: item.addOns ? JSON.parse(item.addOns).map((a) => `${a.name}:${a.price}`).join(', ') : '',
    });
    setEditing(item);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.categoryId) { toast.error('Name, price, and category are required'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        ingredients: form.ingredients ? JSON.stringify(form.ingredients.split(',').map((s) => s.trim())) : undefined,
        addOns: form.addOns ? JSON.stringify(form.addOns.split(',').map((s) => { const [n, p] = s.trim().split(':'); return { name: n?.trim(), price: parseFloat(p) || 0 }; })) : undefined,
      };
      if (editing) {
        await api.put(`/admin/menu/${editing.id}`, payload);
        toast.success('Item updated!');
      } else {
        await api.post('/admin/menu', payload);
        toast.success('Item added!');
      }
      fetchItems();
      setShowForm(false);
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to save item'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/menu/${id}`);
      toast.success('Item deleted');
      fetchItems();
      setDeleteId(null);
    } catch { toast.error('Failed to delete item'); }
  };

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-stone-800">Menu Management</h1><p className="text-stone-500 text-sm">{items.length} items</p></div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm !py-2.5"><Plus className="w-4 h-4" /> Add Item</button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items..." className="input-field pl-11 bg-white" />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-cafe-border shadow-card overflow-hidden hover:shadow-card-hover transition-all group">
              <div className="relative h-36 overflow-hidden bg-cafe-border">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300'; }} />
                <div className="absolute top-2 left-2 flex gap-1">
                  {item.isVeg ? <span className="badge-veg text-xs"><Leaf className="w-3 h-3" /></span> : <span className="badge-nonveg text-xs"><Drumstick className="w-3 h-3" /></span>}
                  {item.isSpecial && <span className="bg-secondary text-white text-xs px-1.5 py-0.5 rounded-full font-bold">★</span>}
                  {!item.isAvailable && <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">Off</span>}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-stone-800 text-sm">{item.name}</h3>
                  <span className="font-bold text-primary text-sm">₹{item.price}</span>
                </div>
                <p className="text-xs text-stone-400 mb-1">{item.category?.name}</p>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-stone-500">{item.rating?.toFixed(1)} ({item.ratingCount})</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(item)} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors">
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => setDeleteId(item.id)} className="px-3 py-1.5 rounded-lg bg-red-50 text-error text-xs hover:bg-red-100 transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-cafe-bg rounded-3xl shadow-2xl w-full max-w-2xl animate-slide-up overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-cafe-border sticky top-0 bg-cafe-bg">
              <h3 className="font-bold text-primary text-lg">{editing ? 'Edit Item' : 'Add New Item'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-cafe-border"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Item Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. Masala Dosa" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Price (₹) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" placeholder="70" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Category *</label>
                  <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="input-field">
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none h-20 text-sm" placeholder="Short description..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Image URL</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input-field text-sm" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Calories</label>
                  <input type="number" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} className="input-field" placeholder="350" />
                </div>
                <div className="flex flex-col gap-2 pt-5">
                  {[['isVeg', 'Vegetarian'], ['isAvailable', 'Available'], ['isSpecial', "Today's Special"]].map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} className="w-4 h-4 accent-primary" />
                      <span className="text-xs font-medium text-stone-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Ingredients (comma-separated)</label>
                <input value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} className="input-field text-sm" placeholder="Potato, Onion, Spices" />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Add-ons (Name:Price, comma-separated)</label>
                <input value={form.addOns} onChange={(e) => setForm({ ...form, addOns: e.target.value })} className="input-field text-sm" placeholder="Extra Cheese:20, Sauce:10" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                  {saving ? 'Saving...' : editing ? 'Update Item' : 'Add Item'}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-slide-up text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="font-bold text-stone-800 mb-2">Delete this item?</h3>
            <p className="text-stone-500 text-sm mb-6">This action cannot be undone. Orders with this item will not be affected.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-error text-white rounded-xl font-semibold hover:bg-red-700 transition-colors">Delete</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-cafe-border rounded-xl font-semibold text-stone-600 hover:bg-cafe-bg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
