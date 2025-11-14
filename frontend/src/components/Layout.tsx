// components/Layout.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

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

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="w-full px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">H</span>
                </div>
                <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Ham Shopping Mall
                </h1>
              </div>
              
              <div className="hidden md:flex space-x-6">
                <Link 
                  to="/dashboard"
                  className={`font-medium transition-colors duration-200 pb-1 border-b-2 ${
                    isActive('/dashboard') 
                      ? 'text-blue-600 border-blue-600' 
                      : 'text-gray-700 border-transparent hover:text-blue-600 hover:border-blue-600'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/dashboard"
                  onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
                  className={`font-medium transition-colors duration-200 pb-1 border-b-2 ${
                    location.pathname === '/dashboard' && window.scrollY > 300
                      ? 'text-blue-600 border-blue-600' 
                      : 'text-gray-700 border-transparent hover:text-blue-600 hover:border-blue-600'
                  }`}
                >
                  Shop Details
                </Link>
                <Link 
                  to="/payment"
                  className={`font-medium transition-colors duration-200 pb-1 border-b-2 ${
                    isActive('/payment') 
                      ? 'text-blue-600 border-blue-600' 
                      : 'text-gray-700 border-transparent hover:text-blue-600 hover:border-blue-600'
                  }`}
                >
                  Make Payment
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="font-semibold text-gray-800">{user?.first_name}</p>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="text-lg font-bold">
                    {user?.first_name?.charAt(0).toUpperCase()}
                  </span>
                </button>
                
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user?.first_name} {user?.last_name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 w-full transition-colors"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Page Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default Layout;