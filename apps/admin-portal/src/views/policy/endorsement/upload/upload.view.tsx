'use client';

import moment from 'moment';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ChevronLeft, X } from 'react-feather';
import * as XLSX from 'xlsx';

import { Box } from '@repo/ui';

import Button from '@/components/button';
import Modal from '@/components/modal';
import Select from '@/components/select';
import AppURL from '@/constants/app-url.const';
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import { getBreadcrumbs, getHeaderPage, toastNotification } from '@/helpers/app.helper';
import UploadIcon from '@/images/upload.icon';
import { policyService } from '@/services/policy/api/policy.service';

export const EndorsementUploadView = () => {
  const [selectedFileType, setSelectedFileType] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [rawDataForUpload, setRawDataForUpload] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [uploadStats, setUploadStats] = useState({ success: 0, failed: 0 });
  const [dateFormatError, setDateFormatError] = useState(false);

  const path = usePathname();
  const router = useRouter();
  const { breadcrumbsArray } = getHeaderPage(3, path, true);
  const { user } = useAuth();
  const { setLoading } = useScreen();

  const relationTypes = [
    { label: 'Additional', value: 'Additional' },
    { label: 'Termination', value: 'Reduction' },
  ];
  const [relationOptions] = useState(relationTypes);

  const toSnakeCase = (str: string) =>
    str
      .replace(/\s+/g, '_')
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .toLowerCase();

  const isValidYYYYMMDDFormat = (val: string): boolean => {
    return moment(val, 'YYYY-MM-DD', true).isValid();
  };

  const handlePreview = () => {
    if (!fileToUpload) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
        defval: '',
        raw: false,
      });

      if (!rawData.length) return;

      const nonEmptyKeys = Object.keys(rawData[0]).filter((key) =>
        rawData.some((row) => row[key]?.toString().trim() !== ''),
      );

      const previewData: any[] = [];
      const uploadData: any[] = [];

      for (const row of rawData) {
        const previewRow: Record<string, any> = {};
        const uploadRow: Record<string, any> = {};

        for (const key of nonEmptyKeys) {
          let val = row[key];
          const isDateField = /date|birth/i.test(key);

          if (isDateField) {
            if (typeof val === 'number') {
              const date = XLSX.SSF.parse_date_code(val);
              if (date) {
                val = `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
              } else {
                setDateFormatError(true);
                return;
              }
            }

            if (typeof val === 'string' && !isValidYYYYMMDDFormat(val)) {
              setDateFormatError(true);
              return;
            }

            previewRow[key] = moment(val, 'YYYY-MM-DD').format('DD/MM/YYYY');
            uploadRow[key] = val;
          } else {
            previewRow[key] = val;
            uploadRow[key] = val;
          }
        }

        previewData.push(previewRow);
        uploadData.push(uploadRow);
      }

      setParsedData(previewData);
      setRawDataForUpload(uploadData);
    };

    reader.readAsArrayBuffer(fileToUpload);
  };

  const handleUpload = async () => {
    if (!fileToUpload || !selectedFileType || rawDataForUpload.length === 0) {
      toastNotification('Please choose file and file type before uploading.', 'error');
      return;
    }

    setLoading(true);

    try {
      const headerKeyMap: Record<string, string> = {
        'Member Status (E/S/C)': 'member_status',
        'Subsidiary / Entity': 'subsidiary',
        'Bank Account Name (Owner)': 'bank_account_name',
        'Bank Number': 'bank_account_number',
      };

      const mappedData = rawDataForUpload.map((item) => {
        const profile: Record<string, any> = {};

        for (const key in item) {
          const originalValue = item[key];
          const mappedKey = headerKeyMap[key] || toSnakeCase(key);
          profile[mappedKey] = originalValue;
        }

        return { profile };
      });

      const masterResult: any = await policyService.getMasterPoliciesByChannel(user?.channel || '');
      const policyId = masterResult?.id || masterResult?.data?.id;

      const uploadResponse: any = await policyService.bulkCreateEndorsements({
        policy: policyId,
        type: selectedFileType,
        data: mappedData,
      });

      const failedData = uploadResponse?.failed_data || uploadResponse?.data?.failed_data || [];
      setUploadStats({ success: mappedData.length - failedData.length, failed: failedData.length });
      setShowModal(true);
    } catch (error) {
      toastNotification(`Upload failed! Error: ${error}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearFileUploadInput = () => {
    setFileToUpload(null);
    setParsedData([]);
    setRawDataForUpload([]);
  };

  const thClass =
    'px-6 py-6 text-left text-base font-semibold text-gray-500 tracking-wider whitespace-nowrap';
  const tdClass = 'px-6 py-3 text-sm text-gray-500 whitespace-nowrap';

  return (
    <Box className="min-h-screen bg-white">
      <Box className="overflow-x-auto sm:scrollable flex items-center justify-between py-5 px-7">
        <Box>
          {getBreadcrumbs(breadcrumbsArray)}
          <Box as="p" className="font-bold text-lg mt-0">
            Upload Data
          </Box>
        </Box>
        <Box
          onClick={() => router.back()}
          className="flex items-center justify-between cursor-pointer"
        >
          <ChevronLeft color="red" width="30" height="15" />
          <Box as="p" className="text-sm text-red-500 ml-1">
            Kembali
          </Box>
        </Box>
      </Box>

      <Box className="pb-5 px-7">
        <Box className="flex flex-col lg:flex-row gap-2.5">
          <Box className="w-full lg:w-[220px]">
            <Select
              additionalClassNameSelect="w-full pl-4"
              withBorder={true}
              value={selectedFileType}
              onChange={(event) => setSelectedFileType(event.toString())}
              options={relationOptions}
              placeholderSelect="Choose File Type"
            />
          </Box>

          <Box className="relative flex-grow">
            <Box
              as="input"
              key={fileToUpload ? fileToUpload.name : 'empty'}
              type="file"
              id="fileUpload"
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="hidden"
              onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
            />
            <Box
              as="label"
              htmlFor="fileUpload"
              className="w-full h-8 flex items-center px-4 text-xs rounded-md border border-gray-300 cursor-pointer bg-white pr-16"
            >
              <Box as="span" className="truncate">
                {fileToUpload?.name || 'Choose File'}
              </Box>
            </Box>

            {fileToUpload && (
              <Box className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Box onClick={handlePreview} className="cursor-pointer" title="Preview File">
                  {UploadIcon('#4CAF50', '16', '16', '0 0 24 24')}
                </Box>
                <Box
                  onClick={clearFileUploadInput}
                  className="cursor-pointer text-red-500"
                  title="Remove File"
                >
                  <X size={16} />
                </Box>
              </Box>
            )}
          </Box>

          <Button disabled={!fileToUpload} onClick={handlePreview}>
            Preview
          </Button>
          <Button disabled={!fileToUpload || !selectedFileType} onClick={handleUpload}>
            Upload
          </Button>
        </Box>

        {parsedData.length > 0 && (
          <Box className="overflow-x-auto" style={{ minHeight: '60vh' }}>
            <Box as="table" className="min-w-full divide-y divide-gray-200 bg-white">
              <Box as="thead">
                <Box as="tr">
                  {Object.keys(parsedData[0]).map((key) => (
                    <Box as="th" key={key} className={thClass}>
                      {key}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box as="tbody" className="divide-y divide-gray-200">
                {parsedData.map((row, rowIndex) => (
                  <Box as="tr" key={`row-${rowIndex}`}>
                    {Object.entries(row).map(([_, value], cellIndex) => (
                      <Box as="td" key={`cell-${rowIndex}-${cellIndex}`} className={tdClass}>
                        {value?.toString?.() || '-'}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Modal upload result */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        widthClassName="w-full max-w-sm"
        heightClassName="max-h-[40vh]"
      >
        <Box className="text-center p-6">
          <Box as="p" className="text-lg font-semibold mb-4">
            Data Uploaded
          </Box>
          <Box as="p" className="text-sm text-primary">
            {uploadStats.success} records uploaded successfully
          </Box>
          <Box as="p" className="text-sm text-red-500">
            {uploadStats.failed} records failed to upload
          </Box>
          <Box as="p" className="text-sm mt-4">
            View the list to see detailed results
          </Box>
          <Button additionalClassName="mt-4" onClick={() => router.push(AppURL.endorsementList)}>
            View List
          </Button>
        </Box>
      </Modal>

      {/* Modal format error */}
      <Modal
        isOpen={dateFormatError}
        onClose={() => setDateFormatError(false)}
        widthClassName="w-full max-w-sm"
        heightClassName="max-h-[40vh]"
      >
        <Box className="text-center p-6">
          <Box as="p" className="text-base font-semibold">
            Make sure date is in correct format
          </Box>
          <Box as="p" className="text-sm mt-2">
            Invalid date format detected. Please correct the date format in your file to match the
            required format (e.g., YYYY-MM-DD) and re-upload.
          </Box>
          <Button additionalClassName="mt-4" onClick={() => setDateFormatError(false)}>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};
