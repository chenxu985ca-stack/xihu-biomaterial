import { ChevronDown } from 'lucide-react';

/**
 * Individual product card — precision instrument catalog style.
 * Features: numbered index, highlight badge, expandable detail.
 */
export default function ProductCard({ product, isExpanded, onToggle, index }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-white transition-all duration-400 ${
        isExpanded
          ? 'border-sapphire-300 shadow-lg shadow-sapphire/5'
          : 'border-stone-200 hover:border-stone-300 hover:shadow-md'
      }`}
    >
      {/* Index number watermark */}
      <span className="absolute -right-2 -top-4 select-none font-mono text-7xl font-bold text-stone-100">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Content */}
      <div className="relative p-6">
        {/* Highlight badge */}
        {product.highlight && (
          <span className={`mb-3 inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
            product.highlight === '新一代' || product.highlight === '明星产品'
              ? 'border-sapphire-200 bg-sapphire-50 text-sapphire-600'
              : product.highlight === '经典款' || product.highlight === '临床首选'
                ? 'border-warm-bronze/30 bg-warm-bronze/5 text-warm-bronze'
                : 'border-stone-200 bg-stone-50 text-graphite-500'
          }`}>
            {product.highlight}
          </span>
        )}

        <h3 className="font-heading text-lg font-semibold text-graphite-900 tracking-precision">
          {product.name}
        </h3>

        <button
          onClick={onToggle}
          className="mt-3 flex items-center gap-1.5 text-xs font-medium text-graphite-400 transition-colors hover:text-sapphire-600"
        >
          查看详情
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
          <p className="text-sm leading-relaxed text-graphite-500">
            {product.desc}
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-graphite-400">
            <span className="h-px w-6 bg-stone-300" />
            产品详情请联系销售团队
          </div>
        </div>

        {/* Decorative corner line */}
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent transition-colors group-hover:via-sapphire-200" />
      </div>
    </div>
  );
}
