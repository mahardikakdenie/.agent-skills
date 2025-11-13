"use client";

import { useProducts } from "@/app/product-category/hooks";
import { useParams } from "next/navigation";

export default function PlanDetail() {
  const { id } = useParams();

  const { plan } = useProducts({
    planId: id as string,
  });

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
}
