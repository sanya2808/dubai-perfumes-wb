import { useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/data/products';

interface Props {
  products: Product[];
  columnsPerRow?: number;
}

const ProductGrid = ({ products, columnsPerRow = 4 }: Props) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
      {products.map((p, i) => (
        <ProductCard
          key={p.id}
          product={p}
          index={i}
          columnsPerRow={columnsPerRow}
          expandedId={expandedId}
          onToggleExpand={handleToggle}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
