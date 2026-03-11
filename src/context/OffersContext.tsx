import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  couponCode?: string;
  applicableProducts: string[];
  applicableCategories: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface OffersContextType {
  offers: Offer[];
  activeOffers: Offer[];
  getProductOffers: (productId: string, category: string) => Offer[];
  isOfferActive: (offer: Offer) => boolean;
}

const OffersContext = createContext<OffersContextType | undefined>(undefined);

// Mock offers data
const mockOffers: Offer[] = [
  {
    id: 'OFF-001',
    title: 'Spring Collection Discount',
    description: '20% off on all Inspired Collection perfumes',
    discountType: 'percentage',
    discountValue: 20,
    couponCode: 'SPRING20',
    applicableProducts: [],
    applicableCategories: ['inspired'],
    startDate: '2026-03-01',
    endDate: '2026-04-30',
    isActive: true,
  },
  {
    id: 'OFF-002',
    title: 'Buy 2 Get 1 Free',
    description: 'Fixed discount on bulk orders',
    discountType: 'fixed',
    discountValue: 45,
    couponCode: 'BUY2GET1',
    applicableProducts: [],
    applicableCategories: ['attar', 'international'],
    startDate: '2026-03-05',
    endDate: '2026-03-31',
    isActive: true,
  },
  {
    id: 'OFF-003',
    title: 'First Time Buyer',
    description: '₹100 discount for new customers',
    discountType: 'fixed',
    discountValue: 100,
    couponCode: 'FIRST100',
    applicableProducts: [],
    applicableCategories: ['inspired', 'attar', 'international'],
    startDate: '2026-02-01',
    endDate: '2026-12-31',
    isActive: false,
  },
];

// Utility function to check if offer is active based on current date
export const isOfferCurrentlyActive = (offer: Offer): boolean => {
  if (!offer.isActive) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(offer.startDate);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(offer.endDate);
  endDate.setHours(23, 59, 59, 999);

  return today >= startDate && today <= endDate;
};

export const OffersProvider = ({ children }: { children: ReactNode }) => {
  const [offers] = useState<Offer[]>(mockOffers);

  const activeOffers = offers.filter(o => isOfferCurrentlyActive(o));

  const isOfferActive = (offer: Offer): boolean => {
    return isOfferCurrentlyActive(offer);
  };

  const getProductOffers = (productId: string, category: string): Offer[] => {
    return activeOffers.filter(offer => {
      const appliesToCategory = offer.applicableCategories.includes(category);
      const appliesToProduct = offer.applicableProducts.length === 0 || offer.applicableProducts.includes(productId);

      return appliesToCategory && appliesToProduct;
    });
  };

  return (
    <OffersContext.Provider value={{ offers, activeOffers, getProductOffers, isOfferActive }}>
      {children}
    </OffersContext.Provider>
  );
};

export const useOffers = () => {
  const ctx = useContext(OffersContext);
  if (!ctx) throw new Error('useOffers must be used within OffersProvider');
  return ctx;
};
