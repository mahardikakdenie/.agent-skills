"use client";
import WithSidebar from "@/hoc/with-sidebar";
import * as XLSX from "xlsx";
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
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Download, Upload } from "react-feather";
import { hasPermission } from "@/context/auth.context";
import { Button } from "@/components/ui/button";
import { NewPromotionCampaign } from "@/app/promotion/dto/promotion.dto";
import { AxiosResponse } from "axios";

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
  const [filterBy, setFilterBy] = useState<string>("all");
  const [promotion, setPromotion] = useState<NewPromotionCampaign>({
    campaign_id: "",
    name: "",
    type: "embedded",
    start_date: "",
    end_date: "",
    value: 0,
    active: true,
    value_currency: "IDR",
    value_type: "fixed",
    minimum_amount: 0,
    maximum_amount: 0,
    embedded_discount_channels: [],
    embedded_discount_insurances: [],
    embedded_discount_plans: [],
    embedded_discount_products: [],
    vouchers: [],
  });
  const router = useRouter();

  
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
    defaultValues: {
      filter: "all",
      sort: "date"
    },
  });


  useEffect(() => {
    const checkAccess = async () => {
      const access = await hasPermission("Report.Read");
      const deleteBtn = await hasPermission("Report.Delete");
      const editBtn = await hasPermission("Report.Update");

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
    setPage(1);
  }, [filterBy, sortBy]);


  useEffect(() => {
    setPromotions([]);
    setTotalItems(0);
    setTotalPages(1);
  
    if (hasAccess) {
      promotionService
        .getPromotionCampaignReport(page, rowsPerPage, sortBy, filterBy)
        .then((res) => {
          setPromotions(res.data);
          setTotalItems(res.total);
          setTotalPages(res.pageTotal);
        })
        .catch((error) => {
          console.error("Failed to fetch promotion reports:", error);
        });
    }
  }, [hasAccess, page, rowsPerPage, sortBy, filterBy]);
  

  if (hasAccess === null) {
    return <div>Loading...</div>;
  }

  const handleDownloadReport = async () => {
    try {
      console.log(`Downloading report sorted by ${sortBy} and filtered by ${filterBy}`);
      
      const response: AxiosResponse<any> = await promotionService.getPromotionCampaignExportReport(
        sortBy,
        filterBy
      );
      const { data } = response;
  
      // Transform data for Excel
      const reportData = data.map((promotion: any) => ({
        "Campaign Name": promotion.campaign_name || "",
        "Type": promotion.type || "",
        "Insurance Company Name": promotion.insurance_name || "N/A",
        "Plan Name": promotion.plan_name || "N/A",
        "Transaction Amount": promotion.total_transaction_amount || 0,
        "Discount Amount": promotion.total_discount_amount || 0,
      }));
  
      // Create a new workbook and add data
      const worksheet = XLSX.utils.json_to_sheet(reportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Campaign Report");
  
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Campaign_Report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      console.log("Report downloaded successfully.");
    } catch (error) {
      console.error("Failed to download the report:", error);
    }
  };

  const handleChangeFilter = (value: string) => {
    setFilterBy(value);
  };

  const handleChangeSort = (value: string) => {
    setSortBy(value);
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
            <Controller
              name="sort"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    handleChangeSort(value);
                    field.onChange(value);
                  }}
                  disabled={false}
                  required
                >
                  <SelectTrigger className="w-full h-16 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2 mt-1">
                    {" "}
                    {/* Match height and margin */}
                    <SelectValue placeholder="Select a Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex flex-col items-start">
            <label htmlFor="filterBy" className="text-sm font-medium mb-1">
              Filter by:
            </label>
            <Controller
              name="filter"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    handleChangeFilter(value);
                    field.onChange(value);
                  }}
                  disabled={false}
                  required
                >
                  <SelectTrigger className="w-full h-16 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2 mt-1">
                    {" "}
                    {/* Match height and margin */}
                    <SelectValue placeholder="Select a Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="embedded">Embedded</SelectItem>
                      <SelectItem value="voucher">Voucher</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
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
          <TableBody>
          {promotions.map((promotion) => (
              <TableRow key={promotion.campaign_id}>
                <TableCell>{promotion.campaign_name}</TableCell>
                <TableCell>{promotion.type}</TableCell>
                <TableCell>{promotion.insurance_name}</TableCell>
                <TableCell>{promotion.plan_name}</TableCell>
                <TableCell>{promotion.total_transaction_amount}</TableCell>
                <TableCell>{promotion.total_discount_amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
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
