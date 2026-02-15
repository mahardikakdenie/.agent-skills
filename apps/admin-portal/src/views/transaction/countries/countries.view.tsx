import React, { useState, useEffect } from "react";
import {usePathname, useRouter} from "next/navigation";
import {defaultChart, homeCard, primary} from "@/constants/app-common.const";
import {policyService} from "@/services/policy/api/policy.service";
import {transactionService} from "@/services/transaction/api/transaction.service";
import {useScreen} from "@/context/screen.context";
import Chart from "@/components/chart";
import {capitalizeString, getHeaderPage, moneyFormatter, numberSimpleFormatter} from "@/helpers/app.helper";
import {useAuth} from "@/context/auth.context";
import {CountryData} from "@/types/common";
import {TransactionStatisticYearly} from "@/types/transaction";
import Select from "@/components/select";
import GlobeLocationIcon from "@/images/globe-location.icon";
import {PolicyStatisticYearly} from "@/types/policy";

export const CountriesView = () => {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalPolicies, setTotalPolicies] = useState(0);
    const [selectedCountry, setSelectedCountry] = useState("All");
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
            const responseTransactionCountriesStatisticYearly: TransactionStatisticYearly = await transactionService.getTransactionStatisticsYearly({ year: currentYear }) as TransactionStatisticYearly;
            if (responseTransactionCountriesStatisticYearly) {
                const months = responseTransactionCountriesStatisticYearly.months;
                const revenueCountriesMap: CountryData = {};

                Object.values(months).forEach(month => {
                    Object.keys(month.country).forEach(country => {
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
                const optionList = [{ value: "All", label: "All Countries" }];
                revenueArray.forEach(item => {
                    const country = Object.keys(item)[0];
                    optionList.push({ value: country, label: capitalizeString(country) });
                });

                setCountryOptionList(optionList);

                if (country !== "All") {
                    const revenueCountryMonthly: number[] = [];
                    Object.values(months).forEach(item => {
                        const countryData = item.country[country];
                        if (countryData) revenueCountryMonthly.push(countryData.revenue);
                        else revenueCountryMonthly.push(0);
                    });
                    setRevenueCurrentYear(revenueCountryMonthly);
                    setTotalRevenue(revenueCountryMonthly.reduce((accumulator, current) => accumulator + current, 0));
                } else {
                    setRevenueCurrentYear(Object.values(months).map((month: any) => month?.revenue));
                    setTotalRevenue(Object.values(months).reduce((total, month) => total + month?.revenue, 0));
                }
            }

            const responsePoliciesCountriesStatisticYearly: PolicyStatisticYearly = await policyService.getPolicyStatisticsYearly({ year: currentYear }) as PolicyStatisticYearly;
            if (responsePoliciesCountriesStatisticYearly) {
                const months = responsePoliciesCountriesStatisticYearly.months;

                if (country !== "All") {
                    const policiesMonthly: number[] = [];
                    Object.values(months).forEach(item => {
                        const countryData = item.country[country];
                        if (countryData) policiesMonthly.push(countryData);
                        else policiesMonthly.push(0);
                    });
                    setPoliciesCurrentYear(policiesMonthly);
                    setTotalPolicies(policiesMonthly.reduce((accumulator, current) => accumulator + current, 0));
                } else {
                    setPoliciesCurrentYear(Object.values(months).map(month => month.total));
                    setTotalPolicies(Object.values(months).reduce((accumulator, month) => accumulator + month.total, 0));
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
            }
        ]
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
            }
        ]
    };

    const formatNumber = (name: string, isSimple: boolean = false, currency: string = "IDR") => {
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
        <div className="mx-auto py-5 px-7">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
                <p className="font-bold text-lg">{getHeaderPage(2, path, true).pageName}</p>
                <div className="w-full lg:w-40 rounded-md shadow mt-2 lg:mt-0">
                    <Select icon={GlobeLocationIcon(undefined, undefined, "24", "24", "0 0 54 54")} value={selectedCountry} onChange={(event) => handleChangeCountry(event.toString())} options={countryOptionList}/>
                </div>
            </div>
            <div className="overflow-x-auto sm:scrollable flex items-center justify-between mb-10">
                {homeCard.map((hc, hcIndex) => {
                    return (hcIndex === 0 || hcIndex === 2) && (
                        <div onClick={() => !!hc.url && router.push(hc.url)} key={`home-card-${hcIndex}`} className={`${hcIndex !== 0 && "ml-3"} ${hc.url && "cursor-pointer"} min-w-[80%] lg:min-w-[21%] w-full bg-white pr-4 flex items-start justify-between rounded-md shadow`}>
                            <div className="flex items-center justify-between mr-4">
                                <div className="mr-4 p-2.5 bg-primary-light-foreground rounded-tr-full rounded-br-full" style={{borderTopLeftRadius: "1600px", borderBottomLeftRadius: "1600px"}}>
                                    {hc.icon}
                                </div>
                                <div className="my-2.5">
                                    <p className="font-bold text-primary">{formatNumber(hc.name, true)}</p>
                                    <p className="text-xs">{hc.description}</p>
                                </div>
                            </div>
                            <p title={`Year: ${currentYear}\nCountry: ${capitalizeString(selectedCountry)}\n${hc.description}: ${formatNumber(hc.name)}`} className="cursor-help my-2.5 px-1.5 text-center text-[10px] text-gray-500 border border-gray-500 rounded-full">i</p>
                        </div>
                    )
                })}
            </div>
            <div className="w-full bg-white rounded-md shadow py-4 px-5 mb-7 lg:min-h-[279px]">
                <div className="flex items-start justify-between">
                    <p className="font-bold text-primary">Total Revenue</p>
                    <p title={`Year: ${currentYear}\nCountry: ${capitalizeString(selectedCountry)}\nTotal revenue: ${formatNumber(homeCard[0].name)}`} className="cursor-help px-1.5 text-center text-[10px] text-gray-500 border border-gray-500 rounded-full">i</p>
                </div>
                {totalRevenue > 0 ? (
                    <div className="flex flex-col items-center justify-between mt-5">
                        <Chart type="curve-line" width={totalRevenue > 0 ? "90%" : "70%"} height={totalRevenue > 0 ? "203px" : "150px"} data={totalRevenue > 0 ? revenueCurrentYearData : defaultChart.data2Empty} options={totalRevenue > 0 ? defaultChart.options1 : defaultChart.options1Empty}/>
                        <p className={`${totalRevenue > 0 && "hidden"} mt-3 text-center text-gray-500 text-sm`}>This section will present a graphical overview of the number of revenue for each month over the course of a year.</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-between mt-5">
                        <Chart type="curve-line" width="90%" height="203px" data={revenueCurrentYearData} options={defaultChart.options1}/>
                    </div>
                )}
            </div>
            <div className="w-full bg-white rounded-md shadow py-4 px-5 mb-7 lg:min-h-[279px]">
                <div className="flex items-start justify-between">
                    <p className="font-bold text-primary">Total Policies</p>
                    <p title={`Year: ${currentYear}\nCountry: ${capitalizeString(selectedCountry)}\nTotal policies: ${formatNumber(homeCard[2].name)}`} className="cursor-help px-1.5 text-center text-[10px] text-gray-500 border border-gray-500 rounded-full">i</p>
                </div>
                {totalPolicies > 0 ? (
                    <div className="flex flex-col items-center justify-between mt-5">
                        <Chart type="stacked-bar" width={totalPolicies > 0 ? "90%" : "30%"} height={totalPolicies > 0 ? "203px" : "150px"} data={totalPolicies > 0 ? policiesCurrentYearData : defaultChart.data1Empty} options={totalPolicies > 0 ? defaultChart.options1 : defaultChart.options1Empty}/>
                        <p className={`${totalPolicies > 0 && "hidden"} mt-3 text-center text-gray-500 text-sm`}>This section will present a graphical overview of the number of policyholders for each month over the course of a year.</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-between mt-5">
                        <Chart type="stacked-bar" width="90%" height="203px" data={policiesCurrentYearData} options={defaultChart.options1}/>
                    </div>
                )}
            </div>
        </div>
    );
};
