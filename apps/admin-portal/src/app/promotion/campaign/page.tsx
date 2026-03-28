"use client";
import { Button } from "@repo/ui";
import { Plus, X, Edit } from "react-feather";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@repo/ui";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/DataTable";
import { useCampaign } from "@/hooks/useCampaign.hooks";
import { createCampaignTableColumns } from "@/components/tableConfig/campaignTableConfig";

export default function PromotionPage() {
  const {
    promotions,
    totalItems,
    totalPages,
    selectedPromotion,

    page,
    rowsPerPage,

    drawerOpen,
    hasAccess,
    canEdit,
    canDelete,

    channelNames,
    insuranceNames,
    productNames,
    planNames,
    vouchers,
    embeddedDiscount,

    setPage,
    setRowsPerPage,
    setDrawerOpen,

    isLoading,
    isDetailLoading,
    detailError,

    handleViewDetail,
    handleEditCampaign,
    handleDelete,
    addNewCampaign,
    handleSearch,
    getStatusColor,
    renderStatus,
  } = useCampaign();

  if (hasAccess === null) {
    return <div>Loading...</div>;
  }

  const campaignTableColumns = createCampaignTableColumns({
    page,
    rowsPerPage,
    handleViewDetail,
    handleDelete,
    canDelete,
    renderStatus,
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="sm:text-2xl text-xl font-semibold">
          Promotions Campaign
        </h1>
        <Button
          onClick={addNewCampaign}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-1" /> Add Campaign
        </Button>
      </div>

      <DataTable
        loading={isLoading}
        data={promotions}
        columns={campaignTableColumns}
        search={{
          placeholder: "Search by Campaign Name",
          onSearch: handleSearch,
        }}
        pagination={{
          page,
          totalPages,
          totalItems,
          rowsPerPage,
          onPageChange: setPage,
          onRowsPerPageChange: (e) => setRowsPerPage(Number(e.target.value)),
          rowsPerPageOptions: [10, 20, 30, 50],
        }}
        noDataText="No campaign data available"
        className="campaign-table"
      />

      <Drawer direction="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                className="absolute right-2 top-2"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close campaign details"
              >
                <X />
              </Button>
            </DrawerClose>
            <DrawerTitle className="text-black font-bold text-2xl">
              Campaign Details
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col w-full h-full p-4 md:p-6 bg-[#F8F8F8] mt-5 rounded-xl overflow-y-auto">
            {isDetailLoading ? (
              <div className="flex flex-1 items-center justify-center text-sm font-medium text-black">
                Loading campaign details...
              </div>
            ) : detailError ? (
              <div className="flex flex-1 items-center justify-center text-sm font-medium text-red-600">
                {detailError}
              </div>
            ) : !selectedPromotion ? (
              <div className="flex flex-1 items-center justify-center text-sm font-medium text-black">
                No campaign details available.
              </div>
            ) : (
              <>
                <div className="rounded-lg flex flex-col gap-4 text-black">
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32">
                  Campaign Name
                </div>
                <div className="max-w-1 w-1">:</div>
                <div>{selectedPromotion?.name}</div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32">
                  Promotion Type
                </div>
                <div className="max-w-1 w-1">:</div>
                <div>{selectedPromotion?.type}</div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32">Start Date</div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {selectedPromotion?.start_date
                    ? format(
                        new Date(selectedPromotion.start_date),
                        "dd-MM-yyyy"
                      )
                    : "N/A"}
                </div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32">End Date</div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {selectedPromotion?.end_date
                    ? format(new Date(selectedPromotion.end_date), "dd-MM-yyyy")
                    : "N/A"}
                </div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32">Value</div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {selectedPromotion?.value_type === "percentage"
                    ? `${selectedPromotion?.value}%`
                    : `${selectedPromotion?.value_currency} ${Number(
                        selectedPromotion?.value
                      ).toLocaleString()}`}
                </div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32">Status</div>
                <div className="max-w-1 w-1">:</div>
                <div className="text-warning">
                  <span
                    className={getStatusColor(
                      selectedPromotion?.active ?? false
                    )}
                  >
                    {selectedPromotion?.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32">
                  Minimum Transaction Amount
                </div>
                <div className="max-w-1 w-1">:</div>
                <div>{selectedPromotion?.minimum_amount}</div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32">
                  Maximum Discount Amount
                </div>
                <div className="max-w-1 w-1">:</div>
                <div>{selectedPromotion?.maximum_amount}</div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32">Channels</div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {selectedPromotion?.embedded_discount_channels &&
                  selectedPromotion.embedded_discount_channels.length > 0 ? (
                    selectedPromotion.embedded_discount_channels.map(
                      (channel: { channel_id: string }) => (
                        <p key={channel.channel_id}>
                          • {channelNames.get(channel.channel_id) || "Unknown"}
                        </p>
                      )
                    )
                  ) : (
                    <p>No channels</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32">Insurances</div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {selectedPromotion?.embedded_discount_insurances &&
                  selectedPromotion.embedded_discount_insurances.length > 0 ? (
                    selectedPromotion.embedded_discount_insurances.map(
                      (insurance: { insurance_id: string }) => (
                        <p key={insurance.insurance_id}>
                          •{" "}
                          {insuranceNames.get(insurance.insurance_id) ||
                            "Unknown"}
                        </p>
                      )
                    )
                  ) : (
                    <p>No insurances</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32">Products</div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {selectedPromotion?.embedded_discount_products &&
                  selectedPromotion.embedded_discount_products.length > 0 ? (
                    selectedPromotion.embedded_discount_products.map(
                      (product: { product_id: string }) => (
                        <p key={product.product_id}>
                          • {productNames.get(product.product_id) || "Unknown"}
                        </p>
                      )
                    )
                  ) : (
                    <p>No products</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 text-sm font-medium">
                <div className="sm:min-w-40 sm:w-40 min-w-32">Plans</div>
                <div className="max-w-1 w-1">:</div>
                <div>
                  {selectedPromotion?.embedded_discount_plans &&
                  selectedPromotion.embedded_discount_plans.length > 0 ? (
                    selectedPromotion.embedded_discount_plans.map(
                      (plan: { plan_id: string }) => (
                        <p key={plan.plan_id}>
                          • {planNames.get(plan.plan_id) || "Unknown"}
                        </p>
                      )
                    )
                  ) : (
                    <p>No plans</p>
                  )}
                </div>
              </div>

              {selectedPromotion?.type === "embedded" && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Embedded Details</h3>
                  {Array.isArray(embeddedDiscount) &&
                  embeddedDiscount.length > 0 ? (
                    embeddedDiscount.map((embedded, index) => (
                      <div
                        key={index}
                        className="mb-4 p-4 border rounded-lg bg-white shadow-md"
                      >
                        <div className="flex gap-2">
                          <div className="sm:min-w-40 sm:w-40 min-w-32">
                            Total Discount Usage
                          </div>
                          <div className="max-w-1 w-1">:</div>
                          <div>
                            {`${embedded.currency} ${(
                              embedded.total_transaction_amount -
                              embedded.total_discount_amount
                            ).toLocaleString()}`}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Total Discount Usage is not available.</p>
                  )}
                </div>
              )}

              {selectedPromotion?.type === "voucher" && vouchers.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Voucher Details</h3>
                  {vouchers.map((voucher, index) => (
                    <div
                      key={index}
                      className="mb-4 p-4 border rounded-lg bg-white shadow-md"
                    >
                      <div className="flex gap-2">
                        <div className="sm:min-w-40 sm:w-40 min-w-32">Code</div>
                        <div className="max-w-1 w-1">:</div>
                        <div>{voucher.code}</div>
                      </div>
                      <div className="flex gap-2">
                        <div className="sm:min-w-40 sm:w-40 min-w-32">
                          Usage Limit
                        </div>
                        <div className="max-w-1 w-1">:</div>
                        <div>{voucher.usage_limit}</div>
                      </div>
                      <div className="flex gap-2">
                        <div className="sm:min-w-40 sm:w-40 min-w-32">
                          Used Count
                        </div>
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
                    onClick={() => handleEditCampaign(selectedPromotion.campaign_id)}
                    disabled={!canEdit}
                    className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-6 py-2 flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </button>
                </div>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}