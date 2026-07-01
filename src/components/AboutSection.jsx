import { Microscope, Award, Globe } from 'lucide-react';
import { useSiteSettings } from '../data/SiteSettingsContext';
import { BASE } from '../utils';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';

const timelineIcons = {
  0: Microscope,
  3: Award,
  4: Globe,
};

export default function AboutSection() {
  const { aboutContent, siteConfig } = useSiteSettings();
  return (
    <section id="about" className="section-padding bg-white relative overflow-hidden">
      {/* Top transition — from previous section */}
      <div className="pointer-events-none absolute top-0 h-24 w-full bg-gradient-to-b from-stone-50/60 to-transparent" />

      {/* Bottom transition — to next section (stone-50) */}
      <div className="pointer-events-none absolute bottom-0 h-24 w-full bg-gradient-to-t from-stone-50 via-stone-50/40 to-transparent" />

      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 top-1/2 -translate-y-1/2 opacity-[0.03] hidden lg:block" aria-hidden="true">
        <svg width="500" height="600" viewBox="0 0 500 600">
          <rect x="0" y="0" width="500" height="600" fill="none" stroke="#0052CC" strokeWidth="1" strokeDasharray="4 8" />
          <rect x="40" y="40" width="420" height="520" fill="none" stroke="#A67C52" strokeWidth="0.5" />
          <circle cx="250" cy="300" r="180" stroke="#0052CC" strokeWidth="0.5" fill="none" opacity="0.5" />
        </svg>
      </div>

      <div className="section-container relative z-10">
        <ScrollReveal>
          <SectionHeading heading={aboutContent.heading} subtitle={aboutContent.subtitle} />
        </ScrollReveal>

        {/* Brand highlight — 西湖巴尔 */}
        <ScrollReveal delay={80}>
          <div className="mx-auto mt-12 max-w-2xl text-center">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-sapphire-100 bg-sapphire-50/60 px-6 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-sapphire-200 bg-white overflow-hidden">
                <img src={`${BASE}logo.png`} alt="西湖巴尔" className="h-full w-full object-contain p-0.5" />
              </div>
              <div>
                <p className="font-heading text-xl font-bold text-graphite-900">西湖巴尔</p>
                <p className="text-xs text-graphite-400">Westlake Biom</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Mission statement */}
        <ScrollReveal delay={100}>
          <div className="mx-auto mt-14 max-w-3xl">
            <div className="relative rounded-2xl border border-stone-200 bg-stone-50/80 p-8 md:p-10">
              {/* Quote mark */}
              <span className="absolute -left-2 -top-4 select-none font-heading text-7xl text-sapphire/15">"</span>
              <p className="relative text-lg leading-relaxed text-graphite-600 sm:text-xl">
                {aboutContent.mission}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Timeline */}
        <div className="mt-24">
          <div className="relative mx-auto max-w-4xl">
            {/* Timeline center line */}
            <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-sapphire/30 via-stone-300 to-transparent md:left-1/2 md:-translate-x-px" />

            <div className="space-y-12">
              {aboutContent.history.map((item, i) => {
                const Icon = timelineIcons[i] || null;
                return (
                  <ScrollReveal key={item.year} delay={i * 100}>
                    <div className={`relative flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      {/* Timeline dot */}
                      <div className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-sapphire-300 bg-white md:absolute md:left-1/2 md:-translate-x-1/2">
                        <div className={`h-2 w-2 rounded-full ${i === 4 ? 'bg-sapphire-500 shadow-sm' : 'bg-sapphire-400/70'}`} />
                      </div>

                      {/* Content card */}
                      <div className={`flex-1 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:pr-10 md:text-right' : 'md:pl-10'}`}>
                        <div className="rounded-xl border border-stone-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-stone-200/60">
                          <div className={`flex items-center gap-3 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                            <span className="font-mono text-xl font-bold text-sapphire-600">{item.year}</span>
                            <h3 className="font-heading text-base font-semibold text-graphite-900">{item.title}</h3>
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-graphite-500">{item.desc}</p>
                          {Icon && (
                            <div className={`mt-3 flex ${i % 2 === 0 ? 'md:justify-end' : ''}`}>
                              <Icon size={16} className="text-sapphire-400/50" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>

        {/* Vision */}
        <ScrollReveal delay={500}>
          <div className="mx-auto mt-20 max-w-2xl text-center">
            <div className="precision-line mx-auto mb-4" />
            <p className="font-heading text-lg text-graphite-500 italic">{aboutContent.vision}</p>
          </div>
        </ScrollReveal>

        {/* Achievements grid */}
        <div className="mx-auto mt-16 grid max-w-3xl gap-4 sm:grid-cols-2">
          {siteConfig.achievements.map((item, i) => (
            <ScrollReveal key={item} delay={550 + i * 80}>
              <div className="flex items-center gap-3 rounded-lg border border-stone-200/80 bg-stone-50/80 px-5 py-4 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md">
                <Award size={16} className="flex-shrink-0 text-sapphire-500/70" />
                <span className="text-sm text-graphite-600">{item}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
