import { useCategories } from "@/app/masterdata/product-category/hooks";
import AppURL from "@/constants/app-url.const";
import { withWildcard } from "@/helpers/route.helper";
import { ProductCategories } from "@/services/masterdata/product-category.service";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

const ProductCategorySidebar = ({
  isActive,
  handleMenuClick,
}: {
  isActive: (sidebar: string) => boolean;
  handleMenuClick: () => void;
}) => {
  const { fetchCategories } = useCategories();

  const [items, setItems] = useState<ProductCategories[]>();

  useEffect(() => {
    (async () => {
      try {
        const categories: ProductCategories[] | undefined =
          await fetchCategories();

        if (categories) {
          const newItems = categories.map((cat) => {
            return {
              ...cat,
              display_name: cat.name
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
            };
          });

          setItems(newItems);
        }
      } catch (error) {
        console.error(`Error fetching categories: ${error}`);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <li className="mt-2 text-sm">
        <strong>Product Category</strong>
      </li>
      {items ? (
        items.map((item) => (
          <li key={item.id}>
            <Link
              href={AppURL.productCatalogCategory(item.name)}
              className={`hover:text-[#006EA7] flex text-sm items-center gap-2 p-2 ${
                isActive(withWildcard(AppURL.productCatalogCategory(item.name)))
                  ? "font-bold bg-[#CCE2EC] rounded-md hover:text-black"
                  : ""
              }`}
              onClick={handleMenuClick}
            >
              {item.icon && (
                <Image
                  src={item.icon}
                  alt={item.display_name ?? ""}
                  width={28}
                  height={28}
                />
              )}
              {item.display_name}
            </Link>
          </li>
        ))
      ) : (
        <React.Fragment>
          {new Array(5).fill(null).map((_, index) => (
            <li key={index}>
              <Skeleton height={28} highlightColor="#006EA7" />
            </li>
          ))}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ProductCategorySidebar;
