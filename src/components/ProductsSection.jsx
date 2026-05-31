import { useState } from 'react';
import { Package, FlaskConical, Target, Wrench, Box } from 'lucide-react';
import { productCategories } from '../data/siteContent';
import SectionHeading from './SectionHeading';
import ScrollReveal from './ScrollReveal';
import ProductCard from './ProductCard';

const categoryIcons = {
  Circle: Package,
  Droplets: FlaskConical,
  Target: Target,
  Wrench: Wrench,
  Package: Box,
};

export default function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState(productCategories[0].id);
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (catId, productName) => {
    const key = `${catId}-${productName}`;
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section id="products" className="section-padding bg-stone-50 relative overflow-hidden">
      {/* Subtle background texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,82,204,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,82,204,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="section-container relative z-10">
        <ScrollReveal>
          <SectionHeading
            heading="产品中心"
            subtitle="五大产品线，覆盖正畸全流程 — 从诊断到治疗，从基础到高端"
          />
        </ScrollReveal>

        {/* Category tabs */}
        <ScrollReveal delay={100}>
          <div className="mt-14 flex flex-wrap gap-2 justify-center">
            {productCategories.map((cat) => {
              const Icon = categoryIcons[cat.icon] || Package;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-medium tracking-precision transition-all duration-300 ${
                    activeCategory === cat.id
                      ? 'border-sapphire-400 bg-sapphire-50 text-sapphire-600 shadow-sm'
                      : 'border-stone-200 bg-white text-graphite-500 hover:border-stone-300 hover:text-graphite-700'
                  }`}
                >
                  <Icon size={15} />
                  {cat.name}
                  <span className="text-[10px] text-graphite-400 font-mono">{cat.nameEN.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Active category detail */}
        {productCategories.map((cat) => (
          <div
            key={cat.id}
            className={`mt-14 transition-all duration-500 ${
              activeCategory === cat.id ? 'block' : 'hidden'
            }`}
          >
            <ScrollReveal delay={150}>
              <div className="mb-10 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-300 to-transparent" />
                <p className="text-sm text-graphite-500">{cat.desc}</p>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-300 to-transparent" />
              </div>
            </ScrollReveal>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cat.products.map((product, i) => {
                const key = `${cat.id}-${product.name}`;
                return (
                  <ScrollReveal key={product.name} delay={200 + i * 80}>
                    <ProductCard
                      product={product}
                      isExpanded={!!expanded[key]}
                      onToggle={() => toggleExpand(cat.id, product.name)}
                      index={i}
                    />
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
