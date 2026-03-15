import { LucideIcon, TrendingUp } from 'lucide-react';

export const StatCard = ({ label, value, icon: Icon, trend }: { label: string; value: string | number; icon: LucideIcon; trend?: string }) => (
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
