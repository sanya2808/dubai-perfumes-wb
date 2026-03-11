import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const GoldenParticles = () => {
  const isMobile = useIsMobile();
  const count = isMobile ? 12 : 30;
  
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 4,
    })), [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, hsl(var(--primary) / 0.6), hsl(var(--primary) / 0))`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default GoldenParticles;
