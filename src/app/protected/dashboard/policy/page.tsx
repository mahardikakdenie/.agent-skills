"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PolicyData, PolicyService } from "@/services/policy.service";
import { InsuranceService } from "@/services/insurance.services";
import { ProductService } from "@/services/product.services";
import { PlanService } from "@/services/plan.services";
import { Controller, useForm } from "react-hook-form";
import { numberSimpleFormatter } from "@/lib/formatter";

import PieChart from "@/components/ui/recharts/piechart";
import LineChart from "@/components/ui/recharts/linechart-policy";
import DetailTable from "@/components/ui/recharts/table-policy";
import DatePickerDropdown from "@/components/ui/date-range-picker";
import WithSidebar from "@/hoc/with-sidebar";

const policyColumns = [
  { key: "number", label: "Number" },
  { key: "plan_name", label: "Plan Name" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Created At" },
];

const DashboardPolicy = () => {
    const [ policiesStatisticData, setPoliciesStatisticData ] = useState<PolicyData | null>(null);
    const [ totalPolicies, setTotalPolicies ] = useState<number>(0);
    const [ totalPremium, setTotalPremium ] = useState<number>(0);
    const [ selectedProduct, setSelectedProduct ] = useState<string>("");
    const [ productOptions, setProductOptions ] = useState<any[]>([]);
    const [ selectedInsuranceId, setSelectedInsuranceId ] = useState("");
    const [ insuranceOptions, setInsuranceOptions ] = useState<any[]>([]);
    const [ selectedPlan, setSelectedPlan ] = useState<string>("");
    const [ planOptions, setPlanOptions ] = useState<any[]>([]);
    const [ from, setFrom ] = useState("");
    const [ to, setTo ] = useState("");

    const handleDateChange = (startDate: string, endDate: string) => {
        setFrom(startDate);
        setTo(endDate);
    };
    
    const policyService = new PolicyService();
    const insuracesService = new InsuranceService();
    const productService = new ProductService();
    const planService = new PlanService();
    
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
    
    useEffect(() => {
        const fetchDataPolicy = async () => {
        try {
            const response = await policyService.getPolicyStatistic(1, 10, {
                insurance: selectedInsuranceId !== 'All' ? selectedInsuranceId : undefined,
                product: selectedProduct !== 'All' ? selectedProduct : undefined,
                plan: selectedPlan !== 'All' ? selectedPlan : undefined,
                date_from: from,
                date_to: to,
            });
    
            if (response?.data) {
                setPoliciesStatisticData(response.data);
                setTotalPolicies(response.total);
                setTotalPremium(response.total_premium);
            }
        } finally {
            // setLoading(false);
        }
        };
    
        fetchDataPolicy();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProduct, selectedInsuranceId, selectedPlan, from, to]);
  
    useEffect(() => {
        const fetchInsuranceFilter = async () => {
        try {
            // setLoading(true);
            const response = await insuracesService.getAllInsurances();

            if (response?.data) {
            const list = response.data.map((ins: { name: string; id: string }) => ({
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
            const response = await productService.getProductByInsuranceId(
                insuranceId !== 'All' && insuranceId ? [insuranceId] : [],
                100,
                page
            );

            if (response?.data) {
                const list = response.data.map((prod: { name: string; id: string }) => ({
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
            const response = await planService.getPlansByProductId(
                productId !== 'All' && productId ? [productId] : [],
                100,
                page
            );

            if (response?.data) {
                const list = response.data.map((prod: { name: string; id: string }) => ({
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
        created_at: format(new Date(item.created_at), "dd-MM-yyyy"),
        }))
    : [];

    return (
        <div className="w-full p-5 bg-[#ebf6ff] min-h-screen">
            <div className="text-center bg-primary px-5 py-4 rounded-md shadow-sm mb-5">
                <h5 className="text-2xl font-bold text-white">Insurance Policy Performance Dashboard</h5>
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


const DashboardPolicyWithSidebar = (params: any) => WithSidebar(DashboardPolicy)(params);
export default DashboardPolicyWithSidebar;