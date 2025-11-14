import React from "react";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
