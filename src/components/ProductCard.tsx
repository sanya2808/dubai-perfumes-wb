import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Eye, Heart } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { motion } from 'framer-motion';
import NoteImage from './NoteImage';
import { useIsMobile } from '@/hooks/use-mobile';

interface Props {
  product: Product;
  index?: number;
  columnsPerRow?: number;
}

/**
 * ProductCard
 * - Mobile: compact 2-col layout. Clicking image/title navigates to product page (no popup).
 * - Desktop: hover shows side notes panel + action buttons.
 * - Notes popup on mobile completely removed per requirements.
 */
const ProductCard = ({ product, index = 0, columnsPerRow = 4 }: Props) => {
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const isMobile = useIsMobile();
  const wishlisted = isWishlisted(product.id);
  const avgRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;

  const notes = product.fragranceNotes;
  const isLastColumn = (index % columnsPerRow) === (columnsPerRow - 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
      className="group relative"
      style={{ overflow: 'visible' }}
    >
      {/* ── Main Card ─────────────────────────────────── */}
      <div className="relative bg-card rounded-xl overflow-hidden border border-border/50 shadow-md group-hover:border-primary/50 group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.18),0_0_0_1px_rgba(198,169,107,0.2)] group-hover:-translate-y-1 group-hover:scale-[1.02] transition-all duration-400 w-full z-10">

        {/* Badges */}
        {product.tags && product.tags.length > 0 ? (
          <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
            {product.tags.map(tag => (
              <span key={tag}
                className="px-2 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] rounded-full shadow-md text-center"
                style={{ background: '#D4AF37', color: '#111111' }}
              >
                {tag === 'Bestseller' ? '★ Best' : tag}
              </span>
            ))}
          </div>
        ) : (product.isBestSeller || product.isNew) && (
          <div className="absolute top-2 left-2 z-20">
            <span
              className="px-2 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] rounded-full shadow-md"
              style={{ background: '#D4AF37', color: '#111111' }}
            >
              {product.isBestSeller ? '★ Best' : 'New'}
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleItem(product.id); }}
          className="absolute top-2 right-2 z-20 p-1.5 sm:p-2 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all min-w-[30px] min-h-[30px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center"
        >
          <Heart size={12} className={`sm:w-3.5 sm:h-3.5 ${wishlisted ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
        </button>

        {/* Product image — always navigates to product page */}
        <Link to={`/product/${product.id}`}>
          {/* Mobile: aspect-square; Desktop: aspect-[3/4] */}
          <div className="aspect-square sm:aspect-[3/4] overflow-hidden relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Issue 7: subtle image overlay for polish */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.18) 100%)',
              }}
            />
          </div>
        </Link>

        {/* Desktop hover action buttons */}
        {!isMobile && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none group-hover:pointer-events-auto">
            <Link
              to={`/product/${product.id}`}
              className="p-2.5 rounded-full bg-background/70 backdrop-blur-sm border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 translate-y-3 group-hover:translate-y-0"
            >
              <Eye size={15} />
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem({
                  productId: product.id,
                  name: product.name,
                  size: product.sizes[0].size,
                  price: product.sizes[0].price,
                  image: product.image,
                });
              }}
              className="p-2.5 rounded-full bg-primary text-primary-foreground hover:bg-gold-dark transition-all duration-300 translate-y-3 group-hover:translate-y-0 delay-75"
            >
              <ShoppingBag size={15} />
            </button>
          </div>
        )}

        {/* Card info */}
        <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-2">
          {product.inspiredBy && (
            <p className="text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-[0.18em] truncate">
              {product.inspiredBy}
            </p>
          )}
          {product.brand && !product.inspiredBy && (
            <p className="text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-[0.18em] truncate">
              {product.brand}
            </p>
          )}

          <Link to={`/product/${product.id}`}>
            <h3 className="font-display text-[13px] sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Stars */}
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={9} className={`sm:w-3 sm:h-3 ${i < Math.round(avgRating) ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
            ))}
            <span className="text-[10px] text-muted-foreground ml-1">({product.reviews.length})</span>
          </div>

          {/* Price + Add to Cart */}
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div>
              <span className="font-display text-base sm:text-lg font-bold text-primary">
                ₹{product.sizes[0].price}
              </span>
              {product.sizes.length > 1 && (
                <span className="text-[10px] text-muted-foreground ml-1">from</span>
              )}
            </div>
            {/* Mobile quick add */}
            {isMobile && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addItem({
                    productId: product.id,
                    name: product.name,
                    size: product.sizes[0].size,
                    price: product.sizes[0].price,
                    image: product.image,
                  });
                }}
                className="p-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="Add to cart"
              >
                <ShoppingBag size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Desktop side notes panel (hover) ──────────── */}
      {notes && !isMobile && (
        <div
          className="absolute top-0 z-[100] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-[250ms] ease-out"
          style={{
            width: 220,
            ...(isLastColumn
              ? { right: 'calc(100% + 12px)' }
              : { left: 'calc(100% + 12px)' }),
          }}
        >
          <div
            className="transition-transform duration-[250ms] ease-out"
            style={{ transform: isLastColumn ? 'translateX(-10px)' : 'translateX(10px)' }}
          >
            <div
              className="group-hover:!translate-x-0 transition-transform duration-[250ms] ease-out rounded-xl overflow-hidden"
              style={{
                backgroundColor: '#111111',
                border: '1px solid rgba(198,169,107,0.35)',
                borderRadius: 12,
                boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
              }}
            >
              <div className="p-5 flex flex-col">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-center mb-3" style={{ color: '#C6A96B' }}>
                  Fragrance Notes
                </p>
                <div className="w-full h-px mb-4" style={{ background: 'linear-gradient(90deg, transparent, rgba(198,169,107,0.4), transparent)' }} />
                <div className="space-y-4">
                  {[
                    { label: 'Top Notes', items: notes.top },
                    { label: 'Heart Notes', items: notes.middle },
                    { label: 'Base Notes', items: notes.base },
                  ].map(({ label, items }, groupIdx) =>
                    items && items.length > 0 ? (
                      <div key={label}>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: '#C6A96B' }}>{label}</p>
                        <div className="space-y-2">
                          {items.map((note, noteIdx) => (
                            <div
                              key={note}
                              className="flex items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ transitionDelay: `${(groupIdx * 3 + noteIdx) * 50 + 100}ms`, transitionDuration: '250ms' }}
                            >
                              <NoteImage note={note} size={26} />
                              <span className="text-[12px] font-medium" style={{ color: '#F5F5F5' }}>{note}</span>
                            </div>
                          ))}
                        </div>
                        {groupIdx < 2 && (
                          <div className="w-full h-px mt-3" style={{ background: 'rgba(198,169,107,0.15)' }} />
                        )}
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductCard;
