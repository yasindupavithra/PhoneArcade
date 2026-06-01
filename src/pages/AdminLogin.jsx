import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle, Shield } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Hidden staff login — NOT linked from the public shop.
 * Real shops use a private URL like: yoursite.com/admin/login
 */
const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, logout, currentUser, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && currentUser && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [authLoading, currentUser, isAdmin, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const cred = await login(email, password);
      const userDoc = await getDoc(doc(db, 'users', cred.user.uid));

      if (!userDoc.exists() || userDoc.data().role !== 'admin') {
        await logout();
        setError('Access denied. This login is for store staff only.');
        setLoading(false);
        return;
      }

      navigate('/admin', { replace: true });
    } catch (err) {
      setError('Invalid email or password.');
      console.error(err);
    }
    setLoading(false);
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-[#001a3d] to-secondary px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/40">
            <Shield size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Staff Portal</h1>
          <p className="text-slate-400 text-sm mt-2">Phone Arcade — inventory management</p>
        </div>

        <div className="bg-white rounded-3xl border border-border shadow-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm">
              <AlertCircle size={20} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted mb-2 block">
                Staff email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11"
                  placeholder="admin@phonearcade.lk"
                  autoComplete="username"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !rounded-xl bg-secondary hover:bg-secondary/90">
              <LogIn size={20} />
              {loading ? 'Verifying...' : 'Enter Admin Panel'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted">
            <Link to="/" className="text-primary font-bold hover:underline">
              ← Back to customer shop
            </Link>
          </p>
        </div>

        <p className="text-center text-[10px] text-slate-500 mt-6 uppercase tracking-widest">
          This page is not shown to customers
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
