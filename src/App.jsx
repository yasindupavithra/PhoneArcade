import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductsCatalogProvider } from './context/ProductsCatalogContext';
import ProtectedRoute from './components/ProtectedRoute';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Brands from './components/Brands';
import ProductGrid from './components/ProductGrid';
import { ProductsTabRow, BrandGrid } from './components/HomeSections';
import Footer from './components/Footer';

// Pages
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Shop from './pages/Shop';
import Product from './pages/Product';
import BrandsPage from './pages/BrandsPage';
import CategoriesPage from './pages/CategoriesPage';
import Home from './pages/Home';

function App() {
  return (
    <AuthProvider>
      <ProductsCatalogProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/product/:id" element={<Product />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
      </ProductsCatalogProvider>
    </AuthProvider>
  );
}

export default App;
