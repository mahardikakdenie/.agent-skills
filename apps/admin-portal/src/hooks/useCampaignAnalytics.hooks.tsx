import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { promotionService } from "@/services/promotion/api/promotion.service";
import { transactionService } from "@/services/transaction/api/transaction.service";
import { toastNotification } from "@/lib/toast";
import * as XLSX from "xlsx";

export function useCampaignAnalytics() {
  const [selectedCampaign, setSelectedCampaign] = useState("");
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

  const { data: campaignList = [], isLoading: isLoadingCampaigns } = useQuery({
    queryKey: ["campaign-list"],
    queryFn: async () => {
      const res: any = await promotionService.searchCampaigns({
        page: 1,
        limit: 1000,
        query: "",
      });
      return (res?.data || []).map((c: any) => ({
        id: c.campaign_id,
        name: c.name,
      }));
    },
    staleTime: 300000,
  });

  const { mutate: fetchAnalytics, isPending: isLoadingAnalytics } = useMutation(
    {
      mutationFn: async (campaignId: string) => {
        const res: any = await transactionService.getCampaignReport(
          campaignId
        );
        return res;
      },
      onSuccess: (res) => {
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
          toastNotification("Analytics loaded successfully!", "success");
        }
      },
      onError: (error) => {
        console.error("Error fetching analytics:", error);
        toastNotification("Failed to load analytics", "error");
      },
    }
  );

  const { mutate: updateCampaign, isPending: isUpdatingCampaign } = useMutation(
    {
      mutationFn: async ({
        campaignId,
        data,
      }: {
        campaignId: string;
        data: any;
      }) => {
        await transactionService.updateCampaignReport(campaignId, { data });
      },
      onSuccess: () => {
        toastNotification("Update campaign report successfully!", "success");

        if (selectedCampaign) {
          fetchAnalytics(selectedCampaign);
        }
      },
      onError: (error) => {
        console.error("Error updating campaign:", error);
        toastNotification("Update campaign report failed!", "error");
      },
    }
  );

  const handleViewAnalytics = useCallback(() => {
    if (selectedCampaign) {
      fetchAnalytics(selectedCampaign);
    }
  }, [selectedCampaign, fetchAnalytics]);

  const handleExcelUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const summary: any = {};
      if (reportSummary.length > 1) {
        reportSummary.forEach((row: any) => {
          summary[`${row[0].toLowerCase().trim().replace(/\s+/g, "_")}`] =
            row[1];
        });
      }

      const dataMap: Record<string, any> = {};

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

      if (unsubscribes.length > 1) {
        unsubscribes.slice(1).forEach((row: any) => {
          const email = row[0];
          if (dataMap[email]) {
            dataMap[email].unsubscribes = 1;
          }
        });
      }

      if (complaints.length > 1) {
        complaints.slice(1).forEach((row: any) => {
          const email = row[0];
          if (dataMap[email]) {
            dataMap[email].spam = 1;
          }
        });
      }

      Object.values(dataMap).forEach((rec: any) => {
        if (rec.bounce > 0) rec.status = "bounced";
        else if (rec.unsubscribes > 0) rec.status = "unsubscribed";
        else if (rec.spam > 0) rec.status = "spam";
        else if (rec.clickCount > 0) rec.status = "engaged";
        else if (rec.openCount > 0) rec.status = "opened";
        else rec.status = "unopened";
      });

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

      const processedData = {
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

      updateCampaign({
        campaignId: selectedCampaign,
        data: processedData,
      });
    },
    [selectedCampaign, updateCampaign]
  );

  return {
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
  };
}
