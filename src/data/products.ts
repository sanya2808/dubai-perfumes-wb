import attarShelf1 from '@/assets/attar-shelf-1.jpg';
import attarShelf2 from '@/assets/attar-shelf-2.jpg';
import goldenLamp from '@/assets/golden-lamp.jpg';
import storeShelfArch from '@/assets/store-shelf-arch.jpg';
import carFresheners from '@/assets/car-fresheners.jpg';
import storePerfumesDisplay from '@/assets/store-perfumes-display.jpg';
import storeInterior from '@/assets/store-interior.jpg';
import storeWide from '@/assets/store-wide.jpg';

export type ProductCategory = 'inspired' | 'attar' | 'international' | 'Car & Home Fragrance' | 'Candles' | 'Bakhoor' | 'Aroma Oils' | 'Perfume';
export type Gender = 'Men' | 'Women' | 'Unisex';
export type Sillage = 'Soft' | 'Moderate' | 'Strong' | 'Beast Mode';

export interface SizeOption {
  size: string;
  price: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  brand?: string;
  inspiredBy?: string;
  gender: Gender;
  description: string;
  image: string;
  sizes: SizeOption[];
  fragranceNotes?: { top: string[]; middle: string[]; base: string[] };
  fragranceProfile: string[];
  longevity?: string;
  sillage?: Sillage;
  longevityRating?: number;
  projectionRating?: number;
  sillageRating?: number;
  isBestSeller?: boolean;
  isNew?: boolean;
  tags?: string[];
  reviews: Review[];
  images?: { url: string; isMain: boolean }[];
}

export interface ComboOffer {
  id: string;
  title: string;
  description: string;
  products: string[];
  originalPrice: number;
  comboPrice: number;
  image: string;
}

const sampleReviews: Review[] = [
  { id: 'r1', userName: 'Ahmed K.', rating: 5, comment: 'Absolutely stunning fragrance. Lasts all day and gets compliments everywhere.', date: '2026-02-15' },
  { id: 'r2', userName: 'Sarah M.', rating: 4, comment: 'Beautiful scent, very close to the original. Great value for money.', date: '2026-02-10' },
  { id: 'r3', userName: 'Khalid R.', rating: 5, comment: 'Premium quality. The packaging is elegant and the scent is divine.', date: '2026-01-28' },
  { id: 'r4', userName: 'Fatima A.', rating: 5, comment: 'My go-to perfume store. Never disappointed with the quality.', date: '2026-01-20' },
  { id: 'r5', userName: 'Omar J.', rating: 4, comment: 'Excellent longevity and projection. Highly recommend.', date: '2026-01-15' },
];

