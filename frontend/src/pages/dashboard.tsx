// pages/DashboardPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));

      setLoading(false);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
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

  if (!user) {
    return null;
  }

  return (
    <>
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
                <span className="text-gray-600">
                  Welcome, {user.first_name}!
                </span>
                <div className="relative">
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
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

            {/* Action Buttons */}
            <div className="flex justify-center space-x-6 mb-8">
              <button
                onClick={() => navigate("/my-shops")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-200"
              >
                View Shop Details
              </button>
              <button
                onClick={() => navigate("/make-payment")}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-200"
              >
                Make Payment
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-center space-x-8">
            <button
              onClick={() => navigate("/my-shops")}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">
                View Shop Details
              </span>
            </button>

            <button
              onClick={() => navigate("/make-payment")}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">
                Make Payment
              </span>
            </button>

            <button
              onClick={() => navigate("/payment-history")}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">
                Payment History
              </span>
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
