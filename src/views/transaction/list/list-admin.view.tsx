import React, {useState, useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";
import NotFound from "@/components/not-found";
import ApiURL from "@/constants/api-url.const";
import {transactionService} from "@/services/api.service";
import Pagination from "@/components/pagination";
import {useScreen} from "@/context/screen.context";
import {primary, transactionStatus, transactionType} from "@/constants/app-common.const";
import Button from "@/components/button";
import Select from "@/components/select";
import {useAuth} from "@/context/auth.context";
import {capitalizeString, getHeaderPage, getPaddingClass, moneyFormatter, setLocalStorage, toastNotification} from "@/helpers/app.helper";
import Input from "@/components/input";
import searchIcon from "@/images/search.icon";
import DownloadIcon from "@/images/download.icon";
import UploadIcon from "@/images/upload.icon";
import Modal from "@/components/modal";
import AlertCircleIcon from "@/images/alert-circle.icon";

export const TransactionListAdminView = () => {
    const [keywordTransaction, setKeywordTransaction] = useState("");
    const [tab, setTab] = useState("All");
    const [selectedTransactionType, setSelectedTransactionType] = useState(transactionType[0].toLowerCase());
    const [data, setData] = useState<any[]>([]);
    const [details, setDetails] = useState<any>({});
    const [isModalTransactionDetailsOpen, setIsModalTransactionDetailsOpen] = useState(false);
    const [isModalChangeTransactionStatusOpen, setIsModalChangeTransactionStatusOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalData, setTotalData] = useState(0);
    const [transactionStatusOptions, setTransactionStatusOptions] = useState<any[]>([]);
    const [transactionTypeOptions, setTransactionTypeOptions] = useState<any[]>([]);
    const path = usePathname();
    const router = useRouter();
    const {isMobileView, setLoading} = useScreen();
    const {handleResponseError, permissionList, user} = useAuth();
    const channel = user?.channel || undefined;
    const headerPage = getHeaderPage(2, path, true);
    const hasUpdatePermission = permissionList.includes(`${capitalizeString(headerPage.breadcrumbsArray[0])}.${headerPage.pageName}.Update`);

    useEffect(() => {
        let statusArr = [{label: "All Transaction", value: "All"}];
        transactionStatus.forEach((t) => statusArr.push({label: t.name, value: t.name}));
        setTransactionStatusOptions(statusArr);

        const trxType: any[] = [];
        transactionType.forEach((tt) => trxType.push({ label: tt, value: tt.toLowerCase() }));
        setTransactionTypeOptions(trxType);

        fetchTransactions(currentPage, itemsPerPage, tab).then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchTransactions = async (page: number, limit: number, status: string, isClearKeyword: boolean = false, transactionTypeStr: string = "") => {
        try {
            setLoading(true);
            const filterTransactionData = {
                filterStatus: status === "All" ? undefined : status,
                filterKeyword: isClearKeyword ? undefined : keywordTransaction ? keywordTransaction : undefined,
                filterType: transactionTypeStr ? transactionTypeStr : selectedTransactionType
            };
            const params = {
                status: filterTransactionData.filterStatus,
                keyword: filterTransactionData.filterKeyword,
                type: filterTransactionData.filterType,
                limit,
                page,
                channel: user?.role?.toLowerCase() === "admin" ? undefined : channel,
            };
            const response = await transactionService.get(ApiURL.transactions, {params});
            if (response) {
                setCurrentPage(page);
                setTotalData(response.data.total);
                setData(response.data.data);
                setLocalStorage("filterTransactionData", filterTransactionData);
            }
        } catch (error: any) {
            handleResponseError(error);
        } finally {
            setLoading(false);
        }
    };

    const updateTransactionStatus = async () => {
        try {
            setLoading(true);
            const responseUpdateStatusTransaction = await transactionService.put(ApiURL.transactionUpdateStatus(details.id), { payment_info: "Paid" });
            if (responseUpdateStatusTransaction) {
                setIsModalChangeTransactionStatusOpen(false);
                setIsModalTransactionDetailsOpen(false);
                toastNotification("Transaction status updated successfully!");
                fetchTransactions(currentPage, itemsPerPage, tab).then();
            }
        } catch (error: any) {
            setIsModalChangeTransactionStatusOpen(false);
            const msg = error?.response?.status === 403 ? "Your role is not eligible to change transaction status to Paid!" : (error?.response?.data?.message || "Failed to update transaction status!");
            toastNotification(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    const totalPremium = (trx: any) => {
        const currencies = trx?.insurance?.insurance?.currencies || [];
        const currency = currencies.find((currency: any) => currency.currency_from === trx?.insurance?.currency && currency.currency_to === "IDR");
        const convertedPremium = (currency?.value ?? 1) * trx?.insurance?.premium;
        const discountType = trx?.insurance?.plan?.premium_discount_type || "";
        const discountValue = trx?.insurance?.plan?.premium_discount_value || 0;
        const premiumWithEmbeddedDiscount = discountType === "percentage" ? (convertedPremium - (discountValue / 100) * convertedPremium) : (convertedPremium - discountValue);

        let premiumWithVoucherDiscount = premiumWithEmbeddedDiscount;
        if (trx.voucher_info) premiumWithVoucherDiscount = trx.voucher_info?.data.value_type === "percentage" ? (premiumWithEmbeddedDiscount - (trx.voucher_info?.data.value / 100) * premiumWithEmbeddedDiscount) : (premiumWithEmbeddedDiscount - trx.voucher_info?.data.value);

        let finalPremium = premiumWithVoucherDiscount;
        if (trx.fees) finalPremium = premiumWithVoucherDiscount + trx.fees.map((v: any) => v.value).reduce((a: any, b: any) => { return a + b }, 0);

        return finalPremium
    };

    const handleTabChange = (newTab: string) => {
        setTab(newTab);
        setCurrentPage(1);
        fetchTransactions(1, itemsPerPage, newTab).then();
    };

    const handlePageChange = (newPage: number) => {
        fetchTransactions(newPage, itemsPerPage, tab).then();
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        fetchTransactions(1, newItemsPerPage, tab).then();
    };

    const handleViewTransactionDetails = (trx: any) => {
        setDetails(trx);
        setIsModalTransactionDetailsOpen(true);
    };

    const searchTransaction = () => fetchTransactions(1, itemsPerPage, tab).then();

    const filterTransactionType = (value: string) => {
        setSelectedTransactionType(value);
        fetchTransactions(1, itemsPerPage, tab, false, value).then();
    };
    
    const handleClearKeywordTransaction = () => {
        setKeywordTransaction("");
        fetchTransactions(1, itemsPerPage, tab, true).then();
    };

    const goToTransactionAddtPage = () => router.push(`${path}/add`);
    
    const goToTransactionExportPage = () => router.push(`${path}/export`);

    return (
        <div className="mx-auto py-5 px-7">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
                <p className={`font-bold text-lg ${isMobileView && "mb-2"}`}>{getHeaderPage(2, path, true).pageName}</p>
                <div className="flex flex-col lg:flex-row items-center justify-end">
                    <div className="w-full lg:w-24 mr-0 lg:mr-5 mb-3 lg:mb-0">
                        <Select chevronColor={primary} placeholderSelectClassName="truncate" additionalClassNameSelect="pl-4 shadow h-[46px]" withBorder={false} value={selectedTransactionType} onChange={(value) => filterTransactionType(value.toString())} options={transactionTypeOptions}/>
                    </div>
                    <div className="w-full lg:w-80 mr-0 lg:mr-5 mb-3 lg:mb-0">
                        <Input key={tab} value={keywordTransaction} onChange={(value) => setKeywordTransaction(value.toString())} onEnter={searchTransaction} onClear={handleClearKeywordTransaction} placeholder="Search" icon={searchIcon()} withBorder={false}/>
                    </div>
                    <Button additionalClassName={`w-full lg:w-fit lg:ml-1 justify-center lg:justify-between ${isMobileView ? 'mb-3' : 'mr-4'}`} onClick={goToTransactionAddtPage} variant="warning" withIcon={true}>
                        {UploadIcon("#000", "16", "17", "0 0 24 24")}
                        <span className="ml-1">Add Transaction</span>
                    </Button>
                    <Button additionalClassName="w-full lg:w-fit justify-center lg:justify-between" onClick={goToTransactionExportPage} variant="warning" withIcon={true}>
                        {DownloadIcon("#000")}
                        <span className="ml-1">Export</span>
                    </Button>
                </div>
            </div>
            {isMobileView ? (
                <Select additionalClassNameSelect="pl-4 shadow mb-3 h-[46px]" withBorder={false} value={tab} onChange={(event) => handleTabChange(event.toString())} options={transactionStatusOptions}/>
            ) : (
                <div
                    className="overflow-x-auto sm:scrollable text-center flex items-center justify-start h-16 bg-white rounded-md mb-3 shadow">
                    <div onClick={() => handleTabChange("All")}
                         className={`cursor-pointer h-full flex items-center justify-center w-1/6 mr-5 ${tab === "All" && "border-b-[3px] border-primary"}`}>
                        <p className={`text-sm mr-3 ${tab === "All" && "font-semibold text-primary"}`}>All Transaction</p>
                        <p className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${getPaddingClass(totalData)} ${tab !== "All" && "hidden"}`}>{totalData > 99 ? 99 : totalData}{totalData > 99 && (<span style={{fontSize: "10px"}}>+</span>)}</p>
                    </div>
                    {transactionStatus.map((t, tIndex) => (
                        <div key={`tab-${t.name}`} onClick={() => handleTabChange(t.name)}
                             className={`cursor-pointer h-full flex items-center justify-center w-1/6 ${tIndex !== transactionStatus.length - 1 && "mr-5"} ${tab === t.name && "border-b-[3px] border-primary"}`}>
                            <p className={`text-sm mr-3 ${tab === t.name && "font-semibold text-primary"}`}>{t.name}</p>
                            <p className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${getPaddingClass(totalData)} ${tab !== t.name && "hidden"}`}>{totalData > 99 ? 99 : totalData}{totalData > 99 && (<span style={{fontSize: "10px"}}>+</span>)}</p>
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
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Insurance Name</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan Name</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Name</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Currency</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((d, index) => (
                                <tr key={`${index}-${d.id}`} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.insurance?.insurance?.id?.name || "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.insurance?.plan?.name?.split("|")?.splice(0, 2)?.join(" - ") || "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.customer?.name || "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.insurance?.currency || "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{moneyFormatter(d.insurance?.currency ? d.insurance?.currency : undefined).format(totalPremium(d)) || "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.type ? capitalizeString(d.type) : "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm font-semibold" style={{color: transactionStatus.find((t) => t.name === d.status)?.color}}>{d.status || "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                                        <Button onClick={() => handleViewTransactionDetails(d)}>View</Button>
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
                    <NotFound isCenter={isMobileView} width={isMobileView && "143"} height={isMobileView && "144"} size1={isMobileView && "143"} size3={isMobileView && "95"} viewBox={isMobileView && "0 0 70 70"} text="No transaction data available" textClassName={isMobileView && "text-xs"}/>
                </div>
            )}
            <Modal widthClassName="w-full lg:w-[500px]" heightClassName="max-h-[70%] overflow-y-auto sm:scrollable lg:max-h-fit" isOpen={isModalTransactionDetailsOpen} onClose={() => setIsModalTransactionDetailsOpen(false)}>
                <div className="py-5">
                    <h1 className="font-bold text-lg text-center mb-2">Transaction Details</h1>
                    <div className="flex flex-col justify-between mb-3">
                        <p className="text-xs font-bold">Transaction Code</p>
                        <p className="text-sm">{details.code || "-"}</p>
                    </div>
                    <div className="flex flex-col justify-between mb-3">
                        <p className="text-xs font-bold">Insurance Name</p>
                        <p className="text-sm">{details.insurance?.insurance?.id?.name || "-"}</p>
                    </div>
                    <div className="flex flex-col justify-between mb-3">
                        <p className="text-xs font-bold">Plan Name</p>
                        <p className="text-sm">{details.insurance?.plan?.name?.split("|")?.splice(0, 2)?.join(" - ") || "-"}</p>
                    </div>
                    <div className="flex flex-col justify-between mb-3">
                        <p className="text-xs font-bold">Customer Name</p>
                        <p className="text-sm">{details.customer?.name || "-"}</p>
                    </div>
                    <div className="flex flex-col justify-between mb-3">
                        <p className="text-xs font-bold">Currency</p>
                        <p className="text-sm">{details.insurance?.currency || "-"}</p>
                    </div>
                    <div className="flex flex-col justify-between mb-3">
                        <p className="text-xs font-bold">Amount</p>
                        <p className="text-sm">{moneyFormatter(details.insurance?.currency ? details.insurance?.currency : undefined).format(totalPremium(details)) || "-"}</p>
                    </div>
                    <div className="flex flex-col justify-between mb-3">
                        <p className="text-xs font-bold">Type</p>
                        <p className="text-sm">{details.type ? capitalizeString(details.type) : "-"}</p>
                    </div>
                    <div className="flex flex-col justify-between mb-3">
                        <p className="text-xs font-bold">Status</p>
                        <p className="text-sm font-semibold" style={{color: transactionStatus.find((t) => t.name === details.status)?.color}}>{details.status || "-"}</p>
                    </div>
                    {hasUpdatePermission && details.status.toLowerCase() === "pending" && (<div className="flex items-center justify-center text-center mt-4">
                        <Button variant="warning" onClick={() => setIsModalChangeTransactionStatusOpen(true)}><span className="mx-3">Update to Paid</span></Button>
                    </div>)}
                </div>
            </Modal>
            <Modal widthClassName="w-full lg:w-[500px]" heightClassName="max-h-[70%] overflow-y-auto sm:scrollable lg:max-h-fit" isOpen={isModalChangeTransactionStatusOpen} onClose={() => setIsModalChangeTransactionStatusOpen(false)}>
                <div className="py-5">
                    <div className="flex items-center justify-center mb-3">{AlertCircleIcon(undefined, "70", "70", "0 0 24 24")}</div>
                    <h1 className="font-bold text-lg text-center mb-2">Are you sure?</h1>
                    <p className="text-center text-sm">Update transaction {details.code} status to <span className="font-semibold">Paid</span></p>
                    <div className="flex items-center justify-center text-center mt-4">
                        <Button variant="danger" additionalClassName="mr-2" onClick={() => setIsModalChangeTransactionStatusOpen(false)}><span className="mx-3.5">No</span></Button>
                        <Button variant="warning" onClick={updateTransactionStatus}><span className="mx-3">Yes</span></Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
