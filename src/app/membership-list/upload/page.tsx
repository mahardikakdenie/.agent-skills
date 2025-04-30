"use client";
import * as XLSX from "xlsx";
import WithSidebar from "@/hoc/with-sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "react-feather";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/context/loading.context";
import { ChannelService } from "@/services/channel.services";
import { MembershipService } from "@/services/membership.service";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UploadMembership = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { setLoading } = useLoading();
  const [ page, setPage ] = useState(1);
  const [ limit, setLimit ] = useState(100);
  const [ file, setFile ] = useState<File | null>(null);
  const [ channel, setChannel ] = useState("");
  const [ channels, setChannels ] = useState<any[]>([]);
  const [ xlsxData, setXlsxData ] = useState<any[]>([]);
  const [ headers, setHeaders ] = useState<string[]>([]);
  
  const channelService = new ChannelService();
  const membershipService = new MembershipService();
  
  const handleChooseFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
    }
  };  

  useEffect(() => {
    const fetchChannel = async () => {
      setLoading(true);
      try {
        const result = await channelService.getChannels(page, limit);
        setChannels(result.data);
      } catch (error) {
        console.error("Error fetching insurance products:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchChannel();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);


  const handlePreview = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        const headerRow = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 0, blankrows: false, })[0] as string[] || [];
  
        setHeaders(headerRow);
        setXlsxData(parsedData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setXlsxData([]);
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
        const MAX_COLUMNS = 66;
  
        for (let i = 0; i < MAX_COLUMNS; i++) {
          const colKey = getExcelColumnName(i);
          const rawValue = values[i];
          const stringValue = rawValue === "-" ? "" : String(rawValue || "");
          newRow[colKey] = stringValue;
        }
  
        return newRow;
      });
  
      const payload = {
        is_master_policy: true,
        data: transformedData,
      };
  
      const response = await membershipService.uploadMembership(channel, payload);
      const successMessage = response?.data?.message || "Data uploaded successfully!";
      alert(successMessage);
      router.push("/membership-list");
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
        <div onClick={() => router.back()} className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer mr-4" ><ChevronLeft className="w-4 h-4" /> Back</div>
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

        <div className="w-full relative">
          <Input type="file" accept=".xlsx, .xls" onChange={handleChooseFile} />
          <Button type="button" variant="secondary" className="rounded-full absolute right-0 top-0 bg-transparent text-red-500 px-2" onClick={handleClearFile} disabled={!file}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <Button disabled={!file || xlsxData.length > 0} className="btn-primary rounded-full px-5" onClick={handlePreview} >Preview</Button>
        <Button disabled={xlsxData.length === 0} className="btn-primary rounded-full px-5" onClick={handleUpload} >Upload</Button>
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

const WithSidebarUploadMembership = (params: any) => WithSidebar(UploadMembership)(params);
export default WithSidebarUploadMembership;
