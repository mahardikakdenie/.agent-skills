'use client';
import { usePathname, useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'react-feather';

import { Box } from '@repo/ui';

import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import { getBreadcrumbs, getHeaderPage } from '@/helpers/app.helper';
import { policyService } from '@/services/policy/api/policy.service';

export const MembershipDetailView = () => {
  const path = usePathname();
  const { id: memberId } = useParams();
  const { breadcrumbsArray } = getHeaderPage(3, path, false);
  const { setLoading } = useScreen();
  const { handleResponseError } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<any>({});
  const [otherInfo, setOtherInfo] = useState<any>({});
  const [policyHolder, setPolicyHolder] = useState<any>({});
  const [status, setStatus] = useState<string>('-');

  useEffect(() => {
    fetchMembershipDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMembershipDetail = async () => {
    try {
      setLoading(true);
      if (!memberId) return;
      const response: any = await policyService.getInsuredPartyById(memberId.toString());
      const data = response?.data || response;

      setProfile(data.profile || {});
      setOtherInfo(data.other_info || {});
      setPolicyHolder(data.policies?.policy_holders || {});
      setStatus(data.status || '-');
    } catch (error) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const display = (value: any) => value || '-';

  const renderFieldRow = (label: string, value: any) => (
    <>
      <Box className="pr-4">{label}</Box>
      <Box>:</Box>
      <Box className="pl-4">{display(value)}</Box>
    </>
  );

  const policyHolderFields = [
    { label: 'Customer Name', value: policyHolder.name },
    { label: 'Phone Number', value: policyHolder.phone },
    { label: 'Email', value: policyHolder.email },
  ];

  const insuredFields = [
    { label: 'Name', value: profile.member_name },
    { label: 'Email', value: profile.email },
    { label: 'Gender', value: profile.gender },
    { label: 'Dob', value: profile.date_of_birth },
    { label: 'Insurance Name', value: otherInfo.corporate_name },
    { label: 'Plan Name', value: otherInfo.plan_id },
    { label: 'Policy Number', value: profile.policy_number },
    { label: 'Status', value: status },
    { label: 'TPA Member ID', value: otherInfo.tpa_member_id },
    { label: 'Bank Name', value: profile.bank_name },
    { label: 'Bank Account Number', value: profile.bank_account_number },
  ];

  return (
    <>
      <Box className="bg-white overflow-x-auto sm:scrollable flex items-center justify-between py-5 px-16">
        <Box>
          {getBreadcrumbs(breadcrumbsArray)}
          <Box as="p" className="font-bold text-2xl mt-0">
            Detail Membership
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
          <Box as="p" className="font-semibold mb-4">
            Policy Holder Information
          </Box>
          <Box className="grid grid-cols-[auto_10px_1fr] gap-y-3">
            {policyHolderFields.map((field, idx) => renderFieldRow(field.label, field.value))}
          </Box>
        </Box>
      </Box>

      <Box className="py-6 px-8">
        <Box className="bg-white rounded-xl p-6">
          <Box as="p" className="font-semibold mb-4">
            Insured Detail
          </Box>
          <Box className="grid grid-cols-[auto_10px_1fr] gap-y-3">
            {insuredFields.map((field, idx) => renderFieldRow(field.label, field.value))}
          </Box>
        </Box>
      </Box>
    </>
  );
};
