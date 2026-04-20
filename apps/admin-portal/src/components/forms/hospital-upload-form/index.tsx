'use client';

import React from 'react';

import { Box, FileUpload } from '@repo/ui';

interface HospitalUploadFormProps {
  selectedFile: File | null;
  onFileChange: (file: File | File[] | null) => void;
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
}

export default function HospitalUploadForm({
  selectedFile,
  onFileChange,
  uploadStatus,
}: HospitalUploadFormProps) {
  return (
    <Box className="flex flex-col w-full p-4 md:p-6 gap-6">
      <Box className="p-4 sm:p-6 bg-white rounded-lg shadow-sm">
        <FileUpload accept=".xlsx, .xls" value={selectedFile} onChange={onFileChange} clearable />
      </Box>

      {uploadStatus === 'error' && (
        <Box className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <Box as="p" className="text-red-600 text-sm">
            Upload failed. Please try again.
          </Box>
        </Box>
      )}

      {uploadStatus === 'success' && (
        <Box className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <Box as="p" className="text-green-600 text-sm">
            File uploaded successfully! Redirecting...
          </Box>
        </Box>
      )}
    </Box>
  );
}
