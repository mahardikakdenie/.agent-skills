"use client";

import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  FunnelChart,
  LabelList,
  Funnel,
} from "recharts";
import {
  Mail,
  Eye,
  MousePointer,
  UserMinus,
  AlertTriangle,
  Download,
  Upload,
  Target,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { PromotionService } from "@/services/promotion.service";
import { TransactionService } from "@/services/transaction.service";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toastNotification } from "@/lib/toast";
import { BiMoney } from "react-icons/bi";

const CampaignAnalyticsPage = () => {
  const [totalTransaction, setTotalTransaction] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalPurchased, setTotalPurchased] = useState(0);
  const [campaignSummary, setCampaignSummary] = useState<any>({});
  const [campaignData, setCampaignData] = useState<any[]>([]);
  const [clickLinks, setClickLinks] = useState<
    { url: string; count: number }[]
  >([]);
  const [timeData, setTimeData] = useState<any[]>([]);
  const [openClickTrend, setOpenClickTrend] = useState<any[]>([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const reportTemplateRef = useRef<HTMLDivElement>(null);

  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [campaignList, setCampaignList] = useState([]);

  const promotionService = new PromotionService();
  const transactionService = new TransactionService();

  useEffect(() => {
    const fetchCampaignList = async () => {
      try {
        const res: any = await promotionService.getPromotionCampaign(
          1,
          1000,
          ""
        );
        setCampaignList(
          res.data.map((c: any) => {
            return { id: c.campaign_id, name: c.name };
          })
        );
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchCampaignList().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewAnalytics = async () => {
    try {
      const res: any = await transactionService.getCampaignsReport(
        selectedCampaign
      );
      if (res?.report?.data) {
        setTotalTransaction(res.transaction_total);
        setTotalLeads(
          Number(res.report.data.campaignSummary.delivered) +
            Number(res.report.data.campaignSummary.hard_bounces) +
            Number(res.report.data.campaignSummary.soft_bounces)
        );
        setTotalPurchased(res.purchased);
        setCampaignSummary(res.report.data.campaignSummary);
        setCampaignData(res.report.data.campaignData);
        setClickLinks(res.report.data.clickLinks);
        setTimeData(res.report.data.timeData);
        setOpenClickTrend(res.report.data.openClickTrend);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = new Uint8Array(await file.arrayBuffer());
    const workbook = XLSX.read(data, { type: "array" });

    const getSheet = (name: string) => {
      try {
        return XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1 });
      } catch {
        return [];
      }
    };

    const reportSummary: any = getSheet("ReportSummary");
    const delivery: any = getSheet("Campaign Delivery");
    const opens: any = getSheet("Opens");
    const clicks: any = getSheet("Clicks");
    const hardBounces: any = getSheet("Hard Bounces");
    const softBounces: any = getSheet("Soft Bounces");
    const unsubscribes: any = getSheet("Unsubscribes");
    const complaints: any = getSheet("Complaints");

    // summary sheet
    const summary: any = {};
    if (reportSummary.length > 1) {
      reportSummary.forEach((row: any) => {
        summary[`${row[0].toLowerCase().trim().replace(/\s+/g, "_")}`] = row[1];
      });
    }

    // map email → record
    const dataMap: Record<string, any> = {};

    // all email: delivered + hard bounces + soft bounces
    // delivery sheet
    if (delivery.length > 1) {
      delivery.slice(1).forEach((row: any) => {
        const email = row[0];
        if (!email) return;
        dataMap[email] = {
          email,
          firstName: row[1] || "",
          lastName: row[2] || "",
          deliveryTime: row[3] || "",
          openCount: 0,
          clickCount: 0,
          unsubscribes: 0,
          spam: 0,
          bounce: 0,
          status: "unopened",
        };
      });
    }
    if (hardBounces.length > 1) {
      hardBounces.slice(1).forEach((row: any) => {
        const email = row[0];
        if (!email) return;
        dataMap[email] = {
          email,
          firstName: row[1] || "",
          lastName: row[2] || "",
          deliveryTime: row[3] || "",
          openCount: 0,
          clickCount: 0,
          unsubscribes: 0,
          spam: 0,
          bounce: 0,
          status: "unopened",
        };
      });
    }
    if (softBounces.length > 1) {
      softBounces.slice(1).forEach((row: any) => {
        const email = row[0];
        if (!email) return;
        dataMap[email] = {
          email,
          firstName: row[1] || "",
          lastName: row[2] || "",
          deliveryTime: row[3] || "",
          openCount: 0,
          clickCount: 0,
          unsubscribes: 0,
          spam: 0,
          bounce: 0,
          status: "unopened",
        };
      });
    }

    // opens
    const openTimes: string[] = [];
    if (opens.length > 1) {
      opens.slice(1).forEach((row: any) => {
        const email = row[0];
        if (dataMap[email]) {
          dataMap[email].openCount += 1;
          if (row[3]) openTimes.push(row[3]);
        }
      });
    }

    // clicks
    const urlMap: Record<string, number> = {};
    const clickTimes: string[] = [];
    if (clicks.length > 1) {
      clicks.slice(1).forEach((row: any) => {
        const email = row[0];
        const url = row[3];
        if (dataMap[email]) {
          dataMap[email].clickCount += 1;
          if (url) urlMap[url] = (urlMap[url] || 0) + 1;
          if (row[4]) clickTimes.push(row[4]);
        }
      });
    }

    // bounces
    if (hardBounces.length > 1) {
      hardBounces.slice(1).forEach((row: any) => {
        const email = row[0];
        if (dataMap[email]) {
          dataMap[email].bounce = 1;
        }
      });
    }
    if (softBounces.length > 1) {
      softBounces.slice(1).forEach((row: any) => {
        const email = row[0];
        if (dataMap[email]) {
          dataMap[email].bounce = 1;
        }
      });
    }

    // unsubscribes
    if (unsubscribes.length > 1) {
      unsubscribes.slice(1).forEach((row: any) => {
        const email = row[0];
        if (dataMap[email]) {
          dataMap[email].unsubscribes = 1;
        }
      });
    }

    // complaints/spam
    if (complaints.length > 1) {
      complaints.slice(1).forEach((row: any) => {
        const email = row[0];
        if (dataMap[email]) {
          dataMap[email].spam = 1;
        }
      });
    }

    // set status
    Object.values(dataMap).forEach((rec: any) => {
      if (rec.bounce > 0) rec.status = "bounced";
      else if (rec.unsubscribes > 0) rec.status = "unsubscribed";
      else if (rec.spam > 0) rec.status = "spam";
      else if (rec.clickCount > 0) rec.status = "engaged";
      else if (rec.openCount > 0) rec.status = "opened";
      else rec.status = "unopened";
    });

    // build time series
    const timeBuckets: Record<string, { opens: number; clicks: number }> = {};
    openTimes.forEach((t) => {
      const hour = new Date(t).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      if (!timeBuckets[hour]) timeBuckets[hour] = { opens: 0, clicks: 0 };
      timeBuckets[hour].opens += 1;
    });
    clickTimes.forEach((t) => {
      const hour = new Date(t).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      if (!timeBuckets[hour]) timeBuckets[hour] = { opens: 0, clicks: 0 };
      timeBuckets[hour].clicks += 1;
    });

    // build open & click trend
    const trendMap: Record<
      string,
      { date: string; opens: number; clicks: number }
    > = {};
    openTimes.forEach((t) => {
      const d = new Date(t);
      const key = d.toISOString().split("T")[0];
      if (!trendMap[key]) trendMap[key] = { date: key, opens: 0, clicks: 0 };
      trendMap[key].opens += 1;
    });
    clickTimes.forEach((t) => {
      const d = new Date(t);
      const key = d.toISOString().split("T")[0];
      if (!trendMap[key]) trendMap[key] = { date: key, opens: 0, clicks: 0 };
      trendMap[key].clicks += 1;
    });
    const trendData = Object.values(trendMap).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    try {
      const data = {
        campaignSummary: summary,
        campaignData: Object.values(dataMap),
        clickLinks: Object.entries(urlMap).map(([url, count]) => ({
          url,
          count,
        })),
        timeData: Object.entries(timeBuckets).map(([time, v]) => ({
          time,
          ...v,
        })),
        openClickTrend: trendData,
      };
      await transactionService.putCampaignsReport(selectedCampaign, { data });
      toastNotification("Update campaign report successfully!", "success");
    } catch (error) {
      console.error("Error fetching data: ", error);
      toastNotification("Update campaign report failed!", "error");
    }
  };

  // metrics
  const totalSent = campaignData.filter((i) => i.bounce === 0).length;
  const totalOpens = campaignData.reduce((sum, i) => sum + i.openCount, 0);
  const totalClicks = campaignData.reduce((sum, i) => sum + i.clickCount, 0);
  const totalBounces = campaignData.filter((i) => i.bounce > 0).length;
  const totalUnsubscribes = campaignData.filter(
    (i) => i.unsubscribes > 0
  ).length;
  const totalSpam = campaignData.filter((i) => i.spam > 0).length;
  const uniqueOpens = campaignData.filter((i) => i.openCount > 0).length;
  const uniqueClicks = campaignData.filter((i) => i.clickCount > 0).length;

  const openRate = totalSent
    ? (((uniqueOpens + uniqueClicks) / totalSent) * 100).toFixed(1)
    : "0";
  const clickRate = totalSent
    ? ((uniqueClicks / totalSent) * 100).toFixed(1)
    : "0";
  const bounceRate = totalSent
    ? ((totalBounces / totalSent) * 100).toFixed(1)
    : "0";
  const contactRate = totalSent
    ? ((totalSent / totalLeads) * 100).toFixed(1)
    : "0";
  const purchaseRate = totalClicks
    ? ((totalPurchased / totalClicks) * 100).toFixed(1)
    : "0";
  const conversionRate = totalLeads
    ? ((totalPurchased / totalLeads) * 100).toFixed(1)
    : "0";

  const statusData = [
    {
      name: "Engaged",
      value: campaignData.filter((i) => i.status === "engaged").length,
      color: "#10B981",
    },
    {
      name: "Opened",
      value: campaignData.filter((i) => i.status === "opened").length,
      color: "#3B82F6",
    },
    {
      name: "Unopened",
      value: campaignData.filter((i) => i.status === "unopened").length,
      color: "#6B7280",
    },
    {
      name: "Bounced",
      value: campaignData.filter((i) => i.status === "bounced").length,
      color: "#EF4444",
    },
    // { name: "Unsubscribed", value: campaignData.filter(i => i.status === "unsubscribed").length, color: "#F59E0B" },
    // { name: "Spam", value: campaignData.filter(i => i.status === "spam").length, color: "#8B5CF6" }
  ];

  const engagementData = [
    { name: "Opens", value: totalOpens, color: "#10B981" },
    { name: "Clicks", value: totalClicks, color: "#3B82F6" },
    // { name: "Bounces", value: totalBounces, color: "#EF4444" },
    // { name: "Unsubscribes", value: totalUnsubscribes, color: "#F59E0B" },
    // { name: "Spam", value: totalSpam, color: "#8B5CF6" }
  ];

  const funnelData = [
    { name: "Total Leads", value: totalLeads, color: "#6B7280" },
    { name: "Total Contacted", value: totalSent, color: "#3B82F6" },
    { name: "Total Clicked", value: totalClicks, color: "#8B5CF6" },
    {
      name: "Total Purchased with voucher",
      value: totalPurchased,
      color: "#10B981",
    },
  ];

  const topPerformers = campaignData
    .filter((i) => i.openCount > 0 || i.clickCount > 0)
    .sort(
      (a, b) =>
        b.openCount + b.clickCount * 2 - (a.openCount + a.clickCount * 2)
    )
    .slice(0, 5);

  const handleGeneratePdf = async () => {
    if (!reportTemplateRef.current) {
      console.error("Template element is not found.");
      return;
    }

    setIsGeneratingPdf(true);

    try {
      const canvas = await html2canvas(reportTemplateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 280;
      const pageHeight = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("CampaignReport.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex flex-wrap justify-start pb-4 items-center">
        <h1 className="text-black font-bold text-2xl mt-2 sm:w-auto w-full">
          Campaign Analytics
        </h1>
        <div className="flex space-x-4 ml-auto">
          <Button
            disabled={isGeneratingPdf || campaignData.length < 1}
            onClick={handleGeneratePdf}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full text-xs"
          >
            <Download className="w-5 h-5 mr-1 " />{" "}
            {isGeneratingPdf ? "Generating PDF..." : "Download PDF"}
          </Button>
        </div>
      </div>

      <div className="flex bg-white rounded-xl gap-4 mb-3 p-6">
        <div className="flex w-full flex-col">
          <div className="text-xs mb-1.5 font-medium whitespace-nowrap">
            Campaign
          </div>
          <div className="relative mb-1.5">
            <div className="min-w-48">
              <Select
                value={selectedCampaign}
                onValueChange={(value) => setSelectedCampaign(value)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select Campaign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {campaignList.map((item: any, index: number) => (
                      <SelectItem key={index} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="pt-4 flex w-[40%] flex-col items-center justify-center">
          <div className="flex items-center justify-between">
            <Button
              disabled={!selectedCampaign}
              onClick={handleViewAnalytics}
              className="bg-[#016DA1] text-white hover:bg-[#2d9ae6] rounded-full text-xs"
            >
              View Analytics
            </Button>
            <label
              htmlFor="excel-upload"
              className={`ml-3 px-4 py-3 flex items-center gap-2 bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full text-xs ${
                selectedCampaign
                  ? "cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <Upload size={18} />
              Update Campaign
              <input
                disabled={!selectedCampaign}
                id="excel-upload"
                type="file"
                accept=".xls,.xlsx"
                onChange={handleExcelUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <div>
        {campaignData.length > 0 && (
          <div ref={reportTemplateRef} className="bg-white p-6 rounded-lg mb-5">
            <div className="mb-5">
              <h1 className="text-center text-2xl font-bold">
                Travel Annual Plan Campaign
              </h1>

              {/*TODO: notes: temporary static*/}
              <h1 className="hidden text-center text-2xl font-bold">
                {campaignSummary.campaign_name}
              </h1>
              <p className="hidden text-center text-base font-semibold">
                {campaignSummary.subject}
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <p className="text-sm text-gray-600">Contact Rate</p>
                <p className="text-3xl font-bold">{contactRate}%</p>
                <Mail className="h-8 w-8 text-blue-500" />
              </div>

              {/*TODO: notes: temporary hidden*/}
              <div className="hidden bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                <p className="text-sm text-gray-600">Total Transaction</p>
                <p className="text-3xl font-bold">{totalTransaction}</p>
                <BiMoney className="h-8 w-8 text-orange-500" />
              </div>
              <div className="hidden bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <p className="text-sm text-gray-600">Total Sent</p>
                <p className="text-3xl font-bold">{totalSent}</p>
                <Mail className="h-8 w-8 text-blue-500" />
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <p className="text-sm text-gray-600">Open Rate</p>
                <p className="text-3xl font-bold">{openRate}%</p>
                <Eye className="h-8 w-8 text-green-500" />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <p className="text-sm text-gray-600">Click Rate</p>
                <p className="text-3xl font-bold">{clickRate}%</p>
                <MousePointer className="h-8 w-8 text-purple-500" />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                <p className="text-sm text-gray-600">Purchase Rate</p>
                <p className="text-3xl font-bold">{purchaseRate}%</p>
                <BiMoney className="h-8 w-8 text-orange-500" />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#10B981]">
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold">{conversionRate}%</p>
                <Target className="h-8 w-8 text-[#10B981]" />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                <p className="text-sm text-gray-600">Bounce Rate</p>
                <p className="text-3xl font-bold">{bounceRate}%</p>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Campaign Status Pie */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  📊 Campaign Status
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      dataKey="value"
                    >
                      {statusData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {statusData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      {item.name}: {item.value}
                    </div>
                  ))}
                </div>
              </div>

              {/* Engagement Bar */}
              {/*TODO: notes: temporary hidden*/}
              <div className="hidden bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">📈 Engagement</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={engagementData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {engagementData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {engagementData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      {item.name}: {item.value}
                    </div>
                  ))}
                </div>
              </div>

              {/* Funnel Bar */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">📈 Funnel</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <FunnelChart>
                    <Tooltip />
                    <Funnel dataKey="value" data={funnelData} isAnimationActive>
                      {funnelData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                      <LabelList
                        position="right"
                        fill="#111827"
                        stroke="none"
                        dataKey="name"
                      />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Over Time */}
            {/*TODO: notes: temporary hidden*/}
            <div className="hidden bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">
                ⏱️ Performance Over Time
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="opens"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="flex items-center gap-6 justify-center mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: "#3B82F6" }}
                  ></div>
                  Opens
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: "#10B981" }}
                  ></div>
                  Clicks
                </div>
              </div>
            </div>

            {/* Opens vs Clicks Trend */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">
                📅 Opens & Clicks Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={openClickTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="opens"
                    stroke="#3B82F6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#10B981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Top Performers */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">🏆 Top Performers</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Contact</th>
                    <th className="text-center py-2">Opens</th>
                    <th className="text-center py-2">Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {topPerformers.map((c, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2">
                        <p className="font-medium">
                          {c.firstName} {c.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{c.email}</p>
                      </td>
                      <td className="text-center">{c.openCount}</td>
                      <td className="text-center">{c.clickCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Issues & Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
              <h3 className="text-xl font-semibold mb-4">
                ⚠️ Issues & Actions
              </h3>
              <div className="space-y-4">
                {totalBounces > 0 && (
                  <div className="flex items-start p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">
                        Bounces ({totalBounces})
                      </p>
                      <p className="text-sm text-red-700">
                        Remove bounced emails from future campaigns
                      </p>
                    </div>
                  </div>
                )}
                {totalUnsubscribes > 0 && (
                  <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
                    <UserMinus className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">
                        Unsubscribes ({totalUnsubscribes})
                      </p>
                      <p className="text-sm text-yellow-700">
                        Update subscriber preferences
                      </p>
                    </div>
                  </div>
                )}
                {totalSpam > 0 && (
                  <div className="flex items-start p-3 bg-purple-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-purple-900">
                        Spam Reports ({totalSpam})
                      </p>
                      <p className="text-sm text-purple-700">
                        Review content and sender reputation
                      </p>
                    </div>
                  </div>
                )}
                {campaignData.filter((i) => i.status === "unopened").length >
                  0 && (
                  <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Unopened (
                        {
                          campaignData.filter((i) => i.status === "unopened")
                            .length
                        }
                        )
                      </p>
                      <p className="text-sm text-gray-700">
                        Consider follow-up campaign or subject line optimization
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Campaign Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
              <h3 className="text-xl font-semibold mb-4">
                📋 Campaign Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2">
                    🎯 Performance Highlights
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Open rate {openRate}%</li>
                    <li>• Click rate {clickRate}%</li>
                    <li>
                      • {totalOpens} total opens from {uniqueOpens} recipients
                    </li>
                    <li>
                      • {totalClicks} total clicks from {uniqueClicks}{" "}
                      recipients
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">📊 Key Metrics</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Bounce rate: {bounceRate}%</li>

                    {/*TODO: notes: temporary hidden*/}
                    <li className="hidden">
                      • Unsubscribe rate:{" "}
                      {((totalUnsubscribes / totalSent) * 100).toFixed(1)}%
                    </li>
                    <li className="hidden">
                      • Spam complaint rate:{" "}
                      {((totalSpam / totalSent) * 100).toFixed(1)}%
                    </li>

                    <li>
                      • Delivery rate:{" "}
                      {(((totalSent - totalBounces) / totalSent) * 100).toFixed(
                        1
                      )}
                      %
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">🔗 Click Details</h4>
                  {clickLinks.length > 0 ? (
                    <div className="text-sm">
                      <p className="mb-1">Top clicked link:</p>
                      <p className="bg-blue-50 p-2 rounded text-xs break-all">
                        {clickLinks[0].url}
                      </p>
                      <p>{clickLinks[0].count} unique clicks</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No clicks recorded</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignAnalyticsPage;
