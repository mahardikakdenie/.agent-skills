"use client";
import { useProducts } from "@/app/product-catalog/hooks";
import WithSidebar from "@/hoc/with-sidebar";
import { useEffect } from "react";

const PlanDetail = (props: { params: { id: string } }) => {
  const { plan, fetchPlanById } = useProducts();
  const { id } = props.params;
  useEffect(() => {
    fetchPlanById(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2>Plan Detail</h2>
      <h1 className="text-primary font-bold mb-4 mt-5">
        {plan?.name.split("|").map((item: any, i: any) => {
          return (
            <span key={i}>
              {item}
              <br />
            </span>
          );
        })}
      </h1>
    </div>
  );
};

const PlanBenebitsWithSidebar = (props: { params: { id: string } }) =>
  WithSidebar(PlanDetail)(props);

export default PlanBenebitsWithSidebar;
