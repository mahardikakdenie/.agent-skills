import React, {useEffect, useState} from "react";
import {useParams, usePathname, useRouter} from "next/navigation";
import {ChevronLeft} from "react-feather";
import {Claim, ClaimHistory} from "@/types/claim";
import {claimsService} from "@/services/claims/api/claims.service";
import NotFound from "@/components/not-found";
import {forLabelString, getBreadcrumbs, getHeaderPage, moneyFormatter, toastNotification} from "@/helpers/app.helper";
import JourneyVerticalImage from "@/images/journey-vertical.image";
import moment from "moment";
import {useScreen} from "@/context/screen.context";
import Button from "@/components/button";
import Modal from "@/components/modal";
import Select from "@/components/select";
import ImageOrDefault from "@/components/image-or-default";
import {useAuth} from "@/context/auth.context";

export const ClaimDetailView = () => {
    const [tab, setTab] = useState("Summary");
    const [claimCurrency, setClaimCurrency] = useState<string | undefined>();
    const [identityCardLink, setIdentityCardLink] = useState("");
    const [claimAmount, setClaimAmount] = useState("");
    const [docToOpen, setDocToOpen] = useState<any>(null);
    const [isForceCannotViewDocument, setIsForceCannotViewDocument] = useState(false);
    const [isForceCannotViewDocumentFields, setIsForceCannotViewDocumentFields] = useState<boolean[]>([]);
    const [isViewDocument, setIsViewDocument] = useState(false);
    const [isIdentityCardPdf, setIsIdentityCardPdf] = useState(false);
    const [data, setData] = useState<Claim>();
    const [histories, setHistories] = useState<ClaimHistory[]>();
    const [documents, setDocuments] = useState<any[]>([]);
    const path = usePathname();
    const router = useRouter();
    const { id } = useParams();
    const { isMobileView, setLoading } = useScreen();
    const { handleResponseError } = useAuth();
    const { pageName, breadcrumbsArray } = getHeaderPage(3, path, false);
    const personalInfo = [
        data?.personal_info?.address,
        data?.personal_info?.address2,
        data?.personal_info?.subdistrict,
        data?.personal_info?.district,
        data?.personal_info?.city,
        data?.personal_info?.state
    ];

    useEffect(() => {
        const fetchClaimDetail = async () => {
            try {
                setLoading(true);
                const responseClaimHistories: any = await claimsService.getClaimHistories({ claim: `${id}`, limit: 100, page: 1 });
                if (responseClaimHistories) setHistories(responseClaimHistories.data);
                if (!id) return;
                const responseClaim: any = await claimsService.getClaimById(id.toString());
                const forClaimCurrency: string | undefined = responseClaim?.policy_data?.declarations?.transaction_data?.insurance?.currency ? responseClaim?.policy_data?.declarations?.transaction_data?.insurance?.currency : undefined;
                const identityCardParticipant: string = responseClaim?.participant_data?.data?.ktp || responseClaim?.participant_data?.data?.passport || "";
                const identityCardParticipantArray = !!identityCardParticipant ? identityCardParticipant?.split(".") : null;
                const claimAmountParticipant: any = responseClaim.claim.find((d: any) => d.type === "Number" && d.name === "claim");
                if (identityCardParticipant) setIdentityCardLink(identityCardParticipant);
                if (!!identityCardParticipantArray && identityCardParticipantArray?.[identityCardParticipantArray.length - 1]?.toLowerCase() === "pdf") {
                    setIsIdentityCardPdf(true);
                    processUrl(identityCardParticipant, "pdfIdentityCardParticipant");
                }
                if (claimAmountParticipant) setClaimAmount(moneyFormatter(forClaimCurrency).format(claimAmountParticipant.value));
                if (responseClaim) {
                    const filteredGeneral = responseClaim?.general?.length ? responseClaim?.general?.filter((item: any) => !!item.value || !!item.fields) : [];
                    const filteredClaim = responseClaim?.claim?.length ? responseClaim?.claim?.filter((item: any) => !!item.value || !!item.fields) : [];
                    const filteredClaimConfig = responseClaim?.claim_config?.length ? responseClaim?.claim_config?.filter((item: any) => !!item.value || !!item.fields) : [];

                    setData(responseClaim);
                    setClaimCurrency(forClaimCurrency);
                    setDocuments([...filteredGeneral, ...filteredClaim, ...filteredClaimConfig]);
                }
            } catch (error: any) {
                handleResponseError(error);
            } finally {
                setLoading(false);
            }
        }

        fetchClaimDetail().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (tab === "Summary" && !!identityCardLink) processUrl(identityCardLink, "pdfIdentityCardParticipant");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    const processUrl = (url: string, id: string, setIsForce: boolean = false, index: number = 0) => {
        const urlArr = url?.split(".") || "";
        const mimeType = urlArr?.[urlArr.length - 1]?.toLowerCase() !== "pdf" ? `image/${urlArr?.[urlArr.length - 1]?.toLowerCase()}` : "application/pdf";
        fetch(url,{})
            .then(res => res.blob())
            .then(blob => {
                const file = new Blob([blob], {type: mimeType});
                let fileURL = URL.createObjectURL(file);
                let element = document.getElementById(id);
                // element?.setAttribute("src", fileURL)
                if (element) {
                    if (element instanceof HTMLImageElement || element instanceof HTMLIFrameElement) {
                        element.src = fileURL;
                    } else {
                        toastNotification('Element is not an image or iframe', 'error');
                    }
                }
            })
            .catch(_err => {
                if (setIsForce) {
                    setIsForceCannotViewDocument(true);
                } else if (index >= 0 && index < isForceCannotViewDocumentFields.length) {
                    let newArray = [ ...isForceCannotViewDocumentFields ];
                    newArray[index] = true;
                    setIsForceCannotViewDocumentFields(newArray);
                }
            });
    };

    const viewDocument = (documentObject: any) => {
        if (documentObject?.type?.toLowerCase() === "file" && documentObject?.value) {
            processUrl(documentObject.value, "pdfFrame", true);
        } else if (documentObject?.type?.toLowerCase() === "fields") {
            setIsForceCannotViewDocumentFields(documentObject?.fields?.map(() => false));
            for (let i = 0; i < documentObject.fields.length; i++) {
                const field = documentObject.fields[i];
                if (field?.type?.toLowerCase() === "file") {
                    const fieldValue = field?.value;
                    processUrl(fieldValue, `pdfFrameField${i}`, false, i);
                }
            }
        } else if (documentObject?.type?.toLowerCase() === "multiple file") {
            documentObject.value.forEach((item: any) => {
                processUrl(item, "pdfFrame", true)
            })
        }
        setDocToOpen(documentObject);
        setIsViewDocument(true);
    };

    const downloadDocument = (url: string) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";

        xhr.onload = function () {
            if (this.status === 200) {
                const blob = new Blob([this.response], { type: "image" });
                const downloadUrl = URL.createObjectURL(blob);
                const fileNameMatch = url.split('/');
                const fileName = fileNameMatch.length > 0
                    ? fileNameMatch[fileNameMatch.length - 1]
                    : "claim.png";
                const a = document.createElement("a");
                a.href = downloadUrl;
                a.download = fileName;
                a.style.display = "none";

                document.body.appendChild(a);

                const evt = new MouseEvent("click", {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                });
                a.dispatchEvent(evt);

                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(downloadUrl);
                }, 100);
            }
        };

        xhr.onerror = function () {
            window.open(url, "_blank");
        };

        xhr.send();
    };

    const goToClaimListPage = () => {
        router.push(path?.split("/")?.slice(0, -2)?.join("/"))
    };

    return (
        <div className="mx-auto">
            <div className="overflow-x-auto sm:scrollable bg-white flex items-center justify-between mb-5 py-5 px-7">
                <div>
                    {getBreadcrumbs(breadcrumbsArray)}
                    <p className="font-bold text-lg">{pageName}</p>
                </div>
                <div onClick={goToClaimListPage} className="flex items-center justify-between cursor-pointer">
                    <ChevronLeft color="red" width="30" height="15"/>
                    <p className="text-sm text-red-500">Back</p>
                </div>
            </div>
            <div className="pb-5 px-7">
                {isMobileView ? (
                    <Select additionalClassNameSelect="pl-4 shadow mb-3 h-[46px]" withBorder={false} value={tab} onChange={(event) => setTab(event.toString())} options={[{label:"Summary",value:"Summary"},{label:"Documents",value:"Documents"}]}/>
                ) : (
                    <div className="flex items-center justify-start h-16 bg-white rounded-md mb-3 shadow">
                        <div onClick={() => setTab("Summary")} style={{width: "calc(100% / 2)"}} className={`cursor-pointer h-full flex items-center justify-center mr-5 ${tab === "Summary" && "border-b-[3px] border-primary"}`}>
                            <p className={`text-sm mr-3 ${tab === "Summary" && "font-semibold text-primary"}`}>Summary</p>
                        </div>
                        <div onClick={() => setTab("Documents")} style={{width: "calc(100% / 2)"}} className={`cursor-pointer h-full flex items-center justify-center ${tab === "Documents" && "border-b-[3px] border-primary"}`}>
                            <p className={`text-sm mr-3 ${tab === "Documents" && "font-semibold text-primary"}`}>Documents</p>
                        </div>
                    </div>
                )}
                {tab === "Summary" && (
                    <div className="lg:flex">
                        <div className="lg:w-1/3 bg-white rounded-md py-5 px-7 mb-3 lg:mb-0 lg:mr-3 h-fit max-h-full overflow-y-auto sm:scrollable shadow">
                            <p className="font-semibold mb-3">Status</p>
                            <div className="max-h-[250px] overflow-y-auto sm:scrollable">
                                {histories && histories?.length > 0 && histories.map((h, historyIndex) => (
                                    (h.status !== "Draft") && (
                                        <div key={`history-${historyIndex}`} className="flex items-center">
                                            <div className="w-1/12">
                                                {JourneyVerticalImage(historyIndex !== 0 ? "#C4C4C4" : undefined)}
                                            </div>
                                            <div className="w-11/12">
                                                <p className="text-sm lg:text-base font-medium">{h.status || "-"}</p>
                                                <p className="text-xs text-gray-400">{moment(h.created_at).format("LLLL")}</p>
                                                {!!h.note && (<p title={h?.note || "-"} className={`${h?.status?.toLowerCase() !== "approved" && "text-red-500"} text-xs truncate`}>Note: {h?.note || "-"}</p>)}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-2/3">
                            <div className="bg-white rounded-md mb-3 py-5 px-7 shadow">
                                <p className="font-semibold mb-3">Detail</p>
                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Claim Number</p>
                                    <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                        <p className="hidden lg:block lg:mr-2">:</p>
                                        <p>{data?.number || "-"}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Customer Name</p>
                                    <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                        <p className="hidden lg:block lg:mr-2">:</p>
                                        <p>{data?.policy_data?.policy_holder?.name || "-"}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Plan Name</p>
                                    <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                        <p className="hidden lg:block lg:mr-2">:</p>
                                        <p>{data?.package?.plan?.name || "-"}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Benefit</p>
                                    <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                        <p className="hidden lg:block lg:mr-2">:</p>
                                        <p>{data?.benefit?.description_en || "-"}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Requested Amount</p>
                                    <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                        <p className="hidden lg:block lg:mr-2">:</p>
                                        <p>{claimAmount || "-"}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Approved Amount</p>
                                    <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                        <p className="hidden lg:block lg:mr-2">:</p>
                                        <p>{moneyFormatter(claimCurrency).format(data?.amount_approved || 0)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-md mb-3 py-5 px-7 shadow">
                                <p className="font-semibold mb-3">Policy Holder Information</p>
                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Customer Name</p>
                                    <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                        <p className="hidden lg:block lg:mr-2">:</p>
                                        <p>{data?.policy_data?.policy_holder?.name || "-"}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Phone Number</p>
                                    <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                        <p className="hidden lg:block lg:mr-2">:</p>
                                        <p>{data?.policy_data?.policy_holder?.phone || "-"}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Email</p>
                                    <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                        <p className="hidden lg:block lg:mr-2">:</p>
                                        <p>{data?.policy_data?.policy_holder?.email || "-"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-md mb-3 py-5 px-7 shadow">
                                <p className="font-semibold mb-3">Participants Information</p>
                                {
                                    data?.participant_data ? (
                                        <div className="flex flex-col lg:flex-row">
                                            <div className="lg:w-1/3 mb-3 lg:mr-2">
                                                {isIdentityCardPdf ? (
                                                    <iframe id="pdfIdentityCardParticipant" src="" style={{ border: "none", width: isMobileView ? "50%" : "100%", height: "100%" }} title="passport-participant"></iframe>
                                                ) : (
                                                    <ImageOrDefault width={460} height={300} alt="identity-card-participant" src={identityCardLink} additionalClassNameP="py-14 px-3"/>
                                                )}
                                            </div>
                                            <div className="w-full">
                                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Policy Number</p>
                                                    <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                        <p className="hidden lg:block lg:mr-2">:</p>
                                                        <p>{data?.policy_data?.number || "-"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Participant Number</p>
                                                    <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                        <p className="hidden lg:block lg:mr-2">:</p>
                                                        <p>{data?.participant_data?.data?.reg_no || "-"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Full Name</p>
                                                    <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                        <p className="hidden lg:block lg:mr-2">:</p>
                                                        <p>{data?.participant_data?.data?.name || "-"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Gender</p>
                                                    <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                        <p className="hidden lg:block lg:mr-2">:</p>
                                                        <p>{data?.participant_data?.data?.gender || "-"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Country Code</p>
                                                    <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                        <p className="hidden lg:block lg:mr-2">:</p>
                                                        <p>{data?.participant_data?.data?.country_code || "-"}</p>
                                                    </div>
                                                </div>
                                                {!!data?.participant_data?.data?.nik ? (
                                                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                                        <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Identity Number (NIK)</p>
                                                        <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                            <p className="hidden lg:block lg:mr-2">:</p>
                                                            <p>{data?.participant_data?.data?.nik || "-"}</p>
                                                        </div>
                                                    </div>
                                                ) : !!data?.participant_data?.data?.passport_no ? (
                                                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                                        <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Passport Number</p>
                                                        <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                            <p className="hidden lg:block lg:mr-2">:</p>
                                                            <p>{data?.participant_data?.data?.passport_no || "-"}</p>
                                                        </div>
                                                    </div>
                                                ) : null}
                                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Nationality</p>
                                                    <div
                                                        className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                        <p className="hidden lg:block lg:mr-2">:</p>
                                                        <p>{data?.participant_data?.data?.nationality || "-"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Birthdate</p>
                                                    <div
                                                        className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                        <p className="hidden lg:block lg:mr-2">:</p>
                                                        <p>{data?.participant_data?.data?.dob || "-"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
                                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Place of Birth</p>
                                                    <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                        <p className="hidden lg:block lg:mr-2">:</p>
                                                        <p>{data?.participant_data?.data?.pob || "-"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center bg-white rounded-md pb-10">
                                            <NotFound width={isMobileView && "143"} height={isMobileView && "144"} size1={isMobileView && "143"} size3={isMobileView && "95"} viewBox={isMobileView && "-15 -5 87 70"} text="No participant data available" textClassName={isMobileView && "text-xs"}/>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="bg-white rounded-md mb-3 py-5 px-7 shadow">
                                <p className="font-semibold mb-3">Personal Information</p>
                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Phone Number</p>
                                    <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                        <p className="hidden lg:block lg:mr-2">:</p>
                                        <p>{data?.personal_info?.phone || "-"}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Address</p>
                                    <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                        <p className="hidden lg:block lg:mr-2">:</p>
                                        <p>{personalInfo.filter(Boolean).join(" ") || "-"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-md mb-3 py-5 px-7 shadow">
                                <p className="font-semibold mb-3">Account Bank Information</p>
                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Account Name</p>
                                    <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                        <p className="hidden lg:block lg:mr-2">:</p>
                                        <p>{data?.bank_info?.account_name || "-"}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Bank</p>
                                    <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                        <p className="hidden lg:block lg:mr-2">:</p>
                                        <p>{data?.bank_info?.bank?.name || "-"}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Branch</p>
                                    <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                        <p className="hidden lg:block lg:mr-2">:</p>
                                        <p>{data?.bank_info?.branch || "-"}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
                                    <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Account Number</p>
                                    <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                        <p className="hidden lg:block lg:mr-2">:</p>
                                        <p>{data?.bank_info?.account_number || "-"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {tab === "Documents" && (documents.length > 0 ? (
                    <div className="relative bg-white rounded-md shadow-md">
                        <div className="overflow-x-auto sm:scrollable">
                            <table className="min-w-full divide-y divide-gray-200 table-auto">
                                <thead className="bg-white">
                                <tr>
                                    <th className="w-1/12 px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No.</th>
                                    <th className="w-10/12 px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Filename</th>
                                    <th className="w-1/12 px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {documents.map((doc, docIndex) => (
                                    <tr key={`document-${docIndex}`} className="hover:bg-gray-50">
                                        <td className="w-1/12 px-6 py-3 whitespace-nowrap text-sm text-gray-500">{docIndex + 1}</td>
                                        <td className="w-10/12 px-6 py-3 whitespace-nowrap text-sm text-gray-500">{forLabelString(doc)}</td>
                                        <td className="w-1/12 px-6 py-3 whitespace-nowrap text-sm font-medium">
                                            <Button onClick={() => viewDocument(doc)}>View</Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center bg-white rounded-md pt-10 pb-20 shadow">
                        <NotFound width={isMobileView && "143"} height={isMobileView && "144"} size1={isMobileView && "143"} size3={isMobileView && "95"} viewBox={isMobileView && "-17 -5 87 70"} text="No document data available" textClassName={isMobileView && "text-xs"}/>
                    </div>
                ))}
                {isViewDocument && (
                    <Modal widthClassName="w-fit max-w-full lg:max-w-[50%]" heightClassName="h-fit" isOpen={isViewDocument} onClose={() => setIsViewDocument(false)}>
                        <div className="py-4 px-6">
                            <p className="font-bold mb-3 text-center">{forLabelString(docToOpen)}</p>
                            {
                                docToOpen?.type?.toLowerCase() === "fields" ? (
                                    <div className="max-h-[calc(70vh)] overflow-y-auto sm:scrollable">
                                        {docToOpen?.fields?.map((f: any, fIndex: number) => (
                                            <div key={`field-${fIndex}`} className={`${fIndex > 0 && "mt-3"}`}>
                                                <p className="font-medium mb-3">{forLabelString(f)}</p>
                                                {
                                                    f?.type?.toLowerCase() === "file" ? (
                                                        <div>
                                                            {f?.value?.split(".").at(-1) === "pdf" ? (
                                                                <div key={`field-${fIndex}-${isForceCannotViewDocumentFields[fIndex]}`} className={`${!isForceCannotViewDocumentFields[fIndex] && "w-[calc(90vh)] h-[calc(50vh)]"}`}>
                                                                    {isForceCannotViewDocumentFields[fIndex] ? (
                                                                        <p className="text-center text-gray-400 font-semibold text-sm border border-gray-300 rounded-md py-14 px-3 lg:py-[135px]">
                                                                            The document cannot be previewed, please download if you want to see it.
                                                                        </p>
                                                                    ) : (
                                                                        <iframe id={`pdfFrameField${fIndex}`} src="" title={forLabelString(f)} style={{border: "none", width: isMobileView ? "50%" : "100%", height: "100%"}}></iframe>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="lg:w-[460px] lg:h-[300px] overflow-auto sm:scrollable">
                                                                    <ImageOrDefault width={460} height={300} alt={forLabelString(f)} src={f.value} additionalClassNameP="py-14 px-3 lg:py-[135px]" layout="responsive" />
                                                                </div>
                                                            )}
                                                            <div className="w-full flex items-center justify-center mt-3">
                                                                <Button disabled={!f?.value} onClick={() => downloadDocument(f.value)}>Download</Button>
                                                            </div>
                                                        </div>
                                                    ) : f?.type?.toLowerCase() === "number" ? (
                                                        <p>{moneyFormatter(claimCurrency).format(!!f?.value ? f.value : 0)}</p>
                                                    ) : f?.type?.toLowerCase() === "datetime" ? (
                                                        <p>{!!f?.value ? moment(f?.value).format("LLLL") : "-"}</p>
                                                    ) : <p>{f?.value || "-"}</p>
                                                }
                                            </div>
                                        ))}
                                    </div>
                                ) : docToOpen?.type?.toLowerCase() === "file" ? (
                                    <div>
                                        {docToOpen?.value?.split(".").at(-1) === "pdf" ? (
                                            <div key={`doc-${isForceCannotViewDocument}`} className={`${!isForceCannotViewDocument && "w-[calc(90vh)] h-[calc(50vh)]"}`}>
                                                {isForceCannotViewDocument ? (
                                                    <p className="text-center text-gray-400 font-semibold text-sm border border-gray-300 rounded-md py-14 px-3 lg:py-[135px]">
                                                        The document cannot be previewed, please download if you want to see it.
                                                    </p>
                                                ) : (
                                                    <iframe id="pdfFrame" src="" title={forLabelString(docToOpen)} style={{border: "none", width: isMobileView ? "50%" : "100%", height: "100%"}}></iframe>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="lg:w-[460px] lg:h-[300px] overflow-auto sm:scrollable">
                                                <ImageOrDefault width={460} height={300} alt={forLabelString(docToOpen)} src={docToOpen.value} additionalClassNameP="py-14 px-3 lg:py-[135px]" layout="responsive" />
                                            </div>
                                        )}
                                        <div className="w-full flex items-center justify-center mt-3">
                                            <Button disabled={!docToOpen?.value} onClick={() => downloadDocument(docToOpen.value)}>Download</Button>
                                        </div>
                                    </div>
                                ) : docToOpen?.type?.toLowerCase() === "multiple file" ? (
                                    <div className="lg:w-[460px] lg:h-[300px] overflow-auto sm:scrollable">
                                        {
                                            docToOpen?.value.map((f: string, fIndex: number) => (
                                                <div key={fIndex} >
                                                    <ImageOrDefault width={460} height={300} alt={forLabelString(docToOpen)} src={f} additionalClassNameP="py-14 px-3 lg:py-[135px]" layout="responsive" />
                                                </div>
                                            ))
                                        }
                                    </div>
                                ) : docToOpen?.type?.toLowerCase() === "number" ? (
                                    <p>{moneyFormatter(claimCurrency).format(!!docToOpen?.value ? docToOpen?.value : 0)}</p>
                                ) : docToOpen?.type?.toLowerCase() === "datetime" ? (
                                    <p>{!!docToOpen?.value ? moment(docToOpen?.value).format("LLLL") : "-"}</p>
                                ) : <p>{docToOpen?.value || "-"}</p>
                            }
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
};
