import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import axios from "axios";

interface ProfileRequest {
  id: number;
  tenant_name: string;
  tenant_email: string;
  requested_changes: Record<string, string>;
  reason: string;
  status: string;
  created_at: string;
}

const ProfileRequests: React.FC = () => {
  const [requests, setRequests] = useState<ProfileRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/profile-requests/"
      );
      setRequests(response.data.requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    if (!window.confirm("Are you sure you want to approve this request?"))
      return;

    try {
      await axios.post(
        `http://localhost:8000/api/admin/profile-requests/${requestId}/approve/`
      );
      alert("Request approved successfully");
      fetchRequests();
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Failed to approve request");
    }
  };

  const handleReject = async (requestId: number) => {
    if (!window.confirm("Are you sure you want to reject this request?"))
      return;

    try {
      await axios.post(
        `http://localhost:8000/api/admin/profile-requests/${requestId}/reject/`
      );
      alert("Request rejected");
      fetchRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request");
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (filter === "all") return true;
    return req.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
          Profile Change Requests
        </h1>

        {/* Filter Buttons */}
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md font-medium ${
              filter === "all"
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            All ({requests.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-md font-medium ${
              filter === "pending"
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Pending ({requests.filter((r) => r.status === "pending").length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-md font-medium ${
              filter === "approved"
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Approved ({requests.filter((r) => r.status === "approved").length})
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded-md font-medium ${
              filter === "rejected"
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Rejected ({requests.filter((r) => r.status === "rejected").length})
          </button>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {request.tenant_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {request.tenant_email}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Requested on{" "}
                    {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    request.status
                  )}`}
                >
                  {request.status.toUpperCase()}
                </span>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Requested Changes:
                </h4>
                <div className="bg-gray-50 rounded-md p-4 space-y-2">
                  {Object.entries(request.requested_changes).map(
                    ([field, value]) => (
                      <div key={field} className="flex">
                        <span className="font-medium text-gray-700 w-32">
                          {field}:
                        </span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {request.reason && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Reason:
                  </h4>
                  <p className="text-gray-600 text-sm">{request.reason}</p>
                </div>
              )}

              {request.status === "pending" && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}

          {filteredRequests.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
              No {filter !== "all" && filter} requests found
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProfileRequests;
