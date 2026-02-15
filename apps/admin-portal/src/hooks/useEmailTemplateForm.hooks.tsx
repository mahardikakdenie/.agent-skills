import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import AppURL from "@/constants/app-url.const";
import toast from "react-hot-toast";
import { EditorState, ContentState, convertFromHTML, Modifier } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import {
  useCategories,
  useEmailTags,
  useEmailTemplateJourneyDetail,
  useInsurances,
  usePlans,
  useProducts,
  useReferenceEmailJourney,
} from "@/services/product/hooks/queries";
import {
  useCreateEmailTemplateJourney,
  useUpdateEmailTemplateJourney,
} from "@/services/product/hooks/mutations";

interface EmailTemplateFormData {
  category: string;
  insurance?: string;
  product?: string;
  plan?: string;
  journey: string;
  subject: string;
  content: string;
  type: string;
}

interface UseEmailTemplateFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  setValue: any;
  watch: any;
  reset: any;

  templateId?: string;
  categories: any[];
  insurances: any[];
  products: any[];
  plans: any[];
  journeys: any[];
  emailTags: any[];

  editorState: EditorState;
  setEditorState: (state: EditorState) => void;
  content: string;
  setContent: (content: string) => void;
  selectedTemplateType: string;
  setSelectedTemplateType: (type: string) => void;

  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  selectedInsuranceId: string;
  setSelectedInsuranceId: (id: string) => void;
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  selectedJourneyId: string;
  setSelectedJourneyId: (id: string) => void;

  isLoadingDetail: boolean;
  isLoadingCategories: boolean;
  isLoadingInsurances: boolean;
  isLoadingProducts: boolean;
  isLoadingPlans: boolean;
  isLoadingJourneys: boolean;
  isLoadingEmailTags: boolean;
  isSaving: boolean;

  handleSave: (formData: EmailTemplateFormData) => Promise<void>;
  loadTemplateDetail: (id: string) => void;
  handleEditorChange: (state: EditorState) => void;
  handleEditorInsert: (text: string) => void;
  handleSelectTemplateType: (type: string) => void;
  goBack: () => void;
}

