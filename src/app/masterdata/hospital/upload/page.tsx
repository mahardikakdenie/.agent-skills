"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useScreen } from "@/context/screen.context";
import { toastNotification } from "@/lib/toast";
import { MdProductService } from "@/services/masterdata/product.service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, Upload } from "react-feather";

export default function HospitalListUploadPage() {
  const router = useRouter();
  const { setLoading } = useScreen();
  const productService = new MdProductService();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile || uploadStatus === "uploading") return;

    setUploadStatus("uploading");
    setLoading(true);

    try {
      await productService.uploadHospitalList(selectedFile);
      toastNotification("File uploaded successfully! Redirecting to Hospital List...", "success");

      setTimeout(() => {
        router.push("/masterdata/hospital-list");
        setUploadStatus("idle");
        setLoading(false);
      }, 2000);
    } catch (error: any) {
      toastNotification(error?.response?.data?.message || "Upload failed. Please try again.", "error");
      setUploadStatus("idle");
      setLoading(false);
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = async (file: File) => {
    if (
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel"
    ) {
      setSelectedFile(file);
    } else {
      alert("Please upload an Excel file (.xlsx or .xls)");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="bg-white md:px-6 p-4 flex items-center">
        <div>
          <Breadcrumb className="sm:block hidden">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Hospital List</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Upload</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
            Upload Hospital List
          </h2>
        </div>

        <div className="flex ml-auto">
          <div
            onClick={() => router.back()}
            className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </div>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploadStatus === "uploading"}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-5 rounded-full px-5"
          >
            {uploadStatus === "uploading" ? (
              "Uploading..."
            ) : (
              <>
                <Upload className="mr-2 w-4 h-4" />
                Upload
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col w-full p-4 md:p-6 gap-4">
        <div className="p-4 sm:p-6 bg-white rounded-lg">
          <div
            className={`border-2 border-dashed rounded-lg p-8 ${
              dragActive ? "border-[#F5BA41] bg-[#FDF7E9]" : "border-gray-300"
            } ${selectedFile ? "border-green-500 bg-green-50" : ""}`}
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
                  <p className="text-green-500 font-medium">
                    Selected: {selectedFile.name}
                  </p>
                ) : (
                  <>
                    <p className="text-gray-600">
                      Drag and drop your file here, or&nbsp;
                      <label className="text-[#F5BA41] cursor-pointer hover:text-[#e6a92d]">
                        browse
                        <input
                          type="file"
                          accept=".xlsx, .xls"
                          className="hidden"
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
        </div>
      </div>
    </div>
  );
};
