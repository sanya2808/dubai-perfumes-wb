import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  { icon: '🔥', text: 'Flat 10% OFF on Orders Above ₹1999 — Use Code: DUBAI10' },
  { icon: '🚚', text: 'Free Shipping Across India on All Orders' },
  { icon: '✨', text: 'New Arabian Collection Now Available — Shop Now' },
  { icon: '🎁', text: 'Luxury Gift Wrapping Available on Every Order' },
];

const INTERVAL_MS = 3500;

const AnnouncementBar = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % messages.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: (d) => ({ y: d > 0 ? 18 : -18, opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (d) => ({ y: d > 0 ? -18 : 18, opacity: 0 }),
  };

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        height: 42,
        background: 'linear-gradient(90deg, #0a0a0a 0%, #1a1208 40%, #0f0d06 60%, #0a0a0a 100%)',
        borderBottom: '1px solid rgba(198,169,107,0.18)',
      }}
    >
      <div className="h-full flex items-center justify-center relative px-4">
        {/* Subtle gold shimmer edges */}
        <div
          className="absolute left-0 top-0 h-full w-16 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, rgba(198,169,107,0.08) 0%, transparent 100%)' }}
        />
        <div
          className="absolute right-0 top-0 h-full w-16 pointer-events-none"
          style={{ background: 'linear-gradient(270deg, rgba(198,169,107,0.08) 0%, transparent 100%)' }}
        />

        {/* Rotating messages */}
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: 'easeInOut' }}
            className="flex items-center gap-2 select-none"
          >
            <span className="text-sm" aria-hidden="true">
              {messages[current].icon}
            </span>
            <span
              className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-center"
              style={{ color: '#C6A96B', letterSpacing: '0.18em' }}
            >
              {messages[current].text}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="absolute right-4 sm:right-8 flex items-center gap-1.5">
          {messages.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? 14 : 4,
                height: 4,
                background: i === current ? '#C6A96B' : 'rgba(198,169,107,0.3)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
              aria-label={`Go to message ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
