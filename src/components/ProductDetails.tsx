import React, { useState } from 'react';
import {
  Heart,
  Star,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShoppingCart,
  Zap,
  MapPin,
  Store,
  Share2,
  AlertCircle,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const ProductDetails: React.FC = () => {
  const {
    selectedProductId,
    products,
    navigateTo,
    addToCart,
    toggleFavorite,
    isFavorite,
    shippingRates,
    selectedGovernorate,
    setSelectedGovernorate,
    showToast,
  } = useStore();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  const isFav = isFavorite(product.id);

  // Delivery cost for chosen governorate
  const currentGovRate = shippingRates.find(r => r.governorateCode === selectedGovernorate);
  const deliveryCost = product.isFreeShipping ? 0 : (currentGovRate?.baseCost || 35);
  const deliveryDays = currentGovRate?.estimatedDays || '2-3 أيام عمل';

  // Related products in the same category
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigateTo('checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast('تم نسخ رابط المنتج للمشاركة!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-right space-y-8">
      
      {/* 1. Breadcrumb Bar */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="hover:text-blue-600 flex items-center gap-1 font-semibold"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>الرئيسية</span>
        </button>
        <span>/</span>
        <span className="hover:text-blue-600 cursor-pointer">{product.categoryNameAr}</span>
        <span>/</span>
        <span className="text-slate-800 font-bold truncate max-w-xs">{product.name}</span>
      </div>

      {/* 2. Main Product Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        
        {/* Gallery Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Main Large Image */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {/* Condition Tag */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
              {product.condition === 'new' ? (
                <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>جديد بالكرتونة</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-xs font-extrabold px-2.5 py-1 rounded-lg shadow-sm">
                  <span>مستعمل - {product.conditionLabelAr}</span>
                </span>
              )}
            </div>

            {/* Discount Tag */}
            {product.discountPercent && product.discountPercent > 0 && (
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                  وفر {product.discountPercent}%
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-blue-600 ring-2 ring-blue-100'
                      : 'border-slate-200 hover:border-blue-400'
                  }`}
                >
                  <img src={img} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details & Actions Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          
          <div>
            {/* Header / Brand / Category */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {product.categoryNameAr}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors"
                  title="مشاركة المنتج"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => toggleFavorite(product.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isFav
                      ? 'border-rose-200 bg-rose-50 text-rose-600'
                      : 'border-slate-200 text-slate-400 hover:text-rose-500'
                  }`}
                  title="إضافة للمفضلة"
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-600' : ''}`} />
                </button>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-snug mb-3">
              {product.name}
            </h1>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-3 text-xs mb-4">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </div>
              <span className="text-slate-500 font-medium">({product.reviewsCount} تقييم من العملاء)</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">الحالة: <strong className="text-slate-800">{product.conditionLabelAr}</strong></span>
            </div>

            {/* Price Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-blue-700">
                  {product.price.toLocaleString('ar-EG')} <span className="text-sm font-bold">ج.م</span>
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-sm text-slate-400 line-through font-semibold">
                      {product.originalPrice.toLocaleString('ar-EG')} ج.م
                    </span>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      وفر {(product.originalPrice - product.price).toLocaleString('ar-EG')} ج.م
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">الأسعار شاملة ضريبة المبيعات المقررة</p>
            </div>

            {/* Used Condition Specifics Callout (if used) */}
            {product.condition === 'used' && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mb-4 text-xs">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900 block mb-0.5">تقرير حالة المنتج المستعمل:</span>
                    <p className="text-amber-800 leading-relaxed">
                      {product.conditionDetails || 'تم فحص المنتج والتأكد من عمله بكفاءة كاملة. مطابق للصور المعروضة.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Short Jumia-style Description */}
            <div className="mb-5">
              <h3 className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">نظرة عامة على المنتج:</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector & Stock Status */}
            <div className="flex flex-wrap items-center gap-4 py-3 border-y border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">الكمية:</span>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-slate-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.availableQuantity, quantity + 1))}
                    disabled={quantity >= product.availableQuantity}
                    className="p-2 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-xs">
                {product.availableQuantity > 0 ? (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
                    متوفر في المخزون ({product.availableQuantity} قطع متاحة)
                  </span>
                ) : (
                  <span className="text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-lg">
                    نفذت الكمية حالياً
                  </span>
                )}
              </div>
            </div>

            {/* Delivery Calculator Box */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>حاسبة الشحن والتوصيل لمحافظتك:</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedGovernorate}
                  onChange={(e) => setSelectedGovernorate(e.target.value)}
                  className="bg-white border border-blue-200 text-xs font-semibold text-slate-800 rounded-xl py-2 px-3 focus:outline-hidden focus:border-blue-600 cursor-pointer"
                >
                  {shippingRates.map(rate => (
                    <option key={rate.governorateCode} value={rate.governorateCode}>
                      محافظة {rate.governorateNameAr}
                    </option>
                  ))}
                </select>

                <div className="text-xs">
                  {product.isFreeShipping ? (
                    <span className="text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-md">
                      شحن مجاني لهذا المنتج!
                    </span>
                  ) : (
                    <span className="text-slate-700 font-medium">
                      مصاريف الشحن: <strong className="text-blue-700 font-bold">{deliveryCost} ج.م</strong>
                    </span>
                  )}
                  <span className="text-slate-400 mr-2">| التوصيل المتوقع خلال: {deliveryDays}</span>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.availableQuantity === 0}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4 text-blue-600" />
                <span>أضف إلى عربة التسوق</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.availableQuantity === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-blue-600/20 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>اشتري الآن (دفع سريع)</span>
              </button>
            </div>

          </div>

          {/* Seller & Protection Trust Footer */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Store className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">معلومات البائع:</span>
                <span className="font-bold text-slate-800">{product.sellerName}</span>
                <span className="text-[11px] text-amber-600 block">تقييم البائع: {product.sellerRating} / 5.0 ⭐</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">حماية المشتري في روق دولابك:</span>
                <span className="font-bold text-slate-800">معاينة قبل الاستلام</span>
                <span className="text-[11px] text-slate-500 block">استرجاع أموالك 100% في حال عدم المطابقة</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Specifications Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-lg font-black text-slate-900 mb-4 pb-2 border-b border-slate-100">
          المواصفات الفنية وتفاصيل السلعة
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(product.specifications).map(([key, val]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
            >
              <span className="font-bold text-slate-600">{key}</span>
              <span className="font-semibold text-slate-900">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-black text-slate-900 mb-4">
            منتجات مشابهة قد تهمك
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
