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
import noImage from "/public/images/no-image.png";
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
import { hasPermission } from "@/context/auth.context";
import { formatMoneyClaim } from "@/lib/formatter";

const DetailClaim = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const access = await hasPermission("Claim.Read");
      setHasAccess(access);
      if (!access) {
        router.push("/forbidden");
      }
    };

    checkAccess();
  }, [router]);
  const [claim, setClaim] = useState<any>(null);
  const [tab, setTab] = useState("Summary");
  const [histories, setHistories] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const imageUrl = claim?.policy_data[0]?.value || noImage.src;

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
      case "Draft":
        return "text-gray-400 font-normal";
      case "Submitted":
        return "text-[#7B5D21]";
      case "Proccessing":
        return "text-[#00AB4F]";
      case "Approved":
        return "text-[#00AB4F]";
      case "Document Review":
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
          <Breadcrumb className="sm:block hidden">
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
          <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
            Detail Claim
          </h2>
        </div>
        <div
          onClick={() => router.back()}
          className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
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
          <div className="sm:flex gap-4">
            <div className="sm:w-1/3 bg-white rounded-md sm:p-6 p-4 mb-4 md:mb-0 h-fit max-h-full overflow-y-auto ">
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
                        <span className={getStatusColor(h?.status)}>
                          {h?.status}
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
            <div className="sm:w-2/3">
              <div className="bg-white flex flex-col gap-3 rounded-md mb-4 sm:p-6 p-4">
                <p className="font-semibold">Detail Claim</p>
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    Claim Number
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{claim?.number || "-"}</div>
                </div>
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    Customer Name
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{claim?.policy_data?.policy_holder?.name || "-"}</div>
                </div>
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    Plan Name
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{claim?.package?.plan?.name.split("|").join(" - ")}</div>
                </div>
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    Benefit
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{claim?.benefit?.description_en || "-"}</div>
                </div>
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    Requested Amount
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>
                    {(() => {
                      const claimValue = claim.claim?.find(
                        (d: any) => d.type === "Number" && d.name === "claim"
                      )?.value;

                      const numericValue = Number(claimValue);

                      return !isNaN(numericValue)
                        ? formatMoneyClaim(numericValue)
                        : "-";
                    })()}
                  </div>
                </div>
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    Approved Amount
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>
                    {formatMoneyClaim(
                      claim.amount_approved != null ? claim.amount_approved : 0
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-white flex flex-col gap-3 rounded-md mb-4 sm:p-6 p-4">
                <p className="font-semibold">Informasi Pemegang Polis</p>
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    Customer Name
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{claim?.participant_data?.data?.name || "-"}</div>
                </div>
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    Phone Number
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{claim?.participant_data?.data?.phone || "-"}</div>
                </div>
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Email</div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{claim?.participant_data?.data?.email || "-"}</div>
                </div>
              </div>
              <div className="bg-white flex flex-col gap-3 rounded-md mb-4 sm:p-6 p-4">
                <p className="font-semibold">Informasi Tertanggung</p>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="lg:min-w-60 lg:w-60">
                    <div className="w-full border rounded-lg overflow-hidden">
                      <img src={imageUrl} alt="" className="w-full h-auto" />
                    </div>
                  </div>
                  <div className="w-full flex gap-3 flex-col">
                    <div className="flex gap-2 text-sm font-medium">
                      <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                        No. Polis
                      </div>
                      <div className="max-w-1 w-1">:</div>
                      <div>{claim?.policy_data?.number || "-"}</div>
                    </div>
                    <div className="flex gap-2 text-sm font-medium">
                      <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                        No. Peserta
                      </div>
                      <div className="max-w-1 w-1">:</div>
                      <div>{claim?.participant_data?.number || "-"}</div>
                    </div>
                    <div className="flex gap-2 text-sm font-medium">
                      <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                        Nama Lengkap
                      </div>
                      <div className="max-w-1 w-1">:</div>
                      <div>
                        {claim?.participant_data?.data?.data?.name ||
                          claim?.participant_data?.data?.name ||
                          "-"}
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm font-medium">
                      <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                        Gender
                      </div>
                      <div className="max-w-1 w-1">:</div>
                      <div>{claim?.participant_data?.data?.gender || "-"}</div>
                    </div>
                    <div className="flex gap-2 text-sm font-medium">
                      <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                        Kode Negara
                      </div>
                      <div className="max-w-1 w-1">:</div>
                      <div>
                        {claim?.participant_data?.data?.country_code || "-"}
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm font-medium">
                      <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                        {claim?.participant_data?.data?.data?.passport_no
                          ? "No. Passport"
                          : claim?.participant_data?.data?.passport_no
                          ? "No. Passport"
                          : claim?.participant_data?.data?.nik
                          ? "NIK"
                          : claim?.participant_data?.data?.identification_number
                          ? "No. Identitas"
                          : ""}
                      </div>
                      <div className="max-w-1 w-1">:</div>
                      <div>
                        {claim?.participant_data?.data?.data?.passport_no ||
                          claim?.participant_data?.data?.passport_no ||
                          claim?.participant_data?.data?.nik ||
                          "-"}
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm font-medium">
                      <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                        Kewarganegaraan
                      </div>
                      <div className="max-w-1 w-1">:</div>
                      <div>
                        {claim?.participant_data?.data?.data?.nationality ||
                          claim?.participant_data?.data?.nationality ||
                          "-"}
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm font-medium">
                      <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                        Tgl. Lahir
                      </div>
                      <div className="max-w-1 w-1">:</div>
                      <div>
                        {claim?.participant_data?.data?.data?.dob ||
                          claim?.participant_data?.data?.dob ||
                          "-"}
                      </div>
                    </div>
                    <div className="flex gap-2 text-sm font-medium">
                      <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                        Tempat Lahir
                      </div>
                      <div className="max-w-1 w-1">:</div>
                      <div>{claim?.participant_data?.data?.pob || "-"}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-md flex flex-col gap-3 p-4 sm:p-6">
                <p className="font-semibold">Informasi Pribadi</p>
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    Nomor Handpone
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{claim?.personal_info?.phone || "-"}</div>
                </div>
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    Alamat
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{personalInfo.filter(Boolean).join(" ") || "-"}</div>
                </div>
              </div>
              <div className="bg-white rounded-md flex flex-col gap-3 p-4 sm:p-6">
                <p className="font-semibold">Informasi Rekening</p>
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Nama</div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{claim?.bank_info?.account_name || "-"}</div>
                </div>
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    Nama Bank
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{claim?.bank_info?.bank?.name || "-"}</div>
                </div>
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    Cabang Bank
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{claim?.bank_info?.branch || "-"}</div>
                </div>
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    No. Rekening
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{claim?.bank_info?.account_number || "-"}</div>
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
                  <TableHead className="whitespace-nowrap w-10">No.</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead className="whitespace-nowrap w-28">
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

const DetailClaimWithSidebar = (params: any) =>
  WithSidebar(DetailClaim)(params);
export default DetailClaimWithSidebar;
