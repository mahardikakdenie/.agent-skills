import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { Box } from '@repo/ui';

import Chart from '@/components/chart';
import Select from '@/components/select';
import { defaultChart, homeCard, primary } from '@/constants/app-common.const';
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import {
  capitalizeString,
  getHeaderPage,
  moneyFormatter,
  numberSimpleFormatter,
} from '@/helpers/app.helper';
import GlobeLocationIcon from '@/images/globe-location.icon';
import { policyService } from '@/services/policy/api/policy.service';
import { transactionService } from '@/services/transaction/api/transaction.service';
import { CountryData } from '@/types/common';
import { PolicyStatisticYearly } from '@/types/policy';
import { TransactionStatisticYearly } from '@/types/transaction';

export const CountriesView = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalPolicies, setTotalPolicies] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [countryOptionList, setCountryOptionList] = useState<any[]>([]);
  const [revenueCurrentYear, setRevenueCurrentYear] = useState<number[]>([]);
  const [policiesCurrentYear, setPoliciesCurrentYear] = useState<number[]>([]);
  const path = usePathname();
  const router = useRouter();
  const { setLoading } = useScreen();
  const { handleResponseError } = useAuth();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchDataCountries(selectedCountry).then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]);

  const fetchDataCountries = async (country: string) => {
    try {
      setLoading(true);
      const responseTransactionCountriesStatisticYearly: TransactionStatisticYearly =
        (await transactionService.getTransactionStatisticsYearly({
          year: currentYear,
        })) as TransactionStatisticYearly;
      if (responseTransactionCountriesStatisticYearly) {
        const months = responseTransactionCountriesStatisticYearly.months;
        const revenueCountriesMap: CountryData = {};

        Object.values(months).forEach((month) => {
          Object.keys(month.country).forEach((country) => {
            if (!revenueCountriesMap[country]) {
              revenueCountriesMap[country] = { total: 0, revenue: 0 };
            }
            revenueCountriesMap[country].total += month.country[country].total || 0;
            revenueCountriesMap[country].revenue += month.country[country].revenue || 0;
          });
        });
        const revenueArray = Object.entries(revenueCountriesMap).map(([country, data]) => ({
          [country]: data,
        }));
        const optionList = [{ value: 'All', label: 'All Countries' }];
        revenueArray.forEach((item) => {
          const country = Object.keys(item)[0];
          optionList.push({ value: country, label: capitalizeString(country) });
        });

        setCountryOptionList(optionList);

        if (country !== 'All') {
          const revenueCountryMonthly: number[] = [];
          Object.values(months).forEach((item) => {
            const countryData = item.country[country];
            if (countryData) revenueCountryMonthly.push(countryData.revenue);
            else revenueCountryMonthly.push(0);
          });
          setRevenueCurrentYear(revenueCountryMonthly);
          setTotalRevenue(
            revenueCountryMonthly.reduce((accumulator, current) => accumulator + current, 0),
          );
        } else {
          setRevenueCurrentYear(Object.values(months).map((month: any) => month?.revenue));
          setTotalRevenue(
            Object.values(months).reduce((total, month) => total + month?.revenue, 0),
          );
        }
      }

      const responsePoliciesCountriesStatisticYearly: PolicyStatisticYearly =
        (await policyService.getPolicyStatisticsYearly({
          year: currentYear,
        })) as PolicyStatisticYearly;
      if (responsePoliciesCountriesStatisticYearly) {
        const months = responsePoliciesCountriesStatisticYearly.months;

        if (country !== 'All') {
          const policiesMonthly: number[] = [];
          Object.values(months).forEach((item) => {
            const countryData = item.country[country];
            if (countryData) policiesMonthly.push(countryData);
            else policiesMonthly.push(0);
          });
          setPoliciesCurrentYear(policiesMonthly);
          setTotalPolicies(
            policiesMonthly.reduce((accumulator, current) => accumulator + current, 0),
          );
        } else {
          setPoliciesCurrentYear(Object.values(months).map((month) => month.total));
          setTotalPolicies(
            Object.values(months).reduce((accumulator, month) => accumulator + month.total, 0),
          );
        }
      }
    } catch (error: any) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeCountry = (country: string) => setSelectedCountry(country);

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

  const formatNumber = (name: string, isSimple: boolean = false, currency: string = 'IDR') => {
    switch (name) {
      case homeCard[0].name:
        if (isSimple) return `${currency} ${numberSimpleFormatter(totalRevenue)}`;
        else return moneyFormatter().format(totalRevenue);
      case homeCard[2].name:
        if (isSimple) return numberSimpleFormatter(totalPolicies);
        else return totalPolicies;
    }
  };

  return (
    <Box className="mx-auto py-5 px-7">
      <Box className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
        <Box as="p" className="font-bold text-lg">
          {getHeaderPage(2, path, true).pageName}
        </Box>
        <Box className="w-full lg:w-40 rounded-md shadow mt-2 lg:mt-0">
          <Select
            icon={GlobeLocationIcon(undefined, undefined, '24', '24', '0 0 54 54')}
            value={selectedCountry}
            onChange={(event) => handleChangeCountry(event.toString())}
            options={countryOptionList}
          />
        </Box>
      </Box>
      <Box className="overflow-x-auto sm:scrollable flex items-center justify-between mb-10">
        {homeCard.map((hc, hcIndex) => {
          return (
            (hcIndex === 0 || hcIndex === 2) && (
              <Box
                onClick={() => !!hc.url && router.push(hc.url)}
                key={`home-card-${hcIndex}`}
                className={`${hcIndex !== 0 && 'ml-3'} ${hc.url && 'cursor-pointer'} min-w-[80%] lg:min-w-[21%] w-full bg-white pr-4 flex items-start justify-between rounded-md shadow`}
              >
                <Box className="flex items-center justify-between mr-4">
                  <Box
                    className="mr-4 p-2.5 bg-primary-light-foreground rounded-tr-full rounded-br-full"
                    style={{ borderTopLeftRadius: '1600px', borderBottomLeftRadius: '1600px' }}
                  >
                    {hc.icon}
                  </Box>
                  <Box className="my-2.5">
                    <Box as="p" className="font-bold text-primary">
                      {formatNumber(hc.name, true)}
                    </Box>
                    <Box as="p" className="text-xs">
                      {hc.description}
                    </Box>
                  </Box>
                </Box>
                <Box
                  as="p"
                  title={`Year: ${currentYear}\nCountry: ${capitalizeString(selectedCountry)}\n${hc.description}: ${formatNumber(hc.name)}`}
                  className="cursor-help my-2.5 px-1.5 text-center text-[10px] text-gray-500 border border-gray-500 rounded-full"
                >
                  i
                </Box>
              </Box>
            )
          );
        })}
      </Box>
      <Box className="w-full bg-white rounded-md shadow py-4 px-5 mb-7 lg:min-h-[279px]">
        <Box className="flex items-start justify-between">
          <Box as="p" className="font-bold text-primary">
            Total Revenue
          </Box>
          <Box
            as="p"
            title={`Year: ${currentYear}\nCountry: ${capitalizeString(selectedCountry)}\nTotal revenue: ${formatNumber(homeCard[0].name)}`}
            className="cursor-help px-1.5 text-center text-[10px] text-gray-500 border border-gray-500 rounded-full"
          >
            i
          </Box>
        </Box>
        {totalRevenue > 0 ? (
          <Box className="flex flex-col items-center justify-between mt-5">
            <Chart
              type="curve-line"
              width={totalRevenue > 0 ? '90%' : '70%'}
              height={totalRevenue > 0 ? '203px' : '150px'}
              data={totalRevenue > 0 ? revenueCurrentYearData : defaultChart.data2Empty}
              options={totalRevenue > 0 ? defaultChart.options1 : defaultChart.options1Empty}
            />
            <Box
              as="p"
              className={`${totalRevenue > 0 && 'hidden'} mt-3 text-center text-gray-500 text-sm`}
            >
              This section will present a graphical overview of the number of revenue for each month
              over the course of a year.
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
      <Box className="w-full bg-white rounded-md shadow py-4 px-5 mb-7 lg:min-h-[279px]">
        <Box className="flex items-start justify-between">
          <Box as="p" className="font-bold text-primary">
            Total Policies
          </Box>
          <Box
            as="p"
            title={`Year: ${currentYear}\nCountry: ${capitalizeString(selectedCountry)}\nTotal policies: ${formatNumber(homeCard[2].name)}`}
            className="cursor-help px-1.5 text-center text-[10px] text-gray-500 border border-gray-500 rounded-full"
          >
            i
          </Box>
        </Box>
        {totalPolicies > 0 ? (
          <Box className="flex flex-col items-center justify-between mt-5">
            <Chart
              type="stacked-bar"
              width={totalPolicies > 0 ? '90%' : '30%'}
              height={totalPolicies > 0 ? '203px' : '150px'}
              data={totalPolicies > 0 ? policiesCurrentYearData : defaultChart.data1Empty}
              options={totalPolicies > 0 ? defaultChart.options1 : defaultChart.options1Empty}
            />
            <Box
              as="p"
              className={`${totalPolicies > 0 && 'hidden'} mt-3 text-center text-gray-500 text-sm`}
            >
              This section will present a graphical overview of the number of policyholders for each
              month over the course of a year.
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
    </Box>
  );
};
