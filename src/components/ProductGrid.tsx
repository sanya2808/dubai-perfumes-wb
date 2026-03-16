import ProductCard from './ProductCard';
import { Product } from '@/data/products';

interface Props {
  products: Product[];
  columnsPerRow?: number;
}

const ProductGrid = ({ products, columnsPerRow = 4 }: Props) => {
  return (
    // 2 columns on mobile, 3 on tablet, 4 on desktop
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
      {products.map((p, i) => (
        <ProductCard
          key={p.id}
          product={p}
          index={i}
          columnsPerRow={columnsPerRow}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
