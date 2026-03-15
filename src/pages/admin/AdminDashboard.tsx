import { useState, useEffect } from 'react';
import SEO from '@/components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Star, Truck, Gift,
  BarChart3, Settings, LogOut, Bell, FileText, Tag,
} from 'lucide-react';

import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminGifts } from './AdminGifts';
import { AdminOffers } from './AdminOffers';
import { AdminDelivery } from './AdminDelivery';
import { AdminInventory } from './AdminInventory';
import { AdminReviews } from './AdminReviews';
import { AdminContent } from './AdminContent';
import { AdminSettings } from './AdminSettings';
import { allProducts } from '@/data/products';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Database, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { subscribeToOrders, updateOrderStatus as firestoreUpdateOrderStatus, updateGiftStatus as firestoreUpdateGiftStatus, type FirestoreOrder } from '@/lib/api/orders';

export interface Order {
  id: string; customer: string; phone: string; address: string; city: string;
  products: string[]; total: number; status: string; payment: string;
  isGift: boolean; date: string;
  giftMessage?: string; giftRecipient?: string; giftWrap?: string; giftStatus?: string;
}

const mockOrders: Order[] = [
  { id: 'ORD-101', customer: 'Ahmed K.', phone: '+91 9876543210', address: '123 MG Road', city: 'Nashik', products: ['Nomade Oud (50ml)', 'Rouge Crystal (20ml)'], total: 135, status: 'Pending', payment: 'COD', isGift: false, date: '2026-03-08' },
  { id: 'ORD-100', customer: 'Sarah M.', phone: '+91 9123456789', address: '45 FC Road', city: 'Pune', products: ['Dark Leather (100ml)'], total: 135, status: 'Processing', payment: 'Online', isGift: true, giftMessage: 'Happy Birthday dear!', giftRecipient: 'Fatima', giftWrap: 'Royal Velvet', giftStatus: 'Gift Prepared', date: '2026-03-07' },
  { id: 'ORD-099', customer: 'Khalid R.', phone: '+91 9988776655', address: '78 Marine Drive', city: 'Mumbai', products: ['COMP OUD (12ml)', 'Musk Tahara (6ml)'], total: 98, status: 'Shipped', payment: 'Online', isGift: false, date: '2026-03-06' },
  { id: 'ORD-098', customer: 'Fatima A.', phone: '+91 9112233445', address: '22 Station Road', city: 'Satara', products: ['Aventus Legend (100ml)'], total: 155, status: 'Delivered', payment: 'COD', isGift: false, date: '2026-03-05' },
  { id: 'ORD-097', customer: 'Omar J.', phone: '+91 9001122334', address: '56 Ring Road', city: 'Delhi', products: ['Lady Gold (50ml)', 'Black Oud (6ml)'], total: 122, status: 'Delivered', payment: 'Online', isGift: true, giftMessage: 'With love!', giftRecipient: 'Aisha', giftWrap: 'Classic Gold', giftStatus: 'Gift Dispatched', date: '2026-03-04' },
  { id: 'ORD-096', customer: 'Riya P.', phone: '+91 9776655443', address: '10 Lake Road', city: 'Nashik', products: ['Femme Noire (20ml)'], total: 42, status: 'Cancelled', payment: 'COD', isGift: false, date: '2026-03-03' },
];

const mockInventory = allProducts.map(p => ({
  ...p,
  stock: Math.floor(Math.random() * 50) + 2,
}));

const AdminDashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<FirestoreOrder[]>([]);
  const [inventory, setInventory] = useState(mockInventory);
  const [showNotifications, setShowNotifications] = useState(false);

  const [isSyncing, setIsSyncing] = useState(false);

  // Real-time orders listener from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToOrders(
      (firestoreOrders) => {
        setOrders(firestoreOrders);
      },
      (error) => {
        console.error('Orders listener error:', error);
        toast.error('Failed to load orders from database');
      }
    );
    return () => unsubscribe();
  }, []);

  if (!isAuthenticated || !user?.isAdmin) return <Navigate to="/login" />;

  const syncToFirestore = async () => {
    if (!confirm('This will upload all local products to Firestore. Continue?')) return;
    
    setIsSyncing(true);
    try {
      for (const product of allProducts) {
        // Clean up any undefined fields or asset imports that might break
        const cleanProduct = JSON.parse(JSON.stringify(product));
        await setDoc(doc(db, 'products', product.id), cleanProduct);
      }
      toast.success('Successfully synced all products to Firestore!');
    } catch (error: any) {
      console.error('Migration error:', error);
      toast.error('Failed to sync: ' + error.message);
    } finally {
      setIsSyncing(false);
    }
  };

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

  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await firestoreUpdateOrderStatus(orderId, newStatus);
      toast.success(`Order ${orderId.slice(0, 8)}... status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error('Failed to update order status: ' + err.message);
    }
  };

  const updateGiftStatusHandler = async (orderId: string, giftStatus: string) => {
    try {
      await firestoreUpdateGiftStatus(orderId, giftStatus);
      toast.success('Gift status updated');
    } catch (err: any) {
      toast.error('Failed to update gift status: ' + err.message);
    }
  };

  const updateStock = (productId: string, newStock: number) => {
    setInventory(prev => prev.map(p => p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p));
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
                {pendingOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center font-bold">{pendingOrdersCount}</span>
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
              className="fixed inset-0 z-40 cursor-default"
              style={{ display: showNotifications ? 'block' : 'none' }}
              aria-hidden="true"
            />
            <button 
              onClick={syncToFirestore} 
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 text-xs font-semibold border border-primary/20 rounded-lg transition-colors disabled:opacity-50"
              title="Sync local products to Firestore"
            >
              <Database size={14} /> 
              {isSyncing ? <RefreshCw size={14} className="animate-spin" /> : 'Sync Data'}
            </button>
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
            {activeTab === 'overview' && <AdminOverview orders={orders} inventory={inventory} />}
            {activeTab === 'products' && <AdminProducts inventory={inventory} />}
            {activeTab === 'orders' && <AdminOrders orders={orders} updateOrderStatus={updateOrderStatus} />}
            {activeTab === 'gifts' && <AdminGifts orders={orders} updateGiftStatus={updateGiftStatusHandler} />}
            {activeTab === 'offers' && <AdminOffers />}
            {activeTab === 'delivery' && <AdminDelivery />}
            {activeTab === 'inventory' && <AdminInventory inventory={inventory} updateStock={updateStock} />}
            {activeTab === 'reviews' && <AdminReviews />}
            {activeTab === 'content' && <AdminContent />}
            {activeTab === 'settings' && <AdminSettings />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
