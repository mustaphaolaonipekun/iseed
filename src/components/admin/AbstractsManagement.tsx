import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, Eye, Search, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Abstract {
  id: string;
  user_id: string;
  title: string;
  authors: string;
  affiliation: string;
  subtheme: string;
  abstract_status: string;
  abstract_url: string | null;
  abstract_uploaded_at: string | null;
  reviewer_notes: string | null;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

const AbstractsManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [abstracts, setAbstracts] = useState<Abstract[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAbstract, setSelectedAbstract] = useState<Abstract | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadAbstracts();
  }, []);

  const loadAbstracts = async () => {
    try {
      const { data, error } = await supabase
        .from("abstracts")
        .select(`
          *,
          profiles!abstracts_user_id_fkey (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAbstracts(data || []);
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

  const handleApprove = async (abstractId: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("abstracts")
        .update({
          abstract_status: "approved",
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          reviewer_notes: reviewerNotes || null
        })
        .eq("id", abstractId);

      if (error) throw error;

      toast({
        title: "Abstract Approved",
        description: "Abstract has been approved successfully"
      });

      loadAbstracts();
      setSelectedAbstract(null);
      setReviewerNotes("");
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

  const handleReject = async (abstractId: string) => {
    if (!reviewerNotes.trim()) {
      toast({
        title: "Error",
        description: "Please provide rejection notes",
        variant: "destructive"
      });
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("abstracts")
        .update({
          abstract_status: "rejected",
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          reviewer_notes: reviewerNotes
        })
        .eq("id", abstractId);

      if (error) throw error;

      toast({
        title: "Abstract Rejected",
        description: "Rejection notification sent to user"
      });

      loadAbstracts();
      setSelectedAbstract(null);
      setReviewerNotes("");
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

  const filteredAbstracts = abstracts.filter(abstract => {
    const profile = abstract.profiles as any;
    return (
      abstract.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      abstract.authors?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      abstract.abstract_status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      not_uploaded: "bg-muted/50 text-muted-foreground",
      pending: "bg-bright-aqua/20 text-bright-aqua",
      approved: "bg-emerald-green/20 text-emerald-green",
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
        <h2 className="text-3xl font-bold text-soft-white">Abstracts Management</h2>
      </div>

      <Card className="glass border-soft-white/20 mb-6">
        <CardHeader>
          <CardTitle className="text-soft-white">Search Abstracts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-soft-white/50" />
            <Input
              placeholder="Search by title, author, or status..."
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
                <TableHead className="text-soft-white">Title</TableHead>
                <TableHead className="text-soft-white">Authors</TableHead>
                <TableHead className="text-soft-white">Subtheme</TableHead>
                <TableHead className="text-soft-white">Status</TableHead>
                <TableHead className="text-soft-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAbstracts.map((abstract) => (
                <TableRow key={abstract.id} className="border-soft-white/20">
                  <TableCell className="text-soft-white max-w-xs truncate">{abstract.title}</TableCell>
                  <TableCell className="text-soft-white/70">{abstract.authors}</TableCell>
                  <TableCell className="text-soft-white/70 capitalize">
                    {abstract.subtheme.replace("_", " ")}
                  </TableCell>
                  <TableCell>{getStatusBadge(abstract.abstract_status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAbstract(abstract);
                          setReviewerNotes(abstract.reviewer_notes || "");
                        }}
                        className="glass border-soft-white/20 text-soft-white"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {abstract.abstract_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(abstract.abstract_url!, "_blank")}
                          className="glass border-soft-white/20 text-soft-white"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedAbstract} onOpenChange={() => setSelectedAbstract(null)}>
        <DialogContent className="glass border-soft-white/20 text-soft-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-soft-white">Abstract Review</DialogTitle>
          </DialogHeader>
          {selectedAbstract && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-soft-white/70">Title</p>
                <p className="font-semibold">{selectedAbstract.title}</p>
              </div>
              
              <div>
                <p className="text-sm text-soft-white/70">Authors</p>
                <p>{selectedAbstract.authors}</p>
              </div>

              <div>
                <p className="text-sm text-soft-white/70">Affiliation</p>
                <p>{selectedAbstract.affiliation}</p>
              </div>

              <div>
                <p className="text-sm text-soft-white/70">Subtheme</p>
                <p className="capitalize">{selectedAbstract.subtheme.replace("_", " ")}</p>
              </div>

              {selectedAbstract.abstract_status === "pending" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm text-soft-white/70">Reviewer Notes</label>
                    <Textarea
                      value={reviewerNotes}
                      onChange={(e) => setReviewerNotes(e.target.value)}
                      placeholder="Add notes for approval or rejection..."
                      className="glass border-soft-white/20 text-soft-white"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(selectedAbstract.id)}
                      disabled={actionLoading}
                      className="flex-1 bg-emerald-green hover:bg-emerald-green/80 text-soft-white"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedAbstract.id)}
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

              {selectedAbstract.reviewer_notes && selectedAbstract.abstract_status !== "pending" && (
                <div className="p-4 glass-dark rounded-lg border border-soft-white/20">
                  <p className="text-sm text-soft-white/70 mb-1">Reviewer Notes</p>
                  <p className="text-soft-white">{selectedAbstract.reviewer_notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AbstractsManagement;
