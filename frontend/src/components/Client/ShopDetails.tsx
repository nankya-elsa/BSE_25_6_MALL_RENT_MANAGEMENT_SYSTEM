// components/ShopDetails.tsx
import React from 'react';

interface ShopDetailsProps {
  shopNumber: string;
  shopType: string;
  monthlyRent: number;
  paymentDueDate: string;
  lastPaymentDate: string;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  tenantName: string;
  contactNumber: string;
  leaseStartDate: string;
  leaseEndDate: string;
  onClose: () => void;
}

const ShopDetails: React.FC<ShopDetailsProps> = ({
  shopNumber,
  shopType,
  monthlyRent,
  paymentDueDate,
  lastPaymentDate,
  paymentStatus,
  tenantName,
  contactNumber,
  leaseStartDate,
  leaseEndDate,
  onClose
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Shop Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Shop Number</h3>
              <p className="text-lg font-semibold text-gray-900">{shopNumber}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Shop Type</h3>
              <p className="text-lg text-gray-900">{shopType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Monthly Rent</h3>
              <p className="text-lg text-gray-900">${monthlyRent.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(paymentStatus)}`}>
                {paymentStatus}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tenant Name</h3>
              <p className="text-lg text-gray-900">{tenantName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
              <p className="text-lg text-gray-900">{contactNumber}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Payment Due Date</h3>
              <p className="text-lg text-gray-900">{paymentDueDate}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Payment Date</h3>
              <p className="text-lg text-gray-900">{lastPaymentDate}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Lease Start Date</h3>
              <p className="text-lg text-gray-900">{leaseStartDate}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Lease End Date</h3>
              <p className="text-lg text-gray-900">{leaseEndDate}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md mr-2"
          >
            Close
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Make Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;