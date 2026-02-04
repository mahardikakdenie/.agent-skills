"use client";
import React from "react";
import { FaSave } from "react-icons/fa";
import { ChevronLeft } from "react-feather";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useUploadSanction } from "@/hooks/useUploadSanction.hooks";
import { ContentLoadingWrapper } from "@/components/ui/Loading/index";

const ErrorModal = ({
  isOpen,
  message,
  onClose,
}: {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-1/3">
        <h2 className="text-lg font-semibold mb-4">Alert</h2>
        <p>{message}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function UploadSanctionPage() {
  const {
    hasAccess,
    showAlert,
    errorMessage,
    fileName,
    isDragging,

    isUploading,

    fileInputRef,

    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleUpload,
    setShowAlert,
    goBack,
  } = useUploadSanction();

  if (hasAccess === false) {
    return null;
  }

  return (
    <ContentLoadingWrapper isLoading={isUploading}>
      <div className="flex flex-col w-full gap-4">
        <form onSubmit={handleUpload}>
          <div className="bg-white md:px-6 p-4 flex items-center">
            <div>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/sanction/list">
                      Sanction List
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Upload Sanction</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
                Upload Blacklist
              </h2>
            </div>
            <div className="flex space-x-4 ml-auto">
              <div
                onClick={goBack}
                className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </div>
              <button
                type="submit"
                disabled={isUploading}
                className="flex items-center bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-6 py-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>

          {showAlert && (
            <ErrorModal
              isOpen={showAlert}
              message={errorMessage || ""}
              onClose={() => setShowAlert(false)}
            />
          )}

          <div className="w-full flex flex-col p-4 sm:p-6">
            <div className="bg-white md:px-6 p-4">
              <div
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 cursor-pointer transition-colors
              ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-white"
              }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <p className="text-gray-500 mb-4">
                  Drag and drop your CSV file here, or
                </p>
                <label
                  htmlFor="fileUpload"
                  className="px-4 py-2 bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full cursor-pointer"
                >
                  Browse Files
                </label>
                <input
                  id="fileUpload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
              </div>

              {fileName && (
                <div className="mt-4 text-gray-600">
                  <p>
                    Selected file:{" "}
                    <span className="font-semibold">{fileName}</span>
                  </p>
                </div>
              )}

              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="text-lg font-semibold mb-2">
                  CSV Format Requirements
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Your CSV file should contain the following columns:
                </p>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li>
                    <strong>first_name</strong> (required)
                  </li>
                  <li>
                    <strong>middle_name</strong> (optional)
                  </li>
                  <li>
                    <strong>last_name</strong> (optional)
                  </li>
                  <li>
                    <strong>id_number</strong> (required)
                  </li>
                  <li>
                    <strong>phone_number</strong> (required)
                  </li>
                  <li>
                    <strong>email</strong> (required, valid email format)
                  </li>
                  <li>
                    <strong>source_name</strong> (required, must match existing
                    source)
                  </li>
                  <li>
                    <strong>blacklist_date</strong> (required, format:
                    YYYY-MM-DD)
                  </li>
                  <li>
                    <strong>blacklist_reason</strong> (required)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </ContentLoadingWrapper>
  );
}
