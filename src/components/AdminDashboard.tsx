import React, { useState } from 'react';
import {
  ShieldAlert,
  Package,
  TrendingUp,
  Users,
  DollarSign,
  Tag,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Trash2,
  Plus,
  ArrowRight,
  Filter,
  Check,
  Percent,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderStatus, Coupon, ShippingRate, ProductCategory } from '../types';
import { CATEGORIES } from '../data/seedData';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    coupons,
    shippingRates,
    updateOrderStatus,
    deleteProduct,
    addCoupon,
    updateShippingRate,
    showToast,
    navigateTo,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'coupons' | 'shipping' | 'categories'>('orders');
  const [orderFilter, setOrderFilter] = useState<string>('all');

  // Stats
  const totalSales = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.finalTotal : sum), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const registeredUsersCount = 1250; // Marketplace registered members count

  // Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(10);
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(100);
  const [newCouponExpiry, setNewCouponExpiry] = useState('2026-12-31');

  // New Category State
  const [categoriesList, setCategoriesList] = useState(CATEGORIES);
  const [newCatNameAr, setNewCatNameAr] = useState('');
  const [newCatId, setNewCatId] = useState('');

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountPercent: newCouponType === 'percentage' ? newCouponDiscount : undefined,
      discountAmount: newCouponType === 'fixed' ? newCouponDiscount : undefined,
      type: newCouponType,
      minOrderAmount: newCouponMinOrder,
      expiresAt: newCouponExpiry,
      isActive: true,
      usageCount: 0,
    });

    setNewCouponCode('');
    showToast(`تم إنشاء الكوبون ${newCouponCode.toUpperCase()} بنجاح!`);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatNameAr.trim() || !newCatId.trim()) return;

    const newCat = {
      id: newCatId as ProductCategory,
      nameAr: newCatNameAr,
      nameEn: newCatId,
      iconName: 'Sparkles',
      descriptionAr: `تصفح كل ما يخص ${newCatNameAr} جديد ومستعمل`,
      itemCount: 0,
    };

    setCategoriesList([...categoriesList, newCat]);
    setNewCatNameAr('');
    setNewCatId('');
    showToast(`تمت إضافة الفئة ${newCatNameAr} بنجاح`);
  };

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-right space-y-6">
      
      {/* 1. Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-black">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">لوحة الإدارة والتحكم الشاملة</h1>
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Admin Portal</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              متابعة مبيعات منصة "روق دولابك"، فحص السلع، وتحديث حالات الشحنات والكوبونات
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-colors"
        >
          معاينة واجهة المتجر الرئيسية
        </button>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-xs font-bold">إجمالي المبيعات</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {totalSales.toLocaleString('ar-EG')} <span className="text-xs font-bold">ج.م</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">+18% نمو أسبوعي</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-xs font-bold">إجمالي الطلبات</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalOrders}</div>
          <span className="text-[11px] text-slate-400">بمختلف المحافظات</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-xs font-bold">المنتجات المعروضة</span>
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalProducts}</div>
          <span className="text-[11px] text-slate-400">جديد ومستعمل</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-xs font-bold">المستخدمين المسجلين</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{registeredUsersCount}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">نشطين في مصر</span>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors shrink-0 ${
            activeTab === 'orders' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>إدارة الطلبات وشحنها ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors shrink-0 ${
            activeTab === 'products' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>إدارة ومراقبة المنتجات ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('coupons')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors shrink-0 ${
            activeTab === 'coupons' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>كوبونات الخصم ({coupons.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('shipping')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors shrink-0 ${
            activeTab === 'shipping' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>أسعار الشحن للمحافظات ({shippingRates.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors shrink-0 ${
            activeTab === 'categories' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>الأقسام والفئات ({categoriesList.length})</span>
        </button>
      </div>

      {/* TAB 1: Orders Management */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900">
              جميع طلبات العملاء وإجراءات التوصيل
            </h3>

            {/* Filter by Status */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={orderFilter}
                onChange={e => setOrderFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs rounded-xl py-1.5 px-3 font-semibold"
              >
                <option value="all">كل الحالات ({orders.length})</option>
                <option value="pending">قيد الانتظار</option>
                <option value="confirmed">تم التأكيد</option>
                <option value="processing">جاري التجهيز</option>
                <option value="shipped">تم الشحن</option>
                <option value="out_for_delivery">جاري التوصيل</option>
                <option value="delivered">تم التسليم</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredOrders.map(ord => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {ord.orderNumber}
                    </span>
                    <span className="text-xs text-slate-500">{new Date(ord.createdAt).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    العميل: {ord.customerName} ({ord.customerPhone})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    العنوان: {ord.shippingAddress.governorate}، {ord.shippingAddress.city} - {ord.items.length} منتجات
                  </p>
                  <p className="text-xs font-black text-blue-700">
                    الإجمالي: {ord.finalTotal.toLocaleString('ar-EG')} ج.م ({ord.paymentMethod === 'cash_on_delivery' ? 'الدفع عند الاستلام' : 'بطاقة فيزا'})
                  </p>
                </div>

                {/* Status Changer Select */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-600">تحديث الحالة:</label>
                  <select
                    value={ord.status}
                    onChange={e => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 cursor-pointer focus:border-blue-600"
                  >
                    <option value="pending">قيد الانتظار</option>
                    <option value="confirmed">تم التأكيد</option>
                    <option value="processing">جاري التجهيز</option>
                    <option value="shipped">تم الشحن</option>
                    <option value="out_for_delivery">جاري التوصيل</option>
                    <option value="delivered">تم التسليم</option>
                    <option value="cancelled">إلغاء الطلب</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Products Control */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 pb-2 border-b border-slate-100">
            قائمة جميع المنتجات المنشورة على المتجر
          </h3>

          <div className="space-y-2">
            {products.map(p => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      p.condition === 'new' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.conditionLabelAr}
                    </span>
                    <h4 className="font-bold text-slate-800 mt-0.5">{p.name}</h4>
                    <p className="text-[11px] text-slate-400">البائع: {p.sellerName} · القسم: {p.categoryNameAr}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-black text-blue-700 text-sm">{p.price} ج.م</span>
                  <button
                    type="button"
                    onClick={() => deleteProduct(p.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="حذف المنتج من المنصة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Discount Coupons */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <h3 className="font-extrabold text-base text-slate-900 pb-2 border-b border-slate-100">
            إدارة وإنشاء كوبونات الخصم الترويجية
          </h3>

          {/* Add Coupon Form */}
          <form onSubmit={handleAddCoupon} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <h4 className="font-bold text-xs text-slate-800">إضافة كود خصم جديد:</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">كود الكوبون</label>
                <input
                  type="text"
                  value={newCouponCode}
                  onChange={e => setNewCouponCode(e.target.value)}
                  placeholder="مثال: SUMMER20"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">نوع الخصم</label>
                <select
                  value={newCouponType}
                  onChange={e => setNewCouponType(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="percentage">نسبة مئوية (%)</option>
                  <option value="fixed">مبلغ ثابت (ج.م)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">قيمة الخصم</label>
                <input
                  type="number"
                  value={newCouponDiscount}
                  onChange={e => setNewCouponDiscount(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">تاريخ الانتهاء</label>
                <input
                  type="date"
                  value={newCouponExpiry}
                  onChange={e => setNewCouponExpiry(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl text-xs"
            >
              إنشاء وتفعيل الكوبون
            </button>
          </form>

          {/* Active Coupons List */}
          <div className="space-y-2">
            {coupons.map(c => (
              <div
                key={c.code}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span className="font-mono font-black text-blue-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {c.code}
                  </span>
                  <span className="font-bold text-slate-700">
                    {c.type === 'percentage' ? `خصم ${c.discountPercent}%` : `خصم ${c.discountAmount} ج.م`}
                  </span>
                  <span className="text-slate-400">· الحد الأدنى للطلب: {c.minOrderAmount} ج.م</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">ينتهي في: {c.expiresAt}</span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                    مفعل
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Shipping Rates */}
      {activeTab === 'shipping' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                أسعار الشحن والتوصيل للمحافظات المصرية
              </h3>
              <p className="text-xs text-slate-500">
                يمكن تعديل تكلفة الشحن ومدة التوصيل لكل محافظة
              </p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-xl">
              شحن مجاني تلقائي للطلبات فوق 1000 ج.م
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {shippingRates.map(r => (
              <div key={r.governorateCode} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-900">{r.governorateNameAr}</span>
                  <span className="text-blue-700 font-black">{r.baseCost} ج.م</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  مدة التوصيل المقدرة: {r.estimatedDays}
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-600">تحديث السعر:</span>
                  <input
                    type="number"
                    defaultValue={r.baseCost}
                    onBlur={(e) => {
                      updateShippingRate(r.governorateCode, Number(e.target.value));
                      showToast(`تم تحديث سعر الشحن لـ ${r.governorateNameAr}`);
                    }}
                    className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1 text-center font-bold"
                  />
                  <span>ج.م</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Categories Management */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 pb-2 border-b border-slate-100">
            إدارة فئات وأقسام المتجر
          </h3>

          <form onSubmit={handleAddCategory} className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <input
              type="text"
              value={newCatNameAr}
              onChange={e => setNewCatNameAr(e.target.value)}
              placeholder="اسم الفئة بالعربية (مثال: ألعاب فيديو)"
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs flex-1"
              required
            />
            <input
              type="text"
              value={newCatId}
              onChange={e => setNewCatId(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
              placeholder="المعرف الإنجليزي (مثال: gaming)"
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs flex-1 font-mono"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold"
            >
              إضافة القسم
            </button>
          </form>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categoriesList.map(cat => (
              <div key={cat.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <p className="font-bold text-slate-800">{cat.nameAr}</p>
                <p className="text-[10px] text-slate-400 font-mono">{cat.nameEn}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
