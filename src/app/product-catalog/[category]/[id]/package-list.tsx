"use client";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {
  PackageDto,
  ProductCatalogService,
} from "@/services/product-catalog.service";
import { formatMoney } from "@/lib/formatter";
import { useParams } from "next/navigation";

export default function PackageList(props: Readonly<{ id: string }>) {
  const [packages, setPackages] = useState<PackageDto[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<PackageDto[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  const [typeFilter, setTypeFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [adultFilter, setAdultFilter] = useState("");
  const [childrenFilter, setChildrenFilter] = useState("");

  const [ageFilter, setAgeFilter] = useState("");
  const [occupationClassFilter, setOcupationClassFilter] = useState("");

  const { id } = props;
  const productCatalogService = new ProductCatalogService();

  const { category } = useParams();

  useEffect(() => {
    productCatalogService.getPackagesByPlanId(id, page).then((response) => {
      setPackages(response.data);
      setFilteredPackages(response.data);
      setPage(response.meta.page);
      setTotalPages(response.meta.total);
    });
  }, [id]);

  const handleFilter = () => {
    let filtered = packages;

    if (typeFilter) {
      filtered = filtered.filter(
        (pkg) => pkg.search_params.trip.indexOf(typeFilter) > -1
      );
    }

    if (durationFilter) {
      filtered = filtered.filter(
        (pkg) => pkg.search_params.duration_to === Number(durationFilter)
      );
    }

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
  }, [
    typeFilter,
    durationFilter,
    adultFilter,
    childrenFilter,
    ageFilter,
    occupationClassFilter,
  ]);

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
          <div className="w-full py-4 px-6 bg-white rounded-lg overflow-aut mb-4 grid grid-cols-4 gap-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border px-2 py-1 rounded h-[44px] text-sm capitalize"
            >
              <option value="">All Types</option>
              {Array.from(
                new Set(
                  packages
                    .map((pkg) => String(pkg.search_params.trip))
                    .filter((trip) => trip)
                )
              )
                .sort((a, b) => a.localeCompare(b))
                .map((trip, index) => (
                  <option key={index} value={trip}>
                    {trip}
                  </option>
                ))}
            </select>

            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="border px-2 py-1 rounded h-[44px] text-sm"
            >
              <option value="">All Durations</option>
              {Array.from(
                new Set(
                  packages
                    .map((pkg) => pkg.search_params.duration_to)
                    .filter(Boolean)
                )
              )
                .sort((a, b) => a - b)
                .map((duration, index) => (
                  <option key={index} value={duration}>
                    {duration} days
                  </option>
                ))}
            </select>

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
      <div className="w-full p-4 bg-white rounded-lg overflow-auto">
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
              <TableRow>
                <TableCell colSpan={8}>No data available</TableCell>{" "}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
