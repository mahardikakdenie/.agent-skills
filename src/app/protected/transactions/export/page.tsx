"use client";
import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";
import { ChevronLeft, Download } from "react-feather";
import { Button } from "@/components/ui/button";
import { TransactionService } from "@/services/transaction.service";
import { formatMoney } from "@/lib/formatter";
import Spinner from "@/components/ui/spinner";
import WithSidebar from "@/hoc/with-sidebar";
import { hasPermission } from "@/context/auth.context";

const ExportPage = () => {
  const dataService = new TransactionService();
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [isShowOrderId, setIsShowOrderId] = useState<boolean>(false);
  const [isShowCreatedAt, setIsShowCreatedAt] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      const withOrderId = await hasPermission("Transactions.Export.withOrderId");
      const withCreatedAt = await hasPermission("Transactions.Export.withCreatedAt");

      setIsShowOrderId(withOrderId);
      setIsShowCreatedAt(withCreatedAt);

      await fetchData();
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const savedData = localStorage.getItem("exportTransactionData");
        if (!savedData) return;

        const parsedData = JSON.parse(savedData);

        const params = {
          page: 1,
          limit: 150,
          type: parsedData.type,
          ...(parsedData.search && { keyword: parsedData.search }),
          ...(parsedData.status &&
            parsedData.status !== "All" && { status: parsedData.status }),
        };

        const res = await dataService.getTransactionsExport(params);

        setData(res.data.filter((item: any) => item.status !== "Draft"));
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
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
        await doc.save("Transactions.pdf");
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

    const sheetData = data.map((item, index) => {
      const currencies = item?.insurance?.insurance?.currencies;
      const currency = currencies?.find(
        (currency: any) =>
          currency.currency_from === item.insurance.currency &&
          currency.currency_to === "IDR"
      );

      const convertedPremium = (currency?.value ?? 1) * item.insurance.premium;

      const premiumWithEmbeddedDiscount =
        item.insurance?.plan?.premium_discount_type === "percentage"
          ? convertedPremium -
            (item.insurance?.plan?.premium_discount_value || 0 / 100) *
              convertedPremium
          : convertedPremium -
            (item.insurance?.plan?.premium_discount_value || 0);

      let premiumWithVoucherDiscount = premiumWithEmbeddedDiscount;
      if (item.voucher_info) {
        premiumWithVoucherDiscount =
          item.voucher_info?.data.value_type === "percentage"
            ? premiumWithEmbeddedDiscount -
              (item.voucher_info?.data.value || 0 / 100) *
                premiumWithEmbeddedDiscount
            : premiumWithEmbeddedDiscount -
              (item.voucher_info?.data.value || 0);
      }

      let totalPremium = premiumWithVoucherDiscount;

      if (item.fees) {
        totalPremium =
          premiumWithVoucherDiscount +
          item.fees
            .map((v: any) => v.value)
            .reduce((a: any, b: any) => a + b, 0);
      }

      let additionColumn = {};
      if (isShowOrderId) {
        additionColumn = {
          ...additionColumn, 
          "Order Id": item.id,
        }
      }
      if (isShowCreatedAt) {
        additionColumn = {
          ...additionColumn, 
          "Created At": item.created_at,
        }
      }

      return {
        No: (page - 1) * rowsPerPage + index + 1,
        "Insurance Name": item.insurance?.insurance?.id?.name || "-",
        "Plan Name": item.insurance?.plan?.name
          .split("|")
          .splice(0, 2)
          .join(" - "),
        "Customer Name": item.customer.name || "-",
        Currency: item?.insurance.currency || "-",
        Amount: formatMoney(totalPremium, "IDR"),
        Status: item.status || "-",
        ...additionColumn
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    XLSX.writeFile(workbook, "Transactions.xlsx");
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
        <h1 className="text-black font-bold text-2xl mt-2">Transactions</h1>
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
          <table style={styles.table} ref={reportTemplateRef}>
            <thead>
              <tr>
                <td style={styles.th} valign="middle">No.</td>
                <td style={styles.th} valign="middle">Insurance Name</td>
                <td style={styles.th} valign="middle">Plan Name</td>
                <td style={styles.th} valign="middle">Customer Name</td>
                <td style={styles.th} valign="middle">Currency</td>
                <td style={styles.th} valign="middle">Amount</td>
                <td style={styles.th} valign="middle">Status</td>
                {isShowOrderId && <td style={styles.th} valign="middle">Order Id</td>}
                {isShowCreatedAt && <td style={styles.th} valign="middle">Created At</td>}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const rowNumber = (page - 1) * rowsPerPage + index + 1;

                const currencies = item?.insurance?.insurance?.currencies || [];
                const currency =
                  currencies.find(
                    (currency: any) =>
                      currency.currency_from === item.insurance.currency &&
                      currency.currency_to === "IDR"
                  ) || 0;

                const convertedPremium =
                  (currency?.value ?? 1) * item.insurance.premium;

                const premiumWithEmbeddedDiscount =
                  item?.insurance?.plan?.premium_discount_type === "percentage"
                    ? convertedPremium -
                      ((item?.insurance?.plan?.premium_discount_value || 0) /
                        100) *
                        convertedPremium
                    : convertedPremium -
                      (item?.insurance?.plan?.premium_discount_value || 0);

                let premiumWithVoucherDiscount = premiumWithEmbeddedDiscount;
                if (item.voucher_info) {
                  premiumWithVoucherDiscount =
                    item.voucher_info?.data.value_type === "percentage"
                      ? premiumWithEmbeddedDiscount -
                        (item.voucher_info?.data.value || 0 / 100) *
                          premiumWithEmbeddedDiscount
                      : premiumWithEmbeddedDiscount -
                        (item.voucher_info?.data.value || 0);
                }

                let totalPremium = premiumWithVoucherDiscount;

                if (item.fees) {
                  totalPremium =
                    premiumWithVoucherDiscount +
                    item.fees
                      .map((v: any) => v.value)
                      .reduce((a: any, b: any) => {
                        return a + b;
                      }, 0);
                }

                return (
                  <tr key={item.id}>
                    <td style={styles.td} valign="middle">{rowNumber}</td>
                    <td style={styles.td} valign="middle">{item?.insurance?.insurance?.id?.name || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.insurance?.plan?.name.split("|").splice(0, 2).join(" - ") || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.customer?.name || "-"}</td>
                    <td style={styles.td} valign="middle">{item?.insurance?.currency || "-"}</td>
                    <td style={styles.td} valign="middle">{formatMoney(totalPremium, "IDR")}</td>
                    <td style={styles.td} valign="middle">{item?.status || "-"}</td>
                    {isShowOrderId && <td style={styles.td} valign="middle">{item?.id || "-"}</td>}
                    {isShowCreatedAt && <td style={styles.td} valign="middle">{item?.created_at || "-"}</td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const ExportWithSidebar = (params: any) => WithSidebar(ExportPage)(params);
export default ExportWithSidebar;
