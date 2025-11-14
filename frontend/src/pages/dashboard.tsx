// pages/DashboardPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  user_type: string;
  full_name: string;
}

interface ShopDetails {
  shopNumber: string;
  shopType: string;
  floor: string;
  size: string;
  monthlyRent: number;
  paymentDueDate: string;
  lastPaymentDate: string;
  nextPaymentDate: string;
  outstandingBalance: number;
  status: string;
  tenantName: string;
  leaseStartDate: string;
  leaseEndDate: string;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [shopDetails, setShopDetails] = useState<ShopDetails | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Mock shop details
      setShopDetails({
        shopNumber: "A-123",
        shopType: "Retail",
        floor: "Ground Floor",
        size: "250 sq ft",
        monthlyRent: 2500,
        paymentDueDate: "2025-11-30",
        lastPaymentDate: "2025-10-31",
        nextPaymentDate: "2025-11-30",
        outstandingBalance: 0,
        status: "Active",
        tenantName: `${parsedUser.first_name} ${parsedUser.last_name}`,
        leaseStartDate: "2023-01-01",
        leaseEndDate: "2025-12-31"
      });
      
      setLoading(false);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleMakePayment = () => {
    navigate("/payment");
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              HAM SHOPPING MALL
            </h1>
            <h2 className="text-3xl font-light mb-4">
              Rent Management System
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Your one-stop solution for seamless rent management
            </p>
          </div>
        </div>
      </div>

      {/* Shop Details Section - Always Visible */}
      {shopDetails && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <h2 className="text-3xl font-bold flex items-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Shop Details
              </h2>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Shop Information Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    Shop Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-blue-100">
                      <span className="text-gray-600">Shop Number</span>
                      <span className="font-bold text-gray-800">{shopDetails.shopNumber}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-100">
                      <span className="text-gray-600">Shop Type</span>
                      <span className="font-bold text-gray-800">{shopDetails.shopType}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-100">
                      <span className="text-gray-600">Floor</span>
                      <span className="font-bold text-gray-800">{shopDetails.floor}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Size</span>
                      <span className="font-bold text-gray-800">{shopDetails.size}</span>
                    </div>
                  </div>
                </div>
                
                {/* Lease Information Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    Lease Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-green-100">
                      <span className="text-gray-600">Tenant Name</span>
                      <span className="font-bold text-gray-800">{shopDetails.tenantName}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-green-100">
                      <span className="text-gray-600">Lease Start</span>
                      <span className="font-bold text-gray-800">{shopDetails.leaseStartDate}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-green-100">
                      <span className="text-gray-600">Lease End</span>
                      <span className="font-bold text-gray-800">{shopDetails.leaseEndDate}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Monthly Rent</span>
                      <span className="font-bold text-green-600">${shopDetails.monthlyRent}</span>
                    </div>
                  </div>
                </div>
                
                {/* Payment Information Card */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    Payment Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-purple-100">
                      <span className="text-gray-600">Payment Due</span>
                      <span className="font-bold text-gray-800">{shopDetails.paymentDueDate}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-purple-100">
                      <span className="text-gray-600">Last Payment</span>
                      <span className="font-bold text-gray-800">{shopDetails.lastPaymentDate}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-purple-100">
                      <span className="text-gray-600">Next Payment</span>
                      <span className="font-bold text-gray-800">{shopDetails.nextPaymentDate}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Outstanding</span>
                      <span className={`font-bold text-lg ${
                        shopDetails.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        ${shopDetails.outstandingBalance}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <button 
                  onClick={handleMakePayment}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Make Payment
                </button>
                <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Payment History
                </button>
                <button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Lease
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;