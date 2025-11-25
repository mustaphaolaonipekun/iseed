import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Receipt, FileText, Clock } from "lucide-react";
import { Loader2 } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalPayments: number;
  totalAbstracts: number;
  pendingPayments: number;
  pendingAbstracts: number;
}

const Overview = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalPayments: 0,
    totalAbstracts: 0,
    pendingPayments: 0,
    pendingAbstracts: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [usersRes, paymentsRes, abstractsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("payments").select("*"),
        supabase.from("abstracts").select("*")
      ]);

      const pendingPayments = paymentsRes.data?.filter(p => p.receipt_status === "pending").length || 0;
      const pendingAbstracts = abstractsRes.data?.filter(a => a.abstract_status === "pending").length || 0;

      setStats({
        totalUsers: usersRes.count || 0,
        totalPayments: paymentsRes.data?.length || 0,
        totalAbstracts: abstractsRes.data?.length || 0,
        pendingPayments,
        pendingAbstracts
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-bright-aqua"
    },
    {
      title: "Total Payments",
      value: stats.totalPayments,
      icon: Receipt,
      color: "text-emerald-green"
    },
    {
      title: "Total Abstracts",
      value: stats.totalAbstracts,
      icon: FileText,
      color: "text-primary"
    },
    {
      title: "Pending Reviews",
      value: stats.pendingPayments + stats.pendingAbstracts,
      icon: Clock,
      color: "text-bright-aqua"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-soft-white" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-soft-white mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <Card key={card.title} className="glass border-soft-white/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-soft-white/70">
                {card.title}
              </CardTitle>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-soft-white">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass border-soft-white/20">
          <CardHeader>
            <CardTitle className="text-soft-white">Payment Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-soft-white/70">
              <span>Pending Verification</span>
              <span className="font-semibold text-bright-aqua">{stats.pendingPayments}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-soft-white/20">
          <CardHeader>
            <CardTitle className="text-soft-white">Abstract Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-soft-white/70">
              <span>Pending Review</span>
              <span className="font-semibold text-bright-aqua">{stats.pendingAbstracts}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
