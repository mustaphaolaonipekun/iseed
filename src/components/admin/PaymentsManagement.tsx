import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, Eye, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Payment {
  id: string;
  user_id: string;
  receipt_status: string;
  receipt_url: string | null;
  receipt_uploaded_at: string | null;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

const PaymentsManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          profiles!payments_user_id_fkey (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("payments")
        .update({
          receipt_status: "verified",
          verified_at: new Date().toISOString(),
          verified_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq("id", paymentId);

      if (error) throw error;

      toast({
        title: "Payment Approved",
        description: "Payment has been verified successfully"
      });

      loadPayments();
      setSelectedPayment(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (paymentId: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a rejection reason",
        variant: "destructive"
      });
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("payments")
        .update({
          receipt_status: "rejected",
          receipt_rejection_reason: rejectionReason,
          verified_at: new Date().toISOString(),
          verified_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq("id", paymentId);

      if (error) throw error;

      toast({
        title: "Payment Rejected",
        description: "Rejection notification sent to user"
      });

      loadPayments();
      setSelectedPayment(null);
      setRejectionReason("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const profile = payment.profiles as any;
    return (
      profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receipt_status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      not_uploaded: "bg-muted/50 text-muted-foreground",
      pending: "bg-bright-aqua/20 text-bright-aqua",
      verified: "bg-emerald-green/20 text-emerald-green",
      rejected: "bg-destructive/20 text-destructive"
    };
    return <Badge className={variants[status] || ""}>{status.replace("_", " ")}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-soft-white" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-soft-white">Payments Management</h2>
      </div>

      <Card className="glass border-soft-white/20 mb-6">
        <CardHeader>
          <CardTitle className="text-soft-white">Search Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-soft-white/50" />
            <Input
              placeholder="Search by name, email, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass border-soft-white/20 text-soft-white"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-soft-white/20">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-soft-white/20">
                <TableHead className="text-soft-white">User</TableHead>
                <TableHead className="text-soft-white">Email</TableHead>
                <TableHead className="text-soft-white">Status</TableHead>
                <TableHead className="text-soft-white">Uploaded</TableHead>
                <TableHead className="text-soft-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => {
                const profile = payment.profiles as any;
                return (
                  <TableRow key={payment.id} className="border-soft-white/20">
                    <TableCell className="text-soft-white">{profile?.full_name}</TableCell>
                    <TableCell className="text-soft-white/70">{profile?.email}</TableCell>
                    <TableCell>{getStatusBadge(payment.receipt_status)}</TableCell>
                    <TableCell className="text-soft-white/70">
                      {payment.receipt_uploaded_at
                        ? new Date(payment.receipt_uploaded_at).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPayment(payment)}
                        disabled={!payment.receipt_url}
                        className="glass border-soft-white/20 text-soft-white"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="glass border-soft-white/20 text-soft-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-soft-white">Payment Review</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-soft-white/70">User</p>
                <p className="font-semibold">{(selectedPayment.profiles as any)?.full_name}</p>
              </div>
              
              {selectedPayment.receipt_url && (
                <div>
                  <p className="text-sm text-soft-white/70 mb-2">Receipt Image</p>
                  <img
                    src={selectedPayment.receipt_url}
                    alt="Receipt"
                    className="w-full rounded-lg border border-soft-white/20"
                  />
                </div>
              )}

              {selectedPayment.receipt_status === "pending" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm text-soft-white/70">Rejection Reason (if rejecting)</label>
                    <Textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Provide a reason for rejection..."
                      className="glass border-soft-white/20 text-soft-white"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(selectedPayment.id)}
                      disabled={actionLoading}
                      className="flex-1 bg-emerald-green hover:bg-emerald-green/80 text-soft-white"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedPayment.id)}
                      disabled={actionLoading}
                      variant="destructive"
                      className="flex-1"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                      Reject
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsManagement;
