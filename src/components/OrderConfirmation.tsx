import React from 'react';
import {
  CheckCircle,
  Truck,
  Mail,
  MapPin,
  Clock,
  Printer,
  ShoppingBag,
  ArrowRight,
  Phone,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderStatus } from '../types';

export const OrderConfirmation: React.FC = () => {
  const { activeOrderId, orders, navigateTo } = useStore();

  // Retrieve current order
  const order = orders.find(o => o.id === activeOrderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto my-16 bg-white p-8 rounded-3xl border border-slate-200 text-center text-right shadow-xs">
        <h2 className="text-xl font-bold text-slate-800 mb-2">لم يتم العثور على تفاصيل الطلب</h2>
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="mt-4 bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return { text: 'قيد الانتظار', color: 'bg-amber-100 text-amber-800' };
      case 'confirmed':
        return { text: 'تم التأكيد', color: 'bg-blue-100 text-blue-800' };
      case 'processing':
        return { text: 'جاري التجهيز', color: 'bg-indigo-100 text-indigo-800' };
      case 'shipped':
        return { text: 'تم الشحن', color: 'bg-purple-100 text-purple-800' };
      case 'out_for_delivery':
        return { text: 'جاري التوصيل', color: 'bg-sky-100 text-sky-800' };
      case 'delivered':
        return { text: 'تم التسليم', color: 'bg-emerald-100 text-emerald-800' };
      case 'cancelled':
        return { text: 'ملغي', color: 'bg-rose-100 text-rose-800' };
      default:
        return { text: status, color: 'bg-slate-100 text-slate-800' };
    }
  };

  const statusObj = getStatusLabel(order.status);

  const steps: { key: OrderStatus; label: string }[] = [
    { key: 'pending', label: 'تم استلام الطلب' },
    { key: 'confirmed', label: 'تم التأكيد' },
    { key: 'processing', label: 'جاري التجهيز' },
    { key: 'shipped', label: 'تم الشحن' },
    { key: 'delivered', label: 'تم التسليم' },
  ];

  const getStepIndex = (st: OrderStatus) => {
    switch (st) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'processing': return 2;
      case 'shipped':
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-right space-y-6">
      
      {/* 1. Congratulatory Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2 inline-block">
          تم تأكيد طلبك بنجاح!
        </span>

        <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
          شكراً لتسوقك من "روق دولابك"
        </h1>

        <p className="text-sm text-slate-600 max-w-lg mx-auto mb-4">
          رقم طلبك هو <strong className="text-blue-700 font-mono text-base font-black px-2 py-0.5 bg-blue-50 rounded-lg">{order.orderNumber}</strong>. سنقوم بإشعارك خطوة بخطوة بموعد وصول المندوب.
        </p>

        {/* Email Simulation Banner */}
        <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-3.5 max-w-lg mx-auto flex items-center gap-3 text-xs text-blue-900 text-right">
          <Mail className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <span className="font-bold block">تم إرسال بريد تأكيد إلكتروني:</span>
            <span>أرسلنا نسخة كاملة من الفاتورة وتفاصيل الطلب إلى <strong className="font-mono">{order.customerEmail}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Order Tracking Status Stepper */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="font-extrabold text-base text-slate-900">حالة الشحنة والتتبع</h2>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusObj.color}`}>
            الحالة الحالية: {statusObj.text}
          </span>
        </div>

        {/* Stepper Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            return (
              <div key={step.key} className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                    isCompleted
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}
                >
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={`text-xs ${isCompleted ? 'font-bold text-slate-800' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Status History Notes */}
        {order.statusHistory.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs">
            <h4 className="font-bold text-slate-500 mb-2">سجل التحديثات:</h4>
            {order.statusHistory.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-600">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="font-medium text-slate-800">{h.noteAr}</span>
                <span className="text-[11px] text-slate-400 mr-auto">
                  {new Date(h.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Order Details & Customer Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Shipping & Delivery Address */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>عنوان الشحن وبيانات العميل</span>
          </h3>

          <div className="text-xs space-y-1.5 text-slate-700">
            <p><strong className="text-slate-900 font-bold">اسم المستلم:</strong> {order.customerName}</p>
            <p><strong className="text-slate-900 font-bold">رقم الهاتف:</strong> <span className="font-mono">{order.customerPhone}</span></p>
            <p><strong className="text-slate-900 font-bold">البريد الإلكتروني:</strong> {order.customerEmail}</p>
            <p>
              <strong className="text-slate-900 font-bold">العنوان:</strong> {order.shippingAddress.governorate}، {order.shippingAddress.city}، {order.shippingAddress.district}، {order.shippingAddress.street}، عمارة {order.shippingAddress.buildingNumber}، شقة {order.shippingAddress.apartmentNumber}
            </p>
            {order.shippingAddress.notes && (
              <p><strong className="text-slate-900 font-bold">ملاحظات:</strong> {order.shippingAddress.notes}</p>
            )}
            <p className="text-blue-700 font-semibold pt-1">
              موعد التوصيل المتوقع: {order.estimatedDeliveryDate}
            </p>
          </div>
        </div>

        {/* Payment & Invoice Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShoppingBag className="w-4 h-4 text-blue-600" />
            <span>تفاصيل الدفع والمصاريف</span>
          </h3>

          <div className="text-xs space-y-2 text-slate-700">
            <div className="flex justify-between">
              <span>طريقة الدفع:</span>
              <span className="font-bold text-slate-900">
                {order.paymentMethod === 'cash_on_delivery' ? 'الدفع عند الاستلام (كاش)' : 'بطاقة ائتمان / فيزا'}
              </span>
            </div>

            <div className="flex justify-between">
              <span>حالة الدفع:</span>
              <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                order.paymentDetails.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {order.paymentDetails.status === 'paid' ? 'مدفوع بنجاح (أونلاين)' : 'بانتظار الدفع نقداً للمندوب'}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span>{order.subtotal.toLocaleString('ar-EG')} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span>مصاريف الشحن:</span>
                <span>{order.shippingCost === 0 ? 'مجاناً' : `${order.shippingCost} ج.م`}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>الخصم ({order.couponCode || 'كوبون'}):</span>
                  <span>-{order.discountAmount.toLocaleString('ar-EG')} ج.م</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-100 flex justify-between font-black text-sm text-slate-900">
                <span>الإجمالي النهائي المطلوب:</span>
                <span className="text-blue-700 text-lg font-black">{order.finalTotal.toLocaleString('ar-EG')} ج.م</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Ordered Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-extrabold text-sm text-slate-900 mb-4 pb-2 border-b border-slate-100">
          المنتجات المشتراة في هذا الطلب
        </h3>

        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <img
                src={item.productImage}
                alt={item.productName}
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="flex-1">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  item.condition === 'new' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {item.condition === 'new' ? 'جديد' : 'مستعمل'}
                </span>
                <h4 className="font-bold text-slate-800 mt-1">{item.productName}</h4>
                <p className="text-[11px] text-slate-400">البائع: {item.sellerName}</p>
              </div>
              <div className="text-left font-bold text-slate-800">
                <div>{item.price.toLocaleString('ar-EG')} ج.م × {item.quantity}</div>
                <div className="text-blue-700 font-black">
                  {(item.price * item.quantity).toLocaleString('ar-EG')} ج.م
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Bottom Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة الفاتورة</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigateTo('profile')}
            className="bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-800 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
          >
            تتبع طلباتي في حسابي
          </button>

          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>متابعة التسوق</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
