import { Truck, Zap, Clock } from 'lucide-react';

const DeliveryBadges = () => (
  <div className="flex flex-wrap gap-2">
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[11px] font-semibold text-primary">
      <Zap size={12} /> Same Day – Nashik
    </span>
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border rounded-full text-[11px] font-semibold text-muted-foreground">
      <Truck size={12} /> 1–2 Days – Mumbai / Pune
    </span>
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border rounded-full text-[11px] font-semibold text-muted-foreground">
      <Clock size={12} /> 2–3 Days – Other Cities
    </span>
  </div>
);

export default DeliveryBadges;
