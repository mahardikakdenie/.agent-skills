"use client";
import React from "react";
import { FaPlus, FaSave, FaTrash, FaCheck } from "react-icons/fa";
import { ChevronLeft, Trash } from "react-feather";
import { Input } from "@repo/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import ChannelSelectionModal from "@/app/promotion/components/channel-selection-modal";
import InsuranceSelectionModal from "@/app/promotion/components/insurance-selection-modal";
import ProductSelectionModal from "@/app/promotion/components/product-selection-modal";
import PlanSelectionModal from "@/app/promotion/components/plan-selection-modal";
import { useCampaignForm } from "@/hooks/useCampaignForm.hooks";
import { ContentLoadingWrapper } from "../../ui/Loading/index";

interface CampaignFormProps {
  mode: "create" | "edit";
  campaignId?: string;
}

export default function CampaignForm({ mode, campaignId }: CampaignFormProps) {
  const {
    handleSubmit,
    control,
    errors,

    promotion,
    currency,

    hasAccess,
    showAlert,
    errorMessage,
    isEdit,

    handleSave,
    setShowAlert,
    goBack,
    loadCampaignDetail,
    handleChangeType,
    handleChangeValueType,
    handleChangeInsurance,

    channels,
    isChannelModalOpen,
    selectedChannelIds,
    globalSelectedChannels,
    currentPageChannels,
    showChannelsPerPage,
    setIsChannelModalOpen,
    setSelectedChannelIds,
    setGlobalSelectedChannels,
    handleAddChannel,
    handleSelectChannel,
    handleRemoveChannel,
    handleRemoveArrayItemChan,
    handlePageChangeChannel,
    handleChannelsPerPageChange,

    insurances,
    isInsuranceModalOpen,
    selectedInsuranceIds,
    globalSelectedInsuranceIds,
    selectedInsurances,
    currentPageIns,
    showInsPerPage,
    totalInsuranceItems,
    setIsInsuranceModalOpen,
    setSelectedInsuranceIds,
    setGlobalSelectedInsuranceIds,
    handleAddInsurance,
    handleSelectInsurance,
    handleRemoveInsurance,
    handleRemoveArrayItemIns,
    handlePageChangeInsurances,
    handleInsurancePerPageChange,

    handleChangeVoucherLimit,
    handleVoucherLimitBlur,

    products,
    isProductModalOpen,
    selectedProductIds,
    globalSelectedProdIds,
    selectedProducts,
    currentPageProd,
    showProdPerPage,
    totalProductItems,
    setIsProductModalOpen,
    setSelectedProductIds,
    setGlobalSelectedProdIds,
    handleAddProduct,
    handleSelectProduct,
    handleRemoveProduct,
    handleRemoveProd,
    handlePageChangeProd,
    handleProdPerPageChange,

    plans,
    isPlanModalOpen,
    selectedPlanIds,
    globalSelectedPlanIds,
    selectedPlans,
    currentPagePlan,
    showPlansPerPage,
    totalPlanItems,
    setIsPlanModalOpen,
    setSelectedPlanIds,
    setGlobalSelectedPlanIds,
    handleAddPlan,
    handleSelectPlan,
    handleRemovePlan,
    handleRemovePlans,
    handlePageChangePlans,
    handlePlansPerPageChange,
    handleSearch,

    vouchers,
    voucherCode,
    voucherUsageLimit,
    setVoucherCode,
    setVoucherUsageLimit,
    handleAddVoucher,
    handleRemoveVoucher,

    isLoadingCurrency,
    isLoadingDetail,
    isSaving,
  } = useCampaignForm(mode);

  React.useEffect(() => {
    if (isEdit && campaignId) {
      loadCampaignDetail(campaignId);
    }
  }, [isEdit, campaignId, loadCampaignDetail]);

  const ErrorModal = ({
    isOpen,
    message,
    onClose,
  }: {
    isOpen: boolean;
    message: string;
    onClose: () => void;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-md w-1/3">
          <h2 className="text-lg font-semibold mb-4">Alert</h2>
          <p>{message}</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (hasAccess === false) {
    return null;
  }

  return (
    <ContentLoadingWrapper isLoading={isSaving || isLoadingDetail}>
      <div className="flex flex-col w-full gap-4">
        <form onSubmit={handleSubmit(handleSave)} className="w-full">
          <div className="bg-white md:px-6 p-4 flex items-center">
            <div>
              <Breadcrumb className="sm:block hidden">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink>Campaign</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {isEdit ? "Edit Campaign" : "Add Campaign"}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
                {isEdit ? "Edit Campaign" : "Create New Campaign"}
              </h2>
            </div>
            <div className="flex space-x-4 ml-auto">
              <div
                onClick={goBack}
                className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-6 py-2"
              >
                {isSaving ? (
                  <span>Saving...</span>
                ) : isEdit ? (
                  <>
                    <FaCheck className="mr-2" />
                    Save
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>

          {showAlert && (
            <ErrorModal
              isOpen={showAlert}
              message={errorMessage}
              onClose={() => setShowAlert(false)}
            />
          )}

          <div className="w-full flex flex-col p-4 sm:p-6">
            <div className="bg-white md:px-6 p-4 grid grid-cols-2 gap-4">
              <div className="">
                <label htmlFor="name" className="font-normal">
                  Campaign Name
                </label>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Campaign Name is required" }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="name"
                      required
                      placeholder="Insert Campaign Name"
                      {...field}
                      className={`mt-1 block w-full h-16 ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm`}
                    />
                  )}
                />
              </div>

              <div className="">
                <label htmlFor="type" className="font-normal">
                  Type
                </label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        handleChangeType(value);
                        field.onChange(value);
                      }}
                      disabled={isEdit}
                      required
                    >
                      <SelectTrigger className="w-full h-16 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2 mt-1">
                        <SelectValue placeholder="Select a Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="embedded">Embedded</SelectItem>
                          <SelectItem value="voucher">Voucher</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="">
                <label htmlFor="start_date" className="font-normal">
                  Start Date
                </label>
                <Controller
                  name="start_date"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Start date is required" }}
                  render={({ field }) => (
                    <Input
                      type="date"
                      id="start_date"
                      required
                      placeholder="Insert start date"
                      {...field}
                      className={`mt-1 block w-full h-16 ${
                        errors.start_date ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm`}
                    />
                  )}
                />
              </div>

              <div className="">
                <label htmlFor="end_date" className="font-normal">
                  End Date
                </label>
                <Controller
                  name="end_date"
                  control={control}
                  defaultValue=""
                  rules={{ required: "End date is required" }}
                  render={({ field }) => (
                    <Input
                      type="date"
                      id="end_date"
                      required
                      placeholder="Insert end date"
                      {...field}
                      className={`mt-1 block w-full h-16 ${
                        errors.end_date ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm`}
                    />
                  )}
                />
              </div>

              <div className="">
                <label htmlFor="value_type" className="font-normal">
                  Value Type
                </label>
                <Controller
                  name="value_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        handleChangeValueType(value);
                        field.onChange(value);
                      }}
                      disabled={isEdit}
                      required
                    >
                      <SelectTrigger className="w-full h-16 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2 mt-1">
                        <SelectValue placeholder="Select Value Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="fixed">Fixed</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="">
                <label htmlFor="value" className="font-normal">
                  Value
                </label>
                <Controller
                  name="value"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Value is required" }}
                  render={({ field }) => (
                    <Input
                      type="number"
                      id="value"
                      required
                      disabled={isEdit}
                      placeholder="Insert a value"
                      {...field}
                      className={`mt-1 block w-full h-16 ${
                        errors.value ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm`}
                    />
                  )}
                />
              </div>

              <div className="">
                <label htmlFor="minimum_amount" className="font-normal">
                  Minimum Transaction Amount
                </label>
                <Controller
                  name="minimum_amount"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      type="number"
                      id="minimum_amount"
                      required
                      placeholder="Insert a minimum amount"
                      {...field}
                      className={`mt-1 block w-full h-16 ${
                        errors.minimum_amount
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm`}
                    />
                  )}
                />
              </div>

              <div className="">
                <label htmlFor="maximum_amount" className="font-normal">
                  Maximum Discount Amount
                </label>
                <Controller
                  name="maximum_amount"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      type="number"
                      id="maximum_amount"
                      required
                      placeholder="Insert a maximum amount"
                      {...field}
                      className={`mt-1 block w-full h-16 ${
                        errors.maximum_amount
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm`}
                    />
                  )}
                />
              </div>

              <div className="col-span-2">
                <div className="flex flex-col w-full">
                  <label htmlFor="value_currency" className="font-normal">
                    Currency
                  </label>
                  <Controller
                    name="value_currency"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || ""}
                        onValueChange={(currencyCode) => {
                          const selectedCurrency = currency.find(
                            (item) => item.code === currencyCode
                          );

                          handleChangeInsurance({
                            currencyName: selectedCurrency?.name || "",
                          });

                          field.onChange(currencyCode);
                        }}
                        disabled={isEdit || isLoadingCurrency}
                      >
                        <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                          <SelectValue placeholder="Select Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {currency.map((currencyItem) => (
                              <SelectItem
                                key={currencyItem.code}
                                value={currencyItem.code}
                              >
                                {currencyItem.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {isEdit && (
                <div className="flex flex-col">
                  <label className="font-normal">Status</label>
                  <input
                    type="text"
                    value={promotion.active ? "Active" : "Inactive"}
                    readOnly
                    className={`ml-2 p-2 border rounded h-12 ${
                      promotion.active ? "text-green-500" : "text-red-500"
                    } bg-white`}
                  />
                </div>
              )}

              <div className="col-span-2">
                <label className="font-normal">Channels</label>
                <div className="flex items-start mt-2">
                  <div className="border rounded bg-white overflow-y-auto flex-grow mr-2 h-32">
                    <div className="flex flex-col p-2">
                      {promotion.embedded_discount_channels.length > 0 ? (
                        promotion.embedded_discount_channels.map(
                          (channel: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center mb-1 mr-1 border border-gray-300 rounded p-1"
                            >
                              <span className="whitespace-normal">
                                {channel.channel_name || "Unknown Channel"}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveArrayItemChan(
                                    "embedded_discount_channels",
                                    index
                                  )
                                }
                                className="text-red-500 ml-auto"
                              >
                                <Trash />
                              </button>
                            </div>
                          )
                        )
                      ) : (
                        <span>No channels added</span>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex justify-center items-center">
                    <button
                      type="button"
                      onClick={handleAddChannel}
                      className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 h-10 flex items-center w-40"
                    >
                      <FaPlus className="mr-2" />
                      Channel
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <label className="font-normal">Insurances</label>
                <div className="flex items-start mt-2">
                  <div className="border rounded bg-white overflow-y-auto flex-grow mr-2 h-32">
                    <div className="flex flex-col p-2">
                      {promotion.embedded_discount_insurances.length > 0 ? (
                        promotion.embedded_discount_insurances.map(
                          (insurance: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center mb-1 mr-1 border border-gray-300 rounded p-1"
                            >
                              <span className="whitespace-normal">
                                {insurance.insurance_name ||
                                  "Unknown Insurance"}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveArrayItemIns(
                                    "embedded_discount_insurances",
                                    index
                                  )
                                }
                                className="text-red-500 ml-auto"
                              >
                                <Trash />
                              </button>
                            </div>
                          )
                        )
                      ) : (
                        <span>No insurances added</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex justify-center items-center">
                    <button
                      type="button"
                      onClick={handleAddInsurance}
                      className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 h-10 flex items-center w-40"
                      disabled={
                        promotion.embedded_discount_channels.length === 0
                      }
                    >
                      <FaPlus className="mr-2" />
                      Insurance
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <label className="font-normal">Products</label>
                <div className="flex items-start mt-2">
                  <div className="border rounded bg-white overflow-y-auto flex-grow mr-2 h-32">
                    <div className="flex flex-col p-2">
                      {promotion.embedded_discount_products.length > 0 ? (
                        promotion.embedded_discount_products.map(
                          (product: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center mb-1 mr-1 border border-gray-300 rounded p-1"
                            >
                              <span className="whitespace-normal">
                                {product.product_name || "Unknown Product"}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveProduct(index)}
                                className="text-red-500 ml-auto"
                              >
                                <Trash />
                              </button>
                            </div>
                          )
                        )
                      ) : (
                        <span>No products added</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex justify-center items-center">
                    <button
                      type="button"
                      onClick={handleAddProduct}
                      className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 h-10 flex items-center w-40"
                      disabled={
                        promotion.embedded_discount_insurances.length === 0
                      }
                    >
                      <FaPlus className="mr-2" />
                      Product
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <label className="font-normal">Plans</label>
                <div className="flex items-start mt-2">
                  <div className="border rounded bg-white overflow-y-auto flex-grow mr-2 h-32">
                    <div className="flex flex-col p-2">
                      {promotion.embedded_discount_plans.length > 0 ? (
                        promotion.embedded_discount_plans.map(
                          (plan: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center mb-1 mr-1 border border-gray-300 rounded p-1"
                            >
                              <span className="whitespace-normal">
                                {plan.name || "Unknown Plan"}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemovePlan(index)}
                                className="text-red-500 ml-auto"
                              >
                                <Trash />
                              </button>
                            </div>
                          )
                        )
                      ) : (
                        <span>No plans added</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex justify-center items-center">
                    <button
                      type="button"
                      onClick={handleAddPlan}
                      className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 h-10 flex items-center w-40"
                      disabled={
                        promotion.embedded_discount_products.length === 0
                      }
                    >
                      <FaPlus className="mr-2" />
                      Plan
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                {promotion.type === "voucher" && (
                  <div>
                    <label className="font-normal">Vouchers</label>
                    {!isEdit || !promotion.active ? (
                      <>
                        <div className="flex items-center mt-2">
                          <input
                            type="text"
                            value={voucherCode}
                            onChange={(e) => setVoucherCode(e.target.value)}
                            className="p-2 border rounded"
                            placeholder="Enter voucher code"
                          />
                          <input
                            type="number"
                            value={
                              voucherUsageLimit === 0 ? "" : voucherUsageLimit
                            }
                            onKeyDown={(e) => {
                              const currentValue = (
                                e.target as HTMLInputElement
                              ).value;

                              if (
                                e.key === "0" &&
                                (currentValue === "" ||
                                  currentValue === "0" ||
                                  e.currentTarget.selectionStart === 0)
                              ) {
                                e.preventDefault();
                                return;
                              }

                              if (
                                currentValue.length >= 5 &&
                                e.key !== "Backspace" &&
                                e.key !== "Delete" &&
                                e.key !== "ArrowLeft" &&
                                e.key !== "ArrowRight"
                              ) {
                                e.preventDefault();
                                return;
                              }

                              if (
                                !/^\d$/.test(e.key) &&
                                ![
                                  "Backspace",
                                  "Delete",
                                  "ArrowLeft",
                                  "ArrowRight",
                                  "Tab",
                                ].includes(e.key)
                              ) {
                                e.preventDefault();
                                return;
                              }
                            }}
                            onChange={(e) =>
                              handleChangeVoucherLimit(e.target.value)
                            }
                            onBlur={handleVoucherLimitBlur}
                            className="p-2 border rounded ml-2 w-24"
                            placeholder="Usage limit"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleAddVoucher(voucherCode, voucherUsageLimit)
                            }
                            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                            disabled={!voucherCode || voucherUsageLimit <= 0}
                          >
                            Add Voucher
                          </button>
                        </div>
                        <div className="mt-4">
                          {vouchers.map((voucher, index) => (
                            <div key={index} className="flex items-center mt-2">
                              <span className="mr-2">
                                {voucher.code} (Usage Limit:{" "}
                                {voucher.usageLimit})
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveVoucher(index)}
                                className="text-red-500"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-red-500">
                        Cannot add vouchers while the promotion is active.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>

        <ChannelSelectionModal
          isOpen={isChannelModalOpen}
          onClose={() => setIsChannelModalOpen(false)}
          onSelect={handleSelectChannel}
          channels={channels}
          onPageChangeChannel={handlePageChangeChannel}
          selectedChannelIds={selectedChannelIds}
          showChannelsPerPage={showChannelsPerPage}
          onChannelsPerPageChange={handleChannelsPerPageChange}
          globalSelectedChannels={globalSelectedChannels}
          setGlobalSelectedChannels={setGlobalSelectedChannels}
          onRemoveChannel={handleRemoveChannel}
        />

        <InsuranceSelectionModal
          isOpen={isInsuranceModalOpen}
          onClose={() => setIsInsuranceModalOpen(false)}
          onSelect={handleSelectInsurance}
          insurances={insurances}
          initialSelectedInsurances={selectedInsurances}
          onPageChangeIns={handlePageChangeInsurances}
          showInsPerPage={showInsPerPage}
          onInsurancePerPageChange={handleInsurancePerPageChange}
          globalSelectedInsuranceIds={globalSelectedInsuranceIds}
          setGlobalSelectedInsuranceIds={setGlobalSelectedInsuranceIds}
          currentPageIns={currentPageIns}
          onRemoveInsurance={handleRemoveInsurance}
        />

        <ProductSelectionModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onSelect={handleSelectProduct}
          products={products}
          initialSelectedProductIds={
            new Set(
              promotion.embedded_discount_products.map((p: any) => p.product_id)
            )
          }
          selectedProductIds={selectedProductIds}
          showProdPerPage={showProdPerPage}
          onProdPerPageChange={handleProdPerPageChange}
          globalSelectedProdIds={globalSelectedProdIds}
          setGlobalSelectedProdIds={setGlobalSelectedProdIds}
          onPageChangeProd={handlePageChangeProd}
          currentPageProd={currentPageProd}
          onRemoveProd={handleRemoveProd}
        />

        <PlanSelectionModal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          onSelect={handleSelectPlan}
          plans={plans}
          products={promotion.embedded_discount_products.map((p: any) => ({
            id: p.product_id,
            name: p.product_name,
          }))}
          preSelectedPlanIds={
            new Set(
              promotion.embedded_discount_plans.map((p: any) => p.plan_id)
            )
          }
          selectedProductIds={
            new Set(
              promotion.embedded_discount_products.map((p: any) => p.product_id)
            )
          }
          onPageChangePlan={handlePageChangePlans}
          totalPlanItems={totalPlanItems}
          pagePlan={currentPagePlan}
          showPlansPerPage={showPlansPerPage}
          onPlansPerPageChange={handlePlansPerPageChange}
          globalSelectedPlanIds={globalSelectedPlanIds}
          setGlobalSelectedPlanIds={setGlobalSelectedPlanIds}
          globalSelectedProdIds={globalSelectedProdIds}
          onRemovePlan={handleRemovePlans}
          onSearch={handleSearch}
        />
      </div>
    </ContentLoadingWrapper>
  );
}
