"use client";
import WithSidebar from "@/hoc/with-sidebar";
import useRequireAuth from "@/hooks/useRequireAuth";

import undercontractionPage from "/public/images/undercontraction.webp";
import Image from "next/image";

const ProductCategory = () => {
  useRequireAuth();

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="w-full p-6 m-2 bg-white rounded flex flex-col justify-center items-center gap-3 frame-body">
        <Image
          alt="no data"
          src={undercontractionPage}
          width={400}
          className="max-w-full"
        />
      </div>
    </div>
  );
};
const ProductCategoryWithSidebar = (params: any) =>
  WithSidebar(ProductCategory)(params);
export default ProductCategoryWithSidebar;
