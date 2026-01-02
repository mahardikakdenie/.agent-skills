// "use client";
//
// import React from "react";
// import {PolicyExportView} from "@/views/policy/export/export.view";
//
// export default function PolicyExportPage() {
//     return <PolicyExportView />;
// }

"use client";
import { useEffect, useRef, useState } from "react";
import noData from "/public/images/no-data.webp";
import Image from "next/image";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";
import { ChevronLeft, Download } from "react-feather";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import autoTable from "jspdf-autotable";
import moment from "moment";
import ApiURL from "@/constants/api-url.const";
import { policyService } from "@/services/api.service";
import { useAuth } from "@/context/auth.context";

export default function ExportPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingXlsx, setIsGeneratingXlsx] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const router = useRouter();
  const { permissionList } = useAuth();
  const [isShowPremi, setIsShowPremi] = useState<boolean>(false);
  const [isShowDanaInfo, setIsShowDanaInfo] = useState<boolean>(false);

  useEffect(() => {
    const checkAccess = async () => {
      const withPremi = permissionList.includes("Policy.Export.withPremi");
      const withDanaInfo = permissionList.includes(
        "Policy.Export.withDanaInfo"
      );

      setIsShowPremi(withPremi);
      setIsShowDanaInfo(withDanaInfo);

      await fetchData();
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const savedData = localStorage.getItem("exportPolicyData");

        if (!savedData) return;

        const parsedData = JSON.parse(savedData);

        const rowsPerPage = 100;
        const status = parsedData.status ?? "All";
        const searchData = parsedData.search ?? "";
        const channel = parsedData.channel;
        const category = parsedData.category;
        const date_from = parsedData.date_from;
        const date_to = parsedData.date_to;

        let allData: any[] = [];
        let currentPage = 1;
        let totalRecords = 0;

        do {
          try {
            const params = {
              page: currentPage,
              limit: rowsPerPage,
              keyword: searchData ? searchData : undefined,
              status: status && status !== "All" ? status : undefined,
              channel: channel ? channel : undefined,
              category: category && category !== "All" ? category : undefined,
              created_from: date_from ? date_from : undefined,
              created_to: date_to ? date_to : undefined,
            };

            const res = await policyService.get(ApiURL.v1Policies, { params });

            if (res?.data?.data) {
              allData = [...allData, ...res.data.data];
              totalRecords = res.data.total || 0;
            }
          } catch (pageError) {
            console.error(`DY: Error fetching page ${currentPage}:`, pageError);
          }

          currentPage++;
        } while (allData.length < totalRecords && totalRecords > 0);

        setData(allData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    //old
    // doc.html(reportTemplateRef.current, {
    //   async callback(doc) {
    //     await doc.save("PolicyList.pdf");
    //   },
    //   x: 30,
    //   y: 30,
    // });

    //new with auto page break
    autoTable(doc, {
      head: [["No.", "Customer Name", "Policy Number", "Plan Name", "Status"]],
      body: data.map((item, index) => [
        (page - 1) * rowsPerPage + index + 1,
        item.policy_holder?.name || "-",
        item?.number || "-",
        item?.policy_products?.plan_data?.name.split("|").join(" - ") || "-",
        item.status || "-",
      ]),
      startY: 30,
      headStyles: {
        textColor: "black",
        fontStyle: "bold",
        fontSize: 10,
        fillColor: [231, 231, 231], //grey
      },
      bodyStyles: {
        textColor: "black",
        fontSize: 10,
      },
    });
    const date = moment();
    const formattedDate = date.format("YYYY_MM_DD");
    doc.save(`policylist_${formattedDate}.pdf`);
  };

  const handleGenerateXlsx = async () => {
    if (data.length === 0) {
      console.error("No data to export.");
      return;
    }

    setIsGeneratingXlsx(true);

    // Use setTimeout to allow loading state to render before heavy computation
    setTimeout(async () => {
      try {
        const sheetData = data.map((item, index) => {
          let additionColumn = {};

          if (isShowPremi) {
            additionColumn = {
              ...additionColumn,
              Premium:
                item.declarations?.transaction_data?.insurance?.premium || "-",
            };
          }

          if (isShowDanaInfo) {
            let thisParty = item.declarations?.transaction_data?.third_party;
            if (thisParty) {
              if (thisParty?.provider === "DANA") {
                additionColumn = {
                  ...additionColumn,
                  "Order Id": thisParty?.identifiers?.order_id,
                  "Request Id": thisParty?.identifiers?.request_id,
                  "License Plate":
                    item.declarations?.transaction_data?.participants[0]?.data
                      ?.licensePlate ||
                    item.declarations?.transaction_data?.participants[0]?.data
                      ?.plat_number ||
                    "-",
                };
              }
            }
          }

          return {
            No: index + 1,
            "Customer Name": item.policy_holder?.name || "-",
            "Policy Number": item.number || "-",
            "Plan Name":
              item.policy_products?.plan_data?.name?.split("|").join(" - ") ||
              "-",
            Status: item.status || "-",
            "Issued Date": !!item.created_at
              ? moment(item.created_at).format("LL HH:mm:ss")
              : "-",
            ...additionColumn,
          };
        });

        const worksheet = XLSX.utils.json_to_sheet(sheetData);

        const columnWidths: Record<string, number> = {};
        columnWidths["No"] = 30;
        columnWidths["Customer Name"] = 100;
        columnWidths["Policy Number"] = 150;
        columnWidths["Plan Name"] = 500;
        columnWidths["Status"] = 100;
        // Set the width for each column
        worksheet["!cols"] = Object.keys(columnWidths).map((key) => ({
          wpx: columnWidths[key], //adjust multiplier for better fit
        }));

        const workbook = XLSX.utils.book_new();

        const date = moment();
        const formattedDate = date.format("YYYY_MM_DD");
        let name = `policylist_${formattedDate}`;

        XLSX.utils.book_append_sheet(workbook, worksheet, "policylist");
        XLSX.writeFile(workbook, `${name}.xlsx`);
      } catch (error) {
        console.error("Error generating XLSX:", error);
      } finally {
        setIsGeneratingXlsx(false);
      }
    }, 100);
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
        <h1 className="text-black font-bold text-2xl mt-2">Policy List</h1>
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
          disabled={isGeneratingXlsx}
          className="bg-[#41BAF5] text-black hover:bg-[#2d9ae6] rounded-full text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingXlsx ? (
            <>
              <Spinner />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-1 " /> Generate XLSX
            </>
          )}
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
            <thead>
              <tr>
                <td style={styles.th} valign="middle">
                  No.
                </td>
                <td style={styles.th} valign="middle">
                  Customer Name
                </td>
                <td style={styles.th} valign="middle">
                  Policy Number
                </td>
                <td style={styles.th} valign="middle">
                  Plan Name
                </td>
                <td style={styles.th} valign="middle">
                  Status
                </td>
                {isShowPremi && (
                  <td style={styles.th} valign="middle">
                    Premium
                  </td>
                )}
                {isShowDanaInfo && (
                  <>
                    <td style={styles.th} valign="middle">
                      Order Id
                    </td>
                    <td style={styles.th} valign="middle">
                      Request Id
                    </td>
                    <td style={styles.th} valign="middle">
                      License Plate
                    </td>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item.id}>
                    <td style={styles.td} valign="middle">
                      {(page - 1) * rowsPerPage + index + 1}
                    </td>
                    <td style={styles.td} valign="middle">
                      <div className="flex gap-2 items-center">
                        {item.policy_holder?.name || "-"}
                      </div>
                    </td>
                    <td style={styles.td} valign="middle">
                      {item?.number || "-"}
                    </td>
                    <td style={styles.td} valign="middle">
                      {item?.policy_products?.plan_data?.name
                        .split("|")
                        .join(" - ") || "-"}
                    </td>
                    <td
                      style={styles.td}
                      valign="middle"
                      className="whitespace-nowrap"
                    >
                      {item.status || "-"}
                    </td>
                    {isShowPremi && (
                      <td style={styles.td} valign="middle">
                        {item.declarations?.transaction_data?.insurance
                          ?.premium || "-"}
                      </td>
                    )}
                    {isShowDanaInfo &&
                      (item.declarations?.transaction_data?.third_party
                        ?.provider === "DANA" ? (
                        <>
                          <td style={styles.td} valign="middle">
                            {item.declarations?.transaction_data?.third_party
                              ?.identifiers?.order_id || "-"}
                          </td>
                          <td style={styles.td} valign="middle">
                            {item.declarations?.transaction_data?.third_party
                              ?.identifiers?.request_id || "-"}
                          </td>
                          <td style={styles.td} valign="middle">
                            {item.declarations?.transaction_data
                              ?.participants[0]?.data?.licensePlate ||
                              item.declarations?.transaction_data
                                ?.participants[0]?.data?.plat_number ||
                              "-"}
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={styles.td} valign="middle">
                            -
                          </td>
                          <td style={styles.td} valign="middle">
                            -
                          </td>
                          <td style={styles.td} valign="middle">
                            -
                          </td>
                        </>
                      ))}
                  </tr>
                ))
              ) : (
                <tr className="hover:!bg-white">
                  <td colSpan={5}>
                    <div className="flex flex-col gap-4 items-center justify-center py-14">
                      <Image alt="no data" src={noData} width={200} /> No
                      transaction data available
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
