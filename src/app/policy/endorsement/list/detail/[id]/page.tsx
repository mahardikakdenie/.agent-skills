"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, Download, Upload } from "react-feather";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/DataTable";
import { useParams } from "next/navigation";
import AppURL from "@/constants/app-url.const";
import { useEndorsementDetail } from "@/hooks/useDetailEndorsement.hooks";
import {
  createCompareDataTableColumns,
  createEndorsementDetailsTableColumns,
} from "@/components/tableConfig/endorsementTableConfig";
import { ContentLoadingWrapper } from "@/components/ui/Loading/index";
import { PageHeader } from "@/components/ui/PageHeader";

export default function DetailEndorsement() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const {
    endorsement,

    isModalOpen,
    setIsModalOpen,
    notes,
    setNotes,

    isEDSB,
    imageUrl,

    isLoading,
    isUpdating,

    getEndorsementDetail,
    handleApprove,
    handleReject,
    handleDownload,
    getStatusColor,
  } = useEndorsementDetail();

  useEffect(() => {
    if (id) {
      getEndorsementDetail(id);
    }
  }, [id, getEndorsementDetail]);

  const prepareComparisonData = () => {
    const compareFields = [
      {
        key: "full_name",
        label: "Nama Lengkap",
        previous:
          endorsement?.participants?.profile?.full_name ||
          endorsement?.participants?.profile?.name,
        updated:
          endorsement?.data?.profile?.full_name ||
          endorsement?.data?.profile?.name,
      },
      {
        key: "gender",
        label: "Jenis Kelamin",
        previous: endorsement?.participants?.profile?.gender,
        updated: endorsement?.data?.profile?.gender,
      },
      {
        key: "identification",
        label: endorsement?.participants?.profile?.passport_no
          ? "No. Passport"
          : endorsement?.participants?.profile?.nik
          ? "NIK"
          : endorsement?.participants?.profile?.identification_number
          ? "No. Identitas"
          : "",
        previous:
          endorsement?.participants?.profile?.passport_no ||
          endorsement?.participants?.profile?.nik ||
          endorsement?.participants?.profile?.identification_number,
        updated:
          endorsement?.data?.profile?.passport_no ||
          endorsement?.data?.profile?.nik ||
          endorsement?.data?.profile?.identification_number,
      },
      {
        key: "nationality",
        label: "Kewarganegaraan",
        previous:
          endorsement?.participants?.profile?.nationality ||
          endorsement?.participants?.profile?.country,
        updated:
          endorsement?.data?.profile?.nationality ||
          endorsement?.data?.profile?.country,
      },
      {
        key: "pob",
        label: "Tempat Lahir",
        previous:
          endorsement?.participants?.profile?.pob ||
          endorsement?.participants?.profile?.country_of_birth,
        updated:
          endorsement?.data?.profile?.pob ||
          endorsement?.data?.profile?.country_of_birth,
      },
      {
        key: "dob",
        label: "Tanggal Lahir",
        previous: endorsement?.participants?.profile?.dob,
        updated: endorsement?.data?.profile?.dob,
      },
      {
        key: "address",
        label: "Alamat",
        previous: endorsement?.participants?.profile?.address,
        updated: endorsement?.data?.profile?.address,
      },
      {
        key: "job",
        label: "Pekerjaan",
        previous: endorsement?.participants?.profile?.job,
        updated: endorsement?.data?.profile?.job,
      },
    ];

    return compareFields
      .filter((field) => field.previous || field.updated)
      .map((field) => ({
        dataType: field.label,
        previousData: field.previous || "-",
        updateData: field.updated || "-",
      }));
  };

  const compareDataColumns = createCompareDataTableColumns();
  const endorsementDetailsColumns =
    createEndorsementDetailsTableColumns(getStatusColor);

  const breadcrumbs = [
    { label: "Endorsement" },
    { label: "List", href: AppURL.endorsementList },
    { label: "Detail", isCurrentPage: true },
  ];

  return (
    <ContentLoadingWrapper isLoading={isLoading || !endorsement}>
      <div className="flex flex-col w-full">
        <PageHeader
          title="Detail Policy"
          breadcrumbs={breadcrumbs}
          showBackButton={true}
        />

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
                <div>
                  {endorsement?.account?.name ||
                    endorsement?.policies?.policy_holders?.name ||
                    "-"}
                </div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="min-w-32 w-32">Phone Number</div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {endorsement?.account?.phone ||
                    endorsement?.policies?.policy_holders?.phone ||
                    "-"}
                </div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="min-w-32 w-32">Email</div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {endorsement?.account?.email ||
                    endorsement?.policies?.policy_holders?.email ||
                    "-"}
                </div>
              </div>
            </div>
          </div>

          {!isEDSB ? (
            <div className="flex lg:flex-row flex-col gap-4">
              <div className="lg:w-1/3 bg-white rounded-md sm:p-6 p-4 mb-4 md:mb-0 h-fit max-h-full overflow-y-auto">
                <p className="font-semibold mb-3">Insured Detail</p>
                <div className="flex flex-col gap-3">
                  <div className="w-full border rounded-lg overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt=""
                      width={200}
                      height={100}
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="flex gap-2 text-sm font-medium">
                    <div className="min-w-24 w-24">No. Polis</div>
                    <div className="max-w-1 w-1">:</div>
                    <div>{endorsement?.policies?.number || "-"}</div>
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
                      {endorsement?.status !== "Pending" ? (
                        <>{endorsement?.status || "-"}</>
                      ) : (
                        <>
                          <Button
                            onClick={handleApprove}
                            disabled={isUpdating}
                            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-5 py-2 h-8"
                          >
                            {isUpdating ? "Processing..." : "Accept"}
                          </Button>

                          <Dialog
                            open={isModalOpen}
                            onOpenChange={setIsModalOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                disabled={isUpdating}
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
                                />
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
                                  onClick={handleReject}
                                  disabled={isUpdating}
                                  className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full w-24 text-black"
                                >
                                  {isUpdating ? "Processing..." : "Yes"}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 text-sm font-medium">
                    <div className="min-w-24 w-24">Reason</div>
                    <div className="max-w-1 w-1">:</div>
                    <div className="pl-2">{endorsement?.note || "-"}</div>
                  </div>

                  <div className="mt-4">
                    <DataTable
                      data={prepareComparisonData()}
                      columns={compareDataColumns}
                      className="compare-data-table"
                      noDataText="No comparison data available"
                    />
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
                      <Button
                        onClick={handleApprove}
                        disabled={isUpdating}
                        className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-5 py-2 h-8"
                      >
                        {isUpdating ? "Processing..." : "Accept"}
                      </Button>

                      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            disabled={isUpdating}
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
                            />
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
                              onClick={handleReject}
                              disabled={isUpdating}
                              className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full w-24 text-black"
                            >
                              {isUpdating ? "Processing..." : "Yes"}
                            </Button>
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
                <div className="pl-2">
                  {(
                    endorsement?.status_description?.split(" by ")[1] || "-"
                  ).replace(/\b\w/g, (c: string) => c.toUpperCase())}
                </div>
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
                  {endorsement?.status_description ===
                    "Uploaded by partner" && (
                    <Button
                      variant="outline"
                      className="border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white rounded-full px-5 py-2 h-8"
                      onClick={() =>
                        router.push(
                          `${AppURL.endorsementDetail}/${endorsement.id}/upload`
                        )
                      }
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
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="mt-4">
                <DataTable
                  data={endorsement?.endorsements_detail || []}
                  columns={endorsementDetailsColumns}
                  className="endorsement-details-table max-h-[458px] overflow-auto"
                  noDataText="No endorsement details available"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ContentLoadingWrapper>
  );
}
