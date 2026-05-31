import { useEffect } from 'react';
import { X } from 'lucide-react';
import { navLinks, siteConfig } from '../data/siteContent';

export default function NavDrawer({ isOpen, onClose, activeId }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleNavClick = (href) => {
    onClose();
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-stone-900/20 backdrop-blur-sm transition-opacity duration-500 lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-white border-l border-stone-200 shadow-2xl transition-transform duration-400 ease-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
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
            onClick={onClose}
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
                  style={{ transitionDelay: `${i * 50}ms`, opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateX(0)' : 'translateX(20px)' }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-stone-100 px-5 py-5">
          <a href="tel:0571-88096997" className="btn-primary w-full text-sm">
            立即致电
          </a>
        </div>
      </div>
    </>
  );
}
