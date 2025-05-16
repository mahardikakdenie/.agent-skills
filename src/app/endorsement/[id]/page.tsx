"use client";
import * as XLSX from "xlsx";
import Image from "next/image";
import WithSidebar from "@/hoc/with-sidebar";
import noImage from "/public/images/no-image.png";
import { saveAs } from "file-saver";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EndorsementService } from "@/services/endorsement.service";
import { AlertCircle, ChevronLeft, Download, Upload } from "react-feather";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const DetailEndorsement = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [endorsement, setEndorsement] = useState<any>(null);
  const imageUrl = endorsement?.participants?.nric_front || noImage.src;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const endorsementService = new EndorsementService();
  const isEDSB = endorsement?.number?.startsWith("EDSB-");

  useEffect(() => {
    const fetchEndorsementData = async (id: string) => {
      const endorsementService = new EndorsementService();
      try {
        const endorsementDetailResponse =
          await endorsementService.getEndorsementDetail(id);
        setEndorsement(endorsementDetailResponse);
      } catch (error) {
        console.error("Error fetching endorsement data:", error);
      }
    };

    if (params.id) {
      fetchEndorsementData(params.id as string);
    }
  }, [params.id]);

  if (!endorsement) {
    return (<div className="w-full h-full flex justify-center items-center">Loading...</div>);
  }

  const rejectedModal = async (id: string) => {
    try {
      await endorsementService.updateStatus(id, { status: "Rejected", note: notes, });
      window.location.reload();
    } catch (error) {
      alert(error);
    }
  };

  const confirmModal = async (id: string) => {
    try {
      await endorsementService.updateStatus(id, { status: "Approved", note: "", });
      window.location.reload();
    } catch (error) {
      alert(error);
    }
  };

  const confirmModalEdsb = async (id: string) => {
    try {
      await endorsementService.updateEndorsement(id, { status: "Approved", note: "", });
      window.location.reload();
    } catch (error: any) {
      console.error("Update error:", error);
      const errorMessage = error?.response?.data?.message || "Change failed.";
      alert(errorMessage);
    } 
  };
  
  const rejectedModalEdsb = async (id: string) => {
    try {
      await endorsementService.updateEndorsement(id, { status: "Rejected", note: notes, });
      window.location.reload();
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMessage = error?.response?.data?.message || "Upload failed.";
      alert(errorMessage);
    } 
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-[#CC9B36]";
      case "Approved":
        return "text-[#00AB4F]";
      case "Rejected":
        return "text-[#939597]";
      default:
        return "text-[#CC9B36]";
    }
  };

  const handleDownload = () => {
    if (!endorsement?.endorsements_detail || endorsement.endorsements_detail.length === 0) {
      alert("No data to download.");
      return;
    }
  
    try {
      const data = endorsement.endorsements_detail.map((item: any, index: number) => ({
        "Policy Number": item?.endorsements?.number,
        "Subsidiary / Entity": item?.data?.profile?.subsidiary,
        "Employee ID": item?.data?.profile?.employee_id,
        "Employee Name": item?.data?.profile?.employee_name,
        "Member Name": item?.data?.profile?.member_name,
        "Gender": item?.data?.profile?.gender,
        "Date of Birth": item?.data?.profile?.date_of_birth,
        "Member Status": item?.data?.profile?.member_status,
        "Marital Status": item?.data?.profile?.marital_status,
        "Plan": item?.data?.profile?.plan,
        "Effective Date": item?.data?.profile?.effective_date,
        "Remarks": item?.data?.profile?.remarks,
        "Bank Name": item?.data?.profile?.bank_name,
        "Branch": item?.data?.profile?.branch,
        "Bank Number": item?.data?.profile?.bank_account_number,
        "Bank Account Name": item?.data?.profile?.bank_account_name,
        "Email": item?.data?.profile?.email,
        "Insurance Card": item?.data?.profile?.insurance_card,
        "Submission Date": item?.data?.profile?.submission_date,
        "Status": item?.endorsements?.status,
      }));
  
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Endorsements");
  
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  
      saveAs(blob, `endorsement-${endorsement?.id}.xlsx`);
    } catch (error) {
      console.error("Error generating Excel file:", error);
      alert("Failed to generate Excel file.");
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="bg-white md:px-6 p-4 flex items-center">
        <div>
          <Breadcrumb className="sm:block hidden">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Endorsement</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Detail</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">Detail Endorsement</h2>
        </div>
        <a href="/endorsement" className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer">
          <ChevronLeft className="w-4 h-4" /> Back
        </a>
      </div>
      <div className="flex flex-col w-full p-4 md:p-6 gap-4">
        <div className="bg-white grid lg:grid-cols-2 lg:gap-3 gap-6 rounded-md sm:p-6 p-4 overflow-auto">
          <div className="flex flex-col gap-3 lg:pr-5">
            <p className="font-semibold">Insurance Detail</p>
            <div className="flex gap-2 text-sm font-medium">
              <div className="min-w-32 w-32">Insurance Name</div>
              <div className="max-w-1 w-1">:</div>
              <div>{endorsement?.insurance?.name || "-"}</div>
            </div>
            <div className="flex gap-2 text-sm font-medium">
              <div className="min-w-32 w-32">Plan Name</div>
              <div className="max-w-1 w-1">:</div>
              <div>{endorsement?.insurance?.plan || "-"}</div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-semibold">Policy Holder Information</p>
            <div className="flex gap-2 text-sm font-medium">
              <div className="min-w-32 w-32">Customer Name</div>
              <div className="max-w-1 w-1">:</div>
              <div>{endorsement?.account?.name || endorsement?.policies?.policy_holders?.name || "-"}</div>
            </div>
            <div className="flex gap-2 text-sm font-medium">
              <div className="min-w-32 w-32">Phone Number</div>
              <div className="max-w-1 w-1">:</div>
              <div>{endorsement?.account?.phone || endorsement?.policies?.policy_holders?.phone || "-"}</div>
            </div>
            <div className="flex gap-2 text-sm font-medium">
              <div className="min-w-32 w-32">Email</div>
              <div className="max-w-1 w-1">:</div>
              <div>{endorsement?.account?.email || endorsement?.policies?.policy_holders?.email || "-"}</div>
            </div>
          </div>
        </div>
        {!isEDSB ? (
          <div className="flex lg:flex-row flex-col gap-4">
            <div className="lg:w-1/3 bg-white rounded-md sm:p-6 p-4 mb-4 md:mb-0 h-fit max-h-full overflow-y-auto ">
              <p className="font-semibold mb-3">Insured Detail</p>
              <div className="flex flex-col gap-3">
                <div className="w-full border rounded-lg overflow-hidden">
                  <Image src={imageUrl} alt="" width={200} height={100} className="w-full h-auto" />
                </div>
                <div className="flex gap-2 text-sm font-medium">
                  <div className="min-w-24 w-24">No. Polis</div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{endorsement?.policies.number || "-"}</div>
                </div>
                <div className="flex gap-2 text-sm font-medium">
                  <div className="min-w-24 w-24">No. Peserta</div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{endorsement?.number || "-"}</div>
                </div>
              </div>
            </div>
            <div className="lg:w-2/3">
              <div className="bg-white flex flex-col gap-3 rounded-md mb-4 sm:p-6 p-4">
                <p className="font-semibold">Update Verification</p>
                <div className="flex gap-2 text-sm font-medium items-center">
                  <div className="min-w-24 w-24">Status</div>
                  <div className="max-w-1 w-1">:</div>
                  <div className="pl-2 flex items-center gap-3">
                    {endorsement?.status !== "Pending" && (
                      <>{endorsement?.status || "-"}</>
                    )}
                    {endorsement?.status == "Pending" && (
                      <Button
                        onClick={() => confirmModal(endorsement.id)}
                        className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-5 py-2 h-8"
                      >
                        Accept
                      </Button>
                    )}
                    {endorsement?.status == "Pending" && (
                      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="border-[#E83F3F] text-[#E83F3F] hover:bg-[#E83F3F] hover:text-white rounded-full px-5 py-2 h-8">Reject</Button>
                        </DialogTrigger>
                        <DialogContent className="min-w-[590px] w-auto max-w-full">
                          <p className="text-center">
                            <AlertCircle width={88} height={88} className="mx-auto text-[#F5AB1D]" />
                          </p>
                          <p className="text-center font-bold mb-0 text-sm">Reject updated data?</p>
                          <div className="w-full">
                            <p className="text-sm mb-2">Reason</p>
                            <textarea
                              name="notes"
                              id="notes"
                              rows={4}
                              value={notes}
                              required
                              onChange={(e) => setNotes(e.target.value)}
                              className="w-full text-sm p-2 border border-gray-200 rounded-md"
                              placeholder="Insert Reason"
                            ></textarea>
                          </div>

                          <div className="flex gap-4 justify-center">
                            <DialogClose asChild>
                              <Button variant="outline" className="border-[#E83F3F] text-[#E83F3F] hover:bg-[#E83F3F] hover:text-white rounded-full w-24">No</Button>
                            </DialogClose>
                            <Button color="warning" onClick={() => rejectedModal(endorsement.id)} className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full w-24 text-black">Yes</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 text-sm font-medium">
                  <div className="min-w-24 w-24">Reason</div>
                  <div className="max-w-1 w-1">:</div>
                  <div className="pl-2">{endorsement?.note || "-"}</div>
                </div>
                <div className="rounded-lg overflow-auto mt-4 w-full">
                  <Table className="rounded-t-md min-w-full table-flip">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="bg-[#016DA1] text-white">Data Type</TableHead>
                        <TableHead className="bg-[#016DA1] text-white">Previous Data</TableHead>
                        <TableHead className="bg-[#016DA1] text-white">Update Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Nama Lengkap</TableCell>
                        <TableCell>{endorsement?.participants?.profile?.full_name || endorsement?.participants?.profile?.name}</TableCell>
                        <TableCell>{endorsement?.data?.profile?.full_name || endorsement?.data?.profile?.name}</TableCell>
                      </TableRow>
                      {(endorsement?.participants?.profile?.gender || endorsement.data.profile?.gender) && (
                        <TableRow>
                          <TableCell>Jenis Kelamin</TableCell>
                          <TableCell>{endorsement?.participants?.profile?.gender}</TableCell>
                          <TableCell>{endorsement?.data?.profile?.gender}</TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell>
                          {endorsement?.participants?.profile?.passport_no
                            ? "No. Passport"
                            : endorsement?.participants?.profile?.nik
                            ? "NIK"
                            : endorsement?.participants?.profile
                                ?.identification_number
                            ? "No. Identitas"
                            : ""}
                        </TableCell>
                        <TableCell>
                          {endorsement?.participants?.profile?.passport_no || endorsement.participants?.profile?.nik || endorsement.participants?.profile?.identification_number}
                        </TableCell>
                        <TableCell>
                          {endorsement?.data?.profile?.passport_no || endorsement.data.profile?.nik || endorsement.data.profile?.identification_number}
                        </TableCell>
                      </TableRow>
                      {(endorsement?.participants?.profile?.nationality || endorsement.participants?.profile?.country || endorsement?.data?.profile?.nationality || endorsement.data.profile?.country) && (
                        <TableRow>
                          <TableCell>Kewarganegaraan</TableCell>
                          <TableCell>
                            {endorsement?.participants?.profile?.nationality || endorsement.participants.profile?.country}
                          </TableCell>
                          <TableCell>
                            {endorsement?.data?.profile?.nationality || endorsement.data?.profile?.country}
                          </TableCell>
                        </TableRow>
                      )}
                      {(endorsement?.participants?.profile?.pob || endorsement.participants?.profile?.country_of_birth || endorsement?.data?.profile?.pob || endorsement.data.profile?.country_of_birth) && (
                        <TableRow>
                          <TableCell>Tempat Lahir</TableCell>
                          <TableCell>
                            {endorsement?.participants?.profile?.pob || endorsement.participants?.profile?.country_of_birth}
                          </TableCell>

                          <TableCell>
                            {endorsement?.data?.profile?.pob || endorsement.data?.profile?.country_of_birth}
                          </TableCell>
                        </TableRow>
                      )}
                      {(endorsement?.participants?.profile?.dob || endorsement?.data?.profile?.dob) && (
                        <TableRow>
                          <TableCell>Tanggal Lahir</TableCell>
                          <TableCell>{endorsement?.participants?.profile?.dob}</TableCell>
                          <TableCell>{endorsement?.data?.profile?.dob}</TableCell>
                        </TableRow>
                      )}
                      {(endorsement?.participants?.profile?.address || endorsement?.data?.profile?.address) && (
                        <TableRow>
                          <TableCell>Alamat</TableCell>
                          <TableCell>{endorsement?.participants?.profile?.address}</TableCell>
                          <TableCell>{endorsement?.data?.profile?.address}</TableCell>
                        </TableRow>
                      )}
                      {(endorsement?.participants?.profile?.job || endorsement?.data?.profile?.job) && (
                        <TableRow>
                          <TableCell>Pekerjaan</TableCell>
                          <TableCell>{endorsement?.participants?.profile?.job}</TableCell>
                          <TableCell>{endorsement?.data?.profile?.job}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white flex flex-col gap-3 rounded-md mb-4 sm:p-6 p-4">
            <p className="font-semibold">Update Verification</p>
            <div className="flex gap-2 text-sm font-medium">
              <div className="min-w-24 w-24">Type</div>
              <div className="max-w-1 w-1">:</div>
              <div className="pl-2">{endorsement?.type || "-"}</div>
            </div>
            <div className="flex gap-2 text-sm font-medium items-center">
              <div className="min-w-24 w-24">Status</div>
              <div className="max-w-1 w-1">:</div>
              <div className="pl-2 flex items-center gap-3">
                {endorsement?.status_description !== "Uploaded by partner" ? (
                  <>{endorsement?.status || "-"}</>
                ) : (
                  <>
                    <Button onClick={() => confirmModalEdsb(endorsement.id)} className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-5 py-2 h-8">Accept</Button>
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="border-[#E83F3F] text-[#E83F3F] hover:bg-[#E83F3F] hover:text-white rounded-full px-5 py-2 h-8"
                        >Reject</Button>
                      </DialogTrigger>
                      <DialogContent className="min-w-[590px] w-auto max-w-full">
                        <p className="text-center">
                          <AlertCircle width={88} height={88} className="mx-auto text-[#F5AB1D]" />
                        </p>
                        <p className="text-center font-bold mb-0 text-sm">Reject updated data?</p>
                        <div className="w-full">
                          <p className="text-sm mb-2">Reason</p>
                          <textarea
                            name="notes"
                            id="notes"
                            rows={4}
                            value={notes}
                            required
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full text-sm p-2 border border-gray-200 rounded-md"
                            placeholder="Insert Reason"
                          ></textarea>
                        </div>

                        <div className="flex gap-4 justify-center">
                          <DialogClose asChild>
                            <Button variant="outline" className="border-[#E83F3F] text-[#E83F3F] hover:bg-[#E83F3F] hover:text-white rounded-full w-24">No</Button>
                          </DialogClose>
                          <Button color="warning" onClick={() => rejectedModalEdsb(endorsement.id)} className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full w-24 text-black">Yes</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-2 text-sm font-medium">
              <div className="min-w-24 w-24">Verified By</div>
              <div className="max-w-1 w-1">:</div>
              <div className="pl-2">{(endorsement?.status_description?.split(' by ')[1] || "-").replace(/\b\w/g, (c: string) => c.toUpperCase())}</div>
            </div>
            <div className="flex gap-2 text-sm font-medium">
              <div className="min-w-24 w-24">Reason</div>
              <div className="max-w-1 w-1">:</div>
              <div className="pl-2">{endorsement?.note || "-"}</div>
            </div>
            <hr className="my-3" />
            <div className="flex gap-2 items-center">
              <p className="font-semibold">Data Endorsement</p>
              <div className="ml-auto flex gap-2 items-center">
                {endorsement?.status_description === "Uploaded by partner" && (
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white rounded-full px-5 py-2 h-8"
                    onClick={() => router.push(`/endorsement/${endorsement?.id}/upload`)}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white rounded-full px-5 py-2 h-8"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4 mr-2" />Download
                </Button>
              </div>
            </div>
            <div className="rounded-lg overflow-auto w-full">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead className="whitespace-nowrap">Record Mode</TableHead>
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
                    <TableHead className="whitespace-nowrap">Insurance Card</TableHead>
                    <TableHead className="whitespace-nowrap">Submission Date</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {endorsement?.endorsements_detail?.map((item: any, index: any) => {
                    const profile = item?.data?.profile || {};
                    const insuredProfile = item?.insured_parties?.profile || {};

                    const isDifferent = (key: string) => profile[key] !== insuredProfile[key];

                    return (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className={isDifferent("record_mode") ? "bg-yellow-50" : ""}>
                          {profile.record_mode || "-"}
                        </TableCell>
                        <TableCell className={`min-w-[180px]`}>
                          {item?.endorsements?.number || "-"}
                        </TableCell>
                        <TableCell className={`min-w-[230px] ${isDifferent("subsidiary") ? "bg-yellow-50" : ""}`}>
                          {profile.subsidiary || "-"}
                        </TableCell>
                        <TableCell className={isDifferent("employee_id") ? "bg-yellow-50" : ""}>
                          {profile.employee_id || "-"}
                        </TableCell>
                        <TableCell className={`min-w-[240px] ${isDifferent("employee_name") ? "bg-yellow-50" : ""}`}>
                          {profile.employee_name || "-"}
                        </TableCell>
                        <TableCell className={`min-w-[240px] ${isDifferent("member_name") ? "bg-yellow-50" : ""}`}>
                          {profile.member_name || "-"}
                        </TableCell>
                        <TableCell className={`text-center ${isDifferent("gender") ? "bg-yellow-50" : ""}`}>
                          {profile.gender || "-"}
                        </TableCell>
                        <TableCell className={isDifferent("date_of_birth") ? "bg-yellow-50" : ""}>
                          {profile.date_of_birth || "-"}
                        </TableCell>
                        <TableCell className={`text-center ${isDifferent("member_status") ? "bg-yellow-50" : ""}`}>
                          {profile.member_status || "-"}
                        </TableCell>
                        <TableCell className={isDifferent("marital_status") ? "bg-yellow-50" : ""}>
                          {profile.marital_status || "-"}
                        </TableCell>
                        <TableCell className={isDifferent("plan") ? "bg-yellow-50" : ""}>
                          {profile.plan || "-"}
                        </TableCell>
                        <TableCell className={isDifferent("effective_date") ? "bg-yellow-50" : ""}>
                          {profile.effective_date || "-"}
                        </TableCell>
                        <TableCell className={isDifferent("remarks") ? "bg-yellow-50" : ""}>
                          {profile.remarks || "-"}
                        </TableCell>
                        <TableCell className={isDifferent("bank_name") ? "bg-yellow-50" : ""}>
                          {profile.bank_name || "-"}
                        </TableCell>
                        <TableCell className={isDifferent("branch") ? "bg-yellow-50" : ""}>
                          {profile.branch || "-"}
                        </TableCell>
                        <TableCell className={isDifferent("bank_account_number") ? "bg-yellow-50" : ""}>
                          {profile.bank_account_number || "-"}
                        </TableCell>
                        <TableCell className={`min-w-[200px] ${isDifferent("bank_account_name") ? "bg-yellow-50" : ""}`}>
                          {profile.bank_account_name || "-"}
                        </TableCell>
                        <TableCell className={isDifferent("email") ? "bg-yellow-50" : ""}>
                          {profile.email || "-"}
                        </TableCell>
                        <TableCell className={isDifferent("insurance_card") ? "bg-yellow-50" : ""}>
                          {profile.insurance_card || "-"}
                        </TableCell>
                        <TableCell className={isDifferent("submission_date") ? "bg-yellow-50" : ""}>
                          {profile.submission_date || "-"}
                        </TableCell>
                        <TableCell className="font-semibold">
                          <span className={getStatusColor(endorsement.status)}>
                            {item?.endorsements?.status || "-"}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailEndorsementWithSidebar = (params: any) => WithSidebar(DetailEndorsement)(params);
export default DetailEndorsementWithSidebar;
