import { Microscope, Award, Globe } from 'lucide-react';
import { aboutContent, siteConfig } from '../data/siteContent';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';

const timelineIcons = {
  0: Microscope,
  3: Award,
  4: Globe,
};

export default function AboutSection() {
  return (
    <section id="about" className="section-padding bg-white relative overflow-hidden">
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-sapphire-200 bg-white">
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="2" width="14" height="14" rx="3" stroke="#0052CC" strokeWidth="2" fill="none" />
                  <path d="M7 7 L11 11 M11 7 L7 11" stroke="#A67C52" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[11px] font-medium uppercase tracking-technical text-graphite-400">品牌标识</p>
                <p className="font-heading text-xl font-bold text-graphite-900">
                  西湖巴尔 <span className="text-sm font-normal text-graphite-500">Westlake巴尔</span>
                </p>
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
                        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
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
              <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50/80 px-5 py-4 transition-colors hover:bg-white hover:shadow-sm">
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
