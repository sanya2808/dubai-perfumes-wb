import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import storeFrontImg from '@/assets/store-front-real.jpg';

const sectionAnim = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: 'easeOut' as const },
};

const AboutUs = () => (
  <div>
    <SEO title="About Us" description="Learn about Dubai Perfumes - our history, our passion for fragrances, and our commitment to luxury quality." path="/about" />
    {/* Hero */}
    <section className="relative h-72 overflow-hidden">
      <img src={storeFrontImg} alt="Dubai Perfumes About Us" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-background/70" />
      <div className="relative h-full luxury-container flex flex-col justify-center items-center text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">About Us</h1>
          <p className="text-muted-foreground mt-2">Discover our passion for fine fragrances</p>
        </motion.div>
      </div>
    </section>

    {/* About Story */}
    <section className="relative">
      <div className="relative luxury-container section-padding">
        {/* Content to be added later */}
      </div>
    </section>

    <div className="gold-divider-wide" />

    {/* Contact Information */}
    <section className="luxury-container section-padding">
      <motion.div {...sectionAnim} className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-accent-font text-sm tracking-[0.4em] uppercase text-primary mb-5">Get In Touch</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-8">Visit or Contact Us</h2>
          <div className="gold-divider mx-auto" />
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Location Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-lg border border-border bg-card/50 shadow-luxury-card hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-start gap-4">
              <MapPin className="text-primary flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Location</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  DUBAI PERFUMES Shop no. 4020, 4th Floor, Shree Satyanarayan Roongta Forum (SSRF) Lavatenagar, Dr. Babasaheb Ambedkar Rd, next to City Centre Mall, Lavate Nager, Parijat Nagar, Nashik, Maharashtra 422002, India.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Phone Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-lg border border-border bg-card/50 shadow-luxury-card hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-start gap-4">
              <Phone className="text-primary flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Phone</h3>
                <a href="tel:+917387874020" className="text-sm text-primary hover:text-primary/80 transition-colors">
                  +91 7387874020
                </a>
              </div>
            </div>
          </motion.div>

          {/* Email Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-lg border border-border bg-card/50 shadow-luxury-card hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-start gap-4">
              <Mail className="text-primary flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Email</h3>
                <a
                  href="mailto:dubaiperfumesnashik@gmail.com"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  dubaiperfumesnashik@gmail.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* Store Hours Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-8 rounded-lg border border-border bg-card/50 shadow-luxury-card hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-start gap-4">
              <Clock className="text-primary flex-shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Store Hours</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  11:00 AM – 9:00 PM<br />
                  <span className="text-xs text-muted-foreground/70">(Daily)</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Google Maps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full mb-12 rounded-lg overflow-hidden shadow-luxury-card"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.421773774698!2d73.75713407522875!3d19.99080528141134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddebea43287b93%3A0xe63b8539d7c70f25!2sDubai%20Perfumes!5e0!3m2!1sen!2sin!4v1773161819276!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: '0.5rem' }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center pt-8 border-t border-border"
        >
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Have questions? Want to learn more about our collection? Reach out to us and let us help you find the perfect fragrance.
          </p>
          <Link
            to="/contact"
            className="btn-premium inline-flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground font-semibold uppercase tracking-[0.15em] text-sm rounded-sm hover:shadow-lg transition-shadow duration-300"
          >
            Send us a Message
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  </div>
);

export default AboutUs;
