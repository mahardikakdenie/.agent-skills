'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';
import { AlertCircle, Download, Upload } from 'react-feather';

import {
  Box,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from '@repo/ui';

import { PageHeader } from '@/components/page-header';
import { createEndorsementDetailsTableColumns } from '@/components/tableConfig/endorsementTableConfig';
import { DataTable } from '@/components/ui/DataTable';
import { ContentLoadingWrapper } from '@/components/ui/loading';
import AppURL from '@/constants/app-url.const';
import { useEndorsementDetail } from '@/hooks/useDetailEndorsement.hooks';
import { cn } from '@/lib/utils';

type DetailValueLinkType = 'email' | 'phone';

interface DetailValueProps {
  value?: unknown;
  linkType?: DetailValueLinkType;
}

interface DetailRowProps extends DetailValueProps {
  label: string;
  children?: ReactNode;
  compact?: boolean;
  valueClassName?: string;
}

interface SectionCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

interface ComparisonRow {
  dataType: string;
  previousData: unknown;
  updateData: unknown;
}

interface RejectDialogProps {
  open: boolean;
  notes: string;
  isUpdating: boolean;
  onOpenChange: (open: boolean) => void;
  onNotesChange: (notes: string) => void;
  onReject: () => void;
}

const emptyValue = '-';

function isEmptyValue(value: unknown) {
  return value === null || value === undefined || value === '';
}

function formatDisplayValue(value: unknown) {
  if (isEmptyValue(value)) {
    return emptyValue;
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

function getLinkHref(value: string, linkType?: DetailValueLinkType) {
  if (linkType === 'email') {
    return `mailto:${value}`;
  }

  if (linkType === 'phone') {
    return `tel:${value.replace(/[^\d+]/g, '')}`;
  }

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return `mailto:${value}`;
  }

  return null;
}

function DetailValue({ value, linkType }: DetailValueProps) {
  const displayValue = formatDisplayValue(value);
  const href = displayValue === emptyValue ? null : getLinkHref(displayValue, linkType);

  if (href) {
    return (
      <Box
        as="a"
        href={href}
        className="font-semibold text-[#016DA1] underline decoration-[#016DA1]/30 underline-offset-4 hover:text-[#014F76] hover:decoration-[#014F76]"
      >
        {displayValue}
      </Box>
    );
  }

  return (
    <Box as="span" className="text-slate-900">
      {displayValue}
    </Box>
  );
}

function DetailRow({ label, value, linkType, children, compact, valueClassName }: DetailRowProps) {
  return (
    <Box
      className={cn(
        'grid gap-2 text-sm font-medium',
        compact
          ? 'grid-cols-[5.25rem_0.5rem_minmax(0,1fr)]'
          : 'grid-cols-[minmax(7rem,10rem)_0.5rem_minmax(0,1fr)] sm:grid-cols-[10rem_0.5rem_minmax(0,1fr)]',
      )}
    >
      <Box as="dt" className="text-slate-500">
        {label}
      </Box>
      <Box as="span" className="text-slate-400">
        :
      </Box>
      <Box as="dd" className={cn('min-w-0 break-words text-slate-900', valueClassName)}>
        {children ?? <DetailValue value={value} linkType={linkType} />}
      </Box>
    </Box>
  );
}

function SectionCard({ title, children, className, headerAction }: SectionCardProps) {
  return (
    <Box
      as="section"
      className={cn(
        'flex flex-col gap-4 rounded-lg border border-slate-100 bg-white p-4 shadow-sm sm:p-6',
        className,
      )}
    >
      <Box className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Box as="h3" className="text-base font-bold text-slate-950">
          {title}
        </Box>
        {headerAction}
      </Box>
      <Box as="dl" className="grid gap-3">
        {children}
      </Box>
    </Box>
  );
}

function ComparisonTable({ rows }: { rows: ComparisonRow[] }) {
  return (
    <Box className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <Box className="overflow-x-auto">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-12 w-1/3 px-4 text-left text-[13px] font-semibold text-[#4C6684]">
                Data Type
              </TableHead>
              <TableHead className="h-12 w-1/3 px-4 text-left text-[13px] font-semibold text-[#4C6684]">
                Previous Data
              </TableHead>
              <TableHead className="h-12 w-1/3 px-4 text-left text-[13px] font-semibold text-[#4C6684]">
                Update Data
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:hover]:bg-transparent">
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.dataType}>
                  <TableCell className="px-4 py-4 text-sm font-semibold text-slate-950">
                    <DetailValue value={row.dataType} />
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm font-medium text-slate-900">
                    <DetailValue value={row.previousData} />
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm font-medium text-slate-900">
                    <DetailValue value={row.updateData} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={3} className="px-4 py-8 text-center text-sm text-slate-500">
                  No comparison data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}

function RejectDialog({
  open,
  notes,
  isUpdating,
  onOpenChange,
  onNotesChange,
  onReject,
}: RejectDialogProps) {
  return (
    <Dialog open={open} onClose={() => onOpenChange(false)}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={isUpdating}
          onClick={() => onOpenChange(true)}
          className="h-8 rounded-full border-[#E83F3F] px-5 py-2 text-[#E83F3F] hover:bg-[#E83F3F] hover:text-white"
        >
          Reject
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[min(590px,calc(100vw-2rem))]">
        <DialogHeader className="items-center text-center">
          <Box className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-50">
            <AlertCircle width={72} height={72} className="text-[#F5AB1D]" />
          </Box>
          <DialogTitle className="text-sm font-bold text-slate-950">
            Reject updated data?
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Add a clear reason before rejecting this endorsement update.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          id="notes"
          name="notes"
          label="Reason"
          rows={4}
          value={notes}
          required
          onValueChange={onNotesChange}
          placeholder="Insert Reason"
          textareaClassName="text-sm"
        />

        <DialogFooter className="!flex !justify-center gap-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-24 rounded-full border-[#E83F3F] text-[#E83F3F] hover:bg-[#E83F3F] hover:text-white"
            >
              No
            </Button>
          </DialogClose>
          <Button
            onClick={onReject}
            disabled={isUpdating}
            className="w-24 rounded-full bg-[#f1ac2d] text-black hover:bg-[#dba237]"
          >
            {isUpdating ? 'Processing...' : 'Yes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function DetailEndorsement() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const {
    endorsement,

    isModalOpen,
    setIsModalOpen,
    notes,
    setNotes,

    isEDSB,
    imageUrl,

    isLoading,
    isUpdating,

    getEndorsementDetail,
    handleApprove,
    handleReject,
    handleDownload,
    getStatusColor,
  } = useEndorsementDetail();

  useEffect(() => {
    if (id) {
      getEndorsementDetail(id);
    }
  }, [id, getEndorsementDetail]);

  const prepareComparisonData = (): ComparisonRow[] => {
    const compareFields = [
      {
        key: 'full_name',
        label: 'Nama Lengkap',
        previous:
          endorsement?.participants?.profile?.full_name || endorsement?.participants?.profile?.name,
        updated: endorsement?.data?.profile?.full_name || endorsement?.data?.profile?.name,
      },
      {
        key: 'gender',
        label: 'Jenis Kelamin',
        previous: endorsement?.participants?.profile?.gender,
        updated: endorsement?.data?.profile?.gender,
      },
      {
        key: 'identification',
        label: endorsement?.participants?.profile?.passport_no
          ? 'No. Passport'
          : endorsement?.participants?.profile?.nik
            ? 'NIK'
            : endorsement?.participants?.profile?.identification_number
              ? 'No. Identitas'
              : '',
        previous:
          endorsement?.participants?.profile?.passport_no ||
          endorsement?.participants?.profile?.nik ||
          endorsement?.participants?.profile?.identification_number,
        updated:
          endorsement?.data?.profile?.passport_no ||
          endorsement?.data?.profile?.nik ||
          endorsement?.data?.profile?.identification_number,
      },
      {
        key: 'nationality',
        label: 'Kewarganegaraan',
        previous:
          endorsement?.participants?.profile?.nationality ||
          endorsement?.participants?.profile?.country,
        updated: endorsement?.data?.profile?.nationality || endorsement?.data?.profile?.country,
      },
      {
        key: 'pob',
        label: 'Tempat Lahir',
        previous:
          endorsement?.participants?.profile?.pob ||
          endorsement?.participants?.profile?.country_of_birth,
        updated: endorsement?.data?.profile?.pob || endorsement?.data?.profile?.country_of_birth,
      },
      {
        key: 'dob',
        label: 'Tanggal Lahir',
        previous: endorsement?.participants?.profile?.dob,
        updated: endorsement?.data?.profile?.dob,
      },
      {
        key: 'address',
        label: 'Alamat',
        previous: endorsement?.participants?.profile?.address,
        updated: endorsement?.data?.profile?.address,
      },
      {
        key: 'job',
        label: 'Pekerjaan',
        previous: endorsement?.participants?.profile?.job,
        updated: endorsement?.data?.profile?.job,
      },
    ];

    return compareFields
      .filter((field) => field.label && (field.previous || field.updated))
      .map((field) => ({
        dataType: field.label,
        previousData: field.previous || emptyValue,
        updateData: field.updated || emptyValue,
      }));
  };

  const comparisonData = prepareComparisonData();
  const endorsementDetailsColumns = createEndorsementDetailsTableColumns(getStatusColor);

  const breadcrumbs = [
    { label: 'Endorsement List', href: AppURL.endorsementList },
    { label: 'Detail', isCurrentPage: true },
  ];

  const rejectDialog = (
    <RejectDialog
      open={isModalOpen}
      notes={notes}
      isUpdating={isUpdating}
      onOpenChange={setIsModalOpen}
      onNotesChange={setNotes}
      onReject={handleReject}
    />
  );

  return (
    <ContentLoadingWrapper isLoading={isLoading || !endorsement}>
      <Box className="flex w-full flex-col">
        <PageHeader title="Detail Policy" breadcrumbs={breadcrumbs} showBackButton={true} />

        <Box className="flex w-full flex-col gap-4 p-4 md:p-6">
          <Box className="grid gap-4 lg:grid-cols-2">
            <SectionCard title="Insurance Detail">
              <DetailRow label="Insurance Name" value={endorsement?.insurance?.name} />
              <DetailRow label="Plan Name" value={endorsement?.insurance?.plan} />
            </SectionCard>

            <SectionCard title="Policy Holder Information">
              <DetailRow
                label="Customer Name"
                value={endorsement?.account?.name || endorsement?.policies?.policy_holders?.name}
              />
              <DetailRow
                label="Phone Number"
                value={endorsement?.account?.phone || endorsement?.policies?.policy_holders?.phone}
                linkType="phone"
              />
              <DetailRow
                label="Email"
                value={endorsement?.account?.email || endorsement?.policies?.policy_holders?.email}
                linkType="email"
              />
            </SectionCard>
          </Box>

          {!isEDSB ? (
            <Box className="grid gap-4 lg:grid-cols-[minmax(16rem,1fr)_minmax(0,2fr)]">
              <SectionCard title="Insured Detail" className="h-fit">
                <Box className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                  <Image
                    src={imageUrl}
                    alt="Insured identification document"
                    width={480}
                    height={300}
                    className="h-auto w-full object-cover"
                  />
                </Box>
                <DetailRow
                  label="No. Polis"
                  value={endorsement?.policies?.number}
                  compact
                  valueClassName="whitespace-nowrap"
                />
                <DetailRow
                  label="No. Peserta"
                  value={endorsement?.number}
                  compact
                  valueClassName="whitespace-nowrap"
                />
              </SectionCard>

              <SectionCard title="Update Verification">
                <DetailRow label="Status">
                  {endorsement?.status !== 'Pending' ? (
                    <Box
                      as="span"
                      className={cn('font-semibold', getStatusColor(endorsement?.status))}
                    >
                      {endorsement?.status || emptyValue}
                    </Box>
                  ) : (
                    <Box className="flex flex-wrap items-center gap-3">
                      <Button
                        onClick={handleApprove}
                        disabled={isUpdating}
                        className="h-8 rounded-full bg-[#F5BA41] px-5 py-2 text-black hover:bg-[#e6a92d]"
                      >
                        {isUpdating ? 'Processing...' : 'Accept'}
                      </Button>
                      {rejectDialog}
                    </Box>
                  )}
                </DetailRow>

                <DetailRow label="Reason" value={endorsement?.note} />

                <Box className="mt-2">
                  <ComparisonTable rows={comparisonData} />
                </Box>
              </SectionCard>
            </Box>
          ) : (
            <SectionCard
              title="Update Verification"
              headerAction={
                <Box className="flex flex-wrap items-center gap-2">
                  {endorsement?.status_description === 'Uploaded by partner' && (
                    <Button
                      variant="outline"
                      className="h-8 rounded-full border-gray-700 px-5 py-2 text-gray-700 hover:bg-gray-700 hover:text-white"
                      onClick={() =>
                        router.push(`${AppURL.endorsementDetail}/${endorsement.id}/upload`)
                      }
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="h-8 rounded-full border-gray-700 px-5 py-2 text-gray-700 hover:bg-gray-700 hover:text-white"
                    onClick={handleDownload}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </Box>
              }
            >
              <DetailRow label="Type" value={endorsement?.type} />

              <DetailRow label="Status">
                {endorsement?.status_description !== 'Uploaded by partner' ? (
                  <Box
                    as="span"
                    className={cn('font-semibold', getStatusColor(endorsement?.status))}
                  >
                    {endorsement?.status || emptyValue}
                  </Box>
                ) : (
                  <Box className="flex flex-wrap items-center gap-3">
                    <Button
                      onClick={handleApprove}
                      disabled={isUpdating}
                      className="h-8 rounded-full bg-[#F5BA41] px-5 py-2 text-black hover:bg-[#e6a92d]"
                    >
                      {isUpdating ? 'Processing...' : 'Accept'}
                    </Button>
                    {rejectDialog}
                  </Box>
                )}
              </DetailRow>

              <DetailRow
                label="Verified By"
                value={(endorsement?.status_description?.split(' by ')[1] || emptyValue).replace(
                  /\b\w/g,
                  (c: string) => c.toUpperCase(),
                )}
              />

              <DetailRow label="Reason" value={endorsement?.note} />

              <Box as="hr" className="my-1 border-slate-200" />

              <Box className="grid gap-3">
                <Box as="h3" className="text-base font-bold text-slate-950">
                  Data Endorsement
                </Box>
                <DataTable
                  data={endorsement?.endorsements_detail || []}
                  columns={endorsementDetailsColumns}
                  className="endorsement-details-table max-h-[458px] overflow-auto"
                  noDataText="No endorsement details available"
                />
              </Box>
            </SectionCard>
          )}
        </Box>
      </Box>
    </ContentLoadingWrapper>
  );
}
