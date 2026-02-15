import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import toast from "react-hot-toast";
import { useUploadReferenceHospital } from "@/services/product/hooks/mutations";

interface UseHospitalUploadProps {
  selectedFile: File | null;
  uploadStatus: "idle" | "uploading" | "success" | "error";
  dragActive: boolean;
  setSelectedFile: (file: File | null) => void;
  setDragActive: (active: boolean) => void;
  handleUpload: () => Promise<void>;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  goBack: () => void;
}

export function useHospitalUpload(): UseHospitalUploadProps {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { permissionList } = useAuth();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const access =
        permissionList.includes("Masterdata.Read") &&
        permissionList.includes("Masterdata.Create");

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList]);

  const uploadHospitalMutation = useUploadReferenceHospital({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hospitals"] });
      toast.success("File uploaded successfully!");
      setUploadStatus("success");

      setTimeout(() => {
        router.push(AppURL.masterdataHospital);
      }, 1500);
    },
    onError: (error: any) => {
      console.error("Upload failed:", error);
      toast.error(
        error?.response?.data?.message || "Upload failed. Please try again."
      );
      setUploadStatus("error");
    },
  });

  const handleUploadMutation = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    await uploadHospitalMutation.mutateAsync(formData);
  }, [uploadHospitalMutation]);

  const handleFileSelection = useCallback((file: File) => {
    if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel"
    ) {
      setSelectedFile(file);
      setUploadStatus("idle");
    } else {
      toast.error("Please upload an Excel file (.xlsx or .xls)");
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelection(e.dataTransfer.files[0]);
      }
    },
    [handleFileSelection]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelection(e.target.files[0]);
      }
    },
    [handleFileSelection]
  );

  const handleUpload = useCallback(async () => {
    if (!selectedFile || uploadStatus === "uploading") return;

    setUploadStatus("uploading");
    await handleUploadMutation(selectedFile);
  }, [handleUploadMutation, selectedFile, uploadStatus]);

  const goBack = useCallback(() => {
    router.push(AppURL.masterdataHospital);
  }, [router]);

  return {
    selectedFile,
    uploadStatus,
    dragActive,
    setSelectedFile,
    setDragActive,
    handleUpload,
    handleDrag,
    handleDrop,
    handleFileInput,
    goBack,
  };
}
