import React, { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: File | null;
  onChange?: (file: File | null) => void;
  onError?: (error: string) => void;
  acceptedFileTypes?: string[];
  maxSize?: number; // in bytes
}

export function FileUpload({
  value,
  onChange,
  onError,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"],
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
  ...props
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check file type
    if (!acceptedFileTypes.includes(file.type)) {
      onError?.(
        `Invalid file type. Accepted types: ${acceptedFileTypes
          .map((type) => type.split("/")[1])
          .join(", ")}`
      );
      return;
    }
    
    // Check file size
    if (file.size > maxSize) {
      onError?.(
        `File size exceeds the maximum allowed size of ${Math.round(maxSize / 1024 / 1024)}MB`
      );
      return;
    }
    
    onChange?.(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleFileChange(files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg p-8 text-center transition-colors cursor-pointer",
        isDragging 
          ? "border-primary-400 dark:border-primary-500" 
          : "hover:border-primary-400 dark:hover:border-primary-500",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      {...props}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={acceptedFileTypes.join(",")}
        onChange={(e) => handleFileChange(e.target.files)}
      />
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full">
          <UploadCloud className="w-8 h-8" />
        </div>
        <div>
          <p className="font-medium">Drag your document here or click to browse</p>
          <p className="text-sm text-dark-500 dark:text-gray-400 mt-1">
            Support for JPG, PNG, PDF with Tamil text (max {Math.round(maxSize / 1024 / 1024)}MB)
          </p>
        </div>
        <div>
          <button 
            type="button" 
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-medium rounded-lg transition-colors text-sm"
          >
            Select File
          </button>
        </div>
      </div>
      {value && (
        <div className="mt-4 text-left">
          <p className="text-sm font-medium">Selected file:</p>
          <p className="text-sm text-dark-500 dark:text-gray-400">{value.name}</p>
        </div>
      )}
    </div>
  );
}
