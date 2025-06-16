import { forwardRef, useState, useRef, useCallback } from "react";
import type { InputHTMLAttributes, ChangeEvent } from "react";
import { Camera, X } from "lucide-react";

export interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  onFileSelect?: (file: File | null) => void;
  previewUrl?: string | null;
  className?: string;
  aspectRatio?: "square" | "video" | "custom";
  inputSize?: "sm" | "md" | "lg";
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({
    label,
    error,
    onFileSelect,
    previewUrl,
    className = "",
    aspectRatio = "square",
    inputSize = "md",
    id,
    ...props
  }, ref) => {
    const [localPreview, setLocalPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback((file: File | null) => {
      if (file && !file.type.startsWith('image/')) {
        onFileSelect?.(null);
        return;
      }
      
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setLocalPreview(result);
          onFileSelect?.(file);
        };
        reader.readAsDataURL(file);
      } else {
        setLocalPreview(null);
        onFileSelect?.(null);
      }
    }, [onFileSelect]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      handleFileChange(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0] || null;
      handleFileChange(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const removeImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setLocalPreview(null);
      onFileSelect?.(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const currentPreview = previewUrl || localPreview;

    const sizeClasses = {
      sm: 'h-24 w-24',
      md: 'h-32 w-32',
      lg: 'h-40 w-40',
    };

    const aspectRatioClasses = {
      square: 'aspect-square',
      video: 'aspect-video',
      custom: '',
    };

    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div 
          className={`relative ${sizeClasses[inputSize]} ${aspectRatioClasses[aspectRatio]} ${isDragging ? 'ring-2 ring-blue-500' : ''} transition-all duration-200`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {currentPreview ? (
            <>
              <img
                src={currentPreview}
                alt="Preview"
                className="h-full w-full rounded-lg object-cover border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <label 
              htmlFor={id}
              className={`h-full w-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : ''}`}
            >
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <Camera className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600 hover:text-blue-500">Upload a file</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
              </div>
              <input
                {...props}
                id={id}
                ref={(node) => {
                  if (ref) {
                    if (typeof ref === 'function') {
                      ref(node);
                    } else {
                      ref.current = node;
                    }
                  }
                  fileInputRef.current = node;
                }}
                type="file"
                className="sr-only"
                onChange={handleChange}
                accept="image/*"
              />
            </label>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

FileInput.displayName = "FileInput";
