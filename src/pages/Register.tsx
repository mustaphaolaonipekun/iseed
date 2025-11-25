import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    ticketType: "",
    affiliation: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (!formData.ticketType) {
      toast({
        title: "Error",
        description: "Please select a ticket type",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Update profile with additional info
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            ticket_type: formData.ticketType as "student" | "adult",
            affiliation: formData.affiliation
          })
          .eq("id", authData.user.id);

        if (profileError) throw profileError;

        toast({
          title: "Success!",
          description: "Your account has been created. Redirecting to dashboard..."
        });

        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="inline-flex items-center text-soft-white/70 hover:text-soft-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="glass border-soft-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-soft-white">Create Account</CardTitle>
            <CardDescription className="text-soft-white/70">
              Register for ISEED 2025
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-soft-white">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="glass border-soft-white/20 text-soft-white placeholder:text-soft-white/50"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-soft-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="glass border-soft-white/20 text-soft-white placeholder:text-soft-white/50"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticketType" className="text-soft-white">Ticket Type</Label>
                <Select value={formData.ticketType} onValueChange={(value) => setFormData({ ...formData, ticketType: value })}>
                  <SelectTrigger className="glass border-soft-white/20 text-soft-white">
                    <SelectValue placeholder="Select ticket type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student (₦7,500)</SelectItem>
                    <SelectItem value="adult">Adult (₦10,000)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="affiliation" className="text-soft-white">Affiliation</Label>
                <Input
                  id="affiliation"
                  type="text"
                  value={formData.affiliation}
                  onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                  className="glass border-soft-white/20 text-soft-white placeholder:text-soft-white/50"
                  placeholder="University/Organization"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-soft-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="glass border-soft-white/20 text-soft-white placeholder:text-soft-white/50"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-soft-white">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="glass border-soft-white/20 text-soft-white placeholder:text-soft-white/50"
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                className="w-full gradient-button text-soft-white font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <p className="text-center text-sm text-soft-white/70">
                Already have an account?{" "}
                <Link to="/login" className="text-bright-aqua hover:underline font-semibold">
                  Login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;