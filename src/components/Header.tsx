import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Sun, Moon, Heart, ChevronDown, ChevronRight, ArrowLeft, MapPin, Phone } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useWishlist } from '@/context/WishlistContext';
import { AnimatePresence, motion } from 'framer-motion';
import logoImg from '@/assets/logo.jpg';

const primaryLinks = [
  { label: 'Home', to: '/' },
];

const perfumeLinks = [
  { label: 'Arabic', to: '/shop' },
  { label: 'Inspired', to: '/category/inspired' },
  { label: 'International', to: '/category/international' },
];

const moreLinks = [
  { label: 'Bakhoor', to: '/category/bakhoor' },
  { label: 'Candles', to: '/category/candles' },
  { label: 'Aroma Oils', to: '/category/aroma-oils' },
  { label: 'Car and Home Fragrances', to: '/category/car-home-fragrances' },
];

// Mobile menu structure
const mobileMainLinks = [
  { label: 'Home', to: '/' },
  { label: 'Perfumes', to: null }, // submenu trigger
  { label: 'Attars', to: '/category/attar' },
  { label: 'About Us', to: '/about' },
];

const perfumeSubmenu = [
  { label: 'Arabic', to: '/shop' },
  { label: 'Inspired', to: '/category/inspired' },
  { label: 'International', to: '/category/international' },
];

const mobileSecondaryLinks = [
  { label: 'Visit Store', to: '/visit-store', icon: MapPin },
  { label: 'Contact', to: '/contact', icon: Phone },
  { label: 'Bakhoor', to: '/category/bakhoor', icon: MapPin },
  { label: 'Candles', to: '/category/candles', icon: MapPin },
  { label: 'Aroma Oils', to: '/category/aroma-oils', icon: MapPin },
  { label: 'Car & Home', to: '/category/car-home-fragrances', icon: MapPin },
];

// Gold ripple wrapper for menu items
const GoldRipple = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const id = Date.now();
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);
  }, []);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onTouchStart={handleInteraction}
      onMouseDown={handleInteraction}
      style={{ borderRadius: 8 }}
    >
      {children}
      {ripples.map(r => (
        <span
          key={r.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: r.x - 40,
            top: r.y - 40,
            width: 80,
            height: 80,
            background: 'radial-gradient(circle, rgba(198,169,107,0.35) 0%, transparent 70%)',
            transform: 'scale(0)',
            animation: 'gold-ripple 0.6s ease-out forwards',
          }}
        />
      ))}
    </div>
  );
};


