import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { Box } from '@repo/ui';

import Button from '@/components/button';
import AlertCircleIcon from '@/components/icons/alert-circle-icon';
import Input from '@/components/input';
import Modal from '@/components/modal';
import NotFound from '@/components/not-found';
import Pagination from '@/components/pagination';
import Select from '@/components/select';
import { primary, primaryRed } from '@/constants/app-common.const';
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import {
  capitalizeStringWithChar,
  getHeaderPage,
  getPaddingClass,
  toastNotification,
} from '@/helpers/app.helper';
import AddIcon from '@/images/add.icon';
import searchIcon from '@/images/search.icon';
import TrashIcon from '@/images/trash.icon';
import { productService } from '@/services/product/api/product.service';

export const PlanListView = () => {
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [tab, setTab] = useState('');
  const [keywordPlan, setKeywordPlan] = useState('');
  const [isModalConfirmation, setIsModalConfirmation] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalData, setTotalData] = useState(0);
  const path = usePathname();
  const router = useRouter();
  const { isMobileView, setLoading } = useScreen();
  const { handleResponseError, user } = useAuth();
  const insurerId = user?.account_insurers[0]?.insurance;

  useEffect(() => {
    fetchCategories().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response: any = await productService.getCategories();
      if (response) {
        const list = response?.data || [];
        setCategoryList(
          list.map((item: any) => ({
            ...item,
            label: capitalizeStringWithChar(item.name),
            color: primary,
          })),
        );
        setCategoryOptions(
          list.map((item: any) => ({
            label: capitalizeStringWithChar(item.name),
            value: item.name,
          })),
        );
        setTab(list[0].name);
        fetchPlans(currentPage, itemsPerPage, list[0].name).then();
      }
    } catch (error: any) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async (
    page: number,
    limit: number,
    category: string,
    isClearKeyword: boolean = false,
  ) => {
    try {
      setLoading(true);
      const params = {
        insuranceId: insurerId,
        category,
        planName: isClearKeyword ? undefined : keywordPlan ? keywordPlan : undefined,
        pageSize: limit,
        page,
      };
      const response: any = await productService.getPlans(params as any);
      if (response) {
        setCurrentPage(page);
        setTotalData(response?.meta?.total || response?.total || 0);
        setData(response?.data || []);
      }
    } catch (error: any) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async () => {
    try {
      setLoading(true);
      const response: any = await productService.deletePlan(selectedPlan.id);
      if (response) {
        toastNotification('Plan deleted successfully!');
        toggleModalConfirmation();
        fetchPlans(currentPage, itemsPerPage, tab).then();
      }
    } catch (error: any) {
      toastNotification('Failed to delete plan!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    setCurrentPage(1);
    fetchPlans(1, itemsPerPage, newTab).then();
  };

  const handlePageChange = (newPage: number) => {
    fetchPlans(newPage, itemsPerPage, tab).then();
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    fetchPlans(1, newItemsPerPage, tab).then();
  };

  const searchPlan = () => fetchPlans(1, itemsPerPage, tab).then();

  const handleClearKeywordPlan = () => {
    setKeywordPlan('');
    fetchPlans(1, itemsPerPage, tab, true).then();
  };

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    toggleModalConfirmation();
  };

  const toggleModalConfirmation = () => setIsModalConfirmation(!isModalConfirmation);

  const addPlan = () => {
    router.push(`${path}/add`);
  };

  const goToDetail = (planId: string) => {
    router.push(`${path}/detail/${planId}`);
  };

  return (
    <Box className="mx-auto py-5 px-7">
      <Box className="overflow-x-auto sm:scrollable flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
        <Box as="p" className={`font-bold text-lg ${isMobileView && 'mb-2'}`}>
          {getHeaderPage(2, path, true).pageName}
        </Box>
        <Box className="flex flex-col lg:flex-row items-center justify-end">
          <Box className="w-full lg:w-80 mr-0 lg:mr-5 mb-3 lg:mb-0">
            <Input
              key={tab}
              value={keywordPlan}
              onChange={(value) => setKeywordPlan(value.toString())}
              onEnter={searchPlan}
              onClear={handleClearKeywordPlan}
              placeholder="Search"
              icon={searchIcon()}
              withBorder={false}
            />
          </Box>
          <Button
            additionalClassName="w-full lg:w-fit justify-center lg:justify-between"
            onClick={addPlan}
            withIcon={true}
          >
            {AddIcon('#FFF')}
            <Box as="span" className="text-white ml-1">
              Add plan
            </Box>
          </Button>
        </Box>
      </Box>
      {isMobileView ? (
        <Select
          additionalClassNameSelect="pl-4 shadow mb-3 h-[46px]"
          withBorder={false}
          value={tab}
          onChange={(event) => handleTabChange(event.toString())}
          options={categoryOptions}
        />
      ) : (
        <Box className="overflow-x-auto sm:scrollable text-center flex items-center justify-start h-16 bg-white rounded-md mb-3 shadow">
          {categoryList.map((cs, csIndex) => (
            <Box
              key={`tab-${cs.id}`}
              onClick={() => handleTabChange(cs.name)}
              style={{ width: `calc(100% / ${categoryList.length + 1})` }}
              className={`cursor-pointer h-full flex items-center justify-center ${csIndex === 0 && 'pl-5'} ${csIndex !== categoryList.length - 1 && 'mr-5'} ${tab === cs.name && 'border-b-[3px] border-primary'}`}
            >
              <Box
                as="p"
                className={`text-sm mr-3 ${tab === cs.name && 'font-semibold text-primary'}`}
              >
                {cs.label}
              </Box>
              <Box
                as="p"
                className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${getPaddingClass(totalData)} ${tab !== cs.name && 'hidden'}`}
              >
                {totalData > 99 ? 99 : totalData}
                {totalData > 99 && (
                  <Box as="span" style={{ fontSize: '10px' }}>
                    +
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}
      {data.length > 0 ? (
        <Box className="relative bg-white rounded-md shadow-md">
          <Box style={{ minHeight: '60vh' }} className="overflow-x-auto sm:scrollable">
            <Box as="table" className="min-w-full divide-y divide-gray-200">
              <Box as="thead" className="bg-white">
                <Box as="tr">
                  <Box
                    as="th"
                    className="w-1/12 px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    No.
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
                    Product
                  </Box>
                  <Box
                    as="th"
                    className="w-1/12 px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </Box>
                </Box>
              </Box>
              <Box as="tbody" className="bg-white divide-y divide-gray-200">
                {data.map((d, index) => (
                  <Box as="tr" key={`${index}-${d.id}`}>
                    <Box
                      as="td"
                      className="w-1/12 px-6 py-3 whitespace-nowrap text-sm text-gray-500"
                    >
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </Box>
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {d.name || '-'}
                    </Box>
                    <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {d.products?.name || '-'}
                    </Box>
                    <Box as="td" className="w-1/12 px-6 py-3 whitespace-nowrap text-sm font-medium">
                      <Box className="flex items-center">
                        <Button onClick={() => goToDetail(d.id)}>View</Button>
                        <Box onClick={() => handleSelectPlan(d)} className="ml-3 clickable">
                          {TrashIcon(primaryRed, '16', '16', '0 0 24 24')}
                        </Box>
                      </Box>
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
            text="No plan data available"
            textClassName={isMobileView && 'text-xs'}
          />
        </Box>
      )}
      <Modal
        widthClassName="w-full lg:w-[500px]"
        heightClassName="max-h-[70%] overflow-y-auto sm:scrollable lg:max-h-fit"
        isOpen={isModalConfirmation}
        onClose={toggleModalConfirmation}
      >
        <Box className="py-5">
          <Box className="flex items-center justify-center mb-3">
            {AlertCircleIcon(undefined, '70', '70', '0 0 24 24')}
          </Box>
          <Box as="h1" className="font-bold text-lg text-center mb-2">
            Are you sure?
          </Box>
          <Box as="p" className="text-center text-sm">
            Delete {selectedPlan.name} - {selectedPlan.products?.name}.
          </Box>
          <Box className="flex items-center justify-center text-center mt-4">
            <Button variant="danger" additionalClassName="mr-2" onClick={toggleModalConfirmation}>
              <Box as="span" className="mx-3.5">
                No
              </Box>
            </Button>
            <Button variant="warning" onClick={deletePlan}>
              <Box as="span" className="mx-3">
                Yes
              </Box>
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
