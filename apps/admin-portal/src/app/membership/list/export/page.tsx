"use client";
import * as XLSX from "xlsx";
import Image from "next/image";
import Spinner from "@/components/ui/spinner";
import noData from "@public/images/no-data.webp";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Download } from "react-feather";
import { useInsuredParties } from "@/services/policy/hooks/queries";

export default function ExportPage() {
  const router = useRouter();
  const [ page, setPage ] = useState(1);
  const [ listParams, setListParams ] = useState<Record<string, unknown> | undefined>(undefined);
  const rowsPerPage = 100;
  const { data: insuredPartiesResponse, isFetching: isLoading } = useInsuredParties(
    listParams,
    { enabled: !!listParams }
  );
  const data = ((insuredPartiesResponse as any)?.data ?? []) as any[];

  useEffect(() => {
    try {
      const savedData = localStorage.getItem("exportMembershipData");
      if (!savedData) return;

      const parsedData = JSON.parse(savedData);
      const savedPage = parsedData.page ?? 1;
      setPage(savedPage);
      setListParams({
        page: savedPage,
        limit: 100,
        channel: parsedData.channel || undefined,
      });
    } catch (error) {
      console.error("Error preparing export params: ", error);
    }
  }, []);

  const reportTemplateRef = useRef(null);

  const handleGenerateXlsx = () => {
    if (data.length === 0) {
      console.error("No data to export.");
      return;
    }

    const sheetData = data.map((item, index) => ({
      No: (page - 1) * rowsPerPage + index + 1,
      "Policy Number" : item?.number || "-",
      "Subsidiary / Entity" : item?.profile?.subsidiary || "-",
      "Employee ID" : item?.profile?.employee_id || "-",
      "Employee Name" : item?.profile?.employee_name || "-",
      "Member Name" : item?.profile?.member_name || "-",
      "Gender" : item?.profile?.gender || "-",
      "Date of birtd" : item?.profile?.date_of_birth || "-",
      "Member Status" : item?.profile?.member_status || "-",
      "Marital Status" : item?.profile?.marital_status || "-",
      "Plan" : item?.profile?.plan || "-",
      "Effective Date" : item?.profile?.effective_date || "-",
      "Remarks" : item?.profile?.remarks || "-",
      "Bank Name" : item?.profile?.bank_name || "-",
      "Branch" : item?.profile?.branch || "-",
      "Bank Number" : item?.profile?.bank_account_number || "-",
      "Bank Account Name" : item?.profile?.bank_account_name || "-",
      "Email" : item?.profile?.email || "-",
      "Membership ID" : item?.profile?.tpa_member_id || "-",
      "Submission Date" : item?.profile?.submission_date || "-",
      "Status" : item?.status || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MembershipList");

    XLSX.writeFile(workbook, "MembershipList.xlsx");
  };

  const styles = {
    table: {
      width: "100%",
      border: "0.5px solid #cccccc",
    },
    th: {
      padding: "10px",
      border: "0.5px solid #cccccc",
      fontWeight: "bold",
      fontSize: "12px",
      height: "auto",
      background: "#e7e7e7",
      verticalAlign: "middle",
    },
    td: {
      padding: "10px",
      height: "auto",
      border: "0.5px solid #cccccc",
      fontSize: "12px",
      verticalAlign: "middle",
    },
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6 h-screen overflow-auto">
      <div className="flex gap-4 mb-5">
        <h1 className="text-black font-bold text-2xl mt-2">Membership List</h1>
        <div onClick={() => router.back()} className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer mr-4">
          <ChevronLeft className="w-4 h-4" /> Back
        </div>
        <Button onClick={handleGenerateXlsx} className="bg-[#41BAF5] text-black hover:bg-[#2d9ae6] rounded-full text-xs">
          <Download className="w-5 h-5 mr-1 " /> Generate XLSX
        </Button>
      </div>
      <div className="w-full bg-white rounded-lg overflow-auto">
        {isLoading ? (
          <div className="flex gap-2 flex-col justify-center items-center py-20 text-sm">
            <Spinner /> Loading...
          </div>
        ) : (
          <table style={styles.table} ref={reportTemplateRef} border={1}>
            <tbody>
            <tr>
              <td style={styles.th} valign="middle">No.</td>
              <td style={styles.th} valign="middle">Policy Number</td>
              <td style={styles.th} valign="middle">Subsidiary / Entity</td>
              <td style={styles.th} valign="middle">Employee ID</td>
              <td style={styles.th} valign="middle">Employee Name</td>
              <td style={styles.th} valign="middle">Member Name</td>
              <td style={styles.th} valign="middle">Gender</td>
              <td style={styles.th} valign="middle">Date of birtd</td>
              <td style={styles.th} valign="middle">Member Status</td>
              <td style={styles.th} valign="middle">Marital Status</td>
              <td style={styles.th} valign="middle">Plan</td>
              <td style={styles.th} valign="middle">Effective Date</td>
              <td style={styles.th} valign="middle">Remarks</td>
              <td style={styles.th} valign="middle">Bank Name</td>
              <td style={styles.th} valign="middle">Branch</td>
              <td style={styles.th} valign="middle">Bank Number</td>
              <td style={styles.th} valign="middle">Bank Account Name</td>
              <td style={styles.th} valign="middle">Email</td>
              <td style={styles.th} valign="middle">Membership ID</td>
              <td style={styles.th} valign="middle">Submission Date</td>
              <td style={styles.th} valign="middle">Status</td>
            </tr>
            </tbody>
            {data.length > 0 ? ( 
              data.map((item, index) => (
                <tbody key={item.id}>
                  <tr>
                    <td style={styles.td} valign="middle">{(page - 1) * rowsPerPage + index + 1}</td>
                    <td style={styles.td} valign="middle">{item?.number || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.profile?.subsidiary || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.profile?.employee_id || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.profile?.employee_name || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.profile?.member_name || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.profile?.gender || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.profile?.date_of_birth || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.profile?.member_status || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.profile?.marital_status || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.profile?.plan || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.profile?.effective_date || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.profile?.remarks || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.profile?.bank_name || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.profile?.branch || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.profile?.bank_account_number || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.profile?.bank_account_name || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.profile?.email || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.other_info?.tpa_member_id || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.profile?.submission_date || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.status || "-"}</td>
                  </tr>
                </tbody>
              ))
            ) : (
              <tbody>
                <tr className="hover:!bg-white">
                  <td colSpan={5}>
                    <div className="flex flex-col gap-4 items-center justify-center py-14">
                      <Image alt="no data" src={noData} width={200} /> No transaction data available
                    </div>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        )}
      </div>
    </div>
  );
};

