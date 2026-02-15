import React, {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {useScreen} from "@/context/screen.context";
import {capitalizeString, capitalizeStringWithChar, getHeaderPage, moneyFormatter} from "@/helpers/app.helper";
import NotFound from "@/components/not-found";
import {financeService} from "@/services/finance/api/finance.service";
import {useAuth} from "@/context/auth.context";
import moment from "moment/moment";
import Button from "@/components/button";
import Pagination from "@/components/pagination";

export const FinanceBillingView = () => {
    const [data, setData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalData, setTotalData] = useState(0);
    const path = usePathname();
    const router = useRouter();
    const { handleResponseError, user } = useAuth();
    const { isMobileView, setLoading } = useScreen();

    useEffect(() => {
        fetchFinanceBilling(currentPage, itemsPerPage).then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchFinanceBilling = async (page: number, limit: number) => {
        try {
            setLoading(true);
            const params = {
                company: user.channel,
                page,
                pageSize: limit
            };
            const response: any = await financeService.getBillings(params);
            if (response) {
                setCurrentPage(page);
                setTotalData(response?.meta?.total || 0);
                setData(response?.data || []);
            }
        } catch (error: any) {
            handleResponseError(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        fetchFinanceBilling(newPage, itemsPerPage).then();
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        fetchFinanceBilling(1, newItemsPerPage).then();
    };

    const goToDetail = (policyId: string) => {
        router.push(`${path}/detail/${policyId}`);
    };

    return (
        <div className="mx-auto py-5 px-7">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
                <p className={`font-bold text-lg ${isMobileView && "mb-2"}`}>{getHeaderPage(2, path, true).pageName}</p>
            </div>
            {data.length > 0 ? (
                <div className="relative bg-white rounded-md shadow-md">
                    <div style={{minHeight: "60vh"}} className="overflow-x-auto sm:scrollable">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No.</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Billing Number</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Billing Date</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction Period</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company Name</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((d, index) => (
                                <tr key={`${index}-${d.id}`} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.billing_no || "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{!!d.created_at ? moment(d.created_at).format("LL") : "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.transaction_period || "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{!!d.type ? capitalizeString(d.type) : "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.company_name || "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{!!d.amount ? moneyFormatter().format(d.amount) : "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{!!d.status ? capitalizeStringWithChar(d.status, "-") : "-"}</td>
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
                    <NotFound width={isMobileView && "143"} height={isMobileView && "144"} size1={isMobileView && "143"} size3={isMobileView && "95"} viewBox={isMobileView && "0 0 70 70"} text="No billing data available" textClassName={isMobileView && "text-xs"}/>
                </div>
            )}
        </div>
    );
};
