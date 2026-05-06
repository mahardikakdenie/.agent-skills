'use client';

import jsPDF from 'jspdf';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, Download } from 'react-feather';
import * as XLSX from 'xlsx';

import {
  Box,
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui';

import { useAuth } from '@/context/auth.context';
import { formatMoney, formatDateTimeWithTZ } from '@/lib/formatter';
import { useTransactions } from '@/services/transaction/hooks/queries';

export default function ExportPage() {
  const page = 1;
  const [queryParams, setQueryParams] = useState<Record<string, unknown> | undefined>(undefined);
  const rowsPerPage = 100;
  const [isShowOrderId, setIsShowOrderId] = useState<boolean>(false);
  const [isShowRequestId, setIsShowRequestId] = useState<boolean>(false);
  const [isShowCreatedAt, setIsShowCreatedAt] = useState<boolean>(false);
  const router = useRouter();
  const { permissionList } = useAuth();
  const { data: transactionsResponse, isFetching: isLoading } = useTransactions(queryParams, {
    enabled: !!queryParams,
  });
  const data = (((transactionsResponse as any)?.data ?? []) as any[]).filter(
    (item: any) => item.status !== 'Draft',
  );

  useEffect(() => {
    const withOrderId = permissionList.includes('Transactions.Export.withOrderId');
    const withRequestId = permissionList.includes('Transactions.Export.withRequestId');
    const withCreatedAt = permissionList.includes('Transactions.Export.withCreatedAt');

    setIsShowOrderId(withOrderId);
    setIsShowRequestId(withRequestId);
    setIsShowCreatedAt(withCreatedAt);
  }, [permissionList]);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('exportTransactionData');
      if (!savedData) return;

      const parsedData = JSON.parse(savedData);

      setQueryParams({
        page: 1,
        limit: 150,
        type: parsedData.type,
        ...(parsedData.search && { keyword: parsedData.search }),
        ...(parsedData.status && parsedData.status !== 'All' && { status: parsedData.status }),
      });
    } catch (error) {
      console.error('Error preparing export params: ', error);
    }
  }, []);

  const reportTemplateRef = useRef<HTMLTableElement>(null);

  const handleGeneratePdf = () => {
    if (!reportTemplateRef.current) {
      console.error('Template element is not found.');
      return;
    }

    const doc = new jsPDF({
      format: 'a1',
      unit: 'px',
    });
    doc.setFontSize(10);
    doc.setFont('Inter-Regular', 'normal');
    doc.html(reportTemplateRef.current, {
      async callback(doc) {
        await doc.save('Transactions.pdf');
      },
      x: 30,
      y: 30,
    });
  };

  const handleGenerateXlsx = () => {
    if (data.length === 0) {
      console.error('No data to export.');
      return;
    }

    const sheetData = data.map((item, index) => {
      const currencies = item?.insurance?.insurance?.currencies;
      const currency = currencies?.find(
        (currency: any) =>
          currency.currency_from === item.insurance.currency && currency.currency_to === 'IDR',
      );

      const convertedPremium = (currency?.value ?? 1) * item.insurance.premium;

      const premiumWithEmbeddedDiscount =
        item.insurance?.plan?.premium_discount_type === 'percentage'
          ? convertedPremium -
            (item.insurance?.plan?.premium_discount_value || 0 / 100) * convertedPremium
          : convertedPremium - (item.insurance?.plan?.premium_discount_value || 0);

      let premiumWithVoucherDiscount = premiumWithEmbeddedDiscount;
      if (item.voucher_info) {
        premiumWithVoucherDiscount =
          item.voucher_info?.data.value_type === 'percentage'
            ? premiumWithEmbeddedDiscount -
              (item.voucher_info?.data.value || 0 / 100) * premiumWithEmbeddedDiscount
            : premiumWithEmbeddedDiscount - (item.voucher_info?.data.value || 0);
      }

      let totalPremium = premiumWithVoucherDiscount;

      if (item.fees) {
        totalPremium =
          premiumWithVoucherDiscount +
          item.fees.map((v: any) => v.value).reduce((a: any, b: any) => a + b, 0);
      }

      let additionColumn = {};
      if (isShowOrderId) {
        let orderId = '';
        if (item.third_party) {
          if (item.third_party?.provider === 'DANA') {
            orderId = item.third_party?.identifiers?.order_id;
          }
        }
        additionColumn = {
          ...additionColumn,
          'Order Id': orderId,
        };
      }
      if (isShowRequestId) {
        let requestId = '';
        if (item.third_party) {
          if (item.third_party?.provider === 'DANA') {
            requestId = item.third_party?.identifiers?.request_id;
          }
        }
        additionColumn = {
          ...additionColumn,
          'Request Id': requestId,
        };
      }
      if (isShowCreatedAt) {
        additionColumn = {
          ...additionColumn,
          'Created At': formatDateTimeWithTZ(item.created_at),
        };
      }

      return {
        No: (page - 1) * rowsPerPage + index + 1,
        'Insurance Name': item.insurance?.insurance?.id?.name || '-',
        'Plan Name': item.insurance?.plan?.name.split('|').splice(0, 2).join(' - '),
        'Customer Name': item.customer.name || '-',
        Currency: item?.insurance.currency || '-',
        Amount: formatMoney(totalPremium, 'IDR'),
        Status: item.status || '-',
        ...additionColumn,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

    XLSX.writeFile(workbook, 'Transactions.xlsx');
  };

  const styles = {
    table: {
      width: '100%',
      border: '0.5px solid #cccccc',
    },
    th: {
      padding: '10px',
      border: '0.5px solid #cccccc',
      fontWeight: 'bold',
      fontSize: '12px',
      height: 'auto',
      background: '#e7e7e7',
      verticalAlign: 'middle',
      color: '#333333',
    },
    td: {
      padding: '10px',
      height: 'auto',
      border: '0.5px solid #cccccc',
      fontSize: '12px',
      verticalAlign: 'middle',
    },
  };

  return (
    <Box className="flex flex-col w-full p-4 md:p-6 h-screen overflow-auto">
      <Box className="flex gap-4 mb-5">
        <Box as="h1" className="text-black font-bold text-2xl mt-2">
          Transactions
        </Box>
        <Box
          onClick={() => router.back()}
          className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer mr-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Box>

        <Button
          onClick={handleGeneratePdf}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full text-xs gap-1"
          leftIcon={<Download className="w-5 h-5" />}
        >
          Generate PDF
        </Button>

        <Button
          onClick={handleGenerateXlsx}
          className="bg-[#41BAF5] text-black hover:bg-[#2d9ae6] rounded-full text-xs gap-1"
          leftIcon={<Download className="w-5 h-5" />}
        >
          Generate XLSX
        </Button>
      </Box>
      <Box className="w-full bg-white rounded-lg">
        {isLoading ? (
          <Box className="flex gap-2 flex-col justify-center items-center py-20 text-sm">
            <Spinner
              inline
              className="[&_[data-slot=spinner-icon]]:size-10 [&_[data-slot=spinner-icon]]:text-blue-500"
            />
            Loading...
          </Box>
        ) : (
          <Table style={styles.table} ref={reportTemplateRef}>
            <TableHeader>
              <TableRow>
                <TableHead style={styles.th}>No.</TableHead>
                <TableHead style={styles.th}>Insurance Name</TableHead>
                <TableHead style={styles.th}>Plan Name</TableHead>
                <TableHead style={styles.th}>Customer Name</TableHead>
                <TableHead style={styles.th}>Currency</TableHead>
                <TableHead style={styles.th}>Amount</TableHead>
                <TableHead style={styles.th}>Status</TableHead>
                {isShowOrderId && <TableHead style={styles.th}>Order Id</TableHead>}
                {isShowRequestId && <TableHead style={styles.th}>Request Id</TableHead>}
                {isShowCreatedAt && <TableHead style={styles.th}>Created At</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => {
                const rowNumber = (page - 1) * rowsPerPage + index + 1;

                const currencies = item?.insurance?.insurance?.currencies || [];
                const currency =
                  currencies.find(
                    (currency: any) =>
                      currency.currency_from === item.insurance.currency &&
                      currency.currency_to === 'IDR',
                  ) || 0;

                const convertedPremium = (currency?.value ?? 1) * item.insurance.premium;

                const premiumWithEmbeddedDiscount =
                  item?.insurance?.plan?.premium_discount_type === 'percentage'
                    ? convertedPremium -
                      ((item?.insurance?.plan?.premium_discount_value || 0) / 100) *
                        convertedPremium
                    : convertedPremium - (item?.insurance?.plan?.premium_discount_value || 0);

                let premiumWithVoucherDiscount = premiumWithEmbeddedDiscount;
                if (item.voucher_info) {
                  premiumWithVoucherDiscount =
                    item.voucher_info?.data.value_type === 'percentage'
                      ? premiumWithEmbeddedDiscount -
                        (item.voucher_info?.data.value || 0 / 100) * premiumWithEmbeddedDiscount
                      : premiumWithEmbeddedDiscount - (item.voucher_info?.data.value || 0);
                }

                let totalPremium = premiumWithVoucherDiscount;

                if (item.fees) {
                  totalPremium =
                    premiumWithVoucherDiscount +
                    item.fees
                      .map((v: any) => v.value)
                      .reduce((a: any, b: any) => {
                        return a + b;
                      }, 0);
                }

                let orderId = '';
                if (item.third_party) {
                  if (item.third_party?.provider === 'DANA') {
                    orderId = item.third_party?.identifiers?.order_id;
                  }
                }

                let requestId = '';
                if (item.third_party) {
                  if (item.third_party?.provider === 'DANA') {
                    requestId = item.third_party?.identifiers?.request_id;
                  }
                }

                return (
                  <TableRow key={item.id}>
                    <TableCell style={styles.td}>{rowNumber}</TableCell>
                    <TableCell style={styles.td}>
                      {item?.insurance?.insurance?.id?.name || '-'}
                    </TableCell>
                    <TableCell style={styles.td}>
                      {item?.insurance?.plan?.name.split('|').splice(0, 2).join(' - ') || '-'}
                    </TableCell>
                    <TableCell style={styles.td}>{item?.customer?.name || '-'}</TableCell>
                    <TableCell style={styles.td}>{item?.insurance?.currency || '-'}</TableCell>
                    <TableCell style={styles.td}>{formatMoney(totalPremium, 'IDR')}</TableCell>
                    <TableCell style={styles.td}>{item?.status || '-'}</TableCell>
                    {isShowOrderId && <TableCell style={styles.td}>{orderId || '-'}</TableCell>}
                    {isShowRequestId && <TableCell style={styles.td}>{requestId || '-'}</TableCell>}
                    {isShowCreatedAt && (
                      <TableCell style={styles.td}>
                        {formatDateTimeWithTZ(item?.created_at) || '-'}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Box>
    </Box>
  );
}
