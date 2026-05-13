"use client";
import { useParams } from "next/navigation";
import CampaignForm from "@/components/forms/campaign-form";

export default function EditPromotionPage() {
  const params = useParams();
  const id = params.id as string;

  return <CampaignForm mode="edit" campaignId={id} />;
}
