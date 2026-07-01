import { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductsSection from './components/ProductsSection';
import AboutSection from './components/AboutSection';
import NewsSection from './components/NewsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import { SiteSettingsProvider } from './data/SiteSettingsContext';
import { getAdminSession } from './lib/db';

// AdminDashboard is ~60KB — only loaded when user visits /admin
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

/**
 * 公开网站（首页）
 */
function PublicSite() {
  return (
    <SiteSettingsProvider>
      <Navbar />
      <main>
        <HeroSection />
        <ProductsSection />
        <AboutSection />
        <NewsSection />
        <ContactSection />
      </main>
      <Footer />
    </SiteSettingsProvider>
  );
}

/**
 * 管理后台（/admin）
 */
function AdminApp() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getAdminSession().then(({ session: s }) => {
      setSession(s);
      setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-graphite-50">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-graphite-300 border-t-graphite-600" />
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onLoginSuccess={() => getAdminSession().then(({ session: s }) => setSession(s))} />;
  }

  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-graphite-50">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-graphite-300 border-t-graphite-600" />
      </div>
    }>
      <AdminDashboard onLogout={() => setSession(null)} />
    </Suspense>
  );
}

/**
 * 根组件：按路径分发
 *   /admin → 管理后台
 *   其他    → 公开网站
 */
export default function App() {
  // Match /admin or /biomaterial/admin or any /subpath/admin
  const isAdmin = window.location.pathname.replace(/\/$/, '').endsWith('/admin');

  if (isAdmin) {
    return <AdminApp />;
  }

  return <PublicSite />;
}
