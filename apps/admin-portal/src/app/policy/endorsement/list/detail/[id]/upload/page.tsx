'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, X, Upload, Eye, FileText } from 'react-feather';
import * as XLSX from 'xlsx';

import {
  Button,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
  Box,
} from '@repo/ui';

import AppURL from '@/constants/app-url.const';
import { useScreen } from '@/context/screen.context';
import { useUpdateEndorsementStatusBulking } from '@/services/policy/hooks/mutations';

export default function UploadEndorsement() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { setLoading } = useScreen();
  const [xlsxData, setXlsxData] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutateAsync: updateEndorsementStatusBulking, isPending } =
    useUpdateEndorsementStatusBulking();

  useEffect(() => {
    setLoading(isPending);
  }, [isPending, setLoading]);

  const handleChooseFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const excelDateToISO = (serial: number) => {
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400;
    const dateInfo = new Date(utcValue * 1000);
    const iso = dateInfo.toISOString().split('T')[0];
    return iso;
  };

  const handlePreview = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

        const transformed = parsedData.map((row: any) => {
          const newRow: Record<string, any> = {};
          Object.entries(row).forEach(([key, value]) => {
            if (typeof value === 'number' && value > 20000 && value < 60000) {
              newRow[key] = excelDateToISO(value);
            } else {
              newRow[key] = value;
            }
          });
          return newRow;
        });

        setXlsxData(transformed);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setXlsxData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toSnakeCase = (str: string) =>
    str
      .split(/[(/]/)[0]
      .trim()
      .replace(/[\s\/-]+/g, '_')
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .replace(/^_+|_+$/g, '')
      .replace(/_+/g, '_')
      .toLowerCase();

  const handleUpload = async () => {
    setLoading(true);
    try {
      const transformedData = xlsxData.map((row) => {
        const newRow: Record<string, any> = {};
        Object.entries(row).forEach(([key, value]) => {
          const snakeKey = toSnakeCase(key.trim());
          newRow[snakeKey] = value === '-' ? '' : value || '';
        });
        return {
          profile: newRow,
        };
      });

      const payload = {
        status: 'Approved',
        is_send_email_to_third_party: true,
        data: transformedData,
      };

      const response: any = await updateEndorsementStatusBulking({ id, payload });
      const successMessage = response?.message || 'Data uploaded successfully!';
      alert(successMessage);
      router.push(`${AppURL.endorsementDetail}/${id}`);
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error?.response?.data?.message || 'Upload failed.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
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

      <Box className="bg-slate-50/50 p-5 rounded-xl border border-slate-100 mb-8 space-y-5">
        <Box className="flex flex-wrap gap-5 items-end">
          <Box className="flex-1 min-w-[320px] space-y-1.5">
            <Box
              as="label"
              htmlFor="file-upload"
              className="text-xs font-semibold text-slate-600 ml-1 cursor-pointer"
            >
              File Upload (.xlsx, .xls)
            </Box>
            <Box className="flex items-center h-10 bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
              <Box className="flex-1 flex items-center h-full min-w-0">
                <Box
                  as="input"
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept=".xlsx, .xls"
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
                      onClick={handleClearFile}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </Box>
              </Box>
              <Button
                disabled={!file || xlsxData.length > 0}
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
              disabled={xlsxData.length === 0}
              className="btn-primary h-10 px-8 flex items-center gap-2 shadow-sm font-semibold"
              onClick={handleUpload}
            >
              <Upload className="w-4 h-4" /> Upload
            </Button>
          </Box>
        </Box>
      </Box>

      <Box className="space-y-4">
        <Box className="flex items-center gap-2 px-1">
          <FileText className="w-5 h-5 text-primary" />
          <Box as="h2" className="text-slate-800 font-semibold">
            Data Preview
          </Box>
          {xlsxData.length > 0 && (
            <Box
              as="span"
              className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold"
            >
              {xlsxData.length} Rows
            </Box>
          )}
        </Box>

        <Box className="overflow-auto border border-slate-200 rounded-xl bg-white shadow-sm">
          <Table className="min-w-full">
            <TableHeader className="bg-slate-50/80 border-b border-slate-200">
              <TableRow>
                {xlsxData.length > 0 ? (
                  Object.keys(xlsxData[0]).map((item, i) => (
                    <TableHead
                      key={i}
                      className="whitespace-nowrap font-bold text-slate-700 py-3.5 px-4 text-xs tracking-wider"
                    >
                      {item}
                    </TableHead>
                  ))
                ) : (
                  <TableHead className="py-3.5 px-4">No data available</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {xlsxData.length > 0 ? (
                xlsxData.map((item, i) => (
                  <TableRow
                    key={i}
                    className="hover:bg-slate-50/30 transition-colors border-b border-slate-100 last:border-0"
                  >
                    {Object.keys(item).map((key, j) => (
                      <TableCell key={j} className="py-3 px-4 text-slate-600 text-sm">
                        {item[key] !== undefined && item[key] !== null ? String(item[key]) : '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="text-center py-24" colSpan={100}>
                    <Box className="flex flex-col items-center gap-3 text-slate-400">
                      <FileText className="w-12 h-12 opacity-10" />
                      <Box as="p" className="text-sm font-medium">
                        No records to preview. Select an excel file to begin.
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
