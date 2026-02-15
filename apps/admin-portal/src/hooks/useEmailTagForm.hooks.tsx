import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { productService } from "@/services/product/api/product.service";
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import toast from "react-hot-toast";

interface EmailTagFormData {
  journey: string;
  tag: string;
}

interface UseEmailTagFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  setValue: any;
  watch: any;
  reset: any;
  tagId?: string;
  journeys: any[];
  isLoadingDetail: boolean;
  isLoadingJourneys: boolean;
  isSaving: boolean;
  handleSave: (formData: EmailTagFormData) => Promise<void>;
  loadTagDetail: (id: string) => void;
  goBack: () => void;
}

export function useEmailTagForm(
  mode: "create" | "edit" = "create"
): UseEmailTagFormProps {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { permissionList } = useAuth();

  const [tagId, setTagId] = useState<string>();
  const isEdit = mode === "edit";

  useEffect(() => {
    const checkAccess = async () => {
      const access =
        permissionList.includes("Masterdata.Read") &&
        (mode === "create"
          ? permissionList.includes("Masterdata.Create")
          : permissionList.includes("Masterdata.Update"));

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList, mode]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<EmailTagFormData>({
    shouldUnregister: false,
    defaultValues: {
      journey: "",
      tag: "",
    },
  });

  const { data: tagDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["email-tag-detail", tagId],
    queryFn: async () => {
      if (!tagId) return null;
      const response: any = await productService.getEmailTagById(tagId);
      return response?.data ?? response;
    },
    enabled: !!tagId && isEdit,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  const { data: journeysData, isLoading: isLoadingJourneys } = useQuery({
    queryKey: ["email-tag-journeys"],
    queryFn: async () => {
      const response: any = await productService.getReferenceEmailJourney();
      return response?.data ?? response;
    },
    staleTime: 300000,
  });

  useEffect(() => {
    if (tagDetail && isEdit) {
      const formData = {
        journey: tagDetail.journey || "",
        tag: tagDetail.tag || "",
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
        if (watch("journey") !== tagDetail.journey) {
          setValue("journey", tagDetail.journey || "", {
            shouldValidate: true,
          });
        }

        if (watch("tag") !== tagDetail.tag) {
          setValue("tag", tagDetail.tag || "", {
            shouldValidate: true,
          });
        }
      }, 100);
    }
  }, [tagDetail, isEdit, reset, setValue, watch]);

  const saveMutation = useMutation({
    mutationFn: async (data: EmailTagFormData) => {
      if (isEdit && tagId) {
        return await productService.updateEmailTag(tagId, data);
      } else {
        return await productService.createEmailTag(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-tags"] });
      queryClient.invalidateQueries({ queryKey: ["email-tag-detail"] });
      queryClient.invalidateQueries({ queryKey: ["email-template-tags"] });

      toast.success(
        isEdit
          ? "Email Tag Updated Successfully!"
          : "Email Tag Created Successfully!"
      );

      router.push(AppURL.masterdataEmailTag);
    },
    onError: (error: any) => {
      console.error("Save failed:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to save email tag. Please try again."
      );
    },
  });

  const handleSave = useCallback(
    async (formData: EmailTagFormData) => {
      if (!formData.journey || !formData.tag) {
        toast.error("Please fill all required fields");
        return;
      }

      await saveMutation.mutateAsync(formData);
    },
    [saveMutation]
  );

  const loadTagDetail = useCallback((id: string) => {
    setTagId(id);
  }, []);

  const goBack = useCallback(() => {
    router.push(AppURL.masterdataEmailTag);
  }, [router]);

  return {
    handleSubmit,
    control,
    errors,
    setValue,
    watch,
    reset,
    tagId,
    journeys: journeysData || [],
    isLoadingDetail,
    isLoadingJourneys,
    isSaving: saveMutation.isPending,
    handleSave,
    loadTagDetail,
    goBack,
  };
}

