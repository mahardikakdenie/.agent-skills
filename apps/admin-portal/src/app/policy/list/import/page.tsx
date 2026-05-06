'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useMemo } from 'react';
import { ChevronLeft, X, Upload, Eye, FileText } from 'react-feather';
import * as XLSX from 'xlsx';

import {
  Input,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Box,
  Combobox,
} from '@repo/ui';

import AppURL from '@/constants/app-url.const';
import { useScreen } from '@/context/screen.context';
import { useChannelsV1 } from '@/services/channel/hooks/queries';
import { useUploadPoliciesDrGadget } from '@/services/policy/hooks/mutations';

export default function ImportPolicyPage() {
  const router = useRouter();
  const { setLoading } = useScreen();
  const [file, setFile] = useState<File | null>(null);
  const [channel, setChannel] = useState<string | undefined>(undefined);
  const [xlsxData, setXlsxData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: channelsResponse, isFetching: isChannelsFetching } = useChannelsV1({
    page: 1,
    limit: 100,
  });

  const channels = useMemo(() => {
    const data = ((channelsResponse as any)?.data ?? []) as any[];
    return data.map((c: any) => ({
      label: c.name,
      value: c.id,
    }));
  }, [channelsResponse]);

  const { mutateAsync: uploadPoliciesDrGadget, isPending: isUploadPending } =
    useUploadPoliciesDrGadget();

  const handleChooseFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    setLoading(isChannelsFetching || isUploadPending);
  }, [isChannelsFetching, isUploadPending, setLoading]);

  const handlePreview = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        setXlsxData(parsedData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setXlsxData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // ? this clears the file name
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

          const csvFile = new File([blob], f.name.replace(/\.(xlsx|xls)$/i, '.csv'), {
            type: 'text/csv',
          });

          // ? Trigger download
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
      alert('Please select a channel before uploading.');
      return;
    }
    const fileCSV: File | null = (await convertCSV(file)) as File | null;
    try {
      const formData = new FormData();
      formData.append('file', fileCSV!);

      try {
        const c = channels.find((x) => x.value === channel);
        if (!c) {
          alert('Selected channel not found.');
          return;
        }
        if (c.label === 'drgadget') {
          const response: any = await uploadPoliciesDrGadget(formData);
          const successMessage =
            response?.data?.message || response?.message || 'Data uploaded successfully!';
          alert(successMessage);
          router.push(AppURL.policyList);
        } else {
          alert('Fitur Import untuk Partner ini belum didukung');
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error?.response?.data?.message || 'Upload failed.';
      alert(errorMessage);
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

      <Box className="bg-slate-50/50 p-5 rounded-xl border border-slate-100 flex flex-wrap gap-5 items-end mb-8">
        <Box className="flex-1 min-w-[200px] space-y-1.5">
          <Box as="label" className="text-xs font-semibold text-slate-600 ml-1">
            Channel
          </Box>
          <Combobox
            placeholder="Select Channel"
            searchPlaceholder="Search channel..."
            options={channels}
            value={channel}
            onValueChange={setChannel}
            triggerClassName="w-full h-10 shadow-none border-slate-200"
          />
        </Box>

        <Box className="flex-[3] min-w-[320px] space-y-1.5">
          <Box as="label" className="text-xs font-semibold text-slate-600 ml-1">
            File Upload (.xlsx, .xls)
          </Box>
          <Box className="flex items-center h-10 bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
            <Box className="flex-1 flex items-center h-full min-w-0">
              <input
                ref={fileInputRef}
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