export const inspiredPerfumes: Product[] = [
  {
    id: 'ins-1', name: 'Nomade Oud', category: 'inspired', inspiredBy: 'LV Ombre Nomade', gender: 'Unisex',
    description: 'A rich, smoky oud fragrance with warm amber undertones. This luxurious scent evokes desert nights.',
    image: storePerfumesDisplay, fragranceProfile: ['Woody', 'Oud', 'Amber'],
    sizes: [{ size: '20 ml', price: 45 }, { size: '50 ml', price: 85 }, { size: '100 ml', price: 145 }],
    fragranceNotes: { top: ['Oud', 'Incense'], middle: ['Rose', 'Benzoin'], base: ['Amber', 'Leather'] },
    longevity: '10–14 hours', sillage: 'Strong', longevityRating: 8, projectionRating: 7, sillageRating: 8, isBestSeller: true, tags: ['Bestseller'], reviews: sampleReviews.slice(0, 3),
  },
  {
    id: 'ins-2', name: 'Rouge Crystal', category: 'inspired', inspiredBy: 'Baccarat Rouge 540', gender: 'Unisex',
    description: 'An ethereal blend of saffron and amberwood that creates a luminous, addictive aura.',
    image: storeShelfArch, fragranceProfile: ['Sweet', 'Amber', 'Saffron'],
    sizes: [{ size: '20 ml', price: 50 }, { size: '50 ml', price: 95 }, { size: '100 ml', price: 165 }],
    fragranceNotes: { top: ['Saffron', 'Jasmine'], middle: ['Amberwood', 'Fir Resin'], base: ['Cedar', 'Musk'] },
    longevity: '12–16 hours', sillage: 'Beast Mode', longevityRating: 9, projectionRating: 9, sillageRating: 10, isBestSeller: true, tags: ['Bestseller'], reviews: sampleReviews.slice(1, 4),
  },
  {
    id: 'ins-3', name: 'Dark Leather', category: 'inspired', inspiredBy: 'TF Ombre Leather', gender: 'Men',
    description: 'A bold, seductive leather fragrance with patchouli and jasmine sambac.',
    image: storeInterior, fragranceProfile: ['Leather', 'Woody', 'Spicy'],
    sizes: [{ size: '20 ml', price: 42 }, { size: '50 ml', price: 80 }, { size: '100 ml', price: 135 }],
    fragranceNotes: { top: ['Cardamom', 'Leather'], middle: ['Jasmine Sambac', 'Patchouli'], base: ['Amber', 'Moss'] },
    longevity: '8–12 hours', sillage: 'Strong', longevityRating: 7, projectionRating: 7, sillageRating: 8, reviews: sampleReviews.slice(0, 2),
  },
  {
    id: 'ins-4', name: 'Bleu Royale', category: 'inspired', inspiredBy: 'Bleu de Chanel', gender: 'Men',
    description: 'A fresh, woody fragrance with citrus opening and deep sandalwood dry-down.',
    image: storeWide, fragranceProfile: ['Fresh', 'Citrus', 'Woody'],
    sizes: [{ size: '20 ml', price: 40 }, { size: '50 ml', price: 75 }, { size: '100 ml', price: 125 }],
    fragranceNotes: { top: ['Lemon', 'Mint'], middle: ['Ginger', 'Nutmeg'], base: ['Sandalwood', 'Cedar'] },
    longevity: '8–10 hours', sillage: 'Moderate', longevityRating: 6, projectionRating: 5, sillageRating: 5, reviews: sampleReviews.slice(2, 5),
  },
  {
    id: 'ins-5', name: 'Aventus Legend', category: 'inspired', inspiredBy: 'Creed Aventus', gender: 'Men',
    description: 'The king of fragrances. A bold, fruity-smoky composition that commands attention.',
    image: storePerfumesDisplay, fragranceProfile: ['Fruity', 'Smoky', 'Bold'],
    sizes: [{ size: '20 ml', price: 48 }, { size: '50 ml', price: 90 }, { size: '100 ml', price: 155 }],
    fragranceNotes: { top: ['Pineapple', 'Bergamot'], middle: ['Birch', 'Rose'], base: ['Musk', 'Oakmoss'] },
    longevity: '10–14 hours', sillage: 'Strong', longevityRating: 8, projectionRating: 8, sillageRating: 8, isBestSeller: true, tags: ['Bestseller'], reviews: sampleReviews,
  },
  {
    id: 'ins-6', name: 'Sauvage Elixir', category: 'inspired', inspiredBy: 'Dior Sauvage', gender: 'Men',
    description: 'A magnetic, spicy-fresh scent with pepper and ambroxan.',
    image: storeShelfArch, fragranceProfile: ['Spicy', 'Fresh', 'Aromatic'],
    sizes: [{ size: '20 ml', price: 40 }, { size: '50 ml', price: 75 }, { size: '100 ml', price: 130 }],
    fragranceNotes: { top: ['Pepper', 'Bergamot'], middle: ['Lavender', 'Geranium'], base: ['Ambroxan', 'Cedar'] },
    longevity: '8–12 hours', sillage: 'Strong', longevityRating: 7, projectionRating: 7, sillageRating: 7, reviews: sampleReviews.slice(0, 3),
  },
  {
    id: 'ins-7', name: 'Femme Noire', category: 'inspired', inspiredBy: 'Good Girl', gender: 'Women',
    description: 'A seductive feminine fragrance balancing jasmine and cocoa.',
    image: storeInterior, fragranceProfile: ['Sweet', 'Floral', 'Vanilla'],
    sizes: [{ size: '20 ml', price: 42 }, { size: '50 ml', price: 78 }, { size: '100 ml', price: 132 }],
    fragranceNotes: { top: ['Almond', 'Coffee'], middle: ['Jasmine', 'Tuberose'], base: ['Cocoa', 'Tonka Bean'] },
    longevity: '8–10 hours', sillage: 'Moderate', longevityRating: 6, projectionRating: 6, sillageRating: 5, reviews: sampleReviews.slice(1, 4),
  },
  {
    id: 'ins-8', name: 'Lady Gold', category: 'inspired', inspiredBy: 'Lady Million', gender: 'Women',
    description: 'A dazzling, playful fragrance with neroli and sweet notes.',
    image: storeWide, fragranceProfile: ['Sweet', 'Floral', 'Honey'],
    sizes: [{ size: '20 ml', price: 38 }, { size: '50 ml', price: 72 }, { size: '100 ml', price: 120 }],
    fragranceNotes: { top: ['Neroli', 'Raspberry'], middle: ['Gardenia', 'Jasmine'], base: ['Honey', 'Patchouli'] },
    longevity: '6–8 hours', sillage: 'Soft', longevityRating: 5, projectionRating: 4, sillageRating: 3, isNew: true, tags: ['New Arrival'], reviews: sampleReviews.slice(3, 5),
  },
];

