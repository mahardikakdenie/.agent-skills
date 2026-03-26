import React, { useRef, useState, useEffect } from "react";
import { Upload, X } from "react-feather";
import { Input } from "@repo/ui";

interface UploadFileProps {
  accept?: string;
  placeholder?: string;
  className?: string;
  onChange?: (file: File | null) => void;
  onFileChange?: (data: {
    file: File | null;
    base64: string | null;
    fileName: string | null;
  }) => void;
  disabled?: boolean;
  label?: string;
  error?: string;
  value?: File | string | null;
}

const UploadFile: React.FC<UploadFileProps> = ({
  accept = ".png,.jpg,.jpeg,.pdf",
  placeholder = "Upload document",
  className = "",
  onChange = () => undefined,
  onFileChange = () => undefined,
  disabled = false,
  label,
  error,
  value,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      if (typeof value === "string") {
        setFileUrl(value);
        setSelectedFile(null);
      } else {
        setSelectedFile(value);
        setFileUrl(null);
      }
    } else {
      setSelectedFile(null);
      setFileUrl(null);
    }
  }, [value]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    setSelectedFile(file);
    setFileUrl(null);

    if (file) {
      try {
        const base64 = await convertToBase64(file);

        onFileChange({
          file,
          base64,
          fileName: file.name,
        });

        onChange(file);
      } catch (error) {
        console.error("Error converting file to base64:", error);

        onFileChange({
          file,
          base64: null,
          fileName: file.name,
        });
        onChange(file);
      }
    } else {
      onFileChange({
        file: null,
        base64: null,
        fileName: null,
      });
      onChange(null);
    }
  };

  const triggerFileInput = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setFileUrl(null);

    onFileChange({
      file: null,
      base64: null,
      fileName: null,
    });
    onChange(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getDisplayName = () => {
    if (selectedFile) {
      return selectedFile.name;
    }
    if (fileUrl) {
      const urlParts = fileUrl.split("/");
      const fileName = urlParts[urlParts.length - 1];
      return fileName.split("?")[0] || "Uploaded file";
    }
    return placeholder;
  };

  const hasFile = selectedFile || fileUrl;

  return (
    <div className={`relative flex flex-col gap-[6px] ${className}`}>
      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      {label && <p className="font-medium text-xs">{label}</p>}
      <div
        onClick={triggerFileInput}
        className={`
          w-full h-10 px-4 border border-gray-300 rounded-md 
          flex items-center justify-between cursor-pointer
          hover:border-gray-400 transition-colors
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <span
          className={`text-sm ${hasFile ? "text-gray-700" : "text-gray-400"}`}
        >
          {getDisplayName()}
        </span>
        <div className="flex items-center gap-2">
          {hasFile && (
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <Upload className="w-4 h-4 text-primary font-semibold" />
        </div>
      </div>
      {error && <p className="font-medium text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default UploadFile;
