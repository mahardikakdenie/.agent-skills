import React, {useEffect, useRef, useState} from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import moment from "moment";
import {useRouter} from "next/navigation";
import {ChevronLeft} from "react-feather";
import {useScreen} from "@/context/screen.context";
import {useAuth} from "@/context/auth.context";
import {policyService} from "@/services/api.service";
import ApiURL from "@/constants/api-url.const";
import {getLocalStorage, toastNotification} from "@/helpers/app.helper";
import NotFound from "@/components/not-found";
import DownloadIcon from "@/images/download.icon";
import Button from "@/components/button";
import AppURL from "@/constants/app-url.const";

export const PolicyExportView = () => {
    const [data, setData] = useState<any[]>([]);
    const { handleResponseError, user } = useAuth();
    const { isMobileView, setLoading } = useScreen();
    const router = useRouter();
    const reportTemplateRef = useRef(null);
    const channel = user?.channel || undefined
    useEffect(() => {
        const fetchAllDataPolicy = async (page = 1, accumulatedData: any[] = []) => {
            try {
                setLoading(true);
                const filterPolicyData = getLocalStorage("filterPolicyData");
                const params = {
                    status: filterPolicyData.filterStatus,
                    keyword: filterPolicyData.filterKeyword,
                    limit: 100,
                    page,
                    channel
                };
                const response = await policyService.get(ApiURL.policies, { params });

                if (response && response.data) {
                    const newData = response.data.data || [];
                    const updatedData= [...accumulatedData, ...newData];
                    setData(updatedData);

                    if (page < response.data.pageTotal) {
                        await fetchAllDataPolicy(page + 1, updatedData);
                    }
                }
            } catch (error) {
                handleResponseError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllDataPolicy().then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGeneratePdf = () => {
        if (!reportTemplateRef.current) {
            toastNotification("Policy template element is not found!", "error");
            return;
        }

        const doc = new jsPDF({
            format: "a1",
            unit: "px",
        });
        doc.setFontSize(10);
        doc.setFont("Inter-Regular", "normal");
        doc.html(reportTemplateRef.current, {
            async callback(doc: any) {
                await doc.save(`Policy List - ${moment(new Date()).format("lll")}.pdf`);
            },
            x: 30,
            y: 30,
        });
    };

    const handleGenerateXlsx = () => {
        if (data.length === 0) {
            toastNotification("No policy data to export!", "error");
            return;
        }

        const sheetData = data.map((item, index) => ({
            "No": index + 1,
            "Customer Name": item.policy_holder?.name || "-",
            "Policy Number": item.number || "-",
            "Plan Name": item.policy_products?.plan_data?.name?.split("|").join(" - ") || "-",
            "Status": item.status || "-",
            "Issued Date": !!item.created_at ? moment(item.created_at).format("LL") : "-"
        }));

        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Policy List");
        XLSX.writeFile(workbook, `Policy List - ${moment(new Date()).format("lll")}.xlsx`);
    };

    const stylesPolicyData = {
        table: {
            width: "100%",
            border: "0.5px solid #cccccc",
        },
        th: {
            padding: "10px",
            border: "0.5px solid #cccccc",
            fontWeight: "bold",
            fontSize: "12px",
            height: "auto",
            background: "#e7e7e7",
            verticalAlign: "middle",
        },
        td: {
            padding: "10px",
            height: "auto",
            border: "0.5px solid #cccccc",
            fontSize: "12px",
            verticalAlign: "middle",
        },
    };

    return (
        <div className="mx-auto py-5 px-7">
            <div className="lg:flex lg:items-center lg:justify-between lg:mb-3">
                <div className="flex items-center justify-between mb-5">
                    <p className="font-bold text-lg lg:mt-2">Policy List</p>
                    {isMobileView && (
                        <div onClick={() => router.push(AppURL.policyList)} className="ml-auto items-center flex gap-1 text-red-500 text-sm cursor-pointer">
                            <ChevronLeft className="w-4 h-4"/>
                            Back
                        </div>
                    )}
                </div>
                {!isMobileView && (
                    <div onClick={() => router.push(AppURL.policyList)} className="ml-auto items-center flex gap-1 text-red-500 text-sm cursor-pointer">
                        <ChevronLeft className="w-4 h-4"/>
                        Back
                    </div>
                )}
                <div className="lg:ml-5">
                    <Button additionalClassName="w-full lg:w-fit justify-center lg:justify-between mr-0 mb-3 lg:mb-0" onClick={handleGeneratePdf} variant="warning" withIcon={true} disabled={data.length < 1}>
                        {DownloadIcon(data.length < 1 ? "#FFF" : "#000")}
                        <span className={`ml-1 ${data.length < 1 && "text-white"}`}>Generate PDF</span>
                    </Button>
                </div>
                <div className="mb-5 lg:mb-0 lg:ml-3">
                    <Button additionalClassName="w-full lg:w-fit justify-center lg:justify-between mr-0 mb-3 lg:mb-0" onClick={handleGenerateXlsx} withIcon={true} disabled={data.length < 1}>
                        {DownloadIcon("#FFF")}
                        <span className="ml-1">Generate XLXS</span>
                    </Button>
                </div>
            </div>
            <div className="w-full bg-white rounded-lg">
            {data.length < 1 ? (
                    <div className="flex items-center justify-center bg-white rounded-md py-20 shadow">
                        <NotFound width={isMobileView && "143"} height={isMobileView && "144"} size1={isMobileView && "143"} size3={isMobileView && "95"} viewBox={isMobileView && "0 0 70 70"} text="No policy data available" textClassName={isMobileView && "text-xs"}/>
                    </div>
                ) : (
                    <div className="overflow-x-auto sm:scrollable">
                        <table style={stylesPolicyData.table} ref={reportTemplateRef} border={1}>
                            <thead>
                            <tr>
                                <td style={stylesPolicyData.th} valign="middle">No.</td>
                                <td style={stylesPolicyData.th} valign="middle">Customer Name</td>
                                <td style={stylesPolicyData.th} valign="middle">Policy Number</td>
                                <td style={stylesPolicyData.th} valign="middle">Plan Name</td>
                                <td style={stylesPolicyData.th} valign="middle">Status</td>
                                <td style={stylesPolicyData.th} valign="middle">Issued Date</td>
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((item, index) => (
                                <tr key={item.id}>
                                    <td style={stylesPolicyData.td} valign="middle">{index + 1}</td>
                                    <td style={stylesPolicyData.td} valign="middle">
                                        <div className="flex gap-2 items-center">
                                            {item.policy_holder?.name || "-"}
                                        </div>
                                    </td>
                                    <td style={stylesPolicyData.td} valign="middle">{item.number || "-"}</td>
                                    <td style={stylesPolicyData.td} valign="middle">
                                        {item.policy_products?.plan_data?.name?.split("|").join(" - ") || "-"}
                                    </td>
                                    <td style={stylesPolicyData.td} valign="middle">{item.status || "-"}</td>
                                    <td style={stylesPolicyData.td} valign="middle">{!!item.created_at ? moment(item.created_at).format("LL") : "-"}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
