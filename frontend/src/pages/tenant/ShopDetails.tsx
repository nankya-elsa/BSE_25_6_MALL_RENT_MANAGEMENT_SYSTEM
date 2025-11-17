import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Chatbot from "../../components/common/chatbot";

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

const ShopDetails: React.FC = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      fetchShopDetails(parsedUser.id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchShopDetails = async (tenantId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/shops/tenant/${tenantId}/shops/`
      );
      setShops(response.data.shops);
    } catch (error) {
      console.error("Error fetching shop details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-6 text-xl text-gray-600">Loading shop details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shop Details Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">
            My Shop Details
          </h2>

          {shops.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">No shops assigned to you.</p>
              <p className="mt-2">Please contact the admin.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                >
                  <h3 className="text-3xl font-bold text-blue-700 mb-8">
                    Shop {shop.shop_number}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1 - Shop Info */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                      <h4 className="text-xl font-bold text-blue-700 mb-6">
                        Shop Information
                      </h4>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shop Number</span>
                          <strong>{shop.shop_number}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type</span>
                          <strong>{shop.shop_type}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Floor</span>
                          <strong>Floor {shop.floor_number}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly Rent</span>
                          <strong className="text-blue-700 text-lg">
                            UGX {shop.monthly_rent.toLocaleString()}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Card 2 - Payment Info */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                      <h4 className="text-xl font-bold text-green-700 mb-6">
                        Payment Information
                      </h4>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Paid</span>
                          <strong className="text-green-700">
                            UGX {shop.total_paid.toLocaleString()}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Balance</span>
                          <strong
                            className={`text-lg ${
                              shop.balance > 0
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            UGX {shop.balance.toLocaleString()}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Due Date</span>
                          <strong>
                            {shop.next_due_date
                              ? new Date(
                                  shop.next_due_date
                                ).toLocaleDateString()
                              : "Not set"}
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status</span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              shop.balance === 0
                                ? "bg-green-200 text-green-800"
                                : shop.balance < shop.monthly_rent
                                ? "bg-yellow-200 text-yellow-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {shop.payment_status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card 3 - Actions */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                      <h4 className="text-xl font-bold text-purple-700 mb-6">
                        Quick Actions
                      </h4>
                      <div className="space-y-4">
                        <button
                          onClick={() => navigate("/make-payment")}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition"
                        >
                          Make Payment
                        </button>
                        <button
                          onClick={() => navigate("/payment-history")}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
                        >
                          View Payment History
                        </button>
                        <div className="mt-4 p-4 bg-white rounded-lg">
                          <p className="text-sm text-gray-600 text-center">
                            Need help? Contact admin
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Add Chatbot */}
      <Chatbot />
    </div>
  );
};

export default ShopDetails;
