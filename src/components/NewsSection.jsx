import { Calendar, Tag, ArrowUpRight } from 'lucide-react';
import { newsItems } from '../data/siteContent';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';

const tagColors = {
  '展会': 'border-sapphire-200 text-sapphire-600 bg-sapphire-50',
  '新品': 'border-amber-200 text-amber-700 bg-amber-50',
  '荣誉': 'border-yellow-200 text-yellow-700 bg-yellow-50',
  '动态': 'border-stone-200 text-graphite-500 bg-stone-50',
};

export default function NewsSection() {
  return (
    <section id="news" className="section-padding bg-stone-50 relative overflow-hidden">
      {/* Subtle background dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,82,204,0.8) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="section-container relative z-10">
        <ScrollReveal>
          <SectionHeading
            heading="新闻动态"
            subtitle="了解西湖巴尔最新产品发布、展会活动与企业资讯"
          />
        </ScrollReveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 80}>
              <article className="group relative flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-400 hover:shadow-md hover:border-sapphire-200">
                {/* Tag badge */}
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                      tagColors[item.tag] || tagColors['动态']
                    }`}
                  >
                    <Tag size={10} />
                    {item.tag}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-graphite-400">
                    <Calendar size={11} />
                    {item.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading text-base font-semibold text-graphite-900 leading-snug tracking-precision transition-colors group-hover:text-sapphire-600">
                  {item.title}
                </h3>

                {/* Summary */}
                <p className="mt-3 text-sm leading-relaxed text-graphite-500 flex-1">
                  {item.summary}
                </p>

                {/* Read more link */}
                <div className="mt-5 flex items-center gap-1 text-xs font-medium text-graphite-400 transition-colors group-hover:text-sapphire-600">
                  阅读详情
                  <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                {/* Decorative corner */}
                <div className="absolute bottom-0 right-0 h-12 w-12 overflow-hidden opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute -bottom-4 -right-4 h-8 w-8 rotate-45 bg-sapphire-50" />
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        {/* More news indicator */}
        <ScrollReveal delay={500}>
          <div className="mt-12 text-center">
            <button className="btn-outline text-sm">
              查看更多新闻 <ArrowUpRight size={14} />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
