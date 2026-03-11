import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

interface Props {
  visible: boolean;
  productId: string;
  name: string;
  price: number;
  size: string;
  image: string;
}

const StickyAddToCart = ({ visible, productId, name, price, size, image }: Props) => {
  const { addItem } = useCart();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md shadow-luxury-elevated"
        >
          <div className="luxury-container flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <img src={image} alt={name} className="w-10 h-10 rounded object-cover border border-border flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{name}</p>
                <p className="text-xs text-muted-foreground">{size}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="font-display text-lg font-bold text-primary">₹{price}</span>
              <button
                onClick={() => addItem({ productId, name, size, price, image })}
                className="btn-premium flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold uppercase tracking-wider text-xs rounded"
              >
                <ShoppingBag size={14} /> Add to Cart
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyAddToCart;
