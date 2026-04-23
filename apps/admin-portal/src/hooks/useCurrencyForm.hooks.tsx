import { useState, useCallback, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { useForm } from "react-hook-form";
import AppURL from "@/constants/app-url.const";
import {
  useInsuranceCurrencies,
  useInsurances,
  useReferenceCurrencies,
} from "@/services/product/hooks/queries";
import {
  useCreateInsuranceCurrency,
  useDeleteInsuranceCurrency,
} from "@/services/product/hooks/mutations";

interface CurrencyField {
  id: string;
  rate: string;
  lastRate: string;
  currency_from: string;
  currency_to: string;
  updated_at?: string;
  edit_by?: string;
  isEdited?: boolean;
}

interface CurrencyFormData {
  insurance: string;
}

interface UseCurrencyFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  reset: any;
  setValue: any;
  watch: any;

  insurances: any[];
  typeCurrencies: any[];
  currencyFields: CurrencyField[];

  selectedInsuranceId: string;

  hasAccess: boolean | null;
  showAlert: boolean;
  alertMessage: string;
  alertType: "success" | "error";
  isEdit: boolean;

  isLoadingInsurances: boolean;
  isLoadingTypeCurrencies: boolean;
  isLoadingCurrencies: boolean;
  isSaving: boolean;

  handleSave: (formData: CurrencyFormData) => void;
  handleAddCurrency: () => void;
  handleChangeRate: (index: number, value: string) => void;
  handleChangeCurrencyFrom: (index: number, value: string) => void;
  handleChangeCurrencyTo: (index: number, value: string) => void;
  handleDeleteCurrency: (id: string, index: number) => void;
  setShowAlert: (show: boolean) => void;
  goBack: () => void;
  loadCurrencyDetail: (insuranceId: string) => void;
}

