import { usePathname, useRouter } from 'next/navigation';
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
import { capitalizeString, getHeaderPage, startDateAndEndDateView } from '@/helpers/app.helper';
import AddIcon from '@/images/add.icon';
import CalenderIcon from '@/images/calender.icon';
import { policyService } from '@/services/policy/api/policy.service';
import { Meta } from '@/types/page';
import { ListPolicyRequest, Policy } from '@/types/policy';

export const CustomerListView = () => {
  const { isMobileView, setLoading } = useScreen();
  const path = usePathname();
  const router = useRouter();
  const { user, handleResponseError, permissionList } = useAuth();
  const [isFilterDateModal, setIsFilterDateModal] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);
  const [currentSelectedDate, setCurrentSelectedDate] = useState('');
  const [inputPage, setInputPage] = useState<Meta>({
    page: 1,
    limit: 10,
    total: 0,
    pageTotal: 0,
  });
  const channel = user?.channel || undefined;
  const [listCustomer, setListCustomer] = useState<Policy[]>([]);
  const [isSelectedStartDateChange, setIsSelectedStartDateChange] = useState(false);
  const headerPage = getHeaderPage(2, path, true);
  const hasCreatePermission = permissionList.includes(
    `${capitalizeString(headerPage.breadcrumbsArray[0])}.${headerPage.pageName}.Create`,
  );

  const fetchPolicies = async (
    page: number,
    limit: number,
    from: string | null,
    to: string | null,
  ) => {
    try {
      setLoading(true);
      const params: ListPolicyRequest = {
        // status: filterPolicyData.filterStatus,
        // keyword: filterPolicyData.filterKeyword,
        from,
        to,
        limit,
        page,
        channel,
      };
      const response: any = await policyService.getPolicies(params as any);
      if (response) {
        // setInputPage(response.data.total);
        setListCustomer(response.data);
        setInputPage((prevState: Meta) => ({
          ...prevState,
          pageTotal: response.pageTotal,
          total: response.total,
        }));
        // setLocalStorage("filterPolicyData", filterPolicyData);
      }
    } catch (error: any) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isFilterDateModal)
      fetchPolicies(inputPage.page, inputPage.limit, selectedStartDate, selectedEndDate)
        .then()
        .catch();
  }, [inputPage.page, inputPage.limit, isFilterDateModal]);

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

  const goToCreateCustomerPage = () => router.push(`${path}/add`);

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
          {hasCreatePermission && (
            <Box className="w-auto  mr-0 mb-3 lg:mb-0">
              <Button
                additionalClassName={`w-full lg:w-fit justify-center lg:justify-between ${hasCreatePermission && 'mr-0 lg:mr-3 mb-3 lg:mb-0'}`}
                onClick={() => goToCreateCustomerPage()}
                withIcon={true}
              >
                {AddIcon('#000')}
                <Box as="span" className="ml-1">
                  Add Customer
                </Box>
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {listCustomer.length > 0 ? (
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
                    No. Polis
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
                    Phone Number
                  </Box>
                  <Box
                    as="th"
                    className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </Box>
                  <Box
                    as="th"
                    className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Brand Gadget
                  </Box>
                  <Box
                    as="th"
                    className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Type Gadget
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
                    Imei/Serial Number
                  </Box>
                  <Box
                    as="th"
                    className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Transaction ID
                  </Box>
                  <Box
                    as="th"
                    className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Currency
                  </Box>
                </Box>
              </Box>
              <Box as="tbody" className="bg-white divide-y divide-gray-200">
                {listCustomer.map((customer: Policy, index: number) => (
                  <Box as="tr" className="hover:bg-gray-50" key={customer.id || index}>
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {(inputPage.page - 1) * inputPage.limit + index + 1}
                    </Box>
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {customer.participants.length > 0
                        ? customer.participants[0].data['nomor_polis']
                        : 'N/A'}
                    </Box>
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {customer.policy_holder ? customer.policy_holder.name : 'N/A'}
                    </Box>
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {customer.policy_holder ? customer.policy_holder.phone : 'N/A'}
                    </Box>
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {customer.policy_holder ? customer.policy_holder.email : 'N/A'}
                    </Box>
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {customer.participants.length > 0
                        ? customer.participants[0].data['brand_gadget']
                        : 'N/A'}
                    </Box>
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {customer.participants.length > 0
                        ? customer.participants[0].data['type_gadget']
                        : 'N/A'}
                    </Box>
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {customer.number ? customer.number : 'N/A'}
                    </Box>
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {customer.participants.length > 0
                        ? customer.participants[0].data['imei/serial_number']
                        : 'N/A'}
                    </Box>
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {customer.participants.length > 0
                        ? customer.participants[0].data['transaction_id']
                        : 'N/A'}
                    </Box>
                    <Box
                      as="td"
                      className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-center"
                    >
                      IDr
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
            text="No Customer data available"
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
