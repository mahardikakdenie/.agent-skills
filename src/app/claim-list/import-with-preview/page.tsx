"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, Upload } from "react-feather";
import * as XLSX from "xlsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { useLoading } from "@/context/loading.context";
import { getChannel } from "@/context/auth.context";
import WithSidebar from "@/hoc/with-sidebar";
import { ClaimService } from "@/services/claim.service";
import { ProductCategoriesService } from "@/services/masterdata/product-category.service";
import { toastPromise } from '@/lib/toast';
import { capitalizeStringWithChar } from "@/lib/formatter";

const ImportWithPreviewPage = () => {
  const claimService = new ClaimService();
  const router = useRouter();
  const { setLoading } = useLoading();

  // States
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [tableData, setTableData] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const [channel, setChannel] = useState<string | null>(null);

  // Get user channel
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const userChannel = await getChannel();
        setChannel(userChannel);
      } catch (error) {
        console.error("Failed to get channel:", error);
      }
    };
  
    fetchChannel();
  }, []);

  // Use useRef to prevent double fetching
  const hasFetchedCategory = useRef(false);
  useEffect(() => {
    const productCategoryService = new ProductCategoriesService();

    const fetchCategoryOptions = async () => {
      setLoading(true);
      try {
        const result = await productCategoryService.getCategories();
        if (result && result.length > 0) {
          setCategoryOptions(
            result.map((category: any) => ({
              label: capitalizeStringWithChar(category.name),
              value: category.id,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    // Ensure fetch function only called once
    if (!hasFetchedCategory.current) {
      hasFetchedCategory.current = true;
      fetchCategoryOptions();
    }
  });


  // Helper function to parse Excel file into JSON
  const parseExcelFile = (file: File) => {
    return new Promise<any[]>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
  
        // Return the formatted data
        resolve(jsonData);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const transformJsonWithHeaders = (tableData: any[]) => {
    if (!tableData.length) return [];

    const headers = tableData[0];
    return tableData.slice(1).map((row) => 
      Object.fromEntries(headers.map((key: string, index: number) => [key, row[index]]))
    );
  };

  const handleFileSelection = async (file: File) => {
    if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel" ||
      file.type === "text/csv"
    ) {
      setSelectedFile(file);
      try {
        const jsonData = await parseExcelFile(file);
        setTableData(jsonData);
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Error processing file");
      }
    } else {
      alert("Please upload an Excel (.xlsx or .xls) or CSV (.csv) file");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleSelectCategory = (value: string) => {
    setSelectedCategory(value);
  };

  const handleUpload = async () => {
    if (!selectedFile || tableData.length <= 0 || !channel) return;
    setUploadStatus("uploading");
    setLoading(true);
  
    try {
      // Transform tableData so that the first row is used as keys for the subsequent rows
      const importData = transformJsonWithHeaders(tableData);
  
      const uploadPromise = claimService.importAsJson({
        data: importData,
        input: "Data",
        channel: channel,
        category: selectedCategory,
      });
  
      await toastPromise(uploadPromise, {
        loading: "Uploading file...",
        success: <b>File uploaded successfully!</b>,
        error: "Upload failed!",
      });
  
      setUploadStatus("success");
      setTimeout(() => {
        router.push("/claim-list");
      }, 1500);
    } catch (error) {
      setUploadStatus("error");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryOptions = () => {
    if (categoryOptions.length === 0) return null;
    return (
      <SelectGroup>
        {categoryOptions.map((category) => (
          <SelectItem key={category.value} value={category.value}>
            {category.label}
          </SelectItem>
        ))}
      </SelectGroup>
    );
  };

  const renderPreviewTable = () => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {tableData[0].map((header: string, index: number) => (
              <TableHead key={index}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.slice(1).map((row: any, index: number) => (
            <TableRow key={index}>
              {row.map((cell: any, cellIndex: number) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="flex flex-col w-full">
      <div className="bg-white md:px-6 p-4 flex items-center">
        <div>
          <Breadcrumb className="sm:block hidden">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Claim List</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Import With Preview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
            Import Claims with Preview
          </h2>
        </div>

        <div className="flex ml-auto">
          <div
            onClick={() => router.back()}
            className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </div>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploadStatus === "uploading"}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-5 rounded-full px-5"
          >
            {uploadStatus === "uploading" ? (
              "Uploading..."
            ) : (
              <>
                <Upload className="mr-2 w-4 h-4" />
                Upload
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col w-full p-4 md:p-6 gap-4">
        <div className="p-4 sm:p-6 bg-white rounded-lg">
          <div className="mb-4">
            <div className="text-xs mb-1.5 font-medium">
              Select Category
            </div>
            <Select
              value={selectedCategory}
              onValueChange={handleSelectCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                {renderCategoryOptions()}
              </SelectContent>
            </Select>
          </div>
          {selectedCategory ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 ${
                dragActive ? "border-[#F5BA41] bg-[#FDF7E9]" : "border-gray-300"
              } ${selectedFile ? "border-green-500 bg-green-50" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <Upload
                  className={`w-12 h-12 ${
                    selectedFile ? "text-green-500" : "text-gray-400"
                  }`}
                />
                <div className="text-center">
                  {selectedFile ? (
                    <p className="text-green-500 font-medium">
                      Selected: {selectedFile.name}
                    </p>
                  ) : (
                    <>
                      <p className="text-gray-600">
                        Drag and drop your file here, or{" "}
                        <label className="text-[#F5BA41] cursor-pointer hover:text-[#e6a92d]">
                          browse
                          <input
                            type="file"
                            className="hidden"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileInput}
                          />
                        </label>
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        Supported formats: .xlsx, .xls, .csv
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : null}
          {selectedFile && tableData.length > 0 ? (
            <div className="pt-4">
              {renderPreviewTable()}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const ImportWithPreviewPageWithSidebar = (params: any) => WithSidebar(ImportWithPreviewPage)(params);
export default ImportWithPreviewPageWithSidebar;
