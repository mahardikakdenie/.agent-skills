// "use client";
//
// import React from "react";
// import { EndorsementUploadView } from "@/views/policy/endorsement/upload/upload.view";
//
// export default function EndorsementUploadPage() {
//     return <EndorsementUploadView />;
// }

"use client";
import * as XLSX from "xlsx";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@repo/ui";
import { ChevronLeft, X } from "react-feather";
import { Button } from "@/components/ui/button";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table, } from "@repo/ui";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@repo/ui";
import {useScreen} from "@/context/screen.context";
import AppURL from "@/constants/app-url.const";
import { useChannelsV1 } from "@/services/channel/hooks/queries";
import {
    useBulkCreateEndorsements,
} from "@/services/policy/hooks/mutations";
import { useMasterPoliciesByChannel } from "@/services/policy/hooks/queries";

export default function UploadEndorsement() {
    const router = useRouter();
    const { setLoading } = useScreen();
    const [xlsxData, setXlsxData] = useState<any[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [channel, setChannel] = useState("");
    const [type, setType] = useState("");
    const [policiesId, setPoliciesId] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { data: channelsResponse, isFetching: isChannelsFetching } = useChannelsV1({
        page: 1,
        limit: 100,
    });
    const channels = ((channelsResponse as any)?.data ?? []) as any[];
    const {
        data: masterPolicyResponse,
        isFetching: isMasterPolicyFetching,
    } = useMasterPoliciesByChannel(channel, { enabled: !!channel });
    const { mutateAsync: bulkCreateEndorsements, isPending: isUploadPending } =
        useBulkCreateEndorsements();


    const handleChooseFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) {
            setFile(event.target.files[0]);
        }
    };


    useEffect(() => {
        setLoading(isChannelsFetching || isMasterPolicyFetching || isUploadPending);
    }, [isChannelsFetching, isMasterPolicyFetching, isUploadPending, setLoading]);

    useEffect(() => {
        if (!channel) {
            setPoliciesId("");
            return;
        }
        setPoliciesId((masterPolicyResponse as any)?.id || "");
    }, [channel, masterPolicyResponse]);

    const excelDateToISO = (serial: number) => {
        const utcDays = Math.floor(serial - 25569);
        const utcValue = utcDays * 86400;
        const dateInfo = new Date(utcValue * 1000);
        const iso = dateInfo.toISOString().split("T")[0];
        return iso;
    };

    const handlePreview = () => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const parsedData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

                const transformed = parsedData.map((row: any) => {
                    const newRow: Record<string, any> = {};
                    Object.entries(row).forEach(([key, value]) => {
                        if (typeof value === "number" && value > 20000 && value < 60000) {
                            newRow[key] = excelDateToISO(value);
                        } else {
                            newRow[key] = value;
                        }
                    });
                    return newRow;
                });

                setXlsxData(transformed);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleClearFile = () => {
        setFile(null);
        setXlsxData([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const toSnakeCase = (str: string) => str.split(/[(/]/)[0].trim().replace(/[\s\/-]+/g, "_").replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/^_+|_+$/g, "").replace(/_+/g, "_").toLowerCase();

    const handleUpload = async () => {
        if (!channel) {
            alert("Please select a channel before uploading.");
            return;
        }
        if (!policiesId) {
            alert("Master policy not found for selected channel.");
            return;
        }
        if (!type) {
            alert("Please select a type before uploading.");
            return;
        }
        try {
            const transformedData = xlsxData.map((row) => {
                const newRow: Record<string, any> = {};
                Object.entries(row).forEach(([key, value]) => {
                    const snakeKey = toSnakeCase(key.trim());
                    newRow[snakeKey] = value === "-" ? "" : value || "";
                });
                return {
                    profile: newRow,
                };
            });

            const payload = { policy: policiesId, type: type, data: transformedData, };

            const response = await bulkCreateEndorsements(payload);
            const successMessage = (response as any)?.message || "Data uploaded successfully!";
            alert(successMessage);
            router.push(AppURL.endorsementList);
        } catch (error: any) {
            console.error("Upload error:", error);
            const errorMessage = error?.response?.data?.message || "Upload failed.";
            alert(errorMessage);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full h-full overflow-auto">
            <div className="flex gap-4 mb-5">
                <h1 className="text-black font-bold text-2xl mt-2">Upload Data</h1>
                <div onClick={() => router.back()} className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer mr-4">
                    <ChevronLeft className="w-4 h-4" /> Back
                </div>
            </div>
            <div className="flex gap-3 items-center mb-4">
                <Select value={channel} onValueChange={(value) => setChannel(value)}>
                    <SelectTrigger className="min-w-[180px] w-[180px] ml-auto">
                        <SelectValue placeholder="Select Channel" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {channels.map ((channel, index) => (
                                <SelectItem key={index} value={channel.id}>{channel.name}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select value={type} onValueChange={(value) => setType(value)}>
                    <SelectTrigger className="min-w-[180px] w-[180px] ml-auto">
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="Additional">Additional</SelectItem>
                            <SelectItem value="Revision">Revision</SelectItem>
                            <SelectItem value="Reduction">Reduction</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <div className="w-full relative">
                    <Input ref={fileInputRef} type="file" accept=".xlsx, .xls" onChange={handleChooseFile}/>
                    <Button type="button" variant="secondary" className="rounded-full absolute right-0 top-0 bg-transparent text-red-500 px-2" onClick={handleClearFile} disabled={!file}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>
                <Button disabled={!file || xlsxData.length > 0} className="btn-primary rounded-full px-5" onClick={handlePreview}>Preview</Button>
                <Button disabled={xlsxData.length === 0} className="btn-primary rounded-full px-5" onClick={handleUpload}>Upload</Button>
            </div>

            <div className="mt-5 overflow-auto">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow>
                            {xlsxData.length > 0 && Object.keys(xlsxData[0]).map((item, i) => (
                                <TableHead key={i} className="whitespace-nowrap">{item}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {xlsxData.length > 0 && xlsxData.map((item, i) => (
                            <TableRow key={i}>
                                {Object.keys(item).map((key, j) => (
                                    <TableCell key={j}>{item[key] !== undefined && item[key] !== null ? item[key] : ""}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

