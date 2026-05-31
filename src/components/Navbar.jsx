import { useState, useEffect } from 'react';
import { Menu, Phone, Globe } from 'lucide-react';
import { navLinks, siteConfig } from '../data/siteContent';
import useScrollspy from '../hooks/useScrollspy';
import NavDrawer from './NavDrawer';

const SECTION_IDS = navLinks.map((l) => l.href.replace('#', ''));

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeId = useScrollspy(SECTION_IDS, 80);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-30 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-stone-200 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="section-container">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="group flex items-center gap-3"
            >
              {/* Precision logo mark */}
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-stone-300 bg-white transition-colors group-hover:border-sapphire-400">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="2" width="14" height="14" rx="3" stroke="#0052CC" strokeWidth="2" fill="none" />
                  <path d="M7 7 L11 11 M11 7 L7 11" stroke="#A67C52" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <span className="font-heading text-lg font-bold tracking-precision text-graphite-900">
                  西湖巴尔
                </span>
                <span className="ml-2 text-[10px] font-medium uppercase tracking-technical text-graphite-400">
                  Westlake巴尔
                </span>
              </div>
            </a>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative rounded-md px-4 py-2 text-sm font-medium tracking-precision transition-colors duration-300 ${
                    activeId === link.href.slice(1)
                      ? 'text-sapphire-600'
                      : 'text-graphite-500 hover:text-graphite-800'
                  }`}
                >
                  {link.label}
                  {activeId === link.href.slice(1) && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 bg-sapphire-500 shadow-sm" />
                  )}
                </a>
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hidden items-center gap-3 lg:flex">
              <a
                href="http://en.xihubiom.com.cn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-graphite-400 transition-colors hover:text-graphite-700"
              >
                <Globe size={14} /> EN
              </a>
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center gap-1.5 text-sm font-medium text-graphite-500 transition-colors hover:text-graphite-800"
              >
                <Phone size={14} className="text-sapphire-500" />
                {siteConfig.phone}
              </a>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="btn-primary !px-5 !py-2.5 text-sm"
              >
                商务咨询
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="rounded-lg p-2 text-graphite-500 transition-colors hover:bg-stone-100 hover:text-graphite-800 lg:hidden"
              aria-label="打开菜单"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      <NavDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} activeId={activeId} />
    </>
  );
}
