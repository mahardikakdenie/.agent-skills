import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { Box } from '@repo/ui';

import Chart from '@/components/chart';
import Select from '@/components/select';
import { defaultChart, homeCard } from '@/constants/app-common.const';
import { useAuth } from '@/context/auth.context';
import { useScreen } from '@/context/screen.context';
import {
  capitalizeString,
  getColorForBarChart,
  getHeaderPage,
  moneyFormatter,
} from '@/helpers/app.helper';
import GlobeLocationIcon from '@/images/globe-location.icon';
import { transactionService } from '@/services/transaction/api/transaction.service';
import { CountryData } from '@/types/common';
import { TransactionStatisticYearly } from '@/types/transaction';

export const RevenueView = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [countryOptionList, setCountryOptionList] = useState<any[]>([]);
  const [revenueCurrentYear, setRevenueCurrentYear] = useState<CountryData[]>([]);
  const path = usePathname();
  const { setLoading } = useScreen();
  const { handleResponseError } = useAuth();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchDataRevenue(selectedCountry).then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]);

  const fetchDataRevenue = async (country: string) => {
    try {
      setLoading(true);
      const responseTransactionRevenueStatisticYearly: TransactionStatisticYearly =
        (await transactionService.getTransactionStatisticsYearly({
          year: currentYear,
        })) as TransactionStatisticYearly;
      if (responseTransactionRevenueStatisticYearly) {
        const months = responseTransactionRevenueStatisticYearly.months;
        const revenueTransactionMap: CountryData = {};

        Object.values(months).forEach((month) => {
          Object.keys(month.country).forEach((country) => {
            if (!revenueTransactionMap[country]) {
              revenueTransactionMap[country] = { total: 0, revenue: 0 };
            }
            revenueTransactionMap[country].total += month.country[country].total || 0;
            revenueTransactionMap[country].revenue += month.country[country].revenue || 0;
          });
        });
        const revenueArray = Object.entries(revenueTransactionMap).map(([country, data]) => ({
          [country]: data,
        }));
        const optionList = [{ value: 'All', label: 'All Countries' }];
        revenueArray.forEach((item) => {
          const country = Object.keys(item)[0];
          optionList.push({ value: country, label: capitalizeString(country) });
        });

        setCountryOptionList(optionList);

        if (country !== 'All') {
          const revenueCountry: CountryData[] = [];
          revenueArray.forEach((item) => {
            if (Object.keys(item)[0] === country) revenueCountry.push(item);
          });
          setRevenueCurrentYear(revenueCountry);
          setTotalRevenue(revenueCountry.length > 0 ? revenueCountry[0][country].revenue : 0);
        } else {
          setRevenueCurrentYear(revenueArray);
          setTotalRevenue(
            Object.values(months).reduce((total, month) => total + month?.revenue, 0),
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
    labels: revenueCurrentYear.map((item) => capitalizeString(Object.keys(item)[0])),
    datasets: [
      {
        label: homeCard[0].name,
        data: revenueCurrentYear.map((item) => item[Object.keys(item)[0]].revenue),
        backgroundColor: getColorForBarChart(0),
        borderColor: getColorForBarChart(0),
        borderWidth: 1,
      },
    ],
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
      <Box className="w-full bg-white rounded-md shadow py-4 px-5 mb-7 lg:min-h-[279px]">
        <Box className="flex items-start justify-between">
          <Box as="p" className="font-bold text-primary">
            Total Revenue
          </Box>
          <Box
            as="p"
            title={`Year: ${currentYear}\nCountry: ${capitalizeString(selectedCountry)}\nTotal revenue: ${moneyFormatter().format(totalRevenue)}`}
            className="cursor-help px-1.5 text-center text-[10px] text-gray-500 border border-gray-500 rounded-full"
          >
            i
          </Box>
        </Box>
        {totalRevenue > 0 ? (
          <Box className="flex flex-col items-center justify-between mt-5">
            <Chart
              type="stacked-bar"
              width={totalRevenue > 0 ? '90%' : '30%'}
              height={totalRevenue > 0 ? '203px' : '150px'}
              data={totalRevenue > 0 ? revenueCurrentYearData : defaultChart.data1Empty}
              options={totalRevenue > 0 ? defaultChart.options1 : defaultChart.options1Empty}
            />
            <Box
              as="p"
              className={`${totalRevenue > 0 && 'hidden'} mt-3 text-center text-gray-500 text-sm`}
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
              data={revenueCurrentYearData}
              options={defaultChart.options1}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
