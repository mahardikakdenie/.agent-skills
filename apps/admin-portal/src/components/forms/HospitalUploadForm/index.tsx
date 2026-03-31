"use client";

import React from "react";
import { Upload, ChevronLeft } from "react-feather";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui";
import { Button } from "@repo/ui";
import { ContentLoadingWrapper } from "@/components/ui/loading";

interface HospitalUploadFormProps {
  selectedFile: File | null;
  uploadStatus: "idle" | "uploading" | "success" | "error";
  dragActive: boolean;
  onUpload: () => void;
  onBack: () => void;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function HospitalUploadForm({
  selectedFile,
  uploadStatus,
  dragActive,
  onUpload,
  onBack,
  onDrag,
  onDrop,
  onFileInput,
}: HospitalUploadFormProps) {
  const isUploading = uploadStatus === "uploading";

  return (
    <ContentLoadingWrapper isLoading={isUploading}>
      <div className="flex flex-col w-full">
        <div className="bg-white md:px-6 p-4 flex items-center">
          <div>
            <Breadcrumb className="sm:block hidden">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink>Masterdata</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="cursor-pointer" onClick={onBack}>
                    Hospital List
                  </BreadcrumbLink>
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
              onClick={onBack}
              className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </div>
            <Button
              onClick={onUpload}
              disabled={!selectedFile || isUploading}
              className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-5 rounded-full px-5"
            >
              {isUploading ? (
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
              className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
                dragActive ? "border-[#F5BA41] bg-[#FDF7E9]" : "border-gray-300"
              } ${selectedFile ? "border-green-500 bg-green-50" : ""}`}
              onDragEnter={onDrag}
              onDragLeave={onDrag}
              onDragOver={onDrag}
              onDrop={onDrop}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <Upload
                  className={`w-12 h-12 ${
                    selectedFile ? "text-green-500" : "text-gray-400"
                  }`}
                />
                <div className="text-center">
                  {selectedFile ? (
                    <>
                      <p className="text-green-500 font-medium">
                        Selected: {selectedFile.name}
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        Size: {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600">
                        Drag and drop your file here, or&nbsp;
                        <label className="text-[#F5BA41] cursor-pointer hover:text-[#e6a92d] font-medium">
                          browse
                          <input
                            type="file"
                            accept=".xlsx, .xls"
                            className="hidden"
                            onChange={onFileInput}
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

            {uploadStatus === "error" && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">
                  Upload failed. Please try again.
                </p>
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">
                  File uploaded successfully! Redirecting...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ContentLoadingWrapper>
  );
}