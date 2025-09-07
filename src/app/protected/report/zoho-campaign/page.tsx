"use client";

import React, { useRef, useState } from "react";
import WithSidebar from "@/hoc/with-sidebar";
import * as XLSX from "xlsx";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Mail, Eye, MousePointer, UserMinus, AlertTriangle, Download, Upload } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ReportZohoCampaignPage = () => {
  const [campaignData, setCampaignData] = useState<any[]>([]);
  const [clickLinks, setClickLinks] = useState<{ url: string; count: number }[]>([]);
  const [timeData, setTimeData] = useState<any[]>([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const reportTemplateRef = useRef<HTMLDivElement>(null);

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

    const delivery: any = getSheet("Campaign Delivery");
    const opens: any = getSheet("Opens");
    const clicks: any = getSheet("Clicks");
    const hardBounces: any = getSheet("Hard Bounces");
    const unsubscribes: any = getSheet("Unsubscribes");
    const complaints: any = getSheet("Complaints");

    // map email → record
    const dataMap: Record<string, any> = {};

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
          status: "unopened"
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
          if (row[3]) openTimes.push(row[3]); // kolom "Open Time"
        }
      });
    }

    // clicks
    if (clicks.length > 1) {
      clicks.slice(1).forEach((row: any) => {
        const email = row[0];
        if (dataMap[email]) {
          dataMap[email].clickCount += 1;
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
          if (row[4]) clickTimes.push(row[4]); // kolom "Click Time"
        }
      });
    }
    setClickLinks(Object.entries(urlMap).map(([url, count]) => ({ url, count })));

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

    setCampaignData(Object.values(dataMap));

    // build time series
    const timeBuckets: Record<string, { opens: number; clicks: number }> = {};
    openTimes.forEach((t) => {
      const hour = new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      if (!timeBuckets[hour]) timeBuckets[hour] = { opens: 0, clicks: 0 };
      timeBuckets[hour].opens += 1;
    });
    clickTimes.forEach((t) => {
      const hour = new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      if (!timeBuckets[hour]) timeBuckets[hour] = { opens: 0, clicks: 0 };
      timeBuckets[hour].clicks += 1;
    });
    setTimeData(Object.entries(timeBuckets).map(([time, v]) => ({ time, ...v })));
  };

  // metrics
  const totalSent = campaignData.length;
  const totalOpens = campaignData.reduce((sum, i) => sum + i.openCount, 0);
  const totalClicks = campaignData.reduce((sum, i) => sum + i.clickCount, 0);
  const totalBounces = campaignData.filter(i => i.bounce > 0).length;
  const totalUnsubscribes = campaignData.filter(i => i.unsubscribes > 0).length;
  const totalSpam = campaignData.filter(i => i.spam > 0).length;
  const uniqueOpens = campaignData.filter(i => i.openCount > 0).length;
  const uniqueClicks = campaignData.filter(i => i.clickCount > 0).length;

  const openRate = totalSent ? ((uniqueOpens / totalSent) * 100).toFixed(1) : "0";
  const clickRate = totalSent ? ((uniqueClicks / totalSent) * 100).toFixed(1) : "0";
  const bounceRate = totalSent ? ((totalBounces / totalSent) * 100).toFixed(1) : "0";

  const statusData = [
    { name: "Engaged", value: campaignData.filter(i => i.status === "engaged").length, color: "#10B981" },
    { name: "Opened", value: campaignData.filter(i => i.status === "opened").length, color: "#3B82F6" },
    { name: "Unopened", value: campaignData.filter(i => i.status === "unopened").length, color: "#6B7280" },
    { name: "Bounced", value: campaignData.filter(i => i.status === "bounced").length, color: "#EF4444" },
    { name: "Unsubscribed", value: campaignData.filter(i => i.status === "unsubscribed").length, color: "#F59E0B" },
    { name: "Spam", value: campaignData.filter(i => i.status === "spam").length, color: "#8B5CF6" }
  ];

  const engagementData = [
    { name: "Opens", value: totalOpens, color: "#10B981" },
    { name: "Clicks", value: totalClicks, color: "#3B82F6" },
    { name: "Bounces", value: totalBounces, color: "#EF4444" },
    { name: "Unsubscribes", value: totalUnsubscribes, color: "#F59E0B" },
    { name: "Spam", value: totalSpam, color: "#8B5CF6" }
  ];

  const topPerformers = campaignData
    .filter(i => i.openCount > 0 || i.clickCount > 0)
    .sort((a, b) => (b.openCount + b.clickCount * 2) - (a.openCount + a.clickCount * 2))
    .slice(0, 5);

  const handleGeneratePdf = async () => {
    if (!reportTemplateRef.current) {
      console.error("Template element is not found.");
      return;
    }

    setIsGeneratingPdf(true);

    try {
      const canvas = await html2canvas(reportTemplateRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 280; // A4 width in mm
      const pageHeight = 210; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add more pages if the content is too long
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
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
    <div className="container mx-auto p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-gray-900">Zoho Campaign Analytics</h1>
          <div>
            {campaignData.length > 0 ? (
              <button
                onClick={handleGeneratePdf}
                disabled={isGeneratingPdf}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={18} />
                {isGeneratingPdf ? "Generating PDF..." : "Download PDF"}
              </button>
            ) : (
              <label htmlFor="excel-upload" className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 flex items-center gap-2 cursor-pointer">
                <Upload size={18} />
                Upload Excel File
                <input
                  id="excel-upload"
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={handleExcelUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {campaignData.length > 0 && (
          <div ref={reportTemplateRef} className="bg-white p-6 rounded-lg mb-5">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
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
                <h3 className="text-xl font-semibold mb-4">📊 Campaign Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={120} dataKey="value">
                      {statusData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {statusData.map((item, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                      {item.name}: {item.value}
                    </div>
                  ))}
                </div>
              </div>

              {/* Engagement Bar */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">📈 Engagement</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {engagementData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {engagementData.map((item, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                      {item.name}: {item.value}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Over Time */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">⏱️ Performance Over Time</h3>
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
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#3B82F6" }}></div>
                  Opens
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "#10B981" }}></div>
                  Clicks
                </div>
              </div>
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
                      <p className="font-medium">{c.firstName} {c.lastName}</p>
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
              <h3 className="text-xl font-semibold mb-4">⚠️ Issues & Actions</h3>
              <div className="space-y-4">
                {totalBounces > 0 && (
                  <div className="flex items-start p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">Hard Bounces ({totalBounces})</p>
                      <p className="text-sm text-red-700">Remove bounced emails from future campaigns</p>
                    </div>
                  </div>
                )}
                {totalUnsubscribes > 0 && (
                  <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
                    <UserMinus className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">Unsubscribes ({totalUnsubscribes})</p>
                      <p className="text-sm text-yellow-700">Update subscriber preferences</p>
                    </div>
                  </div>
                )}
                {totalSpam > 0 && (
                  <div className="flex items-start p-3 bg-purple-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-purple-900">Spam Reports ({totalSpam})</p>
                      <p className="text-sm text-purple-700">Review content and sender reputation</p>
                    </div>
                  </div>
                )}
                {campaignData.filter(i => i.status === "unopened").length > 0 && (
                  <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Unopened ({campaignData.filter(i => i.status === "unopened").length})
                      </p>
                      <p className="text-sm text-gray-700">Consider follow-up campaign or subject line optimization</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Campaign Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
              <h3 className="text-xl font-semibold mb-4">📋 Campaign Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2">🎯 Performance Highlights</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Open rate {openRate}%</li>
                    <li>• Click rate {clickRate}%</li>
                    <li>• {totalOpens} total opens from {uniqueOpens} recipients</li>
                    <li>• {totalClicks} total clicks from {uniqueClicks} recipients</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">📊 Key Metrics</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Bounce rate: {bounceRate}%</li>
                    <li>• Unsubscribe rate: {((totalUnsubscribes / totalSent) * 100).toFixed(1)}%</li>
                    <li>• Spam complaint rate: {((totalSpam / totalSent) * 100).toFixed(1)}%</li>
                    <li>• Delivery rate: {(((totalSent - totalBounces) / totalSent) * 100).toFixed(1)}%</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">🔗 Click Details</h4>
                  {clickLinks.length > 0 ? (
                    <div className="text-sm">
                      <p className="mb-1">Top clicked link:</p>
                      <p className="bg-blue-50 p-2 rounded text-xs break-all">{clickLinks[0].url}</p>
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

const ReportZohoCampaignWithSidebar = (params: any) =>
  WithSidebar(ReportZohoCampaignPage)(params);
export default ReportZohoCampaignWithSidebar;
