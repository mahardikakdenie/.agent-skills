import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import toast from "react-hot-toast";
import { useCalendar } from "@/services/helper/hooks/queries";
import { useDeleteCalendar } from "@/services/helper/hooks/mutations";

export function useHolidayDate() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { permissionList } = useAuth();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchCountry, setSearchCountry] = useState("id");
  const [searchYear, setSearchYear] = useState<string>("");
  const [searchType, setSearchType] = useState<string | undefined>(undefined);

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Masterdata.Read");
      const editBtn = permissionList.includes("Masterdata.Update");
      const deleteBtn = permissionList.includes("Masterdata.Delete");
      const createBtn = permissionList.includes("Masterdata.Create");

      setCanEdit(editBtn);
      setCanDelete(deleteBtn);
      setHasAccess(access);
      setCanCreate(createBtn);

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList]);

  useEffect(() => {
    const currYear = new Date().getFullYear();
    setSearchYear(currYear.toString());
  }, []);

  const { data: holidaysResponse, isLoading: isLoadingHolidays } = useCalendar(
    {
        page,
        pageSize: rowsPerPage,
        year: searchYear,
        country: searchCountry,
        ...(searchType ? { type: searchType } : {}),
    },
    {
      enabled: hasAccess === true && !!searchYear,
      staleTime: 300000,
      refetchOnWindowFocus: false,
    }
  );

  const holidaysData: any = holidaysResponse;

  const deleteMutation = useDeleteCalendar({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
      toast.success("Holiday deleted successfully");

      if (page > 1) {
        setPage(1);
      }
    },
    onError: (error: any) => {
      console.error("Delete failed:", error);
      toast.error(error?.response?.data?.message || "Failed to delete holiday");
    },
  });

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`${AppURL.masterdataHolidayDateDetail}/${id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm("Are you sure you want to delete this holiday?")) {
        await deleteMutation.mutateAsync(id);
      }
    },
    [deleteMutation]
  );

  const addNewHoliday = useCallback(() => {
    router.push(AppURL.masterdataHolidayDateAdd);
  }, [router]);

  const handleRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const handleTypeChange = useCallback((value: string) => {
    setSearchType(value === "undefined" ? undefined : value);
    setPage(1);
  }, []);

  const handleYearChange = useCallback((value: string) => {
    setSearchYear(value);
    setPage(1);
  }, []);

  const handleCountryChange = useCallback((value: string) => {
    setSearchCountry(value);
    setPage(1);
  }, []);

  const types = [
    { name: "All Holiday Type", code: "undefined" },
    { name: "Joint Leave", code: "Joint Leave" },
    { name: "National Holiday", code: "National Holiday" },
  ];

  const countries = [
    { name: "Indonesia", code: "id" },
    { name: "Malaysia", code: "my" },
  ];

  const years = (() => {
    const currYear = new Date().getFullYear();
    return [
      { name: currYear.toString(), code: currYear.toString() },
      { name: (currYear + 1).toString(), code: (currYear + 1).toString() },
    ];
  })();

  return {
    holidays: holidaysData?.data || [],
    totalPages: holidaysData?.meta?.pageTotal || 1,
    totalItems: holidaysData?.meta?.total || 0,
    page,
    rowsPerPage,
    searchCountry,
    searchYear,
    searchType,
    hasAccess,
    canEdit,
    canCreate,
    canDelete,
    isLoading: isLoadingHolidays || hasAccess === null,
    types,
    countries,
    years,
    setPage,
    handleRowsPerPageChange,
    handleTypeChange,
    handleYearChange,
    handleCountryChange,
    handleEdit,
    handleDelete,
    addNewHoliday,
  };
}

