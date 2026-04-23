/**
 * HeroSlider — Samsung-style GPU-accelerated hero carousel.
 *
 * Features:
 * - Smooth CSS translate3d transitions (will-change: transform) for 120fps
 * - Auto-play with play/pause toggle
 * - Dot indicators with active scale animation
 * - Left/right arrow navigation
 * - Touch swipe support
 * - Slide crossfade + slide hybrid transition
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  bgColor: string;
}

const DUMMY_SLIDES: Slide[] = [
  {
    id: 1,
    title: "New Arrivals",
    subtitle: "Discover our latest collection of handcrafted jewelry",
    cta: "Shop Now",
    bgColor: "from-[hsl(var(--primary)/0.08)] to-[hsl(var(--primary)/0.02)]",
  },
  {
    id: 2,
    title: "Summer Collection",
    subtitle: "Light and elegant pieces for the warm season",
    cta: "Explore",
    bgColor: "from-[hsl(var(--accent)/0.15)] to-[hsl(var(--accent)/0.03)]",
  },
  {
    id: 3,
    title: "Exclusive Offers",
    subtitle: "Limited time deals on premium pieces",
    cta: "View Deals",
    bgColor: "from-[hsl(var(--secondary)/0.2)] to-[hsl(var(--secondary)/0.05)]",
  },
  {
    id: 4,
    title: "Wedding Edit",
    subtitle: "Timeless elegance for your special day",
    cta: "Discover",
    bgColor: "from-[hsl(var(--muted)/0.5)] to-[hsl(var(--muted)/0.1)]",
  },
  {
    id: 5,
    title: "Gift Guide",
    subtitle: "Find the perfect piece for every occasion",
    cta: "Browse",
    bgColor: "from-[hsl(var(--primary)/0.06)] to-[hsl(var(--accent)/0.06)]",
  },
];

const AUTO_PLAY_INTERVAL = 4500;
const TRANSITION_DURATION = 600; // ms

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartRef = useRef(0);
  const touchDeltaRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = DUMMY_SLIDES.length;

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

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setTimeout(next, AUTO_PLAY_INTERVAL);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, current, next]);

  // Touch handlers
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
      ref={containerRef}
      className="relative w-full overflow-hidden select-none mb-8 md:mb-12"
      style={{ height: "clamp(280px, 56vw, 520px)" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      {DUMMY_SLIDES.map((slide, i) => {
        const isActive = i === current;
        return (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-gradient-to-br",
              slide.bgColor
            )}
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
            <div
              className="text-center px-6 max-w-xl mx-auto"
              style={{
                willChange: "transform, opacity",
                transform: isActive
                  ? "translate3d(0, 0, 0) scale(1)"
                  : "translate3d(0, 20px, 0) scale(0.97)",
                opacity: isActive ? 1 : 0,
                transition: `all ${TRANSITION_DURATION + 150}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
                transitionDelay: isActive ? "100ms" : "0ms",
              }}
            >
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-foreground mb-3 tracking-tight">
                {slide.title}
              </h2>
              <p className="text-sm md:text-base font-light text-muted-foreground mb-6 max-w-sm mx-auto">
                {slide.subtitle}
              </p>
              <button className="px-8 py-3 text-sm font-light tracking-widest uppercase border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-300">
                {slide.cta}
              </button>
            </div>
          </div>
        );
      })}

      {/* Bottom controls bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-3 pb-5 md:pb-7">
        {/* Left arrow */}
        <button
          onClick={prev}
          className="w-8 h-8 flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors duration-200"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2.5">
          {DUMMY_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="relative flex items-center justify-center p-1"
            >
              {/* Outer ring for active */}
              <span
                className={cn(
                  "block rounded-full transition-all duration-500 ease-out",
                  i === current
                    ? "w-3 h-3 bg-foreground scale-100"
                    : "w-2.5 h-2.5 border border-foreground/30 bg-transparent hover:border-foreground/60 scale-100"
                )}
                style={{
                  willChange: "transform",
                  transition:
                    "width 400ms cubic-bezier(0.34,1.56,0.64,1), height 400ms cubic-bezier(0.34,1.56,0.64,1), background-color 300ms ease, border-color 300ms ease, transform 400ms cubic-bezier(0.34,1.56,0.64,1)",
                  transform: i === current ? "scale(1)" : "scale(0.85)",
                }}
              />
            </button>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={next}
          className="w-8 h-8 flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors duration-200"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
        </button>

        {/* Play / Pause */}
        <button
          onClick={() => setIsPlaying((p) => !p)}
          className="ml-2 w-8 h-8 flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors duration-200"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <Play className="w-4 h-4" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground/5 z-10">
        <div
          className="h-full bg-foreground/20"
          style={{
            width: `${((current + 1) / total) * 100}%`,
            transition: `width ${TRANSITION_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
            willChange: "width",
          }}
        />
      </div>
    </section>
  );
};

export default HeroSlider;
