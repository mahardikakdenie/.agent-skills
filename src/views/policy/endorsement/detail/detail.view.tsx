"use client";
import React, { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ChevronLeft, Download } from "react-feather";
import * as XLSX from "xlsx";

import ApiURL from "@/constants/api-url.const";
import { primary } from "@/constants/app-common.const";

import { policyService } from "@/services/api.service";

import { useAuth } from "@/context/auth.context";
import { useScreen } from "@/context/screen.context";

import {
  capitalizeString,
  getBreadcrumbs,
  getHeaderPage,
  toastNotification,
} from "@/helpers/app.helper";

import {
  EndorsementDetailResponse,
  EndorsementDetailRawMembership,
} from "@/types/endorsement";

import Button from "@/components/button";
import Modal from "@/components/modal";
import TextArea from "@/components/textarea";

import AlertCircleIcon from "@/images/alert-circle.icon";
export const EndorsementDetailView = () => {
  const router = useRouter();
  const path = usePathname();
  const { breadcrumbsArray } = getHeaderPage(3, path, false);
  const { id } = useParams();

  const [tableData, setTableData] = useState<EndorsementDetailRawMembership[]>([]);
  const [insuranceName, setInsuranceName] = useState("-");
  const [planName, setPlanName] = useState("-");
  const [customerName, setCustomerName] = useState("-");
  const [phoneNumber, setPhoneNumber] = useState("-");
  const [email, setEmail] = useState("-");
  const [type, setType] = useState("-");
  const [status, setStatus] = useState("-");
  const [verifiedBy, setVerifiedBy] = useState("-");
  const [reason, setReason] = useState("-");
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const { setLoading } = useScreen();
  const { handleResponseError, user } = useAuth();

  const isUserInsurer = user?.role === "Insurer";

  const handleDownloadBtn = async () => {
    try {
      setLoading(true);
  
      const params = {
        is_bulking: true,
        page: 1,
        limit: 100,
      };
  
      const { data } = await policyService.get<EndorsementDetailResponse>(
        `${ApiURL.endorsement}/${id}`,
        { params }
      );
  
      const exportData = data.endorsements_detail.map((item, index) => ({
        No: index + 1,
        "Policy Number": item.data.profile.policy_number || "-",
        "Subsidiary / Entity": item.data.profile.subsidiary || "-",
        "Employee ID": item.data.profile.employee_id || "-",
        "Employee Name": item.data.profile.employee_name || "-",
        "Member Name": item.data.profile.member_name || "-",
        Gender: item.data.profile.gender || "-",
        "Date of Birth": item.data.profile.date_of_birth || "-",
        "Member Status": item.data.profile.member_status || "-",
        "Marital Status": item.data.profile.marital_status || "-",
        Plan: item.data.profile.plan || "-",
        "Effective Date": item.data.profile.effective_date || "-",
        Remarks: item.data.profile.remarks || "-",
        "Bank Name": item.data.profile.bank_name || "-",
        Branch: item.data.profile.branch || "-",
        "Bank Account Number": item.data.profile.bank_account_number || "-",
        "Bank Account Name": item.data.profile.bank_account_name || "-",
        Email: item.data.profile.email || "-",
        "Approval Date": item.data.profile.submission_date || "-",
        Status: capitalizeString(item.endorsements.status || "-"),
      }));
  
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Endorsement Data");
      XLSX.writeFile(workbook, "endorsement_detail.xlsx");
    } catch (error) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const membershipStatusColor = (status: string) => {
    if (status.toLowerCase() === "pending") return "#CC9B36";
    if (status.toLowerCase() === "inactive") return "#939597";
    return primary;
  };

  const fetchEndorsementDetail = async () => {
    try {
      setLoading(true);
      const { data } = await policyService.get<EndorsementDetailResponse>(`${ApiURL.endorsement}/${id}`);

      setTableData(data.endorsements_detail);

      const profile = data.endorsements_detail?.[0]?.data.profile || {};
      const policyHolder = data.policies.policy_holders || {};
      const planData = data.policies.policy_products?.[0]?.plan_data || {};
      const insuranceName = data.insurance?.name;

      setPlanName(profile.plan || "-");
      setCustomerName(policyHolder.name || "-");
      setPhoneNumber(policyHolder.phone || "-");
      setEmail(policyHolder.email || "-");
      setStatus(data.status || "-");
      setReason(data.note || "-");
      setInsuranceName(insuranceName || planData.name || "-");
      setType(data.type || "-");
      setVerifiedBy(data.status_description || "-");
    } catch (error) {
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.role) return;
    fetchEndorsementDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAccept = async () => {
    try {
      setLoading(true);
      await policyService.put(ApiURL.updateEndorsementStatus(id as string), {
        status: "Approved",
        "is_send_email_to_third_party": true,
      });
      toastNotification("Endorsement approved!", "success");
      await fetchEndorsementDetail();
    } catch (error) {
      toastNotification("Failed to approve endorsement.", "error");
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };

  const checkDiff = (current?: any, original?: any) => {
    if (!current && !original) return false;
    return current?.toString().trim() !== original?.toString().trim();
  };
  
  const handleReject = async () => {
    try {
      setLoading(true);
      await policyService.put(ApiURL.updateEndorsementStatus(id as string), {
        status: "Rejected",
        note: rejectReason,
        "is_send_email_to_third_party": false,
      });
      toastNotification("Endorsement rejected!", "success");
      await fetchEndorsementDetail();
      setShowModal(false);
      setRejectReason("");
    } catch (error) {
      toastNotification("Failed to reject endorsement.", "error");
      handleResponseError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const getVerificator = (description: string) => {
    if (!description) return "-";
  
    const byIndex = description.toLowerCase().indexOf("by ");
    console.log('by index', byIndex)
    if (byIndex === -1) return "-";
  
    const name = description.slice(byIndex + 3).trim();
  
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const thClass = "px-6 py-6 text-left text-base font-semibold text-gray-500 tracking-wider whitespace-nowrap";
  const tdClass = "px-6 py-3 text-sm text-gray-500 whitespace-nowrap";
  const stickySubmissionClass = "sticky right-[100px] bg-white z-30 w-[120px] shadow-[inset_8px_0_8px_-6px_rgba(0,0,0,0.1)]";
  const stickyStatusClass = "sticky right-0 bg-white z-40 w-[120px]";
  
  const getCellClass = (current: any, original: any) => {
    return `${tdClass} ${checkDiff(current, original) ? "bg-yellow-50" : ""}`;
  };

  return (
    <>
      <div className="bg-white overflow-x-auto sm:scrollable flex items-center justify-between py-5 px-16">
        <div>
          {getBreadcrumbs(breadcrumbsArray)}
          <p className="font-bold text-2xl mt-0">Detail Endorsement</p>
        </div>
        <div onClick={() => router.back()} className="flex items-center justify-between cursor-pointer">
          <ChevronLeft color="red" width="30" height="15" />
          <p className="text-sm text-red-500 ml-1">Kembali</p>
        </div>
      </div>

      <div className="py-6 px-8">
        <div className="bg-white rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            <div>
              <p className="font-bold mb-4">Insurance Detail</p>
              <div className="grid grid-cols-[auto_10px_1fr] gap-y-4">
                <div className="pr-4">Insurance Name</div>
                <div>:</div>
                <div className="pl-4">{insuranceName}</div>

                <div className="pr-4">Plan Name</div>
                <div>:</div>
                <div className="pl-4">{planName}</div>
              </div>
            </div>

            <div>
              <p className="font-bold mb-4">Policy Holder Information</p>
              <div className="grid grid-cols-[auto_10px_1fr] gap-y-4">
                <div className="pr-4">Customer Name</div>
                <div>:</div>
                <div className="pl-4">{customerName}</div>

                <div className="pr-4">Phone Number</div>
                <div>:</div>
                <div className="pl-4">{phoneNumber}</div>

                <div className="pr-4">Email</div>
                <div>:</div>
                <div className="pl-4">{email}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 px-8">
        <div className="bg-white rounded-xl p-6">
          <div>
            <p className="font-semibold mb-4">Update Verification</p>
            <div className="grid grid-cols-[auto_10px_1fr] gap-y-3 flex items-center">
              <div className="pr-4">Type</div>
              <div>:</div>
              <div className="pl-4">{type}</div>

              <div className="pr-4">Status</div>
              <div>:</div>
              <div className="pl-4">
                {isUserInsurer && status === "Pending" ? (
                  <div className="flex gap-4">
                    <Button variant="warning" onClick={handleAccept}>Accept</Button>
                    <Button variant="danger" onClick={() => setShowModal(true)}>Reject</Button>
                  </div>
                ) : (
                  status
                )}
              </div>

              <div className="pr-4">Verified By</div>
              <div>:</div>
              <div className="pl-4">{getVerificator(verifiedBy)}</div>

              <div className="pr-4">Reason</div>
              <div>:</div>
              <div className="pl-4">{reason}</div>
            </div>
          </div>

          <div className="w-full h-px bg-[#EEEEEF] my-6" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold">Data Endorsement</p>
              <button
                className="flex items-center px-3 py-3 text-sm rounded-full hover:opacity-80 border border-[#252528] text-[#252528]"
                onClick={handleDownloadBtn}
              >
                <Download className="w-4 h-4 mr-2" /> Download
              </button>
            </div>

            <div style={{ minHeight: "60vh" }} className="overflow-x-auto">
              <div className="min-w-full pr-[140px]">
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tableData.map((item, index) => {
                      const current = item.data.profile;
                      const original = item.insured_parties?.profile || {};
                      return (
                        <tr key={`${index}-${item.id}`}>
                          <td className={tdClass}>{index + 1}</td>
                          <td className={getCellClass(current.policy_number, original.policy_number)}>{current.policy_number || "-"}</td>
                          <td className={getCellClass(current.subsidiary, original.subsidiary)}>{current.subsidiary || "-"}</td>
                          <td className={getCellClass(current.employee_id, original.employee_id)}>{current.employee_id || "-"}</td>
                          <td className={getCellClass(current.employee_name, original.employee_name)}>{current.employee_name || "-"}</td>
                          <td className={getCellClass(current.member_name, original.member_name)}>{current.member_name || "-"}</td>
                          <td className={getCellClass(current.gender, original.gender)}>{current.gender || "-"}</td>
                          <td className={getCellClass(current.date_of_birth, original.date_of_birth)}>{current.date_of_birth || "-"}</td>
                          <td className={getCellClass(current.member_status, original.member_status)}>{current.member_status || "-"}</td>
                          <td className={getCellClass(current.marital_status, original.marital_status)}>{current.marital_status || "-"}</td>
                          <td className={getCellClass(current.plan, original.plan)}>{current.plan || "-"}</td>
                          <td className={getCellClass(current.effective_date, original.effective_date)}>{current.effective_date || "-"}</td>
                          <td className={getCellClass(current.remarks, original.remarks)}>{current.remarks || "-"}</td>
                          <td className={getCellClass(current.bank_name, original.bank_name)}>{current.bank_name || "-"}</td>
                          <td className={getCellClass(current.branch, original.branch)}>{current.branch || "-"}</td>
                          <td className={getCellClass(current.bank_account_number, original.bank_account_number)}>{current.bank_account_number || "-"}</td>
                          <td className={getCellClass(current.bank_account_name, original.bank_account_name)}>{current.bank_account_name || "-"}</td>
                          <td className={getCellClass(current.email, original.email)}>{current.email || "-"}</td>
                          <td className={`${getCellClass(current.submission_date, original.submission_date)} ${stickySubmissionClass}`}>
                            {current.submission_date || item.endorsements.updated_at || "-"}
                          </td>
                          <td className={`${tdClass} ${stickyStatusClass}`} style={{ color: membershipStatusColor(item.endorsements.status) }}>
                            {capitalizeString(item.endorsements.status)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        widthClassName="w-[550px]"
        heightClassName="min-h-[118px]"
      >
        <div className="flex flex-col items-center py-2 gap-4">
          {AlertCircleIcon(undefined, "88", "88", "0 0 24 24")}
          <p className="text-base font-semibold">Reject updated data?</p>
          <div className="w-full">
            <p className="text-sm font-medium self-start mb-1.5">Reason</p>
            <TextArea
              value={rejectReason}
              placeholder="Insert reason"
              onChange={(value) => setRejectReason(value)}
              height="h-[118px]"
            />
          </div>
          <div className="flex flex-row gap-4">
            <Button variant="danger" onClick={() => setShowModal(false)}>No</Button>
            <Button variant="warning" onClick={() => handleReject()}>Yes</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
