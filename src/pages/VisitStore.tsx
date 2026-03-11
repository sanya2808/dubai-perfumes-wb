import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, MessageCircle, Navigation } from 'lucide-react';
import storeFrontImg from '@/assets/store-front-real.jpg';
import storeWideImg from '@/assets/store-wide.jpg';
import storeShelfArchImg from '@/assets/store-shelf-arch.jpg';

const VisitStore = () => (
  <div>
    {/* Hero */}
    <section className="relative h-72 overflow-hidden">
      <img src={storeFrontImg} alt="Dubai Perfumes Store" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-background/70" />
      <div className="relative h-full luxury-container flex flex-col justify-center items-center text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Visit Our Store</h1>
          <p className="text-muted-foreground mt-2">Experience luxury fragrances in person</p>
        </motion.div>
      </div>
    </section>

    {/* Store Gallery */}
    <div className="luxury-container py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg overflow-hidden border border-border shadow-luxury-card">
          <img src={storeWideImg} alt="Store Interior" className="w-full h-64 object-cover" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-lg overflow-hidden border border-border shadow-luxury-card">
          <img src={storeShelfArchImg} alt="Perfume Display" className="w-full h-64 object-cover" />
        </motion.div>
      </div>

      <div className="gold-divider mb-12" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Map */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="rounded-lg overflow-hidden border border-border shadow-luxury-card">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.421773774698!2d73.75713407522875!3d19.99080528141134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddebea43287b93%3A0xe63b8539d7c70f25!2sDubai%20Perfumes!5e0!3m2!1sen!2sin!4v1773161819276!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '0.5rem' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Store Information</h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <MapPin className="text-primary flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-foreground">Address</p>
                  <p className="text-sm text-muted-foreground">DUBAI PERFUMES Shop no. 4020, 4th Floor, Shree Satyanarayan Roongta Forum (SSRF) Lavatenagar, Dr. Babasaheb Ambedkar Rd, next to City Centre Mall, Lavate Nager, Parijat Nagar, Nashik, Maharashtra 422002, India.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="text-primary flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-foreground">Opening Hours</p>
                  <p className="text-sm text-muted-foreground">Open Daily: 11:00 AM – 9:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="text-primary flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-foreground">Contact</p>
                  <p className="text-sm text-muted-foreground"><a href="tel:+917387874020" className="hover:text-primary transition-colors">+91 7387874020</a></p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <a
              href="https://wa.me/917387874020"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground font-semibold uppercase tracking-wider text-sm rounded hover:bg-gold-dark transition-colors"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>
            <a
              href="https://maps.google.com/maps/search/Dubai+Perfumes,+Nashik/@19.9908,73.7571,15z"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border border-primary/50 text-primary font-semibold uppercase tracking-wider text-sm rounded hover:bg-primary/10 transition-colors"
            >
              <Navigation size={18} /> Directions
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);

export default VisitStore;
