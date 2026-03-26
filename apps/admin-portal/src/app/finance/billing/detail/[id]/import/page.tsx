"use client";

import { useState } from "react";
import Link from "next/link";
import { toastPromise } from "@/lib/toast";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Upload } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui";
import { useBilling } from "@/app/finance/billing/hook";
import { useScreen } from "@/context/screen.context";
import AppURL from "@/constants/app-url.const";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function ImportPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setLoading } = useScreen();

  const typeBilling = searchParams.get("type") || "";

  const { importBillingTransactions } = useBilling();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");

  const handleFileSelection = (file: File) => {
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (validTypes.includes(file.type)) {
      setSelectedFile(file);
      setUploadStatus("idle");
    } else {
      alert("Please upload an Excel file (.xlsx or .xls)");
    }
  };

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

    if (e.dataTransfer.files?.[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !id) return;

    setUploadStatus("uploading");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("input", "File");
    formData.append("idBilling", id as string);
    formData.append("typeBilling", typeBilling);

    const uploadPromise = importBillingTransactions(formData);

    try {
      await toastPromise(uploadPromise, {
        loading: "Uploading file...",
        success: <b>File uploaded successfully!</b>,
        error: "Upload failed!",
      });

      setUploadStatus("success");

      setTimeout(() => {
        router.push(`${AppURL.financeBillingDetail}/${id}`);
      }, 1500);
    } catch (error) {
      setUploadStatus("error");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
  };

  const handleBack = () => {
    router.back();
  };

  const getDropZoneStyles = () => {
    if (selectedFile) return "border-green-500 bg-green-50";
    if (dragActive) return "border-[#F5BA41] bg-[#FDF7E9]";
    return "border-gray-300";
  };

  return (
    <div className="flex flex-col w-full">
      <div className="bg-white md:px-6 p-4 flex items-center">
        <div>
          <Breadcrumb className="sm:block hidden">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={AppURL.financeBilling}>Billing</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`${AppURL.financeBillingDetail}/${id}`}>Billing Detail</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Import Reconciliation</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
            Import Transactions for Reconciliation Data
          </h2>
        </div>

        <div className="flex ml-auto gap-4">
          <div
            onClick={handleBack}
            className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </div>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploadStatus === "uploading"}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-5 disabled:opacity-50"
          >
            {uploadStatus === "uploading" ? (
              <>
                <Upload className="mr-2 w-4 h-4 animate-pulse" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 w-4 h-4" /> Upload
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col w-full p-4 md:p-6 gap-4">
        <div className="p-4 sm:p-6 bg-white rounded-lg">
          <div
            className={`border-2 border-dashed rounded-lg p-8 transition-colors ${getDropZoneStyles()}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <Upload
                className={`w-12 h-12 ${
                  selectedFile ? "text-green-500" : "text-gray-400"
                }`}
              />

              <div className="text-center">
                {selectedFile ? (
                  <div className="space-y-2">
                    <p className="text-green-500 font-medium">
                      Selected: {selectedFile.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Size: {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                    <Button
                      onClick={handleRemoveFile}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600">
                      Drag and drop your file here, or&nbsp;
                      <label className="text-[#F5BA41] cursor-pointer hover:text-[#e6a92d] font-medium">
                        browse
                        <input
                          type="file"
                          className="hidden"
                          accept=".xlsx,.xls"
                          onChange={handleFileInput}
                        />
                      </label>
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Supported formats: .xlsx, .xls
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {uploadStatus === "success" && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-center font-medium">
                ✓ File uploaded successfully! Redirecting...
              </p>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-center font-medium">
                ✗ Upload failed. Please try again.
              </p>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              Import Instructions:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Upload an Excel file containing transaction data</li>
              <li>
                Ensure the file format matches the required template structure
              </li>
              <li>
                The system will validate and import transactions for
                reconciliation
              </li>
              <li>Maximum file size: 10MB</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
