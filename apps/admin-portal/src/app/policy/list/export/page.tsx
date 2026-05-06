'use client';

import noData from '@public/images/no-data.webp';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Download } from 'react-feather';

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

import useExportPolicy from '@/hooks/useExportPolicy.hooks';

export default function ExportPage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    isGeneratingXlsx,
    isShowPremi,
    isShowDanaInfo,
    reportTemplateRef,
    handleGeneratePdf,
    handleGenerateXlsx,
  } = useExportPolicy();

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

  const totalCols = 5 + (isShowPremi ? 1 : 0) + (isShowDanaInfo ? 3 : 0);

  return (
    <Box className="flex flex-col w-full p-4 md:p-6 h-screen overflow-auto">
      <Box className="flex gap-4 mb-5">
        <Box as="h1" className="text-black font-bold text-2xl mt-2">
          Policy List
        </Box>
        <Box
          onClick={() => router.back()}
          className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer mr-4"
        >
          <ChevronLeft className="w-4 h-4" /> Back
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
          disabled={isGeneratingXlsx}
          className="bg-[#41BAF5] text-black hover:bg-[#2d9ae6] rounded-full text-xs disabled:opacity-50 disabled:cursor-not-allowed gap-1"
          leftIcon={!isGeneratingXlsx ? <Download className="w-5 h-5" /> : undefined}
        >
          {isGeneratingXlsx ? (
            <>
              <Spinner
                inline
                className="[&_[data-slot=spinner-icon]]:size-4 [&_[data-slot=spinner-icon]]:text-blue-500"
              />
              Generating...
            </>
          ) : (
            'Generate XLSX'
          )}
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
          <Table style={styles.table} ref={reportTemplateRef}>
            <TableHeader>
              <TableRow>
                <TableHead style={styles.th}>No.</TableHead>
                <TableHead style={styles.th}>Customer Name</TableHead>
                <TableHead style={styles.th}>Policy Number</TableHead>
                <TableHead style={styles.th}>Plan Name</TableHead>
                <TableHead style={styles.th}>Status</TableHead>
                {isShowPremi && <TableHead style={styles.th}>Premium</TableHead>}
                {isShowDanaInfo && (
                  <>
                    <TableHead style={styles.th}>Order Id</TableHead>
                    <TableHead style={styles.th}>Request Id</TableHead>
                    <TableHead style={styles.th}>License Plate</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell style={styles.td}>{index + 1}</TableCell>
                    <TableCell style={styles.td}>
                      <Box className="flex gap-2 items-center">
                        {item.policy_holder?.name || '-'}
                      </Box>
                    </TableCell>
                    <TableCell style={styles.td}>{item?.number || '-'}</TableCell>
                    <TableCell style={styles.td}>
                      {item?.policy_products?.plan_data?.name.split('|').join(' - ') || '-'}
                    </TableCell>
                    <TableCell style={styles.td} className="whitespace-nowrap">
                      {item.status || '-'}
                    </TableCell>
                    {isShowPremi && (
                      <TableCell style={styles.td}>
                        {item.declarations?.transaction_data?.insurance?.premium || '-'}
                      </TableCell>
                    )}
                    {isShowDanaInfo &&
                      (item.declarations?.transaction_data?.third_party?.provider === 'DANA' ? (
                        <>
                          <TableCell style={styles.td}>
                            {item.declarations?.transaction_data?.third_party?.identifiers
                              ?.order_id || '-'}
                          </TableCell>
                          <TableCell style={styles.td}>
                            {item.declarations?.transaction_data?.third_party?.identifiers
                              ?.request_id || '-'}
                          </TableCell>
                          <TableCell style={styles.td}>
                            {item.declarations?.transaction_data?.participants[0]?.data
                              ?.licensePlate ||
                              item.declarations?.transaction_data?.participants[0]?.data
                                ?.plat_number ||
                              '-'}
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell style={styles.td}>-</TableCell>
                          <TableCell style={styles.td}>-</TableCell>
                          <TableCell style={styles.td}>-</TableCell>
                        </>
                      ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:!bg-white">
                  <TableCell colSpan={totalCols}>
                    <Box className="flex flex-col gap-4 items-center justify-center py-14">
                      <Image alt="no data" src={noData} width={200} /> No transaction data available
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
