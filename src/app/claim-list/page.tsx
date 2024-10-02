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
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  X,
} from "react-feather";
import { Button } from "@/components/ui/button";
import noData from "/public/images/no-data.webp";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const PolicyPage = () => {
  useRequireAuth();
  const path = usePathname();
  const claimService = new ClaimService();
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
  const [amApprovedMsg, setAmApprovedMsg] = useState("");
  const [noteMsg, setNoteMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currencyApp, setCurrencyApp] = useState(" ");

  useEffect(() => {
    claimService
      .getClaims(page, rowsPerPage, tab == "All" ? "" : tab)
      .then((res) => {
        setFilteredClaims(res.data);
        setPage(res.page);
        setTotalPages(res.pageTotal);
        setTotalItems(res.total);
        setTotalData(res.total);
      });
  }, [page, rowsPerPage, tab, claims]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = claims.filter((claim) =>
        claim.number.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log(filtered);
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

  const goToDetail = (claimId: string) => {
    router.push(`${path}/${claimId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "text-gray-400 font-normal";
      case "Application Sent":
        return "text-[#7B5D21]";
      case "Proccessing":
        return "text-[#00AB4F]";
      case "Approved":
        return "text-[#00AB4F]";
      case "Payment Processing":
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

  const handleChangeStatus = (claimId: string, newStatus: string) => {
    setSelectedClaimId(claimId);
    setPendingStatus(newStatus);
    setIsModalOpen(true);
    setNotes("");
    setNoteMsg("");

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
        const matchingClaim =
          item.policy_data?.declarations?.transaction_data?.insurance?.currency;
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
    note?: string
  ) => {
    claimService
      .updateClaimStatus(claimId, newStatus, amount_approved, note)
      .then(() => {
        setClaims((prevClaims) =>
          prevClaims.map((claim) =>
            claim.id === claimId ? { ...claim, status: newStatus } : claim
          )
        );
        router.refresh();
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
      console.log("masuk");
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
      updateStatus(selectedClaimId, pendingStatus, amountApproved, notes);
      setClaims((prevClaims) =>
        prevClaims.map((claim) =>
          claim.id === selectedClaimId
            ? { ...claim, status: pendingStatus }
            : claim
        )
      );
      setIsModalOpen(false);
    }
  };

  const cancelModal = () => {
    setIsModalOpen(false);
    setSelectedClaimId(null);
    setPendingStatus(null);
  };

  const downloadReport = () => {};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const numericValue = input.replace(/[^0-9]/g, "");
    setAmountApproved(Number(numericValue));
    setAmApprovedMsg("");
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6 ">
      <div className="flex gap-4">
        <h1 className="text-black font-bold text-2xl mt-2 mb-4">Claim List</h1>
        <Button
          className="rounded-full ml-auto bg-[#F5BA41] hover:bg-[#e4ab3a] text-black"
          onClick={downloadReport}
        >
          <Download width={20} height={20} />
          <span className="ml-1">Report</span>
        </Button>
      </div>
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
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
                  <div className="w-full">
                    <p className="text-sm mb-2">Reason (Opsional)</p>
                    <textarea
                      name=""
                      id=""
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full text-sm p-2 border border-gray-200 rounded-md"
                      placeholder="Insert reason (Opsional)"
                    ></textarea>
                  </div>
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
                      placeholder="Insert reason"
                      required
                    ></textarea>
                    <p className="text-xs text-red-500">{noteMsg}</p>
                  </div>
                </>
              )}

              {pendingStatus === "Lack of Documents" && (
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
                      placeholder="Insert reason "
                      required
                    ></textarea>
                    <p className="text-xs text-red-500">{noteMsg}</p>
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
      <div className="flex items-center justify-start h-16 bg-white rounded-md mb-3">
        <div
          onClick={() => selectTab("All")}
          className={`cursor-pointer h-full flex items-center justify-center px-7 ${
            tab === "All" && "border-b-[3px] border-primary px-7"
          }`}
        >
          <button
            className={`text-sm py-5 mr-3 ${tab === "All" && "text-primary"}`}
          >
            All Claim
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
          onClick={() => selectTab("Application Sent")}
          className={`cursor-pointer h-full flex items-center justify-center px-7 ${
            tab === "Application Sent" && "border-b-[3px] border-primary px-7"
          }`}
        >
          <button
            className={`text-sm py-5 mr-3 ${
              tab === "Application Sent" && "text-primary"
            }`}
          >
            Receive Claim
          </button>
          <span
            className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
              totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
            } ${tab !== "Application Sent" && "hidden"}`}
          >
            {totalData}
            <span
              className={`${totalData < 100 && "hidden"}`}
              style={{ fontSize: "10px" }}
            ></span>
          </span>
        </div>
        <div
          onClick={() => selectTab("Processing")}
          className={`cursor-pointer h-full flex items-center justify-center px-7 ${
            tab === "Processing" && "border-b-[3px] border-primary px-7"
          }`}
        >
          <button
            className={`text-sm py-5 mr-3 ${
              tab === "Processing" && "text-primary"
            }`}
          >
            Processing
          </button>
          <span
            className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
              totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
            } ${tab !== "Processing" && "hidden"}`}
          >
            {totalData}
            <span
              className={`${totalData < 100 && "hidden"}`}
              style={{ fontSize: "10px" }}
            ></span>
          </span>
        </div>
        <div
          onClick={() => selectTab("Approved")}
          className={`cursor-pointer h-full flex items-center justify-center px-7 ${
            tab === "Approved" && "border-b-[3px] border-primary px-7"
          }`}
        >
          <button
            className={`text-sm py-5 mr-3 ${
              tab === "Approved" && "text-primary"
            }`}
          >
            Approved
          </button>
          <span
            className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
              totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
            } ${tab !== "Approved" && "hidden"}`}
          >
            {totalData}
            <span
              className={`${totalData < 100 && "hidden"}`}
              style={{ fontSize: "10px" }}
            ></span>
          </span>
        </div>
        <div
          onClick={() => selectTab("Payment Processing")}
          className={`cursor-pointer h-full flex items-center justify-center px-7 ${
            tab === "Payment Processing" && "border-b-[3px] border-primary px-7"
          }`}
        >
          <button
            className={`text-sm py-5 mr-3 ${
              tab === "Payment Processing" && "text-primary"
            }`}
          >
            Payment Processing
          </button>
          <span
            className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
              totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
            } ${tab !== "Payment Processing" && "hidden"}`}
          >
            {totalData}
            <span
              className={`${totalData < 100 && "hidden"}`}
              style={{ fontSize: "10px" }}
            ></span>
          </span>
        </div>
        <div
          onClick={() => selectTab("Paid")}
          className={`cursor-pointer h-full flex items-center justify-center px-7 ${
            tab === "Paid" && "border-b-[3px] border-primary px-7"
          }`}
        >
          <button
            className={`text-sm py-5 mr-3 ${tab === "Paid" && "text-primary"}`}
          >
            Paid
          </button>
          <span
            className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
              totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
            } ${tab !== "Paid" && "hidden"}`}
          >
            {totalData}
            <span
              className={`${totalData < 100 && "hidden"}`}
              style={{ fontSize: "10px" }}
            ></span>
          </span>
        </div>
        <div
          onClick={() => selectTab("Closed")}
          className={`cursor-pointer h-full flex items-center justify-center px-7 ${
            tab === "Closed" && "border-b-[3px] border-primary px-7"
          }`}
        >
          <button
            className={`text-sm py-5 mr-3 ${
              tab === "Closed" && "text-primary"
            }`}
          >
            Closed
          </button>
          <span
            className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
              totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
            } ${tab !== "Closed" && "hidden"}`}
          >
            {totalData}
            <span
              className={`${totalData < 100 && "hidden"}`}
              style={{ fontSize: "10px" }}
            ></span>
          </span>
        </div>
        <div
          onClick={() => selectTab("Lack of Documents")}
          className={`cursor-pointer h-full flex items-center justify-center px-7 ${
            tab === "Lack of Documents" && "border-b-[3px] border-primary px-7"
          }`}
        >
          <button
            className={`text-sm py-5 mr-3 ${
              tab === "Lack of Documents" && "text-primary"
            }`}
          >
            Lack of Documents
          </button>
          <span
            className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
              totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
            } ${tab !== "Lack of Documents" && "hidden"}`}
          >
            {totalData}
            <span
              className={`${totalData < 100 && "hidden"}`}
              style={{ fontSize: "10px" }}
            ></span>
          </span>
        </div>
        <div
          onClick={() => selectTab("Rejected")}
          className={`cursor-pointer h-full flex items-center justify-center px-7 ${
            tab === "Rejected" && "border-b-[3px] border-primary px-7"
          }`}
        >
          <button
            className={`text-sm py-5 mr-3 ${
              tab === "Rejected" && "text-primary"
            }`}
          >
            Rejected
          </button>
          <span
            className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${
              totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
            } ${tab !== "Rejected" && "hidden"}`}
          >
            {totalData}
            <span
              className={`${totalData < 100 && "hidden"}`}
              style={{ fontSize: "10px" }}
            ></span>
          </span>
        </div>
      </div>
      <div className="w-full p-4 md:p-6 bg-white rounded-lg">
        <Table className="table-claims">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">No.</TableHead>
              <TableHead>Claim ID</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Plan Name</TableHead>
              <TableHead className="whitespace-nowrap">Benefit</TableHead>
              <TableHead className="whitespace-nowrap">Currency</TableHead>
              <TableHead>Requested Amount</TableHead>
              <TableHead>Approved Amount </TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClaims.length > 0 ? (
              filteredClaims.map((claim, index) => (
                <TableRow key={claim.id}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      {claim.number}
                    </div>
                  </TableCell>
                  <TableCell>
                    {claim?.policy_data?.account?.name || "-"}
                  </TableCell>
                  <TableCell>
                    {claim.policy_data?.declarations?.transaction_data?.insurance?.plan?.name
                      .split("|")
                      .join(" - ") || "-"}
                  </TableCell>
                  <TableCell>
                    {claim.policy_data?.declarations?.transaction_data
                      ?.insurance?.package_data?.benefits[0]?.benefits
                      ?.description_en || "-"}
                  </TableCell>
                  <TableCell>
                    {claim.policy_data?.declarations?.transaction_data
                      ?.insurance?.currency || "-"}
                  </TableCell>
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
                      onValueChange={(value) =>
                        handleChangeStatus(claim.id, value)
                      }
                    >
                      <SelectTrigger
                        className={`w-[180px] h-10 select-status border-0 bg-transparent hover:cursor-pointer py-2 ${getStatusColor(
                          claim.status
                        )}`}
                      >
                        <SelectValue>
                          {claim.status || "Select Status"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Application Sent">
                          Receive Claim
                        </SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Payment Processing">
                          Payment Processing
                        </SelectItem>
                        <SelectItem
                          value="Paid"
                          disabled={claim.status !== "Approved"}
                        >
                          Paid
                        </SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                        <SelectItem value="Lack of Documents">
                          Lack of Documents
                        </SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
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

const TransactionWithSidebar = (params: any) => WithSidebar(PolicyPage)(params);
export default TransactionWithSidebar;
