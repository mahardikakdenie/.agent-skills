"use client";
import WithSidebar from "@/hoc/with-sidebar";
import useRequireAuth from "@/hooks/useRequireAuth";
import {
  ProductCatalogDto,
  ProductCatalogService,
} from "@/services/product-catalog.service";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import PackageList from "./package-list";

const DetaildPage = ({ params }: { params: { id: string } }) => {
  useRequireAuth();
  const [plan, setPlan] = useState<ProductCatalogDto | null>(null);
  const { id } = params;
  useEffect(() => {
    if (id) {
      const productCatalogService = new ProductCatalogService();
      productCatalogService.getPlanById(id).then((response) => {
        setPlan(response.data[0]);
      });
    }
  }, [id]);
  return (
    plan && (
      <>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-primary font-bold mb-4">
            {plan?.name.split("|").map((item, i) => {
              return (
                <span key={i}>
                  {item}
                  <br />
                </span>
              );
            })}
          </h1>
          <h2 className="text-primary font-semibold mb-2">Products</h2>
          <ul>
            <li key={plan?.products.id} className="mb-4">
              <h3 className="text-primary font-medium mb-2">
                {plan?.products.name}
              </h3>
              <h4 className="text-md font-semibold mb-1">Insurances</h4>
              <ul className="list-disc list-inside ml-4 mb-2">
                <li key={plan?.products.insurances.id} className="text-sm">
                  {plan?.products.insurances.name}
                </li>
              </ul>
              <h4 className="text-md font-semibold mb-1">Categories</h4>
              <ul className="list-disc list-inside ml-4">
                <li key={plan?.products.categories.id} className="text-sm">
                  {plan?.products.categories.name}
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <PackageList id={id} />
      </>
    )
  );
};

const DetailProductCatalogWithSidebar = (params: any) =>
  WithSidebar(DetaildPage)(params);
export default DetailProductCatalogWithSidebar;
