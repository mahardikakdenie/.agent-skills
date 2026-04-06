'use client';

import noData from '@public/images/no-data.webp';
import noImage from '@public/images/no-image.png';
import moment from 'moment';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, Fragment } from 'react';
import { X, FileText, Inbox } from 'react-feather';

import {
  Box,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui';

import { PageHeader } from "@/components/page-header";
import JourneyVerticalImage from '@/components/ui/journey-vertical.image';
import { ContentLoadingWrapper } from '@/components/ui/loading';
import AppURL from '@/constants/app-url.const';
import { useAuth } from '@/context/auth.context';
import { useDetailClaim } from '@/hooks/useDetailClaim.hooks';
import { formatMoney, formatMoneyClaim } from '@/lib/formatter';
import { claimHasValue } from '@/lib/utils';
import { useClaimHistories } from '@/services/claims/hooks/queries';

interface FieldType {
  name: string;
  type: string;
  label?: string;
  criteria?: string;
  required?: boolean;
  definition?: string;
  insured_type?: string;
  document_type?: string;
  label_multilanguage?: {
    en?: string;
    id?: string;
  };
  pending_reason_message?: {
    en?: string;
    id?: string;
  };
}

const DetailClaim = () => {
  const router = useRouter();
  const params = useParams();
  const claimId = Array.isArray(params.id) ? params.id[0] : (params.id as string | undefined);
  const { permissionList } = useAuth();

  const { detailClaim, getDetailClaim, getMissingDocuments, isLoading } = useDetailClaim();
  const { data: claimHistoriesResponse } = useClaimHistories(
    claimId ? { claim: claimId } : undefined,
    { enabled: !!claimId },
  );
  const histories = (claimHistoriesResponse as any)?.data || [];

  useEffect(() => {
    if (claimId) {
      getDetailClaim(claimId);
    }
  }, [claimId, getDetailClaim]);

  const [tab, setTab] = useState('Summary');
  const [claim, setClaim] = useState<any>(null);
  const [docToOpen, setDocToOpen] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isViewDocument, setIsViewDocument] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [policyVisibility, setPolicyVisibility] = useState({
    name: true,
    email: true,
    phone: true,
  });
  const [danaInfoVisibility, setDanaInfoVisibility] = useState(true);
  const [integrationInfoVisibility, setIntegrationInfoVisibility] = useState(true);

  const imageUrl =
    claim?.participant_data?.data?.ktp || claim?.participant_data?.data?.passport || noImage.src;

  const personalInfo = [
    claim?.personal_info?.address,
    claim?.personal_info?.address2,
    claim?.personal_info?.subdistrict,
    claim?.personal_info?.district,
    claim?.personal_info?.city,
    claim?.personal_info?.state,
  ];


  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes('Claim.Read');
      const isHidePolicyEmail = permissionList.includes('Claim.View.Policy.HideEmail');
      const isHidePolicyPhone = permissionList.includes('Claim.View.Policy.HidePhone');
      const isShowDanaInfo = permissionList.includes('Claim.View.ShowDanaInfo');
      const isShowIntegrationInfo = permissionList.includes('Claim.View.ShowIntegrationInfo');
      setHasAccess(access);
      setPolicyVisibility({
        name: true,
        email: !isHidePolicyEmail,
        phone: !isHidePolicyPhone,
      });
      setDanaInfoVisibility(isShowDanaInfo);
      setIntegrationInfoVisibility(isShowIntegrationInfo);
      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router]);

  useEffect(() => {
    if (detailClaim) {
      setClaim(detailClaim);
      setDocuments([...detailClaim.general, ...detailClaim.claim, ...detailClaim.claim_config]);
    }
  }, [detailClaim]);

  const downloadDocument = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.substring(url.lastIndexOf('/') + 1);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'text-gray-400 font-normal';
      case 'Submitted':
        return 'text-[#7B5D21]';
      case 'Proccessing':
        return 'text-[#00AB4F]';
      case 'Approved':
        return 'text-[#00AB4F]';
      case 'Document Review':
        return 'text-[#016DA1]';
      case 'Paid':
        return 'text-[#016DA1]';
      case 'Closed':
        return 'text-[#58585B]';
      case 'Lack of Documents':
        return 'text-[#FD0300]';
      case 'Rejected':
        return 'text-[#FD0300]';
      default:
        return 'text-[#7B5D21]';
    }
  };

  const processUrl = (url: string, id: string) => {
    const urlArr = url.split('.') || '';
    const mimeType =
      urlArr[urlArr.length - 1].toLowerCase() !== 'pdf'
        ? `image/${urlArr[urlArr.length - 1].toLowerCase()}`
        : 'application/pdf';
  };

  const viewDocument = (documentObject: any) => {
    if (documentObject.type.toLowerCase() === 'file' && documentObject.value)
      processUrl(documentObject.value, 'pdfFrame');
    setDocToOpen(documentObject);
    setIsViewDocument(true);
  };

  const renderDocumentsDetails = (documentObject: any) => {
    const documentType = documentObject.type.toLowerCase();

    const isPreviewableImage = (url: string) => {
      const extension = url?.split('.').at(-1)?.toLowerCase();
      return ['jpg', 'jpeg', 'png'].includes(extension || '');
    };
    if (documentType === 'file') {
      const hasValue = !!documentObject?.value;
      const canPreview = hasValue && isPreviewableImage(documentObject.value);

      return (
        <div className="flex flex-col gap-4">
          {canPreview ? (
            <div className="bg-gray-50 border border-border rounded-xl flex items-center justify-center p-2">
              <Image
                className="mx-auto max-w-full h-auto max-h-[50vh] object-contain rounded-lg"
                src={documentObject.value}
                alt={documentObject.label?.en || '-'}
                width={800}
                height={600}
                unoptimized
              />
            </div>
          ) : hasValue ? (
            <div className="flex flex-col items-center justify-center gap-3 w-full py-12 px-6 border border-border border-dashed rounded-xl bg-gray-50/50">
              <FileText className="w-10 h-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground text-center">
                This document format cannot be previewed.<br />Please download the file to view its contents.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 w-full py-12 px-6 border border-border border-dashed rounded-xl bg-gray-50/50">
              <Inbox className="w-10 h-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground text-center">
                No document has been uploaded for this requirement.
              </p>
            </div>
          )}
          {hasValue && (
            <div className="w-full flex items-center justify-center mt-2">
              <Button
                onClick={() => downloadDocument(documentObject.value)}
              >
                Download Document
              </Button>
            </div>
          )}
        </div>
      );
    }

    if (documentType === 'multiple file') {
      const files = Array.isArray(documentObject?.value) ? documentObject.value : [];

      if (files.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center gap-3 w-full py-12 px-6 border border-border border-dashed rounded-xl bg-gray-50/50">
            <Inbox className="w-10 h-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground text-center">
              No documents have been uploaded for this requirement.
            </p>
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-6">
          {files.map((fileUrl: string, index: number) => {
            const canPreview = isPreviewableImage(fileUrl);

            return (
              <div key={index} className="flex flex-col gap-4 border-b border-border pb-6 last:border-b-0 last:pb-0">
                {canPreview ? (
                  <div className="bg-gray-50 border border-border rounded-xl flex items-center justify-center p-2">
                    <Image
                      className="mx-auto max-w-full h-auto max-h-[50vh] object-contain rounded-lg"
                      src={fileUrl}
                      alt={`${documentObject.label?.en || documentObject.label || 'File'} ${index + 1}`}
                      width={800}
                      height={600}
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 w-full py-12 px-6 border border-border border-dashed rounded-xl bg-gray-50/50">
                    <FileText className="w-10 h-10 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground text-center">
                      This document format cannot be previewed.<br />Please download the file to view its contents.
                    </p>
                  </div>
                )}
                <div className="w-full flex items-center justify-center mt-2">
                  <Button onClick={() => downloadDocument(fileUrl)}>
                    Download Document
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    if (documentType === 'number') {
      return <p className="text-sm font-medium">{formatMoney(!!documentObject.value ? documentObject.value : 0)}</p>;
    }

    if (documentType === 'datetime') {
      return <p className="text-sm font-medium">{!!documentObject.value ? moment(documentObject.value).format('LLLL') : '-'}</p>;
    }

    return <p className="text-sm font-medium">{!!documentObject.value ? documentObject.value : '-'}</p>;
  };

  const breadcrumbs = [
    { label: 'Claim' },
    { label: 'List', href: AppURL.claimList },
    { label: 'Detail', isCurrentPage: true },
  ];

  return (
    <ContentLoadingWrapper isLoading={isLoading}>
      <div className="flex flex-col w-full">
        <PageHeader title="Detail Claim" breadcrumbs={breadcrumbs} showBackButton={true} />
        <div className="flex flex-col w-full p-4 md:p-6 gap-6">
          <Box className="block rounded-xl bg-white shadow-sm">
            <Tabs
              value={tab}
              onValueChange={setTab}
              variant="underline"
              className="w-full [&_[data-slot=tabs-list-shell]]:rounded-md"
            >
              <TabsList
                aria-label="Claim status tabs"
                className="w-full flex rounded-md border-0 bg-transparent p-0 text-inherit"
              >
                {['Summary', 'Documents'].map((tabName) => (
                  <TabsTrigger
                    key={tabName}
                    value={tabName}
                    variant="underline"
                    className="flex-1 h-12 text-sm font-normal"
                  >
                    <Box as="span">{tabName}</Box>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </Box>

          {tab === 'Summary' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-white rounded-xl shadow-sm sm:p-6 p-5 h-fit max-h-full overflow-y-auto flex flex-col gap-4">
                <p className="font-bold text-lg text-gray-900 border-b pb-3">Status Claim</p>
                <div className="flex flex-col gap-2 mt-2">
                  {histories && histories.length > 0 ? (
                    histories.map((h, historyIndex) => {
                      const showUploadDocument =
                        h?.status === 'Lack of Documents Operator' ||
                        h.status === 'Lack of Documents Insurance';
                      return (
                        <div key={`history-${historyIndex}`} className="flex items-start mt-2">
                          <div className="mt-1">
                            {JourneyVerticalImage(historyIndex !== 0 ? '#C4C4C4' : undefined)}
                          </div>
                          <div className="ml-4 flex flex-col gap-1.5">
                            <p className="text-sm font-semibold">
                              <span className={getStatusColor(h?.status)}>{h?.status}</span>
                            </p>
                            <p className="text-xs text-gray-500 font-medium">
                              {h?.created_at
                                ? `${new Date(h.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })} ${new Date(h.created_at).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true,
                                  })}`
                                : '-'}
                            </p>

                            <div className="mt-1">
                              {h?.note && h.status !== 'Reupload Document Review Operator' && (
                                <p className="text-xs text-red-500 font-medium">{h.note}</p>
                              )}

                              {showUploadDocument &&
                                getMissingDocuments(h?.lack_of_documents || []).length > 0 && (
                                  <ul className="list-disc ml-4 mt-2">
                                    {getMissingDocuments(h?.lack_of_documents || []).map(
                                      (claimForm, index) => (
                                        <li key={index} className="text-xs text-red-500 font-medium py-0.5">
                                          {claimForm?.label.en ||
                                            claimForm?.label_multilanguage?.en ||
                                            claimForm.label ||
                                            ''}
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                )}
                            </div>

                            {showUploadDocument && historyIndex === 0 && (
                              <Button
                                size="sm"
                                className="bg-[#016DA1] text-white hover:bg-[#0482C2] rounded-full w-fit mt-3"
                                onClick={() =>
                                  router.push(`${AppURL.claimDetail}/${claim.id}/upload-data`)
                                }
                              >
                                Upload Document
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500">No claim histories available</p>
                  )}
                </div>
              </div>
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-white flex flex-col gap-4 rounded-xl shadow-sm sm:p-6 p-5">
                  <p className="font-bold text-lg text-gray-900 border-b pb-3">Detail Claim</p>
                  <div className="grid grid-cols-[130px_10px_1fr] sm:grid-cols-[160px_10px_1fr] gap-y-4 text-sm mt-2">
                    <div className="text-gray-500 font-medium">Claim Number</div>
                    <div className="text-gray-400">:</div>
                    <div className="font-semibold text-gray-900">{claim?.number || '-'}</div>

                    <div className="text-gray-500 font-medium">Customer Name</div>
                    <div className="text-gray-400">:</div>
                    <div className="font-semibold text-gray-900">{claim?.policy_data?.policy_holder?.name || '-'}</div>

                    <div className="text-gray-500 font-medium">Plan Name</div>
                    <div className="text-gray-400">:</div>
                    <div className="font-semibold text-gray-900">{claim?.package?.plan?.name.split('|').join(' - ') || '-'}</div>

                    <div className="text-gray-500 font-medium">Benefit</div>
                    <div className="text-gray-400">:</div>
                    <div className="font-semibold text-gray-900">{claim?.benefit?.description_en || '-'}</div>

                    <div className="text-gray-500 font-medium">Requested Amount</div>
                    <div className="text-gray-400">:</div>
                    <div className="font-semibold text-gray-900">
                      {(() => {
                        const claimValue = claim?.claim?.find(
                          (d: any) => d.type === 'Number' && d.name === 'claim',
                        )?.value;

                        const numericValue = Number(claimValue);

                        return !isNaN(numericValue) ? formatMoneyClaim(numericValue) : '-';
                      })()}
                    </div>

                    <div className="text-gray-500 font-medium">Approved Amount</div>
                    <div className="text-gray-400">:</div>
                    <div className="font-semibold text-gray-900">
                      {formatMoneyClaim(
                        claim?.amount_approved != null ? claim?.amount_approved : 0,
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-white flex flex-col gap-4 rounded-xl shadow-sm sm:p-6 p-5">
                  <p className="font-bold text-lg text-gray-900 border-b pb-3">Informasi Pemegang Polis</p>
                  <div className="grid grid-cols-[130px_10px_1fr] sm:grid-cols-[160px_10px_1fr] gap-y-4 text-sm mt-2">
                    {policyVisibility.name && (
                      <Fragment>
                        <div className="text-gray-500 font-medium">Customer Name</div>
                        <div className="text-gray-400">:</div>
                        <div className="font-semibold text-gray-900">{claim?.policy_data?.policy_holder?.name || '-'}</div>
                      </Fragment>
                    )}
                    {policyVisibility.phone && (
                      <Fragment>
                        <div className="text-gray-500 font-medium">Phone Number</div>
                        <div className="text-gray-400">:</div>
                        <div className="font-semibold text-gray-900">{claim?.policy_data?.policy_holder?.phone || '-'}</div>
                      </Fragment>
                    )}
                    {policyVisibility.email && (
                      <Fragment>
                        <div className="text-gray-500 font-medium">Email</div>
                        <div className="text-gray-400">:</div>
                        <div className="font-semibold text-gray-900">{claim?.policy_data?.policy_holder?.email || '-'}</div>
                      </Fragment>
                    )}
                  </div>
                </div>
                <div className="bg-white flex flex-col gap-4 rounded-xl shadow-sm sm:p-6 p-5">
                  <p className="font-bold text-lg text-gray-900 border-b pb-3">Informasi Tertanggung</p>
                  <div className="flex flex-col lg:flex-row gap-8 mt-2">
                    <div className="lg:min-w-64 lg:w-64 shrink-0">
                      <div className="w-full border rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                        <Image
                          src={imageUrl}
                          alt="ID Card"
                          width={400}
                          height={300}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                    <div className="w-full grid grid-cols-[130px_10px_1fr] sm:grid-cols-[160px_10px_1fr] gap-y-4 text-sm content-start">
                      <div className="text-gray-500 font-medium">No. Polis</div>
                      <div className="text-gray-400">:</div>
                      <div className="font-semibold text-gray-900">{claim?.policy_data?.number || '-'}</div>

                      <div className="text-gray-500 font-medium">No. Peserta</div>
                      <div className="text-gray-400">:</div>
                      <div className="font-semibold text-gray-900">{claim?.participant_data?.number || '-'}</div>

                      <div className="text-gray-500 font-medium">Nama Lengkap</div>
                      <div className="text-gray-400">:</div>
                      <div className="font-semibold text-gray-900">
                        {claim?.participant_data?.data?.data?.name ||
                          claim?.participant_data?.data?.name ||
                          '-'}
                      </div>

                      {danaInfoVisibility && (
                        <Fragment>
                          <div className="text-gray-500 font-medium">Plat Nomor</div>
                          <div className="text-gray-400">:</div>
                          <div className="font-semibold text-gray-900">
                            {claim?.participant_data?.data?.data?.licensePlate ||
                              claim?.participant_data?.data?.licensePlate ||
                              '-'}
                          </div>
                        </Fragment>
                      )}

                      <div className="text-gray-500 font-medium">Gender</div>
                      <div className="text-gray-400">:</div>
                      <div className="font-semibold text-gray-900">{claim?.participant_data?.data?.gender || '-'}</div>

                      <div className="text-gray-500 font-medium">Kode Negara</div>
                      <div className="text-gray-400">:</div>
                      <div className="font-semibold text-gray-900">{claim?.participant_data?.data?.country_code || '-'}</div>

                      <div className="text-gray-500 font-medium">
                        {claim?.participant_data?.data?.data?.passport_no
                          ? 'No. Passport'
                          : claim?.participant_data?.data?.passport_no
                            ? 'No. Passport'
                            : claim?.participant_data?.data?.nik
                              ? 'NIK'
                              : claim?.participant_data?.data?.identification_number
                                ? 'No. Identitas'
                                : ''}
                      </div>
                      <div className="text-gray-400">:</div>
                      <div className="font-semibold text-gray-900">
                        {claim?.participant_data?.data?.data?.passport_no ||
                          claim?.participant_data?.data?.passport_no ||
                          claim?.participant_data?.data?.nik ||
                          '-'}
                      </div>

                      <div className="text-gray-500 font-medium">Kewarganegaraan</div>
                      <div className="text-gray-400">:</div>
                      <div className="font-semibold text-gray-900">
                        {claim?.participant_data?.data?.data?.nationality ||
                          claim?.participant_data?.data?.nationality ||
                          '-'}
                      </div>

                      <div className="text-gray-500 font-medium">Tgl. Lahir</div>
                      <div className="text-gray-400">:</div>
                      <div className="font-semibold text-gray-900">
                        {claim?.participant_data?.data?.data?.dob ||
                          claim?.participant_data?.data?.dob ||
                          '-'}
                      </div>

                      <div className="text-gray-500 font-medium">Tempat Lahir</div>
                      <div className="text-gray-400">:</div>
                      <div className="font-semibold text-gray-900">{claim?.participant_data?.data?.pob || '-'}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm flex flex-col gap-4 p-5 sm:p-6">
                  <p className="font-bold text-lg text-gray-900 border-b pb-3">Informasi Pribadi</p>
                  <div className="grid grid-cols-[130px_10px_1fr] sm:grid-cols-[160px_10px_1fr] gap-y-4 text-sm mt-2">
                    <div className="text-gray-500 font-medium">Nomor Handpone</div>
                    <div className="text-gray-400">:</div>
                    <div className="font-semibold text-gray-900">{claim?.personal_info?.phone || '-'}</div>

                    <div className="text-gray-500 font-medium">Alamat</div>
                    <div className="text-gray-400">:</div>
                    <div className="font-semibold text-gray-900 leading-relaxed">{personalInfo.filter(Boolean).join(', ') || '-'}</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm flex flex-col gap-4 p-5 sm:p-6">
                  <p className="font-bold text-lg text-gray-900 border-b pb-3">Informasi Rekening</p>
                  <div className="grid grid-cols-[130px_10px_1fr] sm:grid-cols-[160px_10px_1fr] gap-y-4 text-sm mt-2">
                    <div className="text-gray-500 font-medium">Nama</div>
                    <div className="text-gray-400">:</div>
                    <div className="font-semibold text-gray-900">{claim?.bank_info?.account_name || '-'}</div>

                    <div className="text-gray-500 font-medium">Nama Bank</div>
                    <div className="text-gray-400">:</div>
                    <div className="font-semibold text-gray-900">{claim?.bank_info?.bank?.name || '-'}</div>

                    <div className="text-gray-500 font-medium">Cabang Bank</div>
                    <div className="text-gray-400">:</div>
                    <div className="font-semibold text-gray-900">{claim?.bank_info?.branch || '-'}</div>

                    <div className="text-gray-500 font-medium">No. Rekening</div>
                    <div className="text-gray-400">:</div>
                    <div className="font-semibold text-gray-900">{claim?.bank_info?.account_number || '-'}</div>
                  </div>
                </div>
                {integrationInfoVisibility && claim?.other_info?.third_party?.identifiers && typeof claim.other_info.third_party.identifiers === 'object' && Object.keys(claim.other_info.third_party.identifiers).length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm flex flex-col gap-4 p-5 sm:p-6">
                    <p className="font-bold text-lg text-gray-900 border-b pb-3">Informasi Integrasi Asuransi</p>
                    <div className="grid grid-cols-[130px_10px_1fr] sm:grid-cols-[160px_10px_1fr] gap-y-4 text-sm mt-2">
                      {Object.entries(claim.other_info.third_party.identifiers).map(
                        ([key, value]: [string, any]) => (
                          <Fragment key={key}>
                            <div className="text-gray-500 font-medium">
                              {key
                                .split('_')
                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')}
                            </div>
                            <div className="text-gray-400">:</div>
                            <div className="font-semibold text-gray-900">{String(value || '-')}</div>
                          </Fragment>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {tab === 'Documents' && (
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 overflow-hidden">
              <div className="overflow-x-auto w-full">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">No.</TableHead>
                      <TableHead>File Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-28 text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.length > 0 ? (
                      documents.map((doc, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex gap-2 items-center">
                              {doc?.label?.en || doc?.label || '-'}
                              {doc?.insured_type &&
                                ' - ' +
                                  doc?.insured_type.charAt(0).toUpperCase() +
                                  doc?.insured_type.slice(1)}
                            </div>
                          </TableCell>
                          <TableCell>{doc?.date ? moment(doc.date).format('LLLL') : '-'}</TableCell>
                          <TableCell>
                            {claimHasValue(doc) ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                Pending
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button 
                              size="sm" 
                              variant="primary"
                              className="rounded-full" 
                              onClick={() => viewDocument(doc)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-64 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <Image src={noData} alt="No Data" width={120} height={120} className="mb-4" />
                            <p>No transaction data available</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isViewDocument} onClose={() => setIsViewDocument(false)}>
        <DialogContent
          size="lg"
          title={docToOpen?.label?.en || docToOpen?.label || '-'}
        >
          <DialogClose asChild>
            <button
              type="button"
              className="absolute right-4 top-4 rounded-md p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 disabled:pointer-events-none cursor-pointer outline-none"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          </DialogClose>
          <div className="flex flex-col gap-6 mt-4">
            {docToOpen?.type?.toLowerCase() === 'fields'
              ? docToOpen.fields.map((field: FieldType, index: number) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="text-sm sm:text-base font-semibold" key={field.name}>
                      {field?.label_multilanguage?.en || field?.label || '-'}
                    </div>
                    {renderDocumentsDetails(field)}
                  </div>
                ))
              : docToOpen && renderDocumentsDetails(docToOpen)}
          </div>
        </DialogContent>
      </Dialog>
    </ContentLoadingWrapper>
  );
};

export default DetailClaim;
