
import { useState } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  preview?: string;
}

export function ImageUpload({ onUpload, preview }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 text-center ${
        dragActive ? "border-primary-500 bg-primary-50" : "border-gray-300"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
        id="image-upload"
      />
      
      {preview ? (
        <img src={preview} alt="Preview" className="max-h-48 mx-auto mb-2" />
      ) : (
        <div className="flex flex-col items-center">
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <label
            htmlFor="image-upload"
            className="cursor-pointer text-primary-600 hover:text-primary-800"
          >
            Click to upload
          </label>
          <p className="text-sm text-gray-500">or drag and drop</p>
        </div>
      )}
    </div>
  );
}
