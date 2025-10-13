"use client";

import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
  TableFooter,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import {
  PackageDto,
  ProductCatalogService,
} from "@/services/product-catalog.service";
import { useParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import noData from "/public/images/no-data.webp";
import { ChevronLeft, ChevronRight, Plus, Trash, Upload } from "react-feather";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth.context";
import {
  FORBIDDEN,
  PRODUCT_CATALOG_ADD_PACKAGE,
  PRODUCT_CATALOG_EDIT_PACKAGE,
  PRODUCT_CATALOG_UPLOAD,
} from "@/constants/routes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProducts } from "../../../hooks";
import { ProductConfig } from "@/services/product-config.service";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { formatCurrency } from "@/components/forms/product-catalog/package.form";

type ShownRowType = (string | JSX.Element | number);

function generateHeaders(product: ProductConfig): string[] {
  const dynamicHeaders = Object.keys(product.search_configs).map((key) =>
    key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );

  return ["No.", ...dynamicHeaders, "Currency", "Premium", "Action"];
}


function generateRowData(
  packages: PackageDto[],
  headers: string[],
  router: AppRouterInstance,
  category: string,
  id: string,
  deletePackage: (id: string) => Promise<any>,
  fetchPackages: () => void,
  canEdit: boolean,
  canDelete: boolean,
  searchConfigs: any
) {
  return packages.map((pkg, index) => {
    return headers.map((header) => {
      switch (header) {
        case "No.":
          return index + 1;
        case "Currency":
          return pkg.currency;
        case "Premium":
          return formatCurrency(pkg.premium.toString());
        case "Action":
          return (
            <div className="flex gap-x-2" key={pkg.id}>
              <TooltipProvider>
                <Tooltip>
                  <Button
                    type="button"
                    variant="default"
                    className="rounded-full"
                    disabled={!canEdit}
                    onClick={() =>
                      router.push(
                        PRODUCT_CATALOG_EDIT_PACKAGE(category, id, pkg.id)
                      )
                    }
                  >
                    Edit
                  </Button>
                  <TooltipContent>
                    <p className="text-sm">Edit</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={!canDelete}
                      onClick={() => {
                        if (confirm("Are you sure to delete this row?")) {
                          deletePackage(pkg.id);
                          alert("Row deleted successfully.");
                          setTimeout(fetchPackages, 1000);
                        }
                      }}
                    >
                      <Trash className="w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Remove</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        default: {
          const key = header.toLowerCase().replace(/\s+/g, "_");
          const config = searchConfigs[key];

          if (config && config.type === "range") {
            const from = pkg.search_params[`${key}_from`];
            const to = pkg.search_params[`${key}_to`];

            return `${from ?? "-"} - ${to ?? "-"}`;
          }

          const value = pkg.search_params[key];

          if (Array.isArray(value)) {
            return value.join(", ");
          } else if (value !== undefined && value !== null) {
            return String(value);
          } else {
            return "-";
          }
        }
      }
    });
  });
}

export default function PackageList(props: Readonly<{ id: string; category: string; }>) {
  const [packages, setPackages] = useState<PackageDto[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<ShownRowType[][]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(180);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [adultFilter, setAdultFilter] = useState("");
  const [childrenFilter, setChildrenFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [occupationClassFilter, setOcupationClassFilter] = useState("");
  const { id } = props;
  const productCatalogService = new ProductCatalogService();
  const { category } = useParams();

  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [canCreate, setCanCreate] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);
  const routerN = useRouter();

  const [tableHeaders, setTableHeaders] = useState<string[]>([]);
  const { deletePackage, productConfig, fetchProductConfigByType } = useProducts();

  const fetchPackages = () => {
    productCatalogService
        .getPackagesByPlanId(id, page, rowsPerPage)
        .then((response) => {
            const sortedPackages = response.data.sort((a, b) => {
                const durationA = a.search_params.duration_to;
                const durationB = b.search_params.duration_to;
                return durationA - durationB;
            });

            setPackages(sortedPackages);
            setPage(response.meta.page);
            setTotalItems(response.meta.total);

            const newFilteredPackages = generateRowData(sortedPackages, tableHeaders, router, category as string, id, deletePackage, fetchPackages, canEdit, canDelete, productConfig?.search_configs);

            setFilteredPackages(newFilteredPackages);
        });
    };
  const { permissionList } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Product Category.Read");
      const editBtn = permissionList.includes("Product Category.Update");
      const deleteBtn = permissionList.includes("Product Category.Delete");
      const createBtn = permissionList.includes("Product Category.Create");

      setCanEdit(editBtn);
      setCanDelete(deleteBtn);
      setCanCreate(createBtn);

      if (!access) {
        router.push(FORBIDDEN);
      }
    };

    checkAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routerN]);

  useEffect(() => {
    if(id !== undefined && page !== undefined && rowsPerPage !== undefined && tableHeaders !== undefined && canEdit !== undefined && canDelete !== undefined && productConfig !== undefined) {
        fetchPackages();
    }
  }, [id, page, rowsPerPage, tableHeaders, canEdit, canDelete, productConfig]);

  const handleFilter = () => {
    let filtered = packages;

    if (adultFilter) {
      filtered = filtered.filter(
        (pkg) => pkg.search_params.adult === Number(adultFilter)
      );
    }

    if (childrenFilter) {
      filtered = filtered.filter(
        (pkg) => pkg.search_params.children === Number(childrenFilter)
      );
    }

    // PA
    if (occupationClassFilter) {
      filtered = filtered.filter(
        (pkg) =>
          JSON.stringify(pkg.search_params.occupation_class) ==
          JSON.stringify(occupationClassFilter.split(","))
      );
    }

    if (ageFilter) {
      filtered = filtered.filter((pkg) => pkg.search_params.age == ageFilter);
    }

    const newFilteredPackages = generateRowData(filtered, tableHeaders, router, category as string, id, deletePackage, fetchPackages, canEdit, canDelete, productConfig?.search_configs);

    setFilteredPackages(newFilteredPackages);
  };

  useEffect(() => {
    handleFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adultFilter, childrenFilter, ageFilter, occupationClassFilter]);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };
  const router = useRouter();

  useEffect(() => {
    if(category) {
        (async () => {
            await fetchProductConfigByType(category as string);
        })();
    }
  }, [category]);

  useEffect(() => {
    if(productConfig) {
        const newTableHeaders = generateHeaders(productConfig);
        
        setTableHeaders(newTableHeaders);
    }
  }, [productConfig]);

  return (
    <>
      <div className="flex justify-end gap-x-4">
        <Button
          className="btn btn-primary"
          disabled={!canEdit}
          onClick={() =>
            router.push(PRODUCT_CATALOG_UPLOAD(category as string, id))
          }
        >
          <Upload className="w-5 h-5 mr-2" /> Upload Packages
        </Button>
        <Button
          className="bg-[#F5BA41] hover:bg-[#F5BA41]/80 text-black"
          disabled={!canCreate}
          onClick={() =>
            router.push(PRODUCT_CATALOG_ADD_PACKAGE(category as string, id))
          }
        >
          <Plus className="w-5 h-5 mr-2" /> Add Package
        </Button>
      </div>
      {category === "personal-accident" && (
        <div className="w-full py-4 bg-white rounded-lg overflow-aut mb-4 grid sm:grid-cols-2 gap-4">
          <>
            <select
              value={occupationClassFilter}
              onChange={(e) => setOcupationClassFilter(e.target.value)}
              className="border px-2 py-1 rounded h-16 text-sm capitalize"
            >
              <option value="">All Ocupation Class</option>
              {Array.from(
                new Set(
                  packages
                    .map((pkg) => String(pkg.search_params.occupation_class))
                    .filter((occupation_class) => occupation_class)
                )
              )
                .sort((a, b) => a.localeCompare(b))
                .map((occupation_class, index) => (
                  <option key={index} value={occupation_class}>
                    {occupation_class}
                  </option>
                ))}
            </select>
            <select
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
              className="border px-2 py-1 rounded h-16 text-sm capitalize"
            >
              <option value="">All Ages</option>
              {(() => {
                const ages = Array.from(
                  new Set(
                    packages
                      .map((pkg) => String(pkg.search_params.age))
                      .filter((age) => age)
                  )
                ).sort((a, b) => a.localeCompare(b));

                const firstAge = ages[0] ? ages[0].split(",")[0] : "";
                const lastAge = ages[ages.length - 1]
                  ? ages[ages.length - 1].split(",").pop()
                  : "";
                return (
                  <>
                    {firstAge && (
                      <option value={ages}>
                        {firstAge}-{lastAge}
                      </option>
                    )}
                  </>
                );
              })()}
            </select>
          </>
        </div>
      )}
      {category === "travel" && (
        <div className="w-full p-4 sm:p-6 bg-white rounded-lg overflow-aut mb-4 grid grid-cols-2 gap-4">
          <select
            value={adultFilter}
            onChange={(e) => setAdultFilter(e.target.value)}
            className="border px-2 py-1 rounded h-[44px] text-sm"
          >
            <option value="">All Adults</option>
            {Array.from(
              new Set(
                packages.map((pkg) => pkg.search_params.adult).filter(Boolean)
              )
            )
              .sort((a, b) => a - b)
              .map((adult, index) => (
                <option key={index} value={adult}>
                  {adult}
                </option>
              ))}
          </select>
          <select
            value={childrenFilter}
            onChange={(e) => setChildrenFilter(e.target.value)}
            className="border px-2 py-1 rounded h-[44px] text-sm"
          >
            <option value="">All Children</option>
            {Array.from(
              new Set(
                packages
                  .map((pkg) => pkg.search_params.children)
                  .filter(Boolean)
              )
            )
              .sort((a, b) => a - b)
              .map((children, index) => (
                <option key={index} value={children}>
                  {children}
                </option>
              ))}
          </select>
        </div>
      )}
      <div className="w-full bg-white rounded-lg overflow-auto">
        <Table className="table-search-params">
          <TableHeader>
            <TableRow>
              {tableHeaders.map((th) => (
                <TableHead key={th}>{th}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPackages.length > 0 ? (
              filteredPackages.map((fp, fpIndex) => (
                <TableRow key={fpIndex}>
                  {fp.map((fpRow, fpRowIndex) => (
                    <TableCell key={fpRowIndex}>{fpRow}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:!bg-white">
                <TableCell colSpan={8}>
                  <div className="min-h-96 flex flex-col gap-4 items-center justify-center py-50">
                    <Image alt="no data" src={noData} width={200} /> No
                    transaction data available
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8}>
                <div className="flex justify-center items-center gap-2 font-normal">
                  <label htmlFor="rowsPerPage">Showing:</label>
                  <select
                    id="rowsPerPage"
                    className="p-2 border rounded"
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                  >
                    {[200, 300, 400, 500, 1000].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span className="mr-2">of {totalItems} items</span>
                  <button
                    onClick={() => setPage((prevState) => prevState - 1)}
                    disabled={page === 1}
                    title="Previous"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    onClick={() => setPage((prevState) => prevState + 1)}
                    disabled={page == Math.ceil(totalItems / rowsPerPage)}
                    title="Next"
                  >
                    <ChevronRight />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}
