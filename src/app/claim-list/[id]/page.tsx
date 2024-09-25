"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import WithSidebar from "@/hoc/with-sidebar";
import {
  ClaimHistory,
  ClaimService,
  ListClaimHistoryResponse,
  ListClaimRequest,
} from "@/services/claim.service";
import Image from "next/image";
import noData from "/public/images/no-data.webp";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import JourneyVerticalImage from "@/components/ui/journey-vertical.image";
import qs from "qs";
import { AxiosResponse } from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const DetailPolicy = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [claim, setClaim] = useState<any>(null);
  const [tab, setTab] = useState("Summary");
  const [histories, setHistories] = useState<any[]>([]);
  const [passportLink, setPassportLink] = useState("");
  const [claimHistories, setClaimHistories] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);

  const personalInfo = [
    claim?.personal_info?.address,
    claim?.personal_info?.address2,
    claim?.personal_info?.subdistrict,
    claim?.personal_info?.district,
    claim?.personal_info?.city,
    claim?.personal_info?.state,
  ];

  useEffect(() => {
    const fetchClaimData = async (id: string) => {
      const claimService = new ClaimService();
      try {
        const claimDetailResponse = await claimService.getClaimsDetail(id);
        setClaim(claimDetailResponse);

        const claimHistoriesResponse = await claimService.getClaimsHistories(
          id
        );
        if (claimHistoriesResponse && claimHistoriesResponse.data) {
          setHistories(claimHistoriesResponse.data);
        }
      } catch (error) {
        console.error("Error fetching claim data:", error);
      }
    };

    if (params.id) {
      fetchClaimData(params.id as string);
    }
  }, [params.id]);

  if (!claim) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        Loading...
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Declaration":
        return "text-[#016DA1]";
      case "Grace Period":
        return "text-orange-500";
      case "Expired":
        return "text-gray-400";
      default:
        return "text-[#016DA1]";
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="bg-white md:px-6 p-4 flex items-center">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Policy</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/policy-list">List</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Detail</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-black font-bold text-2xl mt-2">Detail Policy</h2>
        </div>
        <div
          onClick={() => router.back()}
          className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali
        </div>
      </div>
      <div className="flex flex-col w-full p-4 md:p-6 gap-4">
        <div className="flex items-center justify-start h-16 bg-white rounded-md mb-3 shadow">
          <div
            onClick={() => setTab("Summary")}
            style={{ width: "calc(100% / 2)" }}
            className={`cursor-pointer h-full flex items-center justify-center mr-5 ${
              tab === "Summary" && "border-b-[3px] border-primary"
            }`}
          >
            <p
              className={`text-sm mr-3 ${
                tab === "Summary" && "font-semibold text-primary"
              }`}
            >
              Summary
            </p>
          </div>
          <div
            onClick={() => setTab("Documents")}
            style={{ width: "calc(100% / 2)" }}
            className={`cursor-pointer h-full flex items-center justify-center ${
              tab === "Documents" && "border-b-[3px] border-primary"
            }`}
          >
            <p
              className={`text-sm mr-3 ${
                tab === "Documents" && "font-semibold text-primary"
              }`}
            >
              Documents
            </p>
          </div>
        </div>

        {tab === "Summary" && (
          <div className="md:flex">
            <div className="md:w-1/3 bg-white rounded-md py-5 px-7 mb-3 md:mb-0 md:mr-3 h-fit max-h-full overflow-y-auto ">
              <p className="font-semibold mb-3">Status Claim</p>
              {histories && histories.length > 0 ? (
                histories.map((h, historyIndex) => (
                  <div
                    key={`history-${historyIndex}`}
                    className="flex items-center"
                  >
                    {JourneyVerticalImage(
                      historyIndex !== 0 ? "#C4C4C4" : undefined
                    )}
                    <div className="ml-5">
                      <p className="text-sm font-semibold">
                        {h?.name || "No Name"}
                      </p>
                      <p className="text-xs">
                        {h?.created_at
                          ? new Date(h.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "No Date"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm">No claim histories available</p>
              )}
            </div>
            <div className="md:w-2/3">
              <div className="bg-white rounded-md mb-3 py-5 px-7">
                <p className="font-semibold mb-3">Detail Claim</p>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                  <p className="w-full text-sm md:w-3/12 font-medium">
                    Claim Number
                  </p>
                  <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                    <p className="hidden md:block md:mr-2 text-sm">:</p>
                    <p className="text-sm">{claim?.number || "-"}</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                  <p className="w-full text-sm md:w-3/12 font-medium">
                    Customer Name
                  </p>
                  <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                    <p className="hidden md:block md:mr-2 text-sm">:</p>
                    <p className="text-sm">
                      {claim?.policy_data?.account?.name || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                  <p className="w-full text-sm md:w-3/12 font-medium">
                    Plan Name
                  </p>
                  <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                    <p className="hidden md:block md:mr-2 text-sm">:</p>
                    <p className="text-sm">
                      {claim.policy_data?.declarations?.transaction_data?.insurance?.plan?.name
                        .split("|")
                        .join(" - ")}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                  <p className="w-full text-sm md:w-3/12 font-medium">
                    Benefit
                  </p>
                  <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                    <p className="hidden md:block md:mr-2 text-sm">:</p>
                    <p className="text-sm">
                      {claim?.benefit?.description_en || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                  <p className="w-full text-sm md:w-3/12 font-medium">Amount</p>
                  <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                    <p className="hidden md:block md:mr-2 text-sm">:</p>
                    <p className="text-sm">
                      {claim.claim.find(
                        (d: any) => d.type === "Number" && d.name === "claim"
                      ).value || "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-md mb-3 py-5 px-7">
                <p className="font-semibold mb-3">Informasi Pemegang Polis</p>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                  <p className="w-full text-sm md:w-3/12 font-medium">
                    Customer Name
                  </p>
                  <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                    <p className="hidden md:block md:mr-2 text-sm">:</p>
                    <p className="text-sm">
                      {claim?.policy_data?.account?.name || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                  <p className="w-full text-sm md:w-3/12 font-medium">
                    Phone Number
                  </p>
                  <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                    <p className="hidden md:block md:mr-2 text-sm">:</p>
                    <p className="text-sm">
                      {claim?.policy_data?.account?.phone || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                  <p className="w-full text-sm md:w-3/12 font-medium">Email</p>
                  <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                    <p className="hidden md:block md:mr-2 text-sm">:</p>
                    <p className="text-sm">
                      {claim?.policy_data?.account?.email || "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-md mb-3 py-5 px-7">
                <p className="font-semibold mb-3">Informasi Tertanggung</p>
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 mb-3 md:mr-2">
                    <img
                      src={claim?.general[0]?.value}
                      alt="passport-participant"
                    />
                  </div>
                  <div className="w-full">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                      <p className="w-full text-sm md:w-3/12 font-medium">
                        No. Polis
                      </p>
                      <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                        <p className="hidden md:block md:mr-2 text-sm">:</p>
                        <p className="text-sm">
                          {claim?.policy_data?.number || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                      <p className="w-full text-sm md:w-3/12 font-medium">
                        No. Peserta
                      </p>
                      <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                        <p className="hidden md:block md:mr-2 text-sm">:</p>
                        <p className="text-sm">
                          {claim?.participant_data?.data?.data?.reg_no || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                      <p className="w-full text-sm md:w-3/12 font-medium">
                        Nama Lengkap
                      </p>
                      <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                        <p className="hidden md:block md:mr-2 text-sm">:</p>
                        <p className="text-sm">
                          {claim?.participant_data?.data?.data?.name || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                      <p className="w-full text-sm md:w-3/12 font-medium">
                        Gender
                      </p>
                      <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                        <p className="hidden md:block md:mr-2 text-sm">:</p>
                        <p className="text-sm">
                          {claim?.participant_data?.data?.data?.gender || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                      <p className="w-full text-sm md:w-3/12 font-medium">
                        Kode Negara
                      </p>
                      <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                        <p className="hidden md:block md:mr-2 text-sm">:</p>
                        <p className="text-sm">
                          {claim?.participant_data?.data?.data?.country_code ||
                            "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                      <p className="w-full text-sm md:w-3/12 font-medium">
                        No. Paspor
                      </p>
                      <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                        <p className="hidden md:block md:mr-2 text-sm">:</p>
                        <p className="text-sm">
                          {claim?.participant_data?.data?.data?.passport_no ||
                            "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                      <p className="w-full text-sm md:w-3/12 font-medium">
                        Kewarganegaraan
                      </p>
                      <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                        <p className="hidden md:block md:mr-2 text-sm">:</p>
                        <p className="text-sm">
                          {claim?.participant_data?.data?.data?.nationality ||
                            "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                      <p className="w-full text-sm md:w-3/12 font-medium">
                        Tgl. Lahir
                      </p>
                      <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                        <p className="hidden md:block md:mr-2 text-sm">:</p>
                        <p className="text-sm">
                          {claim?.participant_data?.data?.data?.dob || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                      <p className="w-full text-sm md:w-3/12 font-medium">
                        Tempat Lahir
                      </p>
                      <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                        <p className="hidden md:block md:mr-2 text-sm">:</p>
                        <p className="text-sm">
                          {claim?.participant_data?.data?.data?.pob || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-md mb-3 py-5 px-7">
                <p className="font-semibold mb-3">Informasi Pribadi</p>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                  <p className="w-full text-sm md:w-3/12 font-medium">
                    Nomor Handpone
                  </p>
                  <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                    <p className="hidden md:block md:mr-2 text-sm">:</p>
                    <p className="text-sm">
                      {claim?.personal_info?.phone || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                  <p className="w-full text-sm md:w-3/12 font-medium">Alamat</p>
                  <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                    <p className="hidden md:block md:mr-2 text-sm">:</p>
                    <p className="text-sm">
                      {personalInfo.filter(Boolean).join(" ") || "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-md py-5 px-7">
                <p className="font-semibold mb-3">Informasi Rekening</p>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                  <p className="w-full text-sm md:w-3/12 font-medium">Nama</p>
                  <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                    <p className="hidden md:block md:mr-2 text-sm">:</p>
                    <p className="text-sm">
                      {claim?.bank_info?.account_name || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                  <p className="w-full text-sm md:w-3/12 font-medium">
                    Nama Bank
                  </p>
                  <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                    <p className="hidden md:block md:mr-2 text-sm">:</p>
                    <p className="text-sm">{claim?.bank_info?.bank || "-"}</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                  <p className="w-full text-sm md:w-3/12 font-medium">
                    Cabang Bank
                  </p>
                  <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                    <p className="hidden md:block md:mr-2 text-sm">:</p>
                    <p className="text-sm">{claim?.bank_info?.branch || "-"}</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                  <p className="w-full text-sm md:w-3/12 font-medium">
                    No. Rekening
                  </p>
                  <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                    <p className="hidden md:block md:mr-2 text-sm">:</p>
                    <p className="text-sm">
                      {claim?.bank_info?.account_number || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === "Documents" && (
          <div className="w-full p-4 md:p-6 bg-white rounded-lg">
            <Table className="table-claims">
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">No.</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead className="whitespace-nowrap">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length > 0 ? (
                  documents.map((document, index) => (
                    <TableRow key={document.id}>
                      <TableCell>1</TableCell>
                      {/* <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell> */}
                      <TableCell>
                        <div className="flex gap-2 items-center">
                          {document.number}
                        </div>
                      </TableCell>
                      <TableCell>
                        {/* <Button
                        onClick={() => goToDetail(document.id)}
                        className="rounded-full"
                      >
                        View
                      </Button> */}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="hover:!bg-white">
                    <TableCell colSpan={9}>
                      <div className="flex flex-col gap-4 items-center justify-center py-14">
                        <Image alt="no data" src={noData} width={200} /> No
                        transaction data available
                      </div>
                    </TableCell>{" "}
                  </TableRow>
                )}
              </TableBody>
              {/* <TableFooter>
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="flex justify-center items-center gap-2 font-normal">
                    <label htmlFor="rowsPerPage">Showing:</label>
                    <select
                      id="rowsPerPage"
                      value={rowsPerPage}
                      onChange={handleRowsPerPageChange}
                      className="p-2 border rounded"
                    >
                      {[10, 20, 30, 50, 100].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <span className="mr-2">of {totalItems} items</span>
                    <button
                      onClick={() => setPage((prevState) => prevState - 1)}
                      disabled={page === 1}
                      title="Prev"
                    >
                      <ChevronLeft />
                    </button>
                    <button
                      onClick={() => setPage((prevState) => prevState + 1)}
                      disabled={page === totalPages}
                      title="Next"
                    >
                      <ChevronRight />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter> */}
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailPolicyWithSidebar = (params: any) =>
  WithSidebar(DetailPolicy)(params);
export default DetailPolicyWithSidebar;
