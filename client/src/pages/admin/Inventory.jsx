import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingDown, Package, Edit3, Check, X } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    api.get('/admin/inventory').then((r) => { setInventory(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const startEdit = (item) => {
    setEditing(item.id);
    setEditValues({ currentStock: item.currentStock, minStock: item.minStock });
  };

  const saveEdit = async (id) => {
    try {
      const updated = await api.put(`/admin/inventory/${id}`, editValues);
      setInventory((prev) => prev.map((i) => i.id === id ? { ...i, ...updated.data } : i));
      toast.success('Stock updated!');
      setEditing(null);
    } catch { toast.error('Failed to update stock'); }
  };

  const lowStock = inventory.filter((i) => i.currentStock <= i.minStock);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Inventory Management</h1>
        <p className="text-stone-500 text-sm">{inventory.length} ingredients tracked</p>
      </div>

      {/* Alerts */}
      {lowStock.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-error" />
            <h3 className="font-bold text-error">Low Stock Alerts</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map((item) => (
              <span key={item.id} className="text-xs font-semibold text-error bg-red-100 border border-red-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <TrendingDown className="w-3 h-3" /> {item.ingredient}: {item.currentStock}{item.unit}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card border border-cafe-border overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cafe-bg border-b border-cafe-border">
                <tr>
                  {['Ingredient', 'Food Item', 'Current Stock', 'Min Stock', 'Unit', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-stone-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cafe-border">
                {inventory.map((item) => {
                  const isLow = item.currentStock <= item.minStock;
                  const isEditing = editing === item.id;
                  return (
                    <tr key={item.id} className={`hover:bg-cafe-bg/50 transition-colors ${isLow ? 'bg-red-50/30' : ''}`}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-stone-400" />
                          <span className="font-medium text-stone-800">{item.ingredient}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-stone-500 text-xs">{item.foodItem?.name}</td>
                      <td className="px-5 py-3">
                        {isEditing ? (
                          <input type="number" value={editValues.currentStock} onChange={(e) => setEditValues({ ...editValues, currentStock: e.target.value })}
                            className="w-24 px-2 py-1 border border-cafe-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50" />
                        ) : (
                          <span className={`font-semibold ${isLow ? 'text-error' : 'text-stone-800'}`}>{item.currentStock}</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {isEditing ? (
                          <input type="number" value={editValues.minStock} onChange={(e) => setEditValues({ ...editValues, minStock: e.target.value })}
                            className="w-24 px-2 py-1 border border-cafe-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50" />
                        ) : (
                          <span className="text-stone-500">{item.minStock}</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-stone-500">{item.unit}</td>
                      <td className="px-5 py-3">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-error bg-red-100 px-2 py-1 rounded-full">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-success bg-green-100 px-2 py-1 rounded-full">✓ OK</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {isEditing ? (
                          <div className="flex gap-1">
                            <button onClick={() => saveEdit(item.id)} className="w-7 h-7 bg-success rounded-lg flex items-center justify-center text-white hover:bg-green-700 transition-colors">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setEditing(null)} className="w-7 h-7 bg-stone-200 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-300 transition-colors">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => startEdit(item)} className="p-1.5 rounded-lg hover:bg-cafe-bg text-stone-400 hover:text-primary transition-colors">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
