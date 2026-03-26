"use client";
import _ from "lodash";
import React from "react";
import noData from "@public/images/no-data.webp";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { formatMoneyClaim } from "@/lib/formatter";
import { Calendar, Popover, PopoverContent, PopoverTrigger } from "@repo/ui";
import { useAuth } from "@/context/auth.context";
import { usePathname, useRouter } from "next/navigation";
import { claimsService } from "@/services/claims/api/claims.service";
import {
  useClaimConfigurations,
} from "@/services/claims/hooks/queries";
import { useUpdateClaimStatus } from "@/services/claims/hooks/mutations";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Check,
  Download,
  Eye,
  Plus,
  Trash2,
  Upload,
  X,
} from "react-feather";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui";
import { DataTable } from "@/components/ui/DataTable";
import { ClaimItem } from "@/interface";
import {
  createClaimsTableColumns,
  createDocumentTableColumns,
} from "@/components/tableConfig/claimTableConfig";
import useClaims from "@/hooks/useClaims.hooks";
import AppURL from "@/constants/app-url.const";

const ClaimsPage = () => {
  const path = usePathname();
  const {
    // Data
    filteredClaims,
    totalPages,
    totalData,
    channels,

    // States
    page,
    rowsPerPage,
    tab,
    date,
    searchSlaStatus,
    searchChannel,
    searchData,
    selectedChannel,

    // Loading
    isFetching,

    // Methods
    refetch,
    setPage,
    setDate,
    handleSearch,
    handleRowsPerPageChange,
    selectTab,
    handleSearchSlaStatusChange,
    handleChannelChange,
  } = useClaims();
  const { data: claimConfigurations } = useClaimConfigurations();
  const { mutateAsync: updateClaimStatusMutation } = useUpdateClaimStatus();
  const router = useRouter();

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
  const [docsMsg, setDocsMsg] = useState("");
  const [currencyApp, setCurrencyApp] = useState(" ");
  const [dataDocument, setDataDocument] = useState<any[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [finalSelectedDocuments, setFinalSelectedDocuments] = useState<any[]>(
    [],
  );
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [canCreate, setCanCreate] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);

  const [claimStatusOptions, setClaimStatusOptions] = useState<any[]>([]);
  const [openAllStatus, setOpenAllStatus] = useState<boolean>(false);
  const { permissionList } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Claim.Read");
      const editBtn = permissionList.includes("Claim.Update");
      const deleteBtn = permissionList.includes("Claim.Delete");
      const createBtn = permissionList.includes("Claim.Create");
      const openAllStatus = permissionList.includes(
        "Claim.AllowChangeAllStatus",
      );

      setCanEdit(editBtn);
      setCanDelete(deleteBtn);
      setHasAccess(access);
      setCanCreate(createBtn);
      setOpenAllStatus(openAllStatus);

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router]);

  const goToDetail = (claimId: string) => {
    router.push(`${path}/detail/${claimId}`);
  };

  const selectChannel = (id: string) => {
    claimsService.getClaimChannelForms(id).then((res: any) => {
      setDataDocument(res?.data || []);
    });
  };

  const selectCategory = (id: string, dataId: string) => {
    claimsService.getClaimCategoryForms(id).then((response: any) => {
      const label = filteredClaims?.filter((f: any) => f?.id === dataId)?.[0]
        ?.claim_config;

      const updatedDataDocument = response?.data
        .filter(
          (doc: any) =>
            doc.type.toLowerCase() === "file" ||
            doc.type.toLowerCase() === "file multiple",
        )
        .map((document: any) => ({
          ...document,
          label: {
            ...document.label,
            en:
              document.label?.en ||
              document?.label_multilanguage?.en ||
              document.label,
          },
        }));

      const updatedDataDocumentFields =
        response?.data
          ?.filter(
            (doc: any) =>
              doc?.type?.toLowerCase() === "fields" && doc?.fields?.length > 0,
          )
          .map((a: any) =>
            a?.fields?.filter(
              (doc: any) =>
                doc?.type?.toLowerCase() === "file" ||
                doc?.type?.toLowerCase() === "file multiple",
            ),
          )
          ?.flat() || [];

      setDataDocument([
        ...updatedDataDocument,
        ...updatedDataDocumentFields,
        ...label,
      ]);
    });
  };

  const handleSelectDocument = () => {
    if (selectedClaim) {
      if (selectedClaim.policy) {
        selectCategory(selectedClaim.category, selectedClaim.id);
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

    const reqAmount = filteredClaims
      .map((item) => {
        const matchingClaim = item.claim.find(
          (d: any) => d.type === "Number" && d.name === "claim",
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
    setFinalSelectedDocuments([]);
    setSelectedDocuments([]);
  };

  const updateStatus = (
    claimId: string,
    newStatus: string,
    amount_approved?: number,
    note?: string,
    lack_of_documents?: string[],
  ) => {
    updateClaimStatusMutation({
      id: claimId,
      payload: {
        status: newStatus,
        note,
        amount_approved,
        lack_of_documents,
      },
    })
      .then(() => {
        alert("Update status successfully.");
        refetch();
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        alert("Failed to update status. Please try again.");
      });
  };

  const confirmModal = () => {
    if (selectedClaim.amount && selectedClaim.amount > 0) {
      if (amountApproved > reqAmountApproved) {
        setAmApprovedMsg(
          "Your approval amount limit cannot exceed the requested amount",
        );
        return;
      }
      if (amountApproved === 0 && pendingStatus === "Approved") {
        setAmApprovedMsg("Approved Amount required!");
        return;
      }
    }

    if (
      (notes === "" &&
        pendingStatus === "Approved" &&
        selectedChannel.name != "drgadget") ||
      (notes === "" && pendingStatus === "Rejected") ||
      (notes === "" && pendingStatus === "Lack of Documents Operator") ||
      (notes === "" && pendingStatus === "Lack of Documents Insurance")
    ) {
      setNoteMsg("Required!");
      return;
    }

    if (
      (finalSelectedDocuments.length < 1 &&
        pendingStatus === "Lack of Documents Operator") ||
      (finalSelectedDocuments.length < 1 &&
        pendingStatus === "Lack of Documents Insurance")
    ) {
      setDocsMsg("Required!");
      return;
    }

    if (selectedClaimId && pendingStatus) {
      updateStatus(
        selectedClaimId,
        pendingStatus,
        amountApproved,
        notes,
        finalSelectedDocuments.map((item) =>
          !!item.nameForUpdateStatus ? item.nameForUpdateStatus : item.name,
        ),
      );
      setIsModalOpen(false);
      setFinalSelectedDocuments([]);
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
        : [...prevSelected, id],
    );
  };

  const handleAddSelectedDocuments = () => {
    const selected = dataDocument.filter((doc) =>
      selectedDocuments.includes(doc.name),
    );
    const docListFields =
      dataDocument.length > 0
        ? dataDocument
            .filter(
              (doc: any) =>
                doc.type.toLowerCase() === "fields" && doc.fields.length > 0,
            )
            .map((a: any) =>
              a.fields.filter(
                (doc: any) =>
                  doc.type.toLowerCase() === "file" ||
                  doc.type.toLowerCase() === "file multiple",
              ),
            )
            .flat()
            .map((d: any) => ({
              ...d,
              nameForUpdateStatus: `${d?.name}-fields.${d?.name}` || "-",
            }))
        : [];
    const selectedFields = docListFields.filter((doc) =>
      selectedDocuments.includes(doc.name),
    );
    setFinalSelectedDocuments([...selected, ...selectedFields]);
  };

  const handleDeleteSelectedDocument = (id: string) => {
    setFinalSelectedDocuments((prev) => prev.filter((doc) => doc.name !== id));
    setSelectedDocuments((prev) => prev.filter((docId) => docId !== id));
  };

  const isDocumentSelected = (id: string) => selectedDocuments.includes(id);

  const handleClear = () => {
    setDate(undefined);
  };

  useEffect(() => {
    if (Array.isArray(claimConfigurations)) {
      const filteredStatus = claimConfigurations.filter(
        (cs: any) => cs.status !== "Draft",
      );
      setClaimStatusOptions(filteredStatus);
    }
  }, [claimConfigurations]);

  const handleExport = () => {
    const exportData = {
      page,
      limit: rowsPerPage,
      status: tab === "All" ? "" : tab,
      search: searchData,
      sla_status: searchSlaStatus === "All" ? "" : searchSlaStatus,
      date_from: date?.from ? format(date.from, "yyyy-MM-dd") : undefined,
      date_to: date?.to ? format(date.to, "yyyy-MM-dd") : undefined,
      channel: searchChannel,
    };

    localStorage.setItem("exportClaimData", JSON.stringify(exportData));
    router.push(`${path}/export`);
  };

  const claimsTableColumns = createClaimsTableColumns({
    page,
    rowsPerPage,
    canEdit,
    openAllStatus,
    onStatusChange: handleChangeStatus,
    onViewDetail: goToDetail,
    getStatusColor,
  });

  const documentTableColumns = createDocumentTableColumns({
    selectedDocuments,
    onCheckboxChange: handleCheckboxChange,
    onSelectDocument: handleSelectDocument,
    isDocumentSelected,
  });

  const getRowClassName = (claim: ClaimItem) => {
    return claim.sla_status === "Due Date"
      ? "bg-[#FFFEE2]"
      : claim.sla_status === "Overdue"
        ? "bg-[#fadede]"
        : "";
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6 ">
      <div className="flex flex-wrap justify-end gap-4 pb-4 items-center">
        <h1 className="text-black font-bold text-2xl mt-2 sm:w-auto w-full mr-auto">
          Claim List
        </h1>

        <div className="flex gap-2 sm:w-auto w-full relative">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "sm:w-[280px] w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
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
            <PopoverContent sideOffset={4} className="w-auto p-0" align="start">
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
              !date && "text-gray-500 cursor-not-allowed",
            )}
            title="Clear"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="min-w-48">
          <Select
            value={searchChannel || ""}
            onValueChange={handleChannelChange}
          >
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

        <div className="min-w-32">
          <Select
            value={searchSlaStatus}
            onValueChange={handleSearchSlaStatusChange}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="SLA Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="All">All Priority</SelectItem>
                <SelectItem value="On Track">On Track</SelectItem>
                <SelectItem value="Due Date">Due Date</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => router.push(`${path}/import`)}
          className="bg-[#016DA1] text-white hover:bg-[#0482C2] rounded-full"
        >
          <Upload className="w-5 h-5 mr-1" /> Import
        </Button>
        {/* New button to redirect to the new import page with preview */}
        <Button
          onClick={() => router.push(`${path}/import-with-preview`)}
          className="bg-[#016DA1] text-white hover:bg-[#0482C2] rounded-full"
        >
          <Upload className="w-5 h-5 mr-1" /> Import with Preview
        </Button>
        <Button
          onClick={handleExport}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
        >
          <Download className="w-5 h-5 mr-1 " /> Export
        </Button>
      </div>
      {isModalOpen && (
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
                  {selectedClaim.amount && selectedClaim.amount > 0 ? (
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
                          Approved Amount{" "}
                          <span className="!text-red-500">*</span>
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
                        <p className="text-xs text-red-500 mt-2">
                          {amApprovedMsg}
                        </p>
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                  {selectedChannel.name != "drgadget" ? (
                    <textarea
                      name=""
                      id=""
                      rows={4}
                      value={notes}
                      onChange={(e) => {
                        setNotes(e.target.value);
                      }}
                      className="w-full text-sm p-2 border border-gray-200 rounded-md"
                      placeholder="Insert Reason"
                    ></textarea>
                  ) : (
                    ""
                  )}
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

              {(pendingStatus === "Lack of Documents Operator" ||
                pendingStatus === "Lack of Documents Insurance") && (
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
                    <p className="text-sm">
                      Lack of Document Reasons{" "}
                      <span className="!text-red-500">*</span>
                    </p>
                    {finalSelectedDocuments.length > 0 && (
                      <ul className="mt-3">
                        {finalSelectedDocuments.map((doc) => (
                          <li
                            key={doc.id}
                            className="flex justify-between items-center mb-2 gap-2"
                          >
                            <Input
                              name="lack_of_documents"
                              value={
                                doc?.label?.en ||
                                doc?.label_multilanguage?.en ||
                                doc?.label ||
                                "-"
                              }
                              className="bg-[#F8F8F8] py-3 px-4 w-full text-sm text-[#525252] rounded-md border-transparent"
                            />
                            <Button
                              disabled={!canDelete}
                              className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                              onClick={() =>
                                handleDeleteSelectedDocument(doc.name)
                              }
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="text-xs text-red-500">{docsMsg}</p>

                    <Dialog>
                      {filteredClaims.slice(0, 1).map((document) => (
                        <DialogTrigger asChild key={document.id}>
                          <Button
                            color="warning"
                            className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black w-auto mt-4"
                            onClick={() => handleSelectDocument()}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Add Document
                          </Button>
                        </DialogTrigger>
                      ))}
                      <DialogContent className="p-0 w-[1000px] max-w-full overflow-hidden">
                        <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
                          <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
                            Lack of Document Reasons
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

                        <div className="p-4 h-full overflow-auto max-h-[70vh]">
                          <DataTable
                            data={dataDocument.filter(
                              (document) =>
                                document.type.toLowerCase() === "file" ||
                                document.type.toLowerCase() ===
                                  "file multiple" ||
                                document.type.toLowerCase() === "fields",
                            )}
                            columns={documentTableColumns}
                            noDataImage={noData}
                            noDataText="No document data available"
                            className="table-claims"
                          />
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
            className={`cursor-pointer h-full min-h-16 flex items-center justify-center px-5 whitespace-nowrap ${
              tab === "All" && "border-b-[3px] border-primary px-5"
            }`}
          >
            <button
              className={`text-sm mr-3 min-h-[90px] ${
                tab === "All" && "text-primary"
              }`}
            >
              All Claim
            </button>
            <span
              className={`text-center rounded-full bg-red-600 text-white text-xs py-1 px-2 whitespace-nowrap ${
                totalData > 9 ? "px-1.5" : totalData > 99 ? "px-0.5" : "px-2"
              } ${tab !== "All" && "hidden"}`}
            >
              {totalData}
            </span>
          </div>
          {claimStatusOptions.map((status, index) => (
            <div
              key={status.id || index}
              onClick={() => selectTab(status.status)}
              className={`cursor-pointer h-full min-h-16 flex items-center justify-center px-5 whitespace-nowrap ${
                tab === status.status && "border-b-[3px] border-primary px-5"
              }`}
            >
              <button
                className={`text-sm mr-3 min-h-[90px] ${
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
      <DataTable
        loading={isFetching}
        data={filteredClaims}
        columns={claimsTableColumns}
        search={{
          placeholder: "Search by Claim ID",
          onSearch: handleSearch,
        }}
        pagination={{
          page,
          totalPages,
          rowsPerPage,
          totalItems: totalData,
          onPageChange: setPage,
          onRowsPerPageChange: handleRowsPerPageChange,
        }}
        noDataImage={noData}
        noDataText="No transaction data available"
        className="table-claims"
        getRowClassName={getRowClassName}
      />
    </div>
  );
};

export default ClaimsPage;

