import { useState, useEffect } from 'react';
import { Search, Users, ShoppingBag, TrendingUp } from 'lucide-react';
import api from '../../api/axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/users').then((r) => { setUsers(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.collegeId.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = users.reduce((s, u) => s + u.totalSpend, 0);
  const totalOrders = users.reduce((s, u) => s + (u._count?.orders || 0), 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">User Management</h1>
        <p className="text-stone-500 text-sm">{users.length} registered students</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Users, label: 'Total Students', value: users.length, color: 'bg-primary' },
          { icon: ShoppingBag, label: 'Total Orders', value: totalOrders, color: 'bg-secondary' },
          { icon: TrendingUp, label: 'Total Revenue', value: `₹${totalRevenue.toFixed(0)}`, color: 'bg-success' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-card border border-cafe-border flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5 text-white" /></div>
            <div><p className="text-xl font-bold text-stone-800">{value}</p><p className="text-xs text-stone-500">{label}</p></div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students..." className="input-field pl-11 bg-white" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card border border-cafe-border overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-stone-400"><div className="text-4xl mb-2">👤</div>No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cafe-bg border-b border-cafe-border">
                <tr>
                  {['Student', 'College ID', 'Email', 'Phone', 'Total Orders', 'Total Spent', 'Joined'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-stone-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cafe-border">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-cafe-bg/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-bold text-sm">{user.name[0]}</span>
                        </div>
                        <span className="font-medium text-stone-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-stone-600">{user.collegeId}</td>
                    <td className="px-5 py-3 text-stone-500 text-xs">{user.email}</td>
                    <td className="px-5 py-3 text-stone-500 text-xs">{user.phone || '-'}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">
                        <ShoppingBag className="w-3 h-3" /> {user._count?.orders || 0}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-primary">₹{user.totalSpend.toFixed(0)}</td>
                    <td className="px-5 py-3 text-xs text-stone-400">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
