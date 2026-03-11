import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { CheckCircle, Gift, Truck } from 'lucide-react';
import GiftOptions, { GiftData } from '@/components/GiftOptions';
import DeliveryEstimator from '@/components/DeliveryEstimator';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [placed, setPlaced] = useState(false);
  const [deliveryEstimate, setDeliveryEstimate] = useState('');
  const [giftData, setGiftData] = useState<GiftData>({
    isGift: false, wrapGift: false, message: '', packageStyle: 'classic',
    hidePrice: false, senderName: '', deliverToRecipient: false,
  });

  const giftWrapCost = giftData.isGift && giftData.wrapGift ? 5 : 0;
  const finalTotal = totalPrice + giftWrapCost;

  if (placed) {
    return (
      <div className="luxury-container py-20 text-center px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <CheckCircle size={64} className="mx-auto text-primary mb-4" />
        </motion.div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">Order Placed!</h1>
        <p className="text-muted-foreground mb-6 text-sm sm:text-base">Thank you for your order. You'll receive a confirmation shortly.</p>
        <Link to="/shop" className="btn-premium inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold uppercase tracking-wider text-sm rounded min-h-[44px]">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="luxury-container py-20 text-center px-4">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">No Items to Checkout</h1>
        <Link to="/shop" className="text-primary">Go to Shop</Link>
      </div>
    );
  }

  return (
    <div className="luxury-container py-8 sm:py-12">
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">Checkout</h1>
      <div className="gold-divider mb-8 sm:mb-12" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Form */}
        <div className="space-y-6">
          {!isAuthenticated && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm">
              <Link to="/login" className="text-primary font-semibold">Log in</Link>
              <span className="text-muted-foreground"> for a faster checkout experience.</span>
            </div>
          )}
          <div>
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Shipping Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {['First Name', 'Last Name', 'Email', 'Phone', 'Address', 'City', 'PIN Code'].map(field => (
                <div key={field} className={field === 'Address' ? 'sm:col-span-2' : ''}>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">{field}</label>
                  <input
                    className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground min-h-[44px]"
                    placeholder={field}
                    type={field === 'Email' ? 'email' : field === 'Phone' || field === 'PIN Code' ? 'tel' : 'text'}
                    inputMode={field === 'Phone' || field === 'PIN Code' ? 'numeric' : undefined}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-secondary rounded-lg p-4 sm:p-5 border border-border space-y-3">
            <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
              <Truck size={16} className="text-primary" /> Delivery Estimate
            </h3>
            <DeliveryEstimator onEstimate={setDeliveryEstimate} />
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Gift size={18} className="text-primary" /> Gifting Options
            </h3>
            <GiftOptions giftData={giftData} onChange={setGiftData} />
          </div>

          <div>
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Payment Method</h3>
            <div className="bg-muted border border-border rounded-lg p-4 text-sm text-muted-foreground">
              Payment integration ready. Cash on Delivery available.
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-lg p-5 sm:p-6 border border-border shadow-luxury-card h-fit lg:sticky lg:top-24 space-y-4">
          <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">Order Summary</h3>
          <div className="space-y-3">
            {items.map(item => (
              <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm gap-2">
                <span className="text-foreground truncate">{item.name} ({item.size}) ×{item.quantity}</span>
                <span className="text-foreground font-semibold flex-shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{totalPrice.toFixed(2)}</span></div>
            {giftWrapCost > 0 && (
              <div className="flex justify-between text-muted-foreground"><span>Gift Wrapping</span><span>₹{giftWrapCost.toFixed(2)}</span></div>
            )}
            <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>Free</span></div>
          </div>

          {deliveryEstimate && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs text-primary flex items-center gap-2">
              <Truck size={14} /> {deliveryEstimate}
            </div>
          )}

          {giftData.isGift && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs space-y-1">
              <p className="text-primary font-semibold">🎁 Gift Order</p>
              {giftData.wrapGift && <p className="text-muted-foreground">Premium gift wrapping included</p>}
              {giftData.hidePrice && <p className="text-muted-foreground">Price hidden on invoice</p>}
              {giftData.message && <p className="text-muted-foreground italic">Message: "{giftData.message.slice(0, 50)}..."</p>}
            </div>
          )}

          <div className="border-t border-border pt-4 flex justify-between font-display font-bold text-lg sm:text-xl text-foreground">
            <span>Total</span><span className="text-primary">₹{finalTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={() => { setPlaced(true); clearCart(); }}
            className="btn-premium w-full px-8 py-4 bg-primary text-primary-foreground font-semibold uppercase tracking-wider text-sm rounded min-h-[44px]"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
