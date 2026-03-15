import { Star, Check, Eye, Trash2 } from 'lucide-react';
import { allProducts } from '@/data/products';

export const AdminReviews = () => {
  return (
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
  );
};
