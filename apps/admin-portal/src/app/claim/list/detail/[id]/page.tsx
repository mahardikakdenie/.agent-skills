"use client";
import moment from "moment";
import Image from "next/image";
import noData from "@public/images/no-data.webp";
import noImage from "@public/images/no-image.png";
import JourneyVerticalImage from "@/components/ui/journey-vertical.image";
import { useState, useEffect } from "react";
import { X } from "react-feather";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth.context";
import { useParams, useRouter } from "next/navigation";
import { formatMoney, formatMoneyClaim } from "@/lib/formatter";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui";
import { DataTable, Column } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { claimHasValue } from "@/lib/utils";
import { useDetailClaim } from "@/hooks/useDetailClaim.hooks";
import { ContentLoadingWrapper } from "@/components/ui/Loading/index";
import { useClaimHistories } from "@/services/claims/hooks/queries";
import AppURL from "@/constants/app-url.const";

interface FieldType {
  name: string;
  type: string;
  label?: string;
  criteria?: string;
  required?: boolean;
  definition?: string;
  insured_type?: string;
  document_type?: string;
  label_multilanguage?: {
    en?: string;
    id?: string;
  };
  pending_reason_message?: {
    en?: string;
    id?: string;
  };
}

const DetailClaim = () => {
  const router = useRouter();
  const params = useParams();
  const claimId = Array.isArray(params.id) ? params.id[0] : (params.id as string | undefined);
  const { permissionList } = useAuth();

  const { detailClaim, getDetailClaim, getMissingDocuments, isLoading } =
    useDetailClaim();
  const { data: claimHistoriesResponse } = useClaimHistories(
    claimId ? { claim: claimId } : undefined,
    { enabled: !!claimId }
  );
  const histories = (claimHistoriesResponse as any)?.data || [];

  useEffect(() => {
    if (claimId) {
      getDetailClaim(claimId);
    }
  }, [claimId, getDetailClaim]);

  const [tab, setTab] = useState("Summary");
  const [claim, setClaim] = useState<any>(null);
  const [docToOpen, setDocToOpen] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isViewDocument, setIsViewDocument] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [policyVisibility, setPolicyVisibility] = useState({
    name: true,
    email: true,
    phone: true,
  });
  const [danaInfoVisibility, setDanaInfoVisibility] = useState(true);
  const [integrationInfoVisibility, setIntegrationInfoVisibility] = useState(true);

  const imageUrl =
    claim?.participant_data?.data?.ktp ||
    claim?.participant_data?.data?.passport ||
    noImage.src;

  const personalInfo = [
    claim?.personal_info?.address,
    claim?.personal_info?.address2,
    claim?.personal_info?.subdistrict,
    claim?.personal_info?.district,
    claim?.personal_info?.city,
    claim?.personal_info?.state,
  ];

  const createDetailDocumentTableColumns = ({
    onViewDocument,
  }: {
    onViewDocument: (document: any) => void;
  }): Column<any>[] => [
    {
      key: "index",
      header: "No.",
      className: "w-10",
      render: (_, index) => index + 1,
    },
    {
      key: "file_name",
      header: "File Name",
      render: (document) => (
        <div className="flex gap-2 items-center">
          {document?.label?.en || document?.label || "-"}{" "}
          {document?.insured_type &&
            " - " +
              document?.insured_type.charAt(0).toUpperCase() +
              document?.insured_type.slice(1)}
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
    },
    {
      key: "status",
      header: "Status",
      render: (document) =>
        claimHasValue(document) ? (
          <p className="font-medium text-sm">Completed</p>
        ) : (
          <p className="text-red-500 font-medium text-sm">Pending</p>
        ),
    },
    {
      key: "action",
      header: "Action",
      className: "w-28",
      render: (document) => (
        <Dialog>
          <DialogTrigger
            className="bg-[#016DA1] text-white px-4 py-2 rounded-full"
            onClick={() => onViewDocument(document)}
          >
            View
          </DialogTrigger>
          {isViewDocument && (
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-sm sm:text-base flex items-center">
                  {document?.label?.en || document?.label || "-"}
                  <DialogClose className="ml-auto" asChild>
                    <Button
                      type="button"
                      className="bg-transparent hover:bg-transparent text-black p-0"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </DialogClose>
                </DialogTitle>
              </DialogHeader>

              <div className="overflow-auto max-h-[80vh]">
                {docToOpen.type.toLowerCase() === "fields"
                  ? docToOpen.fields.map((field: FieldType, index: number) => (
                      <div key={index}>
                        <div
                          className="text-sm sm:text-base font-semibold"
                          key={field.name}
                        >
                          {field?.label_multilanguage?.en ||
                            field?.label ||
                            "-"}{" "}
                        </div>
                        {renderDocumentsDetails(field)}
                      </div>
                    ))
                  : renderDocumentsDetails(docToOpen)}
              </div>
            </DialogContent>
          )}
        </Dialog>
      ),
    },
  ];

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Claim.Read");
      const isHidePolicyEmail = permissionList.includes(
        "Claim.View.Policy.HideEmail",
      );
      const isHidePolicyPhone = permissionList.includes(
        "Claim.View.Policy.HidePhone",
      );
      const isShowDanaInfo = permissionList.includes("Claim.View.ShowDanaInfo");
      const isShowIntegrationInfo = permissionList.includes("Claim.View.ShowIntegrationInfo");
      setHasAccess(access);
      setPolicyVisibility({
        name: true,
        email: !isHidePolicyEmail,
        phone: !isHidePolicyPhone,
      });
      setDanaInfoVisibility(isShowDanaInfo);
      setIntegrationInfoVisibility(isShowIntegrationInfo);
      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router]);

  useEffect(() => {
    if (detailClaim) {
      setClaim(detailClaim);
      setDocuments([
        ...detailClaim.general,
        ...detailClaim.claim,
        ...detailClaim.claim_config,
      ]);
    }
  }, [detailClaim]);

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

  const processUrl = (url: string, id: string) => {
    const urlArr = url.split(".") || "";
    const mimeType =
      urlArr[urlArr.length - 1].toLowerCase() !== "pdf"
        ? `image/${urlArr[urlArr.length - 1].toLowerCase()}`
        : "application/pdf";
  };

  const viewDocument = (documentObject: any) => {
    if (documentObject.type.toLowerCase() === "file" && documentObject.value)
      processUrl(documentObject.value, "pdfFrame");
    setDocToOpen(documentObject);
    setIsViewDocument(true);
  };

  const renderDocumentsDetails = (documentObject: any) => {
    const documentType = documentObject.type.toLowerCase();

    const isPreviewableImage = (url: string) => {
      const extension = url?.split(".").at(-1)?.toLowerCase();
      return ["jpg", "jpeg", "png"].includes(extension || "");
    };
    if (documentType === "file") {
      const canPreview =
        documentObject?.value && isPreviewableImage(documentObject.value);

      return (
        <div>
          {canPreview ? (
            <div className="max-h-[70vh] overflow-auto text-center">
              <Image
                className="mx-auto w-full h-full"
                src={documentObject.value}
                alt={documentObject.label?.en || "-"}
                width={200}
                height={100}
              />
            </div>
          ) : (
            <div className="text-center w-full h-[300px] border rounded-md flex items-center justify-center text-gray-400 p-5">
              {documentObject?.value
                ? "The document cannot be previewed, please download if you want to see it"
                : "No file available"}
            </div>
          )}
          <div className="w-full flex items-center justify-center mt-3">
            <Button
              disabled={!documentObject?.value}
              onClick={() => downloadDocument(documentObject.value)}
            >
              Download
            </Button>
          </div>
        </div>
      );
    }

    if (documentType === "multiple file") {
      const files = Array.isArray(documentObject?.value)
        ? documentObject.value
        : [];

      if (files.length === 0) {
        return (
          <div className="text-center w-full h-[300px] border rounded-md flex items-center justify-center text-gray-400">
            No files available
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-4">
          {files.map((fileUrl: string, index: number) => {
            const canPreview = isPreviewableImage(fileUrl);

            return (
              <div key={index} className="border rounded-md p-4">
                {canPreview ? (
                  <div className="max-h-[70vh] overflow-auto text-center">
                    <Image
                      className="mx-auto w-full h-full"
                      src={fileUrl}
                      alt={`${documentObject.label?.en || documentObject.label || "File"} ${index + 1}`}
                      width={200}
                      height={100}
                    />
                  </div>
                ) : (
                  <div className="text-center w-full h-[300px] border rounded-md flex items-center justify-center text-gray-400 p-5">
                    The document cannot be previewed, please download if you
                    want to see it
                  </div>
                )}
                <div className="w-full flex items-center justify-center mt-3">
                  <Button onClick={() => downloadDocument(fileUrl)}>
                    Download File
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    if (documentType === "number") {
      return (
        <p>{formatMoney(!!documentObject.value ? documentObject.value : 0)}</p>
      );
    }

    if (documentType === "datetime") {
      return (
        <p>
          {!!documentObject.value
            ? moment(documentObject.value).format("LLLL")
            : "-"}
        </p>
      );
    }

    return <p>{!!documentObject.value ? documentObject.value : "-"}</p>;
  };

  const documentTableColumns = createDetailDocumentTableColumns({
    onViewDocument: viewDocument,
  });

  const breadcrumbs = [
    { label: "Claim" },
    { label: "List", href: AppURL.claimList },
    { label: "Detail", isCurrentPage: true },
  ];

  return (
    <ContentLoadingWrapper isLoading={isLoading}>
      <div className="flex flex-col w-full">
        <PageHeader
          title="Detail Claim"
          breadcrumbs={breadcrumbs}
          showBackButton={true}
        />
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
              <div className="sm:w-1/3 bg-white rounded-md sm:p-6 p-4 mb-4 md:mb-0 h-fit max-h-full overflow-y-auto flex flex-col gap-3">
                <p className="font-semibold">Status Claim</p>
                {histories && histories.length > 0 ? (
                  histories.map((h, historyIndex) => {
                    const showUploadDocument =
                      h?.status === "Lack of Documents Operator" ||
                      h.status === "Lack of Documents Insurance";
                    return (
                      <div
                        key={`history-${historyIndex}`}
                        className="flex items-center"
                      >
                        {JourneyVerticalImage(
                          historyIndex !== 0 ? "#C4C4C4" : undefined,
                        )}
                        <div className="ml-5 flex flex-col gap-2">
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
                                  },
                                )} ${new Date(h.created_at).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  },
                                )}`
                              : "-"}
                          </p>

                          <div>
                            {h?.note &&
                              h.status !==
                                "Reupload Document Review Operator" && (
                                <p className="text-xs text-red-500">{h.note}</p>
                              )}

                            {showUploadDocument &&
                              getMissingDocuments(h?.lack_of_documents || [])
                                .length > 0 && (
                                <ul className="list-disc ml-5">
                                  {getMissingDocuments(
                                    h?.lack_of_documents || [],
                                  ).map((claimForm, index) => (
                                    <li
                                      key={index}
                                      className="text-xs text-red-500"
                                    >
                                      {claimForm?.label.en ||
                                        claimForm?.label_multilanguage?.en ||
                                        claimForm.label ||
                                        ""}
                                    </li>
                                  ))}
                                </ul>
                              )}
                          </div>

                          {showUploadDocument && historyIndex === 0 && (
                            <Button
                              size="sm"
                              className="bg-[#016DA1] text-white hover:bg-[#0482C2] rounded-full w-fit"
                              onClick={() =>
                                router.push(
                                  `${AppURL.claimDetail}/${claim.id}/upload-data`,
                                )
                              }
                            >
                              Upload Document
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })
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
                    <div>
                      {claim?.package?.plan?.name.split("|").join(" - ") || "-"}
                    </div>
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
                        const claimValue = claim?.claim?.find(
                          (d: any) => d.type === "Number" && d.name === "claim",
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
                        claim?.amount_approved != null
                          ? claim?.amount_approved
                          : 0,
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-white flex flex-col gap-3 rounded-md mb-4 sm:p-6 p-4">
                  <p className="font-semibold">Informasi Pemegang Polis</p>
                  {policyVisibility.name && (
                    <div className="flex gap-2 text-sm font-medium">
                      <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                        Customer Name
                      </div>
                      <div className="max-w-1 w-1">:</div>
                      <div>
                        {claim?.policy_data?.policy_holder?.name || "-"}
                      </div>
                    </div>
                  )}
                  {policyVisibility.phone && (
                    <div className="flex gap-2 text-sm font-medium">
                      <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                        Phone Number
                      </div>
                      <div className="max-w-1 w-1">:</div>
                      <div>
                        {claim?.policy_data?.policy_holder?.phone || "-"}
                      </div>
                    </div>
                  )}
                  {policyVisibility.email && (
                    <div className="flex gap-2 text-sm font-medium">
                      <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                        Email
                      </div>
                      <div className="max-w-1 w-1">:</div>
                      <div>
                        {claim?.policy_data?.policy_holder?.email || "-"}
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-white flex flex-col gap-3 rounded-md mb-4 sm:p-6 p-4">
                  <p className="font-semibold">Informasi Tertanggung</p>
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="lg:min-w-60 lg:w-60">
                      <div className="w-full border rounded-lg overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt=""
                          width={200}
                          height={100}
                          className="w-full h-auto"
                        />
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
                      {danaInfoVisibility && (
                        <div className="flex gap-2 text-sm font-medium">
                          <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                            Plat Nomor
                          </div>
                          <div className="max-w-1 w-1">:</div>
                          <div>
                            {claim?.participant_data?.data?.data
                              ?.licensePlate ||
                              claim?.participant_data?.data?.licensePlate ||
                              "-"}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2 text-sm font-medium">
                        <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                          Gender
                        </div>
                        <div className="max-w-1 w-1">:</div>
                        <div>
                          {claim?.participant_data?.data?.gender || "-"}
                        </div>
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
                                : claim?.participant_data?.data
                                      ?.identification_number
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
                    <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                      Nama
                    </div>
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
                {integrationInfoVisibility && (
                  <div className="bg-white rounded-md flex flex-col gap-3 p-4 sm:p-6">
                    <p className="font-semibold">Informasi Integrasi Asuransi</p>
                    {claim?.other_info?.third_party?.identifiers && 
                    typeof claim.other_info.third_party.identifiers === 'object' && (
                      Object.entries(claim.other_info.third_party.identifiers).map(
                        ([key, value]: [string, any]) => (
                          <div key={key} className="flex gap-2 text-sm font-medium">
                            <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                              {key
                                .split('_')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')}
                            </div>
                            <div className="max-w-1 w-1">:</div>
                            <div>{String(value || "-")}</div>
                          </div>
                        )
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          {tab === "Documents" && (
            <DataTable
              data={documents}
              columns={documentTableColumns}
              noDataImage={noData}
              noDataText="No transaction data available"
              className="table-claims"
            />
          )}
        </div>
      </div>
    </ContentLoadingWrapper>
  );
};

export default DetailClaim;
