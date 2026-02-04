import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { masterdataService, policyService } from "@/services/api.service";
import { useScreen } from "@/context/screen.context";
import { useAuth } from "@/context/auth.context";
import { ListPolicyStatisticDataRequest, PolicyData } from "@/types/policy";

import PieChart from "@/components/recharts/piechart";
import LineChart from "@/components/recharts/linechart-policy";
import DetailTable from "@/components/recharts/table-policy";
import ApiURL from "@/constants/api-url.const";
import Select from "@/components/select";
import { primary } from "@/constants/app-common.const";
import DatePickerDropdown from "@/components/date-range-picker";
import { formatDateTimeWithTZ, numberSimpleFormatter } from "@/helpers/app.helper";

const policyColumns = [
  { key: "number", label: "Number" },
  { key: "plan_name", label: "Plan Name" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Created At" },
];

export const DashboardPolicy = () => {
  const { setLoading } = useScreen();
  const { handleResponseError, user } = useAuth();
  const [policiesStatisticData, setPoliciesStatisticData] = useState<PolicyData | null>(null);
  const [totalPolicies, setTotalPolicies] = useState<number>(0);
  const [totalPremium, setTotalPremium] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [productOptions, setProductOptions] = useState<any[]>([]);
  const [selectedInsurance, setSelectedInsurance] = useState<string>("");
  const [insuranceOptions, setInsuranceOptions] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [planOptions, setPlanOptions] = useState<any[]>([]);
  const [from, setFrom] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleDateChange = (startDate: string, endDate: string) => {
    setFrom(startDate);
    setTo(endDate);
  };

  useEffect(() => {
    const fetchDataPolicy = async () => {
      try {
        setLoading(true);
        const params: ListPolicyStatisticDataRequest = {
          channel: user?.all_channels?.[0] || undefined,
          sort: "desc",
          ...(selectedInsurance !== "All" && selectedInsurance && { insurance: selectedInsurance }),
          ...(selectedProduct !== "All" && selectedProduct && { product: selectedProduct }),
          ...(selectedPlan !== "All" && selectedPlan && { plan: selectedPlan }),
          ...(from && { from }),
          ...(to && { to }),
        };
  
        const response = await policyService.get(ApiURL.policiesStatisticData, { params });
  
        if (response.data) {
          setPoliciesStatisticData(response.data.data);
          setTotalPolicies(response.data.total);
          setTotalPremium(response.data.total_premium);
        }
      } catch (error: any) {
        handleResponseError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDataPolicy().then();

    if (selectedProduct && selectedInsurance && selectedPlan  && from && to) fetchDataPolicy().then();

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
  
  const groupedData: { name: string; value: number }[] =  Array.isArray(policiesStatisticData)? policiesStatisticData
    .map((item: any) => item.policy_products || [])
    .reduce((acc, curr) => acc.concat(curr), [])
    .map((product: any) => product.plan_data)
    .filter((plan: any) => plan?.name)
    .reduce((acc: Record<string, { name: string; value: number }>, item: any) => {
      if (!acc[item.name]) {
        acc[item.name] = { name: item.name, value: 0 };
      }
      acc[item.name].value += 1;
      return acc;
    }, {})
  : [];

  const pieChart = Object.values(groupedData);

  const lineChart = Array.isArray(policiesStatisticData)
  ? policiesStatisticData
      .map((item) => ({
        date: format(new Date(item.created_at), "yyyy-MM-dd"),
      }))
      .reduce(
        (acc: { date: string; count: number }[], record) => {
          const existing = acc.find((item) => item.date === record.date);
          if (existing) {
            existing.count += 1;
          } else {
            acc.push({ date: record.date, count: 1 });
          }
          return acc;
        },
        []
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  : [];

  const tableData = Array.isArray(policiesStatisticData)
  ? policiesStatisticData.map((item) => ({
      number: item.number,
      plan_name: item.policy_products?.[0]?.plan_data?.name || "-",
      status: item.status,
      created_at: formatDateTimeWithTZ(item.created_at)
    }))
  : [];

  return (
    <div className="mx-auto py-5 px-7 bg-[#ebf6ff] min-h-screen">
      <div className="text-center bg-white px-5 py-4 rounded-md shadow-sm mb-5">
        <h5 className="text-2xl font-bold text-primary">
          Insurance Policy Performance Dashboard
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
      <div className="grid grid-cols-12 gap-4 mb-4">
        <div className="col-span-4 grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-md shadow-sm text-center flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-center mb-1">{totalPolicies}</p>
              <h5 className="text-xs">Total Policies</h5>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm text-center flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-center mb-1">{numberSimpleFormatter(totalPremium)}</p>
              <h5 className="text-xs">Total GWP</h5>
            </div>
          </div>
          <div className="bg-white p-5 rounded-md shadow-sm">
            <h5 className="font-semibold">Policy Type</h5>
            <div className="w-full h-[300px]">
              <PieChart data={pieChart} />
            </div>
          </div>
        </div>
        <div className="col-span-8">
          <div className="bg-white py-5 rounded-md shadow-sm w-full">
            <h5 className="font-semibold mb-3 pl-5">
              Daily Policy Counts Trends
            </h5>
            <div className="h-[400px]">
              <LineChart data={lineChart} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-md shadow-sm w-full table-policy">
        <h5 className="font-semibold mb-3">Detail Policy</h5>
        <DetailTable data={tableData} columns={policyColumns} />
      </div>
    </div>
  );
};
