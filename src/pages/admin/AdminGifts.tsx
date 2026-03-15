import { statusColors } from './AdminOverview';

export const AdminGifts = ({ orders, updateGiftStatus }: { orders: any[], updateGiftStatus: (id: string, status: string) => void }) => {
  const giftOrders = orders.filter(o => o.isGift);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-foreground">Gift Orders</h2>
      {giftOrders.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No gift orders yet.</p>
      ) : (
        <div className="space-y-4">
          {giftOrders.map(o => (
            <div key={o.id} className="bg-card rounded-xl p-6 border border-primary/20 shadow-luxury-card space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-lg font-bold text-foreground">{o.id} — {o.customer}</p>
                  <p className="text-xs text-muted-foreground">{o.date} • {o.city}</p>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${statusColors[o.status]}`}>{o.status}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Recipient</p><p className="text-foreground font-semibold">{o.giftRecipient}</p></div>
                <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Gift Wrap</p><p className="text-foreground font-semibold">{o.giftWrap}</p></div>
                <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Message</p><p className="text-foreground italic text-xs">"{o.giftMessage}"</p></div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Gift Status</p>
                  <select
                    value={o.giftStatus || 'Gift Prepared'}
                    onChange={e => updateGiftStatus(o.id, e.target.value)}
                    className="mt-1 text-xs font-semibold px-3 py-1.5 bg-primary/10 text-primary rounded-lg border border-primary/20 focus:outline-none cursor-pointer"
                  >
                    <option>Gift Prepared</option>
                    <option>Gift Dispatched</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
