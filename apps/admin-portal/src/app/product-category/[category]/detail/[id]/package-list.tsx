"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import noData from "/public/images/no-data.webp";
import { Plus, Upload } from "react-feather";
import { Button } from "@/components/ui/button";
import AppURL from "@/constants/app-url.const";
import { useProducts } from "@/app/product-category/hooks";
import type { PackageDto } from "@/services/product/api/product.types";
import { DataTable } from "@/components/ui/DataTable";
import { createPackageTableColumns } from "@/components/tableConfig/packageTableConfig";

export default function PackageList(
  props: Readonly<{ id: string; category: string }>
) {
  const router = useRouter();
  const { id, category } = props;

  const [adultFilter, setAdultFilter] = useState("");
  const [childrenFilter, setChildrenFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [occupationClassFilter, setOcupationClassFilter] = useState("");

  const {
    packages,
    packagesMeta,
    packagesTotalPages,
    packagesTotalItems,
    isLoadingPackages,
    deletePackage,
    productConfig,
    canEdit,
    canCreate,
    canDelete,
    packagesPage,
    packagesRowsPerPage,
    handlePackagesPageChange,
    handlePackagesRowsPerPageChange,
    handlePackagesPrevPage,
    handlePackagesNextPage,
    refetchPackages,
  } = useProducts({
    planId: id,
    category,
  });

  const sortedPackages = useMemo(() => {
    if (!packages) return [];
    return [...packages].sort((a, b) => {
      const durationA = a.search_params.duration_to || 0;
      const durationB = b.search_params.duration_to || 0;
      return durationA - durationB;
    });
  }, [packages]);

  const filteredPackages = useMemo(() => {
    let filtered = sortedPackages;

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

    return filtered;
  }, [
    sortedPackages,
    adultFilter,
    childrenFilter,
    occupationClassFilter,
    ageFilter,
  ]);

  const columns = useMemo(
    () =>
      createPackageTableColumns({
        page: packagesPage,
        rowsPerPage: packagesRowsPerPage,
        canEdit,
        canDelete,
        productConfig,
        category,
        planId: id,
        onEdit: (packageId: string) => {
          router.push(
            `${AppURL.productCatalogEditPackage(category, id, packageId)}`
          );
        },
        onDelete: deletePackage,
      }),
    [
      packagesPage,
      packagesRowsPerPage,
      canEdit,
      canDelete,
      productConfig,
      category,
      id,
      router,
      deletePackage,
    ]
  );

  useEffect(() => {
    if (id) {
      refetchPackages();
    }
  }, [id, refetchPackages]);

  return (
    <>
      <div className="flex justify-end gap-x-4 mb-4">
        <Button
          className="btn btn-primary"
          disabled={!canEdit}
          onClick={() =>
            router.push(`${AppURL.productCatalogUpload(category, id)}`)
          }
        >
          <Upload className="w-5 h-5 mr-2" /> Upload Packages
        </Button>
        <Button
          className="bg-[#F5BA41] hover:bg-[#F5BA41]/80 text-black"
          disabled={!canCreate}
          onClick={() =>
            router.push(`${AppURL.productCatalogAddPackage(category, id)}`)
          }
        >
          <Plus className="w-5 h-5 mr-2" /> Add Package
        </Button>
      </div>

      {category === "personal-accident" && (
        <div className="w-full pt-4 bg-white rounded-lg overflow-auto grid sm:grid-cols-2 gap-4 mb-4">
          <select
            value={occupationClassFilter}
            onChange={(e) => setOcupationClassFilter(e.target.value)}
            className="border px-2 py-1 rounded h-16 text-sm capitalize"
          >
            <option value="">All Occupation Class</option>
            {Array.from(
              new Set(
                sortedPackages
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
                  sortedPackages
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
                    <option value={ages.join(",")}>
                      {firstAge}-{lastAge}
                    </option>
                  )}
                </>
              );
            })()}
          </select>
        </div>
      )}

      {category === "travel" && (
        <div className="w-full pt-4 bg-white rounded-lg overflow-auto grid grid-cols-2 gap-4 mb-4">
          <select
            value={adultFilter}
            onChange={(e) => setAdultFilter(e.target.value)}
            className="border px-2 py-1 rounded h-16 text-sm"
          >
            <option value="">All Adults</option>
            {Array.from(
              new Set(
                sortedPackages
                  .map((pkg) => pkg.search_params.adult)
                  .filter(Boolean)
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
            className="border px-2 py-1 rounded h-16 text-sm"
          >
            <option value="">All Children</option>
            {Array.from(
              new Set(
                sortedPackages
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

      <DataTable
        columns={columns}
        data={filteredPackages}
        loading={isLoadingPackages}
        noDataText="No package data available"
        pagination={{
          page: packagesPage,
          totalPages: packagesTotalPages,
          rowsPerPage: packagesRowsPerPage,
          totalItems: packagesTotalItems,
          onPageChange: handlePackagesPageChange,
          onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
            handlePackagesRowsPerPageChange(e);
          },
        }}
      />
    </>
  );
}
