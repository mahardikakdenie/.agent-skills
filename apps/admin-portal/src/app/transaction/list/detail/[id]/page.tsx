'use client';

import { useParams, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { Check } from 'react-feather';

import { Box, Button, Spinner } from '@repo/ui';

import { PageHeader } from '@/components/core/page-header';
import AppURL from '@/constants/app-url.const';
import { formatMoney } from '@/lib/formatter';
import { toastNotification } from '@/lib/toast';
import { useUpdateTransactionStatus } from '@/services/transaction/hooks/mutations';
import { useTransactionDetail } from '@/services/transaction/hooks/queries';

type CurrencyRate = {
  currency_from?: string;
  currency_to?: string;
  value?: number | string;
};

type TransactionFee = {
  value?: number | string;
};

type TransactionDetail = {
  id: string;
  status?: string;
  customer?: {
    name?: string;
  };
  fees?: TransactionFee[];
  voucher_info?: {
    data?: {
      value_type?: string;
      value?: number | string;
    };
  };
  insurance?: {
    premium?: number | string;
    insurance?: {
      name?: string;
      currencies?: CurrencyRate[];
    };
    package_data?: {
      currency?: string;
    };
    plan?: {
      name?: string;
      premium_discount_type?: string;
      premium_discount_value?: number | string;
    };
  };
};

function DetailItem({
  label,
  value,
  className = '',
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <Box className={`flex gap-2 text-sm font-medium ${className}`}>
      <Box className="min-w-40 w-40 text-slate-600">{label}</Box>
      <Box className="max-w-1 w-1 text-slate-400">:</Box>
      <Box className="min-w-0 break-words text-slate-900">{value}</Box>
    </Box>
  );
}

export default function DetailTransaction() {
  const params = useParams();
  const router = useRouter();
  const idParam = params.id;
  const id = typeof idParam === 'string' ? idParam : Array.isArray(idParam) ? idParam[0] : '';

  const { data: transactionResponse, isFetching: isTransactionLoading } = useTransactionDetail(id, {
    enabled: !!id,
  });
  const { mutateAsync: updateTransactionStatus, isPending: isUpdatingStatus } =
    useUpdateTransactionStatus();
  const transaction = (transactionResponse as TransactionDetail | null) ?? null;
  const insurance = transaction?.insurance;
  const insuranceCompany = insurance?.insurance;
  const packageData = insurance?.package_data;
  const plan = insurance?.plan;
  const status = transaction?.status ?? '';
  const isPendingTransaction = status.toLowerCase() === 'pending';

  const breadcrumbs = [
    { label: 'Transaction List', href: AppURL.transactionList },
    { label: 'Detail', isCurrentPage: true },
  ];

  if (isTransactionLoading) {
    return (
      <Box className="flex h-screen items-center justify-center">
        <Spinner
          inline
          className="[&_[data-slot=spinner-icon]]:size-10 [&_[data-slot=spinner-icon]]:text-blue-500"
        />
      </Box>
    );
  }

  const handleUpdateToPaid = async (transactionId: string) => {
    try {
      await updateTransactionStatus({
        id: transactionId,
        payload: { payment_info: 'Paid' },
      });
      toastNotification('Transaction updated to paid successfully!');
    } catch {
      toastNotification('Failed to update transaction status!', 'error');
    }
  };

  const currencies = Array.isArray(insuranceCompany?.currencies) ? insuranceCompany.currencies : [];
  const currency = currencies.find(
    (currencyItem: CurrencyRate) =>
      currencyItem.currency_from === packageData?.currency && currencyItem.currency_to === 'IDR',
  );

  const convertedPremium = Number(currency?.value ?? 1) * Number(insurance?.premium ?? 0);

  const premiumWithEmbeddedDiscount =
    plan?.premium_discount_type === 'percentage'
      ? convertedPremium - (Number(plan?.premium_discount_value ?? 0) / 100) * convertedPremium
      : convertedPremium - Number(plan?.premium_discount_value ?? 0);

  let premiumWithVoucherDiscount = premiumWithEmbeddedDiscount;
  if (transaction?.voucher_info) {
    premiumWithVoucherDiscount =
      transaction.voucher_info?.data.value_type === 'percentage'
        ? premiumWithEmbeddedDiscount -
          (Number(transaction.voucher_info?.data.value ?? 0) / 100) * premiumWithEmbeddedDiscount
        : premiumWithEmbeddedDiscount - Number(transaction.voucher_info?.data.value ?? 0);
  }

  const totalFees = Array.isArray(transaction?.fees)
    ? transaction.fees
        .map((fee: TransactionFee) => Number(fee?.value ?? 0))
        .reduce((total: number, fee: number) => total + fee, 0)
    : 0;
  const totalPremium = premiumWithVoucherDiscount + totalFees;

  return (
    <Box className="flex flex-col w-full">
      <PageHeader
        title="Transaction Details"
        breadcrumbs={breadcrumbs}
        showBackButton={true}
        onBackClick={() => router.push(AppURL.transactionList)}
      >
        {transaction && isPendingTransaction && (
          <Button
            onClick={() => handleUpdateToPaid(transaction.id)}
            disabled={isUpdatingStatus}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
            leftIcon={<Check className="w-5 h-5" />}
          >
            {isUpdatingStatus ? 'Updating...' : 'Update to Paid'}
          </Button>
        )}
      </PageHeader>

      {transaction ? (
        <Box className="flex flex-col w-full p-4 md:p-6 gap-6">
          <Box className="p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4 shadow-sm border border-slate-100">
            <Box className="flex flex-col gap-4">
              <DetailItem label="Insurance Name" value={insuranceCompany?.name || '-'} />
              <DetailItem label="Plan Name" value={plan?.name || '-'} />
              <DetailItem label="Customer Name" value={transaction.customer?.name || '-'} />
              <DetailItem label="Amount" value={formatMoney(totalPremium, 'IDR')} />
              <DetailItem
                label="Status"
                value={<Box className="text-warning">{status || '-'}</Box>}
              />
            </Box>
          </Box>
        </Box>
      ) : (
        <Box className="flex flex-col w-full p-4 md:p-6">
          <Box className="rounded-lg border border-slate-100 bg-white p-6 text-sm font-medium text-slate-600 shadow-sm">
            Transaction not found.
          </Box>
        </Box>
      )}
    </Box>
  );
}
