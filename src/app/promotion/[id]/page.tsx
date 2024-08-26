"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import WithSidebar from '@/hoc/with-sidebar';
import { PromotionDetails } from '../dto/promotion.details.dto';
import { PromotionService } from '@/services/promotion.service';
import { PlanService } from '@/services/plan.services';
import { ChannelService } from '@/services/channel.services';
import { InsuranceService } from '@/services/insurance.services';
import { ProductService } from '@/services/product.services';

// Define types for API responses
interface ChannelResponse {
  id: string;
  name: string;
}

interface InsuranceResponse {
  id: string;
  name: string;
}

interface ProductResponse {
  id: string;
  name: string;
}

interface PlanResponse {
  id: string;
  name: string;
}

const ViewPromotionDetails: React.FC = () => {
  const [promotion, setPromotion] = useState<PromotionDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [channelNames, setChannelNames] = useState<Map<string, string>>(new Map());
  const [insuranceNames, setInsuranceNames] = useState<Map<string, string>>(new Map());
  const [productNames, setProductNames] = useState<Map<string, string>>(new Map());
  const [planNames, setPlanNames] = useState<Map<string, string>>(new Map());
  
  const { id } = useParams();
  const router = useRouter();
  const promotionService = new PromotionService();
  const planService = new PlanService();
  const channelService = new ChannelService();
  const insuranceService = new InsuranceService();
  const productService = new ProductService();

  useEffect(() => {
    if (!id) return; // Exit if no ID is available

    const fetchPromotionDetails = async () => {
      try {
        const response = await promotionService.getPromotionCampaignById(id as string);
        setPromotion(response.data[0]);

        // Fetch names for channels, insurances, products, and plans
        const fetchNames = async () => {
          const channelFetches = response.data[0].embedded_discount_channels.map((channel: { channel_id: string }) =>
            channelService.getChannelById(channel.channel_id)
          );
          const insuranceFetches = response.data[0].embedded_discount_insurances.map((insurance: { insurance_id: string }) =>
            insuranceService.getInsuranceById(insurance.insurance_id)
          );
          const productFetches = response.data[0].embedded_discount_products.map((product: { product_id: string }) =>
            productService.getProductById(product.product_id)
          );
          const planFetches = response.data[0].embedded_discount_plans.map((plan: { plan_id: string }) =>
            planService.getPlanById(plan.plan_id)
          );

          const [channelResponses, insuranceResponses, productResponses, planResponses] = await Promise.all([
            Promise.all(channelFetches),
            Promise.all(insuranceFetches),
            Promise.all(productFetches),
            Promise.all(planFetches),
          ]);

          setChannelNames(new Map(channelResponses.map((res: ChannelResponse) => [res.id, res.name])));
          setInsuranceNames(new Map(insuranceResponses.map((res: InsuranceResponse) => [res.id, res.name])));
          setProductNames(new Map(productResponses.map((res: ProductResponse) => [res.id, res.name])));
          setPlanNames(new Map(planResponses.map((res: PlanResponse) => [res.id, res.name])));
        };

        await fetchNames();
      } catch (err) {
        setError('Failed to fetch promotion details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionDetails();
  }, [id]);

  const handleEditCampaign = (id: string) => {
    router.push("/promotion/edit-campaign/" + id);
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
    <div className="p-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Promotion Details</h1>

      <div className="mb-4">
        <p><strong>Name:</strong> {promotion.name}</p>
        <p><strong>Type:</strong> {promotion.type}</p>
        <p><strong>Start Date:</strong> {new Date(promotion.start_date).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> {new Date(promotion.end_date).toLocaleDateString()}</p>
        <p><strong>Value:</strong> {promotion.value} {promotion.value_currency}</p>
        <p><strong>Status:</strong> {promotion.active ? 'Active' : 'Inactive'}</p>
        <p><strong>Minimum Amount:</strong> {promotion.minimum_amount}</p>
        <p><strong>Maximum Amount:</strong> {promotion.maximum_amount}</p>
      </div>

      <div className="mb-4">
        <div>
          <p><strong>Channels</strong></p>
          {promotion.embedded_discount_channels.length > 0 ? (
            promotion.embedded_discount_channels.map((channel: { channel_id: string }) => (
              <p key={channel.channel_id}>{channelNames.get(channel.channel_id) || 'Unknown'}</p>
            ))
          ) : (
            <p>No channels</p>
          )}
        </div>
        <div>
          <p><strong>Insurances</strong></p>
          {promotion.embedded_discount_insurances.length > 0 ? (
            promotion.embedded_discount_insurances.map((insurance: { insurance_id: string }) => (
              <p key={insurance.insurance_id}>{insuranceNames.get(insurance.insurance_id) || 'Unknown'}</p>
            ))
          ) : (
            <p>No insurances</p>
          )}
        </div>
        <div>
          <p><strong>Products</strong></p>
          {promotion.embedded_discount_products.length > 0 ? (
            promotion.embedded_discount_products.map((product: { product_id: string }) => (
              <p key={product.product_id}>{productNames.get(product.product_id) || 'Unknown'}</p>
            ))
          ) : (
            <p>No products</p>
          )}
        </div>

        <div>
          <p><strong>Plans</strong></p>
          {promotion.embedded_discount_plans.length > 0 ? (
            promotion.embedded_discount_plans.map((plan: { plan_id: string }) => (
              <p key={plan.plan_id}>{planNames.get(plan.plan_id) || 'Unknown'}</p>
            ))
          ) : (
            <p>No plans</p>
          )}
        </div>

      </div>
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

const PromotionWithSidebar = WithSidebar(ViewPromotionDetails);
export default PromotionWithSidebar;
