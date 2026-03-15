import { ShoppingBag, Package, DollarSign, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { StatCard } from './components/StatCard';
import { MiniChart } from './components/MiniChart';
import { allProducts } from '@/data/products';

export const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-500/10 text-yellow-500',
  Processing: 'bg-blue-500/10 text-blue-500',
  Shipped: 'bg-purple-500/10 text-purple-500',
  Delivered: 'bg-primary/10 text-primary',
  Cancelled: 'bg-destructive/10 text-destructive',
};

import { type FirestoreOrder } from '@/lib/api/orders';

export const AdminOverview = ({ orders, inventory }: { orders: FirestoreOrder[], inventory: any[] }) => {
  const pendingOrders = orders.filter((o: any) => o.status === 'Pending').length;
  const todayOrders = orders.filter((o: any) => o.date === '2026-03-08').length; // Hardcoded in mock
  const totalRevenue = orders.filter((o: any) => o.status !== 'Cancelled').reduce((s: any, o: any) => s + o.total, 0);
  const lowStock = inventory.filter((p: any) => p.stock < 10).length;

  return (
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
          {orders.slice(0, 4).map((o: any) => (
            <div key={o.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <div>
                <p className="text-sm font-semibold text-foreground">{o.id} — {o.customer}</p>
                <p className="text-xs text-muted-foreground">{o.products?.join(', ') || o.items?.map((i: any) => i.name).join(', ')}</p>
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
  );
};
