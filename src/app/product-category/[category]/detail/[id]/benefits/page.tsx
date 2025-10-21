"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useProducts } from "@/app/product-category/hooks";

export default function PlanBenefit() {
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
      <h2>Plan Benefit</h2>
      <h1 className="text-primary font-bold mb-4 mt-5">
        {plan?.name.split("|").map((item: string, i: number) => (
          <span key={i}>
            {item}
            <br />
          </span>
        ))}
      </h1>
    </div>
  );
};