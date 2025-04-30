"use client";
import * as XLSX from "xlsx";
import WithSidebar from "@/hoc/with-sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ChevronLeft, X } from "react-feather";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/context/loading.context";
import { ChannelService } from "@/services/channel.services";
import { EndorsementService } from "@/services/endorsement.service";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table, } from "@/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UploadEndorsement = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { setLoading } = useLoading();
  const endorsementService = new EndorsementService();
  const channelService = new ChannelService();
  const [xlsxData, setXlsxData] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [channels, setChannels] = useState<any[]>([]);
  const [channel, setChannel] = useState("");
  const [type, setType] = useState("");
  const [policiesId, setPoliciesId] = useState<string>("");

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
  
    fetchChannel().then();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  useEffect(() => {
    const fetchPoliciesMaster = async () => {
      if (!channel) {
        return;
      }
      setLoading(true);
      try {
        const result = await endorsementService.policiesMaster(channel);
        setPoliciesId(result.id);
      } catch (error) {
        console.error("Error fetching insurance products:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPoliciesMaster().then();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel]);

  const handlePreview = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(worksheet);
        setXlsxData(parsedData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setXlsxData([]);
  };

  const toSnakeCase = (str: string) => str.replace(/[\s\/-]+/g, "_").replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/^_+|_+$/g, "").replace(/_+/g, "_").toLowerCase();

  const handleUpload = async () => {
    if (!channel) {
      alert("Please select a channel before uploading.");
      return;
    }
    if (!type) {
      alert("Please select a type before uploading.");
      return;
    }
    setLoading(true);
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
  
      const response = await endorsementService.uploadEndorsement(params.id, payload);
      const successMessage = response?.data?.message || "Data uploaded successfully!";
      alert(successMessage);
      router.push(`/endorsement`);
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
          <Input type="file" accept=".xlsx, .xls" onChange={handleChooseFile} />
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

const WithSidebarUploadEndorsement = (params: any) => WithSidebar(UploadEndorsement)(params);
export default WithSidebarUploadEndorsement;
