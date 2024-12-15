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
import { EndorsementService } from "@/services/endorsement.service";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Download, Search } from "react-feather";
import { Button } from "@/components/ui/button";
import noData from "/public/images/no-data.webp";
import Image from "next/image";
import _ from "lodash";
import { Input } from "@/components/ui/input";
import jsPDF from "jspdf";
import ExportPage from "./export/page";

const EndorsementPage = () => {
  useRequireAuth();
  const path = usePathname();
  const endorsementService = new EndorsementService();
  const [filteredEndorsement, setFilteredEndorsement] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();
  const [tab, setTab] = useState("All");
  const [totalData, setTotalData] = useState(0);
  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await endorsementService.getEndorsement(
          page,
          rowsPerPage,
          tab === "All" ? "" : tab,
          searchData
        );

        setFilteredEndorsement(res.data);
        setPage(res.page);
        setTotalPages(res.pageTotal);
        setTotalItems(res.total);
        setTotalData(res.total);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [page, rowsPerPage, tab, searchData]);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const selectTab = (tab: string) => {
    setTab(tab);
    setPage(1);
  };

  const goToDetail = (endorsementId: string) => {
    router.push(`${path}/${endorsementId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-[#CC9B36]";
      case "Approved":
        return "text-[#00AB4F]";
      case "Rejected":
        return "text-[#939597]";
      default:
        return "text-[#CC9B36]";
    }
  };

  const handleSearch = _.debounce((keyword: string) => {
    setSearchData(keyword);
  }, 100);
  return (
    <div className="flex flex-col w-full p-4 md:p-6 ">
      <div className="flex gap-4 pb-4 items-center">
        <h1 className="text-black font-bold text-2xl mt-2">Endorsement List</h1>
        <Button
          onClick={() => router.push(`${path}/export`)}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <Download className="w-5 h-5 mr-1 " /> Export
        </Button>
      </div>

      <div className="block bg-white rounded-md mb-3">
        <div className="w-full flex items-center overflow-auto">
          <div
            onClick={() => selectTab("All")}
            className={`cursor-pointer h-full min-h-16 flex items-center justify-center px-5 ${
              tab === "All" && "border-b-[3px] border-primary px-5"
            }`}
          >
            <button
              className={`text-sm mr-3 h-16 ${tab === "All" && "text-primary"}`}
            >
              All Endorsement
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
            onClick={() => selectTab("Pending")}
            className={`cursor-pointer h-full min-h-16 flex items-center justify-center px-5 ${
              tab === "Pending" && "border-b-[3px] border-primary px-5"
            }`}
          >
            <button
              className={`text-sm mr-3 h-16 ${
                tab === "Pending" && "text-primary"
              }`}
            >
              Waiting
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
          <div
            onClick={() => selectTab("Approved")}
            className={`cursor-pointer h-full min-h-16 flex items-center justify-center px-5 ${
              tab === "Approved" && "border-b-[3px] border-primary px-5"
            }`}
          >
            <button
              className={`text-sm mr-3 h-16 ${
                tab === "Approved" && "text-primary"
              }`}
            >
              Approved
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
                totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
              } ${tab !== "Approved" && "hidden"}`}
            >
              {totalData}
              <span
                className={`${totalData < 100 && "hidden"}`}
                style={{ fontSize: "10px" }}
              ></span>
            </span>
          </div>
          <div
            onClick={() => selectTab("Rejected")}
            className={`cursor-pointer h-full min-h-16 flex items-center justify-center px-5 ${
              tab === "Rejected" && "border-b-[3px] border-primary px-5"
            }`}
          >
            <button
              className={`text-sm mr-3 h-16 ${
                tab === "Rejected" && "text-primary"
              }`}
            >
              Reject
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
                totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
              } ${tab !== "Rejected" && "hidden"}`}
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
      <div className="w-full bg-white rounded-lg">
        <div className="sm:p-6 p-4">
          <div className="relative w-full ml-auto">
            <Input
              type="text"
              placeholder="Search by Name"
              onChange={(e) => handleSearch(e.target.value)}
              className="border p-3 rounded-md pr-10 w-full"
            />
            <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#016da1]" />
          </div>
        </div>
        <Table className="table-claims">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap py-2">No.</TableHead>
              <TableHead className="py-2">Request ID</TableHead>
              <TableHead className="py-2">Insured Name</TableHead>
              <TableHead className="py-2">Policy Number</TableHead>
              <TableHead className="whitespace-nowrap py-2">
                Request Date
              </TableHead>
              <TableHead className="whitespace-nowrap py-2">
                Approve Date
              </TableHead>
              <TableHead className="whitespace-nowrap py-2">Status</TableHead>
              <TableHead className="whitespace-nowrap py-2">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEndorsement.length > 0 ? (
              filteredEndorsement.map((endorsement, index) => (
                <TableRow key={endorsement.id}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      {endorsement.number}
                    </div>
                  </TableCell>
                  <TableCell>
                    {endorsement?.participants?.full_name || "-"}
                  </TableCell>
                  <TableCell>{endorsement.policies?.number || "-"}</TableCell>
                  <TableCell>
                    {endorsement?.created_at
                      ? new Date(endorsement.created_at).toLocaleDateString(
                          "en-GB"
                        )
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {endorsement?.status === "Approved" &&
                    endorsement?.updated_at
                      ? new Date(endorsement.updated_at).toLocaleDateString(
                          "en-GB"
                        )
                      : endorsement?.status === "Approved"
                      ? "-"
                      : null}
                  </TableCell>
                  <TableCell className="font-semibold whitespace-nowrap">
                    <span className={getStatusColor(endorsement.status)}>
                      {endorsement.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => goToDetail(endorsement.id)}
                      className="rounded-full"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:!bg-white">
                <TableCell colSpan={10}>
                  <div className="flex flex-col gap-4 items-center justify-center py-14">
                    <Image alt="no data" src={noData} width={200} /> No
                    transaction data available
                  </div>
                </TableCell>{" "}
              </TableRow>
            )}
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
  WithSidebar(EndorsementPage)(params);
export default TransactionWithSidebar;
