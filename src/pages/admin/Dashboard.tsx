import { Routes, Route } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2 } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";
import Overview from "@/components/admin/Overview";
import PaymentsManagement from "@/components/admin/PaymentsManagement";
import AbstractsManagement from "@/components/admin/AbstractsManagement";
import UsersManagement from "@/components/admin/UsersManagement";

const AdminDashboard = () => {
  const { loading, isAdmin } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-soft-white" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/payments" element={<PaymentsManagement />} />
          <Route path="/abstracts" element={<AbstractsManagement />} />
          <Route path="/users" element={<UsersManagement />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
