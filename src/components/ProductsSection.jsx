import { useState, useEffect } from 'react';
import { Package, FlaskConical, Target, Wrench, Box, Circle, Loader2, AlertCircle, X, ImageIcon } from 'lucide-react';
import { getCategories, getProductsByCategory } from '../lib/db';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';
import ProductCard from './ProductCard';

const categoryIcons = {
  Circle,
  Droplets: FlaskConical,
  Target,
  Wrench,
  Package: Box,
};

/** 产品详情弹窗 — 精密工业设计风格 */
function ProductModal({ product, onClose }) {
  if (!product) return null;

  const mainDesc = product.desc || '';
  const content = product.content || '';
  const hasDetails = mainDesc || content;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm ring-1 ring-black/5 transition-all hover:bg-stone-100 hover:scale-110"
        >
          <X size={16} className="text-graphite-500" />
        </button>

        {/* === Image section === */}
        <div className="relative bg-gradient-to-br from-stone-50 via-white to-sapphire-50/30 rounded-t-3xl border-b border-stone-100">
          {product.image ? (
            <div className="aspect-[16/9] overflow-hidden flex items-center justify-center p-8">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain drop-shadow-lg"
              />
            </div>
          ) : (
            <div className="aspect-[16/9] flex flex-col items-center justify-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100">
                <ImageIcon size={28} className="text-stone-300" />
              </div>
              <span className="text-xs text-stone-400 tracking-technical uppercase">Product Image</span>
            </div>
          )}

          {/* Highlight badge on image */}
          {product.highlight && (
            <span className="absolute left-6 bottom-4 inline-flex items-center rounded-full border border-white/50 bg-white/80 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold text-sapphire-600 shadow-sm">
              {product.highlight}
            </span>
          )}
        </div>

        {/* === Info section === */}
        <div className="p-8 sm:p-10">
          {/* Product name */}
          <h2 className="font-heading text-2xl font-bold text-graphite-900 leading-tight tracking-precision">
            {product.name}
          </h2>

          {/* Description + Content */}
          {hasDetails ? (
            <div className="mt-6 space-y-6">
              {/* 产品描述 */}
              {mainDesc && (
                <div>
                  <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-technical text-graphite-400">产品描述</h4>
                  <p className="text-sm leading-relaxed text-graphite-600">
                    {mainDesc}
                  </p>
                </div>
              )}

              {/* 产品内容 */}
              {content && (
                <div>
                  <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-technical text-graphite-400">产品内容</h4>
                  {content.includes('：') || content.includes(':') ? (
                    /* Render as key-value parameter table */
                    <div className="rounded-xl border border-stone-100 bg-stone-50/50 overflow-hidden">
                      {content.split('\n').filter(Boolean).map((line, j) => {
                        const parts = line.split(/[：:]/);
                        const key = parts[0]?.trim();
                        const value = parts.slice(1).join(':').trim();
                        if (!value) {
                          return (
                            <p key={j} className="px-5 py-2.5 text-sm text-graphite-600 border-b border-stone-100 last:border-0">
                              {line}
                            </p>
                          );
                        }
                        return (
                          <div key={j} className="flex border-b border-stone-100 last:border-0">
                            <span className="w-32 flex-shrink-0 px-5 py-3 text-xs font-medium text-graphite-400 bg-stone-100/50 tracking-technical">
                              {key}
                            </span>
                            <span className="flex-1 px-5 py-3 text-sm text-graphite-700">
                              {value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed text-graphite-600 whitespace-pre-wrap">{content}</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-graphite-400">产品详情正在整理中，敬请期待</p>
          )}

          {/* Contact CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl border border-sapphire-100 bg-gradient-to-r from-sapphire-50 to-white p-5">
            <div className="flex-1">
              <p className="text-sm font-semibold text-graphite-800">对该产品感兴趣？</p>
              <p className="mt-0.5 text-xs text-graphite-500">联系销售团队获取报价与样品</p>
            </div>
            <a
              href="#contact"
              onClick={() => { onClose(); }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sapphire-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-sapphire-700 transition-colors shadow-sm whitespace-nowrap"
            >
              立即咨询
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsSection() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCatId, setActiveCatId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCategories().then(({ data, error: err }) => {
      if (err) { setError(err); setLoading(false); return; }
      setCategories(data || []);
      if (data?.length > 0) setActiveCatId(data[0].id);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!activeCatId) return;
    getProductsByCategory(activeCatId).then(({ data, error: err }) => {
      if (err) { setError(err); return; }
      setProducts(data || []);
    });
  }, [activeCatId]);

  const activeCat = categories.find((c) => c.id === activeCatId);

  return (
    <section id="products" className="section-padding bg-stone-50 relative overflow-hidden">
      {/* Top transition */}
      <div className="pointer-events-none absolute top-0 h-24 w-full bg-gradient-to-b from-white/60 to-transparent" />

      {/* Subtle background texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,82,204,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,82,204,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Bottom transition */}
      <div className="pointer-events-none absolute bottom-0 h-24 w-full bg-gradient-to-t from-white via-white/40 to-transparent" />

      <div className="section-container relative z-10">
        <ScrollReveal>
          <SectionHeading
            heading="产品中心"
            subtitle="全品类产品线，从基础到高端，覆盖正畸全流程"
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
            <p className="text-sm">产品数据加载失败，请稍后再试</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && categories.length === 0 && (
          <div className="mt-20 py-16 text-center text-graphite-400">
            <Package size={40} className="mx-auto text-stone-300" />
            <p className="mt-4 text-sm">产品信息正在整理中，敬请期待</p>
          </div>
        )}

        {/* Main content: sidebar + product area */}
        {!loading && !error && categories.length > 0 && (
          <div className="mt-14 lg:flex lg:gap-10">
            {/* === DESKTOP SIDEBAR === */}
            <ScrollReveal delay={100}>
              <nav className="hidden lg:block w-56 flex-shrink-0">
                <div className="sticky top-24">
                  <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-technical text-graphite-400">
                    产品分类
                  </p>
                  <div className="space-y-0.5">
                    {categories.map((cat) => {
                      const Icon = categoryIcons[cat.icon] || Package;
                      const isActive = activeCatId === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCatId(cat.id)}
                          className={`w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm font-medium transition-all duration-200 relative ${
                            isActive
                              ? 'bg-white border border-stone-200/80 text-sapphire-600 shadow-sm shadow-stone-200/50'
                              : 'text-graphite-500 hover:text-graphite-700 hover:bg-white/50 border border-transparent'
                          }`}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-sapphire-500" />
                          )}
                          <Icon size={15} className={isActive ? 'text-sapphire-500' : 'text-stone-400'} />
                          <span className="flex-1 truncate tracking-precision">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </nav>
            </ScrollReveal>

            {/* === MOBILE CATEGORY BAR === */}
            <div className="lg:hidden mb-8 -mx-4 px-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              <div className="flex gap-2 min-w-max">
                {categories.map((cat) => {
                  const isActive = activeCatId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCatId(cat.id)}
                      className={`flex-shrink-0 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium tracking-precision transition-all duration-300 ${
                        isActive
                          ? 'border-sapphire-400 bg-sapphire-50 text-sapphire-600 shadow-sm'
                          : 'border-stone-200 bg-white text-graphite-500 hover:border-stone-300 hover:text-graphite-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* === PRODUCT AREA === */}
            <div className="flex-1 min-w-0">
              {activeCat && (
                <div className="mb-8 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-300 to-transparent" />
                  <p className="text-sm text-graphite-500 whitespace-nowrap">{activeCat.description}</p>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-300 to-transparent" />
                </div>
              )}

              {products.length === 0 && (
                <div className="py-16 text-center text-graphite-400">
                  <Package size={36} className="mx-auto text-stone-300" />
                  <p className="mt-3 text-sm">该分类暂无产品</p>
                </div>
              )}

              {products.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                  {products.map((product, i) => (
                    <ScrollReveal key={product.id} delay={100 + i * 60}>
                      <ProductCard
                        product={{
                          name: product.name,
                          desc: product.description || '',
                          content: product.content || '',
                          highlight: product.highlight || '',
                          image: product.image_url || '',
                        }}
                        onSelect={setSelectedProduct}
                        index={i}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product detail modal */}
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      </div>
    </section>
  );
}
