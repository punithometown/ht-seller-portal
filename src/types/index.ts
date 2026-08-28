export type ProductCategory = 
  | 'Living Room'
  | 'Bedroom'
  | 'Dining Room'
  | 'Study & Office'
  | 'Kitchen & Dining'
  | 'Decor & Accents'
  | 'Lighting'
  | 'Outdoor';

export type ProductStatus = 'Active' | 'Draft' | 'Low Stock' | 'Out of Stock' | 'Archived';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  subCategory: string;
  price: number;
  compareAtPrice?: number;
  costPrice: number;
  stock: number;
  minStockThreshold: number;
  material: string; // e.g., Solid Sheesham Wood, Italian Velvet, Teak, Travertine Marble
  finish: string; // e.g., Honey Walnut, Matte Brass, Charcoal Gray, Natural Teak
  dimensions: {
    widthCm: number;
    depthCm: number;
    heightCm: number;
  };
  weightKg: number;
  roomType: string;
  assemblyRequired: boolean;
  warrantyYears: number;
  status: ProductStatus;
  images: string[];
  description: string;
  warehouse: string;
  tags: string[];
  rating: number;
  salesCount: number;
  createdAt: string;
}

export type OrderStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Carpentry / Production'
  | 'In Production / Carpentry'
  | 'Quality Check'
  | 'Packed & Ready'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Out for White-Glove Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded' | 'Partially Paid';
export type PaymentMethod = 'Credit Card' | 'Wire Transfer' | 'Net Banking' | 'UPI / QR' | 'EMI' | 'Cash on Delivery';

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  image: string;
  category: ProductCategory;
  price: number;
  quantity: number;
  customFinish?: string;
  dimensionsNote?: string;
}

export interface OrderLog {
  id: string;
  timestamp: string;
  status: string;
  description: string;
  actor: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
  courierService?: string;
  estimatedDelivery?: string;
  placedAt: string;
  updatedAt: string;
  customerNotes?: string;
  internalSellerNotes?: string;
  timeline: OrderLog[];
}

export type ClientTier = 'VIP Interior Designer' | 'Commercial Architect' | 'Residential High-Value' | 'Retail Customer';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  company?: string;
  tier: ClientTier;
  addresses: {
    label: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    isDefault: boolean;
  }[];
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  registeredAt: string;
  notes: string;
  preferredStyle: string;
}

export type InventoryLogType = 'SALE' | 'RESTOCK' | 'MANUAL_ADJUSTMENT' | 'DAMAGE_WRITE_OFF' | 'CSV_BATCH_UPDATE';

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: InventoryLogType;
  previousStock: number;
  newStock: number;
  change: number;
  warehouse: string;
  reason: string;
  timestamp: string;
  performedBy: string;
}

export type InquiryCategory = 
  | 'Custom Dimensions & Fit'
  | 'Wood & Fabric Swatches'
  | 'Delivery Schedule & Tracking'
  | 'Assembly & Room Installation'
  | 'Bulk Commercial Pricing'
  | 'Return & Warranty Support';

export type InquiryPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type InquiryStatus = 'New' | 'In Progress' | 'Awaiting Client' | 'Resolved';

export interface InquiryMessage {
  id: string;
  sender: 'Seller Support' | 'Customer';
  senderName: string;
  message: string;
  timestamp: string;
  attachments?: string[];
}

export interface CustomerInquiry {
  id: string;
  inquiryNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  relatedOrderId?: string;
  relatedProductId?: string;
  relatedProductName?: string;
  category: InquiryCategory;
  subject: string;
  priority: InquiryPriority;
  status: InquiryStatus;
  messages: InquiryMessage[];
  createdAt: string;
  updatedAt: string;
  assignedAgent: string;
}

export interface NotificationItem {
  id: string;
  type: 'STOCK_ALERT' | 'NEW_ORDER' | 'NEW_INQUIRY' | 'CSV_IMPORT' | 'SYSTEM';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string; // 'Store Owner / Admin' | 'Warehouse Logistics Lead' | 'Customer Support Specialist' | 'Merchandising Manager'
  storeName: string;
  avatar: string;
  sellerTier: string;
  phone?: string;
  storeId: string;
  lastLoginAt?: string;
}

