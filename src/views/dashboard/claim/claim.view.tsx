import React, { useEffect, useState } from "react";
import PieChart from "@/components/recharts/piechart";
import LineChart from "@/components/recharts/linechart";
import DetailTable from "@/components/recharts/table-policy";
import BarChartComp from "@/components/recharts/barchart-vertical";
import ApiURL from "@/constants/api-url.const";
import Select from "@/components/select";
import DatePickerDropdown from "@/components/date-range-picker";

import { format } from "date-fns";
import { Claim, ClaimStatisticDataRequest } from "@/types/claim";
import { claimService, masterdataService } from "@/services/api.service";
import { useScreen } from "@/context/screen.context";
import { useAuth } from "@/context/auth.context";
import { formatDateTimeWithTZ, formatMoney, numberSimpleFormatter } from "@/helpers/app.helper";
import { primary } from "@/constants/app-common.const";

const claimColumns = [
  { key: "created_at", label: "Created At" },
  { key: "number", label: "Number" },
  { key: "type", label: "Type" },
  { key: "amount", label: "Amount" },
  { key: "amount_approved", label: "Amount Approved" },
  { key: "status", label: "Status" },
];

export const DashboardClaim = () => {
  const { setLoading } = useScreen();
  const { handleResponseError, user } = useAuth();
  const [ claimStatisticData, setClaimStatisticData] = useState<Claim | null>(null);
  const [ totalClaimAmount, setTotalClaimAmount] = useState<number>(0);
  const [ totalClaimAmountApproved, setTotalClaimAmountApproved] = useState<number>(0);
  const [ totalClaim, setTotalClaim] = useState<number>(0);
  const [ totalClaimApproved, setTotalClaimApproved] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [productOptions, setProductOptions] = useState<any[]>([]);
  const [selectedInsurance, setSelectedInsurance] = useState<string>("");
  const [insuranceOptions, setInsuranceOptions] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [planOptions, setPlanOptions] = useState<any[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleDateChange = (startDate: string, endDate: string) => {
    setFrom(startDate);
    setTo(endDate);
  };

  useEffect(() => {
    const fetchDataPolicy = async () => {
      try {
        setLoading(true);
        const params: ClaimStatisticDataRequest = {
          channel: user?.all_channels?.[0] || undefined,
          sort: "desc",
          ...(selectedInsurance !== "All" && selectedInsurance && { insurance: selectedInsurance }),
          ...(selectedProduct !== "All" && selectedProduct && { product: selectedProduct }),
          ...(selectedPlan !== "All" && selectedPlan && { plan: selectedPlan }),
          ...(from && { from }),
          ...(to && { to }),
        };
  
        const response = await claimService.get(ApiURL.claimStatisticData, { params });
  
        if (response.data) {
          setClaimStatisticData(response.data.data);
          setTotalClaimAmount(response.data.total_claim_amount);
          setTotalClaimAmountApproved(response.data.total_claim_amount_approved)
          setTotalClaim(response.data.total_claim)
          setTotalClaimApproved(response.data.total_claim_approved);
        }
      } catch (error: any) {
        handleResponseError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDataPolicy().then();

    if (selectedProduct && selectedInsurance && selectedPlan && from && to) fetchDataPolicy().then();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct, selectedInsurance, selectedPlan, from, to]);

  useEffect(() => {
    const fetchInsuranceFilter = async () => {
      try {
        setLoading(true);
        const updatedList = [{ label: "INSURANCE NAME", value: "All" }];
        if (user?.all_insurances && user?.all_insurances?.length > 0) {
          for (let i = 0; i < user.all_insurances.length; i++) {
            const insId = user.all_insurances[i];
            const res = await masterdataService.get(ApiURL.insuranceDetails(insId));
            if (res?.data?.data) updatedList.push({ label: res?.data?.data?.name, value: res?.data?.data?.id });
          }
        }

        setInsuranceOptions(updatedList);
        setSelectedInsurance(updatedList[0].value);
      } catch (error: any) {
        handleResponseError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsuranceFilter().then();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    const fetchProductFilter = async () => {
      try {
        setLoading(true);
        
        const response: any = await masterdataService.get(ApiURL.products, {
          params: { 
            page: 1, 
            pageSize: 100,
            channelId: user?.all_channels?.[0] || undefined,
            ...(selectedInsurance !== "All" && selectedInsurance && { insuranceId: selectedInsurance }),
          },
        });
  
        if (response?.data?.data && Array.isArray(response.data.data)) {
          const list = response.data.data.map((prod: any) => ({
            label: prod.name,
            value: prod.id,
          }));
          
          const updatedList = [{ label: "INSURANCE PRODUCT", value: "All" }, ...list];
          
          setProductOptions(updatedList);
          setSelectedProduct(updatedList[0].value);
        }
      } catch (error: any) {
        handleResponseError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductFilter().then();
    
    if (selectedInsurance) fetchProductFilter().then();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInsurance]);
  
  useEffect(() => {
    const fetchPlanFilter = async () => {
      try {
        setLoading(true);
        const response: any = await masterdataService.get(ApiURL.plans, {
          params: { 
            page: 1, 
            pageSize: 20,
            ...(selectedProduct !== "All" && selectedProduct && { productId: selectedProduct }),
          },
        });
  
        if (response?.data?.data && Array.isArray(response.data.data)) {
          const list = response.data.data.map((prod: any) => ({
            label: prod.name,
            value: prod.id,
          }));
          
          const updatedList = [{ label: "PLAN NAME", value: "All" }, ...list];
          
          setPlanOptions(updatedList);
          setSelectedPlan(updatedList[0].value);
        }
      } catch (error: any) {
        handleResponseError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlanFilter().then();

    if (selectedProduct && selectedProduct !== "All" && selectedProduct !== "") fetchPlanFilter().then();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct]);

  const groupedData: Record<string, { name: string; value: number }> = (Array.isArray(claimStatisticData) ? claimStatisticData : []).reduce((acc, item) => {
      if (item?.type) {
        if (!acc[item.type]) { acc[item.type] = { name: item.type, value: 0 };
        } acc[item.type].value += 1;
      }
      return acc;
    }, {} as Record<string, { name: string; value: number }>
  );

  const pieChart: { name: string; value: number }[] = Object.values(groupedData);

  const lineChart = Array.isArray(claimStatisticData)
  ? claimStatisticData
      .map((item) => ({
        date: format(new Date(item.created_at), "yyyy-MM-dd"),
        count: totalClaim,
        total_claim_amount: totalClaimAmount,
      }))
      .reduce(
        (acc: { date: string; count: number; total_claim_amount: number }[], record) => {
          const existing = acc.find((item) => item.date === record.date);
          if (existing) {
            existing.count += record.count;
            existing.total_claim_amount += record.count; 
          } else {
            acc.push({ 
              date: record.date, 
              count: totalClaim, 
              total_claim_amount: totalClaimAmountApproved
            });
          }
          return acc;
        },
        []
      )
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
      {} as Record<string, { status: string; count: number }>
    )
  ) as { status: string; count: number }[]; 

  const tableData = Array.isArray(claimStatisticData) ? claimStatisticData.map((item) => ({
    created_at: formatDateTimeWithTZ(item.created_at),
    number: item.number,
    type: item.type,
    amount: `${formatMoney(item.amount)}`,
    amount_approved: `${formatMoney(item.amount_approved)}`,
    status: item.status
  })): [];

  return (
    <div className="mx-auto py-5 px-7 bg-[#ebf6ff] min-h-screen">
      <div className="text-center bg-white px-5 py-4 rounded-md shadow-sm mb-5">
        <h5 className="text-2xl font-bold text-primary">
          Insurance Claim Performance Dashboard
        </h5>
      </div>
      
      <div className="flex gap-3">
        <div className="grid grid-cols-4 gap-4 mb-4 w-full">
          <Select
            chevronColor={primary}
            placeholderSelectClassName="truncate"
            additionalClassNameSelect="pl-4 shadow h-[46px]"
            withBorder={false}
            value={selectedInsurance}
            onChange={(value) => { setSelectedInsurance(value.toString());}}
            options={insuranceOptions}
          />
          <Select
            chevronColor={primary}
            placeholderSelectClassName="truncate"
            additionalClassNameSelect="pl-4 shadow h-[46px]"
            withBorder={false}
            disabled={selectedInsurance === "All" || selectedInsurance === ""}
            value={selectedProduct}
            onChange={(value) => { setSelectedProduct(value.toString());}}
            options={productOptions}
          />
          <Select
            chevronColor={primary}
            placeholderSelectClassName="truncate"
            additionalClassNameSelect="pl-4 shadow h-[46px]"
            withBorder={false}
            disabled={selectedProduct === "All" || selectedProduct === ""}
            value={selectedPlan}
            onChange={(value) => { setSelectedPlan(value.toString());}}
            options={planOptions}
          />
          <DatePickerDropdown onDateChange={handleDateChange} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-white p-5 rounded-md shadow-sm text-center flex flex-col items-center justify-center">
          <p className="text-3xl font-bold text-center">{numberSimpleFormatter(totalClaimAmount)}</p>
          <h5 className="text-xs">Total Claim Amount</h5>
        </div>
        <div className="bg-white p-5 rounded-md shadow-sm text-center flex flex-col items-center justify-center">
          <p className="text-3xl font-bold text-center">{numberSimpleFormatter(totalClaimAmountApproved)}</p>
          <h5 className="text-xs">Total Claim Amount Approved</h5>
        </div>
        <div className="bg-white p-5 rounded-md shadow-sm text-center flex flex-col items-center justify-center">
          <p className="text-3xl font-bold text-center">{numberSimpleFormatter(totalClaim)}</p>
          <h5 className="text-xs">Total Claim</h5>
        </div>
        <div className="bg-white p-5 rounded-md shadow-sm text-center flex flex-col items-center justify-center">
          <p className="text-3xl font-bold text-center">{numberSimpleFormatter(totalClaimApproved)}</p>
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
          <div className="bg-white p-5 rounded-md shadow-sm w-full table-claim">
            <h5 className="font-semibold mb-3">Detail Claim</h5>
              <DetailTable data={tableData} columns={claimColumns} />
          </div>
        </div>
      </div>
    </div>
  );
};
