'use client';

import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

import { Box, Card, CardHeader, CardTitle, CardContent, Badge } from '@repo/ui';

import { PageHeader } from '@/components/core/page-header';
import { ContentLoadingWrapper } from '@/components/core/loading';
import AppURL from '@/constants/app-url.const';
import { useMembershipDetail } from '@/hooks/useMembershipDetail.hooks';

export default function DetailMembership() {
  const params = useParams();
  const idParam = params.id;
  const id = typeof idParam === 'string' ? idParam : Array.isArray(idParam) ? idParam[0] : '';

  const { membershipDetail, isLoading, formatLabel, getMembershipDetail } = useMembershipDetail();

  useEffect(() => {
    if (id) {
      getMembershipDetail(id);
    }
  }, [id, getMembershipDetail]);

  const breadcrumbs = [
    { label: 'Membership', href: AppURL.membershipList },
    { label: 'Detail', isCurrentPage: true },
  ];

  const getBadgeTone = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Inactive':
        return 'secondary';
      default:
        return 'warning';
    }
  };

  return (
    <ContentLoadingWrapper isLoading={isLoading}>
      <Box className="flex flex-col w-full">
        <PageHeader title="Detail Membership" breadcrumbs={breadcrumbs} showBackButton={true} />

        <Box className="flex flex-col w-full p-4 md:p-6 gap-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold tracking-tight">
                Policy Holder Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Box as="dl" className="flex flex-col gap-3.5">
                <Box className="flex gap-2 text-sm">
                  <Box as="dt" className="min-w-[160px] font-medium text-muted-foreground">
                    Policy Number
                  </Box>
                  <Box className="w-4 text-muted-foreground">:</Box>
                  <Box as="dd" className="font-semibold text-foreground">
                    {membershipDetail?.number || '—'}
                  </Box>
                </Box>

                <Box className="flex gap-2 text-sm">
                  <Box as="dt" className="min-w-[160px] font-medium text-muted-foreground">
                    Customer Name
                  </Box>
                  <Box className="w-4 text-muted-foreground">:</Box>
                  <Box as="dd" className="font-semibold text-foreground">
                    {membershipDetail?.policies?.policy_holders?.name || '—'}
                  </Box>
                </Box>

                <Box className="flex gap-2 text-sm">
                  <Box as="dt" className="min-w-[160px] font-medium text-muted-foreground">
                    Phone Number
                  </Box>
                  <Box className="w-4 text-muted-foreground">:</Box>
                  <Box as="dd" className="font-semibold text-foreground">
                    {membershipDetail?.policies?.policy_holders?.phone || '—'}
                  </Box>
                </Box>

                <Box className="flex gap-2 text-sm">
                  <Box as="dt" className="min-w-[160px] font-medium text-muted-foreground">
                    Email
                  </Box>
                  <Box className="w-4 text-muted-foreground">:</Box>
                  <Box as="dd" className="font-semibold text-foreground">
                    {membershipDetail?.policies?.policy_holders?.email || '—'}
                  </Box>
                </Box>

                {membershipDetail?.status && (
                  <Box className="flex gap-2 text-sm">
                    <Box as="dt" className="min-w-[160px] font-medium text-muted-foreground">
                      Status
                    </Box>
                    <Box className="w-4 text-muted-foreground">:</Box>
                    <Box as="dd">
                      <Badge variant="solid" tone={getBadgeTone(membershipDetail.status)} size="sm">
                        {membershipDetail.status}
                      </Badge>
                    </Box>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          <Card className="h-fit max-h-full overflow-y-auto">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold tracking-tight">Insured Detail</CardTitle>
            </CardHeader>
            <CardContent>
              <Box className="flex flex-col lg:flex-row gap-8 lg:gap-24">
                {membershipDetail?.profile && (
                  <Box as="dl" className="flex flex-col gap-3.5 flex-1">
                    {Object.entries(membershipDetail.profile)
                      .filter(([, value]) => value !== null && value !== undefined && value !== '')
                      .map(([key, value], index) => (
                        <Box key={index} className="flex gap-2 text-sm">
                          <Box
                            as="dt"
                            className="min-w-[160px] font-medium text-muted-foreground capitalize"
                          >
                            {formatLabel(key)}
                          </Box>
                          <Box className="w-4 text-muted-foreground">:</Box>
                          <Box as="dd" className="font-semibold text-foreground">
                            {String(value)}
                          </Box>
                        </Box>
                      ))}
                  </Box>
                )}

                {membershipDetail?.other_info && (
                  <Box as="dl" className="flex flex-col gap-3.5 flex-1">
                    {Object.entries(membershipDetail.other_info)
                      .filter(
                        ([key, value]) =>
                          value !== null &&
                          value !== undefined &&
                          value !== '' &&
                          key !== 'email' &&
                          key !== 'gender',
                      )
                      .map(([key, value], index) => (
                        <Box key={index} className="flex gap-2 text-sm">
                          <Box
                            as="dt"
                            className="min-w-[160px] font-medium text-muted-foreground capitalize"
                          >
                            {formatLabel(key)}
                          </Box>
                          <Box className="w-4 text-muted-foreground">:</Box>
                          <Box as="dd" className="font-semibold text-foreground">
                            {String(value)}
                          </Box>
                        </Box>
                      ))}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </ContentLoadingWrapper>
  );
}
