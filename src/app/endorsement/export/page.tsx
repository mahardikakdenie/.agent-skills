"use client";
import "jspdf-autotable";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import Image from "next/image";
import noData from "/public/images/no-data.webp";
import WithSidebar from "@/hoc/with-sidebar";
import Spinner from "@/components/ui/spinner";
import useRequireAuth from "@/hooks/useRequireAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Download } from "react-feather";
import { EndorsementService } from "@/services/endorsement.service";

const ExportPage = () => {
  useRequireAuth();
  const endorsementService = new EndorsementService();
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalData, setTotalData] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(totalData);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await endorsementService.getEndorsementExport( page, rowsPerPage );
        setData(res.data);
        setTotalData(res.total);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reportTemplateRef = useRef(null);

  const handleGeneratePdf = () => {
    if (!reportTemplateRef.current) {
      console.error("Template element is not found.");
      return;
    }

    const doc = new jsPDF({ format: "a1", unit: "px", });
    doc.setFontSize(10);
    doc.setFont("Inter-Regular", "normal");
    doc.html(reportTemplateRef.current, {
      async callback(doc) {
        await doc.save("Endorsement.pdf");
      },
      x: 30,
      y: 30,
    });
  };

  const handleGenerateXlsx = () => {
    if (data.length === 0) {
      console.error("No data to export.");
      return;
    }

    const sheetData = data.map((endorsement, index) => ({
      No: (page - 1) * rowsPerPage + index + 1,
      "Request ID": endorsement.number || "-",
      "Insured Name":
        endorsement?.participants?.full_name ||
        endorsement?.participants?.name ||
        endorsement?.participants?.first_name ||
        endorsement?.participants?.last_name ||
        "-",
      "Policy Number": endorsement.policies?.number || "-",
      "Request Date": endorsement?.created_at
        ? new Date(endorsement.created_at).toLocaleDateString("en-GB")
        : "No Date",
      "Approve Date": endorsement?.updated_at
        ? new Date(endorsement.updated_at).toLocaleDateString("en-GB")
        : "No Date",
      Status: endorsement.status || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Endorsements");

    XLSX.writeFile(workbook, "Endorsements.xlsx");
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
        <h1 className="text-black font-bold text-2xl mt-2">Endorsement List</h1>
        <div onClick={() => router.back()} className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer mr-4">
          <ChevronLeft className="w-4 h-4" /> Back
        </div>
        <Button onClick={handleGeneratePdf} className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full text-xs">
          <Download className="w-5 h-5 mr-1 " /> Generate PDF
        </Button>
        <Button onClick={handleGenerateXlsx} className="bg-[#41BAF5] text-black hover:bg-[#2d9ae6] rounded-full text-xs">
          <Download className="w-5 h-5 mr-1 " /> Generate XLSX
        </Button>
      </div>
      <div className="w-full bg-white rounded-lg">
        {isLoading ? (
          <div className="flex gap-2 flex-col justify-center items-center py-20 text-sm">
            <Spinner /> Loading...
          </div>
        ) : (
          <table style={styles.table} ref={reportTemplateRef} border={1}>
            <tr>
              <td style={styles.th} valign="middle">No.</td>
              <td style={styles.th} valign="middle">Request ID</td>
              <td style={styles.th} valign="middle">Insured Name</td>
              <td style={styles.th} valign="middle">Policy Number</td>
              <td style={styles.th} valign="middle">Request Date</td>
              <td style={styles.th} valign="middle">Approve Date</td>
              <td style={styles.th} valign="middle">Status</td>
            </tr>
            {data.length > 0 ? (
              data.map((endorsement, index) => (
                <tr key={endorsement.id}>
                  <td style={styles.td} valign="middle">
                    {(page - 1) * rowsPerPage + index + 1}
                  </td>
                  <td style={styles.td} valign="middle">
                    {endorsement.number}
                  </td>
                  <td style={styles.td} valign="middle">
                    {endorsement?.insured_parties?.profile?.name || endorsement?.policies?.policy_holders?.name || endorsement?.participants?.profile?.name || "-"}
                  </td>
                  <td style={styles.td} valign="middle">
                    {endorsement.policies?.number || "-"}
                  </td>
                  <td style={styles.td} valign="middle">
                    {endorsement?.created_at ? new Date(endorsement.created_at).toLocaleDateString( "en-GB" ) : "No Date"}
                  </td>
                  <td style={styles.td} valign="middle">
                    {endorsement?.updated_at ? new Date(endorsement.updated_at).toLocaleDateString( "en-GB" ) : "No Date"}
                  </td>
                  <td style={styles.td} valign="middle">
                    {endorsement.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="hover:!bg-white">
                <td colSpan={7}>
                  <div className="flex flex-col gap-4 items-center justify-center py-14">
                    <Image alt="no data" src={noData} width={200} /> No transaction data available
                  </div>
                </td>{" "}
              </tr>
            )}
          </table>
        )}
      </div>
    </div>
  );
};

const ExportWithSidebar = (params: any) => WithSidebar(ExportPage)(params);
export default ExportWithSidebar;
