import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  User,
  Coupon,
  ShippingRate,
  ProductCategory,
  OrderStatus,
  ShippingAddress,
  PaymentMethodType,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_SHIPPING_RATES,
  DEMO_USERS,
} from '../data/seedData';

type ViewMode =
  | 'home'
  | 'product-details'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'profile'
  | 'seller-dashboard'
  | 'admin-dashboard';

interface StoreContextType {
  // Navigation & View
  currentView: ViewMode;
  navigateTo: (view: ViewMode, productId?: string, orderId?: string) => void;
  selectedProductId: string | null;
  activeOrderId: string | null;

  // Products & Filtering
  products: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: ProductCategory | 'all';
  setSelectedCategory: (cat: ProductCategory | 'all') => void;
  selectedCondition: 'all' | 'new' | 'used';
  setSelectedCondition: (cond: 'all' | 'new' | 'used') => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'discount';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'discount') => void;

  // Cart & Calculations
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  cartCount: number;
  subtotal: number;
  calculatedShippingCost: number;
  discountAmount: number;
  finalTotal: number;

  // Shipping & Coupon
  selectedGovernorate: string;
  setSelectedGovernorate: (gov: string) => void;
  shippingRates: ShippingRate[];
  activeCoupon: Coupon | null;
  couponError: string | null;
  applyCouponCode: (code: string) => Promise<boolean>;
  removeCoupon: () => void;

  // Wishlist
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // User & Auth
  currentUser: User;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginAsDemoUser: (role: 'buyer' | 'seller' | 'admin') => void;
  loginUser: (emailOrPhone: string) => boolean;
  registerUser: (name: string, email: string, phone: string, role: 'buyer' | 'seller') => void;
  logoutUser: () => void;

  // Orders
  orders: Order[];
  createOrder: (data: {
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentMethodType;
    cardDetails?: {
      cardNumber: string;
      cardholderName: string;
      expiryDate: string;
      cvv: string;
    };
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, noteAr?: string) => Promise<void>;

  // Product Management (Seller/Admin)
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount' | 'status'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedCondition, setSelectedCondition] = useState<'all' | 'new' | 'used'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest' | 'discount'>('featured');

  // UI State
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Main Data States with localStorage initializers
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('roq_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('roq_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('roq_favs');
    return saved ? JSON.parse(saved) : ['prod_1', 'prod_4'];
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('roq_user');
    return saved ? JSON.parse(saved) : DEMO_USERS[0];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('roq_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [shippingRates] = useState<ShippingRate[]>(INITIAL_SHIPPING_RATES);
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('cairo');
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('roq_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('roq_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('roq_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('roq_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('roq_orders', JSON.stringify(orders));
  }, [orders]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  // Navigation Helper
  const navigateTo = (view: ViewMode, productId?: string, orderId?: string) => {
    if (productId) setSelectedProductId(productId);
    if (orderId) setActiveOrderId(orderId);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  // Determine shipping cost
  // Free shipping rule: order over 500 EGP or all items have isFreeShipping
  const allItemsFreeShipping = cart.length > 0 && cart.every(i => i.product.isFreeShipping);
  const isFreeThreshold = subtotal >= 500;
  
  const currentGovRate = shippingRates.find(r => r.governorateCode === selectedGovernorate)?.baseCost || 35;
  const calculatedShippingCost = (cart.length === 0 || allItemsFreeShipping || isFreeThreshold) ? 0 : currentGovRate;

  // Calculate discount amount from active coupon
  let discountAmount = 0;
  if (activeCoupon) {
    if (activeCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * activeCoupon.discountValue) / 100);
    } else {
      discountAmount = Math.min(activeCoupon.discountValue, subtotal);
    }
  }

  // Formula: Subtotal + Shipping - Discount = Final Total
  const finalTotal = Math.max(0, subtotal + calculatedShippingCost - discountAmount);

  // Cart Management
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.availableQuantity);
        showToast(`تم تحديث كمية "${product.name}" في عربة التسوق`);
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        showToast(`تمت إضافة "${product.name}" إلى عربة التسوق بنجاح`);
        return [...prev, { product, quantity: Math.min(quantity, product.availableQuantity) }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('تم حذف المنتج من عربة التسوق');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const clamped = Math.min(quantity, item.product.availableQuantity);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  // Coupon Engine
  const applyCouponCode = async (code: string): Promise<boolean> => {
    const trimmed = code.trim().toUpperCase();
    setCouponError(null);

    if (!trimmed) {
      setCouponError('يرجى إدخال كود الكوبون');
      return false;
    }

    // Call server or check initial coupons
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed, orderSubtotal: subtotal }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        const matchedCoupon: Coupon = {
          code: data.code,
          discountType: 'percentage',
          discountValue: 10,
          minOrderValue: 200,
          descriptionAr: data.descriptionAr,
          active: true,
        };
        setActiveCoupon(matchedCoupon);
        showToast(`تم تطبيق كوبون الخصم بنجاح! وفرت ${data.discountAmount} ج.م`);
        return true;
      } else {
        // Local fallback check
        const local = INITIAL_COUPONS.find(c => c.code === trimmed && c.active);
        if (local) {
          if (subtotal < local.minOrderValue) {
            setCouponError(`الحد الأدنى للطلب لتطبيق هذا الكوبون هو ${local.minOrderValue} ج.م`);
            return false;
          }
          setActiveCoupon(local);
          showToast(`تم تطبيق كوبون الخصم: ${local.descriptionAr}`);
          return true;
        }
        setCouponError(data.error || 'كود الكوبون غير صحيح أو غير مفعل');
        return false;
      }
    } catch {
      const local = INITIAL_COUPONS.find(c => c.code === trimmed && c.active);
      if (local) {
        if (subtotal < local.minOrderValue) {
          setCouponError(`الحد الأدنى لتطبيق الكوبون ${local.minOrderValue} ج.م`);
          return false;
        }
        setActiveCoupon(local);
        showToast(`تم تطبيق كوبون الخصم: ${local.descriptionAr}`);
        return true;
      }
      setCouponError('كود الكوبون غير صحيح');
      return false;
    }
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    setCouponError(null);
    showToast('تمت إزالة كود الخصم');
  };

  // Favorites
  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('تمت إزالة المنتج من المفضلة');
        return prev.filter(id => id !== productId);
      } else {
        showToast('تمت إضافة المنتج إلى قائمة المفضلة ❤️');
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // Authentication
  const loginAsDemoUser = (role: 'buyer' | 'seller' | 'admin') => {
    const user = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    showToast(`مرحباً بك مجدداً يا ${user.name} (${user.role === 'admin' ? 'مسؤول النظام' : user.role === 'seller' ? 'بائع' : 'مشتري'})`);
  };

  const loginUser = (emailOrPhone: string) => {
    const existing = DEMO_USERS.find(
      u => u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone === emailOrPhone
    );
    if (existing) {
      setCurrentUser(existing);
      setIsAuthModalOpen(false);
      showToast(`تم تسجيل الدخول بنجاح! أهلاً ${existing.name}`);
      return true;
    }
    // Create new buyer profile if not recognized
    const newUser: User = {
      id: 'user_' + Date.now(),
      name: emailOrPhone.split('@')[0] || 'عميل روق دولابك',
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@user.com`,
      phone: emailOrPhone.includes('@') ? '01000000000' : emailOrPhone,
      role: 'buyer',
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    showToast(`تم إنشاء حساب جديد بنجاح! أهلاً ${newUser.name}`);
    return true;
  };

  const registerUser = (name: string, email: string, phone: string, role: 'buyer' | 'seller') => {
    const newUser: User = {
      id: 'user_' + Date.now(),
      name,
      email,
      phone,
      role,
      joinedDate: new Date().toISOString().split('T')[0],
      storeName: role === 'seller' ? `متجر ${name}` : undefined,
    };
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    showToast(`تم إنشاء حساب ${role === 'seller' ? 'بائع' : 'مشتري'} جديد بنجاح!`);
  };

  const logoutUser = () => {
    setCurrentUser(DEMO_USERS[0]);
    showToast('تم تسجيل الخروج بنجاح');
    navigateTo('home');
  };

  // Orders creation
  const createOrder = async ({
    shippingAddress,
    paymentMethod,
    cardDetails,
  }: {
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentMethodType;
    cardDetails?: {
      cardNumber: string;
      cardholderName: string;
      expiryDate: string;
      cvv: string;
    };
  }): Promise<Order> => {
    const orderNum = 'RQ-' + Math.floor(100000 + Math.random() * 900000);
    const estimatedDaysText = shippingRates.find(r => r.governorateCode === selectedGovernorate)?.estimatedDays || '2-3 أيام';

    // Payment verification if card
    let transactionId: string | undefined;
    if (paymentMethod === 'credit_card' && cardDetails) {
      transactionId = 'TXN_' + Date.now().toString(36).toUpperCase();
    }

    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      orderNumber: orderNum,
      userId: currentUser.id,
      customerName: shippingAddress.fullName,
      customerEmail: shippingAddress.email,
      customerPhone: shippingAddress.phone,
      shippingAddress,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0],
        price: item.product.price,
        quantity: item.quantity,
        condition: item.product.condition,
        sellerId: item.product.sellerId,
        sellerName: item.product.sellerName,
      })),
      subtotal,
      shippingCost: calculatedShippingCost,
      discountAmount,
      couponCode: activeCoupon?.code,
      finalTotal,
      paymentMethod,
      paymentDetails: {
        method: paymentMethod,
        cardholderName: cardDetails?.cardholderName,
        cardNumberLast4: cardDetails?.cardNumber ? cardDetails.cardNumber.slice(-4) : undefined,
        transactionId,
        status: paymentMethod === 'credit_card' ? 'paid' : 'pending_cod',
      },
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          noteAr: 'تم استلام طلبك وجاري مراجعته من قبل إدارة روق دولابك',
        }
      ],
      createdAt: new Date().toISOString(),
      estimatedDeliveryDate: estimatedDaysText,
    };

    // Update stock of purchased items
    setProducts(prev =>
      prev.map(prod => {
        const cartMatch = cart.find(c => c.product.id === prod.id);
        if (cartMatch) {
          const newQty = Math.max(0, prod.availableQuantity - cartMatch.quantity);
          return { ...prod, availableQuantity: newQty };
        }
        return prod;
      })
    );

    // Save order locally and send to server API
    setOrders(prev => [newOrder, ...prev]);
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
    } catch {
      // Ignored: local storage handles persistence
    }

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, noteAr?: string) => {
    const note = noteAr || `تم تغيير حالة الطلب إلى: ${status}`;
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            statusHistory: [
              ...ord.statusHistory,
              { status, timestamp: new Date().toISOString(), noteAr: note },
            ],
          };
        }
        return ord;
      })
    );

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, noteAr: note }),
      });
    } catch {
      // Handled locally
    }
    showToast('تم تحديث حالة الطلب بنجاح');
  };

  // Product CRUD
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount' | 'status'>) => {
    const newProd: Product = {
      ...productData,
      id: 'prod_' + Date.now(),
      createdAt: new Date().toISOString(),
      rating: 5.0,
      reviewsCount: 1,
      status: 'approved',
    };
    setProducts(prev => [newProd, ...prev]);
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      });
    } catch {
      // Local fallback
    }
    showToast('تم نشر منتجك الجديد بنجاح في سوق روق دولابك!');
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch {
      // Local fallback
    }
    showToast('تم تعديل بيانات المنتج بنجاح');
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch {
      // Local fallback
    }
    showToast('تم حذف المنتج بنجاح');
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        navigateTo,
        selectedProductId,
        activeOrderId,
        products,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedCondition,
        setSelectedCondition,
        sortBy,
        setSortBy,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        cartCount,
        subtotal,
        calculatedShippingCost,
        discountAmount,
        finalTotal,
        selectedGovernorate,
        setSelectedGovernorate,
        shippingRates,
        activeCoupon,
        couponError,
        applyCouponCode,
        removeCoupon,
        favorites,
        toggleFavorite,
        isFavorite,
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginAsDemoUser,
        loginUser,
        registerUser,
        logoutUser,
        orders,
        createOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
