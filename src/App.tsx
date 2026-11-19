import React, { useState, lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { PageLoader } from './components/PageLoader';
import { ProductCustomizerModal } from './components/ProductCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AuthModal } from './components/AuthModal';
import { Order, Product } from './types';

// Lazy loaded page components
const HomePage = lazy(() => import('./pages/HomePage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const PartyPage = lazy(() => import('./pages/PartyPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const OutletsPage = lazy(() => import('./pages/OutletsPage'));
const FranchisePage = lazy(() => import('./pages/FranchisePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Helper to auto scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, search]);
  return null;
};

export const MainApp: React.FC = () => {
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  const handleOrderSuccess = (order: Order) => {
    setIsCheckoutOpen(false);
    setActiveTrackingOrder(order);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7]">
      <ScrollToTop />

      {/* Global Header Navigation with Route Links */}
      <Header />

      {/* Main Routed Content with Lazy Loading Suspense */}
      <main className="flex-1 pb-16 lg:pb-0">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  onCustomizeProduct={(product) => setCustomizingProduct(product)}
                  onOpenPartyModal={() => {}}
                />
              }
            />
            
            <Route
              path="/menu"
              element={
                <MenuPage
                  onCustomizeProduct={(product) => setCustomizingProduct(product)}
                />
              }
            />

            <Route
              path="/parties"
              element={<PartyPage />}
            />

            {/* Outlet Details Page */}
            <Route
              path="/outlets"
              element={<OutletsPage />}
            />

            {/* About Us Page */}
            <Route
              path="/about"
              element={<AboutPage />}
            />

            {/* Contact Us Page */}
            <Route
              path="/contact"
              element={<ContactPage />}
            />

            {/* Apply for Franchise Page */}
            <Route
              path="/franchise"
              element={<FranchisePage />}
            />

            {/* Dedicated Admin Page Route */}
            <Route
              path="/admin"
              element={<AdminPage />}
            />

            {/* Customer Orders & Live Tracking */}
            <Route
              path="/orders"
              element={
                <OrdersPage
                  onTrackOrder={(ord) => setActiveTrackingOrder(ord)}
                />
              }
            />

            {/* 404 Fallback Route */}
            <Route
              path="*"
              element={<NotFoundPage />}
            />
          </Routes>
        </Suspense>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Navigation Bar (app-like experience) */}
      <MobileBottomNav />

      {/* Global Modals & Drawers */}
      <ProductCustomizerModal
        product={customizingProduct}
        onClose={() => setCustomizingProduct(null)}
      />

      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderTrackingModal
        order={activeTrackingOrder}
        onClose={() => setActiveTrackingOrder(null)}
      />

      <AuthModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AuthProvider>
          <CartProvider>
            <MainApp />
          </CartProvider>
        </AuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
};

export default App;
