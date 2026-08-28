import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Download, 
  Send, 
  Layers, 
  Terminal, 
  FileSpreadsheet, 
  ShieldCheck, 
  ExternalLink,
  PlusCircle,
  Copy,
  Check,
  Zap,
  Globe,
  Store,
  KeyRound,
  Sparkles,
  ShoppingBag,
  Package,
  TrendingUp,
  Sliders,
  DollarSign,
  Edit3,
  Truck,
  XCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Code2,
  ListOrdered,
  Eye,
  FileCheck
} from 'lucide-react';
import { shopifyApi, ShopifyShop, ShopifyStatus, WebhookSubscription } from '../services/shopifyApi';
import { useSeller } from '../context/SellerContext';

export const ShopifyHubPage: React.FC = () => {
  const { addToast, triggerSimulatedSale, currency } = useSeller();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'e2e' | 'credentials' | 'orders' | 'products' | 'pricing-inventory' | 'graphql'>('e2e');

  // Diagnostic State
  const [status, setStatus] = useState<ShopifyStatus | null>(null);
  const [shop, setShop] = useState<ShopifyShop | null>(null);
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // E2E Test Suite State
  const [isRunningE2E, setIsRunningE2E] = useState<boolean>(false);
  const [e2eResults, setE2eResults] = useState<{
    timestamp: string;
    totalTests: number;
    passed: number;
    failed: number;
    durationMs: number;
    steps: Array<{
      step: number;
      name: string;
      description: string;
      status: 'PASSED' | 'FAILED';
      latencyMs: number;
      responseSummary?: any;
      error?: string;
    }>;
  } | null>(null);
  const [selectedStepDetail, setSelectedStepDetail] = useState<any | null>(null);

  // Real Credentials Form State
  const [testCreds, setTestCreds] = useState({
    shop: '',
    clientId: '',
    clientSecret: '',
    accessToken: ''
  });
  const [isTestingCreds, setIsTestingCreds] = useState(false);
  const [credsTestResult, setCredsTestResult] = useState<any | null>(null);

  // Orders Live State
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderNoteInput, setOrderNoteInput] = useState('');
  const [orderTagsInput, setOrderTagsInput] = useState('');
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  // Products Live State
  const [productsList, setProductsList] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [editProductTitle, setEditProductTitle] = useState('');
  const [editProductTags, setEditProductTags] = useState('');
  const [editProductStatus, setEditProductStatus] = useState('ACTIVE');
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);

  // Single Variant Price / Inventory State
  const [singleVariantSku, setSingleVariantSku] = useState('HT-LIV-SOF-01');
  const [singleVariantPrice, setSingleVariantPrice] = useState('84999');
  const [singleVariantComparePrice, setSingleVariantComparePrice] = useState('99999');
  const [singleVariantStock, setSingleVariantStock] = useState('14');
  const [singleVariantCost, setSingleVariantCost] = useState('45000');
  const [isUpdatingSingleVariant, setIsUpdatingSingleVariant] = useState(false);

  // Bulk Price & Inventory State
  const [bulkPricePercent, setBulkPricePercent] = useState('5');
  const [bulkStockDelta, setBulkStockDelta] = useState('5');
  const [isExecutingBulk, setIsExecutingBulk] = useState(false);
  const [bulkResultsSummary, setBulkResultsSummary] = useState<any | null>(null);

  // GraphQL Console State
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/shop');
  const [apiResponse, setApiResponse] = useState<string>('');
  const [isCallingApi, setIsCallingApi] = useState<boolean>(false);
  const [apiLatency, setApiLatency] = useState<number | null>(null);

  // Webhook State
  const [isRegisteringWebhook, setIsRegisteringWebhook] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  // Initial Data Load
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, shopRes, webhooksRes, ordersRes, productsRes] = await Promise.all([
        shopifyApi.getStatus().catch(() => null),
        shopifyApi.getShop().catch(() => null),
        shopifyApi.listWebhooks().catch(() => []),
        shopifyApi.getOrders({ limit: 10 }).catch(() => ({ orders: [] })),
        shopifyApi.getProducts({ limit: 10 }).catch(() => ({ products: [] }))
      ]);

      if (statusRes) setStatus(statusRes);
      if (shopRes) setShop(shopRes);
      if (webhooksRes) setWebhooks(webhooksRes);
      if (ordersRes?.orders) setOrdersList(ordersRes.orders);
      if (productsRes?.products) setProductsList(productsRes.products);
    } catch (err: any) {
      console.error(err);
      addToast('API Error', 'Failed to synchronize with Shopify OMS service.', 'SYSTEM');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 2000);
    addToast('Copied to Clipboard', text, 'SYSTEM');
  };

  // Run Full E2E Test Suite
  const handleRunE2ETest = async () => {
    setIsRunningE2E(true);
    try {
      const res = await shopifyApi.runE2ETestSuite();
      setE2eResults(res);
      if (res.failed === 0) {
        addToast('E2E Test Passed', `All ${res.totalTests} Shopify OMS API operations verified in ${res.durationMs}ms!`, 'SYSTEM');
      } else {
        addToast('E2E Test Completed', `${res.passed} passed, ${res.failed} failed. Check step details.`, 'ALERT');
      }
      // Refresh local lists
      await loadData();
    } catch (err: any) {
      addToast('E2E Test Failure', err.message || 'Execution error', 'ALERT');
    } finally {
      setIsRunningE2E(false);
    }
  };

  // Test Real Credentials
  const handleTestCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTestingCreds(true);
    try {
      const res = await shopifyApi.testCredentials(testCreds);
      setCredsTestResult(res);
      if (res.ok) {
        addToast('Credentials Verified', res.message || 'Successfully tested connection!', 'SYSTEM');
      } else {
        addToast('Verification Warning', res.error || 'Check domain and credentials.', 'ALERT');
      }
    } catch (err: any) {
      addToast('Test Failed', err.message, 'ALERT');
    } finally {
      setIsTestingCreds(false);
    }
  };

  // Update Order
  const handleUpdateOrderSubmit = async () => {
    if (!selectedOrder) return;
    setIsUpdatingOrder(true);
    try {
      const tagsArray = orderTagsInput.split(',').map(t => t.trim()).filter(Boolean);
      const res = await shopifyApi.updateOrder(selectedOrder.id, {
        note: orderNoteInput,
        tags: tagsArray
      });
      addToast('Order Updated', `Updated notes and tags on ${selectedOrder.name || selectedOrder.id}`, 'SYSTEM');
      // Refresh list
      const ordersRes = await shopifyApi.getOrders({ limit: 10 });
      if (ordersRes?.orders) setOrdersList(ordersRes.orders);
      setSelectedOrder(null);
    } catch (err: any) {
      addToast('Order Update Error', err.message, 'ALERT');
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  // Fulfill Order
  const handleFulfillOrder = async (orderId: string) => {
    try {
      await shopifyApi.fulfillOrder(orderId, {
        trackingCompany: 'HomeTown White-Glove Express',
        trackingNumber: `HT-DEL-${Math.floor(100000 + Math.random() * 900000)}`
      });
      addToast('Order Fulfilled', `Order marked as fulfilled with tracking generated.`, 'SYSTEM');
      const ordersRes = await shopifyApi.getOrders({ limit: 10 });
      if (ordersRes?.orders) setOrdersList(ordersRes.orders);
      if (selectedOrder) setSelectedOrder(null);
    } catch (err: any) {
      addToast('Fulfillment Error', err.message, 'ALERT');
    }
  };

  // Cancel Order
  const handleCancelOrder = async (orderId: string) => {
    try {
      await shopifyApi.cancelOrder(orderId, {
        reason: 'CUSTOMER',
        note: 'Customer requested order cancellation before dispatch'
      });
      addToast('Order Cancelled', `Order cancelled and marked as refunded.`, 'SYSTEM');
      const ordersRes = await shopifyApi.getOrders({ limit: 10 });
      if (ordersRes?.orders) setOrdersList(ordersRes.orders);
      if (selectedOrder) setSelectedOrder(null);
    } catch (err: any) {
      addToast('Cancel Error', err.message, 'ALERT');
    }
  };

  // Update Product
  const handleUpdateProductSubmit = async () => {
    if (!selectedProduct) return;
    setIsUpdatingProduct(true);
    try {
      const tagsArray = editProductTags.split(',').map(t => t.trim()).filter(Boolean);
      await shopifyApi.updateProduct(selectedProduct.id, {
        title: editProductTitle,
        status: editProductStatus,
        tags: tagsArray
      });
      addToast('Product Updated', `Updated title, tags, and status for ${editProductTitle}`, 'SYSTEM');
      const productsRes = await shopifyApi.getProducts({ limit: 10 });
      if (productsRes?.products) setProductsList(productsRes.products);
      setSelectedProduct(null);
    } catch (err: any) {
      addToast('Product Update Error', err.message, 'ALERT');
    } finally {
      setIsUpdatingProduct(false);
    }
  };

  // Single Variant Price & Inventory Update
  const handleSingleVariantUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingSingleVariant(true);
    try {
      const res = await shopifyApi.updateSingleVariant({
        sku: singleVariantSku,
        price: parseFloat(singleVariantPrice),
        compareAtPrice: parseFloat(singleVariantComparePrice),
        inventoryQuantity: parseInt(singleVariantStock, 10),
        cost: parseFloat(singleVariantCost)
      });
      addToast(
        'Variant Synced',
        `SKU ${singleVariantSku} price updated to ₹${singleVariantPrice} and stock to ${singleVariantStock} units!`,
        'SYSTEM'
      );
      // Reload products
      const productsRes = await shopifyApi.getProducts({ limit: 10 });
      if (productsRes?.products) setProductsList(productsRes.products);
    } catch (err: any) {
      addToast('Variant Update Error', err.message, 'ALERT');
    } finally {
      setIsUpdatingSingleVariant(false);
    }
  };

  // Bulk Inventory & Price Adjuster
  const handleBulkAdjust = async (type: 'percentage' | 'stock') => {
    setIsExecutingBulk(true);
    try {
      const payload: any = {};
      if (type === 'percentage') {
        payload.priceDeltaPercent = parseFloat(bulkPricePercent);
      } else {
        payload.stockDelta = parseInt(bulkStockDelta, 10);
      }

      const res = await shopifyApi.bulkUpdateInventoryPrice(payload);
      setBulkResultsSummary(res);
      addToast(
        'Bulk Matrix Sync Complete',
        `Processed ${res.totalProcessed} variants (${res.successCount} succeeded, ${res.failedCount} failed).`,
        'SYSTEM'
      );
      const productsRes = await shopifyApi.getProducts({ limit: 10 });
      if (productsRes?.products) setProductsList(productsRes.products);
    } catch (err: any) {
      addToast('Bulk Update Error', err.message, 'ALERT');
    } finally {
      setIsExecutingBulk(false);
    }
  };

  // GraphQL Console Execute
  const executeApiTest = async () => {
    setIsCallingApi(true);
    const start = performance.now();
    try {
      let data: any;
      if (selectedEndpoint === '/api/shop') {
        data = await shopifyApi.getShop();
      } else if (selectedEndpoint === '/api/orders') {
        data = await shopifyApi.getOrders({ limit: 10 });
      } else if (selectedEndpoint === '/api/products') {
        data = await shopifyApi.getProducts({ limit: 10 });
      } else if (selectedEndpoint === '/api/webhooks') {
        data = await shopifyApi.listWebhooks();
      } else if (selectedEndpoint === '/api/shopify/status') {
        data = await shopifyApi.getStatus();
      }
      const duration = Math.round(performance.now() - start);
      setApiLatency(duration);
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      const duration = Math.round(performance.now() - start);
      setApiLatency(duration);
      setApiResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsCallingApi(false);
    }
  };

  // Register Webhook
  const handleRegisterWebhook = async () => {
    setIsRegisteringWebhook(true);
    try {
      await shopifyApi.setupWebhook();
      addToast('Webhook Registered', 'ORDERS_CREATE subscription confirmed.', 'SYSTEM');
      const updated = await shopifyApi.listWebhooks();
      setWebhooks(updated);
    } catch (err: any) {
      addToast('Webhook Setup Notice', err.message || 'Could not register webhook.', 'SYSTEM');
    } finally {
      setIsRegisteringWebhook(false);
    }
  };

  // Simulate Webhook Order Event
  const handleSendTestWebhook = async () => {
    setIsTestingWebhook(true);
    try {
      const sampleWebhookPayload = {
        id: 994821000 + Math.floor(Math.random() * 10000),
        name: `#HT-LIVE-${Math.floor(1000 + Math.random() * 9000)}`,
        created_at: new Date().toISOString(),
        currency: shop?.currencyCode || 'INR',
        total_price: '84999.00',
        financial_status: 'paid',
        fulfillment_status: 'unfulfilled',
        tags: 'Shopify-Webhook-Live, VIP Customer',
        note: 'White glove apartment delivery scheduled via HomeTown web store',
        customer: {
          id: 771239,
          first_name: 'Ananya',
          last_name: 'Deshmukh',
          email: 'ananya.deshmukh@luxuryliving.in',
          phone: '+91 98200 44119'
        },
        line_items: [
          {
            id: 88102,
            title: 'Ashley 3 Seater Bouclé Curved Sofa',
            sku: 'HT-LIV-SOF-01',
            price: '84999.00',
            quantity: 1
          }
        ]
      };

      const ok = await shopifyApi.triggerTestWebhookOrder(sampleWebhookPayload);
      if (ok) {
        addToast(
          'Shopify Webhook Dispatched',
          `Captured incoming order ${sampleWebhookPayload.name} (₹84,999 INR). Syncing panel ledgers!`,
          'NEW_ORDER'
        );
        triggerSimulatedSale();
        const ordersRes = await shopifyApi.getOrders({ limit: 10 });
        if (ordersRes?.orders) setOrdersList(ordersRes.orders);
      }
    } catch (err: any) {
      addToast('Webhook Simulation Error', err.message, 'SYSTEM');
    } finally {
      setIsTestingWebhook(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#24150E] tracking-tight">
              HT-OMS Shopify API & Verification Center
            </h2>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF2EB] text-[#C84B22] border border-[#FCD2BF] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D84C1C] animate-pulse"></span>
              <span>Shopify Admin GraphQL 2026-07</span>
            </span>
          </div>
          <p className="text-xs text-[#7A6454] mt-1">
            Complete verification suite for Orders, Catalog, Product/Variant Updates, Single & Bulk Price/Inventory Sync.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleRunE2ETest}
            disabled={isRunningE2E}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D84C1C] hover:bg-[#BF3E12] text-white text-xs font-bold shadow-md hover:shadow-lg transition disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isRunningE2E ? 'animate-spin' : ''}`} />
            <span>{isRunningE2E ? 'Executing E2E Suite...' : 'Run Full 10-Point E2E Verification'}</span>
          </button>

          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F3ECE2] hover:bg-[#EBE2D5] text-[#3E291C] border border-[#E0D2C3] text-xs font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Diagnostics</span>
          </button>

          <a
            href={shopifyApi.getTemplateDownloadUrl()}
            download="product-upload-template.csv"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-[#FAF8F5] text-[#3E291C] border border-[#E0D2C3] text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Template</span>
          </a>
        </div>
      </div>

      {/* Top Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Connection Status */}
        <div className="bg-white rounded-xl p-4 border border-[#E7DDD3] shadow-[0_1px_3px_rgba(36,21,14,0.04)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8A7363] uppercase tracking-wider">Gateway Status</span>
            <span className={`w-2 h-2 rounded-full ${status?.isShopifyConfigured ? 'bg-emerald-500' : 'bg-[#D84C1C]'} animate-pulse`} />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-lg font-black text-[#24150E]">
              {status?.isShopifyConfigured ? 'Live Shopify API' : 'Integrated OMS Active'}
            </h3>
          </div>
          <p className="text-[11px] text-[#7A6454]">
            {status?.isShopifyConfigured 
              ? `Connected to ${status.shop}` 
              : 'Standalone mode with active GraphQL & Webhook engine'}
          </p>
        </div>

        {/* Card 2: Storefront Identity */}
        <div className="bg-white rounded-xl p-4 border border-[#E7DDD3] shadow-[0_1px_3px_rgba(36,21,14,0.04)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8A7363] uppercase tracking-wider">Shopify Store</span>
            <Store className="w-3.5 h-3.5 text-[#D84C1C]" />
          </div>
          <h3 className="text-sm font-bold text-[#24150E] truncate">
            {shop?.name || 'HomeTown Furniture'}
          </h3>
          <p className="text-[11px] text-[#7A6454] truncate font-mono">
            {shop?.myshopifyDomain || status?.shop}
          </p>
        </div>

        {/* Card 3: Currency & Plan */}
        <div className="bg-white rounded-xl p-4 border border-[#E7DDD3] shadow-[0_1px_3px_rgba(36,21,14,0.04)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8A7363] uppercase tracking-wider">Store Plan & Currency</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FFF2EB] text-[#C84B22]">
              {shop?.currencyCode || 'INR'}
            </span>
          </div>
          <h3 className="text-sm font-bold text-[#24150E]">
            {shop?.plan?.publicDisplayName || 'Shopify Plus / Enterprise'}
          </h3>
          <p className="text-[11px] text-[#7A6454]">
            Weight: {shop?.weightUnit || 'KILOGRAMS'} • {shop?.ianaTimezone || 'Asia/Kolkata'}
          </p>
        </div>

        {/* Card 4: Webhooks Active */}
        <div className="bg-white rounded-xl p-4 border border-[#E7DDD3] shadow-[0_1px_3px_rgba(36,21,14,0.04)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8A7363] uppercase tracking-wider">Live Webhooks</span>
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          </div>
          <h3 className="text-lg font-black text-[#24150E]">
            {webhooks.length} Active Subscriptions
          </h3>
          <p className="text-[11px] text-[#7A6454]">
            Topic: ORDERS_CREATE active
          </p>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E7DDD3] bg-white p-1 rounded-xl shadow-xs overflow-x-auto">
        {[
          { id: 'e2e', label: 'E2E Automated Verification', icon: Sparkles, badge: e2eResults ? `${e2eResults.passed}/${e2eResults.totalTests}` : undefined },
          { id: 'credentials', label: 'Real Credentials Validator', icon: KeyRound },
          { id: 'orders', label: 'Orders Studio', icon: ShoppingBag, count: ordersList.length },
          { id: 'products', label: 'Products Studio', icon: Package, count: productsList.length },
          { id: 'pricing-inventory', label: 'Single & Bulk Price/Inventory', icon: Sliders },
          { id: 'graphql', label: 'GraphQL Console & Webhook', icon: Terminal }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-[#24150E] text-white shadow-xs'
                  : 'text-[#6B5546] hover:bg-[#FAF7F2] hover:text-[#24150E]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFA88B]' : 'text-[#8A7363]'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-bold">
                  {tab.badge}
                </span>
              )}
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-[#3E291C] text-[#FFA88B]' : 'bg-[#EFE7DE] text-[#7A6454]'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: E2E Automated Verification */}
      {activeTab === 'e2e' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E7DDD3] p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F3ECE2]">
              <div>
                <h3 className="text-base font-bold text-[#24150E] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#D84C1C]" />
                  <span>10-Point End-to-End Shopify OMS Integration Test Suite</span>
                </h3>
                <p className="text-xs text-[#7A6454] mt-0.5">
                  Validates live Shopify API communication, orders stream, order details, order mutations, product catalog, product updates, single variant price/inventory changes, bulk price/inventory adjustments, and webhook capture.
                </p>
              </div>

              <button
                onClick={handleRunE2ETest}
                disabled={isRunningE2E}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D84C1C] hover:bg-[#BF3E12] text-white text-xs font-bold shadow-sm transition disabled:opacity-50 shrink-0"
              >
                <Sparkles className={`w-4 h-4 ${isRunningE2E ? 'animate-spin' : ''}`} />
                <span>{isRunningE2E ? 'Running Full Suite...' : 'Execute All 10 Tests'}</span>
              </button>
            </div>

            {/* Test Results Summary Banner */}
            {e2eResults && (
              <div className={`mt-4 p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                e2eResults.failed === 0 
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
                  : 'bg-amber-50/80 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                    e2eResults.failed === 0 ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                  }`}>
                    {e2eResults.failed === 0 ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-black">
                      {e2eResults.failed === 0 
                        ? 'All Test Cases Passed Successfully!' 
                        : `${e2eResults.passed} Passed, ${e2eResults.failed} Failed`}
                    </h4>
                    <p className="text-xs opacity-80 mt-0.5">
                      Completed 10 verification steps in {e2eResults.durationMs}ms at {new Date(e2eResults.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold">
                  <div className="px-3 py-1.5 rounded-lg bg-white/80 border border-current">
                    Passed: <span className="text-emerald-700 font-mono">{e2eResults.passed}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-white/80 border border-current">
                    Failed: <span className="text-rose-700 font-mono">{e2eResults.failed}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-white/80 border border-current font-mono">
                    {e2eResults.durationMs} ms
                  </div>
                </div>
              </div>
            )}

            {/* Test Step Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {(e2eResults?.steps || [
                { step: 1, name: 'Shop & Authentication Verification', description: 'Query store metadata and credentials via /api/shop' },
                { step: 2, name: 'Get Products Catalog', description: 'Query products catalog with pagination and variant nodes via /api/products' },
                { step: 3, name: 'Get Product Detail by ID', description: 'Retrieve complete product fields and options' },
                { step: 4, name: 'Product Update', description: 'Update product title, tags, and status' },
                { step: 5, name: 'Single Variant Price & Inventory Update', description: 'Update SKU price and stock level via /api/variants/single-update' },
                { step: 6, name: 'Bulk Price & Inventory Matrix Update', description: 'Apply batch price (+5%) and stock adjustment across catalog' },
                { step: 7, name: 'Get Orders Stream', description: 'Query all active orders via /api/orders' },
                { step: 8, name: 'Get Order Detail by ID', description: 'Retrieve line items, shipping address, and total amounts' },
                { step: 9, name: 'Order Update (Note & VIP Tags)', description: 'Update order notes and customer tags via /api/orders/:id/update' },
                { step: 10, name: 'Webhook Pipeline Verification', description: 'Check registered webhook subscriptions and simulated capture' }
              ]).map((stepItem: any) => {
                const isPassed = stepItem.status === 'PASSED';
                const isFailed = stepItem.status === 'FAILED';
                return (
                  <div 
                    key={stepItem.step}
                    onClick={() => stepItem.responseSummary && setSelectedStepDetail(stepItem)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer ${
                      isPassed 
                        ? 'bg-[#FAF8F5] border-emerald-200 hover:border-emerald-300' 
                        : isFailed 
                          ? 'bg-rose-50/60 border-rose-200' 
                          : 'bg-[#FAF8F5] border-[#E7DDD3] hover:border-[#D84C1C]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          isPassed 
                            ? 'bg-emerald-600 text-white' 
                            : isFailed 
                              ? 'bg-rose-600 text-white' 
                              : 'bg-[#E7DDD3] text-[#3E291C]'
                        }`}>
                          {stepItem.step}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#24150E] truncate">
                            {stepItem.name}
                          </h4>
                          <p className="text-[11px] text-[#7A6454] mt-0.5 line-clamp-2">
                            {stepItem.description}
                          </p>
                        </div>
                      </div>

                      {stepItem.status && (
                        <div className="shrink-0 flex flex-col items-end gap-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {stepItem.status}
                          </span>
                          {stepItem.latencyMs !== undefined && (
                            <span className="text-[10px] text-[#8A7363] font-mono">
                              {stepItem.latencyMs}ms
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {stepItem.responseSummary && (
                      <div className="mt-2 pt-2 border-t border-[#EAE0D5] flex items-center justify-between text-[10px] text-[#8A7363]">
                        <span className="truncate font-mono">
                          Output: {JSON.stringify(stepItem.responseSummary).slice(0, 45)}...
                        </span>
                        <span className="text-[#D84C1C] font-semibold flex items-center gap-0.5 shrink-0">
                          <span>Inspect Payload</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Real Credentials Validator */}
      {activeTab === 'credentials' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#E7DDD3] p-5 shadow-xs space-y-4">
            <div className="border-b border-[#F3ECE2] pb-3">
              <h3 className="text-sm font-bold text-[#24150E] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#D84C1C]" />
                <span>Shopify Custom Store & Credentials Handshake Test</span>
              </h3>
              <p className="text-xs text-[#7A6454] mt-0.5">
                Verify real shop credentials or API tokens against the Shopify GraphQL Admin API on-the-fly.
              </p>
            </div>

            <form onSubmit={handleTestCredentials} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#24150E] block mb-1">
                  Shopify Store Domain (myshopify.com)
                </label>
                <input
                  type="text"
                  placeholder="e.g. hometown-flagship.myshopify.com"
                  value={testCreds.shop}
                  onChange={(e) => setTestCreds({ ...testCreds, shop: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E0D2C3] focus:border-[#D84C1C] focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#24150E] block mb-1">
                    Client ID / API Key (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="shpat_xxxx or client_id"
                    value={testCreds.clientId}
                    onChange={(e) => setTestCreds({ ...testCreds, clientId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#E0D2C3] focus:border-[#D84C1C] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#24150E] block mb-1">
                    Client Secret (Optional)
                  </label>
                  <input
                    type="password"
                    placeholder="shpss_xxxx"
                    value={testCreds.clientSecret}
                    onChange={(e) => setTestCreds({ ...testCreds, clientSecret: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#E0D2C3] focus:border-[#D84C1C] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#24150E] block mb-1">
                  Direct Custom App Access Token (Admin API)
                </label>
                <input
                  type="password"
                  placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={testCreds.accessToken}
                  onChange={(e) => setTestCreds({ ...testCreds, accessToken: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E0D2C3] focus:border-[#D84C1C] focus:outline-none font-mono"
                />
                <span className="text-[10px] text-[#8A7363] mt-0.5 block">
                  Leave blank to test using current project environment credentials.
                </span>
              </div>

              <button
                type="submit"
                disabled={isTestingCreds}
                className="w-full py-2.5 rounded-lg bg-[#D84C1C] hover:bg-[#BF3E12] text-white text-xs font-bold transition shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <KeyRound className={`w-4 h-4 ${isTestingCreds ? 'animate-spin' : ''}`} />
                <span>{isTestingCreds ? 'Validating Handshake...' : 'Authenticate & Test Connection'}</span>
              </button>
            </form>

            {credsTestResult && (
              <div className={`p-4 rounded-xl border space-y-2 ${
                credsTestResult.ok 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    {credsTestResult.ok ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                    <span>{credsTestResult.ok ? 'Connection Verified' : 'Authentication Notice'}</span>
                  </span>
                  <span className="text-[10px] font-mono">
                    Latency: {credsTestResult.latencyMs}ms
                  </span>
                </div>
                <p className="text-xs">
                  {credsTestResult.message || credsTestResult.error}
                </p>
                {credsTestResult.shop && (
                  <div className="text-[11px] font-mono bg-white/70 p-2 rounded border border-current space-y-0.5">
                    <div>Store: {credsTestResult.shop.name}</div>
                    <div>Domain: {credsTestResult.shop.myshopifyDomain}</div>
                    <div>Currency: {credsTestResult.shop.currencyCode}</div>
                    <div>Timezone: {credsTestResult.shop.ianaTimezone}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-white rounded-xl border border-[#E7DDD3] p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#24150E]">
              Environment Secrets Reference
            </h3>
            <p className="text-xs text-[#7A6454] leading-relaxed">
              In production, define these environment variables in your deployment settings so the backend automatically authenticates without manual key entry:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7DDD3]">
                <div className="font-bold text-[#24150E] font-mono text-[11px]">SHOPIFY_SHOP</div>
                <div className="text-[11px] text-[#7A6454]">Your store domain (e.g. hometown-flagship.myshopify.com)</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7DDD3]">
                <div className="font-bold text-[#24150E] font-mono text-[11px]">SHOPIFY_CLIENT_ID</div>
                <div className="text-[11px] text-[#7A6454]">Shopify Custom App API Key</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7DDD3]">
                <div className="font-bold text-[#24150E] font-mono text-[11px]">SHOPIFY_CLIENT_SECRET</div>
                <div className="text-[11px] text-[#7A6454]">Shopify Custom App API Secret Key</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7DDD3]">
                <div className="font-bold text-[#24150E] font-mono text-[11px]">SHOPIFY_WEBHOOK_SECRET</div>
                <div className="text-[11px] text-[#7A6454]">HMAC secret for validating webhook HTTP POST headers</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Orders Studio */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#E7DDD3] p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#24150E]">
                Shopify Orders Stream ({ordersList.length} Active)
              </h3>
              <p className="text-xs text-[#7A6454]">
                Query orders, inspect customer line items, update delivery notes, fulfill with tracking, or trigger test webhook orders.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSendTestWebhook}
                disabled={isTestingWebhook}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2D1E16] hover:bg-[#3D2A1F] text-[#FFA88B] text-xs font-semibold transition"
              >
                <Zap className="w-3.5 h-3.5 fill-[#D84C1C] text-[#D84C1C]" />
                <span>{isTestingWebhook ? 'Simulating...' : 'Simulate Order Webhook'}</span>
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl border border-[#E7DDD3] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#8A7363] text-[10px] uppercase font-bold border-b border-[#E7DDD3]">
                  <tr>
                    <th className="px-4 py-3">Order Number</th>
                    <th className="px-4 py-3">Client / Email</th>
                    <th className="px-4 py-3">Line Items</th>
                    <th className="px-4 py-3">Total Amount</th>
                    <th className="px-4 py-3">Financial Status</th>
                    <th className="px-4 py-3">Fulfillment</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3ECE2]">
                  {ordersList.map((ord) => {
                    const lineItems = ord.lineItems?.nodes || [];
                    const customerName = ord.customer?.displayName || ord.customer?.firstName ? `${ord.customer.firstName} ${ord.customer.lastName || ''}` : 'HomeTown Client';
                    const amount = ord.totalPriceSet?.shopMoney?.amount || '0.00';
                    const curr = ord.totalPriceSet?.shopMoney?.currencyCode || 'INR';

                    return (
                      <tr key={ord.id} className="hover:bg-[#FAF8F5] transition">
                        <td className="px-4 py-3 font-bold text-[#24150E]">
                          <div className="flex items-center gap-1.5">
                            <span>{ord.name || ord.id}</span>
                            {ord.tags && ord.tags.includes('VIP Customer') && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">VIP</span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#8A7363] font-normal block">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-[#24150E]">{customerName}</div>
                          <div className="text-[10px] text-[#7A6454] font-mono">{ord.email || ord.customer?.defaultEmailAddress?.emailAddress || '—'}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-[11px] text-[#24150E] font-medium max-w-xs truncate">
                            {lineItems[0]?.title || 'Furniture Piece'} {lineItems.length > 1 ? `+${lineItems.length - 1} more` : ''}
                          </div>
                          <span className="text-[10px] text-[#8A7363] font-mono">
                            SKU: {lineItems[0]?.sku || 'HT-SKU-01'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-[#24150E]">
                          ₹{parseFloat(amount).toLocaleString('en-IN')} {curr}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.displayFinancialStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.displayFinancialStatus || 'PAID'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.displayFulfillmentStatus === 'FULFILLED' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {ord.displayFulfillmentStatus || 'UNFULFILLED'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedOrder(ord);
                                setOrderNoteInput(ord.note || '');
                                setOrderTagsInput(Array.isArray(ord.tags) ? ord.tags.join(', ') : (ord.tags || ''));
                              }}
                              className="px-2.5 py-1 rounded bg-[#F3ECE2] hover:bg-[#EBE2D5] text-[#3E291C] font-semibold text-[11px] transition"
                            >
                              Edit & Details
                            </button>

                            {ord.displayFulfillmentStatus !== 'FULFILLED' && (
                              <button
                                onClick={() => handleFulfillOrder(ord.id)}
                                className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] transition"
                                title="Fulfill with tracking"
                              >
                                Fulfill
                              </button>
                            )}

                            {!ord.closed && (
                              <button
                                onClick={() => handleCancelOrder(ord.id)}
                                className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] transition"
                                title="Cancel Order"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Products Studio */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#E7DDD3] p-4 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#24150E]">
                Shopify Product Catalog ({productsList.length} Active Items)
              </h3>
              <p className="text-xs text-[#7A6454]">
                Browse active catalog, review SKU allocations, and perform live title/tag/status mutations.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E7DDD3] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#8A7363] text-[10px] uppercase font-bold border-b border-[#E7DDD3]">
                  <tr>
                    <th className="px-4 py-3">Product Name</th>
                    <th className="px-4 py-3">Vendor / Type</th>
                    <th className="px-4 py-3">Default SKU</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Total Stock</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3ECE2]">
                  {productsList.map((prod) => {
                    const variant = prod.variants?.nodes?.[0];
                    const price = prod.priceRangeV2?.minVariantPrice?.amount || variant?.price || '0';
                    const curr = prod.priceRangeV2?.minVariantPrice?.currencyCode || 'INR';
                    const stock = prod.totalInventory ?? variant?.inventoryQuantity ?? 0;

                    return (
                      <tr key={prod.id} className="hover:bg-[#FAF8F5] transition">
                        <td className="px-4 py-3 font-bold text-[#24150E]">
                          <div className="text-xs">{prod.title}</div>
                          <div className="text-[10px] text-[#7A6454] font-normal truncate max-w-xs mt-0.5">
                            Tags: {Array.isArray(prod.tags) ? prod.tags.join(', ') : prod.tags}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-[#24150E]">{prod.vendor || 'HomeTown'}</div>
                          <div className="text-[10px] text-[#7A6454]">{prod.productType || 'Furniture'}</div>
                        </td>
                        <td className="px-4 py-3 font-mono font-semibold text-[#24150E]">
                          {variant?.sku || prod.handle}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-[#24150E]">
                          ₹{parseFloat(price).toLocaleString('en-IN')} {curr}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            stock > 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {stock} Units
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            prod.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {prod.status || 'ACTIVE'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedProduct(prod);
                              setEditProductTitle(prod.title || '');
                              setEditProductTags(Array.isArray(prod.tags) ? prod.tags.join(', ') : (prod.tags || ''));
                              setEditProductStatus(prod.status || 'ACTIVE');
                            }}
                            className="px-2.5 py-1 rounded bg-[#F3ECE2] hover:bg-[#EBE2D5] text-[#3E291C] font-semibold text-[11px] transition"
                          >
                            Edit Product
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Single & Bulk Price/Inventory Studio */}
      {activeTab === 'pricing-inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Single Variant Price & Inventory Updater */}
          <div className="lg:col-span-6 bg-white rounded-xl border border-[#E7DDD3] p-5 shadow-xs space-y-4">
            <div className="border-b border-[#F3ECE2] pb-3">
              <h3 className="text-sm font-bold text-[#24150E] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#D84C1C]" />
                <span>Single SKU Price & Stock Level Sync</span>
              </h3>
              <p className="text-xs text-[#7A6454] mt-0.5">
                Target a single variant SKU to update selling price, compare-at MRP, unit cost, and warehouse inventory stock level.
              </p>
            </div>

            <form onSubmit={handleSingleVariantUpdate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#24150E] block mb-1">
                  Target Product SKU
                </label>
                <select
                  value={singleVariantSku}
                  onChange={(e) => {
                    setSingleVariantSku(e.target.value);
                    const prod = productsList.find(p => p.variants?.nodes?.[0]?.sku === e.target.value);
                    if (prod) {
                      const v = prod.variants?.nodes?.[0];
                      if (v?.price) setSingleVariantPrice(v.price);
                      if (v?.compareAtPrice) setSingleVariantComparePrice(v.compareAtPrice);
                      if (prod.totalInventory !== undefined) setSingleVariantStock(String(prod.totalInventory));
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-[#E0D2C3] focus:border-[#D84C1C] focus:outline-none font-mono"
                >
                  {productsList.map((p) => {
                    const sku = p.variants?.nodes?.[0]?.sku || p.handle;
                    return (
                      <option key={p.id} value={sku}>
                        {sku} — {p.title}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#24150E] block mb-1">
                    Selling Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={singleVariantPrice}
                    onChange={(e) => setSingleVariantPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E0D2C3] focus:border-[#D84C1C] focus:outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[#24150E] block mb-1">
                    Compare-At Price / MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={singleVariantComparePrice}
                    onChange={(e) => setSingleVariantComparePrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E0D2C3] focus:border-[#D84C1C] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#24150E] block mb-1">
                    Stock Quantity (Units)
                  </label>
                  <input
                    type="number"
                    value={singleVariantStock}
                    onChange={(e) => setSingleVariantStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E0D2C3] focus:border-[#D84C1C] focus:outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[#24150E] block mb-1">
                    Unit Cost Price (₹)
                  </label>
                  <input
                    type="number"
                    value={singleVariantCost}
                    onChange={(e) => setSingleVariantCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E0D2C3] focus:border-[#D84C1C] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdatingSingleVariant}
                className="w-full py-2.5 rounded-lg bg-[#D84C1C] hover:bg-[#BF3E12] text-white text-xs font-bold transition shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                <span>{isUpdatingSingleVariant ? 'Updating Variant...' : 'Sync Single Variant Price & Stock'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Bulk Inventory & Price Adjuster */}
          <div className="lg:col-span-6 bg-white rounded-xl border border-[#E7DDD3] p-5 shadow-xs space-y-4">
            <div className="border-b border-[#F3ECE2] pb-3">
              <h3 className="text-sm font-bold text-[#24150E] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#D84C1C]" />
                <span>Bulk Catalog Matrix Adjuster</span>
              </h3>
              <p className="text-xs text-[#7A6454] mt-0.5">
                Apply batch price percentage shifts or stock increments across all {productsList.length} catalog variants in a single API call.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Batch % Price Shift */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7DDD3] space-y-2">
                <label className="font-bold text-[#24150E] block">
                  Batch Price Adjustment (% Delta)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="e.g. 5 for +5% or -10 for -10%"
                    value={bulkPricePercent}
                    onChange={(e) => setBulkPricePercent(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-[#E0D2C3] focus:border-[#D84C1C] focus:outline-none font-mono bg-white"
                  />
                  <button
                    onClick={() => handleBulkAdjust('percentage')}
                    disabled={isExecutingBulk}
                    className="px-4 py-2 rounded-lg bg-[#24150E] hover:bg-[#3E291C] text-white font-bold transition disabled:opacity-50 shrink-0"
                  >
                    Apply % Shift
                  </button>
                </div>
                <span className="text-[10px] text-[#8A7363] block">
                  e.g. +5% for festive markup, -10% for clearance flash sale.
                </span>
              </div>

              {/* Batch Stock Allocation */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7DDD3] space-y-2">
                <label className="font-bold text-[#24150E] block">
                  Batch Stock Increment (+ Units)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="e.g. 10 units"
                    value={bulkStockDelta}
                    onChange={(e) => setBulkStockDelta(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-[#E0D2C3] focus:border-[#D84C1C] focus:outline-none font-mono bg-white"
                  />
                  <button
                    onClick={() => handleBulkAdjust('stock')}
                    disabled={isExecutingBulk}
                    className="px-4 py-2 rounded-lg bg-[#24150E] hover:bg-[#3E291C] text-white font-bold transition disabled:opacity-50 shrink-0"
                  >
                    Apply Stock Delta
                  </button>
                </div>
                <span className="text-[10px] text-[#8A7363] block">
                  Increments warehouse available stock levels across all catalog products.
                </span>
              </div>

              {bulkResultsSummary && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                  <div className="font-bold">Bulk Synchronization Succeeded:</div>
                  <div className="font-mono text-[11px] mt-1">
                    Processed: {bulkResultsSummary.totalProcessed} variants • {bulkResultsSummary.successCount} synced • {bulkResultsSummary.failedCount} errors
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* Tab 6: GraphQL Console & Webhook Inspector */}
      {activeTab === 'graphql' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Webhook Inspector */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-xl border border-[#E7DDD3] p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#F3ECE2] pb-2.5">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#D84C1C]" />
                  <h3 className="text-xs font-bold text-[#24150E] uppercase tracking-wider">
                    Shopify Webhook Receiver
                  </h3>
                </div>
                <button
                  onClick={handleRegisterWebhook}
                  disabled={isRegisteringWebhook}
                  className="px-2.5 py-1 rounded bg-[#D84C1C] hover:bg-[#BF3E12] text-white text-[11px] font-bold transition"
                >
                  {isRegisteringWebhook ? 'Registering...' : 'Register Webhook'}
                </button>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E7DDD3]">
                <span className="text-[10px] font-bold text-[#8A7363] uppercase tracking-wider block">Endpoint</span>
                <code className="text-xs font-mono text-[#D84C1C] font-semibold truncate block mt-0.5">
                  {status?.webhookBaseUrl || 'https://seller.hometown.in'}/webhooks/orders-create
                </code>
              </div>

              <div className="border border-[#E7DDD3] rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-[#8A7363] text-[10px] uppercase font-bold border-b border-[#E7DDD3]">
                    <tr>
                      <th className="px-3 py-2">Topic</th>
                      <th className="px-3 py-2">Target URI</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3ECE2]">
                    {webhooks.map((wh) => (
                      <tr key={wh.id}>
                        <td className="px-3 py-2 font-mono text-[10px] font-bold text-[#C84B22]">{wh.topic}</td>
                        <td className="px-3 py-2 font-mono text-[10px] text-[#6B5546] truncate max-w-xs">{wh.uri}</td>
                        <td className="px-3 py-2">
                          <span className="text-[10px] font-bold text-emerald-700">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={handleSendTestWebhook}
                disabled={isTestingWebhook}
                className="w-full py-2 rounded-lg bg-[#2D1E16] hover:bg-[#3D2A1F] text-[#FFA88B] text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-[#D84C1C] text-[#D84C1C]" />
                <span>{isTestingWebhook ? 'Dispatching...' : 'Dispatch Live Test Order Webhook'}</span>
              </button>
            </div>
          </div>

          {/* Right: GraphQL Query Terminal */}
          <div className="lg:col-span-6 bg-[#19110B] rounded-xl border border-[#3E2B20] text-[#EADBCE] p-4 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#34241B] pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#D84C1C]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Live API Query Terminal
                </h3>
              </div>
              {apiLatency !== null && (
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                  {apiLatency}ms
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedEndpoint}
                onChange={(e) => setSelectedEndpoint(e.target.value)}
                className="flex-1 bg-[#120B07] border border-[#3E2A1D] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D84C1C]"
              >
                <option value="/api/shop">GET /api/shop (Store Details)</option>
                <option value="/api/orders">GET /api/orders (Shopify Orders Matrix)</option>
                <option value="/api/products">GET /api/products (Catalog & Variants)</option>
                <option value="/api/webhooks">GET /api/webhooks (Registered Subscriptions)</option>
                <option value="/api/shopify/status">GET /api/shopify/status (Diagnostics)</option>
              </select>

              <button
                onClick={executeApiTest}
                disabled={isCallingApi}
                className="px-4 py-2 rounded-lg bg-[#D84C1C] hover:bg-[#C03E12] text-white text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50 shadow-xs"
              >
                <Send className="w-3 h-3" />
                <span>{isCallingApi ? 'Querying...' : 'Run'}</span>
              </button>
            </div>

            <div className="bg-[#0F0A06] border border-[#2D1E16] rounded-lg p-3 max-h-96 overflow-y-auto font-mono text-[11px] text-[#D8C7B8] leading-relaxed">
              {isCallingApi ? (
                <div className="flex items-center gap-2 text-[#9C8270] py-4 justify-center">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D84C1C]" />
                  <span>Executing Shopify GraphQL query...</span>
                </div>
              ) : apiResponse ? (
                <pre className="whitespace-pre-wrap word-break">{apiResponse}</pre>
              ) : (
                <div className="text-center py-6 text-[#7A6354]">
                  Select an endpoint and click "Run" to test GraphQL responses.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Edit Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-[#F3ECE2] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#24150E]">
                  Order Details & Mutation — {selectedOrder.name || selectedOrder.id}
                </h3>
                <p className="text-xs text-[#7A6454]">
                  Placed by {selectedOrder.customer?.displayName || 'Client'} ({selectedOrder.email || '—'})
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#24150E] block mb-1">
                  Delivery & Special Handling Notes
                </label>
                <textarea
                  rows={3}
                  value={orderNoteInput}
                  onChange={(e) => setOrderNoteInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E0D2C3] focus:border-[#D84C1C] focus:outline-none"
                  placeholder="Add delivery instructions or client requests..."
                />
              </div>

              <div>
                <label className="font-bold text-[#24150E] block mb-1">
                  Order Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={orderTagsInput}
                  onChange={(e) => setOrderTagsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E0D2C3] focus:border-[#D84C1C] focus:outline-none"
                  placeholder="e.g. VIP Customer, White Glove, Verified-E2E-Sync"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F3ECE2]">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-lg border border-[#E0D2C3] text-[#3E291C] font-semibold text-xs hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdateOrderSubmit}
                disabled={isUpdatingOrder}
                className="px-4 py-2 rounded-lg bg-[#D84C1C] hover:bg-[#BF3E12] text-white font-bold text-xs transition disabled:opacity-50"
              >
                {isUpdatingOrder ? 'Saving Updates...' : 'Save Order Mutation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-[#F3ECE2] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#24150E]">
                  Edit Product — {selectedProduct.title}
                </h3>
                <p className="text-xs text-[#7A6454]">
                  Product ID: {selectedProduct.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#24150E] block mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  value={editProductTitle}
                  onChange={(e) => setEditProductTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E0D2C3] focus:border-[#D84C1C] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#24150E] block mb-1">
                  Catalog Status
                </label>
                <select
                  value={editProductStatus}
                  onChange={(e) => setEditProductStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E0D2C3] focus:border-[#D84C1C] focus:outline-none"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#24150E] block mb-1">
                  Product Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={editProductTags}
                  onChange={(e) => setEditProductTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E0D2C3] focus:border-[#D84C1C] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F3ECE2]">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 rounded-lg border border-[#E0D2C3] text-[#3E291C] font-semibold text-xs hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdateProductSubmit}
                disabled={isUpdatingProduct}
                className="px-4 py-2 rounded-lg bg-[#D84C1C] hover:bg-[#BF3E12] text-white font-bold text-xs transition disabled:opacity-50"
              >
                {isUpdatingProduct ? 'Saving...' : 'Save Product Mutation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step Detail Payload Modal */}
      {selectedStepDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#19110B] rounded-xl border border-[#3E2B20] text-[#EADBCE] w-full max-w-2xl overflow-hidden space-y-3 p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#34241B] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#D84C1C]" />
                  <span>Step {selectedStepDetail.step}: {selectedStepDetail.name}</span>
                </h3>
                <p className="text-[11px] text-[#A6907F] mt-0.5">
                  Latency: {selectedStepDetail.latencyMs}ms • Status: {selectedStepDetail.status}
                </p>
              </div>
              <button
                onClick={() => setSelectedStepDetail(null)}
                className="p-1 rounded text-[#8A7363] hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-[#A6907F]">
                <span>Response Summary</span>
                <button
                  onClick={() => handleCopy(JSON.stringify(selectedStepDetail.responseSummary, null, 2), 'step-json')}
                  className="hover:text-white text-[10px]"
                >
                  {copiedField === 'step-json' ? 'Copied!' : 'Copy JSON'}
                </button>
              </div>
              <div className="bg-[#0F0A06] border border-[#2D1E16] rounded-lg p-3 max-h-80 overflow-y-auto font-mono text-[11px] text-[#D8C7B8]">
                <pre className="whitespace-pre-wrap">{JSON.stringify(selectedStepDetail.responseSummary, null, 2)}</pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedStepDetail(null)}
                className="px-4 py-1.5 rounded-lg bg-[#24150E] hover:bg-[#3E291C] text-white text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