export function useEmailTemplateForm(
  mode: "create" | "edit" = "create",
): UseEmailTemplateFormProps {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [templateId, setTemplateId] = useState<string>();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [content, setContent] = useState("");
  const [selectedTemplateType, setSelectedTemplateType] = useState("email");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedInsuranceId, setSelectedInsuranceId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedJourneyId, setSelectedJourneyId] = useState("");

  const isEdit = mode === "edit";

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EmailTemplateFormData>({
    shouldUnregister: false,
    defaultValues: {
      category: "",
      insurance: "",
      product: "",
      plan: "",
      journey: "",
      subject: "",
      content: "",
      type: "email",
    },
  });

  const { data: templateDetailResponse, isLoading: isLoadingDetail } =
    useEmailTemplateJourneyDetail(templateId || "", {
    enabled: !!templateId && isEdit,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  const templateDetailData: any = templateDetailResponse;
  const templateDetail = (() => {
    const detail = templateDetailData?.data ?? templateDetailData;
    return Array.isArray(detail) ? detail[0] : detail;
  })();

  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useCategories(
      {},
      {
        staleTime: 300000,
      },
    );

  const { data: insurancesResponse, isLoading: isLoadingInsurances } =
    useInsurances(
      {
        page: 1,
        categoryId: selectedCategoryId,
      },
      {
        enabled: !!selectedCategoryId,
        staleTime: 300000,
      },
    );

  const { data: productsResponse, isLoading: isLoadingProducts } = useProducts(
    {
      page: 1,
      insuranceId: selectedInsuranceId,
    },
    {
      enabled: !!selectedInsuranceId,
      staleTime: 300000,
    },
  );

  const { data: plansResponse, isLoading: isLoadingPlans } = usePlans(
    {
      page: 1,
      productId: selectedProductId,
    },
    {
      enabled: !!selectedProductId,
      staleTime: 300000,
    },
  );

  const { data: journeysResponse, isLoading: isLoadingJourneys } =
    useReferenceEmailJourney(undefined, {
      staleTime: 300000,
    });

  const { data: emailTagsResponse, isLoading: isLoadingEmailTags } =
    useEmailTags(
      {
        page: 1,
        pageSize: 100,
        journey: selectedJourneyId,
      },
      {
        enabled: !!selectedJourneyId,
        staleTime: 300000,
      },
    );

  const handleSaveError = useCallback((error: any) => {
    console.error("Save failed:", error);
    toast.error(
      error?.response?.data?.message ||
        "Failed to save email template. Please try again.",
    );
  }, []);

  const handleCreateSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["email-templates"] });
    queryClient.invalidateQueries({ queryKey: ["email-template-detail"] });
    toast.success("Email Template Created Successfully!");
    router.push(AppURL.masterdataEmailTemplate);
  }, [queryClient, router]);

  const handleUpdateSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["email-templates"] });
    queryClient.invalidateQueries({ queryKey: ["email-template-detail"] });
    toast.success("Email Template Updated Successfully!");
    router.push(AppURL.masterdataEmailTemplate);
  }, [queryClient, router]);

  const createEmailTemplateMutation = useCreateEmailTemplateJourney({
    onSuccess: handleCreateSuccess,
    onError: handleSaveError,
  });

  const updateEmailTemplateMutation = useUpdateEmailTemplateJourney({
    onSuccess: handleUpdateSuccess,
    onError: handleSaveError,
  });

  const categoriesData: any = categoriesResponse;
  const insurancesData: any = insurancesResponse;
  const productsData: any = productsResponse;
  const plansData: any = plansResponse;
  const journeysData: any = journeysResponse;
  const emailTagsData: any = emailTagsResponse;

  const categories = categoriesData?.data ?? categoriesData ?? [];
  const insurances = insurancesData?.data ?? insurancesData ?? [];
  const products = productsData?.data ?? productsData ?? [];
  const plans = plansData?.data ?? plansData ?? [];
  const journeys = journeysData?.data ?? journeysData ?? [];
  const emailTags = emailTagsData?.data ?? emailTagsData ?? [];

  useEffect(() => {
    if (templateDetail && isEdit) {
      const formData = {
        category: templateDetail.category || "",
        insurance: templateDetail.insurance || "",
        product: templateDetail.product || "",
        plan: templateDetail.plan || "",
        journey: templateDetail.journey || "",
        subject: templateDetail.subject || "",
        content: templateDetail.content || "",
        type: templateDetail.type || "email",
      };

      if (templateDetail.category) {
        setSelectedCategoryId(templateDetail.category);
      }
      if (templateDetail.insurance) {
        setSelectedInsuranceId(templateDetail.insurance);
      }
      if (templateDetail.product) {
        setSelectedProductId(templateDetail.product);
      }
      if (templateDetail.journey) {
        setSelectedJourneyId(templateDetail.journey);
      }

      if (templateDetail.type) {
        setSelectedTemplateType(templateDetail.type);
      }

      if (templateDetail.content) {
        setContent(templateDetail.content);

        if (templateDetail.type === "email") {
          try {
            const blocksFromHTML = convertFromHTML(templateDetail.content);
            const contentState = ContentState.createFromBlockArray(
              blocksFromHTML.contentBlocks,
              blocksFromHTML.entityMap,
            );
            setEditorState(EditorState.createWithContent(contentState));
          } catch (error) {
            console.error("Error parsing HTML content:", error);
            setEditorState(EditorState.createEmpty());
          }
        }
      }

      reset(formData, {
        keepErrors: false,
        keepDirty: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false,
      });

      setTimeout(() => {
        if (watch("category") !== templateDetail.category) {
          setValue("category", templateDetail.category || "", {
            shouldValidate: true,
          });
        }

        if (watch("insurance") !== templateDetail.insurance) {
          setValue("insurance", templateDetail.insurance || "", {
            shouldValidate: true,
          });
        }

        if (watch("product") !== templateDetail.product) {
          setValue("product", templateDetail.product || "", {
            shouldValidate: true,
          });
        }

        if (watch("plan") !== templateDetail.plan) {
          setValue("plan", templateDetail.plan || "", {
            shouldValidate: true,
          });
        }

        if (watch("journey") !== templateDetail.journey) {
          setValue("journey", templateDetail.journey || "", {
            shouldValidate: true,
          });
        }

        if (watch("type") !== templateDetail.type) {
          setValue("type", templateDetail.type || "email", {
            shouldValidate: true,
          });
        }
      }, 300);
    }
  }, [templateDetail, isEdit, reset, setValue, watch]);

  useEffect(() => {
    if (templateDetail && isEdit && insurances.length > 0 && templateDetail.insurance) {
      const insuranceExists = insurances.some(
        (ins: any) => ins.id === templateDetail.insurance,
      );
      if (insuranceExists) {
        setValue("insurance", templateDetail.insurance, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [insurances, templateDetail, isEdit, setValue]);

  useEffect(() => {
    if (templateDetail && isEdit && products.length > 0 && templateDetail.product) {
      const productExists = products.some(
        (prod: any) => prod.id === templateDetail.product,
      );
      if (productExists) {
        setValue("product", templateDetail.product, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [products, templateDetail, isEdit, setValue]);

  useEffect(() => {
    if (templateDetail && isEdit && plans.length > 0 && templateDetail.plan) {
      const planExists = plans.some(
        (planItem: any) => planItem.id === templateDetail.plan,
      );
      if (planExists) {
        setValue("plan", templateDetail.plan, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [plans, templateDetail, isEdit, setValue]);

  const handleSave = useCallback(
    async (formData: EmailTemplateFormData) => {
      if (!formData.category || !formData.journey || !formData.subject) {
        toast.error("Please fill all required fields");
        return;
      }

      if (!content) {
        toast.error("Content is required");
        return;
      }

      const requestData = {
        ...formData,
        content,
        type: selectedTemplateType,
      };

      const cleanedData = Object.fromEntries(
        Object.entries(requestData)
          .map(([key, value]) => [key, value === "" ? null : value])
          .filter(([_, value]) => value !== undefined),
      );

      if (isEdit && templateId) {
        await updateEmailTemplateMutation.mutateAsync({
          id: templateId,
          payload: cleanedData,
        });
        return;
      }

      await createEmailTemplateMutation.mutateAsync(cleanedData);
    },
    [
      content,
      createEmailTemplateMutation,
      isEdit,
      selectedTemplateType,
      templateId,
      updateEmailTemplateMutation,
    ],
  );

  const loadTemplateDetail = useCallback((id: string) => {
    setTemplateId(id);
  }, []);

  const handleEditorChange = useCallback((state: EditorState) => {
    setEditorState(state);

    let htmlContent = stateToHTML(state.getCurrentContent());
    htmlContent = htmlContent
      .replace(/\s+/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/ {2}/g, " ");

    setContent(htmlContent);
  }, []);

  const handleEditorInsert = useCallback(
    (text: string) => {
      const contentState = editorState.getCurrentContent();
      const selectionState = editorState.getSelection();

      const newContentState = Modifier.replaceText(
        contentState,
        selectionState,
        text,
      );

      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "insert-characters",
      );

      setEditorState(newEditorState);
    },
    [editorState],
  );

  const handleSelectTemplateType = useCallback((type: string) => {
    setContent("");
    setEditorState(EditorState.createEmpty());
    setSelectedTemplateType(type);
  }, []);

  const goBack = useCallback(() => {
    router.push(AppURL.masterdataEmailTemplate);
  }, [router]);

  return {
    handleSubmit,
    control,
    errors,
    setValue,
    watch,
    reset,
    templateId,
    categories,
    insurances,
    products,
    plans,
    journeys,
    emailTags,
    editorState,
    setEditorState,
    content,
    setContent,
    selectedTemplateType,
    setSelectedTemplateType,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedInsuranceId,
    setSelectedInsuranceId,
    selectedProductId,
    setSelectedProductId,
    selectedJourneyId,
    setSelectedJourneyId,
    isLoadingDetail,
    isLoadingCategories,
    isLoadingInsurances,
    isLoadingProducts,
    isLoadingPlans,
    isLoadingJourneys,
    isLoadingEmailTags,
    isSaving:
      createEmailTemplateMutation.isPending || updateEmailTemplateMutation.isPending,
    handleSave,
    loadTemplateDetail,
    handleEditorChange,
    handleEditorInsert,
    handleSelectTemplateType,
    goBack,
  };
}

