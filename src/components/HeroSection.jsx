import { ArrowRight, Award, ShieldCheck, Microscope } from 'lucide-react';
import { siteConfig } from '../data/siteContent';

export default function HeroSection() {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden bg-white">
      {/* Background layers */}
      {/* Subtle precision grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,82,204,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,82,204,0.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glow top-right — very subtle */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-gradient-radial-sapphire opacity-5" />

      {/* Geometric decorative element — right side */}
      <div className="pointer-events-none absolute right-0 top-1/3 hidden opacity-[0.06] lg:block" aria-hidden="true">
        <svg width="200" height="300" viewBox="0 0 200 300">
          <line x1="0" y1="0" x2="150" y2="0" stroke="#0052CC" strokeWidth="1" />
          <line x1="0" y1="0" x2="0" y2="300" stroke="#0052CC" strokeWidth="1" />
          <circle cx="50" cy="50" r="2" fill="#0052CC" />
          <circle cx="100" cy="50" r="1.5" fill="#A67C52" />
          <circle cx="50" cy="120" r="1.5" fill="#0052CC" opacity="0.5" />
          <circle cx="100" cy="200" r="2" fill="#A67C52" opacity="0.4" />
        </svg>
      </div>

      {/* Content */}
      <div className="section-container relative z-10 pt-24 pb-16 md:pt-32">
        <div className="max-w-4xl">
          {/* Tagline badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-sapphire-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-sapphire-500" />
            SINCE 1994 — {siteConfig.nameEN}
          </div>

          {/* Headline */}
          <h1 className="font-heading text-5xl font-bold tracking-hero text-graphite-900 sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="block leading-[1.05]">西湖巴尔</span>
            <span className="mt-2 block text-2xl font-semibold tracking-wide text-graphite-800 sm:text-3xl md:text-4xl">
              {siteConfig.slogan}
            </span>
            <span className="mt-3 block bg-gradient-to-r from-sapphire-600 via-sapphire-500 to-warm-bronze bg-clip-text text-xl font-medium text-transparent sm:text-2xl md:text-3xl">
              {siteConfig.tagline}
            </span>
          </h1>

          {/* Description */}
          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-graphite-500 sm:text-xl">
            {siteConfig.heroDesc}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#products" onClick={(e) => {
              e.preventDefault();
              document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
            }} className="btn-primary text-base">
              探索产品 <ArrowRight size={17} />
            </a>
            <a href="#contact" onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }} className="btn-outline text-base">
              商务合作
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {siteConfig.stats.map((stat) => (
              <div key={stat.label} className="border-l-2 border-sapphire-200 pl-5">
                <div className="font-heading text-3xl font-bold text-graphite-900 sm:text-4xl">
                  {stat.value}
                  <span className="ml-1 text-base font-normal text-sapphire-500">{stat.suffix ? '' : '+'}</span>
                </div>
                <p className="mt-1 text-xs font-medium text-graphite-500">{stat.label}</p>
                {stat.suffix && (
                  <p className="mt-0.5 text-[10px] text-graphite-400">{stat.suffix}</p>
                )}
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-14 flex flex-wrap gap-6">
            {[
              { icon: Award, text: siteConfig.achievements[1] },
              { icon: Microscope, text: 'ISO 13485 认证' },
              { icon: ShieldCheck, text: 'GMP 标准生产' },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2.5">
                <badge.icon size={16} className="text-sapphire-500/70" />
                <span className="text-xs text-graphite-500">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="pointer-events-none absolute bottom-0 h-24 w-full bg-gradient-to-t from-stone-50 to-transparent" />
    </section>
  );
}
