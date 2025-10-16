"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import WithSidebar from "@/hoc/with-sidebar";
import { useEffect, useMemo, useState } from "react";
import { useBilling, useChannel, useTransaction } from "../hook";
import { useProduct } from "../../../masterdata/product/hooks";
import { useScreen } from "@/context/screen.context";
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
import { CheckIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate, formatMoney } from "@/lib/formatter";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProductCategoriesService } from "@/services/masterdata/product-category.service";
import AppURL from "@/constants/app-url.const";

const CreateBillingPage = () => {
  const { channelList, getChannel } = useChannel();
  const { fetchInsurances, insurances } = useProduct();
  const [categories, setCategories] = useState<any[]>([]);
  const { transactionList, getTransactions, setTransactionList } =
    useTransaction();
  const {
    getFees,
    getChannelFees,
    fees,
    clearFees,
    createBilling,
    checkDuplicateBilling,
  } = useBilling();
  const [type, setType] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [list, setList] = useState<any[]>([]);
  const { setLoading } = useScreen();
  const [month, setMonth] = useState<any>(null);
  const [year, setYear] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [billingNotExist, setBillingNotExist] = useState(true);
  const [existingBillingId, setExistingBillingId] = useState<string>("");
  const processedTransactionList = useMemo(() => {
    if (!transactionList.data) {
      return [];
    }
    return transactionList.data.map((data: any) => {
      const premium = parseFloat(data.insurance.premium);
      const currency = data.insurance.currency;
      let newPremium = premium;
      if (type == "partner") {
        if (
          !fees[
            `${company}-${data.insurance?.insurance?.id?.id}-${data.insurance?.product?.id}-${data.insurance?.plan?.id}`
          ]
        ) {
          getChannelFees(
            company,
            data.insurance?.insurance?.id?.id,
            data.insurance?.product?.id,
            data.insurance?.plan?.id
          );
        }
      } else if (type == "insurer") {
        if (
          !fees[
            `${data.insurance?.insurance?.id?.id}-${data.insurance?.product?.id}-${data.insurance?.plan?.id}`
          ]
        ) {
          getFees(
            data.insurance?.insurance?.id?.id,
            data.insurance?.product?.id,
            data.insurance?.plan?.id
          );
        }
      }
      if (currency !== "IDR" && data.insurance.insurance.currencies) {
        const currencyData = data.insurance.insurance.currencies.find(
          (c: any) => c.currency_from === currency && c.currency_to === "IDR"
        );

        newPremium = premium * (currencyData?.value ?? 1);
      }
      data.currency = currency;
      return {
        ...data,
        newPremium,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionList]);

  const handleRowsPerPageChange = (e: any) => {
    setPage(1);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const productCategoriesService = new ProductCategoriesService();
      const categoriesResponse = await productCategoriesService.getCategories();
      setCategories(categoriesResponse);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
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

  // useEffect(() => {
  //   handleGetTransaction();
  // }, [rowsPerPage]);

  const handleGetTransaction = async () => {
    setTransactionList({});
    clearFees();
    if (!month && !year && !company && !type) {
      alert("Please fill all fields");
      return;
    }

    try {
      const billing = await checkDuplicateBilling(
        type,
        company,
        `${year}-${month}`
      );
      if (billing.data.length) {
        setBillingNotExist(false);
        setExistingBillingId(billing.data[0].id);
        return;
      }
      setBillingNotExist(true);
      setExistingBillingId("");
    } catch (error: any) {
      alert(error.message);
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
    try {
      setLoading(true);
      await getTransactions({
        ...companySearch,
        category: category != "All" ? category : null,
        from: `${year}-${month}-01`,
        to: `${year}-${month}-31`,
        page: page,
        limit: 100000000, // untuk sementara
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
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
        category: category != "All" ? category : null,
        from: `${year}-${month}-01`,
        to: `${year}-${month}-31`,
        page: page,
        limit: 100000000, //untuk sementara
      });
    })();
  };

  const router = useRouter();
  const handleCreateBilling = async () => {
    if (!processedTransactionList.length) {
      alert("No transaction to create billing");
      return;
    }
    const detail = [];
    let totalCommission = 0;
    for (let data of processedTransactionList) {
      let commission;
      let commission_percentage;
      if (type == "insurer") {
        commission =
          ((fees[
            `${data.insurance?.insurance?.id?.id}-${data.insurance?.product?.id}-${data.insurance?.plan?.id}`
          ]?.fee ?? 0) /
            100) *
          data.newPremium;

        commission_percentage =
          fees[
            `${data.insurance?.insurance?.id?.id}-${data.insurance?.product?.id}-${data.insurance?.plan?.id}`
          ]?.fee ?? 0;
      } else if (type == "partner") {
        commission =
          ((fees[
            `${company}-${data.insurance?.insurance?.id?.id}-${data.insurance?.product?.id}-${data.insurance?.plan?.id}`
          ]?.fee ?? 0) /
            100) *
          data.newPremium;

        commission_percentage =
          fees[
            `${company}-${data.insurance?.insurance?.id?.id}-${data.insurance?.product?.id}-${data.insurance?.plan?.id}`
          ]?.fee ?? 0;
      }

      detail.push({
        transaction: data.id,
        invoice_no: data.invoice ?? "",
        transaction_no: data.invoice ?? "",
        product: data.insurance.product.id,
        plan: data.insurance.plan.id,
        amount: data.newPremium,
        commission_percentage: commission_percentage,
        commission_amount: commission,
        details: {
          plan_name: data.insurance.plan.name,
          product_name: data.insurance.product.name,
          transaction_date: data.created_at,
          insurance_name: data.insurance?.insurance?.id?.name,
        },
        category: category != "All" ? category : null,
      });
      if (type === "insurer") {
        totalCommission += commission!;
      } else if (type === "partner") {
        totalCommission += commission!; //data.newPremium;
      }
    }
    try {
      setLoading(true);
      await createBilling({
        currency: "IDR",
        billing_details: detail,
        status: "pending-reconcilliation",
        amount: totalCommission,
        type,
        company,
        company_name: companyName,
        transaction_period: `${year}-${month}`,
        category: category != "All" ? category : null,
      });
      localStorage.setItem(
        "billingPage",
        JSON.stringify({ type: type, company: company, category: "All" })
      );
      router.push(AppURL.financeBilling);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(AppURL.financeBilling);
  };
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
            onClick={handleCancel}
            className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </div>

          <Button
            onClick={() => handleCreateBilling()}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
          >
            <CheckIcon className="w-5 h-5 mr-1 " /> Create Billing
          </Button>
        </div>
      </div>

      <div className="pt-5 md:px-6 p-4 m-5 bg-white">
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Choose Type
        </label>
        <div>
          <Select
            value={type}
            onValueChange={(value) => {
              handleChangeType(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"partner"}>Partner</SelectItem>
              <SelectItem value={"insurer"}>Insurer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="pt-5 bg-white rounded-lg flex-col gap-4 grid sm:grid-cols-2">
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {type == "insurer"
                ? "Choose Insurance Company"
                : "Choose Partner"}
            </label>
            <Select
              value={company}
              onValueChange={(value) => {
                const selectedCompany = list.find((item) => item.id === value);
                setCompany(value);
                setCompanyName(selectedCompany?.name || "");
                setCategory("All");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                {list &&
                  list.map((data) => {
                    return (
                      <SelectItem key={data.id} value={data.id}>
                        {data.name}
                      </SelectItem>
                    );
                  })}
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
              onValueChange={(value) => {
                const selectedCategory = categories.find(
                  (item) => item.id === value
                );
                setCategory(value);
                if (type && company && category && month && year) {
                  setTransactionList({});
                }
                // setCategoryName(selectedCategory?.name || "");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem key={-1} value={"All"}>
                All Category
              </SelectItem> */}
                {categories &&
                  categories.map((data) => {
                    return (
                      <SelectItem key={data.id} value={data.id}>
                        {data.name}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-5 bg-white rounded-lg flex-col gap-4 grid sm:grid-cols-2">
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Choose Month
            </label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Choose Month" />
              </SelectTrigger>
              <SelectContent>
                {months &&
                  months.map((data) => {
                    return (
                      <SelectItem key={data.value} value={data.value}>
                        {data.name}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Choose Year
            </label>
            <Input
              type="text"
              value={year}
              placeholder="Year"
              onChange={handleChangeYear}
            />
          </div>
        </div>

        <div className="pt-5">
          <Button
            disabled={
              type && company && category && month && year ? false : true
            }
            onClick={() => handleGetTransaction()}
            className="ml-auto rounded-full"
          >
            Get Transactions
          </Button>
        </div>
        <div className="pt-5">
          <Alert hidden={billingNotExist} variant={"destructive"}>
            <AlertDescription>
              Billing already exist, click here to view detail{" "}
              <Button
                onClick={() =>
                  router.push(
                    `${AppURL.financeBillingDetail}/${existingBillingId}`
                  )
                }
              >
                Link
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <div>
        <div className="p-4 md:p-6 m-5 bg-white rounded-lg overflow-x-auto">
          <Table className="table-claims w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Number</TableHead>
                <TableHead>Plan Name</TableHead>
                {type === "partner" ? (
                  <TableHead>Insurance Company Name</TableHead>
                ) : (
                  ""
                )}
                <TableHead>Transaction Date</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead style={{ textAlign: "right" }}>Amount</TableHead>
                {type === "insurer" ? (
                  <TableHead>Commision Percentage</TableHead>
                ) : (
                  ""
                )}
                {type === "insurer" ? (
                  <TableHead>Commision Amount</TableHead>
                ) : (
                  ""
                )}
                {/* <TableHead>Commision Percentage</TableHead>
                <TableHead className="text-right">Commision Amount</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedTransactionList &&
                processedTransactionList.map((data: any) => {
                  let fee;
                  if (type == "insurer") {
                    fee =
                      fees[
                        `${data.insurance?.insurance?.id?.id}-${data.insurance?.product?.id}-${data.insurance?.plan?.id}`
                      ]?.fee &&
                      formatMoney(
                        ((fees[
                          `${data.insurance?.insurance?.id?.id}-${data.insurance?.product?.id}-${data.insurance?.plan?.id}`
                        ]?.fee ?? 0) /
                          100) *
                          data.newPremium
                      );
                  } else if (type == "partner") {
                    fee =
                      fees[
                        `${company}-${data.insurance?.insurance?.id?.id}-${data.insurance?.product?.id}-${data.insurance?.plan?.id}`
                      ]?.fee &&
                      formatMoney(
                        ((fees[
                          `${company}-${data.insurance?.insurance?.id?.id}-${data.insurance?.product?.id}-${data.insurance?.plan?.id}`
                        ]?.fee ?? 0) /
                          100) *
                          data.newPremium
                      );
                  }
                  return (
                    <TableRow key={data.id}>
                      <TableCell>{data.invoice}</TableCell>
                      <TableCell>
                        {data.insurance?.plan?.name.split("|").join("\n")}
                      </TableCell>
                      {type === "partner" ? (
                        <TableCell>
                          {data.insurance?.insurance?.id?.name}
                        </TableCell>
                      ) : (
                        ""
                      )}
                      <TableCell>
                        {formatDate(data.created_at, "YYYY-MM-DD")}
                      </TableCell>
                      <TableCell>{data.currency}</TableCell>
                      <TableCell className="text-right w-1">
                        {formatMoney(data.newPremium)}
                      </TableCell>
                      {
                        type === "insurer" ? (
                          <TableCell className="w-1">
                            {type === "insurer" &&
                            fees[
                              `${data.insurance?.insurance?.id?.id}-${data.insurance?.product?.id}-${data.insurance?.plan?.id}`
                            ]?.fee
                              ? fees[
                                  `${data.insurance?.insurance?.id?.id}-${data.insurance?.product?.id}-${data.insurance?.plan?.id}`
                                ]?.fee ?? 0
                              : 0}
                          </TableCell>
                        ) : (
                          ""
                        )

                        // <TableCell className="w-1">
                        //   {type === "partner" &&
                        //     fees[
                        //       `${company}-${data.insurance?.insurance?.id?.id}-${data.insurance?.product?.id}-${data.insurance?.plan?.id}`
                        //     ]?.fee
                        //     ? fees[
                        //       `${company}-${data.insurance?.insurance?.id?.id}-${data.insurance?.product?.id}-${data.insurance?.plan?.id}`
                        //     ]?.fee ?? 0
                        //     : 0}
                        // </TableCell>
                      }
                      {
                        type === "insurer" ? (
                          <TableCell className="text-right w-1">
                            {fee}
                          </TableCell>
                        ) : (
                          ""
                        )
                        // <TableCell className="text-right w-1">{fee}</TableCell>
                      }
                    </TableRow>
                  );
                })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={10}>
                  <div className="flex justify-center items-center gap-2 font-normal">
                    <label htmlFor="rowsPerPage">Showing:</label>
                    {/* <select
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
                    </select> */}
                    <span className="mr-2">
                      {transactionList?.data?.length} of {transactionList.total}{" "}
                      items
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
                      disabled={page === transactionList.pageTotal}
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

// const CreateBillingWithSidebar = (params: any) =>
//   WithSidebar(CreateBillingPage)(params);
export default CreateBillingPage;
