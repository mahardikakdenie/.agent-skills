'use client';

import { useRouter } from 'next/navigation';
import { useRef, useEffect, useState, useMemo } from 'react';
import { ChevronLeft, X, Upload, Eye, FileText } from 'react-feather';
import * as XLSX from 'xlsx';

import {
  Input,
  Button,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
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
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import { useChannelsV1 } from '@/services/channel/hooks/queries';
import {
  useUpdateInsuredPartyChannel,
  useUploadInsuredPartiesFirstTime,
  useUploadInsuredPartiesFirstTimeWithoutTransaction,
} from '@/services/policy/hooks/mutations';

export default function UploadMembership() {
  const router = useRouter();
  const { setLoading } = useScreen();
  const [file, setFile] = useState<File | null>(null);
  const [channel, setChannel] = useState<string | undefined>(undefined);
  const [canUploadFirstTime, setCanUploadFirstTime] = useState(false);
  const [action, setAction] = useState('Feedback');
  const [transaction, setTransaction] = useState('');
  const [chunkNumber, setChunkNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [policyTerm, setPolicyTerm] = useState('');
  const [insuredType, setInsuredType] = useState('');
  const [xlsxData, setXlsxData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const actionOptions = ['Feedback', 'First Time', 'First Time - Without Transaction'];
  const insuredTypeOptions = ['Person', 'Motorcycle', 'Car', 'Gadget'];

  const { permissionList } = useAuth();
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

  const { mutateAsync: updateInsuredPartyChannel, isPending: isUpdatePending } =
    useUpdateInsuredPartyChannel();
  const { mutateAsync: uploadInsuredPartiesFirstTime, isPending: isFirstTimePending } =
    useUploadInsuredPartiesFirstTime();
  const {
    mutateAsync: uploadInsuredPartiesFirstTimeWithoutTransaction,
    isPending: isWithoutTransactionPending,
  } = useUploadInsuredPartiesFirstTimeWithoutTransaction();

  const handleChooseFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    setLoading(
      isChannelsFetching || isUpdatePending || isFirstTimePending || isWithoutTransactionPending,
    );
  }, [
    isChannelsFetching,
    isUpdatePending,
    isFirstTimePending,
    isWithoutTransactionPending,
    setLoading,
  ]);

  useEffect(() => {
    const hasPermissionUploadFirstTime = permissionList.includes(
      'Membership.Membership List.Create',
    );
    setCanUploadFirstTime(hasPermissionUploadFirstTime);
  }, [permissionList]);

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

  const handleUpload = async () => {
    if (!channel) {
      alert('Please select a channel before uploading.');
      return;
    }

    setLoading(true);
    try {
      const transformedData = xlsxData.map((row) => {
        const newRow: Record<string, any> = {};

        const getExcelColumnName = (index: number) => {
          let result = '';
          while (index >= 0) {
            result = String.fromCharCode((index % 26) + 97) + result;
            index = Math.floor(index / 26) - 1;
          }
          return `column_${result}`;
        };

        const values = Object.values(row);
        const MAX_COLUMNS = 67;

        for (let i = 0; i < MAX_COLUMNS; i++) {
          const colKey = getExcelColumnName(i);
          const rawValue = values[i];
          const stringValue = rawValue === '-' ? '' : String(rawValue || '');
          newRow[colKey] = stringValue;
        }

        return newRow;
      });

      const payload: any = {
        is_master_policy: true,
        data: transformedData,
      };

      if (action === 'First Time - Without Transaction') {
        delete payload.is_master_policy;
        payload.channel_id = channel;
      } else if (action === 'First Time') {
        delete payload.is_master_policy;

        payload.transaction_id = transaction;
        payload.channel_id = channel;
        payload.master_policy_data = {
          start_date: startDate,
          end_date: endDate,
          policy_term: policyTerm,
          insured_type: insuredType,
        };
      }

      let response: any;
      if (action === 'First Time - Without Transaction') {
        const chunkSize = Number(chunkNumber);
        if (!chunkSize || chunkSize < 1) {
          alert('Please input a valid chunk number.');
          return;
        }
        const fullData = payload.data;
        const chunks = [];
        for (let i = 0; i < fullData.length; i += chunkSize) {
          chunks.push(fullData.slice(i, i + chunkSize));
        }

        for (const chunk of chunks) {
          const chunkedPayload = { ...payload, data: chunk };
          await uploadInsuredPartiesFirstTimeWithoutTransaction(chunkedPayload);
        }

        response = null;
      } else if (action === 'First Time') {
        response = await uploadInsuredPartiesFirstTime(payload);
      } else {
        response = await updateInsuredPartyChannel({
          channelId: channel,
          payload,
        });
      }

      const successMessage =
        response?.data?.message || response?.message || 'Data uploaded successfully!';
      alert(successMessage);
      router.push(AppURL.membershipList);
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
        {canUploadFirstTime && (
          <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Box className="space-y-1.5">
              <Box
                as="label"
                htmlFor="action-select"
                className="text-xs font-semibold text-slate-600 ml-1 cursor-pointer"
              >
                Action
              </Box>
              <Select id="action-select" value={action} onValueChange={(value) => setAction(value)}>
                <SelectTrigger className="w-full h-10 shadow-none border-slate-200 bg-white">
                  <SelectValue placeholder="Feedback" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {actionOptions.map((act, index) => (
                      <SelectItem key={index} value={act}>
                        {act}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Box>

            {action === 'First Time' && (
              <Box className="space-y-1.5">
                <Box
                  as="label"
                  htmlFor="transactionId"
                  className="text-xs font-semibold text-slate-600 ml-1 cursor-pointer"
                >
                  Transaction Id
                </Box>
                <Input
                  type="text"
                  id="transactionId"
                  placeholder="Insert Transaction Id"
                  value={transaction}
                  onChange={(e) => setTransaction(e.target.value)}
                  className="h-10 shadow-none border-slate-200 bg-white"
                />
              </Box>
            )}

            {action === 'First Time - Without Transaction' && (
              <Box className="space-y-1.5">
                <Box
                  as="label"
                  htmlFor="chunkNumber"
                  className="text-xs font-semibold text-slate-600 ml-1 cursor-pointer"
                >
                  Number of Chunk
                </Box>
                <Input
                  type="number"
                  min={0}
                  id="chunkNumber"
                  placeholder="Insert Number of Chunk"
                  value={chunkNumber}
                  onChange={(e) => setChunkNumber(e.target.value)}
                  className="h-10 shadow-none border-slate-200 bg-white"
                />
              </Box>
            )}

            {action === 'First Time' && (
              <>
                <Box className="space-y-1.5">
                  <Box
                    as="label"
                    htmlFor="startDate"
                    className="text-xs font-semibold text-slate-600 ml-1 cursor-pointer"
                  >
                    Start Date
                  </Box>
                  <Input
                    type="date"
                    id="startDate"
                    placeholder="Choose Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-10 shadow-none border-slate-200 bg-white"
                  />
                </Box>

                <Box className="space-y-1.5">
                  <Box
                    as="label"
                    htmlFor="endDate"
                    className="text-xs font-semibold text-slate-600 ml-1 cursor-pointer"
                  >
                    End Date
                  </Box>
                  <Input
                    type="date"
                    id="endDate"
                    placeholder="Choose Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-10 shadow-none border-slate-200 bg-white"
                  />
                </Box>

                <Box className="space-y-1.5">
                  <Box
                    as="label"
                    htmlFor="policyTerm"
                    className="text-xs font-semibold text-slate-600 ml-1 cursor-pointer"
                  >
                    Policy Term
                  </Box>
                  <Input
                    type="text"
                    id="policyTerm"
                    placeholder="Insert Policy Term"
                    value={policyTerm}
                    onChange={(e) => setPolicyTerm(e.target.value)}
                    className="h-10 shadow-none border-slate-200 bg-white"
                  />
                </Box>

                <Box className="space-y-1.5">
                  <Box
                    as="label"
                    htmlFor="insured-type-select"
                    className="text-xs font-semibold text-slate-600 ml-1 cursor-pointer"
                  >
                    Insured Type
                  </Box>
                  <Select
                    id="insured-type-select"
                    value={insuredType}
                    onValueChange={(value) => setInsuredType(value)}
                  >
                    <SelectTrigger className="w-full h-10 shadow-none border-slate-200 bg-white">
                      <SelectValue placeholder="Select Insured Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {insuredTypeOptions.map((type, index) => (
                          <SelectItem key={index} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Box>
              </>
            )}
          </Box>
        )}

        <Box className="flex flex-wrap gap-5 items-end">
          <Box className="flex-1 min-w-[200px] space-y-1.5">
            <Box
              as="label"
              htmlFor="channel-combobox"
              className="text-xs font-semibold text-slate-600 ml-1 cursor-pointer"
            >
              Channel
            </Box>
            <Combobox
              id="channel-combobox"
              placeholder="Select Channel"
              searchPlaceholder="Search channel..."
              options={channels}
              value={channel}
              onValueChange={setChannel}
              triggerClassName="w-full h-10 shadow-none border-slate-200 bg-white"
            />
          </Box>

          <Box className="flex-[3] min-w-[320px] space-y-1.5">
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
