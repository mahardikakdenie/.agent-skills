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
import { ClaimService } from "@/services/claim.service";
import Image from "next/image";
import noData from "/public/images/no-data.webp";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft, X } from "react-feather";
import JourneyVerticalImage from "@/components/ui/journey-vertical.image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drewer";

const DetailPolicy = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [claim, setClaim] = useState<any>(null);
  const [tab, setTab] = useState("Summary");
  const [histories, setHistories] = useState<any[]>([]);
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
        setDocuments([
          ...claimDetailResponse.general,
          ...claimDetailResponse.claim,
        ]);
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

  const downloadDocument = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.substring(url.lastIndexOf("/") + 1);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Application Sent":
        return "text-[#7B5D21]";
      case "Proccessing":
        return "text-[#00AB4F]";
      case "Approved":
        return "text-[#00AB4F]";
      case "Payment Processing":
        return "text-[#016DA1]";
      case "Paid":
        return "text-[#016DA1]";
      case "Closed":
        return "text-[#58585B]";
      case "Lack of Documents":
        return "text-[#FD0300]";
      case "Rejected":
        return "text-[#FD0300]";
      default:
        return "text-[#7B5D21]";
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
                        <span className={getStatusColor(h?.data.status)}>
                          {h?.data.status}
                        </span>
                      </p>
                      <p className="text-xs">
                        {h?.created_at
                          ? `${new Date(h.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )} ${new Date(h.created_at).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              }
                            )}`
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
                  <p className="w-32 min-w-28 text-sm font-medium">
                    Claim Number
                  </p>
                  <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                    <p className="hidden md:block md:mr-2 text-sm">:</p>
                    <p className="text-sm">{claim?.number || "-"}</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                  <p className="w-32 min-w-28 text-sm font-medium">
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
                  <p className="w-32 min-w-28 text-sm font-medium">Plan Name</p>
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
                  <p className="w-32 min-w-28 text-sm font-medium">Benefit</p>
                  <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                    <p className="hidden md:block md:mr-2 text-sm">:</p>
                    <p className="text-sm">
                      {claim?.benefit?.description_en || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                  <p className="w-32 min-w-28 text-sm font-medium">Amount</p>
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
                  <p className="w-32 min-w-28 text-sm font-medium">
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
                  <p className="w-32 min-w-28 text-sm font-medium">
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
                  <p className="w-32 min-w-28 text-sm font-medium">Email</p>
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
                  <div className="min-w-60 w-60 mb-3 mr-4">
                    <img
                      src={claim?.general[0]?.value}
                      alt="passport-participant"
                    />
                  </div>
                  <div className="w-full">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                      <p className="w-32 min-w-28 text-sm font-medium">
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
                      <p className="w-32 min-w-28 text-sm font-medium">
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
                      <p className="w-32 min-w-28 text-sm font-medium">
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
                      <p className="w-32 min-w-28 text-sm font-medium">
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
                      <p className="w-32 min-w-28 text-sm font-medium">
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
                      <p className="w-32 min-w-28 text-sm font-medium">
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
                      <p className="w-32 min-w-28 text-sm font-medium">
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
                      <p className="w-32 min-w-28 text-sm font-medium">
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
                      <p className="w-32 min-w-28 text-sm font-medium">
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
                  <p className="w-32 min-w-28 text-sm font-medium">
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
                  <p className="w-32 min-w-28 text-sm font-medium">Alamat</p>
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
                  <p className="w-32 min-w-28 text-sm font-medium">Nama</p>
                  <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                    <p className="hidden md:block md:mr-2 text-sm">:</p>
                    <p className="text-sm">
                      {claim?.bank_info?.account_name || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                  <p className="w-32 min-w-28 text-sm font-medium">Nama Bank</p>
                  <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                    <p className="hidden md:block md:mr-2 text-sm">:</p>
                    <p className="text-sm">{claim?.bank_info?.bank || "-"}</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-3 md:mb-2">
                  <p className="w-32 min-w-28 text-sm font-medium">
                    Cabang Bank
                  </p>
                  <div className="w-full md:w-9/12 flex flex-col md:flex-row md:items-center">
                    <p className="hidden md:block md:mr-2 text-sm">:</p>
                    <p className="text-sm">{claim?.bank_info?.branch || "-"}</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                  <p className="w-32 min-w-28 text-sm font-medium">
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
                  <TableHead className="whitespace-nowrap w-12">No.</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead className="whitespace-nowrap w-36">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length > 0 ? (
                  documents.map((document, index) => (
                    <TableRow key={document.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex gap-2 items-center">
                          {document?.label.en}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Drawer direction="right">
                          <DrawerTrigger className="bg-[#016DA1] text-white px-4 py-2 rounded-full">
                            View
                          </DrawerTrigger>
                          <DrawerContent>
                            <DrawerHeader>
                              <DrawerClose className="absolute right-2 top-2">
                                <Button variant="ghost">
                                  <X />
                                </Button>
                              </DrawerClose>
                              <DrawerTitle className="text-black font-bold text-xl">
                                Original Boarding Pass, Ticket or Itinerary
                              </DrawerTitle>
                              <DrawerDescription>
                                <div className="flex flex-col w-full mt-5 rounded-xl overflow-hidden">
                                  <img
                                    src={claim?.general[0]?.value}
                                    alt="passport-participant"
                                  />
                                </div>
                                <div className="w-full flex items-center justify-center mt-3">
                                  <Button
                                    className="bg-[#016DA1] text-white px-4 py-2 rounded-full"
                                    onClick={() =>
                                      downloadDocument(claim?.general[0]?.value)
                                    }
                                  >
                                    Download
                                  </Button>
                                </div>
                              </DrawerDescription>
                            </DrawerHeader>
                          </DrawerContent>
                        </Drawer>
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
