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
import { X } from "react-feather";
import WithSidebar from "@/hoc/with-sidebar";
import { Search } from "react-feather";
import { useBilling } from "./hook";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, List, Printer, PlusIcon, EyeIcon, File } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate, formatMoney } from "@/lib/formatter";
import { ChannelService } from "@/services/channel.services";
import { ProductCategoriesService } from "@/services/masterdata/product-category.service";
import { useLoading } from "@/context/loading.context";
import { useProduct } from "../masterdata/product/hooks";

const BillingPage = () => {
  const { billingList, getBilling } = useBilling();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const [searchType, setSearchType] = useState("");//DEFAULT PARTNER
  const [searchChannel, setSearchChannel] = useState("40eee5bf-2b92-4d23-be55-f9caa9d3ea88");//DEFAULT TEMAN
  // const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [date, setDate] = useState<Date>(new Date());
  const [dateTmp, setDateTmp] = useState<Date>(new Date());
  const [searchCategory, setSearchCategory] = useState("All");
  const { setLoading } = useLoading();

  const [categories, setCategories] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([
    { name: "Partner", code: "partner" },
    { name: "Insurer", code: "insurer" },
  ]);
  const [channels, setChannels] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);// Channels/Insurances

  const { fetchInsurances, insurances } = useProduct();
  const handleRowsPerPageChange = (e: any) => {
    setRowsPerPage(e.target.value);
  };


  useEffect(() => {
    if (billingList && billingList.data) {
      setTotalItems(billingList.meta.total);
    }
  }, [billingList]);

  useEffect(() => {
    if (searchType == "" || searchChannel == "") {
      return;
    }
    var startDate = formatDate(new Date(date.getFullYear(), date.getMonth(), 1).toString(), "YYYY-MM-DD")
    var endDate = formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0).toString(), "YYYY-MM-DD")
    let query: { [key: string]: string } = {
      type: searchType,
      company: searchChannel,
      startDate: startDate,
      endDate: endDate
    };
    if (searchCategory != "All") {
      query["category"] = searchCategory;
    }

    localStorage.setItem("billingPage", JSON.stringify({ type: searchType, company: searchChannel, category: searchCategory, date: date }));
    getBilling(query, page, rowsPerPage,);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, searchType, searchChannel, searchCategory, date]);


  useEffect(() => {
    const fetchData = async () => {
      await getChannels();
      await fetchInsurances("");

      if (localStorage.getItem("billingPage")) {
        const d = JSON.parse(localStorage.getItem("billingPage")!);
        setCompanyDataSource();
        setSearchType(d.type);
        setSearchChannel(d.company)
        setSearchCategory(d.category)
        setDate(d.date ? new Date(d.date) : new Date())
        setDateTmp(d.date ? new Date(d.date) : new Date())
        return;
      }

      setSearchType("partner")
    }
    fetchData();
  }, []);

  useEffect(() => {
    setCompanyDataSource();
  }, [searchType]);


  const setCompanyDataSource = () => {
    if (searchType == "insurer") {
      setCompanies(insurances);
      // if (insurances.length > 0) {
      //   setSearchChannel(insurances[0].id);
      // }
    } else if (searchType == "partner") {
      setCompanies(channels);
      // if (channels.length > 0) {
      //   setSearchChannel(channels[0].id);
      // }
    }
  }

  const getChannels = async () => {
    try {
      const channelService = new ChannelService();
      const channelResponse = await channelService.getChannels();
      setChannels(channelResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch channels:', error);
    }
  };


  useEffect(() => {
    getCategories();

  }, [searchChannel]);

  const getCategories = async () => {
    try {
      setLoading(true);
      const productCategoriesService = new ProductCategoriesService();
      const categoriesResponse = await productCategoriesService.getCategories();
      // const categoriesResponse = await productCategoriesService.getCategoriesByChannelId(searchChannel);
      setCategories(categoriesResponse || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }

  const handleTypeChange = (v: string) => {
    setSearchType(v);
    if (v == "insurer") {
      setCompanies(insurances);
      if (insurances.length > 0) {
        setSearchChannel(insurances[0].id);
      }
    } else if (v == "partner") {
      setCompanies(channels);
      if (channels.length > 0) {
        setSearchChannel(channels[0].id);
      }
    }

    setSearchCategory("All");
  };

  const handleChannelChange = (v: string) => {
    setSearchChannel(v);
    setSearchCategory("All");
  };

  const handleCategoryChange = (v: string) => {
    setSearchCategory(v);
  };

  // const handleClear = () => {
  //   setDate(new Date());
  // };
  let months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  let years = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"]
  const router = useRouter();
  return (
    <div className="flex flex-col w-full p-4 md:p-6 ">
      <div className="flex flex-wrap justify-start gap-4 pb-4 items-center">
        <h1 className="text-black font-bold sm:text-2xl text-xl mt-2 mb-4">
          Billing List
        </h1>

        <div className="flex gap-2 sm:w-auto w-full relative">

          <Button
            onClick={() => {

              const year = date.getFullYear();
              const month = date.getMonth();
              setDate(new Date(year, month - 1, 1))
              setDateTmp(new Date(year, month - 1, 1))
              return;
            }}
            disabled={!date}
            className={cn(
              "font-semibold bg-transparent hover:bg-transparent p-0 text-black text-sm cursor-pointer absolute left-2",
              !date && "text-gray-500 cursor-not-allowed"
            )}
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                style={{ paddingLeft: "30px" }}
                className={cn(
                  "sm:w-[280px] w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                {formatDate(date.toString(), "MMM, YYYY")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" >
              <div className="flex gap-2 sm:w-auto w-full relative">
                <Select
                  value={dateTmp.getMonth().toString()}
                  onValueChange={(e) => {
                    setDateTmp(new Date(dateTmp.getFullYear(), parseInt(e), 1));
                  }}
                >
                  <SelectTrigger className="h-10 min-w-36">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="min-w-36">
                      {
                        months.map((item, index) => (
                          <SelectItem key={index} value={index.toString()}>{item}</SelectItem>
                        ))
                      }
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  value={dateTmp.getFullYear().toString()}
                  onValueChange={(e) => {
                    setDateTmp(new Date(parseInt(e), dateTmp.getMonth(), 1));
                  }}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {
                        years.map((item, index) => (
                          <SelectItem key={index} value={item}>{item}</SelectItem>
                        ))
                      }
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button onClick={(e) => {
                  setDate(dateTmp);
                }}>OK</Button>
              </div>

              {/* <Calendar
                mode="single"
                required={true}
                selected={date}
                onMonthChange={(date) => {
                  setDate(date);
                }}
                onSelect={(date) => {
                  setDate(date);
                }}
                captionLayout="dropdown" // Enables month & year dropdowns
                startMonth={new Date(2000, 0)}
                endMonth={new Date(2050, 0)}
                showOutsideDays={false}
                showWeekNumber={false}
                modifiersClassNames={{
                  selected: 'bg-blue-500 text-white', // Tailwind example
                }}
              /> */}
            </PopoverContent>
          </Popover>
          <Button
            onClick={() => {

              const year = date.getFullYear();
              const month = date.getMonth();
              setDate(new Date(year, month + 1, 1))
              setDateTmp(new Date(year, month + 1, 1))
            }}
            disabled={!date}
            className={cn(
              "font-semibold bg-transparent hover:bg-transparent p-0 text-black text-sm cursor-pointer absolute right-2",
              !date && "text-gray-500 cursor-not-allowed"
            )}
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="min-w-36 w-[100px] ml-auto">
          <Select
            value={searchType}
            onValueChange={handleTypeChange}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  types.map((item, index) => (
                    <SelectItem key={index} value={item.code}>{item.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-48 w-[180px]">
          <Select
            value={searchChannel}
            onValueChange={handleChannelChange}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  companies.map((item, index) => (
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
          onClick={() => router.push("/billing/add")}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
        >
          <PlusIcon className="w-5 h-5 mr-1 " /> Create Billing
        </Button>

      </div>
      <div className="w-full p-4 md:p-6 bg-white rounded-lg">
        <Table className="table-transactions">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">No.</TableHead>
              <TableHead>Billing No.</TableHead>
              <TableHead>Billing Date</TableHead>
              {/* <TableHead>Transaction Period</TableHead> */}
              {/* <TableHead>Type</TableHead> */}
              {/* <TableHead>Company Name</TableHead> */}
              {
                searchCategory == "All" ?
                  <TableHead>Category</TableHead> : ""
              }
              <TableHead style={{ width: "50px" }}>Currency</TableHead>
              <TableHead style={{ width: "50px", textAlign: "right" }}>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {billingList.data?.map((billing: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="whitespace-nowrap">{index + 1}</TableCell>
                <TableCell>{billing.billing_no}</TableCell>
                <TableCell>{formatDate(billing.created_at, "YYYY-MM-DD")}</TableCell>
                {
                  searchCategory == "All" ?
                    <TableCell>{categories.filter((c) => c.id == billing.category)[0].name}</TableCell> : ""
                }
                {/* <TableCell>{billing.transaction_period}</TableCell> */}
                {/* <TableCell>{billing.type}</TableCell> */}
                {/* <TableCell>{billing.company_name}</TableCell> */}
                <TableCell>{billing.currency}</TableCell>
                <TableCell style={{ textAlign: "right" }}>{formatMoney(billing.amount)}</TableCell>
                <TableCell>
                  {billing.status
                    .split("-")
                    .map(
                      (word: string) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ")}
                </TableCell>
                <TableCell className="flex">
                  <div className="relative group">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        localStorage.setItem("billingDetail", JSON.stringify({ "id": billing.id, "channel": searchChannel, "category": categories, "date": date }));
                        router.push(`billing/detail/${billing.id}`);
                      }
                      }
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      View Detail
                    </span>
                  </div>
                  <div className="relative group">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        localStorage.setItem("billingDetail", JSON.stringify({ "id": billing.id, "channel": searchChannel, "category": categories, "date": date }));
                        router.push(`billing/detail/${billing.id}/invoice?type=${billing.type}`);
                      }
                      }
                    >
                      <File className="h-4 w-4" />
                    </Button>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      View Invoice
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
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

const BillingPageWithSidebar = (params: any) =>
  WithSidebar(BillingPage)(params);
export default BillingPageWithSidebar;
