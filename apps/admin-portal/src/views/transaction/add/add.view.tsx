import React, {useState, useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";
import NotFound from "@/components/not-found";
import {transactionService} from "@/services/transaction/api/transaction.service";
import Pagination from "@/components/pagination";
import {useScreen} from "@/context/screen.context";
import {primary, transactionStatus, transactionType} from "@/constants/app-common.const";
import Button from "@/components/button";
import Select from "@/components/select";
import {useAuth} from "@/context/auth.context";
import {
    capitalizeString,
    getBreadcrumbs,
    getHeaderPage,
    getPaddingClass,
    moneyFormatter,
    setLocalStorage,
    toastNotification
} from "@/helpers/app.helper";
import Input from "@/components/input";
import searchIcon from "@/images/search.icon";
import DownloadIcon from "@/images/download.icon";
import UploadIcon from "@/images/upload.icon";
import Modal from "@/components/modal";
import AlertCircleIcon from "@/components/icons/alert-circle-icon";
import {ChevronLeft} from "react-feather";

export const TransactionAddView = () => {
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
    const {handleResponseError, user} = useAuth();
    const channel = user?.channel || undefined;
    const { pageName, breadcrumbsArray } = getHeaderPage(3, path, false);

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
            const response: any = await transactionService.getTransactions(params);
            if (response) {
                setCurrentPage(page);
                setTotalData(response?.total || 0);
                setData(response?.data || []);
                setLocalStorage("filterTransactionData", filterTransactionData);
            }
        } catch (error: any) {
            handleResponseError(error);
        } finally {
            setLoading(false);
        }
    };

    const addTransaction = async () => {
        try {
            setLoading(true);
            const responseUpdateStatusTransaction = await transactionService.updateTransactionStatus(details.id, { payment_info: "Paid" });
            if (responseUpdateStatusTransaction) {
                setIsModalChangeTransactionStatusOpen(false);
                setIsModalTransactionDetailsOpen(false);
                toastNotification("Transaction status updated successfully!");
                fetchTransactions(currentPage, itemsPerPage, tab).then();
            }
        } catch (error: any) {
            setIsModalChangeTransactionStatusOpen(false);
            const msg = error?.response?.status === 403 ? "Your role is not eligible to change transaction status to Paid!" : (error?.response?.data?.message || "Failed to update claim status!");
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

    const searchPolicy = () => fetchTransactions(1, itemsPerPage, tab).then();

    const filterTransactionType = (value: string) => {
        setSelectedTransactionType(value);
        fetchTransactions(1, itemsPerPage, tab, false, value).then();
    };

    const handleClearKeywordTransaction = () => {
        setKeywordTransaction("");
        fetchTransactions(1, itemsPerPage, tab, true).then();
    };

    const goToTransactionListPage = () => router.push(path?.split("/")?.slice(0, -1)?.join("/"));

    return (
        <div className="mx-auto">
            <div className="overflow-x-auto sm:scrollable bg-white flex items-center justify-between mb-5 py-5 px-7">
                <div>
                    {getBreadcrumbs(breadcrumbsArray)}
                    <p className="font-bold text-lg">{pageName}</p>
                </div>
                <div className="flex">
                    <div onClick={goToTransactionListPage} className="flex items-center justify-between cursor-pointer mr-4">
                        <ChevronLeft color="red" width="30" height="15"/>
                        <p className="text-sm text-red-500">Back</p>
                    </div>
                    <Button variant="warning" onClick={addTransaction}><span className="mx-3">Save</span></Button>
                </div>
            </div>
            <div className="pt-2 pb-5 px-7">
                <div className="bg-red-700 p-5 rounded-md">
                    <div>
                        <p className="text-xs font-bold">Channel</p>
                        {/*<Select chevronColor={primary} placeholderSelectClassName="truncate" additionalClassNameSelect="pl-4 shadow h-[46px]" withBorder={false} value={selectedInsurance} onChange={(value) => { setSelectedInsurance(value.toString())}} options={insuranceOptions}/>*/}
                    </div>
                </div>
            </div>
        </div>
    );
};
