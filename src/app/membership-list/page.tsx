"use client";
import WithSidebar from "@/hoc/with-sidebar";
import useRequireAuth from "@/hooks/useRequireAuth";
import { Button } from "@/components/ui/button";
import { use, useEffect, useState } from "react";
import { useLoading } from "@/context/loading.context";
import { usePathname, useRouter } from "next/navigation";
import { ChannelService } from "@/services/channel.services";
import { MembershipService } from "@/services/membership.service";
import { ChevronLeft, ChevronRight, Download, Search, Upload, X } from "react-feather";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const MembershipPage = () => {
  useRequireAuth();
  const path = usePathname();
  const membershipService = new MembershipService();
  const channelService = new ChannelService();
  const router = useRouter();
  const { setLoading } = useLoading();
  const [ page, setPage ] = useState(1);
  const [ tab, setTab ] = useState("All");
  const [ limit, setLimit ] = useState(100);
  const [ channel, setChannel ] = useState("");
  const [ totalData, setTotalData ] = useState(0);
  const [ totalItems, setTotalItems ] = useState(0);
  const [ totalPages, setTotalPages ] = useState(1);
  const [ searchData, setSearchData ] = useState("");
  const [ rowsPerPage, setRowsPerPage ] = useState(10);
  const [ channels, setChannels ] = useState<any[]>([]);
  const [ membership, setMembership ] = useState<any[]>([]);
  const [ filteredMembership, setFilteredMembership ] = useState<any[]>([]);

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const res = await membershipService.getMembership(
          page,
          rowsPerPage,
          searchData,
          tab === "All" ? "" : tab,
          channel
        );
        setMembership(res.data);
        setFilteredMembership(res.data);
        setPage(res.page);
        setTotalPages(res.pageTotal);
        setTotalItems(res.total);
        setTotalData(res.total);
      } catch (error: any) {
        const message = error?.response?.data?.message || "Failed to fetch membership data.";
        alert(message);
      }
    };
    fetchMembership().then();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchData, rowsPerPage, tab, channel]);

  useEffect(() => {
    const fetchChannel = async () => {
      setLoading(true);
      try {
        const result = await channelService.getChannels(page, limit);
        setChannels(result.data);
      } finally {
        setLoading(false);
      }
    };
  
    fetchChannel();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

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
      case "Pending":
        return "text-[#CC9B36]";
      case "Active":
        return "text-[#00AB4F]";
      case "Inactive":
        return "text-[#939597]";
      default:
        return "text-[#CC9B36]";
    }
  };

  const handleExport = () => {
    const exportData = {
      page,
      limit: rowsPerPage,
      status: tab === "All" ? "" : tab,
      channel: channel
    };

    localStorage.setItem("exportMembershipData", JSON.stringify(exportData));
    router.push(`${path}/export`);
  };

  const handleUpload = () => {
    router.push(`${path}/upload`);
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6 ">
      <div className="flex gap-3 pb-4 items-center">
        <h1 className="text-black font-bold text-2xl mt-2">Membership List</h1>
        <Select value={channel} onValueChange={(value) => setChannel(value)}>
          <SelectTrigger className="w-[180px] ml-auto">
            <SelectValue placeholder="Select Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {channels.map ((channel, index) => (
                <SelectItem key={index} value={channel.id}>{channel.name}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={handleUpload} className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full">
          <Upload className="w-5 h-5 mr-1 " /> Upload
        </Button>
        <Button onClick={handleExport} className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full">
          <Download className="w-5 h-5 mr-1 " /> Download
        </Button>
      </div>
      <div className="block bg-white rounded-md mb-3">
        <div className="w-full flex items-center overflow-auto">
          <div
            onClick={() => selectTab("All")}
            className={`cursor-pointer h-full flex items-center justify-center sm:px-7 px-5 ${
              tab === "All" && "border-b-[3px] border-primary sm:px-7 px-5"
            }`}
          >
            <button
              className={`text-sm py-5 mr-3 ${tab === "All" && "text-primary"}`}
            >
              All Membership
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
            className={`cursor-pointer h-full flex items-center justify-center sm:px-7 px-5 ${
              tab === "Pending" && "border-b-[3px] border-primary sm:px-7 px-5"
            }`}
          >
            <button
              className={`text-sm py-5 mr-3 ${
                tab === "Pending" && "text-primary"
              }`}
            >
              Pending
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
            onClick={() => selectTab("Active")}
            className={`cursor-pointer h-full flex items-center justify-center sm:px-7 px-5 ${
              tab === "Active" &&
              "border-b-[3px] border-primary sm:px-7 px-5"
            }`}
          >
            <button
              className={`text-sm py-5 mr-3 ${
                tab === "Active" && "text-primary"
              }`}
            >
              Active
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
                totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
              } ${tab !== "Active" && "hidden"}`}
            >
              {totalData}
              <span
                className={`${totalData < 100 && "hidden"}`}
                style={{ fontSize: "10px" }}
              ></span>
            </span>
          </div>
          <div
            onClick={() => selectTab("Inactive")}
            className={`cursor-pointer h-full flex items-center justify-center sm:px-7 px-5 ${
              tab === "Inactive" && "border-b-[3px] border-primary sm:px-7 px-5"
            }`}
          >
            <button
              className={`text-sm py-5 mr-3 ${
                tab === "Inactive" && "text-primary"
              }`}
            >
              Inactive
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
                totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
              } ${tab !== "Inactive" && "hidden"}`}
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
        <Table className="table-policies">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">No.</TableHead>
              <TableHead className="whitespace-nowrap">Policy Number</TableHead>
              <TableHead className="whitespace-nowrap">Subsidiary / Entity</TableHead>
              <TableHead className="whitespace-nowrap">Employee ID</TableHead>
              <TableHead className="whitespace-nowrap">Employee Name</TableHead>
              <TableHead className="whitespace-nowrap">Member Name</TableHead>
              <TableHead className="text-center whitespace-nowrap">Gender</TableHead>
              <TableHead className="whitespace-nowrap">Date of birth</TableHead>
              <TableHead className="text-center whitespace-nowrap">Member Status</TableHead>
              <TableHead className="whitespace-nowrap">Marital Status</TableHead>
              <TableHead className="whitespace-nowrap">Plan</TableHead>
              <TableHead className="whitespace-nowrap">Effective Date</TableHead>
              <TableHead className="whitespace-nowrap">Remarks</TableHead>
              <TableHead className="whitespace-nowrap">Bank Name</TableHead>
              <TableHead className="whitespace-nowrap">Branch</TableHead>
              <TableHead className="whitespace-nowrap">Bank Number</TableHead>
              <TableHead className="whitespace-nowrap">Bank Account Name</TableHead>
              <TableHead className="whitespace-nowrap">Email</TableHead>
              <TableHead className="whitespace-nowrap">Membership ID</TableHead>
              <TableHead className="whitespace-nowrap">Submission Date</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembership.map((item, index) => {
              const rowNumber = (page - 1) * rowsPerPage + index + 1;
              return (
                <TableRow key={index}>
                  <TableCell>{rowNumber}</TableCell>
                  <TableCell className="min-w-[180px]">{item?.number || "-"}</TableCell>
                  <TableCell className="min-w-[230px]">{item?.profile?.subsidiary || "-"}</TableCell>
                  <TableCell>{item?.profile?.employee_id || "-"}</TableCell>
                  <TableCell className="min-w-[240px]">{item?.profile?.employee_name || "-"}</TableCell>
                  <TableCell className="min-w-[240px]">{item?.profile?.member_name || "-"}</TableCell>
                  <TableCell className="text-center">{item?.profile?.gender || "-"}</TableCell>
                  <TableCell>{item?.profile?.date_of_birth || "-"}</TableCell>
                  <TableCell className="text-center">{item?.profile?.member_status || "-"}</TableCell>
                  <TableCell>{item?.profile?.marital_status || "-"}</TableCell>
                  <TableCell>{item?.profile?.plan || "-"}</TableCell>
                  <TableCell>{item?.profile?.effective_date || "-"}</TableCell>
                  <TableCell>{item?.profile?.remarks || "-"}</TableCell>
                  <TableCell>{item?.profile?.bank_name || "-"}</TableCell>
                  <TableCell>{item?.profile?.branch || "-"}</TableCell>
                  <TableCell>{item?.profile?.bank_account_number || "-"}</TableCell>
                  <TableCell className="min-w-[200px]">{item?.profile?.bank_account_name || "-"}</TableCell>
                  <TableCell>{item?.profile?.email || "-"}</TableCell>
                  <TableCell>{item?.other_info?.tpa_member_id || "-"}</TableCell>
                  <TableCell>{item?.profile?.submission_date || "-"}</TableCell>
                  <TableCell className="font-semibold"><span className={getStatusColor(item?.status)}>{item?.status || "-"}</span></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        <div className="flex justify-center items-center gap-2 font-normal text-sm pt-2 border-t">
          <label htmlFor="rowsPerPage">Showing:</label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="p-2 border rounded"
          >
            {[10, 20, 30, 50].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <span className="mr-2">of {totalItems} items</span>
          <button onClick={() => setPage((prevState) => prevState - 1)} disabled={page === 1} title="Prev">
            <ChevronLeft />
          </button>
          <button onClick={() => setPage((prevState) => prevState + 1)} disabled={page === totalPages} title="Next">
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

const TransactionWithSidebar = (params: any) => WithSidebar(MembershipPage)(params);
export default TransactionWithSidebar;
