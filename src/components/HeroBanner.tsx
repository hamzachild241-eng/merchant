import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Truck,
  ShieldCheck,
  CreditCard,
  RefreshCw,
  Sparkles,
  Tag,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const { navigateTo, setSelectedCondition, setSelectedCategory } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'روق دولابك واكسب كاش!',
      subtitle: 'عندك ملابس، موبايل قديم، أو أجهزة مركونة؟ بيعها بسهولة واستلم فلوسك بأمان',
      badge: 'السوق الأول للمستعمل والجديد في مصر',
      actionText: 'ابدأ البيع الآن كاش',
      actionView: 'seller-dashboard' as const,
      bgGradient: 'from-blue-900 via-blue-800 to-indigo-950',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=900&auto=format&fit=crop&q=80',
      tag: 'بيع واشتري أونلاين',
    },
    {
      title: 'أجهزة وموبايلات مستعملة بضمان المعاينة',
      subtitle: 'وفر حتى 50% من سعر الجديد مع فحص كامل وضمان استرجاع 14 يوم',
      badge: 'تخفيضات تصل إلى 50%',
      actionText: 'تصفح عروض المستعمل',
      actionFilter: 'used' as const,
      bgGradient: 'from-slate-900 via-blue-950 to-blue-900',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&auto=format&fit=crop&q=80',
      tag: 'إلكترونيات وموبايلات',
    },
    {
      title: 'أحدث صيحات الموضة والبراندات الأصلية',
      subtitle: 'تشكيلة ملابس، أحذية، وحقائب جديدة بالتاغ أو مستعملة كالجديد تماماً',
      badge: 'توفير حقيقي وأصالة مضمونة',
      actionText: 'تسوق قسم الملابس',
      actionCategory: 'clothes' as const,
      bgGradient: 'from-indigo-950 via-blue-900 to-sky-900',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&auto=format&fit=crop&q=80',
      tag: 'أزياء حصرية',
    },
  ];

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  const handleAction = () => {
    if (slide.actionView) {
      navigateTo(slide.actionView);
    } else if (slide.actionFilter) {
      setSelectedCondition(slide.actionFilter);
      navigateTo('home');
    } else if (slide.actionCategory) {
      setSelectedCategory(slide.actionCategory);
      navigateTo('home');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
      {/* 1. Main Carousel & Side Promo Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Main Banner (8 cols) */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-2xl bg-gradient-to-r shadow-md min-h-[300px] md:min-h-[350px] flex items-center transition-all">
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} opacity-95`} />
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
          />

          <div className="relative z-10 p-6 md:p-10 max-w-xl text-white">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-200 text-xs font-semibold mb-3 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{slide.badge}</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold leading-tight mb-3 text-white">
              {slide.title}
            </h1>

            <p className="text-sm md:text-base text-slate-200 leading-relaxed mb-6 font-normal">
              {slide.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleAction}
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <span>{slide.actionText}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCondition('all');
                  navigateTo('home');
                }}
                className="bg-white/15 hover:bg-white/25 text-white font-medium px-4 py-3 rounded-xl text-sm backdrop-blur-xs transition-colors"
              >
                تصفح كل المنتجات
              </button>
            </div>
          </div>

          {/* Carousel Arrows */}
          <div className="absolute left-3 bottom-3 md:bottom-auto md:top-1/2 md:-translate-y-1/2 flex md:flex-col gap-1.5 z-20">
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
              aria-label="السابق"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
              aria-label="التالي"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-4 right-6 flex items-center gap-1.5 z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === i ? 'w-6 bg-amber-400' : 'w-2 bg-white/40'
                }`}
                aria-label={`شريحة ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 2. Side Promo Cards (4 cols, Jumia Style) */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
          
          {/* Card 1: Fast Cash for Sellers */}
          <div className="flex-1 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-slate-900 flex flex-col justify-between shadow-xs relative overflow-hidden">
            <div className="relative z-10">
              <span className="inline-block bg-slate-900/15 font-bold text-[11px] px-2.5 py-0.5 rounded-full mb-2">
                انضم كبائع في دقيقة
              </span>
              <h3 className="font-extrabold text-lg leading-snug text-slate-900">
                روق دولابك واستفاد من الحاجات اللي مش بتستعملها
              </h3>
              <p className="text-xs text-amber-950/90 mt-1">
                الآلاف بيبحثوا عن هدوم، كتب، وموبايلات يومياً على المنصة!
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('seller-dashboard')}
              className="relative z-10 mt-3 inline-flex items-center gap-1 text-xs font-bold bg-white text-slate-900 px-3.5 py-2 rounded-xl self-start hover:bg-slate-50 transition-colors shadow-xs"
            >
              <span>انشر إعلانك مجاناً</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Safe Deals */}
          <div className="flex-1 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl p-5 text-white flex flex-col justify-between shadow-xs relative overflow-hidden">
            <div className="relative z-10">
              <span className="inline-block bg-white/20 font-bold text-[11px] px-2.5 py-0.5 rounded-full mb-2 text-blue-100">
                كوبون اليوم
              </span>
              <h3 className="font-extrabold text-lg leading-snug">
                خصم 10% فوري بكود <span className="text-amber-300 font-mono tracking-wider">ROQ10</span>
              </h3>
              <p className="text-xs text-blue-100 mt-1">
                يطبق على جميع المنتجات الجديدة والمستعملة عند الدفع
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCondition('all');
                navigateTo('home');
              }}
              className="relative z-10 mt-3 inline-flex items-center gap-1 text-xs font-bold bg-amber-400 text-slate-900 px-3.5 py-2 rounded-xl self-start hover:bg-amber-300 transition-colors shadow-xs"
            >
              <span>استخدم الكوبون الآن</span>
              <Tag className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* 3. Trust Badges Bar */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 p-1 text-right">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">شحن سريع لكل مصر</h4>
            <p className="text-[11px] text-slate-500">توصيل لباب بيتك بأسعار تبدأ من 35 ج.م</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-1 text-right">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">فحص ومعاينة مستعمل</h4>
            <p className="text-[11px] text-slate-500">استلم وعاين قبل التأكيد، حقك مضمون</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-1 text-right">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">دفع عند الاستلام أو فيزا</h4>
            <p className="text-[11px] text-slate-500">ادفع كاش لما المنتج يوصل أو بالبطاقة</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-1 text-right">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">إرجاع سهل وبسيط</h4>
            <p className="text-[11px] text-slate-500">إرجاع خلال 14 يوم لو المنتج مخالف للوصف</p>
          </div>
        </div>
      </div>
    </div>
  );
};
