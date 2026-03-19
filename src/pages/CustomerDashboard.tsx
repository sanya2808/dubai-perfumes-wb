import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, LogOut, Package, Heart, Clock, CreditCard,
  MapPin, Pencil, Check, X, ChevronRight, ShoppingBag,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { getProductById } from '@/data/products';

/* ─── types ─── */
interface Address {
  line1: string;
  line2: string;
  city: string;
  pincode: string;
}

interface OrderItem {
  id: string;
  date: string;
  status: 'Delivered' | 'Processing' | 'Shipped';
  amount: number;
  items: string;
}

/* ─── dummy data ─── */
const DUMMY_ORDERS: OrderItem[] = [
  { id: '#1234', date: '12 Feb 2026', status: 'Delivered', amount: 165, items: 'Nomade Oud, Rouge Crystal' },
  { id: '#5678', date: '28 Feb 2026', status: 'Processing', amount: 89, items: 'Aventus Legend' },
  { id: '#9012', date: '05 Mar 2026', status: 'Shipped', amount: 235, items: 'Dark Leather, Bleu Royale' },
];

const STATUS_STYLE: Record<OrderItem['status'], string> = {
  Delivered: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Processing: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  Shipped: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
};

/* ─── small helpers ─── */
const LS_ADDRESS = 'dp_address';
const LS_PROFILE = 'dp_profile';

const loadLS = <T,>(key: string, fallback: T): T => {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
};

