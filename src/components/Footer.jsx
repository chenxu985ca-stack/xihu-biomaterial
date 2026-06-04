import { Phone, MapPin, Mail } from 'lucide-react';
import { siteConfig, footerContent } from '../data/siteContent';
import { scrollToSection } from '../utils';
import ScrollReveal from './ScrollReveal';

export default function Footer() {
  const handleNavClick = (e, href) => {
    e.preventDefault();
    scrollToSection(href);
  };

  return (
    <footer className="border-t border-stone-200 bg-graphite-900 text-stone-300">
      {/* Top gradient line */}
      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-sapphire-400/40 to-transparent px-5" />

      <div className="section-container py-16 lg:py-20">
        <ScrollReveal>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-graphite-700 bg-graphite-800/50">
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="2" width="14" height="14" rx="3" stroke="#0052CC" strokeWidth="2" fill="none" />
                  <path d="M7 7 L11 11 M11 7 L7 11" stroke="#A67C52" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-heading text-lg font-bold text-white">西湖巴尔</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-graphite-400">
              {footerContent.description}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-5 text-[11px] font-semibold uppercase tracking-technical text-graphite-500">快速导航</h4>
            <ul className="space-y-3">
              {footerContent.quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-sm text-graphite-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 text-[11px] font-semibold uppercase tracking-technical text-graphite-500">联系方式</h4>
            <ul className="space-y-3.5">
              <li>
                <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2.5 text-sm text-graphite-400 transition-colors hover:text-white">
                  <Phone size={13} className="text-graphite-600" /> {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-graphite-400">
                <MapPin size={13} className="mt-0.5 flex-shrink-0 text-graphite-600" />
                <span>{siteConfig.address}</span>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2.5 text-sm text-graphite-400 transition-colors hover:text-white">
                  <Mail size={13} className="text-graphite-600" /> {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>

          {/* QR placeholder */}
          <div>
            <h4 className="mb-5 text-[11px] font-semibold uppercase tracking-technical text-graphite-500">官方公众号</h4>
            <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-graphite-700 bg-graphite-800/50">
              <span className="text-xl opacity-40">QR</span>
            </div>
            <p className="mt-3 text-xs text-graphite-600">扫码关注西湖巴尔</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col items-center gap-4 border-t border-graphite-800 pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-graphite-600">
            {footerContent.copyright} &nbsp;|&nbsp; {footerContent.icp}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-technical text-graphite-700">
            Precision Manufacturing Since 1994
          </p>
        </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
