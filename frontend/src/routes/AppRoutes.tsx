import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";

// Public Pages
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";

// Protected Pages
import DashboardPage from "../pages/dashboard";
import MakePayment from "../pages/tenant/MakePayment";
import ProfilePage from "../pages/Client/ProfilePage";
import PaymentPage from "../pages/PaymentPage";

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

      <Route path="/make-payment" element={<MakePayment />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <Layout>
            <AdminDashboard />
          </Layout>
        }
      />

      <Route
        path="/admin/tenants"
        element={
          <Layout>
            <TenantManagement />
          </Layout>
        }
      />

      <Route
        path="/admin/register-tenant"
        element={
          <Layout>
            <RegisterTenant />
          </Layout>
        }
      />

      <Route
        path="/admin/profile-requests"
        element={
          <Layout>
            <ProfileRequests />
          </Layout>
        }
      />

      <Route
        path="/admin/payment-history"
        element={
          <Layout>
            <PaymentHistory />
          </Layout>
        }
      />

      <Route
        path="/admin/analytics"
        element={
          <Layout>
            <Analytics />
          </Layout>
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
