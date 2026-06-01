import { ChevronDown, ImageIcon } from 'lucide-react';
import { useState } from 'react';

/**
 * Product card — precision instrument catalog style with image.
 * Features: product image with hover zoom, highlight badge, expandable detail.
 */
export default function ProductCard({ product, isExpanded, onToggle, index }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-white transition-all duration-500 ${
        isExpanded
          ? 'border-sapphire-300 shadow-lg shadow-sapphire/5 scale-[1.02]'
          : 'border-stone-200 hover:border-stone-300 hover:shadow-xl hover:shadow-stone-200/50 hover:-translate-y-1'
      }`}
    >
      {/* === IMAGE AREA === */}
      <div className="relative h-48 overflow-hidden bg-stone-100 sm:h-52">
        {product.image && !imgError ? (
          <>
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient overlay at bottom for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/15 via-transparent to-transparent" />

            {/* Subtle border effect */}
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-t-2xl" />
          </>
        ) : (
          /* Fallback: gradient + icon when no image or load error */
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sapphire-50 via-white to-warm-bronze/5">
            <div className="flex flex-col items-center gap-2">
              <ImageIcon size={28} className="text-stone-300" />
              <span className="text-[10px] font-medium text-stone-300 tracking-technical uppercase">
                Product Image
              </span>
            </div>
          </div>
        )}

        {/* Index badge — top left */}
        <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm text-xs font-bold text-graphite-400 shadow-sm ring-1 ring-black/5 font-mono">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Highlight badge — top right */}
        {product.highlight && (
          <span
            className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur-sm ${
              product.highlight === '新一代' || product.highlight === '明星产品'
                ? 'border-sapphire-200 bg-sapphire-50/90 text-sapphire-600'
                : product.highlight === '经典款' || product.highlight === '临床首选'
                  ? 'border-warm-bronze/30 bg-warm-bronze/10 text-warm-bronze'
                  : 'border-stone-200 bg-white/90 text-graphite-500'
            }`}
          >
            {product.highlight}
          </span>
        )}
      </div>

      {/* === TEXT CONTENT === */}
      <div className="relative p-5 sm:p-6">
        {/* Name */}
        <h3 className="font-heading text-base font-semibold text-graphite-900 tracking-precision sm:text-lg">
          {product.name}
        </h3>

        {/* Expand toggle */}
        <button
          onClick={onToggle}
          className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-graphite-400 transition-colors hover:text-sapphire-600"
        >
          {isExpanded ? '收起详情' : '查看详情'}
          <ChevronDown
            size={13}
            className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Expandable description */}
        <div
          className={`overflow-hidden transition-all duration-400 ${
            isExpanded ? 'mt-4 max-h-48 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <p className="text-sm leading-relaxed text-graphite-500">{product.desc}</p>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-graphite-400">
            <span className="h-px w-6 bg-stone-300" />
            产品详情请联系销售团队
          </div>
        </div>

        {/* Bottom line decoration */}
        <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent transition-colors duration-300 group-hover:via-sapphire-200" />
      </div>
    </div>
  );
}