export function useCurrencyForm(
  mode: "create" | "edit" = "create"
): UseCurrencyFormProps {
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
  } = useForm<CurrencyFormData>({
    shouldUnregister: false,
    defaultValues: {
      insurance: "",
    },
  });

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [selectedInsuranceId, setSelectedInsuranceId] = useState<string>("");
  const [currencyFields, setCurrencyFields] = useState<CurrencyField[]>([
    {
      id: "",
      rate: "",
      lastRate: "",
      currency_from: "",
      currency_to: "",
      isEdited: true,
    },
  ]);

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

  const { data: insurancesResponse, isLoading: isLoadingInsurances } = useInsurances(
    { page: 1 },
    {
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  const { data: typeCurrenciesResponse, isLoading: isLoadingTypeCurrencies } =
    useReferenceCurrencies(
      {},
      {
      staleTime: 300000,
      refetchOnWindowFocus: false,
    });

  const { data: existingCurrenciesResponse, isLoading: isLoadingCurrencies } =
    useInsuranceCurrencies(selectedInsuranceId || "", { page: 1, pageSize: 100 }, {
      enabled: isEdit && !!selectedInsuranceId,
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: "always",
    });

  const insurances = useMemo(() => {
    const data: any = insurancesResponse;
    return data?.data ?? data ?? [];
  }, [insurancesResponse]);

  const typeCurrencies = useMemo(() => {
    const data: any = typeCurrenciesResponse;
    return data?.data ?? data ?? [];
  }, [typeCurrenciesResponse]);

  const existingCurrencies = useMemo(() => {
    const data: any = existingCurrenciesResponse;
    return data?.data ?? data ?? [];
  }, [existingCurrenciesResponse]);

  useEffect(() => {
    if (existingCurrencies && isEdit) {
      reset({
        insurance: selectedInsuranceId,
      });

      if (
        existingCurrencies.length > 0 &&
        existingCurrencies[0].currencies &&
        existingCurrencies[0].currencies.length > 0
      ) {
        let groupExchangeRate: any = {};

        existingCurrencies[0].currencies
          .sort(
            (a: any, b: any) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          )
          .forEach((item: any) => {
            const key = `${item.currency_from}_${item.currency_to}`;
            if (!groupExchangeRate.hasOwnProperty(key)) {
              groupExchangeRate[key] = [];
            }
            groupExchangeRate[key].push(item);
          });

        const fields = Object.keys(groupExchangeRate).map((key: any) => {
          const exchangeRateLog = groupExchangeRate[key];

          const formValue: CurrencyField = {
            id: exchangeRateLog[0].id,
            rate: exchangeRateLog[0].value,
            lastRate: exchangeRateLog[0].value,
            currency_from: exchangeRateLog[0].currency_from,
            currency_to: exchangeRateLog[0].currency_to,
            updated_at: exchangeRateLog[0].updated_at,
            isEdited: false,
          };

          if (exchangeRateLog.length > 1) {
            formValue.lastRate = exchangeRateLog[1].value;
          }

          return formValue;
        });

        // Only set if fields are actually different to prevent infinite loop
        setCurrencyFields((prev) => {
          const isSame =
            prev.length === fields.length &&
            prev.every((f, i) => f.id === fields[i].id && f.rate === fields[i].rate);

          if (isSame) return prev;
          return fields;
        });
      }
    }
  }, [existingCurrencies, reset, isEdit, selectedInsuranceId]);

  const createInsuranceCurrencyMutation = useCreateInsuranceCurrency();

  const deleteMutation = useDeleteInsuranceCurrency({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
    },
    onError: (error) => {
      console.error("Failed to delete currency:", error);
      alert("Failed to delete currency");
    },
  });

  const handleSave = useCallback(
    async (formData: CurrencyFormData) => {
      setAlertMessage("");
      setShowAlert(false);

      if (!formData.insurance) {
        setAlertType("error");
        setAlertMessage("Please select an Insurance.");
        setShowAlert(true);
        return;
      }

      const validCurrencies = currencyFields.filter(
        (c) =>
          c.rate.trim() !== "" &&
          c.currency_from.trim() !== "" &&
          c.currency_to.trim() !== ""
      );

      if (validCurrencies.length === 0) {
        setAlertType("error");
        setAlertMessage("Please add at least one currency exchange rate.");
        setShowAlert(true);
        return;
      }

      try {
        for (const currency of currencyFields) {
          if (currency.isEdited || currency.id === "") {
            await createInsuranceCurrencyMutation.mutateAsync({
              insuranceId: formData.insurance,
              payload: {
                insurance: "",
                value: currency.rate,
                currency_from: currency.currency_from,
                currency_to: currency.currency_to,
                start_from: new Date(),
                active: true,
              },
            });
          }
        }

        setAlertType("success");
        setAlertMessage(
          isEdit
            ? "Currencies Updated Successfully!"
            : "Currencies Created Successfully!"
        );
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
          queryClient.invalidateQueries({ queryKey: ["currencies"] });
          queryClient.removeQueries({ queryKey: ["currencies-detail"] });
          router.back();
        }, 2000);
      } catch (error) {
        console.error("Failed to save currencies:", error);
        setAlertType("error");
        setAlertMessage("Failed to save currencies. Please try again.");
        setShowAlert(true);
      }
    },
    [createInsuranceCurrencyMutation, currencyFields, isEdit, queryClient, router]
  );

  const handleAddCurrency = useCallback(() => {
    setCurrencyFields((prev) => [
      ...prev,
      {
        id: "",
        rate: "",
        lastRate: "",
        currency_from: "",
        currency_to: "",
        isEdited: true,
      },
    ]);
  }, []);

  const handleChangeRate = useCallback((index: number, value: string) => {
    setCurrencyFields((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], rate: value, isEdited: true };
      return updated;
    });
  }, []);

  const handleChangeCurrencyFrom = useCallback(
    (index: number, value: string) => {
      setCurrencyFields((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          currency_from: value,
          isEdited: true,
        };
        return updated;
      });
    },
    []
  );

  const handleChangeCurrencyTo = useCallback((index: number, value: string) => {
    setCurrencyFields((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        currency_to: value,
        isEdited: true,
      };
      return updated;
    });
  }, []);

  const handleDeleteCurrency = useCallback(
    async (id: string, index: number) => {
      if (id) {
        if (
          window.confirm(
            "Are you sure you want to delete this currency exchange rate?"
          )
        ) {
          deleteMutation.mutate({
            insuranceId: selectedInsuranceId,
            currencyId: id,
          });
          setCurrencyFields((prev) => prev.filter((_, i) => i !== index));
        }
      } else {
        setCurrencyFields((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [deleteMutation, selectedInsuranceId]
  );

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const loadCurrencyDetail = useCallback((insuranceId: string) => {
    setSelectedInsuranceId(insuranceId);
  }, []);

  return {
    handleSubmit,
    control,
    errors,
    reset,
    setValue,
    watch,

    insurances,
    typeCurrencies,
    currencyFields,

    selectedInsuranceId,

    hasAccess,
    showAlert,
    alertMessage,
    alertType,
    isEdit,

    isLoadingInsurances,
    isLoadingTypeCurrencies,
    isLoadingCurrencies,
    isSaving: createInsuranceCurrencyMutation.isPending,

    handleSave,
    handleAddCurrency,
    handleChangeRate,
    handleChangeCurrencyFrom,
    handleChangeCurrencyTo,
    handleDeleteCurrency,
    setShowAlert,
    goBack,
    loadCurrencyDetail,
  };
}
