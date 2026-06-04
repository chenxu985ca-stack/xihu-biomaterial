import { useRef, useEffect, useState } from 'react';

/**
 * Consistent section heading with precision aesthetic.
 * Features: animated calibration mark line that draws in on scroll + heading + optional subtitle.
 */
export default function SectionHeading({ heading, subtitle }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="mx-auto max-w-2xl">
      {/* Calibration mark — draws in when visible */}
      <div className="mb-6 flex items-center gap-4">
        <div className="h-px w-10 overflow-hidden">
          <div
            className="h-full bg-sapphire/50 transition-all duration-700 ease-out"
            style={{ width: visible ? '100%' : '0' }}
          />
        </div>
        <div
          className={`h-1 w-1 rounded-full bg-sapphire transition-all duration-500 ${
            visible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
          style={{ transitionDelay: '0.3s' }}
        />
        <div className="h-px w-0.5 overflow-hidden">
          <div
            className="h-full bg-sapphire/30 transition-all duration-500 ease-out"
            style={{ width: visible ? '100%' : '0', transitionDelay: '0.5s' }}
          />
        </div>
      </div>

      <h2 className="font-heading text-3xl font-bold tracking-precision text-graphite-900 sm:text-4xl lg:text-5xl">
        {heading}
      </h2>

      {subtitle && (
        <p className="mt-5 max-w-xl text-base leading-relaxed text-graphite-500 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
