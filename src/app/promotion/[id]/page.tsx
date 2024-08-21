"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import WithSidebar from '@/hoc/with-sidebar';
import { PromotionDetails } from '../dto/promotion.details.dto';
import { PromotionService } from '@/services/promotion.service';

const ViewPromotionDetails: React.FC = () => {
  const [promotion, setPromotion] = useState<PromotionDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!id) return; // Exit if no ID is available

    const fetchPromotionDetails = async () => {
      const promotionService = new PromotionService();

      try {
        const response = await promotionService.getPromotionCampaignById(id as string);
        setPromotion(response.data[0]);
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
            promotion.embedded_discount_channels.map((channel) => (
              <p key={channel.channel_id}>Channel ID: {channel.channel_id}</p>
            ))
          ) : (
            <p>No channels</p>
          )}
        </div>
        <div>
          <p><strong>Insurances</strong></p>
          {promotion.embedded_discount_insurances.length > 0 ? (
            promotion.embedded_discount_insurances.map((insurance) => (
              <p key={insurance.insurance_id}>Insurance ID: {insurance.insurance_id}</p>
            ))
          ) : (
            <p>No insurances</p>
          )}
        </div>
        <div>
          <p><strong>Products</strong></p>
          {promotion.embedded_discount_products.length > 0 ? (
            promotion.embedded_discount_products.map((product) => (
              <p key={product.product_id}>Product ID: {product.product_id}</p>
            ))
          ) : (
            <p>No products</p>
          )}
        </div>

        <div>
          <p><strong>Plans</strong></p>
          {promotion.embedded_discount_plans.length > 0 ? (
            promotion.embedded_discount_plans.map((plan) => (
              <p key={plan.plan_id}>Plan ID: {plan.plan_id}</p>
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