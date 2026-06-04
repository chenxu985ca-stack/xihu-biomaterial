import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, Phone, Globe } from 'lucide-react';
import { navLinks, siteConfig } from '../data/siteContent';
import { scrollToSection } from '../utils';
import useScrollspy from '../hooks/useScrollspy';

const SECTION_IDS = navLinks.map((l) => l.href.replace('#', ''));
const NAV_HIDE_THRESHOLD = 80;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeId = useScrollspy(SECTION_IDS, 80);
  const lastScrollY = useRef(0);
  const scrollTicking = useRef(false);

  // Smart navbar: hide on scroll down, show on scroll up
  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    setScrolled(currentY > 40);

    if (currentY < NAV_HIDE_THRESHOLD) {
      setNavHidden(false);
    } else if (currentY > lastScrollY.current + 5) {
      setNavHidden(true);
    } else if (currentY < lastScrollY.current - 5) {
      setNavHidden(false);
    }
    lastScrollY.current = currentY;
    scrollTicking.current = false;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!scrollTicking.current) {
        scrollTicking.current = true;
        requestAnimationFrame(handleScroll);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const handleNavClick = (href) => {
    setDrawerOpen(false);
    // defer scroll until drawer close animation starts
    setTimeout(() => scrollToSection(href), 150);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-30 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-stone-200 shadow-sm'
            : 'bg-transparent'
        } ${
          navHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="section-container">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
              className="group flex items-center gap-3"
            >
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
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
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
                onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
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

      {/* Mobile drawer — backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-stone-900/20 backdrop-blur-sm transition-opacity duration-500 lg:hidden ${
          drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer — panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-white border-l border-stone-200 shadow-2xl transition-transform duration-400 ease-out lg:hidden ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="导航菜单"
      >
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
          <span className="font-heading text-lg font-bold tracking-precision text-graphite-900">
            西湖巴尔
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="rounded-lg p-2 text-graphite-400 transition-colors hover:bg-stone-100 hover:text-graphite-700"
            aria-label="关闭菜单"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-8">
          <ul className="space-y-1">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className={`block rounded-lg px-4 py-3 text-base font-medium tracking-precision transition-all duration-300 ${
                    activeId === link.href.slice(1)
                      ? 'bg-sapphire-50 text-sapphire-600 border-l-2 border-sapphire-500'
                      : 'text-graphite-500 hover:bg-stone-50 hover:text-graphite-900 border-l-2 border-transparent'
                  }`}
                  style={{ transitionDelay: `${i * 50}ms`, opacity: drawerOpen ? 1 : 0, transform: drawerOpen ? 'translateX(0)' : 'translateX(20px)' }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-stone-100 px-5 py-5">
          <a href={`tel:${siteConfig.phone}`} className="btn-primary w-full text-sm">
            立即致电
          </a>
        </div>
      </div>
    </>
  );
}
