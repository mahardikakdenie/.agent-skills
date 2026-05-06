'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ChevronLeft, Download } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  Badge,
  Spinner,
  Box,
} from "@repo/ui";
import { Button } from '@repo/ui';

import { useBilling } from '@/app/finance/billing/hook';
import AppURL from '@/constants/app-url.const';
import { useScreen } from '@/context/screen.context';
import { formatDate, formatMoney } from '@/lib/formatter';

export default function ExportDetailBillingPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refTemplate = useRef<HTMLDivElement>(null);
  const { setLoading } = useScreen();

  const type = searchParams.get('type') || 'partner';

  const { billing, isLoadingBilling, fetchBillingDetails } = useBilling({
    billingId: id as string,
  });

  useEffect(() => {
    if (id) {
      fetchBillingDetails(id as string, {
        page: 1,
        limit: 10000,
      });
    }
  }, [id, fetchBillingDetails]);

  const loadImageAsBase64 = (url: string): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No 2D context'));
          return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL);
      };
      img.onerror = reject;
      img.src = url;
    });

  const getStatusConfig = (status: string) => {
    const STATUS_MAP: Record<string, { tone: any; label: string }> = {
      'pending-reconcilliation': {
        tone: 'warning',
        label: 'Pending Reconciliation',
      },
      'waiting-for-payment': { tone: 'info', label: 'Waiting for Payment' },
      paid: { tone: 'success', label: 'Paid' },
      cancelled: { tone: 'destructive', label: 'Cancelled' },
    };

    if (STATUS_MAP[status]) {
      return STATUS_MAP[status];
    }

    const label = status
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return { label, tone: 'default' as const };
  };

  const handleGeneratePdf = async () => {
    if (!billing?.data?.length) {
      console.error('No data to export.');
      return;
    }

    setLoading(true);

    try {
      const billingDetails = billing.data[0].billings ?? billing.data[0];
      const doc = new jsPDF({
        format: 'a4',
        unit: 'px',
      });

      doc.setFontSize(10);
      doc.setFont('Inter-Regular', 'normal');

      doc.text('Billing No.', 30, 30);
      doc.text(`: ${billingDetails.billing_no || '-'}`, 120, 30);

      doc.text(type === 'insurer' ? 'Total Amount' : 'Total Net Premium', 30, 42);
      const totalAmount =
        type === 'insurer'
          ? billingDetails.amount ?? 0
          : (billingDetails.total ?? 0) - (billingDetails.amount ?? 0);
      doc.text(`: ${billingDetails.currency || 'IDR'} ${formatMoney(totalAmount)}`, 120, 42);

      doc.text('Created Date', 30, 54);
      doc.text(
        `: ${billingDetails.created_at ? new Date(billingDetails.created_at).toDateString() : '-'}`,
        120,
        54,
      );

      doc.text('Status', 30, 66);
      doc.text(`: ${getStatusConfig(billingDetails.status || '').label}`, 120, 66);

      doc.text('Type', 30, 78);
      doc.text(`: ${billingDetails.type || '-'}`, 120, 78);

      doc.text('Company Name', 30, 90);
      doc.text(`: ${billingDetails.company_name || '-'}`, 120, 90);

      doc.text('Period', 30, 102);
      doc.text(`: ${billingDetails.transaction_period || '-'}`, 120, 102);

      const imageUrl = 'https://friendsure-spaces.sgp1.digitaloceanspaces.com/teman.png';
      const image = await loadImageAsBase64(imageUrl);
      doc.addImage(image, 'JPEG', 310, 25, 110, 40);

      const tableHeaders = getTableHeaders(type);
      const tableData = getTableData(billing.data, type);

      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,

        // @ts-ignore
        columnStyles: getColumnStyles(type),
        startY: 130,
        headStyles: {
          textColor: [40, 40, 40],
          fontStyle: 'bold',
          fontSize: 9,
          fillColor: [231, 231, 231],
          lineWidth: 0.1,
          lineColor: [204, 204, 204],
        },
        bodyStyles: {
          textColor: [60, 60, 60],
          fontSize: 9,
          lineWidth: 0.1,
          lineColor: [204, 204, 204],
        },
      });

      const date = moment();
      const formattedDate = date.format('YYYY_MM_DD');
      doc.save(`${billingDetails.billing_no || 'billing'}_${formattedDate}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateXlsx = () => {
    if (!billing?.data?.[0]) {
      console.error('No data to export.');
      return;
    }

    const billingDetails = billing.data[0].billings ?? billing.data[0];
    const totalAmount =
      type === 'insurer'
        ? billingDetails.amount ?? 0
        : (billingDetails.total ?? 0) - (billingDetails.amount ?? 0);

    const headerBilling = [
      ['Billing No.', billingDetails.billing_no || '-'],
      [
        type === 'insurer' ? 'Total Amount' : 'Total Net Premium',
        `${billingDetails.currency || 'IDR'} ${formatMoney(totalAmount)}`,
      ],
      [
        'Created Date',
        billingDetails.created_at ? new Date(billingDetails.created_at).toDateString() : '-',
      ],
      ['Status', getStatusConfig(billingDetails.status || '').label],
      ['Type', billingDetails.type || '-'],
      ['Company Name', billingDetails.company_name || '-'],
      ['Period', billingDetails.transaction_period || '-'],
      [],
      [],
    ];

    const tableHeader = [getTableHeaders(type)];
    const tableData = getTableData(billing.data, type);

    const sheetData = [...headerBilling, ...tableHeader, ...tableData];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    const wb = XLSX.utils.book_new();
    const sheetName = type === 'insurer' ? 'Billing Detail' : 'Listing Detail';
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    XLSX.writeFile(wb, `${sheetName}.xlsx`);
  };

  const getTableHeaders = (type: string) => {
    if (type === 'insurer') {
      return [
        'No.',
        'Transaction Number',
        'Plan Name',
        'Transaction Date',
        'Currency',
        'Amount',
        '%',
        'Commission Amount',
      ];
    }
    return [
      'No.',
      'Transaction Number',
      'Plan Name',
      'Insurance Company Name',
      'Transaction Date',
      'Currency',
      'Premium',
      '%',
      'Net Premium',
    ];
  };

  const getTableData = (data: any[], type: string) => {
    return data.map((item: any, index: number) => {
      if (type === 'partner') {
        return [
          index + 1,
          item.invoice_no,
          item.details?.plan_name.split('|')[0] || '-',
          item.details?.insurance_name || '-',
          formatDate(item.details?.transaction_date, 'YYYY-MM-DD'),
          item.billings.currency,
          formatMoney(item.amount),
          `${item.commission_percentage ?? 0}%`,
          formatMoney(item.amount - (item.commission_amount ?? 0)),
        ];
      } else {
        return [
          index + 1,
          item.invoice_no,
          item.details?.plan_name.split('|')[0] || '-',
          formatDate(item.details?.transaction_date, 'YYYY-MM-DD'),
          item.billings.currency,
          formatMoney(item.amount),
          `${item.commission_percentage ?? 0}%`,
          formatMoney(item.commission_amount ?? 0),
        ];
      }
    });
  };

  const getColumnStyles = (type: string) => {
    if (type === 'partner') {
      return {
        6: { halign: 'right' as const },
        7: { halign: 'right' as const },
        8: { halign: 'right' as const },
      };
    }
    return {
      5: { halign: 'right' as const },
      6: { halign: 'right' as const },
      7: { halign: 'right' as const },
    };
  };

  const handleBack = () => {
    router.push(`${AppURL.financeBillingDetail}/${id}`);
  };

  const tableStyles = {
    table: {
      width: '100%',
      border: '0.5px solid #cccccc',
      borderCollapse: 'collapse' as const,
    },
    th: {
      padding: '10px',
      border: '0.5px solid #cccccc',
      fontWeight: 'bold',
      fontSize: '12px',
      background: '#e7e7e7',
      verticalAlign: 'middle',
      textAlign: 'left' as const,
    },
    td: {
      padding: '10px',
      border: '0.5px solid #cccccc',
      fontSize: '12px',
      verticalAlign: 'middle',
    },
    tdRight: {
      padding: '10px',
      border: '0.5px solid #cccccc',
      fontSize: '12px',
      verticalAlign: 'middle',
      textAlign: 'right' as const,
    },
    thRight: {
      padding: '10px',
      border: '0.5px solid #cccccc',
      fontWeight: 'bold',
      fontSize: '12px',
      background: '#e7e7e7',
      verticalAlign: 'middle',
      textAlign: 'right' as const,
    },
  };

  if (isLoadingBilling) {
    return (
      <Box className="flex flex-col gap-2 justify-center items-center h-screen text-sm">
        <Spinner
          inline
          className="[&_[data-slot=spinner-icon]]:size-10 [&_[data-slot=spinner-icon]]:text-blue-500"
        />
        Loading billing details...
      </Box>
    );
  }

  if (!billing?.data?.length) {
    return (
      <Box className="flex items-center justify-center h-screen">
        <Box className="text-lg">No billing data found</Box>
      </Box>
    );
  }

  const billingDetails = billing.data[0].billings ?? billing.data[0];
  const totalAmount =
    type === 'insurer'
      ? (billingDetails?.amount ?? 0)
      : (billingDetails?.total ?? 0) - (billingDetails?.amount ?? 0);

  const statusInfo = getStatusConfig(billingDetails?.status ?? '');

  return (
    <Box className="flex flex-col w-full min-h-screen bg-gray-50/50">
      {/* Header */}
      <Box className="bg-white border-b border-gray-200 md:px-6 p-4 flex items-center sticky top-0 z-10">
        <Box>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={AppURL.financeBilling}>Billing</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {type === 'insurer' ? 'Billing Detail' : 'Listing Detail'}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Box as="h2" className="text-slate-900 font-bold sm:text-2xl text-lg sm:mt-2 mt-1">
            {type === 'insurer' ? 'Billing Detail' : 'Listing Detail'}
          </Box>
        </Box>

        <Box className="flex items-center gap-4 ml-auto">
          <Box
            as="button"
            onClick={handleBack}
            className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer mr-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Box>

          <Button
            onClick={handleGeneratePdf}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full text-xs"
          >
            <Download className="w-5 h-5 mr-1" /> Generate PDF
          </Button>

          <Button
            onClick={handleGenerateXlsx}
            className="bg-[#41BAF5] text-black hover:bg-[#2d9ae6] rounded-full text-xs"
          >
            <Download className="w-5 h-5 mr-1" /> Generate XLSX
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <Box className="max-w-[1200px] mx-auto w-full p-5">
        <Box
          className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden"
          ref={refTemplate}
        >
          <Box className="p-8">
            {/* Billing Info Header */}
            <Box className="flex justify-between items-start pb-8 mb-8 border-b border-gray-100">
              <Box as="dl" className="grid grid-cols-[160px_16px_1fr] gap-y-3 text-sm">
                <Box as="dt" className="text-slate-500 font-medium">
                  Billing No.
                </Box>
                <Box as="dd" className="text-slate-400">
                  :
                </Box>
                <Box as="dd" className="text-slate-900 font-medium">
                  {billingDetails.billing_no}
                </Box>

                <Box as="dt" className="text-slate-500 font-medium">
                  {type === 'insurer' ? 'Total Amount' : 'Total Net Premium'}
                </Box>
                <Box as="dd" className="text-slate-400">
                  :
                </Box>
                <Box as="dd" className="text-slate-900 font-medium">
                  {billingDetails.currency} {formatMoney(totalAmount)}
                </Box>

                <Box as="dt" className="text-slate-500 font-medium">
                  Created Date
                </Box>
                <Box as="dd" className="text-slate-400">
                  :
                </Box>
                <Box as="dd" className="text-slate-900 font-medium">
                  {moment(billingDetails.created_at).format('ddd, MMM DD YYYY')}
                </Box>

                <Box as="dt" className="text-slate-500 font-medium">
                  Status
                </Box>
                <Box as="dd" className="text-slate-400">
                  :
                </Box>
                <Box as="dd">
                  <Badge tone={statusInfo.tone} size="md">
                    {statusInfo.label}
                  </Badge>
                </Box>

                <Box as="dt" className="text-slate-500 font-medium">
                  Type
                </Box>
                <Box as="dd" className="text-slate-400">
                  :
                </Box>
                <Box as="dd" className="text-slate-900 font-medium capitalize">
                  {billingDetails.type}
                </Box>

                <Box as="dt" className="text-slate-500 font-medium">
                  Company Name
                </Box>
                <Box as="dd" className="text-slate-400">
                  :
                </Box>
                <Box as="dd" className="text-slate-900 font-medium">
                  {billingDetails.company_name}
                </Box>

                <Box as="dt" className="text-slate-500 font-medium">
                  Period
                </Box>
                <Box as="dd" className="text-slate-400">
                  :
                </Box>
                <Box as="dd" className="text-slate-900 font-medium">
                  {billingDetails.transaction_period}
                </Box>
              </Box>

              <Box className="shrink-0 pt-1">
                <Box
                  as="img"
                  width={160}
                  src="https://friendsure-spaces.sgp1.digitaloceanspaces.com/teman.png"
                  alt="PT.Teman Pialang Asuransi"
                />
              </Box>
            </Box>

            <Box className="overflow-x-auto">
              <Box as="table" style={tableStyles.table}>
                <Box as="thead">
                  <Box as="tr">
                    <Box as="th" style={tableStyles.th}>
                      No.
                    </Box>
                    <Box as="th" style={tableStyles.th}>
                      Transaction Number
                    </Box>
                    <Box as="th" style={tableStyles.th}>
                      Plan Name
                    </Box>
                    {type === 'partner' && (
                      <Box as="th" style={tableStyles.th}>
                        Insurance Company Name
                      </Box>
                    )}
                    <Box as="th" style={tableStyles.th}>
                      Transaction Date
                    </Box>
                    <Box as="th" style={tableStyles.th}>
                      Currency
                    </Box>
                    <Box as="th" style={tableStyles.thRight}>
                      Premium
                    </Box>
                    <Box as="th" style={tableStyles.thRight}>
                      %
                    </Box>
                    <Box as="th" style={tableStyles.thRight}>
                      {type === 'insurer' ? 'Commission Amount' : 'Net Premium'}
                    </Box>
                  </Box>
                </Box>
                <Box as="tbody">
                  {billing.data.map((data: any, index: number) => (
                    <Box as="tr" key={data.id} className="hover:bg-slate-50 transition-colors">
                      <Box as="td" style={tableStyles.td}>
                        {index + 1}
                      </Box>
                      <Box as="td" style={tableStyles.td}>
                        {data.invoice_no || '-'}
                      </Box>
                      <Box as="td" style={tableStyles.td}>
                        {data.details?.plan_name?.split('|')[0] || '-'}
                      </Box>
                      {type === 'partner' && (
                        <Box as="td" style={tableStyles.td}>
                          {data.details?.insurance_name || '-'}
                        </Box>
                      )}
                      <Box as="td" style={tableStyles.td}>
                        {data.details?.transaction_date 
                          ? formatDate(data.details.transaction_date, 'YYYY-MM-DD')
                          : '-'}
                      </Box>
                      <Box as="td" style={tableStyles.td}>
                        {data.billings?.currency || billingDetails?.currency || 'IDR'}
                      </Box>
                      <Box as="td" style={tableStyles.tdRight}>
                        {formatMoney(data.amount ?? 0)}
                      </Box>
                      <Box as="td" style={tableStyles.tdRight}>
                        {data.commission_percentage ?? 0}%
                      </Box>
                      <Box as="td" style={tableStyles.tdRight}>
                        {type === 'insurer'
                          ? formatMoney(data.commission_amount ?? 0)
                          : formatMoney((data.amount ?? 0) - (data.commission_amount ?? 0))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
