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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drewer";
import useRequireAuth from "@/hooks/useRequireAuth";
import { PromotionService } from "@/services/promotion.service";
import { ChannelService } from "@/services/channel.services";
import { InsuranceService } from "@/services/insurance.services";
import { ProductService } from "@/services/product.services";
import { PlanService } from "@/services/plan.services";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Trash, X } from "react-feather";
import { VoucherService } from "@/services/voucher.services";

const PromotionPage = () => {
  useRequireAuth();
  const promotionService = new PromotionService();
  const channelService = new ChannelService();
  const insuranceService = new InsuranceService();
  const productService = new ProductService();
  const planService = new PlanService();
  const voucherService = new VoucherService();

  const [promotions, setPromotions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [channelNames, setChannelNames] = useState<Map<string, string>>(new Map());
  const [insuranceNames, setInsuranceNames] = useState<Map<string, string>>(new Map());
  const [productNames, setProductNames] = useState<Map<string, string>>(new Map());
  const [planNames, setPlanNames] = useState<Map<string, string>>(new Map());
  const [vouchers, setVouchers] = useState<{
    code: string;
    usage_limit: number;
    used_count: number;
  }[]>([]);

  const router = useRouter();

  useEffect(() => {
    promotionService
      .getPromotionCampaign(page, rowsPerPage)
      .then((res) => {
        setPromotions(res.data);
        setTotalItems(res.total);
        setTotalPages(res.pageTotal);
      })
      .catch((error) => {
        console.error("Failed to fetch promotions:", error);
      });
  }, [page, rowsPerPage]);

  const getStatusColor = (status: Boolean) => {
    switch (status) {
      case false:
        return "text-[#FF0000]";
      case true:
        return "text-[#00AB4F]";
      default:
        return "text-[#FF0000]";
    }
  };

  const handleEditCampaign = (id: string) => {
    router.push("/promotion/edit-campaign/" + id);
  };

  const renderStatus = (isActive: any) => (isActive ? 'ACTIVE' : 'NOT ACTIVE');
  const handleViewDetail = async (id: string) => {
    try {
      const response = await promotionService.getPromotionCampaignById(id);
      const promotionData = response.data[0];
      setSelectedPromotion(promotionData);
      setDrawerOpen(true);

      const fetchNames = async () => {
        const channelFetches = promotionData.embedded_discount_channels.map(
          (channel: { channel_id: string }) =>
            channelService.getChannelById(channel.channel_id)
        );
        const insuranceFetches =
          promotionData.embedded_discount_insurances.map(
            (insurance: { insurance_id: string }) =>
              insuranceService.getInsuranceById(insurance.insurance_id)
          );
        const productFetches = promotionData.embedded_discount_products.map(
          (product: { product_id: string }) =>
            productService.getProductById(product.product_id)
        );
        const planFetches = promotionData.embedded_discount_plans.map(
          (plan: { plan_id: string }) => planService.getPlanById(plan.plan_id)
        );

        const [
          channelResponses,
          insuranceResponses,
          productResponses,
          planResponses,
        ] = await Promise.all([
          Promise.all(channelFetches),
          Promise.all(insuranceFetches),
          Promise.all(productFetches),
          Promise.all(planFetches),
        ]);

        setChannelNames(
          new Map(
            channelResponses.map((res: any) => [res.id, res.name])
          )
        );
        setInsuranceNames(
          new Map(
            insuranceResponses.map((res: any) => [res.id, res.name])
          )
        );
        setProductNames(
          new Map(
            productResponses.map((res: any) => [res.data[0].id, res.data[0].name])
          )
        );
        setPlanNames(
          new Map(
            planResponses.map((res: any) => [res.id, res.name])
          )
        );
      };

      if (promotionData.type === "voucher") {
        const vouchersResponse = await voucherService.getVoucherByCampaignId(
          promotionData.campaign_id
        );
        setVouchers(vouchersResponse.data);
      }

      await fetchNames();
    } catch (err) {
      console.error("Failed to fetch promotion details:", err);
    }
  };

  const addNewCampaign = () => {
    router.push("/promotion/add-campaign");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      promotionService
        .deleteDiscCampaignById(id)
        .then(() => {
          setPromotions(
            promotions.filter((promotion) => promotion.campaign_id !== id)
          );
        })
        .catch((error) => {
          console.error("Failed to delete promotion:", error);
        });
    }
  };

  return (
    <div className="container mx-auto p-6">
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
              <TableCell>
                {promotion.value_currency} {promotion.value}
              </TableCell>
              <TableCell>
                {format(new Date(promotion.start_date), "dd-MM-yyyy")}
              </TableCell>
              <TableCell>
                {format(new Date(promotion.end_date), "dd-MM-yyyy")}
              </TableCell>
              <TableCell>{renderStatus(promotion.active)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">

                  <Drawer direction="right">
                    <DrawerTrigger
                      className="bg-[#016DA1] text-white px-4 py-2 rounded-full"
                      onClick={() => handleViewDetail(promotion.campaign_id)}
                    >
                      View
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerClose className="absolute right-2 top-2">
                          <Button variant="ghost" onClick={() => setDrawerOpen(false)}>
                            <X />
                          </Button>
                        </DrawerClose>
                        <DrawerTitle className="text-black font-bold text-2xl">
                          Campaign Details
                        </DrawerTitle>
                      </DrawerHeader>
                      <div className="flex flex-col w-full h-full p-4 md:p-6 bg-[#F8F8F8] mt-5 rounded-xl overflow-y-auto">
                        <div className="rounded-lg flex flex-col gap-4 text-black">
                          <div className="flex gap-2 text-sm font-medium">
                            <div className="min-w-40 w-40">Campaign Name</div>
                            <div className="max-w-1 w-1">:</div>
                            <div>{selectedPromotion?.name}</div>
                          </div>
                          <div className="flex gap-2 text-sm font-medium">
                            <div className="min-w-40 w-40">Promotion Type</div>
                            <div className="max-w-1 w-1">:</div>
                            <div>{selectedPromotion?.type}</div>
                          </div>
                          <div className="flex gap-2 text-sm font-medium">
                            <div className="min-w-40 w-40">Start Date</div>
                            <div className="max-w-1 w-1">:</div>
                            <div>{selectedPromotion?.start_date ? format(new Date(selectedPromotion.start_date), "dd-MM-yyyy") : 'N/A'}</div>
                          </div>
                          <div className="flex gap-2 text-sm font-medium">
                            <div className="min-w-40 w-40">End Date</div>
                            <div className="max-w-1 w-1">:</div>
                            <div>{selectedPromotion?.end_date ? format(new Date(selectedPromotion.end_date), "dd-MM-yyyy") : 'N/A'}</div>
                          </div>
                          <div className="flex gap-2 text-sm font-medium">
                            <div className="min-w-40 w-40">Value</div>
                            <div className="max-w-1 w-1">:</div>
                            <div>{selectedPromotion?.value_currency} {selectedPromotion?.value}</div>
                          </div>
                          <div className="flex gap-2 text-sm font-medium">
                            <div className="min-w-40 w-40">Status</div>
                            <div className="max-w-1 w-1">:</div>
                            <div className="text-warning">
                              <span className={getStatusColor(selectedPromotion?.active)}>
                                {selectedPromotion?.active ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 text-sm font-medium">
                            <div className="min-w-40 w-40">Minimum Amount</div>
                            <div className="max-w-1 w-1">:</div>
                            <div>{selectedPromotion?.minimum_amount}</div>
                          </div>
                          <div className="flex gap-2 text-sm font-medium">
                            <div className="min-w-40 w-40">Maximum Amount</div>
                            <div className="max-w-1 w-1">:</div>
                            <div>{selectedPromotion?.maximum_amount}</div>
                          </div>
                          <div className="flex gap-2 text-sm font-medium">
                            <div className="min-w-40 w-40">Channels</div>
                            <div className="max-w-1 w-1">:</div>
                            <div>
                              {selectedPromotion?.embedded_discount_channels.length > 0 ? (
                                selectedPromotion.embedded_discount_channels.map(
                                  (channel: { channel_id: string }) => (
                                    <p key={channel.channel_id}>
                                      {channelNames.get(channel.channel_id) || "Unknown"}
                                    </p>
                                  )
                                )
                              ) : (
                                <p>No channels</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 text-sm font-medium">
                            <div className="min-w-40 w-40">Insurances</div>
                            <div className="max-w-1 w-1">:</div>
                            <div>
                              {selectedPromotion?.embedded_discount_insurances.length > 0 ? (
                                selectedPromotion.embedded_discount_insurances.map(
                                  (insurance: { insurance_id: string }) => (
                                    <p key={insurance.insurance_id}>
                                      {insuranceNames.get(insurance.insurance_id) || "Unknown"}
                                    </p>
                                  )
                                )
                              ) : (
                                <p>No insurances</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 text-sm font-medium">
                            <div className="min-w-40 w-40">Products</div>
                            <div className="max-w-1 w-1">:</div>
                            <div>
                              {selectedPromotion?.embedded_discount_products.length > 0 ? (
                                selectedPromotion.embedded_discount_products.map(
                                  (product: { product_id: string }) => (
                                    <p key={product.product_id}>
                                      {productNames.get(product.product_id) || "Unknown"}
                                    </p>
                                  )
                                )
                              ) : (
                                <p>No products</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 text-sm font-medium">
                            <div className="min-w-40 w-40">Plans</div>
                            <div className="max-w-1 w-1">:</div>
                            <div>
                              {selectedPromotion?.embedded_discount_plans.length > 0 ? (
                                selectedPromotion.embedded_discount_plans.map(
                                  (plan: { plan_id: string }) => (
                                    <p key={plan.plan_id}>
                                      {planNames.get(plan.plan_id) || "Unknown"}
                                    </p>
                                  )
                                )
                              ) : (
                                <p>No plans</p>
                              )}
                            </div>
                          </div>

                          {selectedPromotion?.type === "voucher" && vouchers.length > 0 && (
                            <div className="mt-4">
                              <h3 className="text-lg font-semibold">Voucher Details</h3>
                              {vouchers.map((voucher, index) => (
                                <div key={index} className="mb-4 p-4 border rounded-lg bg-white shadow-md">
                                  <div className="flex gap-2">
                                    <div className="min-w-40 w-40">Code</div>
                                    <div className="max-w-1 w-1">:</div>
                                    <div>{voucher.code}</div>
                                  </div>
                                  <div className="flex gap-2">
                                    <div className="min-w-40 w-40">Usage Limit</div>
                                    <div className="max-w-1 w-1">:</div>
                                    <div>{voucher.usage_limit}</div>
                                  </div>
                                  <div className="flex gap-2">
                                    <div className="min-w-40 w-40">Used Count</div>
                                    <div className="max-w-1 w-1">:</div>
                                    <div>{voucher.used_count}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-center mt-4">
                          <button
                            onClick={() => handleEditCampaign(promotion.campaign_id)}
                            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 flex items-center justify-center"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </DrawerContent>
                  </Drawer>

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
