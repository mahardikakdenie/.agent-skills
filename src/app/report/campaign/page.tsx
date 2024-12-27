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
import { PromotionService } from "@/services/promotion.service";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Download, Upload } from "react-feather";
import { hasPermission } from "@/context/auth.context";
import { Button } from "@/components/ui/button";

const ReportCampaignPage = () => {
  useRequireAuth();
  const promotionService = new PromotionService();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canDelete, setCanDelete] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("date");
  const [filterBy, setFilterBy] = useState<string>("all"); // New filter state
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      const access = await hasPermission("Promotions.Read");
      const deleteBtn = await hasPermission("Promotions.Delete");
      const editBtn = await hasPermission("Promotions.Update");

      setCanDelete(deleteBtn);
      setCanEdit(editBtn);
      setHasAccess(access);
      if (!access) {
        router.push("/forbidden");
      }
    };

    checkAccess();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch data using promotionService and apply filters here
      console.log(`Fetching data with sortBy: ${sortBy}, filterBy: ${filterBy}`);
    };
    fetchData();
  }, [sortBy, filterBy, page, rowsPerPage]);

  if (hasAccess === null) {
    return <div>Loading...</div>;
  }

  const handleDownloadReport = () => {
    console.log(`Downloading report sorted by ${sortBy} and filtered by ${filterBy}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="sm:text-2xl text-xl font-semibold">
          Promotions Campaign Report
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-start">
            <label htmlFor="sortBy" className="text-sm font-medium mb-1">
              Sort by:
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border rounded bg-white text-black focus:ring focus:ring-yellow-400"
            >
              <option value="date">Date</option>
              <option value="insurance">Insurance</option>
            </select>
          </div>
          <div className="flex flex-col items-start">
            <label htmlFor="filterBy" className="text-sm font-medium mb-1">
              Filter by:
            </label>
            <select
              id="filterBy"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="p-2 border rounded bg-white text-black focus:ring focus:ring-yellow-400"
            >
              <option value="all">All</option>
              <option value="voucher">Voucher</option>
              <option value="embedded">Embedded</option>
            </select>
          </div>
          <Button
            onClick={handleDownloadReport}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full flex items-center"
          >
            <Download className="w-5 h-5 mr-1" /> Download Report
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-md p-4 sm:p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Insurance Company Name</TableHead>
              <TableHead>Plan Name</TableHead>
              <TableHead>Transaction Amount</TableHead>
              <TableHead>Discount Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{/* Table content */}</TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8}>
                <div className="flex justify-center items-center gap-2 font-normal">
                  <label htmlFor="rowsPerPage">Showing:</label>
                  <select
                    id="rowsPerPage"
                    className="p-2 border rounded"
                    value={rowsPerPage}
                    onChange={(e) => {
                      const newRowsPerPage = Number(e.target.value);
                      setRowsPerPage(newRowsPerPage);
                      setPage(1);
                    }}
                  >
                    {[10, 20, 30, 50].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span className="mr-2">of {totalItems} items</span>
                  <button
                    onClick={() => {
                      if (page > 1) {
                        setPage(page - 1);
                      }
                    }}
                    disabled={page === 1}
                    title="Previous"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    onClick={() => {
                      if (page < totalPages) {
                        setPage(page + 1);
                      }
                    }}
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

const ReportCampaignWithSidebar = (params: any) =>
  WithSidebar(ReportCampaignPage)(params);
export default ReportCampaignWithSidebar;
