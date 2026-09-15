import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DEMO_USERS } from '../data/seedData';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginUser,
    registerUser,
    setCurrentUser,
    showToast,
  } = useStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'buyer' | 'seller'>('buyer');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast('يرجى ملء البريد الإلكتروني وكلمة المرور');
      return;
    }
    const success = await loginUser(loginEmail, loginPassword);
    if (success) {
      setIsAuthModalOpen(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone || !regPassword) {
      showToast('يرجى إكمال جميع حقول التسجيل المطلوبة');
      return;
    }
    const success = await registerUser({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      role: regRole,
    });
    if (success) {
      setIsAuthModalOpen(false);
    }
  };

  // Quick Demo Account Switcher for effortless testing
  const handleQuickLogin = (demoUser: typeof DEMO_USERS[0]) => {
    setCurrentUser(demoUser);
    showToast(`تم تسجيل الدخول بحساب: ${demoUser.name} (${demoUser.role})`);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto text-right">
      {/* Backdrop */}
      <div
        onClick={() => setIsAuthModalOpen(false)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 md:p-8 overflow-hidden">
          
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo / Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-2 font-black text-xl shadow-md">
              RD
            </div>
            <h2 className="text-xl font-black text-slate-900">
              {mode === 'login' ? 'تسجيل الدخول إلى روق دولابك' : 'إنشاء حساب جديد'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {mode === 'login'
                ? 'أهلاً بك مجدداً! ادخل بياناتك لمتابعة طلباتك أو البيع'
                : 'انضم لآلاف المتسوقين والبائعين في مصر'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                mode === 'login' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                mode === 'register' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              إنشاء حساب جديد
            </button>
          </div>

          {/* Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
                <div className="relative">
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-left focus:outline-hidden focus:bg-white focus:border-blue-600"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور</label>
                <div className="relative">
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-left focus:outline-hidden focus:bg-white focus:border-blue-600"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-xs mt-2"
              >
                تسجيل الدخول
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الاسم بالكامل</label>
                <input
                  type="text"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  placeholder="محمد أحمد"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden focus:bg-white focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="mohamed@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-left focus:outline-hidden focus:bg-white focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رقم الموبايل</label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  placeholder="01012345678"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-left focus:outline-hidden focus:bg-white focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-left focus:outline-hidden focus:bg-white focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نوع الحساب</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer ${
                    regRole === 'buyer' ? 'border-blue-600 bg-blue-50/50 font-bold' : 'border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      checked={regRole === 'buyer'}
                      onChange={() => setRegRole('buyer')}
                      className="text-blue-600"
                    />
                    <span>مشتري فقط</span>
                  </label>

                  <label className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer ${
                    regRole === 'seller' ? 'border-blue-600 bg-blue-50/50 font-bold' : 'border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      checked={regRole === 'seller'}
                      onChange={() => setRegRole('seller')}
                      className="text-blue-600"
                    />
                    <span>بائع وتاجر</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-xs mt-2"
              >
                إنشاء حساب جديد
              </button>
            </form>
          )}

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 block text-center mb-2">
              أو تسجيل دخول تجريبي سريع بضغطة واحدة:
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => handleQuickLogin(DEMO_USERS[0])}
                className="bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 py-1.5 px-2 rounded-xl transition-colors truncate"
              >
                👤 مشتري (أحمد)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin(DEMO_USERS[1])}
                className="bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 py-1.5 px-2 rounded-xl transition-colors truncate"
              >
                🏪 بائع (سارة)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin(DEMO_USERS[2])}
                className="bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 py-1.5 px-2 rounded-xl transition-colors truncate"
              >
                ⚡ مدير النظام
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
