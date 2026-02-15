"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChannelResponse,
  InsuranceResponse,
  PlanResponse,
  ProductResponse,
} from "../../../dto/promotion.details.dto";
import AppURL from "@/constants/app-url.const";
import { channelService } from "@/services/channel/api/channel.service";
import { productService } from "@/services/product/api/product.service";
import { promotionService } from "@/services/promotion/api/promotion.service";

export default function ViewPromotionDetails() {
  const [promotion, setPromotion] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [channelNames, setChannelNames] = useState<Map<string, string>>(
    new Map()
  );
  const [insuranceNames, setInsuranceNames] = useState<Map<string, string>>(
    new Map()
  );
  const [productNames, setProductNames] = useState<Map<string, string>>(
    new Map()
  );
  const [planNames, setPlanNames] = useState<Map<string, string>>(new Map());
  const [vouchers, setVouchers] = useState<{
    code: string;
    usage_limit: number;
    used_count: number;
  }[]>([]);

  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!id) return; // Exit if no ID is available

    const fetchPromotionDetails = async () => {
      try {
        const response: any = await promotionService.getCampaignById(id as string);
        const promotionData =
          response?.data?.[0] ?? response?.data?.data?.[0] ?? null;
        setPromotion(promotionData);

        if (!promotionData) {
          return;
        }

        const fetchNames = async () => {
          const channelFetches = promotionData.embedded_discount_channels.map(
              async (channel: { channel_id: string }) => {
                const res: any = await channelService.getChannelByIdV1(channel.channel_id);
                return res?.data ?? res;
              }
          );
          const insuranceFetches = promotionData.embedded_discount_insurances.map(
              async (insurance: { insurance_id: string }) => {
                const res: any = await productService.getInsuranceById(insurance.insurance_id);
                return res?.data ?? res;
              }
          );
          const productFetches = promotionData.embedded_discount_products.map(
              async (product: { product_id: string }) => {
                const res: any = await productService.getProductById(product.product_id);
                return res;
              }
          );
          const planFetches = promotionData.embedded_discount_plans.map(
              async (plan: { plan_id: string }) => {
                const res: any = await productService.getPlanById(plan.plan_id);
                return res?.data ?? res;
              }
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
              channelResponses.map((res: ChannelResponse) => [res.id, res.name])
            )
          );
          setInsuranceNames(
            new Map(
              insuranceResponses.map((res: InsuranceResponse) => [
                res.id,
                res.name,
              ])
            )
          );
          setProductNames(
            new Map(
              productResponses
                .map((res: ProductResponse | any) => {
                  const normalized = res?.data?.[0] ?? res?.data ?? res;
                  return normalized?.id && normalized?.name
                    ? [normalized.id, normalized.name]
                    : null;
                })
                .filter(Boolean) as [string, string][]
            )
          );
          setPlanNames(
            new Map(
              planResponses.map((res: PlanResponse) => [res.id, res.name])
            )
          );
        };

        await fetchNames();

        if (promotionData.type === "voucher") {
          const vouchersResponse: any = await promotionService.getVoucherById(
            promotionData.campaign_id,
          );
          setVouchers(vouchersResponse?.data ?? vouchersResponse?.data?.data ?? []);
        }
      } catch (err) {
        setError("Failed to fetch promotion details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleEditCampaign = (id: string) => {
    router.push(`${AppURL.promotionCampaignDetail}/${id}`);
  };

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("en-GB", options).format(new Date(date));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!promotion) {
    return <p>No promotion details available.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Promotion Details</h2>
        <div>
          <p><strong>Name:</strong> {promotion.name}</p>
          <p><strong>Promotion Type:</strong> {promotion.type}</p>
          <p><strong>Start Date:</strong> {formatDate(promotion.start_date)}</p>
          <p><strong>End Date:</strong> {formatDate(promotion.end_date)}</p>
          <p><strong>Value:</strong> {promotion.value_currency} {promotion.value}</p>
          <p><strong>Status:</strong> {promotion.active ? "Active" : "Inactive"}</p>
          <p><strong>Minimum Amount:</strong> {promotion.minimum_amount}</p>
          <p><strong>Maximum Amount:</strong> {promotion.maximum_amount}</p>
        </div>
      </div>

      <div className="mb-8 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Associated Details</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="font-semibold">Channels</p>
            {promotion.embedded_discount_channels.length > 0 ? (
              promotion.embedded_discount_channels.map(
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
          <div>
            <p className="font-semibold">Insurances</p>
            {promotion.embedded_discount_insurances.length > 0 ? (
              promotion.embedded_discount_insurances.map(
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
          <div>
            <p className="font-semibold">Products</p>
            {promotion.embedded_discount_products.length > 0 ? (
              promotion.embedded_discount_products.map(
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
          <div>
            <p className="font-semibold">Plans</p>
            {promotion.embedded_discount_plans.length > 0 ? (
              promotion.embedded_discount_plans.map(
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
      </div>

      {promotion.type === "voucher" && vouchers.length > 0 && (
        <div className="mb-8 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">Voucher Details</h2>
          <div>
            {vouchers.map((voucher, index) => (
              <div key={index} className="mb-4">
                <p><strong>Code:</strong> {voucher.code}</p>
                <p><strong>Usage Limit:</strong> {voucher.usage_limit}</p>
                <p><strong>Used Count:</strong> {voucher.used_count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={() => handleEditCampaign(promotion.campaign_id)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit
        </button>
      </div>
    </div>
  );
};
