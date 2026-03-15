export const MiniChart = ({ data, label }: { data: number[]; label: string }) => {
  const max = Math.max(...data);
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-luxury-card">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">{label}</p>
      <div className="flex items-end gap-2 h-32">
        {data.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-primary/80 rounded-t transition-all duration-500 hover:bg-primary"
              style={{ height: `${(v / max) * 100}%`, minHeight: 4 }}
            />
            <span className="text-[9px] text-muted-foreground">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
