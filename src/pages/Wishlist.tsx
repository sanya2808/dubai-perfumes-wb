import { useWishlist } from '@/context/WishlistContext';
import { getProductById } from '@/data/products';
import ProductGrid from '@/components/ProductGrid';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Wishlist = () => {
  const { items } = useWishlist();
  const products = items.map(id => getProductById(id)).filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <div className="luxury-container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <p className="text-accent-font text-sm tracking-[0.4em] uppercase text-primary mb-5">Your Favorites</p>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground">Wishlist</h1>
        <div className="gold-divider mt-8" />
      </motion.div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={48} className="mx-auto text-muted-foreground/30 mb-6" />
          <p className="text-lg text-muted-foreground">Your wishlist is empty.</p>
          <p className="text-sm text-muted-foreground mt-2">Browse our collection and save your favorite fragrances.</p>
        </div>
      ) : (
        <ProductGrid products={products} columnsPerRow={4} />
      )}
    </div>
  );
};

export default Wishlist;
