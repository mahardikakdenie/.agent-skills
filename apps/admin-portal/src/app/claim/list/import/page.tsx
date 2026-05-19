// 'use client';
//
// import { ClaimImportView } from '@/views/policy/import/import.view';
//
// export default function ClaimImportPage() {
//   return <ClaimImportView />;
// }

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronLeft, Upload } from 'react-feather';

import {
  Box,
  Button,
  FileUpload,
} from '@repo/ui';

import { PageHeader } from '@/components/core/page-header';
import AppURL from '@/constants/app-url.const';
import { useScreen } from '@/context/screen.context';
import { toastPromise } from '@/lib/toast';
import { useImportClaims } from '@/services/claims/hooks/mutations';

export default function ImportPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>(
    'idle',
  );
  const [base64String, setBase64String] = useState<string>('');
  const { setLoading } = useScreen();
  const { mutateAsync: importClaims } = useImportClaims();

  // Helper function to convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data:application/[type];base64, prefix
        const base64Content = base64String.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (file: File | File[] | null) => {
    const singleFile = Array.isArray(file) ? file[0] : file;

    if (!singleFile) {
      setSelectedFile(null);
      setBase64String('');
      return;
    }

    setSelectedFile(singleFile);
    try {
      const base64 = await convertToBase64(singleFile);
      setBase64String(base64);
    } catch (error) {
      console.error('Error converting file to base64:', error);
      alert('Error processing file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !base64String) return;

    setUploadStatus('uploading');
    setLoading(true);

    const uploadPromise = importClaims({
      data: base64String,
      input: 'File',
      channel: 'd1181179-a65f-4c9a-9085-6c7ce90f5845',
      category: 'b140a15e-af58-43c9-9888-e83cbca816e4',
    });

    try {
      await toastPromise(uploadPromise, {
        loading: 'Uploading file...',
        success: <Box as="b">File uploaded successfully!</Box>,
        error: 'Upload failed!',
      });

      setUploadStatus('success');
      setTimeout(() => {
        router.push(AppURL.claimList);
      }, 1500);
    } catch (error) {
      setUploadStatus('error');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { label: 'Claim List', href: AppURL.claimList },
    { label: 'Import', isCurrentPage: true },
  ];

  return (
    <Box className="flex flex-col w-full">
      <PageHeader title="Import Claims" breadcrumbs={breadcrumbs} showBackButton={false}>
        <Box
          onClick={() => router.back()}
          className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Box>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploadStatus === 'uploading'}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-5 h-10 ml-4"
          leftIcon={<Upload className="w-5 h-5" />}
        >
          {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
        </Button>
      </PageHeader>

      <Box className="flex flex-col w-full p-4 md:p-6 gap-4">
        <Box className="p-4 sm:p-6 bg-white rounded-lg">
          <FileUpload
            accept=".xlsx,.xls"
            value={selectedFile}
            onChange={handleFileChange}
            clearable
          />
        </Box>
      </Box>
    </Box>
  );
}
