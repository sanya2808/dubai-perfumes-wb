import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  increment,
} from 'firebase/firestore';

export interface OrderItem {
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface FirestoreOrder {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pinCode: string;
  items: OrderItem[];
  products: string[]; // product name summaries for quick display
  total: number;
  status: string;
  payment: string;
  isGift: boolean;
  giftMessage?: string;
  giftWrap?: string;
  date: string;
  createdAt: any;
  userId?: string;
}

const ORDERS_COLLECTION = 'orders';

/**
 * Create a new order in Firestore
 */
export async function createOrder(orderData: Omit<FirestoreOrder, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
    ...orderData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, newStatus: string): Promise<void> {
  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
    status: newStatus,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update gift status on an order
 */
export async function updateGiftStatus(orderId: string, giftStatus: string): Promise<void> {
  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
    giftStatus,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Fetch all orders (one-time)
 */
export async function fetchAllOrders(): Promise<FirestoreOrder[]> {
  const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    ...d.data(),
    id: d.id,
  } as FirestoreOrder));
}

/**
 * Real-time orders listener for admin panel
 */
export function subscribeToOrders(
  callback: (orders: FirestoreOrder[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
  
  return onSnapshot(
    q,
    (snapshot) => {
      const orders = snapshot.docs.map((d) => ({
        ...d.data(),
        id: d.id,
      } as FirestoreOrder));
      callback(orders);
    },
    (error) => {
      console.error('[Orders] Realtime listener error:', error);
      onError?.(error);
    }
  );
}

/**
 * Decrement product stock after an order
 */
export async function decrementStock(productId: string, quantity: number): Promise<void> {
  try {
    await updateDoc(doc(db, 'products', productId), {
      stock: increment(-quantity),
    });
  } catch (err) {
    console.warn('[Stock] Failed to decrement stock for', productId, err);
  }
}
