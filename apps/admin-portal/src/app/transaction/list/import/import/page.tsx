"use client";
import { useRef, useState } from "react";
import Papa from "papaparse";
import { Button } from "@repo/ui";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@repo/ui";
import { ChevronLeft, Search, Upload, X } from "react-feather";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui";
import Link from "next/link";
import { useScreen } from "@/context/screen.context";
import AppURL from "@/constants/app-url.const";
import { useParams } from "next/navigation";
import { useBulkCreateTransactions } from "@/services/transaction/hooks/mutations";

export default function UploadTransactions() {
  const params = useParams();
  const idParam = params.id;
  const id =
    typeof idParam === "string"
      ? idParam
      : Array.isArray(idParam)
      ? idParam[0]
      : "";
  const [csvData, setCsvData] = useState<any[]>([]);
  const { setLoading } = useScreen();
  const [file, setFile] = useState<any>(null);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: bulkCreateTransactions } = useBulkCreateTransactions();

  const handleChooseFile = (event: any) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "");
  };

  const handleClear = () => {
    setFile(null);
    setFileName("");
    setCsvData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePreview = () => {
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setCsvData(results.data);
        },
        error: (error) => {
          console.error("Error parsing CSV file:", error);
        },
      });
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      await bulkCreateTransactions({ id, payload: csvData });
      alert("Package uploaded successfully");
      // router.push(PRODUCT_CATALOG_DETAIL(params.category, params.id));
    } catch (error) {
      console.error(error);
      alert("Failed to upload package");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="bg-white md:px-6 p-4 flex items-center">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={AppURL.transactionList}>Transactions</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Import</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-black font-bold text-2xl mt-2">
            Transaction List
          </h2>
        </div>
        <Link
          href={AppURL.transactionList}
          className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
      </div>
      <div className="flex flex-col w-full p-4 md:p-6 ">
        <div className="flex gap-2">
          <label
            htmlFor="file-upload"
            className="w-full bg-white border rounded-md flex gap-2 items-center px-3 cursor-pointer"
          >
            <span className="text-sm">{fileName || "Choose File"}</span>
            <Upload className="w-5 h-5 ml-auto text-primary" />
            <input
              id="file-upload"
              type="file"
              ref={fileInputRef}
              onChange={handleChooseFile}
              className="hidden"
            />
          </label>

          <Button
            disabled={!!!file || csvData.length > 0}
            className="btn-primary rounded-full ml-2"
            onClick={handlePreview}
          >
            <Search className="w-5 h-5 mr-1" />
            Preview
          </Button>
          <Button
            disabled={!file && csvData.length === 0}
            className="font-semibold ml-auto items-center flex gap-1 text-red-500 text-sm bg-transparent border border-red-500 rounded-full hover:bg-transparent"
            onClick={handleClear}
          >
            <X className="w-5 h-5 mr-1" /> Clear
          </Button>
          <Button
            disabled={csvData.length === 0}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
            onClick={handleUpload}
          >
            <Upload className="w-5 h-5 mr-1" /> Upload
          </Button>
        </div>

        {csvData.length > 0 && (
          <div className="mt-5 overflow-auto bg-white shadow p-4 pb-0 rounded-md w-full">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  {Object.keys(csvData[0]).map((item, i) => (
                    <TableHead key={i}>{item}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvData.map((item, i) => (
                  <TableRow key={i}>
                    {Object.values(item).map((value: any, j) => (
                      <TableCell key={j}>{value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}