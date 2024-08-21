"use client";
import WithSidebar from "@/hoc/with-sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useRequireAuth from "@/hooks/useRequireAuth";
import { PromotionService } from "@/services/promotion.service";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import { useRouter } from "next/navigation";
import { FaTrashAlt } from "react-icons/fa";

const PromotionPage = () => {
  useRequireAuth();
  const promotionService = new PromotionService();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  useEffect(() => {
    promotionService.getPromotionCampaign(1).then((res) => {
      setPromotions(res.data);
      setPage(res.page);
      setTotalPages(res.pageTotal);
    });
  }, []);

  const renderStatus = (isActive: any) => (isActive ? 'ACTIVE' : 'NOT ACTIVE');
  const handleViewDetail = (id: string) => {
    router.push("/promotion/" + id);
  };
  const addNewCampaign = () => {
    router.push("/promotion/add-campaign");
  };

  const handleDelete = (id: string) => {
    // Confirm deletion
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      promotionService.deleteDiscCampaignById(id).then(() => {
        // Update state after deletion
        setPromotions(promotions.filter(promotion => promotion.campaign_id !== id));
      }).catch(error => {
        console.error("Failed to delete promotion:", error);
      });
    }
  };

  return (
    <div className="w-full p-6 m-2 bg-white rounded shadow-md">
      <h1 className="text-2xl font-semibold">Promotions Campaign</h1>

      <div className="flex justify-end items-center p-4 mb-4">
        <span className="font-semibold mr-4">Add Campaign</span>
        <button
          onClick={() => addNewCampaign()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          +
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((promotion) => (
            <TableRow key={promotion.campaign_id}>
              <TableCell>{promotion.name}</TableCell>
              <TableCell>{promotion.type}</TableCell>
              <TableCell>{promotion.value_currency}</TableCell>
              <TableCell>{promotion.value_currency} {promotion.value}</TableCell>
              <TableCell>{format(new Date(promotion.start_date), 'dd-MM-yyyy')}</TableCell>
              <TableCell>{format(new Date(promotion.end_date), 'dd-MM-yyyy')}</TableCell>
              <TableCell>{renderStatus(promotion.active)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewDetail(promotion.campaign_id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(promotion.campaign_id)}
                    className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
                  >
                    <FaTrashAlt className="text-white" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8}>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    promotionService.getPromotionCampaign(page - 1).then((res) => {
                      setPromotions(res.data);
                      setPage(res.page);
                      setTotalPages(res.pageTotal);
                    });
                  }}
                  disabled={page === 1}
                  className="bg-slate-950 text-white px-4 py-2 rounded mr-2"
                >
                  Prev
                </button>
                <button
                  onClick={() => {
                    promotionService.getPromotionCampaign(page + 1).then((res) => {
                      setPromotions(res.data);
                      setPage(res.page);
                      setTotalPages(res.pageTotal);
                    });
                  }}
                  disabled={page === totalPages}
                  className="bg-slate-950 text-white px-4 py-2 rounded"
                >
                  Next
                </button>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

const PromotionWithSidebar = (params: any) =>
  WithSidebar(PromotionPage)(params);
export default PromotionWithSidebar;
