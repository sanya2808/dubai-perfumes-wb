import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import storeInteriorImg from '@/assets/store-interior.jpg';
import storeFrontImg from '@/assets/store-front-real.jpg';
import storeWideImg from '@/assets/store-wide.jpg';
import storePerfumesDisplay from '@/assets/store-perfumes-display.jpg';
import attarShelf1 from '@/assets/attar-shelf-1.jpg';
import attarShelf2 from '@/assets/attar-shelf-2.jpg';

const slides = [
  {
    // Lead with the perfume display — most focused on bottles
    image: storePerfumesDisplay,
    eyebrow: 'Est. Nashik · Dubai Inspired',
    title: 'Arabian Luxury Fragrances',
    subtitle: 'Crafted for timeless elegance and inspired by Dubai\'s finest scents.',
    cta: { label: 'Explore Collection', to: '/shop' },
  },
  {
    image: attarShelf1,
    eyebrow: 'Arabian Heritage',
    title: 'Classic Attars & Ouds',
    subtitle: 'Timeless oil-based fragrances with exceptional depth and longevity.',
    cta: { label: 'Discover Attars', to: '/category/attar' },
  },
  {
    image: attarShelf2,
    eyebrow: 'Exclusive Offers',
    title: 'Limited Time Deals',
    subtitle: 'Save up to 10% on our most coveted perfumes.',
    cta: { label: 'Shop Offers', to: '/shop' },
  },
  {
    image: storeWideImg,
    eyebrow: 'Most Loved',
    title: 'Bestselling Fragrances',
    subtitle: 'Our most beloved scents — curated for connoisseurs.',
    cta: { label: 'View Collection', to: '/shop' },
  },
];

const SLIDE_DURATION = 5000;

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index, dir = 1) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, -1);
  }, [current, goTo]);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => next(), SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [current, paused, next]);

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: '0%', opacity: 1 },
    exit: (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  const textVariants = {
    enter: { opacity: 0, y: 30 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: 'min(75vh, 640px)', minHeight: 380 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0"
        >
          {/* Background image with Ken Burns */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: SLIDE_DURATION / 1000 + 0.75, ease: 'easeOut' }}
          >
            <img
              src={slides[current].image}
              alt={slides[current].title}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </motion.div>

          {/* Darker luxury overlay */}
          <div className="absolute inset-0 bg-black/55" />
          {/* Top-to-bottom gradient: dark top for text, slight lift at bottom */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.30) 55%, rgba(0,0,0,0.72) 100%)',
            }}
          />
          {/* Subtle gold centre glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 65% 55% at 50% 55%, rgba(198,169,107,0.07) 0%, transparent 70%)',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Text content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${current}`}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 }}
            className="max-w-3xl w-full"
          >
            {/* Eyebrow */}
            <motion.p
              className="text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase mb-4"
              style={{ color: '#C6A96B' }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.45 }}
            >
              {slides[current].eyebrow}
            </motion.p>

            {/* Thin gold line */}
            <motion.div
              className="mx-auto mb-6"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{
                width: 50,
                height: 1,
                background: 'linear-gradient(90deg, transparent, #C6A96B, transparent)',
              }}
            />

            {/* Main title — serif luxury font, larger + wider tracking */}
            <motion.h1
              className="font-brand font-bold text-white leading-[1.08] mb-5 tracking-wide"
              style={{
                fontSize: 'clamp(2.2rem, 6.5vw, 5.5rem)',
                letterSpacing: '0.04em',
                /* Issue 3: text-shadow for visibility on both light and dark */
                textShadow: '0 2px 10px rgba(0,0,0,0.55), 0 4px 24px rgba(0,0,0,0.35)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.55 }}
            >
              {slides[current].title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-white/85 mb-10 leading-relaxed"
              style={{
                fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
                letterSpacing: '0.02em',
                fontStyle: 'italic',
                textShadow: '0 2px 10px rgba(0,0,0,0.4)',
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.5 }}
            >
              {slides[current].subtitle}
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52, duration: 0.45 }}
              className="flex items-center justify-center gap-4"
            >
              <Link
                to={slides[current].cta.to}
                className="inline-flex items-center gap-2.5 px-9 sm:px-11 py-3.5 font-semibold uppercase tracking-[0.22em] text-[13px] rounded-sm transition-all duration-300 hover:gap-4 hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, #C6A96B 0%, #E8D5A3 50%, #C6A96B 100%)',
                  color: '#0a0806',
                }}
              >
                {slides[current].cta.label}
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(198,169,107,0.3)',
          color: '#C6A96B',
          backdropFilter: 'blur(6px)',
        }}
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(198,169,107,0.3)',
          color: '#C6A96B',
          backdropFilter: 'blur(6px)',
        }}
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            className="transition-all duration-400 rounded-full"
            style={{
              width: i === current ? 24 : 6,
              height: 6,
              background: i === current ? '#C6A96B' : 'rgba(255,255,255,0.3)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              outline: 'none',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      {!paused && (
        <motion.div
          key={`progress-${current}`}
          className="absolute bottom-0 left-0 h-[2px] z-20"
          style={{ background: 'linear-gradient(90deg, #C6A96B, #E8D5A3)' }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
        />
      )}
    </section>
  );
};

export default HeroSlider;
