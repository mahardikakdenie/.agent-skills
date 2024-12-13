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
import { PolicyService } from "@/services/policy.service";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft } from "react-feather";

const DetailPolicy = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [policy, setPolicy] = useState<any>(null);

  useEffect(() => {
    const policyService = new PolicyService();
    if (params.id) {
      policyService.getPolicyDetail(params.id as string).then((res: any) => {
        setPolicy(res);
      });
    }
  }, [params.id]);
  if (!policy) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        Loading...
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Declaration":
        return "text-[#016DA1]";
      case "Grace Period":
        return "text-orange-500";
      case "Expired":
        return "text-gray-400";
      default:
        return "text-[#016DA1]";
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="bg-white md:px-6 p-4 flex items-center">
        <div>
          <Breadcrumb className="sm:block hidden">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Policy</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/policy-list">List</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Detail</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
            Detail Policy
          </h2>
        </div>
        <div
          onClick={() => router.back()}
          className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </div>
      </div>
      <div className="flex flex-col w-full p-4 md:p-6 gap-4">
        <div className="sm:p-6 p-4 bg-white rounded-lg flex flex-col gap-4 overflow-auto">
          <div className="font-bold text-base">Policy Holder Information</div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">
              Customer Name
            </div>
            <div className="max-w-1 w-1">:</div>
            <div>
              {policy.declarations.transaction_data.customer.name || "-"}
            </div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">
              Phone Number
            </div>
            <div className="max-w-1 w-1">:</div>
            <div>
              {policy.declarations.transaction_data.customer.phone || "-"}
            </div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">Email</div>
            <div className="max-w-1 w-1">:</div>
            <div>
              {policy.declarations.transaction_data.customer.email || "-"}
            </div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="sm:min-w-40 sm:w-40 min-w-28 w-28">Status</div>
            <div className="max-w-1 w-1">:</div>
            <div className="font-semibold">
              <span className={getStatusColor(policy.status)}>
                {policy.status}
              </span>
            </div>
          </div>
        </div>
        <div className="sm:p-6 p-4 bg-white rounded-lg flex flex-col gap-4 overflow-auto relative">
          <div className="absolute lg:right-6 right-4 top-3 text-xs text-gray-500">
            <i>
              Last Update{" "}
              {policy?.updated_at
                ? new Date(policy.updated_at).toLocaleDateString("en-GB")
                : "-"}
            </i>
          </div>
          <div className="font-bold text-base">Insured Person</div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
              Policy Number
            </div>
            <div className="max-w-1 w-1">:</div>
            <div>{policy.number || "-"}</div>
          </div>

          <div className="flex gap-2 text-sm font-medium">
            <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
              Participant Number
            </div>
            <div className="max-w-1 w-1">:</div>
            <div>{policy?.participants?.[0]?.data?.data?.reg_no || "-"}</div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Full Name</div>
            <div className="max-w-1 w-1">:</div>
            <div>{policy?.participants?.[0]?.data?.data?.name || "-"}</div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Gender</div>
            <div className="max-w-1 w-1">:</div>
            <div>{policy?.participants?.[0]?.data?.data?.gender || "-"}</div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
              Country Code
            </div>
            <div className="max-w-1 w-1">:</div>
            <div>
              {policy?.participants?.[0]?.data?.data?.country_code || "-"}
            </div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
              Passport Number
            </div>
            <div className="max-w-1 w-1">:</div>
            <div>
              {policy?.participants?.[0]?.data?.data?.passport_no || "-"}
            </div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Nationality</div>
            <div className="max-w-1 w-1">:</div>
            <div>
              {policy?.participants?.[0]?.data?.data?.nationality || "-"}
            </div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Birthdate</div>
            <div className="max-w-1 w-1">:</div>
            <div>{policy?.participants?.[0]?.data?.data?.dob || "-"}</div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
              Place of Birth
            </div>
            <div className="max-w-1 w-1">:</div>
            <div>{policy?.participants?.[0]?.data?.data?.pob || "-"}</div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">
              Release Date
            </div>
            <div className="max-w-1 w-1">:</div>
            <div>
              {policy?.participants?.[0]?.data?.data?.date_of_issue || "-"}
            </div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="sm:min-w-40 sm:w-40 min-w-32 w-32">Expiry Date</div>
            <div className="max-w-1 w-1">:</div>
            <div>
              {policy?.participants?.[0]?.data?.data?.date_of_expiry || "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailPolicyWithSidebar = (params: any) =>
  WithSidebar(DetailPolicy)(params);
export default DetailPolicyWithSidebar;
