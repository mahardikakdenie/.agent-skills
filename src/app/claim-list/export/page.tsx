"use client";
import useRequireAuth from "@/hooks/useRequireAuth";
import { useEffect, useRef, useState } from "react";
import noData from "/public/images/no-data.webp";
import Image from "next/image";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";
import { ChevronLeft, Download } from "react-feather";
import { Button } from "@/components/ui/button";
import { ClaimService } from "@/services/claim.service";
import { formatMoney, formatMoneyClaim } from "@/lib/formatter";
import Spinner from "@/components/ui/spinner";

const ExportPage = () => {
  useRequireAuth();
  const itemService = new ClaimService();
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
        const res = await itemService.getClaimsExport(page, rowsPerPage);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const reportTemplateRef = useRef(null);

  const handleGeneratePdf = () => {
    if (!reportTemplateRef.current) {
      console.error("Template element is not found.");
      return;
    }

    const doc = new jsPDF({
      format: "a1",
      unit: "px",
    });
    doc.setFontSize(10);
    doc.setFont("Inter-Regular", "normal");
    doc.html(reportTemplateRef.current, {
      async callback(doc) {
        await doc.save("ClaimsList.pdf");
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

    const sheetData = data.map((item, index) => ({
      No: (page - 1) * rowsPerPage + index + 1,
      "Claim ID": item.number || "-",
      "Customer Name": item.policy_data?.account?.name || "-",
      "Plan Name":
        item?.policy_data?.declarations?.transaction_data?.insurance?.plan?.name
          .split("|")
          .join(" - ") || "-",
      Benefit:
        item.policy_data?.declarations?.transaction_data?.insurance
          ?.package_data?.benefits[0]?.benefits?.description_en || "-",
      Currency:
        item.policy_data?.declarations?.transaction_data?.insurance?.currency ||
        "-",
      "Requested Amount": (() => {
        const claimValue = item.claim?.find(
          (d: any) => d.type === "Number" && d.name === "claim"
        )?.value;

        const numericValue = Number(claimValue);

        return !isNaN(numericValue) ? formatMoneyClaim(numericValue) : "-";
      })(),
      "Approved Amount": formatMoneyClaim(
        item.amount_approved != null ? item.amount_approved : 0
      ),
      Status: item.status || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ClaimsList");

    XLSX.writeFile(workbook, "ClaimsList.xlsx");
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
        <div
          onClick={() => router.back()}
          className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer mr-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </div>

        <Button
          onClick={handleGeneratePdf}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full text-xs"
        >
          <Download className="w-5 h-5 mr-1 " /> Generate PDF
        </Button>

        <Button
          onClick={handleGenerateXlsx}
          className="bg-[#41BAF5] text-black hover:bg-[#2d9ae6] rounded-full text-xs"
        >
          <Download className="w-5 h-5 mr-1 " /> Generate XLSX
        </Button>
      </div>
      <div className="w-full bg-white rounded-lg">
        {isLoading ? (
          <div className="flex gap-2 flex-col justify-center items-center py-20 text-sm">
            <Spinner />
            Loading...
          </div>
        ) : (
          <table style={styles.table} ref={reportTemplateRef} border={1}>
            <tr>
              <td style={styles.th} valign="middle">
                No.
              </td>
              <td style={styles.th} valign="middle">
                Claim ID
              </td>
              <td style={styles.th} valign="middle">
                Customer Name
              </td>
              <td style={styles.th} valign="middle">
                Plan Name
              </td>
              <td style={styles.th} valign="middle">
                Benefit
              </td>
              <td style={styles.th} valign="middle">
                Currency
              </td>
              <td style={styles.th} valign="middle">
                Requested Amount
              </td>
              <td style={styles.th} valign="middle">
                Approved Amount{" "}
              </td>
              <td style={styles.th} valign="middle">
                Status
              </td>
            </tr>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item.id}>
                  <td style={styles.td} valign="middle">
                    {(page - 1) * rowsPerPage + index + 1}
                  </td>
                  <td style={styles.td} valign="middle">
                    <div className="flex gap-2 items-center">
                      {item.number || "-"}
                    </div>
                  </td>
                  <td style={styles.td} valign="middle">
                    {item?.policy_data?.account?.name || "-"}
                  </td>
                  <td style={styles.td} valign="middle">
                    {item?.policy_data?.declarations?.transaction_data?.insurance?.plan?.name
                      .split("|")
                      .join(" - ") || "-"}
                  </td>
                  <td style={styles.td} valign="middle">
                    {item.policy_data?.declarations?.transaction_data?.insurance
                      ?.package_data?.benefits[0]?.benefits?.description_en ||
                      "-"}
                  </td>
                  <td style={styles.td} valign="middle">
                    {item.policy_data?.declarations?.transaction_data?.insurance
                      ?.currency || "-"}
                  </td>
                  <td style={styles.td} valign="middle">
                    {(() => {
                      const claimValue = item.claim?.find(
                        (d: any) => d.type === "Number" && d.name === "claim"
                      )?.value;

                      const numericValue = Number(claimValue);

                      return !isNaN(numericValue)
                        ? formatMoneyClaim(numericValue)
                        : "-";
                    })()}
                  </td>
                  <td style={styles.td} valign="middle">
                    <div className="flex gap-2 items-center">
                      {formatMoneyClaim(
                        item.amount_approved != null ? item.amount_approved : 0
                      )}
                    </div>
                  </td>
                  <td style={styles.td} valign="middle">
                    {item.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="hover:!bg-white">
                <td colSpan={9}>
                  <div className="flex flex-col gap-4 items-center justify-center py-14">
                    <Image alt="no data" src={noData} width={200} /> No
                    transaction data available
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

export default ExportPage;
