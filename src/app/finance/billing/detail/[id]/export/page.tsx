"use client";

import { useEffect, useRef, useState } from "react";
import { useBilling } from "@/app/finance/billing/hook";
import * as XLSX from "xlsx";
import { ChevronLeft, Download } from "lucide-react";
import { formatDate, formatMoney } from "@/lib/formatter";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
import { useScreen } from "@/context/screen.context";
import AppURL from "@/constants/app-url.const";

export default function ExportDetailBillingPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refTemplate = useRef<HTMLDivElement>(null);
  const { setLoading } = useScreen();

  const type = searchParams.get("type") || "partner";

  const { billing, isLoadingBilling, fetchBillingDetails } = useBilling({
    billingId: id as string,
  });

  useEffect(() => {
    if (id) {
      fetchBillingDetails(id as string, {
        page: 1,
        limit: 10000,
      });
    }
  }, [id, fetchBillingDetails]);

  const loadImageAsBase64 = (url: string): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No 2D context"));
          return;
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/jpeg");
        resolve(dataURL);
      };
      img.onerror = reject;
      img.src = url;
    });

  const handleGeneratePdf = async () => {
    if (!billing?.data?.[0]) {
      console.error("No data to export.");
      return;
    }

    setLoading(true);

    try {
      const billingDetails = billing.data[0].billings;
      const doc = new jsPDF({
        format: "a4",
        unit: "px",
      });

      doc.setFontSize(10);
      doc.setFont("Inter-Regular", "normal");

      doc.text("Billing No.", 30, 30);
      doc.text(`: ${billingDetails.billing_no}`, 100, 30);

      doc.text(
        type === "insurer" ? "Total Amount" : "Total Net Premium",
        30,
        40
      );
      const totalAmount =
        type === "insurer"
          ? billingDetails.amount
          : billingDetails.total - billingDetails.amount;
      doc.text(
        `: ${billingDetails.currency} ${formatMoney(totalAmount)}`,
        100,
        40
      );

      doc.text("Created Date", 30, 50);
      doc.text(
        `: ${new Date(billingDetails.created_at).toDateString()}`,
        100,
        50
      );

      doc.text("Status", 30, 60);
      doc.text(`: ${formatStatus(billingDetails.status)}`, 100, 60);

      doc.text("Type", 30, 70);
      doc.text(`: ${billingDetails.type}`, 100, 70);

      doc.text("Company Name", 30, 80);
      doc.text(`: ${billingDetails.company_name}`, 100, 80);

      doc.text("Period", 30, 90);
      doc.text(`: ${billingDetails.transaction_period}`, 100, 90);

      const imageUrl =
        "https://friendsure-spaces.sgp1.digitaloceanspaces.com/teman.png";
      const image = await loadImageAsBase64(imageUrl);
      doc.addImage(image, "JPEG", 310, 25, 110, 40);

      const tableHeaders = getTableHeaders(type);
      const tableData = getTableData(billing.data, type);

      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,

        // @ts-ignore
        columnStyles: getColumnStyles(type),
        startY: 120,
        headStyles: {
          textColor: "black",
          fontStyle: "bold",
          fontSize: 10,
          fillColor: [231, 231, 231],
        },
        bodyStyles: {
          textColor: "black",
          fontSize: 10,
        },
      });

      const date = moment();
      const formattedDate = date.format("YYYY_MM_DD");
      doc.save(`${billingDetails.billing_no}_${formattedDate}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateXlsx = () => {
    if (!billing?.data?.[0]) {
      console.error("No data to export.");
      return;
    }

    const billingDetails = billing.data[0].billings;
    const totalAmount =
      type === "insurer"
        ? billingDetails.amount
        : billingDetails.total - billingDetails.amount;

    const headerBilling = [
      ["Billing No.", billingDetails.billing_no],
      [
        type === "insurer" ? "Total Amount" : "Total Net Premium",
        `${billingDetails.currency} ${formatMoney(totalAmount)}`,
      ],
      ["Created Date", new Date(billingDetails.created_at).toDateString()],
      ["Status", formatStatus(billingDetails.status)],
      ["Type", billingDetails.type],
      ["Company Name", billingDetails.company_name],
      ["Period", billingDetails.transaction_period],
      [],
      [],
    ];

    const tableHeader = [getTableHeaders(type)];
    const tableData = getTableData(billing.data, type);

    const sheetData = [...headerBilling, ...tableHeader, ...tableData];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    const headerRange = XLSX.utils.decode_range(`A1:B${headerBilling.length}`);
    for (let R = headerRange.s.r; R <= headerRange.e.r; ++R) {
      const cellAddress1 = XLSX.utils.encode_cell({ c: 0, r: R });
      const cellAddress2 = XLSX.utils.encode_cell({ c: 1, r: R });

      if (ws[cellAddress1]) {
        ws[cellAddress1].s = {
          fill: { fgColor: { rgb: "FF0000" } },
          font: { bold: true },
        };
      }

      if (ws[cellAddress2]) {
        ws[cellAddress2].s = {
          fill: { fgColor: { rgb: "CCCCCC" } },
          font: { bold: false },
        };
      }
    }

    const wb = XLSX.utils.book_new();
    const sheetName = type === "insurer" ? "Billing Detail" : "Listing Detail";
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    XLSX.writeFile(wb, `${sheetName}.xlsx`);
  };

  const getTableHeaders = (type: string) => {
    if (type === "insurer") {
      return [
        "Transaction Number",
        "Plan Name",
        "Transaction Date",
        "Currency",
        "Amount",
        "%",
        "Commission Amount",
      ];
    }
    return [
      "Transaction Number",
      "Plan Name",
      "Insurance Company Name",
      "Transaction Date",
      "Currency",
      "Premium",
      "%",
      "Net Premium",
    ];
  };

  const getTableData = (data: any[], type: string) => {
    return data.map((item: any) => {
      if (type === "partner") {
        return [
          item.invoice_no,
          item.details?.plan_name.split("|")[0] || "-",
          item.details?.insurance_name || "-",
          formatDate(item.details?.transaction_date, "YYYY-MM-DD"),
          item.billings.currency,
          formatMoney(item.amount),
          `${item.commission_percentage ?? 0}%`,
          formatMoney(item.amount - (item.commission_amount ?? 0)),
        ];
      } else {
        return [
          item.invoice_no,
          item.details?.plan_name.split("|")[0] || "-",
          formatDate(item.details?.transaction_date, "YYYY-MM-DD"),
          item.billings.currency,
          formatMoney(item.amount),
          `${item.commission_percentage ?? 0}%`,
          formatMoney(item.commission_amount ?? 0),
        ];
      }
    });
  };

  const getColumnStyles = (type: string) => {
    if (type === "partner") {
      return {
        5: { halign: "right" as const },
        6: { halign: "right" as const },
        7: { halign: "right" as const },
      };
    }
    return {
      4: { halign: "right" as const },
      5: { halign: "right" as const },
      6: { halign: "right" as const },
    };
  };

  const formatStatus = (status: string) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleBack = () => {
    router.push(`${AppURL.financeBillingDetail}/${id}`);
  };

  const tableStyles = {
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
    tdRight: {
      padding: "10px",
      height: "auto",
      border: "0.5px solid #cccccc",
      fontSize: "12px",
      verticalAlign: "middle",
      textAlign: "right" as const,
    },
    thRight: {
      padding: "10px",
      border: "0.5px solid #cccccc",
      fontWeight: "bold",
      fontSize: "12px",
      height: "auto",
      background: "#e7e7e7",
      verticalAlign: "middle",
      textAlign: "right" as const,
    },
  };

  if (isLoadingBilling) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading billing details...</div>
      </div>
    );
  }

  if (!billing?.data?.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">No billing data found</div>
      </div>
    );
  }

  const billingDetails = billing.data[0].billings;
  const totalAmount =
    type === "insurer"
      ? billingDetails.amount
      : billingDetails.total - billingDetails.amount;

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="bg-white md:px-6 p-4 flex items-center">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={AppURL.financeBilling}>
                  Billing
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {type === "insurer" ? "Billing Detail" : "Listing Detail"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
            {type === "insurer" ? "Billing Detail" : "Listing Detail"}
          </h2>
        </div>

        <div className="flex space-x-4 ml-auto">
          <div
            onClick={handleBack}
            className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </div>

          <Button
            onClick={handleGeneratePdf}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full text-xs"
          >
            <Download className="w-5 h-5 mr-1" /> Generate PDF
          </Button>

          <Button
            onClick={handleGenerateXlsx}
            className="bg-[#41BAF5] text-black hover:bg-[#2d9ae6] rounded-full text-xs"
          >
            <Download className="w-5 h-5 mr-1" /> Generate XLSX
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="pt-5 md:px-6 p-4 m-5 bg-white" ref={refTemplate}>
        <div className="w-full">
          {/* Billing Info Header */}
          <div className="flex gap-8 items-start pb-5 text-sm">
            <table cellPadding={3} className="table-header">
              <tbody>
                <tr>
                  <td className="pr-5" width={155}>
                    Billing No.
                  </td>
                  <td>:</td>
                  <td>{billingDetails.billing_no}</td>
                </tr>
                <tr>
                  <td className="pr-5">
                    {type === "insurer" ? "Total Amount" : "Total Net Premium"}
                  </td>
                  <td>:</td>
                  <td>
                    {billingDetails.currency} {formatMoney(totalAmount)}
                  </td>
                </tr>
                <tr>
                  <td className="pr-5">Created Date</td>
                  <td>:</td>
                  <td>{new Date(billingDetails.created_at).toDateString()}</td>
                </tr>
                <tr>
                  <td className="pr-5">Status</td>
                  <td>:</td>
                  <td>{formatStatus(billingDetails.status)}</td>
                </tr>
                <tr>
                  <td className="pr-5">Type</td>
                  <td>:</td>
                  <td>{billingDetails.type}</td>
                </tr>
                <tr>
                  <td className="pr-5">Company Name</td>
                  <td>:</td>
                  <td>{billingDetails.company_name}</td>
                </tr>
                <tr>
                  <td className="pr-5">Period</td>
                  <td>:</td>
                  <td>{billingDetails.transaction_period}</td>
                </tr>
              </tbody>
            </table>

            <div className="ml-auto">
              <img
                width={180}
                src="https://friendsure-spaces.sgp1.digitaloceanspaces.com/teman.png"
                alt="PT.Teman Pialang Asuransi"
              />
            </div>
          </div>

          {/* Data Table */}
          <table style={tableStyles.table}>
            <thead>
              <tr>
                <th style={tableStyles.th}>Transaction Number</th>
                <th style={tableStyles.th}>Plan Name</th>
                {type === "partner" && (
                  <th style={tableStyles.th}>Insurance Company Name</th>
                )}
                <th style={tableStyles.th}>Transaction Date</th>
                <th style={tableStyles.th}>Currency</th>
                <th style={tableStyles.thRight}>Premium</th>
                <th style={tableStyles.thRight}>%</th>
                <th style={tableStyles.thRight}>
                  {type === "insurer" ? "Commission Amount" : "Net Premium"}
                </th>
              </tr>
            </thead>
            <tbody>
              {billing.data.map((data: any) => (
                <tr key={data.id}>
                  <td style={tableStyles.td}>{data.invoice_no}</td>
                  <td style={tableStyles.td}>
                    {data.details?.plan_name.split("|")[0] || "-"}
                  </td>
                  {type === "partner" && (
                    <td style={tableStyles.td}>
                      {data.details?.insurance_name || "-"}
                    </td>
                  )}
                  <td style={tableStyles.td}>
                    {formatDate(data.details?.transaction_date, "YYYY-MM-DD")}
                  </td>
                  <td style={tableStyles.td}>{data.billings.currency}</td>
                  <td style={tableStyles.tdRight}>
                    {formatMoney(data.amount)}
                  </td>
                  <td style={tableStyles.tdRight}>
                    {data.commission_percentage ?? 0}%
                  </td>
                  <td style={tableStyles.tdRight}>
                    {type === "insurer"
                      ? formatMoney(data.commission_amount ?? 0)
                      : formatMoney(
                          data.amount - (data.commission_amount ?? 0)
                        )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
