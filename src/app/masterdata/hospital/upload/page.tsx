"use client";

import { useHospitalUpload } from "@/hooks/useHospitalUpload.hooks";
import HospitalUploadForm from "@/components/forms/HospitalUploadForm";

export default function HospitalListUploadPage() {
  const {
    selectedFile,
    uploadStatus,
    dragActive,
    handleUpload,
    handleDrag,
    handleDrop,
    handleFileInput,
    goBack,
  } = useHospitalUpload();

  return (
    <HospitalUploadForm
      selectedFile={selectedFile}
      uploadStatus={uploadStatus}
      dragActive={dragActive}
      onUpload={handleUpload}
      onBack={goBack}
      onDrag={handleDrag}
      onDrop={handleDrop}
      onFileInput={handleFileInput}
    />
  );
}
