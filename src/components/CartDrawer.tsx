import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Tag,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    subtotal,
    calculatedShippingCost,
    discountAmount,
    finalTotal,
    activeCoupon,
    couponError,
    applyCouponCode,
    removeCoupon,
    navigateTo,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    setIsApplying(true);
    await applyCouponCode(couponInput);
    setIsApplying(false);
  };

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    navigateTo('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-right">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-800">
                عربة التسوق ({cart.length} منتجات)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">عربتك فارغة حالياً</h3>
                <p className="text-xs text-slate-400 mb-6 max-w-xs">
                  تصفح آلاف المنتجات الجديدة والمستعملة المعروضة على روق دولابك وأضف ما يعجبك
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigateTo('home');
                  }}
                  className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-blue-700 transition-colors shadow-xs"
                >
                  ابدأ التسوق الآن
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 bg-slate-50/70 border border-slate-200/70 rounded-2xl relative"
                >
                  {/* Product Image */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-white border border-slate-100 shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          item.product.condition === 'new'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.product.condition === 'new' ? 'جديد' : 'مستعمل'}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                          {item.product.categoryNameAr}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                        {item.product.name}
                      </h4>

                      <div className="text-xs font-black text-blue-700 mt-1">
                        {item.product.price.toLocaleString('ar-EG')} ج.م
                      </div>
                    </div>

                    {/* Quantity Selector & Remove */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.availableQuantity}
                          className="p-1 hover:bg-slate-100 disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                        title="حذف من العربة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Calculations */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
              
              {/* Coupon Form */}
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                {activeCoupon ? (
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>كوبون {activeCoupon.code} مفعل (-{discountAmount} ج.م)</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-rose-600 hover:underline text-[11px] font-semibold"
                    >
                      إلغاء الكوبون
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="كود الخصم (مثال: ROQ10)"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 uppercase placeholder:normal-case font-mono"
                    />
                    <button
                      type="submit"
                      disabled={isApplying || !couponInput}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-50"
                    >
                      تطبيق
                    </button>
                  </form>
                )}

                {couponError && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{couponError}</p>
                )}
              </div>

              {/* Exact Formula Breakdown as requested:
                  Subtotal + Shipping Cost - Discount = Final Total */}
              <div className="space-y-1.5 text-xs bg-white p-3 rounded-xl border border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold text-slate-800">{subtotal.toLocaleString('ar-EG')} ج.م</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-blue-500" />
                    <span>مصاريف الشحن:</span>
                  </span>
                  {calculatedShippingCost === 0 ? (
                    <span className="font-bold text-emerald-600">شحن مجاني</span>
                  ) : (
                    <span className="font-bold text-slate-800">{calculatedShippingCost} ج.م</span>
                  )}
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>الخصم:</span>
                    <span className="font-bold">-{discountAmount.toLocaleString('ar-EG')} ج.م</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-black text-slate-900">
                  <span>الإجمالي النهائي:</span>
                  <span className="text-blue-700 text-base">{finalTotal.toLocaleString('ar-EG')} ج.م</span>
                </div>
                
                <div className="text-[10px] text-slate-400 text-center font-mono">
                  ({subtotal} ج.م + {calculatedShippingCost} ج.م - {discountAmount} ج.م = {finalTotal} ج.م)
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-blue-600/20"
              >
                <span>متابعة الشراء وإنهاء الطلب</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full text-center text-xs font-semibold text-slate-500 hover:text-blue-600 py-1"
              >
                مواصلة التسوق
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
