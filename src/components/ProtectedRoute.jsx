import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, isAdmin, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={adminOnly ? '/admin/login' : '/login'} replace />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-border p-10 text-center shadow-card">
          <h2 className="text-2xl font-black text-secondary mb-2">Access denied</h2>
          <p className="text-muted text-sm mb-6">
            Only store staff can manage products. Customers can shop but cannot add, edit, or delete items.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/" className="btn-primary text-center">
              Go to shop
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="text-sm font-bold text-muted hover:text-primary"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
