'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Mail,
  Eye,
  MousePointer,
  UserMinus,
  AlertTriangle,
  Download,
  Upload,
  Target,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { BiMoney } from 'react-icons/bi';
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
} from 'recharts';

import { cn } from '@repo/helper';
import { Box, Button, Combobox } from '@repo/ui';

import { ContentLoadingWrapper } from '@/components/ui/loading';
import { useCampaignAnalytics } from '@/hooks/useCampaignAnalytics.hooks';

const CampaignAnalyticsPage = () => {
  const {
    campaignList,
    selectedCampaign,
    totalTransaction,
    totalLeads,
    totalPurchased,
    campaignSummary,
    campaignData,
    clickLinks,
    timeData,
    openClickTrend,
    isLoadingCampaigns,
    isLoadingAnalytics,
    isUpdatingCampaign,
    setSelectedCampaign,
    handleViewAnalytics,
    handleExcelUpload,
  } = useCampaignAnalytics();

  const campaignOptions = campaignList.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const reportTemplateRef = useRef<HTMLDivElement>(null);

  // metrics
  const totalSent = campaignData.filter((i) => i.bounce === 0).length;
  const totalOpens = campaignData.reduce((sum, i) => sum + i.openCount, 0);
  const totalClicks = campaignData.reduce((sum, i) => sum + i.clickCount, 0);
  const totalBounces = campaignData.filter((i) => i.bounce > 0).length;
  const totalUnsubscribes = campaignData.filter((i) => i.unsubscribes > 0).length;
  const totalSpam = campaignData.filter((i) => i.spam > 0).length;
  const uniqueOpens = campaignData.filter((i) => i.openCount > 0).length;
  const uniqueClicks = campaignData.filter((i) => i.clickCount > 0).length;

  const openRate = totalSent ? (((uniqueOpens + uniqueClicks) / totalSent) * 100).toFixed(1) : '0';
  const clickRate = totalSent ? ((uniqueClicks / totalSent) * 100).toFixed(1) : '0';
  const bounceRate = totalSent ? ((totalBounces / totalSent) * 100).toFixed(1) : '0';
  const contactRate = totalSent ? ((totalSent / totalLeads) * 100).toFixed(1) : '0';
  const purchaseRate = totalClicks ? ((totalPurchased / totalClicks) * 100).toFixed(1) : '0';
  const conversionRate = totalLeads ? ((totalPurchased / totalLeads) * 100).toFixed(1) : '0';

  const statusData = [
    {
      name: 'Engaged',
      value: campaignData.filter((i) => i.status === 'engaged').length,
      color: '#10B981',
    },
    {
      name: 'Opened',
      value: campaignData.filter((i) => i.status === 'opened').length,
      color: '#3B82F6',
    },
    {
      name: 'Unopened',
      value: campaignData.filter((i) => i.status === 'unopened').length,
      color: '#6B7280',
    },
    {
      name: 'Bounced',
      value: campaignData.filter((i) => i.status === 'bounced').length,
      color: '#EF4444',
    },
    // { name: "Unsubscribed", value: campaignData.filter(i => i.status === "unsubscribed").length, color: "#F59E0B" },
    // { name: "Spam", value: campaignData.filter(i => i.status === "spam").length, color: "#8B5CF6" }
  ];

  const engagementData = [
    { name: 'Opens', value: totalOpens, color: '#10B981' },
    { name: 'Clicks', value: totalClicks, color: '#3B82F6' },
    // { name: "Bounces", value: totalBounces, color: "#EF4444" },
    // { name: "Unsubscribes", value: totalUnsubscribes, color: "#F59E0B" },
    // { name: "Spam", value: totalSpam, color: "#8B5CF6" }
  ];

  const funnelData = [
    { name: 'Total Leads', value: totalLeads, color: '#6B7280' },
    { name: 'Total Contacted', value: totalSent, color: '#3B82F6' },
    { name: 'Total Clicked', value: totalClicks, color: '#8B5CF6' },
    {
      name: 'Total Purchased with voucher',
      value: totalPurchased,
      color: '#10B981',
    },
  ];

  const topPerformers = campaignData
    .filter((i) => i.openCount > 0 || i.clickCount > 0)
    .sort((a, b) => b.openCount + b.clickCount * 2 - (a.openCount + a.clickCount * 2))
    .slice(0, 5);

  const handleGeneratePdf = async () => {
    if (!reportTemplateRef.current) {
      console.error('Template element is not found.');
      return;
    }

    setIsGeneratingPdf(true);

    try {
      const canvas = await html2canvas(reportTemplateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 280;
      const pageHeight = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('CampaignReport.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <Box className="flex flex-col w-full p-4 md:p-6 gap-3">
      <Box className="flex items-center justify-between">
        <Box as="h1" className="text-2xl font-bold text-black">
          Campaign Analytics
        </Box>
        <Button
          disabled={isGeneratingPdf || campaignData.length < 1}
          onClick={handleGeneratePdf}
          className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
          leftIcon={<Download className="w-5 h-5" />}
        >
          {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      </Box>

      <Box className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm sm:flex-row sm:items-end">
        <Box className="flex flex-1 flex-col gap-1.5">
          <Box as="label" className="text-xs font-medium text-slate-500">
            Campaign
          </Box>
          <Box className="w-full sm:max-w-md">
            <Combobox
              value={selectedCampaign}
              onValueChange={setSelectedCampaign}
              options={campaignOptions}
              placeholder="Select Campaign"
              searchPlaceholder="Search campaign..."
            />
          </Box>
        </Box>
        <Box className="flex flex-wrap items-center gap-3">
          <Button
            disabled={!selectedCampaign || isLoadingAnalytics}
            onClick={handleViewAnalytics}
            className="h-10 rounded-full bg-[#016DA1] px-5 text-white hover:bg-[#2d9ae6]"
          >
            {isLoadingAnalytics ? 'Loading...' : 'View Analytics'}
          </Button>
          <Button
            asChild
            disabled={!selectedCampaign || isUpdatingCampaign}
            className={cn(
              'h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]',
              (!selectedCampaign || isUpdatingCampaign) && 'opacity-50 cursor-not-allowed'
            )}
            leftIcon={<Upload size={18} />}
          >
            <label htmlFor="excel-upload">
              {isUpdatingCampaign ? 'Updating...' : 'Update Campaign'}
              <input
                disabled={!selectedCampaign || isUpdatingCampaign}
                id="excel-upload"
                type="file"
                accept=".xls,.xlsx"
                onChange={handleExcelUpload}
                className="hidden"
              />
            </label>
          </Button>
        </Box>
      </Box>

      <ContentLoadingWrapper isLoading={isLoadingAnalytics} loadingText="Loading analytics...">
        {campaignData.length > 0 && (
          <Box ref={reportTemplateRef} className="bg-white p-6 rounded-lg mb-5">
            <Box className="mb-5">
              <Box as="h1" className="text-center text-2xl font-bold">
                Travel Annual Plan Campaign
              </Box>

              <Box as="h1" className="hidden text-center text-2xl font-bold">
                {campaignSummary.campaign_name}
              </Box>
              <Box as="p" className="hidden text-center text-base font-semibold">
                {campaignSummary.subject}
              </Box>
            </Box>

            <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Box className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <Box as="p" className="text-sm text-gray-600">
                  Contact Rate
                </Box>
                <Box as="p" className="text-3xl font-bold">
                  {contactRate}%
                </Box>
                <Mail className="h-8 w-8 text-blue-500" />
              </Box>

              <Box className="hidden bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                <Box as="p" className="text-sm text-gray-600">
                  Total Transaction
                </Box>
                <Box as="p" className="text-3xl font-bold">
                  {totalTransaction}
                </Box>
                <BiMoney className="h-8 w-8 text-orange-500" />
              </Box>
              <Box className="hidden bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <Box as="p" className="text-sm text-gray-600">
                  Total Sent
                </Box>
                <Box as="p" className="text-3xl font-bold">
                  {totalSent}
                </Box>
                <Mail className="h-8 w-8 text-blue-500" />
              </Box>

              <Box className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <Box as="p" className="text-sm text-gray-600">
                  Open Rate
                </Box>
                <Box as="p" className="text-3xl font-bold">
                  {openRate}%
                </Box>
                <Eye className="h-8 w-8 text-green-500" />
              </Box>
              <Box className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <Box as="p" className="text-sm text-gray-600">
                  Click Rate
                </Box>
                <Box as="p" className="text-3xl font-bold">
                  {clickRate}%
                </Box>
                <MousePointer className="h-8 w-8 text-purple-500" />
              </Box>
              <Box className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                <Box as="p" className="text-sm text-gray-600">
                  Purchase Rate
                </Box>
                <Box as="p" className="text-3xl font-bold">
                  {purchaseRate}%
                </Box>
                <BiMoney className="h-8 w-8 text-orange-500" />
              </Box>
              <Box className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#10B981]">
                <Box as="p" className="text-sm text-gray-600">
                  Conversion Rate
                </Box>
                <Box as="p" className="text-3xl font-bold">
                  {conversionRate}%
                </Box>
                <Target className="h-8 w-8 text-[#10B981]" />
              </Box>
              <Box className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                <Box as="p" className="text-sm text-gray-600">
                  Bounce Rate
                </Box>
                <Box as="p" className="text-3xl font-bold">
                  {bounceRate}%
                </Box>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </Box>
            </Box>

            <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Box className="bg-white rounded-xl shadow-lg p-6">
                <Box as="h3" className="text-xl font-semibold mb-4">
                  ?? Campaign Status
                </Box>
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
                <Box className="grid grid-cols-2 gap-2 mt-4">
                  {statusData.map((item, index) => (
                    <Box key={index} className="flex items-center text-sm text-gray-600">
                      <Box
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      ></Box>
                      {item.name}: {item.value}
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box className="hidden bg-white rounded-xl shadow-lg p-6">
                <Box as="h3" className="text-xl font-semibold mb-4">
                  ?? Engagement
                </Box>
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
                <Box className="grid grid-cols-2 gap-2 mt-4">
                  {engagementData.map((item, index) => (
                    <Box key={index} className="flex items-center text-sm text-gray-600">
                      <Box
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      ></Box>
                      {item.name}: {item.value}
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box className="bg-white rounded-xl shadow-lg p-6">
                <Box as="h3" className="text-xl font-semibold mb-4">
                  ?? Funnel
                </Box>
                <ResponsiveContainer width="100%" height={400}>
                  <FunnelChart>
                    <Tooltip />
                    <Funnel dataKey="value" data={funnelData} isAnimationActive>
                      {funnelData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                      <LabelList position="right" fill="#111827" stroke="none" dataKey="name" />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </Box>
            </Box>

            <Box className="hidden bg-white rounded-xl shadow-lg p-6 mb-8">
              <Box as="h3" className="text-xl font-semibold mb-4">
                ?? Performance Over Time
              </Box>
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

              <Box className="flex items-center gap-6 justify-center mt-4">
                <Box className="flex items-center text-sm text-gray-600">
                  <Box
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: '#3B82F6' }}
                  ></Box>
                  Opens
                </Box>
                <Box className="flex items-center text-sm text-gray-600">
                  <Box
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: '#10B981' }}
                  ></Box>
                  Clicks
                </Box>
              </Box>
            </Box>

            <Box className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <Box as="h3" className="text-xl font-semibold mb-4">
                ?? Opens & Clicks Trends
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={openClickTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="opens" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="clicks" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Box>

            <Box className="bg-white rounded-xl shadow-lg p-6">
              <Box as="h3" className="text-xl font-semibold mb-4">
                ?? Top Performers
              </Box>
              <Box as="table" className="w-full text-sm">
                <Box as="thead">
                  <Box as="tr" className="border-b">
                    <Box as="th" className="text-left py-2">
                      Contact
                    </Box>
                    <Box as="th" className="text-center py-2">
                      Opens
                    </Box>
                    <Box as="th" className="text-center py-2">
                      Clicks
                    </Box>
                  </Box>
                </Box>
                <Box as="tbody">
                  {topPerformers.map((c, idx) => (
                    <Box as="tr" key={idx} className="border-b">
                      <Box as="td" className="py-2">
                        <Box as="p" className="font-medium">
                          {c.firstName} {c.lastName}
                        </Box>
                        <Box as="p" className="text-xs text-gray-500">
                          {c.email}
                        </Box>
                      </Box>
                      <Box as="td" className="text-center">
                        {c.openCount}
                      </Box>
                      <Box as="td" className="text-center">
                        {c.clickCount}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            <Box className="bg-white rounded-xl shadow-lg p-6 mt-8">
              <Box as="h3" className="text-xl font-semibold mb-4">
                ?? Issues & Actions
              </Box>
              <Box className="space-y-4">
                {totalBounces > 0 && (
                  <Box className="flex items-start p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                    <Box>
                      <Box as="p" className="font-medium text-red-900">
                        Bounces ({totalBounces})
                      </Box>
                      <Box as="p" className="text-sm text-red-700">
                        Remove bounced emails from future campaigns
                      </Box>
                    </Box>
                  </Box>
                )}
                {totalUnsubscribes > 0 && (
                  <Box className="flex items-start p-3 bg-yellow-50 rounded-lg">
                    <UserMinus className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                    <Box>
                      <Box as="p" className="font-medium text-yellow-900">
                        Unsubscribes ({totalUnsubscribes})
                      </Box>
                      <Box as="p" className="text-sm text-yellow-700">
                        Update subscriber preferences
                      </Box>
                    </Box>
                  </Box>
                )}
                {totalSpam > 0 && (
                  <Box className="flex items-start p-3 bg-purple-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />
                    <Box>
                      <Box as="p" className="font-medium text-purple-900">
                        Spam Reports ({totalSpam})
                      </Box>
                      <Box as="p" className="text-sm text-purple-700">
                        Review content and sender reputation
                      </Box>
                    </Box>
                  </Box>
                )}
                {campaignData.filter((i) => i.status === 'unopened').length > 0 && (
                  <Box className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <Box>
                      <Box as="p" className="font-medium text-gray-900">
                        Unopened ({campaignData.filter((i) => i.status === 'unopened').length})
                      </Box>
                      <Box as="p" className="text-sm text-gray-700">
                        Consider follow-up campaign or subject line optimization
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>

            <Box className="bg-white rounded-xl shadow-lg p-6 mt-8">
              <Box as="h3" className="text-xl font-semibold mb-4">
                ?? Campaign Summary
              </Box>
              <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Box>
                  <Box as="h4" className="font-medium mb-2">
                    ?? Performance Highlights
                  </Box>
                  <Box as="ul" className="text-sm text-gray-600 space-y-1">
                    <Box as="li">• Open rate {openRate}%</Box>
                    <Box as="li">• Click rate {clickRate}%</Box>
                    <Box as="li">
                      • {totalOpens} total opens from {uniqueOpens} recipients
                    </Box>
                    <Box as="li">
                      • {totalClicks} total clicks from {uniqueClicks} recipients
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <Box as="h4" className="font-medium mb-2">
                    ?? Key Metrics
                  </Box>
                  <Box as="ul" className="text-sm text-gray-600 space-y-1">
                    <Box as="li">• Bounce rate: {bounceRate}%</Box>

                    <Box as="li" className="hidden">
                      • Unsubscribe rate: {((totalUnsubscribes / totalSent) * 100).toFixed(1)}%
                    </Box>
                    <Box as="li" className="hidden">
                      • Spam complaint rate: {((totalSpam / totalSent) * 100).toFixed(1)}%
                    </Box>

                    <Box as="li">
                      • Delivery rate: {(((totalSent - totalBounces) / totalSent) * 100).toFixed(1)}
                      %
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <Box as="h4" className="font-medium mb-2">
                    ?? Click Details
                  </Box>
                  {clickLinks.length > 0 ? (
                    <Box className="text-sm">
                      <Box as="p" className="mb-1">
                        Top clicked link:
                      </Box>
                      <Box as="p" className="bg-blue-50 p-2 rounded text-xs break-all">
                        {clickLinks[0].url}
                      </Box>
                      <Box as="p">{clickLinks[0].count} unique clicks</Box>
                    </Box>
                  ) : (
                    <Box as="p" className="text-sm text-gray-500">
                      No clicks recorded
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </ContentLoadingWrapper>
    </Box>
  );
};

export default CampaignAnalyticsPage;
