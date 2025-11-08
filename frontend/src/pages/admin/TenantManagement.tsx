import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import axios from "axios";

interface Tenant {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  shop_count: number;
  shops: Array<{ shop_number: string; monthly_rent: number }>;
  created_at: string;
}

const TenantManagement: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/tenants/"
      );
      setTenants(response.data.tenants);
    } catch (error) {
      console.error("Error fetching tenants:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Tenant Management
        </h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search tenants by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Tenants Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Tenant Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Shops
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {tenant.full_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {tenant.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {tenant.phone_number || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {tenant.shop_count} shop
                      {tenant.shop_count !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(tenant.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-red-600 hover:text-red-800 font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTenants.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No tenants found
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default TenantManagement;
