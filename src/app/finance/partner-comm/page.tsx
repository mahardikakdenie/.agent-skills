"use client";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useBrokerFee from "../broker-fee/hook";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, EditIcon, PlusIcon, TrashIcon } from "lucide-react";
import { formatMoney } from "@/lib/formatter";
import { Search } from "react-feather";
import _ from "lodash";
import {useScreen} from "@/context/screen.context";
import {channelService} from "@/services/api.service";
import ApiURL from "@/constants/api-url.const";
import AppURL from "@/constants/app-url.const";

export default function PartnerComPage() {
  const { getChannelFees, channelFees, deleteChannelFee } = useBrokerFee();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const { setLoading } = useScreen();
  const [totalItems, setTotalItems] = useState(0);
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const [channels, setChannels] = useState<any[]>([]);

  const [searchChannel, setSearchChannel] = useState("All");//DEFAULT TEMAN 
  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    if(searchData) {
      setPage(1);
    }
  }, [searchData]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await getChannelFees({ channelId: searchChannel == "All" ? null : searchChannel }, page, rowsPerPage, searchData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, searchChannel, searchData]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      await getChannels();
    }
    fetchData();
  }, []);

  const getChannels = async () => {
    try {
      const channelResponse: any = await channelService.get(ApiURL.v1Channels, { params: { page: 1, limit: 100 } });
      setChannels(channelResponse?.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch channels:', error);
    }
  };

  const handleChannelChange = (v: string) => {
    setSearchChannel(v);
    setPage(1);
  };

  const handleRowsPerPageChange = (e: any) => {
    setRowsPerPage(e.target.value);
    setPage(1); // Reset to first page when rows per page changes
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this partner com?")) {
      try {
        setLoading(true);
        await deleteChannelFee(id);
        if (page === 1) {
          await getChannelFees({ channelId: searchChannel == "All" ? null : searchChannel }, page, rowsPerPage);
        } else {
          setPage(1);
        }
      } catch (error) {
        console.error(error);
        alert("Failed to delete partner com");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (channelFees && channelFees.data) {
      setTotalItems(channelFees.meta.total);
    }
  }, [channelFees]);

  const handleSearch = _.debounce((keyword: string) => {
    setSearchData(keyword);
  }, 100);

  return (
    <div className="flex flex-col w-full p-4 md:p-6 ">
      <div className="flex flex-wrap justify-start gap-4 pb-4 items-center">
        <h1 className="text-black font-bold sm:text-2xl text-xl mt-2 mb-4">
          Partner Comm
        </h1>

        <div className="min-w-48 w-[180px] ml-auto">
          <Select
            value={searchChannel}
            onValueChange={handleChannelChange}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem key={-1} value={"All"}>All</SelectItem>
                {
                  channels.map((item, index) => (
                    <SelectItem key={index} value={item.id}>{item.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => router.push(AppURL.financePartnerCommAdd)}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
        >
          <PlusIcon className="w-5 h-5 mr-1 " /> Create Partner Comm
        </Button>

      </div>

      <div className="w-full p-4 md:p-6 bg-white rounded-lg">
        {/* Search Bar */}
        <div className="relative max-w-full w-full mb-4 ml-auto shadow-sm">
          <input
            type="text"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by Insurance Company Name"
            className="border p-3 rounded-md pr-10 w-full text-sm h-12"
          />
            <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#016da1]" />
        </div>
        <Table className="table-transactions">
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Channel Name</TableHead>
              <TableHead>Insurance Company Name</TableHead>
              {/* <TableHead>Product Name</TableHead>
              <TableHead>Plan Name</TableHead> */}
              <TableHead>Fee Type</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {channelFees?.data?.map((item: any, index: any) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.channel_name}</TableCell>
                <TableCell>{item.insurance_name}</TableCell>
                {/* <TableCell>{item.product_name}</TableCell>
                <TableCell>{item.plan_name}</TableCell> */}
                <TableCell>{item.fee_type}</TableCell>
                <TableCell>{item.fee_type != "percentage" ? formatMoney(item.fee) : item.fee}</TableCell>

                <TableCell className="flex">
                  <div className="relative group">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`${AppURL.financePartnerCommDetail}/${item.id}`)}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Edit
                    </span>
                  </div>
                  <div className="relative group">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </Button>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Delete
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