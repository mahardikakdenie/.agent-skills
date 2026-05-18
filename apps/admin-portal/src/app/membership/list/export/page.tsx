'use client';

import noData from '@public/images/no-data.webp';
import jsPDF from 'jspdf';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, Download } from 'react-feather';
import * as XLSX from 'xlsx';

import {
  Spinner,
  Box,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@repo/ui';

import { useInsuredParties } from '@/services/policy/hooks/queries';

export default function ExportPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [listParams, setListParams] = useState<Record<string, unknown> | undefined>(undefined);
  const rowsPerPage = 100;
  const { data: insuredPartiesResponse, isFetching: isLoading } = useInsuredParties(listParams, {
    enabled: !!listParams,
  });
  const data = ((insuredPartiesResponse as any)?.data ?? []) as any[];

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('exportMembershipData');
      if (!savedData) return;

      const parsedData = JSON.parse(savedData);
      const savedPage = parsedData.page ?? 1;
      setPage(savedPage);
      setListParams({
        page: savedPage,
        limit: 100,
        channel: parsedData.channel || undefined,
      });
    } catch (error) {
      console.error('Error preparing export params: ', error);
    }
  }, []);

  const reportTemplateRef = useRef(null);

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
        await doc.save('MembershipList.pdf');
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

    const sheetData = data.map((item, index) => ({
      No: (page - 1) * rowsPerPage + index + 1,
      'Policy Number': item?.number || '-',
      'Subsidiary / Entity': item?.profile?.subsidiary || '-',
      'Employee ID': item?.profile?.employee_id || '-',
      'Employee Name': item?.profile?.employee_name || '-',
      'Member Name': item?.profile?.member_name || '-',
      Gender: item?.profile?.gender || '-',
      'Date of Birth': item?.profile?.date_of_birth || '-',
      'Member Status': item?.profile?.member_status || '-',
      'Marital Status': item?.profile?.marital_status || '-',
      Plan: item?.profile?.plan || '-',
      'Effective Date': item?.profile?.effective_date || '-',
      Remarks: item?.profile?.remarks || '-',
      'Bank Name': item?.profile?.bank_name || '-',
      Branch: item?.profile?.branch || '-',
      'Bank Number': item?.profile?.bank_account_number || '-',
      'Bank Account Name': item?.profile?.bank_account_name || '-',
      Email: item?.profile?.email || '-',
      'Membership ID': item?.profile?.tpa_member_id || '-',
      'Submission Date': item?.profile?.submission_date || '-',
      Status: item?.status || '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'MembershipList');

    XLSX.writeFile(workbook, 'MembershipList.xlsx');
  };

  return (
    <Box className="flex flex-col w-full p-4 md:p-6 h-screen overflow-auto">
      <Box className="flex gap-4 mb-5">
        <Box as="h1" className="text-black font-bold text-2xl mt-2">
          Membership List
        </Box>
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
      <Box className="w-full bg-white rounded-lg overflow-auto">
        {isLoading ? (
          <Box className="flex gap-2 flex-col justify-center items-center py-20 text-sm">
            <Spinner
              inline
              className="[&_[data-slot=spinner-icon]]:size-10 [&_[data-slot=spinner-icon]]:text-blue-500"
            />{' '}
            Loading...
          </Box>
        ) : (
          <Table ref={reportTemplateRef} className="border">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-bold text-xs text-black border whitespace-nowrap">
                  No.
                </TableHead>
                <TableHead className="font-bold text-xs text-black border whitespace-nowrap">
                  Policy Number
                </TableHead>
                <TableHead className="font-bold text-xs text-black border whitespace-nowrap">
                  Subsidiary / Entity
                </TableHead>
                <TableHead className="font-bold text-xs text-black border whitespace-nowrap">
                  Employee ID
                </TableHead>
                <TableHead className="font-bold text-xs text-black border whitespace-nowrap">
                  Employee Name
                </TableHead>
                <TableHead className="font-bold text-xs text-black border whitespace-nowrap">
                  Member Name
                </TableHead>
                <TableHead className="font-bold text-xs text-black border whitespace-nowrap">
                  Gender
                </TableHead>
                <TableHead className="font-bold text-xs text-black border whitespace-nowrap">
                  Date of Birth
                </TableHead>
                <TableHead className="font-bold text-xs text-black border whitespace-nowrap">
                  Member Status
                </TableHead>
                <TableHead className="font-bold text-xs text-black border whitespace-nowrap">
                  Marital Status
                </TableHead>
                <TableHead className="font-bold text-xs text-black border whitespace-nowrap">
                  Plan
                </TableHead>
                <TableHead className="font-bold text-xs text-black border whitespace-nowrap">
                  Effective Date
                </TableHead>
                <TableHead className="font-bold text-xs text-black border whitespace-nowrap">
                  Remarks
                </TableHead>
                <TableHead className="font-bold text-xs text-black border whitespace-nowrap">
                  Bank Name
                </TableHead>
                <TableHead className="font-bold text-xs text-black border whitespace-nowrap">
                  Branch
                </TableHead>
                <TableHead className="font-bold text-xs text-black border whitespace-nowrap">
                  Bank Number
                </TableHead>
                <TableHead className="font-bold text-xs text-black border whitespace-nowrap">
                  Bank Account Name
                </TableHead>
                <TableHead className="font-bold text-xs text-black border whitespace-nowrap">
                  Email
                </TableHead>
                <TableHead className="font-bold text-xs text-black border whitespace-nowrap">
                  Membership ID
                </TableHead>
                <TableHead className="font-bold text-xs text-black border whitespace-nowrap">
                  Submission Date
                </TableHead>
                <TableHead className="font-bold text-xs text-black border whitespace-nowrap">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-xs border">
                      {(page - 1) * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="text-xs border">{item?.number || '-'}</TableCell>
                    <TableCell className="text-xs border">
                      {item?.profile?.subsidiary || '-'}
                    </TableCell>
                    <TableCell className="text-xs border">
                      {item?.profile?.employee_id || '-'}
                    </TableCell>
                    <TableCell className="text-xs border">
                      {item?.profile?.employee_name || '-'}
                    </TableCell>
                    <TableCell className="text-xs border">
                      {item?.profile?.member_name || '-'}
                    </TableCell>
                    <TableCell className="text-xs border">{item?.profile?.gender || '-'}</TableCell>
                    <TableCell className="text-xs border">
                      {item?.profile?.date_of_birth || '-'}
                    </TableCell>
                    <TableCell className="text-xs border">
                      {item?.profile?.member_status || '-'}
                    </TableCell>
                    <TableCell className="text-xs border">
                      {item?.profile?.marital_status || '-'}
                    </TableCell>
                    <TableCell className="text-xs border">{item?.profile?.plan || '-'}</TableCell>
                    <TableCell className="text-xs border">
                      {item?.profile?.effective_date || '-'}
                    </TableCell>
                    <TableCell className="text-xs border">
                      {item?.profile?.remarks || '-'}
                    </TableCell>
                    <TableCell className="text-xs border">
                      {item?.profile?.bank_name || '-'}
                    </TableCell>
                    <TableCell className="text-xs border">{item?.profile?.branch || '-'}</TableCell>
                    <TableCell className="text-xs border">
                      {item?.profile?.bank_account_number || '-'}
                    </TableCell>
                    <TableCell className="text-xs border">
                      {item?.profile?.bank_account_name || '-'}
                    </TableCell>
                    <TableCell className="text-xs border">{item?.profile?.email || '-'}</TableCell>
                    <TableCell className="text-xs border">
                      {item?.other_info?.tpa_member_id || '-'}
                    </TableCell>
                    <TableCell className="text-xs border">
                      {item?.profile?.submission_date || '-'}
                    </TableCell>
                    <TableCell className="text-xs border">{item?.status || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:!bg-white">
                  <TableCell colSpan={21}>
                    <Box className="flex flex-col gap-4 items-center justify-center py-14">
                      <Image alt="no data" src={noData} width={200} /> No membership data available
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Box>
    </Box>
  );
}
