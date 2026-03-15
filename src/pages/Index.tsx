import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowDown, Star, MapPin, Clock, Quote } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import GoldenParticles from '@/components/GoldenParticles';
import ProductGrid from '@/components/ProductGrid';
import { useAllProducts, useBestSellers } from '@/hooks/useProducts';
import { allProducts as localProducts, getBestSellers as localGetBestSellers } from '@/data/products';
import storeInteriorImg from '@/assets/store-interior.jpg';
import storeFrontImg from '@/assets/store-front-real.jpg';
import storeWideImg from '@/assets/store-wide.jpg';
import attarShelf1 from '@/assets/attar-shelf-1.jpg';
import attarShelf2 from '@/assets/attar-shelf-2.jpg';
import goldenLampImg from '@/assets/golden-lamp.jpg';
import storePerfumesDisplay from '@/assets/store-perfumes-display.jpg';
import storeShelfArch from '@/assets/store-shelf-arch.jpg';

const sectionAnim = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: 'easeOut' as const },
};

const categoryImages: Record<string, string> = {
  inspired: storeWideImg,
  attar: attarShelf1,
  international: attarShelf2,
};

const Index = () => {
  const { data: products = localProducts } = useAllProducts();
  const { data: bestSellers = localGetBestSellers() } = useBestSellers();
  const signatureScents = products.filter(p => p.isBestSeller).slice(0, 4);
  const reviews = products.flatMap(p => p.reviews).slice(0, 6);
  const [currentReview, setCurrentReview] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  // Hero slideshow images
  const heroSlides = [storeInteriorImg, storeFrontImg, storeWideImg, storePerfumesDisplay];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview(prev => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(slideTimer);
  }, [heroSlides.length]);

  return (
    <div>
      <SEO path="/" description="Shop luxury Arabic, Inspired & International perfumes at Dubai Perfumes Nashik. Premium attars, oud fragrances & more with free delivery." />
      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative h-[85vh] sm:h-screen min-h-[550px] sm:min-h-[700px] overflow-hidden">
        {/* Slideshow Background */}
        <div className="absolute inset-0 w-full h-full">
          {heroSlides.map((slide, index) => (
            <motion.img
              key={index}
              src={slide}
              alt={`Dubai Perfumes Boutique Slide ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ y: heroY }}
              animate={{ 
                scale: [1, 1.08, 1],
                opacity: currentSlide === index ? 1 : 0
              }}
              transition={{ 
                scale: { duration: 20, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 1, ease: 'easeInOut' }
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-white/10 dark:bg-black/50" />
        <div className="absolute inset-0 bg-gradient-cinematic" />
        <GoldenParticles />
        {/* Text area gradient overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 800px 600px at 50% 45%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)'
        }} />
        <div className="relative h-full luxury-container flex flex-col justify-center items-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <p className="text-accent-font text-sm sm:text-base md:text-lg tracking-[0.3em] sm:tracking-[0.4em] uppercase text-primary mb-4 sm:mb-8">
              Luxury Fragrances
            </p>
            <motion.h1
              className="font-brand text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-primary leading-[1.1] mb-3 sm:mb-4 gold-glow-text"
              animate={{ textShadow: [
                '0 0 40px hsl(38 35% 59% / 0.3), 0 0 80px hsl(38 35% 59% / 0.1)',
                '0 0 60px hsl(38 35% 59% / 0.5), 0 0 120px hsl(38 35% 59% / 0.2)',
                '0 0 40px hsl(38 35% 59% / 0.3), 0 0 80px hsl(38 35% 59% / 0.1)',
              ] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              DUBAI PERFUMES
            </motion.h1>
            <p className="font-display text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-[1.2] mb-6 sm:mb-10">
              Dubai Inspired Premium Fragrances
            </p>
            <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed mb-6 sm:mb-10">
              Luxury scents crafted for timeless elegance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center">
              <Link
                to="/shop"
                className="btn-premium px-8 sm:px-12 py-3.5 sm:py-4 bg-primary text-primary-foreground font-semibold uppercase tracking-[0.15em] text-sm rounded-sm min-h-[44px]"
              >
                Shop Now
              </Link>
              <Link
                to="/visit-store"
                className="btn-premium px-8 sm:px-12 py-3.5 sm:py-4 border border-amber-500 text-primary dark:text-amber-500 font-semibold uppercase tracking-[0.15em] text-sm rounded-sm min-h-[44px] hover:bg-amber-500 hover:text-black transition-colors duration-300"
              >
                Visit Store
              </Link>
            </div>
          </motion.div>
        </div>
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDown size={20} className="text-primary/60" />
        </motion.div>
      </section>

      {/* ─── BRAND STORY ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={goldenLampImg} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-background/90" />
        </div>
        <div className="relative luxury-container section-padding">
          <motion.div {...sectionAnim} className="max-w-3xl mx-auto text-center">
            <p className="text-accent-font text-sm tracking-[0.4em] uppercase text-primary mb-5">Our Heritage</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-10 leading-tight">
              The Art of Fragrance
            </h2>
            <div className="gold-divider mb-12" />
            <p className="text-accent-font text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              Born from a passion for fine scents, Dubai Perfumes blends the richness of Arabian perfumery with modern fragrance culture.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              From traditional attars and rare oud to globally inspired perfumes, every fragrance in our collection is chosen for its depth, elegance, and lasting impression.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              Located in Nashik, our boutique offers a space to discover scents that become part of your identity.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Because a fragrance is not just worn — it is remembered.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="gold-divider-wide" />

      {/* ─── SIGNATURE SCENTS ─── */}
      <section className="luxury-container section-padding">
        <motion.div {...sectionAnim} className="text-center mb-20">
          <p className="text-accent-font text-sm tracking-[0.4em] uppercase text-primary mb-5">Curated For You</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">Signature Scents</h2>
          <div className="gold-divider mt-8" />
        </motion.div>
        <ProductGrid products={signatureScents} columnsPerRow={4} />
        <div className="text-center mt-16">
          <Link to="/shop" className="btn-premium inline-flex items-center gap-3 text-primary font-semibold uppercase tracking-[0.15em] text-sm hover:text-gold-light transition-colors duration-300">
            Explore All Fragrances <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <div className="gold-divider-wide" />

      {/* ─── COLLECTIONS ─── */}
      <section className="bg-secondary/50 section-padding">
        <div className="luxury-container">
          <motion.div {...sectionAnim} className="text-center mb-20">
            <p className="text-accent-font text-sm tracking-[0.4em] uppercase text-primary mb-5">Explore</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">Our Collections</h2>
            <div className="gold-divider mt-8" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'Inspired Perfumes', desc: 'Premium designer-inspired fragrances at accessible luxury.', to: '/category/inspired', key: 'inspired' },
              { title: 'Arabian Attars', desc: 'Traditional oil-based perfumes with exceptional longevity.', to: '/category/attar', key: 'attar' },
              { title: 'International Perfumes', desc: 'Authentic branded perfumes from world-renowned houses.', to: '/category/international', key: 'international' },
            ].map((cat, i) => (
              <motion.div
                key={cat.to}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <Link to={cat.to} className="block group">
                  <div className="relative rounded-xl overflow-hidden border border-border/30 hover:border-primary/30 shadow-luxury-card hover:shadow-gold-glow transition-all duration-700 aspect-[3/4]">
                    <img
                      src={categoryImages[cat.key]}
                      alt={cat.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent group-hover:from-background/90 transition-all duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="font-display text-2xl font-bold text-foreground mb-3">{cat.title}</h3>
                      <p className="text-sm text-muted-foreground mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{cat.desc}</p>
                      <span className="btn-premium inline-flex items-center gap-2 px-6 py-3 border border-primary/40 text-primary text-xs font-semibold uppercase tracking-[0.15em] rounded-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        Explore Collection <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-divider-wide" />

      <div className="gold-divider-wide" />

      {/* ─── TESTIMONIALS CAROUSEL ─── */}
      <section className="luxury-container section-padding">
        <motion.div {...sectionAnim} className="text-center mb-20">
          <p className="text-accent-font text-sm tracking-[0.4em] uppercase text-primary mb-5">Testimonials</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">What Our Clients Say</h2>
          <div className="gold-divider mt-8" />
        </motion.div>

        <div className="max-w-2xl mx-auto text-center relative min-h-[220px]">
          {reviews.map((rev, i) => (
            <motion.div
              key={rev.id + i}
              initial={false}
              animate={{
                opacity: i === currentReview ? 1 : 0,
                y: i === currentReview ? 0 : 20,
              }}
              transition={{ duration: 0.6 }}
              className={`${i === currentReview ? 'relative' : 'absolute inset-0'} ${i !== currentReview ? 'pointer-events-none' : ''}`}
            >
              <Quote size={36} className="text-primary/30 mx-auto mb-8" />
              <p className="text-accent-font text-lg md:text-xl text-foreground leading-relaxed italic mb-10">
                "{rev.comment}"
              </p>
              <div className="flex items-center justify-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} className={j < rev.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'} />
                ))}
              </div>
              <p className="text-sm text-primary font-semibold tracking-wider uppercase">{rev.userName}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-12">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentReview(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentReview ? 'bg-primary w-6' : 'bg-muted-foreground/30'}`}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/reviews" className="inline-flex items-center gap-3 text-primary font-semibold uppercase tracking-[0.15em] text-sm hover:text-gold-light transition-colors duration-300">
            All Reviews <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <div className="gold-divider-wide" />

      {/* ─── VISIT STORE ─── */}
      <section className="relative overflow-hidden min-h-[400px] sm:h-[550px]">
        <img src={storeFrontImg} alt="Dubai Perfumes Store" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/75" />
        <div className="relative h-full luxury-container flex flex-col justify-center items-center text-center py-16 sm:py-0">
          <motion.div {...sectionAnim}>
            <p className="text-accent-font text-sm tracking-[0.4em] uppercase text-primary mb-5">Experience In Person</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-8">Visit Our Boutique</h2>
            <div className="gold-divider mb-10" />
            <div className="flex items-center gap-4 sm:gap-8 text-muted-foreground text-sm mb-10 flex-wrap justify-center">
              <span className="flex items-center gap-2"><MapPin size={14} className="text-primary shrink-0" /> 4th Floor SSRF Building, near City Centre Mall</span>
              <span className="flex items-center gap-2"><Clock size={14} className="text-primary shrink-0" /> Open Daily 10AM–10PM</span>
            </div>
            <Link
              to="/visit-store"
              className="btn-premium px-12 py-4 bg-primary text-primary-foreground font-semibold uppercase tracking-[0.15em] text-sm rounded-sm"
            >
              Get Directions
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
