import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Clock, CheckCircle, UtensilsCrossed, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../../api/axios';

const COLORS = ['#5B321E', '#D97706', '#F59E0B', '#16A34A', '#7C3AED'];

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="bg-white rounded-2xl p-5 shadow-card border border-cafe-border flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-stone-800">{value}</p>
      <p className="text-sm text-stone-500">{label}</p>
      {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then((r) => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(7)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{[...Array(2)].map((_, i) => <div key={i} className="skeleton h-72 rounded-2xl" />)}</div>
    </div>
  );

  if (!data) return <div className="text-center text-stone-400 py-20">Failed to load dashboard</div>;

  const { stats, weekly, topItems } = data;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Dashboard</h1>
        <p className="text-stone-500 text-sm">Today's overview · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingBag} label="Today's Orders" value={stats.todayOrders} color="bg-primary" />
        <StatCard icon={TrendingUp} label="Today's Revenue" value={`₹${(stats.todayRevenue || 0).toFixed(0)}`} color="bg-secondary" />
        <StatCard icon={Clock} label="Pending Orders" value={stats.pendingOrders} color="bg-amber-500" sub="Needs attention" />
        <StatCard icon={CheckCircle} label="Completed Today" value={stats.completedOrders} color="bg-success" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={UtensilsCrossed} label="Menu Items" value={stats.totalItems} color="bg-purple-500" />
        <StatCard icon={AlertTriangle} label="Low Stock Alerts" value={stats.lowStockItems} color="bg-error" sub="Check inventory" />
        <div className="sm:col-span-2 bg-gradient-to-r from-primary to-primary-light rounded-2xl p-5 text-white flex items-center gap-4 shadow-card">
          <TrendingUp className="w-10 h-10 text-white/60" />
          <div>
            <p className="text-3xl font-bold">₹{(stats.todayRevenue || 0).toFixed(0)}</p>
            <p className="text-white/80 text-sm">Total Revenue Today</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly sales bar chart */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-cafe-border">
          <h3 className="font-bold text-stone-800 mb-1">Weekly Revenue</h3>
          <p className="text-xs text-stone-400 mb-5">Last 7 days</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3E8D8" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#78716C' }} />
              <YAxis tick={{ fontSize: 11, fill: '#78716C' }} />
              <Tooltip formatter={(v) => [`₹${v.toFixed(0)}`, 'Revenue']}
                contentStyle={{ background: '#FFFAF5', border: '1px solid #F3E8D8', borderRadius: '12px', fontFamily: 'Inter' }} />
              <Bar dataKey="revenue" fill="#D97706" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top items pie chart */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-cafe-border">
          <h3 className="font-bold text-stone-800 mb-1">Top Selling Items</h3>
          <p className="text-xs text-stone-400 mb-5">By quantity ordered</p>
          {topItems.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={topItems} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}>
                  {topItems.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#FFFAF5', border: '1px solid #F3E8D8', borderRadius: '12px', fontFamily: 'Inter' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="h-48 flex items-center justify-center text-stone-400 text-sm">No order data yet</div>}
        </div>
      </div>

      {/* Orders overview bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-card border border-cafe-border">
          <h3 className="font-bold text-stone-800 mb-1">Orders by Day</h3>
          <p className="text-xs text-stone-400 mb-5">Last 7 days</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3E8D8" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#78716C' }} />
              <YAxis tick={{ fontSize: 11, fill: '#78716C' }} />
              <Tooltip contentStyle={{ background: '#FFFAF5', border: '1px solid #F3E8D8', borderRadius: '12px', fontFamily: 'Inter' }} />
              <Bar dataKey="orders" fill="#5B321E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Top items list */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-cafe-border">
          <h3 className="font-bold text-stone-800 mb-4">Top Items Ranking</h3>
          <div className="space-y-3">
            {topItems.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">#{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm font-medium text-stone-800 mb-1">
                    <span>{item.name}</span><span className="text-stone-500">{item.count} sold</span>
                  </div>
                  <div className="h-1.5 bg-cafe-border rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: `${(item.count / (topItems[0]?.count || 1)) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
