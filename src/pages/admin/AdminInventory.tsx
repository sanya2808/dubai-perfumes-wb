import { AlertTriangle } from 'lucide-react';

export const AdminInventory = ({ inventory, updateStock }: { inventory: any[], updateStock: (id: string, newStock: number) => void }) => {
  const lowStock = inventory.filter(p => p.stock < 10).length;

  return (
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
  );
};
