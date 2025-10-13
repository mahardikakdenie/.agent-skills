"use client";
import * as XLSX from "xlsx";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "react-feather";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {useAuth} from "@/context/auth.context";
import {useScreen} from "@/context/screen.context";
import ApiURL from "@/constants/api-url.const";
import {channelService, policyService} from "@/services/api.service";
import AppURL from "@/constants/app-url.const";

export default function UploadMembership({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { setLoading } = useScreen();
  const [ page, setPage ] = useState(1);
  const [ limit, setLimit ] = useState(100);
  const [ file, setFile ] = useState<File | null>(null);
  const [ channel, setChannel ] = useState("");
  const [ canUploadFirstTime, setCanUploadFirstTime ] = useState(false);
  const [ action, setAction ] = useState("Feedback");
  const [ transaction, setTransaction ] = useState("");
  const [ chunkNumber, setChunkNumber ] = useState("");
  const [ startDate, setStartDate ] = useState("");
  const [ endDate, setEndDate ] = useState("");
  const [ policyTerm, setPolicyTerm ] = useState("");
  const [ insuredType, setInsuredType ] = useState("");
  const [ channels, setChannels ] = useState<any[]>([]);
  const [ xlsxData, setXlsxData ] = useState<any[]>([]);
  const [ headers, setHeaders ] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const actionOptions = ["Feedback", "First Time", "First Time - Without Transaction"];
  const insuredTypeOptions = ["Person", "Motorcycle", "Car", "Gadget"];

  const { permissionList } = useAuth();
  
  const handleChooseFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
    }
  };  

  useEffect(() => {
    const fetchChannel = async () => {
      setLoading(true);
      try {
        const hasPermissionUploadFirstTime = permissionList.includes("Membership.Membership List.Create");
        setCanUploadFirstTime(hasPermissionUploadFirstTime);

        const result: any = await channelService.get(ApiURL.v1Channels, { params: { page, limit } });
        setChannels(result?.data?.data);
      } catch (error) {
        console.error("Error fetching insurance products:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchChannel();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

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

  const handleUpload = async () => {
    if (!channel) {
      alert("Please select a channel before uploading.");
      return;
    }
  
    setLoading(true);
    try {
      const transformedData = xlsxData.map((row) => {
        const newRow: Record<string, any> = {};
  
        const getExcelColumnName = (index: number) => {
          let result = "";
          while (index >= 0) {
            result = String.fromCharCode((index % 26) + 97) + result;
            index = Math.floor(index / 26) - 1;
          }
          return `column_${result}`;
        };
  
        const values = Object.values(row);
        const MAX_COLUMNS = 67;
  
        for (let i = 0; i < MAX_COLUMNS; i++) {
          const colKey = getExcelColumnName(i);
          const rawValue = values[i];
          const stringValue = rawValue === "-" ? "" : String(rawValue || "");
          newRow[colKey] = stringValue;
        }
  
        return newRow;
      });
  
      const payload: any = {
        is_master_policy: true,
        data: transformedData,
      };

      if (action === "First Time - Without Transaction") {
        delete payload.is_master_policy;
        payload.channel_id = channel;
      } else if (action === "First Time") {
        delete payload.is_master_policy;

        payload.transaction_id = transaction;
        payload.channel_id = channel;
        payload.master_policy_data = {
          start_date: startDate,
          end_date: endDate,
          policy_term: policyTerm,
          insured_type: insuredType
        };
      }
  
      let response;
      if (action === "First Time - Without Transaction") {
        const chunkSize = Number(chunkNumber);
        const fullData = payload.data;
        const chunks = [];
        for (let i = 0; i < fullData.length; i += chunkSize) {
          chunks.push(fullData.slice(i, i + chunkSize));
        }

        for (const chunk of chunks) {
          const chunkedPayload = { ...payload, data: chunk };
          await policyService.post(ApiURL.v1InsuredPartiesUploadFirstTimeWithoutTransaction, chunkedPayload);
        }

        response = null;
      } else if (action === "First Time") {
        response = await policyService.post(ApiURL.v1InsuredPartiesUploadFirstTime, payload);
      } else {
        response = await policyService.put(ApiURL.v1InsuredPartiesChannelDetails(channel), payload);
      }

      const successMessage = response?.data?.data?.message || "Data uploaded successfully!";
      alert(successMessage);
      router.push(AppURL.membershipList);
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMessage = error?.response?.data?.message || "Upload failed.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };
      
  return (
      <div className="p-6 bg-white rounded-lg shadow-md w-full h-full overflow-auto">
        <div className="flex gap-4 mb-5">
          <h1 className="text-black font-bold text-2xl mt-2">Upload Data</h1>
          <div onClick={() => router.back()}
               className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer mr-4">
            <ChevronLeft className="w-4 h-4"/> Back
          </div>
        </div>
        {canUploadFirstTime && (
            <div className="my-3">
              <div className="flex gap-2 my-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Action
                  </label>
                  <Select value={action} onValueChange={(value) => setAction(value)}>
                    <SelectTrigger className="h-16">
                      <SelectValue placeholder="Feedback"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {actionOptions.map((act, index) => (
                            <SelectItem key={index} value={act}>{act}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {action === "First Time" && (
                    <div className="w-1/2">
                      <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-2">
                        Transaction Id
                      </label>
                      <Input
                          type="text"
                          id="transactionId"
                          placeholder="Insert Transaction Id"
                          onChange={(e) => setTransaction(e.target.value)}
                          className="mt-1 block w-full placeholder:text-black h-16 border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                )}

                {action === "First Time - Without Transaction" && (
                    <div className="w-1/2">
                      <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Chunk
                      </label>
                      <Input
                          type="number"
                          min={0}
                          id="chunkNumber"
                          placeholder="Insert Number of Chunk"
                          onChange={(e) => setChunkNumber(e.target.value)}
                          className="mt-1 block w-full placeholder:text-black h-16 border-gray-300 rounded-md shadow-sm"
                      />
                    </div>
                )}
              </div>
              {
                  action === "First Time" && (
                      <div>
                        <div className="flex gap-2 my-2">
                          <div className="w-1/2">
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                              Start Date
                            </label>
                            <Input
                                type="date"
                                id="startDate"
                                placeholder="Choose Date"
                                onChange={(e) => setStartDate(e.target.value)}
                                className="mt-1 block w-full h-16 border-gray-300 rounded-md shadow-sm"
                            />
                          </div>

                          <div className="w-1/2">
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                              End Date
                            </label>
                            <Input
                                type="date"
                                id="endDate"
                                placeholder="Choose Date"
                                onChange={(e) => setEndDate(e.target.value)}
                                className="mt-1 block w-full h-16 border-gray-300 rounded-md shadow-sm"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 my-2">
                          <div className="w-1/2">
                            <label htmlFor="policyTerm" className="block text-sm font-medium text-gray-700 mb-2">
                              Policy Term
                            </label>
                            <Input
                                type="text"
                                id="policyTerm"
                                placeholder="Insert Policy Term"
                                onChange={(e) => setPolicyTerm(e.target.value)}
                                className="mt-1 block w-full placeholder:text-black h-16 border-gray-300 rounded-md shadow-sm"
                            />
                          </div>

                          <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Insured Type
                            </label>
                            <Select value={insuredType} onValueChange={(value) => setInsuredType(value)}>
                              <SelectTrigger className="h-16">
                                <SelectValue placeholder="Select Insured Type"/>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {insuredTypeOptions.map((insuredType, index) => (
                                      <SelectItem key={index} value={insuredType}>{insuredType}</SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                  )
              }
            </div>
        )}
        <div className="flex gap-3 items-center mb-4">
          <Select value={channel} onValueChange={(value) => setChannel(value)}>
            <SelectTrigger className="min-w-[180px] w-[180px] ml-auto">
              <SelectValue placeholder="Select Channel"/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {channels.map((channel, index) => (
                    <SelectItem key={index} value={channel.id}>{channel.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="w-full relative">
            <Input ref={fileInputRef} type="file" accept=".xlsx, .xls" onChange={handleChooseFile}/>
            <Button type="button" variant="secondary"
                    className="rounded-full absolute right-0 top-0 bg-transparent text-red-500 px-2"
                    onClick={handleClearFile} disabled={!file}>
              <X className="w-5 h-5"/>
            </Button>
          </div>
          <Button disabled={!file || xlsxData.length > 0} className="btn-primary rounded-full px-5"
                  onClick={handlePreview}>Preview</Button>
          <Button disabled={xlsxData.length === 0} className="btn-primary rounded-full px-5"
                  onClick={handleUpload}>Upload</Button>
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
