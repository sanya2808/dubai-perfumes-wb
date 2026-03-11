import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle, Instagram, Send } from 'lucide-react';

const Contact = () => {
  const [sent, setSent] = useState(false);

  return (
    <div className="luxury-container py-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
        <p className="text-accent-font text-sm tracking-[0.3em] uppercase text-primary mb-2">Get In Touch</p>
        <h1 className="font-display text-4xl font-bold text-foreground">Contact Us</h1>
        <div className="gold-divider mt-4" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          {sent ? (
            <div className="bg-card rounded-lg p-12 shadow-luxury-card text-center">
              <Send size={40} className="mx-auto text-primary mb-4" />
              <h3 className="font-display text-xl font-bold text-foreground mb-2">Message Sent!</h3>
              <p className="text-muted-foreground text-sm">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="bg-card rounded-lg p-8 shadow-luxury-card space-y-5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Name</label>
                <input required className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Email</label>
                <input type="email" required className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Subject</label>
                <input required className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Message</label>
                <textarea required rows={5} className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <button type="submit" className="w-full px-8 py-4 bg-primary text-primary-foreground font-semibold uppercase tracking-wider text-sm rounded hover:bg-gold-dark transition-colors">
                Send Message
              </button>
            </form>
          )}
        </motion.div>

        {/* Contact Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Reach Out To Us</h2>
            <div className="space-y-5">
              {[
                { icon: Phone, label: 'Phone', value: '+91 7387874020', href: 'tel:+917387874020' },
                { icon: MessageCircle, label: 'WhatsApp', value: '+91 7387874020', href: 'https://wa.me/917387874020' },
                { icon: Mail, label: 'Email', value: 'dubaiperfumesnashik@gmail.com', href: 'mailto:dubaiperfumesnashik@gmail.com' },
                { icon: Instagram, label: 'Instagram', value: '@dubaiperfumes', href: 'https://instagram.com' },
              ].map(item => (
                <a key={item.label} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined}
                  className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <item.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
