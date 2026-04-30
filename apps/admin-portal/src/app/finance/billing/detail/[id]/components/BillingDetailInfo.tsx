import React from 'react';
import { Badge, Box } from '@repo/ui';
import type { BadgeTone } from '@repo/ui';
import { formatMoney } from '@/lib/formatter';

interface BillingDetailInfoProps {
  billing: any;
  isInsurer: boolean;
}

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <Box className="flex flex-col gap-1.5">
    <Box as="span" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
      {label}
    </Box>
    <Box className="text-[14px] font-semibold text-slate-800 leading-snug">
      {value}
    </Box>
  </Box>
);

const STATUS_MAP: Record<string, { tone: BadgeTone; label: string }> = {
  'pending-reconcilliation': { tone: 'warning', label: 'Pending Reconciliation' },
  'waiting-for-payment': { tone: 'info', label: 'Waiting for Payment' },
  paid: { tone: 'success', label: 'Paid' },
  cancelled: { tone: 'destructive', label: 'Cancelled' },
};

function formatPeriod(period: string): string {
  if (!period) return '-';
  const [year, month] = period.split('-');
  if (!year || !month) return period;
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export const BillingDetailInfo = ({ billing, isInsurer }: BillingDetailInfoProps) => {
  if (!billing) return null;

  const netPremium = (billing.total || 0) - (billing.total_commission || 0);
  const statusEntry = billing.status ? STATUS_MAP[billing.status] : undefined;

  return (
    <Box className="bg-white rounded-xl shadow-sm border border-slate-100">
      <Box className="px-6 py-4 border-b border-slate-100">
        <Box as="h3" className="text-slate-900 font-bold text-base">Billing Information</Box>
      </Box>

      <Box className="px-6 py-5">
        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
          <InfoItem
            label="Billing No"
            value={
              <Box as="span" className="font-mono text-[13px] text-slate-700 break-all">
                {billing.billing_no || '-'}
              </Box>
            }
          />
          <InfoItem
            label="Type"
            value={
              billing.type
                ? billing.type.charAt(0).toUpperCase() + billing.type.slice(1)
                : '-'
            }
          />
          <InfoItem
            label="Created Date"
            value={
              billing.created_at
                ? new Date(billing.created_at).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : '-'
            }
          />
          <InfoItem label="Company Name" value={billing.company_name || '-'} />
          <InfoItem
            label={isInsurer ? 'Total Amount' : 'Net Premium'}
            value={`${billing.currency || 'IDR'} ${formatMoney(
              isInsurer ? billing.total || 0 : netPremium,
            )}`}
          />
          <InfoItem
            label="Period"
            value={billing.transaction_period ? formatPeriod(billing.transaction_period) : '-'}
          />
          <InfoItem
            label="Status"
            value={
              statusEntry ? (
                <Badge tone={statusEntry.tone} size="md">
                  {statusEntry.label}
                </Badge>
              ) : billing.status ? (
                <Badge size="md">
                  {billing.status
                    .split('-')
                    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(' ')}
                </Badge>
              ) : (
                '-'
              )
            }
          />
          {isInsurer && (
            <InfoItem
              label="Commission"
              value={`${billing.currency || 'IDR'} ${formatMoney(
                billing.total_commission || billing.amount || 0,
              )}`}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
