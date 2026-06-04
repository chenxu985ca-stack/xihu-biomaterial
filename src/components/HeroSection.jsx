import { ArrowRight, Award, ShieldCheck, Microscope, ChevronDown } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { siteConfig } from '../data/siteContent';
import { scrollToSection } from '../utils';

/** Animated counter that counts from 0 to target when scrolled into view */
function AnimatedStat({ value, label, suffix, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const numericVal = parseInt(value, 10);

  // IntersectionObserver to trigger visibility
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  // Count-up animation
  useEffect(() => {
    if (!visible) return;
    const duration = 1500;
    const startTime = performance.now();
    let raf;
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numericVal));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [visible, numericVal]);

  return (
    <div
      ref={ref}
      className={`border-l-2 border-sapphire-200 pl-5 transition-all duration-700 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      <div className="font-heading text-3xl font-bold text-graphite-900 sm:text-4xl">
        <span className="tabular-nums">{count}</span>
        <span className="ml-0.5 text-lg font-normal text-sapphire-500 align-super">+</span>
      </div>
      <p className="mt-1 text-xs font-medium text-graphite-500">{label}</p>
      {suffix && <p className="mt-0.5 text-[10px] text-graphite-400">{suffix}</p>}
    </div>
  );
}

/** Hook: track scroll position for parallax */
function useScrollOffset() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let raf;
    const onScroll = () => {
      raf = requestAnimationFrame(() => setOffset(window.scrollY));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return offset;
}

export default function HeroSection() {
  const scrollY = useScrollOffset();
  // Parallax factors: background layers move slower than scroll
  const gridY = scrollY * 0.03;
  const glowY = scrollY * 0.06;
  const archY = scrollY * 0.12;

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden bg-white">
      {/* === LAYER 1: Precision engineering grid (parallax) === */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,82,204,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,82,204,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          transform: `translateY(${gridY}px)`,
        }}
      />

      {/* === LAYER 2: Major radial glows (parallax) === */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-gradient-radial-sapphire opacity-[0.06]"
        style={{ transform: `translateY(${glowY}px)` }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-0 h-[400px] w-[400px] rounded-full bg-gradient-radial-sapphire opacity-[0.04]"
        style={{ transform: `translateY(${-glowY * 0.7}px)` }}
      />

      {/* === LAYER 3: Subtle diagonal accent line (top-right) === */}
      <div
        className="pointer-events-none absolute right-0 top-0 hidden h-64 w-64 lg:block"
        aria-hidden="true"
      >
        <svg viewBox="0 0 256 256" className="h-full w-full opacity-[0.06]">
          <path d="M256 0 L0 256" stroke="#0052CC" strokeWidth="1" fill="none" />
          <path d="M256 64 L64 256" stroke="#0052CC" strokeWidth="0.5" fill="none" />
          <path d="M256 128 L128 256" stroke="#0052CC" strokeWidth="0.5" fill="none" />
          <path d="M256 192 L192 256" stroke="#0052CC" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      {/* === LAYER 4: Abstract dental arch illustration (parallax, desktop only) === */}
      <div
        className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block"
        aria-hidden="true"
        style={{ transform: `translateY(calc(-50% + ${archY}px))` }}
      >
        <svg
          width="520"
          height="600"
          viewBox="0 0 520 600"
          fill="none"
          className="opacity-[0.07]"
        >
          {/* Dental arch — stylized upper arch curve */}
          <ellipse cx="260" cy="280" rx="220" ry="200" stroke="#0052CC" strokeWidth="1.2" />
          <ellipse cx="260" cy="280" rx="200" ry="180" stroke="#0052CC" strokeWidth="0.7" />
          <ellipse cx="260" cy="280" rx="180" ry="160" stroke="#0052CC" strokeWidth="0.5" />

          {/* Tooth positions along the arch — bracket-like markers */}
          {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const rx = 210;
            const ry = 190;
            const cx = 260;
            const cy = 280;
            const x = cx + rx * Math.cos(rad - Math.PI);
            const y = cy + ry * Math.sin(rad - Math.PI);
            return (
              <g key={angle}>
                <rect
                  x={x - 4}
                  y={y - 3}
                  width="8"
                  height="6"
                  rx="1.5"
                  fill={angle === 90 ? '#A67C52' : '#0052CC'}
                  opacity={angle === 90 ? 0.6 : 0.3}
                />
                {angle % 30 === 0 && (
                  <circle cx={x} cy={y + 10} r="1.5" fill="#0052CC" opacity="0.25" />
                )}
              </g>
            );
          })}

          {/* Calibration marks along the bottom */}
          {[60, 120, 180, 240, 300, 360, 420, 460].map((x) => (
            <g key={`cal-${x}`}>
              <line x1={x} y1="520" x2={x} y2="530" stroke="#0052CC" strokeWidth="0.8" opacity="0.3" />
              {x % 120 === 0 && (
                <text x={x} y="545" textAnchor="middle" fill="#0052CC" opacity="0.4" fontSize="8" fontFamily="JetBrains Mono, monospace">
                  {x / 10}
                </text>
              )}
            </g>
          ))}
          <line x1="40" y1="520" x2="480" y2="520" stroke="#0052CC" strokeWidth="0.5" opacity="0.2" />

          {/* Floating dot: confidence */}
          <circle cx="420" cy="140" r="2" fill="#0052CC" opacity="0.35">
            <animate attributeName="opacity" values="0.35;0.15;0.35" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="380" cy="110" r="1.2" fill="#A67C52" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* === LAYER 5: Floating particles — multi-size, multi-speed === */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Large slow dots */}
        <div className="absolute left-[8%] top-[25%] h-2 w-2 rounded-full bg-sapphire-400/15 animate-float" />
        <div className="absolute left-[88%] top-[18%] h-2.5 w-2.5 rounded-full bg-warm-bronze/12 animate-float-delayed" />
        <div className="absolute left-[75%] top-[80%] h-2 w-2 rounded-full bg-sapphire-400/12 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute left-[18%] top-[72%] h-1.5 w-1.5 rounded-full bg-warm-copper/15 animate-float-delayed" />
        {/* Medium dots */}
        <div className="absolute left-[30%] top-[12%] h-1.5 w-1.5 rounded-full bg-sapphire-300/20 animate-float" style={{ animationDelay: '0.5s', animationDuration: '4s' }} />
        <div className="absolute left-[60%] top-[85%] h-1.5 w-1.5 rounded-full bg-warm-bronze/15 animate-float-delayed" style={{ animationDuration: '5s' }} />
        <div className="absolute left-[45%] top-[92%] h-1 w-1 rounded-full bg-sapphire-300/18 animate-float" style={{ animationDelay: '2s', animationDuration: '4.5s' }} />
        <div className="absolute left-[92%] top-[55%] h-1.5 w-1.5 rounded-full bg-warm-copper/12 animate-float-delayed" style={{ animationDelay: '1.8s' }} />
        {/* Small fast dots */}
        <div className="absolute left-[22%] top-[45%] h-1 w-1 rounded-full bg-sapphire-400/18 animate-float" style={{ animationDelay: '0.3s', animationDuration: '3.5s' }} />
        <div className="absolute left-[78%] top-[35%] h-1 w-1 rounded-full bg-sapphire-300/15 animate-float" style={{ animationDelay: '1.3s', animationDuration: '3s' }} />
        <div className="absolute left-[55%] top-[15%] h-1 w-1 rounded-full bg-warm-bronze/12 animate-float-delayed" style={{ animationDuration: '4s' }} />
        <div className="absolute left-[38%] top-[65%] h-1 w-1 rounded-full bg-sapphire-400/14 animate-float" style={{ animationDelay: '2.5s', animationDuration: '3.8s' }} />
        {/* Tiny sparkles */}
        <div className="absolute left-[12%] top-[58%] h-0.5 w-0.5 rounded-full bg-sapphire-400/30 animate-float" style={{ animationDelay: '0.7s', animationDuration: '2.5s' }} />
        <div className="absolute left-[82%] top-[68%] h-0.5 w-0.5 rounded-full bg-warm-copper/25 animate-float-delayed" style={{ animationDuration: '3s' }} />
        <div className="absolute left-[50%] top-[48%] h-0.5 w-0.5 rounded-full bg-sapphire-400/25 animate-float" style={{ animationDelay: '1.8s', animationDuration: '2.8s' }} />
      </div>

      {/* === MAIN CONTENT === */}
      <div className="section-container relative z-10 pt-24 pb-16 md:pt-32">
        <div className="max-w-4xl">
          {/* SINCE badge */}
          <div className="mb-8 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-xs font-medium text-sapphire-600 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sapphire-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sapphire-500" />
              </span>
              SINCE 1994
            </span>
            <span className="hidden text-xs font-medium tracking-technical text-graphite-400 sm:inline">
              {siteConfig.nameEN}
            </span>
          </div>

          {/* HEADLINE — dominant typography */}
          <h1 className="font-heading font-bold tracking-hero text-graphite-900">
            {/* Brand name — massive */}
            <span className="block text-[clamp(3rem,8vw,7rem)] leading-[0.9]">
              西湖巴尔
            </span>

            {/* Slogan */}
            <span className="mt-3 block text-[clamp(1.3rem,3vw,2.2rem)] font-semibold leading-tight tracking-wide text-graphite-800 sm:mt-4">
              {siteConfig.slogan}
            </span>

            {/* Tagline — gradient accent */}
            <span className="mt-2 block bg-gradient-to-r from-sapphire-600 via-sapphire-500 to-warm-bronze bg-clip-text text-[clamp(1rem,2.5vw,1.6rem)] font-medium leading-relaxed text-transparent sm:mt-3">
              {siteConfig.tagline}
            </span>
          </h1>

          {/* Description */}
          <p className="mt-8 max-w-xl text-base leading-relaxed text-graphite-500 sm:mt-10 sm:text-lg">
            {siteConfig.heroDesc}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap gap-3.5">
            <a
              href="#products"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#products');
              }}
              className="btn-primary text-base group"
            >
              探索产品
              <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#contact');
              }}
              className="btn-outline text-base"
            >
              商务合作
            </a>
          </div>

          {/* Stats row — animated */}
          <div className="mt-16 grid grid-cols-2 gap-6 sm:mt-20 sm:grid-cols-4">
            {siteConfig.stats.map((stat, i) => (
              <AnimatedStat
                key={stat.label}
                value={stat.value}
                label={stat.label}
                suffix={stat.suffix}
                delay={i * 120}
              />
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 sm:mt-14">
            {[
              { icon: Award, text: siteConfig.achievements[1] },
              { icon: Microscope, text: 'ISO 13485 认证' },
              { icon: ShieldCheck, text: 'GMP 标准生产' },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2.5">
                <badge.icon size={16} className="text-sapphire-500/60" />
                <span className="text-xs font-medium text-graphite-500">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === BOTTOM: Scroll indicator === */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block">
        <button
          onClick={() => scrollToSection('#products')}
          className="flex flex-col items-center gap-2 text-graphite-300 transition-colors hover:text-sapphire-500"
          aria-label="向下滚动"
        >
          <span className="text-[10px] font-medium tracking-technical uppercase">Scroll</span>
          <ChevronDown size={16} className="animate-bounce" />
        </button>
      </div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute bottom-0 h-32 w-full bg-gradient-to-t from-stone-50 via-stone-50/40 to-transparent" />
    </section>
  );
}
