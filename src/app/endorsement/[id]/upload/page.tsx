"use client";
import { Input } from "@/components/ui/input";
import WithSidebar from "@/hoc/with-sidebar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { useLoading } from "@/context/loading.context";
import { useRouter } from "next/navigation";
import { EndorsementService } from "@/services/endorsement.service";
import * as XLSX from "xlsx";
import { X } from "react-feather";
import { ChannelService } from "@/services/channel.services";

const UploadEndorsement = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { setLoading } = useLoading();
  const endorsementService = new EndorsementService();
  const [xlsxData, setXlsxData] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");

  const handleChooseFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
    }
  };  

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

  const toSnakeCase = (str: string) =>
    str
      .replace(/[\s\/-]+/g, "_")                
      .replace(/([a-z0-9])([A-Z])/g, "$1_$2")   
      .replace(/^_+|_+$/g, "")                  
      .replace(/_+/g, "_")      
      .toLowerCase();

  const handleUpload = async () => {
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
  
      const payload = {
        status: "Approved",
        is_send_email_to_third_party: true,
        data: transformedData,
      };
  
      const response = await endorsementService.updateEndorsement(
        params.id,
        payload
      );
  
      console.log("Response:", response);
      alert("Data uploaded successfully!");
      router.push(`/endorsement/${params.id}`);
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
      <h1 className="text-xl font-semibold mb-4">Upload Endorsement</h1>

      <div className="flex gap-3 items-center mb-4">
        <div className="w-full relative">
          <Input type="file" accept=".xlsx, .xls" onChange={handleChooseFile} />
          <Button
              type="button"
              variant="secondary"
              className="rounded-full absolute right-0 top-0 bg-transparent text-red-500 px-2"
              onClick={handleClearFile}
              disabled={!file}
            >
              <X className="w-5 h-5" />
            </Button>
        </div>

        <Button
          disabled={!file || xlsxData.length > 0}
          className="btn-primary rounded-full px-5"
          onClick={handlePreview}
        >
          Preview
        </Button>

        <Button
          disabled={xlsxData.length === 0}
          className="btn-primary rounded-full px-5"
          onClick={handleUpload}
        >
          Upload
        </Button>
      </div>
      <div className="mt-5 overflow-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {xlsxData.length > 0 &&
                Object.keys(xlsxData[0]).map((item, i) => (
                  <TableHead key={i} className="whitespace-nowrap">{item}</TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {xlsxData.length > 0 &&
              xlsxData.map((item, i) => (
                <TableRow key={i}>
                  {Object.keys(item).map((key, j) => (
                    <TableCell key={j}>
                      {item[key] !== undefined && item[key] !== null
                        ? item[key]
                        : ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const WithSidebarUploadEndorsement = (params: any) =>
  WithSidebar(UploadEndorsement)(params);

export default WithSidebarUploadEndorsement;
