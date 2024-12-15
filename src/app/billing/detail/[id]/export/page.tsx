"use client";
import WithSidebar from "@/hoc/with-sidebar";
import useRequireAuth from "@/hooks/useRequireAuth";
import { useEffect, useRef, useState } from "react";
import { useBilling } from "../../../hook";
import * as XLSX from "xlsx";
import { ChevronLeft, Download } from "lucide-react";
import { formatMoney } from "@/lib/formatter";
import { useParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/context/loading.context";
import jsPDF from "jspdf";

const ExportDetailBillingPage = () => {
  useRequireAuth();

  const { getBillingById, billing, updateBilling } = useBilling();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const { setLoading } = useLoading();
  const [openCancel, setOpenCancel] = useState(false);
  const [openUpdateToPaid, setOpenUpdateToPaid] = useState(false);
  const handleRowsPerPageChange = (e: any) => {
    setRowsPerPage(e.target.value);
  };

  const { id } = useParams();

  const handlePaging = (page: number) => {
    setPage(page);
    (async () => {
      const search = {
        status: "Declaration",
        limit: rowsPerPage,
      };

      await getBillingById(id as string, page, rowsPerPage);
    })();
  };

  useEffect(() => {
    getBillingById(id as string, undefined, undefined);
  }, [id]);

  const router = useRouter();
  const handleBack = () => {
    router.push("/billing");
  };

  const handleUpdateToPaid = async () => {
    try {
      setLoading(true);
      await updateBilling(id as string, { status: "paid" });
      setLoading(false);
      alert("Billing updated to paid");
      router.push("/billing");
    } catch (error) {
      setLoading(false);
      console.error("Request failed:", error);
      alert("Failed to update billing");
    }
  };

  const handleCancel = () => {
    try {
      setLoading(true);

      updateBilling(id as string, {
        status: "cancelled",
        deleted_at: new Date(),
      });
      alert("Billing cancelled");
      setLoading(false);
      router.push("/billing");
    } catch (error) {
      setLoading(false);
      console.error("Request failed:", error);
      alert("Failed to cancel billing");
    }
  };
  const refTemplate = useRef(null);

  const handleGeneratePdf = (billing_no: string) => {
    if (!refTemplate.current) {
      console.error("Template element is not found.");
      return;
    }

    const doc = new jsPDF({
      format: "a1",
      unit: "px",
    });
    doc.setFontSize(10);
    doc.setFont("Inter-Regular", "normal");
    doc.html(refTemplate.current, {
      async callback(doc) {
        await doc.save(billing_no + ".pdf");
      },
      x: 30,
      y: 30,
    });
  };

  const handleGenerateXlsx = () => {
    if (billing.data.length === 0) {
      console.error("No data to export.");
      return;
    }

    const headerBilling = [
      ["Billing No.", billing.data[0].billings.billing_no],
      ["Total Amount", formatMoney(billing.data[0].billings.amount)],
      [
        "Billing Created Date",
        new Date(billing.data[0].billings.created_at).toDateString(),
      ],
      [
        "Status",
        billing.data[0].billings.status
          .split("-")
          .map(
            (word: any) =>
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" "),
      ],
      ["Type", billing.data[0]?.billings?.type],
      ["Company Name", billing.data[0].billings.company_name],
      ["Period", billing.data[0].billings.transaction_period],
      [],
      [],
    ];

    const tableHeader = [
      [
        "Transaction Number",
        "Plan Name",
        "Insurance Company Name",
        "Amount",
        "Transaction Date",
        "Commission Percentage",
        "Commission Amount",
      ],
    ];
    const tableData = billing.data.map((item: any) => [
      item.invoice_no,
      item.details?.plan_name,
      item.details?.insurance_name,
      formatMoney(item.amount),
      item.details?.transaction_date,
      item.commission_percentage ?? 0,
      formatMoney(item.commission_amount ?? 0),
    ]);

    const sheetData = [...headerBilling, ...tableHeader, ...tableData];

    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    const headerRange = XLSX.utils.decode_range(`A1:B${headerBilling.length}`);
    for (let R = headerRange.s.r; R <= headerRange.e.r; ++R) {
      const cellAddress1 = XLSX.utils.encode_cell({ c: 0, r: R }); // First column
      const cellAddress2 = XLSX.utils.encode_cell({ c: 1, r: R }); // Second column

      if (ws[cellAddress1]) {
        ws[cellAddress1].s = {
          fill: {
            fgColor: { rgb: "FF0000" }, // Yellow background
          },
          font: {
            bold: true,
          },
        };
      }

      if (ws[cellAddress2]) {
        ws[cellAddress2].s = {
          fill: {
            fgColor: { rgb: "CCCCCC" }, // Light yellow background
          },
          font: {
            bold: false,
          },
        };
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Billing Detail");

    XLSX.writeFile(wb, "Billing Detail.xlsx");
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
    billing.data && (
      <div className="flex flex-col w-full">
        <div className="bg-white md:px-6 p-4 flex items-center">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink>Billing</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Billing Detail</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2 mt-2">
              Billing Detail
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
              onClick={() =>
                handleGeneratePdf(billing.data[0].billings.billing_no)
              }
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
        </div>

        <div className="pt-5 md:px-6 p-4 m-5 bg-white" ref={refTemplate}>
          <table className="w-full">
            <tr>
              <td className="pb-5 text-sm">
                <table width={500} cellPadding={3} className="table-header">
                  <tr>
                    <td className="pr-5" width={155}>
                      Billing No.
                    </td>
                    <td>:</td>
                    <td>{billing.data[0].billings.billing_no}</td>
                  </tr>
                  <tr>
                    <td className="pr-5">Total Amount</td>
                    <td>:</td>
                    <td>{formatMoney(billing.data[0].billings.amount)}</td>
                  </tr>
                  <tr>
                    <td className="pr-5">Billing Created Date</td>
                    <td>:</td>
                    <td>
                      {new Date(
                        billing.data[0].billings.created_at
                      ).toDateString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-5">Status</td>
                    <td>:</td>
                    <td>
                      {billing.data[0].billings.status
                        .split("-")
                        .map(
                          (word: any) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ")}
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-5">Type</td>
                    <td>:</td>
                    <td>{billing.data[0]?.billings?.type}</td>
                  </tr>
                  <tr>
                    <td className="pr-5">Company Name</td>
                    <td>:</td>
                    <td>{billing.data[0].billings.company_name}</td>
                  </tr>
                  <tr>
                    <td className="pr-5">Period</td>
                    <td>:</td>
                    <td>{billing.data[0].billings.transaction_period}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table style={styles.table}>
                  <tr>
                    <td style={styles.th}>Transaction Number</td>
                    <td style={styles.th}>Plan Name</td>
                    <td style={styles.th}>Insurance Company Name</td>
                    <td style={styles.th}>Amount</td>
                    <td style={styles.th}>Transaction Date</td>
                    <td style={styles.th}>Commision Percentage</td>
                    <td style={styles.th}>Commision Amount</td>
                  </tr>

                  {billing &&
                    billing.data?.map((data: any) => {
                      return (
                        <tr key={data.id}>
                          <td style={styles.td}>{data.invoice_no}</td>
                          <td style={styles.td}>
                            {data.details?.plan_name.split("|").join("\n")}
                          </td>
                          <td style={styles.td}>
                            {data.details?.insurance_name}
                          </td>
                          <td style={styles.td}>{formatMoney(data.amount)}</td>
                          <td style={styles.td}>
                            {data.details?.transaction_date}
                          </td>
                          <td style={styles.td}>
                            {data.commission_percentage ?? 0}
                          </td>
                          <td style={styles.td}>
                            {formatMoney(data.commission_amount ?? 0)}
                          </td>
                        </tr>
                      );
                    })}
                </table>
              </td>
            </tr>
          </table>
        </div>
      </div>
    )
  );
};

const DetailBillingWithSidebar = (params: any) =>
  WithSidebar(ExportDetailBillingPage)(params);
export default DetailBillingWithSidebar;
