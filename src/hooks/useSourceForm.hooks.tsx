import React, { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { useForm } from "react-hook-form";
import { productService, sanctionService } from "@/services/api.service";
import ApiURL from "@/constants/api-url.const";
import AppURL from "@/constants/app-url.const";

interface Insurance {
  id: string;
  name: string;
}

interface SourceFormData {
  source_name: string;
  source_type: string;
  source_url: string;
  insurance_id: string;
}

interface UseSourceFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  reset: any;
  watch: any;

  insurances: Insurance[];

  hasAccess: boolean | null;
  showAlert: boolean;
  errorMessage: string;
  isEdit: boolean;
  sourceType: string;

  isLoadingInsurances: boolean;
  isLoadingDetail: boolean;
  isSaving: boolean;

  handleSave: (formData: SourceFormData) => void;
  setShowAlert: (show: boolean) => void;
  goBack: () => void;
  loadSourceDetail: (id: string) => void;
  handleSourceTypeChange: (value: string) => void;
}

export function useSourceForm(
  mode: "create" | "edit" = "create"
): UseSourceFormProps {
  const router = useRouter();
  const { permissionList } = useAuth();
  const queryClient = useQueryClient();
  const isEdit = mode === "edit";

  const {
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SourceFormData>({
    shouldUnregister: false,
    defaultValues: {
      source_name: "",
      source_type: "government",
      source_url: "",
      insurance_id: "",
    },
  });

  const sourceType = watch("source_type");

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sourceId, setSourceId] = useState<string>("");

  useEffect(() => {
    const checkAccess = async () => {
      const requiredPermission = isEdit
        ? "Source.Source List.Update"
        : "Source.Source List.Create";
      const access = permissionList.includes(requiredPermission);
      setHasAccess(access);

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList, isEdit]);

  const { data: insurancesData, isLoading: isLoadingInsurances } = useQuery({
    queryKey: ["insurances"],
    queryFn: async () => {
      const response = await productService.get(ApiURL.v1Insurances);
      return response.data.data;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const { data: sourceDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["source-detail", sourceId],
    queryFn: async () => {
      if (!sourceId) return null;

      const response = await sanctionService.get(
        ApiURL.v1SourcesDetails(sourceId)
      );
      return response.data.data[0];
    },
    enabled: isEdit && !!sourceId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (sourceDetail && isEdit) {
      const formData = {
        source_name: sourceDetail.source_name || "",
        source_type: sourceDetail.source_type || "government",
        source_url: sourceDetail.source_url || "",
        insurance_id: sourceDetail.insurance_id || "",
      };

      reset(formData, {
        keepErrors: false,
        keepDirty: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false,
      });

      setTimeout(() => {
        if (watch("source_type") !== sourceDetail.source_type) {
          setValue("source_type", sourceDetail.source_type || "government", {
            shouldValidate: true,
          });
        }

        if (watch("insurance_id") !== sourceDetail.insurance_id) {
          setValue("insurance_id", sourceDetail.insurance_id || "", {
            shouldValidate: true,
          });
        }
      }, 100);
    }
  }, [sourceDetail, isEdit]);

  const handleSourceTypeChange = useCallback(
    (value: string) => {
      if (value !== "insurance") {
        setValue("insurance_id", "");
      }
    },
    [setValue]
  );

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (isEdit && sourceId) {
        const response = await sanctionService.put(
          ApiURL.v1SourcesUpdateDetails(sourceId),
          payload
        );
        return response.data;
      } else {
        const response = await sanctionService.post(ApiURL.v1Sources, payload);
        return response.data;
      }
    },
    onSuccess: (data) => {
      if (data != null) {
        setErrorMessage(
          isEdit
            ? "Source Updated Successfully!"
            : "Source Created Successfully!"
        );
      } else {
        setErrorMessage(
          isEdit
            ? "Failed to update source. Please try again."
            : "Failed to create source. Please try again."
        );
      }

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);

        queryClient.invalidateQueries({ queryKey: ["sources"] });
        router.push(AppURL.sourceList);
      }, 2000);
    },
    onError: (error) => {
      console.error("Failed to save source:", error);
      setErrorMessage(
        isEdit
          ? "Failed to update source. Please try again."
          : "Failed to create source. Please try again."
      );
      setShowAlert(true);
    },
  });

  const handleSave = useCallback(
    async (formData: SourceFormData) => {
      setErrorMessage("");
      setShowAlert(false);

      const requiredFields = ["source_name", "source_type"];

      const missingFields = requiredFields.filter(
        (field) => !formData[field as keyof SourceFormData]
      );

      if (missingFields.length > 0) {
        setErrorMessage("Please fill in all required fields.");
        setShowAlert(true);
        return;
      }

      if (formData.source_type === "insurance" && !formData.insurance_id) {
        setErrorMessage("Please select an insurance.");
        setShowAlert(true);
        return;
      }

      if (formData.source_url) {
        const urlPattern =
          /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!urlPattern.test(formData.source_url)) {
          setErrorMessage("Please enter a valid URL format.");
          setShowAlert(true);
          return;
        }
      }

      let insurance_name = null;
      if (formData.source_type === "insurance" && formData.insurance_id) {
        const selectedInsurance = insurancesData?.find(
          (insurance: Insurance) => insurance.id === formData.insurance_id
        );
        insurance_name = selectedInsurance?.name || null;
      }

      const payload = {
        source_name: formData.source_name,
        source_type: formData.source_type,
        source_url: formData.source_url || null,
        insurance_id:
          formData.source_type === "insurance" ? formData.insurance_id : null,
        insurance_name,
        country: "IDN",
      };

      saveMutation.mutate(payload);
    },
    [saveMutation]
  );

  const goBack = useCallback(() => {
    router.push(AppURL.sourceList);
  }, [router]);

  const loadSourceDetail = useCallback((id: string) => {
    setSourceId(id);
  }, []);

  return {
    handleSubmit,
    control,
    errors,
    reset,
    watch,

    insurances: insurancesData || [],

    hasAccess,
    showAlert,
    errorMessage,
    isEdit,
    sourceType,

    isLoadingInsurances,
    isLoadingDetail,
    isSaving: saveMutation.isPending,

    handleSave,
    setShowAlert,
    goBack,
    loadSourceDetail,
    handleSourceTypeChange,
  };
}
