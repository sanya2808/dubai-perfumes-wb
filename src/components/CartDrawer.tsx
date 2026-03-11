import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setCouponApplied(true);
    }
  };

  const handleCheckout = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-background border-l border-border z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
              <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">Shopping Cart</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <ShoppingBag size={48} className="text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Your cart is empty</p>
                  <button
                    onClick={onClose}
                    className="text-primary hover:text-primary/80 transition-colors font-semibold"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                  {items.map(item => (
                    <motion.div
                      key={`${item.productId}-${item.size}`}
                      layout
                      className="bg-card rounded-lg p-3 sm:p-4 border border-border"
                    >
                      <div className="flex gap-3 mb-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-foreground text-sm truncate">{item.name}</h3>
                          <p className="text-xs text-muted-foreground">{item.size}</p>
                          <p className="font-display font-bold text-primary text-sm">₹{item.price}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.size)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                            className="p-1 rounded border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold text-foreground">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                            className="p-1 rounded border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="font-display font-bold text-foreground text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </motion.div>
                  ))}

                  {/* Coupon Section */}
                  <div className="border-t border-border pt-4 mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Apply Coupon</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={couponApplied}
                        className="flex-1 px-3 py-2 bg-muted border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponApplied || !couponCode.trim()}
                        className="px-3 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded hover:bg-primary/90 disabled:opacity-50 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponApplied && (
                      <p className="text-xs text-primary mt-2">✓ Coupon applied</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-4 sm:p-6 space-y-3">
                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold text-foreground">Free</span>
                </div>

                {/* Total */}
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-display font-bold text-foreground">Total ({totalItems} items)</span>
                  <span className="font-display font-bold text-primary text-lg">₹{totalPrice.toFixed(2)}</span>
                </div>

                {/* Buttons */}
                <div className="space-y-2 pt-2">
                  <Link
                    to="/checkout"
                    onClick={handleCheckout}
                    className="block text-center w-full px-6 py-3 bg-primary text-primary-foreground font-semibold uppercase tracking-wider text-xs rounded min-h-[44px] hover:bg-primary/90 transition-colors"
                  >
                    Checkout
                  </Link>
                  <button
                    onClick={onClose}
                    className="block text-center w-full px-6 py-3 border border-border text-foreground font-semibold uppercase tracking-wider text-xs rounded hover:bg-muted transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
