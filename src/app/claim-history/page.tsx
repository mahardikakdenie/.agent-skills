"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import _ from "lodash";
import moment from "moment";

import { hasPermission } from "@/context/auth.context";
import WithSidebar from "@/hoc/with-sidebar";
import useRequireAuth from "@/hooks/useRequireAuth";
import { ClaimService } from "@/services/claim.service";
import { formatMoney, formatMoneyClaim } from "@/lib/formatter";

import {
  Search,
} from "react-feather";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import emptyStateSearchPrompt from "/public/images/empty-state-search-prompt.svg";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Simulate data interface here
interface Claim {
  id: string;
  number: string;
  name: string;
  submitted_date: string;
  status: "Acknowledged" | "Rejected" | "Approved";
  currency: string;
  claim_amount: string;
  paid: string | null;
  remaining_limit: string;
  payment_type: string;
  created_at: string;
  updated_at: string;
}

interface Plan {
  id: string;
  name: string;
}

interface ClaimHistoryResponse {
  data: Claim[];
  plans: Plan[];
  claim_limit: string;
  total_paid: string;
  remaining_claim_limit: string;
  limit: number;
  page: number;
  pageTotal: number;
  total: number;
}


const claimService = new ClaimService();
const ClaimHistoryPage = () => {
  useRequireAuth();

  // Define router to redirect user to forbidden page if user has no permission
  // const router = useRouter();

  // Permissions state
  // const [canEdit, setCanEdit] = useState<boolean>(false);

  // Data state
  const [searchData, setSearchData] = useState("");
  const [claimHistoryData, setClaimHistoryData] = useState<ClaimHistoryResponse | null>({
    data: [
      {
        id: "50ecd7c4-9930-45c8-86a8-7f89eb8438fc",
        number: "CLM-20250120-00006",
        name: "Gabrella",
        submitted_date: "2025-12-10",
        status: "Acknowledged",
        currency: "IDR",
        claim_amount: "25000000",
        paid: null,
        remaining_limit: "70000000",
        payment_type: "Cashless",
        created_at: "2025-02-07T04:36:53.260Z",
        updated_at: "2025-02-07T04:42:41.542Z"
      },
      {
        id: "50ecd7c4-9930-45c8-86a8-7f89eb8438fd",
        number: "CLM-20250120-00005",
        name: "Gabrella",
        submitted_date: "2025-9-6",
        status: "Rejected",
        currency: "IDR",
        claim_amount: "15000000",
        paid: null,
        remaining_limit: "70000000",
        payment_type: "Cashless",
        created_at: "2025-02-07T04:36:53.260Z",
        updated_at: "2025-02-07T04:42:41.542Z"
      },
      {
        id: "50ecd7c4-9930-45c8-86a8-7f89eb8438fe",
        number: "CLM-20250120-00004",
        name: "Gabrella",
        submitted_date: "2025-8-12",
        status: "Approved",
        currency: "IDR",
        claim_amount: "30000000",
        paid: "30000000",
        remaining_limit: "70000000",
        payment_type: "Cashless",
        created_at: "2025-02-07T04:36:53.260Z",
        updated_at: "2025-02-07T04:42:41.542Z"
      },
      {
        id: "50ecd7c4-9930-45c8-86a8-7f89eb8438ff",
        number: "CLM-20250120-00003",
        name: "Gabrella",
        submitted_date: "2025-4-12",
        status: "Acknowledged",
        currency: "IDR",
        claim_amount: "25000000",
        paid: "20000000",
        remaining_limit: "100000000",
        payment_type: "Cashless",
        created_at: "2025-02-07T04:36:53.260Z",
        updated_at: "2025-02-07T04:42:41.542Z"
      }
    ],
    plans: [
      {
        id: "50ecd7c4-9930-45c8-86a8-7f89eb8438fg",
        name: "Plan 1"
      },
      {
        id: "50ecd7c4-9930-45c8-86a8-7f89eb8438fh",
        name: "Plan 2"
      },
      {
        id: "50ecd7c4-9930-45c8-86a8-7f89eb8438fi",
        name: "Plan 3"
      }
    ],
    claim_limit: "120000000",
    total_paid: "50000000",
    remaining_claim_limit: "70000000",
    limit: 10,
    page: 1,
    pageTotal: 13,
    total: 125
  });

  const [searchPlanName, setSearchPlanName] = useState("");
  const [disableSearchPlanName, setDisableSearchPlanName] = useState<boolean>(false);
  const [isSearchParamValid, setIsSearchParamValid] = useState<boolean>(true);

  // Permissions checking
  // useEffect(() => {
    // const checkAccess = async () => {
      // const hasAccess = await hasPermission('Claim History.Read');

      // For future use when edit feature is available
      // const hasEditAccess = await hasPermission('Claim History.Update');
      // setCanEdit(hasEditAccess);

      // Redirect to forbidden page if user has no permission to read
      // if(!hasAccess) {
      //   router.push("/forbidden");
      // }
    // };

    // checkAccess();
  // }, [router]);

  // Fetch data to populate the list of claim history
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await claimService.getClaimsHistoriesList(
  //         searchData,
  //       );
  //       setClaimHistoryData(res?.data);
  //     } catch (error) {
  //       setIsSearchParamValid(false);
  //       console.error("Error fetching data: ", error);
  //     }

  //     fetchData();
  //   };
  // }, [
  //   searchData,
  // ]);

  const handleSearchPlanName = (planName: string) => {
    setSearchPlanName(planName);
  };

  const handleSearch = _.debounce((keyword: string) => {
    setSearchData(keyword);
  }, 100);

  const renderPlanName = (plans: {id: string, name: string}[]) => {
    return (
      <SelectGroup>
        {plans.map((plan) => (
          <SelectItem key={plan.id} value={plan.name}>
            {plan.name}
          </SelectItem>
        ))}
      </SelectGroup>
    );
  }

  const renderSearchPromptImage = () => {
    return (
      <Table>
        <TableBody>
          <TableRow className="hover:!bg-white">
            <TableCell colSpan={10}>
              <div className="flex flex-col gap-4 items-center justify-center py-14">
                <Image alt="no data" src={emptyStateSearchPrompt} width={200} />
                <div className="text-[#939597] text-base">
                  Masukkan KTP / ID / NIK Number Number untuk melihat histori claim
                </div>
              </div>
            </TableCell>{" "}
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex flex-wrap justify-start pb-4 items-center">
        <h1 className="text-black font-bold text-2xl mt-2 sm:w-auto w-full">
          Claim History
        </h1>
      </div>

      <div className="flex block bg-white rounded-xl gap-4 mb-3 p-6">
        <div className="flex w-full flex-col">
          <div className="text-xs mb-1.5 font-medium whitespace-nowrap">
            NIK / Passport / Claim Number
          </div>
          <div className="relative mb-1">
            <Input
              type="text"
              placeholder="Search by Claim ID"
              onChange={(e) => handleSearch(e.target.value)}
              className="border p-3 rounded-md pr-10 w-full"
            />
            <Search className="absolute top-1/2 w-4 h-4 right-3 transform -translate-y-1/2 text-[#016da1]" />
          </div>
          {
            !isSearchParamValid && (
              <p className="text-[#E83F3F] text-xs">
                Please double-check your ID card, NIK, passport, or claim number
              </p>
            )
          }
        </div>
        <div className="flex w-full flex-col">
          <div className="text-xs mb-1.5 font-medium">
            Plan Name
          </div>
          <div>
            <Select
              value={searchPlanName}
              onValueChange={handleSearchPlanName}
              disabled={disableSearchPlanName}
            >
              <SelectTrigger className="h-full">
                <SelectValue placeholder={disableSearchPlanName ? '-' : 'All Plan'} />
              </SelectTrigger>
              <SelectContent>
                {!disableSearchPlanName && claimHistoryData?.plans && renderPlanName(claimHistoryData.plans)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="w-full bg-white rounded-xl p-4">
        {
          claimHistoryData?.data && claimHistoryData?.data.length > 0 ? (
            <>
              <div className="bg-white flex flex-wrap flex-start gap-16 shadow p-4">
                <div className="flex">
                  <div className="mr-3 text-base">Claim Limit</div>
                  <div className="font-bold text-[#016DA1]">{formatMoney(Number(claimHistoryData.claim_limit))}</div>
                </div>
                <div className="flex">
                  <div className="mr-3 text-base">Total Paid</div>
                  <div className="font-bold text-[#016DA1]">{formatMoney(Number(claimHistoryData.total_paid))}</div>
                </div>
                <div className="flex">
                  <div className="mr-3 text-base">Remaining Claim Limit</div>
                  <div className="font-bold text-[#016DA1]">{formatMoney(Number(claimHistoryData.remaining_claim_limit))}</div>
                </div>
              </div>

              <div className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Claim ID</TableHead>
                      <TableHead>Insured Name</TableHead>
                      <TableHead>Submitted Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Claim Amount</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Remaining Limit</TableHead>
                      <TableHead>Payment Type</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      claimHistoryData.data.map((claim) => (
                        <TableRow key={claim.id}>
                          <TableCell>
                            <div>{claim.number}</div>
                          </TableCell>
                          <TableCell>
                            <div>{claim.name}</div>
                          </TableCell>
                          <TableCell>
                            <div>{!!claim.submitted_date ? moment(claim.submitted_date, "YYYY-MM-DD").format("DD/MM/YYYY") : "-"}</div>
                          </TableCell>
                          <TableCell>
                            <div>{claim.status}</div>
                          </TableCell>
                          <TableCell>
                            <div>{claim.currency}</div>
                          </TableCell>
                          <TableCell>
                            <div>{formatMoneyClaim(Number(claim.claim_amount))}</div>
                          </TableCell>
                          <TableCell>
                            <div>{claim.paid ? formatMoneyClaim(Number(claim.paid)) : '-'}</div>
                          </TableCell>
                          <TableCell>
                            <div>{formatMoneyClaim(Number(claim.remaining_limit))}</div>
                          </TableCell>
                          <TableCell>
                            <div>{claim.payment_type}</div>
                          </TableCell>
                          <TableCell>
                            {/* This button is disabled until edit feature is enabled */}
                            <Button
                              disabled
                              className="rounded-full"
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </div>
            </>
          ) : renderSearchPromptImage()
        }
      </div>
    </div>
  );
};

const ClaimHistoryWithSidebar = (params: any) => WithSidebar(ClaimHistoryPage)(params);
export default ClaimHistoryWithSidebar;