'use client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Download } from 'react-feather';
import * as XLSX from 'xlsx';

import { Box } from '@repo/ui';

import Button from '@/components/button';
import Input from '@/components/input';
import NotFound from '@/components/not-found';
import Pagination from '@/components/pagination';
import Select from '@/components/select';
import { primary } from '@/constants/app-common.const';
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import { capitalizeString, getHeaderPage, getPaddingClass } from '@/helpers/app.helper';
import searchIcon from '@/images/search.icon';
import { policyService } from '@/services/policy/api/policy.service';
import { MembershipItem, mapMembershipResponse } from '@/types/membership';

export const MembershipListView = () => {
  const [searchData, setSearchData] = useState('');
  const [tab, setTab] = useState('All');
  const [tableData, setTableData] = useState<MembershipItem[]>([]);
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

  const membershipStatusOptions = [
    { label: 'All Member', value: 'All' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
  ];

  const fetchMasterPolicy = async () => {
    try {
      setLoading(true);
      if (!user?.channel) return;
      const result: any = await policyService.getMasterPoliciesByChannel(user.channel);
      const id = result?.id || result?.data?.id;
      setMasterPolicyId(id);
    } catch (error) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembership = async () => {
    if (!masterPolicyId) return;
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        master_policy: masterPolicyId,
        keyword: searchData,
        isFromBulking: true,
        status: tab === 'All' ? undefined : tab,
      };
      const result: any = await policyService.getInsuredParties(params as any);
      const { data, total, page } = result || {};

      setTableData(mapMembershipResponse(data || []));
      setTotalData(total || 0);
      setCurrentPage(page || currentPage);

      if (data.length > 0) setHasFetchedDataOnce(true);
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
    if (masterPolicyId) {
      fetchMembership();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterPolicyId, tab, currentPage, itemsPerPage, searchData]);

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    setCurrentPage(1);
  };

  const membershipStatusColor = (status: string) => {
    if (status.toLowerCase() === 'pending') return '#CC9B36';
    if (status.toLowerCase() === 'inactive') return '#939597';
    return primary;
  };

  const handleDownloadBtn = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 100,
        master_policy: masterPolicyId,
        keyword: searchData,
        status: tab === 'All' ? undefined : tab,
      };
      const result: any = await policyService.getInsuredParties(params as any);
      const exportData = mapMembershipResponse(result?.data || []).map((item, index) => ({
        No: index + 1,
        'Policy Number': item.policyNumber,
        'Subsidiary / Entity': item.subsidiary,
        'Employee ID': item.employeeId,
        'Employee Name': item.employeeName,
        'Member Name': item.memberName,
        Gender: item.gender,
        'Date of Birth': item.dob,
        'Member Status': item.memberStatus,
        'Marital Status': item.maritalStatus,
        Plan: item.plan,
        'Effective Date': item.effectiveDate,
        Remarks: item.remarks,
        'Bank Name': item.bankName,
        Branch: item.branch,
        'Bank Account Number': item.bankAccountNumber,
        'Bank Account Name': item.bankAccountName,
        Email: item.email,
        'Submission Date': item.submissionDate,
        Status: capitalizeString(item.status),
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Membership Data');
      XLSX.writeFile(workbook, 'membership_list.xlsx');
    } catch (error) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDetail = (endorsementId: string) => {
    router.push(`detail/${endorsementId}`);
  };

  const thClass =
    'px-6 py-6 text-left text-base font-semibold text-gray-500 tracking-wider whitespace-nowrap';
  const tdClass = 'px-6 py-3 text-sm text-gray-500 whitespace-nowrap';
  const stickySubmissionClass =
    'sticky right-[200px] bg-white z-30 w-[120px] shadow-[inset_8px_0_8px_-6px_rgba(0,0,0,0.1)]';
  const stickyStatusClass = 'sticky right-[100px] bg-white z-40 w-[120px]';
  const stickyActionClass = 'sticky right-0 bg-white z-50 w-[120px]';

  return (
    <Box className="mx-auto py-5 px-7">
      <Box className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
        <Box as="p" className={`font-bold text-lg ${isMobileView && 'mb-2'}`}>
          {headerPage.pageName}
        </Box>
        <Box
          as="button"
          disabled={tableData.length === 0}
          className={`flex items-center px-3 py-3 text-sm rounded-full hover:opacity-80 border text-white text-sm bg-primary ${
            tableData.length === 0 && 'cursor-not-allowed'
          }`}
          onClick={handleDownloadBtn}
        >
          <Download className="w-4 h-4 mr-2" /> Download
        </Box>
      </Box>

      {isMobileView ? (
        <Select
          additionalClassNameSelect="pl-4 shadow mb-3 h-[46px]"
          withBorder={false}
          value={tab}
          onChange={(event) => handleTabChange(event.toString())}
          options={membershipStatusOptions}
        />
      ) : (
        <Box className="overflow-x-auto sm:scrollable text-center flex items-center justify-start h-16 bg-white rounded-md mb-3 shadow">
          {membershipStatusOptions.map((status, index) => (
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
              placeholder="Cari member"
              icon={searchIcon()}
              withBorder={false}
            />
          </Box>
        )}

        {tableData.length > 0 ? (
          <>
            <Box style={{ minHeight: '60vh' }} className="overflow-x-auto">
              <Box className="min-w-full pr-[360px]">
                <Box as="table" className="w-full divide-y divide-gray-200">
                  <Box as="thead" className="bg-white">
                    <Box as="tr">
                      <Box as="th" className={thClass}>
                        No.
                      </Box>
                      <Box as="th" className={thClass}>
                        Policy Number
                      </Box>
                      <Box as="th" className={thClass}>
                        Subsidiary / Entity
                      </Box>
                      <Box as="th" className={thClass}>
                        Employee ID
                      </Box>
                      <Box as="th" className={thClass}>
                        Employee Name
                      </Box>
                      <Box as="th" className={thClass}>
                        Member Name
                      </Box>
                      <Box as="th" className={thClass}>
                        Gender
                      </Box>
                      <Box as="th" className={thClass}>
                        Date of Birth
                      </Box>
                      <Box as="th" className={thClass}>
                        Member Status
                      </Box>
                      <Box as="th" className={thClass}>
                        Marital Status
                      </Box>
                      <Box as="th" className={thClass}>
                        Plan
                      </Box>
                      <Box as="th" className={thClass}>
                        Effective Date
                      </Box>
                      <Box as="th" className={thClass}>
                        Remarks
                      </Box>
                      <Box as="th" className={thClass}>
                        Bank Name
                      </Box>
                      <Box as="th" className={thClass}>
                        Branch
                      </Box>
                      <Box as="th" className={thClass}>
                        Bank Account Number
                      </Box>
                      <Box as="th" className={thClass}>
                        Bank Account Name
                      </Box>
                      <Box as="th" className={thClass}>
                        Email
                      </Box>
                      <Box as="th" className={`${thClass} ${stickySubmissionClass}`}>
                        Submission Date
                      </Box>
                      <Box as="th" className={`${thClass} ${stickyStatusClass}`}>
                        Status
                      </Box>
                      <Box as="th" className={`${thClass} ${stickyActionClass}`}>
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
                          {data.policyNumber}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {data.subsidiary}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {data.employeeId}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {data.employeeName}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {data.memberName}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {data.gender}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {data.dob}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {data.memberStatus}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {data.maritalStatus}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {data.plan}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {data.effectiveDate}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {data.remarks}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {data.bankName}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {data.branch}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {data.bankAccountNumber}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {data.bankAccountName}
                        </Box>
                        <Box as="td" className={tdClass}>
                          {data.email}
                        </Box>
                        <Box as="td" className={`${tdClass} ${stickySubmissionClass}`}>
                          {data.submissionDate}
                        </Box>
                        <Box
                          as="td"
                          className={`${tdClass} ${stickyStatusClass}`}
                          style={{ color: membershipStatusColor(data.status) }}
                        >
                          {capitalizeString(data.status)}
                        </Box>
                        <Box as="td" className={`${tdClass} ${stickyActionClass}`}>
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
              text="No membership data available"
              textClassName={isMobileView && 'text-xs'}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
