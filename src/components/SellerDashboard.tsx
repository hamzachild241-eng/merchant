import React, { useState } from 'react';
import {
  Store,
  Plus,
  Package,
  DollarSign,
  TrendingUp,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Truck,
  Image as ImageIcon,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, ProductCategory, ProductCondition, ConditionGrade } from '../types';
import { CATEGORIES } from '../data/seedData';

export const SellerDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    currentUser,
    navigateTo,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'add'>('inventory');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Filter products for this seller (or all for demo)
  const myProducts = products.filter(
    p => p.sellerId === currentUser.id || currentUser.role === 'admin' || p.sellerName.includes('سارة')
  );

  // Orders for seller's products
  const myProductOrders = orders.filter(o =>
    o.items.some(i => myProducts.some(p => p.id === i.productId))
  );

  const totalEarnings = myProductOrders.reduce(
    (sum, o) => sum + (o.status !== 'cancelled' ? o.finalTotal : 0),
    0
  );

  // Form State for Adding / Editing Product
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('clothes');
  const [formCondition, setFormCondition] = useState<ProductCondition>('used');
  const [formGrade, setFormGrade] = useState<ConditionGrade>('used_like_new');
  const [formConditionDetails, setFormConditionDetails] = useState('');
  const [formPrice, setFormPrice] = useState(500);
  const [formOriginalPrice, setFormOriginalPrice] = useState(800);
  const [formQuantity, setFormQuantity] = useState(1);
  const [formFreeShipping, setFormFreeShipping] = useState(false);
  const [formImage, setFormImage] = useState(
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700&auto=format&fit=crop&q=80'
  );
  const [formDescription, setFormDescription] = useState('');
  const [formSpecBrand, setFormSpecBrand] = useState('ماركة أصلية');
  const [formSpecColor, setFormSpecColor] = useState('كحلي');

  const presetImages = [
    { label: 'جاكيت / ملابس', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700&auto=format&fit=crop&q=80' },
    { label: 'موبايل ذكي', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700&auto=format&fit=crop&q=80' },
    { label: 'سماعة رأس', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80' },
    { label: 'حذاء كاجوال', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80' },
    { label: 'أثاث / كرسي', url: 'https://images.unsplash.com/photo-1580481077195-c3a82145d875?w=700&auto=format&fit=crop&q=80' },
    { label: 'ماكينة قهوة', url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=700&auto=format&fit=crop&q=80' },
    { label: 'كتب وروايات', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=700&auto=format&fit=crop&q=80' },
  ];

  const handleOpenEdit = (p: Product) => {
    setEditingProductId(p.id);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormCondition(p.condition);
    setFormGrade(p.conditionGrade);
    setFormConditionDetails(p.conditionDetails || '');
    setFormPrice(p.price);
    setFormOriginalPrice(p.originalPrice || p.price);
    setFormQuantity(p.availableQuantity);
    setFormFreeShipping(p.isFreeShipping);
    setFormImage(p.images[0]);
    setFormDescription(p.description);
    setActiveTab('add');
  };

  const handleResetForm = () => {
    setEditingProductId(null);
    setFormName('');
    setFormDescription('');
    setFormConditionDetails('');
    setFormPrice(500);
    setFormOriginalPrice(800);
    setFormQuantity(1);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      showToast('يرجى إدخال اسم المنتج');
      return;
    }

    const discountPercent =
      formOriginalPrice > formPrice
        ? Math.round(((formOriginalPrice - formPrice) / formOriginalPrice) * 100)
        : undefined;

    const matchedCat = CATEGORIES.find(c => c.id === formCategory);

    const conditionLabel =
      formCondition === 'new'
        ? 'جديد بالكرتونة'
        : formGrade === 'used_like_new'
        ? 'مستعمل - كالجديد'
        : 'مستعمل - بحالة ممتازة';

    if (editingProductId) {
      await updateProduct(editingProductId, {
        name: formName,
        category: formCategory,
        categoryNameAr: matchedCat?.nameAr || 'عام',
        condition: formCondition,
        conditionGrade: formGrade,
        conditionLabelAr: conditionLabel,
        conditionDetails: formConditionDetails,
        price: formPrice,
        originalPrice: formOriginalPrice > formPrice ? formOriginalPrice : undefined,
        discountPercent,
        availableQuantity: formQuantity,
        isFreeShipping: formFreeShipping,
        images: [formImage],
        description: formDescription,
      });
      showToast('تم تحديث المنتج بنجاح');
    } else {
      await addProduct({
        name: formName,
        category: formCategory,
        categoryNameAr: matchedCat?.nameAr || 'أزياء',
        condition: formCondition,
        conditionGrade: formGrade,
        conditionLabelAr: conditionLabel,
        conditionDetails: formConditionDetails,
        price: formPrice,
        originalPrice: formOriginalPrice > formPrice ? formOriginalPrice : undefined,
        discountPercent,
        images: [formImage],
        description: formDescription || 'منتج معروض للبيع بحالة ممتازة عبر منصة روق دولابك.',
        specifications: {
          'الماركة': formSpecBrand,
          'اللون': formSpecColor,
          'الحالة': conditionLabel,
        },
        sellerId: currentUser.id,
        sellerName: currentUser.storeName || currentUser.name,
        sellerRating: 5.0,
        sellerCity: 'القاهرة',
        availableQuantity: formQuantity,
        isFreeShipping: formFreeShipping,
        shippingCost: formFreeShipping ? 0 : 35,
      });
    }

    handleResetForm();
    setActiveTab('inventory');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-right space-y-6">
      
      {/* 1. Header & Quick Actions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-900 flex items-center justify-center font-black shadow-sm">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">
              لوحة تحكم البائع: {currentUser.storeName || currentUser.name}
            </h1>
            <p className="text-xs text-slate-500">
              أدر منتجاتك المعروضة، راقب المبيعات، وأضف سلعاً جديدة من دولابك
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            handleResetForm();
            setActiveTab('add');
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة سلعة جديدة للبيع</span>
        </button>
      </div>

      {/* 2. Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold">المنتجات المعروضة</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-800">{myProducts.length}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">جاهزة للبيع والتوصيل</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold">إجمالي المبيعات</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono">
            {totalEarnings.toLocaleString('ar-EG')} <span className="text-xs font-bold">ج.م</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">من الطلبات المؤكدة</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold">الطلبات المستلمة</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-800">{myProductOrders.length}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">طلبات لمنتجاتك</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold">تقييم المتجر</span>
            <span className="text-amber-500 font-black text-xs">⭐ 4.9</span>
          </div>
          <div className="text-2xl font-black text-slate-800">بائع موثوق</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">فحص شحن سريع 100%</p>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${
            activeTab === 'inventory' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>مخزون إعلاناتي ({myProducts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${
            activeTab === 'orders' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>طلبات العملاء المستلمة ({myProductOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            handleResetForm();
            setActiveTab('add');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors ${
            activeTab === 'add' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{editingProductId ? 'تعديل السلعة' : 'إضافة سلعة جديدة'}</span>
        </button>
      </div>

      {/* TAB 1: Inventory Management */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="space-y-3">
            {myProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-600">ليس لديك أي منتجات معروضة حالياً</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('add')}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  أضف أول منتج الآن
                </button>
              </div>
            ) : (
              myProducts.map(prod => (
                <div
                  key={prod.id}
                  className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-xs transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          prod.condition === 'new' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {prod.conditionLabelAr}
                        </span>
                        <span className="text-xs text-blue-600 font-semibold">{prod.categoryNameAr}</span>
                        {prod.isFreeShipping && (
                          <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">شحن مجاني</span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-slate-800">{prod.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>السعر: <strong className="text-blue-700 font-black">{prod.price} ج.م</strong></span>
                        {prod.originalPrice && <span className="line-through">{prod.originalPrice} ج.م</span>}
                        <span>· الكمية المتاحة: <strong className="text-slate-800">{prod.availableQuantity}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigateTo('product-details', prod.id)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
                      title="معاينة المنتج كما يراه المشتري"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(prod)}
                      className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl"
                      title="تعديل المنتج"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(prod.id)}
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                      title="حذف المنتج"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Orders Received for Seller's Products */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-100">
            الطلبات التي تحتوي على منتجات من متجرك
          </h3>

          {myProductOrders.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">لا توجد طلبات جديدة حتى الآن</p>
          ) : (
            myProductOrders.map(ord => (
              <div key={ord.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {ord.orderNumber}
                  </span>
                  <span className="text-slate-500">{new Date(ord.createdAt).toLocaleDateString('ar-EG')}</span>
                </div>
                <div className="text-xs space-y-1">
                  <p><strong>المشتري:</strong> {ord.customerName} ({ord.customerPhone})</p>
                  <p><strong>العنوان:</strong> {ord.shippingAddress.city}، {ord.shippingAddress.district}</p>
                  <p><strong>الإجمالي المطلوب:</strong> {ord.finalTotal} ج.م ({ord.paymentMethod === 'cash_on_delivery' ? 'كاش عند الاستلام' : 'مدفوع بالفيزا'})</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: Add / Edit Product Form */}
      {activeTab === 'add' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs max-w-3xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                {editingProductId ? 'تعديل بيانات السلعة' : 'أضف سلعة جديدة من دولابك للبيع كاش'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                املأ التفاصيل بدقة لضمان سرعة البيع وثقة المشتري
              </p>
            </div>
            {editingProductId && (
              <button
                type="button"
                onClick={handleResetForm}
                className="text-xs text-rose-600 font-bold hover:underline"
              >
                إلغاء التعديل
              </button>
            )}
          </div>

          <form onSubmit={handleSubmitProduct} className="space-y-4">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اسم المنتج ووصفه المختصر <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder="مثال: جاكيت شتوي زارا أصلي كحلي مقاس L"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:border-blue-600"
                required
              />
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  فئة المنتج <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value as ProductCategory)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 cursor-pointer"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  حالة المنتج <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formCondition}
                  onChange={e => setFormCondition(e.target.value as ProductCondition)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 cursor-pointer"
                >
                  <option value="new">جديد بالكرتونة (لم يستخدم)</option>
                  <option value="used">مستعمل (Pre-owned)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  درجة الحالة
                </label>
                <select
                  value={formGrade}
                  onChange={e => setFormGrade(e.target.value as ConditionGrade)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 cursor-pointer"
                >
                  <option value="new_sealed">جديد بالكرتونة والتغليف الأصلي</option>
                  <option value="used_like_new">مستعمل - كالجديد (استخدام خفيف جداً)</option>
                  <option value="used_very_good">مستعمل - بحالة ممتازة</option>
                  <option value="used_good">مستعمل - بحالة مقبولة</option>
                </select>
              </div>
            </div>

            {/* If Used: details note */}
            {formCondition === 'used' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  تفاصيل حالة المستعمل (مدة الاستخدام، الملحقات، أي خدوش)
                </label>
                <input
                  type="text"
                  value={formConditionDetails}
                  onChange={e => setFormConditionDetails(e.target.value)}
                  placeholder="مثال: تم استخدامه 3 أشهر فقط، بدون أي خدش بالعلبة الأصلية"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:border-blue-600"
                />
              </div>
            )}

            {/* Pricing & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  سعر البيع المطلوب (ج.م) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={formPrice}
                  onChange={e => setFormPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold"
                  min={10}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  السعر الأصلي قبل الخصم (اختياري)
                </label>
                <input
                  type="number"
                  value={formOriginalPrice}
                  onChange={e => setFormOriginalPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800"
                  min={0}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  الكمية المتاحة <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={formQuantity}
                  onChange={e => setFormQuantity(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800"
                  min={1}
                  required
                />
              </div>
            </div>

            {/* Shipping Preference */}
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-blue-900">
                <input
                  type="checkbox"
                  checked={formFreeShipping}
                  onChange={e => setFormFreeShipping(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <Truck className="w-4 h-4 text-blue-600" />
                <span>عرض المنتج بشحن مجاني للمشتري (يتحمل البائع تكلفة الشحن)</span>
              </label>
            </div>

            {/* Image Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                رابط صورة المنتج أو اختر من النماذج الجاهزة:
              </label>
              <input
                type="url"
                value={formImage}
                onChange={e => setFormImage(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 text-left font-mono"
              />

              {/* Preset quick images */}
              <div className="flex flex-wrap gap-2 mt-2">
                {presetImages.map((pi, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormImage(pi.url)}
                    className="text-[11px] bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    {pi.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الوصف التفصيلي للمنتج (مثل جوميا)
              </label>
              <textarea
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                rows={3}
                placeholder="اكتب وصفاً واضحاً وموجزاً لحالة السلعة ومميزاتها..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-2xl text-sm transition-colors shadow-md shadow-blue-600/20"
            >
              {editingProductId ? 'حفظ التعديلات' : 'نشر الإعلان وعرضه للبيع الآن'}
            </button>

          </form>
        </div>
      )}

    </div>
  );
};
