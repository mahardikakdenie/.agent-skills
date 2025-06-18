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
import { PromotionService } from "@/services/promotion.service";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { startOfMonth, endOfMonth } from "date-fns";
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
import { ChevronLeft, ChevronRight, Download, Upload, X } from "react-feather";
import { hasPermission } from "@/context/auth.context";
import { Button } from "@/components/ui/button";
import { NewPromotionCampaign } from "@/app/protected/promotion/dto/promotion.dto";
import { AxiosResponse } from "axios";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { InsuranceService } from "@/services/insurance.services";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

interface InsuranceOption {
  id: string;
  name: string;
}

const ReportCampaignPage = () => {
  const promotionService = new PromotionService();
  const insuranceService = new InsuranceService();
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
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [insuranceOptions, setInsuranceOptions] = useState<InsuranceOption[]>(
    []
  );
  const [selectedInsurance, setSelectedInsurance] = useState<
    string | undefined
  >(undefined);
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

  const { handleSubmit, reset, control } = useForm({
    shouldUnregister: false,
    defaultValues: {
      filter: "all",
      sort: "date",
      insurance: "",
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
    if (filterBy == "insurance") {
      fetchInsuranceOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterBy]);

  useEffect(() => {
    setPromotions([]);
    setTotalItems(0);
    setTotalPages(1);

    if (hasAccess) {
      if (
        filterBy === "insurance" &&
        selectedInsurance !== undefined &&
        selectedInsurance !== ""
      ) {
        // Fetch promotion report based on selected insurance
        promotionService
          .getPromotionCampaignReportInsurance(
            page,
            rowsPerPage,
            sortBy,
            selectedInsurance,
            date?.from,
            date?.to
          )
          .then((res) => {
            setPromotions(res.data);
            setTotalItems(res.total);
            setTotalPages(res.pageTotal);
          })
          .catch((error) => {
            console.error("Failed to fetch promotion reports:", error);
          });
      } else {
        // Fetch promotion report based on the selected filter (non-insurance)
        promotionService
          .getPromotionCampaignReport(
            page,
            rowsPerPage,
            sortBy,
            filterBy,
            date?.from,
            date?.to
          )
          .then((res) => {
            setPromotions(res.data);
            setTotalItems(res.total);
            setTotalPages(res.pageTotal);
          })
          .catch((error) => {
            console.error("Failed to fetch promotion reports:", error);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAccess, page, rowsPerPage, sortBy, filterBy, selectedInsurance, date]);

  const fetchInsuranceOptions = async () => {
    try {
      const options = await insuranceService.getAllInsurances();
      const formattedOptions: InsuranceOption[] = options.data.map(
        (insurance: { id: string; name: string }) => ({
          id: insurance.id,
          name: insurance.name,
        })
      );
      setInsuranceOptions(formattedOptions);
    } catch (error) {
      console.error("Failed to fetch insurance options:", error);
    }
  };

  if (hasAccess === null) {
    return <div>Loading...</div>;
  }

  const handleClear = () => {
    setDate(undefined);
  };

  const handleDownloadReport = async () => {
    try {
      if (
        filterBy === "insurance" &&
        selectedInsurance !== undefined &&
        selectedInsurance !== ""
      ) {
        const response: AxiosResponse<any> =
          await promotionService.getPromotionCampaignExportReportInsurance(
            sortBy,
            selectedInsurance,
            date?.from,
            date?.to
          );
        const { data } = response;

        // Transform data for Excel
        const reportData = data.map((promotion: any) => ({
          "Campaign Name": promotion.campaign_name || "",
          Type: promotion.type || "",
          "Insurance Company Name": promotion.insurance_name || "N/A",
          "Plan Name": promotion.plan_name || "N/A",
          "Transaction Amount": promotion.total_transaction_amount || 0,
          "Discount Amount":
            promotion.total_transaction_amount -
              promotion.total_discount_amount || 0,
          "Transaction Amount after Discount":
            promotion.total_discount_amount || 0,
        }));

        // Create a new workbook and add data
        const worksheet = XLSX.utils.json_to_sheet(reportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Campaign Report");

        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        const blob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Campaign_Report.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        const response: AxiosResponse<any> =
          await promotionService.getPromotionCampaignExportReport(
            sortBy,
            filterBy,
            date?.from,
            date?.to
          );
        const { data } = response;

        // Transform data for Excel
        const reportData = data.map((promotion: any) => ({
          "Campaign Name": promotion.campaign_name || "",
          Type: promotion.type || "",
          "Insurance Company Name": promotion.insurance_name || "N/A",
          "Plan Name": promotion.plan_name || "N/A",
          Currency: promotion.currency || "N/A",
          "Transaction Amount": promotion.total_transaction_amount || 0,
          "Discount Amount":
            promotion.total_transaction_amount -
              promotion.total_discount_amount || 0,
          "Transaction Amount after Discount":
            promotion.total_discount_amount || 0,
        }));

        // Create a new workbook and add data
        const worksheet = XLSX.utils.json_to_sheet(reportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Campaign Report");

        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        const blob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Campaign_Report.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.error("Failed to download the report:", error);
    }
  };

  const handleChangeFilter = (value: string) => {
    setFilterBy(value);
    if (value !== "insurance") {
      setSelectedInsurance(undefined);
      reset({ filter: value, insurance: "" });
    } else {
      reset({ filter: value });
    }
  };

  const handleChangeSort = (value: string) => {
    setSortBy(value);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Report</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Campaign Report</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
            Promotions Campaign Report
          </h2>
        </div>

        {/* Container for Date Picker and Download Button */}
        <div className="flex items-center gap-4">
          {/* Date Picker */}
          <div className="flex gap-2 sm:w-auto w-full relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "sm:w-[280px] w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={new Date()}
                  selected={date}
                  onSelect={(range) => setDate(range)}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button
              onClick={handleClear}
              disabled={!date}
              className={cn(
                "font-semibold bg-transparent hover:bg-transparent p-0 text-red-700 text-sm cursor-pointer absolute right-2",
                !date && "text-gray-500 cursor-not-allowed"
              )}
              title="Clear"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Download Report Button */}
          <Button
            onClick={handleDownloadReport}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full flex items-center"
          >
            <Download className="w-5 h-5 mr-1" /> Download Report
          </Button>
        </div>
      </div>

      <div className="pt-5 md:px-6 p-4 m-5 bg-white">
        <div>
          <label
            htmlFor="sort"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sort By
          </label>
          <Controller
            name="sort"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || sortBy}
                onValueChange={(value) => {
                  handleChangeSort(value);
                  field.onChange(value);
                }}
                required
              >
                <SelectTrigger
                  id="sort"
                  className="w-full h-10 border-gray-300 bg-transparent py-2"
                >
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
        <div className="pt-5">
          <label
            htmlFor="filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter By
          </label>
          <Controller
            name="filter"
            control={control}
            defaultValue={filterBy}
            render={({ field }) => (
              <Select
                value={filterBy}
                onValueChange={(value) => {
                  handleChangeFilter(value);
                  field.onChange(value);
                }}
                required
              >
                <SelectTrigger
                  id="filter"
                  className="w-full h-10 border-gray-300 bg-transparent py-2"
                >
                  <SelectValue placeholder="Select a Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="embedded">Embedded</SelectItem>
                    <SelectItem value="voucher">Voucher</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {filterBy === "insurance" && (
          <div className="pt-5">
            <label
              htmlFor="insurance"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Insurance
            </label>
            <Controller
              name="insurance"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || selectedInsurance}
                  onValueChange={(value) => {
                    setSelectedInsurance(value); // Update the selected insurance
                    field.onChange(value); // Update the form value
                  }}
                  required
                >
                  <SelectTrigger
                    id="insurance"
                    className="w-full h-10 border-gray-300 bg-transparent py-2"
                  >
                    <SelectValue placeholder="Select an Insurance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {insuranceOptions.map((insurance) => (
                        <SelectItem key={insurance.id} value={insurance.id}>
                          {insurance.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-md p-4 sm:p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ textAlign: "center" }}>
                Campaign Name
              </TableHead>
              <TableHead style={{ textAlign: "center" }}>Type</TableHead>
              <TableHead style={{ textAlign: "center" }}>
                Insurance Company Name
              </TableHead>
              <TableHead style={{ textAlign: "center" }}>Plan Name</TableHead>
              <TableHead style={{ textAlign: "center" }}>
                Transaction Amount
              </TableHead>
              <TableHead style={{ textAlign: "center" }}>
                Discount Amount
              </TableHead>
              <TableHead style={{ textAlign: "center" }}>
                Transaction Amount after Discount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow key={promotion.campaign_id}>
                <TableCell align="center">{promotion.campaign_name}</TableCell>
                <TableCell align="center">{promotion.type}</TableCell>
                <TableCell align="center">{promotion.insurance_name}</TableCell>
                <TableCell align="center">{promotion.plan_name}</TableCell>
                <TableCell align="center">
                  {promotion.currency}{" "}
                  {Number(promotion.total_transaction_amount).toLocaleString()}
                </TableCell>
                <TableCell align="center">
                  {promotion.currency}{" "}
                  {Number(
                    promotion.total_transaction_amount -
                      promotion.total_discount_amount
                  ).toLocaleString()}
                </TableCell>
                <TableCell align="center">
                  {Number(promotion.total_discount_amount).toLocaleString()}
                </TableCell>
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
