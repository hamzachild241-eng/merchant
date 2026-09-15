import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_SHIPPING_RATES, DEMO_USERS } from './src/data/seedData';
import { Product, Order, Coupon, ShippingRate, User } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store with seeds
let products: Product[] = [...INITIAL_PRODUCTS];
let coupons: Coupon[] = [...INITIAL_COUPONS];
let shippingRates: ShippingRate[] = [...INITIAL_SHIPPING_RATES];
let users: User[] = [...DEMO_USERS];
let orders: Order[] = [
  {
    id: 'ord_demo_1',
    orderNumber: 'RQ-2026-9812',
    userId: 'user_buyer_1',
    customerName: 'أحمد محمود كمال',
    customerEmail: 'ahmed@example.com',
    customerPhone: '01012345678',
    shippingAddress: {
      fullName: 'أحمد محمود كمال',
      email: 'ahmed@example.com',
      phone: '01012345678',
      confirmPhone: '01012345678',
      governorate: 'cairo',
      city: 'القاهرة',
      district: 'المعادي',
      street: 'شارع النصر، دجلة',
      buildingNumber: '14',
      apartmentNumber: '5',
      notes: 'بجوار صيدلية العزبي',
    },
    items: [
      {
        productId: 'prod_1',
        productName: 'جاكيت زارا أصلي شتوي مبطن صوف كلاسيك',
        productImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700&auto=format&fit=crop&q=80',
        price: 850,
        quantity: 1,
        condition: 'used',
        sellerId: 'user_seller_1',
        sellerName: 'دولاب سارة للملابس الراقية',
      }
    ],
    subtotal: 850,
    shippingCost: 0,
    discountAmount: 85,
    couponCode: 'ROQ10',
    finalTotal: 765,
    paymentMethod: 'cash_on_delivery',
    paymentDetails: {
      method: 'cash_on_delivery',
      status: 'pending_cod',
    },
    status: 'shipped',
    statusHistory: [
      { status: 'pending', timestamp: '2026-09-14T10:00:00Z', noteAr: 'تم استلام الطلب وبانتظار المراجعة' },
      { status: 'confirmed', timestamp: '2026-09-14T10:30:00Z', noteAr: 'تم تأكيد الطلب مع المشتري هاتفياً' },
      { status: 'processing', timestamp: '2026-09-14T12:00:00Z', noteAr: 'تم استلام الشحنة وتغليفها من البائع' },
      { status: 'shipped', timestamp: '2026-09-15T08:00:00Z', noteAr: 'الشحنة مع مندوب التوصيل في طريقها للمشتري' },
    ],
    createdAt: '2026-09-14T10:00:00Z',
    estimatedDeliveryDate: '2026-09-16',
  }
];

// ----------------------------------------------------
// API Endpoints
// ----------------------------------------------------

// 1. Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', store: 'روق دولابك', timestamp: new Date().toISOString() });
});

// 2. Products API
app.get('/api/products', (req, res) => {
  let filtered = [...products];
  const { category, condition, search, sellerId } = req.query;

  if (category && typeof category === 'string' && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }
  if (condition && typeof condition === 'string' && condition !== 'all') {
    filtered = filtered.filter(p => p.condition === condition);
  }
  if (sellerId && typeof sellerId === 'string') {
    filtered = filtered.filter(p => p.sellerId === sellerId);
  }
  if (search && typeof search === 'string') {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      p => p.name.toLowerCase().includes(q) ||
           p.description.toLowerCase().includes(q) ||
           p.categoryNameAr.toLowerCase().includes(q)
    );
  }

  res.json({ products: filtered });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'المنتج غير موجود' });
  }
  res.json({ product });
});

app.post('/api/products', (req, res) => {
  const newProduct: Product = {
    ...req.body,
    id: 'prod_' + Date.now(),
    createdAt: new Date().toISOString(),
    rating: 5.0,
    reviewsCount: 1,
    status: 'approved',
  };
  products.unshift(newProduct);
  res.status(201).json({ product: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'المنتج غير موجود' });
  }
  products[index] = { ...products[index], ...req.body };
  res.json({ product: products[index] });
});

app.delete('/api/products/:id', (req, res) => {
  products = products.filter(p => p.id !== req.params.id);
  res.json({ success: true, message: 'تم حذف المنتج بنجاح' });
});

// 3. Orders API
app.get('/api/orders', (req, res) => {
  const { userId, sellerId } = req.query;
  let result = [...orders];

  if (userId && typeof userId === 'string') {
    result = result.filter(o => o.userId === userId);
  }
  if (sellerId && typeof sellerId === 'string') {
    result = result.filter(o => o.items.some(item => item.sellerId === sellerId));
  }

  res.json({ orders: result });
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'الطلب غير موجود' });
  }
  res.json({ order });
});

