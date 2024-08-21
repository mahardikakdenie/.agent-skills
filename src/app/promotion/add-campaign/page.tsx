"use client";
import WithSidebar from "@/hoc/with-sidebar";
import useRequireAuth from "@/hooks/useRequireAuth";
import { useState } from "react";

const AddPromotionCampaignPage = () => {
    useRequireAuth();
    const [promotion, setPromotion] = useState<any>(null);
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Promotion Campaign Details</h2>
          <div className="mb-2">
            <span className="font-semibold">Campaign Name: </span>
         
          </div>
        </div>
      </div>
    );
};

const AddPromotionnWithSidebar = (params: any) =>
  WithSidebar(AddPromotionCampaignPage)(params);
export default AddPromotionnWithSidebar;
