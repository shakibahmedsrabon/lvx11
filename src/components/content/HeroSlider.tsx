/**
 * HeroSlider — Image-only GPU-accelerated hero carousel.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import heroImage from "@/assets/hero-image.png";
import eclipse from "@/assets/eclipse.jpg";
import halo from "@/assets/halo.jpg";
import lintel from "@/assets/lintel.jpg";
import oblique from "@/assets/oblique.jpg";

interface Slide {
  id: number;
  image: string;
  alt: string;
}

const SLIDES: Slide[] = [
  { id: 1, image: heroImage, alt: "Featured collection" },
  { id: 2, image: eclipse, alt: "Eclipse collection" },
  { id: 3, image: halo, alt: "Halo collection" },
  { id: 4, image: lintel, alt: "Lintel collection" },
  { id: 5, image: oblique, alt: "Oblique collection" },
];

const AUTO_PLAY_INTERVAL = 4500;
const TRANSITION_DURATION = 600;

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartRef = useRef(0);
  const touchDeltaRef = useRef(0);

  const total = SLIDES.length;

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent((index + total) % total);
      setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION);
    },
    [isTransitioning, total]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    timerRef.current = setTimeout(next, AUTO_PLAY_INTERVAL);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, next]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
    touchDeltaRef.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchDeltaRef.current = e.touches[0].clientX - touchStartRef.current;
  };
  const onTouchEnd = () => {
    if (Math.abs(touchDeltaRef.current) > 50) {
      touchDeltaRef.current < 0 ? next() : prev();
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden select-none mb-8 md:mb-12"
      style={{ height: "clamp(280px, 56vw, 520px)" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      {SLIDES.map((slide, i) => {
        const isActive = i === current;
        return (
          <div
            key={slide.id}
            className="absolute inset-0"
            style={{
              willChange: "transform, opacity",
              transform: `translate3d(${(i - current) * 100}%, 0, 0)`,
              transition: `transform ${TRANSITION_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${TRANSITION_DURATION}ms ease`,
              opacity: Math.abs(i - current) <= 1 ? 1 : 0,
              zIndex: isActive ? 2 : 1,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
              draggable={false}
            />
          </div>
        );
      })}
    </section>
  );
};

export default HeroSlider;
