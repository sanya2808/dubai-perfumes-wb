import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift } from 'lucide-react';
import { useOffers } from '@/context/OffersContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const OfferFloater = () => {
  const { activeOffers } = useOffers();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  // Only show the first active offer
  const currentOffer = activeOffers[0];

  useEffect(() => {
    // Check if floater was closed in this session
    const wasClosed = sessionStorage.getItem('offerFloaterClosed');
    if (!wasClosed && currentOffer && activeOffers.length > 0) {
      // Show floater after 2-3 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [currentOffer, activeOffers]);

  const handleClose = () => {
    setIsClosed(true);
    setIsVisible(false);
    // Mark as closed for this session
    sessionStorage.setItem('offerFloaterClosed', 'true');
  };

  // Don't show if no active offers or if closed
  if (!currentOffer || !activeOffers.length || isClosed) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-40 max-w-sm"
        >
          {/* Distinct Background Container with Border and Glow */}
          <div className="bg-black/80 border border-amber-400 rounded-xl p-5 sm:p-6 shadow-lg shadow-amber-400/20 backdrop-blur-md">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close offer"
            >
              <X size={18} className="text-amber-400/60 hover:text-amber-400" />
            </button>

            {/* Exclusive Offer Badge */}
            <div className="absolute -top-3 left-6">
              <span className="bg-amber-400 text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                Exclusive Offer
              </span>
            </div>

            {/* Offer Content */}
            <div className="space-y-4 pr-6 mt-2">
              {/* Icon and Title */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-400/20">
                  <Gift size={22} className="text-amber-400" />
                </div>
                <div className="flex-1 mt-1">
                  <h3 className="font-display text-xl font-extrabold text-amber-400">
                    🔥 Exclusive Offers
                  </h3>
                  <p className="font-semibold text-white mt-1 text-sm">
                    {currentOffer.title}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-300 leading-relaxed">
                {currentOffer.description}
              </p>

              {/* Discount Badge */}
              <div className="inline-block px-3 py-1.5 bg-amber-400/20 border border-amber-400/40 rounded-full">
                <span className="text-sm font-bold text-amber-400">
                  {currentOffer.discountType === 'percentage'
                    ? `${currentOffer.discountValue}% OFF`
                    : `₹${currentOffer.discountValue} OFF`}
                </span>
              </div>

              {/* Coupon Code */}
              {currentOffer.couponCode && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 w-max pr-6">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                    Coupon Code
                  </p>
                  <p className="font-mono text-sm font-bold text-white tracking-wider">
                    {currentOffer.couponCode}
                  </p>
                </div>
              )}

              {/* CTA Button */}
              <Link
                to="/shop"
                onClick={handleClose}
                className="block w-full py-2.5 px-4 bg-amber-400 text-black text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-amber-300 transition-colors text-center shadow-lg shadow-amber-400/20 mt-2"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfferFloater;
