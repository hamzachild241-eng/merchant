import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  PlusCircle,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Package,
  Store,
  Settings,
  Truck,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/seedData';
import { ProductCategory } from '../types';

export const Header: React.FC = () => {
  const {
    currentView,
    navigateTo,
    cartCount,
    favorites,
    currentUser,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setIsCartDrawerOpen,
    setIsAuthModalOpen,
    loginAsDemoUser,
    logoutUser,
  } = useStore();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo('home');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* 1. Top Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-slate-200">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-blue-300" />
              <span>شحن مجاني للطلبات فوق 500 ج.م لجميع المحافظات</span>
            </span>
            <span className="hidden md:inline-block text-slate-400">|</span>
            <span className="hidden md:flex items-center gap-1 text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ضمان فحص ومعاينة لجميع المنتجات المستعملة والجديدة</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-1.5 bg-blue-700/80 hover:bg-blue-600 px-2.5 py-0.5 rounded-full text-white text-[11px] font-medium transition-colors"
                title="تبديل الدور للتجربة السريعة"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>دورك الحالي: {currentUser.role === 'admin' ? 'مسؤول المتجر' : currentUser.role === 'seller' ? 'بائع' : 'مشتري'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isRoleMenuOpen && (
                <div
                  className="absolute left-0 mt-1.5 w-52 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-xs text-right"
                  onMouseLeave={() => setIsRoleMenuOpen(false)}
                >
                  <div className="px-3 py-1 font-semibold text-slate-400 text-[10px]">
                    تجربة الأدوار المباشرة (1-Click Switch):
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      loginAsDemoUser('buyer');
                      setIsRoleMenuOpen(false);
                    }}
                    className={`w-full text-right px-3 py-2 hover:bg-blue-50 flex items-center justify-between ${
                      currentUser.role === 'buyer' ? 'text-blue-600 font-bold bg-blue-50/50' : ''
                    }`}
                  >
                    <span>تجربة كمشتري (أحمد)</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">مشتري</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      loginAsDemoUser('seller');
                      setIsRoleMenuOpen(false);
                      navigateTo('seller-dashboard');
                    }}
                    className={`w-full text-right px-3 py-2 hover:bg-blue-50 flex items-center justify-between ${
                      currentUser.role === 'seller' ? 'text-blue-600 font-bold bg-blue-50/50' : ''
                    }`}
                  >
                    <span>تجربة كبائع (سارة)</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">بائع</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      loginAsDemoUser('admin');
                      setIsRoleMenuOpen(false);
                      navigateTo('admin-dashboard');
                    }}
                    className={`w-full text-right px-3 py-2 hover:bg-blue-50 flex items-center justify-between ${
                      currentUser.role === 'admin' ? 'text-blue-600 font-bold bg-blue-50/50' : ''
                    }`}
                  >
                    <span>لوحة تحكم الإدارة الكاملة</span>
                    <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">مسؤول</span>
                  </button>
                </div>
              )}
            </div>

            <span className="text-slate-300 font-semibold">مصر (ج.م)</span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2.5 text-right group focus:outline-hidden"
              id="brand-logo-btn"
            >
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black tracking-tight text-blue-700">
                  روق دولابك
                </span>
                <span className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block">
                  بيع واشتري جديد ومستعمل بأمان
                </span>
              </div>
            </button>
          </div>

          {/* Search Form (Jumia-style with category picker) */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl hidden md:flex items-center bg-slate-50 hover:bg-slate-100/80 focus-within:bg-white border-2 border-blue-600/30 focus-within:border-blue-600 rounded-xl overflow-hidden transition-all shadow-xs"
          >
            <div className="border-l border-slate-200 bg-white">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value as ProductCategory | 'all');
                  navigateTo('home');
                }}
                className="bg-transparent text-xs font-semibold text-slate-700 py-2.5 px-3 focus:outline-hidden cursor-pointer"
                aria-label="اختر فئة البحث"
              >
                <option value="all">كل الأقسام</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nameAr}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن ملابس، هواتف، لابتوب، أثاث، كتب..."
                className="w-full py-2.5 px-4 text-sm text-slate-800 bg-transparent placeholder:text-slate-400 focus:outline-hidden text-right"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 font-bold text-sm flex items-center gap-1.5 transition-colors"
              id="search-submit-btn"
            >
              <Search className="w-4 h-4" />
              <span>بحث</span>
            </button>
          </form>

          {/* User & Actions Bar */}
          <div className="flex items-center gap-2 md:gap-3">
            
            {/* Start Selling Button */}
            <button
              type="button"
              onClick={() => {
                if (currentUser.role !== 'seller') {
                  loginAsDemoUser('seller');
                }
                navigateTo('seller-dashboard');
              }}
              className="hidden lg:flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-3 py-2 rounded-xl text-xs transition-all shadow-xs hover:shadow-md"
              id="start-selling-btn"
            >
              <PlusCircle className="w-4 h-4 text-slate-900" />
              <span>روق دولابك وابيع كاش</span>
            </button>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => navigateTo('profile')}
              className="relative p-2.5 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="المفضلة"
              id="favorites-btn"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-2 rounded-xl text-xs md:text-sm transition-all"
              id="cart-btn"
            >
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <span className="hidden sm:inline">العربة</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-slate-50 transition-colors text-right"
                id="user-menu-btn"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/20"
                  />
                ) : (
                  <UserIcon className="w-5 h-5 text-slate-600" />
                )}
                <div className="hidden md:flex flex-col text-right text-xs leading-tight">
                  <span className="text-slate-400 text-[10px]">أهلاً بك</span>
                  <span className="font-bold text-slate-800 truncate max-w-[90px]">
                    {currentUser.name}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-right animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400">تم تسجيل الدخول كـ</p>
                    <p className="font-bold text-sm text-slate-800 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-blue-600 font-medium">
                      {currentUser.role === 'admin' ? 'مدير النظام' : currentUser.role === 'seller' ? 'تاجر / بائع' : 'مشتري'}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        navigateTo('profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 flex items-center gap-2.5"
                    >
                      <UserIcon className="w-4 h-4 text-slate-500" />
                      <span>حسابي والطلبات</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigateTo('seller-dashboard');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 flex items-center gap-2.5"
                    >
                      <Store className="w-4 h-4 text-amber-500" />
                      <span>لوحة تحكم البائع (إعلاناتي)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigateTo('admin-dashboard');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 flex items-center gap-2.5"
                    >
                      <Settings className="w-4 h-4 text-rose-500" />
                      <span>لوحة تحكم الإدارة</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 flex items-center gap-2.5"
                    >
                      <UserIcon className="w-4 h-4 text-blue-600" />
                      <span>تسجيل دخول بحساب آخر</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        logoutUser();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-blue-600 md:hidden"
              aria-label="القائمة الرئيسية"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-100 rounded-xl overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في روق دولابك..."
              className="w-full py-2 px-3 text-xs text-slate-800 bg-transparent placeholder:text-slate-400 focus:outline-hidden text-right"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 text-xs font-bold"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Mobile Expanded Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-100 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  navigateTo('home');
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 bg-blue-50 text-blue-700 rounded-xl text-center"
              >
                الرئيسية
              </button>
              <button
                type="button"
                onClick={() => {
                  navigateTo('seller-dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 bg-amber-50 text-amber-800 rounded-xl text-center"
              >
                بيع منتجاتك كاش
              </button>
              <button
                type="button"
                onClick={() => {
                  navigateTo('profile');
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 bg-slate-100 text-slate-700 rounded-xl text-center"
              >
                حسابي وطلباتي
              </button>
              <button
                type="button"
                onClick={() => {
                  navigateTo('admin-dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 bg-slate-100 text-slate-700 rounded-xl text-center"
              >
                لوحة الإدارة
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
