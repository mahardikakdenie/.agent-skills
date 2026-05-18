'use client';
import moment from 'moment';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Box } from '@repo/ui';

import Button from '@/components/button';
import Input from '@/components/input';
import NotFound from '@/components/not-found';
import Pagination from '@/components/pagination';
import Select from '@/components/select';
import { primary, primaryRed } from '@/constants/app-common.const';
import AppURL from '@/constants/app-url.const';
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import { capitalizeString, getHeaderPage, getPaddingClass } from '@/helpers/app.helper';
import searchIcon from '@/images/search.icon';
import UploadIcon from '@/images/upload.icon';
import { policyService } from '@/services/policy/api/policy.service';
import { EndorsementItem } from '@/types/endorsement';

export const EndorsementListView = () => {
  const [searchData, setSearchData] = useState('');
  const [tab, setTab] = useState('All');
  const [tableData, setTableData] = useState<EndorsementItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalData, setTotalData] = useState(0);
  const [masterPolicyId, setMasterPolicyId] = useState<string | null>(null);
  const [hasFetchedDataOnce, setHasFetchedDataOnce] = useState(false);

  const path = usePathname();
  const { isMobileView, setLoading } = useScreen();
  const { handleResponseError, user } = useAuth();
  const headerPage = getHeaderPage(2, path, true);
  const router = useRouter();
  const isUserInsurer = user?.role === 'Insurer';

  const endorsementStatus = [
    { label: 'All Endorsement', value: 'All' },
    { label: 'Waiting', value: 'Pending' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Reject', value: 'Rejected' },
  ];
  const [endorsementStatusOptions] = useState(endorsementStatus);

  const fetchMasterPolicy = async () => {
    try {
      setLoading(true);
      if (!user?.channel) return;
      const result: any = await policyService.getMasterPoliciesByChannel(user.channel);
      setMasterPolicyId(result?.id || result?.data?.id || null);
    } catch (error) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEndorsement = async () => {
    if (!masterPolicyId) return;
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        policy: masterPolicyId,
        is_bulking: true,
        status: tab === 'All' ? undefined : tab,
        keyword: searchData,
      };
      const result: any = await policyService.getEndorsements(params as any);
      const { data, total, page } = result || {};
      setTableData(data || []);
      setTotalData(total || 0);
      setCurrentPage(page || currentPage);

      if ((data || []).length > 0) setHasFetchedDataOnce(true);
    } catch (error) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterPolicy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (masterPolicyId) fetchEndorsement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterPolicyId, tab, currentPage, itemsPerPage, searchData]);

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    setCurrentPage(1);
  };

  const endorsementStatusColor = (status: string) => {
    if (status.toLowerCase() === 'pending') return '#CC9B36';
    else if (status.toLowerCase() === 'rejected') return primaryRed;
    else return primary;
  };

  const handleUploadBtn = () => {
    router.push(AppURL.endorsementUpload);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return moment(dateString).format('DD / MM / YYYY');
  };

  const getVerificator = (description: string) => {
    if (!description) return '-';
    const byIndex = description.toLowerCase().indexOf('by ');
    if (byIndex === -1) return '-';
    const name = description.slice(byIndex + 3).trim();
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const handleGoToDetail = (endorsementId: string) => {
    router.push(`detail/${endorsementId}`);
  };

  const thClass =
    'px-6 py-6 text-left text-base font-semibold text-gray-500 tracking-wider whitespace-nowrap';
  const tdClass = 'px-6 py-3 text-sm text-gray-500 whitespace-nowrap';

  return (
    <Box className="mx-auto py-5 px-7">
      <Box className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5 gap-3">
        <Box
          as="p"
          className={`font-bold text-lg ${isMobileView && 'mb-2'}`}
        >{`${headerPage.pageName} List`}</Box>
        {!isUserInsurer && (
          <Button
            additionalClassName="w-full lg:w-fit justify-center lg:justify-between"
            onClick={handleUploadBtn}
            withIcon={true}
          >
            {UploadIcon('#FFF', '16', '17', '0 0 24 24')}
            <Box as="span" className="ml-1">
              Upload
            </Box>
          </Button>
        )}
      </Box>

      {isMobileView ? (
        <Select
          additionalClassNameSelect="pl-4 shadow mb-3 h-[46px]"
          withBorder={false}
          value={tab}
          onChange={(event) => handleTabChange(event.toString())}
          options={endorsementStatusOptions}
        />
      ) : (
        <Box className="overflow-x-auto sm:scrollable text-center flex items-center justify-start h-16 bg-white rounded-md mb-3 shadow">
          {endorsementStatusOptions.map((status, index) => (
            <Box
              key={`tab-${status.value}-${index}`}
              onClick={() => handleTabChange(status.value)}
              className={`cursor-pointer h-full flex items-center justify-center px-5 ${tab === status.value && 'border-b-[3px] border-primary'}`}
            >
              <Box
                as="p"
                className={`truncate-2-lines text-sm mr-3 ${tab === status.value && 'font-semibold text-primary'}`}
              >
                {status.label}
              </Box>
              <Box
                as="p"
                className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${getPaddingClass(totalData)} ${tab !== status.value && 'hidden'}`}
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

      <Box className="relative bg-white rounded-md shadow-md w-full">
        {(hasFetchedDataOnce || tableData.length > 0) && (
          <Box className="flex py-4 px-6 min-w-full">
            <Input
              key={tab}
              value={searchData}
              onChange={(value) => setSearchData(value.toString())}
              onEnter={(value) => setSearchData(value.toString())}
              onClear={() => setSearchData('')}
              placeholder="Search by Request ID"
              icon={searchIcon()}
              withBorder={false}
            />
          </Box>
        )}

        {tableData.length > 0 ? (
          <>
            <Box style={{ minHeight: '60vh' }} className="overflow-x-auto">
              <Box className="min-w-full">
                <Box as="table" className="w-full divide-y divide-gray-200">
                  <Box as="thead" className="bg-white">
                    <Box as="tr">
                      <Box as="th" className={thClass}>
                        No.
                      </Box>
                      <Box as="th" className={thClass}>
                        Request ID
                      </Box>
                      <Box as="th" className={thClass}>
                        Insured Name
                      </Box>
                      <Box as="th" className={thClass}>
                        Policy Number
                      </Box>
                      <Box as="th" className={thClass}>
                        Request Date
                      </Box>
                      <Box as="th" className={thClass}>
                        Approve/Rejected Date
                      </Box>
                      <Box as="th" className={thClass}>
                        Type
                      </Box>
                      <Box as="th" className={thClass}>
                        Status
                      </Box>
                      <Box as="th" className={thClass}>
                        Verified By
                      </Box>
                      <Box as="th" className={thClass}>
                        Action
                      </Box>
                    </Box>
                  </Box>
                  <Box as="tbody" className="bg-white divide-y divide-gray-200">
                    {tableData.map((data, index) => (
                      <Box as="tr" key={`${index}-${data.id}`}>
                        <Box as="td" className={tdClass}>
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {data.number || '-'}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {data.policies?.policy_holders?.name || '-'}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {data.policies?.number || '-'}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {formatDate(data.created_at) || '-'}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {(data.status !== 'Pending' && formatDate(data.updated_at)) || '-'}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {data.type || '-'}
                        </Box>
                        <Box
                          as="td"
                          className={tdClass}
                          style={{ color: endorsementStatusColor(data.status) }}
                        >
                          {capitalizeString(data.status) || '-'}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {getVerificator(data.status_description) || '-'}
                        </Box>
                        <Box as="td" className={tdClass}>
                          <Button onClick={() => handleGoToDetail(data.id)}>View</Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box className="bottom-0 left-0 right-0 bg-white py-2 px-4 border-t border-t-gray-200">
              <Pagination
                totalData={totalData}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </Box>
          </>
        ) : (
          <Box style={{ minHeight: '60vh' }} className="flex items-center justify-center">
            <NotFound
              width={isMobileView && '143'}
              height={isMobileView && '144'}
              size1={isMobileView && '143'}
              size3={isMobileView && '95'}
              viewBox={isMobileView && '0 0 70 70'}
              text="No endorsement data available"
              textClassName={isMobileView && 'text-xs'}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
