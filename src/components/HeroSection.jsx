import { ArrowRight, Award, ShieldCheck, Microscope, ChevronDown } from 'lucide-react';
import { useSiteSettings } from '../data/SiteSettingsContext';
import { scrollToSection } from '../utils';
import ImageCarousel from './ImageCarousel';

export default function HeroSection() {
  const { siteConfig } = useSiteSettings();
  return (
    <section
      id="home"
      className="relative flex flex-col overflow-hidden bg-white"
      style={{ minHeight: 'calc(100vh - 4rem)' }}
    >
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,82,204,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,82,204,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Radial glows */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-gradient-radial-sapphire opacity-[0.06]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[500px] w-[500px] rounded-full bg-gradient-radial-sapphire opacity-[0.04]" />

      <div className="section-container relative z-10 w-full flex-1 flex flex-col pt-24 pb-8 md:pt-32 md:pb-10">
        {/* Two-column grid — image bottom-aligned with CTAs */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14 items-end">
          {/* Left: Text */}
          <div className="flex flex-col">
            {/* SINCE badge */}
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 text-xs font-medium text-sapphire-600 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sapphire-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sapphire-500" />
                </span>
                SINCE {siteConfig.founded}
              </span>
              <span className="hidden text-xs font-medium tracking-technical text-graphite-400 sm:inline">
                {siteConfig.nameEN}
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-heading font-bold tracking-hero text-graphite-900">
              <span className="block text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.92]">
                西湖巴尔
              </span>
              <span className="mt-3 block text-[clamp(1.1rem,2.5vw,1.9rem)] font-semibold leading-tight tracking-wide text-graphite-800 sm:mt-4">
                {siteConfig.slogan}
              </span>
              <span className="mt-2 block bg-gradient-to-r from-sapphire-600 via-sapphire-500 to-warm-bronze bg-clip-text text-[clamp(0.9rem,2vw,1.3rem)] font-medium leading-relaxed text-transparent sm:mt-3">
                {siteConfig.tagline}
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-graphite-500 sm:text-base">
              {siteConfig.heroDesc}
            </p>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#products"
                onClick={(e) => { e.preventDefault(); scrollToSection('#products'); }}
                className="btn-primary text-sm group"
              >
                探索产品
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }}
                className="btn-outline text-sm"
              >
                商务合作
              </a>
            </div>
          </div>

          {/* Right: Image — centered vertically, larger (desktop) */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="w-full max-w-[540px]">
              <ImageCarousel images={siteConfig.heroImages} alt={siteConfig.brandName} />
            </div>
          </div>

          {/* Mobile hero image */}
          <div className="lg:hidden mt-8">
            <div className="w-full max-w-[400px] mx-auto">
              <ImageCarousel images={siteConfig.heroImages} alt={siteConfig.brandName} />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-10 flex flex-nowrap items-center justify-between gap-8 overflow-x-auto md:mt-14">
          {siteConfig.stats.map((stat) => (
            <div key={stat.label} className="flex flex-shrink-0 items-center gap-3">
              <span className="font-heading text-2xl font-bold text-graphite-900 sm:text-3xl tabular-nums">
                {stat.value}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-graphite-500 whitespace-nowrap">{stat.label}</p>
                {stat.suffix && (
                  <p className="mt-0.5 text-[10px] text-graphite-400">{stat.suffix}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certification bar — aligned with grid above */}
      <div className="relative z-10 border-t border-stone-100 bg-white/70 backdrop-blur-sm">
        <div className="section-container py-4">
          <div className="hidden lg:grid gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="lg:col-span-2 flex flex-wrap items-center justify-between gap-x-8 gap-y-2">
              {(siteConfig.achievements || []).slice(0, 4).map((text) => {
                const Icon = /GMP|研发|生产/.test(text) ? Microscope
                  : /ISO|质量|体系/.test(text) ? ShieldCheck
                  : Award;
                return (
                  <div key={text} className="flex items-center gap-1.5">
                    <Icon size={13} className="text-sapphire-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-graphite-600 whitespace-nowrap">{text}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Mobile: evenly spaced */}
          <div className="lg:hidden flex flex-wrap items-center justify-evenly gap-x-8 gap-y-2 text-center">
            {(siteConfig.achievements || []).slice(0, 4).map((text) => {
              const Icon = /GMP|研发|生产/.test(text) ? Microscope
                : /ISO|质量|体系/.test(text) ? ShieldCheck
                : Award;
              return (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon size={13} className="text-sapphire-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-graphite-600 whitespace-nowrap">{text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll-down indicator */}
      <div className="relative z-10 flex justify-center pb-3">
        <button
          onClick={(e) => { e.preventDefault(); scrollToSection('#products'); }}
          className="group flex flex-col items-center gap-2 text-graphite-400 transition-colors hover:text-sapphire-500"
          aria-label="向下滚动查看更多"
        >
          <span className="text-[10px] font-medium uppercase tracking-technical">探索产品线</span>
          <span className="relative flex h-8 w-5 items-start justify-center rounded-full border border-stone-300 group-hover:border-sapphire-300 transition-colors">
            <ChevronDown
              size={12}
              className="mt-1.5 text-stone-400 group-hover:text-sapphire-400 transition-colors animate-bounce"
            />
          </span>
        </button>
      </div>

      {/* Bottom gradient fade into next section */}
      <div className="pointer-events-none absolute bottom-0 h-16 w-full bg-gradient-to-t from-stone-50/80 to-transparent" />
    </section>
  );
}
