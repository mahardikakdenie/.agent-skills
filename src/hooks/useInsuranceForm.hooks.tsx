import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { useForm } from "react-hook-form";
import { InsuranceService } from "@/services/masterdata/insurance.service";
import AppURL from "@/constants/app-url.const";

interface InsuranceFormData {
  name: string;
  logo_url: string;
  brand: string;
  country: string;
}

interface UseInsuranceFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  reset: any;
  setValue: any;
  watch: any;

  hasAccess: boolean | null;
  showAlert: boolean;
  alertMessage: string;
  alertType: "success" | "error";
  isEdit: boolean;

  isLoadingDetail: boolean;
  isSaving: boolean;

  handleSave: (formData: InsuranceFormData) => void;
  setShowAlert: (show: boolean) => void;
  goBack: () => void;
  loadInsuranceDetail: (id: string) => void;
}

export function useInsuranceForm(
  mode: "create" | "edit" = "create"
): UseInsuranceFormProps {
  const router = useRouter();
  const { permissionList } = useAuth();
  const queryClient = useQueryClient();
  const insuranceService = new InsuranceService();
  const isEdit = mode === "edit";

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InsuranceFormData>({
    shouldUnregister: false,
    defaultValues: {
      name: "",
      logo_url: "",
      brand: "",
      country: "",
    },
  });

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [insuranceId, setInsuranceId] = useState<string>("");

  useEffect(() => {
    const checkAccess = async () => {
      const requiredPermission = isEdit
        ? "Masterdata.Update"
        : "Masterdata.Create";
      const access = permissionList.includes(requiredPermission);
      setHasAccess(access);

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList, isEdit]);

  const { data: insuranceDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["insurance-detail", insuranceId],
    queryFn: async () => {
      if (!insuranceId) return null;

      const response = await insuranceService.getInsuranceById(insuranceId);
      return response.data;
    },
    enabled: isEdit && !!insuranceId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (insuranceDetail && isEdit) {
      setValue("name", insuranceDetail.name || "");
      setValue("logo_url", insuranceDetail.logo_url || "");
      setValue("brand", insuranceDetail.brand || "");
      setValue("country", insuranceDetail.country || "");
    }
  }, [insuranceDetail, isEdit, setValue]);

  useEffect(() => {
    reset({
      name: "",
      logo_url: "",
      brand: "",
      country: "",
    });

    if (insuranceId) {
      queryClient.removeQueries({
        queryKey: ["insurance-detail", insuranceId],
      });
    }
  }, [insuranceId, reset, queryClient]);

  const saveMutation = useMutation({
    mutationFn: async (payload: InsuranceFormData) => {
      if (isEdit && insuranceId) {
        const response = await insuranceService.updateInsurance(
          payload,
          insuranceId
        );
        return response.data;
      } else {
        const response = await insuranceService.saveInsurance(payload);
        return response.data;
      }
    },
    onSuccess: (data) => {
      setAlertType("success");
      setAlertMessage(
        isEdit
          ? "Insurance Updated Successfully!"
          : "Insurance Created Successfully!"
      );
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        queryClient.invalidateQueries({ queryKey: ["insurances"] });
        queryClient.removeQueries({ queryKey: ["insurance-detail"] });
        router.push(AppURL.masterdataInsurance);
      }, 2000);
    },
    onError: (error) => {
      console.error("Failed to save insurance:", error);
      setAlertType("error");
      setAlertMessage(
        isEdit
          ? "Failed to update insurance. Please try again."
          : "Failed to create insurance. Please try again."
      );
      setShowAlert(true);
    },
  });

  const handleSave = useCallback(
    async (formData: InsuranceFormData) => {
      setAlertMessage("");
      setShowAlert(false);

      if (!formData.name) {
        setAlertType("error");
        setAlertMessage("Insurance Name is required.");
        setShowAlert(true);
        return;
      }

      saveMutation.mutate(formData);
    },
    [saveMutation]
  );

  const goBack = useCallback(() => {
    router.push(AppURL.masterdataInsurance);
  }, [router]);

  const loadInsuranceDetail = useCallback((id: string) => {
    setInsuranceId(id);
  }, []);

  return {
    handleSubmit,
    control,
    errors,
    reset,
    setValue,
    watch,

    hasAccess,
    showAlert,
    alertMessage,
    alertType,
    isEdit,

    isLoadingDetail,
    isSaving: saveMutation.isPending,

    handleSave,
    setShowAlert,
    goBack,
    loadInsuranceDetail,
  };
}
