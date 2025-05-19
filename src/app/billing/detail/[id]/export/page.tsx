"use client";
import WithSidebar from "@/hoc/with-sidebar";
import useRequireAuth from "@/hooks/useRequireAuth";
import { useEffect, useRef, useState } from "react";
import { useBilling } from "../../../hook";
import * as XLSX from "xlsx";
import { ChevronLeft, Download } from "lucide-react";
import { formatDate, formatMoney } from "@/lib/formatter";
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
import autoTable from "jspdf-autotable";
import moment from "moment";

const ExportDetailBillingPage = () => {
  useRequireAuth();

  const { getBillingById, billing, updateBilling } = useBilling();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const { setLoading } = useLoading();
  const [openCancel, setOpenCancel] = useState(false);
  const [openUpdateToPaid, setOpenUpdateToPaid] = useState(false);
  const [type, setType] = useState('');

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
    const searchParam = new URLSearchParams(window.location.search);
    let t = searchParam.get("type") ?? "";
    getBillingById(id as string, undefined, undefined);
    setType(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type]);

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


  const loadImageAsBase64 = (url: string): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("No 2D context");
        ctx.fillStyle = "#ffffff";//important to create white
        ctx.fillRect(0, 0, canvas.width, canvas.height);//important to create white
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/jpeg");
        resolve(dataURL);
      };
      img.onerror = reject;
      img.src = url;
    });

  const handleGeneratePdf = async (billing_no: string) => {
    if (!refTemplate.current) {
      console.error("Template element is not found.");
      return;
    }

    const doc = new jsPDF({
      format: "a4",
      unit: "px",
    });
    doc.setFontSize(10);
    doc.setFont("Inter-Regular", "normal");
    // doc.html(refTemplate.current, {
    //   async callback(doc) {
    //     await doc.save(billing_no + ".pdf");
    //   },
    //   x: 30,
    //   y: 30,
    // });  
    doc.text('Billing No.', 30, 30)
    doc.text(`: ${billing.data[0].billings.billing_no}`, 100, 30)

    doc.text(type == "insurer" ? 'Total Amount' : 'Total Net Premium', 30, 40) //x,y
    if (type == "insurer") {
      doc.text(`: ${billing.data[0].billings.currency} ${formatMoney(billing.data[0].billings.amount)}`, 100, 40)
    }
    else if (type == "partner") {
      doc.text(`: ${billing.data[0].billings.currency} ${formatMoney(billing.data[0].billings.total - billing.data[0].billings.amount)}`, 100, 40)
    }

    doc.text('Billing Created Date', 30, 50)
    doc.text(`: ${new Date(billing.data[0].billings.created_at).toDateString()}`, 100, 50)

    doc.text('Status', 30, 60)
    doc.text(`: ${billing.data[0].billings.status
      .split("-")
      .map(
        (word: any) =>
          word.charAt(0).toUpperCase() +
          word.slice(1).toLowerCase()
      )
      .join(" ")}`, 100, 60)

    doc.text('Type', 30, 70)
    doc.text(`: ${billing.data[0]?.billings?.type}`, 100, 70)

    doc.text('Company Name', 30, 80)
    doc.text(`: ${billing.data[0].billings.company_name}`, 100, 80)

    doc.text('Period', 30, 90)
    doc.text(`: ${billing.data[0].billings.transaction_period}`, 100, 90)

    const imageUrl = "https://friendsure-spaces.sgp1.digitaloceanspaces.com/teman.png";
    const image = await loadImageAsBase64(imageUrl);

    doc.addImage(image, 'JPEG', 310, 25, 110, 40); // x, y, width, height

    let head = [
      "Transaction Number",
      "Plan Name",
      "Insurance Company Name",
      "Transaction Date",
      "Currency",
      "Premium",
      "%",
      "Net Premium"];
    if (type == "insurer") {
      head = [
        "Transaction Number",
        "Plan Name",
        "Transaction Date",
        "Currency",
        "Amount",
        "%",
        "Commission Amount"];
    }
    autoTable(doc, {
      head: [head],
      body: billing.data.map((item: any, index: number) => {
        if (type == "partner") {
          return [
            item.invoice_no,
            item.details?.plan_name.split('|')[0],
            item.details?.insurance_name,
            item.details?.transaction_date,
            item.billings.currency,
            formatMoney(item.amount),
            (item.commission_percentage ?? 0) + "%",
            formatMoney(item.amount - (item.commission_amount ?? 0)),
          ]
        }
        else if (type == "insurer") {
          return [
            item.invoice_no,
            item.details?.plan_name.split('|')[0],
            item.details?.transaction_date,
            item.billings.currency,
            formatMoney(item.amount),
            (item.commission_percentage ?? 0) + "%",
            formatMoney(item.commission_amount ?? 0),
          ]
        }

      }),
      columnStyles: type == "partner" ? {
        5: { halign: 'right' },
        6: { halign: 'right' },
        7: { halign: 'right' },
      } : {
        4: { halign: 'right' },
        5: { halign: 'right' },
        6: { halign: 'right' },
      },
      startY: 120,
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
    doc.save(`${billing_no}_${formattedDate}.pdf`);
  };

  const handleGenerateXlsx = () => {
    if (billing.data.length === 0) {
      console.error("No data to export.");
      return;
    }

    const headerBilling = [
      ["Billing No.", billing.data[0].billings.billing_no],
      [type == "insurer" ? "Total Amount" : "Total Net Premium", billing.data[0].billings.currency + " " + formatMoney(type == "insurer" ? billing.data[0].billings.amount : (billing.data[0].billings.total - billing.data[0].billings.amount))],
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
        "Transaction Date",
        "Currency",
        "Premium",
        "%",
        "Net Premium"
      ],
    ];
    const tableData = billing.data.map((item: any) => [
      item.invoice_no,
      item.details?.plan_name.split('|')[0],
      item.details?.insurance_name,
      formatDate(item.details?.transaction_date, "YYYY-MM-DD"),
      item.billings.currency,
      formatMoney(item.amount),
      (item.commission_percentage ?? 0) + "%",
      formatMoney(item.amount - (item.commission_amount ?? 0)),
    ]);

    //insurer  
    const tableHeaderInsurer = [
      [
        "Transaction Number",
        "Plan Name",
        "Transaction Date",
        "Currency",
        "Amount",
        "%",
        "Commission Amount",
      ],
    ];
    const tableDataInsurer = billing.data.map((item: any) => [
      item.invoice_no,
      item.details?.plan_name.split('|')[0],
      item.details?.transaction_date,
      item.billings.currency,
      formatMoney(item.amount),
      (item.commission_percentage ?? 0) + "%",
      formatMoney(item.commission_amount ?? 0),
    ]);
    let sheetData = [];
    if (type == "partner") {
      sheetData = [...headerBilling, ...tableHeader, ...tableData];
    }
    else {
      sheetData = [...headerBilling, ...tableHeaderInsurer, ...tableDataInsurer];
    }

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
          <div className="w-full">
            <div className="flex gap-8 items-start pb-5 text-sm">
              <table cellPadding={3} className="table-header">
                <tr>
                  <td className="pr-5" width={155}>
                    Billing No.
                  </td>
                  <td>:</td>
                  <td>{billing.data[0].billings.billing_no}</td>
                </tr>
                <tr>
                  <td className="pr-5">{type == "insurer" ? "Total Amount" : "Total Net Premium"}</td>
                  <td>:</td>
                  {
                    type == "insurer" ?
                      <td>{billing.data[0].billings.currency} {formatMoney(billing.data[0].billings.amount)}</td>
                      :
                      <td>{billing.data[0].billings.currency} {formatMoney(billing.data[0].billings.total - billing.data[0].billings.amount)}</td>
                  }
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
              <div className={"ml-auto"}>
                <img width={180} src="https://friendsure-spaces.sgp1.digitaloceanspaces.com/teman.png" alt="PT.Teman PIalang Asuransi" />
              </div>
            </div>
            <table style={styles.table}>
              <tr>
                <td style={styles.th}>Transaction Number</td>
                <td style={styles.th}>Plan Name</td>
                {
                  type == "partner" ?
                    <td style={styles.th}>Insurance Company Name</td>
                    : ""
                }
                <td style={styles.th}>Transaction Date</td>
                <td style={styles.th}>Currency</td>
                <td style={{
                  padding: "10px",
                  border: "0.5px solid #cccccc",
                  fontWeight: "bold",
                  fontSize: "12px",
                  height: "auto",
                  background: "#e7e7e7",
                  verticalAlign: "middle",
                  textAlign: "right",
                }}>Premium</td>
                {
                  // type == "insurer" ?
                  <td style={{
                    padding: "10px",
                    border: "0.5px solid #cccccc",
                    fontWeight: "bold",
                    fontSize: "12px",
                    height: "auto",
                    background: "#e7e7e7",
                    verticalAlign: "middle",
                    textAlign: "right",
                  }}>%</td>
                  // : ""
                }
                {
                  type == "insurer" ?
                    <td style={{
                      padding: "10px",
                      border: "0.5px solid #cccccc",
                      fontWeight: "bold",
                      fontSize: "12px",
                      height: "auto",
                      background: "#e7e7e7",
                      verticalAlign: "middle",
                      textAlign: "right",
                    }}>Commision Amount</td> :
                    <td style={{
                      padding: "10px",
                      border: "0.5px solid #cccccc",
                      fontWeight: "bold",
                      fontSize: "12px",
                      height: "auto",
                      background: "#e7e7e7",
                      verticalAlign: "middle",
                      textAlign: "right",
                    }}>Net Premium</td>
                }
              </tr>

              {billing &&
                billing.data?.map((data: any) => {
                  return (
                    <tr key={data.id}>
                      <td style={styles.td}>{data.invoice_no}</td>
                      <td style={styles.td}>
                        {data.details?.plan_name.split('|')[0]}
                      </td>
                      {
                        type == "partner" ?
                          <td style={styles.td}>
                            {data.details?.insurance_name}
                          </td>
                          : ""
                      }
                      <td style={styles.td}>{formatDate(data.details?.transaction_date, "YYYY-MM-DD")}</td>
                      <td style={styles.td}>{data.billings.currency}</td>
                      <td style={{
                        padding: "10px",
                        height: "auto",
                        border: "0.5px solid #cccccc",
                        fontSize: "12px",
                        verticalAlign: "middle",
                        textAlign: "right",

                      }}>{formatMoney(data.amount)}</td>
                      {
                        // type == "insurer" ?
                        <td style={{
                          padding: "10px",
                          height: "auto",
                          border: "0.5px solid #cccccc",
                          fontSize: "12px",
                          verticalAlign: "middle",
                          textAlign: "right",
                        }}>
                          {data.commission_percentage ?? 0}%
                        </td>
                        // : ""
                      }
                      {
                        type == "insurer" ?
                          <td style={{
                            padding: "10px",
                            height: "auto",
                            border: "0.5px solid #cccccc",
                            fontSize: "12px",
                            verticalAlign: "middle",
                            textAlign: "right",
                          }}>
                            {formatMoney(data.commission_amount ?? 0)}
                          </td> :
                          <td style={{
                            padding: "10px",
                            height: "auto",
                            border: "0.5px solid #cccccc",
                            fontSize: "12px",
                            verticalAlign: "middle",
                            textAlign: "right",
                          }}>
                            {formatMoney(data.amount - (data.commission_amount ?? 0))}
                          </td>
                      }
                    </tr>
                  );
                })}
            </table>
          </div>
        </div>
      </div>
    )
  );
};

const DetailBillingWithSidebar = (params: any) =>
  WithSidebar(ExportDetailBillingPage)(params);
export default DetailBillingWithSidebar;
