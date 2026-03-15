import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import {
  allProducts as localProducts,
  getBestSellers as localGetBestSellers,
  getProductById as localGetProductById,
  getCategoryProducts as localGetCategoryProducts,
  comboOffers as localComboOffers,
  type Product,
  type ProductCategory,
  type ComboOffer,
} from '@/data/products';

const PRODUCTS_COLLECTION = 'products';
const COMBOS_COLLECTION = 'combos';

/**
 * Fetch all products from Firestore, with local fallback
 */
export async function fetchAllProducts(): Promise<Product[]> {
  try {
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (snapshot.empty) {
      console.info('[Products] Firestore empty — using local data');
      return localProducts;
    }
    return snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Product));
  } catch (error) {
    console.warn('[Products] Firestore fetch failed — using local fallback', error);
    return localProducts;
  }
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(id: string): Promise<Product | undefined> {
  try {
    const docSnap = await getDoc(doc(db, PRODUCTS_COLLECTION, id));
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id } as Product;
    }
    // Fallback to local
    return localGetProductById(id);
  } catch (error) {
    console.warn('[Products] Firestore getDoc failed — using local fallback', error);
    return localGetProductById(id);
  }
}

/**
 * Fetch products by category
 */
export async function fetchCategoryProducts(category: ProductCategory): Promise<Product[]> {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('category', '==', category)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return localGetCategoryProducts(category);
    }
    return snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Product));
  } catch (error) {
    console.warn('[Products] Category fetch failed — using local fallback', error);
    return localGetCategoryProducts(category);
  }
}

/**
 * Fetch best-selling products
 */
export async function fetchBestSellers(): Promise<Product[]> {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('isBestSeller', '==', true)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return localGetBestSellers();
    }
    return snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Product));
  } catch (error) {
    console.warn('[Products] Bestseller fetch failed — using local fallback', error);
    return localGetBestSellers();
  }
}

/**
 * Fetch combo offers
 */
export async function fetchComboOffers(): Promise<ComboOffer[]> {
  try {
    const snapshot = await getDocs(collection(db, COMBOS_COLLECTION));
    if (snapshot.empty) {
      return localComboOffers;
    }
    return snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as ComboOffer));
  } catch (error) {
    console.warn('[Combos] Firestore fetch failed — using local fallback', error);
    return localComboOffers;
  }
}
