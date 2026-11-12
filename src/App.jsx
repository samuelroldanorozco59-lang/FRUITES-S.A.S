import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import DemoBanner from './components/DemoBanner.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { CartProvider } from './context/CartContext.jsx';

// Páginas de FRUITES
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import StoreLocator from './pages/StoreLocator.jsx';
import Recipes from './pages/Recipes.jsx';
import RecipeDetail from './pages/RecipeDetail.jsx';
import About from './pages/About.jsx';
import Business from './pages/Business.jsx';
import Contact from './pages/Contact.jsx';
import Assistant from './pages/Assistant.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import NotFound from './pages/NotFound.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

/**
 * ============================================================================
 * APLICACIÓN PRINCIPAL DE FRUITES
 * ============================================================================
 * - HashRouter para soporte completo en GitHub Pages y servidores estáticos.
 * - ErrorBoundary para protección contra caídas de renderizado (M-05).
 * - CartProvider para gestión global de carrito de compras e-commerce.
 * - CartDrawer interactivo accesible desde cualquier sección.
 * - Rutas e-commerce completas: /checkout y /pedido-confirmado/:orderId.
 * ============================================================================
 */
export default function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <HashRouter>
          <ScrollToTop />
          <DemoBanner />
          <Navbar />

          <main style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalogo" element={<Catalog />} />
              <Route path="/catalogo/:slug" element={<ProductDetail />} />
              <Route path="/tiendas" element={<StoreLocator />} />
              <Route path="/recetas" element={<Recipes />} />
              <Route path="/recetas/:slug" element={<RecipeDetail />} />
              <Route path="/nosotros" element={<About />} />
              <Route path="/negocios" element={<Business />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/asistente" element={<Assistant />} />
              <Route path="/privacidad" element={<PrivacyPolicy />} />
              
              {/* Rutas de Comercio Electrónico */}
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pedido-confirmado/:orderId" element={<OrderConfirmation />} />

              {/* Rutas administrativas */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <CartDrawer />
          <ChatWidget />
          <Footer />
        </HashRouter>
      </CartProvider>
    </ErrorBoundary>
  );
}
