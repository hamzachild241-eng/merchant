import React, { useState } from 'react';
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  Clock,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowRight,
  ExternalLink,
  Edit2,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ShippingAddress, OrderStatus } from '../types';

export const UserProfile: React.FC = () => {
  const {
    currentUser,
    orders,
    products,
    favorites,
    navigateTo,
    logoutUser,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'addresses' | 'settings'>('orders');

  // Filter orders for this user (or all if demo testing)
  const myOrders = orders.filter(o => o.userId === currentUser.id || currentUser.role === 'admin' || o.customerEmail === currentUser.email);

  // Filter favorite products
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  // Address modal or editing state
  const [addresses, setAddresses] = useState<ShippingAddress[]>(currentUser.savedAddresses || [
    {
      fullName: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      confirmPhone: currentUser.phone,
      governorate: 'القاهرة',
      city: 'القاهرة',
      district: 'المعادي الجديدة',
      street: 'شارع اللاسلكي',
      buildingNumber: '22',
      apartmentNumber: '4',
      notes: 'أمام كافيه سيلانترو',
    }
  ]);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<ShippingAddress>({
    fullName: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    confirmPhone: currentUser.phone,
    governorate: 'الجيزة',
    city: 'الجيزة',
    district: 'الدقي',
    street: 'شارع مصدق',
    buildingNumber: '10',
    apartmentNumber: '3',
  });

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setAddresses(prev => [...prev, newAddress]);
    setShowAddressForm(false);
    showToast('تمت إضافة العنوان الجديد بنجاح');
  };

  const handleDeleteAddress = (idx: number) => {
    setAddresses(prev => prev.filter((_, i) => i !== idx));
    showToast('تم حذف العنوان');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-bold">قيد الانتظار</span>;
      case 'confirmed':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-bold">تم التأكيد</span>;
      case 'processing':
        return <span className="bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full text-xs font-bold">جاري التجهيز</span>;
      case 'shipped':
        return <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full text-xs font-bold">تم الشحن</span>;
      case 'out_for_delivery':
        return <span className="bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full text-xs font-bold">جاري التوصيل</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold">تم التسليم</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full text-xs font-bold">ملغي</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-right space-y-6">
      
      {/* 1. Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">{currentUser.name}</h1>
              <span className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                {currentUser.role === 'admin' ? 'مدير النظام' : currentUser.role === 'seller' ? 'حساب تاجر / بائع' : 'حساب مشتري'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5" />
                {currentUser.phone}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {currentUser.email}
              </span>
              <span>·</span>
              <span>عضو منذ: {currentUser.joinedDate}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={logoutUser}
          className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-xl border border-rose-200 transition-colors"
        >
          تسجيل الخروج
        </button>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors shrink-0 ${
            activeTab === 'orders'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>طلباتي السابقة ({myOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors shrink-0 ${
            activeTab === 'favorites'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-300" />
          <span>قائمة المفضلة ({favoriteProducts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors shrink-0 ${
            activeTab === 'addresses'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>عناوين الشحن ({addresses.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors shrink-0 ${
            activeTab === 'settings'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>بيانات الحساب</span>
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: My Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {myOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base mb-1">لا توجد طلبات سابقة حتى الآن</h3>
              <p className="text-xs text-slate-400 mb-4">عندما تطلب أي منتج ستتمكن من تتبعه خطوة بخطوة من هنا</p>
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-blue-700"
              >
                تصفح المنتجات وابدأ التسوق
              </button>
            </div>
          ) : (
            myOrders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-400">
                      بتاريخ: {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <button
                      type="button"
                      onClick={() => navigateTo('order-confirmation', undefined, order.id)}
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <span>عرض تفاصيل الطلب</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Ordered Items Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <img
                        src={it.productImage}
                        alt={it.productName}
                        className="w-12 h-12 rounded-lg object-cover bg-white"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 truncate">{it.productName}</p>
                        <p className="text-[11px] text-slate-400">الكمية: {it.quantity} · {it.condition === 'new' ? 'جديد' : 'مستعمل'}</p>
                      </div>
                      <span className="font-bold text-slate-800 shrink-0">{it.price} ج.م</span>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div>
                    طريقة الدفع: <strong className="text-slate-800">{order.paymentMethod === 'cash_on_delivery' ? 'الدفع عند الاستلام' : 'بطاقة ائتمان'}</strong>
                  </div>
                  <div className="font-bold text-slate-900">
                    الإجمالي النهائي: <span className="text-blue-700 text-sm font-black">{order.finalTotal.toLocaleString('ar-EG')} ج.م</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Favorites */}
      {activeTab === 'favorites' && (
        <div>
          {favoriteProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base mb-1">قائمة المفضلة فارغة</h3>
              <p className="text-xs text-slate-400 mb-4">اضغط على علامة القلب على أي منتج لحفظه هنا والرجوع إليه لاحقاً</p>
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-blue-700"
              >
                تصفح المنتجات
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {favoriteProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-800">عناوين التوصيل المسجلة بحسابك</h3>
            <button
              type="button"
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة عنوان جديد</span>
            </button>
          </div>

          {showAddressForm && (
            <form onSubmit={handleAddAddress} className="bg-white p-6 rounded-3xl border border-blue-200 shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-blue-900">إضافة عنوان شحن جديد:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الاسم</label>
                  <input
                    type="text"
                    value={newAddress.fullName}
                    onChange={e => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المحافظة</label>
                  <input
                    type="text"
                    value={newAddress.governorate}
                    onChange={e => setNewAddress({ ...newAddress, governorate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المدينة</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">الشارع</label>
                  <input
                    type="text"
                    value={newAddress.street}
                    onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">عمارة / شقة</label>
                  <input
                    type="text"
                    value={newAddress.buildingNumber}
                    onChange={e => setNewAddress({ ...newAddress, buildingNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  حفظ العنوان
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-2 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-800">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>{addr.district}، {addr.city}</span>
                  </div>
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {addr.street}، عمارة {addr.buildingNumber}، شقة {addr.apartmentNumber}
                </p>
                <p className="text-[11px] text-slate-400">
                  المستلم: {addr.fullName} · هاتف: {addr.phone}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Profile Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs max-w-xl">
          <h3 className="font-bold text-sm text-slate-800 mb-4 pb-2 border-b border-slate-100">
            تعديل بيانات الحساب
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الاسم</label>
              <input
                type="text"
                defaultValue={currentUser.name}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                defaultValue={currentUser.email}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم الموبايل</label>
              <input
                type="tel"
                defaultValue={currentUser.phone}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 text-left"
              />
            </div>

            <button
              type="button"
              onClick={() => showToast('تم حفظ تعديلات الملف الشخصي بنجاح')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors"
            >
              حفظ التغييرات
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
