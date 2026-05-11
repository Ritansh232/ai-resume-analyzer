import React, { useState, useCallback } from 'react';
import { Upload, FileText, Loader2, X } from 'lucide-react';
import { cn } from '../lib/utils';
interface ResumeUploaderProps {
  onUpload: (data: { text?: string; fileData?: { data: string; mimeType: string } }) => void;
  isLoading: boolean;
}

export default function ResumeUploader({ onUpload, isLoading }: ResumeUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFile = async (file: File) => {
    setError(null);
    try {
      if (file.type === 'application/pdf') {
        const base64 = await fileToBase64(file);
        onUpload({ 
          fileData: { 
            data: base64, 
            mimeType: 'application/pdf' 
          } 
        });
      } else if (file.type === 'text/plain') {
        const text = await file.text();
        onUpload({ text });
      } else {
        setError("Please upload a PDF or .txt file.");
      }
    } catch (err) {
      console.error("File Processing Error:", err);
      setError("Failed to process the file. Please try again.");
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          "relative group cursor-pointer border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ease-in-out",
          "flex flex-col items-center justify-center text-center",
          isDragging ? "border-indigo-500 bg-indigo-50/50" : "border-slate-200 bg-slate-50/30 hover:border-slate-300 hover:bg-slate-50/50",
          isLoading && "pointer-events-none opacity-50"
        )}
      >
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        
        <div className={cn(
          "w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 transition-transform duration-300",
          isDragging ? "scale-110 text-indigo-600" : "text-slate-400 group-hover:scale-105 group-hover:text-indigo-600"
        )}>
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </div>

        <div className="space-y-1">
          <p className="font-semibold text-slate-800">
            {isLoading ? "Analyzing file..." : "Click to upload or drag and drop"}
          </p>
          <p className="text-xs text-slate-400">
            PDF or TXT (MAX. 5MB)
          </p>
        </div>

        <div className="mt-6 flex items-center gap-4 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" /> PDF
          </span>
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" /> TXT
          </span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl animate-in fade-in slide-in-from-top-2">
          <X className="w-4 h-4 cursor-pointer" onClick={() => setError(null)} />
          <p>{error}</p>
        </div>
      )}

      {!isLoading && (
        <div className="text-center pt-4">
          <p className="text-sm text-slate-400 italic">
            Your data is processed securely and never stored.
          </p>
        </div>
      )}
    </div>
  );
}
