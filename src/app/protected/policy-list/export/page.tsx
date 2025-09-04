"use client";
import { useEffect, useRef, useState } from "react";
import noData from "/public/images/no-data.webp";
import Image from "next/image";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";
import { ChevronLeft, Download } from "react-feather";
import { Button } from "@/components/ui/button";
import { PolicyService } from "@/services/policy.service";
import Spinner from "@/components/ui/spinner";
import WithSidebar from "@/hoc/with-sidebar";
import autoTable from "jspdf-autotable";
import moment from "moment";
import { formatDateTimeWithTZ } from "@/lib/formatter";
import { hasPermission } from "@/context/auth.context";

const ExportPage = () => {
  const itemService = new PolicyService();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [isShowCreatedAt, setIsShowCreatedAt] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      const withCreatedAt = await hasPermission("Policy.Export.withCreatedAt");

      setIsShowCreatedAt(withCreatedAt);

      await fetchData();
    };
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const savedData = localStorage.getItem("exportPolicyData");

        if (!savedData) return;

        const parsedData = JSON.parse(savedData);

        const page = parsedData.page ?? 1;
        const rowsPerPage = 1000;
        const status = parsedData.status ?? "All";
        const searchData = parsedData.search ?? "";
        const channel = parsedData.channel;
        const category = parsedData.category;
        const date_from = parsedData.date_from;
        const date_to = parsedData.date_to;

        const res = await itemService.getPolicyExport(
          page,
          rowsPerPage,
          searchData,
          status === "All" ? "" : status,
          channel,
          category,
          date_from,
          date_to
        );

        setData(res.data);
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
      head: [['No.', 'Customer Name', 'Policy Number', 'Plan Name', 'Status', 'Created At']],
      body: data.map((item, index) => [
        (page - 1) * rowsPerPage + index + 1,
        item.policy_holder?.name || "-",
        item?.number || "-",
        item?.policy_products?.plan_data?.name
          .split("|")
          .join(" - ") || "-",
        item.status || "-"
      ]),
      startY: 30,
      headStyles: {
        textColor: 'black',
        fontStyle: 'bold',
        fontSize: 10,
        fillColor: [231, 231, 231], //grey
      },
      bodyStyles: {
        textColor: 'black',
        fontSize: 10,
      },
    });
    const date = moment();
    const formattedDate = date.format('YYYY_MM_DD');
    doc.save(`policylist_${formattedDate}.pdf`);
  };

  const handleGenerateXlsx = () => {
    if (data.length === 0) {
      console.error("No data to export.");
      return;
    }

    const sheetData = data.map((item, index) => {
      let additionColumn = {};
      if (isShowCreatedAt) {
        additionColumn = {
          ...additionColumn, 
          "Created At": formatDateTimeWithTZ(item.created_at),
        }
      }
      return {
        No: (page - 1) * rowsPerPage + index + 1,
        "Customer Name": item.policy_holder?.name || "-",
        "Policy Number": item.number || "-",
        "Plan Name": item?.policy_products?.plan_data?.name
          .split("|")
          .join(" - "),
        Status: item.status || "-",
        ...additionColumn
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
    worksheet['!cols'] = Object.keys(columnWidths).map((key) => ({
      wpx: columnWidths[key], //adjust multiplier for better fit
    }));

    const workbook = XLSX.utils.book_new();

    const date = moment();
    const formattedDate = date.format('YYYY_MM_DD');
    let name = `policylist_${formattedDate}`;

    XLSX.utils.book_append_sheet(workbook, worksheet, "policylist");
    XLSX.writeFile(workbook, `${name}.xlsx`);
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
                {isShowCreatedAt && <td style={styles.th} valign="middle">Created At</td>}
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
                    {isShowCreatedAt && 
                      <td
                        style={styles.td}
                        valign="middle"
                        className="whitespace-nowrap"
                      >
                        {formatDateTimeWithTZ(item?.created_at) || "-"}
                      </td>
                    }
                  </tr>
                ))
              ) : (
                <tr className="hover:!bg-white">
                  <td colSpan={5}>
                    <div className="flex flex-col gap-4 items-center justify-center py-14">
                      <Image alt="no data" src={noData} width={200} /> No
                      transaction data available
                    </div>
                  </td>{" "}
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const ExportWithSidebar = (params: any) => WithSidebar(ExportPage)(params);
export default ExportWithSidebar;
