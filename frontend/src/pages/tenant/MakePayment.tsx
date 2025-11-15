import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Shop {
  id: number;
  shop_number: string;
  shop_type: string;
  floor_number: number;
  monthly_rent: number;
  total_paid: number;
  balance: number;
  next_due_date: string | null;
  payment_status: string;
}

interface User {
  id: number;
  full_name: string;
  email: string;
}

interface PaymentFormData {
  shop_id: number | null;
  amount: string;
  payment_method: string;
  reference: string;
}

const MakePayment: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<PaymentFormData>({
    shop_id: null,
    amount: "",
    payment_method: "mobile_money",
    reference: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchTenantShops(parsedUser.id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchTenantShops = async (tenantId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/shops/tenant/${tenantId}/shops/`
      );
      setShops(response.data.shops);

      // Auto-select first shop if only one
      if (response.data.shops.length === 1) {
        const shop = response.data.shops[0];
        setSelectedShop(shop);
        setFormData((prev) => ({ ...prev, shop_id: shop.id }));
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
      setError("Failed to load your shops. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleShopChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const shopId = parseInt(e.target.value);
    const shop = shops.find((s) => s.id === shopId) || null;
    setSelectedShop(shop);
    setFormData((prev) => ({ ...prev, shop_id: shopId }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.shop_id) {
      setError("Please select a shop");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (amount > 10000000) {
      setError("Amount seems too large. Please verify.");
      return;
    }

    setShowConfirmation(true);
  };

  const confirmPayment = async () => {
    if (!user) return;

    setProcessing(true);
    setError("");

    try {
      await axios.post("http://localhost:8000/api/shops/payment/make/", {
        ...formData,
        tenant_id: user.id,
        amount: parseFloat(formData.amount),
      });

      setSuccess(true);
      setShowConfirmation(false);

      // Refresh shop data
      await fetchTenantShops(user.id);

      // Reset form
      setFormData({
        shop_id: selectedShop?.id || null,
        amount: "",
        payment_method: "mobile_money",
        reference: "",
      });

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: unknown) {
      console.error("Payment error:", err);

      if (axios.isAxiosError(err)) {
        const apiError = err.response?.data as { error?: string } | undefined;
        setError(apiError?.error ?? "Payment failed. Please try again.");
      } else if (err instanceof Error) {
        setError(err.message || "Payment failed. Please try again.");
      } else {
        setError("Payment failed. Please try again.");
      }

      setShowConfirmation(false);
    } finally {
      setProcessing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Ham Shopping Mall
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-gray-600 hover:text-gray-900"
              >
                Back to Dashboard
              </button>
              <span className="text-gray-600">Welcome, {user?.full_name}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Make Payment</h1>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p className="font-semibold">✓ Payment processed successfully!</p>
            <p className="text-sm mt-1">
              Your payment has been recorded and your balance has been updated.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-semibold">⚠ {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Payment Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tenant Name (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tenant Name
                </label>
                <input
                  type="text"
                  value={user?.full_name || ""}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>

              {/* Shop Selection */}
              {shops.length > 1 ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Shop *
                  </label>
                  <select
                    name="shop_id"
                    value={formData.shop_id || ""}
                    onChange={handleShopChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">-- Select a shop --</option>
                    {shops.map((shop) => (
                      <option key={shop.id} value={shop.id}>
                        Shop {shop.shop_number} - Balance: UGX{" "}
                        {shop.balance.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
              ) : shops.length === 1 ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Number
                  </label>
                  <input
                    type="text"
                    value={`Shop ${shops[0].shop_number}`}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              ) : (
                <div className="text-red-600 text-sm">
                  No shops assigned to you. Please contact admin.
                </div>
              )}

              {/* Payment Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount (UGX) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  required
                  min="1"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can pay any amount (partial or full payment)
                </p>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="mobile_money">Mobile Money</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              {/* Reference Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Number (Optional)
                </label>
                <input
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  placeholder="e.g., Transaction ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing || !selectedShop}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Payment
              </button>
            </form>
          </div>

          {/* Shop Details & Summary */}
          {selectedShop && (
            <div className="space-y-6">
              {/* Shop Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Shop Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shop Number:</span>
                    <span className="font-medium text-gray-900">
                      {selectedShop.shop_number}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shop Type:</span>
                    <span className="font-medium text-gray-900">
                      {selectedShop.shop_type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Floor:</span>
                    <span className="font-medium text-gray-900">
                      {selectedShop.floor_number}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Rent:</span>
                    <span className="font-bold text-green-600">
                      UGX {selectedShop.monthly_rent.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Paid:</span>
                    <span className="font-medium text-gray-900">
                      UGX {selectedShop.total_paid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Current Balance:</span>
                    <span
                      className={`font-bold ${
                        selectedShop.balance > 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      UGX {selectedShop.balance.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Due Date:</span>
                    <span className="font-medium text-gray-900">
                      {selectedShop.next_due_date
                        ? new Date(
                            selectedShop.next_due_date
                          ).toLocaleDateString()
                        : "Not set"}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-blue-300">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedShop.balance <= 0
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {selectedShop.payment_status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Quick Amount Selection
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        amount: selectedShop.monthly_rent.toString(),
                      }))
                    }
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    Full Rent
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        amount: (selectedShop.monthly_rent / 2).toString(),
                      }))
                    }
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    Half Rent
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        amount: selectedShop.balance.toString(),
                      }))
                    }
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                    disabled={selectedShop.balance <= 0}
                  >
                    Pay Balance
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        amount: (selectedShop.monthly_rent * 2).toString(),
                      }))
                    }
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    2 Months
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && selectedShop && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Confirm Payment
              </h2>
              <div className="space-y-3 mb-6">
                <p className="text-gray-700">
                  You are about to pay{" "}
                  <span className="font-bold text-blue-600">
                    UGX {parseFloat(formData.amount).toLocaleString()}
                  </span>{" "}
                  for Shop{" "}
                  <span className="font-bold">{selectedShop.shop_number}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Payment Method:{" "}
                  <span className="font-medium">
                    {formData.payment_method.replace("_", " ").toUpperCase()}
                  </span>
                </p>
                {formData.reference && (
                  <p className="text-sm text-gray-600">
                    Reference:{" "}
                    <span className="font-medium">{formData.reference}</span>
                  </p>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={confirmPayment}
                  disabled={processing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium disabled:opacity-50"
                >
                  {processing ? "Processing..." : "Confirm Payment"}
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  disabled={processing}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MakePayment;
