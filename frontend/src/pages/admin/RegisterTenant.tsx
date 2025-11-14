import React, { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface RegisterFormData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  password: string;
  password_confirm: string;
}

const RegisterTenant: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    password: "",
    password_confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await axios.post(
        "http://localhost:8000/api/admin/register-tenant/",
        formData
      );
      setSuccess(true);
      setTimeout(() => {
        navigate("/admin/tenants");
      }, 2000);
    } catch (error) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: { data: { errors?: Record<string, string> } };
        };
        if (axiosError.response?.data?.errors) {
          setErrors(axiosError.response.data.errors);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Register New Tenant
        </h1>

        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Tenant registered successfully! Redirecting...
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
                    <p className="text-red-600 text-xs mt-1">
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
                    <p className="text-red-600 text-xs mt-1">
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
                    <p className="text-red-600 text-xs mt-1">
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
                    <p className="text-red-600 text-xs mt-1">{errors.email}</p>
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
                    <p className="text-red-600 text-xs mt-1">
                      {errors.phone_number}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Security
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  {errors.password && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="password_confirm"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
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
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium disabled:opacity-50"
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
