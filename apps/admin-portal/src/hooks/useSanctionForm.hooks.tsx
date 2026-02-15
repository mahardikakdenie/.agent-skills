import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { useForm } from "react-hook-form";
import { isValid, parseISO } from "date-fns";
import AppURL from "@/constants/app-url.const";
import { useCountries } from "@/services/country/hooks/queries";
import {
  useBlacklistDetail,
  useSources,
} from "@/services/sanction/hooks/queries";
import {
  useCreateBlacklist,
  useUpdateBlacklist,
} from "@/services/sanction/hooks/mutations";

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

  const { data: sourcesResponse, isLoading: isLoadingSources } = useSources(
    {
      page: 1,
      limit: 1000,
    },
    {
      staleTime: 30000,
      refetchOnWindowFocus: false,
    }
  );

  const { data: countriesResponse, isLoading: isLoadingCountries } =
    useCountries({
      staleTime: 30000,
      refetchOnWindowFocus: false,
    });

  const { data: sanctionDetailResponse, isLoading: isLoadingDetail } =
    useBlacklistDetail(sanctionId, {
      enabled: isEdit && !!sanctionId,
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: "always",
    });

  const sourcesData = (sourcesResponse as any)?.data || [];
  const countriesData = (countriesResponse as any)?.data || [];
  const sanctionDetail = (sanctionDetailResponse as any)?.data?.[0] ?? null;

  const handleSaveSuccess = useCallback(
    (data: unknown) => {
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
        router.push(AppURL.sanctionList);
      }, 2000);
    },
    [isEdit, router]
  );

  const handleSaveError = useCallback(
    (error: unknown) => {
      console.error("Failed to save sanction:", error);
      setErrorMessage(
        isEdit
          ? "Failed to update sanction. Please try again."
          : "Failed to create sanction. Please try again."
      );
      setShowAlert(true);
    },
    [isEdit]
  );

  const createBlacklistMutation = useCreateBlacklist({
    onSuccess: handleSaveSuccess,
    onError: handleSaveError,
  });

  const updateBlacklistMutation = useUpdateBlacklist({
    onSuccess: handleSaveSuccess,
    onError: handleSaveError,
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

      if (isEdit && sanctionId) {
        updateBlacklistMutation.mutate({ id: sanctionId, payload: [payload] });
        return;
      }

      createBlacklistMutation.mutate(payload);
    },
    [isEdit, sanctionId, createBlacklistMutation, updateBlacklistMutation]
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
    isSaving:
      createBlacklistMutation.isPending || updateBlacklistMutation.isPending,

    handleSave,
    setShowAlert,
    goBack,
    loadSanctionDetail,
  };
}