/* ─── Card wrapper ─── */
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card border border-border rounded-2xl p-6 shadow-luxury-card ${className}`}>
    {children}
  </div>
);

/* ─── Section heading ─── */
const SectionTitle = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
  <div className="flex items-center gap-2.5 mb-5">
    <Icon size={17} className="text-primary flex-shrink-0" />
    <h2 className="font-display text-base font-semibold text-foreground tracking-wide">{label}</h2>
  </div>
);

/* ═══════════════ MAIN COMPONENT ═══════════════ */
const CustomerDashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { items: wishlistIds } = useWishlist();

  /* local state */
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

  const [profileDraft, setProfileDraft] = useState({ name: '', phone: '' });
  const [savedProfile, setSavedProfile] = useState(() =>
    loadLS(LS_PROFILE, { name: '', phone: '' })
  );

  const [addressDraft, setAddressDraft] = useState<Address>({ line1: '', line2: '', city: '', pincode: '' });
  const [savedAddress, setSavedAddress] = useState<Address>(() =>
    loadLS(LS_ADDRESS, { line1: '', line2: '', city: '', pincode: '' })
  );

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  /* Seed profile from auth user on first load */
  useEffect(() => {
    if (user) {
      setSavedProfile(prev => ({
        name: prev.name || user.name || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  /* Load recently viewed from localStorage */
  useEffect(() => {
    try {
      const rv = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      setRecentlyViewed(Array.isArray(rv) ? rv.slice(0, 5) : []);
    } catch { setRecentlyViewed([]); }
  }, []);

  if (!isAuthenticated) return <Navigate to="/" replace />;

  /* ── derived ── */
  const displayName = savedProfile.name || user?.name || 'User';
  const displayPhone = savedProfile.phone || user?.phone || '';
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  const wishlistProducts = wishlistIds
    .map(id => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .slice(0, 6);

  const recentProducts = recentlyViewed
    .map(id => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => !!p);

  /* ── handlers ── */
  const startEditProfile = () => {
    setProfileDraft({ name: displayName, phone: displayPhone });
    setEditingProfile(true);
  };
  const saveProfile = () => {
    const next = { name: profileDraft.name.trim() || displayName, phone: profileDraft.phone.trim() || displayPhone };
    setSavedProfile(next);
    localStorage.setItem(LS_PROFILE, JSON.stringify(next));
    setEditingProfile(false);
  };

  const startEditAddress = () => {
    setAddressDraft({ ...savedAddress });
    setEditingAddress(true);
  };
  const saveAddress = () => {
    setSavedAddress({ ...addressDraft });
    localStorage.setItem(LS_ADDRESS, JSON.stringify(addressDraft));
    setEditingAddress(false);
  };

  const hasAddress = savedAddress.line1 || savedAddress.city;

  /* ═══ JSX ═══ */
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="luxury-container pt-10 md:pt-14">

        {/* ── TOP LABEL ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <p className="text-accent-font text-xs tracking-[0.35em] uppercase text-primary mb-2">My Account</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Profile</h1>
          <div className="gold-divider mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ──────── LEFT COLUMN ──────── */}
          <div className="lg:col-span-1 space-y-6">

            {/* AVATAR CARD */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <Card className="flex flex-col items-center gap-4 text-center">
                {/* Avatar circle */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground flex-shrink-0"
                  style={{ background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-gold-glow)' }}
                >
                  {initials}
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-foreground">{displayName}</p>
                  {displayPhone && (
                    <p className="text-sm text-muted-foreground mt-0.5">+91 {displayPhone.replace(/^(\+91|0091|91)/, '').trim()}</p>
                  )}
                </div>

                <button
                  onClick={startEditProfile}
                  className="flex items-center gap-2 text-xs tracking-widest uppercase text-primary border border-primary/30 rounded-full px-5 py-2 hover:bg-primary/10 transition-all duration-200 btn-premium"
                >
                  <Pencil size={12} /> Edit Profile
                </button>

                {/* Edit profile inline form */}
                <AnimatePresence>
                  {editingProfile && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="w-full overflow-hidden"
                    >
                      <div className="w-full pt-3 border-t border-border space-y-3 text-left">
                        <div>
                          <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Name</label>
                          <input
                            value={profileDraft.name}
                            onChange={e => setProfileDraft(d => ({ ...d, name: e.target.value }))}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Phone</label>
                          <input
                            value={profileDraft.phone}
                            onChange={e => setProfileDraft(d => ({ ...d, phone: e.target.value }))}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                            placeholder="10-digit mobile number"
                          />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={saveProfile}
                            className="flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                          >
                            <Check size={12} /> Save
                          </button>
                          <button
                            onClick={() => setEditingProfile(false)}
                            className="flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X size={12} /> Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>

            {/* QUICK STATS */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="grid grid-cols-3 gap-0 divide-x divide-border text-center p-0 overflow-hidden">
                {[
                  { label: 'Orders', value: DUMMY_ORDERS.length },
                  { label: 'Wishlist', value: wishlistIds.length },
                  { label: 'Viewed', value: recentlyViewed.length },
                ].map(stat => (
                  <div key={stat.label} className="py-4 px-2">
                    <p className="text-xl font-display font-bold text-primary">{stat.value}</p>
                    <p className="text-[10px] tracking-widest uppercase text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </Card>
            </motion.div>

            {/* PAYMENT METHODS */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card>
                <SectionTitle icon={CreditCard} label="Payment Methods" />
                <div className="flex flex-col items-center py-6 gap-3">
                  <CreditCard size={32} className="text-muted-foreground/25" />
                  <p className="text-sm text-muted-foreground">No payment methods added</p>
                </div>
              </Card>
            </motion.div>

            {/* LOGOUT */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <button
                onClick={logout}
                className="flex w-full items-center justify-center gap-2 text-sm text-muted-foreground hover:text-red-400 transition-colors py-3 px-4 rounded-xl border border-border hover:border-red-400/30"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </motion.div>
          </div>

          {/* ──────── RIGHT COLUMN ──────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* ADDRESS */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <div className="flex items-start justify-between mb-5">
                  <SectionTitle icon={MapPin} label="Address" />
                  <button
                    onClick={editingAddress ? saveAddress : startEditAddress}
                    className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-primary hover:opacity-75 transition-opacity"
                  >
                    {editingAddress ? <><Check size={11} /> Save</> : <><Pencil size={11} /> {hasAddress ? 'Edit' : 'Add'}</>}
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {editingAddress ? (
                    <motion.div
                      key="edit"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      {([
                        { key: 'line1', label: 'House / Flat / Street', placeholder: '123, MG Road' },
                        { key: 'line2', label: 'Area / Landmark', placeholder: 'Near City Mall' },
                        { key: 'city', label: 'City', placeholder: 'Bangalore' },
                        { key: 'pincode', label: 'PIN Code', placeholder: '560001' },
                      ] as { key: keyof Address; label: string; placeholder: string }[]).map(f => (
                        <div key={f.key}>
                          <label className="text-[10px] tracking-widest uppercase text-muted-foreground">{f.label}</label>
                          <input
                            value={addressDraft[f.key]}
                            onChange={e => setAddressDraft(d => ({ ...d, [f.key]: e.target.value }))}
                            placeholder={f.placeholder}
                            className="w-full mt-1 px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                      ))}
                      <div className="sm:col-span-2 flex gap-2 pt-1">
                        <button onClick={saveAddress} className="flex items-center gap-1.5 text-xs px-5 py-1.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                          <Check size={12} /> Save Address
                        </button>
                        <button onClick={() => setEditingAddress(false)} className="flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors">
                          <X size={12} /> Cancel
                        </button>
                      </div>
                    </motion.div>
                  ) : hasAddress ? (
                    <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="flex items-start gap-3 p-4 bg-background rounded-xl border border-border">
                        <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-foreground leading-relaxed">
                          {savedAddress.line1 && <p>{savedAddress.line1}</p>}
                          {savedAddress.line2 && <p>{savedAddress.line2}</p>}
                          {(savedAddress.city || savedAddress.pincode) && (
                            <p>{[savedAddress.city, savedAddress.pincode].filter(Boolean).join(' – ')}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-8 gap-3 text-center">
                      <MapPin size={30} className="text-muted-foreground/20" />
                      <p className="text-sm text-muted-foreground">No address saved</p>
                      <button onClick={startEditAddress} className="text-xs text-primary underline underline-offset-4 hover:opacity-75 transition-opacity">Add address</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>

            {/* ORDERS */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card>
                <SectionTitle icon={Package} label="My Orders" />
                <div className="space-y-3">
                  {DUMMY_ORDERS.map((order, i) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.18 + i * 0.06 }}
                      className="flex items-center gap-4 p-4 bg-background rounded-xl border border-border hover:border-primary/20 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <ShoppingBag size={14} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display font-semibold text-sm text-foreground">Order {order.id}</span>
                          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLE[order.status]}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{order.items}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-display font-bold text-sm text-foreground">₹{order.amount}</p>
                        <ChevronRight size={14} className="text-muted-foreground ml-auto mt-1" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* WISHLIST */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <div className="flex items-start justify-between mb-5">
                  <SectionTitle icon={Heart} label="Wishlist" />
                  {wishlistProducts.length > 0 && (
                    <Link to="/wishlist" className="text-[10px] tracking-widest uppercase text-primary hover:opacity-75 transition-opacity flex items-center gap-1">
                      View All <ChevronRight size={11} />
                    </Link>
                  )}
                </div>

                {wishlistProducts.length === 0 ? (
                  <div className="flex flex-col items-center py-8 gap-3">
                    <Heart size={30} className="text-muted-foreground/20" />
                    <p className="text-sm text-muted-foreground">No items in wishlist</p>
                    <Link to="/shop" className="text-xs text-primary underline underline-offset-4 hover:opacity-75 transition-opacity">Browse Fragrances</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {wishlistProducts.map(product => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border hover:border-primary/30 transition-colors group"
                      >
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">{product.name}</p>
                          <p className="text-[10px] text-muted-foreground">from ₹{product.sizes[0]?.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>

            {/* RECENTLY VIEWED */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Card>
                <SectionTitle icon={Clock} label="Recently Viewed" />

                {recentProducts.length === 0 ? (
                  <div className="flex flex-col items-center py-8 gap-3">
                    <Clock size={30} className="text-muted-foreground/20" />
                    <p className="text-sm text-muted-foreground">No recently viewed items</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {recentProducts.map(product => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border hover:border-primary/30 transition-colors group"
                      >
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">{product.name}</p>
                          <p className="text-[10px] text-muted-foreground capitalize">{product.category}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>

          </div>{/* end right column */}
        </div>{/* end grid */}
      </div>
    </div>
  );
};

export default CustomerDashboard;
