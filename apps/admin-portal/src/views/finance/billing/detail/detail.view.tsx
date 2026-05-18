import moment from 'moment/moment';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'react-feather';

import { Box } from '@repo/ui';

import Button from '@/components/button';
import NotFound from '@/components/not-found';
import Pagination from '@/components/pagination';
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import {
  capitalizeString,
  capitalizeStringWithChar,
  getBreadcrumbs,
  getHeaderPage,
  moneyFormatter,
} from '@/helpers/app.helper';
import DownloadIcon from '@/images/download.icon';
import { financeService } from '@/services/finance/api/finance.service';

export const FinanceBillingDetailView = () => {
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalData, setTotalData] = useState(0);
  const path = usePathname();
  const router = useRouter();
  const { id } = useParams();
  const { isMobileView, setLoading } = useScreen();
  const { handleResponseError, user } = useAuth();
  const { pageName, breadcrumbsArray } = getHeaderPage(3, path, false);

  useEffect(() => {
    fetchDataFinanceBillingDetail(currentPage, itemsPerPage).then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDataFinanceBillingDetail = async (page: number, limit: number) => {
    try {
      setLoading(true);
      const params = {
        company: user.channel,
        page,
        pageSize: limit,
      };
      if (!id) return;
      const responseFinanceBillingDetail: any = await financeService.getBillingById(
        id.toString(),
        params,
      );
      if (responseFinanceBillingDetail) {
        setCurrentPage(page);
        setTotalData(responseFinanceBillingDetail?.meta?.total || 0);
        setData(responseFinanceBillingDetail?.data || []);
      }
    } catch (error: any) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchDataFinanceBillingDetail(newPage, itemsPerPage).then();
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    fetchDataFinanceBillingDetail(1, newItemsPerPage).then();
  };

  const goToBillingPage = () => {
    router.push(path.split('/').slice(0, -2).join('/'));
  };

  const goToExportBillingDetail = () => {
    router.push(`${path}/export`);
  };

  return (
    <Box className="mx-auto">
      <Box className="overflow-x-auto sm:scrollable bg-white flex items-center justify-between mb-5 py-5 px-7">
        <Box>
          {getBreadcrumbs(breadcrumbsArray)}
          <Box as="p" className="font-bold text-lg">
            {pageName}
          </Box>
        </Box>
        <Box className="flex items-center">
          <Box
            onClick={goToBillingPage}
            className="flex items-center justify-between cursor-pointer mr-5"
          >
            <ChevronLeft color="red" width="30" height="15" />
            <Box as="p" className="text-sm text-red-500">
              Back
            </Box>
          </Box>
          <Button
            additionalClassName="w-full lg:w-fit justify-center lg:justify-between"
            onClick={goToExportBillingDetail}
            variant="warning"
            withIcon={true}
          >
            {DownloadIcon('#000')}
            <Box as="span" className="ml-1">
              Export
            </Box>
          </Button>
        </Box>
      </Box>
      <Box className="pb-5 px-7">
        <Box className="overflow-x-auto sm:scrollable bg-white rounded-md mb-3 py-5 px-7 shadow">
          <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
            <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
              Number
            </Box>
            <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
              <Box as="p" className="hidden lg:block lg:mr-2">
                :
              </Box>
              <Box as="p">{data?.[0]?.billings?.billing_no || '-'}</Box>
            </Box>
          </Box>
          <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
            <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
              Total Transaction Amount
            </Box>
            <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
              <Box as="p" className="hidden lg:block lg:mr-2">
                :
              </Box>
              <Box as="p">
                {!!data?.[0]?.billings?.total
                  ? moneyFormatter().format(data[0].billings.total)
                  : '-'}
              </Box>
            </Box>
          </Box>
          <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
            <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
              Total Commission Amount
            </Box>
            <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
              <Box as="p" className="hidden lg:block lg:mr-2">
                :
              </Box>
              <Box as="p">
                {!!data?.[0]?.billings?.amount
                  ? moneyFormatter().format(data[0].billings.amount)
                  : '-'}
              </Box>
            </Box>
          </Box>
          <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
            <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
              Billing Date
            </Box>
            <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
              <Box as="p" className="hidden lg:block lg:mr-2">
                :
              </Box>
              <Box as="p">
                {!!data?.[0]?.billings?.created_at
                  ? moment(data[0].billings.created_at).format('LL')
                  : '-'}
              </Box>
            </Box>
          </Box>
          <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
            <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
              Status
            </Box>
            <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
              <Box as="p" className="hidden lg:block lg:mr-2">
                :
              </Box>
              <Box as="p">
                {!!data?.[0]?.billings?.status
                  ? capitalizeStringWithChar(data[0].billings.status, '-')
                  : '-'}
              </Box>
            </Box>
          </Box>
          <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
            <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
              Type
            </Box>
            <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
              <Box as="p" className="hidden lg:block lg:mr-2">
                :
              </Box>
              <Box as="p">
                {!!data?.[0]?.billings?.type ? capitalizeString(data[0].billings.type) : '-'}
              </Box>
            </Box>
          </Box>
          <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
            <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
              Company Name
            </Box>
            <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
              <Box as="p" className="hidden lg:block lg:mr-2">
                :
              </Box>
              <Box as="p">
                {!!data?.[0]?.billings?.company_name ? data[0].billings.company_name : '-'}
              </Box>
            </Box>
          </Box>
          <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
            <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
              Period
            </Box>
            <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
              <Box as="p" className="hidden lg:block lg:mr-2">
                :
              </Box>
              <Box as="p">
                {!!data?.[0]?.billings?.transaction_period
                  ? data[0].billings.transaction_period
                  : '-'}
              </Box>
            </Box>
          </Box>
        </Box>
        {data.length > 0 ? (
          <Box className="relative bg-white rounded-md shadow-md">
            <Box className="overflow-x-auto sm:scrollable">
              <Box as="table" className="min-w-full divide-y divide-gray-200">
                <Box as="thead" className="bg-white">
                  <Box as="tr">
                    <Box
                      as="th"
                      className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      No.
                    </Box>
                    <Box
                      as="th"
                      className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      Transaction Number
                    </Box>
                    <Box
                      as="th"
                      className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      Plan Name
                    </Box>
                    <Box
                      as="th"
                      className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      Insurance Company Name
                    </Box>
                    <Box
                      as="th"
                      className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      Amount
                    </Box>
                    <Box
                      as="th"
                      className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      Transaction Date
                    </Box>
                    <Box
                      as="th"
                      className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      Commission Percentage
                    </Box>
                    <Box
                      as="th"
                      className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      Commission Amount
                    </Box>
                  </Box>
                </Box>
                <Box as="tbody" className="bg-white divide-y divide-gray-200">
                  {data.map((d, index) => (
                    <Box as="tr" key={`${index}-${d.id}`} className="hover:bg-gray-50">
                      <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </Box>
                      <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {d.invoice_no || '-'}
                      </Box>
                      <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {d.details?.plan_name || '-'}
                      </Box>
                      <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {d.details?.insurance_name || '-'}
                      </Box>
                      <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {!!d.amount ? moneyFormatter().format(d.amount) : '-'}
                      </Box>
                      <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {!!d.details?.transaction_date
                          ? moment(d.details.transaction_date).format('LL')
                          : '-'}
                      </Box>
                      <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {d.commission_percentage || '0'}
                      </Box>
                      <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {!!d.commission_amount ? moneyFormatter().format(d.commission_amount) : '-'}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box className="bottom-0 left-0 right-0 bg-white py-2 px-4 border-t border-t-gray-200">
              <Pagination
                totalData={totalData}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </Box>
          </Box>
        ) : (
          <Box className="flex items-center justify-center bg-white rounded-md py-20 shadow">
            <NotFound
              width={isMobileView && '143'}
              height={isMobileView && '144'}
              size1={isMobileView && '143'}
              size3={isMobileView && '95'}
              viewBox={isMobileView && '0 0 70 70'}
              text="No billing data available"
              textClassName={isMobileView && 'text-xs'}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
