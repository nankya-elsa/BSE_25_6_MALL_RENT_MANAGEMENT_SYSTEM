import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import DashboardPage from "../pages/dashboard";
import MakePayment from "../pages/tenant/MakePayment";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import TenantManagement from "../pages/admin/TenantManagement";
import RegisterTenant from "../pages/admin/RegisterTenant";
import ProfileRequests from "../pages/admin/ProfileRequests";
import PaymentHistory from "../pages/admin/PaymentHistory";
import Analytics from "../pages/admin/Analytics";

// Protected Route component
// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;
// };

// Public Route component (redirect to dashboard if already logged in)
// const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return <>{children}</>;
// };

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<DashboardPage />} />

      <Route path="/make-payment" element={<MakePayment />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      <Route path="/admin/tenants" element={<TenantManagement />} />

      <Route path="/admin/register-tenant" element={<RegisterTenant />} />

      <Route path="/admin/profile-requests" element={<ProfileRequests />} />

      <Route path="/admin/payment-history" element={<PaymentHistory />} />

      <Route path="/admin/analytics" element={<Analytics />} />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
