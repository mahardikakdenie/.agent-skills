import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/formatter";
import { useCalendarDetail } from "@/services/helper/hooks/queries";
import {
  useCreateCalendar,
  useUpdateCalendar,
} from "@/services/helper/hooks/mutations";

interface HolidayFormData {
  name: string;
  type: string;
  country: string;
  date?: string;
  startdate?: string;
  enddate?: string;
}

interface UseHolidayDateFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  setValue: any;
  watch: any;
  reset: any;
  holidayId?: string;
  isLoadingDetail: boolean;
  isSaving: boolean;
  types: Array<{ name: string; code: string }>;
  countries: Array<{ name: string; code: string }>;
  handleSave: (formData: HolidayFormData) => Promise<void>;
  loadHolidayDetail: (id: string) => void;
  goBack: () => void;
}

export function useHolidayDateForm(
  mode: "create" | "edit" = "create"
): UseHolidayDateFormProps {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { permissionList } = useAuth();

  const [holidayId, setHolidayId] = useState<string>();
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
  } = useForm<HolidayFormData>({
    shouldUnregister: false,
    defaultValues: isEdit
      ? {
          name: "",
          type: "",
          country: "",
          date: "",
        }
      : {
          name: "",
          type: "",
          country: "",
          startdate: "",
          enddate: "",
        },
  });

  const { data: holidayDetailResponse, isLoading: isLoadingDetail } =
    useCalendarDetail(holidayId || "", {
      enabled: !!holidayId && isEdit,
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: "always",
    });

  const holidayDetailData: any = holidayDetailResponse;
  const holidayDetail =
    holidayDetailData?.data?.[0] ??
    (Array.isArray(holidayDetailData?.data)
      ? holidayDetailData?.data?.[0]
      : holidayDetailData?.data) ??
    (Array.isArray(holidayDetailData)
      ? holidayDetailData[0]
      : holidayDetailData);

  const types = useMemo(
    () => [
      { name: "Joint Leave", code: "Joint Leave" },
      { name: "National Holiday", code: "National Holiday" },
    ],
    []
  );

  const countries = useMemo(
    () => [
      { name: "Indonesia", code: "id" },
      { name: "Malaysia", code: "my" },
    ],
    []
  );

  useEffect(() => {
    if (holidayDetail && isEdit) {
      if (watch("name") !== holidayDetail.name) {
        setValue("name", holidayDetail.name || "", { shouldValidate: true });
      }
      if (watch("type") !== holidayDetail.type) {
        setValue("type", holidayDetail.type || "", { shouldValidate: true });
      }
      if (watch("country") !== holidayDetail.country) {
        setValue("country", holidayDetail.country || "", {
          shouldValidate: true,
        });
      }
      if (holidayDetail.date) {
        const formattedDate = formatDate(holidayDetail.date, "YYYY-MM-DD");
        if (watch("date") !== formattedDate) {
          setValue("date", formattedDate, {
            shouldValidate: true,
          });
        }
      }
    }
  }, [holidayDetail, isEdit, setValue, watch]);

  const handleSaveError = useCallback((error: any) => {
    console.error("Save failed:", error);
    toast.error(
      error?.response?.data?.message ||
        "Failed to save holiday. Please try again."
    );
  }, []);

  const createHolidayMutation = useCreateCalendar({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
      queryClient.invalidateQueries({ queryKey: ["holiday-detail"] });
      toast.success("Holiday Created Successfully!");
      router.push(AppURL.masterdataHolidayDate);
    },
    onError: handleSaveError,
  });

  const updateHolidayMutation = useUpdateCalendar({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
      queryClient.invalidateQueries({ queryKey: ["holiday-detail"] });
      toast.success("Holiday Updated Successfully!");
      router.push(AppURL.masterdataHolidayDate);
    },
    onError: handleSaveError,
  });

  const handleSave = useCallback(
    async (formData: HolidayFormData) => {
      if (!formData.name || !formData.type || !formData.country) {
        toast.error("Please fill all required fields");
        return;
      }

      if (!isEdit && (!formData.startdate || !formData.enddate)) {
        toast.error("Please select start and end dates");
        return;
      }

      if (isEdit && !formData.date) {
        toast.error("Please select a date");
        return;
      }

      if (isEdit && holidayId) {
        await updateHolidayMutation.mutateAsync({
          id: holidayId,
          payload: formData,
        });
        return;
      }

      const createData = {
        ...formData,
        date: formData.startdate,
        year: formData.startdate
          ? new Date(formData.startdate).getFullYear().toString()
          : "",
      };
      await createHolidayMutation.mutateAsync(createData);
    },
    [createHolidayMutation, holidayId, isEdit, updateHolidayMutation]
  );

  const loadHolidayDetail = useCallback((id: string) => {
    setHolidayId(id);
  }, []);

  const goBack = useCallback(() => {
    router.push(AppURL.masterdataHolidayDate);
  }, [router]);

  return {
    handleSubmit,
    control,
    errors,
    setValue,
    watch,
    reset,
    holidayId,
    isLoadingDetail,
    isSaving: createHolidayMutation.isPending || updateHolidayMutation.isPending,
    types,
    countries,
    handleSave,
    loadHolidayDetail,
    goBack,
  };
}

