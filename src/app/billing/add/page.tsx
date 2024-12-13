"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WithSidebar from "@/hoc/with-sidebar";
import useRequireAuth from "@/hooks/useRequireAuth";
import { useEffect, useMemo, useState } from "react";
import { useBilling, useChannel, useTransaction } from "./../hook";
import { useProduct } from "../../masterdata/product/hooks";
import { useLoading } from "@/context/loading.context";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { channel } from "diagnostics_channel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMoney } from "@/lib/formatter";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const CreateBillingPage = () => {
  useRequireAuth();

  const { channelList, getChannel } = useChannel();
  const { fetchInsurances, insurances } = useProduct();
  const { transactionList, getTransactions } = useTransaction();
  const { getFees, fees, createBilling } = useBilling();
  const [type, setType] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [list, setList] = useState<any[]>([]);
  const { setLoading } = useLoading();
  const [month, setMonth] = useState<any>(null);
  const [year, setYear] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const [totalAmount, setTotalAmount] = useState(0);

  const processedTransactionList = useMemo(() => {
    if (!transactionList.data) {
      return [];
    }
    return transactionList.data.map((data: any) => {
      const premium = parseFloat(data.insurance.premium);
      const currency = data.insurance.currency;
      let newPremium = premium;
      if (!fees[data.insurance.insurance.id.id]) {
        getFees(data.insurance.insurance.id.id);
      }

      if (currency !== "IDR" && data.insurance.insurance.currencies) {
        const currencyData = data.insurance.insurance.currencies.find(
          (c: any) => c.currency_from === currency && c.currency_to === "IDR"
        );

        newPremium = premium * currencyData.value;
      }

      setTotalAmount((prev) => {
        return prev + newPremium;
      });

      return {
        ...data,
        newPremium,
      };
    });
  }, [transactionList]);
  const handleRowsPerPageChange = (e: any) => {
    setRowsPerPage(e.target.value);
  };
  useEffect(() => {
    if (type === "insurer") {
      (async () => {
        setLoading(true);
        setList([]);
        await fetchInsurances("");
        setLoading(false);
      })();
    } else if (type === "partner") {
      (async () => {
        setLoading(true);
        setList([]);
        await getChannel();
        setLoading(false);
      })();
    }
  }, [type]);

  useEffect(() => {
    if (type === "insurer") {
      setList(insurances);
    } else if (type === "partner") {
      setList(channelList);
    }
  }, [type, channelList, insurances]);

  const handleChangeType = (value: string) => {
    setType(value);
  };

  const months = [
    {
      value: "1",
      name: "January",
    },
    {
      value: "2",
      name: "February",
    },
    {
      value: "3",
      name: "March",
    },
    {
      value: "4",
      name: "April",
    },
    {
      value: "5",
      name: "May",
    },
    {
      value: "6",
      name: "June",
    },
    {
      value: "7",
      name: "July",
    },
    {
      value: "8",
      name: "August",
    },
    {
      value: "9",
      name: "September",
    },
    {
      value: "10",
      name: "October",
    },
    {
      value: "11",
      name: "November",
    },
    {
      value: "12",
      name: "December",
    },
  ];

  const handleChangeYear = (e: any) => {
    setYear(e.target.value);
  };

  const handleGetTransaction = () => {
    if (!month && !year && !company && !type) {
      alert("Please fill all fields");
      return;
    }
    const search = {
      status: "Declaration",
      limit: rowsPerPage,
    };

    let companySearch;
    if (type === "insurer") {
      companySearch = {
        insurance: company,
        ...search,
      };
    } else if (type === "partner") {
      companySearch = {
        channel: company,
        ...search,
      };
    }
    getTransactions({
      ...companySearch,
      from: `${year}-${month}-01`,
      to: `${year}-${month}-31`,
      page: 1,
    });
  };

  const handlePaging = (page: number) => {
    setPage(page);
    (async () => {
      const search = {
        status: "Declaration",
        limit: rowsPerPage,
      };

      let companySearch;
      if (type === "insurer") {
        companySearch = {
          insurance: company,
          ...search,
        };
      } else if (type === "partner") {
        companySearch = {
          channel: company,
          ...search,
        };
      }
      await getTransactions({
        ...companySearch,
        from: `${year}-${month}-01`,
        to: `${year}-${month}-31`,
        page: page,
      });
    })();
  };

  useEffect(() => {
    if (transactionList.data) {
      setTotalItems(transactionList.total);
    }
  }, [transactionList]);

  const router = useRouter();
  const handleCreateBilling = async () => {
    if (!processedTransactionList.length) {
      alert("No transaction to create billing");
      return;
    }
    try {
      setLoading(true);
      await createBilling({
        currency: "IDR",
        billing_details: processedTransactionList.map((data: any) => {
          return {
            transaction: data.id,
            invoice_no: data.invoice ?? "",
            transaction_no: data.invoice ?? "",
            product: data.insurance.product.id,
            plan: data.insurance.plan.id,
            amount: data.newPremium,
            commission_percentage: fees[data.insurance.insurance.id.id]?.fee,
            commission_amount:
              ((fees[data.insurance?.insurance?.id?.id]?.fee ?? 0) / 100) *
              data.newPremium,
            details: {
              plan_name: data.insurance.plan.name,
              transaction_date: data.created_at,
              insurance_name: data.insurance.insurance.id.name,
            },
          };
        }),
        status: "waiting-for-payment",
        amount: totalAmount,
      });
      router.push("/billing");
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/billing");
  };
  return (
    <div className="flex flex-col w-full">
      <div className="bg-white md:px-6 p-4 flex items-center">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Billing</BreadcrumbLink>
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
            onClick={handleCancel}
            className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </div>
          <Button
            className="bg-green-600"
            onClick={() => handleCreateBilling()}
          >
            Create Billing
          </Button>
        </div>
      </div>

      <div className="pt-5 md:px-6 p-4 m-5 bg-white">
        <div>
          <Select
            value={type}
            onValueChange={(value) => {
              handleChangeType(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"partner"}>Partner</SelectItem>
              <SelectItem value={"insurer"}>Insurer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="pt-5">
          <Select value={company} onValueChange={setCompany}>
            <SelectTrigger>
              <SelectValue placeholder="Choose Company" />
            </SelectTrigger>
            <SelectContent>
              {list &&
                list.map((data) => {
                  return (
                    <SelectItem
                      key={data.id}
                      onSelect={() => setCompany(data.name)}
                      value={data.id}
                    >
                      {data.name}
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-5 grid grid-cols-2">
          <div>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Choose Month" />
              </SelectTrigger>
              <SelectContent>
                {months &&
                  months.map((data) => {
                    return (
                      <SelectItem
                        key={data.value}
                        onSelect={() => setCompany(data.name)}
                        value={data.value}
                      >
                        {data.name}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Input
              className="ml-2"
              type="text"
              value={year}
              placeholder="Year"
              onChange={handleChangeYear}
            />
          </div>
        </div>

        <div className="pt-5">
          <Button className="btn-primary" onClick={handleGetTransaction}>
            Get Transactions
          </Button>
        </div>
      </div>
      <div>
        <div className="p-4 md:p-6 m-5 bg-white rounded-lg overflow-x-auto">
          <Table className="table-claims w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Number</TableHead>
                <TableHead>Plan Name</TableHead>
                <TableHead>Insurance Company Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Transaction Date</TableHead>
                <TableHead>Commision Percentage</TableHead>
                <TableHead>Commision Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedTransactionList &&
                processedTransactionList.map((data: any) => {
                  return (
                    <TableRow key={data.id}>
                      <TableCell>{data.invoice}</TableCell>
                      <TableCell>
                        {data.insurance?.plan?.name.split("|").join("\n")}
                      </TableCell>
                      <TableCell>
                        {data.insurance?.insurance?.id?.name}
                      </TableCell>
                      <TableCell>{formatMoney(data.newPremium)}</TableCell>
                      <TableCell>{data.created_at}</TableCell>
                      <TableCell>
                        {fees[data.insurance?.insurance?.id?.id]?.fee ?? 0}
                      </TableCell>
                      <TableCell>
                        {fees[data.insurance?.insurance?.id?.id]?.fee &&
                          formatMoney(
                            ((fees[data.insurance?.insurance?.id?.id]?.fee ??
                              0) /
                              100) *
                              data.newPremium
                          )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={10}>
                  <div className="flex justify-center items-center gap-2 font-normal">
                    <label htmlFor="rowsPerPage">Showing:</label>
                    <select
                      id="rowsPerPage"
                      value={rowsPerPage}
                      onChange={handleRowsPerPageChange}
                      className="p-2 border rounded"
                    >
                      {[10, 20, 30, 50, 100].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <span className="mr-2">
                      of {transactionList.total} items
                    </span>
                    <button
                      onClick={() => handlePaging(page - 1)}
                      disabled={page === 1}
                      title="Prev"
                    >
                      <ChevronLeft />
                    </button>
                    <button
                      onClick={() => handlePaging(page + 1)}
                      disabled={page === totalPages}
                      title="Next"
                    >
                      <ChevronRight />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
};

const CreateBillingWithSidebar = (params: any) =>
  WithSidebar(CreateBillingPage)(params);
export default CreateBillingWithSidebar;
