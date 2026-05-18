import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Box } from '@repo/ui';

import Button from '@/components/button';
import DatePicker from '@/components/datepicker';
import Modal from '@/components/modal';
import NotFound from '@/components/not-found';
import Pagination from '@/components/pagination';
import { delimiter, primary } from '@/constants/app-common.const';
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import { getHeaderPage, moneyFormatter, startDateAndEndDateView } from '@/helpers/app.helper';
import CalenderIcon from '@/images/calender.icon';
import { transactionService } from '@/services/transaction/api/transaction.service';
import { Meta } from '@/types/page';
import { Transaction } from '@/types/transaction';

export const ListTransactionView = () => {
  const { isMobileView, setLoading } = useScreen();
  const path = usePathname();
  const { user, handleResponseError } = useAuth();
  const [listTransaction, setListTransaction] = useState<Transaction[]>([]);
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);
  const [currentSelectedDate, setCurrentSelectedDate] = useState('');
  const [isFilterDateModal, setIsFilterDateModal] = useState(false);
  const [isSelectedStartDateChange, setIsSelectedStartDateChange] = useState(false);
  const [inputPage, setInputPage] = useState<Meta>({
    page: 1,
    limit: 10,
    total: 0,
    pageTotal: 0,
  });
  const channel = user?.channel || undefined;
  const findListTransaction = async (
    from?: string | null,
    to?: string | null,
    isClearDateFilter: boolean = false,
  ) => {
    setLoading(true);
    try {
      const response: any = await transactionService.getTransactions({
        channel,
        page: inputPage.page,
        limit: inputPage.limit,
        from,
        to,
      });
      setListTransaction(response?.data || []);
      setInputPage((prevState) => ({
        ...prevState,
        pageTotal: response?.pageTotal || 0,
        total: response?.total || 0,
      }));
    } catch (e) {
      setListTransaction([]);
      handleResponseError(e);
    } finally {
      setCurrentSelectedDate(
        isClearDateFilter
          ? ''
          : from && to
            ? `${from}${delimiter}${to}`
            : selectedStartDate && selectedEndDate
              ? `${selectedStartDate}${delimiter}${selectedEndDate}`
              : `coyy`,
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isFilterDateModal) findListTransaction(selectedStartDate, selectedEndDate).then().catch();
  }, [inputPage.page, inputPage.limit, isFilterDateModal]);

  const handlePageChange = (newPage: number) => {
    setInputPage((prevState: Meta) => {
      return {
        ...prevState,
        page: newPage,
      };
    });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setInputPage((prevState) => ({ ...prevState, limit: newItemsPerPage }));
  };

  const handleCloseFilterDateModal = async () => {
    if (!!currentSelectedDate) {
      const currentDateValue = currentSelectedDate.split(delimiter);
      const currentStartDateValue =
        currentDateValue && currentDateValue.length > 1 ? currentDateValue[0] : '';
      const currentEndDateValue =
        currentDateValue && currentDateValue.length > 1 ? currentDateValue[1] : '';
      setSelectedStartDate(currentStartDateValue);
      setSelectedEndDate(currentEndDateValue);
      setIsFilterDateModal(false);
    } else {
      setSelectedStartDate(null);
      setSelectedEndDate(null);
      setIsFilterDateModal(false);
    }
  };

  const handleClearFilterDate = async () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setIsFilterDateModal(false);
    setInputPage((prev) => ({ ...prev, page: 1 }));
  };

  const setFilterDate = (value: string | null, isStartDate: boolean) => {
    if (isStartDate) {
      setSelectedStartDate(value);
      setSelectedEndDate(null);
      setIsSelectedStartDateChange(true);
      setTimeout(() => setIsSelectedStartDateChange(false), 500);
    } else {
      setSelectedEndDate(value);
    }
  };

  const filterDate = async () => {
    setIsFilterDateModal(false);
    setInputPage((prev) => ({ ...prev, page: 1 }));
    // await findListTransaction(selectedStartDate, selectedEndDate)
  };
  return (
    <Box className="mx-auto py-5 px-7">
      <Box className="overflow-x-auto sm:scrollable flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
        <Box as="p" className={`font-bold text-lg ${isMobileView && 'mb-2'}`}>
          {getHeaderPage(2, path, true).pageName}
        </Box>
        <Box className="flex flex-col lg:flex-row items-center justify-end">
          <Box className="w-full lg:w-80 mr-0 lg:mr-5 mb-3 lg:mb-0">
            <Box
              onClick={() => setIsFilterDateModal(true)}
              className={`shadow bg-white clickable py-2 pl-5 pr-1.5 rounded-md flex items-center justify-between`}
            >
              <Box as="p" className="text-xs">
                {selectedStartDate && selectedEndDate
                  ? startDateAndEndDateView(selectedStartDate, selectedEndDate)
                  : selectedStartDate
                    ? startDateAndEndDateView(selectedStartDate, selectedStartDate)
                    : 'Date'}
              </Box>
              <Box>{CalenderIcon(primary, '30', '30', '0 -4 25 24')}</Box>
            </Box>
          </Box>
        </Box>
      </Box>
      {listTransaction.length > 0 ? (
        <Box className="relative bg-white rounded-md shadow-md">
          <Box style={{ minHeight: '60vh' }} className="overflow-x-auto sm:scrollable">
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
                    Transaction Code
                  </Box>
                  <Box
                    as="th"
                    className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Buyer
                  </Box>
                  <Box
                    as="th"
                    className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Product Name
                  </Box>
                  <Box
                    as="th"
                    className="px-6 py-6 whitespace-nowrap text-center text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    Plan Name
                  </Box>
                  <Box
                    as="th"
                    className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Currency
                  </Box>
                  <Box
                    as="th"
                    className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Premium
                  </Box>
                  <Box
                    as="th"
                    className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Transaction Date
                  </Box>
                </Box>
              </Box>
              <Box as="tbody" className="bg-white divide-y divide-gray-200">
                {listTransaction.map((transaction: Transaction, index) => (
                  <Box as="tr" className="hover:bg-gray-50" key={transaction.id || index}>
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {(inputPage.page - 1) * inputPage.limit + index + 1}
                    </Box>
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {transaction.code || 'N/A'}
                    </Box>
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {transaction.customer?.name || 'N/A'}
                    </Box>
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {transaction.insurance?.product.name || 'N/A'}
                    </Box>
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {transaction.insurance?.plan.name || 'N/A'}
                    </Box>
                    <Box
                      as="td"
                      className="px-6 py-3 whitespace-nowrap text-sm text-center text-gray-500"
                    >
                      {transaction.insurance.currency || 'N/A'}
                    </Box>
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {moneyFormatter().format(transaction.insurance.premium as number) || 'N/A'}
                    </Box>
                    <Box
                      as="td"
                      className="px-6 py-3 whitespace-nowrap text-sm text-center text-gray-500"
                    >
                      {transaction.created_at
                        ? startDateAndEndDateView(transaction.created_at, transaction.created_at)
                        : 'N/A'}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          <Box className="bottom-0 left-0 right-0 bg-white py-2 px-4 border-t border-t-gray-200">
            <Pagination
              totalData={inputPage?.total as number}
              currentPage={inputPage?.page as number}
              onPageChange={handlePageChange}
              limit={inputPage.limit}
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
            text="No transactions data available"
            textClassName={isMobileView && 'text-xs'}
          />
        </Box>
      )}
      <Modal
        isOpen={isFilterDateModal}
        onClose={handleCloseFilterDateModal}
        widthClassName="w-full lg:w-[500px]"
        heightClassName="h-fit"
      >
        <Box className="py-6 px-4">
          <Box as="h1" className="font-bold text-lg text-center mb-5">
            Date Filter
          </Box>
          <Box className="grid grid-cols-2 gap-4 mb-5">
            <DatePicker
              initialValue={selectedStartDate as string}
              isWithShadow={false}
              borderDatePicker="border"
              label="Start Date"
              onSubmit={(value) => setFilterDate(value, true)}
              onClear={() => setFilterDate(null, true)}
            />
            <DatePicker
              initialValue={selectedEndDate as string}
              isWithShadow={false}
              borderDatePicker="border"
              label="End Date"
              onSubmit={(value) => setFilterDate(value, false)}
              onClear={() => setFilterDate(null, false)}
              minimumDate={selectedStartDate as string}
              isDisabled={!selectedStartDate}
              isForceClear={isSelectedStartDateChange}
            />
          </Box>
          <Box className="flex items-center justify-center text-center">
            <Button variant="danger" additionalClassName="mr-2" onClick={handleClearFilterDate}>
              <Box as="span" className="mx-3.5">
                Clear
              </Box>
            </Button>
            <Button disabled={!selectedStartDate && !selectedEndDate} onClick={filterDate}>
              <Box
                as="span"
                className={`mx-3 ${(!selectedStartDate || !selectedEndDate) && 'text-white'}`}
              >
                Save
              </Box>
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
