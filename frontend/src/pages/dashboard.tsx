// pages/DashboardPage.tsx
import React, { useState, useEffect } from "react";
import mallBackground from "../assets/images/mall.jpg";

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
  outstandingBalance: number;
  tenantName: string;
  leaseStartDate: string;
  leaseEndDate: string;
}

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [shopDetails, setShopDetails] = useState<ShopDetails | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      setShopDetails({
        shopNumber: "A-123",
        shopType: "Retail",
        floor: "Ground Floor",
        size: "250 sq ft",
        monthlyRent: 2500,
        paymentDueDate: "2025-11-30",
        lastPaymentDate: "2025-10-31",
        outstandingBalance: 0,
        tenantName:
          `${parsedUser.first_name} ${parsedUser.last_name}`.toUpperCase(),
        leaseStartDate: "2023-01-01",
        leaseEndDate: "2025-12-31",
      });

      setLoading(false);
    }
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-6 text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      {/* HERO SECTION */}
      <div
        className="relative h-screen w-full bg-cover bg-center flex items-center justify-center text-center text-white px-6"
        style={{ backgroundImage: `url(${mallBackground})` }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 max-w-5xl">
          <h1 className="text-6xl md:text-8xl font-black mb-4 drop-shadow-2xl">
            HAM SHOPPING MALL
          </h1>
          <h2 className="text-3xl md:text-5xl font-light mb-6 tracking-wider">
            RENT MANAGEMENT SYSTEM
          </h2>
          <p className="text-xl mb-16 max-w-2xl mx-auto opacity-90">
            Your one-stop solution for seamless rent management
          </p>

          {/* RECTANGULAR BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <button
              onClick={() => scrollToSection("shop-details")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl py-5 px-16 rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              View Shop Details
            </button>
            <button
              onClick={() => scrollToSection("payment-card")}
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-xl py-5 px-16 rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Make Payment
            </button>
          </div>
        </div>
      </div>

      {/* SHOP DETAILS SECTION - 3 FLOATING CARDS ONLY */}
      <section id="shop-details" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">
            Shop Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Card 1 - Shop Info */}
            <div className="bg-white rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
              <h3 className="text-2xl font-bold text-blue-700 mb-8">
                Shop Information
              </h3>
              <div className="space-y-6 text-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Shop No.</span>{" "}
                  <strong>{shopDetails?.shopNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>{" "}
                  <strong>{shopDetails?.shopType}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Floor</span>{" "}
                  <strong>{shopDetails?.floor}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size</span>{" "}
                  <strong>{shopDetails?.size}</strong>
                </div>
              </div>
            </div>

            {/* Card 2 - Lease Info */}
            <div className="bg-white rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
              <h3 className="text-2xl font-bold text-emerald-700 mb-8">
                Lease Information
              </h3>
              <div className="space-y-6 text-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tenant</span>{" "}
                  <strong>{shopDetails?.tenantName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date</span>{" "}
                  <strong>{shopDetails?.leaseStartDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date</span>{" "}
                  <strong>{shopDetails?.leaseEndDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Rent</span>{" "}
                  <strong className="text-emerald-700 font-bold">
                    ${shopDetails?.monthlyRent}
                  </strong>
                </div>
              </div>
            </div>

            {/* Card 3 - Payment Status (Make Payment scrolls here) */}
            <div
              id="payment-card"
              className="bg-white rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
            >
              <h3 className="text-2xl font-bold text-purple-700 mb-8">
                Payment Status
              </h3>
              <div className="space-y-6 text-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date</span>{" "}
                  <strong>{shopDetails?.paymentDueDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Paid</span>{" "}
                  <strong>{shopDetails?.lastPaymentDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Outstanding</span>
                  <strong
                    className={`font-bold text-2xl ${
                      (shopDetails?.outstandingBalance ?? 0) > 0
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    ${shopDetails?.outstandingBalance ?? 0}
                  </strong>
                </div>
                <div className="mt-10 text-center">
                  <span className="inline-block px-8 py-3 bg-green-100 text-green-800 rounded-full font-bold text-lg">
                    ACTIVE & PAID
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
