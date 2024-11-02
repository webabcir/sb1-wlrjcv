"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function UploadPage() {
  const t = useTranslations();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.uploadCsv')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 w-full text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <label className="mt-4 block">
                <input
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <span className="mt-2 block text-sm text-gray-600">
                  {file ? file.name : t('upload.selectFile')}
                </span>
              </label>
            </div>

            {uploading && (
              <div className="w-full">
                <Progress value={progress} className="w-full" />
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full"
            >
              {uploading ? t('upload.uploading') : t('upload.uploadFile')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}