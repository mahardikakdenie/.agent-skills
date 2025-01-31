"use client";
import { useEffect, useRef } from "react";
import { useBilling } from "../../../hook";
import { formatMoney } from "@/lib/formatter";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import { HelperService } from "@/services/helper.service";
import { useLoading } from "@/context/loading.context";
import WithSidebar from "@/hoc/with-sidebar";

const InvoicePage = () => {
  const { getBillingById, billing } = useBilling();
  const { id } = useParams();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useLoading();
  useEffect(() => {
    getBillingById(id as string, undefined, undefined);
  }, [id]);

  const handleDownloadPDF = async () => {
    const helperService = new HelperService();
    if (!invoiceRef.current) return;
    const htmlContent = invoiceRef.current.innerHTML;
    setLoading(true);
    try {
      const response: any = await helperService.htmlToPdf(
        htmlContent,
        billing.data[0].billings.billing_no
      );
      window.open(response.file.url, "_blank");
    } catch (error) {
      alert("Failed to download PDF");
      console.error(error);
    }
    setLoading(false);
  };

  if (!billing.data?.[0]) return null;

  const generateInvoiceHTML = () => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #333;">
        <div style="border-bottom: 1px solid #eee; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h1 style="font-size: 32px; font-weight: bold; color: #333; margin: 0 0 10px 0;">INVOICE</h1>
            <p style="color: #666; margin: 5px 0;">PT. Taawun Indonesia Sejahtera</p>
            <p style="color: #777; margin: 5px 0;">Jakarta, Indonesia</p>
          </div>
          <div style="text-align: right;">
            <img src="https://friendsure-spaces.sgp1.digitaloceanspaces.com/logo-tis.png" alt="Taawun" style="height: 48px; margin-bottom: 16px;" />
            <p style="color: #666; margin: 5px 0;">Invoice #${
              billing.data[0].billings.billing_no
            }</p>
            <p style="color: #777; margin: 5px 0;">Date: ${new Date(
              billing.data[0].billings.created_at
            ).toLocaleDateString()}</p>
          </div>
        </div>

        <div style="padding: 32px 0; display: flex; justify-content: space-between;">
          <div style="flex: 1;">
            <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Bill To:</h2>
            <p style="color: #666; margin: 5px 0;">${
              billing.data[0].billings.company_name
            }</p>
            <p style="color: #777; margin: 5px 0;">Period: ${
              billing.data[0].billings.transaction_period
            }</p>
          </div>
          <div style="flex: 1; text-align: right;">
            <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Amount Due:</h2>
            <p style="font-size: 24px; font-weight: bold; color: #333; margin: 5px 0;">${formatMoney(
              billing.data[0].billings.amount
            )}</p>
            <p style="color: #777; margin: 5px 0;">Status: ${
              billing.data[0].billings.status
            }</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 32px;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #eee;">Transaction No.</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #eee;">Plan</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #eee;">Insurance</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #eee;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${billing.data
              .map(
                (item: any) => `
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${
                  item.invoice_no
                }</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${
                  item.details?.plan_name
                }</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${
                  item.details?.insurance_name
                }</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">${formatMoney(
                  item.amount
                )}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr style="font-weight: bold;">
              <td colspan="3" style="padding: 12px; text-align: right;">Total:</td>
              <td style="padding: 12px; text-align: right;">${formatMoney(
                billing.data[0].billings.amount
              )}</td>
            </tr>
          </tfoot>
        </table>

        <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #eee;">
          <div style="color: #666;">
            <h3 style="font-weight: 600; margin-bottom: 8px;">Payment Details:</h3>
            <p style="margin: 5px 0;">Bank: Bank Central Asia (BCA)</p>
            <p style="margin: 5px 0;">Account Number: 123-456-789</p>
            <p style="margin: 5px 0;">Account Name: PT Friendsure Teknologi Indonesia</p>
          </div>
          <div style="margin-top: 16px; font-size: 14px; color: #777;">
            <p style="margin: 5px 0;">Please include invoice number in your payment reference</p>
            <p style="margin: 5px 0;">Payment is due within 30 days</p>
          </div>
        </div>
      </div>
    `;
  };

  const handleBack = () => {
    window.history.back();
  };
  return (
    <>
      <div className="p-4 w-full">
        <div className="print:hidden mb-4 flex justify-end gap-2">
          <div
            onClick={handleBack}
            className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </div>

          <Button
            onClick={handleDownloadPDF}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </Button>
        </div>

        <div
          className="bg-white shadow-md"
          ref={invoiceRef}
          dangerouslySetInnerHTML={{ __html: generateInvoiceHTML() }}
        />
      </div>
    </>
  );
};

const InvoicePageWithSidebar = (params: any) =>
  WithSidebar(InvoicePage)(params);
export default InvoicePageWithSidebar;
