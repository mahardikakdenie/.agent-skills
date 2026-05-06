'use client';

import { useRouter } from 'next/navigation';
import { useRef, useEffect, useState, useMemo } from 'react';
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Box,
  Combobox,
} from '@repo/ui';

import AppURL from '@/constants/app-url.const';
import { useScreen } from '@/context/screen.context';
import { useChannelsV1 } from '@/services/channel/hooks/queries';
import { useBulkCreateEndorsements } from '@/services/policy/hooks/mutations';
import { useMasterPoliciesByChannel } from '@/services/policy/hooks/queries';

export default function UploadEndorsement() {
  const router = useRouter();
  const { setLoading } = useScreen();
  const [xlsxData, setXlsxData] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [channel, setChannel] = useState<string | undefined>(undefined);
  const [type, setType] = useState('');
  const [policiesId, setPoliciesId] = useState<string>('');
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

  const { data: masterPolicyResponse, isFetching: isMasterPolicyFetching } =
    useMasterPoliciesByChannel(channel || '', { enabled: !!channel });

  const { mutateAsync: bulkCreateEndorsements, isPending: isUploadPending } =
    useBulkCreateEndorsements();

  const handleChooseFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    setLoading(isChannelsFetching || isMasterPolicyFetching || isUploadPending);
  }, [isChannelsFetching, isMasterPolicyFetching, isUploadPending, setLoading]);

  useEffect(() => {
    if (!channel) {
      setPoliciesId('');
      return;
    }
    setPoliciesId((masterPolicyResponse as any)?.id || '');
  }, [channel, masterPolicyResponse]);

  const excelDateToISO = (serial: number) => {
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400;
    const dateInfo = new Date(utcValue * 1000);
    return dateInfo.toISOString().split('T')[0];
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
    if (!channel) {
      alert('Please select a channel before uploading.');
      return;
    }
    if (!policiesId) {
      alert('Master policy not found for selected channel.');
      return;
    }
    if (!type) {
      alert('Please select a type before uploading.');
      return;
    }
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

      const payload = { policy: policiesId, type: type, data: transformedData };

      const response = await bulkCreateEndorsements(payload);
      const successMessage = (response as any)?.message || 'Data uploaded successfully!';
      alert(successMessage);
      router.push(AppURL.endorsementList);
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
          Upload Endorsement
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

        <Box className="flex-1 min-w-[180px] space-y-1.5">
          <Box as="label" className="text-xs font-semibold text-slate-600 ml-1">
            Type
          </Box>
          <Select value={type} onValueChange={(value) => setType(value)}>
            <SelectTrigger className="w-full h-10 shadow-none border-slate-200 bg-white">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Additional">Additional</SelectItem>
                <SelectItem value="Revision">Revision</SelectItem>
                <SelectItem value="Reduction">Reduction</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
