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
import { formatMoney } from "@/lib/formatter";
import { useParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import noData from "/public/images/no-data.webp";
import { ChevronLeft, ChevronRight, Plus, Trash, Upload } from "react-feather";
import { Button } from "@/components/ui/button";
import { hasPermission } from "@/context/auth.context";
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
import { useProducts } from "../../hooks";

export default function PackageList(props: Readonly<{ id: string }>) {
  const path = usePathname();
  const [packages, setPackages] = useState<PackageDto[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<PackageDto[]>([]);
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

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [canCreate, setCanCreate] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);
  const routerN = useRouter();

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
        setFilteredPackages(sortedPackages);
        setPage(response.meta.page);
        setTotalItems(response.meta.total);
        });
    };


  useEffect(() => {
    const checkAccess = async () => {
      const access = await hasPermission("Product Category.Read");
      const editBtn = await hasPermission("Product Category.Update");
      const deleteBtn = await hasPermission("Product Category.Delete");
      const createBtn = await hasPermission("Product Category.Create");

      setCanEdit(editBtn);
      setCanDelete(deleteBtn);
      setHasAccess(access);
      setCanCreate(createBtn);
      if (!access) {
        router.push(FORBIDDEN);
      }
    };

    checkAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routerN]);

  useEffect(() => {
    fetchPackages();
  }, [id, page, rowsPerPage]);

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

    setFilteredPackages(filtered);
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
  const { deletePackage } = useProducts();

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
          disabled={!canEdit}
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
              <TableHead className="whitespace-nowrap">No.</TableHead>
              {category === "personal-accident" && (
                <React.Fragment>
                  <TableHead>Occupation Class</TableHead>
                  <TableHead>Ages</TableHead>
                </React.Fragment>
              )}
              {category === "travel" && (
                <React.Fragment>
                  <TableHead>Type</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Adult Participant</TableHead>
                  <TableHead>Children Participant</TableHead>
                </React.Fragment>
              )}
              <TableHead className="whitespace-nowrap">Currency</TableHead>
              <TableHead>Premium</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPackages.length > 0 ? (
              filteredPackages.map((packageData, index) => (
                <TableRow key={packageData.id}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  {category === "personal-accident" && (
                    <React.Fragment>
                      <TableCell>
                        {packageData.search_params.occupation_class.join(", ")}
                      </TableCell>
                      <TableCell>
                        {`${packageData.search_params.age[0]}-${
                          packageData.search_params.age.slice(-1)[0]
                        }`}
                      </TableCell>
                    </React.Fragment>
                  )}
                  {category === "travel" && (
                    <React.Fragment>
                      <TableCell className="capitalize">
                        {packageData.search_params.trip}
                      </TableCell>
                      <TableCell className="capitalize">
                        {packageData.search_params.origin}
                      </TableCell>
                      <TableCell>
                        {packageData.search_params.duration_to} days
                      </TableCell>
                      <TableCell>{packageData.search_params.adult}</TableCell>
                      <TableCell>
                        {packageData.search_params.children}
                      </TableCell>
                    </React.Fragment>
                  )}
                  <TableCell>{packageData.currency}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatMoney(packageData.premium, packageData.currency)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <Button type="button" variant="default" className="rounded-full" onClick={() => router.push(PRODUCT_CATALOG_EDIT_PACKAGE(category as string, id, packageData.id))}>
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
                            <Button type="button" variant="destructive" onClick={() => {
                                const confirmation = confirm("Are you sure to delete this row?");

                                if(confirmation) {
                                    deletePackage(packageData.id);

                                    alert("Row deleted successfully.");
                                    setTimeout(() => {
                                        fetchPackages();
                                    }, 1000);
                                }
                            }}>
                              <Trash className="w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-sm">Remove</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
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
