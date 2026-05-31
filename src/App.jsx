import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductsSection from './components/ProductsSection';
import AboutSection from './components/AboutSection';
import NewsSection from './components/NewsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProductsSection />
        <AboutSection />
        <NewsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
