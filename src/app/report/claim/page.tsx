"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Download, X } from "react-feather";
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
import { formatDate } from "@/lib/formatter";
import { ChannelService } from "@/services/channel.services";
import { claimService } from "@/services/api.service";
import ApiURL from "@/constants/api-url.const";
import qs from "qs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AppURL from "@/constants/app-url.const";
import { useAuth } from "@/context/auth.context";

const ReportClaimPage = () => {
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
  const [channels, setChannels] = useState<any[]>([]);
  const [searchChannel, setSearchChannel] = useState(
    "40eee5bf-2b92-4d23-be55-f9caa9d3ea88"
  ); //DEFAULT TEMAN
  const [selectedChannel, setSelectedChannel] = useState<any>({
    id: "40eee5bf-2b92-4d23-be55-f9caa9d3ea88",
    name: "Teman",
  });
  const router = useRouter();
  const { permissionList } = useAuth();
  const { handleSubmit, reset, control } = useForm({
    shouldUnregister: false,
    defaultValues: {
      filter: "all",
      sort: "date",
    },
  });

  const requestClaimReport = async (
    output: "Data" | "File",
    dateFrom?: string,
    dateTo?: string
  ) => {
    const params = {
      page,
      limit: rowsPerPage,
      channel_id: selectedChannel.id,
      output,
      ...(dateFrom && { date_from: dateFrom }),
      ...(dateTo && { date_to: dateTo }),
    };

    const queryString = qs.stringify(params, { arrayFormat: "brackets" });
    const response = await claimService.get(
      `${ApiURL.v1ClaimsExport}?${queryString}`
    );

    return response.data;
  };

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Report.Read");
      setHasAccess(access);
      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const channelService = new ChannelService();
        const channelResponse = await channelService.getChannels(
          undefined,
          100
        );
        setChannels(channelResponse.data || []);
      } catch (error) {
        console.error("Failed to fetch channels:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const channelService = new ChannelService();
        const channelResponse = await channelService.getChannels(
          undefined,
          100
        );
        setChannels(channelResponse.data || []);
      } catch (error) {
        console.error("Failed to fetch channels:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filterBy, sortBy]);

  useEffect(() => {
    const fetchClaimReports = async () => {
      if (!date?.from || !date?.to || !hasAccess) {
        return;
      }

      setClaims([]);
      setTotalItems(0);
      setTotalPages(1);

      try {
        const dateFrom = formatDate(date.from.toString(), "YYYY-MM-DD");
        const dateTo = formatDate(date.to.toString(), "YYYY-MM-DD");
        const res = await requestClaimReport("Data", dateFrom, dateTo);

        if (res?.data && res.data.length > 0) {
          const headerKeys = Object.keys(res.data[0]);
          setHeaders(headerKeys);
          setClaims(res.data);
          setTotalItems(res.total);
          setTotalPages(res.pageTotal);
        } else {
          setHeaders([]);
          setClaims([]);
          setTotalItems(0);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Failed to fetch claim reports:", error);
      }
    };

    fetchClaimReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAccess, page, rowsPerPage, sortBy, date, selectedChannel]);

  const handleClear = () => {
    setSelectedChannel("");
    setSearchChannel("");
    setDate(undefined);
  };

  const handleDownloadReport = async () => {
    try {
      if (!date?.from || !date?.to) {
        alert("Please select a date range first");
        return;
      }

      const dateFrom = formatDate(date.from.toString(), "YYYY-MM-DD");
      const dateTo = formatDate(date.to.toString(), "YYYY-MM-DD");
      const response = await requestClaimReport("File", dateFrom, dateTo);

      // Create workbook directly from the API response data
      if (response?.file) {
        window.location.href = response.file;
      }
    } catch (error) {
      console.error("Failed to download the report:", error);
    }
  };

  const handleChannelChange = (v: string) => {
    setSearchChannel(v);

    var c = channels.filter((x) => x.id == v)[0];
    setSelectedChannel(c);
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
          <div className="min-w-48">
            <Select value={searchChannel} onValueChange={handleChannelChange}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {channels.map((item, index) => (
                    <SelectItem key={index} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-48">
            <Select value={searchChannel} onValueChange={handleChannelChange}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {channels.map((item, index) => (
                    <SelectItem key={index} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

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

export default ReportClaimPage;
