import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { helperService } from "@/services/helper/api/helper.service";
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/formatter";

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

  const { data: holidayDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["holiday-detail", holidayId],
    queryFn: async () => {
      if (!holidayId) return null;
      const response: any = await helperService.getCalendar({ id: holidayId });
      return response.data[0];
    },
    enabled: !!holidayId && isEdit,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (holidayDetail && isEdit) {
      const formData = {
        name: holidayDetail.name || "",
        type: holidayDetail.type || "",
        country: holidayDetail.country || "",
        date: holidayDetail.date
          ? formatDate(holidayDetail.date, "YYYY-MM-DD")
          : "",
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
        if (watch("type") !== holidayDetail.type) {
          setValue("type", holidayDetail.type || "", {
            shouldValidate: true,
          });
        }

        if (watch("country") !== holidayDetail.country) {
          setValue("country", holidayDetail.country || "", {
            shouldValidate: true,
          });
        }
      }, 100);
    }
  }, [holidayDetail, isEdit, reset, setValue, watch]);

  const saveMutation = useMutation({
    mutationFn: async (data: HolidayFormData) => {
      if (isEdit && holidayId) {
        return await helperService.updateCalendar(holidayId, data);
      } else {
        const createData = {
          ...data,
          date: data.startdate,
          year: data.startdate
            ? new Date(data.startdate).getFullYear().toString()
            : "",
        };
        return await helperService.createCalendar(createData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
      queryClient.invalidateQueries({ queryKey: ["holiday-detail"] });

      toast.success(
        isEdit
          ? "Holiday Updated Successfully!"
          : "Holiday Created Successfully!"
      );

      router.push(AppURL.masterdataHolidayDate);
    },
    onError: (error: any) => {
      console.error("Save failed:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to save holiday. Please try again."
      );
    },
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

      await saveMutation.mutateAsync(formData);
    },
    [saveMutation, isEdit]
  );

  const loadHolidayDetail = useCallback((id: string) => {
    setHolidayId(id);
  }, []);

  const goBack = useCallback(() => {
    router.push(AppURL.masterdataHolidayDate);
  }, [router]);

  const types = [
    { name: "Joint Leave", code: "Joint Leave" },
    { name: "National Holiday", code: "National Holiday" },
  ];

  const countries = [
    { name: "Indonesia", code: "id" },
    { name: "Malaysia", code: "my" },
  ];

  return {
    handleSubmit,
    control,
    errors,
    setValue,
    watch,
    reset,
    holidayId,
    isLoadingDetail,
    isSaving: saveMutation.isPending,
    types,
    countries,
    handleSave,
    loadHolidayDetail,
    goBack,
  };
}