export const arabianAttars: Product[] = [
  {
    id: 'att-1', name: 'COMP KEWDA', category: 'attar', gender: 'Unisex',
    description: 'A traditional kewda attar with sweet, floral, and earthy notes. Pure oil-based luxury.',
    image: attarShelf1, fragranceProfile: ['Floral', 'Earthy', 'Sweet'],
    sizes: [{ size: '3 ml', price: 15 }, { size: '6 ml', price: 25 }, { size: '12 ml', price: 42 }],
    fragranceNotes: { top: ['Kewda'], middle: ['Rose', 'Jasmine'], base: ['Sandalwood', 'Musk'] },
    longevity: '12–18 hours', sillage: 'Moderate', longevityRating: 8, projectionRating: 6, sillageRating: 5, isBestSeller: true, tags: ['Bestseller'], reviews: sampleReviews.slice(0, 3),
  },
  {
    id: 'att-2', name: 'COMP OUD', category: 'attar', gender: 'Unisex',
    description: 'Rich, deep oud oil extracted from the finest agarwood. A timeless Arabian classic.',
    image: attarShelf2, fragranceProfile: ['Oud', 'Rose', 'Saffron'],
    sizes: [{ size: '3 ml', price: 25 }, { size: '6 ml', price: 45 }, { size: '12 ml', price: 78 }],
    fragranceNotes: { top: ['Oud'], middle: ['Rose', 'Saffron'], base: ['Amber', 'Sandalwood'] },
    longevity: '16–24 hours', sillage: 'Beast Mode', longevityRating: 10, projectionRating: 9, sillageRating: 10, isBestSeller: true, tags: ['Bestseller'], reviews: sampleReviews.slice(1, 5),
  },
  {
    id: 'att-3', name: 'COMP AMBER AL OUD', category: 'attar', gender: 'Unisex',
    description: 'A warm amber and oud blend that is both opulent and comforting.',
    image: goldenLamp, fragranceProfile: ['Amber', 'Oud', 'Vanilla'],
    sizes: [{ size: '3 ml', price: 20 }, { size: '6 ml', price: 35 }, { size: '12 ml', price: 60 }],
    fragranceNotes: { top: ['Amber'], middle: ['Oud', 'Rose'], base: ['Vanilla', 'Musk'] },
    longevity: '14–20 hours', sillage: 'Strong', longevityRating: 9, projectionRating: 7, sillageRating: 8, reviews: sampleReviews.slice(0, 2),
  },
  {
    id: 'att-4', name: 'COMP SANDALWOOD', category: 'attar', gender: 'Unisex',
    description: 'Pure Indian sandalwood attar. Creamy, woody, and meditative.',
    image: attarShelf1, fragranceProfile: ['Woody', 'Creamy', 'Musk'],
    sizes: [{ size: '3 ml', price: 18 }, { size: '6 ml', price: 30 }, { size: '12 ml', price: 52 }],
    fragranceNotes: { top: ['Sandalwood'], middle: ['Creamy Wood'], base: ['Musk', 'Vanilla'] },
    longevity: '12–16 hours', sillage: 'Moderate', longevityRating: 8, projectionRating: 5, sillageRating: 5, reviews: sampleReviews.slice(2, 4),
  },
  {
    id: 'att-5', name: 'Musk Tahara', category: 'attar', gender: 'Women',
    description: 'A clean, white musk attar. Subtle, elegant, and long-lasting.',
    image: attarShelf2, fragranceProfile: ['Musk', 'Clean', 'Powdery'],
    sizes: [{ size: '3 ml', price: 12 }, { size: '6 ml', price: 20 }, { size: '12 ml', price: 35 }],
    fragranceNotes: { top: ['White Musk'], middle: ['Floral Musk'], base: ['Powdery Musk'] },
    longevity: '10–14 hours', sillage: 'Soft', longevityRating: 7, projectionRating: 4, sillageRating: 3, isNew: true, tags: ['New Arrival'], reviews: sampleReviews.slice(0, 3),
  },
  {
    id: 'att-6', name: 'Black Oud', category: 'attar', gender: 'Men',
    description: 'An intense, smoky oud oil with dark, mysterious character.',
    image: goldenLamp, fragranceProfile: ['Smoky', 'Oud', 'Leather'],
    sizes: [{ size: '3 ml', price: 28 }, { size: '6 ml', price: 50 }, { size: '12 ml', price: 88 }],
    fragranceNotes: { top: ['Smoky Oud'], middle: ['Dark Rose', 'Incense'], base: ['Leather', 'Amber'] },
    longevity: '18–24 hours', sillage: 'Beast Mode', longevityRating: 10, projectionRating: 10, sillageRating: 10, isBestSeller: true, tags: ['Bestseller'], reviews: sampleReviews,
  },
  {
    id: 'att-7', name: 'Mukhallat Maliki', category: 'attar', gender: 'Unisex',
    description: 'A royal mukhallat blend combining oud, rose, and amber in perfect harmony.',
    image: attarShelf1, fragranceProfile: ['Rose', 'Oud', 'Amber'],
    sizes: [{ size: '3 ml', price: 22 }, { size: '6 ml', price: 38 }, { size: '12 ml', price: 65 }],
    fragranceNotes: { top: ['Rose', 'Saffron'], middle: ['Oud', 'Amber'], base: ['Sandalwood', 'Musk'] },
    longevity: '14–20 hours', sillage: 'Strong', longevityRating: 9, projectionRating: 8, sillageRating: 8, reviews: sampleReviews.slice(1, 4),
  },
];

