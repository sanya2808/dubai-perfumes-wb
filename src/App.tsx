import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider, useCart } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { OffersProvider } from "@/context/OffersContext";
import { AdminAuthSecurityProvider } from "@/context/AdminAuthSecurityContext";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import AnnouncementBar from "@/components/AnnouncementBar";
import PageTransition from "@/components/PageTransition";
import TopLoadingBar from "@/components/TopLoadingBar";
import ScrollToTop from "@/components/ScrollToTop";
import LoginModal from "@/components/LoginModal";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import Reviews from "./pages/Reviews";
import VisitStore from "./pages/VisitStore";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
        <Route path="/category/:category" element={<PageTransition><CategoryPage /></PageTransition>} />
        <Route path="/product/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
        <Route path="/reviews" element={<PageTransition><Reviews /></PageTransition>} />
        <Route path="/visit-store" element={<PageTransition><VisitStore /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutUs /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const { isDrawerOpen, closeDrawer } = useCart();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <TopLoadingBar />
      {/* Announcement bar sits above the navbar */}
      <AnnouncementBar />
      <Header />
      <CartDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
      {/* Global login modal — available on every page */}
      <LoginModal />
      <main className="min-h-screen">
        <AnimatedRoutes />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <AdminAuthSecurityProvider>
          <CartProvider>
            <OffersProvider>
              <WishlistProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <AppContent />
                </TooltipProvider>
              </WishlistProvider>
            </OffersProvider>
          </CartProvider>
        </AdminAuthSecurityProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
