import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, Upload, FileText, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import PaymentUpload from "@/components/PaymentUpload";
import AbstractUpload from "@/components/AbstractUpload";

interface Profile {
  full_name: string;
  email: string;
  role: string;
  ticket_type: string;
}

interface Payment {
  receipt_status: string;
  receipt_url: string | null;
  receipt_rejection_reason: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      setUserId(session.user.id);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData as any);

      // Check if user has admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleData) {
        navigate("/admin/dashboard");
        return;
      }

      // Fetch payment status
      const { data: paymentData, error: paymentError } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (paymentError) throw paymentError;
      setPayment(paymentData);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "not_uploaded":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted/50 text-muted-foreground">
            <AlertCircle className="w-4 h-4 mr-1" />
            Not Uploaded
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-bright-aqua/20 text-bright-aqua">
            <Clock className="w-4 h-4 mr-1" />
            Pending Verification
          </span>
        );
      case "verified":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-green/20 text-emerald-green">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Verified
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-destructive/20 text-destructive">
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-soft-white" />
      </div>
    );
  }

  const isPaymentVerified = payment?.receipt_status === "verified";

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-start mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-soft-white mb-2">
              Welcome, {profile?.full_name}
            </h1>
            <p className="text-soft-white/70">Manage your ISEED 2025 registration</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="glass border-soft-white/20 text-soft-white">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="glass border-soft-white/20 mb-6">
            <CardHeader>
              <CardTitle className="text-soft-white">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-soft-white/70 text-sm">Email</p>
                <p className="text-soft-white font-medium">{profile?.email}</p>
              </div>
              <div>
                <p className="text-soft-white/70 text-sm">Ticket Type</p>
                <p className="text-soft-white font-medium capitalize">{profile?.ticket_type}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="glass border-soft-white/20 mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-soft-white">Payment Status</CardTitle>
                  <CardDescription className="text-soft-white/70">
                    Upload your payment receipt to proceed
                  </CardDescription>
                </div>
                {getStatusBadge(payment?.receipt_status || "not_uploaded")}
              </div>
            </CardHeader>
            <CardContent>
              {payment?.receipt_status === "rejected" && payment.receipt_rejection_reason && (
                <div className="mb-4 p-4 glass-dark rounded-lg border border-destructive/50">
                  <p className="text-destructive font-semibold mb-1">Rejection Reason:</p>
                  <p className="text-soft-white/80">{payment.receipt_rejection_reason}</p>
                </div>
              )}
              
              {userId && (
                <PaymentUpload 
                  userId={userId} 
                  onUploadSuccess={checkAuth}
                  currentStatus={payment?.receipt_status || "not_uploaded"}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Abstract Submission Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className={`glass border-soft-white/20 ${!isPaymentVerified ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-soft-white">Abstract Submission</CardTitle>
                  <CardDescription className="text-soft-white/70">
                    {isPaymentVerified 
                      ? "Submit your research abstract" 
                      : "Payment must be verified before submission"}
                  </CardDescription>
                </div>
                {!isPaymentVerified && (
                  <span className="text-bright-aqua text-sm font-medium">
                    🔒 Locked
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isPaymentVerified && userId ? (
                <AbstractUpload userId={userId} onUploadSuccess={checkAuth} />
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-soft-white/30 mx-auto mb-3" />
                  <p className="text-soft-white/70">
                    Please wait for your payment to be verified to unlock abstract submission.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;