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
import { formatMoney } from "@/lib/formatter";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
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
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const PolicyPage = () => {
  useRequireAuth();
  const path = usePathname();
  const claimService = new ClaimService();
  const [claims, setClaims] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
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

  useEffect(() => {
    claimService
      .getClaims(page, rowsPerPage, tab == "All" ? "" : tab)
      .then((res) => {
        setFilteredTransactions(res.data);
        setPage(res.page);
        setTotalPages(res.pageTotal);
        setTotalItems(res.total);
        setTotalData(res.total);
      });
  }, [page, rowsPerPage, tab, claims]);

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
    console.log(newStatus);
    setSelectedClaimId(claimId);
    setPendingStatus(newStatus);
    setIsModalOpen(true);
    setNotes("");
    setAmountApproved(0);
    setNoteMsg("");
    const reqAmount = filteredTransactions
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
    const numberId = filteredTransactions
      .map((item) => {
        const matchingClaim = item.number;
        return item.id === claimId
          ? matchingClaim
            ? matchingClaim
            : "-"
          : null;
      })
      .filter(Boolean);
    const statusOld = filteredTransactions
      .map((item) => {
        const matchingClaim = item.status;
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
        "Approved Amount tidak boleh lebih dari Requested Amount"
      );
      return;
    }
    if (amountApproved === 0 && pendingStatus === "Approved") {
      setAmApprovedMsg("Approved Amount wajib diisi !");
      console.log("masuk");
      return;
    }
    if (
      (notes === "" && pendingStatus === "Rejected") ||
      (notes === "" && pendingStatus === "Lack of Documents")
    ) {
      setNoteMsg("Wajib diisi!");
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

  return (
    <div className="flex flex-col w-full p-4 md:p-6 ">
      <h1 className="text-black font-bold text-2xl mt-2 mb-4">Claim List</h1>
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
                    <Input
                      type="number"
                      value={reqAmountApproved}
                      disabled
                      className="bg-gray-50 h-12 !opacity-100"
                    />
                  </div>
                  <div>
                    <p className="text-sm mb-2">
                      Approved Amount <span className="!text-red-500">*</span>
                    </p>
                    <Input
                      type="number"
                      value={amountApproved === 0 ? "" : amountApproved}
                      onChange={(e) => {
                        setAmountApproved(Number(e.target.value));
                        setAmApprovedMsg("");
                      }}
                      className="h-12"
                      required
                    />
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
                    <p className="text-sm mb-2">Reason (Opsional)</p>
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
                      placeholder="Insert reason (Opsional)"
                      required
                    ></textarea>
                    <p className="text-xs text-red-500">{noteMsg}</p>
                  </div>
                </>
              )}

              {pendingStatus === "Lack of Documents" && (
                <>
                  <div className="w-full">
                    <p className="text-sm mb-2">Reason (Opsional)</p>
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
                      placeholder="Insert reason (Opsional)"
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
            Application Sent
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
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((claim, index) => (
                <TableRow key={claim.id}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      {claim.number}
                    </div>
                  </TableCell>
                  <TableCell>{claim.policy_data.account.name || "-"}</TableCell>
                  <TableCell>
                    {claim.policy_data?.declarations?.transaction_data?.insurance?.plan?.name
                      .split("|")
                      .join(" - ")}
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
                    {claim.claim.find(
                      (d: any) => d.type === "Number" && d.name === "claim"
                    ).value || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      {claim.amount_approved || "-"}
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
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Application Sent">
                          Application Sent
                        </SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Payment Processing">
                          Payment Processing
                        </SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
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
                <TableCell colSpan={9}>
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
              <TableCell colSpan={8}>
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
