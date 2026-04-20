'use client';

import React from 'react';
import { ChevronLeft, Upload } from 'react-feather';

import { Box, Button, FileUpload, Badge } from '@repo/ui';

import { PageHeader } from '@/components/page-header';
import AppURL from '@/constants/app-url.const';
import { useScreen } from '@/context/screen.context';
import { useUploadSanction } from '@/hooks/useUploadSanction.hooks';
import { toastPromise } from '@/lib/toast';

export default function UploadSanctionPage() {
  const { hasAccess, selectedFile, handleFileChange, handleUpload, isUploading, goBack } =
    useUploadSanction();

  const { setLoading } = useScreen();

  if (hasAccess === false) {
    return null;
  }

  const handleFormSubmit = async () => {
    setLoading(true);
    const uploadPromise = handleUpload();
    try {
      await toastPromise(uploadPromise, {
        loading: 'Uploading sanction data...',
        success: <Box as="b">Sanction data uploaded successfully!</Box>,
        error: 'Upload failed!',
      });
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { label: 'Sanction List', href: AppURL.sanctionList },
    { label: 'Upload', isCurrentPage: true },
  ];

  return (
    <Box className="flex flex-col w-full">
      <PageHeader title="Upload Blacklist" breadcrumbs={breadcrumbs} showBackButton={false}>
        <Box
          onClick={goBack}
          className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Box>
        <Button
          onClick={handleFormSubmit}
          disabled={!selectedFile || isUploading}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-5 h-10 ml-4"
          leftIcon={<Upload className="w-5 h-5" />}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </PageHeader>

      <Box className="flex flex-col w-full p-4 md:p-6 gap-6">
        <Box className="p-4 sm:p-6 bg-white rounded-lg shadow-sm">
          <FileUpload accept=".csv" value={selectedFile} onChange={handleFileChange} clearable />

          <Box className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
            <Box as="h3" className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Box className="w-1.5 h-6 bg-[#F5BA41] rounded-full" />
              CSV Format Requirements
            </Box>
            <Box as="p" className="text-sm text-gray-600 mb-6">
              To ensure a successful upload, your CSV file should include the following columns:
            </Box>

            <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              <RequirementItem label="first_name" required />
              <RequirementItem label="middle_name" />
              <RequirementItem label="last_name" />
              <RequirementItem label="id_number" required />
              <RequirementItem label="phone_number" required />
              <RequirementItem label="email" required sub="valid email format" />
              <RequirementItem label="source_name" required sub="must match existing source" />
              <RequirementItem label="blacklist_date" required sub="format: YYYY-MM-DD" />
              <RequirementItem label="blacklist_reason" required />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const RequirementItem = ({
  label,
  required,
  sub,
}: {
  label: string;
  required?: boolean;
  sub?: string;
}) => (
  <Box className="flex flex-col">
    <Box className="flex items-center gap-2">
      <Box as="span" className="font-mono text-sm font-semibold text-gray-800">
        {label}
      </Box>
      {required ? (
        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
          Required
        </Badge>
      ) : (
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
          Optional
        </Badge>
      )}
    </Box>
    {sub && (
      <Box as="span" className="text-xs text-gray-500 mt-1 italic">
        {sub}
      </Box>
    )}
  </Box>
);
