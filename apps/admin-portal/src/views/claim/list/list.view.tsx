import React, {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import NotFound from "@/components/not-found";
import Pagination from "@/components/pagination";
import DatePicker from "@/components/datepicker";
import {delimiter, primary, primaryRed, primaryRedLightForeground, primaryYellowLightForeground, slaStatus} from "@/constants/app-common.const";
import moment from "moment";
import {AxiosResponse} from "axios";
import ApiURL from "@/constants/api-url.const";
import {Claim, ListClaimRequest, ListClaimResponse} from "@/types/claim";
import {claimService} from "@/services/api.service";
import DownloadIcon from "@/images/download.icon";
import {useScreen} from "@/context/screen.context";
import Button from "@/components/button";
import Select from "@/components/select";
import {useAuth} from "@/context/auth.context";
import {capitalizeString, forLabelString, getHeaderPage, getPaddingClass, moneyFormatter, parseMoneyString, setLocalStorage, startDateAndEndDateView, toastNotification} from "@/helpers/app.helper";
import Input from "@/components/input";
import searchIcon from "@/images/search.icon";
import Modal from "@/components/modal";
import AlertCircleIcon from "@/images/alert-circle.icon";
import TextArea from "@/components/textarea";
import CalenderIcon from "@/images/calender.icon";
import MultipleSelect from "@/components/multiple-select";
import UploadIcon from "@/images/upload.icon";

export const ClaimListView = () => {
    const [keywordClaim, setKeywordClaim] = useState("");
    const [tab, setTab] = useState("All");
    const [selectedSlaStatus, setSelectedSlaStatus] = useState("All");
    const [newDataClaimStatus, setNewDataClaimStatus] = useState("");
    const [noteChangeClaimStatus, setNoteChangeClaimStatus] = useState("");
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [selectedEndDate, setSelectedEndDate] = useState("");
    const [currentSelectedDate, setCurrentSelectedDate] = useState("");
    const [data, setData] = useState<Claim[]>([]);
    const [claimStatusConfigurations, setClaimStatusConfigurations] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalData, setTotalData] = useState(0);
    const [newApprovedAmount, setNewApprovedAmount] = useState(0);
    const [isModalChangeClaimStatusOpen, setIsModalChangeClaimStatusOpen] = useState(false);
    const [isFilterDateModal, setIsFilterDateModal] = useState(false);
    const [isSelectedStartDateChange, setIsSelectedStartDateChange] = useState(false);
    const [isDisableClaimStatusValid, setIsDisableClaimStatusValid] = useState(true);
    const [lackOfDocumentList, setLackOfDocumentList] = useState<string[]>([]);
    const [claimStatusOptions, setClaimStatusOptions] = useState<any[]>([]);
    const [slaStatusOptions, setSlaStatusOptions] = useState<any[]>([]);
    const [documentList, setDocumentList] = useState<any[]>([]);
    const path = usePathname();
    const router = useRouter();
    const { isMobileView, setLoading } = useScreen();
    const { handleResponseError, permissionList, user } = useAuth();
    const headerPage = getHeaderPage(2, path, true);
    const hasCreatePermission = permissionList.includes(`${capitalizeString(headerPage.breadcrumbsArray[0])}.${headerPage.pageName}.Create`);
    const hasUpdatePermission = permissionList.includes(`${capitalizeString(headerPage.breadcrumbsArray[0])}.${headerPage.pageName}.Update`);
    const hasReadReportPermission = permissionList.includes("Report.Read");
    const channel = user?.channel || undefined;
    useEffect(() => {
        let slaStatusArr = [{ label: "All Priority", value: "All" }];
        slaStatus.forEach((ss) => slaStatusArr.push({ label: ss, value: ss }));
        setSlaStatusOptions(slaStatusArr);
        fetchClaimStatus().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setIsDisableClaimStatusValid(!noteChangeClaimStatus || (!!lackOfDocumentList && lackOfDocumentList.length < 1));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lackOfDocumentList]);

    const fetchClaimStatus = async () => {
        try {
            setLoading(true);
            const responseClaimStatus: any = await claimService.get(ApiURL.claimConfigurations);
            if (responseClaimStatus) {
                let statusArr = [{ label: "All Claim", value: "All" }];
                responseClaimStatus.data.filter((f: any) => f.status !== "Draft").forEach((cs: any) => statusArr.push({ label: cs.status, value: cs.status }));
                setClaimStatusOptions(statusArr);
                setClaimStatusConfigurations(responseClaimStatus.data);
                await fetchClaims(currentPage, itemsPerPage, tab);
            }
        } catch (error: any) {
            handleResponseError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClaims = async (page: number, limit: number, status: string, isClearKeyword: boolean = false, isClearDateFilter: boolean = false, startDate: string = "", endDate: string = "", slaStatusStr: string = "") => {
        try {
            setLoading(true);
            const filterClaimData = {
                filterStatus: status === "All" ? undefined : [status],
                filterSlaStatus: !!slaStatusStr && slaStatusStr !== "All" ? [slaStatusStr] : !!slaStatusStr && slaStatusStr === "All" ? undefined : selectedSlaStatus === "All" ? undefined : [selectedSlaStatus],
                filterKeyword: isClearKeyword ? undefined : keywordClaim ? keywordClaim : undefined,
                filterDateFrom: isClearDateFilter ? undefined : startDate ? startDate : selectedStartDate ? selectedStartDate : undefined,
                filterDateTo: isClearDateFilter ? undefined : endDate ? endDate : selectedEndDate ? selectedEndDate : undefined
            };
            const params: ListClaimRequest = {
                status: filterClaimData.filterStatus,
                sla_status: filterClaimData.filterSlaStatus,
                keyword: filterClaimData.filterKeyword,
                date_from: filterClaimData.filterDateFrom,
                date_to: filterClaimData.filterDateTo,
                limit,
                page,
                channel
            };
            const response: AxiosResponse<ListClaimResponse> = await claimService.get(ApiURL.claims, { params });
            if (response) {
                setCurrentPage(page);
                setTotalData(response.data.total);
                setData(response.data.data);
                setLocalStorage("filterClaimData", filterClaimData);
            }
        } catch (error: any) {
            handleResponseError(error);
        } finally {
            setCurrentSelectedDate(isClearDateFilter ? "" : startDate && endDate ? `${startDate}${delimiter}${endDate}` : selectedStartDate && selectedEndDate ? `${selectedStartDate}${delimiter}${selectedEndDate}` : "");
            setIsModalChangeClaimStatusOpen(false);
            setLoading(false);
        }
    };

    const fetchOptionDocuments = async (categoryOrChannelId: string, claimId: string) => {
        try {
            setLoading(true);
            let responseOptionDocuments;

            if (categoryOrChannelId.includes("category")) responseOptionDocuments = await claimService.get(ApiURL.claimCategoryFormsAll(categoryOrChannelId.split("=")[1]));
            else responseOptionDocuments = await claimService.get(ApiURL.claimChannelFormsAll(categoryOrChannelId.split("=")[1]));

            if (responseOptionDocuments) {
                const dataByClaimId: any = data.length > 0 && !!claimId ? data.find(obj => obj.id === claimId) : {};
                const docClaimConfig = dataByClaimId.claim_config.length > 0 ? dataByClaimId.claim_config.filter((doc: any) => doc.type.toLowerCase() === "file" || doc.type.toLowerCase() === "file multiple").map((doc: any) => ({ name: forLabelString(doc), value: doc.name || "-", criteria: doc.criteria || "-", definition: doc.definition || "-", message: `icon${delimiter}${doc?.pending_reason_message?.en || "-"}` })) : [];
                const docClaimConfigFields = dataByClaimId.claim_config.length > 0 ? dataByClaimId.claim_config.filter((doc: any) => doc.type.toLowerCase() === "fields" && doc.fields.length > 0).map((a: any) => a.fields.filter((doc: any) => doc.type.toLowerCase() === "file" || doc.type.toLowerCase() === "file multiple").map((doc: any) => ({ name: forLabelString(doc), value: `${doc?.name}-fields.${doc?.name}` || "-", criteria: doc.criteria || "-", definition: doc.definition || "-", message: `icon${delimiter}${doc?.pending_reason_message?.en || "-"}` }))).flat() : [];
                const docClaimCategoryForm = responseOptionDocuments.data?.data.filter((doc: any) => doc.type.toLowerCase() === "file" || doc.type.toLowerCase() === "file multiple").map((doc: any) => ({ name: forLabelString(doc), value: doc.name || "-", criteria: doc.criteria || "-", definition: doc.definition || "-", message: `icon${delimiter}${doc?.pending_reason_message?.en || "-"}` })) || [];
                const docClaimCategoryFormFields = responseOptionDocuments.data?.data.filter((doc: any) => doc.type.toLowerCase() === "fields" && doc.fields.length > 0).map((a: any) => a.fields.filter((doc: any) => doc.type.toLowerCase() === "file" || doc.type.toLowerCase() === "file multiple")).map((doc: any) => ({ name: forLabelString(doc), value: `${doc?.name}-fields.${doc?.name}` || "-", criteria: doc.criteria || "-", definition: doc.definition || "-", message: `icon${delimiter}${doc?.pending_reason_message?.en || "-"}` })).flat() || [];
                setDocumentList([...docClaimCategoryForm, ...docClaimCategoryFormFields, ...docClaimConfig, ...docClaimConfigFields]);
            }
        } catch (error: any) {
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (newTab: string) => {
        setTab(newTab);
        setCurrentPage(1);
        fetchClaims(1, itemsPerPage, newTab).then();
    };

    const handlePageChange = (newPage: number) => {
        fetchClaims(newPage, itemsPerPage, tab).then();
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        fetchClaims(1, newItemsPerPage, tab).then();
    };

    const handleChangeSelectedDocument = (value: string) => {
        setLackOfDocumentList(prev =>
            prev.includes(value) ? prev.filter(option => option !== value) : [...prev, value]
        );
    };

    const searchClaim = () => fetchClaims(1, itemsPerPage, tab).then();

    const setFilterDate = (value: string, isStartDate: boolean) => {
        if (isStartDate) {
            setSelectedStartDate(value);
            setSelectedEndDate("");
            setIsSelectedStartDateChange(true);
            setTimeout(() => setIsSelectedStartDateChange(false), 500);
        } else {
            setSelectedEndDate(value);
        }
    };

    const filterDate = () => {
        setIsFilterDateModal(false);
        fetchClaims(1, itemsPerPage, tab).then();
    };

    const filterSlaStatus = (value: string) => {
        setSelectedSlaStatus(value);
        fetchClaims(1, itemsPerPage, tab, false, false, selectedStartDate, selectedEndDate, value).then();
    };

    const handleClearKeywordClaim = () => {
        setKeywordClaim("");
        fetchClaims(1, itemsPerPage, tab, true).then();
    };

    const handleClearFilterDate = () => {
        setSelectedStartDate("");
        setSelectedEndDate("");
        setIsFilterDateModal(false);
        fetchClaims(1, itemsPerPage, tab, false, true).then();
    };

    const handleCloseFilterDateModal = () => {
        if (!!currentSelectedDate) {
            const currentDateValue = currentSelectedDate.split(delimiter);
            const currentStartDateValue = currentDateValue && currentDateValue.length > 1 ? currentDateValue[0] : "";
            const currentEndDateValue = currentDateValue && currentDateValue.length > 1 ? currentDateValue[1] : "";
            setSelectedStartDate(currentStartDateValue);
            setSelectedEndDate(currentEndDateValue);
            setIsFilterDateModal(false);
            fetchClaims(1, itemsPerPage, tab, false, false, currentStartDateValue, currentEndDateValue).then();
        } else {
            setSelectedStartDate("");
            setSelectedEndDate("");
            setIsFilterDateModal(false);
            fetchClaims(1, itemsPerPage, tab, false, true).then();
        }
    };

    const handleChangeClaimStatus = (claim: string) => {
        if (!checkOtherRequired(1, getNewDataClaim(3, claim)) && !checkOtherRequired(2, getNewDataClaim(3, claim)) && !checkOtherRequired(3, getNewDataClaim(3, claim))) setIsDisableClaimStatusValid(false);
        else setIsDisableClaimStatusValid(true);

        if (checkOtherRequired(1, getNewDataClaim(3, claim))) fetchOptionDocuments(getNewDataClaim(6, claim), getNewDataClaim(0, claim)).then();

        setNewDataClaimStatus(claim);
        setIsModalChangeClaimStatusOpen(true);
    };

    const updateClaimStatus = async () => {
        /* TODO should be move as a config in BE */
        if (getNewDataClaim(4) !== "0") {
            if (checkOtherRequired(2, getNewDataClaim(3)) && newApprovedAmount < 1) return;
            else if (checkOtherRequired(3, getNewDataClaim(3)) && !noteChangeClaimStatus) return;
            else if (checkOtherRequired(1, getNewDataClaim(3)) && (!noteChangeClaimStatus || (!!lackOfDocumentList && lackOfDocumentList.length < 1))) return;
        }
        try {
            setLoading(true);
            const responseUpdateStatusClaim = await claimService.put(ApiURL.claimUpdateStatus(getNewDataClaim(0)), {
                status: getNewDataClaim(3),
                amount_approved: newApprovedAmount,
                note: noteChangeClaimStatus,
                lack_of_documents: checkOtherRequired(1, getNewDataClaim(3)) ? lackOfDocumentList : undefined
            });
            if (responseUpdateStatusClaim) {
                toastNotification("Claim status updated successfully!");
                fetchClaims(currentPage, itemsPerPage, tab).then();
            }
        } catch (error: any) {
            const msg = error?.response?.status === 403 ? `Your role is not eligible to change claim status to ${getNewDataClaim(3)}!` : (error?.response?.data?.message || "Failed to update claim status!");
            toastNotification(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    const getOptionsForUpdateClaimStatus = (currentStatus: string, id: string, number: string, claimValue: number, currency: string, categoryOrChannelId: string) => {
        const statusMap: Record<string, { name: string; label: string; }[]> = {};
        claimStatusConfigurations
            .filter((status: any) => status.role && status.role
                .map((r: string) => r.toLowerCase()).includes(user.role.toLowerCase()))
            .forEach((status: any) => {
                if (Array.isArray(status.status_required)) {
                    status.status_required.forEach((reqStatus: any) => {
                        if (!statusMap[reqStatus]) statusMap[reqStatus] = [];
                        statusMap[reqStatus].push({ name: status.status, label: status.status });
                    });
                }
        });

        const options = statusMap[currentStatus] || [];
        return options.map((status: any) => ({
            label: status.label,
            value: `${id}${delimiter}${number}${delimiter}${currentStatus}${delimiter}${status.label}${delimiter}${claimValue}${delimiter}${currency}${delimiter}${categoryOrChannelId}`
        }));
    };

    const checkOtherRequired = (label: number, claimStatus: string) => {
        switch (label) {
            case 1:
                const lackOfDocumentString: string = "lack_of_documents";
                return claimStatusConfigurations.some((status: any) => claimStatus === status.status && status.other_required && status.other_required.length > 0 && status.other_required.some((item: any) => item.name === lackOfDocumentString));
            case 2:
                const amountApprovedString: string = "amount_approved";
                return claimStatusConfigurations.some((status: any) => claimStatus === status.status && status.other_required && status.other_required.length > 0 && status.other_required.some((item: any) => item.name === amountApprovedString));
            case 3:
                const noteString: string = "note";
                return claimStatusConfigurations.some((status: any) => claimStatus === status.status && status.other_required && status.other_required.length > 0 && status.other_required.some((item: any) => item.name === noteString));
            default:
                return false;
        }
    };

    const handleChangeDataClaimStatus = (label: number, value: string) => {
        switch (label) {
            case 1:
                setNewApprovedAmount(parseMoneyString(value));
                setIsDisableClaimStatusValid(!(parseMoneyString(value) > 0));
                break;
            case 2:
                setNoteChangeClaimStatus(value);
                setIsDisableClaimStatusValid(!value);
                break;
            case 3:
                setNoteChangeClaimStatus(value);
                setIsDisableClaimStatusValid(!value || (!!lackOfDocumentList && lackOfDocumentList.length < 1));
                break;
        }
    };

    const closeModalClaimStatus = () => {
        setNewApprovedAmount(0);
        setNoteChangeClaimStatus("");
        setIsModalChangeClaimStatusOpen(false);
    };
    
    const getNewDataClaim = (index: number, claim: string = "") => {
        if (!!claim) return claim.split(delimiter)[index];
        else return newDataClaimStatus.split(delimiter)[index];
    };

    const claimStatusColor = (statusPar: string) => {
        if (statusPar.toLowerCase() === "submitted") return "#7B5D21";
        else if (statusPar.toLowerCase() === "closed") return "#58585B";
        else if (statusPar.toLowerCase() === "acknowledged" || statusPar.toLowerCase().includes("review")) return "#00AB4F";
        else if (statusPar.toLowerCase() === "rejected" || statusPar.toLowerCase().includes("lack")) return primaryRed;
        else return primary;
    };

    const goToClaimExportPage = () => router.push(`${path}/export`);

    const downloadReport = async () => {
        if (!selectedStartDate || !selectedEndDate) {
            toastNotification("Please select date range first!", "error");
            return;
        }

        try {
            setLoading(true);
            const params = {
                output: "File",
                date_from: selectedStartDate,
                date_to: selectedEndDate
            };
            const responseFileClaimReport: any = await claimService.get(ApiURL.claimsExport, { params });
            if (!!responseFileClaimReport) window.location = responseFileClaimReport.data.file;
        } catch (error: any) {
            toastNotification("Failed to download claim report!", "error");
        } finally {
            setLoading(false);
        }
    };

    const goToDetail = (claimId: string) => {
        router.push(`${path}/detail/${claimId}`);
    };

    const goToImportPage = () => router.push(`${path}/import`);

    return (
        <div className="mx-auto py-5 px-7">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
                <p className={`font-bold text-lg ${isMobileView && "mb-2"}`}>{headerPage.pageName}</p>
                <div className="flex flex-col lg:flex-row items-center justify-end">
                    <div className="w-full lg:w-80 mr-0 lg:mr-5 mb-3 lg:mb-0">
                        <div onClick={() => setIsFilterDateModal(true)} className={`shadow bg-white clickable py-2 pl-5 pr-1.5 rounded-md flex items-center justify-between`}>
                            <p className="text-xs">{selectedStartDate && selectedEndDate ? startDateAndEndDateView(selectedStartDate, selectedEndDate) : "Date"}</p>
                            <div>{CalenderIcon(primary, "30", "30", "0 -4 25 24")}</div>
                        </div>
                    </div>
                    <div className="w-full lg:w-24 mr-0 lg:mr-5 mb-3 lg:mb-0">
                        <Select chevronColor={primary} placeholderSelectClassName="truncate" additionalClassNameSelect="pl-4 shadow h-[46px]" withBorder={false} value={selectedSlaStatus} onChange={(value) => filterSlaStatus(value.toString())} options={slaStatusOptions}/>
                    </div>
                    <div className="w-full lg:w-80 mr-0 lg:mr-5 mb-3 lg:mb-0">
                        <Input key={tab} value={keywordClaim} onChange={(value) => setKeywordClaim(value.toString())} onEnter={searchClaim} onClear={handleClearKeywordClaim} placeholder="Search" icon={searchIcon()} withBorder={false} />
                    </div>
                    <Button additionalClassName={`w-full lg:w-fit justify-center lg:justify-between ${hasUpdatePermission && "mr-0 lg:mr-3 mb-3 lg:mb-0"}`} onClick={hasReadReportPermission ? () => downloadReport() : () => goToClaimExportPage()} variant="warning" withIcon={true}>
                        {DownloadIcon("#000")}
                        <span className="ml-1">Export</span>
                    </Button>
                    {hasCreatePermission && (
                        <Button additionalClassName="w-full lg:w-fit lg:ml-1 justify-center lg:justify-between" onClick={goToImportPage} variant="warning" withIcon={true}>
                            {UploadIcon("#000", "16", "17", "0 0 24 24")}
                            <span className="ml-1">Import with preview</span>
                        </Button>
                    )}
                </div>
            </div>
            {isMobileView ? (
                <Select additionalClassNameSelect="pl-4 shadow mb-3 h-[46px]" withBorder={false} value={tab} onChange={(event) => handleTabChange(event.toString())} options={claimStatusOptions}/>
            ) : (
                <div className="overflow-x-auto sm:scrollable text-center flex items-center justify-start h-16 bg-white rounded-md mb-3 shadow">
                    {claimStatusOptions.map((cs, csIndex) => (
                        <div key={`tab-${cs.value}-${csIndex}`} onClick={() => handleTabChange(cs.value)} className={`cursor-pointer h-full flex items-center justify-center px-5 ${tab === cs.value && "border-b-[3px] border-primary"}`}>
                            <p title={cs?.label || "-"} className={`truncate-2-lines text-sm mr-3 ${tab === cs.value && "font-semibold text-primary"}`}>{cs?.label || "-"}</p>
                            <p className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${getPaddingClass(totalData)} ${tab !== cs.value && "hidden"}`}>
                                {totalData > 99 ? 99 : totalData}{totalData > 99 && (<span style={{fontSize: "10px"}}>+</span>)}</p>
                        </div>
                    ))}
                </div>
            )}
            {data.length > 0 ? (
                <div className="relative bg-white rounded-md shadow-md">
                    <div style={{minHeight: "60vh"}} className="overflow-x-auto sm:scrollable">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No.</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Claim Number</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Name</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan Name</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Benefit</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Currency</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Requested Amount</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Approved Amount</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submission Date</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Updated Date</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((d, index) => (
                                <tr key={`${index}-${d.id}`} style={{backgroundColor: d.sla_status === slaStatus[2] ? primaryRedLightForeground : d.sla_status === slaStatus[1] ? primaryYellowLightForeground : "white"}}>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.number || "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.policy_data?.policy_holder?.name || "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.package?.plan?.name || "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.benefit?.description_en || "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.policy_data?.declarations?.transaction_data?.insurance?.currency || "IDR"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{moneyFormatter(d.policy_data?.declarations?.transaction_data?.insurance?.currency ? d.policy_data?.declarations?.transaction_data?.insurance?.currency : undefined).format(d.claim.find((d: any) => d.type === "Number" && d.name === "claim")?.value || 0) || "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{moneyFormatter(d.policy_data?.declarations?.transaction_data?.insurance?.currency ? d.policy_data?.declarations?.transaction_data?.insurance?.currency : undefined).format(d.amount_approved || 0) || "-"}</td>
                                    {!hasUpdatePermission ? (
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-semibold" style={{color: claimStatusColor(d.status)}}>{d.status || "-"}</td>
                                    ) : (
                                        <td className="px-6 py-3 whitespace-nowrap text-sm">
                                            <div className="w-60">
                                                <Select bgSelect="bg-transparent" withBorder={false} isPriorityPlaceholder={true} placeholderSelect={d.status || "-"} value={d.status}
                                                        placeholderStyle={{ fontWeight: 600, color: claimStatusColor(d.status) }} onChange={(value) => handleChangeClaimStatus(value.toString())}
                                                        allOptions={claimStatusOptions.filter(item => item.value !== "All").map(item => ({ label: item.label, value: item.name }))}
                                                        options={getOptionsForUpdateClaimStatus(d.status, d.id, d.number, d.claim.find((d: any) => d.type === "Number" && d.name === "claim")?.value || 0, d.policy_data?.declarations?.transaction_data?.insurance?.currency || "0", !!d.policy ? `category_id=${d.category || ""}` : `channel_id=${d.channel || ""}`)}
                                                />
                                            </div>
                                        </td>
                                    )}
                                    <td className={`px-6 py-3 whitespace-nowrap text-sm text-gray-500`}>{!!d.submitted_at ? moment(d.submitted_at).format("LL") : "-"}</td>
                                    <td className={`px-6 py-3 whitespace-nowrap text-sm text-gray-500`}>{!!d.updated_at ? moment(d.updated_at).format("LL") : "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                                        <Button onClick={() => goToDetail(d.id)}>View</Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bottom-0 left-0 right-0 bg-white py-2 px-4 border-t border-t-gray-200">
                        <Pagination totalData={totalData} currentPage={currentPage} onPageChange={handlePageChange} onItemsPerPageChange={handleItemsPerPageChange}/>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center bg-white rounded-md py-20 shadow">
                    <NotFound width={isMobileView && "143"} height={isMobileView && "144"} size1={isMobileView && "143"} size3={isMobileView && "95"} viewBox={isMobileView && "0 0 70 70"} text="No claim data available" textClassName={isMobileView && "text-xs"}/>
                </div>
            )}
            <Modal widthClassName="w-full lg:w-[500px]" heightClassName="max-h-[70%] overflow-y-auto sm:scrollable lg:max-h-fit" isOpen={isModalChangeClaimStatusOpen} onClose={closeModalClaimStatus}>
                <div className="py-5">
                    <div className="flex items-center justify-center mb-3">{AlertCircleIcon(undefined, "70", "70", "0 0 24 24")}</div>
                    <h1 className="font-bold text-lg text-center mb-2">Are you sure?</h1>
                    <p className="text-center text-sm">Update {getNewDataClaim(1)} status</p>
                    <p className="text-center text-sm">from <span className="font-semibold">{getNewDataClaim(2)}</span> to <span className="font-semibold">{getNewDataClaim(3)}</span></p>
                    {/*TODO should be move as a config in BE*/}
                    {getNewDataClaim(4) !== "0" && checkOtherRequired(2, getNewDataClaim(3)) && (
                        <div>
                            <div className="mt-3">
                                <p className="text-xs">Requested Amount</p>
                                <Input disabled={true} value={moneyFormatter(getNewDataClaim(5) === "0" ? undefined : getNewDataClaim(5)).format(Number(getNewDataClaim(4)))}/>
                            </div>
                            <div className="mt-3">
                                <p className="text-xs">Approved Amount<span className="text-[12px] text-red-500">*</span></p>
                                <Input placeholder="1000000" isCurrency={true} currency={getNewDataClaim(5) === "0" ? undefined : getNewDataClaim(5)} min={0} max={Number(getNewDataClaim(4))} value={""} onChange={(value) => handleChangeDataClaimStatus(1, value.toString())}/>
                            </div>
                            <div className="mt-3">
                                <p className="text-xs">Note</p>
                                <TextArea placeholder="Insert note" value={""} height="h-40" onChange={(value) => setNoteChangeClaimStatus(value)}/>
                            </div>
                        </div>
                    )}
                    {checkOtherRequired(3, getNewDataClaim(3)) && (
                        <div className="mt-3">
                            <p className="text-xs">Note<span className="text-[12px] text-red-500">*</span></p>
                            <TextArea placeholder="Insert note" value={""} height="h-40" onChange={(value) => handleChangeDataClaimStatus(getNewDataClaim(3).toLowerCase().includes("lack") ? 3 : 2, value)}/>
                        </div>
                    )}
                    {checkOtherRequired(1, getNewDataClaim(3)) && (
                        <div className="mt-3">
                            <p className="text-xs mb-2">Documents<span className="text-[12px] text-red-500">*</span></p>
                            <MultipleSelect list={documentList} onChange={(value) => handleChangeSelectedDocument(value)} titleModal="Select Document" labelMultipleSelect="document"/>
                        </div>
                    )}
                    <div className="flex items-center justify-center text-center mt-4">
                        <Button variant="danger" additionalClassName="mr-2" onClick={closeModalClaimStatus}><span className="mx-3.5">No</span></Button>
                        {/*TODO should be move as a config in BE*/}
                        <Button variant="warning" disabled={isDisableClaimStatusValid && getNewDataClaim(4) !== "0"} onClick={updateClaimStatus}><span className={`mx-3 ${isDisableClaimStatusValid && "text-white"}`}>Yes</span></Button>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={isFilterDateModal} onClose={handleCloseFilterDateModal} widthClassName="w-full lg:w-[500px]" heightClassName="h-fit">
                <div className="py-6 px-4">
                    <h1 className="font-bold text-lg text-center mb-5">Date Filter</h1>
                    <div className="grid grid-cols-2 gap-4 mb-5">
                        <DatePicker initialValue={selectedStartDate} isWithShadow={false} borderDatePicker="border" label="Start Date" onSubmit={(value) => setFilterDate(value, true)} onClear={() => setFilterDate("", true)}/>
                        <DatePicker initialValue={selectedEndDate} isWithShadow={false} borderDatePicker="border" label="End Date" onSubmit={(value) => setFilterDate(value, false)} onClear={() => setFilterDate("", false)} minimumDate={selectedStartDate} isDisabled={!selectedStartDate} isForceClear={isSelectedStartDateChange}/>
                    </div>
                    <div className="flex items-center justify-center text-center">
                        <Button variant="danger" additionalClassName="mr-2" onClick={handleClearFilterDate}><span className="mx-3.5">Clear</span></Button>
                        <Button disabled={!selectedStartDate || !selectedEndDate} onClick={filterDate}><span className={`mx-3 ${(!selectedStartDate || !selectedEndDate) && "text-white"}`}>Save</span></Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