export const internationalPerfumes: Product[] = [
  {
    id: 'int-1', name: 'Creed Aventus', category: 'international', brand: 'Creed', gender: 'Men',
    description: 'The iconic fragrance celebrating strength, power, and success.',
    image: storePerfumesDisplay, fragranceProfile: ['Fruity', 'Smoky', 'Woody'],
    sizes: [{ size: '100 ml', price: 435 }],
    fragranceNotes: { top: ['Pineapple', 'Bergamot', 'Apple'], middle: ['Birch', 'Jasmine', 'Rose'], base: ['Musk', 'Oakmoss', 'Vanilla'] },
    longevity: '8–12 hours', sillage: 'Strong', longevityRating: 7, projectionRating: 8, sillageRating: 8, isBestSeller: true, tags: ['Bestseller'], reviews: sampleReviews,
  },
  {
    id: 'int-2', name: 'Bleu de Chanel', category: 'international', brand: 'Chanel', gender: 'Men',
    description: 'A woody aromatic fragrance for the man who defies convention.',
    image: storeShelfArch, fragranceProfile: ['Fresh', 'Woody', 'Aromatic'],
    sizes: [{ size: '100 ml', price: 165 }],
    fragranceNotes: { top: ['Citrus', 'Mint'], middle: ['Ginger', 'Jasmine'], base: ['Sandalwood', 'Cedar'] },
    longevity: '8–10 hours', sillage: 'Moderate', longevityRating: 6, projectionRating: 5, sillageRating: 5, reviews: sampleReviews.slice(0, 3),
  },
  {
    id: 'int-3', name: 'Dior Sauvage', category: 'international', brand: 'Dior', gender: 'Men',
    description: 'A radical fresh composition, raw and noble.',
    image: storeInterior, fragranceProfile: ['Spicy', 'Fresh', 'Magnetic'],
    sizes: [{ size: '100 ml', price: 155 }],
    fragranceNotes: { top: ['Pepper', 'Calabrian Bergamot'], middle: ['Sichuan Pepper', 'Lavender'], base: ['Ambroxan', 'Cedar'] },
    longevity: '8–12 hours', sillage: 'Strong', longevityRating: 7, projectionRating: 7, sillageRating: 7, isBestSeller: true, tags: ['Bestseller'], reviews: sampleReviews.slice(1, 5),
  },
  {
    id: 'int-4', name: 'Versace Eros', category: 'international', brand: 'Versace', gender: 'Men',
    description: 'A fragrance for a strong, passionate man, inspired by Greek mythology.',
    image: storeWide, fragranceProfile: ['Fresh', 'Sweet', 'Minty'],
    sizes: [{ size: '100 ml', price: 125 }],
    fragranceNotes: { top: ['Mint', 'Green Apple', 'Lemon'], middle: ['Tonka Bean', 'Geranium'], base: ['Vanilla', 'Vetiver', 'Oakmoss'] },
    longevity: '6–10 hours', sillage: 'Moderate', longevityRating: 5, projectionRating: 5, sillageRating: 5, reviews: sampleReviews.slice(0, 2),
  },
  {
    id: 'int-5', name: 'Armani Sì', category: 'international', brand: 'Giorgio Armani', gender: 'Women',
    description: 'A modern chypre fragrance that says yes to life with intensity.',
    image: storePerfumesDisplay, fragranceProfile: ['Floral', 'Fruity', 'Elegant'],
    sizes: [{ size: '100 ml', price: 140 }],
    fragranceNotes: { top: ['Blackcurrant', 'Mandarin'], middle: ['Rose', 'Freesia'], base: ['Vanilla', 'Patchouli', 'Woody Amber'] },
    longevity: '6–8 hours', sillage: 'Moderate', longevityRating: 5, projectionRating: 5, sillageRating: 5, reviews: sampleReviews.slice(2, 5),
  },
  {
    id: 'int-6', name: 'Gucci Flora', category: 'international', brand: 'Gucci', gender: 'Women',
    description: 'A vibrant, feminine floral with an enchanting personality.',
    image: storeShelfArch, fragranceProfile: ['Floral', 'Fresh', 'Feminine'],
    sizes: [{ size: '100 ml', price: 130 }],
    fragranceNotes: { top: ['Citrus', 'Peony'], middle: ['Rose', 'Osmanthus'], base: ['Patchouli', 'Sandalwood'] },
    longevity: '6–8 hours', sillage: 'Soft', longevityRating: 5, projectionRating: 4, sillageRating: 3, isNew: true, tags: ['New Arrival'], reviews: sampleReviews.slice(0, 3),
  },
  {
    id: 'int-7', name: 'Polo Blue', category: 'international', brand: 'Ralph Lauren', gender: 'Men',
    description: 'A fresh, aquatic fragrance evoking the freedom of open skies.',
    image: storeInterior, fragranceProfile: ['Aquatic', 'Fresh', 'Clean'],
    sizes: [{ size: '125 ml', price: 110 }],
    fragranceNotes: { top: ['Melon', 'Cucumber'], middle: ['Sage', 'Basil'], base: ['Musk', 'Suede', 'Woodsy Notes'] },
    longevity: '6–8 hours', sillage: 'Moderate', longevityRating: 5, projectionRating: 5, sillageRating: 5, reviews: sampleReviews.slice(1, 3),
  },
  {
    id: 'int-8', name: 'Lacoste White', category: 'international', brand: 'Lacoste', gender: 'Men',
    description: 'A pure, clean fragrance for the modern gentleman.',
    image: storeWide, fragranceProfile: ['Clean', 'Fresh', 'Woody'],
    sizes: [{ size: '100 ml', price: 85 }],
    fragranceNotes: { top: ['Grapefruit', 'Cedar Leaves'], middle: ['Tuberose', 'White Pepper'], base: ['Cedar', 'Musk', 'Suede'] },
    longevity: '4–6 hours', sillage: 'Soft', longevityRating: 3, projectionRating: 3, sillageRating: 3, reviews: sampleReviews.slice(3, 5),
  },
];

