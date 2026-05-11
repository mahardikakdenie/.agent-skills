'use client';

import { useParams, useRouter } from 'next/navigation';
import Papa from 'papaparse';
import { useRef, useState } from 'react';
import { ChevronLeft, Eye, Upload, X } from 'react-feather';

import {
  Box,
  Button,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@repo/ui';

import { useScreen } from '@/context/screen.context';
import { useBulkCreateTransactions } from '@/services/transaction/hooks/mutations';

export default function UploadTransactions() {
  const router = useRouter();
  const params = useParams();
  const idParam = params.id;
  const id = typeof idParam === 'string' ? idParam : Array.isArray(idParam) ? idParam[0] : '';
  const [csvData, setCsvData] = useState<Record<string, unknown>[]>([]);
  const { setLoading } = useScreen();
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: bulkCreateTransactions } = useBulkCreateTransactions();

  const handleChooseFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setFile(null);
    setCsvData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePreview = () => {
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setCsvData(results.data as Record<string, unknown>[]);
        },
        error: (error) => {
          console.error('Error parsing CSV file:', error);
        },
      });
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      await bulkCreateTransactions({ id, payload: csvData });
      alert('Package uploaded successfully');
      // router.push(PRODUCT_CATALOG_DETAIL(params.category, params.id));
    } catch (error) {
      console.error(error);
      alert('Failed to upload package');
    }
    setLoading(false);
  };

  return (
    <Box className="p-6 bg-white rounded-lg shadow-sm border border-slate-200 w-full h-full overflow-auto">
      <Box className="flex items-center justify-between mb-8">
        <Box as="h1" className="text-slate-900 font-bold text-2xl">
          Upload Data
        </Box>
        <Box
          onClick={() => router.back()}
          className="font-semibold items-center flex gap-1 text-red-700 hover:text-red-800 text-sm cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Box>
      </Box>

      <Box className="bg-slate-50/50 p-5 rounded-xl border border-slate-100 mb-8">
        <Box className="flex flex-wrap gap-5 items-end">
          <Box className="flex-[3] min-w-[320px] space-y-1.5">
            <Box
              as="label"
              htmlFor="file-upload"
              className="text-xs font-semibold text-slate-600 ml-1 cursor-pointer"
            >
              File Upload (.csv)
            </Box>
            <Box className="flex items-center h-10 bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
              <Box className="flex-1 flex items-center h-full min-w-0">
                <Box
                  as="input"
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleChooseFile}
                  className="hidden"
                />
                <Box
                  as="button"
                  type="button"
                  onClick={triggerFileSelect}
                  className="h-full px-4 bg-slate-50 border-r border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
                >
                  Choose File
                </Box>
                <Box className="px-3 flex-1 min-w-0 flex items-center justify-between">
                  <Box as="span" className="text-slate-600 text-sm truncate">
                    {file ? file.name : 'No file chosen'}
                  </Box>
                  {file && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-red-500 h-6 w-6 p-0 shrink-0"
                      onClick={handleClear}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </Box>
              </Box>
              <Button
                disabled={!file || csvData.length > 0}
                variant="ghost"
                className="h-full rounded-none border-l border-slate-200 px-6 text-primary/80 hover:text-primary hover:bg-slate-50 flex items-center gap-2 disabled:opacity-30 disabled:bg-slate-50/50 transition-colors text-sm font-medium shrink-0"
                onClick={handlePreview}
              >
                <Eye className="w-4 h-4" /> Preview
              </Button>
            </Box>
          </Box>

          <Box className="mb-[1px]">
            <Button
              disabled={csvData.length === 0}
              className="btn-primary h-10 px-8 flex items-center gap-2 shadow-sm font-semibold"
              onClick={handleUpload}
            >
              <Upload className="w-4 h-4" /> Upload
            </Button>
          </Box>
        </Box>
      </Box>

      {csvData.length > 0 && (
        <Box className="mt-5 overflow-auto bg-white shadow p-4 pb-0 rounded-md w-full">
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
                  {Object.values(item).map((value, j) => (
                    <TableCell key={j}>
                      {value !== undefined && value !== null ? String(value) : ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
}
