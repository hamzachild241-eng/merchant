import React, { useState, useEffect } from 'react';
import {
  Flame,
  Sparkles,
  CheckCircle,
  Clock,
  ArrowLeft,
  Filter,
  SlidersHorizontal,
  Shirt,
  Smartphone,
  Laptop,
  Tv,
  BookOpen,
  Watch,
  Armchair,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/seedData';
import { ProductCategory } from '../types';

export const HomeSections: React.FC = () => {
  const {
    products,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedCondition,
    setSelectedCondition,
    sortBy,
    setSortBy,
    navigateTo,
  } = useStore();

  // Flash Sale countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter products by search, category, condition
  let filtered = products.filter(p => {
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryNameAr.includes(searchQuery);

    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchCondition = selectedCondition === 'all' || p.condition === selectedCondition;

    return matchSearch && matchCategory && matchCondition;
  });

  // Sort products
  filtered.sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    // Default featured
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  // Categorized subsets for special homepage sections
  const flashDeals = products.filter(p => p.isFlashDeal || (p.discountPercent && p.discountPercent >= 25));
  const newProducts = products.filter(p => p.condition === 'new');
  const usedProducts = products.filter(p => p.condition === 'used');
  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">

      {/* 1. Flash Deals & Special Offers Section (عروض خاصة وتخفيضات) */}
      {!searchQuery && selectedCategory === 'all' && selectedCondition === 'all' && (
        <section className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 rounded-3xl p-5 md:p-6 text-white shadow-lg overflow-hidden relative">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
                <Flame className="w-6 h-6 text-amber-200 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black">عروض وتخفيضات اليوم الخاطفة</h2>
                <p className="text-xs md:text-sm text-rose-100 font-medium">
                  خصومات تصل إلى 50% على أفضل المنتجات الجديدة والمستعملة
                </p>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="flex items-center gap-2 bg-black/25 px-4 py-2 rounded-2xl backdrop-blur-xs text-xs font-bold">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>ينتهي العرض خلال:</span>
              <div className="flex items-center gap-1 font-mono text-sm font-black text-amber-300">
                <span className="bg-black/40 px-2 py-0.5 rounded-lg">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-black/40 px-2 py-0.5 rounded-lg">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-black/40 px-2 py-0.5 rounded-lg">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {flashDeals.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 2. Interactive Filter & Sorting Bar */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Condition Filter Buttons (جديد / مستعمل / الكل) */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedCondition('all')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedCondition === 'all'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الكل ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCondition('new')}
              className={`flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedCondition === 'new'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>جديد ({products.filter(p => p.condition === 'new').length})</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCondition('used')}
              className={`flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedCondition === 'used'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-amber-800'
              }`}
            >
              <span>مستعمل ({products.filter(p => p.condition === 'used').length})</span>
            </button>
          </div>

          {/* Active Filter Indicators & Result Count */}
          <div className="text-xs text-slate-500 font-medium">
            عرض <span className="font-bold text-blue-700">{filtered.length}</span> منتج
            {selectedCategory !== 'all' && (
              <span> في قسم {CATEGORIES.find(c => c.id === selectedCategory)?.nameAr}</span>
            )}
            {searchQuery && (
              <span> لنتائج البحث عن "{searchQuery}"</span>
            )}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">ترتيب حسب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl py-1.5 px-3 focus:outline-hidden focus:border-blue-500 cursor-pointer"
            >
              <option value="featured">المميز أولاً</option>
              <option value="newest">الأحدث وصولاً</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
              <option value="discount">أعلى نسبة خصم</option>
            </select>
          </div>

        </div>
      </section>

      {/* 3. Main Filtered Products Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>جميع المنتجات المعروضة</span>
            {selectedCondition !== 'all' && (
              <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                {selectedCondition === 'new' ? 'المنتجات الجديدة فقط' : 'المنتجات المستعملة فقط'}
              </span>
            )}
          </h2>

          {(selectedCategory !== 'all' || selectedCondition !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedCondition('all');
              }}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              إعادة ضبط الفلاتر
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
              <Filter className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">لا توجد منتجات تطابق بحثك</h3>
            <p className="text-xs text-slate-500 mb-6">
              جرب تغيير كلمة البحث، أو تصفح كل الأقسام للعثور على صفقات ممتازة
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedCondition('all');
              }}
              className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-blue-700 transition-colors"
            >
              عرض كل المنتجات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Pre-Owned / Used Items Showcase (صفقات المستعمل - روق دولابك) */}
      {!searchQuery && selectedCategory === 'all' && selectedCondition === 'all' && (
        <section className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-bold mb-2">
                <span>صفقات الكنز المستعمل</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">
                منتجات مستعملة بحالة كالجديد بأسعار لا تصدق
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                ملابس براندات، هواتف أصلية، وأجهزة كهربائية فحصت وتأكدت حالتها بنسبة 100%
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedCondition('used');
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-xs"
            >
              <span>مشاهدة كل المستعمل</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {usedProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Brand New Section (جديد بالكرتونة) */}
      {!searchQuery && selectedCategory === 'all' && selectedCondition === 'all' && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>جديد وأصلي 100%</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">
                أحدث المنتجات الجديدة بالكرتونة والضمان
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                تغليف المصنع الأصلي مع فاتورة وضمان استبدال
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedCondition('new');
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors"
            >
              <span>تصفح المنتجات الجديدة</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {newProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 6. How it works guide for Sellers (كيف تروق دولابك وتبيع) */}
      <section className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full inline-block mb-3">
            انضم لآلاف البائعين في مصر
          </span>
          <h2 className="text-2xl md:text-3xl font-black mb-3 leading-tight">
            كيف تروق دولابك وتكسب كاش في 3 خطوات بسيطة؟
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            منصتنا تتيح لك تصوير أي منتج لم تعد بحاجة إليه سواء كان لبس، موبايل، أو عفش منزلي وعرضه فوراً أمام آلاف المشترين الجادين في محافظتك!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-right">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-xs border border-white/10">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 font-black flex items-center justify-center text-sm mb-2">
                1
              </div>
              <h4 className="font-bold text-sm text-white mb-1">صور منتجك</h4>
              <p className="text-xs text-slate-300">التقط صور واضحة لمنتجك وحدد سعره وحالته</p>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-xs border border-white/10">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 font-black flex items-center justify-center text-sm mb-2">
                2
              </div>
              <h4 className="font-bold text-sm text-white mb-1">انشر الإعلان مجاناً</h4>
              <p className="text-xs text-slate-300">منتجك يظهر فوراً للمشترين بدون أي رسوم تسجيل</p>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-xs border border-white/10">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-900 font-black flex items-center justify-center text-sm mb-2">
                3
              </div>
              <h4 className="font-bold text-sm text-white mb-1">استلم فلوسك كاش</h4>
              <p className="text-xs text-slate-300">مندوب الشحن يستلم من بيتك ويحول لك فلوسك فوراً</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('seller-dashboard')}
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-8 py-3.5 rounded-2xl text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-105"
          >
            <span>ابدأ البيع الآن كاش</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
