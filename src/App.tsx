import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { FlavorShowcase } from './components/FlavorShowcase';
import { WholesaleCalculator } from './components/WholesaleCalculator';
import { BusinessSolutions } from './components/BusinessSolutions';
import { BrandStory } from './components/BrandStory';
import { SustainabilitySection } from './components/SustainabilitySection';
import { InstagramGallery } from './components/InstagramGallery';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { EnquiryModal } from './components/EnquiryModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { B2BModal } from './components/B2BModal';
import { OrderModal } from './components/OrderModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ProductFlavor } from './data/cup2eatData';
import { getCustomerMe } from './services/api';
import { ArrowLeft } from 'lucide-react';

export default function App() {
  // Simple Client Route handling (/admin or #admin)
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return window.location.pathname === '/admin' || window.location.hash === '#admin';
  });

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminRoute(window.location.pathname === '/admin' || window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Modal states
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isGeneralEnquiryOpen, setIsGeneralEnquiryOpen] = useState(false);
  const [enquiryCategory, setEnquiryCategory] = useState<string>('wholesale');
  const [selectedFlavorName, setSelectedFlavorName] = useState<string>('');

  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductFlavor | null>(null);

  const [isB2BModalOpen, setIsB2BModalOpen] = useState(false);
  const [b2bBusinessType, setB2bBusinessType] = useState<string>('Cafes & Specialty Coffee');

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Customer Auth & Account state
  const [customer, setCustomer] = useState<any>(null);
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [isCustomerAccountOpen, setIsCustomerAccountOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('cup2eat_customer_token');
    if (token) {
      getCustomerMe(token).then((res) => {
        if (res.success && res.data) {
          setCustomer(res.data);
        } else {
          localStorage.removeItem('cup2eat_customer_token');
          setCustomer(null);
        }
      });
    }
  }, []);

  const handleCustomerAuthSuccess = (customerData: any, token: string) => {
    localStorage.setItem('cup2eat_customer_token', token);
    setCustomer(customerData);
    setIsCustomerAuthOpen(false);
  };

  const handleCustomerLogout = () => {
    localStorage.removeItem('cup2eat_customer_token');
    setCustomer(null);
    setIsCustomerAccountOpen(false);
  };

  // Flavor State Sync
  const [heroFlavorId, setHeroFlavorId] = useState<'chocolate' | 'vanilla' | 'elaichi' | 'wholesale'>('chocolate');

  const handleOpenAdminLogin = () => {
    const token = localStorage.getItem('cup2eat_admin_token');
    if (token) {
      window.location.hash = '#admin';
      setIsAdminRoute(true);
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  const handleAdminSuccess = (token: string) => {
    window.location.hash = '#admin';
    setIsAdminRoute(true);
  };

  const handleOpenGeneralEnquiry = (category: string = 'wholesale', flavorName: string = '') => {
    setEnquiryCategory(category);
    setSelectedFlavorName(flavorName);
    setIsGeneralEnquiryOpen(true);
  };

  const handleOpenOrderModal = (flavorId: string = 'chocolate') => {
    setHeroFlavorId(flavorId as any);
    setIsOrderModalOpen(true);
  };

  const handleOpenProductDetail = (product: ProductFlavor) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
  };

  const handleOpenB2BModal = (businessType: string = 'Cafes & Specialty Coffee') => {
    setB2bBusinessType(businessType);
    setIsB2BModalOpen(true);
  };

  const handleSyncFlavor = (flavorId: 'chocolate' | 'vanilla' | 'elaichi') => {
    setHeroFlavorId(flavorId);
  };

  // Render Admin Control Center if on /admin or #admin
  if (isAdminRoute) {
    return (
      <div className="relative">
        <button
          onClick={() => {
            window.location.hash = '';
            setIsAdminRoute(false);
          }}
          className="fixed bottom-6 left-6 z-50 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold shadow-2xl hover:bg-slate-700 transition-colors flex items-center gap-2 border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4 text-[#F2B544]" />
          <span>Exit Admin Desk & Return to Public Site</span>
        </button>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF5E9] text-[#17130C] font-sans selection:bg-[#D9A52B]/30 selection:text-[#073B2B] flex flex-col justify-between">
      {/* 1. Header Navbar with Navigation links */}
      <Navbar
        onOpenEnquiry={handleOpenGeneralEnquiry}
        customer={customer}
        onOpenAuthModal={() => setIsCustomerAuthOpen(true)}
        onOpenAccountModal={() => setIsCustomerAccountOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-grow">
        {/* 2. Hero Section with Commercial Product Photography & 3D Stage */}
        <Hero
          onOpenEnquiry={handleOpenGeneralEnquiry}
          onSelectFlavor={handleSyncFlavor}
          activeFlavorId={heroFlavorId}
        />

        {/* 3. How It Works (4-Step Experience) */}
        <HowItWorks />

        {/* 4. Product Flavours Showcase */}
        <FlavorShowcase
          onOpenEnquiry={handleOpenGeneralEnquiry}
          onSelect3DFlavor={handleSyncFlavor}
          onOpenProductDetail={handleOpenProductDetail}
        />

        {/* 5. Wholesale Deal & Cafe Profit Estimator */}
        <WholesaleCalculator onOpenEnquiry={handleOpenGeneralEnquiry} />

        {/* 6. B2B Commercial Solutions */}
        <BusinessSolutions onOpenB2BModal={handleOpenB2BModal} />

        {/* 7. Brand Story & Founder Varun Khera */}
        <BrandStory />

        {/* 8. Sustainability & Zero Waste Principles */}
        <SustainabilitySection />

        {/* 9. Instagram Gallery & Highlights */}
        <InstagramGallery />

        {/* 10. Frequently Asked Questions with Search */}
        <FAQSection />

        {/* 11. Contact Form & Direct Business Desk */}
        <ContactSection
          initialCategory={enquiryCategory}
          initialFlavorName={selectedFlavorName}
        />
      </main>

      {/* Footer with Hidden Admin Entrance */}
      <Footer
        onOpenAdminLogin={handleOpenAdminLogin}
        onOpenCustomerAuth={() => {
          if (customer) {
            setIsCustomerAccountOpen(true);
          } else {
            setIsCustomerAuthOpen(true);
          }
        }}
      />

      {/* Floating Action WhatsApp Button */}
      <WhatsAppButton />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      {/* Modal 1: Customer Direct Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialFlavorId={heroFlavorId}
        customer={customer}
        onOpenAuthModal={() => setIsCustomerAuthOpen(true)}
      />

      {/* Modal 2: General & Wholesale Enquiry Modal */}
      <EnquiryModal
        isOpen={isGeneralEnquiryOpen}
        onClose={() => setIsGeneralEnquiryOpen(false)}
        initialCategory={enquiryCategory}
        initialFlavorName={selectedFlavorName}
      />

      {/* Modal 3: Product Detail & Specs Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isProductDetailOpen}
        onClose={() => setIsProductDetailOpen(false)}
        onOpenEnquiryForm={handleOpenGeneralEnquiry}
        onSync3D={handleSyncFlavor}
      />

      {/* Modal 4: B2B & Cafe Partnership Modal */}
      <B2BModal
        isOpen={isB2BModalOpen}
        onClose={() => setIsB2BModalOpen(false)}
        initialBusinessType={b2bBusinessType}
      />

      {/* Modal 5: Customer Auth Modal */}
      <CustomerAuthModal
        isOpen={isCustomerAuthOpen}
        onClose={() => setIsCustomerAuthOpen(false)}
        onSuccess={handleCustomerAuthSuccess}
      />

      {/* Modal 6: Customer Account & Orders Modal */}
      <CustomerAccountModal
        isOpen={isCustomerAccountOpen}
        onClose={() => setIsCustomerAccountOpen(false)}
        customer={customer}
        onUpdateCustomer={(updated) => setCustomer(updated)}
        onLogout={handleCustomerLogout}
        onOpenOrderModal={() => handleOpenOrderModal('chocolate')}
      />
    </div>
  );
}
