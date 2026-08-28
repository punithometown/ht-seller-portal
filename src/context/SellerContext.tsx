import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Product, 
  Client, 
  Order, 
  CustomerInquiry, 
  InventoryLog, 
  NotificationItem,
  OrderStatus,
  InquiryStatus,
  InquiryPriority,
  AuthUser
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CLIENTS, 
  INITIAL_ORDERS, 
  INITIAL_INQUIRIES, 
  INITIAL_INVENTORY_LOGS 
} from '../data/mockData';

export const DEMO_USERS: AuthUser[] = [
  {
    id: 'usr-1',
    name: 'Alex Henderson',
    email: 'alex@hometown-furniture.com',
    role: 'Store Owner / Admin',
    storeName: 'Alex Modern Furnishings',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    sellerTier: 'Diamond Merchant Partner',
    phone: '+1 (555) 382-9912',
    storeId: 'HT-STORE-8821',
    lastLoginAt: 'Today, 08:30 AM'
  },
  {
    id: 'usr-2',
    name: 'Marcus Vance',
    email: 'marcus.v@hometown-logistics.com',
    role: 'Warehouse Logistics Lead',
    storeName: 'Central Logistics Hub',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    sellerTier: 'Supply Chain Operations',
    phone: '+1 (555) 441-2098',
    storeId: 'HT-WH-04',
    lastLoginAt: 'Today, 07:15 AM'
  },
  {
    id: 'usr-3',
    name: 'Elena Rostova',
    email: 'elena.r@hometown-care.com',
    role: 'Customer Support Specialist',
    storeName: 'HomeTown Client Concierge',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    sellerTier: 'Client Success Specialist',
    phone: '+1 (555) 782-3344',
    storeId: 'HT-CARE-09',
    lastLoginAt: 'Yesterday, 04:20 PM'
  }
];

interface SellerContextType {
  products: Product[];
  clients: Client[];
  orders: Order[];
  inquiries: CustomerInquiry[];
  inventoryLogs: InventoryLog[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  activeWarehouse: string;
  setActiveWarehouse: (wh: string) => void;
  currency: string;
  setCurrency: (c: string) => void;
  
  // Auth state & actions
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string, rememberMe?: boolean) => { success: boolean; error?: string };
  logout: () => void;
  switchUser: (user: AuthUser) => void;
  updateUserProfile: (updates: Partial<AuthUser>) => void;

  // Real-time engine
  realTimeSync: boolean;
  setRealTimeSync: (val: boolean) => void;
  triggerSimulatedSale: () => void;
  triggerSimulatedRestock: () => void;
  
  // Product Actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'salesCount' | 'rating'>) => Product;
  bulkAddProducts: (productsList: Omit<Product, 'id' | 'createdAt' | 'salesCount' | 'rating'>[]) => number;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  importProductsFromCSV: (parsedProducts: any[]) => { successCount: number; errors: string[] };

  // Inventory Actions
  updateProductStock: (productId: string, newStock: number, reason: string, warehouse?: string) => void;
  importInventoryFromCSV: (rows: { sku: string; newStock: number; warehouse?: string; reason?: string }[]) => { updated: number; failed: string[] };
  
  // Order Actions
  updateOrderStatus: (orderId: string, status: OrderStatus, actor?: string, description?: string) => void;
  updateOrderNotes: (orderId: string, internalNotes?: string, customerNotes?: string) => void;
  getClientOrders: (clientId: string) => Order[];

  // Client Actions
  updateClientNotes: (clientId: string, notes: string) => void;
  
  // Inquiry Actions
  replyToInquiry: (inquiryId: string, message: string, senderName?: string) => void;
  updateInquiryStatus: (inquiryId: string, status: InquiryStatus) => void;
  updateInquiryPriority: (inquiryId: string, priority: InquiryPriority) => void;
  
  // Notifications
  markAllNotificationsRead: () => void;
  dismissNotification: (id: string) => void;
  addToast: (title: string, message: string, type?: NotificationItem['type']) => void;
  activeToast: { title: string; message: string; type: NotificationItem['type'] } | null;
  clearActiveToast: () => void;
}

const SellerContext = createContext<SellerContextType | null>(null);

export const WAREHOUSES = [
  'All Warehouses',
  'Central Warehouse - Hub A',
  'North Hub - Sector 4',
  'West Depot - Unit 2',
  'South Depot - Bay 1'
];

