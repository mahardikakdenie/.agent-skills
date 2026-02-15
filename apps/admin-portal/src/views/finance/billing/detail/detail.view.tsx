import React, {useEffect, useState} from "react";
import {useParams, usePathname, useRouter} from "next/navigation";
import {ChevronLeft} from "react-feather";
import moment from "moment/moment";
import {financeService} from "@/services/finance/api/finance.service";
import {useScreen} from "@/context/screen.context";
import {useAuth} from "@/context/auth.context";
import {capitalizeString, capitalizeStringWithChar, getBreadcrumbs, getHeaderPage, moneyFormatter} from "@/helpers/app.helper";
import Pagination from "@/components/pagination";
import NotFound from "@/components/not-found";
import DownloadIcon from "@/images/download.icon";
import Button from "@/components/button";

export const FinanceBillingDetailView = () => {
    const [data, setData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalData, setTotalData] = useState(0);
    const path = usePathname();
    const router = useRouter();
    const { id } = useParams();
    const { isMobileView, setLoading } = useScreen();
    const { handleResponseError, user } = useAuth();
    const { pageName, breadcrumbsArray } = getHeaderPage(3, path, false);

    useEffect(() => {
        fetchDataFinanceBillingDetail(currentPage, itemsPerPage).then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchDataFinanceBillingDetail = async (page: number, limit: number) => {
        try {
            setLoading(true);
            const params = {
                company: user.channel,
                page,
                pageSize: limit
            };
            if (!id) return;
            const responseFinanceBillingDetail: any = await financeService.getBillingById(id.toString(), params);
            if (responseFinanceBillingDetail) {
                setCurrentPage(page);
                setTotalData(responseFinanceBillingDetail?.meta?.total || 0);
                setData(responseFinanceBillingDetail?.data || []);
            }
        } catch (error: any) {
            handleResponseError(error);
        } finally {
            setLoading(false);
        }
    }

    const handlePageChange = (newPage: number) => {
        fetchDataFinanceBillingDetail(newPage, itemsPerPage).then();
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        fetchDataFinanceBillingDetail(1, newItemsPerPage).then();
    };

    const goToBillingPage = () => {
        router.push(path.split("/").slice(0, -2).join("/"));
    };

    const goToExportBillingDetail = () => {
        router.push(`${path}/export`);
    };

    return (
        <div className="mx-auto">
            <div className="overflow-x-auto sm:scrollable bg-white flex items-center justify-between mb-5 py-5 px-7">
                <div>
                    {getBreadcrumbs(breadcrumbsArray)}
                    <p className="font-bold text-lg">{pageName}</p>
                </div>
                <div className="flex items-center">
                    <div onClick={goToBillingPage} className="flex items-center justify-between cursor-pointer mr-5">
                        <ChevronLeft color="red" width="30" height="15"/>
                        <p className="text-sm text-red-500">Back</p>
                    </div>
                    <Button additionalClassName="w-full lg:w-fit justify-center lg:justify-between" onClick={goToExportBillingDetail} variant="warning" withIcon={true}>
                        {DownloadIcon("#000")}
                        <span className="ml-1">Export</span>
                    </Button>
                </div>
            </div>
            <div className="pb-5 px-7">
                <div className="overflow-x-auto sm:scrollable bg-white rounded-md mb-3 py-5 px-7 shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                        <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Number</p>
                        <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                            <p className="hidden lg:block lg:mr-2">:</p>
                            <p>{data?.[0]?.billings?.billing_no || "-"}</p>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                        <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Total Transaction Amount</p>
                        <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                            <p className="hidden lg:block lg:mr-2">:</p>
                            <p>{!!data?.[0]?.billings?.total ? moneyFormatter().format(data[0].billings.total) : "-"}</p>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                        <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Total Commission Amount</p>
                        <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                            <p className="hidden lg:block lg:mr-2">:</p>
                            <p>{!!data?.[0]?.billings?.amount ? moneyFormatter().format(data[0].billings.amount) : "-"}</p>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                        <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Billing Date</p>
                        <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                            <p className="hidden lg:block lg:mr-2">:</p>
                            <p>{!!data?.[0]?.billings?.created_at ? moment(data[0].billings.created_at).format("LL") : "-"}</p>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                        <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Status</p>
                        <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                            <p className="hidden lg:block lg:mr-2">:</p>
                            <p>{!!data?.[0]?.billings?.status ? capitalizeStringWithChar(data[0].billings.status, "-") : "-"}</p>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                        <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Type</p>
                        <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                            <p className="hidden lg:block lg:mr-2">:</p>
                            <p>{!!data?.[0]?.billings?.type ? capitalizeString(data[0].billings.type) : "-"}</p>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                        <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Company Name</p>
                        <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                            <p className="hidden lg:block lg:mr-2">:</p>
                            <p>{!!data?.[0]?.billings?.company_name ? data[0].billings.company_name : "-"}</p>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
                        <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Period</p>
                        <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                            <p className="hidden lg:block lg:mr-2">:</p>
                            <p>{!!data?.[0]?.billings?.transaction_period ? data[0].billings.transaction_period : "-"}</p>
                        </div>
                    </div>
                </div>
                {data.length > 0 ? (
                    <div className="relative bg-white rounded-md shadow-md">
                        <div className="overflow-x-auto sm:scrollable">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-white">
                                <tr>
                                    <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No.</th>
                                    <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction Number</th>
                                    <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan Name</th>
                                    <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Insurance Company Name</th>
                                    <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction Date</th>
                                    <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Commission Percentage</th>
                                    <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Commission Amount</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {data.map((d, index) => (
                                    <tr key={`${index}-${d.id}`} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.invoice_no || "-"}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.details?.plan_name || "-"}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.details?.insurance_name || "-"}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{!!d.amount ? moneyFormatter().format(d.amount) : "-"}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{!!d.details?.transaction_date ? moment(d.details.transaction_date).format("LL") : "-"}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.commission_percentage || "0"}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{!!d.commission_amount ? moneyFormatter().format(d.commission_amount) : "-"}</td>
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
                        <NotFound width={isMobileView && "143"} height={isMobileView && "144"} size1={isMobileView && "143"} size3={isMobileView && "95"} viewBox={isMobileView && "0 0 70 70"} text="No billing data available" textClassName={isMobileView && "text-xs"}/>
                    </div>
                )}
            </div>
        </div>
    );
};
