/**
 * HomeTown HT-OMS Shopify API Service Layer
 * Connects the React Seller Panel to the Express / Shopify GraphQL backend.
 */

export interface ShopifyShop {
  id: string;
  name: string;
  myshopifyDomain: string;
  email: string;
  contactEmail: string;
  currencyCode: string;
  ianaTimezone: string;
  weightUnit: string;
  url: string;
  plan?: {
    publicDisplayName: string;
    partnerDevelopment: boolean;
    shopifyPlus: boolean;
  };
  shopAddress?: {
    address1: string;
    address2?: string;
    city: string;
    province: string;
    country: string;
    zip: string;
    phone: string;
  };
  mode?: string;
}

export interface ShopifyStatus {
  status: string;
  application: string;
  apiVersion: string;
  isShopifyConfigured: boolean;
  shop: string;
  hasClientId: boolean;
  hasClientSecret: boolean;
  webhookBaseUrl: string;
  webhooksActive: number;
  cachedTokenActive: boolean;
}

export interface BulkUploadResponse {
  file?: string;
  total: number;
  successCount: number;
  failedCount: number;
  created: any[];
  failed: Array<{
    row: number;
    input: any;
    error: string;
  }>;
}

export interface WebhookSubscription {
  id: string;
  topic: string;
  uri: string;
  createdAt: string;
  updatedAt: string;
  apiVersion?: { handle: string };
}

export const shopifyApi = {
  // 1. Get Shop Info
  async getShop(): Promise<ShopifyShop> {
    const res = await fetch('/api/shop');
    if (!res.ok) {
      throw new Error(`Failed to fetch shop info: ${res.statusText}`);
    }
    return res.json();
  },

  // 2. Get API Status & Connection diagnostics
  async getStatus(): Promise<ShopifyStatus> {
    const res = await fetch('/api/shopify/status');
    if (!res.ok) {
      throw new Error(`Failed to fetch Shopify status: ${res.statusText}`);
    }
    return res.json();
  },

  // 3. Get Orders
  async getOrders(params?: { limit?: number; cursor?: string; query?: string }): Promise<{
    count: number;
    hasNextPage: boolean;
    nextCursor: string | null;
    orders: any[];
  }> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.cursor) searchParams.append('cursor', params.cursor);
    if (params?.query) searchParams.append('query', params.query);

    const qs = searchParams.toString();
    const url = `/api/orders${qs ? `?${qs}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to fetch orders: ${res.statusText}`);
    }
    return res.json();
  },

  // 4. Get Single Order
  async getOrderById(id: string): Promise<any> {
    const res = await fetch(`/api/orders/${encodeURIComponent(id)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Order not found`);
    }
    return res.json();
  },

  // 5. Get Products
  async getProducts(params?: { limit?: number; cursor?: string; query?: string }): Promise<{
    count: number;
    hasNextPage: boolean;
    nextCursor: string | null;
    products: any[];
  }> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.cursor) searchParams.append('cursor', params.cursor);
    if (params?.query) searchParams.append('query', params.query);

    const qs = searchParams.toString();
    const url = `/api/products${qs ? `?${qs}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to fetch products: ${res.statusText}`);
    }
    return res.json();
  },

  // 6. Get Single Product
  async getProductById(id: string): Promise<any> {
    const res = await fetch(`/api/products/${encodeURIComponent(id)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Product not found`);
    }
    return res.json();
  },

  // 7. Create Single Product
  async createProduct(product: Record<string, any>): Promise<any> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to create product`);
    }
    return res.json();
  },

  // 8. Bulk Create Products (JSON)
  async bulkCreateProducts(products: Record<string, any>[]): Promise<BulkUploadResponse> {
    const res = await fetch('/api/products/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ products })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Bulk create failed`);
    }
    return res.json();
  },

  // 9. Upload CSV / Excel File
  async uploadProductFile(file: File): Promise<BulkUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/products/upload', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Upload failed`);
    }
    return res.json();
  },

  // 10. Download Official Template
  getTemplateDownloadUrl(): string {
    return '/api/products/template';
  },

  // 11. Setup Webhook Subscription
  async setupWebhook(): Promise<any> {
    const res = await fetch('/api/setup-webhook', {
      method: 'POST'
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to register webhook`);
    }
    return res.json();
  },

  // 12. List Webhooks
  async listWebhooks(): Promise<WebhookSubscription[]> {
    const res = await fetch('/api/webhooks');
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to list webhooks`);
    }
    return res.json();
  },

  // 13. Simulate Webhook Order Event
  async triggerTestWebhookOrder(orderPayload: Record<string, any>): Promise<boolean> {
    const res = await fetch('/webhooks/orders-create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderPayload)
    });
    return res.ok;
  },

  // 14. Update Order (Tags, Notes, Shipping, Email)
  async updateOrder(id: string, updates: { note?: string; tags?: string[] | string; email?: string; shippingAddress?: any; customAttributes?: any }): Promise<any> {
    const cleanId = id.replace('gid://shopify/Order/', '');
    const res = await fetch(`/api/orders/${cleanId}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to update order ${cleanId}`);
    }
    return res.json();
  },

  // 15. Fulfill Order
  async fulfillOrder(id: string, data?: { trackingCompany?: string; trackingNumber?: string }): Promise<any> {
    const cleanId = id.replace('gid://shopify/Order/', '');
    const res = await fetch(`/api/orders/${cleanId}/fulfill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data || {})
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to fulfill order`);
    }
    return res.json();
  },

  // 16. Cancel Order
  async cancelOrder(id: string, data?: { reason?: string; note?: string }): Promise<any> {
    const cleanId = id.replace('gid://shopify/Order/', '');
    const res = await fetch(`/api/orders/${cleanId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data || {})
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to cancel order`);
    }
    return res.json();
  },

  // 17. Update Product Details
  async updateProduct(id: string, updates: Record<string, any>): Promise<any> {
    const cleanId = id.replace('gid://shopify/Product/', '');
    const res = await fetch(`/api/products/${cleanId}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to update product`);
    }
    return res.json();
  },

  // 18. Single Variant Price & Inventory Update
  async updateSingleVariant(data: {
    productId?: string;
    variantId?: string;
    price?: number | string;
    compareAtPrice?: number | string;
    cost?: number | string;
    inventoryQuantity?: number;
    sku?: string;
    barcode?: string;
  }): Promise<any> {
    const res = await fetch('/api/variants/single-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to update variant price/inventory`);
    }
    return res.json();
  },

  // 19. Bulk Update Inventory & Prices
  async bulkUpdateInventoryPrice(data: {
    updates?: Array<{
      productId?: string;
      variantId?: string;
      sku?: string;
      price?: number | string;
      compareAtPrice?: number | string;
      inventoryQuantity?: number;
      cost?: number | string;
    }>;
    priceDeltaPercent?: number;
    stockDelta?: number;
  }): Promise<{
    totalProcessed: number;
    successCount: number;
    failedCount: number;
    results: any[];
  }> {
    const res = await fetch('/api/variants/bulk-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Bulk variant update failed`);
    }
    return res.json();
  },

  // 20. Test Custom Credentials
  async testCredentials(creds?: {
    shop?: string;
    clientId?: string;
    clientSecret?: string;
    accessToken?: string;
  }): Promise<any> {
    const res = await fetch('/api/shopify/test-credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds || {})
    });
    return res.json();
  },

  // 21. Run Comprehensive Automated E2E Test Suite
  async runE2ETestSuite(): Promise<{
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
  }> {
    const res = await fetch('/api/shopify/run-e2e-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `E2E Test execution failed`);
    }
    return res.json();
  }
};
