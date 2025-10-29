"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { formatMoney } from "@/lib/formatter";
import { useEffect } from "react";
import AppURL from "@/constants/app-url.const";
import { useParams } from "next/navigation";
import { usePolicyDetail } from "@/hooks/useDetailPolicy.hooks";
import { ContentLoadingWrapper } from "@/components/ui/Loading/index";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";

export default function DetailPolicy() {
  const params = useParams();
  const id = params.id as string;

  const {
    policy,
    policyVisibility,

    dialogOpen,
    setDialogOpen,

    isLoading,
    isRenewing,

    getPolicyDetail,
    handleOpenDialog,
    handleRenewPolicy,
    getStatusColor,
  } = usePolicyDetail();

  useEffect(() => {
    if (id) {
      getPolicyDetail(id);
    }
  }, [id, getPolicyDetail]);

  const breadcrumbs = [
    { label: "Policy" },
    { label: "List", href: AppURL.policyList },
    { label: "Detail", isCurrentPage: true },
  ];

  const benefitsTableColumns = [
    {
      key: "benefits.description_id",
      header: "Benefit",
      render: (benefit: any) => {
        return <div>{benefit?.benefits?.description_id || "-"}</div>;
      },
    },
    {
      key: "value",
      header: "Limit",
      render: (benefit: any) => {
        return (
          <div>
            {benefit.value ? formatMoney(benefit.value) : benefit.html || "-"}
          </div>
        );
      },
    },
  ];

  return (
    <ContentLoadingWrapper isLoading={isLoading}>
      <div className="flex flex-col w-full">
        <PageHeader
          title="Detail Policy"
          breadcrumbs={breadcrumbs}
          showBackButton={true}
        />
        <div className="flex flex-col w-full p-4 md:p-6 gap-4">
          <div className="sm:p-6 p-4 bg-white rounded-lg flex flex-col gap-4 overflow-auto">
            <div className="font-bold text-base">Policy Holder Information</div>
            {policyVisibility?.name && (
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">
                  Customer Name
                </div>
                <div className="max-w-1 w-1">:</div>
                <div>{policy?.policy_holder?.name || "-"}</div>
              </div>
            )}
            {policyVisibility?.phone && (
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">
                  Phone Number
                </div>
                <div className="max-w-1 w-1">:</div>
                <div>{policy?.policy_holder?.phone || "-"}</div>
              </div>
            )}
            {policyVisibility?.email && (
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">Email</div>
                <div className="max-w-1 w-1">:</div>
                <div>{policy?.policy_holder?.email || "-"}</div>
              </div>
            )}
            {policyVisibility?.status && (
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">Status</div>
                <div className="max-w-1 w-1">:</div>
                <div className="font-semibold">
                  <span className={getStatusColor(policy?.status)}>
                    {policy?.status}
                  </span>
                </div>
              </div>
            )}
            {policy?.status === "Grace Period" && (
              <Button
                className="w-40 bg-[#F5BA41] hover:bg-[#e6a92d] text-black"
                onClick={handleOpenDialog}
              >
                Renew Policy
              </Button>
            )}
          </div>
          <div className="sm:p-6 p-4 bg-white rounded-lg flex flex-col gap-4 overflow-auto">
            <div className="font-bold text-base">Plan Information</div>
            <div className="flex gap-2 text-sm font-medium">
              <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">Plan Name</div>
              <div className="max-w-1 w-1">:</div>
              <div>{policy?.package_data[0]?.plan?.name || "-"}</div>
            </div>
            <div className="flex gap-2 text-sm font-medium">
              <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">
                Product Name
              </div>
              <div className="max-w-1 w-1">:</div>
              <div>{policy?.package_data[0]?.product?.name || "-"}</div>
            </div>
            <div className="flex gap-2 text-sm font-medium">
              <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">
                Insurance Name
              </div>
              <div className="max-w-1 w-1">:</div>
              <div>{policy?.package_data[0]?.insurance?.name || "-"}</div>
            </div>
            <div className="flex gap-2 text-sm font-medium">
              <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">
                Effective Date
              </div>
              <div className="max-w-1 w-1">:</div>
              <div>{policy?.start_date || "-"}</div>
            </div>
            <div className="flex gap-2 text-sm font-medium">
              <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">
                Expiry Date
              </div>
              <div className="max-w-1 w-1">:</div>
              <div>{policy?.end_date || "-"}</div>
            </div>
            {policy?.package_data?.[0]?.benefits && (
              <DataTable
                data={policy.package_data[0].benefits}
                columns={benefitsTableColumns}
                className="benefits-table"
                noDataText="No benefits available"
              />
            )}
          </div>
          {policy?.transaction_data?.company && (
            <div className="sm:p-6 p-4 bg-white rounded-lg flex flex-col gap-4 overflow-auto relative">
              <div className="absolute lg:right-6 right-4 top-3 text-xs text-gray-500">
                <i>
                  Last Update{" "}
                  {policy?.updated_at
                    ? new Date(policy?.updated_at).toLocaleDateString("en-GB")
                    : "-"}
                </i>
              </div>
              <div className="font-bold text-base">Insured Details</div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                  Policy Number
                </div>
                <div className="max-w-1 w-1">:</div>
                <div>{policy?.number || "-"}</div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                  PIC Name
                </div>
                <div className="max-w-1 w-1">:</div>
                <div>{policy?.transaction_data?.company?.pic?.name || "-"}</div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                  Phone Number
                </div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {policy?.transaction_data?.company?.pic?.phone_number || "-"}
                </div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                  ID Number
                </div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {policy?.transaction_data?.company?.pic
                    ?.identification_number || "-"}
                </div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                  NPWP Number
                </div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {policy?.transaction_data?.company?.pic?.npwp_number || "-"}
                </div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Address</div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {policy?.transaction_data?.company?.pic?.mailing_address ||
                    "-"}
                </div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                  Agent Name
                </div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {policy?.transaction_data?.company?.agent?.name || "-"}
                </div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                  Phone Number
                </div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {policy?.transaction_data?.company?.agent?.phone_number ||
                    "-"}
                </div>
              </div>
            </div>
          )}
          {policy?.insured_parties.map((item: any) => (
            <div
              key={item.id}
              className="sm:p-6 p-4 bg-white rounded-lg flex flex-col gap-4 overflow-auto relative"
            >
              <div className="absolute lg:right-6 right-4 top-3 text-xs text-gray-500">
                <i>
                  Last Update{" "}
                  {policy?.updated_at
                    ? new Date(policy?.updated_at).toLocaleDateString("en-GB")
                    : "-"}
                </i>
              </div>
              <div className="font-bold text-base">Insured Details</div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                  Policy Number
                </div>
                <div className="max-w-1 w-1">:</div>
                <div>{policy?.number || "-"}</div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                  Participant Number
                </div>
                <div className="max-w-1 w-1">:</div>
                <div>{item?.number || "-"}</div>
              </div>
              {item?.data?.data?.name && (
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    Full Name
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{item?.data?.data?.name || "-"}</div>
                </div>
              )}
              {item?.data?.data?.gender && (
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    Gender
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{item?.data?.data?.gender || "-"}</div>
                </div>
              )}
              {item?.data?.data?.country_code && (
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    Country Code
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{item?.data?.data?.country_code || "-"}</div>
                </div>
              )}
              {item?.data?.data?.passport_no && (
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    Passport Number
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{item?.data?.data?.passport_no || "-"}</div>
                </div>
              )}
              {item?.data?.data?.nationality && (
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    Nationality
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{item?.data?.data?.nationality || "-"}</div>
                </div>
              )}
              {item?.data?.data?.dob && (
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    Birthdate
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{item?.data?.data?.dob || "-"}</div>
                </div>
              )}
              {item?.data?.data?.pob && (
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    Place of Birth
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{item?.data?.data?.pob || "-"}</div>
                </div>
              )}
              {item?.data?.data?.date_of_issue && (
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    Release Date
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{item?.data?.data?.date_of_issue || "-"}</div>
                </div>
              )}{" "}
              {item.data?.data?.date_of_expiry && (
                <div className="flex gap-2 text-sm font-medium">
                  <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                    Expiry Date
                  </div>
                  <div className="max-w-1 w-1">:</div>
                  <div>{item.data?.data?.date_of_expiry || "-"}</div>
                </div>
              )}
              {item.profile &&
                Object.keys(item.profile).map((key, i) => {
                  const formattedKey = key
                    ? key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())
                    : null;
                  const value =
                    typeof item.profile[key] === "object"
                      ? JSON.stringify(item.profile[key])
                      : item.profile[key];
                  return (
                    <div key={i} className="flex gap-2 text-sm font-medium">
                      <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                        {formattedKey}
                      </div>
                      <div className="max-w-1 w-1">:</div>
                      <div>{value || "-"}</div>
                    </div>
                  );
                })}
              {item.other_info &&
                Object.keys(item.other_info).map((key, i) => {
                  const formattedKey = key
                    ? key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())
                    : null;
                  const value =
                    typeof item.other_info[key] === "object"
                      ? JSON.stringify(item.other_info[key])
                      : item.other_info[key];
                  return (
                    <div key={i} className="flex gap-2 text-sm font-medium">
                      <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
                        {formattedKey}
                      </div>
                      <div className="max-w-1 w-1">:</div>
                      <div>{value || "-"}</div>
                    </div>
                  );
                })}
            </div>
          ))}
          <div className="absolute top-5 right-5">
            <Dialog open={dialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="mx-auto mb-2">
                    <Image
                      src={"/images/confirmation.png"}
                      width={90}
                      height={90}
                      alt="Icon"
                    />
                  </DialogTitle>
                  <DialogDescription className="text-center text-md text-black font-semibold">
                    Do you want to proceed with renewing this policy?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="!flex !justify-center gap-2">
                  <Button
                    disabled={isRenewing}
                    variant="outline"
                    className="w-28 bg-transparent border border-[#E83F3F] hover:bg-[#E83F3F] hover:text-white text-[#E83F3F] rounded-3xl"
                    onClick={() => {
                      setDialogOpen(false);
                    }}
                  >
                    No
                  </Button>
                  <Button
                    disabled={isRenewing}
                    className="w-28 bg-[#F5BA41] hover:bg-[#e6a92d] text-black rounded-3xl"
                    onClick={handleRenewPolicy}
                  >
                    Yes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </ContentLoadingWrapper>
  );
}
