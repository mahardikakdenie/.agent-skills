"use client";

import { Upload } from "react-feather";
import { Button } from "@repo/ui";
import { DataTable } from "@/components/ui/DataTable";
import { useHospital } from "@/hooks/useHospital.hooks";
import { createHospitalTableColumns } from "@/components/tableConfig/hospitalTableConfig";
import { ContentLoadingWrapper } from "@/components/ui/Loading/index";

export default function HospitalListPage() {
  const {
    hospitals,
    totalPages,
    totalItems,
    page,
    rowsPerPage,
    hasAccess,
    canCreate,
    isLoading,
    setPage,
    handleSearch,
    handleRowsPerPageChange,
    goToUpload,
  } = useHospital();

  const columns = createHospitalTableColumns({
    page,
    rowsPerPage,
  });

  return (
    <ContentLoadingWrapper isLoading={isLoading}>
      <div className="flex flex-col w-full p-4 md:p-6">
        <div className="flex gap-4 pb-4 items-center">
          <h1 className="text-black font-bold text-2xl mt-2">Hospital</h1>
          <Button
            onClick={goToUpload}
            disabled={!canCreate}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
          >
            <Upload className="w-5 h-5 mr-1" /> Upload
          </Button>
        </div>

        <DataTable
          search={{
            onSearch: handleSearch,
            placeholder: "Search by provider name...",
          }}
          columns={columns}
          data={hospitals}
          pagination={{
            page,
            totalPages,
            totalItems,
            rowsPerPage,
            onPageChange: setPage,
            onRowsPerPageChange(e) {
              handleRowsPerPageChange(e);
            },
          }}
          noDataText="No hospital list data available"
        />
      </div>
    </ContentLoadingWrapper>
  );
}