import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ShippingAddress, PaymentMethodType } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    subtotal,
    calculatedShippingCost,
    discountAmount,
    finalTotal,
    selectedGovernorate,
    setSelectedGovernorate,
    shippingRates,
    currentUser,
    createOrder,
    navigateTo,
    showToast,
  } = useStore();

  // Pre-fill from current user saved address if available
  const defaultAddress = currentUser.savedAddresses?.[0];

  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: defaultAddress?.fullName || currentUser.name || '',
    email: defaultAddress?.email || currentUser.email || '',
    phone: defaultAddress?.phone || currentUser.phone || '',
    confirmPhone: defaultAddress?.confirmPhone || currentUser.phone || '',
    governorate: selectedGovernorate,
    city: defaultAddress?.city || 'القاهرة',
    district: defaultAddress?.district || 'المعادي',
    street: defaultAddress?.street || 'شارع النصر',
    buildingNumber: defaultAddress?.buildingNumber || '14',
    apartmentNumber: defaultAddress?.apartmentNumber || '5',
    notes: defaultAddress?.notes || '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cash_on_delivery');
  
  // Card Details State
  const [cardholderName, setCardholderName] = useState(currentUser.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, redirect or show message
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-16 bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-xs text-right">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">عربة التسوق فارغة</h2>
        <p className="text-xs text-slate-500 mb-6">
          يرجى إضافة منتجات إلى العربة أولاً لتتمكن من متابعة عملية الدفع والشحن.
        </p>
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors"
        >
          تصفح المنتجات الآن
        </button>
      </div>
    );
  }

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setExpiryDate(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiryDate(raw);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'الاسم الكامل مطلوب';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = 'رقم الموبايل يجب أن يتكون من 11 رقم (مثال: 01012345678)';
    }
    if (formData.phone !== formData.confirmPhone) {
      newErrors.confirmPhone = 'رقم الموبايل وتأكيده غير متطابقين';
    }
    if (!formData.city.trim()) newErrors.city = 'المدينة مطلوبة';
    if (!formData.district.trim()) newErrors.district = 'الحي / المنطقة مطلوبة';
    if (!formData.buildingNumber.trim()) newErrors.buildingNumber = 'رقم العمارة مطلوب';
    if (!formData.apartmentNumber.trim()) newErrors.apartmentNumber = 'رقم الشقة مطلوب';

    if (paymentMethod === 'credit_card') {
      if (!cardholderName.trim()) newErrors.cardholderName = 'اسم حامل البطاقة مطلوب';
      if (cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'رقم البطاقة غير مكتمل (16 رقم)';
      }
      if (!expiryDate || expiryDate.length < 5) {
        newErrors.expiryDate = 'تاريخ الانتهاء مطلوب (MM/YY)';
      }
      if (!cvv || cvv.length < 3) {
        newErrors.cvv = 'رمز الأمان CVV مطلوب (3 أرقام)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('يرجى التأكد من استكمال كافة الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate secure tokenized payment if card
      if (paymentMethod === 'credit_card') {
        const payRes = await fetch('/api/payment/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cardNumber,
            cardholderName,
            expiryDate,
            cvv,
            amount: finalTotal,
          }),
        });
        const payData = await payRes.json();
        if (!payRes.ok || !payData.success) {
          throw new Error(payData.error || 'فشلت عملية الدفع الإلكتروني بالبطاقة');
        }
      }

      // Create Order
      const newOrder = await createOrder({
        shippingAddress: formData,
        paymentMethod,
        cardDetails: paymentMethod === 'credit_card' ? {
          cardNumber,
          cardholderName,
          expiryDate,
          cvv,
        } : undefined,
      });

      showToast(`تم تأكيد طلبك رقم ${newOrder.orderNumber} بنجاح!`);
      navigateTo('order-confirmation', undefined, newOrder.id);
    } catch (err: any) {
      showToast(err.message || 'حدث خطأ أثناء معالجة الطلب، يرجى المحاولة ثانية');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-right">
      
      {/* Title & Steps */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="text-xs text-blue-600 hover:underline flex items-center gap-1 mb-1 font-semibold"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة للتسوق</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">
            إتمام الشراء وشحن الطلب
          </h1>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-white px-4 py-2 rounded-2xl border border-slate-200">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>دفع آمن ومحمي بتشفير 256-bit SSL</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Details Form (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Contact Information */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>بيانات الاتصال والتواصل</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  الاسم بالكامل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="مثال: أحمد محمود كمال"
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:bg-white ${
                    errors.fullName ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-rose-600 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  البريد الإلكتروني (لتلقي الفاتورة والتأكيد) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:bg-white text-left ${
                    errors.email ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم الموبايل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01012345678"
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:bg-white text-left ${
                    errors.phone ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  تأكيد رقم الموبايل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.confirmPhone}
                  onChange={(e) => setFormData({ ...formData, confirmPhone: e.target.value })}
                  placeholder="01012345678"
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:bg-white text-left ${
                    errors.confirmPhone ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
                {errors.confirmPhone && <p className="text-[11px] text-rose-600 mt-1">{errors.confirmPhone}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Address in Egypt */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>عنوان الشحن والتوصيل</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  المحافظة <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedGovernorate}
                  onChange={(e) => {
                    setSelectedGovernorate(e.target.value);
                    setFormData({ ...formData, governorate: e.target.value });
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:border-blue-600 cursor-pointer"
                >
                  {shippingRates.map(rate => (
                    <option key={rate.governorateCode} value={rate.governorateCode}>
                      {rate.governorateNameAr} ({rate.baseCost} ج.م)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  المدينة / المركز <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="مثال: القاهرة أو 6 أكتوبر"
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:bg-white ${
                    errors.city ? 'border-rose-500' : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
                {errors.city && <p className="text-[11px] text-rose-600 mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  الحي / المنطقة <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="مثال: المعادي أو الدقي"
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:bg-white ${
                    errors.district ? 'border-rose-500' : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
                {errors.district && <p className="text-[11px] text-rose-600 mt-1">{errors.district}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اسم الشارع والعلامة المميزة <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="شارع النصر، متفرع من ميدان الجزائر"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم العمارة <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.buildingNumber}
                  onChange={(e) => setFormData({ ...formData, buildingNumber: e.target.value })}
                  placeholder="14"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم الشقة / الدور <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.apartmentNumber}
                  onChange={(e) => setFormData({ ...formData, apartmentNumber: e.target.value })}
                  placeholder="شقة 5، الدور الثالث"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ملاحظات إضافية للمندوب (اختياري)
                </label>
                <input
                  type="text"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="بجوار سوبرماركت، الاتصال قبل الوصول بنصف ساعة"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Methods (A: Cash on Delivery, B: Visa / Card) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">3</span>
              <span>طريقة الدفع المقررة</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Option A: Cash on Delivery */}
              <label
                className={`relative flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={() => setPaymentMethod('cash_on_delivery')}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-sm text-slate-900">الدفع عند الاستلام (كاش)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    عاين طلبك واستلمه ثم ادفع نقداً لمندوب التوصيل
                  </p>
                </div>
              </label>

              {/* Option B: Credit / Debit Card (Visa / Mastercard) */}
              <label
                className={`relative flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'credit_card'}
                  onChange={() => setPaymentMethod('credit_card')}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-sm text-slate-900">بطاقة بنكية (فيزا / ماستركارد)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    دفع إلكتروني فوري وآمن عبر بوابة Paymob / Stripe
                  </p>
                </div>
              </label>
            </div>

            {/* If Credit Card is selected: Render secure inputs */}
            {paymentMethod === 'credit_card' && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <span>بوابة دفع آمنة ومشفرة تماماً</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">VISA</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Mastercard</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">ميزة Meeza</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      اسم حامل البطاقة (كما هو مدون عليها)
                    </label>
                    <input
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="AHMED MAHMOUD"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 uppercase focus:outline-hidden focus:border-blue-600"
                    />
                    {errors.cardholderName && <p className="text-[11px] text-rose-600 mt-1">{errors.cardholderName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      رقم البطاقة (16 رقماً)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4123 4567 8901 2345"
                        maxLength={19}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-800 tracking-wider text-left focus:outline-hidden focus:border-blue-600"
                      />
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                    {errors.cardNumber && <p className="text-[11px] text-rose-600 mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        تاريخ الانتهاء (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={handleExpiryChange}
                        placeholder="12/28"
                        maxLength={5}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-center text-slate-800 focus:outline-hidden focus:border-blue-600"
                      />
                      {errors.expiryDate && <p className="text-[11px] text-rose-600 mt-1">{errors.expiryDate}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        رمز الأمان CVV (3 أرقام)
                      </label>
                      <input
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="123"
                        maxLength={4}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-center text-slate-800 focus:outline-hidden focus:border-blue-600"
                      />
                      {errors.cvv && <p className="text-[11px] text-rose-600 mt-1">{errors.cvv}</p>}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-normal">
                    * ملاحظة أمنية: لا يتم حفظ بيانات بطاقتك الائتمانية إطلاقاً على خوادم الموقع، بل تتم المعالجة مشفرة عبر بوابات الدفع البنكية المعتمدة.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Order Summary Sticky Sidebar (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs sticky top-24 space-y-4">
            <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>ملخص الطلب</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {cart.length} منتجات
              </span>
            </h3>

            {/* Item List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{item.product.name}</p>
                    <p className="text-[11px] text-slate-400">الكمية: {item.quantity}</p>
                  </div>
                  <span className="font-black text-slate-800 shrink-0">
                    {(item.product.price * item.quantity).toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-slate-800">{subtotal.toLocaleString('ar-EG')} ج.م</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>مصاريف الشحن والتوصيل:</span>
                {calculatedShippingCost === 0 ? (
                  <span className="font-bold text-emerald-600">مجاناً</span>
                ) : (
                  <span className="font-bold text-slate-800">{calculatedShippingCost} ج.م</span>
                )}
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>الخصم المطبق:</span>
                  <span>-{discountAmount.toLocaleString('ar-EG')} ج.م</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline text-slate-900">
                <span className="font-black text-sm">الإجمالي النهائي:</span>
                <span className="text-2xl font-black text-blue-700">
                  {finalTotal.toLocaleString('ar-EG')} <span className="text-xs font-bold">ج.م</span>
                </span>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 px-4 rounded-2xl text-sm transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>جاري معالجة وتأكيد الطلب...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span>تأكيد الطلب الآن</span>
                </>
              )}
            </button>

            {/* Satisfaction Guarantee */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[11px] text-slate-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>ضمان روق دولابك: إذا لم يكن المنتج مطابقاً للوصف والصور المعروضة، يمكنك رفض الاستلام واسترداد أموالك فوراً.</span>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
};
