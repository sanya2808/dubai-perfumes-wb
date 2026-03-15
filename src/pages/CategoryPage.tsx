import { useParams } from 'react-router-dom';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import ProductGrid from '@/components/ProductGrid';
import { getCategoryProducts, ProductCategory } from '@/data/products';
import storeWideImg from '@/assets/store-wide.jpg';
import attarShelf1 from '@/assets/attar-shelf-1.jpg';
import attarShelf2 from '@/assets/attar-shelf-2.jpg';
import carFresheners from '@/assets/car-fresheners.jpg';
import goldenLamp from '@/assets/golden-lamp.jpg';
import storeInterior from '@/assets/store-interior.jpg';
import storePerfumesDisplay from '@/assets/store-perfumes-display.jpg';

const titles: Record<ProductCategory, { title: string; subtitle: string; desc: string; banner: string }> = {
  inspired: {
    title: 'Inspired Perfumes',
    subtitle: 'Designer-Inspired',
    desc: 'Premium fragrances inspired by the world\'s most coveted designer scents. Exceptional quality at accessible prices.',
    banner: storeWideImg,
  },
  attar: {
    title: 'Arabian Attars',
    subtitle: 'Traditional Oils',
    desc: 'Authentic oil-based perfumes crafted in the Arabian tradition. Pure, long-lasting, and deeply captivating.',
    banner: attarShelf1,
  },
  international: {
    title: 'International Perfumes',
    subtitle: 'Original Brands',
    desc: 'Authentic branded perfumes from the world\'s most prestigious fragrance houses.',
    banner: attarShelf2,
  },
  'Car & Home Fragrance': {
    title: 'Car & Home Fragrance',
    subtitle: 'Premium Ambiance',
    desc: 'Transform your space with our luxury car and home fragrances.',
    banner: carFresheners,
  },
  Candles: {
    title: 'Luxury Candles',
    subtitle: 'Exquisite Aromas',
    desc: 'Hand-poured candles with complex, captivating scents for your home.',
    banner: goldenLamp,
  },
  Bakhoor: {
    title: 'Bakhoor',
    subtitle: 'Traditional Incense',
    desc: 'Premium Bakhoor for a traditional and welcoming home atmosphere.',
    banner: attarShelf1,
  },
  'Aroma Oils': {
    title: 'Aroma Oils',
    subtitle: 'Pure Essences',
    desc: 'Concentrated aroma oils for diffusers and personal use.',
    banner: storeInterior,
  },
  Perfume: {
    title: 'Luxury Perfumes',
    subtitle: 'Fine Fragrances',
    desc: 'Our flagship collection of fine luxury perfumes.',
    banner: storePerfumesDisplay,
  },
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const cat = category as ProductCategory;
  const info = titles[cat];
  const products = getCategoryProducts(cat);

  if (!info) return <div className="luxury-container py-20 text-center"><h1 className="font-display text-2xl text-foreground">Category not found</h1></div>;

  return (
    <div>
      <SEO title={info.title} description={info.desc} ogImage={info.banner} path={`/category/${category}`} />
      {/* Banner */}
      <section className="relative h-56 overflow-hidden">
        <img src={info.banner} alt={info.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
        <div className="relative h-full luxury-container flex flex-col justify-center items-center text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-accent-font text-sm tracking-[0.3em] uppercase text-primary mb-2">{info.subtitle}</p>
            <h1 className="font-display text-4xl font-bold text-foreground">{info.title}</h1>
          </motion.div>
        </div>
      </section>

      <div className="luxury-container py-12">
        <p className="text-muted-foreground max-w-xl mx-auto text-center mb-4">{info.desc}</p>
        <div className="gold-divider mb-10" />
        <ProductGrid products={products} columnsPerRow={4} />
      </div>
    </div>
  );
};

export default CategoryPage;
