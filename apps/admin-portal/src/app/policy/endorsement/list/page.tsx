"use client";

import _ from "lodash";
import noData from "@public/images/no-data.webp";
import { Button } from "@repo/ui";
import { useRouter } from "next/navigation";
import { Download, Upload } from "react-feather";
import AppURL from "@/constants/app-url.const";
import useEndorsements from "@/hooks/useEndorsements.hooks";
import { createEndorsementTableColumns } from "@/components/tableConfig/endorsementTableConfig";
import { DataTable } from "@/components/ui/DataTable";

export default function EndorsementPage() {
  const router = useRouter();

  const {
    endorsements,
    totalPages,
    totalItems,
    totalData,

    page,
    rowsPerPage,
    tab,

    isLoading,
    isFetching,

    setPage,
    handleSearch,
    handleRowsPerPageChange,
    selectTab,
  } = useEndorsements();

  const goToDetail = (endorsementId: string) => {
    router.push(`${AppURL.endorsementDetail}/${endorsementId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-[#CC9B36]";
      case "Approved":
        return "text-[#00AB4F]";
      case "Rejected":
        return "text-[#939597]";
      default:
        return "text-[#CC9B36]";
    }
  };

  const endorsementTableColumns = createEndorsementTableColumns({
    page,
    rowsPerPage,
    onGoToDetail: goToDetail,
    getStatusColor,
  });

  return (
    <div className="flex flex-col w-full p-4 md:p-6 ">
      <div className="flex gap-4 pb-4 items-center">
        <h1 className="text-black font-bold text-2xl mt-2">Endorsement List</h1>
        <Button
          onClick={() => router.push(AppURL.endorsementUpload)}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <Upload className="w-5 h-5 mr-1 " /> Upload
        </Button>
        <Button
          onClick={() => router.push(AppURL.endorsementExport)}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
        >
          <Download className="w-5 h-5 mr-1 " /> Download
        </Button>
      </div>

      <div className="block bg-white rounded-md mb-3">
        <div className="w-full flex items-center overflow-auto">
          <div
            onClick={() => selectTab("All")}
            className={`cursor-pointer h-full min-h-16 flex items-center justify-center px-5 ${
              tab === "All" && "border-b-[3px] border-primary px-5"
            }`}
          >
            <button
              className={`text-sm mr-3 h-16 ${tab === "All" && "text-primary"}`}
            >
              All Endorsement
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
                totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
              } ${tab !== "All" && "hidden"}`}
            >
              {totalData}{" "}
              <span
                className={`${totalData < 100 && "hidden"}`}
                style={{ fontSize: "10px" }}
              ></span>
            </span>
          </div>
          <div
            onClick={() => selectTab("Pending")}
            className={`cursor-pointer h-full min-h-16 flex items-center justify-center px-5 ${
              tab === "Pending" && "border-b-[3px] border-primary px-5"
            }`}
          >
            <button
              className={`text-sm mr-3 h-16 ${
                tab === "Pending" && "text-primary"
              }`}
            >
              Waiting
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
                totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
              } ${tab !== "Pending" && "hidden"}`}
            >
              {totalData}{" "}
              <span
                className={`${totalData < 100 && "hidden"}`}
                style={{ fontSize: "10px" }}
              ></span>
            </span>
          </div>
          <div
            onClick={() => selectTab("Approved")}
            className={`cursor-pointer h-full min-h-16 flex items-center justify-center px-5 ${
              tab === "Approved" && "border-b-[3px] border-primary px-5"
            }`}
          >
            <button
              className={`text-sm mr-3 h-16 ${
                tab === "Approved" && "text-primary"
              }`}
            >
              Approved
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
                totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
              } ${tab !== "Approved" && "hidden"}`}
            >
              {totalData}{" "}
              <span
                className={`${totalData < 100 && "hidden"}`}
                style={{ fontSize: "10px" }}
              ></span>
            </span>
          </div>
          <div
            onClick={() => selectTab("Rejected")}
            className={`cursor-pointer h-full min-h-16 flex items-center justify-center px-5 ${
              tab === "Rejected" && "border-b-[3px] border-primary px-5"
            }`}
          >
            <button
              className={`text-sm mr-3 h-16 ${
                tab === "Rejected" && "text-primary"
              }`}
            >
              Reject
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
                totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
              } ${tab !== "Rejected" && "hidden"}`}
            >
              {totalData}{" "}
              <span
                className={`${totalData < 100 && "hidden"}`}
                style={{ fontSize: "10px" }}
              ></span>
            </span>
          </div>
        </div>
      </div>

      <DataTable
        loading={isLoading || isFetching}
        data={endorsements}
        columns={endorsementTableColumns}
        search={{
          placeholder: "Search by Insured Name",
          onSearch: handleSearch,
        }}
        pagination={{
          page,
          totalPages,
          rowsPerPage,
          totalItems,
          onPageChange: setPage,
          onRowsPerPageChange: handleRowsPerPageChange,
        }}
        noDataImage={noData}
        noDataText="No endorsement data available"
        className="table-endorsements"
      />
    </div>
  );
}
