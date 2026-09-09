import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Eye, X } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const STATUSES = ['all', 'placed', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
const STATUS_COLORS = { placed: 'bg-blue-100 text-blue-700', confirmed: 'bg-indigo-100 text-indigo-700', preparing: 'bg-amber-100 text-amber-700', ready: 'bg-green-100 text-green-700', completed: 'bg-stone-100 text-stone-600', cancelled: 'bg-red-100 text-red-700' };
const NEXT_STATUS = { placed: 'confirmed', confirmed: 'preparing', preparing: 'ready', ready: 'completed' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = () => {
    api.get('/admin/orders', { params: { status: statusFilter === 'all' ? undefined : statusFilter, search: search || undefined } })
      .then((r) => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [statusFilter, search]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      toast.success(`Order ${status}`);
      fetchOrders();
      if (selected?.id === id) setSelected({ ...selected, status });
    } catch { toast.error('Failed to update status'); }
    finally { setUpdating(null); }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Order Management</h1>
        <p className="text-stone-500 text-sm">{orders.length} orders · Live updates</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order number..."
            className="input-field pl-11 bg-white" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field appearance-none pr-10 bg-white capitalize">
            {STATUSES.map((s) => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap capitalize border transition-all ${statusFilter === s ? 'bg-primary text-white border-primary' : 'bg-white text-stone-600 border-cafe-border hover:border-primary/40'}`}>
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card border border-cafe-border overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-stone-400">
            <div className="text-4xl mb-2">📭</div>No orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cafe-bg border-b border-cafe-border">
                <tr>{['Order #', 'Student', 'Items', 'Total', 'Payment', 'Time', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-500 whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-cafe-border">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-cafe-bg/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-primary font-bold">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-800">{order.user?.name}</p>
                      <p className="text-xs text-stone-400">{order.user?.collegeId}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-stone-700">{order.items.map((i) => i.foodItem.name).join(', ').slice(0, 40)}{order.items.length > 1 ? '...' : ''}</p>
                      <p className="text-xs text-stone-400">{order.items.length} item(s)</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-primary">₹{order.total.toFixed(0)}</td>
                    <td className="px-4 py-3"><span className="capitalize text-xs bg-stone-100 px-2 py-1 rounded-full">{order.paymentMethod}</span></td>
                    <td className="px-4 py-3 text-xs text-stone-500 whitespace-nowrap">{new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="px-4 py-3">
                      <span className={`status-badge ${STATUS_COLORS[order.status]} capitalize`}>{order.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelected(order)} className="p-1.5 rounded-lg hover:bg-cafe-bg text-stone-500 hover:text-primary transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        {NEXT_STATUS[order.status] && (
                          <button onClick={() => updateStatus(order.id, NEXT_STATUS[order.status])}
                            disabled={updating === order.id}
                            className="px-2 py-1 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors capitalize disabled:opacity-50 whitespace-nowrap">
                            {updating === order.id ? '...' : `→ ${NEXT_STATUS[order.status]}`}
                          </button>
                        )}
                        {order.status !== 'cancelled' && order.status !== 'completed' && (
                          <button onClick={() => updateStatus(order.id, 'cancelled')}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-error transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-cafe-bg rounded-3xl shadow-2xl w-full max-w-lg animate-slide-up overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-cafe-border">
              <div>
                <h3 className="font-bold text-primary">{selected.orderNumber}</h3>
                <span className={`status-badge ${STATUS_COLORS[selected.status]} capitalize`}>{selected.status}</span>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-full hover:bg-cafe-border"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[['Student', selected.user?.name], ['College ID', selected.user?.collegeId], ['Payment', selected.paymentMethod?.toUpperCase()], ['Pickup', selected.pickupType]].map(([l, v]) => (
                  <div key={l} className="bg-white p-3 rounded-xl border border-cafe-border">
                    <p className="text-xs text-stone-400">{l}</p>
                    <p className="font-semibold text-stone-800">{v}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl p-4 border border-cafe-border">
                <h4 className="font-semibold text-stone-700 text-sm mb-3">Items Ordered</h4>
                <div className="space-y-2">
                  {selected.items.map((oi) => (
                    <div key={oi.id} className="flex justify-between text-sm">
                      <span>{oi.foodItem.name} × {oi.quantity}</span>
                      <span className="font-semibold text-primary">₹{(oi.price * oi.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-cafe-border font-bold text-primary flex justify-between">
                  <span>Total</span><span>₹{selected.total.toFixed(0)}</span>
                </div>
              </div>
              {/* Status controls */}
              <div className="flex flex-wrap gap-2">
                {['confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map((s) => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)}
                    disabled={selected.status === s || updating === selected.id}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize border transition-all
                      ${selected.status === s ? 'bg-primary text-white border-primary' : 'bg-white text-stone-600 border-cafe-border hover:border-primary hover:text-primary'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
