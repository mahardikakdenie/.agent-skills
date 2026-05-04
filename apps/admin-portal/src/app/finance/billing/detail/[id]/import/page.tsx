'use client';

import { Upload } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import {
  Button,
  Box,
  FileUpload,
} from '@repo/ui';

import { useBilling } from '@/app/finance/billing/hook';
import { PageHeader } from '@/components/page-header';
import AppURL from '@/constants/app-url.const';
import { useScreen } from '@/context/screen.context';
import { toastPromise } from '@/lib/toast';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function ImportPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setLoading } = useScreen();

  const typeBilling = searchParams.get('type') || '';
  const billingType = typeBilling === 'insurer' ? 'Billing' : 'Listing';

  const { importBillingTransactions } = useBilling();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');

  const handleUpload = async () => {
    if (!selectedFile || !id) return;

    setUploadStatus('uploading');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('input', 'File');
    formData.append('idBilling', id as string);
    formData.append('typeBilling', typeBilling);

    const uploadPromise = importBillingTransactions(formData);

    try {
      await toastPromise(uploadPromise, {
        loading: 'Uploading file...',
        success: <Box as="b">File uploaded successfully!</Box>,
        error: 'Upload failed!',
      });

      setUploadStatus('success');

      setTimeout(() => {
        router.push(`${AppURL.financeBillingDetail}/${id}`);
      }, 1500);
    } catch (error) {
      setUploadStatus('error');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push(`${AppURL.financeBillingDetail}/${id}`);
  };

  return (
    <Box className="flex flex-col w-full min-h-screen bg-gray-50/50">
      <PageHeader
        title="Import Transactions for Reconciliation Data"
        breadcrumbs={[
          { label: 'Billing', href: AppURL.financeBilling },
          { label: `${billingType} Detail`, href: `${AppURL.financeBillingDetail}/${id}` },
          { label: 'Import Reconciliation', isCurrentPage: true },
        ]}
        showBackButton={true}
        onBackClick={handleBack}
      >
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploadStatus === 'uploading'}
          className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] gap-1.5"
          leftIcon={<Upload className="w-5 h-5" />}
          loading={uploadStatus === 'uploading'}
        >
          {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
        </Button>
      </PageHeader>

      {/* Content */}
      <Box className="max-w-[1200px] mx-auto w-full p-5">
        <Box className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden p-8">
          <Box className="flex flex-col gap-6">
            <FileUpload
              accept=".xlsx,.xls"
              maxSize={10 * 1024 * 1024} // 10MB
              value={selectedFile}
              onChange={(file) => {
                setSelectedFile(file as File | null);
                setUploadStatus('idle');
              }}
              clearable
              onClear={() => setSelectedFile(null)}
              label="Transaction File"
            />

            {uploadStatus === 'success' && (
              <Box className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <Box as="p" className="text-green-700 text-center font-medium text-sm">
                  File uploaded successfully! Redirecting...
                </Box>
              </Box>
            )}

            {uploadStatus === 'error' && (
              <Box className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <Box as="p" className="text-red-700 text-center font-medium text-sm">
                  Upload failed. Please try again.
                </Box>
              </Box>
            )}

            {/* Import Instructions */}
            <Box className="p-6 bg-blue-50/50 border border-blue-100 rounded-xl">
              <Box as="h3" className="font-bold text-[#1e3a8a] mb-4 text-base">
                Import Instructions:
              </Box>
              <Box as="ul" className="text-sm text-[#3b82f6] space-y-3">
                <Box as="li" className="flex items-start gap-3">
                  <Box className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-1.5 shrink-0" />
                  <Box as="span">Upload an Excel file containing transaction data</Box>
                </Box>
                <Box as="li" className="flex items-start gap-3">
                  <Box className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-1.5 shrink-0" />
                  <Box as="span">
                    Ensure the file format matches the required template structure
                  </Box>
                </Box>
                <Box as="li" className="flex items-start gap-3">
                  <Box className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-1.5 shrink-0" />
                  <Box as="span">
                    The system will validate and import transactions for reconciliation
                  </Box>
                </Box>
                <Box as="li" className="flex items-start gap-3">
                  <Box className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-1.5 shrink-0" />
                  <Box as="span">Maximum file size: 10MB</Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
