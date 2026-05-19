'use client';

import { useParams, useRouter } from 'next/navigation';
import Papa from 'papaparse';
import { useState } from 'react';

import {
  Box,
  Button,
  FileUpload,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui';

import { useProducts } from '@/app/product-category/hooks';
import { ContentLoadingWrapper } from '@/components/core/loading';
import AppURL from '@/constants/app-url.const';

const DETAIL_TYPE_OPTIONS = [
  { label: 'Terms and Conditions', value: 'tnc' },
  { label: 'Cara Klaim', value: 'how-to-claim' },
  { label: 'Pengecualian', value: 'exception' },
  { label: 'Persentase', value: 'persentase' },
];

type CsvRow = Record<string, string>;

export default function UploadPlanDetail() {
  const params = useParams();
  const idParam = params.id;
  const categoryParam = params.category;
  const id = typeof idParam === 'string' ? idParam : Array.isArray(idParam) ? idParam[0] : '';
  const category =
    typeof categoryParam === 'string'
      ? categoryParam
      : Array.isArray(categoryParam)
        ? categoryParam[0]
        : '';

  const { plan, uploadPlanDetails, isLoadingUploadPlanDetails } = useProducts({
    planId: id,
    category,
  });
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [type, setType] = useState<string>('tnc');
  const [file, setFile] = useState<File | null>(null);

  const planName = typeof plan?.name === 'string' ? plan.name : '';
  const planNameLines = planName.split('|').filter(Boolean);
  const tableColumns = csvData.length > 0 ? Object.keys(csvData[0] ?? {}) : [];
  const hasPreview = csvData.length > 0;

  const handleTypeChange = (value: string | undefined) => {
    setType(value ?? 'tnc');
    setCsvData([]);
  };

  const handleChooseFile = (selectedFile: File | File[] | null) => {
    const nextFile = Array.isArray(selectedFile) ? (selectedFile[0] ?? null) : selectedFile;

    setFile(nextFile);
    setCsvData([]);
  };

  const handlePreview = () => {
    if (file) {
      Papa.parse<CsvRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setCsvData(results.data);
        },
        error: (error) => {
          console.error('Error parsing CSV file:', error);
        },
      });
    }
  };

  const router = useRouter();
  const handleUpload = async () => {
    try {
      await uploadPlanDetails({ id, type, data: csvData });
      router.push(AppURL.productCatalogDetail(category, id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ContentLoadingWrapper isLoading={isLoadingUploadPlanDetails}>
      <Box className="flex w-full flex-col gap-4 px-4 py-4 md:px-6 md:py-5">
        <Box className="rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <Box className="flex flex-col gap-2.5">
            <Box as="h2" className="text-sm font-semibold text-slate-950">
              Upload Plan Details
            </Box>

            {planNameLines.length > 0 && (
              <Box
                as="h1"
                className="max-w-2xl text-lg font-bold leading-6 text-primary sm:text-xl"
              >
                {planNameLines.map((item: string, index: number) => (
                  <Box key={`${item}-${index}`} as="span" className="block">
                    {item}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        <Box className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <Box className="flex flex-col gap-4">
            <Select
              label="Detail Type"
              size="lg"
              value={type}
              onValueChange={handleTypeChange}
              options={DETAIL_TYPE_OPTIONS}
              className="w-full"
            />

            <Box className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <FileUpload
                accept=".csv"
                value={file}
                onChange={handleChooseFile}
                clearable
                label="CSV File"
              />

              <Box className="flex flex-col gap-2 sm:flex-row lg:justify-end">
                <Button
                  disabled={!file || hasPreview}
                  className="w-full sm:w-auto"
                  onClick={handlePreview}
                >
                  Preview
                </Button>
                <Button disabled={!hasPreview} className="w-full sm:w-auto" onClick={handleUpload}>
                  Upload
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <Box className="flex flex-col gap-1 border-b border-slate-200 px-4 py-3 md:px-5">
            <Box as="h3" className="text-sm font-semibold text-slate-950">
              Preview
            </Box>
            {hasPreview ? (
              <Box as="p" className="text-xs text-slate-500">
                {csvData.length} rows ready to upload
              </Box>
            ) : (
              <Box as="p" className="text-xs text-slate-500">
                Choose a detail type and CSV file, then preview it before upload.
              </Box>
            )}
          </Box>

          <Box className="overflow-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  {tableColumns.map((item) => (
                    <TableHead key={item} className="whitespace-nowrap bg-slate-50">
                      {item}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {hasPreview ? (
                  csvData.map((item, rowIndex) => (
                    <TableRow key={`csv-row-${rowIndex}`}>
                      {tableColumns.map((column) => (
                        <TableCell key={`${rowIndex}-${column}`} className="whitespace-nowrap">
                          {item[column]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={1}
                      className="h-24 text-center text-sm text-muted-foreground"
                    >
                      No preview data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </Box>
    </ContentLoadingWrapper>
  );
}
