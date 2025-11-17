import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface RegisterFormData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  shop_numbers: string[];
  join_date: string;
}

interface ShopOption {
  shop_number: string;
  monthly_rent: number;
  shop_type: string;
  floor_number: number;
}

const RegisterTenant: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    shop_numbers: [],
    join_date: new Date().toISOString().split("T")[0],
  });
  const [generalError, setGeneralError] = useState<string>("");
  const [availableShops, setAvailableShops] = useState<ShopOption[]>([]);
  const [tempPassword, setTempPassword] = useState<string>("");
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);

  useEffect(() => {
    fetchAvailableShops();
  }, []);

  const fetchAvailableShops = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/shops/available-shops/"
      );
      setAvailableShops(response.data.shops);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleShopSelection = (shopNumber: string) => {
    setFormData((prev) => ({
      ...prev,
      shop_numbers: prev.shop_numbers.includes(shopNumber)
        ? prev.shop_numbers.filter((num) => num !== shopNumber)
        : [...prev.shop_numbers, shopNumber],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    setGeneralError("");

    if (formData.shop_numbers.length === 0) {
      setErrors({ shop_numbers: "Please select at least one shop" });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/register-tenant/",
        formData
      );

      setSuccess(true);
      setTempPassword(response.data.temp_password);
      setShowPasswordAlert(true);

      // Remove assigned shops from available list
      setAvailableShops((prev) =>
        prev.filter((shop) => !formData.shop_numbers.includes(shop.shop_number))
      );

      // Reset form
      setFormData({
        email: "",
        username: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        shop_numbers: [],
        join_date: new Date().toISOString().split("T")[0],
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      console.error("Registration error:", err);

      if (axios.isAxiosError(err)) {
        const errorResponse = err.response;

        if (errorResponse && typeof errorResponse.data === "object") {
          const errorData = errorResponse.data as Record<string, unknown>;

          if (errorData.errors && typeof errorData.errors === "object") {
            const newErrors: Record<string, string> = {};
            Object.entries(errorData.errors as Record<string, unknown>).forEach(
              ([key, value]) => {
                if (Array.isArray(value) && typeof value[0] === "string") {
                  newErrors[key] = value[0];
                } else if (typeof value === "string") {
                  newErrors[key] = value;
                }
              }
            );
            setErrors(newErrors);
          }

          if (typeof errorData.message === "string") {
            setGeneralError(errorData.message);
          } else if (typeof errorData.detail === "string") {
            setGeneralError(errorData.detail);
          } else {
            setGeneralError(
              "Registration failed. Please check the form and try again."
            );
          }
        } else if (err.request) {
          setGeneralError(
            "Cannot connect to server. Please check your internet connection and try again."
          );
        } else {
          setGeneralError("An unexpected error occurred. Please try again.");
        }
      } else if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl ml-32">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Register New Tenant
        </h1>

        {/* Temporary Password Alert - Dismissible */}
        {showPasswordAlert && tempPassword && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <button
              onClick={() => {
                setShowPasswordAlert(false);
                setSuccess(false);
              }}
              className="absolute top-2 right-2 text-green-700 hover:text-green-900"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <p className="font-semibold">Tenant registered successfully!</p>
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-300 rounded">
              <p className="text-sm font-medium text-yellow-800">
                Temporary Password:{" "}
                <span className="font-mono bg-white px-2 py-1 rounded select-all">
                  {tempPassword}
                </span>
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Please share this password with the tenant. They should change
                it on first login.
              </p>
            </div>
          </div>
        )}

        {/* General Error Message */}
        {generalError && !success && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-red-800">
                  Registration Failed
                </h3>
                <p className="text-sm text-red-700 mt-1">{generalError}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Personal Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  {errors.first_name && (
                    <p className="text-red-600 text-xs mt-1 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.first_name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  {errors.last_name && (
                    <p className="text-red-600 text-xs mt-1 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Account Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  {errors.username && (
                    <p className="text-red-600 text-xs mt-1 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.username}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="e.g., 0701234567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  {errors.phone_number && (
                    <p className="text-red-600 text-xs mt-1 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.phone_number}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Shop Assignment */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Shop Assignment
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Join Date
                </label>
                <input
                  type="date"
                  name="join_date"
                  value={formData.join_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Shop(s) *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-md">
                  {availableShops.length === 0 ? (
                    <p className="text-gray-500 col-span-2 text-center py-4">
                      No available shops. All shops are currently occupied.
                    </p>
                  ) : (
                    availableShops.map((shop) => (
                      <div
                        key={shop.shop_number}
                        className={`p-3 border rounded-md cursor-pointer transition ${
                          formData.shop_numbers.includes(shop.shop_number)
                            ? "border-red-600 bg-red-50"
                            : "border-gray-300 hover:border-red-400"
                        }`}
                        onClick={() => handleShopSelection(shop.shop_number)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-900">
                              Shop {shop.shop_number}
                            </p>
                            <p className="text-sm text-gray-600">
                              {shop.shop_type}
                            </p>
                            <p className="text-sm text-gray-500">
                              Floor {shop.floor_number}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">
                              UGX {shop.monthly_rent.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">/month</p>
                          </div>
                        </div>
                        {formData.shop_numbers.includes(shop.shop_number) && (
                          <div className="mt-2 text-red-600 text-sm font-medium">
                            ✓ Selected
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                {errors.shop_numbers && (
                  <p className="text-red-600 text-xs mt-2">
                    {errors.shop_numbers}
                  </p>
                )}
                {formData.shop_numbers.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {formData.shop_numbers.length} shop(s) selected
                  </p>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/tenants")}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Registering..." : "Register Tenant"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RegisterTenant;
