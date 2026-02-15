import React, { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useUpdateEndorsementStatus } from "@/services/policy/hooks/mutations/useUpdateEndorsementStatus";
import { useUpdateEndorsementStatusBulking } from "@/services/policy/hooks/mutations/useUpdateEndorsementStatusBulking";
import { useEndorsementDetail as useEndorsementDetailQuery } from "@/services/policy/hooks/queries/useEndorsementDetail";

interface UseEndorsementDetailProps {
  endorsement: any;

  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  notes: string;
  setNotes: (notes: string) => void;

  isEDSB: boolean;
  imageUrl: string;

  isLoading: boolean;
  isUpdating: boolean;
  isError: boolean;
  error: any;

  getEndorsementDetail: (id: string) => void;
  handleApprove: () => Promise<void>;
  handleReject: () => Promise<void>;
  handleDownload: () => void;
  getStatusColor: (status: string) => string;
  refetch: () => void;
}

export function useEndorsementDetail(): UseEndorsementDetailProps {
  const [endorsementId, setEndorsementId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState("");

  const {
    data: endorsement,
    isLoading,
    isError,
    error,
    refetch,
  } = useEndorsementDetailQuery(endorsementId || "", {
    enabled: !!endorsementId,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const endorsementData: any = endorsement;
  const isEDSB = endorsementData?.number?.startsWith("EDSB-") || false;
  const imageUrl =
    endorsementData?.participants?.nric_front || "/images/no-image.png";

  const onUpdateStatusSuccess = useCallback(() => {
    toast.success("Endorsement status updated successfully!");
  }, []);

  const onUpdateStatusError = useCallback((error: any) => {
    console.error("Failed to update endorsement status:", error);
    const errorMessage = error?.response?.data?.message || "Update failed.";
    toast.error(errorMessage);
  }, []);

  const onUpdateStatusSettled = useCallback(() => {
    setIsModalOpen(false);
    setNotes("");
  }, []);

  const updateStatusMutation = useUpdateEndorsementStatus({
    onSuccess: onUpdateStatusSuccess,
    onError: onUpdateStatusError,
    onSettled: onUpdateStatusSettled,
  });

  const updateStatusBulkingMutation = useUpdateEndorsementStatusBulking({
    onSuccess: onUpdateStatusSuccess,
    onError: onUpdateStatusError,
    onSettled: onUpdateStatusSettled,
  });

  const getEndorsementDetail = useCallback((id: string) => {
    setEndorsementId(id);
  }, []);

  const handleApprove = useCallback(async () => {
    if (!endorsementData?.id) return;

    try {
      const payload = {
        status: "Approved",
        note: "",
      };

      if (isEDSB) {
        await updateStatusBulkingMutation.mutateAsync({
          id: endorsementData.id,
          payload,
        });
      } else {
        await updateStatusMutation.mutateAsync({
          id: endorsementData.id,
          payload,
        });
      }
    } catch (error) {
      throw error;
    }
  }, [endorsementData?.id, isEDSB, updateStatusBulkingMutation, updateStatusMutation]);

  const handleReject = useCallback(async () => {
    if (!endorsementData?.id) return;

    try {
      const payload = {
        status: "Rejected",
        note: notes,
      };

      if (isEDSB) {
        await updateStatusBulkingMutation.mutateAsync({
          id: endorsementData.id,
          payload,
        });
      } else {
        await updateStatusMutation.mutateAsync({
          id: endorsementData.id,
          payload,
        });
      }
    } catch (error) {
      throw error;
    }
  }, [
    endorsementData?.id,
    isEDSB,
    notes,
    updateStatusBulkingMutation,
    updateStatusMutation,
  ]);

  const handleDownload = useCallback(() => {
    if (
      !endorsementData?.endorsements_detail ||
      endorsementData.endorsements_detail.length === 0
    ) {
      toast.error("No data to download.");
      return;
    }

    try {
      const data = endorsementData.endorsements_detail.map(
        (item: any, index: number) => ({
          "Policy Number": item?.endorsements?.number,
          "Subsidiary / Entity": item?.data?.profile?.subsidiary,
          "Employee ID": item?.data?.profile?.employee_id,
          "Employee Name": item?.data?.profile?.employee_name,
          "Member Name": item?.data?.profile?.member_name,
          Gender: item?.data?.profile?.gender,
          "Date of Birth": item?.data?.profile?.date_of_birth,
          "Member Status": item?.data?.profile?.member_status,
          "Marital Status": item?.data?.profile?.marital_status,
          Plan: item?.data?.profile?.plan,
          "Effective Date": item?.data?.profile?.effective_date,
          Remarks: item?.data?.profile?.remarks,
          "Bank Name": item?.data?.profile?.bank_name,
          Branch: item?.data?.profile?.branch,
          "Bank Number": item?.data?.profile?.bank_account_number,
          "Bank Account Name": item?.data?.profile?.bank_account_name,
          Email: item?.data?.profile?.email,
          "Insurance Card": item?.data?.profile?.insurance_card,
          "Submission Date": item?.data?.profile?.submission_date,
          Status: item?.endorsements?.status,
        })
      );

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Endorsements");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      saveAs(blob, `endorsement-${endorsementData?.id}.xlsx`);
      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.error("Failed to generate Excel file.");
    }
  }, [endorsementData]);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "Pending":
        return "text-[#CC9B36]";
      case "Approved":
        return "text-[#00AB4F]";
      case "Rejected":
        return "text-[#939597]";
      default:
        return "text-[#CC9B36]";
    }
  }, []);

  return {
    endorsement,

    isModalOpen,
    setIsModalOpen,
    notes,
    setNotes,

    isEDSB,
    imageUrl,

    isLoading,
    isUpdating:
      updateStatusMutation.isPending || updateStatusBulkingMutation.isPending,
    isError,
    error,

    getEndorsementDetail,
    handleApprove,
    handleReject,
    handleDownload,
    getStatusColor,
    refetch,
  };
}
