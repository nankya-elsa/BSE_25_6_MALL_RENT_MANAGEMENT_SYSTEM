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

interface Payment {
  id: number;
  tenant_name: string;
  shop_number: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  status: string;
}

const Analytics: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsResponse, paymentsResponse] = await Promise.all([
        axios.get("http://localhost:8000/api/admin/stats/"),
        axios.get("http://localhost:8000/api/admin/payment-history/"),
      ]);

      setStats(statsResponse.data);
      setPayments(paymentsResponse.data.payments);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics metrics
  const completedPayments = payments.filter((p) => p.status === "completed");
  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const averagePayment =
    completedPayments.length > 0 ? totalRevenue / completedPayments.length : 0;

  const mobileMoneyPayments = payments.filter(
    (p) => p.payment_method === "mobile_money"
  ).length;
  const bankTransferPayments = payments.filter(
    (p) => p.payment_method === "bank_transfer"
  ).length;
  const cashPayments = payments.filter(
    (p) => p.payment_method === "cash"
  ).length;

  // Occupancy rate
  const occupancyRate = stats
    ? (stats.occupied_shops / stats.total_shops) * 100
    : 0;

  // Recent trends (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentPayments = payments.filter(
    (p) => new Date(p.payment_date) >= sevenDaysAgo
  );
  const recentRevenue = recentPayments.reduce(
    (sum, p) => (p.status === "completed" ? sum + p.amount : sum),
    0
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Loading analytics...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Business Analytics
        </h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              UGX {totalRevenue.toLocaleString()}
            </p>
            <p className="text-green-600 text-xs mt-2">↑ All time</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-600">
            <p className="text-gray-600 text-sm font-medium">Average Payment</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              UGX {Math.round(averagePayment).toLocaleString()}
            </p>
            <p className="text-gray-600 text-xs mt-2">Per transaction</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium">Occupancy Rate</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {occupancyRate.toFixed(1)}%
            </p>
            <p className="text-gray-600 text-xs mt-2">
              {stats?.occupied_shops} of {stats?.total_shops} shops
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-600">
            <p className="text-gray-600 text-sm font-medium">Last 7 Days</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              UGX {recentRevenue.toLocaleString()}
            </p>
            <p className="text-gray-600 text-xs mt-2">
              {recentPayments.length} payments
            </p>
          </div>
        </div>

        {/* Payment Methods Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Payment Methods Distribution
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Mobile Money
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {mobileMoneyPayments}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{
                      width: `${
                        (mobileMoneyPayments / payments.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Bank Transfer
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {bankTransferPayments}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-red-600 h-3 rounded-full"
                    style={{
                      width: `${
                        (bankTransferPayments / payments.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Cash
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {cashPayments}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-black h-3 rounded-full"
                    style={{
                      width: `${(cashPayments / payments.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Shop Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Shop Status Overview
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Occupied Shops
                    </p>
                    <p className="text-sm text-gray-600">Currently rented</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {stats?.occupied_shops}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">❌</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Vacant Shops</p>
                    <p className="text-sm text-gray-600">Available for rent</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {stats?.vacant_shops}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Total Shops</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {stats?.total_shops}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Insights */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Revenue Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">This Month</p>
              <p className="text-2xl font-bold text-green-600">
                UGX {stats?.monthly_revenue.toLocaleString()}
              </p>
            </div>

            <div className="text-center p-4 bg-black text-white rounded-lg">
              <p className="text-sm text-gray-300 mb-2">
                Completed Transactions
              </p>
              <p className="text-2xl font-bold">{completedPayments.length}</p>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Total Tenants</p>
              <p className="text-2xl font-bold text-red-600">
                {stats?.total_tenants}
              </p>
            </div>
          </div>
        </div>

        {/* Business Health Indicators */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Business Health Indicators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Collection Rate
                </span>
                <span className="text-sm font-bold text-green-600">
                  {((completedPayments.length / payments.length) * 100).toFixed(
                    1
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full flex items-center justify-end pr-2"
                  style={{
                    width: `${
                      (completedPayments.length / payments.length) * 100
                    }%`,
                  }}
                >
                  <span className="text-xs text-white font-bold">✓</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Occupancy Rate
                </span>
                <span className="text-sm font-bold text-green-600">
                  {occupancyRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{ width: `${occupancyRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <span className="font-semibold">✓ Business Performance:</span>{" "}
              Your mall is performing well with a {occupancyRate.toFixed(0)}%
              occupancy rate and consistent payment collections.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
