import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { allProducts } from '@/data/products';
import StarRating from '@/components/StarRating';

const Reviews = () => {
  const allReviews = allProducts.flatMap(p =>
    p.reviews.map(r => ({ ...r, productName: p.name, productId: p.id }))
  );

  const avgOverall = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;

  return (
    <div className="luxury-container py-12">
      <SEO title="Customer Reviews" description="Read what our customers say about Dubai Perfumes. Genuine reviews for our luxury fragrances and attars." path="/reviews" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
        <p className="text-accent-font text-sm tracking-[0.3em] uppercase text-primary mb-2">Testimonials</p>
        <h1 className="font-display text-4xl font-bold text-foreground">Customer Reviews</h1>
        <div className="gold-divider mt-4 mb-4" />
        <div className="flex items-center justify-center gap-3">
          <StarRating rating={Math.round(avgOverall)} size={20} />
          <span className="text-lg text-foreground font-semibold">{avgOverall.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({allReviews.length} reviews)</span>
        </div>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-4">
        {allReviews.map((r, i) => (
          <motion.div
            key={r.id + i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-lg p-6 border border-border shadow-luxury-card"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-semibold text-foreground">{r.userName}</p>
                <p className="text-xs text-primary">{r.productName}</p>
              </div>
              <div className="text-right">
                <StarRating rating={r.rating} size={14} />
                <p className="text-xs text-muted-foreground mt-1">{r.date}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{r.comment}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
