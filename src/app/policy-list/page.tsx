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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import useRequireAuth from "@/hooks/useRequireAuth";
import { PolicyService } from "@/services/policy.service";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Download, Search, X } from "react-feather";
import { Button } from "@/components/ui/button";
import { ChannelService } from "@/services/channel.services";
import { DateRange } from "react-day-picker";
import { ProductService } from "@/services/product.services";
import { ProductCategoriesService } from "@/services/masterdata/product-category.service";

const PolicyPage = () => {
  useRequireAuth();
  const path = usePathname();
  const policyService = new PolicyService();
  const [categories, setCategories] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();
  const [tab, setTab] = useState("All");
  const [totalData, setTotalData] = useState(0);
  const [searchData, setSearchData] = useState("");
  const [searchChannel, setSearchChannel] = useState("40eee5bf-2b92-4d23-be55-f9caa9d3ea88");//DEFAULT TEMAN
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [searchCategory, setSearchCategory] = useState("All");

  const [channels, setChannels] = useState<any[]>([]);

  useEffect(() => {
    policyService
      .getPolicy(page, rowsPerPage, searchData, tab == "All" ? "" : tab,
        searchChannel, // === "All" ? "" : searchChannel,
        searchCategory === "All" ? null : searchCategory,
        date?.from ? format(date.from, "yyyy-MM-dd") : undefined,
        date?.to ? format(date.to, "yyyy-MM-dd") : undefined,

      )
      .then((res) => {
        setPolicies(res.data);
        setFilteredTransactions(res.data);
        setPage(res.page);
        setTotalPages(res.pageTotal);
        setTotalItems(res.total);
        setTotalData(res.total);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchData, rowsPerPage, tab, searchChannel, searchCategory, date]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const channelService = new ChannelService();
        const channelResponse = await channelService.getChannels();
        setChannels(channelResponse.data || []);
      } catch (error) {
        console.error('Failed to fetch channels:', error);
      }
    };

    fetchData();

  }, []);

  useEffect(() => {
    getCategories();

  }, []);

  const getCategories = async () => {

    try {
      const productCategoriesService = new ProductCategoriesService();
      const categoriesResponse = await productCategoriesService.getCategoriesByChannelId(searchChannel);
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }
  const handleChannelChange = (v: string) => {
    setSearchChannel(v);
    getCategories();
    setSearchCategory("All");
  };

  const handleCategoryChange = (v: string) => {
    setSearchCategory(v);
  };

  const handleClear = () => {
    setDate(undefined);
  };

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

  const handleExport = () => {
    const exportData = {
      page,
      limit: rowsPerPage,
      status: tab === "All" ? "" : tab,
      search: searchData,
      channel: searchChannel,
      date_from: date?.from ? format(date.from, "yyyy-MM-dd") : undefined,
      date_to: date?.to ? format(date.to, "yyyy-MM-dd") : undefined,
      category: searchCategory === "All" ? null : searchCategory,
    };

    localStorage.setItem("exportPolicyData", JSON.stringify(exportData));
    router.push(`${path}/export`);
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6 ">
      <div className="flex flex-wrap justify-end gap-4 pb-4 items-center">
        <h1 className="text-black font-bold text-2xl mt-2">Policy List</h1>


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

        <div className="min-w-48">
          <Select
            value={searchChannel}
            onValueChange={handleChannelChange}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* <SelectItem value={'All'}>All Channel</SelectItem> */}
                {
                  channels.map((item, index) => (
                    <SelectItem key={index} value={item.id}>{item.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-48">
          <Select
            disabled={!searchChannel}
            value={searchCategory}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={'All'} key={-1}>All Category</SelectItem>
                {
                  categories.map((item, index) => (
                    <SelectItem key={index} value={item.id}>{item.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleExport}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <Download className="w-5 h-5 mr-1 " /> Export
        </Button>
      </div>
      <div className="block bg-white rounded-md mb-3">
        <div className="w-full flex items-center overflow-auto">
          <div
            onClick={() => selectTab("All")}
            className={`cursor-pointer h-full flex items-center justify-center sm:px-7 px-5 ${tab === "All" && "border-b-[3px] border-primary sm:px-7 px-5"
              }`}
          >
            <button
              className={`text-sm py-5 mr-3 ${tab === "All" && "text-primary"}`}
            >
              All Policy
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
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
            className={`cursor-pointer h-full flex items-center justify-center sm:px-7 px-5 ${tab === "In Force" && "border-b-[3px] border-primary sm:px-7 px-5"
              }`}
          >
            <button
              className={`text-sm py-5 mr-3 ${tab === "In Force" && "text-primary"
                }`}
            >
              In Force
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
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
            className={`cursor-pointer h-full flex items-center justify-center sm:px-7 px-5 ${tab === "Grace Period" &&
              "border-b-[3px] border-primary sm:px-7 px-5"
              }`}
          >
            <button
              className={`text-sm py-5 mr-3 ${tab === "Grace Period" && "text-primary"
                }`}
            >
              Grace Period
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
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
            className={`cursor-pointer h-full flex items-center justify-center sm:px-7 px-5 ${tab === "Expired" && "border-b-[3px] border-primary sm:px-7 px-5"
              }`}
          >
            <button
              className={`text-sm py-5 mr-3 ${tab === "Expired" && "text-primary"
                }`}
            >
              Expired
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
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
      </div>
      <div className="w-full p-4 md:p-6 bg-white rounded-lg">
        <div className="relative max-w-full w-full mb-4 ml-auto shadow-sm">
          <input
            type="text"
            placeholder="Search by Plan Name"
            onChange={(e) => setSearchData(e.target.value)}
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
              <TableHead className="min-w-44">Plan Name</TableHead>
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
                      {policy?.policy_holder?.name || "-"}
                    </div>
                  </TableCell>
                  <TableCell>{policy.number}</TableCell>
                  <TableCell>
                    {policy?.policy_products?.plan_data?.name
                      .split("|")
                      .join(" - ") || "-"}
                  </TableCell>
                  <TableCell className="font-semibold whitespace-nowrap">
                    <span className={getStatusColor(policy.status)}>
                      {policy.status}
                    </span>
                  </TableCell>
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
