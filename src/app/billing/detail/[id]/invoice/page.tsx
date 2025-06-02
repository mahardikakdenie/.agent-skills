"use client";
import { useEffect, useRef, useState } from "react";
import { useBilling } from "../../../hook";
import { formatMoney } from "@/lib/formatter";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HelperService } from "@/services/helper.service";
import { useLoading } from "@/context/loading.context";
import WithSidebar from "@/hoc/with-sidebar";
import { PDFService } from "@/services/pdf.service";

const InvoicePage = () => {
  const { getBillingById, billing } = useBilling();
  const { id } = useParams();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useLoading();
  const [type, setType] = useState('');

  useEffect(() => {
    const searchParam = new URLSearchParams(window.location.search);
    let t = searchParam.get("type") ?? "";
    if (type == "partner") {
      getBillingById(id as string, 1, 100, "");
    } else if (type == "insurer") {
      getBillingById(id as string, 1, 100, "product");
    }
    setType(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type]);

  useEffect(() => {
    if (type == "partner") {
      localStorage.setItem("billingPage", JSON.stringify({ type: type, company: billing.data[0].billings.company, category: billing.data[0].billings.category }));
    } else if (type == "insurer") {
      localStorage.setItem("billingPage", JSON.stringify({ type: type, company: billing.data[0].items[0].billings.company, category: billing.data[0].items[0].billings.category }));
    }
  }, [billing]);

  const handleDownloadPDF = async () => {
    const pdfService = new PDFService();
    if (!invoiceRef.current) return;
    const htmlContent = invoiceRef.current.innerHTML;
    setLoading(true);
    try {
      const response: any = await pdfService.htmlToPdf(
        htmlContent,
        type == "partner" ? billing.data[0].billings.billing_no : billing.data[0].items[0].billings.billing_no
      );
      window.open(response.file.url, "_blank");
    } catch (error) {
      alert("Failed to download PDF");
      console.error(error);
    }
    setLoading(false);
  };

  const getHeaderHtml = () => {
    let d = {
      billing_no: "",
      created_at: "",
      company_name: "",
      transaction_period: "",
      total: 0,
      total_commission: 0,
      status: ""
    };
    if (type == "insurer") {
      d = billing.data[0].items[0].billings ?? {};
    }
    else if (type == "partner") {
      d = billing.data[0].billings ?? {};
    }


    const status = d.status.split("-").map((word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")

    const headerHtml = `
    <div id="headerText" style="padding: 60px;">
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; color: #333;font-size:14px;">
        <table style="width: 100%; border-bottom: 1px solid #eee; padding-bottom: 20px; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: top;">
              <h1 style="font-size: 28px; font-weight: bold; color: #333; margin: 0 0 10px 0;">${type == "insurer" ? "INVOICE" : "BILLING TRANSACTION LIST"}</h1>
              <p style="color: #666; margin: 5px 0;">PT. Teman Pialang Asuransi</p>
              <p style="color: #777; margin: 5px 0;">Jakarta, Indonesia</p>
            </td>
            <td style="vertical-align: top; text-align: right;">
              <img src="https://friendsure-spaces.sgp1.digitaloceanspaces.com/teman.png" alt="PT.Teman Pialang Asuransi" style="height: 48px; margin-bottom: 16px;margin-left:auto;">
              <p style="color: #666; margin: 5px 0;">Invoice #${d.billing_no}</p>
              <p style="color: #777; margin: 5px 0;">Date: ${new Date(d.created_at).toLocaleDateString()}</p>
            </td>
          </tr>
        </table>

        <table style="width: 100%; margin-top: 10px; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: top; width: 50%;">
              <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Bill To:</h2>
              <p style="color: #666; margin: 5px 0;">${d.company_name}</p>
              <p style="color: #777; margin: 5px 0;">Period: ${d.transaction_period}</p>
            </td>
            <td style="vertical-align: top; width: 50%; text-align: right;">
              <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">${type == "partner" ? "Amount Due" : "Amount Due"}</h2>
              <p style="font-size: 24px; font-weight: bold; color: #333; margin: 5px 0;"> 
                ${type == "partner" ?
        (billing.data[0].billings.currency) + " " + formatMoney(d.total - d.total_commission)
        :
        (billing.data[0].items[0].billings.currency) + " " + formatMoney(d.total_commission)}
              </p>
              <p style="color: #777; margin: 5px 0;">Status: ${status}</p>
              <p style="color: #777; margin: 5px 0;">Total Transactions: ${getTotalTransaction()} </p>
            </td>
          </tr>
        </table> 
         `;
    return headerHtml;
  }


  const footerHtml = `
    <div style="margin-top: 0px; padding-top: 32px; border-top: 1px solid #eee;">
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

  const getTotalTransaction = () => {
    let totalTransaction = 0;
    if (type === "partner") {
      totalTransaction = billing.data.length;
    } else if (type === "insurer") {
      for (let i = 0; i < billing.data.length; i++) {
        const element = billing.data[i];
        totalTransaction += element.items.length;
      }
    }
    return totalTransaction;
  }

  const generateInvoiceHTMLPartner = () => {
    let datas: { [key: string]: any } = {};

    billing.data.forEach((item: any) => {
      const insuranceName = item.details.insurance_name;
      const productId = item.details.product_name; //item.product;

      if (!datas[insuranceName]) {
        datas[insuranceName] = {};
      }

      if (!datas[insuranceName][productId]) {
        datas[insuranceName][productId] = [];
      }

      datas[insuranceName][productId].push(item);
    });

    var html = getHeaderHtml();

    let insuranceKeyList = Object.keys(datas);
    let grandTotal = 0;
    for (let i = 0; i < insuranceKeyList.length; i++) {
      const insurKey = insuranceKeyList[i];  // Insurance Key 
      // console.log(insurKey)
      html += `<h3 style="font-weight: bold; margin-top:10px;">${insurKey}</h3>`;

      let productData = Object.keys(datas[insurKey]);
      for (let jx = 0; jx < productData.length; jx++) {
        const productKey = productData[jx];  // Product Key 
        // console.log(productKey)   
        html += `
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td><h4 style="font-weight: bold">${productKey}</h4></td>
            <td><div style="text-align: right;">Transaction: ${datas[insurKey][productKey].length}</div></td>
          </tr>
        </table>
        `;
        let subTotal = 0;
        let commission = 0;
        html += `  
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;margin-bottom: 20px; font-size: 14px;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #eee;width: 180px;">Transaction No.</th>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #eee;">Plan</th> 
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #eee;width: 150px;">Premium</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #eee;width: 20px;">%</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #eee;width: 150px;">Net Premium</th>
              </tr>
            </thead>
            <tbody>`;
        for (let k = 0; k < datas[insurKey][productKey].length; k++) {
          const d = datas[insurKey][productKey][k];
          subTotal += parseInt(d.amount) - parseInt(d.commission_amount ?? "0");
          commission += parseInt(d.amount);
          html += `<tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${d.invoice_no}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${d.details?.plan_name.split('|')[0]}</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">${formatMoney(d.amount)}</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">${d.commission_percentage ?? 0}%</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">${formatMoney(d.amount - (d.commission_amount ?? 0))}</td>
              </tr>`;
        }
        grandTotal += subTotal;

        html += ` 
      <tr style="font-weight: bold;">
        <td colspan="4" style="padding: 12px; text-align: right;">Total:</td>
        <td style="padding: 12px; text-align: right;">${formatMoney(
          subTotal
        )}</td>
      </tr> 
    </tbody>
  </table>`;
      }
    }

    html += `
      <div style="background-color: #f5f5f5;height: 20px;width: 100%;"></div>
      <table width="100%">  
          <tbody>
            <tr style="font-weight: bold;">
              <td colspan="2" style="padding: 12px; text-align: right; width: 100%">Grand Total:</td>
              <td style="padding: 12px; text-align: right;"> ${formatMoney(grandTotal)}</td>
            </tr>
          </tbody>
          </table>`;

    html += footerHtml;
    return html;
  };

  const generateInvoiceHTMLInsurer = () => {
    let datas = billing.data;
    var html = getHeaderHtml();

    for (let i = 0; i < datas.length; i++) {
      html += ` 
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td><h4 style="font-weight: bold">${datas[i].items[0].details.product_name}</h4></td>
          <td><div style="text-align: right;">Transaction: ${datas[i].items.length}</div></td>
        </tr>
      </table>`;

      let subTotal = 0;
      let subTotalCommision = 0;
      html += `  
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;margin-bottom: 20px; font-size: 14px;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #eee;width: 180px;">Transaction No.</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #eee;width: 180px;">Plan</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #eee;">Premium</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #eee;width: 20px;">%</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #eee;">Commission</th>
            </tr>
          </thead>
          <tbody>`;
      for (let j = 0; j < datas[i].items.length; j++) {
        const d = datas[i].items[j];
        subTotal += parseInt(d.amount);
        subTotalCommision += parseInt(d.commission_amount);
        html += ` 
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${d.invoice_no}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; ">${d.details?.plan_name.split('|')[0]}</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">${formatMoney(d.amount)}</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">${d.commission_percentage ?? 0}%</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">${formatMoney(d.commission_amount)}</td>
              </tr>
              `;

      }

      html += ` 
            <tr style="font-weight: bold;">
              <td colspan="4" style="padding: 12px; text-align: right;">Total:</td>
              <td style="padding: 12px; text-align: right;">${formatMoney(subTotalCommision)}</td>
            </tr> 
          </tbody>
        </table>`;
    }

    html += `
      <div style="background-color: #f5f5f5;height: 20px;width: 100%;"></div>
        <table width="100%">  
          <tbody>
            <tr style="font-weight: bold;">
              <td colspan="3" style="padding: 12px; text-align: right; width: 100%">Grand Total:</td>
              <td style="padding: 12px; text-align: right;"> ${formatMoney(billing.data[0].items[0].billings.amount)}</td>
            </tr>
          </tbody>
        </table>`;

    html += footerHtml;
    return html;
  };

  const handleBack = () => {
    window.history.back();
  };

  //RETURN if no get data
  if (!billing.data?.[0]) return null;

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
            onClick={() => handleDownloadPDF()}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
          >
            <Download className="w-5 h-5 mr-1 " /> Download PDF
          </Button>

        </div>

        <div
          className="bg-white shadow-md"
          style={{ fontSize: "14px" }}
          ref={invoiceRef}
          dangerouslySetInnerHTML={{
            __html:
              billing.data.length > 0 ?
                type == "partner" ?
                  generateInvoiceHTMLPartner()
                  : type == "insurer" ?
                    generateInvoiceHTMLInsurer()
                    : ""
                : ""
          }}
        />
      </div>
    </>
  );
};

const InvoicePageWithSidebar = (params: any) =>
  WithSidebar(InvoicePage)(params);
export default InvoicePageWithSidebar;
