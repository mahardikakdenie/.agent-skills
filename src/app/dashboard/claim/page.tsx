// "use client";
//
// import { DashboardClaim } from "@/views/dashboard/claim/claim.view";
// import React from "react";
//
// export default function Claim() {
//   return <DashboardClaim />;
// }

"use client";
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { formatDateTimeWithTZ, formatMoney, numberSimpleFormatter } from "@/lib/formatter";
import { Controller, useForm } from 'react-hook-form';

import PieChart from '@/components/ui/recharts/piechart';
import LineChart from '@/components/ui/recharts/linechart';
import DetailTable from '@/components/ui/recharts/table-policy';
import BarChartComp from '@/components/ui/recharts/barchart-vertical';
import DatePickerDropdown from '@/components/ui/date-range-picker';
import ApiURL from "@/constants/api-url.const";
import {claimService, productService} from '@/services/api.service';

const claimColumns = [
  { key: 'created_at', label: 'Created At' },
  { key: 'number', label: 'Number' },
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount' },
  { key: 'amount_approved', label: 'Amount Approved' },
  { key: 'status', label: 'Status' },
];

export default function DashboardClaim() {
  const [ claimStatisticData, setClaimStatisticData ] = useState<any>(null);
  const [ totalClaimAmount, setTotalClaimAmount ] = useState<number>(0);
  const [ totalClaimAmountApproved, setTotalClaimAmountApproved ] = useState<number>(0);
  const [ totalClaim, setTotalClaim ] = useState<number>(0);
  const [ totalClaimApproved, setTotalClaimApproved ] = useState<number>(0);
  const [ selectedProduct, setSelectedProduct ] = useState<string>('');
  const [ selectedInsuranceId, setSelectedInsuranceId ] = useState("");
  const [ insuranceOptions, setInsuranceOptions ] = useState<{ label: string; value: string }[]>([]);
  const [ productOptions, setProductOptions ] = useState<{ label: string; value: string }[]>([]);
  const [ selectedPlan, setSelectedPlan ] = useState<string>('');
  const [ planOptions, setPlanOptions ] = useState<{ label: string; value: string }[]>([]);
  const [ from, setFrom ] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [ to, setTo ] = useState(format(new Date(), 'yyyy-MM-dd'));

  const {
    control,
  } = useForm({
    shouldUnregister: false,
    defaultValues: {
      insurance: "",
      insurances: selectedInsuranceId,
      product: selectedProduct,
      plan: selectedPlan,
    },
  });

  const handleDateChange = (startDate: string, endDate: string) => {
    setFrom(startDate);
    setTo(endDate);
  };

  useEffect(() => {
    const fetchDataClaim = async () => {
      try {
        const params = {
          sort: 'desc',
          insurance: selectedInsuranceId && selectedInsuranceId !== 'All' ? selectedInsuranceId : undefined,
          product: selectedProduct && selectedProduct !== 'All' ? selectedProduct : undefined,
          plan: selectedPlan && selectedPlan !== 'All' ? selectedPlan : undefined,
          from: from ? from : undefined,
          to: to ? to : undefined
        };
        const response: any = await claimService.get(ApiURL.v1ClaimStatisticData, { params });

        if (response?.data?.data) {
          setClaimStatisticData(response.data?.data);
          setTotalClaimAmount(response.data?.total_claim_amount);
          setTotalClaimAmountApproved(response.data?.total_claim_amount_approved);
          setTotalClaim(response.data?.total_claim);
          setTotalClaimApproved(response.data?.total_claim_approved);
        }
      } finally {
        // setLoading(false);
      }
    };

    fetchDataClaim();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct, selectedInsuranceId, selectedPlan, from, to]);

  useEffect(() => {
    const fetchInsuranceFilter = async () => {
      try {
        // setLoading(true);
        const response = await productService.get(ApiURL.v1Insurances);

        if (response?.data?.data) {
          const list = response.data.data.map((ins: { name: string; id: string }) => ({
            label: ins.name,
            value: ins.id,
          }));
          const updatedList = [{ label: 'INSURANCE NAME', value: 'All' }, ...list];

          setInsuranceOptions(updatedList);
          setSelectedInsuranceId(updatedList[0].value);
        }
      } finally {
        // setLoading(false);
      }
    };
    fetchInsuranceFilter().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchProductFilter = async ({ page, insuranceId }: { page: number; insuranceId: string }) => {
      try {
        const response = await productService.get(ApiURL.v1Products, {
            params: {
              insuranceIds: insuranceId !== 'All' && insuranceId ? [insuranceId] : [],
              page,
              pageSize: 100
            }
        });

        if (response?.data?.data) {
          const list = response.data.data.map((prod: { name: string; id: string }) => ({
            label: prod.name,
            value: prod.id,
          }));
          const updatedList = [{ label: 'INSURANCE PRODUCT', value: 'All' }, ...list];

          setProductOptions(updatedList);
          setSelectedProduct(updatedList[0].value);
        }
      } catch (error) {
        console.error('Error fetching product filter:', error);
      }
    };

    if (selectedInsuranceId) {
      fetchProductFilter({
        page: 1,
        insuranceId: selectedInsuranceId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInsuranceId]);

  useEffect(() => {
    const fetchPlanFilter = async ({ page, productId }: { page: number; productId: string }) => {
      try {
        const response = await productService.get(ApiURL.v1Plans, {
          params: {
            productIds: productId !== 'All' && productId ? [productId] : [],
            page,
            pageSize: 100
          }
        });

        if (response?.data?.data) {
          const list = response.data.data.map((prod: { name: string; id: string }) => ({
            label: prod.name,
            value: prod.id,
          }));
          const updatedList = [{ label: 'PLAN NAME', value: 'All' }, ...list];

          setPlanOptions(updatedList);
          setSelectedPlan(updatedList[0].value);
        }
      } catch (error) {
        console.error('Error fetching product filter:', error);
      }
    };


    if (selectedProduct) {
      fetchPlanFilter({
        page: 1,
        productId: selectedProduct,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct]);

  const groupedData: Record<string, { name: string; value: number }> = (
      Array.isArray(claimStatisticData) ? claimStatisticData : []
  ).reduce(
      (acc, item) => {
        if (item?.type) {
          if (!acc[item.type]) {
            acc[item.type] = { name: item.type, value: 0 };
          }
          acc[item.type].value += 1;
        }
        return acc;
      },
      {} as Record<string, { name: string; value: number }>,
  );

  const pieChart: { name: string; value: number }[] = Object.values(groupedData);

  const lineChart = Array.isArray(claimStatisticData)
      ? claimStatisticData
          .map((item) => ({
            date: format(new Date(item.created_at), 'yyyy-MM-dd'),
            count: totalClaim,
            total_claim_amount: totalClaimAmount,
          }))
          .reduce((acc: { date: string; count: number; total_claim_amount: number }[], record) => {
            const existing = acc.find((item) => item.date === record.date);
            if (existing) {
              existing.count += record.count;
              existing.total_claim_amount += record.count;
            } else {
              acc.push({
                date: record.date,
                count: totalClaim,
                total_claim_amount: totalClaimAmountApproved,
              });
            }
            return acc;
          }, [])
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      : [];

  const barChart = Object.values(
      (Array.isArray(claimStatisticData) ? claimStatisticData : []).reduce(
          (acc, claim) => {
            if (!acc[claim.status]) {
              acc[claim.status] = { status: claim.status, count: 0 };
            }
            acc[claim.status].count += 1;
            return acc;
          },
          {} as Record<string, { status: string; count: number }>,
      ),
  ) as { status: string; count: number }[];

  const tableData = Array.isArray(claimStatisticData)
      ? claimStatisticData.map((item) => ({
        created_at: formatDateTimeWithTZ(item.created_at),
        number: item.number,
        type: item.type,
        amount: `${formatMoney(item.amount)}`,
        amount_approved: `${formatMoney(item.amount_approved)}`,
        status: item.status,
      }))
      : [];

  return (
      <div className="w-full bg-[#ebf6ff] p-5 min-h-screen">
        <div className="text-center bg-primary px-5 py-4 rounded-md shadow-sm mb-5">
          <h5 className="text-2xl font-bold text-white">Insurance Claim Performance Dashboard</h5>
        </div>

        <div className="flex gap-3">
          <div className="grid grid-cols-4 gap-4 mb-4 w-full">
            <div>
              <Controller
                  name="insurance"
                  control={control}
                  render={({ field }) => (
                      <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedInsuranceId(value);
                          }}
                      >
                        <SelectTrigger className="w-full h-12 shadow border-0 select-status bg-white hover:cursor-pointer py-2">
                          <SelectValue placeholder="INSURANCE NAME " />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {insuranceOptions.map((insurance: any) => (
                                <SelectItem key={insurance.value} value={insurance.value}>
                                  {insurance.label}
                                </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                  )}
              />
            </div>
            <div>
              <Controller
                  name="product"
                  control={control}
                  render={({ field }) => (
                      <Select
                          value={field.value}
                          disabled={selectedInsuranceId === 'All' || selectedInsuranceId === ''}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedProduct(value);
                          }}
                      >
                        <SelectTrigger className="w-full disabled:opacity-100 disabled:bg-gray-200 disabled:shadow-none h-12 text-left shadow border-0 select-status bg-white hover:cursor-pointer py-2">
                          <SelectValue placeholder="INSURANCE PRODUCT" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {productOptions.map((prod: any) => (
                                <SelectItem key={prod.value} value={prod.value}>
                                  {prod.label}
                                </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                  )}
              />
            </div>
            <div>
              <Controller
                  name="plan"
                  control={control}
                  render={({ field }) => (
                      <Select
                          value={field.value}
                          disabled={selectedProduct === 'All' || selectedProduct === ''}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedPlan(value);
                          }}
                      >
                        <SelectTrigger className="w-full disabled:opacity-100 disabled:bg-gray-200 disabled:shadow-none h-12 text-left shadow border-0 select-status bg-white hover:cursor-pointer py-2">
                          <SelectValue placeholder="PLAN NAME" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {planOptions.map((prod: any) => (
                                <SelectItem key={prod.value} value={prod.value}>
                                  {prod.label}
                                </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                  )}
              />
            </div>
            <DatePickerDropdown onDateChange={handleDateChange} />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-white p-5 rounded-md shadow-sm text-center flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-center">
              {numberSimpleFormatter(totalClaimAmount)}
            </p>
            <h5 className="text-xs">Total Claim Amount</h5>
          </div>
          <div className="bg-white p-5 rounded-md shadow-sm text-center flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-center">
              {numberSimpleFormatter(totalClaimAmountApproved)}
            </p>
            <h5 className="text-xs">Total Claim Amount Approved</h5>
          </div>
          <div className="bg-white p-5 rounded-md shadow-sm text-center flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-center">{numberSimpleFormatter(totalClaim)}</p>
            <h5 className="text-xs">Total Claim</h5>
          </div>
          <div className="bg-white p-5 rounded-md shadow-sm text-center flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-center">
              {numberSimpleFormatter(totalClaimApproved)}
            </p>
            <h5 className="text-xs">Total Claim Approved</h5>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-4">
            <div className="flex flex-col gap-4">
              <div className="bg-white p-5 rounded-md shadow-sm">
                <h5 className="font-semibold">Claim Type</h5>
                <div className="w-full h-[312px]">
                  <PieChart data={pieChart} />
                </div>
              </div>
              <div className="bg-white p-5 rounded-md shadow-sm">
                <h5 className="font-semibold">Claim Status</h5>
                <div className="w-full h-[503px]">
                  <BarChartComp data={barChart} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-8">
            <div className="flex flex-col gap-4">
              <div className="bg-white py-5 rounded-md shadow-sm w-full mb-4">
                <h5 className="font-semibold mb-3 pl-5">Claim Trends</h5>
                <div className="h-[300px]">
                  <LineChart data={lineChart} />
                </div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-md shadow-sm w-full table-claim min-h-[567px]">
              <h5 className="font-semibold mb-3">Detail Claim</h5>
              <DetailTable data={tableData} columns={claimColumns} />
            </div>
          </div>
        </div>
      </div>
  );
};