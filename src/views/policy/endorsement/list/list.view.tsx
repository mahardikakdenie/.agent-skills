"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AxiosResponse } from "axios";
import moment from "moment";

import ApiURL from "@/constants/api-url.const";
import { primary, primaryRed } from "@/constants/app-common.const";

import { EndorsementItem, EndorsementResponse } from "@/types/endorsement";

import { policyService } from "@/services/api.service";

import { useScreen } from "@/context/screen.context";
import { useAuth } from "@/context/auth.context";

import { capitalizeString, getHeaderPage, getPaddingClass } from "@/helpers/app.helper";

import searchIcon from "@/images/search.icon";

import Select from "@/components/select";
import Input from "@/components/input";
import NotFound from "@/components/not-found";
import Pagination from "@/components/pagination";
import Button from "@/components/button";

import UploadIcon from "@/images/upload.icon";
import AppURL from "@/constants/app-url.const";

export const EndorsementListView = () => {
  const [searchData, setSearchData] = useState("");
  const [tab, setTab] = useState("All");
  const [tableData, setTableData] = useState<EndorsementItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalData, setTotalData] = useState(0);
  const [masterPolicyId, setMasterPolicyId] = useState<string | null>(null);
  const [hasFetchedDataOnce, setHasFetchedDataOnce] = useState(false);

  const path = usePathname();
  const { isMobileView, setLoading } = useScreen();
  const { handleResponseError, user } = useAuth();
  const headerPage = getHeaderPage(2, path, true);
  const router = useRouter();
  const isUserInsurer = user?.role === "Insurer";

  const endorsementStatus = [
    { label: "All Endorsement", value: "All" },
    { label: "Waiting", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Reject", value: "Rejected" },
  ];
  const [endorsementStatusOptions] = useState(endorsementStatus);

  const fetchMasterPolicy = async () => {
    try {
      setLoading(true);
      const params = { is_only_master_policy: true };
      const result = await policyService.get(ApiURL.masterPolicy(user?.channel), { params });
      setMasterPolicyId(result.data.id);
    } catch (error) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEndorsement = async () => {
    if (!masterPolicyId) return;
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        policy: masterPolicyId,
        is_bulking: true,
        status: tab === "All" ? undefined : tab,
        keyword: searchData,
      };
      const result: AxiosResponse<EndorsementResponse> = await policyService.get(ApiURL.endorsement, { params });
      const { data, total, page } = result.data;
      setTableData(data);
      setTotalData(total);
      setCurrentPage(page);

      if (data.length > 0) setHasFetchedDataOnce(true);
    } catch (error) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterPolicy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (masterPolicyId) fetchEndorsement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterPolicyId, tab, currentPage, itemsPerPage, searchData]);

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    setCurrentPage(1);
  };

  const endorsementStatusColor = (status: string) => {
    if (status.toLowerCase() === "pending") return "#CC9B36";
    else if (status.toLowerCase() === "rejected") return primaryRed;
    else return primary;
  };

  const handleUploadBtn = () => {
    router.push(AppURL.endorsementUpload);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return moment(dateString).format("DD / MM / YYYY");
  };

  const getVerificator = (description: string) => {
    if (!description) return "-";
    const byIndex = description.toLowerCase().indexOf("by ");
    if (byIndex === -1) return "-";
    const name = description.slice(byIndex + 3).trim();
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const handleGoToDetail = (endorsementId: string) => {
    router.push(`detail/${endorsementId}`);
  };

  const thClass = "px-6 py-6 text-left text-base font-semibold text-gray-500 tracking-wider whitespace-nowrap";
  const tdClass = "px-6 py-3 text-sm text-gray-500 whitespace-nowrap";

  return (
    <div className="mx-auto py-5 px-7">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5 gap-3">
        <p className={`font-bold text-lg ${isMobileView && "mb-2"}`}>{`${headerPage.pageName} List`}</p>
        {!isUserInsurer && (
          <Button additionalClassName="w-full lg:w-fit justify-center lg:justify-between" onClick={handleUploadBtn} withIcon={true}>
            {UploadIcon("#FFF", "16", "17", "0 0 24 24")}
            <span className="ml-1">Upload</span>
          </Button>
        )}
      </div>

      {isMobileView ? (
        <Select
          additionalClassNameSelect="pl-4 shadow mb-3 h-[46px]"
          withBorder={false}
          value={tab}
          onChange={(event) => handleTabChange(event.toString())}
          options={endorsementStatusOptions}
        />
      ) : (
        <div className="overflow-x-auto sm:scrollable text-center flex items-center justify-start h-16 bg-white rounded-md mb-3 shadow">
          {endorsementStatusOptions.map((status, index) => (
            <div
              key={`tab-${status.value}-${index}`}
              onClick={() => handleTabChange(status.value)}
              className={`cursor-pointer h-full flex items-center justify-center px-5 ${tab === status.value && "border-b-[3px] border-primary"}`}
            >
              <p className={`truncate-2-lines text-sm mr-3 ${tab === status.value && "font-semibold text-primary"}`}>{status.label}</p>
              <p className={`text-center rounded-full bg-red-600 text-white text-xs py-1 ${getPaddingClass(totalData)} ${tab !== status.value && "hidden"}`}>
                {totalData > 99 ? 99 : totalData}
                {totalData > 99 && <span style={{ fontSize: "10px" }}>+</span>}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="relative bg-white rounded-md shadow-md w-full">
        {(hasFetchedDataOnce || tableData.length > 0) && (
          <div className="flex py-4 px-6 min-w-full">
            <Input
              key={tab}
              value={searchData}
              onChange={(value) => setSearchData(value.toString())}
              onEnter={(value) => setSearchData(value.toString())}
              onClear={() => setSearchData("")}
              placeholder="Search by Request ID"
              icon={searchIcon()}
              withBorder={false}
            />
          </div>
        )}

        {tableData.length > 0 ? (
          <>
            <div style={{ minHeight: "60vh" }} className="overflow-x-auto">
              <div className="min-w-full">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th className={thClass}>No.</th>
                      <th className={thClass}>Request ID</th>
                      <th className={thClass}>Insured Name</th>
                      <th className={thClass}>Policy Number</th>
                      <th className={thClass}>Request Date</th>
                      <th className={thClass}>Approve/Rejected Date</th>
                      <th className={thClass}>Type</th>
                      <th className={thClass}>Status</th>
                      <th className={thClass}>Verified By</th>
                      <th className={thClass}>Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tableData.map((data, index) => (
                      <tr key={`${index}-${data.id}`}>
                        <td className={tdClass}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className={tdClass}>{data.number || "-"}</td>
                        <td className={tdClass}>{data.policies?.policy_holders?.name || "-"}</td>
                        <td className={tdClass}>{data.policies?.number || "-"}</td>
                        <td className={tdClass}>{formatDate(data.created_at) || "-"}</td>
                        <td className={tdClass}>{(data.status !== "Pending" && formatDate(data.updated_at)) || "-"}</td>
                        <td className={tdClass}>{data.type || "-"}</td>
                        <td className={tdClass} style={{ color: endorsementStatusColor(data.status) }}>
                          {capitalizeString(data.status) || "-"}
                        </td>
                        <td className={tdClass}>{getVerificator(data.status_description) || "-"}</td>
                        <td className={tdClass}>
                          <Button onClick={() => handleGoToDetail(data.id)}>View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bottom-0 left-0 right-0 bg-white py-2 px-4 border-t border-t-gray-200">
              <Pagination
                totalData={totalData}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          </>
        ) : (
          <div style={{ minHeight: "60vh" }} className="flex items-center justify-center">
            <NotFound
              width={isMobileView && "143"}
              height={isMobileView && "144"}
              size1={isMobileView && "143"}
              size3={isMobileView && "95"}
              viewBox={isMobileView && "0 0 70 70"}
              text="No endorsement data available"
              textClassName={isMobileView && "text-xs"}
            />
          </div>
        )}
      </div>
    </div>
  );
};
