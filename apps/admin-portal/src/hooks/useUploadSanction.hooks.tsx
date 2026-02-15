import React, { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import Papa from "papaparse";
import AppURL from "@/constants/app-url.const";
import { useCountries } from "@/services/country/hooks/queries";
import { useInsurances } from "@/services/product/hooks/queries";
import { useCreateBlacklist } from "@/services/sanction/hooks/mutations";
import { useSources } from "@/services/sanction/hooks/queries";

interface CountryAPI {
  id: string;
  name: string;
}

interface Insurance {
  id: string;
  name: string;
}

interface Source {
  id: string;
  source_name: string;
  source_type: string;
  source_url: string;
  insurance_id: string;
}

interface ParsedRowData {
  first_name: string;
  middle_name: string;
  last_name: string;
  country: string;
  id_number: string;
  phone_number: string;
  email: string;
  source_type: string;
  source_name: string;
  insurance: string;
  blacklist_date: string;
  blacklist_reason: string;
  insurance_id: string;
  source_id: string;
}

interface UseUploadSanctionProps {
  sources: Source[];
  insurances: Insurance[];
  countries: CountryAPI[];
  csvData: ParsedRowData[];

  hasAccess: boolean | null;
  showAlert: boolean;
  errorMessage: string | null;
  fileName: string | null;
  isDragging: boolean;

  isLoadingSources: boolean;
  isLoadingInsurances: boolean;
  isLoadingCountries: boolean;
  isUploading: boolean;

  fileInputRef: React.RefObject<HTMLInputElement>;

  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => void;
  handleUpload: (e: React.FormEvent) => Promise<void>;
  setShowAlert: (show: boolean) => void;
  goBack: () => void;
}

export function useUploadSanction(): UseUploadSanctionProps {
  const router = useRouter();
  const { permissionList } = useAuth();

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [csvData, setCsvData] = useState<ParsedRowData[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Sanction.Create");
      setHasAccess(access);

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList]);

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
  const sourcesData = (sourcesResponse as any)?.data || [];

  const { data: insurancesResponse, isLoading: isLoadingInsurances } =
    useInsurances(undefined, {
      staleTime: 30000,
      refetchOnWindowFocus: false,
    });
  const insurancesData = (insurancesResponse as any)?.data || [];

  const { data: countriesResponse, isLoading: isLoadingCountries } =
    useCountries({
      staleTime: 30000,
      refetchOnWindowFocus: false,
    });
  const countriesData = (countriesResponse as any)?.data || [];

  const createBlacklistMutation = useCreateBlacklist({
    onError: (error) => {
      console.error("Failed to upload sanctions:", error);
      setErrorMessage("Failed to create sanction. Please try again.");
      setShowAlert(true);
      setIsUploading(false);
    },
  });

  const handleFileParse = useCallback(
    (file: File) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const insuranceMap = new Map(
            (insurancesData || []).map((insurance: Insurance) => [
              insurance.name.toLowerCase(),
              insurance.id,
            ])
          );
          const sourceMap = new Map(
            (sourcesData || []).map((src: Source) => [
              src.source_name.toLowerCase(),
              src.id,
            ])
          );

          const data = result.data.map((row: any) => {
            const parsedRow: ParsedRowData = {
              first_name: row.first_name || "",
              middle_name: row.middle_name || "",
              last_name: row.last_name || "",
              country: row.country || "",
              id_number: row.id_number || "",
              phone_number: row.phone_number || "",
              email: row.email || "",
              source_type: row.source_type || "",
              source_name: row.source_name || "",
              insurance: row.insurance || "",
              blacklist_date: row.blacklist_date || "",
              blacklist_reason: row.blacklist_reason || "",
              insurance_id: "",
              source_id: "",
            };

            if (parsedRow.blacklist_date) {
              const date = new Date(parsedRow.blacklist_date);
              if (!isNaN(date.getTime())) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                parsedRow.blacklist_date = `${year}-${month}-${day}`;
              }
            }

            if (parsedRow.source_type === "insurance" && parsedRow.insurance) {
              const insuranceId = insuranceMap.get(
                parsedRow.insurance.toLowerCase()
              );
              if (insuranceId) {
                parsedRow.insurance_id = insuranceId as string;
              }
            }

            if (parsedRow.source_name) {
              const sourceId = sourceMap.get(
                parsedRow.source_name.toLowerCase()
              );
              if (sourceId) {
                parsedRow.source_id = sourceId as string;
              }
            }

            return parsedRow;
          });

          setCsvData(data);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          setErrorMessage("Failed to parse CSV file.");
          setShowAlert(true);
        },
      });
    },
    [insurancesData, sourcesData]
  );

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type === "text/csv") {
        setFileName(file.name);
        handleFileParse(file);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setErrorMessage("Please upload a valid CSV file.");
        setShowAlert(true);
      }
    },
    [handleFileParse]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type === "text/csv") {
        setFileName(file.name);
        handleFileParse(file);
      } else {
        setErrorMessage("Please upload a valid CSV file.");
        setShowAlert(true);
      }
    },
    [handleFileParse]
  );

  const handleUpload = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMessage(null);
      setShowAlert(false);

      if (csvData.length === 0) {
        setErrorMessage("Failed to create sanction: CSV file is empty.");
        setShowAlert(true);
        return;
      }

      const requiredFields = [
        "first_name",
        "id_number",
        "phone_number",
        "email",
        "blacklist_date",
        "blacklist_reason",
      ];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      const isDataValid = csvData.every((row: ParsedRowData) => {
        const isSourceValid = new Set(
          (sourcesData || []).map((s: Source) => s.source_name.toLowerCase())
        );

        return (
          requiredFields.every(
            (field) =>
              row[field as keyof ParsedRowData] != null &&
              row[field as keyof ParsedRowData] !== ""
          ) &&
          emailRegex.test(row.email) &&
          dateRegex.test(row.blacklist_date) &&
          isSourceValid.has(row.source_name.toLowerCase())
        );
      });

      if (!isDataValid) {
        setErrorMessage("Invalid data in the CSV document file.");
        setShowAlert(true);
        return;
      }

      try {
        setIsUploading(true);
        const sources = sourcesData || [];

        await Promise.all(
          csvData.map(async (row) => {
            const sanctionData = {
              id_number: row.id_number.toString(),
              first_name: row.first_name,
              middle_name: row.middle_name || null,
              last_name: row.last_name || null,
              phone_number: row.phone_number.toString(),
              email: row.email,
              blacklist_reason: row.blacklist_reason,
              source_id: row.source_name
                ? sources.find(
                    (s: Source) =>
                      s.source_name.toLowerCase() ===
                      row.source_name.toLowerCase()
                  )?.id
                : null,
              country: "IDN",
              id_type: "KTP",
              created_at: new Date().toISOString(),
              date_blacklisted: row.blacklist_date,
            };

            await createBlacklistMutation.mutateAsync(sanctionData as any);
          })
        );

        setErrorMessage("Sanction Uploaded!");
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
          router.push(AppURL.sanctionList);
        }, 2000);
      } catch (error) {
        console.error("Failed to upload sanctions:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [csvData, sourcesData, createBlacklistMutation, router]
  );

  const goBack = useCallback(() => {
    router.push(AppURL.sanctionList);
  }, [router]);

  return {
    sources: sourcesData || [],
    insurances: insurancesData || [],
    countries: countriesData || [],
    csvData,

    hasAccess,
    showAlert,
    errorMessage,
    fileName,
    isDragging,

    isLoadingSources,
    isLoadingInsurances,
    isLoadingCountries,
    isUploading: isUploading || createBlacklistMutation.isPending,

    fileInputRef,

    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleUpload,
    setShowAlert,
    goBack,
  };
}
