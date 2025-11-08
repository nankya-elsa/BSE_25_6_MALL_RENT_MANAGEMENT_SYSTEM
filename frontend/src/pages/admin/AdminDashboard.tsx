import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import axios from "axios";

interface DashboardStats {
  total_tenants: number;
  total_shops: number;
  occupied_shops: number;
  vacant_shops: number;
  monthly_revenue: number;
  pending_requests: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/stats/"
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Dashboard Overview
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Tenants */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Tenants
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.total_tenants}
                </p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          {/* Total Shops */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Shops</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.total_shops}
                </p>
              </div>
              <div className="text-4xl">🏪</div>
            </div>
          </div>

          {/* Occupied Shops */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Occupied Shops
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.occupied_shops}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          {/* Vacant Shops */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Vacant Shops
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.vacant_shops}
                </p>
              </div>
              <div className="text-4xl">❌</div>
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Monthly Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  UGX {stats?.monthly_revenue.toLocaleString()}
                </p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Pending Requests
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.pending_requests}
                </p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition">
              Register New Tenant
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition">
              View Profile Requests
            </button>
            <button className="bg-black hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg transition">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
