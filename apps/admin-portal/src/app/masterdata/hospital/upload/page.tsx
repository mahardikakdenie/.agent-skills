'use client';

import React from 'react';
import { ChevronLeft, Upload } from 'react-feather';

import { Box, Button } from '@repo/ui';

import HospitalUploadForm from '@/components/forms/hospital-upload-form';
import { PageHeader } from '@/components/core/page-header';
import AppURL from '@/constants/app-url.const';
import { useScreen } from '@/context/screen.context';
import { useHospitalUpload } from '@/hooks/useHospitalUpload.hooks';
import { toastPromise } from '@/lib/toast';

export default function HospitalListUploadPage() {
  const { selectedFile, uploadStatus, handleUpload, handleFileInput, setSelectedFile, goBack } =
    useHospitalUpload();

  const { setLoading } = useScreen();

  const isUploading = uploadStatus === 'uploading';

  const handleFormSubmit = async () => {
    setLoading(true);
    const uploadPromise = handleUpload();
    try {
      await toastPromise(uploadPromise, {
        loading: 'Uploading hospital data...',
        success: <Box as="b">Hospital data uploaded successfully!</Box>,
        error: 'Upload failed!',
      });
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { label: 'Hospital List', href: AppURL.masterdataHospital },
    { label: 'Upload', isCurrentPage: true },
  ];

  const handleFileChange = (file: File | File[] | null) => {
    const singleFile = Array.isArray(file) ? file[0] : file;
    setSelectedFile(singleFile);
  };

  return (
    <Box className="flex flex-col w-full">
      <PageHeader title="Upload Hospital List" breadcrumbs={breadcrumbs} showBackButton={false}>
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

      <HospitalUploadForm
        selectedFile={selectedFile}
        onFileChange={handleFileChange}
        uploadStatus={uploadStatus}
      />
    </Box>
  );
}
