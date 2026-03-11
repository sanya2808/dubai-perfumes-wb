import { Clock, Wind, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface MetricProps {
  label: string;
  value: number; // 1-10
  icon: React.ReactNode;
  descriptor: string;
}

const getDescriptor = (label: string, value: number): string => {
  if (label === 'Longevity') {
    if (value <= 3) return 'Light';
    if (value <= 5) return 'Moderate';
    if (value <= 7) return 'Long-lasting';
    return 'Beast Mode';
  }
  if (label === 'Projection') {
    if (value <= 3) return 'Intimate';
    if (value <= 5) return 'Moderate';
    if (value <= 7) return 'Strong';
    return 'Room-filling';
  }
  // Sillage
  if (value <= 3) return 'Soft';
  if (value <= 5) return 'Moderate';
  if (value <= 7) return 'Heavy';
  return 'Enormous';
};

const Metric = ({ label, value, icon, descriptor }: MetricProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        {icon}
        {label}
      </div>
      <span className="text-xs font-medium text-primary">{descriptor} ({value}/10)</span>
    </div>
    <Progress value={value * 10} className="h-2 bg-border/50" />
  </div>
);

interface FragranceMetricsProps {
  longevity?: number;
  projection?: number;
  sillage?: number;
}

const FragranceMetrics = ({ longevity, projection, sillage }: FragranceMetricsProps) => {
  const metrics = [
    longevity != null && { label: 'Longevity', value: longevity, icon: <Clock size={15} className="text-primary" /> },
    projection != null && { label: 'Projection', value: projection, icon: <Zap size={15} className="text-primary" /> },
    sillage != null && { label: 'Sillage', value: sillage, icon: <Wind size={15} className="text-primary" /> },
  ].filter(Boolean) as { label: string; value: number; icon: React.ReactNode }[];

  if (metrics.length === 0) return null;

  return (
    <div className="bg-secondary rounded-lg p-5 border border-border space-y-4">
      <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">Performance</h3>
      {metrics.map(m => (
        <Metric key={m.label} label={m.label} value={m.value} icon={m.icon} descriptor={getDescriptor(m.label, m.value)} />
      ))}
    </div>
  );
};

export default FragranceMetrics;
