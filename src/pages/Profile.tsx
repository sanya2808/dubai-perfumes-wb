import { useState, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, LogOut, Package, Heart, MapPin, Pencil, Check, X,
  ChevronRight, ShoppingBag, Plus, Trash2, Star, Home,
  Truck, CheckCircle, Clock, PackageCheck, ShoppingCart,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { getProductById } from '@/data/products';

/* ══════════════ TYPES ══════════════ */
interface Address {
  id: string;
  label: string;
  line1: string;
  line2: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

type OrderStatus = 'placed' | 'shipped' | 'out_for_delivery' | 'delivered';

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  amount: number;
  items: string;
  forSomeoneElse?: { name: string; phone: string; message: string };
}

/* ══════════════ DUMMY DATA ══════════════ */
const DUMMY_ORDERS: Order[] = [
  {
    id: '#1234', date: '12 Feb 2026', status: 'delivered', amount: 165,
    items: 'Nomade Oud, Rouge Crystal',
  },
  {
    id: '#5678', date: '28 Feb 2026', status: 'out_for_delivery', amount: 89,
    items: 'Aventus Legend',
    forSomeoneElse: { name: 'Ahmed Ali', phone: '9876543210', message: 'Happy Birthday!' },
  },
  {
    id: '#9012', date: '05 Mar 2026', status: 'shipped', amount: 235,
    items: 'Dark Leather, Bleu Royale',
  },
  {
    id: '#3456', date: '15 Mar 2026', status: 'placed', amount: 120,
    items: 'Oud Noir',
  },
];

/* ══════════════ STATUS CONFIG ══════════════ */
const ORDER_STEPS: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
  { key: 'placed',           label: 'Order Placed',      icon: CheckCircle },
  { key: 'shipped',          label: 'Shipped',           icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery',  icon: PackageCheck },
  { key: 'delivered',        label: 'Delivered',         icon: Check },
];

const STATUS_BADGE: Record<OrderStatus, string> = {
  placed:           'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  shipped:          'bg-sky-500/10 text-sky-400 border border-sky-500/20',
  out_for_delivery: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
  delivered:        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  placed: 'Order Placed', shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered',
};

/* ══════════════ HELPERS ══════════════ */
const LS_ADDRESSES = 'dp_addresses_v2';
const LS_PROFILE   = 'dp_profile';

const loadLS = <T,>(key: string, fallback: T): T => {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
};

const newId = () => Math.random().toString(36).slice(2);

const BLANK_ADDR: Omit<Address, 'id'|'isDefault'> = {
  label: '', line1: '', line2: '', city: '', pincode: '',
};

/* ══════════════ TAB TYPES ══════════════ */
type TabId = 'profile' | 'orders' | 'wishlist' | 'addresses' | 'logout';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'profile',   label: 'Profile',   icon: User },
  { id: 'orders',    label: 'Orders',    icon: Package },
  { id: 'wishlist',  label: 'Wishlist',  icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'logout',    label: 'Logout',    icon: LogOut },
];

