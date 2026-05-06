'use client';

import noData from '@public/images/no-data.webp';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Download } from 'react-feather';

import { Box, Button, Spinner } from '@repo/ui';

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
        <Box as="h1" className="text-black font-bold text-2xl mt-2">Policy List</Box>
        <Box
          as="button"
          type="button"
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
          disabled={isGeneratingXlsx}
          className="bg-[#41BAF5] text-black hover:bg-[#2d9ae6] rounded-full text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingXlsx ? (
            <>
              <Spinner
                inline
                className="mr-2 [&_[data-slot=spinner-icon]]:size-6 [&_[data-slot=spinner-icon]]:text-blue-500"
              />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-1 " /> Generate XLSX
            </>
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
          <Box as="table" style={styles.table} ref={reportTemplateRef}>
            <Box as="thead">
              <Box as="tr">
                <Box as="td" style={styles.th} valign="middle">
                  No.
                </Box>
                <Box as="td" style={styles.th} valign="middle">
                  Customer Name
                </Box>
                <Box as="td" style={styles.th} valign="middle">
                  Policy Number
                </Box>
                <Box as="td" style={styles.th} valign="middle">
                  Plan Name
                </Box>
                <Box as="td" style={styles.th} valign="middle">
                  Status
                </Box>
                {isShowPremi && (
                  <Box as="td" style={styles.th} valign="middle">
                    Premium
                  </Box>
                )}
                {isShowDanaInfo && (
                  <>
                    <Box as="td" style={styles.th} valign="middle">
                      Order Id
                    </Box>
                    <Box as="td" style={styles.th} valign="middle">
                      Request Id
                    </Box>
                    <Box as="td" style={styles.th} valign="middle">
                      License Plate
                    </Box>
                  </>
                )}
              </Box>
            </Box>
            <Box as="tbody">
              {data.length > 0 ? (
                data.map((item, index) => (
                  <Box as="tr" key={item.id}>
                    <Box as="td" style={styles.td} valign="middle">
                      {index + 1}
                    </Box>
                    <Box as="td" style={styles.td} valign="middle">
                      <Box className="flex gap-2 items-center">
                        {item.policy_holder?.name || '-'}
                      </Box>
                    </Box>
                    <Box as="td" style={styles.td} valign="middle">
                      {item?.number || '-'}
                    </Box>
                    <Box as="td" style={styles.td} valign="middle">
                      {item?.policy_products?.plan_data?.name.split('|').join(' - ') || '-'}
                    </Box>
                    <Box as="td" style={styles.td} valign="middle" className="whitespace-nowrap">
                      {item.status || '-'}
                    </Box>
                    {isShowPremi && (
                      <Box as="td" style={styles.td} valign="middle">
                        {item.declarations?.transaction_data?.insurance?.premium || '-'}
                      </Box>
                    )}
                    {isShowDanaInfo &&
                      (item.declarations?.transaction_data?.third_party?.provider === 'DANA' ? (
                        <>
                          <Box as="td" style={styles.td} valign="middle">
                            {item.declarations?.transaction_data?.third_party?.identifiers
                              ?.order_id || '-'}
                          </Box>
                          <Box as="td" style={styles.td} valign="middle">
                            {item.declarations?.transaction_data?.third_party?.identifiers
                              ?.request_id || '-'}
                          </Box>
                          <Box as="td" style={styles.td} valign="middle">
                            {item.declarations?.transaction_data?.participants[0]?.data
                              ?.licensePlate ||
                              item.declarations?.transaction_data?.participants[0]?.data
                                ?.plat_number ||
                              '-'}
                          </Box>
                        </>
                      ) : (
                        <>
                          <Box as="td" style={styles.td} valign="middle">
                            -
                          </Box>
                          <Box as="td" style={styles.td} valign="middle">
                            -
                          </Box>
                          <Box as="td" style={styles.td} valign="middle">
                            -
                          </Box>
                        </>
                      ))}
                  </Box>
                ))
              ) : (
                <Box as="tr" className="hover:!bg-white">
                  <Box as="td" colSpan={totalCols}>
                    <Box className="flex flex-col gap-4 items-center justify-center py-14">
                      <Image alt="no data" src={noData} width={200} /> No transaction data available
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