app.post('/api/orders', (req, res) => {
  const orderData = req.body;
  const orderNumber = 'RQ-' + Math.floor(100000 + Math.random() * 900000);
  
  const newOrder: Order = {
    ...orderData,
    id: 'ord_' + Date.now(),
    orderNumber,
    createdAt: new Date().toISOString(),
    status: 'pending',
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date().toISOString(),
        noteAr: 'تم استلام طلبك بنجاح وسيتم مراجعته وتأكيده خلال ساعات قليلة',
      }
    ],
  };

  orders.unshift(newOrder);

  // Simulated email dispatch log
  console.log(`[Order Email Simulation] Confirmation sent to ${newOrder.customerEmail} for order ${newOrder.orderNumber}`);

  res.status(201).json({
    order: newOrder,
    message: 'تم إرسال تأكيد الطلب بنجاح إلى بريدك الإلكتروني',
  });
});

app.put('/api/orders/:id/status', (req, res) => {
  const { status, noteAr } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'الطلب غير موجود' });
  }

  order.status = status;
  order.statusHistory.push({
    status,
    timestamp: new Date().toISOString(),
    noteAr: noteAr || `تم تحديث حالة الطلب إلى: ${status}`,
  });

  res.json({ order });
});

// 4. Coupons API
app.get('/api/coupons', (_req, res) => {
  res.json({ coupons });
});

app.post('/api/coupons/validate', (req, res) => {
  const { code, orderSubtotal } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'يرجى إدخال كود الخصم' });
  }

  const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);
  if (!coupon) {
    return res.status(404).json({ error: 'كود الخصم غير صالح أو منتهي الصلاحية' });
  }

  if (orderSubtotal < coupon.minOrderValue) {
    return res.status(400).json({
      error: `الحد الأدنى للطلب لتطبيق هذا الكوبون هو ${coupon.minOrderValue} ج.م`,
    });
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((orderSubtotal * coupon.discountValue) / 100);
  } else {
    discount = coupon.discountValue;
  }

  res.json({
    valid: true,
    code: coupon.code,
    discountAmount: discount,
    descriptionAr: coupon.descriptionAr,
  });
});

app.post('/api/coupons', (req, res) => {
  const newCoupon: Coupon = {
    ...req.body,
    code: req.body.code.trim().toUpperCase(),
    active: true,
  };
  coupons.push(newCoupon);
  res.status(201).json({ coupon: newCoupon });
});

app.delete('/api/coupons/:code', (req, res) => {
  coupons = coupons.filter(c => c.code !== req.params.code);
  res.json({ success: true });
});

// 5. Shipping Rates API
app.get('/api/shipping-rates', (_req, res) => {
  res.json({ shippingRates });
});

app.put('/api/shipping-rates/:code', (req, res) => {
  const rate = shippingRates.find(r => r.governorateCode === req.params.code);
  if (!rate) {
    return res.status(404).json({ error: 'المحافظة غير موجودة' });
  }
  rate.baseCost = req.body.baseCost ?? rate.baseCost;
  rate.estimatedDays = req.body.estimatedDays ?? rate.estimatedDays;
  res.json({ rate });
});

// 6. Payment Processing Simulation (Stripe / Paymob compliant)
app.post('/api/payment/process', (req, res) => {
  const { cardNumber, cardholderName, expiryDate, cvv, amount } = req.body;

  if (!cardNumber || !cardholderName || !expiryDate || !cvv) {
    return res.status(400).json({ success: false, error: 'يرجى إكمال جميع بيانات البطاقة' });
  }

  // Tokenization simulation: never store raw card, return secure token
  const cleanNum = cardNumber.replace(/\s+/g, '');
  const last4 = cleanNum.slice(-4);
  const transactionId = 'TXN_EGY_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

  // Simulate payment gateway validation
  setTimeout(() => {
    res.json({
      success: true,
      transactionId,
      cardholderName,
      cardNumberLast4: last4,
      amount,
      currency: 'EGP',
      status: 'approved',
      gateway: 'Paymob / Stripe Egypt Secure Processing',
      message: 'تمت عملية الدفع بنجاح وأمان',
    });
  }, 300);
});

// 7. Users API
app.get('/api/users', (_req, res) => {
  res.json({ users });
});

// 8. Admin Overview Stats
app.get('/api/admin/stats', (_req, res) => {
  const totalSales = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.finalTotal : 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalSellers = users.filter(u => u.role === 'seller').length;

  res.json({
    totalSales,
    totalOrders,
    totalProducts,
    totalUsers,
    totalSellers,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
  });
});

// ----------------------------------------------------
// Vite Server Integration
// ----------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`روق دولابك Backend Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
