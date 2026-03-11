import { useState } from 'react';
import { MapPin, Zap, Truck, Clock } from 'lucide-react';

const nashikPins = ['422001', '422002', '422003', '422004', '422005', '422006', '422007', '422008', '422009', '422010', '422011', '422012', '422013'];
const expressCities: Record<string, string[]> = {
  Mumbai: ['400001', '400002', '400003', '400050', '400051', '400053', '400058', '400060', '400070', '400080', '400090'],
  Pune: ['411001', '411002', '411004', '411005', '411006', '411007', '411011', '411030', '411038', '411041'],
  Satara: ['415001', '415002', '415003'],
};

const getEstimate = (pin: string) => {
  if (nashikPins.some(p => pin.startsWith(p.slice(0, 4)))) {
    return { icon: Zap, text: 'Same Day Gift Delivery Available', city: 'Nashik', color: 'text-primary' };
  }
  for (const [city, pins] of Object.entries(expressCities)) {
    if (pins.some(p => pin.startsWith(p.slice(0, 4)))) {
      return { icon: Truck, text: '1–2 Day Express Delivery Available', city, color: 'text-primary' };
    }
  }
  return { icon: Clock, text: 'Estimated delivery: 2–3 business days', city: '', color: 'text-muted-foreground' };
};

interface Props {
  onEstimate?: (estimate: string) => void;
}

const DeliveryEstimator = ({ onEstimate }: Props) => {
  const [pin, setPin] = useState('');
  const [result, setResult] = useState<ReturnType<typeof getEstimate> | null>(null);

  const handleCheck = () => {
    if (pin.length >= 6) {
      const est = getEstimate(pin);
      setResult(est);
      onEstimate?.(est.text);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={pin}
            onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter PIN code"
            className="w-full pl-9 pr-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
          />
        </div>
        <button
          onClick={handleCheck}
          disabled={pin.length < 6}
          className="px-4 py-2.5 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-40"
        >
          Check
        </button>
      </div>
      {result && (
        <div className={`flex items-center gap-2 text-sm ${result.color}`}>
          <result.icon size={16} />
          <span>{result.text}</span>
        </div>
      )}
    </div>
  );
};

export default DeliveryEstimator;
