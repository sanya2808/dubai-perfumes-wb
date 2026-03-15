import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import GiftOptions, { GiftData } from '@/components/GiftOptions';
import { useState } from 'react';

const Cart = () => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();
  const [giftData, setGiftData] = useState<GiftData>({
    isGift: false,
    wrapGift: false,
    message: '',
    packageStyle: 'classic',
    hidePrice: false,
    senderName: '',
    deliverToRecipient: false,
  });

  const giftWrapCost = giftData.isGift && giftData.wrapGift ? 5 : 0;
  const finalTotal = totalPrice + giftWrapCost;

  if (items.length === 0) {
    return (
      <div className="luxury-container py-20 text-center px-4">
        <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6 text-sm sm:text-base">Discover our luxury fragrances and add something special.</p>
        <Link to="/shop" className="btn-premium inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold uppercase tracking-wider text-sm rounded min-h-[44px]">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="luxury-container py-8 sm:py-12">
      <SEO title="Your Shopping Cart" description="Review your selected luxury fragrances before checkout. Secure your order from Dubai Perfumes." path="/cart" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8 sm:mb-12">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Shopping Cart</h1>
        <p className="text-muted-foreground mt-2 text-sm">{totalItems} item{totalItems > 1 ? 's' : ''}</p>
        <div className="gold-divider mt-4" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {items.map(item => (
            <motion.div
              key={`${item.productId}-${item.size}`}
              layout
              className="bg-card rounded-lg p-3 sm:p-5 border border-border shadow-luxury-card"
            >
              {/* Mobile: stacked layout */}
              <div className="flex items-start gap-3 sm:gap-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex-shrink-0 overflow-hidden border border-border">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-foreground truncate text-sm sm:text-base">{item.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{item.size}</p>
                  <p className="font-display font-bold text-primary text-sm sm:text-base">₹{item.price}</p>
                </div>
                <button onClick={() => removeItem(item.productId, item.size)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 sm:hidden">
                  <Trash2 size={16} />
                </button>
              </div>
              {/* Quantity + total row */}
              <div className="flex items-center justify-between mt-3 sm:mt-0 sm:pl-[84px]">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                    className="p-1.5 sm:p-1 rounded border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center">
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                    className="p-1.5 sm:p-1 rounded border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-display font-bold text-foreground text-sm sm:text-base">₹{(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeItem(item.productId, item.size)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors hidden sm:block">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="mt-6">
            <GiftOptions giftData={giftData} onChange={setGiftData} />
          </div>
        </div>

        <div className="bg-card rounded-lg p-5 sm:p-6 border border-border shadow-luxury-card h-fit lg:sticky lg:top-24 space-y-4">
          <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{totalPrice.toFixed(2)}</span></div>
            {giftWrapCost > 0 && (
              <div className="flex justify-between text-muted-foreground"><span>Gift Wrapping</span><span>₹{giftWrapCost.toFixed(2)}</span></div>
            )}
            <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>Free</span></div>
          </div>
          {giftData.isGift && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs text-primary">
              🎁 Gift order — {giftData.hidePrice ? 'Price hidden on invoice' : 'Gift wrapped'}
            </div>
          )}
          <div className="border-t border-border pt-4 flex justify-between font-display font-bold text-lg text-foreground">
            <span>Total</span><span className="text-primary">₹{finalTotal.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            className="btn-premium block text-center w-full px-8 py-4 bg-primary text-primary-foreground font-semibold uppercase tracking-wider text-sm rounded min-h-[44px]"
          >
            Proceed to Checkout
          </Link>
          <Link to="/shop" className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors py-2">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
