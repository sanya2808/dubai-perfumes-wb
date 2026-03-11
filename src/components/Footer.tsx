import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const Footer = () => (
  <footer className="bg-secondary border-t border-border/30">
    <div className="luxury-container py-12 md:py-20">
      {/* Brand slogan */}
      <div className="text-center mb-10 md:mb-16">
        <p className="text-accent-font text-sm tracking-[0.3em] uppercase text-primary mb-3">Established in Dubai</p>
        <h3 className="font-brand text-3xl md:text-4xl font-bold text-primary">
          DUBAI PERFUMES
        </h3>
        <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto">
          Where Arabian heritage meets modern luxury. Every fragrance tells a story.
        </p>
      </div>

      <div className="gold-divider-wide mb-12" />

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        <div>
          <h4 className="font-display text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-5">Collections</h4>
          <div className="space-y-3">
            {[['Inspired Perfumes', '/category/inspired'], ['Arabian Attars', '/category/attar'], ['International Perfumes', '/category/international'], ['Shop All', '/shop']].map(([label, to]) => (
              <Link key={to} to={to} className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-300">{label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-5">Experience</h4>
          <div className="space-y-3">
            {[['Visit Our Boutique', '/visit-store'], ['Customer Reviews', '/reviews'], ['Contact Us', '/contact'], ['My Account', '/login']].map(([label, to]) => (
              <Link key={to} to={to} className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-300">{label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-5">Visit Us</h4>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-start gap-2 text-xs sm:text-sm">
              <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
              <span>DUBAI PERFUMES Shop no. 4020, 4th Floor, Shree Satyanarayan Roongta Forum (SSRF), Lavate Nagar, Nashik, Maharashtra 422002</span>
            </p>
            <p>Open Daily: 11:00 AM – 9:00 PM</p>
          </div>
        </div>
        <div>
          <h4 className="font-display text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-5">Connect</h4>
          <div className="flex items-center gap-4 mb-5">
            <a href="https://wa.me/917387874020" target="_blank" className="p-2.5 rounded-full border border-border/50 text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300">
              <MessageCircle size={16} />
            </a>
            <a href="https://www.instagram.com/dubaiperfumes_nsk" target="_blank" className="p-2.5 rounded-full border border-border/50 text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300">
              <Instagram size={16} />
            </a>
            <a href="tel:+917387874020" className="p-2.5 rounded-full border border-border/50 text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300">
              <Phone size={16} />
            </a>
            <a href="mailto:dubaiperfumesnashik@gmail.com" className="p-2.5 rounded-full border border-border/50 text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300">
              <Mail size={16} />
            </a>
          </div>
          <p className="text-sm text-muted-foreground">dubaiperfumesnashik@gmail.com</p>
        </div>
      </div>

      <div className="gold-divider-wide mt-10 md:mt-16 mb-6 md:mb-8" />
      <div className="text-center text-xs text-muted-foreground/60 tracking-wider">
        © 2026 DIP Dubai Perfumes. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
