import React, { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Upload, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadExcel } from "../lib/excel-upload";
import type { AxiosError } from "axios";

interface BulkUploadProps {
  moduleName: string;
  onSuccess?: () => void;
}

export function BulkUpload({ moduleName, onSuccess }: BulkUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadExcel(moduleName.toLowerCase(), file);
      toast.success(result.message || `Successfully uploaded ${moduleName} data`);
      setFile(null);
      // Reset input
      const input = document.getElementById("excel-file") as HTMLInputElement;
      if (input) input.value = "";

      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message || axiosError.message || "Failed to upload file";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Import {moduleName}s</CardTitle>
        <CardDescription>
          Upload an Excel file (.xlsx or .xls) to bulk insert {moduleName}s.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </div>
        {file && (
          <div className="flex items-center p-2 bg-muted rounded-md text-sm">
            <FileSpreadsheet className="mr-2 h-4 w-4 text-primary" />
            <span className="truncate">{file.name}</span>
            <span className="ml-auto text-muted-foreground">
              {(file.size / 1024).toFixed(2)} KB
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
