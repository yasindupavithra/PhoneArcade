import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Plus, Trash2, Edit2, LogOut, Package, Image as ImageIcon,
  Tag, DollarSign, Smartphone, Laptop, Watch, Headphones,
  Zap, Shield, Battery, Cable, X, Check, ArrowRight, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductSearch from '../components/ProductSearch';
import GsmarenaSpecFetcher from '../components/admin/GsmarenaSpecFetcher';
import { productMatchesQuery } from '../utils/searchProducts';
import { fetchGsmSpecs, applyGsmDataToForm } from '../utils/fetchGsmSpecs';

const categories = [
  { id: 'Mobile', label: 'Smartphones', icon: <Smartphone size={18} /> },
  { id: 'Speakers', label: 'Speakers', icon: <Zap size={18} /> },
  { id: 'Smartwatches', label: 'Smartwatches', icon: <Watch size={18} /> },
  { id: 'Cables & Adapters', label: 'Cables & Adapters', icon: <Cable size={18} /> },
  { id: 'Earphones & Headphones', label: 'Earphones & Headphones', icon: <Headphones size={18} /> },
  { id: 'Mobile Accessories', label: 'Mobile Accessories', icon: <Shield size={18} /> },
  { id: 'Chargers', label: 'Chargers', icon: <Zap size={18} /> },
  { id: 'Power Banks', label: 'Power Banks', icon: <Battery size={18} /> },
  { id: 'Protective Cases', label: 'Protective Cases', icon: <Shield size={18} /> },
  { id: 'Tablet', label: 'Tablets', icon: <Laptop size={18} /> },
];

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeSection, setActiveSection] = useState('Mobile');

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    originalPrice: '',
    image: '',
    category: 'Mobile',
    isNew: false,
    rating: 4.5,
    specs: '',
    fullSpecs: null,
    gsmLink: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [inventorySearch, setInventorySearch] = useState('');

  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const productsCollection = collection(db, 'products');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editId = params.get('edit');
    if (editId && products.length > 0) {
      const product = products.find(p => p.id === editId);
      if (product) {
        setFormData(product);
        setEditingId(editId);
        setImagePreview(product.image);
        setActiveSection(product.category === 'Mobile' ? 'Mobile' : 'Others');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [location, products]);

  const fetchProducts = async () => {
    try {
      const data = await getDocs(productsCollection);
      setProducts(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (err) {
      console.error("Error fetching products:", err);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);

    try {
      if (!isAdmin) {
        alert('Only staff accounts can change products.');
        setIsSaving(false);
        return;
      }

      if (!formData.image) {
        alert("Please provide an Image URL");
        setIsSaving(false);
        return;
      }

      let finalData = { ...formData };

      const needsGsm =
        activeSection === 'Mobile' &&
        (!finalData.fullSpecs || Object.keys(finalData.fullSpecs).length === 0);

      if (needsGsm && finalData.name?.trim()) {
        try {
          const gsm = await fetchGsmSpecs({ name: finalData.name, brand: finalData.brand });
          if (gsm.needsPick) {
            alert(
              'Several GSMArena models match this name. Click "Load from GSMArena", pick the correct phone, then save again.'
            );
            setIsSaving(false);
            return;
          }
          finalData = applyGsmDataToForm(finalData, gsm);
          setFormData(finalData);
          if (gsm.image) setImagePreview(gsm.image);
        } catch (gsmErr) {
          const proceed = window.confirm(
            `Could not auto-load GSMArena specs (${gsmErr.message}). Save product without full specs?`
          );
          if (!proceed) {
            setIsSaving(false);
            return;
          }
        }
      }

      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), {
          ...finalData,
          updatedAt: serverTimestamp(),
        });
        setEditingId(null);
      } else {
        await addDoc(productsCollection, {
          ...finalData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setFormData({
        name: '',
        brand: '',
        price: '',
        originalPrice: '',
        image: '',
        category: activeSection === 'Mobile' ? 'Mobile' : 'Speakers',
        isNew: false,
        rating: 4.5,
        specs: '',
        fullSpecs: null,
        gsmLink: '',
      });
      setImagePreview(null);
      fetchProducts();
      alert(editingId ? "Product updated successfully!" : "Product added successfully!");
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Error saving product: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    }
  };

  const startNewProduct = () => {
    setEditingId(null);
    setImagePreview(null);
    setFormData({
      name: '',
      brand: '',
      price: '',
      originalPrice: '',
      image: '',
      category: activeSection === 'Mobile' ? 'Mobile' : 'Speakers',
      isNew: false,
      rating: 4.5,
      specs: '',
      fullSpecs: null,
      gsmLink: '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setImagePreview(product.image);
    setActiveSection(product.category === 'Mobile' ? 'Mobile' : 'Others');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = products.filter((p) => {
    const sectionMatch = activeSection === 'Mobile' ? p.category === 'Mobile' : p.category !== 'Mobile';
    if (!sectionMatch) return false;
    return productMatchesQuery(p, inventorySearch);
  });

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      <nav className="bg-white/95 backdrop-blur-md border-b border-border py-4 sticky top-0 z-[100] mb-8 shadow-sm">
        <div className="container flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white shadow-lg">
              <Package size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black text-secondary leading-none uppercase tracking-tighter">Phone Arcade</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Management Console</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={startNewProduct}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/25 hover:bg-primary-dark"
            >
              <Plus size={18} /> Add Product
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="group flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all font-bold text-xs uppercase tracking-widest border border-slate-100"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-10">
          <button
            onClick={() => { setActiveSection('Mobile'); setFormData({ ...formData, category: 'Mobile' }); }}
            className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all flex items-center gap-2.5 shadow-sm border ${activeSection === 'Mobile' ? 'bg-secondary text-white border-secondary shadow-secondary/20 -translate-y-1' : 'bg-white text-slate-400 border-slate-200 hover:border-secondary hover:text-secondary'}`}
          >
            <Smartphone size={16} /> Smartphones
          </button>
          <button
            onClick={() => { setActiveSection('Others'); setFormData({ ...formData, category: 'Speakers' }); }}
            className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all flex items-center gap-2.5 shadow-sm border ${activeSection === 'Others' ? 'bg-secondary text-white border-secondary shadow-secondary/20 -translate-y-1' : 'bg-white text-slate-400 border-slate-200 hover:border-secondary hover:text-secondary'}`}
          >
            <Zap size={16} /> Accessories & Others
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Form Card */}
          <div className="lg:col-span-5 xl:col-span-4">
            <motion.div
              layout
              className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 sticky top-28 overflow-hidden"
            >
              {/* Form Title */}
              <div className="relative z-10 flex items-center gap-4 mb-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${editingId ? 'bg-amber-500 shadow-amber-200' : 'bg-primary shadow-primary/20'}`}>
                  {editingId ? <Edit2 size={28} /> : <Plus size={28} />}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-secondary leading-tight">
                    {editingId ? "Update Product" : `Add New ${activeSection === 'Mobile' ? 'Phone' : 'Item'}`}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Fill in the technical details below</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                {/* Product Name */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                    <Package size={12} className="text-primary" /> Product Name
                  </label>
                  <input
                    required value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={activeSection === 'Mobile' ? "e.g. iPhone 16 Pro Max" : "e.g. Sony WH-1000XM5"}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all font-bold text-secondary text-sm placeholder:text-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Brand */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                      <Tag size={12} className="text-primary" /> Brand
                    </label>
                    <input
                      required value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="e.g. Apple"
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all font-bold text-secondary text-sm placeholder:text-slate-300"
                    />
                  </div>
                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                      <Shield size={12} className="text-primary" /> Category
                    </label>
                    <div className="relative">
                      <select
                        disabled={activeSection === 'Mobile'}
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all font-bold text-secondary text-sm appearance-none cursor-pointer disabled:opacity-50"
                      >
                        {categories.filter(c => activeSection === 'Mobile' ? c.id === 'Mobile' : c.id !== 'Mobile').map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Plus size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                {activeSection === 'Mobile' && (
                  <GsmarenaSpecFetcher
                    formData={formData}
                    setFormData={setFormData}
                    setImagePreview={setImagePreview}
                    disabled={isSaving}
                    category={formData.category}
                  />
                )}

                <div className="grid grid-cols-2 gap-4">
                  {/* Sale Price */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                      <DollarSign size={12} className="text-primary" /> Selling Price
                    </label>
                    <input
                      required value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Rs. 425,000"
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all font-black text-primary text-sm placeholder:text-slate-300"
                    />
                  </div>
                  {/* Original Price */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                      <DollarSign size={12} className="text-slate-300" /> Original Price
                    </label>
                    <input
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="Rs. 450,000"
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all font-bold text-slate-400 text-sm placeholder:text-slate-200"
                    />
                  </div>
                </div>

                {/* Image URL Section - THE ONLY WAY */}
                <div className="space-y-3 bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2 ml-1">
                    <ImageIcon size={14} className="text-primary" /> Product Image Link
                  </label>

                  <div className="relative group">
                    <input
                      required
                      value={formData.image}
                      onChange={(e) => {
                        setFormData({ ...formData, image: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      placeholder="Right click photo -> Copy image address -> Paste here"
                      className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-200 focus:border-primary focus:outline-none transition-all text-xs font-bold text-secondary"
                    />
                  </div>

                  <AnimatePresence>
                    {imagePreview && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full aspect-video rounded-2xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center p-3 shadow-inner group"
                      >
                        <img src={imagePreview} alt="Preview" className="h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <div className="px-2 py-1 bg-emerald-500 text-white text-[8px] font-black rounded uppercase shadow-sm">Preview Live</div>
                          <button
                            type="button"
                            onClick={() => { setImagePreview(null); setFormData({ ...formData, image: '' }); }}
                            className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-lg"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-3 px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    id="isNew"
                    className="w-5 h-5 accent-primary rounded-lg cursor-pointer"
                  />
                  <label htmlFor="isNew" className="text-xs font-black text-secondary uppercase tracking-tight cursor-pointer select-none">Mark as New Arrival</label>
                </div>

                <div className="flex gap-3 pt-4">
                  {editingId && (
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => {
                        setEditingId(null);
                        setImagePreview(null);
                        setFormData({
                          name: '',
                          brand: '',
                          price: '',
                          originalPrice: '',
                          image: '',
                          category: activeSection === 'Mobile' ? 'Mobile' : 'Speakers',
                          isNew: false,
                          rating: 4.5,
                          specs: '',
                          fullSpecs: null,
                          gsmLink: '',
                        });
                      }}
                      className="flex-grow py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-200 transition-all border border-slate-200"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`flex-[2] py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2.5 ${editingId ? 'bg-amber-500 shadow-amber-200' : 'bg-primary shadow-primary/30'} text-white disabled:opacity-70`}
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      editingId ? "Update Product" : "Commit to Database"
                    )}
                    {!isSaving && <ArrowRight size={14} />}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="flex flex-col gap-6 mb-10">
              <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-black text-secondary uppercase tracking-tighter">
                    Live Inventory Manager
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded uppercase">
                      {activeSection === 'Mobile' ? 'Smartphones' : 'Accessories'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      — {filteredProducts.length} items
                      {inventorySearch.trim() ? ` matching "${inventorySearch.trim()}"` : ''}
                    </span>
                  </div>
                </div>
                <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Realtime Sync
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Search size={16} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Search inventory
                  </span>
                </div>
                <ProductSearch
                  mode="admin"
                  variant="compact"
                  onAdminSelect={(product) => startEdit(product)}
                  onQueryChange={setInventorySearch}
                  placeholder="Type phone name, brand, category..."
                />
              </div>
            </div>

            <div className="grid gap-6">
              {loading ? (
                <div className="flex flex-col items-center py-40 text-slate-300">
                  <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin mb-6"></div>
                  <p className="font-black uppercase tracking-[0.3em] text-[10px]">Accessing Firestore...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-24 text-center rounded-[3.5rem] border-2 border-dashed border-slate-200 shadow-inner"
                >
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <Package size={40} className="text-slate-200" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-300 mb-2 uppercase tracking-tighter">Inventory Empty</h4>
                  <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">No products found in this classification.</p>
                </motion.div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-6">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-6 rounded-[2.5rem] flex flex-col items-center gap-6 group hover:border-primary transition-all shadow-md hover:shadow-2xl hover:shadow-primary/5 border border-transparent relative overflow-hidden"
                    >
                      {/* Background Decoration */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-primary/5 transition-colors duration-500"></div>

                      <div className="w-32 h-32 bg-slate-50 rounded-3xl overflow-hidden p-4 flex-shrink-0 relative z-10">
                        <img src={product.image} alt="" className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out" />
                        {product.isNew && <span className="absolute top-2 left-2 bg-secondary text-white text-[7px] font-black px-2 py-1 rounded-lg uppercase shadow-lg shadow-secondary/30">New</span>}
                      </div>

                      <div className="flex-grow text-center relative z-10 w-full">
                        <div className="flex flex-col items-center gap-1 mb-2">
                          <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">{product.brand}</span>
                          <h3 className="font-black text-xl text-secondary group-hover:text-primary transition-colors leading-tight line-clamp-1">{product.name}</h3>
                        </div>

                        <div className="flex flex-col items-center gap-0.5 mb-4">
                          <p className="text-secondary font-black text-2xl tracking-tighter">{product.price}</p>
                          {product.originalPrice && <p className="text-[10px] text-slate-300 line-through font-bold">{product.originalPrice}</p>}
                        </div>

                        <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-50">
                          <button
                            onClick={() => startEdit(product)}
                            className="flex-grow flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-amber-500 hover:text-white text-slate-400 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest shadow-sm"
                          >
                            <Edit2 size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-3 bg-slate-50 hover:bg-red-500 hover:text-white text-slate-400 rounded-xl transition-all shadow-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
