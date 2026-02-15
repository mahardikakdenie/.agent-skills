import React, {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import {useScreen} from "@/context/screen.context";
import {getHeaderPage} from "@/helpers/app.helper";
import NotFound from "@/components/not-found";
import {channelService} from "@/services/channel/api/channel.service";
import {useAuth} from "@/context/auth.context";

export const ConfigurationSlaView = () => {
    const [data, setData] = useState<any[]>([]);
    const path = usePathname();
    const { handleResponseError, user } = useAuth();
    const { isMobileView, setLoading } = useScreen();
    const channelId = user?.channel;

    useEffect(() => {
        fetchConfigurationSla().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchConfigurationSla = async () => {
        try {
            setLoading(true);
            const response: any = await channelService.getChannelConfigurations({ channel: channelId });
            if (response) {
                const configurations = Array.isArray(response) ? response : response?.data || [];
                setData(configurations?.[0]?.sla || []);
            }
        } catch (error: any) {
            handleResponseError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto py-5 px-7">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
                <p className={`font-bold text-lg ${isMobileView && "mb-2"}`}>{getHeaderPage(2, path, true).pageName}</p>
            </div>
            {data.length > 0 ? (
                <div className="relative bg-white rounded-md shadow-md">
                    <div className="overflow-x-auto sm:scrollable">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No.</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">From</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">To</th>
                                <th className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Period</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((d, index) => (
                                <tr key={`${index}-${d.id}`} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.status_from || "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{!!d.status_to && d.status_to.length > 0 ? d.status_to.join(", ") : "-"}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{d.period || "-"}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center bg-white rounded-md py-20 shadow">
                    <NotFound width={isMobileView && "143"} height={isMobileView && "144"} size1={isMobileView && "143"} size3={isMobileView && "95"} viewBox={isMobileView && "0 0 70 70"} text="No sla data available" textClassName={isMobileView && "text-xs"}/>
                </div>
            )}
        </div>
    );
};
