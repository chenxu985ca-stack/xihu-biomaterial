import { ImageIcon, ArrowUpRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

/**
 * Product card — precision instrument catalog style with image.
 * Clicking opens a detail modal (handled by parent via onSelect).
 */
export default function ProductCard({ product, onSelect, index }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setImgLoaded(true);
    }
  }, []);

  const showImage = product.image && !imgError;

  return (
    <div
      onClick={() => onSelect?.(product)}
      className="group relative overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition-all duration-500 hover:shadow-lg hover:shadow-stone-200/60 hover:border-stone-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* === IMAGE AREA === */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        {showImage && !imgLoaded && (
          <div className="absolute inset-0 animate-shimmer" />
        )}

        {showImage ? (
          <>
            <img
              ref={imgRef}
              src={product.image}
              alt={product.name}
              width="600"
              height="450"
              loading="lazy"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              onError={() => { setImgError(true); setImgLoaded(true); }}
              className={`h-full w-full object-contain p-2 transition-all duration-700 group-hover:scale-105 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-t-2xl" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sapphire-50 via-white to-warm-bronze/5">
            <div className="flex flex-col items-center gap-2">
              <ImageIcon size={28} className="text-stone-300" />
              <span className="text-[10px] font-medium text-stone-300 tracking-technical uppercase">
                Product Image
              </span>
            </div>
          </div>
        )}

        {/* Index badge */}
        <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm text-xs font-bold text-graphite-400 shadow-sm ring-1 ring-black/5 font-mono">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Highlight badge */}
        {product.highlight && (
          <span
            className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-sm ${
              product.highlight === '新一代' || product.highlight === '明星产品'
                ? 'border-sapphire-200 bg-sapphire-50/90 text-sapphire-600'
                : product.highlight === '经典款' || product.highlight === '临床首选'
                  ? 'border-warm-bronze/30 bg-warm-bronze/10 text-warm-bronze'
                  : product.highlight === '自研'
                    ? 'border-emerald-200 bg-emerald-50/90 text-emerald-600'
                    : product.highlight === '产学研'
                      ? 'border-purple-200 bg-purple-50/90 text-purple-500'
                    : 'border-stone-200 bg-white/90 text-graphite-500'
            }`}
          >
            {product.highlight}
          </span>
        )}
      </div>

      {/* === TEXT CONTENT === */}
      <div className="relative p-5 sm:p-6">
        <h3 className="font-heading text-base font-semibold text-graphite-900 tracking-precision sm:text-lg">
          {product.name}
        </h3>

        {/* View detail button */}
        <button
          onClick={(e) => { e.stopPropagation(); onSelect?.(product); }}
          className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-graphite-400 transition-colors hover:text-sapphire-600"
        >
          查看详情
          <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>

        <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent transition-colors duration-300 group-hover:via-sapphire-200" />
      </div>
    </div>
  );
}
