'use client';

import { Download } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Button, Box, Spinner } from '@repo/ui';

import { useBilling } from '@/app/finance/billing/hook';
import { PageHeader } from '@/components/core/page-header';
import AppURL from '@/constants/app-url.const';
import { useScreen } from '@/context/screen.context';
import { useGeneratePdfService } from '@/services/helper/hooks/mutations';

export default function InvoicePage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useScreen();
  const { mutateAsync: generatePdfService } = useGeneratePdfService();

  const type = searchParams.get('type') || 'insurer';

  const { billing, isLoadingBilling, fetchBillingDetails } = useBilling({
    billingId: id as string,
  });

  const [invoiceHTML, setInvoiceHTML] = useState<string>('');

  useEffect(() => {
    if (id && type) {
      if (type === 'partner') {
        fetchBillingDetails(id as string, {
          page: 1,
          limit: 10000,
        });
      } else if (type === 'insurer') {
        fetchBillingDetails(id as string, {
          page: 1,
          limit: 10000,
          groupBy: 'product',
        });
      }
    }
  }, [id, type, fetchBillingDetails]);

  useEffect(() => {
    if (!billing?.data?.length) return;

    try {
      const html = generateInvoiceHTML();
      setInvoiceHTML(html);
      saveBillingToLocalStorage();
    } catch (error) {
      console.error('Error generating invoice HTML:', error);
    }
  }, [billing, type]);

  const saveBillingToLocalStorage = () => {
    if (!billing?.data?.[0]) return;

    if (type === 'partner') {
      const billingInfo = billing.data[0]?.billings;
      if (billingInfo) {
        localStorage.setItem(
          'billingPage',
          JSON.stringify({
            type: type,
            company: billingInfo.company,
            category: billingInfo.category,
          }),
        );
      }
    } else if (type === 'insurer') {
      const billingInfo = billing.data[0]?.items?.[0]?.billings;
      if (billingInfo) {
        localStorage.setItem(
          'billingPage',
          JSON.stringify({
            type: type,
            company: billingInfo.company,
            category: billingInfo.category,
          }),
        );
      }
    }
  };

  const generateInvoiceHTML = () => {
    if (type === 'partner') {
      return generateInvoiceHTMLPartner();
    } else if (type === 'insurer') {
      return generateInvoiceHTMLInsurer();
    }
    return '';
  };

  const getHeaderHtml = () => {
    let d: any = {
      billing_no: '',
      created_at: '',
      company_name: '',
      transaction_period: '',
      total: 0,
      total_commission: 0,
      status: '',
      currency: 'IDR',
    };

    if (type === 'insurer') {
      d = billing.data[0].items[0].billings ?? {};
    } else if (type === 'partner') {
      d = billing.data[0].billings ?? {};
    }

    const status = d.status
      .split('-')
      .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    const headerHtml = `
    <div id="headerText" style="padding: 60px;">
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; color: #333;font-size:14px;">
        <table style="width: 100%; border-bottom: 1px solid #eee; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: top;">
              <h1 style="font-size: 28px; font-weight: bold; color: #333; margin: 0 0 10px 0;">${
                type === 'insurer' ? 'INVOICE' : 'BILLING TRANSACTION LIST'
              }</h1>
              <p style="color: #666; margin: 5px 0;">PT. Teman Pialang Asuransi</p>
              <p style="color: #777; margin: 5px 0;">Jakarta, Indonesia</p>
            </td>
            <td style="vertical-align: top; text-align: right;">
              <img src="https://friendsure-spaces.sgp1.digitaloceanspaces.com/teman.png" alt="PT.Teman Pialang Asuransi" style="height: 48px; margin-bottom: 16px;margin-left:auto;">
              <p style="color: #666; margin: 5px 0;">Invoice #${d.billing_no}</p>
              <p style="color: #777; margin: 5px 0;">Date: ${new Date(
                d.created_at,
              ).toLocaleDateString()}</p>
            </td>
          </tr>
        </table>

        <table style="width: 100%; margin-top: 10px; padding: 0; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: top; width: 50%;">
              <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">Bill To:</div>
              <div style="color: #666; margin: 5px 0;">${d.company_name}</div>
              <div style="color: #777; margin: 5px 0;">Period: ${d.transaction_period}</div>
            </td>
            <td style="vertical-align: top; width: 50%; text-align: right;">
              <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">Amount Due</div>
              <div style="font-size: 24px; font-weight: bold; color: #333; margin: 5px 0;"> 
                ${
                  type === 'partner'
                    ? d.currency + ' ' + formatMoney(d.total - d.total_commission)
                    : d.currency + ' ' + formatMoney(d.total_commission)
                }
              </div>
              <div style="color: #777; margin: 5px 0;">Status: ${status}</div>
              <div style="color: #777; margin: 5px 0;">Total Transactions: ${getTotalTransaction()} </div>
            </td>
          </tr>
        </table>`;
    return headerHtml;
  };

  const footerHtml = `
    <div style="page-break-before: always;"></div>
    <div style="margin-top: 0px; padding-top: 16px; border-top: 1px solid #eee;">
        <div style="color: #666;">
          <p style="font-weight: bold; font-size:16px; margin-bottom: 8px;">Payment Details:</p>
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
    if (type === 'partner') {
      totalTransaction = billing.data.length;
    } else if (type === 'insurer') {
      for (let i = 0; i < billing.data.length; i++) {
        const element = billing.data[i];
        totalTransaction += element.items.length;
      }
    }
    return totalTransaction;
  };

  const generateInvoiceHTMLPartner = () => {
    let datas: { [key: string]: any } = {};

    billing.data.forEach((item: any) => {
      const insuranceName = item.details.insurance_name;
      const productId = item.details.product_name;

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
      const insurKey = insuranceKeyList[i];
      html += `<div style="font-weight: bold; font-size: 16px; margin-top:10px;">${insurKey}</div>`;

      let productData = Object.keys(datas[insurKey]);
      for (let jx = 0; jx < productData.length; jx++) {
        const productKey = productData[jx];
        html += `
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td><div style="font-weight: bold; font-size: 16px;">${productKey}</div></td>
            <td><div style="text-align: right;">Transaction: ${datas[insurKey][productKey].length}</div></td>
          </tr>
        </table>
        `;
        let subTotal = 0;

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
          subTotal += parseInt(d.amount) - parseInt(d.commission_amount ?? '0');

          html += `<tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${d.invoice_no}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${
                  d.details?.plan_name.split('|')[0]
                }</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">${formatMoney(
                  d.amount,
                )}</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">${
                  d.commission_percentage ?? 0
                }%</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">${formatMoney(
                  d.amount - (d.commission_amount ?? 0),
                )}</td>
              </tr>`;
        }
        grandTotal += subTotal;

        html += ` 
      <tr style="font-weight: bold;">
        <td colspan="4" style="padding: 12px; text-align: right;"><div>Total:</div></td>
        <td style="padding: 12px; text-align: right;"><div>${formatMoney(subTotal)}</div></td>
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
              <td colspan="2" style="padding: 12px; text-align: right; width: 100%"><div>Grand Total:</div></td>
              <td style="padding: 12px; text-align: right;"><div> ${formatMoney(
                grandTotal,
              )}</div></td>
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
      <table style="width: 100%; border-collapse: collapse;margin-top:10px;">
        <tr>
          <td><div style="font-weight: bold; font-size: 16px;">${datas[i].items[0].details.product_name}</div></td>
          <td><div style="text-align: right;">Transaction: ${datas[i].items.length}</div></td>
        </tr>
      </table>`;

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
        subTotalCommision += parseInt(d.commission_amount);
        html += ` 
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${d.invoice_no}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; ">${
                  d.details?.plan_name.split('|')[0]
                }</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">${formatMoney(
                  d.amount,
                )}</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">${
                  d.commission_percentage ?? 0
                }%</td>
                <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">${formatMoney(
                  d.commission_amount,
                )}</td>
              </tr>
              `;
      }

      html += ` 
            <tr style="font-weight: bold;">
              <td colspan="4" style="padding: 12px; text-align: right;"><div>Total:</div></td>
              <td style="padding: 12px; text-align: right;"><div>${formatMoney(
                subTotalCommision,
              )}</div></td>
            </tr> 
          </tbody>
        </table>`;
    }

    html += `
      <div style="background-color: #f5f5f5;height: 20px;width: 100%;"></div>
        <table width="100%">  
          <tbody>
            <tr style="font-weight: bold;">
              <td colspan="3" style="padding: 12px; text-align: right; width: 100%"><div>Grand Total:</div></td>
              <td style="padding: 12px; text-align: right;"><div> ${formatMoney(
                billing.data[0].items[0].billings.amount,
              )}</div></td>
            </tr>
          </tbody>
        </table>`;

    html += footerHtml;
    return html;
  };

  const formatMoney = (value: any) => {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    const htmlContent = invoiceRef.current.innerHTML;
    const billingNo =
      type === 'partner'
        ? billing.data[0].billings.billing_no
        : billing.data[0].items[0].billings.billing_no;

    setLoading(true);

    try {
      const response: any = await generatePdfService({
        content: htmlContent,
        filename: `policies/${billingNo}`,
      });
      const pdfUrl = response?.file?.url || response?.data?.file?.url;
      if (pdfUrl) {
        window.open(pdfUrl, '_blank');
      } else {
        alert('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Failed to download PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push(`${AppURL.financeBillingDetail}/${id}`);
  };

  if (isLoadingBilling) {
    return (
      <Box className="flex flex-col gap-2 justify-center items-center h-screen text-sm">
        <Spinner
          inline
          className="[&_[data-slot=spinner-icon]]:size-10 [&_[data-slot=spinner-icon]]:text-blue-500"
        />
        Loading invoice...
      </Box>
    );
  }

  const billingType = type === 'insurer' ? 'Billing' : 'Listing';

  return (
    <Box className="flex flex-col w-full min-h-screen bg-gray-50/50">
      <PageHeader
        title="Invoice"
        breadcrumbs={[
          { label: 'Billing', href: AppURL.financeBilling },
          {
            label: `${billingType} Detail`,
            href: `${AppURL.financeBillingDetail}/${id}`,
          },
          { label: 'Invoice', isCurrentPage: true },
        ]}
        showBackButton={true}
        onBackClick={handleBack}
      >
        <Button
          onClick={handleDownloadPDF}
          disabled={!invoiceHTML}
          className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] disabled:opacity-50"
          leftIcon={<Download className="w-5 h-5" />}
        >
          Download PDF
        </Button>
      </PageHeader>

      <Box className="max-w-4xl mx-auto w-full p-5">
        <Box
          className="bg-white shadow-md rounded-sm"
          style={{ fontSize: '14px' }}
          ref={invoiceRef}
          dangerouslySetInnerHTML={{ __html: invoiceHTML }}
        />
      </Box>
    </Box>
  );
}
