import { useState } from 'react';
import { Gift, MessageSquare, Eye, EyeOff, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface GiftData {
  isGift: boolean;
  wrapGift: boolean;
  message: string;
  packageStyle: string;
  hidePrice: boolean;
  senderName: string;
  deliverToRecipient: boolean;
}

interface Props {
  giftData: GiftData;
  onChange: (data: GiftData) => void;
}

const packageStyles = [
  { id: 'classic', label: 'Classic Gold', desc: 'Gold foil with black ribbon' },
  { id: 'royal', label: 'Royal Velvet', desc: 'Velvet box with gold trim' },
  { id: 'minimal', label: 'Minimal Luxury', desc: 'Matte black with embossing' },
];

const GiftOptions = ({ giftData, onChange }: Props) => {
  const update = (partial: Partial<GiftData>) => onChange({ ...giftData, ...partial });

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <button
        onClick={() => update({ isGift: !giftData.isGift })}
        className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all duration-300 ${
          giftData.isGift
            ? 'border-primary bg-primary/5 shadow-gold-glow'
            : 'border-border bg-card hover:border-primary/40'
        }`}
      >
        <Gift size={20} className={giftData.isGift ? 'text-primary' : 'text-muted-foreground'} />
        <div className="text-left flex-1">
          <p className="text-sm font-semibold text-foreground">Send as Gift</p>
          <p className="text-[11px] text-muted-foreground">Add gift wrapping and a personal message</p>
        </div>
        <div className={`w-10 h-5 rounded-full transition-colors duration-300 relative ${giftData.isGift ? 'bg-primary' : 'bg-muted'}`}>
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-card shadow transition-transform duration-300 ${giftData.isGift ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
      </button>

      <AnimatePresence>
        {giftData.isGift && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-2">
              {/* Gift wrap */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={giftData.wrapGift}
                  onChange={e => update({ wrapGift: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
                />
                <Package size={16} className="text-primary" />
                <div>
                  <span className="text-sm text-foreground">Premium Gift Wrapping</span>
                  <span className="text-xs text-muted-foreground ml-2">+ ₹5.00</span>
                </div>
              </label>

              {/* Package style */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Packaging Style</p>
                <div className="grid grid-cols-3 gap-2">
                  {packageStyles.map(s => (
                    <button
                      key={s.id}
                      onClick={() => update({ packageStyle: s.id })}
                      className={`p-3 rounded-lg border text-center transition-all duration-300 ${
                        giftData.packageStyle === s.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <p className="text-xs font-semibold text-foreground">{s.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sender name */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">From (Sender Name)</label>
                <input
                  value={giftData.senderName}
                  onChange={e => update({ senderName: e.target.value })}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block flex items-center gap-1.5">
                  <MessageSquare size={12} /> Personal Message
                </label>
                <textarea
                  value={giftData.message}
                  onChange={e => update({ message: e.target.value })}
                  placeholder="Write a message for the recipient..."
                  maxLength={200}
                  rows={3}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground resize-none"
                />
                <p className="text-[10px] text-muted-foreground text-right mt-1">{giftData.message.length}/200</p>
              </div>

              {/* Message card preview */}
              {giftData.message && (
                <div className="bg-secondary border border-primary/20 rounded-lg p-4 relative">
                  <p className="text-[10px] text-primary uppercase tracking-widest mb-2">Gift Card Preview</p>
                  <div className="bg-card border border-border rounded-lg p-4 shadow-luxury">
                    <p className="text-accent-font text-sm text-foreground italic leading-relaxed">"{giftData.message}"</p>
                    {giftData.senderName && (
                      <p className="text-xs text-primary mt-2 text-right">— {giftData.senderName}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Hide price */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={giftData.hidePrice}
                  onChange={e => update({ hidePrice: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
                />
                {giftData.hidePrice ? <EyeOff size={16} className="text-primary" /> : <Eye size={16} className="text-muted-foreground" />}
                <span className="text-sm text-foreground">Hide price on invoice</span>
              </label>

              {/* Deliver to recipient */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={giftData.deliverToRecipient}
                  onChange={e => update({ deliverToRecipient: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
                />
                <span className="text-sm text-foreground">Deliver directly to recipient</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GiftOptions;
