import jsPDF from 'jspdf';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft } from 'react-feather';
import * as XLSX from 'xlsx';

import { Box } from '@repo/ui';

import Button from '@/components/button';
import NotFound from '@/components/not-found';
import AppURL from '@/constants/app-url.const';
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import {
  formatDateTimeWithTZ,
  getLocalStorage,
  moneyFormatter,
  toastNotification,
} from '@/helpers/app.helper';
import DownloadIcon from '@/images/download.icon';
import { transactionService } from '@/services/transaction/api/transaction.service';

export const TransactionExportView = () => {
  const [data, setData] = useState<any[]>([]);
  const { handleResponseError, user } = useAuth();
  const { isMobileView, setLoading } = useScreen();
  const router = useRouter();
  const reportTemplateRef = useRef(null);
  // const channel = user?.channel || undefined;

  useEffect(() => {
    const fetchAllDataTransaction = async (page = 1, accumulatedData: any[] = []) => {
      try {
        setLoading(true);
        const filterTransactionData = getLocalStorage('filterTransactionData');
        const params = {
          status: filterTransactionData.filterStatus,
          type: filterTransactionData.filterType,
          keyword: filterTransactionData.filterKeyword,
          date_from: filterTransactionData.filterDateFrom,
          date_to: filterTransactionData.filterDateTo,
          limit: 100,
          page,
          // channel
        };
        const response: any = await transactionService.getTransactions(params);

        if (response) {
          const newData = response?.data || [];
          const updatedData = [...accumulatedData, ...newData];
          setData(updatedData);

          if (page < (response?.pageTotal || 0)) {
            await fetchAllDataTransaction(page + 1, updatedData);
          }
        }
      } catch (error) {
        handleResponseError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDataTransaction().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGeneratePdf = () => {
    if (!reportTemplateRef.current) {
      toastNotification('Transaction template element is not found!', 'error');
      return;
    }

    const doc = new jsPDF({
      format: 'a1',
      unit: 'px',
    });
    doc.setFontSize(10);
    doc.setFont('Inter-Regular', 'normal');
    doc.html(reportTemplateRef.current, {
      async callback(doc: any) {
        await doc.save(`Transaction List - ${moment(new Date()).format('lll')}.pdf`);
      },
      x: 30,
      y: 30,
    });
  };

  const totalPremium = (trx: any) => {
    const currencies = trx?.insurance?.insurance?.currencies || [];
    const currency = currencies.find(
      (currency: any) =>
        currency.currency_from === trx?.insurance?.currency && currency.currency_to === 'IDR',
    );
    const convertedPremium = (currency?.value ?? 1) * trx?.insurance?.premium;
    const discountType = trx?.insurance?.plan?.premium_discount_type || '';
    const discountValue = trx?.insurance?.plan?.premium_discount_value || 0;
    const premiumWithEmbeddedDiscount =
      discountType === 'percentage'
        ? convertedPremium - (discountValue / 100) * convertedPremium
        : convertedPremium - discountValue;

    let premiumWithVoucherDiscount = premiumWithEmbeddedDiscount;
    if (trx.voucher_info)
      premiumWithVoucherDiscount =
        trx.voucher_info?.data.value_type === 'percentage'
          ? premiumWithEmbeddedDiscount -
            (trx.voucher_info?.data.value / 100) * premiumWithEmbeddedDiscount
          : premiumWithEmbeddedDiscount - trx.voucher_info?.data.value;

    let finalPremium = premiumWithVoucherDiscount;
    if (trx.fees)
      finalPremium =
        premiumWithVoucherDiscount +
        trx.fees
          .map((v: any) => v.value)
          .reduce((a: any, b: any) => {
            return a + b;
          }, 0);

    return finalPremium;
  };

  const handleGenerateXlsx = () => {
    if (data.length === 0) {
      toastNotification('No transaction data to export!', 'error');
      return;
    }

    const sheetData = data.map((item, index) => ({
      No: index + 1,
      'Insurance Name': item.insurance?.insurance?.id?.name || '-',
      'Plan Name': item.insurance?.plan?.name?.split('|')?.splice(0, 2)?.join(' - '),
      'Customer Name': item.customer?.name || '-',
      Currency: item.insurance?.currency || '-',
      Amount:
        moneyFormatter(item.insurance?.currency ? item.insurance?.currency : undefined).format(
          totalPremium(item),
        ) || '-',
      Status: item.status || '-',
      'Order Id': item.code,
      'Created At': formatDateTimeWithTZ(item.created_at),
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transaction List');
    XLSX.writeFile(workbook, `Transaction List - ${moment(new Date()).format('lll')}.xlsx`);
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
    <Box className="mx-auto py-5 px-7">
      <Box className="lg:flex lg:items-center lg:justify-between lg:mb-3">
        <Box className="flex items-center justify-between mb-5">
          <Box as="p" className="font-bold text-lg lg:mt-2">
            Transaction List
          </Box>
          {isMobileView && (
            <Box
              onClick={() => router.push(AppURL.transactionList)}
              className="ml-auto items-center flex gap-1 text-red-500 text-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Box>
          )}
        </Box>
        {!isMobileView && (
          <Box
            onClick={() => router.push(AppURL.transactionList)}
            className="ml-auto items-center flex gap-1 text-red-500 text-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Box>
        )}
        <Box className="lg:ml-5">
          <Button
            additionalClassName="w-full lg:w-fit justify-center lg:justify-between mr-0 mb-3 lg:mb-0"
            onClick={handleGeneratePdf}
            variant="warning"
            withIcon={true}
            disabled={data.length < 1}
          >
            {DownloadIcon(data.length < 1 ? '#FFF' : '#000')}
            <Box as="span" className={`ml-1 ${data.length < 1 && 'text-white'}`}>
              Generate PDF
            </Box>
          </Button>
        </Box>
        <Box className="mb-5 lg:mb-0 lg:ml-3">
          <Button
            additionalClassName="w-full lg:w-fit justify-center lg:justify-between mr-0 mb-3 lg:mb-0"
            onClick={handleGenerateXlsx}
            withIcon={true}
            disabled={data.length < 1}
          >
            {DownloadIcon('#FFF')}
            <Box as="span" className="ml-1">
              Generate XLXS
            </Box>
          </Button>
        </Box>
      </Box>
      <Box className="w-full bg-white rounded-lg">
        {data.length < 1 ? (
          <Box className="flex items-center justify-center bg-white rounded-md py-20 shadow">
            <NotFound
              width={isMobileView && '143'}
              height={isMobileView && '144'}
              size1={isMobileView && '143'}
              size3={isMobileView && '95'}
              viewBox={isMobileView && '0 0 70 70'}
              text="No transaction data available"
              textClassName={isMobileView && 'text-xs'}
            />
          </Box>
        ) : (
          <Box className="overflow-x-auto sm:scrollable">
            <Box as="table" style={styles.table} ref={reportTemplateRef} border={1}>
              <Box as="thead">
                <Box as="tr">
                  <Box as="td" style={styles.th} valign="middle">
                    No.
                  </Box>
                  <Box as="td" style={styles.th} valign="middle">
                    Insurance Name
                  </Box>
                  <Box as="td" style={styles.th} valign="middle">
                    Plan Name
                  </Box>
                  <Box as="td" style={styles.th} valign="middle">
                    Customer Name
                  </Box>
                  <Box as="td" style={styles.th} valign="middle">
                    Currency
                  </Box>
                  <Box as="td" style={styles.th} valign="middle">
                    Amount
                  </Box>
                  <Box as="td" style={styles.th} valign="middle">
                    Status
                  </Box>
                  <Box as="td" style={styles.th} valign="middle">
                    Order Id
                  </Box>
                  <Box as="td" style={styles.th} valign="middle">
                    Created At
                  </Box>
                </Box>
              </Box>
              <Box as="tbody">
                {data.map((item, index) => (
                  <Box as="tr" key={item.id}>
                    <Box as="td" style={styles.td} valign="middle">
                      {index + 1}
                    </Box>
                    <Box as="td" style={styles.td} valign="middle">
                      {item.insurance?.insurance?.id?.name || '-'}
                    </Box>
                    <Box as="td" style={styles.td} valign="middle">
                      {item.insurance?.plan?.name.split('|').splice(0, 2).join(' - ') || '-'}
                    </Box>
                    <Box as="td" style={styles.td} valign="middle">
                      {item.customer?.name || '-'}
                    </Box>
                    <Box as="td" style={styles.td} valign="middle">
                      {item.insurance?.currency || '-'}
                    </Box>
                    <Box as="td" style={styles.td} valign="middle">
                      {moneyFormatter(
                        item.insurance?.currency ? item.insurance?.currency : undefined,
                      ).format(totalPremium(item)) || '-'}
                    </Box>
                    <Box as="td" style={styles.td} valign="middle">
                      {item.status || '-'}
                    </Box>
                    <Box as="td" style={styles.td} valign="middle">
                      {item.code || '-'}
                    </Box>
                    <Box as="td" style={styles.td} valign="middle">
                      {item.created_at ? formatDateTimeWithTZ(item.created_at) : '-'}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
