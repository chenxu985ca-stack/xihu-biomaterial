import { useState, useEffect } from 'react';
import { Calendar, Tag, ArrowUpRight, Loader2, AlertCircle, Newspaper, ChevronDown, X } from 'lucide-react';
import { getNews } from '../lib/db';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';

const tagColors = {
  '展会': 'border-sapphire-200 text-sapphire-600 bg-sapphire-50',
  '新品': 'border-amber-200 text-amber-700 bg-amber-50',
  '荣誉': 'border-yellow-200 text-yellow-700 bg-yellow-50',
  '动态': 'border-stone-200 text-graphite-500 bg-stone-50',
};

const INITIAL_DISPLAY = 8;

/** 新闻详情弹窗 */
function NewsModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm ring-1 ring-black/5 transition-colors hover:bg-stone-100"
        >
          <X size={16} className="text-graphite-500" />
        </button>

        {/* Image */}
        {item.image_url && (
          <div className="aspect-[16/9] overflow-hidden bg-white rounded-t-2xl">
            <img
              src={item.image_url}
              alt={item.title}
              className="h-full w-full object-contain p-4"
            />
          </div>
        )}

        <div className="p-8">
          {/* Tag + Date */}
          <div className="mb-4 flex items-center gap-3">
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
              {item.publish_date || ''}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-heading text-xl font-bold text-graphite-900 leading-snug tracking-precision">
            {item.title}
          </h2>

          {/* Summary */}
          <p className="mt-4 text-sm leading-relaxed text-graphite-600">
            {item.summary}
          </p>

          {/* Full content */}
          {item.content && (
            <div className="mt-6 pt-6 border-t border-stone-100">
              <p className="text-sm leading-relaxed text-graphite-700 whitespace-pre-line">
                {item.content}
              </p>
            </div>
          )}

          {/* Footer note */}
          <p className="mt-8 text-xs text-graphite-400">
            如需了解更多信息，请联系我们的销售团队
          </p>
        </div>
      </div>
    </div>
  );
}

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    getNews().then(({ data, error: err }) => {
      if (err) { setError(err); setLoading(false); return; }
      setNews(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <section id="news" className="section-padding bg-stone-50 relative overflow-hidden">
      {/* Top transition — from previous section */}
      <div className="pointer-events-none absolute top-0 h-24 w-full bg-gradient-to-b from-white/60 to-transparent" />

      {/* Bottom transition — to next section (white) */}
      <div className="pointer-events-none absolute bottom-0 h-24 w-full bg-gradient-to-t from-white via-white/40 to-transparent" />

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

        {/* Loading state */}
        {loading && (
          <div className="mt-20 flex justify-center">
            <Loader2 size={24} className="animate-spin text-graphite-300" />
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="mt-20 flex flex-col items-center gap-2 text-graphite-400">
            <AlertCircle size={28} />
            <p className="text-sm">新闻加载失败，请稍后再试</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && news.length === 0 && (
          <div className="mt-20 flex flex-col items-center gap-3 text-graphite-400">
            <Newspaper size={40} className="text-stone-300" />
            <p className="text-sm">暂无新闻动态</p>
          </div>
        )}

        {/* News grid */}
        {!loading && !error && news.length > 0 && (
          <>
            <div className="mt-16 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {(showAll ? news : news.slice(0, INITIAL_DISPLAY)).map((item, i) => (
                <ScrollReveal key={item.id} delay={i * 80}>
                  <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-stone-200/60 hover:border-stone-300 hover:-translate-y-0.5">
                    {/* Image */}
                    {item.image_url && (
                      <div className="relative aspect-[4/3] overflow-hidden bg-white">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          width="600"
                          height="450"
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-t-2xl" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5">
                      {/* Tag + Date */}
                      <div className="mb-2.5 flex items-center justify-between">
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
                          {item.publish_date || ''}
                        </span>
                      </div>

                      {/* Title — single line */}
                      <h3 className="font-heading text-[15px] font-semibold text-graphite-900 leading-snug tracking-precision line-clamp-1 transition-colors group-hover:text-sapphire-600">
                        {item.title}
                      </h3>

                      {/* Summary — two lines max */}
                      <p className="mt-2 text-[13px] leading-relaxed text-graphite-500 line-clamp-2">
                        {item.summary}
                      </p>

                      {/* Read more button */}
                      <button
                        onClick={() => setSelectedNews(item)}
                        className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-graphite-400 transition-colors hover:text-sapphire-600"
                      >
                        阅读详情
                        <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </button>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>

            {/* Show more / collapse */}
            {news.length > INITIAL_DISPLAY && (
              <ScrollReveal delay={500}>
                <div className="mt-12 text-center">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="btn-outline text-sm"
                  >
                    {showAll ? '收起' : `查看全部 ${news.length} 条新闻`}
                    <ChevronDown size={14} className={`ml-1 inline transition-transform ${showAll ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </ScrollReveal>
            )}
          </>
        )}

        {/* Detail modal */}
        <NewsModal item={selectedNews} onClose={() => setSelectedNews(null)} />
      </div>
    </section>
  );
}
