"use client"

import React, { useEffect, useState } from "react";
import { useLoading } from "@/context/loading.context";
import WithSidebar from "@/hoc/with-sidebar";
import { formatDateTimeWithTZ } from "@/lib/formatter";
import { Check, ChevronRight, Plus, Trash2, X } from "react-feather";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import emptyStateSearchPrompt from "/public/images/empty-state-search-prompt.svg";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChannelService } from "@/services/channel.services";
import { ProductService } from "@/services/product.services";
import { TransactionService } from "@/services/transaction.service";
import { ChevronLeft, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ExportUsersPage = () => {
  const { setLoading } = useLoading();
  const channelService = new ChannelService();
  const productService = new ProductService();
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
                  {!isFiltered ? "No filters yet. Add one to start building your audience." : "No data found"}
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  const [selectedFilter, setSelectedFilter] = useState("");
  const [channel, setChannel] = useState("");
  const [product, setProduct] = useState("");
  const [plan, setPlan] = useState("");
  const [frequentBuyersSign, setFrequentBuyersSign] = useState("");
  const [frequentBuyersValue, setFrequentBuyersValue] = useState(1);
  const [channelName, setChannelName] = useState("");
  const [productName, setProductName] = useState("");
  const [planName, setPlanName] = useState("");
  const [birthdayMonth, setBirthdayMonth] = useState("");
  const [channelList, setChannelList] = useState<any[]>([]);
  const [productList, setProductList] = useState<any[]>([]);
  const [planList, setPlanList] = useState<any[]>([]);
  const [customersCampaignData, setCustomersCampaignData] = useState([]);
  const [dataToDownload, setDataToDownload] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isFiltered, setIsFiltered] = useState(false);
  const monthList = [
    { id: "01", name: "January" },
    { id: "02", name: "February" },
    { id: "03", name: "March" },
    { id: "04", name: "April" },
    { id: "05", name: "May" },
    { id: "06", name: "June" },
    { id: "07", name: "July" },
    { id: "08", name: "August" },
    { id: "09", name: "September" },
    { id: "10", name: "October" },
    { id: "11", name: "November" },
    { id: "12", name: "December" }
  ];
  const filterOptions = [
    { name: "Channel", id: "channel_id", active: true },
    { name: "Product", id: "product_id", active: true },
    { name: "Plan", id: "plan_id", active: true },
    { name: "Transaction", id: "frequent_buyers", active: true },
    { name: "Birthday Month", id: "birthday_month", active: true }
  ];

  useEffect(() => {
    const fetchChannelList = async (currentPage = 1, accumulatedData: any[] = []) => {
      try {
        setLoading(true);
        const channelResponse = await channelService.getChannels(currentPage, 100);

        if (channelResponse && channelResponse.data) {
          const newData = channelResponse.data || [];
          const updatedData = [...accumulatedData, ...newData];
          setChannelList(updatedData);

          if (currentPage < channelResponse.pageTotal) {
            await fetchChannelList(currentPage + 1, updatedData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch channel:', error);
      }
    };

    const fetchProductList = async (currentPage = 1, accumulatedData: any[] = []) => {
      try {
        const productResponse = await productService.get100Products(currentPage);

        if (productResponse && productResponse.data) {
          const newData = productResponse.data || [];
          const updatedData = [...accumulatedData, ...newData];
          setProductList(updatedData);

          if (currentPage < productResponse.meta.pageTotal) {
            await fetchProductList(currentPage + 1, updatedData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };

    const fetchPlanList = async (currentPage = 1, accumulatedData: any[] = []) => {
      try {
        const planResponse = await productService.get100Plans(currentPage);

        if (planResponse && planResponse.data) {
          const newData = planResponse.data || [];
          const updatedData = [...accumulatedData, ...newData];
          setPlanList(updatedData);

          if (currentPage < planResponse.meta.pageTotal) {
            await fetchPlanList(currentPage + 1, updatedData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch plan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelList().then(() => fetchProductList().then(() => fetchPlanList().then()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (newPage: number, newLimit: number, selectedChannel: string[], selectedProduct: string[], selectedPlan: string[], selectedFrequentBuyers: string[], selectedBirthdayMonth: string[], isFetchAllData: boolean = false) => {
    try {
      setLoading(true);
      const response = await transactionService.getCustomersCampaign(newPage, newLimit, selectedChannel, selectedProduct, selectedPlan, selectedFrequentBuyers, selectedBirthdayMonth);
      setCustomersCampaignData(response.data);
      setTotalPages(response.pageTotal);
      setTotalItems(response.total);
      setPage(response.page);
      setLimit(response.limit);
      setIsFiltered(true);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      if (!isFetchAllData) setLoading(false);
    }
  };

  const fetchAllDataToDownload = async (selectedChannel: string[], selectedProduct: string[], selectedPlan: string[], selectedFrequentBuyers: string[], selectedBirthdayMonth: string[], currentPage = 1, accumulatedData: any[] = []) => {
    try {
      const response: any = await transactionService.getCustomersCampaign(currentPage, 1000, selectedChannel, selectedProduct, selectedPlan, selectedFrequentBuyers, selectedBirthdayMonth);
      if (response && response.data) {
        const newData = response.data || [];
        const updatedData = [...accumulatedData, ...newData];
        setDataToDownload(updatedData);

        if (currentPage < response.pageTotal) {
          await fetchAllDataToDownload(selectedChannel, selectedProduct, selectedPlan, selectedFrequentBuyers, selectedBirthdayMonth, currentPage + 1, updatedData);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data for download:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChannelChange = (value: string) => {
    const selectedChannel: any = channelList.find((c: any) => c.id === value);
    setChannel(value);
    setChannelName(selectedChannel?.name || "");
  };

  const handleProductChange = (value: string) => {
    const selectedProduct: any = productList.find((p: any) => p.id === value);
    setProduct(value);
    setProductName(selectedProduct?.name || "");
  };

  const handlePlanChange = (value: string) => {
    const selectedPlan: any = planList.find((p: any) => p.id === value);
    setPlan(value);
    setPlanName(selectedPlan?.name || "");
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { selectedChannel, selectedProduct, selectedPlan, selectedFrequentBuyers, selectedBirthdayMonth } = processingFilteredUser();
    setLimit(Number(e.target.value));
    fetchData(1, Number(e.target.value), selectedChannel, selectedProduct, selectedPlan, selectedFrequentBuyers, selectedBirthdayMonth).then();
  };

  const handlePageChange = (value: boolean) => {
    const { selectedChannel, selectedProduct, selectedPlan, selectedFrequentBuyers, selectedBirthdayMonth } = processingFilteredUser();
    let newPage = page;

    if (value) {
      newPage = newPage + 1;
      setPage((prevState) => prevState + 1);
    } else {
      newPage = newPage - 1;
      setPage((prevState) => prevState - 1);
    }

    fetchData(newPage, limit, selectedChannel, selectedProduct, selectedPlan, selectedFrequentBuyers, selectedBirthdayMonth).then();
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
    const name = `filtered_customer_data_${time}`;
    XLSX.utils.book_append_sheet(workbook, worksheet, "customer_data");
    XLSX.writeFile(workbook, `${name}.xlsx`);
  };

  const handleGetFilteredData = () => {
    const { selectedChannel, selectedProduct, selectedPlan, selectedFrequentBuyers, selectedBirthdayMonth } = processingFilteredUser();
    fetchData(1, limit, selectedChannel, selectedProduct, selectedPlan, selectedFrequentBuyers, selectedBirthdayMonth, true).then();
    fetchAllDataToDownload(selectedChannel, selectedProduct, selectedPlan, selectedFrequentBuyers, selectedBirthdayMonth).then();
  };

  const handleAddFilterData = () => {
    const filters = [
      { condition: channel, value: { key_id: "channel_id", label: "Channel", value: channel, valueView: channelName } },
      { condition: product, value: { key_id: "product_id", label: "Product", value: product, valueView: productName } },
      { condition: plan, value: { key_id: "plan_id", label: "Plan", value: plan, valueView: planName } },
      { condition: frequentBuyersSign && frequentBuyersValue, value: { key_id: "frequent_buyers", label: "Transaction", value: `${frequentBuyersSign}|${frequentBuyersValue}`, valueView: `${frequentBuyersSign} ${frequentBuyersValue}` } },
      { condition: birthdayMonth, value: { key_id: "birthday_month", label: "Birthday Month", value: birthdayMonth, valueView: monthList.find((m: any) => m.id === birthdayMonth)?.name } }
    ].reduce((acc, item) => {
      if (item.condition) acc.push(item.value);
      return acc;
    }, [...filteredUsers]);

    setFilteredUsers(filters);

    setChannel("");
    setChannelName("");
    setProduct("");
    setProductName("");
    setPlan("");
    setPlanName("");
    setFrequentBuyersSign("");
    setFrequentBuyersValue(1);
    setBirthdayMonth("");
    setSelectedFilter("");
  };

  const handleDeleteSelectedFilter = (index: number) => {
    const filters = JSON.parse(JSON.stringify(filteredUsers));
    filters.splice(index, 1);
    setFilteredUsers(filters);
  };

  const processingFilteredUser = () => {
    const selectedChannel: string[] = filteredUsers.filter(f => f.key_id === "channel_id").map(f => f.value);
    const selectedProduct: string[] = filteredUsers.filter(f => f.key_id === "product_id").map(f => f.value);
    const selectedPlan: string[] = filteredUsers.filter(f => f.key_id === "plan_id").map(f => f.value);
    const selectedFrequentBuyers: string[] = filteredUsers.filter(f => f.key_id === "frequent_buyers").map(f => f.value);
    const selectedBirthdayMonth: string[] = filteredUsers.filter(f => f.key_id === "birthday_month").map(f => f.value);
    return { selectedChannel, selectedProduct, selectedPlan, selectedFrequentBuyers, selectedBirthdayMonth };
  };

  const resetAllFilters = () => {
    setPage(1);
    setLimit(10);
    setFilteredUsers([]);
    setCustomersCampaignData([]);
    setDataToDownload([]);
    setIsFiltered(false);
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex flex-wrap justify-start pb-4 items-center">
        <h1 className="text-black font-bold text-2xl mt-2 sm:w-auto w-full">
          Export Users
        </h1>
        <div className="flex space-x-4 ml-auto">
          <Button disabled={dataToDownload.length < 1} onClick={handleGenerateXlsx} className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full text-xs">
            <Download className="w-5 h-5 mr-1 " /> Generate XLSX
          </Button>
        </div>
      </div>

      <div className="flex bg-white rounded-xl gap-4 mb-3 p-6">
        <div className="w-full">
          <div className="flex items-center justify-between">
            <p className="text-sm">Selected Filters</p>
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-between">
                <div onClick={resetAllFilters} className="text-sm font-bold text-[#016DA1] hover:text-[#2d9ae6] cursor-pointer mr-3">
                  Reset Filter
                </div>
                <Button disabled={filteredUsers.length < 1} onClick={handleGetFilteredData} className="bg-[#016DA1] text-white hover:bg-[#2d9ae6] rounded-full text-xs">
                  Get Users
                </Button>
              </div>
            </div>
          </div>
          {filteredUsers.length > 0 && (
            <ul className="mt-3 max-h-24 overflow-y-auto">
              {filteredUsers.map((f: any, index: number) => (
                <li key={index} className="flex justify-between items-center mb-2 gap-2">
                  <div className="bg-[#F8F8F8] py-3 px-4 w-full text-sm text-[#525252] rounded-md border-transparent">{f.label}: {f.valueView}</div>
                  <Button className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0" onClick={() => handleDeleteSelectedFilter(index)}>
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button color="warning" className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black w-auto mt-4" onClick={() => {}}>
                <Plus className="w-4 h-4 mr-2" /> Add Filter
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 w-[1000px] max-w-full overflow-hidden">
              <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
                <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
                  Filters
                  <DialogClose className="ml-auto">
                    <Button type="button" className="bg-transparent hover:bg-transparent text-black p-0">
                      <X className="w-5 h-5" />
                    </Button>
                  </DialogClose>
                </DialogTitle>
              </DialogHeader>

              <div className="p-4 h-full overflow-auto max-h-[70vh]">
                <div className="relative mb-4">
                  <div className="min-w-48">
                    <Select value={selectedFilter} onValueChange={(value) => setSelectedFilter(value)}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {
                            filterOptions.map((item: any, index: number) => (
                              item.active && <SelectItem key={index} value={item.id}>{item.name}</SelectItem>
                            ))
                          }
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {selectedFilter && selectedFilter === "channel_id" && (
                  <div className="relative mb-4">
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
                )}
                {selectedFilter && selectedFilter === "product_id" && (
                  <div className="relative mb-4">
                    <div className="min-w-48">
                      <Select value={product} onValueChange={handleProductChange}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select Product" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {
                              productList.map((item: any, index: number) => (
                                <SelectItem key={index} value={item.id}>{item.name}</SelectItem>
                              ))
                            }
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                {selectedFilter && selectedFilter === "plan_id" && (
                  <div className="relative mb-4">
                    <div className="min-w-48">
                      <Select value={plan} onValueChange={handlePlanChange}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select Plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {
                              planList.map((item: any, index: number) => (
                                <SelectItem key={index} value={item.id}>{item.name}</SelectItem>
                              ))
                            }
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                {selectedFilter && selectedFilter === "frequent_buyers" && (
                  <div>
                    <div className="relative mb-4">
                      <div className="min-w-48">
                        <Select value={frequentBuyersSign} onValueChange={(value) => setFrequentBuyersSign(value)}>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem key={1} value="<">{`<`}</SelectItem>
                              <SelectItem key={2} value=">">{`>`}</SelectItem>
                              <SelectItem key={3} value="<=">{`<=`}</SelectItem>
                              <SelectItem key={4} value=">=">{`>=`}</SelectItem>
                              <SelectItem key={5} value="=">{`=`}</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Input disabled={!frequentBuyersSign} name="frequentBuyersValue" type="number" min={1} value={frequentBuyersValue} onChange={(e) => setFrequentBuyersValue(Number(e.target.value))} className="bg-[#F8F8F8] py-3 px-4 w-full text-sm text-[#525252] rounded-md border-transparent" />
                    </div>
                  </div>
                )}
                {selectedFilter && selectedFilter === "birthday_month" && (
                  <div className="relative mb-4">
                    <div className="min-w-48">
                      <Select value={birthdayMonth} onValueChange={(value) => setBirthdayMonth(value)}>
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
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="sm:justify-center justify-center pb-4 sm:pb-6">
                <DialogClose asChild>
                  <Button type="button" className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black" onClick={handleAddFilterData}>
                    <Check className="w-4 h-4 mr-2" /> Add
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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