import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, ArrowLeft, Wind, User, Tag, Heart } from 'lucide-react';
import { getProductById, allProducts } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import StarRating from '@/components/StarRating';
import ProductGrid from '@/components/ProductGrid';
import { Badge } from '@/components/ui/badge';
import DeliveryBadges from '@/components/DeliveryBadges';
import DeliveryEstimator from '@/components/DeliveryEstimator';
import NoteImage from '@/components/NoteImage';
import FragranceMetrics from '@/components/FragranceMetrics';
import StickyAddToCart from '@/components/StickyAddToCart';

const categoryLabels = { inspired: 'Inspired Collection', attar: 'Arabian Attar', international: 'International' };

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const [selectedSize, setSelectedSize] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const addToCartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (addToCartRef.current) observer.observe(addToCartRef.current);
    return () => observer.disconnect();
  }, [product]);

  if (!product) return (
    <div className="luxury-container py-20 text-center">
      <h1 className="font-display text-2xl text-foreground">Product not found</h1>
      <Link to="/shop" className="text-primary mt-4 inline-block">Back to Shop</Link>
    </div>
  );

  const currentSize = product.sizes[selectedSize];
  const avgRating = product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length;
  const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const alsoBought = allProducts.filter(p => p.id !== product.id && p.category !== product.category).slice(0, 4);
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="luxury-container py-12">
      <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm mb-8">
        <ArrowLeft size={16} /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Image */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-lg overflow-hidden border border-border shadow-luxury-card relative">
          <div className="aspect-square overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <button
            onClick={() => toggleItem(product.id)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-background/70 backdrop-blur-sm border border-border hover:border-primary/50 transition-all"
          >
            <Heart size={20} className={wishlisted ? 'fill-primary text-primary' : 'text-muted-foreground'} />
          </button>
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-primary border-primary/30">
              <Tag size={12} className="mr-1" /> {categoryLabels[product.category]}
            </Badge>
            <Badge variant="outline" className="text-muted-foreground border-border">
              <User size={12} className="mr-1" /> {product.gender}
            </Badge>
            {product.tags && product.tags.length > 0 ? (
              product.tags.map(tag => (
                <Badge key={tag} className="bg-primary text-primary-foreground">
                  {tag === 'Bestseller' ? '★ Bestseller' : tag}
                </Badge>
              ))
            ) : (
              <>
                {product.isBestSeller && <Badge className="bg-primary text-primary-foreground">★ Best Seller</Badge>}
                {product.isNew && <Badge className="bg-primary text-primary-foreground">New Arrival</Badge>}
              </>
            )}
          </div>

          {product.inspiredBy && (
            <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Inspired by {product.inspiredBy}</p>
          )}
          {product.brand && (
            <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">{product.brand}</p>
          )}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">{product.name}</h1>

          {product.fragranceProfile && (
            <p className="text-sm text-muted-foreground tracking-wider">{product.fragranceProfile.join(' • ')}</p>
          )}

          <div className="flex items-center gap-3">
            <StarRating rating={Math.round(avgRating)} />
            <span className="text-sm text-muted-foreground">({product.reviews.length} reviews)</span>
          </div>

          <p className="font-display text-3xl font-bold text-primary">₹{currentSize.price}</p>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Performance Metrics */}
          <FragranceMetrics
            longevity={product.longevityRating}
            projection={product.projectionRating}
            sillage={product.sillageRating}
          />

          {/* Longevity & Sillage text */}
          <div className="flex flex-wrap items-center gap-6">
            {product.longevity && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={16} className="text-primary" />
                <span>Longevity: <strong className="text-foreground">{product.longevity}</strong></span>
              </div>
            )}
            {product.sillage && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wind size={16} className="text-primary" />
                <span>Sillage: <strong className="text-foreground">{product.sillage}</strong></span>
              </div>
            )}
          </div>

          {/* Fragrance Notes */}
          {product.fragranceNotes && (
            <div className="bg-secondary rounded-lg p-6 border border-border space-y-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">Fragrance Notes</h3>
              <div className="grid grid-cols-3 gap-6">
                {(['top', 'middle', 'base'] as const).map(note => (
                  <div key={note} className="text-center">
                    <p className="text-xs text-primary uppercase tracking-wider font-semibold mb-2">{note === 'middle' ? 'Heart' : note}</p>
                    <div className="w-8 h-px bg-primary/30 mx-auto mb-3" />
                    <div className="space-y-2">
                      {product.fragranceNotes![note].map(n => (
                        <div key={n} className="flex items-center justify-center gap-2">
                          <NoteImage note={n} size={20} />
                          <span className="text-sm text-muted-foreground">{n}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Select Size</p>
            <div className="flex gap-3">
              {product.sizes.map((s, i) => (
                <button
                  key={s.size}
                  onClick={() => setSelectedSize(i)}
                  className={`px-5 py-3 rounded-lg border text-sm font-semibold transition-all ${
                    selectedSize === i
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary'
                  }`}
                >
                  {s.size}<br /><span className="text-xs">₹{s.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Delivery */}
          <DeliveryBadges />
          <DeliveryEstimator />

          {/* Actions */}
          <div ref={addToCartRef} className="flex gap-4 pt-2">
            <button
              onClick={() => addItem({
                productId: product.id,
                name: product.name,
                size: currentSize.size,
                price: currentSize.price,
                image: product.image,
              })}
              className="btn-premium flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold uppercase tracking-wider text-sm rounded"
            >
              <ShoppingBag size={18} /> Add to Cart
            </button>
            <Link
              to="/checkout"
              onClick={() => addItem({
                productId: product.id,
                name: product.name,
                size: currentSize.size,
                price: currentSize.price,
                image: product.image,
              })}
              className="btn-premium flex-1 flex items-center justify-center gap-2 px-8 py-4 border border-primary/50 text-primary font-semibold uppercase tracking-wider text-sm rounded"
            >
              Buy Now
            </Link>
          </div>

          <a
            href={`https://wa.me/971501234567?text=Hi! I'm interested in ${product.name} (${currentSize.size})`}
            target="_blank"
            className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            💬 Quick order via WhatsApp
          </a>
        </motion.div>
      </div>

      <div className="gold-divider my-16" />

      {/* Reviews */}
      <section>
        <h2 className="font-display text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>
        <div className="space-y-4">
          {product.reviews.map(r => (
            <div key={r.id} className="bg-card rounded-lg p-5 border border-border shadow-luxury">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-foreground text-sm">{r.userName}</p>
                  <StarRating rating={r.rating} size={12} />
                </div>
                <p className="text-xs text-muted-foreground">{r.date}</p>
              </div>
              <p className="text-sm text-muted-foreground">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Customers Also Bought */}
      {alsoBought.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Customers Also Bought</h2>
          <ProductGrid products={alsoBought} columnsPerRow={4} />
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">You May Also Like</h2>
          <ProductGrid products={related} columnsPerRow={4} />
        </section>
      )}

      {/* Sticky Add to Cart */}
      <StickyAddToCart
        visible={showStickyBar}
        productId={product.id}
        name={product.name}
        price={currentSize.price}
        size={currentSize.size}
        image={product.image}
      />
    </div>
  );
};

export default ProductDetail;
