import { useState, useMemo } from 'react';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import { allProducts, ProductCategory } from '@/data/products';

const Shop = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ProductCategory | 'all'>('all');
  const [sort, setSort] = useState<'default' | 'low' | 'high'>('default');

  const filtered = useMemo(() => {
    let products = category === 'all' ? allProducts : allProducts.filter(p => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.inspiredBy?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
      );
    }
    if (sort === 'low') products = [...products].sort((a, b) => a.sizes[0].price - b.sizes[0].price);
    if (sort === 'high') products = [...products].sort((a, b) => b.sizes[0].price - a.sizes[0].price);
    return products;
  }, [search, category, sort]);

  return (
    <div className="luxury-container py-12">
      <SEO title="Shop All Perfumes" description="Browse our complete collection of luxury perfumes. Arabic, Inspired & International fragrances at the best prices." path="/shop" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
        <p className="text-accent-font text-sm tracking-[0.3em] uppercase text-primary mb-2">Collection</p>
        <h1 className="font-display text-4xl font-bold text-foreground">Shop All Perfumes</h1>
        <div className="gold-divider mt-4" />
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search perfumes..."
            className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          {(['all', 'inspired', 'attar', 'international'] as const).map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-full border transition-colors ${
                category === c
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
              }`}
            >
              {c === 'all' ? 'All' : c === 'attar' ? 'Attars' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as any)}
          className="px-4 py-3 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none"
        >
          <option value="default">Default Sort</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">No perfumes found matching your search.</p>
      ) : (
        <ProductGrid products={filtered} columnsPerRow={4} />
      )}
    </div>
  );
};

export default Shop;
