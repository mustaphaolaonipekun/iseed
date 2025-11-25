import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, FileCheck } from "lucide-react";

interface PaymentUploadProps {
  userId: string;
  onUploadSuccess: () => void;
  currentStatus: string;
}

const PaymentUpload = ({ userId, onUploadSuccess, currentStatus }: PaymentUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a JPG, PNG, or PDF file",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 5MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("receipts")
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("receipts")
        .getPublicUrl(fileName);

      // Update payment record
      const { error: updateError } = await supabase
        .from("payments")
        .update({
          receipt_url: publicUrl,
          receipt_status: "pending",
          receipt_uploaded_at: new Date().toISOString()
        })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      toast({
        title: "Success!",
        description: "Receipt uploaded successfully. Awaiting verification."
      });

      setSelectedFile(null);
      onUploadSuccess();
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const canUpload = currentStatus === "not_uploaded" || currentStatus === "rejected";

  return (
    <div className="space-y-4">
      <div className="p-4 glass-dark rounded-lg">
        <h4 className="text-soft-white font-semibold mb-2">Bank Transfer Details</h4>
        <div className="space-y-1 text-sm text-soft-white/80">
          <p><span className="font-medium">Account Name:</span> LEAD AND MENTOR</p>
          <p><span className="font-medium">Account Number:</span> 0080840445</p>
          <p><span className="font-medium">Bank:</span> Sterling Bank</p>
        </div>
      </div>

      {canUpload && (
        <div className="space-y-3">
          <Label htmlFor="receipt" className="text-soft-white">
            Upload Payment Receipt
          </Label>
          <div className="flex gap-2">
            <Input
              id="receipt"
              type="file"
              accept="image/jpeg,image/jpg,image/png,application/pdf"
              onChange={handleFileSelect}
              className="glass border-soft-white/20 text-soft-white file:text-soft-white"
            />
          </div>
          
          {selectedFile && (
            <div className="flex items-center gap-2 p-3 glass-dark rounded-lg">
              <FileCheck className="w-4 h-4 text-emerald-green" />
              <span className="text-sm text-soft-white">{selectedFile.name}</span>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full gradient-button text-soft-white"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Receipt
              </>
            )}
          </Button>
        </div>
      )}

      {!canUpload && currentStatus === "pending" && (
        <div className="p-4 glass-dark rounded-lg text-center">
          <p className="text-soft-white/80">
            Your receipt is being verified by our admin team. You'll be notified once approved.
          </p>
        </div>
      )}

      {currentStatus === "verified" && (
        <div className="p-4 glass-dark rounded-lg text-center border border-emerald-green/50">
          <FileCheck className="w-8 h-8 text-emerald-green mx-auto mb-2" />
          <p className="text-soft-white font-semibold">Payment Verified!</p>
          <p className="text-soft-white/70 text-sm">You can now submit your abstract.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentUpload;