import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingWhatsApp = () => (
  <motion.div
    className="fixed bottom-6 right-6 z-50"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 1, type: 'spring', stiffness: 200 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <a
      href="https://wa.me/917387874020?text=Hi! I'd like to inquire about your perfumes."
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow"
    >
      <MessageCircle size={20} />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  </motion.div>
);

export default FloatingWhatsApp;
