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
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Trash } from "react-feather";

const PromotionPage = () => {
  useRequireAuth();
  const promotionService = new PromotionService();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    promotionService.getPromotionCampaign(page, rowsPerPage).then((res) => {
      setPromotions(res.data);
      setTotalItems(res.total);
      setTotalPages(res.pageTotal);
    }).catch(error => {
      console.error("Failed to fetch promotions:", error);
    });
  }, [page, rowsPerPage]);

  const renderStatus = (isActive: any) => (isActive ? 'ACTIVE' : 'NOT ACTIVE');
  const handleViewDetail = (id: string) => {
    router.push("/promotion/" + id);
  };
  const addNewCampaign = () => {
    router.push("/promotion/add-campaign");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      promotionService.deleteDiscCampaignById(id).then(() => {
        setPromotions(promotions.filter(promotion => promotion.campaign_id !== id));
      }).catch(error => {
        console.error("Failed to delete promotion:", error);
      });
    }
  };

  return (
    <div className="w-full p-6 m-2 bg-white rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Promotions Campaign</h1>
        <Button
          onClick={() => addNewCampaign()}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-1 " /> Add Campaign
        </Button>
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
                  <Button
                    onClick={() => handleViewDetail(promotion.campaign_id)}
                    className="bg-[#016DA1] hover:bg-[#014C8C] text-white px-4 py-2 rounded-full flex items-center justify-center"
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleDelete(promotion.campaign_id)}
                    className="text-red-600 px-0"
                  >
                    <Trash />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8}>
              <div className="flex justify-center items-center gap-2 font-normal">
                <label htmlFor="rowsPerPage">Showing:</label>
                <select
                  id="rowsPerPage"
                  className="p-2 border rounded"
                  value={rowsPerPage}
                  onChange={(e) => {
                    const newRowsPerPage = Number(e.target.value);
                    setRowsPerPage(newRowsPerPage);
                    setPage(1);
                  }}
                >
                  {[10, 20, 30, 50].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span className="mr-2">of {totalItems} items</span>
                <button
                  onClick={() => {
                    if (page > 1) {
                      setPage(page - 1);
                    }
                  }}
                  disabled={page === 1}
                  title="Previous"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={() => {
                    if (page < totalPages) {
                      setPage(page + 1);
                    }
                  }}
                  disabled={page === totalPages}
                  title="Next"
                >
                  <ChevronRight />
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
