import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  full_name: string;
  email: string;
  ticket_type: string | null;
  affiliation: string | null;
  created_at: string;
  user_roles: Array<{ role: string }>;
}

const UsersManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // First fetch all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Then fetch all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Combine the data
      const usersWithRoles = (profilesData || []).map(profile => ({
        ...profile,
        user_roles: (rolesData || [])
          .filter(role => role.user_id === profile.id)
          .map(role => ({ role: role.role }))
      }));

      setUsers(usersWithRoles);
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

  const handleMakeAdmin = async (userId: string) => {
    setActionLoading(userId);
    try {
      // Check if user already has admin role
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (existingRole) {
        toast({
          title: "Info",
          description: "User is already an admin",
          variant: "default"
        });
        setActionLoading(null);
        return;
      }

      const { error } = await supabase
        .from("user_roles")
        .insert({
          user_id: userId,
          role: "admin"
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User has been granted admin access"
      });

      loadUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAdmin = (user: User) => {
    return user.user_roles?.some(role => role.role === "admin");
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
        <h2 className="text-3xl font-bold text-soft-white">Users Management</h2>
      </div>

      <Card className="glass border-soft-white/20 mb-6">
        <CardHeader>
          <CardTitle className="text-soft-white">Search Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-soft-white/50" />
            <Input
              placeholder="Search by name or email..."
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
                <TableHead className="text-soft-white">Name</TableHead>
                <TableHead className="text-soft-white">Email</TableHead>
                <TableHead className="text-soft-white">Ticket Type</TableHead>
                <TableHead className="text-soft-white">Affiliation</TableHead>
                <TableHead className="text-soft-white">Role</TableHead>
                <TableHead className="text-soft-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-soft-white/20">
                  <TableCell className="text-soft-white">{user.full_name}</TableCell>
                  <TableCell className="text-soft-white/70">{user.email}</TableCell>
                  <TableCell className="text-soft-white/70 capitalize">
                    {user.ticket_type || "N/A"}
                  </TableCell>
                  <TableCell className="text-soft-white/70">
                    {user.affiliation || "N/A"}
                  </TableCell>
                  <TableCell>
                    {isAdmin(user) ? (
                      <Badge className="bg-primary/20 text-primary">Admin</Badge>
                    ) : (
                      <Badge className="bg-muted/50 text-muted-foreground">Participant</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {!isAdmin(user) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMakeAdmin(user.id)}
                        disabled={actionLoading === user.id}
                        className="glass border-soft-white/20 text-soft-white"
                      >
                        {actionLoading === user.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Shield className="w-4 h-4 mr-1" />
                            Make Admin
                          </>
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagement;
