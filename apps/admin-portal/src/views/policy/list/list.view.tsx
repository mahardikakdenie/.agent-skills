import React, {useState, useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";
import NotFound from "@/components/not-found";
import {ListPolicyRequest, Policy} from "@/types/policy";
import {policyService} from "@/services/policy/api/policy.service";
import moment from "moment";
import Pagination from "@/components/pagination";
import {useScreen} from "@/context/screen.context";
import {policyStatus} from "@/constants/app-common.const";
import Button from "@/components/button";
import Select from "@/components/select";
import {useAuth} from "@/context/auth.context";
import {getHeaderPage, getPaddingClass, setLocalStorage} from "@/helpers/app.helper";
import Input from "@/components/input";
import searchIcon from "@/images/search.icon";
import DownloadIcon from "@/images/download.icon";

export const PolicyListView = () => {
    const [keywordPolicy, setKeywordPolicy] = useState("");
    const [tab, setTab] = useState("All");
    const [data, setData] = useState<Policy[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalData, setTotalData] = useState(0);
    const [policyStatusOptions, setPolicyStatusOptions] = useState<any[]>([]);
    const path = usePathname();
    const router = useRouter();
    const {isMobileView, setLoading} = useScreen();
    const {handleResponseError, user} = useAuth();
    const channel = user?.channel || undefined;
    useEffect(() => {
        let statusArr = [{label: "All Policy", value: "All"}];
        policyStatus.forEach((ps) => statusArr.push({label: ps.name, value: ps.name}));
        setPolicyStatusOptions(statusArr);
        fetchPolicies(currentPage, itemsPerPage, tab).then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchPolicies = async (page: number, limit: number, status: string, isClearKeyword: boolean = false) => {
        try {
            setLoading(true);
            const filterPolicyData = {
                filterStatus: status === "All" ? undefined : status,
                filterKeyword: isClearKeyword ? undefined : keywordPolicy ? keywordPolicy : undefined,
            };
            const params: ListPolicyRequest = {
                status: filterPolicyData.filterStatus,
                keyword: filterPolicyData.filterKeyword,
                limit,
                page,
                channel
            };
            const response: any = await policyService.getPolicies(params as any);
            if (response) {
                setCurrentPage(page);
                setTotalData(response.total);
                setData(response.data);
                setLocalStorage("filterPolicyData", filterPolicyData);
            }
        } catch (error: any) {
            handleResponseError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (newTab: string) => {
        setTab(newTab);
        setCurrentPage(1);
        fetchPolicies(1, itemsPerPage, newTab).then();
    };

    const handlePageChange = (newPage: number) => {
        fetchPolicies(newPage, itemsPerPage, tab).then();
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        fetchPolicies(1, newItemsPerPage, tab).then();
    };

    const searchPolicy = () => fetchPolicies(1, itemsPerPage, tab).then();

    const handleClearKeywordPolicy = () => {
        setKeywordPolicy("");
        fetchPolicies(1, itemsPerPage, tab, true).then();
    };

    const goToPolicyExportPage = () => router.push(`${path}/export`);

    const goToDetail = (policyId: string) => {
        router.push(`${path}/detail/${policyId}`);
    };

    return (
        <div className="mx-auto py-5 px-7">
            <div
                className="overflow-x-auto sm:scrollable flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
                <p className={`font-bold text-lg ${isMobileView && "mb-2"}`}>{getHeaderPage(2, path, true).pageName}</p>
                <div className="flex flex-col lg:flex-row items-center justify-end">
                    <div className="w-full lg:w-80 mr-0 lg:mr-5 mb-3 lg:mb-0">
                        <Input key={tab} value={keywordPolicy} onChange={(value) => setKeywordPolicy(value.toString())}
                               onEnter={searchPolicy} onClear={handleClearKeywordPolicy} placeholder="Search"
                               icon={searchIcon()} withBorder={false}/>
                    </div>
                    <Button additionalClassName="w-full lg:w-fit justify-center lg:justify-between"
                            onClick={goToPolicyExportPage} variant="warning" withIcon={true}>
                        {DownloadIcon("#000")}
                        <span className="ml-1">Export</span>
                    </Button>

                </div>
            </div>
            {isMobileView ? (
                <Select additionalClassNameSelect="pl-4 shadow mb-3 h-[46px]" withBorder={false} value={tab}
                        onChange={(event) => handleTabChange(event.toString())} options={policyStatusOptions}/>
            ) : (
                <div
                    className="overflow-x-auto sm:scrollable text-center flex items-center justify-start h-16 bg-white rounded-md mb-3 shadow">
                    <div onClick={() => handleTabChange("All")}
                         className={`cursor-pointer h-full flex items-center justify-center w-1/6 mr-5 ${tab === "All" && "border-b-[3px] border-primary"}`}>
                        <p className={`text-sm mr-3 ${tab === "All" && "font-semibold text-primary"}`}>All Policy</p>
                        <p className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${getPaddingClass(totalData)} ${tab !== "All" && "hidden"}`}>
                            {totalData > 99 ? 99 : totalData}{totalData > 99 && (
                            <span style={{fontSize: "10px"}}>+</span>)}</p>
                    </div>
                    {policyStatus.map((ps, psIndex) => (
                        <div key={`tab-${ps.name}`} onClick={() => handleTabChange(ps.name)}
                             className={`cursor-pointer h-full flex items-center justify-center w-1/6 ${psIndex !== policyStatus.length - 1 && "mr-5"} ${tab === ps.name && "border-b-[3px] border-primary"}`}>
                            <p className={`text-sm mr-3 ${tab === ps.name && "font-semibold text-primary"}`}>{ps.name}</p>
                            <p className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${getPaddingClass(totalData)} ${tab !== ps.name && "hidden"}`}>
                                {totalData > 99 ? 99 : totalData}{totalData > 99 && (
                                <span style={{fontSize: "10px"}}>+</span>)}</p>
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
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer
                                    Name
                                </th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Policy
                                    Number
                                </th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan
                                    Name
                                </th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Issued
                                    Date
                                </th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((d, index) => (
                                <tr key={`${index}-${d.id}`} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.policy_holder?.name || "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.number || "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.policy_products?.plan_data?.name || "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm font-semibold"
                                        style={{color: policyStatus.find((ps) => ps.name === d.status)?.color}}>{d.status || "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{!!d.created_at ? moment(d.created_at).format("LL") : "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                                        <Button onClick={() => goToDetail(d.id)}>View</Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bottom-0 left-0 right-0 bg-white py-2 px-4 border-t border-t-gray-200">
                        <Pagination totalData={totalData} currentPage={currentPage} onPageChange={handlePageChange}
                                    onItemsPerPageChange={handleItemsPerPageChange}/>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center bg-white rounded-md py-20 shadow">
                    <NotFound width={isMobileView && "143"} height={isMobileView && "144"} size1={isMobileView && "143"}
                              size3={isMobileView && "95"} viewBox={isMobileView && "0 0 70 70"}
                              text="No policy data available" textClassName={isMobileView && "text-xs"}/>
                </div>
            )}
        </div>
    );
};
