"use client";

import { useProducts } from "@/app/(protected)/product-catalog/hooks";
import WithSidebar from "@/hoc/with-sidebar";
import { useEffect } from "react";
import { useParams } from "next/navigation";

const PlanDetail = () => {
  const { id } = useParams();
  const { plan, fetchPlanById } = useProducts();

  useEffect(() => {
    if (id && typeof id === "string") {
      fetchPlanById(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2>Plan Detail</h2>
      <h1 className="text-primary font-bold mb-4 mt-5">
        {plan?.name.split("|").map((item: any, i: any) => (
          <span key={i}>
            {item}
            <br />
          </span>
        ))}
      </h1>
    </div>
  );
};

const PlanDetailWithSidebar = (params: any) => WithSidebar(PlanDetail)(params);

export default PlanDetailWithSidebar;
