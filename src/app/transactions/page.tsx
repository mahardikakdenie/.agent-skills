"use client";
import _ from "lodash";
import Image from "next/image";
import WithSidebar from "@/hoc/with-sidebar";
import useRequireAuth from "@/hooks/useRequireAuth";
import { useEffect, useState } from "react";
import { formatMoney } from "@/lib/formatter";
import { Button } from "@/components/ui/button";
import { hasPermission } from "@/context/auth.context";
import { usePathname, useRouter } from "next/navigation";
import { TransactionService } from "@/services/transaction.service";
import { ChevronLeft, ChevronRight, Download, Search, Upload, X, } from "react-feather";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger, } from "@/components/ui/drewer";

const TransactionsPage = () => {
  useRequireAuth();
  const path = usePathname();
  const transactionService = new TransactionService();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();
  const [tab, setTab] = useState("All");
  const [totalData, setTotalData] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState("");
  const [type, setType] = useState<string>("conventional");
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [submitPaid, setSubmitPaid] = useState<boolean>(false);

  const types = [
    {
      id: "conventional",
      name: "Conventional",
    },
    {
      id: "online",
      name: "Online",
    },
  ];

  useEffect(() => {
    const checkAccess = async () => {
      const access = await hasPermission("Transactions.Read");
      const editBtn = await hasPermission("Transactions.Update");

      setCanEdit(editBtn);
      setHasAccess(access);
      if (!access) {
        router.push("/forbidden");
      }
    };

    checkAccess();
  }, [router]);

  useEffect(() => {
    transactionService
      .getTransactions(
        page,
        rowsPerPage,
        type,
        searchData,
        tab == "All" ? "" : tab
      )
      .then((res) => {
        setTransactions(res.data);
        setFilteredTransactions(res.data);
        setPage(res.page);
        setTotalPages(res.pageTotal);
        setTotalItems(res.total);
        setTotalData(res.total);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, type, tab, searchData]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = transactions.filter((transaction) =>
        transaction.insurance?.insurance?.id?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions);
    }
  }, [searchTerm, transactions]);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const selectTab = (tab: string) => {
    setTab(tab);
    setPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Declaration":
        return "text-[#016DA1]";
      case "Paid":
        return "text-[#00AB4F]";
      case "Pending":
        return "text-[#CC9B36]";
      default:
        return "text-[#016DA1]";
    }
  };

  const handleUpdateToPaid = async (id: string) => {
    setSubmitPaid(true)
    try {
      await transactionService.updatePaymentTransaction(id, {
        payment_info: "Paid",
      });
      setTransactions((prevTransactions) => {
        return prevTransactions.map((transaction) =>
          transaction.id === id
            ? { ...transaction, status: "Declaration" }
            : transaction
        );
      });
    } catch (error) {
      alert(error);
    } finally {
      setSubmitPaid(false);
    }
  };

  const handleChannelChange = (v: string) => {
    setType(v);
  };

  const handleSearch = _.debounce((keyword: string) => {
    setSearchData(keyword);
  }, 100);

  const handleExport = () => {
    const exportData = {
      page,
      limit: rowsPerPage,
      status: tab === "All" ? "" : tab,
      search: searchData,
    };

    localStorage.setItem("exportTransactionData", JSON.stringify(exportData));
    router.push(`${path}/export`);
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6 ">
      <div className="flex pb-4 items-center justify-between">
        <h1 className="text-black font-bold text-2xl mt-2">Transactions</h1>
        <div className="flex gap-4">
          <div className="min-w-48">
            <Select value={type} onValueChange={handleChannelChange}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {types.map((item, index) => (
                    <SelectItem key={index} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => router.push(`${path}/add`)}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
          >
            <Upload className="w-5 h-5 mr-2" /> Add Transaction
          </Button>
          <Button
            onClick={() => router.push(`${path}/import`)}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
          >
            <Upload className="w-5 h-5 mr-2" /> Transactions List
          </Button>
          <Button
            onClick={handleExport}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
          >
            <Download className="w-5 h-5 mr-2" /> Export
          </Button>
        </div>
      </div>
      <div className="block bg-white rounded-md mb-3">
        <div className="w-full flex items-center overflow-auto">
          <div
            onClick={() => selectTab("All")}
            className={`cursor-pointer h-full flex items-center justify-center md:px-7 px-5 ${
              tab === "All" && "border-b-[3px] border-primary md:px-7 px-5"
            }`}
          >
            <button
              className={`text-sm py-5 mr-3 ${tab === "All" && "text-primary"}`}
            >
              All Transaction
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
                totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
              } ${tab !== "All" && "hidden"}`}
            >
              {totalData}
              <span
                className={`${totalData < 100 && "hidden"}`}
                style={{ fontSize: "10px" }}
              ></span>
            </span>
          </div>
          <div
            onClick={() => selectTab("Declaration")}
            className={`cursor-pointer h-full flex items-center justify-center md:px-7 px-5 ${
              tab === "Declaration" &&
              "border-b-[3px] border-primary md:px-7 px-5"
            }`}
          >
            <button
              className={`text-sm py-5 mr-3 ${
                tab === "Declaration" && "text-primary"
              }`}
            >
              Declaration
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
                totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
              } ${tab !== "Declaration" && "hidden"}`}
            >
              {totalData}
              <span
                className={`${totalData < 100 && "hidden"}`}
                style={{ fontSize: "10px" }}
              ></span>
            </span>
          </div>
          <div
            onClick={() => selectTab("Paid")}
            className={`cursor-pointer h-full flex items-center justify-center md:px-7 px-5 ${
              tab === "Paid" && "border-b-[3px] border-primary md:px-7 px-5"
            }`}
          >
            <button
              className={`text-sm py-5 mr-3 ${
                tab === "Paid" && "text-primary"
              }`}
            >
              Paid
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
                totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
              } ${tab !== "Paid" && "hidden"}`}
            >
              {totalData}
              <span
                className={`${totalData < 100 && "hidden"}`}
                style={{ fontSize: "10px" }}
              ></span>
            </span>
          </div>
          <div
            onClick={() => selectTab("Pending")}
            className={`cursor-pointer h-full flex items-center justify-center md:px-7 px-5 ${
              tab === "Pending" && "border-b-[3px] border-primary md:px-7 px-5"
            }`}
          >
            <button
              className={`text-sm py-5 mr-3 ${
                tab === "Pending" && "text-primary"
              }`}
            >
              Pending
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
                totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
              } ${tab !== "Pending" && "hidden"}`}
            >
              {totalData}
              <span
                className={`${totalData < 100 && "hidden"}`}
                style={{ fontSize: "10px" }}
              ></span>
            </span>
          </div>
        </div>
      </div>
      <div className="w-full p-4 md:p-6 bg-white rounded-lg">
        <div className="relative max-w-full w-full mb-4 ml-auto shadow-sm">
          <input
            type="text"
            placeholder="Search by Insurance Name"
            onChange={(e) => handleSearch(e.target.value)}
            className="border p-3 rounded-md pr-10 w-full"
          />
          <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#016da1]" />
        </div>
        <Table className="table-transactions">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">No.</TableHead>
              <TableHead>Insurance Name</TableHead>
              <TableHead>Plan Name</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead className="whitespace-nowrap">Currency</TableHead>
              <TableHead className="whitespace-nowrap">Amount</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction, index) => {
              const rowNumber = (page - 1) * rowsPerPage + index + 1;

              const currencies =
                transaction?.insurance?.insurance?.currencies || [];
              const currency = currencies.find(
                (currency: any) =>
                  currency.currency_from === transaction?.insurance?.currency &&
                  currency.currency_to === "IDR"
              );

              const convertedPremium =
                (currency?.value ?? 1) * transaction?.insurance?.premium;

              const discountType =
                transaction?.insurance?.plan?.premium_discount_type || "";
              const discountValue =
                transaction?.insurance?.plan?.premium_discount_value || 0;

              const premiumWithEmbeddedDiscount =
                discountType === "percentage"
                  ? convertedPremium - (discountValue / 100) * convertedPremium
                  : convertedPremium - discountValue;

              let premiumWithVoucherDiscount = premiumWithEmbeddedDiscount;
              if (transaction.voucher_info) {
                premiumWithVoucherDiscount =
                  transaction.voucher_info?.data.value_type === "percentage"
                    ? premiumWithEmbeddedDiscount -
                      (transaction.voucher_info?.data.value / 100) *
                        premiumWithEmbeddedDiscount
                    : premiumWithEmbeddedDiscount -
                      transaction.voucher_info?.data.value;
              }

              let totalPremium = premiumWithVoucherDiscount;

              if (transaction.fees) {
                totalPremium =
                  premiumWithVoucherDiscount +
                  transaction.fees
                    .map((v: any) => v.value)
                    .reduce((a: any, b: any) => {
                      return a + b;
                    }, 0);
              }

              return (
                <TableRow key={transaction.id}>
                  <TableCell>{rowNumber}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <div className="inline-flex justify-center items-center w-8 min-w-8 h-8">
                        <Image
                          src={
                            transaction?.insurance?.insurance?.id?.logo_url ||
                            "/images/no-image.png"
                          }
                          alt=""
                          width={100}
                          height={50}
                        />
                      </div>
                      {transaction?.insurance?.insurance?.id?.name || "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {transaction?.insurance?.plan?.name
                      .split("|")
                      .splice(0, 2)
                      .join(" - ") || "-"}
                  </TableCell>
                  <TableCell>{transaction?.customer?.name || "-"}</TableCell>
                  <TableCell>
                    {transaction?.insurance?.currency || "-"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatMoney(Number(totalPremium) || 0, "IDR") || "-"}
                  </TableCell>
                  <TableCell className="font-semibold whitespace-nowrap">
                    <span className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Drawer direction="right">
                      <DrawerTrigger className="bg-[#016DA1] text-white px-4 py-2 rounded-full">
                        View
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerClose className="absolute right-2 top-2">
                            <Button variant="ghost">
                              <X />
                            </Button>
                          </DrawerClose>
                          <DrawerTitle className="text-black font-bold text-2xl">
                            Transaction Details
                          </DrawerTitle>
                          <DrawerDescription>
                            <div className="flex flex-col w-full p-4 md:p-6 bg-[#F8F8F8] mt-5 rounded-xl">
                              <div className="rounded-lg flex flex-col gap-4 text-black">
                                <div className="flex gap-2 text-sm font-medium justify-start text-start">
                                  <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">
                                    Insurance Name
                                  </div>
                                  <div className="max-w-1 w-1">:</div>
                                  <div>
                                    {transaction?.insurance?.insurance?.id
                                      ?.name || "-"}
                                  </div>
                                </div>
                                <div className="flex gap-2 text-sm font-medium justify-start text-start">
                                  <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">
                                    Plan Name
                                  </div>
                                  <div className="max-w-1 w-1">:</div>
                                  <div>
                                    {transaction?.insurance?.plan?.name || "-"}
                                  </div>
                                </div>
                                <div className="flex gap-2 text-sm font-medium justify-start text-start">
                                  <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">
                                    Customer Name
                                  </div>
                                  <div className="max-w-1 w-1">:</div>
                                  <div>
                                    {transaction?.customer?.name || "-"}
                                  </div>
                                </div>
                                <div className="flex gap-2 text-sm font-medium justify-start text-start">
                                  <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">
                                    Amount
                                  </div>
                                  <div className="max-w-1 w-1">:</div>
                                  <div>
                                    {formatMoney(
                                      Number(totalPremium) || 0,
                                      "IDR"
                                    ) || "-"}
                                    {/* {formatMoney(totalPremium, "IDR")} */}
                                  </div>
                                </div>
                                <div className="flex gap-2 text-sm font-medium justify-start text-start">
                                  <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">
                                    Status
                                  </div>
                                  <div className="max-w-1 w-1">:</div>
                                  <div className="text-warning font-semibold">
                                    <span
                                      className={getStatusColor(
                                        transaction.status
                                      )}
                                    >
                                      {transaction?.status}
                                    </span>
                                  </div>
                                </div>
                                {transaction.status.toLowerCase() ===
                                  "pending" && (
                                  <div className="mt-4">
                                    <Button
                                      onClick={() =>
                                        handleUpdateToPaid(transaction.id)
                                      }
                                      disabled={!canEdit || submitPaid}
                                      className="bg-primary text-white px-4 py-2 rounded-full"
                                    >
                                      Update to Paid
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </DrawerDescription>
                        </DrawerHeader>
                      </DrawerContent>
                    </Drawer>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8}>
                <div className="flex justify-center items-center gap-2 font-normal">
                  <label htmlFor="rowsPerPage">Showing:</label>
                  <select
                    id="rowsPerPage"
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    className="p-2 border rounded"
                  >
                    {[10, 20, 30, 50].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span className="mr-2">of {totalItems} items</span>
                  <button
                    onClick={() => setPage((prevState) => prevState - 1)}
                    disabled={page === 1}
                    title="Prev"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    onClick={() => setPage((prevState) => prevState + 1)}
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
  );
};

const TransactionWithSidebar = (params: any) =>
  WithSidebar(TransactionsPage)(params);
export default TransactionWithSidebar;
