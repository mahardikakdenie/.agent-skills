'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Download, Upload } from 'react-feather';
import * as XLSX from 'xlsx';

import {
  Box,
  Button,
  FileUpload,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@repo/ui';

import AlertCircleIcon from '@/components/icons/alert-circle-icon';
import EditIcon from '@/components/icons/edit-icon';
import { PageHeader } from '@/components/page-header';
import AppURL from '@/constants/app-url.const';
import { useScreen } from '@/context/screen.context';
import { capitalizeStringWithChar } from '@/lib/formatter';
import { toastPromise, toastNotification } from '@/lib/toast';
import { useChannelsV1 } from '@/services/channel/hooks/queries';
import { useImportClaimsAsJson } from '@/services/claims/hooks/mutations';
import { useClaimImportDataGuide } from '@/services/claims/hooks/queries';
import { useCategories } from '@/services/product/hooks/queries';

export default function ImportWithPreviewPage() {
  const router = useRouter();
  const { setLoading } = useScreen();

  // States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>(
    'idle',
  );
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableHeader, setTableHeader] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [channelOptions, setChannelOptions] = useState<any[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
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
  const [selectedHeader, setSelectedHeader] = useState<string>('');
  const [newLabelHeader, setNewLabelHeader] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { data: categoriesResponse, isFetching: isCategoriesFetching } = useCategories({
    page: 1,
    limit: 100,
  });
  const { data: channelsResponse, isFetching: isChannelsFetching } = useChannelsV1({
    page: 1,
    limit: 100,
  });
  const shouldFetchImportGuide = Boolean(selectedChannel && selectedCategory);
  const {
    data: importDataGuideResponse,
    isFetching: isImportGuideFetching,
    error: importDataGuideError,
  } = useClaimImportDataGuide(
    shouldFetchImportGuide
      ? ({ channel: selectedChannel, category: selectedCategory } as any)
      : undefined,
    {
      enabled: shouldFetchImportGuide,
      retry: false,
    },
  );
  const { mutateAsync: importClaimsAsJson } = useImportClaimsAsJson();

  useEffect(() => {
    setLoading(isCategoriesFetching || isChannelsFetching || isImportGuideFetching);
  }, [isCategoriesFetching, isChannelsFetching, isImportGuideFetching, setLoading]);

  useEffect(() => {
    const categories = (categoriesResponse as any)?.data;
    if (Array.isArray(categories)) {
      setCategoryOptions(
        categories.map((item: any) => ({
          label: capitalizeStringWithChar(item.name),
          value: item.id,
        })),
      );
    }
  }, [categoriesResponse]);

  useEffect(() => {
    const channels = (channelsResponse as any)?.data;
    if (Array.isArray(channels)) {
      setChannelOptions(
        channels.map((item: any) => ({
          label: capitalizeStringWithChar(item.name),
          value: item.id,
        })),
      );
    }
  }, [channelsResponse]);

  useEffect(() => {
    if (!shouldFetchImportGuide) {
      setHeaderGuide([]);
      setHeaderOptions([]);
      return;
    }

    const guideResponse =
      Array.isArray(importDataGuideResponse) && importDataGuideResponse.length > 0
        ? importDataGuideResponse[0]?.data
        : null;

    if (guideResponse) {
      setHeaderGuide(guideResponse);
      setHeaderOptions(
        guideResponse.map((guide: any) => ({
          label: `${guide?.field} ${guide?.required ? '(Required)' : ''}`,
          value: guide?.field,
        })),
      );
    } else if (!isImportGuideFetching) {
      setHeaderGuide([]);
      setHeaderOptions([]);
      toastNotification('Header Guide not found. Please select another category.', 'error');
    }
  }, [importDataGuideResponse, isImportGuideFetching, shouldFetchImportGuide]);

  useEffect(() => {
    if (importDataGuideError) {
      toastNotification('Header Guide not found. Please select another category.', 'error');
    }
  }, [importDataGuideError]);

  const handleDownloadTemplate = () => {
    try {
      console.log(channelOptions);
      const selectedChannelOption = channelOptions.filter((x) => x.value == selectedChannel)[0];
      window.open(
        `/policy_templates/${selectedChannelOption.label}_claim_import_template.xlsx`,
        '_blank',
      );
    } catch (error) {
      console.log(error);
    }
  };

  const checkAllRequiredHeader = () => {
    const filterRequiredHeader = headerGuide.filter((header) => header.required);
    const filterHeaderSubmitted = tableHeader.filter((_, index) => validatedHeader[index]);

    const filterHeaderSubmittedSet = validatedHeader.length
      ? new Set(filterHeaderSubmitted)
      : new Set(tableHeader);
    return filterRequiredHeader.every((item) => filterHeaderSubmittedSet.has(item.field));
  };

  useEffect(() => {
    if (!checkAllRequiredHeader()) {
      setErrorMessage('You must match all required column to import.');
    } else {
      setErrorMessage('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerGuide, tableHeader, validatedHeader]);

  const parseExcelFile = (file: File) => {
    return new Promise<any[]>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false,
        });

        resolve(jsonData);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const transformJsonWithHeaders = (tableHeader: any[], tableData: any[]) => {
    if (!tableHeader.length && !tableData.length) return [];

    return tableData.map((row) =>
      Object.fromEntries(tableHeader.map((key: string, index: number) => [key, row[index]])),
    );
  };

  const handleFileSelection = async (file: File, callback: (data: any) => void) => {
    if (
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'text/csv'
    ) {
      setSelectedFile(file);
      setLoading(true);
      try {
        const jsonData = await parseExcelFile(file);
        const tableData = jsonData;
        const tableHeader = jsonData.shift();
        setTableHeader(tableHeader);
        setTableData(tableData);

        callback(tableHeader);
      } catch (error) {
        console.error('Error processing file:', error);
        alert('Error processing file');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please upload an Excel (.xlsx or .xls) or CSV (.csv) file');
    }
  };

  const validateHeaders = (jsonData: any) => {
    const fieldCount: Record<string, number> = {};
    const fieldMap = new Set(headerGuide.map((item) => item.field));

    jsonData.forEach((row: any) => {
      fieldCount[row] = (fieldCount[row] || 0) + 1;
    });

    const validatedRows = jsonData.map((row: any) => fieldCount[row] <= 1 && fieldMap.has(row));
    setValidatedHeader(validatedRows);
  };

  const isHeaderValid = (header?: string, index?: number): boolean => {
    const checkHeader = header ?? tableHeader[index ?? 0] ?? '';
    const fieldCount = tableHeader.reduce<Record<string, number>>((acc, field) => {
      acc[field] = (acc[field] || 0) + 1;
      return acc;
    }, {});

    const fieldMap = new Set(headerGuide.map((item) => item.field));

    return fieldCount[checkHeader] <= 1 && fieldMap.has(checkHeader);
  };

  const resetSelectedFileState = () => {
    setSelectedFile(null);
    setTableHeader([]);
    setTableData([]);
    setValidatedHeader([]);
    setUploadStatus('idle');
    setIsModalEditOpen(false);
    setHeaderIndex(0);
    setSelectedHeader('');
    setNewLabelHeader('');
  };

  const handleFileUploadChange = async (file: File | File[] | null) => {
    const selectedUploadFile = Array.isArray(file) ? file[0] : file;

    if (!selectedUploadFile) {
      resetSelectedFileState();
      return;
    }

    await handleFileSelection(selectedUploadFile, validateHeaders);
  };

  const handleSelectChannel = (value: string) => {
    setSelectedChannel(value);
  };

  const handleSelectCategory = (value: string) => {
    setSelectedCategory(value);
  };

  const handleUpload = async () => {
    if (!selectedFile || tableHeader.length <= 0 || tableData.length <= 0) return;
    setUploadStatus('uploading');
    setLoading(true);

    try {
      // Transform tableData so that the first row is used as keys for the subsequent rows
      const importData = transformJsonWithHeaders(tableHeader, tableData);

      const uploadPromise = importClaimsAsJson({
        data: importData,
        input: 'Data',
        channel: selectedChannel,
        category: selectedCategory,
      });

      await toastPromise(uploadPromise, {
        loading: 'Uploading file...',
        success: <Box as="b">File uploaded successfully!</Box>,
        error: 'Upload failed!',
      });

      setUploadStatus('success');
      setTimeout(() => {
        router.push(AppURL.claimList);
      }, 1500);
    } catch (error) {
      setUploadStatus('error');
      console.error('Upload error:', error);
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
        i === headerIndex ? (selectedHeader === 'add' ? newLabelHeader : selectedHeader) : item,
      ),
    );

    // If a new label is provided, add it to the header options list
    if (newLabelHeader) {
      setHeaderOptions((prev) => [...prev, { label: newLabelHeader, value: newLabelHeader }]);
    }

    // Toggle the validation state for the selected header
    setValidatedHeader((prev) => {
      const updatedValidation = [...prev];
      updatedValidation[headerIndex] = !updatedValidation[headerIndex];
      return updatedValidation;
    });

    // Close the modal and reset input fields
    setIsModalEditOpen(false);
    setNewLabelHeader('');
  };

  const renderChannelOptions = () => {
    if (channelOptions.length === 0) return null;
    return (
      <SelectGroup>
        {channelOptions.map((channel) => (
          <SelectItem key={channel.value} value={channel.value}>
            {channel.label}
          </SelectItem>
        ))}
      </SelectGroup>
    );
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
                    ? 'text-white bg-red-500 hover:bg-red-400'
                    : 'hover:bg-gray-200'
                }`}
                onClick={() => handleClickHeader(index, header)}
              >
                <Box className="flex flex-row gap-3">
                  {EditIcon(!isHeaderValid(header) ? 'white' : '#016DA1', '20', '20', '0 0 24 24')}

                  {header}

                  {isHeaderValid(header) ? (
                    <Input
                      type="checkbox"
                      checked={validatedHeader[index]}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => {
                        handleCheckSelectedHeader(index);
                      }}
                      className="w-4 h-4"
                    />
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Box>{AlertCircleIcon('white', '20', '20', '0 0 24 24')}</Box>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={4}>
                          <Box as="p" className="text-sm">
                            Edit the column name to resolve the error
                          </Box>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Box>
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
            <DialogDescription>Select a field for this column</DialogDescription>
            <Box>
              <Select value={selectedHeader} onValueChange={(value) => setSelectedHeader(value)}>
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
            </Box>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="border border-red-500 text-red-500 bg-white hover:bg-red-100"
              onClick={() => setIsModalEditOpen(false)}
            >
              Cancel
            </Button>
            <Button className="btn btn-primary" onClick={() => handleConfirmEdit()}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const breadcrumbs = [
    { label: 'Claim List', href: AppURL.claimList },
    { label: 'Import With Preview', isCurrentPage: true },
  ];

  return (
    <Box className="flex flex-col w-full">
      <PageHeader
        title="Import Claims with Preview"
        breadcrumbs={breadcrumbs}
        showBackButton={true}
      >
        <Button
          onClick={handleDownloadTemplate}
          className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
          leftIcon={<Download className="w-5 h-5" />}
        >
          Import Template
        </Button>

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploadStatus === 'uploading' || !!errorMessage}
          className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
          leftIcon={<Upload className="w-5 h-5" />}
        >
          {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
        </Button>
      </PageHeader>

      <Box className="flex flex-col w-full p-4 md:p-6 gap-4">
        <Box className="p-4 sm:p-6 bg-white rounded-lg">
          <Box className="mb-4">
            <Box className="text-xs mb-1.5 font-medium">Select Channel</Box>
            <Select value={selectedChannel} onValueChange={handleSelectChannel}>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>{renderChannelOptions()}</SelectContent>
            </Select>
          </Box>
          <Box className="mb-4">
            <Box className="text-xs mb-1.5 font-medium">Select Category</Box>
            <Select value={selectedCategory} onValueChange={handleSelectCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>{renderCategoryOptions()}</SelectContent>
            </Select>
          </Box>
          {selectedCategory && headerGuide.length > 0 ? (
            <FileUpload
              accept=".xlsx,.xls,.csv"
              value={selectedFile}
              onChange={handleFileUploadChange}
              clearable
            />
          ) : null}
          {selectedFile && tableHeader.length > 0 && tableData.length > 0 ? (
            <Box className="pt-4">
              {errorMessage ? (
                <Box as="p" className="mb-2 text-xs text-red-500">
                  {errorMessage}
                </Box>
              ) : (
                <Box as="p" className="mb-2 text-xs">
                  <Box as="span" className="font-semibold">
                    {`${validatedHeader.filter(Boolean).length} `}
                  </Box>
                  column(s) will be imported.
                  <Box as="span" className="font-semibold">
                    {` ${validatedHeader.filter((value) => !value).length} `}
                  </Box>
                  columns will not be imported.
                </Box>
              )}
              {renderPreviewTable()}
              {isModalEditOpen ? renderEditModal() : null}
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
