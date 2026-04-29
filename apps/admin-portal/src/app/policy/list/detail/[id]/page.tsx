'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui';

import { PageHeader } from '@/components/page-header';
import { ContentLoadingWrapper } from '@/components/ui/loading';
import AppURL from '@/constants/app-url.const';
import { usePolicyDetail } from '@/hooks/useDetailPolicy.hooks';
import { formatMoney } from '@/lib/formatter';
import { cn } from '@/lib/utils';

type DetailValueLinkType = 'email' | 'phone';
type DetailRecord = Record<string, unknown>;

interface PolicyBenefit {
  id?: string | number;
  value?: unknown;
  html?: unknown;
  benefits?: {
    description_id?: unknown;
  };
}

interface InsuredParty {
  id: string | number;
  number?: unknown;
  data?: {
    data?: DetailRecord;
  };
  profile?: DetailRecord | null;
  other_info?: DetailRecord | null;
}

interface DetailValueProps {
  value?: unknown;
  linkType?: DetailValueLinkType;
}

interface DetailRowProps extends DetailValueProps {
  label: string;
  children?: ReactNode;
}

interface SectionCardProps {
  title: string;
  updatedAt?: string | null;
  children: ReactNode;
  className?: string;
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

function formatLabel(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatUpdatedDate(value?: string | null) {
  return value ? new Date(value).toLocaleDateString('en-GB') : emptyValue;
}

function formatBenefitLimit(value: unknown, html: unknown) {
  if (isEmptyValue(value)) {
    return html;
  }

  const numericValue = typeof value === 'number' ? value : Number(value);

  return Number.isFinite(numericValue) ? formatMoney(numericValue) : value;
}

function getLinkHref(value: string, linkType?: DetailValueLinkType) {
  if (linkType === 'email') {
    return `mailto:${value}`;
  }

  if (linkType === 'phone') {
    return `tel:${value.replace(/[^\d+]/g, '')}`;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (/^www\./i.test(value)) {
    return `https://${value}`;
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
    const isExternal = /^https?:\/\//i.test(href);

    return (
      <Box
        as="a"
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noreferrer' : undefined}
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

function DetailRow({ label, value, linkType, children }: DetailRowProps) {
  return (
    <Box className="grid grid-cols-[minmax(7rem,10rem)_0.5rem_minmax(0,1fr)] gap-2 text-sm font-medium sm:grid-cols-[10rem_0.5rem_minmax(0,1fr)]">
      <Box as="dt" className="text-slate-500">
        {label}
      </Box>
      <Box as="span" className="text-slate-400">
        :
      </Box>
      <Box as="dd" className="min-w-0 break-words text-slate-900">
        {children ?? <DetailValue value={value} linkType={linkType} />}
      </Box>
    </Box>
  );
}

function SectionCard({ title, updatedAt, children, className }: SectionCardProps) {
  return (
    <Box
      as="section"
      className={cn(
        'flex flex-col gap-4 rounded-lg border border-slate-100 bg-white p-4 shadow-sm sm:p-6',
        className,
      )}
    >
      <Box className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <Box as="h3" className="text-base font-bold text-slate-950">
          {title}
        </Box>
        {updatedAt && (
          <Box as="span" className="text-xs italic text-slate-500">
            Last Update{' '}
            <Box as="time" dateTime={updatedAt} className="text-slate-600">
              {formatUpdatedDate(updatedAt)}
            </Box>
          </Box>
        )}
      </Box>
      <Box as="dl" className="grid gap-3">
        {children}
      </Box>
    </Box>
  );
}

function BenefitsTable({ benefits }: { benefits: PolicyBenefit[] }) {
  return (
    <Box className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <Box className="overflow-x-auto">
        <Table className="min-w-[560px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-12 px-4 text-[13px] font-semibold text-[#4C6684]">
                Benefit
              </TableHead>
              <TableHead className="h-12 w-1/4 px-4 text-[13px] font-semibold text-[#4C6684]">
                Limit
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:hover]:bg-transparent">
            {benefits.length > 0 ? (
              benefits.map((benefit, index) => {
                const limitValue = formatBenefitLimit(benefit?.value, benefit?.html);

                return (
                  <TableRow key={benefit?.id ?? index}>
                    <TableCell className="px-4 py-4 text-sm font-medium text-slate-950">
                      <DetailValue value={benefit?.benefits?.description_id} />
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm font-medium text-slate-700">
                      <DetailValue value={limitValue} />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={2} className="px-4 py-8 text-center text-sm text-slate-500">
                  No benefits available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}

function DynamicDetailRows({ data }: { data?: DetailRecord | null }) {
  if (!data) {
    return null;
  }

  return Object.keys(data).map((key) => {
    const fieldValue = data[key];
    const value =
      typeof fieldValue === 'object' && fieldValue !== null
        ? JSON.stringify(fieldValue)
        : fieldValue;

    return <DetailRow key={key} label={formatLabel(key)} value={value} />;
  });
}

export default function DetailPolicy() {
  const params = useParams();
  const id = params.id as string;

  const {
    policy,
    policyVisibility,

    dialogOpen,
    setDialogOpen,

    isLoading,
    isRenewing,

    getPolicyDetail,
    handleOpenDialog,
    handleRenewPolicy,
    getStatusColor,
  } = usePolicyDetail();

  useEffect(() => {
    if (id) {
      getPolicyDetail(id);
    }
  }, [id, getPolicyDetail]);

  const breadcrumbs = [
    { label: 'Policy List', href: AppURL.policyList },
    { label: 'Detail', isCurrentPage: true },
  ];

  const packageData = policy?.package_data?.[0];
  const benefits = (packageData?.benefits ?? []) as PolicyBenefit[];

  return (
    <ContentLoadingWrapper isLoading={isLoading}>
      <Box className="flex w-full flex-col">
        <PageHeader title="Detail Policy" breadcrumbs={breadcrumbs} showBackButton={true} />

        <Box className="flex w-full flex-col gap-4 p-4 md:p-6">
          <SectionCard title="Policy Holder Information">
            {policyVisibility?.name && (
              <DetailRow label="Customer Name" value={policy?.policy_holder?.name} />
            )}
            {policyVisibility?.phone && (
              <DetailRow
                label="Phone Number"
                value={policy?.policy_holder?.phone}
                linkType="phone"
              />
            )}
            {policyVisibility?.email && (
              <DetailRow label="Email" value={policy?.policy_holder?.email} linkType="email" />
            )}
            {policyVisibility?.status && (
              <DetailRow label="Status">
                <Box as="span" className={cn('font-semibold', getStatusColor(policy?.status))}>
                  {policy?.status || emptyValue}
                </Box>
              </DetailRow>
            )}
            {policy?.status === 'Grace Period' && (
              <Box className="pt-1">
                <Button
                  className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
                  onClick={handleOpenDialog}
                >
                  Renew Policy
                </Button>
              </Box>
            )}
          </SectionCard>

          <SectionCard title="Plan Information">
            <DetailRow label="Plan Name" value={packageData?.plan?.name} />
            <DetailRow label="Product Name" value={packageData?.product?.name} />
            <DetailRow label="Insurance Name" value={packageData?.insurance?.name} />
            <DetailRow label="Effective Date" value={policy?.start_date} />
            <DetailRow label="Expiry Date" value={policy?.end_date} />
            <Box className="mt-2">
              <BenefitsTable benefits={benefits} />
            </Box>
          </SectionCard>

          {policy?.transaction_data?.company && (
            <SectionCard title="Insured Details" updatedAt={policy?.updated_at}>
              <DetailRow label="Policy Number" value={policy?.number} />
              <DetailRow label="PIC Name" value={policy?.transaction_data?.company?.pic?.name} />
              <DetailRow
                label="Phone Number"
                value={policy?.transaction_data?.company?.pic?.phone_number}
                linkType="phone"
              />
              <DetailRow
                label="ID Number"
                value={policy?.transaction_data?.company?.pic?.identification_number}
              />
              <DetailRow
                label="NPWP Number"
                value={policy?.transaction_data?.company?.pic?.npwp_number}
              />
              <DetailRow
                label="Address"
                value={policy?.transaction_data?.company?.pic?.mailing_address}
              />
              <DetailRow
                label="Agent Name"
                value={policy?.transaction_data?.company?.agent?.name}
              />
              <DetailRow
                label="Phone Number"
                value={policy?.transaction_data?.company?.agent?.phone_number}
                linkType="phone"
              />
            </SectionCard>
          )}

          {policy?.insured_parties?.map((item: InsuredParty) => {
            const participantData = item.data?.data;

            return (
              <SectionCard key={item.id} title="Insured Details" updatedAt={policy?.updated_at}>
                <DetailRow label="Policy Number" value={policy?.number} />
                <DetailRow label="Participant Number" value={item?.number} />
                {participantData?.name && (
                  <DetailRow label="Full Name" value={participantData.name} />
                )}
                {participantData?.gender && (
                  <DetailRow label="Gender" value={participantData.gender} />
                )}
                {participantData?.country_code && (
                  <DetailRow label="Country Code" value={participantData.country_code} />
                )}
                {participantData?.passport_no && (
                  <DetailRow label="Passport Number" value={participantData.passport_no} />
                )}
                {participantData?.nationality && (
                  <DetailRow label="Nationality" value={participantData.nationality} />
                )}
                {participantData?.dob && (
                  <DetailRow label="Birthdate" value={participantData.dob} />
                )}
                {participantData?.pob && (
                  <DetailRow label="Place of Birth" value={participantData.pob} />
                )}
                {participantData?.date_of_issue && (
                  <DetailRow label="Release Date" value={participantData.date_of_issue} />
                )}
                {participantData?.date_of_expiry && (
                  <DetailRow label="Expiry Date" value={participantData.date_of_expiry} />
                )}
                <DynamicDetailRows data={item.profile} />
                <DynamicDetailRows data={item.other_info} />
              </SectionCard>
            );
          })}

          <Box className="absolute right-5 top-5">
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="mx-auto mb-2">
                    <Image
                      src="/images/confirmation.png"
                      width={90}
                      height={90}
                      alt="Confirmation"
                    />
                  </DialogTitle>
                  <DialogDescription className="text-center text-md font-semibold text-black">
                    Do you want to proceed with renewing this policy?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="!flex !justify-center gap-2">
                  <Button
                    disabled={isRenewing}
                    variant="outline"
                    className="w-28 rounded-3xl border border-[#E83F3F] bg-transparent text-[#E83F3F] hover:bg-[#E83F3F] hover:text-white"
                    onClick={() => {
                      setDialogOpen(false);
                    }}
                  >
                    No
                  </Button>
                  <Button
                    disabled={isRenewing}
                    className="w-28 rounded-3xl bg-[#F5BA41] text-black hover:bg-[#e6a92d]"
                    onClick={handleRenewPolicy}
                  >
                    Yes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Box>
        </Box>
      </Box>
    </ContentLoadingWrapper>
  );
}
