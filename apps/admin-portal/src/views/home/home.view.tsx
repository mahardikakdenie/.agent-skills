import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { Box } from '@repo/ui';

import Chart from '@/components/chart';
import { defaultChart, homeCard, primary } from '@/constants/app-common.const';
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import {
  capitalizeString,
  getColorForBarChart,
  getHeaderPage,
  moneyFormatter,
  numberSimpleFormatter,
} from '@/helpers/app.helper';
import { claimsService } from '@/services/claims/api/claims.service';
import { policyService } from '@/services/policy/api/policy.service';
import { transactionService } from '@/services/transaction/api/transaction.service';
import { ClaimMonthData, ClaimStatisticYearly } from '@/types/claim';
import { CountryData } from '@/types/common';
import { PolicyStatisticYearly } from '@/types/policy';
import { TransactionStatisticYearly } from '@/types/transaction';

export const HomeView = () => {
  const [totalPoliciesHome, setTotalPoliciesHome] = useState(0);
  const [totalClaims, setTotalClaims] = useState(0);
  const [totalCountries, setTotalCountries] = useState(0);
  const [totalTransactionsCountries, setTotalTransactionsCountries] = useState(0);
  const [totalRevenueHome, setTotalRevenueHome] = useState(0);
  const [totalClaimValue, setTotalClaimValue] = useState(0);
  const [policiesCurrentYear, setPoliciesCurrentYear] = useState<number[]>([]);
  const [claimsCurrentYear, setClaimsCurrentYear] = useState<ClaimMonthData[]>([]);
  const [countriesCurrentYear, setCountriesCurrentYear] = useState<CountryData[]>([]);
  const [revenueCurrentYear, setRevenueCurrentYear] = useState<number[]>([]);
  const path = usePathname();
  const router = useRouter();
  const { setLoading } = useScreen();
  const { handleResponseError } = useAuth();
  const currentYear = new Date().getFullYear();

  const policiesClaimsData = {
    labels: [homeCard[2].name, homeCard[3].name],
    datasets: [
      {
        label: defaultChart.stringLabel,
        data: [totalPoliciesHome, totalClaims],
        backgroundColor: [homeCard[2].color, homeCard[3].color],
        borderColor: [homeCard[2].color, homeCard[3].color],
        borderWidth: 1,
      },
    ],
  };

  const countriesCurrentYearData = {
    labels: countriesCurrentYear.map((country) => capitalizeString(Object.keys(country)[0])),
    datasets: [
      {
        label: defaultChart.stringLabel,
        data: countriesCurrentYear.map((country) => Object.values(country)[0].total),
        backgroundColor: countriesCurrentYear.map((_, index) => getColorForBarChart(index)),
        borderColor: countriesCurrentYear.map((_, index) => getColorForBarChart(index)),
        borderWidth: 1,
      },
    ],
  };

  const policiesCurrentYearData = {
    labels: defaultChart.monthsLabel,
    datasets: [
      {
        label: homeCard[2].name,
        data: policiesCurrentYear,
        backgroundColor: homeCard[2].color,
        borderColor: homeCard[2].color,
        borderWidth: 1,
      },
    ],
  };

  const claimsCurrentYearData = {
    labels: defaultChart.monthsLabel,
    datasets: [
      {
        label: homeCard[3].type[0].name,
        data: claimsCurrentYear.map((claim) => claim.total),
        backgroundColor: homeCard[3].type[0].color,
        borderColor: homeCard[3].type[0].color,
        borderWidth: 1,
      },
      {
        label: homeCard[3].type[1].name,
        data: claimsCurrentYear.map((claim) => claim.amount_approved),
        backgroundColor: homeCard[3].type[1].color,
        borderColor: homeCard[3].type[1].color,
        borderWidth: 1,
      },
    ],
  };

  const revenueCurrentYearData = {
    labels: defaultChart.monthsLabel,
    datasets: [
      {
        label: homeCard[0].name,
        data: revenueCurrentYear,
        backgroundColor: primary,
        borderColor: primary,
        borderWidth: 1,
      },
    ],
  };

  const revenueClaimvalueData = {
    labels: [homeCard[0].name, homeCard[4].name.split(' ')[0]],
    datasets: [
      {
        label: defaultChart.stringLabel,
        data: [totalRevenueHome, totalClaimValue],
        backgroundColor: [homeCard[0].color, homeCard[4].color],
        borderColor: [homeCard[0].color, homeCard[4].color],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    const fetchDataHome = async () => {
      try {
        setLoading(true);
        const responseTransactionsStatisticYearly =
          (await transactionService.getTransactionStatistics({
            year: currentYear,
          })) as TransactionStatisticYearly;
        if (responseTransactionsStatisticYearly) {
          const months = responseTransactionsStatisticYearly.months;
          const revenueMap: CountryData = {};

          Object.values(months).forEach((month) => {
            Object.keys(month.country).forEach((country) => {
              if (!revenueMap[country]) {
                revenueMap[country] = { total: 0, revenue: 0 };
              }
              revenueMap[country].total += month.country[country].total || 0;
              revenueMap[country].revenue += month.country[country].revenue || 0;
            });
          });
          const revenueArray = Object.entries(revenueMap).map(([country, data]) => ({
            [country]: data,
          }));

          setTotalCountries(revenueArray.length);
          setTotalTransactionsCountries(
            revenueArray.reduce((accumulator, current) => {
              const countryKey = Object.keys(current)[0];
              return accumulator + current[countryKey].total;
            }, 0),
          );
          setCountriesCurrentYear(revenueArray);
          setTotalRevenueHome(
            Object.values(months).reduce((total, month) => total + month?.revenue, 0),
          );
          setRevenueCurrentYear(Object.values(months).map((month: any) => month?.revenue));
        }

        const responsePoliciesStatisticYearly = (await policyService.getPolicyStatistics({
          year: currentYear,
        })) as PolicyStatisticYearly;
        if (responsePoliciesStatisticYearly) {
          const months = responsePoliciesStatisticYearly.months;
          setTotalPoliciesHome(
            Object.values(months).reduce((accumulator, month) => accumulator + month.total, 0),
          );
          setPoliciesCurrentYear(Object.values(months).map((month) => month.total));
        }

        const responseClaimsStatisticYearly = (await claimsService.getClaimStatistics({
          year: currentYear,
        })) as ClaimStatisticYearly;
        if (responseClaimsStatisticYearly) {
          const months = responseClaimsStatisticYearly.months;
          setTotalClaims(Object.values(months).reduce((total, month) => total + month.total, 0));
          setTotalClaimValue(
            Object.values(months).reduce((total, month) => total + month.amount_approved, 0),
          );
          setClaimsCurrentYear(
            Object.values(months).map((claim) => ({
              amount_approved: claim.amount_approved,
              total: claim.total,
            })),
          );
        }
      } catch (error: any) {
        handleResponseError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataHome().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatNumber = (name: string, isSimple: boolean = false, currency: string = 'IDR') => {
    switch (name) {
      case homeCard[0].name:
        if (isSimple) return `${currency} ${numberSimpleFormatter(totalRevenueHome)}`;
        else return moneyFormatter().format(totalRevenueHome);
      case homeCard[4].name:
        if (isSimple) return `${currency} ${numberSimpleFormatter(totalClaimValue)}`;
        else return moneyFormatter().format(totalClaimValue);
      case homeCard[1].name:
        if (isSimple) return numberSimpleFormatter(totalCountries);
        else return totalCountries;
      case homeCard[2].name:
        if (isSimple) return numberSimpleFormatter(totalPoliciesHome);
        else return totalPoliciesHome;
      case homeCard[3].name:
        if (isSimple) return numberSimpleFormatter(totalClaims);
        else return totalClaims;
    }
  };

  return (
    <Box className="mx-auto py-5 px-7">
      <Box className="flex items-center justify-between mb-5">
        <Box as="p" className="font-bold text-lg">
          {getHeaderPage(2, path, true).pageName}
        </Box>
      </Box>
      <Box className="overflow-x-auto sm:scrollable flex items-center justify-between mb-10">
        {homeCard.map((hc, hcIndex) => (
          <Box
            onClick={() => !!hc.url && router.push(hc.url)}
            key={`home-card-${hcIndex}`}
            className={`${hcIndex !== 0 && 'ml-3'} ${hc.url && 'cursor-pointer'} min-w-[80%] lg:min-w-[21%] w-full bg-white pr-4 flex items-start justify-between rounded-md shadow`}
          >
            <Box className="flex items-center justify-between mr-auto">
              <Box
                className="mr-4 p-2.5 bg-primary-light-foreground rounded-tr-full rounded-br-full"
                style={{ borderTopLeftRadius: '1600px', borderBottomLeftRadius: '1600px' }}
              >
                {hc.icon}
              </Box>
              <Box className="my-2.5">
                <Box as="p" className="font-bold text-primary text-nowrap">
                  {formatNumber(hc.name, true)}
                </Box>
                <Box as="p" className="text-xs text-nowrap">
                  {hc.description}
                </Box>
              </Box>
            </Box>
            <Box
              as="p"
              title={`Year: ${currentYear}\n${hc.description}: ${formatNumber(hc.name)}`}
              className="cursor-help my-2.5 px-1.5 text-center text-[10px] text-gray-500 border border-gray-500 rounded-full"
            >
              i
            </Box>
          </Box>
        ))}
      </Box>
      <Box className="lg:flex lg:justify-between">
        <Box className="lg:w-1/3 flex flex-col items-center justify-between">
          <Box className="w-full bg-white rounded-md shadow py-4 px-5 mb-7">
            <Box className="flex items-start justify-between">
              <Box as="p" className="font-bold text-primary">
                Policies and Claims
              </Box>
              <Box
                as="p"
                title={`Year: ${currentYear}\nTotal policies: ${totalPoliciesHome}\nTotal claims: ${totalClaims}`}
                className="cursor-help px-1.5 text-center text-[10px] text-gray-500 border border-gray-500 rounded-full"
              >
                i
              </Box>
            </Box>
            <Box className="flex items-center justify-center h-[223px]">
              <Box className="mr-3">
                {totalPoliciesHome > 0 || totalClaims > 0 ? (
                  <Box
                    className={`flex flex-col items-center justify-between ${totalPoliciesHome < 1 && totalClaims < 1 ? 'mt-5' : 'mt-3'}`}
                  >
                    <Chart
                      type="doughnut"
                      width={totalPoliciesHome > 0 || totalClaims > 0 ? '170px' : '150px'}
                      height={totalPoliciesHome > 0 || totalClaims > 0 ? '170px' : '150px'}
                      data={
                        totalPoliciesHome > 0 || totalClaims > 0
                          ? policiesClaimsData
                          : defaultChart.dataEmpty
                      }
                      options={defaultChart.optionsEmpty}
                    />
                    <Box
                      as="p"
                      className={`${(totalPoliciesHome > 0 || totalClaims > 0) && 'hidden'} mt-3 text-center text-gray-500 text-sm`}
                    >
                      A chart overview of the total user policies and any related claims will be
                      presented here.
                    </Box>
                  </Box>
                ) : (
                  <Box className="flex flex-col items-center justify-between">
                    <Chart
                      type="doughnut"
                      width="223px"
                      height="223px"
                      data={defaultChart.zeroDataChart}
                      options={defaultChart.zeroOptionsChart}
                    />
                  </Box>
                )}
              </Box>
              <Box className="max-h-[200px] overflow-y-auto sm:scrollable">
                {(totalPoliciesHome > 0 || totalClaims > 0) && (
                  <Box className="mt-0.5 mb-2 flex flex-col gap-0.5">
                    {policiesClaimsData.labels.map((pcd, pcdIndex) => (
                      <Box key={`pcd-${pcdIndex}`} className="flex mx-1.5 my-0.5">
                        <Box as="p" className="text-[10px]">
                          <Box
                            as="span"
                            style={{
                              backgroundColor:
                                policiesClaimsData.datasets[0].backgroundColor[pcdIndex],
                            }}
                            className="w-[1px] h-[1px] px-2 py-0.5 mr-1.5 rounded-full"
                          ></Box>{' '}
                          {pcd}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
          <Box className="w-full bg-white rounded-md shadow py-4 px-5">
            <Box className="flex items-start justify-between">
              <Box as="p" className="font-bold text-primary">
                Countries
              </Box>
              <Box
                as="p"
                title={`Year: ${currentYear}\nCountries: ${totalCountries}\nTotal countries transaction: ${totalTransactionsCountries}`}
                className="cursor-help px-1.5 text-center text-[10px] text-gray-500 border border-gray-500 rounded-full"
              >
                i
              </Box>
            </Box>
            <Box className="flex items-center justify-center h-[223px]">
              <Box className="mr-3">
                {totalCountries > 0 ? (
                  <Box
                    className={`flex flex-col items-center justify-between ${totalCountries < 1 ? 'mt-5' : 'mt-3'}`}
                  >
                    <Chart
                      type="pie"
                      width={totalCountries > 0 ? '170px' : '150px'}
                      height={totalCountries > 0 ? '170px' : '150px'}
                      data={totalCountries > 0 ? countriesCurrentYearData : defaultChart.dataEmpty}
                      options={defaultChart.optionsEmpty}
                    />
                    <Box
                      as="p"
                      className={`${totalCountries > 0 && 'hidden'} mt-3 text-center text-gray-500 text-sm`}
                    >
                      A chart overview of the number of countries will be shown here.
                    </Box>
                  </Box>
                ) : (
                  <Box className="flex flex-col items-center justify-between">
                    <Chart
                      type="pie"
                      width="223px"
                      height="223px"
                      data={defaultChart.zeroDataChart}
                      options={defaultChart.zeroOptionsChart}
                    />
                  </Box>
                )}
              </Box>
              <Box className="max-h-[200px] overflow-y-auto sm:scrollable">
                {totalCountries > 0 && (
                  <Box
                    className={`mt-0.5 mb-2 flex ${totalCountries < 3 ? 'flex-col' : 'flex-wrap'} gap-0.5`}
                  >
                    {countriesCurrentYearData.labels.map((cyd, cydIndex) => (
                      <Box key={`cyd-${cydIndex}`} className="flex mx-1.5 my-0.5">
                        <Box as="p" className="text-[10px]">
                          <Box
                            as="span"
                            style={{ backgroundColor: getColorForBarChart(cydIndex) }}
                            className="w-[1px] h-[1px] px-2 py-0.5 mr-1.5 rounded-full"
                          ></Box>{' '}
                          {cyd}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className="mt-7 lg:mt-0 lg:w-2/3 lg:ml-7 flex flex-col items-center justify-between">
          <Box className="w-full bg-white rounded-md shadow py-4 px-5 mb-7 lg:min-h-[279px]">
            <Box className="flex items-start justify-between">
              <Box as="p" className="font-bold text-primary">
                Total Policies
              </Box>
              <Box
                as="p"
                title={`Year: ${currentYear}\nTotal policies: ${formatNumber(homeCard[2].name)}`}
                className="cursor-help px-1.5 text-center text-[10px] text-gray-500 border border-gray-500 rounded-full"
              >
                i
              </Box>
            </Box>
            {totalPoliciesHome > 0 ? (
              <Box className="flex flex-col items-center justify-between mt-5">
                <Chart
                  type="stacked-bar"
                  width={totalPoliciesHome > 0 ? '90%' : '30%'}
                  height={totalPoliciesHome > 0 ? '203px' : '150px'}
                  data={totalPoliciesHome > 0 ? policiesCurrentYearData : defaultChart.data1Empty}
                  options={
                    totalPoliciesHome > 0 ? defaultChart.options1 : defaultChart.options1Empty
                  }
                />
                <Box
                  as="p"
                  className={`${totalPoliciesHome > 0 && 'hidden'} mt-3 text-center text-gray-500 text-sm`}
                >
                  This section will present a graphical overview of the number of policyholders for
                  each month over the course of a year.
                </Box>
              </Box>
            ) : (
              <Box className="flex flex-col items-center justify-between mt-5">
                <Chart
                  type="stacked-bar"
                  width="90%"
                  height="203px"
                  data={policiesCurrentYearData}
                  options={defaultChart.options1}
                />
              </Box>
            )}
          </Box>
          <Box className="w-full bg-white rounded-md shadow py-4 px-5 lg:min-h-[279px]">
            <Box className="flex items-start justify-between">
              <Box as="p" className="font-bold text-primary">
                Total Claims
              </Box>
              <Box
                as="p"
                title={`Year: ${currentYear}\nNumber of claim: ${totalClaims}\nTotal claim value: ${formatNumber(homeCard[4].name)}`}
                className="cursor-help px-1.5 text-center text-[10px] text-gray-500 border border-gray-500 rounded-full"
              >
                i
              </Box>
            </Box>
            {totalClaims > 0 || totalClaimValue > 0 ? (
              <Box className="flex flex-col items-center justify-between mt-5">
                <Chart
                  type="stacked-bar"
                  width={totalClaims > 0 || totalClaimValue > 0 ? '90%' : '30%'}
                  height={totalClaims > 0 || totalClaimValue > 0 ? '203px' : '150px'}
                  data={
                    totalClaims > 0 || totalClaimValue > 0
                      ? claimsCurrentYearData
                      : defaultChart.data1Empty
                  }
                  options={
                    totalClaims > 0 || totalClaimValue > 0
                      ? defaultChart.options1
                      : defaultChart.options1Empty
                  }
                />
                <Box
                  as="p"
                  className={`${(totalClaims > 0 || totalClaimValue > 0) && 'hidden'} mt-3 text-center text-gray-500 text-sm`}
                >
                  This section will present a graphical overview of the number of claims for each
                  month over the course of a year.
                </Box>
              </Box>
            ) : (
              <Box className="flex flex-col items-center justify-between mt-5">
                <Chart
                  type="stacked-bar"
                  width="90%"
                  height="203px"
                  data={claimsCurrentYearData}
                  options={defaultChart.options1}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Box className="lg:flex lg:justify-between lg:mt-7">
        <Box className="mt-7 lg:mt-0 lg:w-2/3 lg:mr-7 flex flex-col items-center justify-between">
          <Box className="w-full bg-white rounded-md shadow py-4 px-5 mb-7 lg:min-h-[279px]">
            <Box className="flex items-start justify-between">
              <Box as="p" className="font-bold text-primary">
                Total Revenue
              </Box>
              <Box
                as="p"
                title={`Year: ${currentYear}\nTotal revenue: ${formatNumber(homeCard[0].name)}`}
                className="cursor-help px-1.5 text-center text-[10px] text-gray-500 border border-gray-500 rounded-full"
              >
                i
              </Box>
            </Box>
            {totalRevenueHome > 0 ? (
              <Box className="flex flex-col items-center justify-between mt-5">
                <Chart
                  type="curve-line"
                  width={totalRevenueHome > 0 ? '90%' : '70%'}
                  height={totalRevenueHome > 0 ? '203px' : '150px'}
                  data={totalRevenueHome > 0 ? revenueCurrentYearData : defaultChart.data2Empty}
                  options={
                    totalRevenueHome > 0 ? defaultChart.options1 : defaultChart.options1Empty
                  }
                />
                <Box
                  as="p"
                  className={`${totalRevenueHome > 0 && 'hidden'} mt-3 text-center text-gray-500 text-sm`}
                >
                  This section will present a graphical overview of the number of revenue for each
                  month over the course of a year.
                </Box>
              </Box>
            ) : (
              <Box className="flex flex-col items-center justify-between mt-5">
                <Chart
                  type="curve-line"
                  width="90%"
                  height="203px"
                  data={revenueCurrentYearData}
                  options={defaultChart.options1}
                />
              </Box>
            )}
          </Box>
        </Box>
        <Box className="lg:w-1/3 flex flex-col items-center justify-between">
          <Box className="w-full bg-white rounded-md shadow py-4 px-5">
            <Box className="flex items-start justify-between">
              <Box as="p" className="font-bold text-primary">
                Claim and Revenue
              </Box>
              <Box
                as="p"
                title={`Year: ${currentYear}\nTotal revenue: ${formatNumber(homeCard[0].name)}\nTotal claim value: ${formatNumber(homeCard[4].name)}`}
                className="cursor-help px-1.5 text-center text-[10px] text-gray-500 border border-gray-500 rounded-full"
              >
                i
              </Box>
            </Box>
            <Box className="flex items-center justify-center h-[223px]">
              <Box className="mr-3">
                {totalRevenueHome > 0 || totalClaimValue > 0 ? (
                  <Box
                    className={`flex flex-col items-center justify-between ${totalRevenueHome < 1 && totalClaimValue < 1 && 'mt-5'}`}
                  >
                    <Chart
                      type="doughnut"
                      width={totalRevenueHome > 0 || totalClaimValue > 0 ? '170px' : '150px'}
                      height={totalRevenueHome > 0 || totalClaimValue > 0 ? '170px' : '150px'}
                      data={
                        totalRevenueHome > 0 || totalClaimValue > 0
                          ? revenueClaimvalueData
                          : defaultChart.dataEmpty
                      }
                      options={defaultChart.optionsEmpty}
                    />
                    <Box
                      as="p"
                      className={`${(totalRevenueHome > 0 || totalClaimValue > 0) && 'hidden'} mt-3 text-center text-gray-500 text-sm`}
                    >
                      A chart overview of the total of claims and revenue will be presented here.
                    </Box>
                  </Box>
                ) : (
                  <Box className="flex flex-col items-center justify-between">
                    <Chart
                      type="doughnut"
                      width="223px"
                      height="223px"
                      data={defaultChart.zeroDataChart}
                      options={defaultChart.zeroOptionsChart}
                    />
                  </Box>
                )}
              </Box>
              <Box className="max-h-[200px] overflow-y-auto sm:scrollable">
                {(totalRevenueHome > 0 || totalClaimValue > 0) && (
                  <Box className="mt-0.5 mb-2 flex flex-col gap-0.5">
                    {revenueClaimvalueData.labels.map((rcd, rcdIndex) => (
                      <Box key={`rcd-${rcdIndex}`} className="flex mx-1.5 my-0.5">
                        <Box as="p" className="text-[10px]">
                          <Box
                            as="span"
                            style={{
                              backgroundColor:
                                revenueClaimvalueData.datasets[0].backgroundColor[rcdIndex],
                            }}
                            className="w-[1px] h-[1px] px-2 py-0.5 mr-1.5 rounded-full"
                          ></Box>{' '}
                          {rcd}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
