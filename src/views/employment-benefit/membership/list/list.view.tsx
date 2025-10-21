"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { AxiosResponse } from "axios";
import { Download } from "react-feather";

import ApiURL from "@/constants/api-url.const";
import { primary } from "@/constants/app-common.const";

import { MembershipItem, MembershipResponse, mapMembershipResponse } from "@/types/membership";

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

export const MembershipListView = () => {
  const [searchData, setSearchData] = useState("");
  const [tab, setTab] = useState("All");
  const [tableData, setTableData] = useState<MembershipItem[]>([]);
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

  const membershipStatusOptions = [
    { label: "All Member", value: "All" },
    { label: "Pending", value: "Pending" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  const fetchMasterPolicy = async () => {
    try {
      setLoading(true);
      const params = { is_only_master_policy: true };
      const result = await policyService.get(ApiURL.masterPolicy(user?.channel), { params });
      const { id } = result.data;
      setMasterPolicyId(id);
    } catch (error) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembership = async () => {
    if (!masterPolicyId) return;
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        master_policy: masterPolicyId,
        keyword: searchData,
        isFromBulking: true,
        status: tab === "All" ? undefined : tab,
      };
      const result: AxiosResponse<MembershipResponse> = await policyService.get(ApiURL.insuredParties, { params });

      const { data, total, page } = result.data;

      setTableData(mapMembershipResponse(data));
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
    if (masterPolicyId) {
      fetchMembership();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masterPolicyId, tab, currentPage, itemsPerPage, searchData]);

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    setCurrentPage(1);
  };

  const membershipStatusColor = (status: string) => {
    if (status.toLowerCase() === "pending") return "#CC9B36";
    if (status.toLowerCase() === "inactive") return "#939597";
    return primary;
  };

  const handleDownloadBtn = async () => { 
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 100,
        master_policy: masterPolicyId,
        keyword: searchData,
        status: tab === "All" ? undefined : tab,
      };
      const result: AxiosResponse<MembershipResponse> = await policyService.get(ApiURL.insuredParties, { params });
      const exportData = mapMembershipResponse(result.data.data).map((item, index) => ({
        No: index + 1,
        "Policy Number": item.policyNumber,
        "Subsidiary / Entity": item.subsidiary,
        "Employee ID": item.employeeId,
        "Employee Name": item.employeeName,
        "Member Name": item.memberName,
        Gender: item.gender,
        "Date of Birth": item.dob,
        "Member Status": item.memberStatus,
        "Marital Status": item.maritalStatus,
        Plan: item.plan,
        "Effective Date": item.effectiveDate,
        Remarks: item.remarks,
        "Bank Name": item.bankName,
        Branch: item.branch,
        "Bank Account Number": item.bankAccountNumber,
        "Bank Account Name": item.bankAccountName,
        Email: item.email,
        "Submission Date": item.submissionDate,
        Status: capitalizeString(item.status),
      }));
  
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Membership Data");
      XLSX.writeFile(workbook, "membership_list.xlsx");
    } catch (error) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDetail = (endorsementId: string) => {
    router.push(`detail/${endorsementId}`);
  };
  
  const thClass = "px-6 py-6 text-left text-base font-semibold text-gray-500 tracking-wider whitespace-nowrap";
  const tdClass = "px-6 py-3 text-sm text-gray-500 whitespace-nowrap";
  const stickySubmissionClass = "sticky right-[200px] bg-white z-30 w-[120px] shadow-[inset_8px_0_8px_-6px_rgba(0,0,0,0.1)]";
  const stickyStatusClass = "sticky right-[100px] bg-white z-40 w-[120px]";
  const stickyActionClass = "sticky right-0 bg-white z-50 w-[120px]";

  return (
    <div className="mx-auto py-5 px-7">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
        <p className={`font-bold text-lg ${isMobileView && "mb-2"}`}>{headerPage.pageName}</p>
        <button
          disabled={tableData.length === 0}
          className={`flex items-center px-3 py-3 text-sm rounded-full hover:opacity-80 border text-white text-sm bg-primary ${
            tableData.length === 0 && "cursor-not-allowed"
          }`}
          onClick={handleDownloadBtn}
        >
          <Download className="w-4 h-4 mr-2" /> Download
        </button>
      </div>

      {isMobileView ? (
        <Select
          additionalClassNameSelect="pl-4 shadow mb-3 h-[46px]"
          withBorder={false}
          value={tab}
          onChange={(event) => handleTabChange(event.toString())}
          options={membershipStatusOptions}
        />
      ) : (
        <div className="overflow-x-auto sm:scrollable text-center flex items-center justify-start h-16 bg-white rounded-md mb-3 shadow">
          {membershipStatusOptions.map((status, index) => (
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
              placeholder="Cari member"
              icon={searchIcon()}
              withBorder={false}
            />
          </div>
        )}

        {tableData.length > 0 ? (
          <>
            <div style={{ minHeight: "60vh" }} className="overflow-x-auto">
              <div className="min-w-full pr-[360px]">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th className={thClass}>No.</th>
                      <th className={thClass}>Policy Number</th>
                      <th className={thClass}>Subsidiary / Entity</th>
                      <th className={thClass}>Employee ID</th>
                      <th className={thClass}>Employee Name</th>
                      <th className={thClass}>Member Name</th>
                      <th className={thClass}>Gender</th>
                      <th className={thClass}>Date of Birth</th>
                      <th className={thClass}>Member Status</th>
                      <th className={thClass}>Marital Status</th>
                      <th className={thClass}>Plan</th>
                      <th className={thClass}>Effective Date</th>
                      <th className={thClass}>Remarks</th>
                      <th className={thClass}>Bank Name</th>
                      <th className={thClass}>Branch</th>
                      <th className={thClass}>Bank Account Number</th>
                      <th className={thClass}>Bank Account Name</th>
                      <th className={thClass}>Email</th>
                      <th className={`${thClass} ${stickySubmissionClass}`}>Submission Date</th>
                      <th className={`${thClass} ${stickyStatusClass}`}>Status</th>
                      <th className={`${thClass} ${stickyActionClass}`}>Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tableData.map((data, index) => (
                      <tr key={`${index}-${data.id}`}>
                        <td className={tdClass}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className={tdClass}>{data.policyNumber}</td>
                        <td className={tdClass}>{data.subsidiary}</td>
                        <td className={tdClass}>{data.employeeId}</td>
                        <td className={tdClass}>{data.employeeName}</td>
                        <td className={tdClass}>{data.memberName}</td>
                        <td className={tdClass}>{data.gender}</td>
                        <td className={tdClass}>{data.dob}</td>
                        <td className={tdClass}>{data.memberStatus}</td>
                        <td className={tdClass}>{data.maritalStatus}</td>
                        <td className={tdClass}>{data.plan}</td>
                        <td className={tdClass}>{data.effectiveDate}</td>
                        <td className={tdClass}>{data.remarks}</td>
                        <td className={tdClass}>{data.bankName}</td>
                        <td className={tdClass}>{data.branch}</td>
                        <td className={tdClass}>{data.bankAccountNumber}</td>
                        <td className={tdClass}>{data.bankAccountName}</td>
                        <td className={tdClass}>{data.email}</td>
                        <td className={`${tdClass} ${stickySubmissionClass}`}>{data.submissionDate}</td>
                        <td className={`${tdClass} ${stickyStatusClass}`} style={{ color: membershipStatusColor(data.status) }}>
                          {capitalizeString(data.status)}
                        </td>
                        <td className={`${tdClass} ${stickyActionClass}`}>
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
              text="No membership data available"
              textClassName={isMobileView && "text-xs"}
            />
          </div>
        )}
      </div>
    </div>
  );
};
