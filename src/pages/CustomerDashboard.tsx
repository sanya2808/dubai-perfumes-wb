import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { useAuth } from '@/context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { Package, Heart, Star, User, LogOut } from 'lucide-react';

const CustomerDashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className="luxury-container py-12">
      <SEO title="My Account" description="Manage your orders, favorites, and profile at Dubai Perfumes." path="/dashboard" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
        <p className="text-accent-font text-sm tracking-[0.3em] uppercase text-primary mb-2">My Account</p>
        <h1 className="font-display text-4xl font-bold text-foreground">Welcome, {user?.name}</h1>
        <div className="gold-divider mt-4" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { icon: Package, label: 'My Orders', desc: '3 orders', color: 'text-primary' },
          { icon: Heart, label: 'Favorites', desc: '5 saved', color: 'text-primary' },
          { icon: Star, label: 'My Reviews', desc: '2 reviews', color: 'text-primary' },
          { icon: User, label: 'Profile', desc: user?.email || '', color: 'text-primary' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-lg p-6 shadow-luxury-card text-center"
          >
            <card.icon size={28} className={`mx-auto mb-3 ${card.color}`} />
            <h3 className="font-display font-bold text-foreground">{card.label}</h3>
            <p className="text-sm text-muted-foreground">{card.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-lg p-6 shadow-luxury-card mb-8">
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Recent Orders</h2>
        <div className="space-y-4">
          {[
            { id: 'ORD-001', date: '2026-03-05', total: 165, status: 'Delivered' },
            { id: 'ORD-002', date: '2026-02-28', total: 89, status: 'In Transit' },
            { id: 'ORD-003', date: '2026-02-15', total: 235, status: 'Processing' },
          ].map(order => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <p className="font-semibold text-foreground text-sm">{order.id}</p>
                <p className="text-xs text-muted-foreground">{order.date}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                order.status === 'Delivered' ? 'bg-primary/10 text-primary' :
                order.status === 'In Transit' ? 'bg-accent/10 text-accent' :
                'bg-muted text-muted-foreground'
              }`}>
                {order.status}
              </span>
              <p className="font-display font-bold text-foreground">₹{order.total}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button onClick={logout} className="inline-flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors text-sm">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboard;
