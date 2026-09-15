import React from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Phone,
  Mail,
  MapPin,
  Heart,
  ArrowUp,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/seedData';

export const Footer: React.FC = () => {
  const { navigateTo, setSelectedCategory } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-white mt-16 text-right">
      
      {/* 1. Value Proposition Bar (Jumia-style trust features) */}
      <div className="border-b border-slate-800 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">توصيل سريع لكل مصر</h4>
                <p className="text-xs text-slate-400 mt-0.5">شحن آمن ومباشر لجميع المحافظات حتى باب منزلك</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">معاينة قبل الاستلام</h4>
                <p className="text-xs text-slate-400 mt-0.5">افحص المنتج مع المندوب واطمئن قبل دفع أي قرش</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">ضمان استرجاع 14 يوم</h4>
                <p className="text-xs text-slate-400 mt-0.5">استرداد أموالك 100% في حال عدم مطابقة المواصفات</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">دعم متواصل 24/7</h4>
                <p className="text-xs text-slate-400 mt-0.5">فريق مساعدة وخدمة عملاء عبر الهاتف والواتساب</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md">
                RD
              </div>
              <span className="text-xl font-black text-white">
                روق <span className="text-blue-400">دولابك</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              المنصة المصرية الرائدة لبيع وشراء المنتجات الجديدة والمستعملة بكل أمان وسهولة. سواء كنت تبحث عن صفقات التوفير للبس والموبايلات أو ترغب في ترويق دولابك وتحويل كراكيبك لفلوس كاش!
            </p>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>الخط الساخن: 19555 (دعم فني وتتبع)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>support@rooq-doolabek.eg</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>القاهرة، المعادي - التجمع الخامس، مصر</span>
              </div>
            </div>
          </div>

          {/* Categories Links */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4 pb-2 border-b border-slate-800">
              أقسام التسوق
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {CATEGORIES.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      navigateTo('home');
                    }}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {cat.nameAr}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Buying & Selling */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4 pb-2 border-b border-slate-800">
              البيع والشراء
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('seller-dashboard')}
                  className="hover:text-amber-400 transition-colors text-amber-300 font-semibold"
                >
                  ابدأ البيع وروق دولابك كاش
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="hover:text-blue-400 transition-colors"
                >
                  عروض وتخفيضات اليوم
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('profile')}
                  className="hover:text-blue-400 transition-colors"
                >
                  تتبع حالة طلبي
                </button>
              </li>
              <li>
                <span className="hover:text-blue-400 cursor-pointer">شروط حماية المشتري</span>
              </li>
              <li>
                <span className="hover:text-blue-400 cursor-pointer">إرشادات تسعير المستعمل</span>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4 pb-2 border-b border-slate-800">
              وسائل الدفع المعتمدة
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              نوفر طرق دفع مرنة تناسب كافة العملاء في مصر:
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-bold">
              <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-md border border-slate-700">
                💵 كاش عند الاستلام
              </span>
              <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-md border border-slate-700">
                💳 فيزا / ماستركارد
              </span>
              <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-md border border-slate-700">
                🇪🇬 كارت ميزة Meeza
              </span>
              <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-md border border-slate-700">
                📱 فودافون كاش ومحافظ إلكترونية
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Copyright & Back to Top */}
      <div className="border-t border-slate-800/80 bg-slate-950 py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} منصة <strong className="text-slate-300">روق دولابك</strong> للتجارة الإلكترونية.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-xl"
          >
            <span>الرجوع لأعلى الصفحة</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </footer>
  );
};
