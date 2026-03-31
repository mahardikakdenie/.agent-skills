"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useMembershipDetail } from "@/hooks/useMembershipDetail.hooks";
import AppURL from "@/constants/app-url.const";
import { ContentLoadingWrapper } from "@/components/ui/loading";
import { PageHeader } from "@/components/ui/PageHeader";

export default function DetailMembership() {
  const params = useParams();
  const idParam = params.id;
  const id =
    typeof idParam === "string"
      ? idParam
      : Array.isArray(idParam)
      ? idParam[0]
      : "";

  const {
    membershipDetail,
    isLoading,
    formatLabel,
    getStatusColor,
    getMembershipDetail,
  } = useMembershipDetail();

  useEffect(() => {
    if (id) {
      getMembershipDetail(id);
    }
  }, [id, getMembershipDetail]);

  const breadcrumbs = [
    { label: "Membership" },
    { label: "List", href: AppURL.membershipList },
    { label: "Detail", isCurrentPage: true },
  ];

  return (
    <ContentLoadingWrapper isLoading={isLoading}>
      <div className="flex flex-col w-full">
        <PageHeader
          title="Detail Membership"
          breadcrumbs={breadcrumbs}
          showBackButton={true}
        />

        <div className="flex flex-col w-full p-4 md:p-6 gap-4">
          <div className="bg-white grid lg:gap-3 gap-6 rounded-md sm:p-6 p-4 overflow-auto">
            <div className="flex flex-col gap-3">
              <p className="font-semibold">Policy Holder Information</p>

              <div className="flex gap-2 text-sm font-medium">
                <div className="min-w-[160px] w-32">Policy Number</div>
                <div className="max-w-1 w-1">:</div>
                <div>{membershipDetail?.number || "-"}</div>
              </div>

              <div className="flex gap-2 text-sm font-medium">
                <div className="min-w-[160px] w-32">Customer Name</div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {membershipDetail?.policies?.policy_holders?.name || "-"}
                </div>
              </div>

              <div className="flex gap-2 text-sm font-medium">
                <div className="min-w-[160px] w-32">Phone Number</div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {membershipDetail?.policies?.policy_holders?.phone || "-"}
                </div>
              </div>

              <div className="flex gap-2 text-sm font-medium">
                <div className="min-w-[160px] w-32">Email</div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {membershipDetail?.policies?.policy_holders?.email || "-"}
                </div>
              </div>

              {membershipDetail?.status && (
                <div className="flex gap-2 text-sm font-medium">
                  <div className="min-w-[160px] w-32">Status</div>
                  <div className="max-w-1 w-1">:</div>
                  <div>
                    <span className={getStatusColor(membershipDetail.status)}>
                      {membershipDetail.status}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-md sm:p-6 p-4 mb-4 md:mb-0 h-fit max-h-full overflow-y-auto">
            <p className="font-semibold mb-3">Insured Detail</p>

            <div className="flex flex-col lg:flex-row gap-2 lg:gap-20">
              {membershipDetail?.profile && (
                <div className="flex flex-col gap-3">
                  <div className="space-y-2 text-sm font-medium">
                    {Object.entries(membershipDetail.profile)
                      .filter(
                        ([_, value]) =>
                          value !== null && value !== undefined && value !== ""
                      )
                      .map(([key, value], index) => (
                        <div key={index} className="flex gap-2">
                          <div className="min-w-[160px] capitalize">
                            {formatLabel(key)}
                          </div>
                          <div className="w-1">:</div>
                          <div>{String(value)}</div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {membershipDetail?.other_info && (
                <div className="flex flex-col gap-3">
                  <div className="space-y-2 text-sm font-medium">
                    {Object.entries(membershipDetail.other_info)
                      .filter(
                        ([key, value]) =>
                          value !== null &&
                          value !== undefined &&
                          value !== "" &&
                          key !== "email" &&
                          key !== "gender"
                      )
                      .map(([key, value], index) => (
                        <div key={index} className="flex gap-2">
                          <div className="min-w-[160px] capitalize">
                            {formatLabel(key)}
                          </div>
                          <div className="w-1">:</div>
                          <div>{String(value)}</div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ContentLoadingWrapper>
  );
}
