import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, Receipt, FileText, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const navItems = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
    { to: "/admin/dashboard/payments", icon: Receipt, label: "Payments" },
    { to: "/admin/dashboard/abstracts", icon: FileText, label: "Abstracts" },
    { to: "/admin/dashboard/users", icon: Users, label: "Users" },
  ];

  return (
    <aside className="w-64 min-h-screen glass border-r border-soft-white/20 p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-soft-white mb-1">ISEED Admin</h1>
        <p className="text-soft-white/70 text-sm">Management Dashboard</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin/dashboard"}
            className="flex items-center px-4 py-3 rounded-lg text-soft-white/70 hover:bg-soft-white/10 transition-colors"
            activeClassName="bg-soft-white/20 text-soft-white font-semibold"
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Button
        variant="outline"
        onClick={handleLogout}
        className="w-full glass border-soft-white/20 text-soft-white hover:bg-soft-white/10"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </aside>
  );
};

export default Sidebar;