const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState(false);
  const [perfumesOpen, setPerfumesOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const perfumesRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => { setMobileOpen(false); setMoreOpen(false); setPerfumesOpen(false); setMobileSubmenu(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (perfumesRef.current && !perfumesRef.current.contains(e.target as Node)) setPerfumesOpen(false);
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const closeMobile = () => { setMobileOpen(false); setMobileSubmenu(false); };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="luxury-container">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <img src={logoImg} alt="Dubai Perfumes" className="h-9 sm:h-12 lg:h-14 w-auto rounded flex-shrink-0" />
              <span className="font-brand text-[15px] sm:text-xl lg:text-2xl font-bold text-primary whitespace-nowrap">
                DUBAI PERFUMES
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-4 xl:gap-7">
              {/* Home */}
              <Link
                to="/"
                className={`nav-link pb-1 ${location.pathname === '/' ? 'text-primary' : ''}`}
              >
                Home
              </Link>

              {/* Perfumes Dropdown */}
              <div ref={perfumesRef} className="relative">
                <button
                  onClick={() => setPerfumesOpen(prev => !prev)}
                  className={`nav-link pb-1 flex items-center gap-1 ${perfumeLinks.some(l => location.pathname === l.to) ? 'text-primary' : ''}`}
                >
                  Perfumes <ChevronDown size={12} className={`transition-transform duration-200 ${perfumesOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {perfumesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-luxury-elevated overflow-hidden z-50"
                    >
                      {perfumeLinks.map(link => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className={`block px-5 py-3 text-xs font-medium tracking-widest uppercase transition-colors ${
                            location.pathname === link.to
                              ? 'text-primary bg-primary/10'
                              : 'text-muted-foreground hover:text-primary hover:bg-muted'
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Attars */}
              <Link
                to="/category/attar"
                className={`nav-link pb-1 ${location.pathname === '/category/attar' ? 'text-primary' : ''}`}
              >
                Attars
              </Link>

              {/* More Dropdown */}
              <div ref={moreRef} className="relative">
                <button
                  onClick={() => setMoreOpen(prev => !prev)}
                  className={`nav-link pb-1 flex items-center gap-1 ${moreLinks.some(l => location.pathname === l.to) ? 'text-primary' : ''}`}
                >
                  More <ChevronDown size={12} className={`transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-luxury-elevated overflow-hidden z-50"
                    >
                      {moreLinks.map(link => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className={`block px-5 py-3 text-xs font-medium tracking-widest uppercase transition-colors ${
                            location.pathname === link.to
                              ? 'text-primary bg-primary/10'
                              : 'text-muted-foreground hover:text-primary hover:bg-muted'
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* About Us */}
              <Link
                to="/about"
                className={`nav-link pb-1 ${location.pathname === '/about' ? 'text-primary' : ''}`}
              >
                About Us
              </Link>
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Moon size={16} className="sm:w-[18px] sm:h-[18px]" />}
              </button>

              <Link to="/wishlist" className="relative p-2 text-foreground hover:text-primary transition-colors">
                <Heart size={18} className="sm:w-5 sm:h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-primary text-primary-foreground text-[10px] sm:text-xs rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors">
                <ShoppingBag size={18} className="sm:w-5 sm:h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-primary text-primary-foreground text-[10px] sm:text-xs rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              <Link
                to={isAuthenticated ? (user?.isAdmin ? '/admin' : '/dashboard') : '/login'}
                className="p-2 text-foreground hover:text-primary transition-colors hidden sm:block"
              >
                <User size={20} />
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-foreground"
                aria-label="Toggle menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cinematic full-screen luxury mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 z-[100] lg:hidden flex flex-col"
            style={{
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* Gold vignette edges */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 50%, rgba(198,169,107,0.06) 100%)',
              }}
            />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              onClick={(e) => { e.stopPropagation(); closeMobile(); }}
              onTouchEnd={(e) => { e.stopPropagation(); closeMobile(); }}
              className="absolute top-6 right-6 z-[110] p-4 active:scale-95 transition-transform duration-150"
              aria-label="Close menu"
              style={{ WebkitTapHighlightColor: 'transparent' }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={30} className="drop-shadow-[0_0_8px_rgba(198,169,107,0.6)]" style={{ color: '#C6A96B' }} />
            </motion.button>

            {/* Center content — no scroll needed */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-8">
              <AnimatePresence mode="wait">
                {!mobileSubmenu ? (
                  <motion.nav
                    key="main-nav"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center"
                    style={{ gap: 12 }}
                  >
                    {mobileMainLinks.map((link, i) => (
                      <motion.div
                        key={link.label}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.05, duration: 0.35, ease: 'easeOut' }}
                      >
                        {link.to ? (
                          <GoldRipple>
                            <Link
                              to={link.to}
                              onClick={closeMobile}
                              className="block py-3 px-6 font-display text-[28px] sm:text-4xl tracking-wider text-center transition-all duration-300"
                              style={{
                                color: location.pathname === link.to ? '#C6A96B' : '#F5F5F5',
                                textShadow: location.pathname === link.to ? '0 0 12px rgba(198,169,107,0.5)' : 'none',
                              }}
                            >
                              {link.label}
                            </Link>
                          </GoldRipple>
                        ) : (
                          <GoldRipple>
                            <button
                              onClick={() => setMobileSubmenu(true)}
                              className="flex items-center gap-3 py-3 px-6 w-full justify-center font-display text-[28px] sm:text-4xl tracking-wider text-center transition-all duration-300"
                              style={{ color: '#F5F5F5' }}
                            >
                              {link.label}
                              <ChevronRight size={22} style={{ color: '#C6A96B' }} />
                            </button>
                          </GoldRipple>
                        )}
                      </motion.div>
                    ))}
                  </motion.nav>
                ) : (
                  <motion.nav
                    key="sub-nav"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="flex flex-col items-center"
                    style={{ gap: 8 }}
                  >
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.05 }}
                      onClick={() => setMobileSubmenu(false)}
                      className="flex items-center gap-2 mb-4 text-xs tracking-[0.25em] uppercase"
                      style={{ color: '#C6A96B' }}
                    >
                      <ArrowLeft size={14} />
                      Back
                    </motion.button>

                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.35 }}
                      transition={{ delay: 0.08 }}
                      className="text-[10px] tracking-[0.35em] uppercase mb-2"
                      style={{ color: '#C6A96B' }}
                    >
                      Perfumes
                    </motion.span>

                    {perfumeSubmenu.map((link, i) => (
                      <motion.div
                        key={link.to}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 + i * 0.05, duration: 0.35 }}
                      >
                        <GoldRipple>
                          <Link
                            to={link.to}
                            onClick={closeMobile}
                            className="block py-3 px-6 font-display text-[28px] sm:text-4xl tracking-wider text-center transition-all duration-300"
                            style={{
                              color: location.pathname === link.to ? '#C6A96B' : '#F5F5F5',
                              textShadow: location.pathname === link.to ? '0 0 12px rgba(198,169,107,0.5)' : 'none',
                            }}
                          >
                            {link.label}
                          </Link>
                        </GoldRipple>
                      </motion.div>
                    ))}
                  </motion.nav>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom section */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="relative z-10 pb-10 px-8 space-y-5"
            >
              <div className="w-16 h-px mx-auto" style={{ background: 'rgba(198,169,107,0.25)' }} />

              <div className="flex justify-center gap-8">
                {mobileSecondaryLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeMobile}
                    className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase transition-colors"
                    style={{ color: 'rgba(245,245,245,0.45)' }}
                  >
                    <link.icon size={13} style={{ color: '#C6A96B' }} />
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="flex justify-center gap-8">
                <Link
                  to={isAuthenticated ? (user?.isAdmin ? '/admin' : '/dashboard') : '/login'}
                  onClick={closeMobile}
                  className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase transition-colors"
                  style={{ color: 'rgba(245,245,245,0.45)' }}
                >
                  <User size={13} style={{ color: '#C6A96B' }} />
                  {isAuthenticated ? 'Account' : 'Login'}
                </Link>
                <Link
                  to="/wishlist"
                  onClick={closeMobile}
                  className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase transition-colors"
                  style={{ color: 'rgba(245,245,245,0.45)' }}
                >
                  <Heart size={13} style={{ color: '#C6A96B' }} />
                  Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
