import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { statusColors } from './AdminOverview';

const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

import { type FirestoreOrder } from '@/lib/api/orders';

export const AdminOrders = ({ orders, updateOrderStatus }: { orders: FirestoreOrder[], updateOrderStatus: (id: string, status: string) => void }) => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  return (
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
                    <td className="p-4 text-muted-foreground text-xs">{o.products?.join(', ') || o.items?.map((i: any) => i.name).join(', ')}</td>
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
  );
};
