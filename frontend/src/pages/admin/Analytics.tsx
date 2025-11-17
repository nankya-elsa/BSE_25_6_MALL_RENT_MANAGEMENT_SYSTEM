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

interface TenantBreakdown {
  tenant_id: number;
  tenant_name: string;
  email: string;
  phone_number: string;
  total_monthly_rent: number;
  paid_this_month: number;
  total_balance: number;
  shop_count: number;
}

interface EnhancedAnalytics {
  summary: {
    total_expected_monthly: number;
    total_collected_this_month: number;
    total_outstanding_balance: number;
    collection_percentage: number;
    total_tenants: number;
    total_occupied_shops: number;
  };
  tenant_breakdown: TenantBreakdown[];
  month: string;
}

const Analytics: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [revenueData, setRevenueData] = useState<EnhancedAnalytics | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsResponse, paymentsResponse, revenueResponse] =
        await Promise.all([
          axios.get("http://localhost:8000/api/admin/stats/"),
          axios.get("http://localhost:8000/api/admin/payment-history/"),
          axios.get("http://localhost:8000/api/admin/enhanced-analytics/"),
        ]);

      setStats(statsResponse.data);
      setPayments(paymentsResponse.data.payments);
      setRevenueData(revenueResponse.data);
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
                        payments.length > 0
                          ? (mobileMoneyPayments / payments.length) * 100
                          : 0
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
                        payments.length > 0
                          ? (bankTransferPayments / payments.length) * 100
                          : 0
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
                      width: `${
                        payments.length > 0
                          ? (cashPayments / payments.length) * 100
                          : 0
                      }%`,
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
                    <span className="text-2xl">🏪</span>
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
                    <span className="text-2xl">🏪</span>
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

        {/* Revenue Insights - ENHANCED SECTION */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Revenue Insights
          </h2>

          {revenueData ? (
            <>
              {/* Top 3 Revenue Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700 mb-2">
                    Total Monthly Rent (Expected)
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    UGX{" "}
                    {revenueData.summary.total_expected_monthly.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    What you should receive
                  </p>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-700 mb-2">
                    Collected This Month
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    UGX{" "}
                    {revenueData.summary.total_collected_this_month.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Already received</p>
                </div>

                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-gray-700 mb-2">
                    Outstanding Balance
                  </p>
                  <p className="text-2xl font-bold text-red-900">
                    UGX{" "}
                    {revenueData.summary.total_outstanding_balance.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Yet to receive</p>
                </div>
              </div>

              {/* Tenant Payment Details Table */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                  Tenant Payment Breakdown
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                          Tenant Name
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Monthly Rent
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Paid This Month
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                          Balance
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {revenueData.tenant_breakdown.map((tenant) => (
                        <tr key={tenant.tenant_id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {tenant.tenant_name}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                            UGX {tenant.total_monthly_rent.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-green-600">
                            UGX {tenant.paid_this_month.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-bold text-red-600">
                            UGX {tenant.total_balance.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                tenant.total_balance === 0
                                  ? "bg-green-100 text-green-800"
                                  : tenant.total_balance <
                                    tenant.total_monthly_rent
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {tenant.total_balance === 0
                                ? "Paid"
                                : tenant.total_balance <
                                  tenant.total_monthly_rent
                                ? "Partial"
                                : "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                      <tr className="font-bold">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          TOTAL
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-blue-900">
                          UGX{" "}
                          {revenueData.summary.total_expected_monthly.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-green-900">
                          UGX{" "}
                          {revenueData.summary.total_collected_this_month.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-red-900">
                          UGX{" "}
                          {revenueData.summary.total_outstanding_balance.toLocaleString()}
                        </td>
                        <td className="px-4 py-3"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </>
          ) : (
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
          )}
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
                  Monthly Collection Rate
                </span>
                <span
                  className={`text-sm font-bold ${
                    revenueData &&
                    revenueData.summary.collection_percentage >= 80
                      ? "text-green-600"
                      : revenueData &&
                        revenueData.summary.collection_percentage >= 50
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {revenueData
                    ? revenueData.summary.collection_percentage.toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full flex items-center justify-end pr-2 ${
                    revenueData &&
                    revenueData.summary.collection_percentage >= 80
                      ? "bg-green-500"
                      : revenueData &&
                        revenueData.summary.collection_percentage >= 50
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{
                    width: `${
                      revenueData
                        ? revenueData.summary.collection_percentage
                        : 0
                    }%`,
                  }}
                >
                  {revenueData &&
                    revenueData.summary.collection_percentage > 10 && (
                      <span className="text-xs text-white font-bold"></span>
                    )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Rent collected vs expected this month
              </p>
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

          <div className="mt-6 p-4 rounded-lg border">
            {revenueData ? (
              <div
                className={`${
                  revenueData.summary.collection_percentage >= 80 &&
                  occupancyRate >= 80
                    ? "bg-green-50 border-green-200"
                    : revenueData.summary.collection_percentage >= 50 ||
                      occupancyRate >= 60
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <p
                  className={`text-sm ${
                    revenueData.summary.collection_percentage >= 80 &&
                    occupancyRate >= 80
                      ? "text-green-800"
                      : revenueData.summary.collection_percentage >= 50 ||
                        occupancyRate >= 60
                      ? "text-yellow-800"
                      : "text-red-800"
                  }`}
                >
                  <span className="font-semibold">
                    {revenueData.summary.collection_percentage >= 80 &&
                    occupancyRate >= 80
                      ? "✓"
                      : "⚠"}{" "}
                    Business Performance:
                  </span>{" "}
                  Your mall is performing{" "}
                  {revenueData.summary.collection_percentage >= 80 &&
                  occupancyRate >= 80
                    ? "excellently"
                    : revenueData.summary.collection_percentage >= 50
                    ? "well"
                    : "below expectations"}{" "}
                  with a {occupancyRate.toFixed(0)}% occupancy rate and{" "}
                  {revenueData.summary.collection_percentage.toFixed(1)}% of
                  this month's rent collected.
                </p>
              </div>
            ) : (
              <div className="bg-green-50 border-green-200">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">✓ Business Performance:</span>{" "}
                  Your mall is performing well with a {occupancyRate.toFixed(0)}
                  % occupancy rate.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
