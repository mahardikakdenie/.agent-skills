import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'react-feather';

import { Box } from '@repo/ui';

import NotFound from '@/components/not-found';
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import {
  capitalizeStringWithChar,
  getBreadcrumbs,
  getHeaderPage,
  moneyFormatter,
} from '@/helpers/app.helper';
import { policyService } from '@/services/policy/api/policy.service';
import { Policy } from '@/types/policy';

export const PolicyDetailView = () => {
  const [data, setData] = useState<Policy>();
  const path = usePathname();
  const router = useRouter();
  const { id } = useParams();
  const { isMobileView, setLoading } = useScreen();
  const { handleResponseError } = useAuth();
  const { pageName, breadcrumbsArray } = getHeaderPage(3, path, false);

  useEffect(() => {
    const fetchDataPolicyDetail = async () => {
      try {
        setLoading(true);
        if (!id) return;
        const responsePolicyDetail: any = await policyService.getPolicyById(id.toString());
        if (responsePolicyDetail) setData(responsePolicyDetail);
      } catch (error: any) {
        handleResponseError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataPolicyDetail().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToPolicyListPage = () => {
    router.push(path.split('/').slice(0, -2).join('/'));
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
        <Box
          onClick={goToPolicyListPage}
          className="flex items-center justify-between cursor-pointer"
        >
          <ChevronLeft color="red" width="30" height="15" />
          <Box as="p" className="text-sm text-red-500">
            Back
          </Box>
        </Box>
      </Box>
      <Box className="pb-5 px-7">
        <Box className="overflow-x-auto sm:scrollable bg-white rounded-md mb-3 py-5 px-7 shadow">
          <Box as="p" className="font-semibold mb-3">
            Policy Holder Information
          </Box>
          <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
            <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
              Customer Name
            </Box>
            <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
              <Box as="p" className="hidden lg:block lg:mr-2">
                :
              </Box>
              <Box as="p">{data?.policy_holder?.name || '-'}</Box>
            </Box>
          </Box>
          <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
            <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
              Phone Number
            </Box>
            <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
              <Box as="p" className="hidden lg:block lg:mr-2">
                :
              </Box>
              <Box as="p">{data?.policy_holder?.phone || '-'}</Box>
            </Box>
          </Box>
          <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
            <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
              Email
            </Box>
            <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
              <Box as="p" className="hidden lg:block lg:mr-2">
                :
              </Box>
              <Box as="p">{data?.policy_holder?.email || '-'}</Box>
            </Box>
          </Box>
          <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
            <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
              Status
            </Box>
            <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
              <Box as="p" className="hidden lg:block lg:mr-2">
                :
              </Box>
              <Box
                as="p"
                className={`font-semibold ${data?.status === 'In Force' ? 'text-primary' : data?.status === 'Grace Period' ? 'text-orange-500' : 'text-gray-500'}`}
              >
                {data?.status || '-'}
              </Box>
            </Box>
          </Box>
        </Box>
        {!!data?.package_data && data?.package_data?.length > 0 && (
          <Box className="overflow-x-auto sm:scrollable bg-white rounded-md mb-3 py-5 px-7 shadow">
            <Box as="p" className="font-semibold mb-3">
              Plan Information
            </Box>
            <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
              <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                Plan Name
              </Box>
              <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                <Box as="p" className="hidden lg:block lg:mr-2">
                  :
                </Box>
                <Box as="p">{data?.package_data[0]?.plan?.name || '-'}</Box>
              </Box>
            </Box>
            <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
              <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                Product Name
              </Box>
              <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                <Box as="p" className="hidden lg:block lg:mr-2">
                  :
                </Box>
                <Box as="p">{data?.package_data[0]?.product?.name || '-'}</Box>
              </Box>
            </Box>
            <Box
              className={`flex flex-col lg:flex-row lg:items-center lg:space-x-4 ${!!data?.package_data[0]?.benefits && data?.package_data[0]?.benefits.length > 0 && 'mb-3 lg:mb-2'}`}
            >
              <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                Insurance Name
              </Box>
              <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                <Box as="p" className="hidden lg:block lg:mr-2">
                  :
                </Box>
                <Box as="p">{data?.package_data[0]?.insurance?.name || '-'}</Box>
              </Box>
            </Box>
            {!!data?.package_data[0]?.benefits && data?.package_data[0]?.benefits.length > 0 && (
              <Box className="border rounded-md overflow-x-auto sm:scrollable">
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
                        Benefit
                      </Box>
                      <Box
                        as="th"
                        className="px-6 py-6 whitespace-nowrap text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        Limit
                      </Box>
                    </Box>
                  </Box>
                  <Box as="tbody" className="bg-white divide-y divide-gray-200">
                    {data?.package_data[0]?.benefits?.map((d: any, dIndex: number) => (
                      <Box as="tr" key={`${dIndex}-${d.id}`} className="hover:bg-gray-50">
                        <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {dIndex + 1}
                        </Box>
                        <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {d.benefits?.description_en || '-'}
                        </Box>
                        <Box as="td" className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {!!d.value ? moneyFormatter().format(d.value) : !!d.html ? d.html : '-'}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        )}
        <Box className="overflow-x-auto sm:scrollable bg-white rounded-md mb-3 py-5 px-7 shadow">
          <Box as="p" className="font-semibold mb-3">
            Insured Parties
          </Box>
          {data?.participants && data?.participants.length > 0 ? (
            data.participants.map((p, participantIndex) => (
              <Box
                key={participantIndex}
                className={`flex flex-col ${participantIndex > 0 && 'border-t border-t-gray-200 mt-4 pt-4'}`}
              >
                {!!data?.number && (
                  <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                    <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                      Policy Number
                    </Box>
                    <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                      <Box as="p" className="hidden lg:block lg:mr-2">
                        :
                      </Box>
                      <Box as="p">{data?.number || '-'}</Box>
                    </Box>
                  </Box>
                )}
                {!!p?.number && (
                  <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                    <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                      Participant Number
                    </Box>
                    <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                      <Box as="p" className="hidden lg:block lg:mr-2">
                        :
                      </Box>
                      <Box as="p">{p?.number || '-'}</Box>
                    </Box>
                  </Box>
                )}
                {!!p?.data?.data?.name && (
                  <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                    <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                      Full Name
                    </Box>
                    <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                      <Box as="p" className="hidden lg:block lg:mr-2">
                        :
                      </Box>
                      <Box as="p">{p?.data?.data?.name || '-'}</Box>
                    </Box>
                  </Box>
                )}
                {!!p?.data?.data?.gender && (
                  <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                    <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                      Gender
                    </Box>
                    <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                      <Box as="p" className="hidden lg:block lg:mr-2">
                        :
                      </Box>
                      <Box as="p">{p?.data?.data?.gender || '-'}</Box>
                    </Box>
                  </Box>
                )}
                {!!p?.data?.data?.country_code && (
                  <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                    <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                      Country Code
                    </Box>
                    <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                      <Box as="p" className="hidden lg:block lg:mr-2">
                        :
                      </Box>
                      <Box as="p">{p?.data?.data?.country_code || '-'}</Box>
                    </Box>
                  </Box>
                )}
                {!!p?.data?.data?.passport_no && (
                  <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                    <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                      Passport Number
                    </Box>
                    <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                      <Box as="p" className="hidden lg:block lg:mr-2">
                        :
                      </Box>
                      <Box as="p">{p?.data?.data?.passport_no || '-'}</Box>
                    </Box>
                  </Box>
                )}
                {!!p?.data?.data?.nationality && (
                  <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                    <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                      Nationality
                    </Box>
                    <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                      <Box as="p" className="hidden lg:block lg:mr-2">
                        :
                      </Box>
                      <Box as="p">{p?.data?.data?.nationality || '-'}</Box>
                    </Box>
                  </Box>
                )}
                {!!p?.data?.data?.dob && (
                  <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                    <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                      Birthdate
                    </Box>
                    <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                      <Box as="p" className="hidden lg:block lg:mr-2">
                        :
                      </Box>
                      <Box as="p">{p?.data?.data?.dob || '-'}</Box>
                    </Box>
                  </Box>
                )}
                {!!p?.data?.data?.pob && (
                  <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                    <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                      Place of Birth
                    </Box>
                    <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                      <Box as="p" className="hidden lg:block lg:mr-2">
                        :
                      </Box>
                      <Box as="p">{p?.data?.data?.pob || '-'}</Box>
                    </Box>
                  </Box>
                )}
                {!!p?.data?.data?.date_of_issue && (
                  <Box className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-3 lg:mb-2">
                    <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                      Release Date
                    </Box>
                    <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                      <Box as="p" className="hidden lg:block lg:mr-2">
                        :
                      </Box>
                      <Box as="p">{p?.data?.data?.date_of_issue || '-'}</Box>
                    </Box>
                  </Box>
                )}
                {!!p?.data?.data?.date_of_expiry && (
                  <Box
                    className={`flex flex-col lg:flex-row lg:items-center lg:space-x-4 ${!!p.data && Object.keys(p.data).length > 0 && 'mb-3 lg:mb-2'}`}
                  >
                    <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                      Expiry Date
                    </Box>
                    <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                      <Box as="p" className="hidden lg:block lg:mr-2">
                        :
                      </Box>
                      <Box as="p">{p?.data?.data?.date_of_expiry || '-'}</Box>
                    </Box>
                  </Box>
                )}
                {!!p.data &&
                  Object.keys(p.data).length > 0 &&
                  Object.keys(p.data).map((key, keyIndex) => {
                    const formattedKey = capitalizeStringWithChar(key, ' ');
                    return (
                      <Box
                        key={`other-info-${keyIndex}`}
                        className={`flex flex-col lg:flex-row lg:items-center lg:space-x-4 ${keyIndex !== Object.keys(p.data).length - 1 && 'mb-3 lg:mb-2'}`}
                      >
                        <Box as="p" className="w-full text-xs lg:text-base lg:w-3/12 font-medium">
                          {formattedKey}
                        </Box>
                        <Box className="w-full lg:w-9/12 flex flex-col lg:flex-row lg:items-center">
                          <Box as="p" className="hidden lg:block lg:mr-2">
                            :
                          </Box>
                          <Box as="p">{p?.data?.[key] || '-'}</Box>
                        </Box>
                      </Box>
                    );
                  })}
              </Box>
            ))
          ) : (
            <Box className="flex items-center justify-center bg-white rounded-md pb-10">
              <NotFound
                width={isMobileView && '143'}
                height={isMobileView && '144'}
                size1={isMobileView && '143'}
                size3={isMobileView && '95'}
                viewBox={isMobileView && '-15 -5 87 70'}
                text="No participant data available"
                textClassName={isMobileView && 'text-xs'}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
