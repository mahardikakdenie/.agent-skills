import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { useForm } from "react-hook-form";
import AppURL from "@/constants/app-url.const";
import { useInsuranceDetail } from "@/services/product/hooks/queries";
import {
  useCreateInsurance,
  useUpdateInsurance,
} from "@/services/product/hooks/mutations";

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

  const { data: insuranceDetailResponse, isLoading: isLoadingDetail } =
    useInsuranceDetail(insuranceId || "", {
    enabled: isEdit && !!insuranceId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  const insuranceDetailData: any = insuranceDetailResponse;
  const insuranceDetail = insuranceDetailData?.data ?? insuranceDetailData;

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

  const createInsuranceMutation = useCreateInsurance();
  const updateInsuranceMutation = useUpdateInsurance();

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

      try {
        if (isEdit && insuranceId) {
          await updateInsuranceMutation.mutateAsync({
            id: insuranceId,
            payload: formData,
          });
        } else {
          await createInsuranceMutation.mutateAsync(formData);
        }

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
      } catch (error) {
        console.error("Failed to save insurance:", error);
        setAlertType("error");
        setAlertMessage(
          isEdit
            ? "Failed to update insurance. Please try again."
            : "Failed to create insurance. Please try again."
        );
        setShowAlert(true);
      }
    },
    [
      createInsuranceMutation,
      insuranceId,
      isEdit,
      queryClient,
      router,
      updateInsuranceMutation,
    ]
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
    isSaving: createInsuranceMutation.isPending || updateInsuranceMutation.isPending,

    handleSave,
    setShowAlert,
    goBack,
    loadInsuranceDetail,
  };
}

