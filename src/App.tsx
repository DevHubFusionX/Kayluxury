import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LoadingScreen } from './components/common/LoadingScreen';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingActions } from './components/common/FloatingActions';
import { CartDrawer } from './components/layout/CartDrawer';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import About from './pages/About';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  const [loading, setLoading] = useState(() => !sessionStorage.getItem('kay_visited'));

  const handleDone = () => {
    sessionStorage.setItem('kay_visited', '1');
    setLoading(false);
  };

  return (
    <CartProvider>
      {loading && <LoadingScreen onDone={handleDone} />}
      <Router>
        <div className="min-h-screen flex flex-col">
          {/* Navigation */}
          <ScrollToTop />
          <Navbar />

          {/* Cart UI */}
          <CartDrawer />

          {/* Routes */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* Floating Elements */}
          <FloatingActions />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
