"use client";
import WithSidebar from "@/hoc/with-sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useRequireAuth from "@/hooks/useRequireAuth";
import { PolicyService } from "@/services/policy.service";
import { useEffect, useState } from "react";
import { formatMoney } from "@/lib/formatter";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, X } from "react-feather";
import { Button } from "@/components/ui/button";

const PolicyPage = () => {
  useRequireAuth();
  const path = usePathname();
  const policyService = new PolicyService();
  const [policies, setPolicies] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();
  const [tab, setTab] = useState("All");
  const [totalData, setTotalData] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    policyService
      .getPolicy(page, rowsPerPage, tab == "All" ? "" : tab)
      .then((res) => {
        setPolicies(res.data);
        setFilteredTransactions(res.data);
        setPage(res.page);
        setTotalPages(res.pageTotal);
        setTotalItems(res.total);
        setTotalData(res.total);
      });
  }, [page, rowsPerPage, tab]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = policies.filter((policy) =>
        policy.declarations.transaction_data.insurance.plan.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(policies);
    }
  }, [searchTerm, policies]);

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
      case "Grace Period":
        return "text-orange-500";
      case "Expired":
        return "text-gray-400";
      default:
        return "text-[#016DA1]";
    }
  };

  const goToDetail = (policyId: string) => {
    router.push(`${path}/${policyId}`);
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6 ">
      <h1 className="text-black font-bold text-2xl mt-2 mb-4">Policy List</h1>
      <div className="flex items-center justify-start h-16 bg-white rounded-md mb-3">
        <div
          onClick={() => selectTab("All")}
          className={`cursor-pointer h-full flex items-center justify-center px-7 ${
            tab === "All" && "border-b-[3px] border-primary px-7"
          }`}
        >
          <button
            className={`text-sm py-5 mr-3 ${tab === "All" && "text-primary"}`}
          >
            All Policy
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
          onClick={() => selectTab("In Force")}
          className={`cursor-pointer h-full flex items-center justify-center px-7 ${
            tab === "In Force" && "border-b-[3px] border-primary px-7"
          }`}
        >
          <button
            className={`text-sm py-5 mr-3 ${
              tab === "In Force" && "text-primary"
            }`}
          >
            In Force
          </button>
          <span
            className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
              totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
            } ${tab !== "In Force" && "hidden"}`}
          >
            {totalData}
            <span
              className={`${totalData < 100 && "hidden"}`}
              style={{ fontSize: "10px" }}
            ></span>
          </span>
        </div>
        <div
          onClick={() => selectTab("Grace Period")}
          className={`cursor-pointer h-full flex items-center justify-center px-7 ${
            tab === "Grace Period" && "border-b-[3px] border-primary px-7"
          }`}
        >
          <button
            className={`text-sm py-5 mr-3 ${
              tab === "Grace Period" && "text-primary"
            }`}
          >
            Grace Period
          </button>
          <span
            className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
              totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
            } ${tab !== "Grace Period" && "hidden"}`}
          >
            {totalData}
            <span
              className={`${totalData < 100 && "hidden"}`}
              style={{ fontSize: "10px" }}
            ></span>
          </span>
        </div>
        <div
          onClick={() => selectTab("Expired")}
          className={`cursor-pointer h-full flex items-center justify-center px-7 ${
            tab === "Expired" && "border-b-[3px] border-primary px-7"
          }`}
        >
          <button
            className={`text-sm py-5 mr-3 ${
              tab === "Expired" && "text-primary"
            }`}
          >
            Expired
          </button>
          <span
            className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
              totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
            } ${tab !== "Expired" && "hidden"}`}
          >
            {totalData}
            <span
              className={`${totalData < 100 && "hidden"}`}
              style={{ fontSize: "10px" }}
            ></span>
          </span>
        </div>
      </div>
      <div className="w-full p-4 md:p-6 bg-white rounded-lg">
        <div className="relative max-w-full w-full mb-4 ml-auto shadow-sm">
          <input
            type="text"
            placeholder="Search by Plan Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-3 rounded-md pr-10 w-full"
          />
          <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#016da1]" />
        </div>
        <Table className="table-policies">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">No.</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Policy Number</TableHead>
              <TableHead>Plan Name</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              {/* <TableHead>Issued Date</TableHead> */}
              <TableHead className="whitespace-nowrap">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((policy, index) => {
              const rowNumber = (page - 1) * rowsPerPage + index + 1;

              return (
                <TableRow key={policy.id}>
                  <TableCell>{rowNumber}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      {policy.number}
                    </div>
                  </TableCell>
                  <TableCell>{policy.number}</TableCell>
                  <TableCell>
                    {policy.declarations.transaction_data.insurance.plan.name}
                  </TableCell>
                  <TableCell className="font-semibold whitespace-nowrap">
                    <span className={getStatusColor(policy.status)}>
                      {policy.status}
                    </span>
                  </TableCell>
                  {/* <TableCell>
                    {new Date(
                      policy.declarations.transaction_data.date
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell> */}
                  <TableCell>
                    <Button
                      onClick={() => goToDetail(policy.id)}
                      className="rounded-full"
                    >
                      View
                    </Button>
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

const TransactionWithSidebar = (params: any) => WithSidebar(PolicyPage)(params);
export default TransactionWithSidebar;
