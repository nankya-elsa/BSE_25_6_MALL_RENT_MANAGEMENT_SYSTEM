import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";

// Public Pages
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";

import DashboardPage from "../pages/dashboard";
import MakePayment from "../pages/tenant/MakePayment";
import ProfilePage from "../pages/Client/ProfilePage";
import PaymentPage from "../pages/PaymentPage";
import ShopDetails from "../pages/tenant/ShopDetails";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import TenantManagement from "../pages/admin/TenantManagement";
import RegisterTenant from "../pages/admin/RegisterTenant";
import ProfileRequests from "../pages/admin/ProfileRequests";
import PaymentHistory from "../pages/admin/PaymentHistory";
import Analytics from "../pages/admin/Analytics";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <Layout>
            <DashboardPage />
          </Layout>
        }
      />

      <Route
        path="/profile"
        element={
          <Layout>
            <ProfilePage />
          </Layout>
        }
      />

      <Route
        path="/payment"
        element={
          <Layout>
            <PaymentPage />
          </Layout>
        }
      />

      <Route
        path="/make-payment"
        element={
          <Layout>
            <MakePayment />
          </Layout>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      <Route path="/admin/tenants" element={<TenantManagement />} />

      <Route path="/admin/register-tenant" element={<RegisterTenant />} />

      <Route path="/admin/profile-requests" element={<ProfileRequests />} />

      <Route path="/admin/payment-history" element={<PaymentHistory />} />

      <Route path="/admin/analytics" element={<Analytics />} />

      <Route
        path="/my-shops"
        element={
          <Layout>
            <ShopDetails />
          </Layout>
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
