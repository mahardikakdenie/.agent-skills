"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import WithSidebar from "@/hoc/with-sidebar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AlertCircle, ChevronLeft } from "react-feather";
import noImage from "/public/images/no-image.png";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EndorsementService } from "@/services/endorsement.service";

const DetailEndorsement = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [endorsement, setEndorsement] = useState<any>(null);
  const imageUrl = endorsement?.participants?.nric_front || noImage.src;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const endorsementService = new EndorsementService();

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
    return (
      <div className="w-full h-full flex justify-center items-center">
        Loading...
      </div>
    );
  }

  const rejectedModal = async (id: string) => {
    try {
      await endorsementService.updateStatus(id, {
        status: "Rejected",
        note: notes,
      });
      window.location.reload();
    } catch (error) {
      alert(error);
    }
  };
  const confirmModal = async (id: string) => {
    try {
      await endorsementService.updateStatus(id, {
        status: "Approved",
        note: "",
      });
      window.location.reload();
    } catch (error) {
      alert(error);
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
          <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
            Detail Endorsement
          </h2>
        </div>
        <a
          href="/endorsement"
          className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
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
              <div>{endorsement?.account.name || "-"}</div>
            </div>
            <div className="flex gap-2 text-sm font-medium">
              <div className="min-w-32 w-32">Phone Number</div>
              <div className="max-w-1 w-1">:</div>
              <div>{endorsement?.account?.phone || "-"}</div>
            </div>
            <div className="flex gap-2 text-sm font-medium">
              <div className="min-w-32 w-32">Email</div>
              <div className="max-w-1 w-1">:</div>
              <div>{endorsement?.account?.email || "-"}</div>
            </div>
          </div>
        </div>
        <div className="flex lg:flex-row flex-col gap-4">
          <div className="lg:w-1/3 bg-white rounded-md sm:p-6 p-4 mb-4 md:mb-0 h-fit max-h-full overflow-y-auto ">
            <p className="font-semibold mb-3">Insured Detail</p>
            <div className="flex flex-col gap-3">
              <div className="w-full border rounded-lg overflow-hidden">
                <img src={imageUrl} alt="" className="w-full h-auto" />
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
                        <Button
                          variant="outline"
                          className="border-[#E83F3F] text-[#E83F3F] hover:bg-[#E83F3F] hover:text-white rounded-full px-5 py-2 h-8"
                        >
                          Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="min-w-[590px] w-auto max-w-full">
                        <p className="text-center">
                          <AlertCircle
                            width={88}
                            height={88}
                            className="mx-auto text-[#F5AB1D]"
                          />
                        </p>
                        <p className="text-center font-bold mb-0 text-sm">
                          Reject updated data?
                        </p>
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
                            <Button
                              variant="outline"
                              className="border-[#E83F3F] text-[#E83F3F] hover:bg-[#E83F3F] hover:text-white rounded-full w-24"
                            >
                              No
                            </Button>
                          </DialogClose>
                          <Button
                            color="warning"
                            onClick={() => rejectedModal(endorsement.id)}
                            className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full w-24 text-black"
                          >
                            Yes
                          </Button>
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
                      <TableHead className="bg-[#016DA1] text-white">
                        Data Type
                      </TableHead>
                      <TableHead className="bg-[#016DA1] text-white">
                        Previous Data
                      </TableHead>
                      <TableHead className="bg-[#016DA1] text-white">
                        Update Data
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Nama Lengkap</TableCell>
                      <TableCell>
                        {endorsement?.participants?.full_name ||
                          endorsement?.participants?.name}
                      </TableCell>
                      <TableCell>
                        {endorsement?.data?.full_name ||
                          endorsement?.data?.name}
                      </TableCell>
                    </TableRow>
                    {(endorsement?.participants?.gender ||
                      endorsement.data.gender) && (
                      <TableRow>
                        <TableCell>Jenis Kelamin</TableCell>
                        <TableCell>
                          {endorsement?.participants?.gender}
                        </TableCell>

                        <TableCell>{endorsement?.data?.gender}</TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell>
                        {endorsement?.participants?.passport_no
                          ? "No. Passport"
                          : endorsement?.participants?.nik
                          ? "NIK"
                          : endorsement?.participants?.identification_number
                          ? "No. Identitas"
                          : ""}
                      </TableCell>
                      <TableCell>
                        {endorsement?.participants?.passport_no ||
                          endorsement.participants.nik ||
                          endorsement.participants.identification_number}
                      </TableCell>

                      <TableCell>
                        {endorsement?.data?.passport_no ||
                          endorsement.data.nik ||
                          endorsement.data.identification_number}
                      </TableCell>
                    </TableRow>
                    {(endorsement?.participants?.nationality ||
                      endorsement.participants.country ||
                      endorsement?.data?.nationality ||
                      endorsement.data.country) && (
                      <TableRow>
                        <TableCell>Kewarganegaraan</TableCell>
                        <TableCell>
                          {endorsement?.participants?.nationality ||
                            endorsement.participants.country}
                        </TableCell>

                        <TableCell>
                          {endorsement?.data?.nationality ||
                            endorsement.data.country}
                        </TableCell>
                      </TableRow>
                    )}
                    {(endorsement?.participants?.pob ||
                      endorsement.participants.country_of_birth ||
                      endorsement?.data?.pob ||
                      endorsement.data.country_of_birth) && (
                      <TableRow>
                        <TableCell>Tempat Lahir</TableCell>
                        <TableCell>
                          {endorsement?.participants?.pob ||
                            endorsement.participants.country_of_birth}
                        </TableCell>

                        <TableCell>
                          {endorsement?.data?.pob ||
                            endorsement.data.country_of_birth}
                        </TableCell>
                      </TableRow>
                    )}
                    {(endorsement?.participants?.dob ||
                      endorsement?.data?.dob) && (
                      <TableRow>
                        <TableCell>Tanggal Lahir</TableCell>
                        <TableCell>{endorsement?.participants?.dob}</TableCell>

                        <TableCell>{endorsement?.data?.dob}</TableCell>
                      </TableRow>
                    )}
                    {(endorsement?.participants?.address ||
                      endorsement?.data?.address) && (
                      <TableRow>
                        <TableCell>Alamat</TableCell>
                        <TableCell>
                          {endorsement?.participants?.address}
                        </TableCell>

                        <TableCell>{endorsement?.data?.address}</TableCell>
                      </TableRow>
                    )}
                    {(endorsement?.participants?.job ||
                      endorsement?.data?.job) && (
                      <TableRow>
                        <TableCell>Pekerjaan</TableCell>
                        <TableCell>{endorsement?.participants?.job}</TableCell>
                        <TableCell>{endorsement?.data?.job}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailEndorsementWithSidebar = (params: any) =>
  WithSidebar(DetailEndorsement)(params);
export default DetailEndorsementWithSidebar;