export const allProducts: Product[] = [...inspiredPerfumes, ...arabianAttars, ...internationalPerfumes];

export const comboOffers: ComboOffer[] = [
  {
    id: 'combo-1', title: 'The Oud Collection', description: '3 premium oud fragrances in one exclusive set.',
    products: ['ins-1', 'att-2', 'att-6'], originalPrice: 261, comboPrice: 199,
    image: attarShelf1,
  },
  {
    id: 'combo-2', title: 'Date Night Duo', description: 'A his & hers fragrance set for special evenings.',
    products: ['ins-2', 'ins-7'], originalPrice: 297, comboPrice: 229,
    image: carFresheners,
  },
  {
    id: 'combo-3', title: 'Arabian Essentials', description: 'Discover the best of Arabian attars in one box.',
    products: ['att-1', 'att-4', 'att-5'], originalPrice: 129, comboPrice: 89,
    image: goldenLamp,
  },
];

export const getCategoryProducts = (category: ProductCategory): Product[] => {
  switch (category) {
    case 'inspired': return inspiredPerfumes;
    case 'attar': return arabianAttars;
    case 'international': return internationalPerfumes;
  }
};

export const getProductById = (id: string): Product | undefined => allProducts.find(p => p.id === id);
export const getBestSellers = (): Product[] => allProducts.filter(p => p.tags?.includes('Bestseller') || p.isBestSeller);
export const getFeatured = (): Product[] => allProducts.slice(0, 6);
