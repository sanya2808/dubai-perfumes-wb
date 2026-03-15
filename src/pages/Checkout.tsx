import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { CheckCircle, Gift, Truck, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import GiftOptions, { GiftData } from '@/components/GiftOptions';
import DeliveryEstimator from '@/components/DeliveryEstimator';
import { createOrder, decrementStock } from '@/lib/api/orders';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  pinCode: z.string().regex(/^[0-9]{6}$/, 'Please enter a valid 6-digit PIN code'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const formFields = [
  { name: 'firstName' as const, label: 'First Name', placeholder: 'First Name', type: 'text' },
  { name: 'lastName' as const, label: 'Last Name', placeholder: 'Last Name', type: 'text' },
  { name: 'email' as const, label: 'Email', placeholder: 'Email', type: 'email' },
  { name: 'phone' as const, label: 'Phone', placeholder: '10-digit number', type: 'tel', inputMode: 'numeric' as const },
  { name: 'address' as const, label: 'Address', placeholder: 'Full Address', type: 'text', colSpan: true },
  { name: 'city' as const, label: 'City', placeholder: 'City', type: 'text' },
  { name: 'pinCode' as const, label: 'PIN Code', placeholder: '6-digit PIN', type: 'tel', inputMode: 'numeric' as const },
];

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState('');
  const [giftData, setGiftData] = useState<GiftData>({
    isGift: false, wrapGift: false, message: '', packageStyle: 'classic',
    hidePrice: false, senderName: '', deliverToRecipient: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onTouched',
  });

  const giftWrapCost = giftData.isGift && giftData.wrapGift ? 5 : 0;
  const finalTotal = totalPrice + giftWrapCost;

  const onSubmit = async (data: CheckoutFormData) => {
    setOrderLoading(true);
    setOrderError('');
    try {
      const orderItems = items.map(item => ({
        productId: item.productId,
        name: item.name,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const newOrderId = await createOrder({
        customer: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        pinCode: data.pinCode,
        items: orderItems,
        products: items.map(i => `${i.name} (${i.size}) ×${i.quantity}`),
        total: finalTotal,
        status: 'Pending',
        payment: 'Cash on Delivery',
        isGift: giftData.isGift,
        giftMessage: giftData.message || undefined,
        giftWrap: giftData.wrapGift ? giftData.packageStyle : undefined,
        date: new Date().toISOString().split('T')[0],
        userId: user?.id || undefined,
      });

      // Decrement stock for each item
      for (const item of items) {
        await decrementStock(item.productId, item.quantity);
      }

      setOrderId(newOrderId);
      setPlaced(true);
      clearCart();
    } catch (err: any) {
      console.error('Order placement failed:', err);
      setOrderError('Failed to place order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  if (placed) {
    return (
      <div className="luxury-container py-20 text-center px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <CheckCircle size={64} className="mx-auto text-primary mb-4" />
        </motion.div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">Order Placed!</h1>
        {orderId && (
          <p className="text-primary font-mono font-semibold mb-2 text-sm">Order ID: {orderId}</p>
        )}
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
      <SEO title="Checkout" description="Complete your purchase of luxury perfumes and attars safely and securely." path="/checkout" />
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">Checkout</h1>
      <div className="gold-divider mb-8 sm:mb-12" />
      <form onSubmit={handleSubmit(onSubmit)}>
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
                {formFields.map(field => (
                  <div key={field.name} className={field.colSpan ? 'sm:col-span-2' : ''}>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">{field.label}</label>
                    <input
                      {...register(field.name)}
                      className={`w-full px-4 py-3 bg-muted border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground min-h-[44px] ${
                        errors[field.name] ? 'border-destructive focus:ring-destructive/30' : 'border-border'
                      }`}
                      placeholder={field.placeholder}
                      type={field.type}
                      inputMode={field.inputMode}
                    />
                    {errors[field.name] && (
                      <p className="text-destructive text-xs mt-1">{errors[field.name]?.message}</p>
                    )}
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
            {orderError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-500">
                {orderError}
              </div>
            )}
            <button
              type="submit"
              disabled={!isValid || orderLoading}
              className="btn-premium w-full px-8 py-4 bg-primary text-primary-foreground font-semibold uppercase tracking-wider text-sm rounded min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {orderLoading && <Loader className="animate-spin" size={16} />}
              {orderLoading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