/* ══════════════ MAIN COMPONENT ══════════════ */
const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { items: wishlistIds, toggleItem: toggleWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();
  const navigate = useNavigate();

  /* ── active tab ── */
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  /* ── profile edit ── */
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({ name: '', phone: '' });
  const [savedProfile, setSavedProfile] = useState(() =>
    loadLS(LS_PROFILE, { name: '', phone: '' })
  );

  /* ── addresses ── */
  const [addresses, setAddresses] = useState<Address[]>(() =>
    loadLS(LS_ADDRESSES, [])
  );
  const [addrFormOpen, setAddrFormOpen]   = useState(false);
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);
  const [addrDraft, setAddrDraft]         = useState<Omit<Address, 'id'|'isDefault'>>(BLANK_ADDR);

  /* ── order tracking expansion ── */
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  /* ── wishlist-to-cart ── */
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});

  /* Seed profile on mount */
  useEffect(() => {
    if (user) {
      setSavedProfile(prev => ({
        name:  prev.name  || user.name  || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  if (!isAuthenticated) return <Navigate to="/" replace />;

  /* ── derived ── */
  const displayName  = savedProfile.name  || user?.name  || 'User';
  const displayPhone = savedProfile.phone || user?.phone || '';
  const displayEmail = user?.email || '';
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  const wishlistProducts = wishlistIds
    .map(id => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => !!p);

  /* ══════════════ HANDLERS ══════════════ */

  /* Profile */
  const startEditProfile = () => { setProfileDraft({ name: displayName, phone: displayPhone }); setEditingProfile(true); };
  const saveProfile = () => {
    const next = { name: profileDraft.name.trim() || displayName, phone: profileDraft.phone.trim() || displayPhone };
    setSavedProfile(next);
    localStorage.setItem(LS_PROFILE, JSON.stringify(next));
    setEditingProfile(false);
  };

  /* Addresses */
  const persistAddresses = (next: Address[]) => {
    setAddresses(next);
    localStorage.setItem(LS_ADDRESSES, JSON.stringify(next));
  };

  const openNewAddr = () => {
    setEditingAddrId(null);
    setAddrDraft(BLANK_ADDR);
    setAddrFormOpen(true);
  };

  const openEditAddr = (addr: Address) => {
    setEditingAddrId(addr.id);
    setAddrDraft({ label: addr.label, line1: addr.line1, line2: addr.line2, city: addr.city, pincode: addr.pincode });
    setAddrFormOpen(true);
  };

  const saveAddr = () => {
    if (!addrDraft.line1.trim() || !addrDraft.city.trim()) return;
    if (editingAddrId) {
      persistAddresses(addresses.map(a =>
        a.id === editingAddrId ? { ...a, ...addrDraft } : a
      ));
    } else {
      const isFirst = addresses.length === 0;
      persistAddresses([...addresses, { id: newId(), ...addrDraft, isDefault: isFirst }]);
    }
    setAddrFormOpen(false);
    setEditingAddrId(null);
  };

  const deleteAddr = (id: string) => {
    const next = addresses.filter(a => a.id !== id);
    // if deleted was default, make first remaining default
    if (next.length > 0 && !next.some(a => a.isDefault)) next[0].isDefault = true;
    persistAddresses(next);
  };

  const setDefault = (id: string) => {
    persistAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  };

  /* Wishlist → Cart */
  const moveToCart = (product: NonNullable<ReturnType<typeof getProductById>>) => {
    addToCart({
      productId: product.id,
      name: product.name,
      size: product.sizes[0]?.size || 'Standard',
      price: product.sizes[0]?.price || 0,
      image: product.image,
    });
    setAddedToCart(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedToCart(prev => ({ ...prev, [product.id]: false })), 2000);
  };

  /* Logout */
  const handleLogout = () => { logout(); navigate('/'); };

  /* ══════════════ ORDER TRACKER ══════════════ */
  const OrderTracker = ({ order }: { order: Order }) => {
    const stepIdx = ORDER_STEPS.findIndex(s => s.key === order.status);
    return (
      <div className="mt-4 px-1">
        <div className="flex items-start justify-between relative">
          {/* progress bar */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-border mx-8" />
          <div
            className="absolute top-4 left-0 h-0.5 bg-primary mx-8 transition-all duration-500"
            style={{ width: `${(stepIdx / (ORDER_STEPS.length - 1)) * (100 - 0)}%` }}
          />

          {ORDER_STEPS.map((step, i) => {
            const Icon = step.icon;
            const done    = i <= stepIdx;
            const current = i === stepIdx;
            return (
              <div key={step.key} className="flex flex-col items-center gap-1.5 z-10 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  done
                    ? current
                      ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_12px_rgba(198,169,107,0.4)]'
                      : 'bg-primary/20 border-primary text-primary'
                    : 'bg-background border-border text-muted-foreground'
                }`}>
                  <Icon size={13} />
                </div>
                <span className={`text-[9px] tracking-wide uppercase text-center leading-tight ${done ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {order.forSomeoneElse && (
          <div className="mt-4 p-3 bg-primary/5 border border-primary/15 rounded-xl text-xs space-y-0.5">
            <p className="text-primary font-semibold tracking-wide text-[10px] uppercase">Gift Order</p>
            <p className="text-foreground">To: <span className="font-medium">{order.forSomeoneElse.name}</span> · {order.forSomeoneElse.phone}</p>
            {order.forSomeoneElse.message && <p className="text-muted-foreground italic">"{order.forSomeoneElse.message}"</p>}
          </div>
        )}
      </div>
    );
  };

  /* ══════════════ ADDRESS FORM ══════════════ */
  const AddressForm = () => (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-muted/30 border border-border rounded-2xl p-5 space-y-4"
    >
      <p className="text-sm font-semibold text-foreground">
        {editingAddrId ? 'Edit Address' : 'New Address'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {([
          { key: 'label',   label: 'Label (Home / Work)',   placeholder: 'Home', span: 2 },
          { key: 'line1',   label: 'House / Flat / Street', placeholder: '123, MG Road', span: 2 },
          { key: 'line2',   label: 'Area / Landmark',       placeholder: 'Near City Mall', span: 2 },
          { key: 'city',    label: 'City',                  placeholder: 'Bangalore', span: 1 },
          { key: 'pincode', label: 'PIN Code',              placeholder: '560001', span: 1 },
        ] as { key: keyof typeof addrDraft; label: string; placeholder: string; span: number }[]).map(f => (
          <div key={f.key} className={f.span === 2 ? 'sm:col-span-2' : ''}>
            <label className="text-[10px] tracking-widest uppercase text-muted-foreground">{f.label}</label>
            <input
              value={addrDraft[f.key]}
              onChange={e => setAddrDraft(d => ({ ...d, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              className="w-full mt-1 px-3 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          onClick={saveAddr}
          className="flex items-center gap-1.5 text-xs px-5 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Check size={12} /> Save Address
        </button>
        <button
          onClick={() => { setAddrFormOpen(false); setEditingAddrId(null); }}
          className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={12} /> Cancel
        </button>
      </div>
    </motion.div>
  );

  /* ══════════════ TAB PANELS ══════════════ */
  const renderContent = () => {
    switch (activeTab) {

      /* ── PROFILE ── */
      case 'profile':
        return (
          <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <h2 className="font-display text-xl font-semibold text-foreground mb-6">Profile Details</h2>

            {/* Avatar card */}
            <div className="flex items-center gap-5 mb-8 p-5 bg-muted/30 rounded-2xl border border-border">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-primary-foreground flex-shrink-0"
                style={{ background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-gold-glow)' }}
              >
                {initials}
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-foreground">{displayName}</p>
                {displayEmail && <p className="text-sm text-muted-foreground">{displayEmail}</p>}
                {displayPhone && <p className="text-sm text-muted-foreground">+91 {displayPhone.replace(/^(\+91|0091|91)/, '').trim()}</p>}
              </div>
            </div>

            {!editingProfile ? (
              <div className="space-y-3">
                {[
                  { label: 'Name',  value: displayName },
                  { label: 'Email', value: displayEmail || 'Not provided' },
                  { label: 'Phone', value: displayPhone ? `+91 ${displayPhone.replace(/^(\+91|0091|91)/, '').trim()}` : 'Not provided' },
                ].map(field => (
                  <div key={field.label} className="flex flex-col gap-1 p-4 bg-background rounded-xl border border-border">
                    <span className="text-[10px] tracking-widest uppercase text-muted-foreground">{field.label}</span>
                    <span className="text-sm font-medium text-foreground">{field.value}</span>
                  </div>
                ))}
                <button
                  onClick={startEditProfile}
                  className="flex items-center gap-2 text-xs tracking-widest uppercase text-primary border border-primary/30 rounded-full px-5 py-2.5 hover:bg-primary/10 transition-all duration-200 mt-2"
                >
                  <Pencil size={12} /> Edit Profile
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { key: 'name', label: 'Name', placeholder: 'Your name' },
                  { key: 'phone', label: 'Phone', placeholder: '10-digit mobile number' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-[10px] tracking-widest uppercase text-muted-foreground">{f.label}</label>
                    <input
                      value={profileDraft[f.key as 'name'|'phone']}
                      onChange={e => setProfileDraft(d => ({ ...d, [f.key]: e.target.value }))}
                      className="w-full mt-1 px-3 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                      placeholder={f.placeholder}
                    />
                  </div>
                ))}
                <div className="flex gap-3 pt-1">
                  <button onClick={saveProfile} className="flex items-center gap-1.5 text-xs px-5 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                    <Check size={12} /> Save
                  </button>
                  <button onClick={() => setEditingProfile(false)} className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors">
                    <X size={12} /> Cancel
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        );

      /* ── ORDERS ── */
      case 'orders':
        return (
          <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <h2 className="font-display text-xl font-semibold text-foreground mb-6">My Orders</h2>
            <div className="space-y-3">
              {DUMMY_ORDERS.map((order, i) => {
                const isExpanded = expandedOrder === order.id;
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-background rounded-2xl border border-border overflow-hidden"
                  >
                    {/* Order row */}
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="flex items-center gap-4 p-4 w-full text-left hover:bg-muted/30 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <ShoppingBag size={15} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display font-semibold text-sm text-foreground">Order {order.id}</span>
                          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_BADGE[order.status]}`}>
                            {STATUS_LABEL[order.status]}
                          </span>
                          {order.forSomeoneElse && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                              Gift
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{order.items}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-display font-bold text-sm text-foreground">₹{order.amount}</p>
                        <p className="text-[10px] text-primary mt-0.5 flex items-center gap-1 justify-end">
                          Track <ChevronRight size={10} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </p>
                      </div>
                    </button>

                    {/* Tracker */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden border-t border-border px-4 pb-5"
                        >
                          <OrderTracker order={order} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );

      /* ── WISHLIST ── */
      case 'wishlist':
        return (
          <motion.div key="wishlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">Wishlist</h2>
            <p className="text-xs text-muted-foreground mb-6">{wishlistProducts.length} saved {wishlistProducts.length === 1 ? 'item' : 'items'}</p>

            {wishlistProducts.length === 0 ? (
              <div className="flex flex-col items-center py-16 gap-4">
                <Heart size={40} className="text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">No items in your wishlist yet</p>
                <Link to="/shop" className="text-xs text-primary border border-primary/30 rounded-full px-5 py-2 hover:bg-primary/10 transition-all duration-200">
                  Browse Fragrances
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlistProducts.map(product => {
                  const added = addedToCart[product.id];
                  return (
                    <div
                      key={product.id}
                      className="flex gap-3 p-4 bg-background rounded-2xl border border-border hover:border-primary/20 transition-colors"
                    >
                      <Link to={`/product/${product.id}`} className="flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-xl" />
                      </Link>
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <Link to={`/product/${product.id}`}>
                            <p className="text-sm font-semibold text-foreground truncate hover:text-primary transition-colors">{product.name}</p>
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">from ₹{product.sizes[0]?.price}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => moveToCart(product)}
                            className={`flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full transition-all duration-300 ${
                              added
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-primary text-primary-foreground hover:opacity-90'
                            }`}
                          >
                            {added ? <Check size={11} /> : <ShoppingCart size={11} />}
                            {added ? 'Added!' : 'Add to Cart'}
                          </button>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="p-1.5 rounded-full text-muted-foreground hover:text-red-400 transition-colors"
                            title="Remove from wishlist"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        );

      /* ── ADDRESSES ── */
      case 'addresses':
        return (
          <motion.div key="addresses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-foreground">Saved Addresses</h2>
              {!addrFormOpen && (
                <button
                  onClick={openNewAddr}
                  className="flex items-center gap-1.5 text-xs tracking-widest uppercase text-primary border border-primary/30 rounded-full px-4 py-2 hover:bg-primary/10 transition-all duration-200"
                >
                  <Plus size={12} /> Add New
                </button>
              )}
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {addrFormOpen && <AddressForm key="form" />}
              </AnimatePresence>

              {addresses.length === 0 && !addrFormOpen && (
                <div className="flex flex-col items-center py-16 gap-4">
                  <MapPin size={40} className="text-muted-foreground/20" />
                  <p className="text-sm text-muted-foreground">No saved addresses yet</p>
                  <button
                    onClick={openNewAddr}
                    className="text-xs text-primary border border-primary/30 rounded-full px-5 py-2 hover:bg-primary/10 transition-all duration-200"
                  >
                    Add Address
                  </button>
                </div>
              )}

              {addresses.map(addr => (
                <motion.div
                  key={addr.id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className={`p-4 rounded-2xl border transition-colors ${
                    addr.isDefault
                      ? 'bg-primary/5 border-primary/25'
                      : 'bg-background border-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <MapPin size={15} className={`mt-0.5 flex-shrink-0 ${addr.isDefault ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {addr.label && (
                            <span className="text-[10px] font-semibold tracking-widest uppercase text-foreground">{addr.label}</span>
                          )}
                          {addr.isDefault && (
                            <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                              <Star size={8} fill="currentColor" /> Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-foreground">{addr.line1}</p>
                        {addr.line2 && <p className="text-sm text-muted-foreground">{addr.line2}</p>}
                        <p className="text-sm text-muted-foreground">{[addr.city, addr.pincode].filter(Boolean).join(' – ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!addr.isDefault && (
                        <button
                          onClick={() => setDefault(addr.id)}
                          className="text-[10px] text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-muted"
                          title="Set as default"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => openEditAddr(addr)}
                        className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => deleteAddr(addr.id)}
                        className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors rounded-lg hover:bg-muted"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      /* ── LOGOUT ── */
      case 'logout':
        return (
          <motion.div key="logout" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <h2 className="font-display text-xl font-semibold text-foreground mb-6">Sign Out</h2>
            <div className="flex flex-col items-center py-12 gap-6 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground"
                style={{ background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-gold-glow)' }}
              >
                {initials}
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-foreground">{displayName}</p>
                {displayEmail && <p className="text-sm text-muted-foreground mt-0.5">{displayEmail}</p>}
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">Are you sure you want to sign out of your account?</p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all duration-200 text-sm font-medium"
              >
                <LogOut size={15} /> Sign Out
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        );

      default: return null;
    }
  };

  /* ══════════════ JSX ══════════════ */
  return (
    <div className="min-h-screen bg-background">
      <div className="luxury-container py-10 md:py-14">

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <p className="text-accent-font text-xs tracking-[0.35em] uppercase text-primary mb-2">My Account</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Dashboard</h1>
          <div className="gold-divider mt-4" />
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6">

          {/* ── Sidebar ── */}
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="md:w-60 lg:w-64 flex-shrink-0"
          >
            {/* Avatar mini-card */}
            <div className="flex items-center gap-3 p-4 mb-4 bg-card border border-border rounded-2xl shadow-luxury-card">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0"
                style={{ background: 'var(--gradient-gold)' }}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                <p className="text-[11px] text-muted-foreground truncate">{displayEmail || (displayPhone ? `+91 ${displayPhone}` : 'Guest')}</p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 mb-4 bg-card border border-border rounded-2xl overflow-hidden shadow-luxury-card divide-x divide-border">
              {[
                { label: 'Orders', value: DUMMY_ORDERS.length },
                { label: 'Wishlist', value: wishlistIds.length },
                { label: 'Addresses', value: addresses.length },
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center py-3 px-1">
                  <p className="font-display text-base font-bold text-primary">{s.value}</p>
                  <p className="text-[9px] tracking-widest uppercase text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Tab nav */}
            <nav className="bg-card border border-border rounded-2xl shadow-luxury-card overflow-hidden">
              {TABS.map((tab, i) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const isLogout = tab.id === 'logout';
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-3 w-full px-5 py-3.5 text-xs font-medium tracking-widest uppercase transition-all duration-200
                      ${i < TABS.length - 1 ? 'border-b border-border' : ''}
                      ${isActive
                        ? isLogout ? 'bg-red-500/10 text-red-400' : 'bg-primary/10 text-primary'
                        : isLogout ? 'text-muted-foreground hover:text-red-400 hover:bg-red-500/5' : 'text-muted-foreground hover:text-primary hover:bg-muted'
                      }
                    `}
                  >
                    <Icon size={15} />
                    {tab.label}
                    {isActive && <ChevronRight size={12} className="ml-auto" />}
                  </button>
                );
              })}
            </nav>

            <Link
              to="/shop"
              className="flex items-center gap-2 mt-4 text-[11px] tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors px-1"
            >
              <Home size={12} /> Back to Shop
            </Link>
          </motion.aside>

          {/* ── Main content ── */}
          <motion.main
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="flex-1 min-w-0 bg-card border border-border rounded-2xl shadow-luxury-card p-6 md:p-8"
          >
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
