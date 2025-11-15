import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import axios from "axios";

interface Shop {
  shop_number: string;
  monthly_rent: number;
}

interface Tenant {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  shop_count: number;
  shops: Shop[];
  created_at: string;
}

const TenantManagement: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleViewDetails = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowDeleteConfirm(false);
    setSelectedTenant(null);
  };

  const handleDeleteTenant = async () => {
    if (!selectedTenant) return;

    setDeleting(true);
    try {
      await axios.delete(
        `http://localhost:8000/api/admin/tenants/${selectedTenant.id}/delete/`
      );

      // Refresh tenant list
      await fetchTenants();

      // Close modal
      handleCloseModal();

      alert("Tenant deleted successfully");
    } catch (error) {
      console.error("Error deleting tenant:", error);
      alert("Failed to delete tenant. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTotalRent = (shops: Shop[]) => {
    return shops.reduce((total, shop) => total + shop.monthly_rent, 0);
  };

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
                  Shop Number(s)
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
                    <div className="flex flex-wrap gap-1">
                      {tenant.shops.map((shop) => (
                        <span
                          key={shop.shop_number}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
                        >
                          {shop.shop_number}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(tenant.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleViewDetails(tenant)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
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

        {/* Tenant Details Modal */}
        {showModal && selectedTenant && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-black text-white px-6 py-4 flex justify-between items-center sticky top-0">
                <h2 className="text-xl font-bold">Tenant Details</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:text-gray-300"
                >
                  <svg
                    className="h-6 w-6"
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
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* Personal Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedTenant.full_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedTenant.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedTenant.phone_number || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date Joined</p>
                      <p className="text-base font-medium text-gray-900">
                        {new Date(selectedTenant.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shop Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                    Assigned Shops
                  </h3>
                  <div className="space-y-3">
                    {selectedTenant.shops.map((shop) => (
                      <div
                        key={shop.shop_number}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            Shop {shop.shop_number}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            UGX {shop.monthly_rent.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">/month</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Rent */}
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-900">
                        Total Monthly Rent
                      </p>
                      <p className="text-xl font-bold text-green-600">
                        UGX{" "}
                        {getTotalRent(selectedTenant.shops).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 mb-3">
                      Are you sure you want to delete this tenant? This action
                      cannot be undone. The assigned shops will be marked as
                      vacant.
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleDeleteTenant}
                        disabled={deleting}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
                      >
                        {deleting ? "Deleting..." : "Yes, Delete"}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 sticky bottom-0">
                {!showDeleteConfirm && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                  >
                    Delete Tenant
                  </button>
                )}
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TenantManagement;
