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
import { useEffect, useState } from "react";
import {
  PackageDto,
  ProductCatalogService,
} from "@/services/product-catalog.service";
import { formatMoney } from "@/lib/formatter";
import { useParams } from "next/navigation";
import Image from "next/image";
import noData from "/public/images/no-data.webp";
import { ChevronLeft, ChevronRight } from "react-feather";

export default function PackageList(props: Readonly<{ id: string }>) {
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

  useEffect(() => {
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
      console.log(occupationClassFilter.split(","));
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
  }, [adultFilter, childrenFilter, ageFilter, occupationClassFilter]);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  return (
    <>
      {category == "personal-accident" ? (
        <div className="w-full py-4 px-6 bg-white rounded-lg overflow-aut mb-4 grid grid-cols-2 gap-4">
          <>
            <select
              value={occupationClassFilter}
              onChange={(e) => setOcupationClassFilter(e.target.value)}
              className="border px-2 py-1 rounded h-[44px] text-sm capitalize"
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
              className="border px-2 py-1 rounded h-[44px] text-sm capitalize"
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
      ) : (
        <>
          <div className="w-full py-4 px-6 bg-white rounded-lg overflow-aut mb-4 grid grid-cols-2 gap-4">
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
        </>
      )}
      <div className="w-full bg-white rounded-lg overflow-auto">
        <Table className="table-search-params">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">No.</TableHead>
              {category == "personal-accident" ? (
                <>
                  <TableHead>Occupation Class</TableHead>
                  <TableHead>Ages</TableHead>
                </>
              ) : (
                <>
                  <TableHead>Type</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Adult Participant</TableHead>
                  <TableHead>Children Participant</TableHead>
                </>
              )}

              <TableHead className="whitespace-nowrap">Currency</TableHead>
              <TableHead>Premium</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPackages.length > 0 ? (
              filteredPackages.map((packageData, index) => (
                <TableRow key={packageData.id}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  {category == "personal-accident" ? (
                    <>
                      <TableCell>
                        {packageData.search_params.occupation_class.join(", ")}
                      </TableCell>
                      <TableCell>
                        {`${packageData.search_params.age[0]}-${
                          packageData.search_params.age.slice(-1)[0]
                        }`}
                      </TableCell>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}

                  <TableCell>{packageData.currency}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatMoney(packageData.premium, packageData.currency)}
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
                </TableCell>{" "}
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
