import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Coffee, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success(`Welcome back, ${result.user.name.split(' ')[0]}! ☕`);
      navigate(result.user.role === 'admin' ? '/admin' : '/');
    } else {
      toast.error(result.error);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@campuscafe.edu', password: 'admin123' });
    else setForm({ email: 'rahul@student.edu', password: 'student123' });
  };

  return (
    <div className="min-h-screen bg-cafe-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl text-primary">Welcome Back</h1>
          <p className="text-stone-500 mt-1">Sign in to your Campus Café account</p>
        </div>

        {/* Demo buttons */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => fillDemo('student')} className="flex-1 py-2 rounded-xl border border-secondary/40 text-secondary text-xs font-semibold hover:bg-secondary/10 transition-colors">
            🎓 Demo Student
          </button>
          <button onClick={() => fillDemo('admin')} className="flex-1 py-2 rounded-xl border border-primary/40 text-primary text-xs font-semibold hover:bg-primary/10 transition-colors">
            ⚡ Demo Admin
          </button>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@student.edu" required className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" required className="input-field pr-12" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-stone-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-secondary font-semibold hover:text-secondary-dark">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
