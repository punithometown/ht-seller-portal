/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SellerProvider, useSeller } from './context/SellerContext';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { AddProductPage } from './pages/AddProductPage';
import { InventoryPage } from './pages/InventoryPage';
import { OrdersPage } from './pages/OrdersPage';
import { ClientsPage } from './pages/ClientsPage';
import { InquiriesPage } from './pages/InquiriesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ShopifyHubPage } from './pages/ShopifyHubPage';
import { LoginPage } from './pages/LoginPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSeller();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <SellerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/add" element={<AddProductPage />} />
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/clients" element={<ClientsPage />} />
                    <Route path="/inquiries" element={<InquiriesPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/shopify" element={<ShopifyHubPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </SellerProvider>
  );
}

