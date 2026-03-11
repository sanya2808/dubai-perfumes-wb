import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface WishlistContextType {
  items: string[];
  toggleItem: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]');
    } catch { return []; }
  });

  const persist = (next: string[]) => {
    setItems(next);
    localStorage.setItem('wishlist', JSON.stringify(next));
  };

  const toggleItem = useCallback((productId: string) => {
    setItems(prev => {
      const next = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('wishlist', JSON.stringify(next));
      return next;
    });
  }, []);

  const isWishlisted = useCallback((productId: string) => items.includes(productId), [items]);

  return (
    <WishlistContext.Provider value={{ items, toggleItem, isWishlisted, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
