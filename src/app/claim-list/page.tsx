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
import useRequireAuth from "@/hooks/useRequireAuth";
import { ClaimService } from "@/services/claim.service";
import { useEffect, useState } from "react";
import { formatMoneyClaim } from "@/lib/formatter";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  Search,
  Trash2,
  X,
} from "react-feather";
import { Button } from "@/components/ui/button";
import noData from "/public/images/no-data.webp";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { hasPermission } from "@/context/auth.context";
import _ from "lodash";
import {
  ChannelsResponse,
  ChannelsService,
} from "@/services/masterdata/channels.service";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import React from "react";
import { DateRange } from "react-day-picker";

const ClaimsPage = () => {
  useRequireAuth();
  const path = usePathname();
  const claimService = new ClaimService();
  const channelsService = new ChannelsService();
  const [claims, setClaims] = useState<any[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();
  const [tab, setTab] = useState("All");
  const [totalData, setTotalData] = useState(0);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [amountApproved, setAmountApproved] = useState(0);
  const [reqAmountApproved, setReqAmountApproved] = useState(0);
  const [numberId, setNumberID] = useState("-");
  const [statusOld, setStatusOld] = useState("-");
  const [notes, setNotes] = useState("");
  const [lackOfDocuments, setLackOfDocuments] = useState("");
  const [amApprovedMsg, setAmApprovedMsg] = useState("");
  const [noteMsg, setNoteMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currencyApp, setCurrencyApp] = useState(" ");
  const [dataDocument, setDataDocument] = useState<any[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [finalSelectedDocuments, setFinalSelectedDocuments] = useState<any[]>(
    []
  );
  const [successUpdate, setSuccessUpdate] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [searchData, setSearchData] = useState("");

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [canCreate, setCanCreate] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);

  const [searchChannel, setSearchChannel] = useState("");
  const [searchSlaStatus, setSearchSlaStatus] = useState("");
  const [channel, setChannel] = useState<ChannelsResponse[]>([]);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [claimStatusOptions, setClaimStatusOptions] = useState<any[]>([]);

  useEffect(() => {
    const checkAccess = async () => {
      const access = await hasPermission("Claim.Read");
      const editBtn = await hasPermission("Claim.Update");
      const deleteBtn = await hasPermission("Claim.Delete");
      const createBtn = await hasPermission("Claim.Create");

      setCanEdit(editBtn);
      setCanDelete(deleteBtn);
      setHasAccess(access);
      setCanCreate(createBtn);
      if (!access) {
        router.push("/forbidden");
      }
    };

    checkAccess();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await claimService.getClaims(
          page,
          rowsPerPage,
          tab === "All" ? "" : tab,
          searchData,
          searchChannel === "All" ? "" : searchChannel,
          searchSlaStatus === "All" ? "" : searchSlaStatus,
          date?.from ? format(date.from, "yyyy-MM-dd") : undefined,
          date?.to ? format(date.to, "yyyy-MM-dd") : undefined
        );
        setFilteredClaims(res?.data);
        setPage(res?.page);
        setTotalPages(res?.pageTotal);
        setTotalItems(res?.total);
        setTotalData(res?.total);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [
    page,
    rowsPerPage,
    tab,
    successUpdate,
    searchData,
    searchChannel,
    searchSlaStatus,
    date,
  ]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = claims.filter((claim) =>
        claim.number.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClaims(filtered);
    } else {
      setFilteredClaims(claims);
    }
  }, [searchTerm, claims]);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const selectTab = (tab: string) => {
    setTab(tab);
    setPage(1);
  };

  const handleSearch = _.debounce((keyword: string) => {
    setSearchData(keyword);
  }, 100);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await channelsService.getChannels(page, rowsPerPage);
        setChannel(response.data);
        setTotalPages(response.pageTotal);
        setTotalItems(response.total);
      } catch (error) {
        console.error("Error fetching insurance products:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchChannels();
  }, [page, rowsPerPage]);

  const handleSearchChannelOnChange = (v: string) => {
    setSearchChannel(v);
  };

  const handleSearchSlaStatusChange = (v: string) => {
    setSearchSlaStatus(v);
  };

  const goToDetail = (claimId: string) => {
    router.push(`${path}/${claimId}`);
  };

  const selectChannel = (id: string) => {
    claimService.getClaimChannel(id).then((res) => {
      setDataDocument(res.data);
    });
  };

  const selectCategory = (id: string) => {
    claimService.getClaimCategory(id).then((res) => {
      setDataDocument(res.data);
    });
  };

  const handleSelectDocument = () => {
    if (selectedClaim) {
      if (selectedClaim.policy) {
        selectCategory(selectedClaim.policy_data.category);
      } else {
        selectChannel(selectedClaim.channel);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "text-gray-400 font-normal";
      case "Submitted":
        return "text-[#7B5D21]";
      case "Proccessing":
        return "text-[#00AB4F]";
      case "Approved":
        return "text-[#00AB4F]";
      case "Document Review":
        return "text-[#016DA1]";
      case "Paid":
        return "text-[#016DA1]";
      case "Closed":
        return "text-[#58585B]";
      case "Lack of Documents":
        return "text-[#FD0300]";
      case "Rejected":
        return "text-[#FD0300]";
      default:
        return "text-[#7B5D21]";
    }
  };

  const handleChangeStatus = (data: any, newStatus: string) => {
    const claimId = data.id;
    setSelectedClaim(data);
    setSelectedClaimId(claimId);
    setPendingStatus(newStatus);
    setIsModalOpen(true);
    setNotes("");
    setNoteMsg("");
    setLackOfDocuments("");
    setSuccessUpdate(false);

    const reqAmount = filteredClaims
      .map((item) => {
        const matchingClaim = item.claim.find(
          (d: any) => d.type === "Number" && d.name === "claim"
        );
        return item.id === claimId
          ? matchingClaim
            ? matchingClaim.value
            : "-"
          : null;
      })
      .filter(Boolean);
    const numberId = filteredClaims
      .map((item) => {
        const matchingClaim = item.number;
        return item.id === claimId
          ? matchingClaim
            ? matchingClaim
            : "-"
          : null;
      })
      .filter(Boolean);
    const statusOld = filteredClaims
      .map((item) => {
        const matchingClaim = item.status;
        return item.id === claimId
          ? matchingClaim
            ? matchingClaim
            : "-"
          : null;
      })
      .filter(Boolean);
    const currencyApp = filteredClaims
      .map((item) => {
        const matchingClaim = item?.currency;
        return item.id === claimId
          ? matchingClaim
            ? matchingClaim
            : "-"
          : null;
      })
      .filter(Boolean);

    setReqAmountApproved(reqAmount[0]);
    setNumberID(numberId[0]);
    setStatusOld(statusOld[0]);
    setCurrencyApp(currencyApp[0]);
  };

  const updateStatus = (
    claimId: string,
    newStatus: string,
    amount_approved?: number,
    note?: string,
    lack_of_documents?: string[]
  ) => {
    claimService
      .updateClaimStatus(
        claimId,
        newStatus,
        amount_approved,
        note,
        lack_of_documents
      )
      .then(() => {
        setSuccessUpdate(true);
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        alert("Failed to update status. Please try again.");
      });
  };

  const confirmModal = () => {
    if (amountApproved > reqAmountApproved) {
      setAmApprovedMsg(
        "Your approval amount limit cannot exceed the requested amount"
      );
      return;
    }
    if (amountApproved === 0 && pendingStatus === "Approved") {
      setAmApprovedMsg("Approved Amount required!");
      return;
    }
    if (
      (notes === "" && pendingStatus === "Rejected") ||
      (notes === "" && pendingStatus === "Lack of Documents")
    ) {
      setNoteMsg("Required!");
      return;
    }

    if (selectedClaimId && pendingStatus) {
      updateStatus(
        selectedClaimId,
        pendingStatus,
        amountApproved,
        notes,
        finalSelectedDocuments.map((item) => item.name)
      );
      setClaims((prevClaims) =>
        prevClaims.map((claim) =>
          claim.id === selectedClaimId
            ? { ...claim, status: pendingStatus }
            : claim
        )
      );
      setIsModalOpen(false);
      setSuccessUpdate(true);
    }
  };

  const cancelModal = () => {
    setIsModalOpen(false);
    setSelectedClaimId(null);
    setPendingStatus(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const numericValue = input.replace(/[^0-9]/g, "");
    setAmountApproved(Number(numericValue));
    setAmApprovedMsg("");
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedDocuments((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((docId) => docId !== id)
        : [...prevSelected, id]
    );
  };

  const handleAddSelectedDocuments = () => {
    const selected = dataDocument.filter((doc) =>
      selectedDocuments.includes(doc.id)
    );
    setFinalSelectedDocuments(selected);
  };

  const handleDeleteSelectedDocument = (id: string) => {
    setFinalSelectedDocuments((prev) => prev.filter((doc) => doc.id !== id));
    setSelectedDocuments((prev) => prev.filter((docId) => docId !== id));
  };

  const isDocumentSelected = (id: string) => selectedDocuments.includes(id);

  const handleClear = () => {
    setDate(undefined);
  };

  useEffect(() => {
    const fetchClaimsStatus = async () => {
      try {
        const response = await claimService.getClaimsStatus();
        const filteredStatus = response.filter(
          (cs: any) => cs.status !== "Draft"
        );
        setClaimStatusOptions(filteredStatus);
      } catch (error) {
        console.error("Error fetching insurance products:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchClaimsStatus();
  }, []);

  return (
    <div className="flex flex-col w-full p-4 md:p-6 ">
      <div className="flex flex-wrap justify-end gap-4 pb-4 items-center">
        <h1 className="text-black font-bold text-2xl mt-2 sm:w-auto w-full">
          Claim List
        </h1>

        <div className="relative sm:max-w-sm sm:min-w-48 min-w-full ml-auto shadow-sm">
          <Input
            type="text"
            placeholder="Search by Claim ID"
            onChange={(e) => handleSearch(e.target.value)}
            className="border p-3 rounded-md pr-10 w-full"
          />
          <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#016da1]" />
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

        {/* <div className="min-w-32">
          <Select
            value={searchChannel}
            onValueChange={handleSearchChannelOnChange}
          >
            <SelectTrigger className="h-16">
              <SelectValue placeholder="Channels" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="All">All Channel</SelectItem>
                {channel.map((channels) => (
                  <SelectItem key={channels.id} value={channels.id}>
                    {channels.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div> */}
        <div className="min-w-32">
          <Select
            value={searchSlaStatus}
            onValueChange={handleSearchSlaStatusChange}
          >
            <SelectTrigger className="h-16">
              <SelectValue placeholder="SLA Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="All">All Priority</SelectItem>
                <SelectItem value="On Track">On Track</SelectItem>
                <SelectItem value="Pending">Due Date</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => router.push(`${path}/export`)}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
        >
          <Download className="w-5 h-5 mr-1 " /> Export
        </Button>
      </div>
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="min-w-96 w-auto max-w-full">
            <p className="text-center">
              <AlertCircle
                width={88}
                height={88}
                className="mx-auto text-[#F5AB1D]"
              />
            </p>
            <p className="text-center font-bold mb-0 text-sm">Are you sure?</p>
            <div className="flex flex-col gap-4">
              <p className="text-center text-sm">
                Update <strong>{numberId}</strong> status <br />
                from <strong>{statusOld}</strong> to{" "}
                <strong>{pendingStatus}</strong>
              </p>
              {pendingStatus === "Approved" && (
                <>
                  <div>
                    <p className="text-sm mb-2">Requested Amount</p>
                    <div className="relative">
                      <span className="absolute left-0 top-0 h-full inline-flex items-center pl-4 text-sm">
                        {currencyApp}
                      </span>
                      <div className="bg-gray-50 text-sm h-12 w-full flex pl-12 items-center rounded-md border border-gray-200">
                        {formatMoneyClaim(reqAmountApproved)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm mb-2">
                      Approved Amount <span className="!text-red-500">*</span>
                    </p>
                    <div className="relative">
                      <span className="absolute left-0 top-0 h-full inline-flex items-center pl-4 text-sm">
                        {currencyApp}
                      </span>
                      <Input
                        type="text"
                        value={
                          amountApproved === 0
                            ? ""
                            : formatMoneyClaim(amountApproved)
                        }
                        onChange={handleInputChange}
                        className="h-12 pl-12"
                        required
                      />
                    </div>
                    <p className="text-xs text-red-500 mt-2">{amApprovedMsg}</p>
                  </div>
                  {/* <div className="w-full">
                    <p className="text-sm mb-2">Reason</p>
                    <textarea
                      name=""
                      id=""
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full text-sm p-2 border border-gray-200 rounded-md"
                      placeholder="Insert Reason"
                    ></textarea>
                  </div> */}
                </>
              )}

              {pendingStatus === "Rejected" && (
                <>
                  <div className="w-full">
                    <p className="text-sm mb-2">
                      Reason <span className="!text-red-500">*</span>
                    </p>
                    <textarea
                      name=""
                      id=""
                      rows={4}
                      value={notes}
                      onChange={(e) => {
                        setNotes(e.target.value);
                        setNoteMsg("");
                      }}
                      className="w-full text-sm p-2 border border-gray-200 rounded-md"
                      placeholder="Insert Reason"
                      required
                    ></textarea>
                    <p className="text-xs text-red-500">{noteMsg}</p>
                  </div>
                </>
              )}

              {pendingStatus === "Lack of Documents Operator" && (
                <>
                  <div className="w-[600px]">
                    <p className="text-sm mb-2">
                      Reason <span className="!text-red-500">*</span>
                    </p>
                    <textarea
                      name=""
                      id=""
                      rows={4}
                      value={notes}
                      onChange={(e) => {
                        setNotes(e.target.value);
                        setNoteMsg("");
                      }}
                      className="w-full text-sm p-2 border border-gray-200 rounded-md"
                      placeholder="Insert detailed reason, e.g.: Harap upload berkas KTP, bukti foto mengalami kerugian, dan foto dokumen keterangan polisi"
                      required
                    ></textarea>
                    <p className="text-xs text-red-500">{noteMsg}</p>
                  </div>
                  <div className="w-full">
                    <p className="text-sm mb-3">
                      Documents Requested{" "}
                      <span className="!text-red-500">*</span>
                    </p>
                    {finalSelectedDocuments.length > 0 && (
                      <ul className="mb-4">
                        {finalSelectedDocuments.map((doc) => (
                          <li
                            key={doc.id}
                            className="flex justify-between items-center mb-2 gap-2"
                          >
                            <Input
                              name="lack_of_documents"
                              value={doc?.label?.en}
                              className="bg-[#F8F8F8] py-3 px-4 w-full text-sm text-[#525252] rounded-md border-transparent"
                            />
                            <Button
                              disabled={!canDelete}
                              className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                              onClick={() =>
                                handleDeleteSelectedDocument(doc.id)
                              }
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Dialog>
                      {filteredClaims.slice(0, 1).map((document) => (
                        <DialogTrigger asChild key={document.id}>
                          <Button
                            color="warning"
                            className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black w-auto"
                            onClick={() => handleSelectDocument()}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Add Document
                          </Button>
                        </DialogTrigger>
                      ))}
                      <DialogContent className="p-0 w-[1000px] max-w-full overflow-hidden">
                        <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
                          <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
                            Select Document
                            <DialogClose className="ml-auto">
                              <Button
                                type="button"
                                className="bg-transparent hover:bg-transparent text-black p-0"
                              >
                                <X className="w-5 h-5" />
                              </Button>
                            </DialogClose>
                          </DialogTitle>
                        </DialogHeader>

                        <div className="p-4">
                          <Table className="table-claims">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="whitespace-nowrap py-2 w-10">
                                  Select
                                </TableHead>
                                <TableHead className="py-2">Name</TableHead>
                                <TableHead className="py-2">Type</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {dataDocument.length > 0 ? (
                                dataDocument
                                  .filter(
                                    (document) =>
                                      document.type === "File" ||
                                      document.type === "File Multiple"
                                  )
                                  .map((document) => (
                                    <TableRow
                                      key={document.id}
                                      className="cursor-pointer"
                                      onClick={() =>
                                        handleCheckboxChange(document.id)
                                      }
                                    >
                                      <TableCell align="center">
                                        <Input
                                          type="checkbox"
                                          checked={isDocumentSelected(
                                            document.id
                                          )}
                                          onChange={() =>
                                            handleCheckboxChange(document.id)
                                          }
                                          className="w-4 h-4"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        {document?.label?.en || "-"}
                                      </TableCell>
                                      <TableCell className="w-36">
                                        {document.type || "-"}
                                      </TableCell>
                                    </TableRow>
                                  ))
                              ) : (
                                <TableRow className="hover:!bg-white">
                                  <TableCell colSpan={10}>
                                    <div className="flex flex-col gap-4 items-center justify-center py-14">
                                      <Image
                                        alt="no data"
                                        src={noData}
                                        width={200}
                                      />
                                      No transaction data available
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>

                        <DialogFooter className="sm:justify-center justify-center pb-4 sm:pb-6">
                          <DialogClose asChild>
                            <Button
                              type="button"
                              className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
                              onClick={handleAddSelectedDocuments}
                            >
                              <Check className="w-4 h-4 mr-2" /> Add selected
                              document
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </>
              )}
              {pendingStatus === "Lack of Documents Insurance" && (
                <>
                  <div className="w-[600px]">
                    <p className="text-sm mb-2">
                      Reason <span className="!text-red-500">*</span>
                    </p>
                    <textarea
                      name=""
                      id=""
                      rows={4}
                      value={notes}
                      onChange={(e) => {
                        setNotes(e.target.value);
                        setNoteMsg("");
                      }}
                      className="w-full text-sm p-2 border border-gray-200 rounded-md"
                      placeholder="Insert detailed reason, e.g.: Harap upload berkas KTP, bukti foto mengalami kerugian, dan foto dokumen keterangan polisi"
                      required
                    ></textarea>
                    <p className="text-xs text-red-500">{noteMsg}</p>
                  </div>
                  <div className="w-full">
                    <p className="text-sm mb-3">
                      Documents Requested{" "}
                      <span className="!text-red-500">*</span>
                    </p>
                    {finalSelectedDocuments.length > 0 && (
                      <ul className="mb-4">
                        {finalSelectedDocuments.map((doc) => (
                          <li
                            key={doc.id}
                            className="flex justify-between items-center mb-2 gap-2"
                          >
                            <Input
                              name="lack_of_documents"
                              value={doc?.label?.en}
                              className="bg-[#F8F8F8] py-3 px-4 w-full text-sm text-[#525252] rounded-md border-transparent"
                            />
                            <Button
                              disabled={!canDelete}
                              className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                              onClick={() =>
                                handleDeleteSelectedDocument(doc.id)
                              }
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Dialog>
                      {filteredClaims.slice(0, 1).map((document) => (
                        <DialogTrigger asChild key={document.id}>
                          <Button
                            color="warning"
                            className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black w-auto"
                            onClick={() => handleSelectDocument()}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Add Document
                          </Button>
                        </DialogTrigger>
                      ))}
                      <DialogContent className="p-0 w-[1000px] max-w-full overflow-hidden">
                        <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
                          <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
                            Select Document
                            <DialogClose className="ml-auto">
                              <Button
                                type="button"
                                className="bg-transparent hover:bg-transparent text-black p-0"
                              >
                                <X className="w-5 h-5" />
                              </Button>
                            </DialogClose>
                          </DialogTitle>
                        </DialogHeader>

                        <div className="p-4">
                          <Table className="table-claims">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="whitespace-nowrap py-2 w-10">
                                  Select
                                </TableHead>
                                <TableHead className="py-2">Name</TableHead>
                                <TableHead className="py-2">Type</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {dataDocument.length > 0 ? (
                                dataDocument
                                  .filter(
                                    (document) =>
                                      document.type === "File" ||
                                      document.type === "File Multiple"
                                  )
                                  .map((document) => (
                                    <TableRow
                                      key={document.id}
                                      className="cursor-pointer"
                                      onClick={() =>
                                        handleCheckboxChange(document.id)
                                      }
                                    >
                                      <TableCell align="center">
                                        <Input
                                          type="checkbox"
                                          checked={isDocumentSelected(
                                            document.id
                                          )}
                                          onChange={() =>
                                            handleCheckboxChange(document.id)
                                          }
                                          className="w-4 h-4"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        {document?.label?.en || "-"}
                                      </TableCell>
                                      <TableCell className="w-36">
                                        {document.type || "-"}
                                      </TableCell>
                                    </TableRow>
                                  ))
                              ) : (
                                <TableRow className="hover:!bg-white">
                                  <TableCell colSpan={10}>
                                    <div className="flex flex-col gap-4 items-center justify-center py-14">
                                      <Image
                                        alt="no data"
                                        src={noData}
                                        width={200}
                                      />
                                      No transaction data available
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>

                        <DialogFooter className="sm:justify-center justify-center pb-4 sm:pb-6">
                          <DialogClose asChild>
                            <Button
                              type="button"
                              className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
                              onClick={handleAddSelectedDocuments}
                            >
                              <Check className="w-4 h-4 mr-2" /> Add selected
                              document
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </>
              )}

              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={cancelModal}
                  className="border-[#E83F3F] text-[#E83F3F] rounded-full w-24"
                >
                  No
                </Button>
                <Button
                  color="warning"
                  onClick={confirmModal}
                  className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full w-24 text-black"
                >
                  Yes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="block bg-white rounded-md mb-3">
        <div className="w-full flex items-center overflow-auto">
          <div
            onClick={() => selectTab("All")}
            className={`cursor-pointer h-full min-h-16 flex items-center justify-center px-5 ${
              tab === "All" && "border-b-[3px] border-primary px-5"
            }`}
          >
            <button
              className={`text-sm mr-3 h-16 ${tab === "All" && "text-primary"}`}
            >
              All Claim
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 px-2 ${
                totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
              } ${tab !== "All" && "hidden"}`}
            >
              {totalData}
            </span>
          </div>
          {claimStatusOptions.map((status) => (
            <div
              key={status.id}
              onClick={() => selectTab(status.status)}
              className={`cursor-pointer h-full min-h-16 flex items-center justify-center px-5 ${
                tab === status.status && "border-b-[3px] border-primary px-5"
              }`}
            >
              <button
                className={`text-sm mr-3 h-16 ${
                  tab === status.status && "text-primary"
                }`}
              >
                {status.status}
              </button>
              <span
                className={`text-center rounded-full bg-red-600 text-white text-xs py-1 px-2 ${
                  status.count > 9
                    ? "px-1.5"
                    : status.count > 99
                    ? "px-0.5"
                    : "px-2"
                } ${tab !== status.status && "hidden"}`}
              >
                {totalData}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full bg-white rounded-lg">
        <Table className="table-claims">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap py-2">No.</TableHead>
              <TableHead className="py-2">Claim ID</TableHead>
              <TableHead className="py-2">Customer Name</TableHead>
              <TableHead className="py-2">Plan Name</TableHead>
              <TableHead className="whitespace-nowrap py-2">Benefit</TableHead>
              <TableHead className="whitespace-nowrap py-2">Currency</TableHead>
              <TableHead className="py-2">Requested Amount</TableHead>
              <TableHead className="py-2">Approved Amount </TableHead>
              <TableHead className="whitespace-nowrap py-2">Status</TableHead>
              <TableHead className="whitespace-nowrap py-2">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClaims.length > 0 ? (
              filteredClaims.map((claim, index) => (
                <TableRow
                  key={claim.id}
                  className={`${
                    claim.sla_status === "Pending"
                      ? "bg-[#FFFEE2]"
                      : claim.sla_status === "Overdue"
                      ? "bg-[#fadede]"
                      : ""
                  }`}
                >
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      {claim.number}
                    </div>
                  </TableCell>
                  <TableCell>
                    {claim?.policy_data?.policy_holder?.name || "-"}
                  </TableCell>
                  <TableCell>
                    {claim.package?.plan?.name.split("|").join(" - ") || "-"}
                  </TableCell>
                  <TableCell>{claim?.benefit?.description_en || "-"}</TableCell>
                  <TableCell>{claim?.currency || "-"}</TableCell>
                  <TableCell>
                    {(() => {
                      const claimValue = claim.claim?.find(
                        (d: any) => d.type === "Number" && d.name === "claim"
                      )?.value;

                      const numericValue = Number(claimValue);

                      return !isNaN(numericValue)
                        ? formatMoneyClaim(numericValue)
                        : "-";
                    })()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      {formatMoneyClaim(
                        claim.amount_approved != null
                          ? claim.amount_approved
                          : 0
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold whitespace-nowrap">
                    <Select
                      value={claim.status}
                      disabled={!canEdit}
                      onValueChange={(value) => {
                        handleChangeStatus(claim, value);
                      }}
                    >
                      <SelectTrigger
                        className={`w-[240px] h-10 select-status border-0 bg-transparent hover:cursor-pointer py-2 ${getStatusColor(
                          claim.status
                        )}`}
                      >
                        <SelectValue>
                          {claim.status || "Select Status"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="Submitted"
                          disabled={claim.status !== "Draft"}
                        >
                          Submitted
                        </SelectItem>
                        <SelectItem
                          value="Acknowledged"
                          disabled={claim.status !== "Submitted"}
                        >
                          Acknowledged
                        </SelectItem>
                        <SelectItem
                          value="Document Review Operator"
                          disabled={
                            claim.status !== "Acknowledged" &&
                            claim.status !== "Lack of Documents Operator"
                          }
                        >
                          Document Review Operator
                        </SelectItem>
                        <SelectItem
                          value="Lack of Documents Operator"
                          disabled={claim.status !== "Document Review Operator"}
                        >
                          Lack of Documents Operator
                        </SelectItem>
                        <SelectItem
                          value="Document Review Insurance"
                          disabled={
                            claim.status !== "Document Review Operator" &&
                            claim.status !== "Lack of Documents Insurance"
                          }
                        >
                          Document Review Insurance
                        </SelectItem>
                        <SelectItem
                          value="Lack of Documents Insurance"
                          disabled={
                            claim.status !== "Document Review Insurance"
                          }
                        >
                          Lack of Documents Insurance
                        </SelectItem>
                        <SelectItem
                          value="Claim Assessment"
                          disabled={
                            claim.status !== "Document Review" &&
                            claim.status !== "Document Review Insurance"
                          }
                        >
                          Claim Assessment
                        </SelectItem>
                        <SelectItem
                          value="Approved"
                          disabled={claim.status !== "Claim Assessment"}
                        >
                          Approved
                        </SelectItem>
                        <SelectItem
                          value="Rejected"
                          disabled={claim.status !== "Claim Assessment"}
                        >
                          Rejected
                        </SelectItem>
                        <SelectItem
                          value="Paid"
                          disabled={claim.status !== "Approved"}
                        >
                          Paid
                        </SelectItem>
                        <SelectItem
                          value="Closed"
                          disabled={
                            claim.status !== "Paid" &&
                            claim.status !== "Rejected"
                          }
                        >
                          Closed
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => goToDetail(claim.id)}
                      className="rounded-full"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:!bg-white">
                <TableCell colSpan={10}>
                  <div className="flex flex-col gap-4 items-center justify-center py-14">
                    <Image alt="no data" src={noData} width={200} /> No
                    transaction data available
                  </div>
                </TableCell>{" "}
              </TableRow>
            )}
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

const ClaimsWithSidebar = (params: any) => WithSidebar(ClaimsPage)(params);
export default ClaimsWithSidebar;
