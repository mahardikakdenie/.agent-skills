"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { useBilling } from "../hook";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import AppURL from "@/constants/app-url.const";
import { DataTable } from "@/components/ui/DataTable";
import { createBillingTransactionTableColumns } from "@/components/tableConfig/billingTransactionTableConfig";
import { financeService } from "@/services/finance/api/finance.service";
import { generateYears, generateMonths } from "@/lib/utils";
import { Alert } from "@repo/ui";

const CreateBillingPage = () => {
  const router = useRouter();

  const {
    channels,
    insurances,
    categories,
    transactions,
    isLoadingTransactions,
    fetchTransactions,
    createBilling,
    checkDuplicateBilling,
  } = useBilling();

  const [type, setType] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const [billingNotExist, setBillingNotExist] = useState(true);
  const [existingBillingId, setExistingBillingId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingFees, setIsLoadingFees] = useState(false);

  const [feesMap, setFeesMap] = useState<any>({});

  const companies = type === "insurer" ? insurances : channels;

  const months = generateMonths();

  const years = generateYears();

  const processedTransactions = useMemo(() => {
    return transactions.map((transaction: any) => {
      const premium = parseFloat(transaction.insurance.premium);
      const currency = transaction.insurance.currency;
      let newPremium = premium;

      if (currency !== "IDR" && transaction.insurance.insurance.currencies) {
        const currencyData = transaction.insurance.insurance.currencies.find(
          (c: any) => c.currency_from === currency && c.currency_to === "IDR"
        );
        newPremium = premium * (currencyData?.value ?? 1);
      }

      const insuranceId = transaction.insurance?.insurance?.id?.id;
      const productId = transaction.insurance?.product?.id;
      const planId = transaction.insurance?.plan?.id;

      const feeKey =
        type === "partner"
          ? `${company}-${insuranceId}-${productId}-${planId}`
          : `${insuranceId}-${productId}-${planId}`;

      return {
        ...transaction,
        newPremium,
        currency,
        feeKey,
        insuranceId,
        productId,
        planId,
      };
    });
  }, [transactions, type, company]);

  useEffect(() => {
    if (!processedTransactions.length || !type) return;

    const fetchAllFees = async () => {
      setIsLoadingFees(true);
      const newFeesMap: any = {};

      try {
        const uniqueFeeKeys = new Set<string>();
        const feeRequests: Array<{
          key: string;
          insuranceId: string;
          productId: string;
          planId: string;
        }> = [];

        processedTransactions.forEach((transaction: any) => {
          if (!uniqueFeeKeys.has(transaction.feeKey)) {
            uniqueFeeKeys.add(transaction.feeKey);
            feeRequests.push({
              key: transaction.feeKey,
              insuranceId: transaction.insuranceId,
              productId: transaction.productId,
              planId: transaction.planId,
            });
          }
        });

        const feePromises = feeRequests.map(async (req) => {
          try {
            if (type === "partner") {
              const feesResponse: any = await financeService.getChannelFeesFilter(
                {
                  channelId: company,
                  insuranceId: req.insuranceId,
                }
              );

              if (feesResponse && feesResponse.data.length > 0) {
                return {
                  key: req.key,
                  fee: {
                    channel: company,
                    insurance: feesResponse.data[0].insurance,
                    fee: feesResponse.data[0].fee,
                    fee_type: feesResponse.data[0].fee_type,
                  },
                };
              }
            } else if (type === "insurer") {
              const feesResponse: any = await financeService.getBrokerFeesFilter(
                {
                  insuranceId: req.insuranceId,
                  productId: req.productId,
                  planId: req.planId,
                }
              );

              if (feesResponse && feesResponse.data.length > 0) {
                return {
                  key: req.key,
                  fee: {
                    insurance: feesResponse.data[0].insurance,
                    fee: feesResponse.data[0].fee,
                    fee_type: feesResponse.data[0].fee_type,
                  },
                };
              }
            }

            return {
              key: req.key,
              fee: { insurance: "", fee: 0, fee_type: "" },
            };
          } catch (error) {
            console.error(`Error fetching fee for ${req.key}:`, error);
            return {
              key: req.key,
              fee: { insurance: "", fee: 0, fee_type: "" },
            };
          }
        });

        const results = await Promise.all(feePromises);

        results.forEach((result) => {
          if (result) {
            newFeesMap[result.key] = result.fee;
          }
        });

        setFeesMap(newFeesMap);
      } catch (error) {
        console.error("Error fetching fees:", error);
      } finally {
        setIsLoadingFees(false);
      }
    };

    fetchAllFees();
  }, [processedTransactions, type, company]);

  const handleGetTransaction = async () => {
    if (!month || !year || !company || !type || !category) {
      alert("Please fill all fields");
      return;
    }

    try {
      const billing = await checkDuplicateBilling(
        type,
        company,
        `${year}-${month.padStart(2, "0")}`
      );

      if (billing.data.length) {
        setBillingNotExist(false);
        setExistingBillingId(billing.data[0].id);
        return;
      }

      setBillingNotExist(true);
      setExistingBillingId("");

      await fetchTransactions({
        type,
        company,
        category,
        from: `${year}-${month.padStart(2, "0")}-01`,
        to: `${year}-${month.padStart(2, "0")}-31`,
        page: 1,
        limit: 100000000,
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleCreateBilling = async () => {
    if (!processedTransactions.length) {
      alert("No transaction to create billing");
      return;
    }

    setIsSubmitting(true);

    try {
      const detail = processedTransactions.map((transaction: any) => {
        const feePercentage = feesMap[transaction.feeKey]?.fee ?? 0;
        const commission = (feePercentage / 100) * transaction.newPremium;

        return {
          transaction: transaction.id,
          invoice_no: transaction.invoice ?? "",
          transaction_no: transaction.invoice ?? "",
          product: transaction.insurance.product.id,
          plan: transaction.insurance.plan.id,
          amount: transaction.newPremium,
          commission_percentage: feePercentage,
          commission_amount: commission,
          details: {
            plan_name: transaction.insurance.plan.name,
            product_name: transaction.insurance.product.name,
            transaction_date: transaction.created_at,
            insurance_name: transaction.insurance?.insurance?.id?.name,
          },
          category: category !== "All" ? category : null,
        };
      });

      const totalCommission = detail.reduce(
        (sum, item) => sum + item.commission_amount,
        0
      );

      await createBilling({
        currency: "IDR",
        billing_details: detail,
        status: "pending-reconcilliation",
        amount: totalCommission,
        type,
        company,
        company_name: companyName,
        transaction_period: `${year}-${month.padStart(2, "0")}`,
        category: category !== "All" ? category : null,
      });

      router.push(`${AppURL.financeBilling}?type=${type}&channel=${company}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create billing");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = createBillingTransactionTableColumns({
    type,
    fees: feesMap,
    company,
  });

  return (
    <div className="flex flex-col w-full">
      <div className="bg-white md:px-6 p-4 flex items-center">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={AppURL.financeBilling}>
                  Billing
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create Billing</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
            Create Billing
          </h2>
        </div>
        <div className="flex space-x-4 ml-auto">
          <div
            onClick={() => router.push(AppURL.financeBilling)}
            className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </div>

          <Button
            onClick={handleCreateBilling}
            disabled={
              !processedTransactions.length || isSubmitting || isLoadingFees
            }
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full disabled:opacity-50"
          >
            <CheckIcon className="w-5 h-5 mr-1" />
            {isSubmitting ? "Creating..." : "Create Billing"}
          </Button>
        </div>
      </div>

      <div className="pt-5 md:px-6 p-4 m-5 bg-white rounded-lg">
        <div className="space-y-5">
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Choose Type
            </label>
            <Select
              value={type}
              onValueChange={(value) => {
                setType(value);
                setCompany("");
                setCompanyName("");
                setCategory("");
                setFeesMap({});
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="partner">Partner</SelectItem>
                <SelectItem value="insurer">Insurer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {type === "insurer"
                  ? "Choose Insurance Company"
                  : "Choose Partner"}
              </label>
              <Select
                value={company}
                disabled={!type}
                onValueChange={(value) => {
                  const selectedCompany = companies.find(
                    (item) => item.id === value
                  );
                  setCompany(value);
                  setCompanyName(selectedCompany?.name || "");
                  setCategory("");
                  setFeesMap({});
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose Company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((data) => (
                    <SelectItem key={data.id} value={data.id}>
                      {data.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Choose Category
              </label>
              <Select
                value={category}
                disabled={!company}
                onValueChange={setCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((data) => (
                    <SelectItem key={data.id} value={data.id}>
                      {data.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="month"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Choose Month
              </label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((data) => (
                    <SelectItem key={data.value} value={data.value}>
                      {data.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Choose Year
              </label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Button
              disabled={!type || !company || !category || !month || !year}
              onClick={handleGetTransaction}
              className="rounded-full disabled:opacity-50"
            >
              Get Transactions
            </Button>
          </div>

          {isLoadingFees && (
            <Alert>
              Loading fee information for {processedTransactions.length}{" "}
              transactions...
            </Alert>
          )}

          {!billingNotExist && (
            <Alert variant="destructive">
              Billing already exists.{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-white underline"
                onClick={() =>
                  router.push(
                    `${AppURL.financeBillingDetail}/${existingBillingId}?channel=${company}&type=${type}`
                  )
                }
              >
                Click here to view detail
              </Button>
            </Alert>
          )}
        </div>
      </div>

      <div className="p-4 md:p-6 m-5 bg-white rounded-lg">
        <DataTable
          data={processedTransactions}
          columns={columns}
          loading={isLoadingTransactions || isLoadingFees}
          noDataText="No transactions available. Please select filters and click 'Get Transactions'"
          className="table-claims"
        />
      </div>
    </div>
  );
};

export default CreateBillingPage;
