"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, MouseEvent } from "react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EditIcon from "@/components/icons/edit.icon";
import AlertCircleIcon from "@/components/icons/alert-circle-icon";

import { useLoading } from "@/context/loading.context";
import { getChannel } from "@/context/auth.context";
import WithSidebar from "@/hoc/with-sidebar";
import { ClaimService } from "@/services/claim.service";
import { ProductCategoriesService } from "@/services/masterdata/product-category.service";
import { toastPromise, toastNotification } from "@/lib/toast";
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
  const [tableHeader, setTableHeader] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const [channel, setChannel] = useState<string | null>(null);
  const [headerGuide, setHeaderGuide] = useState<
    {
      field: string;
      required: boolean;
    }[]
  >([]);
  const [headerOptions, setHeaderOptions] = useState<
    {
      label: string;
      value: string;
      disable?: boolean;
    }[]
  >([]);
  const [validatedHeader, setValidatedHeader] = useState<boolean[]>([]);
  const [isModalEditOpen, setIsModalEditOpen] = useState<boolean>(false);
  const [headerIndex, setHeaderIndex] = useState<number>(0);
  const [selectedHeader, setSelectedHeader] = useState<string>("");
  const [newLabelHeader, setNewLabelHeader] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

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

  const checkAllRequiredHeader = () => {
    const filterRequiredHeader = headerGuide.filter(
      (header) => header.required
    );
    const filterHeaderSubmitted = tableHeader.filter(
      (_, index) => validatedHeader[index]
    );

    const filterHeaderSubmittedSet = validatedHeader.length
      ? new Set(filterHeaderSubmitted)
      : new Set(tableHeader);
    return filterRequiredHeader.every((item) =>
      filterHeaderSubmittedSet.has(item.field)
    );
  };

  useEffect(() => {
    if (!checkAllRequiredHeader()) {
      setErrorMessage("You must match all required column to import.");
    } else {
      setErrorMessage("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerGuide, tableHeader, validatedHeader]);

  // Helper function to parse Excel file into JSON
  const parseExcelFile = (file: File) => {
    return new Promise<any[]>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false,
        });

        // Return the formatted data
        resolve(jsonData);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const transformJsonWithHeaders = (tableHeader: any[], tableData: any[]) => {
    if (!tableHeader.length && !tableData.length) return [];

    return tableData.map((row) =>
      Object.fromEntries(
        tableHeader.map((key: string, index: number) => [key, row[index]])
      )
    );
  };

  const handleFileSelection = async (
    file: File,
    callback: (data: any) => void
  ) => {
    if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel" ||
      file.type === "text/csv"
    ) {
      setSelectedFile(file);
      setLoading(true);
      try {
        const jsonData = await parseExcelFile(file);
        const tableData = jsonData;
        const tableHeader = jsonData.shift();
        setTableHeader(tableHeader);
        setTableData(tableData);

        // Compare header from the uploaded file with the header from the guide
        callback(tableHeader);
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Error processing file");
      } finally {
        setLoading(false);
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
      handleFileSelection(e.dataTransfer.files[0], validateHeaders);
    }
  };

  // Check if the header uploaded matches the header from the guide
  const validateHeaders = (jsonData: any) => {
    const fieldCount: Record<string, number> = {};
    const fieldMap = new Set(headerGuide.map((item) => item.field));

    jsonData.forEach((row: any) => {
      fieldCount[row] = (fieldCount[row] || 0) + 1;
    });

    const validatedRows = jsonData.map(
      (row: any) => fieldCount[row] <= 1 && fieldMap.has(row)
    );
    setValidatedHeader(validatedRows);
  };

  const isHeaderValid = (header?: string, index?: number): boolean => {
    const checkHeader = header ?? tableHeader[index ?? 0] ?? "";
    const fieldCount = tableHeader.reduce<Record<string, number>>(
      (acc, field) => {
        acc[field] = (acc[field] || 0) + 1;
        return acc;
      },
      {}
    );

    const fieldMap = new Set(headerGuide.map((item) => item.field));

    return fieldCount[checkHeader] <= 1 && fieldMap.has(checkHeader);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0], validateHeaders);
    }
  };

  const handleSelectCategory = (value: string) => {
    setSelectedCategory(value);
    fetchImportDataGuide(value);
  };

  const fetchImportDataGuide = async (categoryId: string) => {
    setLoading(true);
    try {
      const response = await claimService.importDataGuide({
        channel: channel || "",
        category: categoryId,
      });

      const guideResponse =
        Array.isArray(response) && response.length > 0
          ? response[0].data
          : null;

      if (guideResponse) {
        setHeaderGuide(guideResponse);
        setHeaderOptions(
          guideResponse.map((guide: any) => {
            return {
              label: `${guide?.field} ${guide?.required ? "(Required)" : ""}`,
              value: guide?.field,
            };
          })
        );
      } else {
        toastNotification(
          "Header guide is empty. Please select another category.",
          "error"
        );
      }
    } catch (error) {
      toastNotification(
        "Header guide is empty. Please select another category.",
        "error"
      );
      console.error("Error fetching guide", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || tableHeader.length <= 0 || tableData.length <= 0)
      return;
    setUploadStatus("uploading");
    setLoading(true);

    try {
      // Transform tableData so that the first row is used as keys for the subsequent rows
      const importData = transformJsonWithHeaders(tableHeader, tableData);

      const uploadPromise = claimService.importAsJson({
        data: importData,
        input: "Data",
        channel: channel || "",
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

  const handleCheckSelectedHeader = (index: number) => {
    const newValidatedHeader = [...validatedHeader];
    newValidatedHeader[index] = !newValidatedHeader[index];

    setValidatedHeader(newValidatedHeader);
  };

  const handleClickHeader = (index: number, header: string) => {
    const newHeaderOption = headerOptions.map((option) => ({
      ...option,
      disable: tableHeader.includes(option.value) && option.value !== header,
    }));

    setHeaderOptions(newHeaderOption);
    setIsModalEditOpen(true);
    setHeaderIndex(index);
    setSelectedHeader(header);
  };

  const handleConfirmEdit = () => {
    setTableHeader((prevItems) =>
      prevItems.map((item, i) =>
        i === headerIndex
          ? selectedHeader === "add"
            ? newLabelHeader
            : selectedHeader
          : item
      )
    );

    // If a new label is provided, add it to the header options list
    if (newLabelHeader) {
      setHeaderOptions((prev) => [
        ...prev,
        { label: newLabelHeader, value: newLabelHeader },
      ]);
    }

    // Toggle the validation state for the selected header
    setValidatedHeader((prev) => {
      const updatedValidation = [...prev];
      updatedValidation[headerIndex] = !updatedValidation[headerIndex];
      return updatedValidation;
    });

    // Close the modal and reset input fields
    setIsModalEditOpen(false);
    setNewLabelHeader("");
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
            {tableHeader.map((header: string, index: number) => (
              <TableHead
                key={index}
                className={`truncate cursor-pointer transition-colors duration-200 border-r ${
                  !isHeaderValid(header)
                    ? "text-white bg-red-500 hover:bg-red-400"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => handleClickHeader(index, header)}
              >
                <div className="flex flex-row gap-3">
                  {EditIcon(
                    !isHeaderValid(header) ? "white" : "#016DA1",
                    "20",
                    "20",
                    "0 0 24 24"
                  )}

                  {header}

                  {isHeaderValid(header) ? (
                    <Input
                      type="checkbox"
                      checked={validatedHeader[index]}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        handleCheckSelectedHeader(index);
                      }}
                      className="w-4 h-4"
                    />
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            {AlertCircleIcon("white", "20", "20", "0 0 24 24")}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-sm">
                            Edit the column name to resolve the error
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row: any, index: number) => (
            <TableRow key={index}>
              {row.map((cell: any, cellIndex: number) => (
                <TableCell key={cellIndex} className="border-r">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderEditModal = () => {
    return (
      <Dialog open={isModalEditOpen}>
        <DialogContent className="w-[90vw] max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="mb-4">Edit column label</DialogTitle>
            <DialogDescription>
              Select a field for this column
            </DialogDescription>
            <div>
              <Select
                value={selectedHeader}
                onValueChange={(value) => setSelectedHeader(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedHeader} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {headerOptions.map((option, index) => (
                      <SelectItem key={index} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="border border-red-500 text-red-500 bg-white hover:bg-red-100"
              onClick={() => setIsModalEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="btn btn-primary"
              onClick={() => handleConfirmEdit()}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
            disabled={
              !selectedFile || uploadStatus === "uploading" || !!errorMessage
            }
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
            <div className="text-xs mb-1.5 font-medium">Select Category</div>
            <Select
              value={selectedCategory}
              onValueChange={handleSelectCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>{renderCategoryOptions()}</SelectContent>
            </Select>
          </div>
          {selectedCategory && headerGuide.length > 0 ? (
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
          {selectedFile && tableHeader.length > 0 && tableData.length > 0 ? (
            <div className="pt-4">
              {errorMessage ? (
                <p className="mb-2 text-xs text-red-500">{errorMessage}</p>
              ) : (
                <p className="mb-2 text-xs">
                  <span className="font-semibold">
                    {`${validatedHeader.filter(Boolean).length} `}
                  </span>
                  column(s) will be imported.
                  <span className="font-semibold">
                    {` ${validatedHeader.filter((value) => !value).length} `}
                  </span>
                  columns will not be imported.
                </p>
              )}
              {renderPreviewTable()}
              {isModalEditOpen ? renderEditModal() : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const ImportWithPreviewPageWithSidebar = (params: any) =>
  WithSidebar(ImportWithPreviewPage)(params);
export default ImportWithPreviewPageWithSidebar;
