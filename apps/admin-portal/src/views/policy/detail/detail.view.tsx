import React, {useEffect, useState} from "react";
import {useParams, usePathname, useRouter} from "next/navigation";
import {ChevronLeft} from "react-feather";
import {policyService} from "@/services/policy/api/policy.service";
import {Policy} from "@/types/policy";
import NotFound from "@/components/not-found";
import {useScreen} from "@/context/screen.context";
import {useAuth} from "@/context/auth.context";
import {capitalizeStringWithChar, getBreadcrumbs, getHeaderPage, moneyFormatter} from "@/helpers/app.helper";

export const PolicyDetailView = () => {
    const [data, setData] = useState<Policy>();
    const path = usePathname();
    const router = useRouter();
    const { id } = useParams();
    const { isMobileView, setLoading } = useScreen();
    const { handleResponseError } = useAuth();
    const { pageName, breadcrumbsArray } = getHeaderPage(3, path, false);

    useEffect(() => {
        const fetchDataPolicyDetail = async () => {
            try {
                setLoading(true);
                if (!id) return;
                const responsePolicyDetail: any = await policyService.getPolicyById(id.toString());
                if (responsePolicyDetail) setData(responsePolicyDetail);
            } catch (error: any) {
                handleResponseError(error);
            } finally {
                setLoading(false);
            }
        }

        fetchDataPolicyDetail().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const goToPolicyListPage = () => {
        router.push(path.split("/").slice(0, -2).join("/"))
    };

    return (
        <div className="mx-auto">
            <div className="overflow-x-auto sm:scrollable bg-white flex items-center justify-between mb-5 py-5 px-7">
                <div>
                    {getBreadcrumbs(breadcrumbsArray)}
                    <p className="font-bold text-lg">{pageName}</p>
                </div>
                <div onClick={goToPolicyListPage} className="flex items-center justify-between cursor-pointer">
                    <ChevronLeft color="red" width="30" height="15"/>
                    <p className="text-sm text-red-500">Back</p>
                </div>
            </div>
            <div className="pb-5 px-7">
                <div className="overflow-x-auto sm:scrollable bg-white rounded-md mb-3 py-5 px-7 shadow">
                    <p className="font-semibold mb-3">Policy Holder Information</p>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                        <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Customer Name</p>
                        <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                            <p className="hidden lg:block lg:mr-2">:</p>
                            <p>{data?.policy_holder?.name || "-"}</p>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                        <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Phone Number</p>
                        <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                            <p className="hidden lg:block lg:mr-2">:</p>
                            <p>{data?.policy_holder?.phone || "-"}</p>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                        <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Email</p>
                        <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                            <p className="hidden lg:block lg:mr-2">:</p>
                            <p>{data?.policy_holder?.email || "-"}</p>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
                        <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Status</p>
                        <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                            <p className="hidden lg:block lg:mr-2">:</p>
                            <p className={`font-semibold ${data?.status === "In Force" ? "text-primary" : data?.status === "Grace Period" ? "text-orange-500" : "text-gray-500"}`}>{data?.status || "-"}</p>
                        </div>
                    </div>
                </div>
                {!!data?.package_data && data?.package_data?.length > 0 && (
                    <div className="overflow-x-auto sm:scrollable bg-white rounded-md mb-3 py-5 px-7 shadow">
                        <p className="font-semibold mb-3">Plan Information</p>
                        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                            <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Plan Name</p>
                            <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                <p className="hidden lg:block lg:mr-2">:</p>
                                <p>{data?.package_data[0]?.plan?.name || "-"}</p>
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                            <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Product Name</p>
                            <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                <p className="hidden lg:block lg:mr-2">:</p>
                                <p>{data?.package_data[0]?.product?.name || "-"}</p>
                            </div>
                        </div>
                        <div className={`flex flex-col lg:flex-row lg:items-center lg:space-x-4 ${!!data?.package_data[0]?.benefits && data?.package_data[0]?.benefits.length > 0 && "mb-3 lg:mb-2"}`}>
                            <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Insurance Name</p>
                            <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                <p className="hidden lg:block lg:mr-2">:</p>
                                <p>{data?.package_data[0]?.insurance?.name || "-"}</p>
                            </div>
                        </div>
                        {!!data?.package_data[0]?.benefits && data?.package_data[0]?.benefits.length > 0 && (
                            <div className="border rounded-md overflow-x-auto sm:scrollable">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-white">
                                    <tr>
                                        <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No.</th>
                                        <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Benefit</th>
                                        <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Limit</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {data?.package_data[0]?.benefits?.map((d: any, dIndex: number) => (
                                        <tr key={`${dIndex}-${d.id}`} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{dIndex + 1}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.benefits?.description_en || "-"}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{!!d.value ? moneyFormatter().format(d.value) : !!d.html ? d.html : "-"}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
                <div className="overflow-x-auto sm:scrollable bg-white rounded-md mb-3 py-5 px-7 shadow">
                    <p className="font-semibold mb-3">Insured Parties</p>
                    {
                        data?.participants && data?.participants.length > 0 ? (
                            data.participants.map((p, participantIndex) => (
                                <div key={participantIndex} className={`flex flex-col ${participantIndex > 0 && "border-t border-t-gray-200 mt-4 pt-4"}`}>
                                    {!!data?.number && (
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                            <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Policy Number</p>
                                            <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                <p className="hidden lg:block lg:mr-2">:</p>
                                                <p>{data?.number || "-"}</p>
                                            </div>
                                        </div>
                                    )}
                                    {!!p?.number && (
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                            <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Participant Number</p>
                                            <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                <p className="hidden lg:block lg:mr-2">:</p>
                                                <p>{p?.number || "-"}</p>
                                            </div>
                                        </div>
                                    )}
                                    {!!p?.data?.data?.name && (
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                            <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Full Name</p>
                                            <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                <p className="hidden lg:block lg:mr-2">:</p>
                                                <p>{p?.data?.data?.name || "-"}</p>
                                            </div>
                                        </div>
                                    )}
                                    {!!p?.data?.data?.gender && (
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                            <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Gender</p>
                                            <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                <p className="hidden lg:block lg:mr-2">:</p>
                                                <p>{p?.data?.data?.gender || "-"}</p>
                                            </div>
                                        </div>
                                    )}
                                    {!!p?.data?.data?.country_code && (
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                            <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Country Code</p>
                                            <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                <p className="hidden lg:block lg:mr-2">:</p>
                                                <p>{p?.data?.data?.country_code || "-"}</p>
                                            </div>
                                        </div>
                                    )}
                                    {!!p?.data?.data?.passport_no && (
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                            <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Passport Number</p>
                                            <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                <p className="hidden lg:block lg:mr-2">:</p>
                                                <p>{p?.data?.data?.passport_no || "-"}</p>
                                            </div>
                                        </div>
                                    )}
                                    {!!p?.data?.data?.nationality && (
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                            <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Nationality</p>
                                            <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                <p className="hidden lg:block lg:mr-2">:</p>
                                                <p>{p?.data?.data?.nationality || "-"}</p>
                                            </div>
                                        </div>
                                    )}
                                    {!!p?.data?.data?.dob && (
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                            <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Birthdate</p>
                                            <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                <p className="hidden lg:block lg:mr-2">:</p>
                                                <p>{p?.data?.data?.dob || "-"}</p>
                                            </div>
                                        </div>
                                    )}
                                    {!!p?.data?.data?.pob && (
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                            <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Place of Birth</p>
                                            <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                <p className="hidden lg:block lg:mr-2">:</p>
                                                <p>{p?.data?.data?.pob || "-"}</p>
                                            </div>
                                        </div>
                                    )}
                                    {!!p?.data?.data?.date_of_issue && (
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                                            <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Release Date</p>
                                            <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                <p className="hidden lg:block lg:mr-2">:</p>
                                                <p>{p?.data?.data?.date_of_issue || "-"}</p>
                                            </div>
                                        </div>
                                    )}
                                    {!!p?.data?.data?.date_of_expiry && (
                                        <div className={`flex flex-col lg:flex-row lg:items-center lg:space-x-4 ${!!p.data && Object.keys(p.data).length > 0 && "mb-3 lg:mb-2"}`}>
                                            <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">Expiry Date</p>
                                            <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                <p className="hidden lg:block lg:mr-2">:</p>
                                                <p>{p?.data?.data?.date_of_expiry || "-"}</p>
                                            </div>
                                        </div>
                                    )}
                                    {!!p.data && Object.keys(p.data).length > 0 && Object.keys(p.data).map((key, keyIndex) => {
                                        const formattedKey = capitalizeStringWithChar(key, " ");
                                        return (
                                            <div key={`other-info-${keyIndex}`} className={`flex flex-col lg:flex-row lg:items-center lg:space-x-4 ${keyIndex !== Object.keys(p.data).length - 1 && "mb-3 lg:mb-2"}`}>
                                                <p className="w-full text-xs lg:text-base lg:w-3/12 font-medium">{formattedKey}</p>
                                                <div className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                                                    <p className="hidden lg:block lg:mr-2">:</p>
                                                    <p>{p?.data?.[key] || "-"}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center bg-white rounded-md pb-10">
                                <NotFound width={isMobileView && "143"} height={isMobileView && "144"} size1={isMobileView && "143"} size3={isMobileView && "95"} viewBox={isMobileView && "-15 -5 87 70"} text="No participant data available" textClassName={isMobileView && "text-xs"}/>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};
