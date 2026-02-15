"use client";
import * as XLSX from "xlsx";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "react-feather";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {useScreen} from "@/context/screen.context";
import AppURL from "@/constants/app-url.const";
import { useChannelsV1 } from "@/services/channel/hooks/queries";
import { useUploadPoliciesDrGadget } from "@/services/policy/hooks/mutations";

export default function ImportPolicyPage() {
  const router = useRouter();
  const { setLoading } = useScreen();
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [channel, setChannel] = useState("");
  const [xlsxData, setXlsxData] = useState<any[]>([]);
  const { data: channelsResponse, isFetching: isChannelsFetching } = useChannelsV1({
    page: 1,
    limit: 100,
  });
  const channels = ((channelsResponse as any)?.data ?? []) as any[];
  const { mutateAsync: uploadPoliciesDrGadget, isPending: isUploadPending } =
    useUploadPoliciesDrGadget();

  const handleChooseFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    setLoading(isChannelsFetching || isUploadPending);
  }, [isChannelsFetching, isUploadPending, setLoading]);


  const handlePreview = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        setXlsxData(parsedData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setXlsxData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // ✅ this clears the file name
    }
  };


  const convertCSV = async (f: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          if (!event.target) return;
          const data = new Uint8Array(event.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });

          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          let csvData = XLSX.utils.sheet_to_csv(worksheet);
          csvData = csvData.replace(/;/g, ',');

          const blob = new Blob([csvData], { type: 'text/csv' });

          const csvFile = new File(
            [blob],
            f.name.replace(/\.(xlsx|xls)$/i, ".csv"),
            { type: "text/csv" }
          );

          // ✅ Trigger download
          // const url = URL.createObjectURL(csvFile);
          // const a = document.createElement('a');
          // a.href = url;
          // a.download = csvFile.name;
          // document.body.appendChild(a);
          // a.click();
          // document.body.removeChild(a);
          // URL.revokeObjectURL(url);

          resolve(csvFile);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(f);
    });
  };

  const handleUpload = async () => {
    if (!channel) {
      alert("Please select a channel before uploading.");
      return;
    }
    const fileCSV: File | null = await convertCSV(file) as File | null;
    try {
      // const transformedData = xlsxData.map((row) => {
      //   const newRow: Record<string, any> = {};

      //   const getExcelColumnName = (index: number) => {
      //     let result = "";
      //     while (index >= 0) {
      //       result = String.fromCharCode((index % 26) + 97) + result;
      //       index = Math.floor(index / 26) - 1;
      //     }
      //     return `column_${result}`;
      //   };

      //   const values = Object.values(row);
      //   const MAX_COLUMNS = 66;

      //   for (let i = 0; i < MAX_COLUMNS; i++) {
      //     const colKey = getExcelColumnName(i);
      //     const rawValue = values[i];
      //     const stringValue = rawValue === "-" ? "" : String(rawValue || "");
      //     newRow[colKey] = stringValue;
      //   }

      //   return newRow;
      // });

      // const payload = {
      //   is_master_policy: true,
      //   data: transformedData,
      // };

      const formData = new FormData();
      formData.append('file', fileCSV!);

      try {
        var c = channels.filter((x) => x.id == channel)[0];
        if (!c) {
          alert("Selected channel not found.");
          return;
        }
        if (c.name == "drgadget") {
          const response: any = await uploadPoliciesDrGadget(formData);
          const successMessage = response?.data?.message || response?.message || "Data uploaded successfully!";
          alert(successMessage);
          router.push(AppURL.policyList);
        } else {
          alert("Fitur Import untuk Partner ini belum didukung");
        }
      } catch (error) {
        console.log(error);
      }
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
        <div onClick={() => router.back()} className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer mr-4" ><ChevronLeft className="w-4 h-4" /> Back</div>
      </div>
      <div className="flex gap-3 items-center mb-4">
        <Select value={channel} onValueChange={(value) => setChannel(value)}>
          <SelectTrigger className="min-w-[180px] w-[180px] ml-auto">
            <SelectValue placeholder="Select Channel" />
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
          <Input type="file" ref={fileInputRef} accept=".xlsx" onChange={handleChooseFile} />
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
