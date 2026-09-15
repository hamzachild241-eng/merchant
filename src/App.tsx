import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { HeroBanner } from './components/HeroBanner';
import { HomeSections } from './components/HomeSections';
import { ProductDetails } from './components/ProductDetails';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmation } from './components/OrderConfirmation';
import { UserProfile } from './components/UserProfile';
import { SellerDashboard } from './components/SellerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { currentView, toastMessage } = useStore();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. Universal Header */}
      <Header />

      {/* 2. Category Navigation (shown on Home or when shopping) */}
      <CategoryNav />

      {/* 3. Main View Switcher */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroBanner />
            <HomeSections />
          </>
        )}

        {currentView === 'product-details' && <ProductDetails />}

        {currentView === 'checkout' && <CheckoutPage />}

        {currentView === 'order-confirmation' && <OrderConfirmation />}

        {currentView === 'profile' && <UserProfile />}

        {currentView === 'seller-dashboard' && <SellerDashboard />}

        {currentView === 'admin-dashboard' && <AdminDashboard />}
      </main>

      {/* 4. Global Modals & Drawers */}
      <CartDrawer />
      <AuthModal />

      {/* 5. Footer */}
      <Footer />

      {/* 6. Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
