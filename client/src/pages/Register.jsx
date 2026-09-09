import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Coffee, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import toast from 'react-hot-toast';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', collegeId: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.collegeId.trim()) e.collegeId = 'College ID is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await register({ name: form.name, collegeId: form.collegeId, email: form.email, phone: form.phone, password: form.password });
    if (result.success) {
      toast.success('Account created! Welcome to Campus Café ☕');
      navigate('/');
    } else {
      toast.error(result.error);
    }
  };

  const setField = (key, val) => setForm({ ...form, [key]: val });

  return (
    <div className="min-h-screen bg-cafe-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl text-primary">Join Campus Café</h1>
          <p className="text-stone-500 mt-1">Create your account to start ordering</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Rahul Sharma' },
              { key: 'collegeId', label: 'College ID', type: 'text', placeholder: 'CS2023001' },
              { key: 'email', label: 'Email Address', type: 'email', placeholder: 'rahul@student.edu' },
              { key: 'phone', label: 'Phone Number (optional)', type: 'tel', placeholder: '9876543210' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">{label}</label>
                <input type={type} value={form[key]} onChange={(e) => setField(key, e.target.value)}
                  placeholder={placeholder} className={`input-field ${errors[key] ? 'border-error' : ''}`} />
                {errors[key] && <p className="text-error text-xs mt-1">{errors[key]}</p>}
              </div>
            ))}

            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => setField('password', e.target.value)}
                  placeholder="Min 6 characters" className={`input-field pr-12 ${errors.password ? 'border-error' : ''}`} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">Confirm Password</label>
              <input type="password" value={form.confirmPassword} onChange={(e) => setField('confirmPassword', e.target.value)}
                placeholder="Repeat password" className={`input-field ${errors.confirmPassword ? 'border-error' : ''}`} />
              {errors.confirmPassword && <p className="text-error text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-stone-500 text-sm mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary font-semibold hover:text-secondary-dark">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
