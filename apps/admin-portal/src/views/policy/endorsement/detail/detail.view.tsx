'use client';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, Download } from 'react-feather';
import * as XLSX from 'xlsx';

import { Box } from '@repo/ui';

import Button from '@/components/button';
import AlertCircleIcon from '@/components/icons/alert-circle-icon';
import Modal from '@/components/modal';
import TextArea from '@/components/textarea';
import { primary } from '@/constants/app-common.const';
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import {
  capitalizeString,
  getBreadcrumbs,
  getHeaderPage,
  toastNotification,
} from '@/helpers/app.helper';
import { policyService } from '@/services/policy/api/policy.service';
import { EndorsementDetailRawMembership } from '@/types/endorsement';

export const EndorsementDetailView = () => {
  const router = useRouter();
  const path = usePathname();
  const { breadcrumbsArray } = getHeaderPage(3, path, false);
  const { id } = useParams();

  const [tableData, setTableData] = useState<EndorsementDetailRawMembership[]>([]);
  const [insuranceName, setInsuranceName] = useState('-');
  const [planName, setPlanName] = useState('-');
  const [customerName, setCustomerName] = useState('-');
  const [phoneNumber, setPhoneNumber] = useState('-');
  const [email, setEmail] = useState('-');
  const [type, setType] = useState('-');
  const [status, setStatus] = useState('-');
  const [verifiedBy, setVerifiedBy] = useState('-');
  const [reason, setReason] = useState('-');
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const { setLoading } = useScreen();
  const { handleResponseError, user } = useAuth();

  const isUserInsurer = user?.role === 'Insurer';

  const handleDownloadBtn = async () => {
    try {
      setLoading(true);

      const data: any = await policyService.getEndorsementById(id as string);

      const exportData = data.endorsements_detail.map((item, index) => ({
        No: index + 1,
        'Policy Number': item.data.profile.policy_number || '-',
        'Subsidiary / Entity': item.data.profile.subsidiary || '-',
        'Employee ID': item.data.profile.employee_id || '-',
        'Employee Name': item.data.profile.employee_name || '-',
        'Member Name': item.data.profile.member_name || '-',
        Gender: item.data.profile.gender || '-',
        'Date of Birth': item.data.profile.date_of_birth || '-',
        'Member Status': item.data.profile.member_status || '-',
        'Marital Status': item.data.profile.marital_status || '-',
        Plan: item.data.profile.plan || '-',
        'Effective Date': item.data.profile.effective_date || '-',
        Remarks: item.data.profile.remarks || '-',
        'Bank Name': item.data.profile.bank_name || '-',
        Branch: item.data.profile.branch || '-',
        'Bank Account Number': item.data.profile.bank_account_number || '-',
        'Bank Account Name': item.data.profile.bank_account_name || '-',
        Email: item.data.profile.email || '-',
        'Approval Date': item.data.profile.submission_date || '-',
        Status: capitalizeString(item.endorsements.status || '-'),
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Endorsement Data');
      XLSX.writeFile(workbook, 'endorsement_detail.xlsx');
    } catch (error) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const membershipStatusColor = (status: string) => {
    if (status.toLowerCase() === 'pending') return '#CC9B36';
    if (status.toLowerCase() === 'inactive') return '#939597';
    return primary;
  };

  const fetchEndorsementDetail = async () => {
    try {
      setLoading(true);
      const data: any = await policyService.getEndorsementById(id as string);

      setTableData(data.endorsements_detail);

      const profile = data.endorsements_detail?.[0]?.data.profile || {};
      const policyHolder: any = data.policies.policy_holders || {};
      const planData = data.policies.policy_products?.[0]?.plan_data || {};
      const insuranceName = data.insurance?.name;

      setPlanName(profile.plan || '-');
      setCustomerName(policyHolder.name || '-');
      setPhoneNumber(policyHolder.phone || '-');
      setEmail(policyHolder.email || '-');
      setStatus(data.status || '-');
      setReason(data.note || '-');
      setInsuranceName(insuranceName || planData.name || '-');
      setType(data.type || '-');
      setVerifiedBy(data.status_description || '-');
    } catch (error) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.role) return;
    fetchEndorsementDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAccept = async () => {
    try {
      setLoading(true);
      await policyService.updateEndorsementStatusBulking(id as string, {
        status: 'Approved',
        is_send_email_to_third_party: true,
      });
      toastNotification('Endorsement approved!', 'success');
      await fetchEndorsementDetail();
    } catch (error) {
      toastNotification('Failed to approve endorsement.', 'error');
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const checkDiff = (current?: any, original?: any) => {
    if (!current && !original) return false;
    return current?.toString().trim() !== original?.toString().trim();
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      await policyService.updateEndorsementStatusBulking(id as string, {
        status: 'Rejected',
        note: rejectReason,
        is_send_email_to_third_party: false,
      });
      toastNotification('Endorsement rejected!', 'success');
      await fetchEndorsementDetail();
      setShowModal(false);
      setRejectReason('');
    } catch (error) {
      toastNotification('Failed to reject endorsement.', 'error');
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const getVerificator = (description: string) => {
    if (!description) return '-';

    const byIndex = description.toLowerCase().indexOf('by ');
    console.log('by index', byIndex);
    if (byIndex === -1) return '-';

    const name = description.slice(byIndex + 3).trim();

    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const thClass =
    'px-6 py-6 text-left text-base font-semibold text-gray-500 tracking-wider whitespace-nowrap';
  const tdClass = 'px-6 py-3 text-sm text-gray-500 whitespace-nowrap';
  const stickySubmissionClass =
    'sticky right-[100px] bg-white z-30 w-[120px] shadow-[inset_8px_0_8px_-6px_rgba(0,0,0,0.1)]';
  const stickyStatusClass = 'sticky right-0 bg-white z-40 w-[120px]';

  const getCellClass = (current: any, original: any) => {
    return `${tdClass} ${checkDiff(current, original) ? 'bg-yellow-50' : ''}`;
  };

  return (
    <>
      <Box className="bg-white overflow-x-auto sm:scrollable flex items-center justify-between py-5 px-16">
        <Box>
          {getBreadcrumbs(breadcrumbsArray)}
          <Box as="p" className="font-bold text-2xl mt-0">
            Detail Endorsement
          </Box>
        </Box>
        <Box
          onClick={() => router.back()}
          className="flex items-center justify-between cursor-pointer"
        >
          <ChevronLeft color="red" width="30" height="15" />
          <Box as="p" className="text-sm text-red-500 ml-1">
            Kembali
          </Box>
        </Box>
      </Box>

      <Box className="py-6 px-8">
        <Box className="bg-white rounded-xl p-6">
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            <Box>
              <Box as="p" className="font-bold mb-4">
                Insurance Detail
              </Box>
              <Box className="grid grid-cols-[auto_10px_1fr] gap-y-4">
                <Box className="pr-4">Insurance Name</Box>
                <Box>:</Box>
                <Box className="pl-4">{insuranceName}</Box>

                <Box className="pr-4">Plan Name</Box>
                <Box>:</Box>
                <Box className="pl-4">{planName}</Box>
              </Box>
            </Box>

            <Box>
              <Box as="p" className="font-bold mb-4">
                Policy Holder Information
              </Box>
              <Box className="grid grid-cols-[auto_10px_1fr] gap-y-4">
                <Box className="pr-4">Customer Name</Box>
                <Box>:</Box>
                <Box className="pl-4">{customerName}</Box>

                <Box className="pr-4">Phone Number</Box>
                <Box>:</Box>
                <Box className="pl-4">{phoneNumber}</Box>

                <Box className="pr-4">Email</Box>
                <Box>:</Box>
                <Box className="pl-4">{email}</Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box className="py-6 px-8">
        <Box className="bg-white rounded-xl p-6">
          <Box>
            <Box as="p" className="font-semibold mb-4">
              Update Verification
            </Box>
            <Box className="grid grid-cols-[auto_10px_1fr] gap-y-3 flex items-center">
              <Box className="pr-4">Type</Box>
              <Box>:</Box>
              <Box className="pl-4">{type}</Box>

              <Box className="pr-4">Status</Box>
              <Box>:</Box>
              <Box className="pl-4">
                {isUserInsurer && status === 'Pending' ? (
                  <Box className="flex gap-4">
                    <Button variant="warning" onClick={handleAccept}>
                      Accept
                    </Button>
                    <Button variant="danger" onClick={() => setShowModal(true)}>
                      Reject
                    </Button>
                  </Box>
                ) : (
                  status
                )}
              </Box>

              <Box className="pr-4">Verified By</Box>
              <Box>:</Box>
              <Box className="pl-4">{getVerificator(verifiedBy)}</Box>

              <Box className="pr-4">Reason</Box>
              <Box>:</Box>
              <Box className="pl-4">{reason}</Box>
            </Box>
          </Box>

          <Box className="w-full h-px bg-[#EEEEEF] my-6" />

          <Box>
            <Box className="flex items-center justify-between mb-4">
              <Box as="p" className="font-bold">
                Data Endorsement
              </Box>
              <Box
                as="button"
                className="flex items-center px-3 py-3 text-sm rounded-full hover:opacity-80 border border-[#252528] text-[#252528]"
                onClick={handleDownloadBtn}
              >
                <Download className="w-4 h-4 mr-2" /> Download
              </Box>
            </Box>

            <Box style={{ minHeight: '60vh' }} className="overflow-x-auto">
              <Box className="min-w-full pr-[140px]">
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
                    </Box>
                  </Box>
                  <Box as="tbody" className="bg-white divide-y divide-gray-200">
                    {tableData.map((item, index) => {
                      const current = item.data.profile;
                      const original = item.insured_parties?.profile || {};
                      return (
                        <Box as="tr" key={`${index}-${item.id}`}>
                          <Box as="td" className={tdClass}>
                            {index + 1}
                          </Box>
                          <Box
                            as="td"
                            className={getCellClass(current.policy_number, original.policy_number)}
                          >
                            {current.policy_number || '-'}
                          </Box>
                          <Box
                            as="td"
                            className={getCellClass(current.subsidiary, original.subsidiary)}
                          >
                            {current.subsidiary || '-'}
                          </Box>
                          <Box
                            as="td"
                            className={getCellClass(current.employee_id, original.employee_id)}
                          >
                            {current.employee_id || '-'}
                          </Box>
                          <Box
                            as="td"
                            className={getCellClass(current.employee_name, original.employee_name)}
                          >
                            {current.employee_name || '-'}
                          </Box>
                          <Box
                            as="td"
                            className={getCellClass(current.member_name, original.member_name)}
                          >
                            {current.member_name || '-'}
                          </Box>
                          <Box as="td" className={getCellClass(current.gender, original.gender)}>
                            {current.gender || '-'}
                          </Box>
                          <Box
                            as="td"
                            className={getCellClass(current.date_of_birth, original.date_of_birth)}
                          >
                            {current.date_of_birth || '-'}
                          </Box>
                          <Box
                            as="td"
                            className={getCellClass(current.member_status, original.member_status)}
                          >
                            {current.member_status || '-'}
                          </Box>
                          <Box
                            as="td"
                            className={getCellClass(
                              current.marital_status,
                              original.marital_status,
                            )}
                          >
                            {current.marital_status || '-'}
                          </Box>
                          <Box as="td" className={getCellClass(current.plan, original.plan)}>
                            {current.plan || '-'}
                          </Box>
                          <Box
                            as="td"
                            className={getCellClass(
                              current.effective_date,
                              original.effective_date,
                            )}
                          >
                            {current.effective_date || '-'}
                          </Box>
                          <Box as="td" className={getCellClass(current.remarks, original.remarks)}>
                            {current.remarks || '-'}
                          </Box>
                          <Box
                            as="td"
                            className={getCellClass(current.bank_name, original.bank_name)}
                          >
                            {current.bank_name || '-'}
                          </Box>
                          <Box as="td" className={getCellClass(current.branch, original.branch)}>
                            {current.branch || '-'}
                          </Box>
                          <Box
                            as="td"
                            className={getCellClass(
                              current.bank_account_number,
                              original.bank_account_number,
                            )}
                          >
                            {current.bank_account_number || '-'}
                          </Box>
                          <Box
                            as="td"
                            className={getCellClass(
                              current.bank_account_name,
                              original.bank_account_name,
                            )}
                          >
                            {current.bank_account_name || '-'}
                          </Box>
                          <Box as="td" className={getCellClass(current.email, original.email)}>
                            {current.email || '-'}
                          </Box>
                          <Box
                            as="td"
                            className={`${getCellClass(current.submission_date, original.submission_date)} ${stickySubmissionClass}`}
                          >
                            {current.submission_date || item.endorsements.updated_at || '-'}
                          </Box>
                          <Box
                            as="td"
                            className={`${tdClass} ${stickyStatusClass}`}
                            style={{ color: membershipStatusColor(item.endorsements.status) }}
                          >
                            {capitalizeString(item.endorsements.status)}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        widthClassName="w-[550px]"
        heightClassName="min-h-[118px]"
      >
        <Box className="flex flex-col items-center py-2 gap-4">
          {AlertCircleIcon(undefined, '88', '88', '0 0 24 24')}
          <Box as="p" className="text-base font-semibold">
            Reject updated data?
          </Box>
          <Box className="w-full">
            <Box as="p" className="text-sm font-medium self-start mb-1.5">
              Reason
            </Box>
            <TextArea
              value={rejectReason}
              placeholder="Insert reason"
              onChange={(value) => setRejectReason(value)}
              height="h-[118px]"
            />
          </Box>
          <Box className="flex flex-row gap-4">
            <Button variant="danger" onClick={() => setShowModal(false)}>
              No
            </Button>
            <Button variant="warning" onClick={() => handleReject()}>
              Yes
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
