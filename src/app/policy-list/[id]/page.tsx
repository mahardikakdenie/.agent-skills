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
          <Breadcrumb>
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
          <h2 className="text-black font-bold text-2xl mt-2">Detail Policy</h2>
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
        <div className="p-6 bg-white rounded-lg flex flex-col gap-4">
          <div className="font-bold text-base">Policy Holder Information</div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="min-w-40 w-40">Customer Name</div>
            <div className="max-w-1 w-1">:</div>
            <div>
              {policy.declarations.transaction_data.customer.name || "-"}
            </div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="min-w-40 w-40">Phone Number</div>
            <div className="max-w-1 w-1">:</div>
            <div>
              {policy.declarations.transaction_data.customer.phone || "-"}
            </div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="min-w-40 w-40">Email</div>
            <div className="max-w-1 w-1">:</div>
            <div>
              {policy.declarations.transaction_data.customer.email || "-"}
            </div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="min-w-40 w-40">Status</div>
            <div className="max-w-1 w-1">:</div>
            <div className="font-semibold">
              <span className={getStatusColor(policy.status)}>
                {policy.status}
              </span>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg flex flex-col gap-4">
          <div className="font-bold text-base">Insured Person</div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="min-w-40 w-40">Policy Number</div>
            <div className="max-w-1 w-1">:</div>
            <div>{policy.number || "-"}</div>
          </div>

          <div className="flex gap-2 text-sm font-medium">
            <div className="min-w-40 w-40">Participant Number</div>
            <div className="max-w-1 w-1">:</div>
            <div>{policy?.participants?.[0]?.data?.data?.reg_no || "-"}</div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="min-w-40 w-40">Full Name</div>
            <div className="max-w-1 w-1">:</div>
            <div>{policy?.participants?.[0]?.data?.data?.name || "-"}</div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="min-w-40 w-40">Gender</div>
            <div className="max-w-1 w-1">:</div>
            <div>{policy?.participants?.[0]?.data?.data?.gender || "-"}</div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="min-w-40 w-40">Country Code</div>
            <div className="max-w-1 w-1">:</div>
            <div>
              {policy?.participants?.[0]?.data?.data?.country_code || "-"}
            </div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="min-w-40 w-40">Passport Number</div>
            <div className="max-w-1 w-1">:</div>
            <div>
              {policy?.participants?.[0]?.data?.data?.passport_no || "-"}
            </div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="min-w-40 w-40">Nationality</div>
            <div className="max-w-1 w-1">:</div>
            <div>
              {policy?.participants?.[0]?.data?.data?.nationality || "-"}
            </div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="min-w-40 w-40">Birthdate</div>
            <div className="max-w-1 w-1">:</div>
            <div>{policy?.participants?.[0]?.data?.data?.dob || "-"}</div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="min-w-40 w-40">Place of Birth</div>
            <div className="max-w-1 w-1">:</div>
            <div>{policy?.participants?.[0]?.data?.data?.pob || "-"}</div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="min-w-40 w-40">Release Date</div>
            <div className="max-w-1 w-1">:</div>
            <div>
              {policy?.participants?.[0]?.data?.data?.date_of_issue || "-"}
            </div>
          </div>
          <div className="flex gap-2 text-sm font-medium">
            <div className="min-w-40 w-40">Expiry Date</div>
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
