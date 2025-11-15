import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Tenant Management", path: "/admin/tenants", icon: "👥" },
    { name: "Register Tenant", path: "/admin/register-tenant", icon: "➕" },
    { name: "Profile Requests", path: "/admin/profile-requests", icon: "📝" },
    { name: "Payment History", path: "/admin/payment-history", icon: "💰" },
    { name: "Analytics", path: "/admin/analytics", icon: "📈" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-[#016367] h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-gray-900">HAM MALL</h1>
        <p className="text-gray-400 text-sm mt-1">Admin Dashboard</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-sm transition-colors ${
              isActive(item.path)
                ? "bg-gray-900 text-white border-r-4 border-green-500"
                : "text-gray-400 hover:bg-[#578384] hover:text-white"
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
