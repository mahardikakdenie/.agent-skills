import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ApiURL from "@/constants/api-url.const";
import { policyService } from "@/services/api.service";

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
  const queryClient = useQueryClient();

  const [endorsementId, setEndorsementId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState("");

  const {
    data: endorsement,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["endorsement-detail", endorsementId],
    queryFn: async () => {
      if (!endorsementId) return null;
      const response = await policyService.get(
        ApiURL.v1EndorsementDetail(endorsementId)
      );
      return response.data;
    },
    enabled: !!endorsementId,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const isEDSB = endorsement?.number?.startsWith("EDSB-") || false;
  const imageUrl =
    endorsement?.participants?.nric_front || "/images/no-image.png";

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      note,
      isEDSB,
    }: {
      id: string;
      status: string;
      note: string;
      isEDSB: boolean;
    }) => {
      const apiUrl = isEDSB
        ? ApiURL.v1EndorsementUpdtaeStatusBulking(id)
        : ApiURL.v1EndorsementUpdateStatus(id);

      const response = await policyService.put(apiUrl, {
        status,
        note,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Endorsement status updated successfully!");

      queryClient.invalidateQueries({ queryKey: ["endorsements"] });
      queryClient.invalidateQueries({ queryKey: ["endorsement-detail"] });
    },
    onError: (error: any) => {
      console.error("Failed to update endorsement status:", error);
      const errorMessage = error?.response?.data?.message || "Update failed.";
      toast.error(errorMessage);
    },
    onSettled: () => {
      setIsModalOpen(false);
      setNotes("");
    },
  });

  const getEndorsementDetail = useCallback((id: string) => {
    setEndorsementId(id);
  }, []);

  const handleApprove = useCallback(async () => {
    if (!endorsement?.id) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: endorsement.id,
        status: "Approved",
        note: "",
        isEDSB,
      });
    } catch (error) {
      throw error;
    }
  }, [endorsement?.id, isEDSB, updateStatusMutation]);

  const handleReject = useCallback(async () => {
    if (!endorsement?.id) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: endorsement.id,
        status: "Rejected",
        note: notes,
        isEDSB,
      });
    } catch (error) {
      throw error;
    }
  }, [endorsement?.id, notes, isEDSB, updateStatusMutation]);

  const handleDownload = useCallback(() => {
    if (
      !endorsement?.endorsements_detail ||
      endorsement.endorsements_detail.length === 0
    ) {
      toast.error("No data to download.");
      return;
    }

    try {
      const data = endorsement.endorsements_detail.map(
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

      saveAs(blob, `endorsement-${endorsement?.id}.xlsx`);
      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.error("Failed to generate Excel file.");
    }
  }, [endorsement]);

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
    isUpdating: updateStatusMutation.isPending,
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
