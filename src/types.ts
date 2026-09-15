export type ProductCategory =
  | 'clothes'
  | 'shoes-bags'
  | 'electronics'
  | 'phones'
  | 'furniture'
  | 'appliances'
  | 'books'
  | 'accessories'
  | 'other';

export type ProductCondition = 'new' | 'used';

export type ConditionGrade =
  | 'new_sealed'      // جديد بالكرتونة
  | 'used_like_new'   // مستعمل - كالجديد
  | 'used_very_good'  // مستعمل - بحالة جيدة جداً
  | 'used_good';      // مستعمل - بحالة مقبولة

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryNameAr: string;
  condition: ProductCondition;
  conditionGrade: ConditionGrade;
  conditionLabelAr: string;
  conditionDetails?: string; // وصف تفاصيل الاستخدام
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  sellerPhone?: string;
  sellerCity: string;
  availableQuantity: number;
  isFreeShipping: boolean;
  shippingCost?: number;
  featured?: boolean;
  isFlashDeal?: boolean;
  dealEndsAt?: string;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  status: 'approved' | 'pending_approval' | 'rejected';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'pending'           // قيد الانتظار
  | 'confirmed'         // تم التأكيد
  | 'processing'        // جاري التجهيز
  | 'shipped'           // تم الشحن
  | 'out_for_delivery'  // جاري التوصيل
  | 'delivered'         // تم التسليم
  | 'cancelled';        // ملغي

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  confirmPhone: string;
  governorate: string;
  city: string;
  district: string;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
  notes?: string;
}

export type PaymentMethodType = 'cash_on_delivery' | 'credit_card';

export interface PaymentDetails {
  method: PaymentMethodType;
  cardholderName?: string;
  cardNumberLast4?: string;
  transactionId?: string;
  status: 'paid' | 'pending_cod' | 'failed';
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    condition: ProductCondition;
    sellerId: string;
    sellerName: string;
  }[];
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  couponCode?: string;
  finalTotal: number;
  paymentMethod: PaymentMethodType;
  paymentDetails: PaymentDetails;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    noteAr: string;
  }[];
  createdAt: string;
  estimatedDeliveryDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar?: string;
  savedAddresses?: ShippingAddress[];
  storeName?: string;
  storeDescription?: string;
  joinedDate: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  descriptionAr: string;
  active: boolean;
  expiresAt?: string;
}

export interface ShippingRate {
  governorateCode: string;
  governorateNameAr: string;
  baseCost: number;
  estimatedDays: string;
}

export interface CategoryInfo {
  id: ProductCategory;
  nameAr: string;
  iconName: string;
  itemCount: number;
  image: string;
}
