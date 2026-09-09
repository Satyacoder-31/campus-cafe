import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { User, Mail, Phone, CreditCard, Edit3, LogOut, Save, X, Package, Heart } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      updateUser(data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen pt-24 pb-16 bg-cafe-bg">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="section-title mb-8">My Profile</h1>

        {/* Avatar + Name */}
        <div className="card p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-lg">
              <span className="font-display font-bold text-2xl text-white">{initials}</span>
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl text-primary">{user.name}</h2>
              <p className="text-stone-500 text-sm mt-0.5">College ID: <span className="font-mono font-semibold text-stone-700">{user.collegeId}</span></p>
              <span className={`inline-block mt-1.5 text-xs font-bold px-3 py-1 rounded-full ${user.role === 'admin' ? 'bg-primary text-white' : 'bg-secondary/15 text-secondary'}`}>
                {user.role === 'admin' ? '⚡ Admin Staff' : '🎓 Student'}
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-stone-800">Personal Information</h3>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="btn-ghost flex items-center gap-1.5 text-sm">
                <Edit3 className="w-4 h-4" /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={saveProfile} disabled={saving} className="btn-primary !py-1.5 !px-4 text-sm flex items-center gap-1.5">
                  <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => { setEditing(false); setForm({ name: user.name, phone: user.phone || '' }); }}
                  className="btn-ghost !py-1.5 !px-4 text-sm">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {[
              { icon: User, label: 'Full Name', field: 'name', value: user.name, editable: true },
              { icon: Mail, label: 'Email', value: user.email, editable: false },
              { icon: CreditCard, label: 'College ID', value: user.collegeId, editable: false },
              { icon: Phone, label: 'Phone', field: 'phone', value: user.phone || 'Not set', editable: true },
            ].map(({ icon: Icon, label, field, value, editable }) => (
              <div key={label} className="flex items-center gap-4 py-3 border-b border-cafe-border last:border-0">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-stone-500 mb-0.5">{label}</p>
                  {editing && editable && field ? (
                    <input value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="input-field text-sm py-1.5" />
                  ) : (
                    <p className="font-medium text-stone-800 text-sm">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link to="/my-orders" className="card p-5 flex items-center gap-3 hover:scale-[1.02] cursor-pointer">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"><Package className="w-5 h-5 text-primary" /></div>
            <div><p className="font-semibold text-stone-800 text-sm">My Orders</p><p className="text-xs text-stone-500">View history</p></div>
          </Link>
          <Link to="/menu" className="card p-5 flex items-center gap-3 hover:scale-[1.02] cursor-pointer">
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center"><Heart className="w-5 h-5 text-secondary" /></div>
            <div><p className="font-semibold text-stone-800 text-sm">Browse Menu</p><p className="text-xs text-stone-500">Order food</p></div>
          </Link>
        </div>

        {/* Admin dashboard shortcut */}
        {user.role === 'admin' && (
          <Link to="/admin" className="card p-5 flex items-center gap-3 mb-6 hover:scale-[1.01] bg-primary/5 border-primary/20">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">⚡</div>
            <div className="flex-1"><p className="font-semibold text-primary text-sm">Admin Dashboard</p><p className="text-xs text-stone-500">Manage orders, menu & more</p></div>
            <span className="text-primary">→</span>
          </Link>
        )}

        {/* Logout */}
        <button onClick={handleLogout} className="w-full card p-4 flex items-center justify-center gap-2 text-error font-semibold hover:bg-red-50 transition-colors border-red-100">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );
}
