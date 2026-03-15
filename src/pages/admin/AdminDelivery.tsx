import { useState } from 'react';
import { Edit, Check, X } from 'lucide-react';

export const mockDeliveryRules = [
  { id: '1', city: 'Nashik', estimate: 'Same Day Delivery', type: 'same-day' },
  { id: '2', city: 'Mumbai', estimate: '1–2 Day Delivery', type: 'express' },
  { id: '3', city: 'Pune', estimate: '1–2 Day Delivery', type: 'express' },
  { id: '4', city: 'Satara', estimate: '1–2 Day Delivery', type: 'express' },
  { id: '5', city: 'Other Cities', estimate: '2–3 Day Delivery', type: 'standard' },
];

export const AdminDelivery = () => {
  const [deliveryRules, setDeliveryRules] = useState(mockDeliveryRules);
  const [editingDelivery, setEditingDelivery] = useState<string | null>(null);
  const [editDeliveryValue, setEditDeliveryValue] = useState('');

  const saveDeliveryRule = (id: string) => {
    setDeliveryRules(prev => prev.map(r => r.id === id ? { ...r, estimate: editDeliveryValue } : r));
    setEditingDelivery(null);
  };

  return (
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
  );
};
