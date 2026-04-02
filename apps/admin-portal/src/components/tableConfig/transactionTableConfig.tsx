import Image from 'next/image';
import { X } from 'react-feather';

import { Button } from '@repo/ui';
import {
  Box,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@repo/ui';

import { formatMoney } from '@/lib/formatter';
import { cn } from '@/lib/utils';

import { Column } from '../ui/DataTable';

interface CreateTransactionTableColumnsProps {
  page: number;
  rowsPerPage: number;
  canEdit: boolean;
  onUpdateToPaid: (id: string) => void;
  isLoadingUpdateStatus: boolean;
  getStatusColor: (status: string) => string;
  calculateTotalPremium: (transaction: any) => number;
}

export const createTransactionTableColumns = ({
  page,
  rowsPerPage,
  canEdit,
  onUpdateToPaid,
  isLoadingUpdateStatus,
  getStatusColor,
  calculateTotalPremium,
}: CreateTransactionTableColumnsProps): Column<any>[] => [
  {
    key: 'id',
    header: 'No.',
    classNameHeading: 'w-[56px]',
    className: 'text-slate-500',
    render: (_, index) => (page - 1) * rowsPerPage + index + 1,
  },
  {
    key: 'insurance.insurance.id.name',
    header: 'Insurance Name',
    classNameHeading: 'w-[26%]',
    className: 'align-top',
    render: (transaction) => {
      return (
        <Box className="flex min-w-0 items-center gap-3">
          <Box className="inline-flex h-9 w-9 min-w-9 items-center justify-center overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200/80">
            <Image
              src={transaction?.insurance?.insurance?.id?.logo_url || '/images/no-image.png'}
              alt=""
              width={100}
              height={50}
            />
          </Box>
          <Box className="min-w-0 flex-1">
            <Box as="p" className="break-words text-sm text-slate-900">
              {transaction?.insurance?.insurance?.id?.name || '-'}
            </Box>
          </Box>
        </Box>
      );
    },
  },
  {
    key: 'insurance.plan.name',
    header: 'Plan Name',
    classNameHeading: 'w-[23%]',
    className: 'align-top',
    render: (transaction) => {
      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-600">
          {transaction?.insurance?.plan?.name?.split('|').splice(0, 2).join(' - ') || '-'}
        </Box>
      );
    },
  },
  {
    key: 'customer.name',
    header: 'Customer Name',
    classNameHeading: 'w-[16%]',
    className: 'align-top',
    render: (transaction) => {
      return (
        <Box className="min-w-0 break-words text-sm leading-5 text-slate-700">
          {transaction?.customer?.name || '-'}
        </Box>
      );
    },
  },
  {
    key: 'insurance.currency',
    header: 'Currency',
    classNameHeading: 'w-[84px]',
    className: 'whitespace-nowrap text-xs font-semibold uppercase tracking-[0.08em] text-slate-500',
    render: (transaction) => {
      return <Box>{transaction?.insurance?.currency || '-'}</Box>;
    },
  },
  {
    key: 'amount',
    header: 'Amount',
    classNameHeading: 'w-[132px] text-right',
    className: 'whitespace-nowrap text-right',
    render: (transaction) => {
      const totalPremium = calculateTotalPremium(transaction);
      return (
        <Box className="whitespace-nowrap text-sm text-slate-900">
          {formatMoney(Number(totalPremium) || 0, 'IDR') || '-'}
        </Box>
      );
    },
  },
  {
    key: 'status',
    header: 'Status',
    classNameHeading: 'w-[104px]',
    className: 'whitespace-nowrap',
    render: (transaction) => {
      const status = transaction?.status;

      return (
        <Box className="whitespace-nowrap">
          <Box
            as="span"
            className={cn(
              'inline-flex min-w-[84px] items-center justify-center rounded-full px-2 py-1 text-xs font-semibold ring-1 ring-inset',
              getStatusColor(status),
              status === 'Paid' && 'bg-emerald-50 ring-emerald-200/80',
              status === 'Pending' && 'bg-amber-50 ring-amber-200/80',
              status === 'Declaration' && 'bg-sky-50 ring-sky-200/80',
              !['Paid', 'Pending', 'Declaration'].includes(status) &&
                'bg-slate-50 ring-slate-200/80',
            )}
          >
            {status}
          </Box>
        </Box>
      );
    },
  },
  {
    key: 'action',
    header: 'Action',
    classNameHeading: 'w-[86px]',
    className: 'whitespace-nowrap',
    render: (transaction) => {
      const totalPremium = calculateTotalPremium(transaction);

      return (
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button size="xs" className="rounded-full px-2.5 text-xs font-semibold shadow-none">
              View
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerClose className="absolute right-2 top-2">
                <Button variant="ghost">
                  <X />
                </Button>
              </DrawerClose>
              <DrawerTitle className="text-black font-bold text-2xl">
                Transaction Details
              </DrawerTitle>
              <DrawerDescription>
                <Box className="flex flex-col w-full p-4 md:p-6 bg-[#F8F8F8] mt-5 rounded-xl">
                  <Box className="rounded-lg flex flex-col gap-4 text-black">
                    <Box className="flex gap-2 text-sm font-medium justify-start text-start">
                      <Box className="sm:min-w-40 sm:w-40 min-w-28 w-28">Insurance Name</Box>
                      <Box className="max-w-1 w-1">:</Box>
                      <Box>{transaction?.insurance?.insurance?.id?.name || '-'}</Box>
                    </Box>
                    <Box className="flex gap-2 text-sm font-medium justify-start text-start">
                      <Box className="sm:min-w-40 sm:w-40 min-w-28 w-28">Plan Name</Box>
                      <Box className="max-w-1 w-1">:</Box>
                      <Box>{transaction?.insurance?.plan?.name || '-'}</Box>
                    </Box>
                    <Box className="flex gap-2 text-sm font-medium justify-start text-start">
                      <Box className="sm:min-w-40 sm:w-40 min-w-28 w-28">Customer Name</Box>
                      <Box className="max-w-1 w-1">:</Box>
                      <Box>{transaction?.customer?.name || '-'}</Box>
                    </Box>
                    <Box className="flex gap-2 text-sm font-medium justify-start text-start">
                      <Box className="sm:min-w-40 sm:w-40 min-w-28 w-28">Amount</Box>
                      <Box className="max-w-1 w-1">:</Box>
                      <Box>{formatMoney(Number(totalPremium) || 0, 'IDR') || '-'}</Box>
                    </Box>
                    <Box className="flex gap-2 text-sm font-medium justify-start text-start">
                      <Box className="sm:min-w-40 sm:w-40 min-w-28 w-28">Status</Box>
                      <Box className="max-w-1 w-1">:</Box>
                      <Box className="text-warning font-semibold">
                        <Box as="span" className={getStatusColor(transaction?.status)}>
                          {transaction?.status}
                        </Box>
                      </Box>
                    </Box>
                    {transaction?.status.toLowerCase() === 'pending' && (
                      <Box className="mt-4">
                        <Button
                          onClick={() => onUpdateToPaid(transaction?.id)}
                          disabled={!canEdit || isLoadingUpdateStatus}
                          className="bg-primary text-white px-4 py-2 rounded-full"
                        >
                          {isLoadingUpdateStatus ? 'Updating...' : 'Update to Paid'}
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      );
    },
  },
];
