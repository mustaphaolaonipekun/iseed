import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, FileText, CheckCircle2 } from "lucide-react";

interface AbstractUploadProps {
  userId: string;
  onUploadSuccess: () => void;
}

const AbstractUpload = ({ userId, onUploadSuccess }: AbstractUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingAbstract, setExistingAbstract] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    affiliation: "",
    subtheme: ""
  });

  useEffect(() => {
    fetchExistingAbstract();
  }, [userId]);

  const fetchExistingAbstract = async () => {
    try {
      const { data, error } = await supabase
        .from("abstracts")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setExistingAbstract(data);
        setFormData({
          title: data.title,
          authors: data.authors,
          affiliation: data.affiliation,
          subtheme: data.subtheme
        });
      }
    } catch (error: any) {
      console.error("Error fetching abstract:", error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF or DOCX file",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 10MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.authors || !formData.affiliation || !formData.subtheme) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!selectedFile && !existingAbstract) {
      toast({
        title: "No File Selected",
        description: "Please select an abstract file to upload",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      let abstractUrl = existingAbstract?.abstract_url;

      // Upload file if a new one was selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("abstracts")
          .upload(fileName, selectedFile, {
            cacheControl: "3600",
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("abstracts")
          .getPublicUrl(fileName);
        
        abstractUrl = publicUrl;
      }

      // Insert or update abstract record
      const abstractData = {
        user_id: userId,
        title: formData.title,
        authors: formData.authors,
        affiliation: formData.affiliation,
        subtheme: formData.subtheme as "green_technology" | "stem_education" | "entrepreneurship",
        abstract_url: abstractUrl,
        abstract_status: "pending" as const,
        abstract_uploaded_at: new Date().toISOString()
      };

      if (existingAbstract) {
        const { error: updateError } = await supabase
          .from("abstracts")
          .update(abstractData)
          .eq("id", existingAbstract.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("abstracts")
          .insert(abstractData);

        if (insertError) throw insertError;
      }

      toast({
        title: "Success!",
        description: "Abstract submitted successfully. Awaiting review."
      });

      setSelectedFile(null);
      onUploadSuccess();
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="text-bright-aqua text-sm">Pending Review</span>;
      case "approved":
        return <span className="text-emerald-green text-sm flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" />Approved</span>;
      case "rejected":
        return <span className="text-destructive text-sm">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {existingAbstract && (
        <div className="p-4 glass-dark rounded-lg flex items-center justify-between">
          <div>
            <p className="text-soft-white font-semibold">Current Submission</p>
            <p className="text-soft-white/70 text-sm">{existingAbstract.title}</p>
          </div>
          {getStatusBadge(existingAbstract.abstract_status)}
        </div>
      )}

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-soft-white">Abstract Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="glass border-soft-white/20 text-soft-white"
            placeholder="Enter your abstract title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="authors" className="text-soft-white">Authors *</Label>
          <Input
            id="authors"
            value={formData.authors}
            onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
            className="glass border-soft-white/20 text-soft-white"
            placeholder="John Doe, Jane Smith"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="affiliation" className="text-soft-white">Affiliation *</Label>
          <Input
            id="affiliation"
            value={formData.affiliation}
            onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
            className="glass border-soft-white/20 text-soft-white"
            placeholder="University/Organization"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtheme" className="text-soft-white">Sub-theme *</Label>
          <Select value={formData.subtheme} onValueChange={(value) => setFormData({ ...formData, subtheme: value })}>
            <SelectTrigger className="glass border-soft-white/20 text-soft-white">
              <SelectValue placeholder="Select a sub-theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="green_technology">Green Technology, Renewable Energy & Sustainable Materials</SelectItem>
              <SelectItem value="stem_education">STEM Education, Research Communication & Digital Learning</SelectItem>
              <SelectItem value="entrepreneurship">Entrepreneurship, Industrial Collaboration & Career Pathways</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="abstract" className="text-soft-white">
            Abstract File (PDF/DOCX) {!existingAbstract && "*"}
          </Label>
          <Input
            id="abstract"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="glass border-soft-white/20 text-soft-white file:text-soft-white"
          />
        </div>

        {selectedFile && (
          <div className="flex items-center gap-2 p-3 glass-dark rounded-lg">
            <FileText className="w-4 h-4 text-bright-aqua" />
            <span className="text-sm text-soft-white">{selectedFile.name}</span>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={uploading}
          className="w-full gradient-button text-soft-white"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {existingAbstract ? "Update Abstract" : "Submit Abstract"}
            </>
          )}
        </Button>
      </div>

      {existingAbstract && existingAbstract.reviewer_notes && (
        <div className="p-4 glass-dark rounded-lg border border-bright-aqua/50">
          <p className="text-soft-white font-semibold mb-1">Reviewer Notes:</p>
          <p className="text-soft-white/80 text-sm">{existingAbstract.reviewer_notes}</p>
        </div>
      )}
    </div>
  );
};

export default AbstractUpload;