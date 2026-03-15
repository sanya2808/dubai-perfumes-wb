import { useQuery } from '@tanstack/react-query';
import {
  fetchAllProducts,
  fetchProductById,
  fetchCategoryProducts,
  fetchBestSellers,
  fetchComboOffers,
} from '@/lib/api/products';
import type { Product, ProductCategory, ComboOffer } from '@/data/products';

/** Fetch ALL products with caching */
export function useAllProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

/** Fetch a single product by ID */
export function useProduct(id: string | undefined) {
  return useQuery<Product | undefined>({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch products by category */
export function useCategoryProducts(category: ProductCategory | undefined) {
  return useQuery<Product[]>({
    queryKey: ['products', 'category', category],
    queryFn: () => fetchCategoryProducts(category!),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch best sellers */
export function useBestSellers() {
  return useQuery<Product[]>({
    queryKey: ['products', 'bestsellers'],
    queryFn: fetchBestSellers,
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch combo offers */
export function useComboOffers() {
  return useQuery<ComboOffer[]>({
    queryKey: ['combos'],
    queryFn: fetchComboOffers,
    staleTime: 5 * 60 * 1000,
  });
}
