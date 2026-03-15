import { useState } from 'react';
import SEO from '@/components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Star, Truck, Gift,
  BarChart3, Settings, LogOut, Bell, Search, Plus, Edit, Trash2,
  Check, X, Eye, TrendingUp, DollarSign, Clock, AlertTriangle,
  ChevronDown, Image, FileText, Tag, Camera, Shield,
} from 'lucide-react';
import { allProducts, Product, ProductCategory } from '@/data/products';
import LoginActivityLog from '@/components/LoginActivityLog';

interface Order {
  id: string; customer: string; phone: string; address: string; city: string;
  products: string[]; total: number; status: string; payment: string;
  isGift: boolean; date: string;
  giftMessage?: string; giftRecipient?: string; giftWrap?: string; giftStatus?: string;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  couponCode?: string;
  applicableProducts: string[];
  applicableCategories: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// ─── Mock Data ───
const mockOrders: Order[] = [
  { id: 'ORD-101', customer: 'Ahmed K.', phone: '+91 9876543210', address: '123 MG Road', city: 'Nashik', products: ['Nomade Oud (50ml)', 'Rouge Crystal (20ml)'], total: 135, status: 'Pending', payment: 'COD', isGift: false, date: '2026-03-08' },
  { id: 'ORD-100', customer: 'Sarah M.', phone: '+91 9123456789', address: '45 FC Road', city: 'Pune', products: ['Dark Leather (100ml)'], total: 135, status: 'Processing', payment: 'Online', isGift: true, giftMessage: 'Happy Birthday dear!', giftRecipient: 'Fatima', giftWrap: 'Royal Velvet', giftStatus: 'Gift Prepared', date: '2026-03-07' },
  { id: 'ORD-099', customer: 'Khalid R.', phone: '+91 9988776655', address: '78 Marine Drive', city: 'Mumbai', products: ['COMP OUD (12ml)', 'Musk Tahara (6ml)'], total: 98, status: 'Shipped', payment: 'Online', isGift: false, date: '2026-03-06' },
  { id: 'ORD-098', customer: 'Fatima A.', phone: '+91 9112233445', address: '22 Station Road', city: 'Satara', products: ['Aventus Legend (100ml)'], total: 155, status: 'Delivered', payment: 'COD', isGift: false, date: '2026-03-05' },
  { id: 'ORD-097', customer: 'Omar J.', phone: '+91 9001122334', address: '56 Ring Road', city: 'Delhi', products: ['Lady Gold (50ml)', 'Black Oud (6ml)'], total: 122, status: 'Delivered', payment: 'Online', isGift: true, giftMessage: 'With love!', giftRecipient: 'Aisha', giftWrap: 'Classic Gold', giftStatus: 'Gift Dispatched', date: '2026-03-04' },
  { id: 'ORD-096', customer: 'Riya P.', phone: '+91 9776655443', address: '10 Lake Road', city: 'Nashik', products: ['Femme Noire (20ml)'], total: 42, status: 'Cancelled', payment: 'COD', isGift: false, date: '2026-03-03' },
];

const mockDeliveryRules = [
  { id: '1', city: 'Nashik', estimate: 'Same Day Delivery', type: 'same-day' },
  { id: '2', city: 'Mumbai', estimate: '1–2 Day Delivery', type: 'express' },
  { id: '3', city: 'Pune', estimate: '1–2 Day Delivery', type: 'express' },
  { id: '4', city: 'Satara', estimate: '1–2 Day Delivery', type: 'express' },
  { id: '5', city: 'Other Cities', estimate: '2–3 Day Delivery', type: 'standard' },
];

const mockInventory = allProducts.map(p => ({
  ...p,
  stock: Math.floor(Math.random() * 50) + 2,
}));

const mockOffers: Offer[] = [
  {
    id: 'OFF-001',
    title: 'Spring Collection Discount',
    description: '20% off on all Inspired Collection perfumes',
    discountType: 'percentage',
    discountValue: 20,
    couponCode: 'SPRING20',
    applicableProducts: [],
    applicableCategories: ['inspired'],
    startDate: '2026-03-01',
    endDate: '2026-04-30',
    isActive: true,
  },
  {
    id: 'OFF-002',
    title: 'Buy 2 Get 1 Free',
    description: 'Fixed discount on bulk orders',
    discountType: 'fixed',
    discountValue: 45,
    couponCode: 'BUY2GET1',
    applicableProducts: [],
    applicableCategories: ['attar', 'international'],
    startDate: '2026-03-05',
    endDate: '2026-03-31',
    isActive: true,
  },
  {
    id: 'OFF-003',
    title: 'First Time Buyer',
    description: '₹100 discount for new customers',
    discountType: 'fixed',
    discountValue: 100,
    couponCode: 'FIRST100',
    applicableProducts: [],
    applicableCategories: ['inspired', 'attar', 'international'],
    startDate: '2026-02-01',
    endDate: '2026-12-31',
    isActive: false,
  },
];

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-500/10 text-yellow-500',
  Processing: 'bg-blue-500/10 text-blue-500',
  Shipped: 'bg-purple-500/10 text-purple-500',
  Delivered: 'bg-primary/10 text-primary',
  Cancelled: 'bg-destructive/10 text-destructive',
};

const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

