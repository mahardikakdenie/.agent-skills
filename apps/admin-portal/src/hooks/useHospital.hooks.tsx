import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import _ from "lodash";
import { useReferenceHospitals } from "@/services/product/hooks/queries";

export function useHospital() {
  const router = useRouter();
  const { permissionList } = useAuth();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchData, setSearchData] = useState("");
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canCreate, setCanCreate] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Masterdata.Read");
      const createBtn = permissionList.includes("Masterdata.Create");

      setHasAccess(access);
      setCanCreate(createBtn);

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList]);

  const { data: hospitalsResponse, isLoading: isLoadingHospitals } =
    useReferenceHospitals(
      {
        name: searchData,
        page,
        pageSize: rowsPerPage,
      },
      {
        enabled: hasAccess === true,
        staleTime: 300000,
        refetchOnWindowFocus: false,
      }
    );

  const handleSearch = useCallback(
    _.debounce((keyword: string) => {
      setSearchData(keyword);
      setPage(1);
    }, 300),
    []
  );

  const handleRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const goToUpload = useCallback(() => {
    router.push(AppURL.masterdataHospitalUpload);
  }, [router]);

  const hospitalsData: any = hospitalsResponse;

  return {
    hospitals: hospitalsData?.data || [],
    totalPages: hospitalsData?.meta?.pageTotal || 1,
    totalItems: hospitalsData?.meta?.total || 0,
    page,
    rowsPerPage,
    searchData,
    hasAccess,
    canCreate,
    isLoading: isLoadingHospitals || hasAccess === null,
    setPage,
    handleSearch,
    handleRowsPerPageChange,
    goToUpload,
  };
}
