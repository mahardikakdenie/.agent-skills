"use client"

import React, { useEffect, useState } from "react";
import { useLoading } from "@/context/loading.context";
import WithSidebar from "@/hoc/with-sidebar";
import { formatDateTimeWithTZ } from "@/lib/formatter";
import { ChevronRight } from "react-feather";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import emptyStateSearchPrompt from "/public/images/empty-state-search-prompt.svg";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChannelService } from "@/services/channel.services";
import { TransactionService } from "@/services/transaction.service";
import { ChevronLeft, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const ExportUsersPage = () => {
  const { setLoading } = useLoading();
  const channelService = new ChannelService();
  const transactionService = new TransactionService();

  const renderSearchPromptImage = () => {
    return (
      <Table>
        <TableBody>
          <TableRow className="hover:!bg-white">
            <TableCell colSpan={10}>
              <div className="flex flex-col gap-4 items-center justify-center py-14">
                <Image alt="no data" src={emptyStateSearchPrompt} width={200} />
                <div className="text-[#939597] text-base">
                  No filters yet. Add one to start building your audience.
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  const [channel, setChannel] = useState("");
  const [channelName, setChannelName] = useState("");
  const [frequentBuyers, setFrequentBuyers] = useState(false);
  const [birthdayMonth, setBirthdayMonth] = useState("");
  const [channelList, setChannelList] = useState([]);
  const [customersCampaignData, setCustomersCampaignData] = useState([]);
  const [dataToDownload, setDataToDownload] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectMonth, setIsSelectMonth] = useState(false);
  const [placeholderSelectSegment, setPlaceholderSelectSegment] = useState("Select Segment");
  const monthList = [
    { id: "1", name: "January" },
    { id: "2", name: "February" },
    { id: "3", name: "March" },
    { id: "4", name: "April" },
    { id: "5", name: "May" },
    { id: "6", name: "June" },
    { id: "7", name: "July" },
    { id: "8", name: "August" },
    { id: "9", name: "September" },
    { id: "10", name: "October" },
    { id: "11", name: "November" },
    { id: "12", name: "December" }
  ];

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const channelResponse = await channelService.getChannels(undefined, 100);
        setChannelList(channelResponse.data || []);
      } catch (error) {
        console.error('Failed to fetch channels:', error);
      }
    };

    fetchChannels().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (newPage: number, newLimit: number, selectedChannel: string, selectedFrequentBuyers: boolean, selectedBirthdayMonth: string, isFetchAllData: boolean = false) => {
    try {
      setLoading(true);
      const response = await transactionService.getCustomersCampaign(newPage, newLimit, selectedChannel, selectedFrequentBuyers, selectedBirthdayMonth);
      setCustomersCampaignData(response.data);
      setTotalPages(response.pageTotal);
      setTotalItems(response.total);
      setPage(response.page);
      setLimit(response.limit);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      if (!isFetchAllData) setLoading(false);
    }
  };

  const fetchAllDataToDownload = async (selectedChannel: string, selectedFrequentBuyers: boolean, selectedBirthdayMonth: string, currentPage = 1, accumulatedData: any[] = []) => {
    try {
      setDisabled(true);
      const response: any = await transactionService.getCustomersCampaign(currentPage, 100, selectedChannel, selectedFrequentBuyers, selectedBirthdayMonth);
      if (response && response.data) {
        const newData = response.data || [];
        const updatedData = [...accumulatedData, ...newData];
        setDataToDownload(updatedData);

        if (currentPage < response.pageTotal) {
          await fetchAllDataToDownload(selectedChannel, selectedFrequentBuyers, selectedBirthdayMonth, currentPage + 1, updatedData);
        }
      }
      setDisabled(false);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data for download:', error);
    }
  };

  const forPlaceholderSelectSegment = (frequentBuyersValue: boolean, selectedMonth: string) => {
    let placeholder = "Select Segment";

    if (frequentBuyersValue && selectedMonth) placeholder = `Frequent Buyers (≥2 transactions), Birthday Month (${monthList.find((c: any) => c.id === selectedMonth)?.name})`;
    else if (frequentBuyersValue) placeholder = "Frequent Buyers (≥2 transactions)";
    else if (selectedMonth) placeholder = `Birthday Month (${monthList.find((c: any) => c.id === selectedMonth)?.name})`;

    setPlaceholderSelectSegment(placeholder);
  };

  const handleChannelChange = (value: string) => {
    const selectedChannel: any = channelList.find((c: any) => c.id === value);
    setChannel(value);
    setChannelName(selectedChannel?.name || "");
    fetchData(1, limit, value, frequentBuyers, birthdayMonth, true).then();
    fetchAllDataToDownload(value, frequentBuyers, birthdayMonth).then();
  };

  const handleFrequentBuyersChange = (value: boolean) => {
    forPlaceholderSelectSegment(value, birthdayMonth);
    setFrequentBuyers(value);
    fetchData(1, limit, channel, value, birthdayMonth, true).then();
    fetchAllDataToDownload(channel, value, birthdayMonth).then();
  };

  const handleBirthdayMonthChange = (value: string) => {
    forPlaceholderSelectSegment(frequentBuyers, value);
    setBirthdayMonth(value);
    fetchData(1, limit, channel, frequentBuyers, value, true).then();
    fetchAllDataToDownload(channel, frequentBuyers, value).then();
  };

  const handleCheckBoxBirthdayMonth = (value: boolean) => {
    if (!value) {
      forPlaceholderSelectSegment(frequentBuyers, "");
      setBirthdayMonth("");
      fetchData(1, limit, channel, frequentBuyers, "", true).then();
      fetchAllDataToDownload(channel, frequentBuyers, "").then();
    }
    setIsSelectMonth(value);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    fetchData(1, Number(e.target.value), channel, frequentBuyers, birthdayMonth).then();
  };

  const handlePageChange = (value: boolean) => {
    let newPage = page;

    if (value) {
      newPage = newPage + 1;
      setPage((prevState) => prevState + 1);
    } else {
      newPage = newPage - 1;
      setPage((prevState) => prevState - 1);
    }

    fetchData(newPage, limit, channel, frequentBuyers, birthdayMonth).then();
  };

  const handleGenerateXlsx = async () => {
    const sheetData = dataToDownload.map((item: any, _index: number) => ({
      "Name": item.name || "-",
      "Email": item.email || "-",
      "Phone Number": item.phone || "-"
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const columnWidths: Record<string, number> = {};
    columnWidths["Name"] = 100;
    columnWidths["Email"] = 100;
    columnWidths["Phone Number"] = 100;

    worksheet['!cols'] = Object.keys(columnWidths).map((key) => ({
      wpx: columnWidths[key]
    }));

    const workbook = XLSX.utils.book_new();
    const time = formatDateTimeWithTZ(new Date());
    const name = `customerData_${channelName}${frequentBuyers ? "_greaterOrEqual2Trx" : ""}${birthdayMonth ? `_${birthdayMonth}` : ""}_${time}`;
    XLSX.utils.book_append_sheet(workbook, worksheet, "customerData");
    XLSX.writeFile(workbook, `${name}.xlsx`);
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex flex-wrap justify-start pb-4 items-center">
        <h1 className="text-black font-bold text-2xl mt-2 sm:w-auto w-full">
          Export Users
        </h1>
        <div className="flex space-x-4 ml-auto">
          <Button disabled={disabled} onClick={handleGenerateXlsx} className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full text-xs">
            <Download className="w-5 h-5 mr-1 " /> Generate XLSX
          </Button>
        </div>
      </div>

      <div className="flex bg-white rounded-xl gap-4 mb-3 p-6">
        <div className="flex w-full flex-col">
          <div className="text-xs mb-1.5 font-medium whitespace-nowrap">
            Channel
          </div>
          <div className="relative mb-1.5">
            <div className="min-w-48">
              <Select value={channel} onValueChange={handleChannelChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {
                      channelList.map((item: any, index: number) => (
                        <SelectItem key={index} value={item.id}>{item.name}</SelectItem>
                      ))
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col">
          <div className="text-xs mb-1.5 font-medium">
            Segment
          </div>
          <div>
            <div className={`text-sm border rounded-md py-2 px-3 ${channel && !disabled ? "cursor-pointer" : "cursor-not-allowed"}`} onClick={channel && !disabled ? () => setIsModalOpen(true) : () => {}}>{placeholderSelectSegment}</div>
          </div>
        </div>
      </div>

      {isModalOpen && !disabled && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent aria-describedby="desc" className="p-0 min-w-96 w-auto max-w-full">
            <DialogTitle className="hidden"></DialogTitle>

            <div className="h-full overflow-auto max-h-[70vh]">
              <Table className="table-claims">
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap py-2 w-10">Select</TableHead>
                    <TableHead className="py-2">Segment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className={disabled ? "cursor-not-allowed" : "cursor-pointer"} onClick={() => handleFrequentBuyersChange(!frequentBuyers)}>
                    <TableCell align="center">
                      <Input type="checkbox" disabled={disabled} onChange={() => {}} checked={frequentBuyers} className="w-4 h-4" />
                    </TableCell>
                    <TableCell>
                      Frequent Buyers (≥2 transactions)
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center" className={disabled ? "cursor-not-allowed" : "cursor-pointer"} onClick={() => handleCheckBoxBirthdayMonth(!isSelectMonth)}>
                      <Input type="checkbox" disabled={disabled} onChange={() => {}} checked={isSelectMonth} className="w-4 h-4" />
                    </TableCell>
                    <TableCell className={disabled ? "cursor-not-allowed" : "cursor-pointer"} onClick={() => handleCheckBoxBirthdayMonth(!isSelectMonth)}>
                      Birthday Month
                    </TableCell>
                    <TableCell>
                      <Select value={birthdayMonth} disabled={!isSelectMonth} onValueChange={handleBirthdayMonthChange}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {
                              monthList.map((item: any, index: number) => (
                                <SelectItem key={index} value={item.id}>{item.name}</SelectItem>
                              ))
                            }
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="w-full bg-white rounded-xl p-4">
        {
          customersCampaignData?.length ?? 0 > 0 ? (
            <>
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone Number</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      customersCampaignData.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div>{((page - 1) * limit) + index + 1}</div>
                          </TableCell>
                          <TableCell>
                            <div>{item.name}</div>
                          </TableCell>
                          <TableCell>
                            <div>{item.email}</div>
                          </TableCell>
                          <TableCell>
                            <div>{item.phone}</div>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={10}>
                        <div className="flex justify-center items-center gap-2 font-normal">
                          <label htmlFor="limit">Showing:</label>
                          <select id="limit" value={limit} onChange={handleLimitChange} className="p-2 border rounded">
                            {[10, 20, 30, 50, 100].map((option) => (<option key={option} value={option}>{option}</option>))}
                          </select>
                          <span className="mr-2">of {totalItems} items</span>
                          <button onClick={() => handlePageChange(false)} disabled={page === 1} title="Prev">
                            <ChevronLeft />
                          </button>
                          <button onClick={() => handlePageChange(true)} disabled={page === totalPages} title="Next">
                            <ChevronRight />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </>
          ) : renderSearchPromptImage()
        }
      </div>
    </div>
  );
};

ExportUsersPage.displayName = "ExportUsersPage";

const ExportUsersWithSidebar = (params: any) => WithSidebar(ExportUsersPage)(params);
export default ExportUsersWithSidebar;