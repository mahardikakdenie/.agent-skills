import React, { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { useForm } from "react-hook-form";
import { isValid, parseISO } from "date-fns";
import { countryService, sanctionService } from "@/services/api.service";
import ApiURL from "@/constants/api-url.const";
import AppURL from "@/constants/app-url.const";

interface Source {
  id: string;
  source_name: string;
  source_type: string;
  source_url: string;
  insurance_id: string;
}

interface CountryAPI {
  id: string;
  name: string;
}

interface SanctionFormData {
  country: string;
  source_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  id_number: string;
  phone_number: string;
  email: string;
  date_blacklisted: string;
  blacklist_reason: string;
}

interface UseSanctionFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  reset: any;

  sources: Source[];
  countries: CountryAPI[];

  hasAccess: boolean | null;
  showAlert: boolean;
  errorMessage: string;
  isEdit: boolean;

  isLoadingSources: boolean;
  isLoadingCountries: boolean;
  isLoadingDetail: boolean;
  isSaving: boolean;

  handleSave: (formData: SanctionFormData) => void;
  setShowAlert: (show: boolean) => void;
  goBack: () => void;
  loadSanctionDetail: (id: string) => void;
}

export function useSanctionForm(
  mode: "create" | "edit" = "create"
): UseSanctionFormProps {
  const router = useRouter();
  const { permissionList } = useAuth();
  const queryClient = useQueryClient();
  const isEdit = mode === "edit";

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SanctionFormData>({
    shouldUnregister: false,
    defaultValues: {
      country: "IDN",
      source_id: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      id_number: "",
      phone_number: "",
      email: "",
      date_blacklisted: "",
      blacklist_reason: "",
    },
  });

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sanctionId, setSanctionId] = useState<string>("");

  useEffect(() => {
    const checkAccess = async () => {
      const requiredPermission = isEdit ? "Sanction.Update" : "Sanction.Create";
      const access = permissionList.includes(requiredPermission);
      setHasAccess(access);

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList, isEdit]);

  const { data: sourcesData, isLoading: isLoadingSources } = useQuery({
    queryKey: ["sanction-sources"],
    queryFn: async () => {
      const response = await sanctionService.get(ApiURL.v1Sources);
      return response.data.data;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const { data: countriesData, isLoading: isLoadingCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await countryService.get(ApiURL.countries);
      return response.data.data;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const { data: sanctionDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["sanction-detail", sanctionId],
    queryFn: async () => {
      if (!sanctionId) return null;

      const response = await sanctionService.get(
        ApiURL.v1BlacklistDetails(sanctionId)
      );
      return response.data.data[0];
    },
    enabled: isEdit && !!sanctionId,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (sanctionDetail && isEdit) {
      reset({
        country: sanctionDetail.country || "IDN",
        source_id: sanctionDetail.source_id || "",
        first_name: sanctionDetail.first_name || "",
        middle_name: sanctionDetail.middle_name || "",
        last_name: sanctionDetail.last_name || "",
        id_number: sanctionDetail.id_number || "",
        phone_number: sanctionDetail.phone_number || "",
        email: sanctionDetail.email || "",
        date_blacklisted: sanctionDetail.date_blacklisted || "",
        blacklist_reason: sanctionDetail.blacklist_reason || "",
      });
    }
  }, [sanctionDetail, reset, isEdit]);

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (isEdit && sanctionId) {
        const response = await sanctionService.put(
          ApiURL.v1BlacklistUpdateDetails(sanctionId),
          payload
        );
        return response.data;
      } else {
        const response = await sanctionService.post(
          ApiURL.v1Blacklist,
          payload
        );
        return response.data;
      }
    },
    onSuccess: (data) => {
      if (data != null) {
        setErrorMessage(
          isEdit
            ? "Sanction Updated Successfully!"
            : "Sanction Created Successfully!"
        );
      } else {
        setErrorMessage(
          isEdit
            ? "Failed to update sanction. Please try again."
            : "Failed to create sanction. Please try again."
        );
      }

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);

        queryClient.invalidateQueries({ queryKey: ["sanctions"] });
        router.push(AppURL.sanctionList);
      }, 2000);
    },
    onError: (error) => {
      console.error("Failed to save sanction:", error);
      setErrorMessage(
        isEdit
          ? "Failed to update sanction. Please try again."
          : "Failed to create sanction. Please try again."
      );
      setShowAlert(true);
    },
  });

  const handleSave = useCallback(
    async (formData: SanctionFormData) => {
      setErrorMessage("");
      setShowAlert(false);

      const requiredFields = [
        "blacklist_reason",
        "date_blacklisted",
        "email",
        "first_name",
        "id_number",
        "phone_number",
        "source_id",
      ];

      if (isEdit) {
        requiredFields.push("middle_name", "last_name", "country");
      }

      const missingFields = requiredFields.filter(
        (field) => !formData[field as keyof SanctionFormData]
      );

      if (missingFields.length > 0) {
        setErrorMessage("Please fill in all required fields.");
        setShowAlert(true);
        return;
      }

      const date_blacklisted = parseISO(formData.date_blacklisted);
      if (!isValid(date_blacklisted)) {
        setErrorMessage("Invalid date format. Please use a valid date.");
        setShowAlert(true);
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)?$/;
      if (!emailPattern.test(formData.email)) {
        setErrorMessage(
          "Invalid email format. Please enter a valid email address."
        );
        setShowAlert(true);
        return;
      }

      if (isEdit) {
        const phoneNumberPattern = /^\d{10,15}$/;
        if (!phoneNumberPattern.test(formData.phone_number)) {
          setErrorMessage(
            "Phone number must be numeric and between 10 to 15 digits."
          );
          setShowAlert(true);
          return;
        }
      }

      const payload = {
        id_number: formData.id_number,
        first_name: formData.first_name,
        middle_name: formData.middle_name || null,
        last_name: formData.last_name || null,
        phone_number: formData.phone_number,
        email: formData.email,
        blacklist_reason: formData.blacklist_reason,
        source_id: formData.source_id,
        country: isEdit ? formData.country : "IDN",
        id_type: "KTP",
        date_blacklisted: formData.date_blacklisted,
      };

      saveMutation.mutate(payload);
    },
    [saveMutation, isEdit]
  );

  const goBack = useCallback(() => {
    router.push(AppURL.sanctionList);
  }, [router]);

  const loadSanctionDetail = useCallback((id: string) => {
    setSanctionId(id);
  }, []);

  return {
    handleSubmit,
    control,
    errors,
    reset,

    sources: sourcesData || [],
    countries: countriesData || [],

    hasAccess,
    showAlert,
    errorMessage,
    isEdit,

    isLoadingSources,
    isLoadingCountries,
    isLoadingDetail,
    isSaving: saveMutation.isPending,

    handleSave,
    setShowAlert,
    goBack,
    loadSanctionDetail,
  };
}