export const SellerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage initialization with safety fallbacks
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('hometown_products_v2');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem('hometown_clients_v2');
      return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('hometown_orders_v2');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('hometown_inquiries_v2');
      return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
    } catch {
      return INITIAL_INQUIRIES;
    }
  });

  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(() => {
    try {
      const saved = localStorage.getItem('hometown_inv_logs_v2');
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY_LOGS;
    } catch {
      return INITIAL_INVENTORY_LOGS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'STOCK_ALERT',
      title: 'Low Stock Alert',
      message: 'Valhalla Solid Sheesham Table is at 6 units (Threshold: 8)',
      timestamp: '10 mins ago',
      read: false,
      link: '/inventory'
    },
    {
      id: 'notif-2',
      type: 'NEW_ORDER',
      title: 'New VIP Order #HT-8948',
      message: 'Rohan & Tara Mehta ordered Travertine Table & Verona Armchairs ($2,467.97)',
      timestamp: '25 mins ago',
      read: false,
      link: '/orders'
    },
    {
      id: 'notif-3',
      type: 'NEW_INQUIRY',
      title: 'Urgent Client Inquiry',
      message: 'Vikramaditya Oberoi requested resort elevator crate clearance for Goa project',
      timestamp: '1 hour ago',
      read: false,
      link: '/inquiries'
    }
  ]);

  const [activeWarehouse, setActiveWarehouse] = useState<string>('All Warehouses');
  const [currency, setCurrency] = useState<string>('$');
  const [realTimeSync, setRealTimeSync] = useState<boolean>(true);
  const [activeToast, setActiveToast] = useState<{ title: string; message: string; type: NotificationItem['type'] } | null>(null);

  // Auth State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('hometown_auth_user');
      if (saved) return JSON.parse(saved);
      return DEMO_USERS[0];
    } catch {
      return DEMO_USERS[0];
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('hometown_is_authenticated');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const addToast = useCallback((title: string, message: string, type: NotificationItem['type'] = 'SYSTEM') => {
    setActiveToast({ title, message, type });
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 29)]);
  }, []);

  const login = useCallback((email: string, password = '', rememberMe = true) => {
    const cleanEmail = email.trim().toLowerCase();
    
    let matchedUser = DEMO_USERS.find(u => u.email.toLowerCase() === cleanEmail);
    
    if (!matchedUser) {
      if (cleanEmail.includes('@')) {
        const namePart = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        matchedUser = {
          id: `usr-${Date.now()}`,
          name: formattedName || 'Authorized Merchant',
          email: cleanEmail,
          role: 'Store Owner / Admin',
          storeName: `${formattedName}'s Furniture Studio`,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
          sellerTier: 'Verified Merchant Tier',
          phone: '+1 (555) 019-2831',
          storeId: `HT-STORE-${Math.floor(1000 + Math.random() * 9000)}`,
          lastLoginAt: 'Just now'
        };
      } else {
        return { success: false, error: 'Please enter a valid merchant email or select a demo profile.' };
      }
    }

    const updatedUser = {
      ...matchedUser,
      lastLoginAt: 'Just now'
    };

    setCurrentUser(updatedUser);
    setIsAuthenticated(true);

    if (rememberMe) {
      try {
        localStorage.setItem('hometown_auth_user', JSON.stringify(updatedUser));
        localStorage.setItem('hometown_is_authenticated', JSON.stringify(true));
      } catch (e) {
        console.error(e);
      }
    }

    addToast('Authentication Verified', `Welcome back, ${updatedUser.name} (${updatedUser.storeName})`, 'SYSTEM');
    return { success: true };
  }, [addToast]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem('hometown_is_authenticated', JSON.stringify(false));
    } catch (e) {
      console.error(e);
    }
    addToast('Logged Out', 'Your merchant session has ended safely.', 'SYSTEM');
  }, [addToast]);

  const switchUser = useCallback((user: AuthUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('hometown_auth_user', JSON.stringify(user));
      localStorage.setItem('hometown_is_authenticated', JSON.stringify(true));
    } catch (e) {
      console.error(e);
    }
    addToast('Profile Switched', `Active session: ${user.name} (${user.role})`, 'SYSTEM');
  }, [addToast]);

  const updateUserProfile = useCallback((updates: Partial<AuthUser>) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('hometown_auth_user', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    addToast('Profile Updated', 'Merchant credentials and settings updated.', 'SYSTEM');
  }, [addToast]);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('hometown_products_v2', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('hometown_orders_v2', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('hometown_inquiries_v2', JSON.stringify(inquiries));
    } catch (e) {
      console.error(e);
    }
  }, [inquiries]);

  useEffect(() => {
    try {
      localStorage.setItem('hometown_inv_logs_v2', JSON.stringify(inventoryLogs));
    } catch (e) {
      console.error(e);
    }
  }, [inventoryLogs]);

  const clearActiveToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  // Real-Time Simulated Inventory Updates Engine
  useEffect(() => {
    if (!realTimeSync) return;

    const interval = setInterval(() => {
      // 25% chance every 24s to simulate an incoming ecommerce purchase or stock adjustment
      const roll = Math.random();
      if (roll < 0.25) {
        triggerSimulatedSale();
      }
    }, 28000);

    return () => clearInterval(interval);
  }, [realTimeSync, products, clients]);

  const triggerSimulatedSale = useCallback(() => {
    if (products.length === 0) return;
    const eligibleProducts = products.filter(p => p.stock > 0);
    if (eligibleProducts.length === 0) return;

    const randomProduct = eligibleProducts[Math.floor(Math.random() * eligibleProducts.length)];
    const randomClient = clients[Math.floor(Math.random() * clients.length)];
    const quantity = Math.min(randomProduct.stock, Math.floor(Math.random() * 2) + 1);

    const newStock = randomProduct.stock - quantity;
    const newStatus = newStock === 0 ? 'Out of Stock' : newStock <= randomProduct.minStockThreshold ? 'Low Stock' : 'Active';

    // Update Product Stock
    setProducts(prev => prev.map(p => {
      if (p.id === randomProduct.id) {
        return {
          ...p,
          stock: newStock,
          status: newStatus,
          salesCount: p.salesCount + quantity
        };
      }
      return p;
    }));

    // Create Order
    const subtotal = randomProduct.price * quantity;
    const tax = Number((subtotal * 0.09).toFixed(2));
    const totalAmount = subtotal + tax;
    const newOrderNumber = `HT-ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      clientId: randomClient.id,
      clientName: randomClient.name,
      clientEmail: randomClient.email,
      clientPhone: randomClient.phone,
      shippingAddress: randomClient.addresses[0] || {
        street: '100 Luxury Avenue',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
        country: 'India'
      },
      items: [
        {
          productId: randomProduct.id,
          productName: randomProduct.name,
          sku: randomProduct.sku,
          image: randomProduct.images[0] || '',
          category: randomProduct.category,
          price: randomProduct.price,
          quantity
        }
      ],
      subtotal,
      shippingFee: 0,
      tax,
      discount: 0,
      totalAmount,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card',
      trackingNumber: `HT-LIVE-SYNC-${Math.floor(1000 + Math.random() * 9000)}`,
      courierService: 'HomeTown Express Fulfillment',
      placedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerNotes: 'Automated live checkout sync from HomeTown web boutique',
      timeline: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Confirmed',
          description: 'Live order received via HomeTown Web Store',
          actor: 'Online Storefront'
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update Client metrics
    setClients(prev => prev.map(c => {
      if (c.id === randomClient.id) {
        return {
          ...c,
          totalOrders: c.totalOrders + 1,
          totalSpent: c.totalSpent + totalAmount,
          lastOrderDate: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    }));

    // Log inventory event
    const log: InventoryLog = {
      id: `inv-log-${Date.now()}`,
      productId: randomProduct.id,
      productName: randomProduct.name,
      sku: randomProduct.sku,
      type: 'SALE',
      previousStock: randomProduct.stock,
      newStock,
      change: -quantity,
      warehouse: randomProduct.warehouse,
      reason: `Live Sale: Order #${newOrderNumber} (${randomClient.name})`,
      timestamp: new Date().toLocaleString(),
      performedBy: 'Real-Time Store Sync'
    };

    setInventoryLogs(prev => [log, ...prev]);

    addToast(
      'Live Store Sale Processed!',
      `${randomClient.name} purchased ${quantity}x ${randomProduct.name} ($${totalAmount.toLocaleString()}). Stock updated: ${newStock} units left.`,
      'NEW_ORDER'
    );
  }, [products, clients, addToast]);

  const triggerSimulatedRestock = useCallback(() => {
    if (products.length === 0) return;
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const addUnits = 10;
    const newStock = randomProduct.stock + addUnits;

    setProducts(prev => prev.map(p => {
      if (p.id === randomProduct.id) {
        return {
          ...p,
          stock: newStock,
          status: 'Active'
        };
      }
      return p;
    }));

    const log: InventoryLog = {
      id: `inv-log-${Date.now()}`,
      productId: randomProduct.id,
      productName: randomProduct.name,
      sku: randomProduct.sku,
      type: 'RESTOCK',
      previousStock: randomProduct.stock,
      newStock,
      change: addUnits,
      warehouse: randomProduct.warehouse,
      reason: 'Factory production batch arrival PO #FCT-AUTO',
      timestamp: new Date().toLocaleString(),
      performedBy: 'Automated Warehouse Dispatch'
    };

    setInventoryLogs(prev => [log, ...prev]);

    addToast(
      'Inventory Restocked',
      `+${addUnits} units received for ${randomProduct.name}. New available stock: ${newStock}`,
      'STOCK_ALERT'
    );
  }, [products, addToast]);

  // Product Actions
  const addProduct = useCallback((productData: Omit<Product, 'id' | 'createdAt' | 'salesCount' | 'rating'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      salesCount: 0,
      rating: 5.0
    };

    setProducts(prev => [newProduct, ...prev]);

    // Add inventory log
    const log: InventoryLog = {
      id: `inv-log-${Date.now()}`,
      productId: newProduct.id,
      productName: newProduct.name,
      sku: newProduct.sku,
      type: 'RESTOCK',
      previousStock: 0,
      newStock: newProduct.stock,
      change: newProduct.stock,
      warehouse: newProduct.warehouse,
      reason: 'Initial Product Catalogue Listing',
      timestamp: new Date().toLocaleString(),
      performedBy: 'Seller Portal Admin'
    };

    setInventoryLogs(prev => [log, ...prev]);

    addToast('Product Published', `${newProduct.name} (${newProduct.sku}) added to catalog.`, 'SYSTEM');
    return newProduct;
  }, [addToast]);

  const bulkAddProducts = useCallback((productsList: Omit<Product, 'id' | 'createdAt' | 'salesCount' | 'rating'>[]): number => {
    const now = new Date().toISOString().split('T')[0];
    const createdProducts: Product[] = productsList.map((p, idx) => ({
      ...p,
      id: `prod-${Date.now()}-${idx}`,
      createdAt: now,
      salesCount: 0,
      rating: 5.0
    }));

    setProducts(prev => [...createdProducts, ...prev]);

    const newLogs: InventoryLog[] = createdProducts.map(p => ({
      id: `inv-log-${Date.now()}-${p.id}`,
      productId: p.id,
      productName: p.name,
      sku: p.sku,
      type: 'CSV_BATCH_UPDATE',
      previousStock: 0,
      newStock: p.stock,
      change: p.stock,
      warehouse: p.warehouse,
      reason: 'Bulk Product Batch Import',
      timestamp: new Date().toLocaleString(),
      performedBy: 'Bulk Importer'
    }));

    setInventoryLogs(prev => [...newLogs, ...prev]);
    addToast('Bulk Import Success', `Successfully loaded ${createdProducts.length} new furniture items to catalog.`, 'CSV_IMPORT');
    return createdProducts.length;
  }, [addToast]);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updates };
        if (updates.stock !== undefined) {
          updated.status = updated.stock === 0 ? 'Out of Stock' : updated.stock <= updated.minStockThreshold ? 'Low Stock' : 'Active';
        }
        return updated;
      }
      return p;
    }));
    addToast('Product Updated', `Changes saved successfully.`, 'SYSTEM');
  }, [addToast]);

  const deleteProduct = useCallback((id: string) => {
    const target = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    addToast('Product Removed', `${target?.name || 'Product'} has been deleted from catalog.`, 'SYSTEM');
  }, [products, addToast]);

  const importProductsFromCSV = useCallback((parsedProducts: any[]): { successCount: number; errors: string[] } => {
    const errors: string[] = [];
    const validToAdd: Omit<Product, 'id' | 'createdAt' | 'salesCount' | 'rating'>[] = [];

    parsedProducts.forEach((row, idx) => {
      const rowNum = idx + 2; // account for header
      if (!row.sku || !row.name) {
        errors.push(`Row ${rowNum}: SKU and Product Name are mandatory.`);
        return;
      }
      const price = Number(row.price);
      if (isNaN(price) || price <= 0) {
        errors.push(`Row ${rowNum} (${row.sku}): Price must be a valid positive number.`);
        return;
      }
      const stock = Number(row.stock || 0);

      validToAdd.push({
        sku: String(row.sku).trim().toUpperCase(),
        name: String(row.name).trim(),
        category: (row.category || 'Living Room') as any,
        subCategory: row.subCategory || 'Furniture',
        price,
        compareAtPrice: row.compareAtPrice ? Number(row.compareAtPrice) : undefined,
        costPrice: row.costPrice ? Number(row.costPrice) : Math.round(price * 0.45),
        stock: isNaN(stock) ? 0 : stock,
        minStockThreshold: row.minStockThreshold ? Number(row.minStockThreshold) : 5,
        material: row.material || 'Solid Wood & Upholstery',
        finish: row.finish || 'Natural Finish',
        dimensions: {
          widthCm: Number(row.widthCm) || 120,
          depthCm: Number(row.depthCm) || 80,
          heightCm: Number(row.heightCm) || 75
        },
        weightKg: Number(row.weightKg) || 30,
        roomType: row.roomType || 'Living Room',
        assemblyRequired: String(row.assemblyRequired).toLowerCase() === 'yes' || String(row.assemblyRequired).toLowerCase() === 'true',
        warrantyYears: Number(row.warrantyYears) || 3,
        status: stock === 0 ? 'Out of Stock' : stock <= (Number(row.minStockThreshold) || 5) ? 'Low Stock' : 'Active',
        images: row.imageUrl ? [row.imageUrl] : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'],
        description: row.description || 'Premium HomeTown designer furniture crafted with precision materials.',
        warehouse: row.warehouse || 'Central Warehouse - Hub A',
        tags: row.tags ? String(row.tags).split(',').map(t => t.trim()) : ['New Arrival', 'HomeTown Collection']
      });
    });

    if (validToAdd.length > 0) {
      bulkAddProducts(validToAdd);
    }

    return {
      successCount: validToAdd.length,
      errors
    };
  }, [bulkAddProducts]);

  // Inventory Actions
  const updateProductStock = useCallback((productId: string, newStock: number, reason: string, warehouse?: string) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;

    const previousStock = target.stock;
    const change = newStock - previousStock;
    const updatedStatus = newStock === 0 ? 'Out of Stock' : newStock <= target.minStockThreshold ? 'Low Stock' : 'Active';

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          stock: newStock,
          status: updatedStatus,
          warehouse: warehouse || p.warehouse
        };
      }
      return p;
    }));

    const log: InventoryLog = {
      id: `inv-log-${Date.now()}`,
      productId: target.id,
      productName: target.name,
      sku: target.sku,
      type: change > 0 ? 'RESTOCK' : 'MANUAL_ADJUSTMENT',
      previousStock,
      newStock,
      change,
      warehouse: warehouse || target.warehouse,
      reason: reason || 'Manual Seller stock adjustment',
      timestamp: new Date().toLocaleString(),
      performedBy: 'Merchant Staff'
    };

    setInventoryLogs(prev => [log, ...prev]);

    addToast('Inventory Updated', `${target.name} stock set to ${newStock} (${change >= 0 ? '+' : ''}${change} change).`, 'STOCK_ALERT');
  }, [products, addToast]);

  const importInventoryFromCSV = useCallback((rows: { sku: string; newStock: number; warehouse?: string; reason?: string }[]) => {
    let updated = 0;
    const failed: string[] = [];
    const newLogs: InventoryLog[] = [];

    setProducts(prev => {
      return prev.map(prod => {
        const match = rows.find(r => r.sku?.trim().toUpperCase() === prod.sku?.trim().toUpperCase());
        if (match && !isNaN(Number(match.newStock))) {
          const qty = Number(match.newStock);
          const prevQty = prod.stock;
          const change = qty - prevQty;
          updated++;

          newLogs.push({
            id: `inv-log-${Date.now()}-${prod.id}`,
            productId: prod.id,
            productName: prod.name,
            sku: prod.sku,
            type: 'CSV_BATCH_UPDATE',
            previousStock: prevQty,
            newStock: qty,
            change,
            warehouse: match.warehouse || prod.warehouse,
            reason: match.reason || 'Bulk Inventory CSV Adjustment',
            timestamp: new Date().toLocaleString(),
            performedBy: 'CSV Inventory Sync'
          });

          return {
            ...prod,
            stock: qty,
            status: qty === 0 ? 'Out of Stock' : qty <= prod.minStockThreshold ? 'Low Stock' : 'Active',
            warehouse: match.warehouse || prod.warehouse
          };
        }
        return prod;
      });
    });

    if (newLogs.length > 0) {
      setInventoryLogs(prev => [...newLogs, ...prev]);
    }

    // Check which SKUs failed
    rows.forEach(r => {
      const exists = products.some(p => p.sku?.trim().toUpperCase() === r.sku?.trim().toUpperCase());
      if (!exists) {
        failed.push(`SKU '${r.sku}' was not found in catalog.`);
      }
    });

    addToast('Inventory CSV Processed', `Updated ${updated} items. ${failed.length > 0 ? `${failed.length} SKUs not found.` : ''}`, 'CSV_IMPORT');

    return { updated, failed };
  }, [products, addToast]);

  // Order Actions
  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus, actor = 'Seller Admin', description?: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const defaultDesc = `Order status moved to '${status}'`;
        const newLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
          status,
          description: description || defaultDesc,
          actor
        };
        return {
          ...ord,
          status,
          updatedAt: new Date().toISOString(),
          timeline: [...ord.timeline, newLog]
        };
      }
      return ord;
    }));
    addToast('Order Status Updated', `Order status changed to ${status}`, 'NEW_ORDER');
  }, [addToast]);

  const updateOrderNotes = useCallback((orderId: string, internalNotes?: string, customerNotes?: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          internalSellerNotes: internalNotes !== undefined ? internalNotes : ord.internalSellerNotes,
          customerNotes: customerNotes !== undefined ? customerNotes : ord.customerNotes
        };
      }
      return ord;
    }));
    addToast('Notes Saved', 'Order notes successfully updated.', 'SYSTEM');
  }, [addToast]);

  const getClientOrders = useCallback((clientId: string): Order[] => {
    return orders.filter(o => o.clientId === clientId);
  }, [orders]);

  const updateClientNotes = useCallback((clientId: string, notes: string) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, notes } : c));
    addToast('Client Profile Updated', 'Customer notes updated.', 'SYSTEM');
  }, [addToast]);

  // Inquiry Actions
  const replyToInquiry = useCallback((inquiryId: string, messageText: string, senderName = 'HomeTown Furniture Specialist') => {
    setInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        const newMsg = {
          id: `msg-${Date.now()}`,
          sender: 'Seller Support' as const,
          senderName,
          message: messageText,
          timestamp: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        };
        return {
          ...inq,
          status: 'Awaiting Client' as const,
          updatedAt: new Date().toISOString(),
          messages: [...inq.messages, newMsg]
        };
      }
      return inq;
    }));
    addToast('Reply Dispatched', 'Response sent to client.', 'NEW_INQUIRY');
  }, [addToast]);

  const updateInquiryStatus = useCallback((inquiryId: string, status: InquiryStatus) => {
    setInquiries(prev => prev.map(inq => inq.id === inquiryId ? { ...inq, status, updatedAt: new Date().toISOString() } : inq));
    addToast('Inquiry Status', `Inquiry moved to ${status}`, 'NEW_INQUIRY');
  }, [addToast]);

  const updateInquiryPriority = useCallback((inquiryId: string, priority: InquiryPriority) => {
    setInquiries(prev => prev.map(inq => inq.id === inquiryId ? { ...inq, priority } : inq));
  }, []);

  // Notifications
  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <SellerContext.Provider
      value={{
        products,
        clients,
        orders,
        inquiries,
        inventoryLogs,
        notifications,
        unreadNotificationsCount,
        activeWarehouse,
        setActiveWarehouse,
        currency,
        setCurrency,
        currentUser,
        isAuthenticated,
        login,
        logout,
        switchUser,
        updateUserProfile,
        realTimeSync,
        setRealTimeSync,
        triggerSimulatedSale,
        triggerSimulatedRestock,
        addProduct,
        bulkAddProducts,
        updateProduct,
        deleteProduct,
        importProductsFromCSV,
        updateProductStock,
        importInventoryFromCSV,
        updateOrderStatus,
        updateOrderNotes,
        getClientOrders,
        updateClientNotes,
        replyToInquiry,
        updateInquiryStatus,
        updateInquiryPriority,
        markAllNotificationsRead,
        dismissNotification,
        addToast,
        activeToast,
        clearActiveToast
      }}
    >
      {children}
    </SellerContext.Provider>
  );
};

export const useSeller = () => {
  const context = useContext(SellerContext);
  if (!context) {
    throw new Error('useSeller must be used within a SellerProvider');
  }
  return context;
};