// ─── Stat Card ───
const StatCard = ({ label, value, icon: Icon, trend }: { label: string; value: string | number; icon: any; trend?: string }) => (
  <div className="bg-card rounded-xl p-6 border border-border shadow-luxury-card hover:shadow-gold-glow transition-all duration-300">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
        <p className="font-display text-2xl font-bold text-foreground">{value}</p>
        {trend && <p className="text-xs text-primary mt-1 flex items-center gap-1"><TrendingUp size={12} />{trend}</p>}
      </div>
      <div className="p-3 rounded-lg bg-primary/10 text-primary">
        <Icon size={20} />
      </div>
    </div>
  </div>
);

// ─── Mini bar chart ───
const MiniChart = ({ data, label }: { data: number[]; label: string }) => {
  const max = Math.max(...data);
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-luxury-card">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">{label}</p>
      <div className="flex items-end gap-2 h-32">
        {data.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-primary/80 rounded-t transition-all duration-500 hover:bg-primary"
              style={{ height: `${(v / max) * 100}%`, minHeight: 4 }}
            />
            <span className="text-[9px] text-muted-foreground">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState(mockOrders);
  const [deliveryRules, setDeliveryRules] = useState(mockDeliveryRules);
  const [inventory, setInventory] = useState(mockInventory);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [editingDelivery, setEditingDelivery] = useState<string | null>(null);
  const [editDeliveryValue, setEditDeliveryValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerForm, setOfferForm] = useState<Offer>({
    id: '',
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    couponCode: '',
    applicableProducts: [],
    applicableCategories: [],
    startDate: '',
    endDate: '',
    isActive: true,
  });
  
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '', category: 'Perfume', gender: 'Unisex', description: '',
    fragranceNotes: { top: [], middle: [], base: [] }, sizes: [], images: [],
    isBestSeller: false, isNew: false, tags: [],
  });
  const [isDesignerAttar, setIsDesignerAttar] = useState(false);

  const getDefaultSizes = (category: string, isDesigner: boolean) => {
    if (isDesigner && category === 'attar') return [{ size: '', price: 0 }];
    switch (category) {
      case 'Perfume': return [{ size: '8 ml', price: 0 }, { size: '20 ml', price: 0 }, { size: '50 ml', price: 0 }, { size: '100 ml', price: 0 }];
      case 'attar': return [{ size: '3 ml', price: 0 }, { size: '6 ml', price: 0 }, { size: '12 ml', price: 0 }, { size: '15 ml', price: 0 }, { size: '18 ml', price: 0 }, { size: '20 ml', price: 0 }];
      case 'Car & Home Fragrance':
      case 'Candles':
      case 'Bakhoor':
      case 'Aroma Oils': return [{ size: '1 piece', price: 0 }, { size: '2 pieces', price: 0 }, { size: '5 pieces', price: 0 }];
      default: return [{ size: '50 ml', price: 0 }];
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file, index) => ({
        url: URL.createObjectURL(file), // create temporary preview URL
        isMain: productForm.images?.length === 0 && index === 0, // make first image main if none exist
        file
      }));
      setProductForm(prev => ({ ...prev, images: [...(prev.images || []), ...newImages] }));
    }
  };

  const setMainImage = (index: number) => {
    setProductForm(prev => {
      const newImages = (prev.images || []).map((img, i) => ({ ...img, isMain: i === index }));
      return { ...prev, images: newImages };
    });
  };

  const removeImage = (index: number) => {
    setProductForm(prev => {
      const newImages = [...(prev.images || [])];
      newImages.splice(index, 1);
      // if we removed the main image, make the first one main
      if (newImages.length > 0 && !newImages.some(i => i.isMain)) {
        newImages[0].isMain = true;
      }
      return { ...prev, images: newImages };
    });
  };

  const [profilePicture, setProfilePicture] = useState<string>('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('admin@dubai.com');

  if (!isAuthenticated || !user?.isAdmin) return <Navigate to="/login" />;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'gifts', label: 'Gift Orders', icon: Gift },
    { id: 'offers', label: 'Offers', icon: Tag },
    { id: 'delivery', label: 'Delivery', icon: Truck },
    { id: 'inventory', label: 'Inventory', icon: BarChart3 },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const todayOrders = orders.filter(o => o.date === '2026-03-08').length;
  const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0);
  const lowStock = inventory.filter(p => p.stock < 10).length;
  const giftOrders = orders.filter(o => o.isGift);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const updateGiftStatus = (orderId: string, giftStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, giftStatus } : o));
  };

  const updateStock = (productId: string, newStock: number) => {
    setInventory(prev => prev.map(p => p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p));
  };

  const saveDeliveryRule = (id: string) => {
    setDeliveryRules(prev => prev.map(r => r.id === id ? { ...r, estimate: editDeliveryValue } : r));
    setEditingDelivery(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Admin Dashboard" description="Manage Dubai Perfumes orders, inventory, and analytics." />
      <div className="luxury-container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-accent-font text-sm tracking-[0.3em] uppercase text-primary mb-1">Admin Panel</p>
            <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-card transition-colors relative"
                aria-label="Notifications"
              >
                <Bell size={18} className="text-muted-foreground hover:text-primary transition-colors" />
                {pendingOrders > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center font-bold">{pendingOrders}</span>
                )}
              </button>
              
              {/* Notification Panel */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-96 bg-card border border-border rounded-lg shadow-luxury-card z-50"
                  >
                    <div className="p-4 border-b border-border">
                      <h3 className="font-display text-sm font-bold text-foreground">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {orders.filter(o => o.status === 'Pending').length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground text-sm">No pending notifications</div>
                      ) : (
                        <div className="space-y-2 p-4">
                          {orders.filter(o => o.status === 'Pending').map(order => (
                            <button
                              key={order.id}
                              onClick={() => {
                                setActiveTab('orders');
                                setShowNotifications(false);
                                setExpandedOrder(order.id);
                              }}
                              className="w-full text-left p-3 rounded-lg bg-destructive/5 border border-destructive/20 hover:bg-destructive/10 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-sm text-foreground truncate">{order.customer}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{order.products.length} item{order.products.length > 1 ? 's' : ''} • ₹{order.total}</p>
                                  <p className="text-xs text-destructive font-semibold mt-1">Pending Order</p>
                                </div>
                                <span className="text-xs text-destructive font-bold flex-shrink-0 ml-2">{order.id}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={() => setShowNotifications(false)}
              className="fixed inset-0 z-40"
              style={{ display: showNotifications ? 'block' : 'none' }}
              aria-hidden="true"
            />
            <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-destructive text-sm border border-border rounded-lg transition-colors">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-gold-glow'
                  : 'bg-card text-muted-foreground hover:text-foreground border border-border'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

            {/* ─── OVERVIEW ─── */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  <StatCard label="Total Products" value={allProducts.length} icon={ShoppingBag} />
                  <StatCard label="Total Orders" value={orders.length} icon={Package} trend="+12% this week" />
                  <StatCard label="Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={DollarSign} trend="+8%" />
                  <StatCard label="Pending" value={pendingOrders} icon={Clock} />
                  <StatCard label="Today's Orders" value={todayOrders} icon={TrendingUp} />
                  <StatCard label="Low Stock" value={lowStock} icon={AlertTriangle} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <MiniChart data={[5, 8, 4, 12, 7, 15, 9]} label="Orders This Week" />
                  <MiniChart data={[120, 340, 280, 450, 380, 520, 410]} label="Sales This Month (₹)" />
                </div>
                {/* Recent orders */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-luxury-card">
                  <h3 className="font-display text-lg font-bold text-foreground mb-4">Recent Orders</h3>
                  <div className="space-y-3">
                    {orders.slice(0, 4).map(o => (
                      <div key={o.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{o.id} — {o.customer}</p>
                          <p className="text-xs text-muted-foreground">{o.products.join(', ')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-display font-bold text-foreground">₹{o.total}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusColors[o.status]}`}>{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── PRODUCTS ─── */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto flex-1">
                    <div className="relative w-full sm:w-80">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by ID or Name..."
                        className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
                    </div>
                    <select
                      value={categoryFilter}
                      onChange={e => setCategoryFilter(e.target.value)}
                      className="w-full sm:w-auto px-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="All">All Categories</option>
                      <option value="Perfume">Perfume</option>
                      <option value="attar">Attar</option>
                      <option value="Car & Home Fragrance">Car & Home Fragrance</option>
                      <option value="Candles">Candles</option>
                      <option value="Bakhoor">Bakhoor</option>
                      <option value="Aroma Oils">Aroma Oils</option>
                    </select>
                  </div>
                  <button onClick={() => { 
                      setEditingProduct(null); 
                      setProductForm({
                        name: '', category: 'Perfume', gender: 'Unisex', description: '',
                        fragranceNotes: { top: [], middle: [], base: [] }, 
                        sizes: getDefaultSizes('Perfume', false), images: [],
                        isBestSeller: false, isNew: false, tags: [],
                      });
                      setIsDesignerAttar(false);
                      setShowProductForm(true); 
                    }}
                    className="btn-premium flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider rounded-lg">
                    <Plus size={14} /> Add Product
                  </button>
                </div>

                {/* Product Form Modal */}
                {showProductForm && (
                  <div className="bg-card rounded-xl p-6 border border-primary/20 shadow-luxury-card space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-bold text-foreground">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                      <button onClick={() => setShowProductForm(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Perfume Name</label>
                        <input value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Name" />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Category</label>
                        <select value={productForm.category} onChange={e => {
                          const newCat = e.target.value as ProductCategory;
                          setProductForm({...productForm, category: newCat, sizes: getDefaultSizes(newCat, isDesignerAttar)});
                        }} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                          <option value="Perfume">Perfume</option>
                          <option value="attar">Attar</option>
                          <option value="Car & Home Fragrance">Car & Home Fragrance</option>
                          <option value="Candles">Candles</option>
                          <option value="Bakhoor">Bakhoor</option>
                          <option value="Aroma Oils">Aroma Oils</option>
                          <option value="inspired">Inspired</option>
                          <option value="international">International</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Gender</label>
                        <select value={productForm.gender} onChange={e => setProductForm({...productForm, gender: e.target.value as any})} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                          <option value="Men">Men</option><option value="Women">Women</option><option value="Unisex">Unisex</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Inspired By (Optional)</label>
                        <input value={productForm.inspiredBy || ''} onChange={e => setProductForm({...productForm, inspiredBy: e.target.value})} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. Baccarat Rouge 540" />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Longevity</label>
                        <input value={productForm.longevity || ''} onChange={e => setProductForm({...productForm, longevity: e.target.value})} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. 8-10 hours" />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Sillage</label>
                        <select value={productForm.sillage} onChange={e => setProductForm({...productForm, sillage: e.target.value as any})} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                          <option value="Soft">Soft</option><option value="Moderate">Moderate</option><option value="Strong">Strong</option><option value="Beast Mode">Beast Mode</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Description</label>
                        <input value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Product description" />
                      </div>
                    </div>

                    {/* Fragrance Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['top', 'middle', 'base'].map((noteType) => (
                        <div key={noteType}>
                          <label className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1 block">{noteType} Notes</label>
                          <input 
                            value={productForm.fragranceNotes?.[noteType as keyof typeof productForm.fragranceNotes]?.join(', ') || ''} 
                            onChange={e => {
                              const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                              setProductForm({
                                ...productForm, 
                                fragranceNotes: { ...productForm.fragranceNotes!, [noteType]: arr }
                              });
                            }}
                            className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" 
                            placeholder="Comma-separated" 
                          />
                        </div>
                      ))}
                    </div>

                    {/* Sizes & Price */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-foreground block">Pricing & Sizes</label>
                        {productForm.category === 'attar' && (
                          <label className="flex items-center gap-2 text-sm text-accent cursor-pointer border border-accent/20 bg-accent/5 px-3 py-1.5 rounded-lg">
                            <input 
                              type="checkbox" 
                              checked={isDesignerAttar}
                              onChange={e => {
                                setIsDesignerAttar(e.target.checked);
                                setProductForm({...productForm, sizes: getDefaultSizes(productForm.category || 'attar', e.target.checked)});
                              }} 
                              className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30" 
                            /> 
                            Designer Bottle Sizing
                          </label>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {productForm.sizes?.map((sizeObj, i) => (
                          <div key={i} className="flex items-center gap-2 bg-muted p-2 rounded-lg border border-border">
                            <div className="flex-1">
                              <label className="text-[9px] uppercase tracking-wider text-muted-foreground px-1 block mb-0.5">Size/Qty</label>
                              <input 
                                value={sizeObj.size} 
                                disabled={!isDesignerAttar && productForm.category !== 'Aroma Oils'}
                                onChange={e => {
                                  const newSizes = [...(productForm.sizes || [])];
                                  newSizes[i].size = e.target.value;
                                  setProductForm({...productForm, sizes: newSizes});
                                }}
                                className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm text-foreground disabled:opacity-70" 
                                placeholder="Size"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="text-[9px] uppercase tracking-wider text-muted-foreground px-1 block mb-0.5">Price (₹)</label>
                              <input 
                                type="number" 
                                value={sizeObj.price || ''}
                                onChange={e => {
                                  const newSizes = [...(productForm.sizes || [])];
                                  newSizes[i].price = Number(e.target.value);
                                  setProductForm({...productForm, sizes: newSizes});
                                }}
                                className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm text-foreground" 
                                placeholder="0"
                              />
                            </div>
                            {isDesignerAttar && (
                              <button onClick={() => {
                                const newSizes = [...(productForm.sizes || [])];
                                newSizes.splice(i, 1);
                                setProductForm({...productForm, sizes: newSizes});
                              }} className="p-2 mt-4 text-muted-foreground hover:text-destructive"><X size={14}/></button>
                            )}
                          </div>
                        ))}
                      </div>
                      {isDesignerAttar && (
                        <button onClick={() => setProductForm({...productForm, sizes: [...(productForm.sizes || []), {size: '', price: 0}]})} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
                          <Plus size={12}/> Add Custom Size
                        </button>
                      )}
                    </div>

                    {/* Image upload */}
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-foreground block mb-2">Product Images</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                        {productForm.images?.map((img, i) => (
                          <div key={i} className={`relative group aspect-square rounded-lg border-2 overflow-hidden ${img.isMain ? 'border-primary' : 'border-border'}`}>
                            <img src={img.url} className="w-full h-full object-cover" alt="Product upload preview" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                              {!img.isMain && (
                                <button onClick={() => setMainImage(i)} className="text-[10px] bg-primary text-black px-2 py-1 rounded-full font-bold shadow-lg">Set Main</button>
                              )}
                              <button onClick={() => removeImage(i)} className="text-[10px] bg-destructive text-white px-2 py-1 rounded-full font-bold shadow-lg"><Trash2 size={12}/></button>
                            </div>
                            {img.isMain && <div className="absolute top-1 right-1 bg-primary text-black p-1 rounded-full shadow-lg"><Star size={10} className="fill-black" /></div>}
                          </div>
                        ))}
                        <label className="border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:text-primary">
                          <Camera size={24} className="mb-2" />
                          <span className="text-[10px] font-semibold uppercase">Upload</span>
                          <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="pt-4 border-t border-border">
                      <label className="text-xs font-semibold uppercase tracking-wider text-foreground block mb-3">Product Tags</label>
                      <div className="flex flex-wrap gap-4">
                        {['Bestseller', 'New Arrival', 'Limited Edition', 'Trending', 'Exclusive', 'Sale'].map(tag => (
                          <label key={tag} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={productForm.tags?.includes(tag) || false} 
                              onChange={e => {
                                const currentTags = productForm.tags || [];
                                if (e.target.checked) {
                                  setProductForm({...productForm, tags: [...currentTags, tag]});
                                } else {
                                  setProductForm({...productForm, tags: currentTags.filter(t => t !== tag)});
                                }
                              }} 
                              className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30" 
                            /> {tag}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setShowProductForm(false)} className="btn-premium px-6 py-3 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider rounded-lg">
                        {editingProduct ? 'Save Product Changes' : 'Publish Product'}
                      </button>
                      <button onClick={() => setShowProductForm(false)} className="px-6 py-3 border border-border text-muted-foreground text-xs font-semibold uppercase tracking-wider rounded-lg hover:text-foreground hover:bg-muted transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Products Table */}
                <div className="bg-card rounded-xl shadow-luxury-card overflow-hidden border border-border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          {['Product', 'Category', 'Available Sizes', 'Price Range', 'Stock', 'Best Seller', 'Actions'].map(h => (
                            <th key={h} className="text-left p-4 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {allProducts
                          .filter(p => {
                            const q = searchQuery.toLowerCase();
                            const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
                            const matchesCategory = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
                            return matchesSearch && matchesCategory;
                          })
                          .map(p => {
                            const inv = inventory.find(i => i.id === p.id);
                            return (
                              <tr key={p.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <img src={p.images?.find(i => i.isMain)?.url || p.images?.[0]?.url || p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-border" />
                                    <div>
                                      <p className="font-semibold text-foreground">{p.name}</p>
                                      <p className="text-[10px] font-mono text-muted-foreground">{p.id}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 text-muted-foreground capitalize">{p.category}</td>
                                <td className="p-4 text-xs text-muted-foreground">
                                  <div className="flex flex-wrap gap-1">
                                    {p.sizes.map(s => <span key={s.size} className="bg-muted px-1.5 py-0.5 rounded border border-border">{s.size}</span>)}
                                  </div>
                                </td>
                                <td className="p-4 text-foreground font-semibold">
                                  {p.sizes.length > 1 
                                    ? `₹${Math.min(...p.sizes.map(s => s.price))} - ₹${Math.max(...p.sizes.map(s => s.price))}`
                                    : `₹${p.sizes[0]?.price || 0}`
                                  }
                                </td>
                                <td className="p-4">
                                  <span className={`text-xs font-bold ${(inv?.stock || 0) < 10 ? 'text-destructive' : 'text-primary'}`}>
                                    {inv?.stock || 0}
                                  </span>
                                </td>
                                <td className="p-4">{(p.tags?.includes('Bestseller') || p.isBestSeller) ? <Check size={14} className="text-primary" /> : <span className="text-muted-foreground/30">—</span>}</td>
                                <td className="p-4">
                                  <div className="flex gap-2">
                                    <button onClick={() => { 
                                      setEditingProduct(p); 
                                      setProductForm({ ...p, sizes: [...p.sizes] });
                                      setIsDesignerAttar(false); // Can infer later if needed
                                      setShowProductForm(true); 
                                    }} className="p-1.5 rounded border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors"><Edit size={13} /></button>
                                    <button className="p-1.5 rounded border border-border hover:border-destructive text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ─── ORDERS ─── */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-foreground">All Orders</h2>
                <div className="bg-card rounded-xl shadow-luxury-card overflow-hidden border border-border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          {['Order ID', 'Customer', 'City', 'Products', 'Total', 'Payment', 'Status', ''].map(h => (
                            <th key={h} className="text-left p-4 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(o => (
                          <>
                            <tr key={o.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors cursor-pointer"
                              onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}>
                              <td className="p-4 font-semibold text-foreground">{o.id}</td>
                              <td className="p-4 text-foreground">{o.customer}</td>
                              <td className="p-4 text-muted-foreground">{o.city}</td>
                              <td className="p-4 text-muted-foreground text-xs">{o.products.join(', ')}</td>
                              <td className="p-4 text-foreground font-bold">₹{o.total}</td>
                              <td className="p-4 text-muted-foreground text-xs">{o.payment}</td>
                              <td className="p-4">
                                <select
                                  value={o.status}
                                  onChange={e => { e.stopPropagation(); updateOrderStatus(o.id, e.target.value); }}
                                  onClick={e => e.stopPropagation()}
                                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border-0 cursor-pointer ${statusColors[o.status]} focus:outline-none`}
                                >
                                  {orderStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                              </td>
                              <td className="p-4">
                                <ChevronDown size={14} className={`text-muted-foreground transition-transform ${expandedOrder === o.id ? 'rotate-180' : ''}`} />
                              </td>
                            </tr>
                            {expandedOrder === o.id && (
                              <tr key={o.id + '-detail'}>
                                <td colSpan={8} className="p-4 bg-secondary/20">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                    <div><p className="text-muted-foreground">Phone</p><p className="text-foreground font-semibold">{o.phone}</p></div>
                                    <div><p className="text-muted-foreground">Address</p><p className="text-foreground font-semibold">{o.address}</p></div>
                                    <div><p className="text-muted-foreground">Date</p><p className="text-foreground font-semibold">{o.date}</p></div>
                                    <div><p className="text-muted-foreground">Gift Order</p><p className="text-foreground font-semibold">{o.isGift ? '🎁 Yes' : 'No'}</p></div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ─── GIFT ORDERS ─── */}
            {activeTab === 'gifts' && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-foreground">Gift Orders</h2>
                {giftOrders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-12">No gift orders yet.</p>
                ) : (
                  <div className="space-y-4">
                    {giftOrders.map(o => (
                      <div key={o.id} className="bg-card rounded-xl p-6 border border-primary/20 shadow-luxury-card space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-display text-lg font-bold text-foreground">{o.id} — {o.customer}</p>
                            <p className="text-xs text-muted-foreground">{o.date} • {o.city}</p>
                          </div>
                          <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${statusColors[o.status]}`}>{o.status}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Recipient</p><p className="text-foreground font-semibold">{o.giftRecipient}</p></div>
                          <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Gift Wrap</p><p className="text-foreground font-semibold">{o.giftWrap}</p></div>
                          <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Message</p><p className="text-foreground italic text-xs">"{o.giftMessage}"</p></div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Gift Status</p>
                            <select
                              value={o.giftStatus || 'Gift Prepared'}
                              onChange={e => updateGiftStatus(o.id, e.target.value)}
                              className="mt-1 text-xs font-semibold px-3 py-1.5 bg-primary/10 text-primary rounded-lg border border-primary/20 focus:outline-none cursor-pointer"
                            >
                              <option>Gift Prepared</option>
                              <option>Gift Dispatched</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── DELIVERY ─── */}
            {activeTab === 'delivery' && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-foreground">Delivery Rules</h2>
                <div className="bg-card rounded-xl shadow-luxury-card overflow-hidden border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/50">
                        <th className="text-left p-4 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">City / Region</th>
                        <th className="text-left p-4 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Delivery Estimate</th>
                        <th className="text-left p-4 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Type</th>
                        <th className="text-left p-4 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveryRules.map(r => (
                        <tr key={r.id} className="border-b border-border/30">
                          <td className="p-4 font-semibold text-foreground">{r.city}</td>
                          <td className="p-4">
                            {editingDelivery === r.id ? (
                              <input value={editDeliveryValue} onChange={e => setEditDeliveryValue(e.target.value)}
                                className="px-3 py-1.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                            ) : (
                              <span className="text-muted-foreground">{r.estimate}</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              r.type === 'same-day' ? 'bg-primary/10 text-primary' :
                              r.type === 'express' ? 'bg-blue-500/10 text-blue-500' :
                              'bg-muted text-muted-foreground'
                            }`}>{r.type}</span>
                          </td>
                          <td className="p-4">
                            {editingDelivery === r.id ? (
                              <div className="flex gap-2">
                                <button onClick={() => saveDeliveryRule(r.id)} className="p-1.5 rounded border border-primary text-primary hover:bg-primary/10"><Check size={13} /></button>
                                <button onClick={() => setEditingDelivery(null)} className="p-1.5 rounded border border-border text-muted-foreground"><X size={13} /></button>
                              </div>
                            ) : (
                              <button onClick={() => { setEditingDelivery(r.id); setEditDeliveryValue(r.estimate); }}
                                className="p-1.5 rounded border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors"><Edit size={13} /></button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─── INVENTORY ─── */}
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-foreground">Inventory Management</h2>
                {lowStock > 0 && (
                  <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 flex items-center gap-3">
                    <AlertTriangle size={18} className="text-destructive" />
                    <p className="text-sm text-destructive font-semibold">{lowStock} products are low on stock (below 10 units)</p>
                  </div>
                )}
                <div className="bg-card rounded-xl shadow-luxury-card overflow-hidden border border-border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          {['Product', 'Category', 'Price', 'Stock', 'Status', 'Update Stock'].map(h => (
                            <th key={h} className="text-left p-4 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {inventory.sort((a, b) => a.stock - b.stock).map(p => (
                          <tr key={p.id} className={`border-b border-border/30 ${p.stock < 10 ? 'bg-destructive/5' : ''}`}>
                            <td className="p-4 font-semibold text-foreground">{p.name}</td>
                            <td className="p-4 text-muted-foreground capitalize">{p.category}</td>
                            <td className="p-4 text-foreground">₹{p.sizes[0].price}</td>
                            <td className="p-4 font-bold">
                              <span className={p.stock < 10 ? 'text-destructive' : 'text-primary'}>{p.stock}</span>
                            </td>
                            <td className="p-4">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                                p.stock < 5 ? 'bg-destructive/10 text-destructive' :
                                p.stock < 10 ? 'bg-yellow-500/10 text-yellow-500' :
                                'bg-primary/10 text-primary'
                              }`}>{p.stock < 5 ? 'Critical' : p.stock < 10 ? 'Low' : 'In Stock'}</span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <button onClick={() => updateStock(p.id, p.stock - 1)} className="p-1 rounded border border-border hover:border-primary text-muted-foreground hover:text-primary">−</button>
                                <span className="w-8 text-center text-sm font-semibold text-foreground">{p.stock}</span>
                                <button onClick={() => updateStock(p.id, p.stock + 1)} className="p-1 rounded border border-border hover:border-primary text-muted-foreground hover:text-primary">+</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ─── REVIEWS ─── */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-foreground">Customer Reviews</h2>
                <div className="space-y-3">
                  {allProducts.flatMap(p => p.reviews.map(r => ({ ...r, product: p.name }))).map((r, i) => (
                    <div key={r.id + i} className="bg-card rounded-xl p-5 border border-border shadow-luxury flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground text-sm">{r.userName}</p>
                          <span className="text-[10px] text-muted-foreground">on</span>
                          <span className="text-sm text-primary font-semibold">{r.product}</span>
                          <div className="flex gap-0.5 ml-2">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} size={10} className={j < r.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{r.comment}</p>
                        <p className="text-xs text-muted-foreground mt-1">{r.date}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button className="p-1.5 rounded border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors" title="Approve"><Check size={13} /></button>
                        <button className="p-1.5 rounded border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors" title="Feature"><Eye size={13} /></button>
                        <button className="p-1.5 rounded border border-border hover:border-destructive text-muted-foreground hover:text-destructive transition-colors" title="Delete"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── CONTENT ─── */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-foreground">Website Content</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[
                    { title: 'Hero Section', fields: ['Headline', 'Subheadline', 'CTA Text'] },
                    { title: 'Announcements', fields: ['Banner Text', 'Badge Text'] },
                    { title: 'Offers Section', fields: ['Section Title', 'Offer Description'] },
                    { title: 'Store Info', fields: ['Address', 'Phone', 'Hours'] },
                  ].map(section => (
                    <div key={section.title} className="bg-card rounded-xl p-6 border border-border shadow-luxury-card space-y-4">
                      <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">{section.title}</h3>
                      {section.fields.map(f => (
                        <div key={f}>
                          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">{f}</label>
                          <input className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder={f} />
                        </div>
                      ))}
                      <button className="btn-premium px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider rounded-lg">Save</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── OFFERS ─── */}
            {activeTab === 'offers' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-foreground">Manage Offers</h2>
                  <button
                    onClick={() => {
                      setShowOfferForm(!showOfferForm);
                      setEditingOffer(null);
                      setOfferForm({
                        id: '',
                        title: '',
                        description: '',
                        discountType: 'percentage',
                        discountValue: 0,
                        couponCode: '',
                        applicableProducts: [],
                        applicableCategories: [],
                        startDate: '',
                        endDate: '',
                        isActive: true,
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus size={14} /> Add Offer
                  </button>
                </div>

                {/* Add/Edit Offer Form */}
                {showOfferForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-xl p-6 border border-border shadow-luxury-card space-y-4"
                  >
                    <h3 className="font-display font-bold text-foreground">{editingOffer ? 'Edit Offer' : 'Create New Offer'}</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Offer Title</label>
                        <input
                          type="text"
                          value={offerForm.title}
                          onChange={e => setOfferForm({ ...offerForm, title: e.target.value })}
                          className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="e.g., Spring Sale"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Coupon Code (Optional)</label>
                        <input
                          type="text"
                          value={offerForm.couponCode || ''}
                          onChange={e => setOfferForm({ ...offerForm, couponCode: e.target.value })}
                          className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="e.g., SPRING20"
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Description</label>
                        <textarea
                          value={offerForm.description}
                          onChange={e => setOfferForm({ ...offerForm, description: e.target.value })}
                          className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                          rows={3}
                          placeholder="Describe the offer..."
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Discount Type</label>
                        <select
                          value={offerForm.discountType}
                          onChange={e => setOfferForm({ ...offerForm, discountType: e.target.value as 'percentage' | 'fixed' })}
                          className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount (₹)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Discount Value</label>
                        <input
                          type="number"
                          value={offerForm.discountValue}
                          onChange={e => setOfferForm({ ...offerForm, discountValue: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder={offerForm.discountType === 'percentage' ? '20' : '100'}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Start Date</label>
                        <input
                          type="date"
                          value={offerForm.startDate}
                          onChange={e => setOfferForm({ ...offerForm, startDate: e.target.value })}
                          className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">End Date</label>
                        <input
                          type="date"
                          value={offerForm.endDate}
                          onChange={e => setOfferForm({ ...offerForm, endDate: e.target.value })}
                          className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Applicable Categories</label>
                        <div className="flex gap-3">
                          {['inspired', 'attar', 'international'].map(cat => (
                            <label key={cat} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={offerForm.applicableCategories.includes(cat)}
                                onChange={e => {
                                  const cats = e.target.checked
                                    ? [...offerForm.applicableCategories, cat]
                                    : offerForm.applicableCategories.filter(c => c !== cat);
                                  setOfferForm({ ...offerForm, applicableCategories: cats });
                                }}
                                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
                              />
                              <span className="text-sm capitalize text-foreground">{cat}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="lg:col-span-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={offerForm.isActive}
                            onChange={e => setOfferForm({ ...offerForm, isActive: e.target.checked })}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
                          />
                          <span className="text-sm text-foreground font-semibold">Active</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => {
                          if (editingOffer) {
                            setOffers(prev => prev.map(o => o.id === editingOffer.id ? offerForm : o));
                          } else {
                            setOffers(prev => [...prev, { ...offerForm, id: `OFF-${Date.now()}` }]);
                          }
                          setShowOfferForm(false);
                          setEditingOffer(null);
                        }}
                        className="btn-premium px-4 py-2.5 bg-primary text-primary-foreground text-xs font-semibold uppercase rounded-lg"
                      >
                        {editingOffer ? 'Update Offer' : 'Create Offer'}
                      </button>
                      <button
                        onClick={() => {
                          setShowOfferForm(false);
                          setEditingOffer(null);
                        }}
                        className="px-4 py-2.5 border border-border text-foreground text-xs font-semibold uppercase rounded-lg hover:bg-muted transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Offers Table */}
                <div className="bg-card rounded-xl shadow-luxury-card overflow-hidden border border-border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          {['Title', 'Discount', 'Coupon', 'Start Date', 'End Date', 'Status', 'Actions'].map(h => (
                            <th key={h} className="text-left p-4 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {offers.map(offer => (
                          <tr key={offer.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                            <td className="p-4">
                              <div>
                                <p className="font-semibold text-foreground">{offer.title}</p>
                                <p className="text-xs text-muted-foreground">{offer.description}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-primary">
                                {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`}
                              </span>
                            </td>
                            <td className="p-4 text-foreground">{offer.couponCode || '—'}</td>
                            <td className="p-4 text-muted-foreground">{offer.startDate}</td>
                            <td className="p-4 text-muted-foreground">{offer.endDate}</td>
                            <td className="p-4">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                                offer.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                              }`}>
                                {offer.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="p-4 flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingOffer(offer);
                                  setOfferForm(offer);
                                  setShowOfferForm(true);
                                }}
                                className="p-1.5 rounded border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                                title="Edit"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => setOffers(prev => prev.filter(o => o.id !== offer.id))}
                                className="p-1.5 rounded border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ─── SETTINGS ─── */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-foreground">Settings</h2>
                <div className="bg-card rounded-xl p-6 border border-border shadow-luxury-card space-y-8">
                  
                  {/* Admin Profile Section */}
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground mb-6">Admin Profile</h3>
                    <div className="flex items-end gap-6">
                      {/* Profile Picture */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-20 h-20 rounded-full border-2 border-primary/30 bg-secondary flex items-center justify-center overflow-hidden">
                          {profilePicture ? (
                            <img src={profilePicture} alt="Admin" className="w-full h-full object-cover" />
                          ) : (
                            <Camera size={32} className="text-muted-foreground" />
                          )}
                        </div>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setProfilePicture(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                          <span className="text-xs font-semibold text-primary hover:text-primary/80 cursor-pointer">
                            Upload Photo
                          </span>
                        </label>
                      </div>

                      {/* Profile Info */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Admin Name</label>
                          <input defaultValue="Admin" className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Admin Email</label>
                          <input value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground mb-4 flex items-center gap-2">
                      <Shield size={16} className="text-primary" /> Security
                    </h3>
                    <div className="bg-secondary/30 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">Two-Factor Authentication (Email OTP)</p>
                        <p className="text-xs text-muted-foreground mt-1">Add an extra layer of security to your admin account</p>
                      </div>
                      <label className="cursor-pointer flex items-center gap-3">
                        <div className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${twoFactorEnabled ? 'bg-primary' : 'bg-muted'}`}>
                          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform duration-300 ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </div>
                        <input
                          type="checkbox"
                          checked={twoFactorEnabled}
                          onChange={e => setTwoFactorEnabled(e.target.checked)}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {twoFactorEnabled && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg"
                      >
                        <p className="text-xs text-primary font-semibold">✓ 2FA Enabled</p>
                        <p className="text-xs text-muted-foreground mt-1">You will receive a 6-digit OTP via email when logging in to the admin panel.</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Change Password Section */}
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          className={`w-full px-3 py-2.5 bg-muted border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 transition-all ${
                            newPassword && confirmPassword && newPassword !== confirmPassword
                              ? 'border-destructive focus:ring-destructive/30'
                              : 'border-border focus:ring-primary/30'
                          }`}
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Confirm Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          className={`w-full px-3 py-2.5 bg-muted border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 transition-all ${
                            newPassword && confirmPassword && newPassword !== confirmPassword
                              ? 'border-destructive focus:ring-destructive/30'
                              : 'border-border focus:ring-primary/30'
                          }`}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>

                    {/* Password Validation Error */}
                    {newPassword && confirmPassword && newPassword !== confirmPassword && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-2"
                      >
                        <X size={16} className="text-destructive flex-shrink-0" />
                        <p className="text-xs text-destructive font-semibold">Passwords do not match</p>
                      </motion.div>
                    )}

                    {/* Password Match Success */}
                    {newPassword && confirmPassword && newPassword === confirmPassword && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-primary/10 border border-primary/30 rounded-lg flex items-center gap-2"
                      >
                        <Check size={16} className="text-primary flex-shrink-0" />
                        <p className="text-xs text-primary font-semibold">Passwords match</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Save Button */}
                  <button
                    disabled={newPassword && confirmPassword && newPassword !== confirmPassword}
                    className={`btn-premium px-6 py-3 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
                      newPassword && confirmPassword && newPassword !== confirmPassword
                        ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    Save Settings
                  </button>

                  {/* Login Activity Log Section */}
                  <div className="mt-12 pt-8 border-t border-border">
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground mb-6">Login Security Logs</h3>
                    <LoginActivityLog email={adminEmail} />
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
