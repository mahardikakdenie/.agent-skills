"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AlertCircle, ChevronLeft, Download, Upload } from "react-feather";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { MembershipService } from "@/services/membership.service";
import WithSidebar from "@/hoc/with-sidebar";

const DetailMembership = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const [memberships, setMemberships] = useState<any>(null);

  useEffect(() => {
    const fetchData = async (id: string) => {
        const membershipService = new MembershipService();
      try {
        const response =
          await membershipService.getMembershipDetail(id);
          setMemberships(response);
      } catch (error) {
        console.error("Error fetching endorsement data:", error);
      }
    };

    if (params.id) {
      fetchData(params.id as string);
    }
  }, [params.id]);

  if (!memberships) {
    return (<div className="w-full h-full flex justify-center items-center">Loading...</div>);
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-[#CC9B36]";
      case "Active":
        return "text-[#00AB4F]";
      case "Inactive":
        return "text-[#939597]";
      default:
        return "text-[#CC9B36]";
    }
  };

  function formatLabel(key: string) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <div className="flex flex-col w-full">
      <div className="bg-white md:px-6 p-4 flex items-center">
        <div>
          <Breadcrumb className="sm:block hidden">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Membership List</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Detail</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">Detail Membership</h2>
        </div>
        <a href="/membership-list" className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer">
          <ChevronLeft className="w-4 h-4" /> Back
        </a>
      </div>
      <div className="flex flex-col w-full p-4 md:p-6 gap-4">
        <div className="bg-white grid lg:gap-3 gap-6 rounded-md sm:p-6 p-4 overflow-auto">
          <div className="flex flex-col gap-3">
            <p className="font-semibold">Policy Holder Information</p>
            <div className="flex gap-2 text-sm font-medium">
              <div className="min-w-[160px] w-32">Policy Number</div>
              <div className="max-w-1 w-1">:</div>
              <div>{memberships?.number || "-"}</div>
            </div>
            <div className="flex gap-2 text-sm font-medium">
              <div className="min-w-[160px] w-32">Customer Name</div>
              <div className="max-w-1 w-1">:</div>
              <div>{memberships?.policies?.policy_holders?.name || "-"}</div>
            </div>
            <div className="flex gap-2 text-sm font-medium">
              <div className="min-w-[160px] w-32">Phone Number</div>
              <div className="max-w-1 w-1">:</div>
              <div>{memberships?.policies?.policy_holders?.phone || "-"}</div>
            </div>
            <div className="flex gap-2 text-sm font-medium">
              <div className="min-w-[160px] w-32">Email</div>
              <div className="max-w-1 w-1">:</div>
              <div>{memberships?.policies?.policy_holders?.email || "-"}</div>
            </div>
            {memberships?.status && (
                <div className="flex gap-2 text-sm font-medium">
                <div className="min-w-[160px] w-32">Status</div>
                <div className="max-w-1 w-1">:</div>
                <div><span className={getStatusColor(memberships?.status)}>{memberships?.status || "-"}</span></div>
                </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-md sm:p-6 p-4 mb-4 md:mb-0 h-fit max-h-full overflow-y-auto ">
            <p className="font-semibold mb-3">Insured Detail</p>
            <div className="flex flex-col lg:flex-row gap-2 lg:gap-20">
                {memberships?.profile && (
                  <div className="flex flex-col gap-3">
                      <div className="space-y-2 text-sm font-medium">
                      {Object.entries(memberships.profile)
                        .filter(([_, value]) => value !== null && value !== undefined && value !== "")
                        .map(([key, value], id) => (
                              <div key={id} className="flex gap-2">
                              <div className="min-w-[160px] capitalize">{formatLabel(key)}</div>
                              <div className="w-1">:</div>
                              <div>{String(value)}</div>
                              </div>
                          ))}
                      </div>
                  </div>
                )}
                {memberships?.other_info && (
                  <div className="flex flex-col gap-3">
                    <div className="space-y-2 text-sm font-medium">
                      {Object.entries(memberships.other_info)
                        .filter(([key, value]) => value !== null && value !== undefined && value !== "" && key !== "email" && key !== "gender")
                        .map(([key, value], id) => (
                          <div key={id} className="flex gap-2">
                            <div className="min-w-[160px] capitalize">{formatLabel(key)}</div>
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
  );
};

const DetailMembershipWithSidebar = (params: any) => WithSidebar(DetailMembership)(params);
export default DetailMembershipWithSidebar;
