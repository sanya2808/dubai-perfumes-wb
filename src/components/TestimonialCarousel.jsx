import { useState, useEffect, useCallback } from "react";

const testimonials = [
  {
    text: "An unforgettable scent that lingers all day — pure elegance in a bottle.",
    name: "Ahmed K.",
  },
  {
    text: "Beautifully crafted fragrance, remarkably close to the original.",
    name: "Sarah M.",
  },
  {
    text: "Luxury you can feel — from packaging to the final note.",
    name: "Khalid R.",
  },
  {
    text: "My go-to destination for premium fragrances. Always exceptional.",
    name: "Fatima A.",
  },
];

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  const goTo = useCallback(
    (index) => {
      if (index === current) return;
      setVisible(false);
      setTimeout(() => {
        setCurrent(index);
        setVisible(true);
      }, 350);
    },
    [current]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (current + 1) % testimonials.length;
      setVisible(false);
      setTimeout(() => {
        setCurrent(next);
        setVisible(true);
      }, 350);
    }, 4000);

    return () => clearInterval(timer);
  }, [current]);

  const { text, name } = testimonials[current];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Subtle ambient gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 50%, hsl(var(--primary) / 0.04) 0%, transparent 70%)",
        }}
      />

      <div className="luxury-container relative z-10">
        {/* Section heading */}
        <div className="flex flex-col items-center mb-14 space-y-4">
          <p
            className="text-xs tracking-[0.3em] uppercase text-primary font-medium"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Client Stories
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-center text-foreground gold-glow-text"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Whispers of Oud
          </h2>
          <div className="gold-divider" />
        </div>

        {/* Carousel card */}
        <div className="flex justify-center">
          <div
            className="relative w-full max-w-[600px] rounded-2xl px-8 py-10 md:px-12 md:py-14 text-center"
            style={{
              background:
                "linear-gradient(145deg, hsl(var(--card) / 0.9), hsl(var(--card) / 0.7))",
              border: "1px solid hsl(var(--primary) / 0.18)",
              boxShadow:
                "0 8px 40px -8px hsl(0 0% 0% / 0.45), 0 0 0 1px hsl(var(--primary) / 0.06)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Large decorative quote mark */}
            <span
              className="absolute -top-5 left-8 text-7xl leading-none select-none"
              style={{ color: "hsl(var(--primary) / 0.25)", fontFamily: "Georgia, serif" }}
              aria-hidden="true"
            >
              &ldquo;
            </span>

            <div
              className="space-y-6 transition-all duration-500 ease-in-out"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0px)" : "translateY(10px)",
              }}
            >
              {/* Quote text */}
              <p
                className="text-xl md:text-2xl italic leading-relaxed text-foreground/90 text-accent-font"
                style={{ fontFamily: "var(--font-accent)" }}
              >
                &ldquo;{text}&rdquo;
              </p>

              {/* Divider */}
              <div
                className="w-10 h-px mx-auto"
                style={{ background: "var(--gradient-gold)" }}
              />

              {/* Customer name */}
              <p
                className="text-sm tracking-[0.2em] uppercase font-semibold"
                style={{
                  color: "hsl(var(--primary))",
                  fontFamily: "var(--font-body)",
                  textShadow: "0 0 16px hsl(var(--primary) / 0.35)",
                }}
              >
                — {name}
              </p>
            </div>
          </div>
        </div>

        {/* Dot navigation */}
        <div className="flex justify-center gap-3 mt-10" role="tablist" aria-label="Testimonial slides">
          {testimonials.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => goTo(i)}
              className="transition-all duration-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              style={{
                width: i === current ? "28px" : "10px",
                height: "10px",
                background:
                  i === current
                    ? "var(--gradient-gold)"
                    : "hsl(var(--primary) / 0.25)",
                boxShadow:
                  i === current
                    ? "0 0 10px hsl(var(--primary) / 0.5)"
                    : "none",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
