import React from 'react';
import {
  Heart,
  Star,
  Truck,
  ShoppingCart,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    toggleFavorite,
    isFavorite,
    navigateTo,
    setIsCartDrawerOpen,
  } = useStore();

  const isFav = isFavorite(product.id);

  const handleCardClick = () => {
    navigateTo('product-details', product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    navigateTo('checkout');
  };

  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-blue-500/50 hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden cursor-pointer text-right"
    >
      {/* 1. Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Condition Badge (Top Right) */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 z-10">
          {product.condition === 'new' ? (
            <span className="inline-flex items-center gap-1 bg-emerald-600/95 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs backdrop-blur-xs">
              <CheckCircle2 className="w-3 h-3" />
              <span>جديد</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-amber-500/95 text-slate-950 text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-xs backdrop-blur-xs">
              <span>مستعمل</span>
              {product.conditionGrade === 'used_like_new' && (
                <span className="text-[9px] font-medium opacity-90">(كالجديد)</span>
              )}
            </span>
          )}

          {/* Flash Deal or Free Shipping */}
          {product.isFreeShipping && (
            <span className="inline-flex items-center gap-0.5 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs">
              <Truck className="w-2.5 h-2.5" />
              <span>شحن مجاني</span>
            </span>
          )}
        </div>

        {/* Discount Badge (Top Left) */}
        {product.discountPercent && product.discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="bg-rose-500 text-white text-xs font-black px-2 py-0.5 rounded-md shadow-xs">
              -{product.discountPercent}%
            </span>
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleFavClick}
          className={`absolute bottom-2.5 left-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-xs ${
            isFav
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/90 text-slate-400 hover:text-rose-500 backdrop-blur-xs'
          }`}
          title={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          aria-label="المفضلة"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-600' : ''}`} />
        </button>
      </div>

      {/* 2. Product Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Condition Grade */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="text-blue-600 font-medium">{product.categoryNameAr}</span>
            <span className="text-slate-500 truncate">{product.conditionLabelAr}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors mb-1.5">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="text-xs font-bold text-slate-700 mr-1">{product.rating}</span>
            </div>
            <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
            <span className="text-slate-300">·</span>
            <span className="text-[11px] text-slate-500 truncate max-w-[100px]">{product.sellerName}</span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 border-t border-slate-100 mt-2">
          {/* Price Row */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-black text-blue-700">
              {product.price.toLocaleString('ar-EG')} <span className="text-xs font-bold">ج.م</span>
            </span>

            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through font-medium">
                {product.originalPrice.toLocaleString('ar-EG')} ج.م
              </span>
            )}
          </div>

          {/* Action Buttons (Add to Cart & Buy Now) */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-bold py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors"
              title="أضف إلى عربة التسوق"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>أضف للعربة</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors shadow-xs"
              title="شراء فوري ومتابعة للدفع"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>اشتري الآن</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
