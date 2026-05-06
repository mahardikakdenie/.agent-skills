'use client';

import noData from '@public/images/no-data.webp';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { ChevronLeft, Download } from 'react-feather';
import * as XLSX from 'xlsx';

import { Box, Button, Spinner } from '@repo/ui';

import { useEndorsements } from '@/services/policy/hooks/queries';

export default function ExportPage() {
  const page = 1;
  const { data: endorsementsResponse, isFetching: isLoading } = useEndorsements({
    page,
    limit: 100,
  });
  const data = ((endorsementsResponse as any)?.data ?? []) as any[];
  const totalData = ((endorsementsResponse as any)?.total ?? 1) as number;
  const rowsPerPage = totalData || 1;
  const router = useRouter();

  const reportTemplateRef = useRef(null);

  const handleGeneratePdf = () => {
    if (!reportTemplateRef.current) {
      console.error('Template element is not found.');
      return;
    }

    const doc = new jsPDF({ format: 'a1', unit: 'px' });
    doc.setFontSize(10);
    doc.setFont('Inter-Regular', 'normal');
    doc.html(reportTemplateRef.current, {
      async callback(doc) {
        await doc.save('Endorsement.pdf');
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

    const sheetData = data.map((endorsement, index) => ({
      No: (page - 1) * rowsPerPage + index + 1,
      'Request ID': endorsement.number || '-',
      'Insured Name':
        endorsement?.participants?.full_name ||
        endorsement?.participants?.name ||
        endorsement?.participants?.first_name ||
        endorsement?.participants?.last_name ||
        '-',
      'Policy Number': endorsement.policies?.number || '-',
      'Request Date': endorsement?.created_at
        ? new Date(endorsement.created_at).toLocaleDateString('en-GB')
        : 'No Date',
      'Approve Date': endorsement?.updated_at
        ? new Date(endorsement.updated_at).toLocaleDateString('en-GB')
        : 'No Date',
      Status: endorsement.status || '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Endorsements');

    XLSX.writeFile(workbook, 'Endorsements.xlsx');
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
    <Box className="flex flex-col w-full p-4 md:p-6 h-screen overflow-auto">
      <Box className="flex gap-4 mb-5">
        <Box as="h1" className="text-black font-bold text-2xl mt-2">Endorsements</Box>
        <Box
          onClick={() => router.back()}
          className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer mr-4"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Box>
        <Button
          onClick={handleGeneratePdf}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full text-xs"
        >
          <Download className="w-5 h-5 mr-1 " /> Generate PDF
        </Button>
        <Button
          onClick={handleGenerateXlsx}
          className="bg-[#41BAF5] text-black hover:bg-[#2d9ae6] rounded-full text-xs"
        >
          <Download className="w-5 h-5 mr-1 " /> Generate XLSX
        </Button>
      </Box>
      <Box className="w-full bg-white rounded-lg">
        {isLoading ? (
          <Box className="flex gap-2 flex-col justify-center items-center py-20 text-sm">
            <Spinner
              inline
              className="[&_[data-slot=spinner-icon]]:size-10 [&_[data-slot=spinner-icon]]:text-blue-500"
            />{' '}
            Loading...
          </Box>
        ) : (
          <Box as="table" style={styles.table} ref={reportTemplateRef}>
            <Box as="thead">
              <Box as="tr">
                <Box as="td" style={styles.th} valign="middle">
                  No.
                </Box>
                <Box as="td" style={styles.th} valign="middle">
                  Request ID
                </Box>
                <Box as="td" style={styles.th} valign="middle">
                  Insured Name
                </Box>
                <Box as="td" style={styles.th} valign="middle">
                  Policy Number
                </Box>
                <Box as="td" style={styles.th} valign="middle">
                  Request Date
                </Box>
                <Box as="td" style={styles.th} valign="middle">
                  Approve Date
                </Box>
                <Box as="td" style={styles.th} valign="middle">
                  Status
                </Box>
              </Box>
            </Box>
            <Box as="tbody">
              {data.length > 0 ? (
                data.map((endorsement, index) => (
                  <Box as="tr" key={endorsement.id}>
                    <Box as="td" style={styles.td} valign="middle">
                      {(page - 1) * rowsPerPage + index + 1}
                    </Box>
                    <Box as="td" style={styles.td} valign="middle">
                      {endorsement.number}
                    </Box>
                    <Box as="td" style={styles.td} valign="middle">
                      {endorsement?.insured_parties?.profile?.name ||
                        endorsement?.policies?.policy_holders?.name ||
                        endorsement?.participants?.profile?.name ||
                        '-'}
                    </Box>
                    <Box as="td" style={styles.td} valign="middle">
                      {endorsement.policies?.number || '-'}
                    </Box>
                    <Box as="td" style={styles.td} valign="middle">
                      {endorsement?.created_at
                        ? new Date(endorsement.created_at).toLocaleDateString('en-GB')
                        : 'No Date'}
                    </Box>
                    <Box as="td" style={styles.td} valign="middle">
                      {endorsement?.updated_at
                        ? new Date(endorsement.updated_at).toLocaleDateString('en-GB')
                        : 'No Date'}
                    </Box>
                    <Box as="td" style={styles.td} valign="middle">
                      {endorsement.status}
                    </Box>
                  </Box>
                ))
              ) : (
                <Box as="tr" className="hover:!bg-white">
                  <Box as="td" colSpan={7}>
                    <Box className="flex flex-col gap-4 items-center justify-center py-14">
                      <Image alt="no data" src={noData} width={200} /> No endorsement data available
                    </Box>
                  </Box>{' '}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
