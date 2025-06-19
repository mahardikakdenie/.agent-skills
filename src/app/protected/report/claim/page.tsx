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
import { ClaimService } from "@/services/claim.service";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Download, X } from "react-feather";
import { hasPermission } from "@/context/auth.context";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { FORBIDDEN } from "@/constants/routes";

const ReportClaimPage = () => {
  const claimService = new ClaimService();
  const [claims, setClaims] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState<string>("date");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const router = useRouter();

  const { handleSubmit, reset, control } = useForm({
    shouldUnregister: false,
    defaultValues: {
      filter: "all",
      sort: "date",
    },
  });

  useEffect(() => {
    const checkAccess = async () => {
      const access = await hasPermission("Report.Read");
      setHasAccess(access);
      if (!access) {
        router.push(FORBIDDEN);
      }
    };

    checkAccess();
  }, [router]);

  useEffect(() => {
    setPage(1);
  }, [filterBy, sortBy]);

  useEffect(() => {
    if (date?.from && date?.to) {
      setClaims([]);
      setTotalItems(0);
      setTotalPages(1);

      if (hasAccess) {
        claimService
          .getClaimReport(
            page,
            rowsPerPage,
            "Data",
            date?.from.toISOString().split("T")[0],
            date?.to.toISOString().split("T")[0]
          )
          .then((res) => {
            if (res.data && res.data.length > 0) {
              // Extract headers from the first item
              const headerKeys = Object.keys(res.data[0]);
              setHeaders(headerKeys);
              setClaims(res.data);
              setTotalItems(res.total);
              setTotalPages(res.pageTotal);
            }
          })
          .catch((error) => {
            console.error("Failed to fetch claim reports:", error);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAccess, page, rowsPerPage, sortBy, date]);

  const handleClear = () => {
    setDate(undefined);
  };

  const handleDownloadReport = async () => {
    try {
      if (!date?.from || !date?.to) {
        alert("Please select a date range first");
        return;
      }

      const response = await claimService.getClaimReport(
        page,
        rowsPerPage,
        "File",
        date?.from.toISOString().split("T")[0],
        date?.to.toISOString().split("T")[0]
      );

      // Create workbook directly from the API response data
      window.location = response.file;
    } catch (error) {
      console.error("Failed to download the report:", error);
    }
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
                <BreadcrumbPage>Claim Report</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
            Claims Report
          </h2>
        </div>

        <div className="flex items-center gap-4">
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

          <Button
            onClick={handleDownloadReport}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full flex items-center"
          >
            <Download className="w-5 h-5 mr-1" /> Download Report
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-md p-4 sm:p-6">
        {!date ? (
          <div className="text-center py-10">
            Please select a date range to view the report
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                {headers.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim, index) => (
                <TableRow key={index}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  {headers.map((header) => (
                    <TableCell
                      key={header}
                      className="max-w-[200px]" // Add max width to cells
                    >
                      <div
                        className="line-clamp-3 overflow-hidden"
                        title={claim[header]?.toString() || "-"} // Show full text on hover
                      >
                        {claim[header]?.toString() || "-"}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={headers.length + 1}>
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
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      title="Previous"
                    >
                      <ChevronLeft />
                    </button>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
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
        )}
      </div>
    </div>
  );
};

const ReportClaimWithSidebar = (params: any) =>
  WithSidebar(ReportClaimPage)(params);
export default ReportClaimWithSidebar;
