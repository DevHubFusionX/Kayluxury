import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LoadingScreen } from './components/common/LoadingScreen';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingActions } from './components/common/FloatingActions';
import { ToastContainer } from './components/common/Toast';
import { CartDrawer } from './components/layout/CartDrawer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Login from './pages/Login';
import Admin from './pages/Admin';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppLayout() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  const isLogin = pathname === '/login';

  return (
    <div className={isAdmin || isLogin ? '' : 'min-h-screen flex flex-col'}>
      <ScrollToTop />
      {!isAdmin && !isLogin && <Navbar />}
      {!isAdmin && !isLogin && <CartDrawer />}

      <main className={isAdmin || isLogin ? '' : 'flex-grow'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!isAdmin && !isLogin && <Footer />}
      {!isAdmin && !isLogin && <FloatingActions />}
      <ToastContainer />
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(() => !sessionStorage.getItem('kay_visited'));

  const handleDone = () => {
    sessionStorage.setItem('kay_visited', '1');
    setLoading(false);
  };

  return (
    <AuthProvider>
      <CartProvider>
        {loading && <LoadingScreen onDone={handleDone} />}
        <Router>
          <AppLayout />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
