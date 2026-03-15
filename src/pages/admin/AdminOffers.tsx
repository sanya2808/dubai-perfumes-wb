import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  couponCode?: string;
  applicableProducts: string[];
  applicableCategories: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export const mockOffers: Offer[] = [
  {
    id: 'OFF-001',
    title: 'Spring Collection Discount',
    description: '20% off on all Inspired Collection perfumes',
    discountType: 'percentage',
    discountValue: 20,
    couponCode: 'SPRING20',
    applicableProducts: [],
    applicableCategories: ['inspired'],
    startDate: '2026-03-01',
    endDate: '2026-04-30',
    isActive: true,
  },
  {
    id: 'OFF-002',
    title: 'Buy 2 Get 1 Free',
    description: 'Fixed discount on bulk orders',
    discountType: 'fixed',
    discountValue: 45,
    couponCode: 'BUY2GET1',
    applicableProducts: [],
    applicableCategories: ['attar', 'international'],
    startDate: '2026-03-05',
    endDate: '2026-03-31',
    isActive: true,
  },
  {
    id: 'OFF-003',
    title: 'First Time Buyer',
    description: '₹100 discount for new customers',
    discountType: 'fixed',
    discountValue: 100,
    couponCode: 'FIRST100',
    applicableProducts: [],
    applicableCategories: ['inspired', 'attar', 'international'],
    startDate: '2026-02-01',
    endDate: '2026-12-31',
    isActive: false,
  },
];

export const AdminOffers = () => {
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerForm, setOfferForm] = useState<Offer>({
    id: '', title: '', description: '', discountType: 'percentage', discountValue: 0,
    couponCode: '', applicableProducts: [], applicableCategories: [], startDate: '', endDate: '', isActive: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">Manage Offers</h2>
        <button
          onClick={() => {
            setShowOfferForm(!showOfferForm);
            setEditingOffer(null);
            setOfferForm({
              id: '', title: '', description: '', discountType: 'percentage', discountValue: 0,
              couponCode: '', applicableProducts: [], applicableCategories: [], startDate: '', endDate: '', isActive: true,
            });
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={14} /> Add Offer
        </button>
      </div>

      {showOfferForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-6 border border-border shadow-luxury-card space-y-4"
        >
          <h3 className="font-display font-bold text-foreground">{editingOffer ? 'Edit Offer' : 'Create New Offer'}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Offer Title</label>
              <input
                type="text"
                value={offerForm.title}
                onChange={e => setOfferForm({ ...offerForm, title: e.target.value })}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="e.g., Spring Sale"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Coupon Code (Optional)</label>
              <input
                type="text"
                value={offerForm.couponCode || ''}
                onChange={e => setOfferForm({ ...offerForm, couponCode: e.target.value })}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="e.g., SPRING20"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Description</label>
              <textarea
                value={offerForm.description}
                onChange={e => setOfferForm({ ...offerForm, description: e.target.value })}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                rows={3}
                placeholder="Describe the offer..."
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Discount Type</label>
              <select
                value={offerForm.discountType}
                onChange={e => setOfferForm({ ...offerForm, discountType: e.target.value as 'percentage' | 'fixed' })}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Discount Value</label>
              <input
                type="number"
                value={offerForm.discountValue}
                onChange={e => setOfferForm({ ...offerForm, discountValue: parseFloat(e.target.value) })}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder={offerForm.discountType === 'percentage' ? '20' : '100'}
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Start Date</label>
              <input
                type="date"
                value={offerForm.startDate}
                onChange={e => setOfferForm({ ...offerForm, startDate: e.target.value })}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">End Date</label>
              <input
                type="date"
                value={offerForm.endDate}
                onChange={e => setOfferForm({ ...offerForm, endDate: e.target.value })}
                className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Applicable Categories</label>
              <div className="flex gap-3">
                {['inspired', 'attar', 'international'].map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={offerForm.applicableCategories.includes(cat)}
                      onChange={e => {
                        const cats = e.target.checked
                          ? [...offerForm.applicableCategories, cat]
                          : offerForm.applicableCategories.filter(c => c !== cat);
                        setOfferForm({ ...offerForm, applicableCategories: cats });
                      }}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
                    />
                    <span className="text-sm capitalize text-foreground">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={offerForm.isActive}
                  onChange={e => setOfferForm({ ...offerForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30"
                />
                <span className="text-sm text-foreground font-semibold">Active</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                if (editingOffer) {
                  setOffers(prev => prev.map(o => o.id === editingOffer.id ? offerForm : o));
                } else {
                  setOffers(prev => [...prev, { ...offerForm, id: `OFF-${Date.now()}` }]);
                }
                setShowOfferForm(false);
                setEditingOffer(null);
              }}
              className="btn-premium px-4 py-2.5 bg-primary text-primary-foreground text-xs font-semibold uppercase rounded-lg"
            >
              {editingOffer ? 'Update Offer' : 'Create Offer'}
            </button>
            <button
              onClick={() => {
                setShowOfferForm(false);
                setEditingOffer(null);
              }}
              className="px-4 py-2.5 border border-border text-foreground text-xs font-semibold uppercase rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Offers Table */}
      <div className="bg-card rounded-xl shadow-luxury-card overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                {['Title', 'Discount', 'Coupon', 'Start Date', 'End Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left p-4 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {offers.map(offer => (
                <tr key={offer.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-semibold text-foreground">{offer.title}</p>
                      <p className="text-xs text-muted-foreground">{offer.description}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-primary">
                      {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`}
                    </span>
                  </td>
                  <td className="p-4 text-foreground">{offer.couponCode || '—'}</td>
                  <td className="p-4 text-muted-foreground">{offer.startDate}</td>
                  <td className="p-4 text-muted-foreground">{offer.endDate}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      offer.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingOffer(offer);
                        setOfferForm(offer);
                        setShowOfferForm(true);
                      }}
                      className="p-1.5 rounded border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => setOffers(prev => prev.filter(o => o.id !== offer.id))}
                      className="p-1.5 rounded border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
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
