import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, ImageIcon, Pause } from 'lucide-react';

/**
 * 首页图片展示轮播
 *
 * 工业精密感设计：圆角展示板 + 细线边框 + 指示点
 * 自动轮播 5s，手动暂停，支持箭头/圆点导航，淡入淡出切换
 * 无图片时显示品牌占位板
 */
export default function ImageCarousel({ images = [], alt = '西湖巴尔' }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef(null);

  const count = images?.length || 0;

  const goTo = useCallback((index) => {
    if (index === current || transitioning) return;
    setTransitioning(true);
    setCurrent(index);
    // 等淡入动画结束
    setTimeout(() => setTransitioning(false), 500);
  }, [current, transitioning]);

  const next = useCallback(() => {
    if (count <= 1) return;
    goTo((current + 1) % count);
  }, [current, count, goTo]);

  const prev = useCallback(() => {
    if (count <= 1) return;
    goTo((current - 1 + count) % count);
  }, [current, count, goTo]);

  // 自动轮播
  useEffect(() => {
    if (paused || count <= 1) return;
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [paused, count, next]);

  // 无图片 → 占位板
  if (count === 0) {
    return (
      <div className="w-full">
        <div className="relative w-full aspect-[3/2] rounded-2xl border border-stone-200 bg-stone-50/80 overflow-hidden">
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,82,204,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,82,204,0.8) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            {/* Precision rings hint — simplified */}
            <div className="relative h-32 w-32">
              <div className="absolute inset-0 rounded-full border border-sapphire/[0.08]" />
              <div className="absolute inset-[18%] rounded-full border border-sapphire/[0.1]" />
              <div className="absolute inset-[36%] rounded-full border border-sapphire/[0.12]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon size={28} className="text-sapphire/20" />
              </div>
            </div>
            <p className="text-xs font-medium text-graphite-400">品牌展示区</p>
            <p className="text-[11px] text-graphite-300 -mt-2">在后台-网站设置中上传图片</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative w-full group">
        {/* Main display board */}
        <div
          className="relative aspect-[3/2] rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Images with fade transition */}
          {images.map((url, i) => (
            <img
              key={url}
              src={url}
              alt={`${alt} - ${i + 1}`}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
              style={{ opacity: i === current ? 1 : 0 }}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          ))}

          {/* Bottom gradient overlay for dots readability */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/15 to-transparent" />

          {/* Navigation arrows — appear on hover */}
          {count > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm border border-stone-200 flex items-center justify-center text-graphite-600 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:shadow-md hover:-translate-x-0.5"
                aria-label="上一张"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm border border-stone-200 flex items-center justify-center text-graphite-600 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:shadow-md hover:translate-x-0.5"
                aria-label="下一张"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* Pause/play indicator */}
          {paused && count > 1 && (
            <div className="absolute top-3 right-3 h-7 w-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
              <Pause size={11} className="text-white" />
            </div>
          )}
        </div>

        {/* Navigation dots */}
        {count > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'h-2 w-6 bg-sapphire'
                    : 'h-2 w-2 bg-stone-300 hover:bg-stone-400'
                }`}
                aria-label={`第 ${i + 1} 张图片`}
              />
            ))}
          </div>
        )}

        {/* Image counter */}
        {count > 1 && (
          <p className="mt-2 text-center text-[10px] text-graphite-400 font-mono tracking-technical">
            {current + 1} / {count}
          </p>
        )}
      </div>
    </div>
  );
}
