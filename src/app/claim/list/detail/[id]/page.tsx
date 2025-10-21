// "use client";
//
// import React from "react";
// import {ClaimDetailView} from "@/views/claim/detail/detail.view";
//
// export default function ClaimDetailPage() {
//     return <ClaimDetailView />;
// }

"use client";
import moment from "moment";
import Image from "next/image";
import noData from "/public/images/no-data.webp";
import noImage from "/public/images/no-image.png";
import JourneyVerticalImage from "@/components/ui/journey-vertical.image";
import { useState, useEffect } from "react";
import { ChevronLeft, X } from "react-feather";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { formatMoney, formatMoneyClaim } from "@/lib/formatter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb";
import {useAuth} from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import ApiURL from "@/constants/api-url.const";
import { claimService } from "@/services/api.service";

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

export default function DetailClaim() {
    const router = useRouter();
    const params = useParams()
    const [tab, setTab] = useState("Summary");
    const [claim, setClaim] = useState<any>(null);
    const [docToOpen, setDocToOpen] = useState<any>(null);
    const [histories, setHistories] = useState<any[]>([]);
    const [documents, setDocuments] = useState<any[]>([]);
    const [isViewDocument, setIsViewDocument] = useState(false);
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    const [policyVisibility, setPolicyVisibility] = useState({
        name: true,
        email: true,
        phone: true,
    });
    const { permissionList } = useAuth();

    const imageUrl = claim?.participant_data?.data?.ktp || claim?.participant_data?.data?.passport || noImage.src;

    const personalInfo = [ claim?.personal_info?.address, claim?.personal_info?.address2, claim?.personal_info?.subdistrict, claim?.personal_info?.district, claim?.personal_info?.city, claim?.personal_info?.state, ];

    useEffect(() => {
        const checkAccess = async () => {
            const access = permissionList.includes("Claim.Read");
            const isHidePolicyEmail = permissionList.includes("Claim.View.Policy.HideEmail");
            const isHidePolicyPhone = permissionList.includes("Claim.View.Policy.HidePhone");
            setHasAccess(access);
            setPolicyVisibility({
                name: true,
                email: !isHidePolicyEmail,
                phone: !isHidePolicyPhone,
            })
            if (!access) {
                router.push(AppURL.forbidden);
            }
        };

        checkAccess();
    }, [router]);

    useEffect(() => {
        const fetchClaimData = async (id: string) => {
            try {
                const claimDetailResponse: any = await claimService.get(ApiURL.v1ClaimDetails(id));
                setClaim(claimDetailResponse.data);
                setDocuments([
                    ...claimDetailResponse.data?.general,
                    ...claimDetailResponse.data?.claim,
                    ...claimDetailResponse.data?.claim_config
                ]);
                const claimHistoriesResponse = await claimService.get(ApiURL.v1ClaimHistories, { params: { claim: id } });
                if (claimHistoriesResponse && claimHistoriesResponse.data?.data) {
                    setHistories(claimHistoriesResponse.data?.data);
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
        return (<div className="w-full h-full flex justify-center items-center">Loading...</div>);
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
        const documentType = documentObject.type.toLowerCase()
        if (documentType === 'file') {
            return (
                <div>
                    {documentObject?.value?.split(".").at(-1) ===
                    "pdf" ? (
                        <div className="text-center w-full h-[300px] border rounded-md flex items-center justify-center text-gray-400 p-5">
                            The document cannot be previewed, please
                            download if you want to see it
                        </div>
                    ) : (
                        <div className="max-h-[70vh] overflow-auto text-center">
                            {documentObject?.value ? (
                                <Image
                                    className="mx-auto w-full h-full"
                                    src={documentObject.value}
                                    alt={documentObject.label?.en || "-"}
                                    width={200}
                                    height={100}
                                />
                            ) : (
                                <div className="text-center w-full h-[300px] border rounded-md flex items-center justify-center text-gray-400">
                                    No image available
                                </div>
                            )}
                        </div>
                    )}
                    <div className="w-full flex items-center justify-center mt-3">
                        <Button
                            disabled={!documentObject?.value}
                            onClick={() =>
                                downloadDocument(documentObject.value)
                            }
                        >
                            Download
                        </Button>
                    </div>
                </div>
            )
        }

        if (documentType === 'number') {
            return (
                <p>{formatMoney(!!documentObject.value ? documentObject.value : 0)}</p>
            )
        }

        if (documentType === 'datetime') {
            return (
                <p>{!!documentObject.value ? moment(documentObject.value).format("LLLL") : "-"}</p>
            )
        }

        return (
            <p>{!!documentObject.value ? documentObject.value : '-'}</p>
        )
    }

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
                                <BreadcrumbLink href={AppURL.claimList}>List</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Detail</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">Detail Claim</h2>
                </div>
                <div onClick={() => router.back()} className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer">
                    <ChevronLeft className="w-4 h-4" /> Back
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
                        <p className={`text-sm mr-3 ${tab === "Summary" && "font-semibold text-primary"}`}>Summary</p>
                    </div>
                    <div
                        onClick={() => setTab("Documents")}
                        style={{ width: "calc(100% / 2)" }}
                        className={`cursor-pointer h-full flex items-center justify-center ${
                            tab === "Documents" && "border-b-[3px] border-primary"
                        }`}
                    >
                        <p className={`text-sm mr-3 ${tab === "Documents" && "font-semibold text-primary"}`}>Documents</p>
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
                                                    : "-"}
                                            </p>
                                            {h?.note && (
                                                <p className="text-xs text-red-500">{h.note}</p>
                                            )}
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
                                    <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Claim Number</div>
                                    <div className="max-w-1 w-1">:</div>
                                    <div>{claim?.number || "-"}</div>
                                </div>
                                <div className="flex gap-2 text-sm font-medium">
                                    <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Customer Name</div>
                                    <div className="max-w-1 w-1">:</div>
                                    <div>{claim?.policy_data?.policy_holder?.name || "-"}</div>
                                </div>
                                <div className="flex gap-2 text-sm font-medium">
                                    <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Plan Name</div>
                                    <div className="max-w-1 w-1">:</div>
                                    <div>{claim?.package?.plan?.name.split("|").join(" - ") || "-"}</div>
                                </div>
                                <div className="flex gap-2 text-sm font-medium">
                                    <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Benefit</div>
                                    <div className="max-w-1 w-1">:</div>
                                    <div>{claim?.benefit?.description_en || "-"}</div>
                                </div>
                                <div className="flex gap-2 text-sm font-medium">
                                    <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Requested Amount</div>
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
                                    <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Approved Amount</div>
                                    <div className="max-w-1 w-1">:</div>
                                    <div>{formatMoneyClaim(claim.amount_approved != null ? claim.amount_approved : 0)}</div>
                                </div>
                            </div>
                            <div className="bg-white flex flex-col gap-3 rounded-md mb-4 sm:p-6 p-4">
                                <p className="font-semibold">Informasi Pemegang Polis</p>
                                {policyVisibility.name &&
                                    <div className="flex gap-2 text-sm font-medium">
                                        <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Customer Name</div>
                                        <div className="max-w-1 w-1">:</div>
                                        <div>{claim?.policy_data?.policy_holder?.name || "-"}</div>
                                    </div>
                                }
                                {policyVisibility.phone &&
                                    <div className="flex gap-2 text-sm font-medium">
                                        <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Phone Number</div>
                                        <div className="max-w-1 w-1">:</div>
                                        <div>{claim?.policy_data?.policy_holder?.phone || "-"}</div>
                                    </div>
                                }
                                {policyVisibility.email &&
                                    <div className="flex gap-2 text-sm font-medium">
                                        <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Email</div>
                                        <div className="max-w-1 w-1">:</div>
                                        <div>{claim?.policy_data?.policy_holder?.email || "-"}</div>
                                    </div>
                                }
                            </div>
                            <div className="bg-white flex flex-col gap-3 rounded-md mb-4 sm:p-6 p-4">
                                <p className="font-semibold">Informasi Tertanggung</p>
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="lg:min-w-60 lg:w-60">
                                        <div className="w-full border rounded-lg overflow-hidden">
                                            <Image src={imageUrl} alt="" width={200} height={100} className="w-full h-auto" />
                                        </div>
                                    </div>
                                    <div className="w-full flex gap-3 flex-col">
                                        <div className="flex gap-2 text-sm font-medium">
                                            <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">No. Polis</div>
                                            <div className="max-w-1 w-1">:</div>
                                            <div>{claim?.policy_data?.number || "-"}</div>
                                        </div>
                                        <div className="flex gap-2 text-sm font-medium">
                                            <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">No. Peserta</div>
                                            <div className="max-w-1 w-1">:</div>
                                            <div>{claim?.participant_data?.number || "-"}</div>
                                        </div>
                                        <div className="flex gap-2 text-sm font-medium">
                                            <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Nama Lengkap</div>
                                            <div className="max-w-1 w-1">:</div>
                                            <div>{claim?.participant_data?.data?.data?.name || claim?.participant_data?.data?.name || "-"}</div>
                                        </div>
                                        <div className="flex gap-2 text-sm font-medium">
                                            <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Gender</div>
                                            <div className="max-w-1 w-1">:</div>
                                            <div>{claim?.participant_data?.data?.gender || "-"}</div>
                                        </div>
                                        <div className="flex gap-2 text-sm font-medium">
                                            <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Kode Negara</div>
                                            <div className="max-w-1 w-1">:</div>
                                            <div>{claim?.participant_data?.data?.country_code || "-"}</div>
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
                                            <div>{claim?.participant_data?.data?.data?.passport_no || claim?.participant_data?.data?.passport_no || claim?.participant_data?.data?.nik || "-"}</div>
                                        </div>
                                        <div className="flex gap-2 text-sm font-medium">
                                            <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Kewarganegaraan</div>
                                            <div className="max-w-1 w-1">:</div>
                                            <div>{claim?.participant_data?.data?.data?.nationality || claim?.participant_data?.data?.nationality || "-"}</div>
                                        </div>
                                        <div className="flex gap-2 text-sm font-medium">
                                            <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Tgl. Lahir</div>
                                            <div className="max-w-1 w-1">:</div>
                                            <div>{claim?.participant_data?.data?.data?.dob || claim?.participant_data?.data?.dob || "-"}</div>
                                        </div>
                                        <div className="flex gap-2 text-sm font-medium">
                                            <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Tempat Lahir</div>
                                            <div className="max-w-1 w-1">:</div>
                                            <div>{claim?.participant_data?.data?.pob || "-"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-md flex flex-col gap-3 p-4 sm:p-6">
                                <p className="font-semibold">Informasi Pribadi</p>
                                <div className="flex gap-2 text-sm font-medium">
                                    <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Nomor Handpone</div>
                                    <div className="max-w-1 w-1">:</div>
                                    <div>{claim?.personal_info?.phone || "-"}</div>
                                </div>
                                <div className="flex gap-2 text-sm font-medium">
                                    <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Alamat</div>
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
                                    <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Nama Bank</div>
                                    <div className="max-w-1 w-1">:</div>
                                    <div>{claim?.bank_info?.bank?.name || "-"}</div>
                                </div>
                                <div className="flex gap-2 text-sm font-medium">
                                    <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Cabang Bank</div>
                                    <div className="max-w-1 w-1">:</div>
                                    <div>{claim?.bank_info?.branch || "-"}</div>
                                </div>
                                <div className="flex gap-2 text-sm font-medium">
                                    <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">No. Rekening</div>
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
                                    <TableHead className="whitespace-nowrap w-28">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.length > 0 ? (
                                    documents.map((document, index) => (
                                        <TableRow key={document.id || `doc-${index}`}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2 items-center">
                                                    {document?.label?.en || document?.label || "-"}{" "}
                                                    {document?.insured_type && " - " + document?.insured_type.charAt(0).toUpperCase() + document?.insured_type.slice(1)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Dialog>
                                                    <DialogTrigger className="bg-[#016DA1] text-white px-4 py-2 rounded-full" onClick={() => viewDocument(document)}>View</DialogTrigger>
                                                    {isViewDocument && (
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle className="text-sm sm:text-base flex items-center">
                                                                    {document?.label?.en || document?.label || "-"}
                                                                    <DialogClose className="ml-auto" asChild>
                                                                        <Button type="button" className="bg-transparent hover:bg-transparent text-black p-0">
                                                                            <X className="w-5 h-5" />
                                                                        </Button>
                                                                    </DialogClose>
                                                                </DialogTitle>
                                                            </DialogHeader>

                                                            <div  className="overflow-auto max-h-[80vh]">
                                                                {docToOpen.type.toLowerCase() === "fields"
                                                                    ? docToOpen.fields.map((field: FieldType, index: number) => (
                                                                        <div key={index}>
                                                                            <div className="text-sm sm:text-base font-semibold" key={field.name}>
                                                                                {field?.label_multilanguage?.en || field?.label || "-"}{" "}
                                                                            </div>
                                                                            {renderDocumentsDetails(field)}
                                                                        </div>
                                                                    ))
                                                                    : renderDocumentsDetails(docToOpen)}
                                                            </div>
                                                        </DialogContent>
                                                    )}
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow className="hover:!bg-white">
                                        <TableCell colSpan={9}>
                                            <div className="flex flex-col gap-4 items-center justify-center py-14">
                                                <Image alt="no data" src={noData} width={200} /> No transaction data available
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