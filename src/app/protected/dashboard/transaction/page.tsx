"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { InsuranceService } from "@/services/insurance.services";
import { ProductService } from "@/services/product.services";
import { PlanService } from "@/services/plan.services";
import { Transaction, TransactionService } from "@/services/transaction.service";
import { formatDateTimeWithTZ, formatMoney } from "@/lib/formatter";
import { Controller, useForm } from "react-hook-form";

import PieChart from "@/components/ui/recharts/piechart";
import LineChart from "@/components/ui/recharts/dashedlinechart";
import DetailTable from "@/components/ui/recharts/table-policy";
import DatePickerDropdown from "@/components/ui/date-range-picker";
import BarChartComp from "@/components/ui/recharts/barchart-horizontal";
import WithSidebar from "@/hoc/with-sidebar";

const policyColumns = [
  { key: "created_at", label: "Created At" },
  { key: "plan_name", label: "Plan Name" },
  { key: "price", label: "Price" },
  { key: "transaction", label: "Transaction" },
];

const DashboardTransaction = () => {
    const [transactionStatisticData, setTransactionStatisticData] = useState<Transaction | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<string>("");
    const [productOptions, setProductOptions] = useState<any[]>([]);
    const [selectedInsuranceId, setSelectedInsuranceId] = useState("");
    const [insuranceOptions, setInsuranceOptions] = useState<any[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<string>("");
    const [planOptions, setPlanOptions] = useState<any[]>([]);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const handleDateChange = (startDate: string, endDate: string) => {
        setFrom(startDate);
        setTo(endDate);
    };

    const transactionService = new TransactionService();
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
  
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() - 30);

    useEffect(() => {
        const fetchDataTransaction = async () => {
        try {
            const response = await transactionService.getTransactionStatistic(1, {
            insurance: selectedInsuranceId !== 'All' ? selectedInsuranceId : undefined,
            product: selectedProduct !== 'All' ? selectedProduct : undefined,
            plan: selectedPlan !== 'All' ? selectedPlan : undefined,
            from: from || thirtyDaysLater.toISOString().split("T")[0],
            to: to || today.toISOString().split("T")[0], 
            });
    
            if (response?.data) {
            setTransactionStatisticData(response.data);
            }
        } finally {
            // setLoading(false);
        }
        };
    
        fetchDataTransaction();
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
  
    const groupedData: { name: string; value: number }[] =  Array.isArray(transactionStatisticData)? transactionStatisticData
        .map((item: any) => item.transaction_packages || [])
        .reduce((acc, curr) => acc.concat(curr), [])
        .map((product: any) => product.package_data.plan)
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

    const lineChart = Array.isArray(transactionStatisticData)
    ? transactionStatisticData
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

    const barChart = Object.values(
        (Array.isArray(transactionStatisticData) ? transactionStatisticData : [])
        .reduce(
            (acc, policy) => {
                const formattedDate = format(new Date(policy.created_at), "yyyy-MM-dd");
                const price = parseFloat(policy.transaction_packages?.[0]?.price) || 0;
        
                if (!acc[formattedDate]) {
                    acc[formattedDate] = { status: formattedDate, count: 0 };
                }
                acc[formattedDate].count += price;
                return acc;
            },
            {} as Record<string, { status: string; count: number }>
        )
    ) as { status: string; count: number }[];
    
    const tableData = Array.isArray(transactionStatisticData) ? transactionStatisticData.map((item) => {
        return {
            created_at: formatDateTimeWithTZ(item.created_at),
            plan_name: item.transaction_packages?.[0]?.package_data?.plan?.name,
            price: `${item.transaction_packages?.[0]?.currency} ${formatMoney(item.transaction_packages?.[0]?.price)}`,
            transaction: item.transaction_packages?.[0]?.quantity,
        };
    }): [];


    return (
        <div className="w-full bg-[#ebf6ff] p-5 bg-blue min-h-screen">
            <div className="text-center bg-primary px-5 py-4 rounded-md shadow-sm mb-5">
                <h5 className="text-2xl font-bold text-white">Insurance Sales Performance Dashboard</h5>
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
                <div className="col-span-6">
                    <div className="bg-white py-5 rounded-md shadow-sm w-full">
                        <h5 className="font-semibold mb-3 pl-5">Daily Sales Performance</h5>
                        <div className="h-[400px]">
                        <LineChart data={lineChart} />
                        </div>
                    </div>
                </div>
                <div className="col-span-6">
                    <div className="bg-white pt-5 rounded-md shadow-sm">
                        <h5 className="font-semibold pl-5">Daily GWP Performance</h5>
                        <div className="w-full h-[431px]">
                        <BarChartComp data={barChart} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                    <div className="bg-white p-5 rounded-md shadow-sm">
                        <h5 className="font-semibold">Total Sales by Plan Name</h5>
                        <div className="w-full h-[403px]">
                            <PieChart data={pieChart} />
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="bg-white p-5 rounded-md shadow-sm w-full table-transaction min-h-[466px]">
                        <h5 className="font-semibold mb-3">Latest Transactions</h5>
                        <DetailTable data={tableData} columns={policyColumns} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardTransactionWithSidebar = (params: any) => WithSidebar(DashboardTransaction)(params);
export default DashboardTransactionWithSidebar;
