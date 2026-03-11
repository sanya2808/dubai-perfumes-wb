import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Eye, Heart } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import NoteImage from './NoteImage';
import { useIsMobile } from '@/hooks/use-mobile';

interface Props {
  product: Product;
  index?: number;
  columnsPerRow?: number;
  expandedId?: string | null;
  onToggleExpand?: (id: string) => void;
}

const ProductCard = ({ product, index = 0, columnsPerRow = 4, expandedId, onToggleExpand }: Props) => {
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const isMobile = useIsMobile();
  const wishlisted = isWishlisted(product.id);
  const avgRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;

  const notes = product.fragranceNotes;
  const isLastColumn = (index % columnsPerRow) === (columnsPerRow - 1);
  const isExpanded = expandedId === product.id;

  const handleCardTap = () => {
    if (!isMobile || !notes) return;
    onToggleExpand?.(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: 'easeOut' }}
      className="group relative"
      style={{ overflow: 'visible' }}
    >
      {/* Main Card */}
      <div
        className="relative bg-card rounded-xl overflow-hidden border border-border/40 group-hover:border-primary/40 glow-breathe group-hover:shadow-[0_0_45px_-4px_hsl(38_35%_59%/0.45)] group-hover:-translate-y-1.5 group-hover:scale-[1.02] transition-all duration-500 w-full z-10"
        onClick={handleCardTap}
      >
        {/* Badges */}
        {product.tags && product.tags.length > 0 ? (
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            {product.tags.map(tag => (
              <span key={tag} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] bg-primary text-primary-foreground rounded-full shadow-lg text-center">
                {tag === 'Bestseller' ? '★ Bestseller' : tag}
              </span>
            ))}
          </div>
        ) : (product.isBestSeller || product.isNew) && (
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] bg-primary text-primary-foreground rounded-full shadow-lg text-center">
              {product.isBestSeller ? '★ Best Seller' : 'New Arrival'}
            </span>
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); toggleItem(product.id); }}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all min-w-[36px] min-h-[36px] flex items-center justify-center"
        >
          <Heart size={14} className={wishlisted ? 'fill-primary text-primary' : 'text-muted-foreground'} />
        </button>
        {product.longevity && (
          <span className="absolute top-14 right-4 z-20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-background/80 backdrop-blur-sm text-primary border border-primary/20 rounded-full">
            {product.longevity}
          </span>
        )}

        <Link to={`/product/${product.id}`} onClick={(e) => isMobile && notes && e.preventDefault()}>
          <div className="aspect-[3/4] overflow-hidden relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </div>
        </Link>

        {/* Hover action buttons - desktop */}
        {!isMobile && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none group-hover:pointer-events-auto">
            <Link
              to={`/product/${product.id}`}
              className="p-2.5 rounded-full bg-background/70 backdrop-blur-sm border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 translate-y-3 group-hover:translate-y-0"
            >
              <Eye size={16} />
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
              <ShoppingBag size={16} />
            </button>
          </div>
        )}

        {/* Card info */}
        <div className="p-4 sm:p-5 space-y-2">
          {product.inspiredBy && (
            <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em]">Inspired by {product.inspiredBy}</p>
          )}
          {product.brand && (
            <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em]">{product.brand}</p>
          )}
          <Link to={`/product/${product.id}`}>
            <h3 className="font-display text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
              {product.name}
            </h3>
          </Link>

          {product.fragranceProfile && product.fragranceProfile.length > 0 && (
            <p className="text-[11px] text-muted-foreground tracking-wide">
              {product.fragranceProfile.join(' • ')}
            </p>
          )}

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} className={i < Math.round(avgRating) ? 'fill-primary text-primary' : 'text-muted-foreground/30'} />
            ))}
            <span className="text-[11px] text-muted-foreground ml-1">({product.reviews.length})</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/30">
            <div>
              <span className="font-display text-xl font-bold text-primary">
                ₹{product.sizes[0].price}
              </span>
              {product.sizes.length > 1 && (
                <span className="text-[11px] text-muted-foreground ml-1.5">from</span>
              )}
            </div>
            {/* Mobile: tap hint */}
            {isMobile && notes && (
              <span className="text-[10px] text-primary/60 uppercase tracking-wider">
                {isExpanded ? 'Tap to close' : 'Tap for notes'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Side Panel - Desktop only */}
      {notes && !isMobile && (
        <div
          className="absolute top-0 z-[100] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-[250ms] ease-out"
          style={{
            width: 230,
            ...(isLastColumn
              ? { right: 'calc(100% + 14px)' }
              : { left: 'calc(100% + 14px)' }),
          }}
        >
          <div
            className="transition-transform duration-[250ms] ease-out"
            style={{
              transform: isLastColumn ? 'translateX(-12px)' : 'translateX(12px)',
            }}
          >
            <div
              className="group-hover:!translate-x-0 transition-transform duration-[250ms] ease-out rounded-xl overflow-hidden"
              style={{
                backgroundColor: '#111111',
                border: '1px solid rgba(198,169,107,0.35)',
                borderRadius: 12,
                boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
                backdropFilter: 'blur(6px)',
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
                              <NoteImage note={note} size={28} />
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

      {/* Mobile: Premium expandable notes below card */}
      {notes && isMobile && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div
                className="mt-3 rounded-xl overflow-hidden"
                style={{
                  backgroundColor: '#111111',
                  border: '1px solid rgba(198,169,107,0.4)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
                }}
              >
                <div className="p-5 space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-center" style={{ color: '#C6A96B' }}>
                    Fragrance Notes
                  </p>
                  <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(198,169,107,0.4), transparent)' }} />
                  
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Top Notes', items: notes.top },
                      { label: 'Heart Notes', items: notes.middle },
                      { label: 'Base Notes', items: notes.base },
                    ].map(({ label, items }, groupIdx) =>
                      items && items.length > 0 ? (
                        <div key={label} className="text-center">
                          <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#C6A96B' }}>{label}</p>
                          <div className="w-8 h-px mx-auto mb-3" style={{ background: 'rgba(198,169,107,0.3)' }} />
                          <div className="space-y-2.5">
                            {items.map((note, noteIdx) => (
                              <motion.div
                                key={note}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (groupIdx * 3 + noteIdx) * 0.05 + 0.1, duration: 0.25 }}
                                className="flex flex-col items-center gap-1"
                              >
                                <NoteImage note={note} size={28} />
                                <span className="text-[10px] font-medium" style={{ color: '#F5F5F5' }}>{note}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>

                  {/* View product link */}
                  <div className="pt-2 border-t" style={{ borderColor: 'rgba(198,169,107,0.15)' }}>
                    <Link
                      to={`/product/${product.id}`}
                      className="block text-center text-[11px] font-semibold uppercase tracking-[0.15em] py-2"
                      style={{ color: '#C6A96B' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Full Details →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default ProductCard;
