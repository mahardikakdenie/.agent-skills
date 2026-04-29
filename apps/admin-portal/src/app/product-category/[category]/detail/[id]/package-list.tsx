'use client';

import noData from '@public/images/no-data.webp';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, useEffect, useState, useMemo } from 'react';
import { Plus, Upload } from 'react-feather';

import { Box, Button, DataTable } from '@repo/ui';

import { useProducts } from '@/app/product-category/hooks';
import { createPackageTableColumns } from '@/components/tableConfig/packageTableConfig';
import { CompactTablePagination } from '@/components/ui/compact-table-pagination';
import AppURL from '@/constants/app-url.const';

export default function PackageList(props: Readonly<{ id: string; category: string }>) {
  const router = useRouter();
  const { id, category } = props;

  const [adultFilter, setAdultFilter] = useState('');
  const [childrenFilter, setChildrenFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [occupationClassFilter, setOcupationClassFilter] = useState('');

  const {
    packages,
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
      filtered = filtered.filter((pkg) => pkg.search_params.adult === Number(adultFilter));
    }

    if (childrenFilter) {
      filtered = filtered.filter((pkg) => pkg.search_params.children === Number(childrenFilter));
    }

    if (occupationClassFilter) {
      filtered = filtered.filter(
        (pkg) =>
          JSON.stringify(pkg.search_params.occupation_class) ==
          JSON.stringify(occupationClassFilter.split(',')),
      );
    }

    if (ageFilter) {
      filtered = filtered.filter((pkg) => pkg.search_params.age == ageFilter);
    }

    return filtered;
  }, [sortedPackages, adultFilter, childrenFilter, occupationClassFilter, ageFilter]);

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
          router.push(`${AppURL.productCatalogEditPackage(category, id, packageId)}`);
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
    ],
  );

  useEffect(() => {
    if (id) {
      refetchPackages();
    }
  }, [id, refetchPackages]);

  return (
    <Box>
      <Box className="flex justify-end gap-x-4 mb-4">
        <Button
          className="bg-[#F5BA41] hover:bg-[#e6a92d] text-black cursor-pointer"
          disabled={!canEdit}
          onClick={() => router.push(`${AppURL.productCatalogUpload(category, id)}`)}
        >
          <Upload className="w-5 h-5" /> Upload Packages
        </Button>
        <Button
          className="bg-[#F5BA41] hover:bg-[#e6a92d] text-black cursor-pointer"
          disabled={!canCreate}
          onClick={() => router.push(`${AppURL.productCatalogAddPackage(category, id)}`)}
        >
          <Plus className="w-5 h-5" /> Add Package
        </Button>
      </Box>

      {category === 'personal-accident' && (
        <Box className="w-full pt-4 bg-white rounded-lg overflow-auto grid sm:grid-cols-2 gap-4 mb-4">
          <Box
            as="select"
            value={occupationClassFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setOcupationClassFilter(e.target.value)
            }
            className="border px-2 py-1 rounded h-16 text-sm capitalize"
          >
            <Box as="option" value="">
              All Occupation Class
            </Box>
            {Array.from(
              new Set(
                sortedPackages
                  .map((pkg) => String(pkg.search_params.occupation_class))
                  .filter((occupation_class) => occupation_class),
              ),
            )
              .sort((a, b) => a.localeCompare(b))
              .map((occupation_class, index) => (
                <Box as="option" key={index} value={occupation_class}>
                  {occupation_class}
                </Box>
              ))}
          </Box>
          <Box
            as="select"
            value={ageFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setAgeFilter(e.target.value)}
            className="border px-2 py-1 rounded h-16 text-sm capitalize"
          >
            <Box as="option" value="">
              All Ages
            </Box>
            {(() => {
              const ages = Array.from(
                new Set(
                  sortedPackages.map((pkg) => String(pkg.search_params.age)).filter((age) => age),
                ),
              ).sort((a, b) => a.localeCompare(b));

              const firstAge = ages[0] ? ages[0].split(',')[0] : '';
              const lastAge = ages[ages.length - 1] ? ages[ages.length - 1].split(',').pop() : '';
              return (
                <>
                  {firstAge && (
                    <Box as="option" value={ages.join(',')}>
                      {firstAge}-{lastAge}
                    </Box>
                  )}
                </>
              );
            })()}
          </Box>
        </Box>
      )}

      {category === 'travel' && (
        <Box className="w-full pt-4 bg-white rounded-lg overflow-auto grid grid-cols-2 gap-4 mb-4">
          <Box
            as="select"
            value={adultFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setAdultFilter(e.target.value)}
            className="border px-2 py-1 rounded h-16 text-sm"
          >
            <Box as="option" value="">
              All Adults
            </Box>
            {Array.from(
              new Set(sortedPackages.map((pkg) => pkg.search_params.adult).filter(Boolean)),
            )
              .sort((a, b) => a - b)
              .map((adult, index) => (
                <Box as="option" key={index} value={adult}>
                  {adult}
                </Box>
              ))}
          </Box>
          <Box
            as="select"
            value={childrenFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setChildrenFilter(e.target.value)}
            className="border px-2 py-1 rounded h-16 text-sm"
          >
            <Box as="option" value="">
              All Children
            </Box>
            {Array.from(
              new Set(sortedPackages.map((pkg) => pkg.search_params.children).filter(Boolean)),
            )
              .sort((a, b) => a - b)
              .map((children, index) => (
                <Box as="option" key={index} value={children}>
                  {children}
                </Box>
              ))}
          </Box>
        </Box>
      )}

      <DataTable
        className="!gap-3 pb-4 md:pb-6 [&_th]:whitespace-nowrap [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        columns={columns}
        data={filteredPackages}
        loading={isLoadingPackages}
        pagination={{
          pageIndex: packagesPage - 1,
          pageSize: packagesRowsPerPage,
          pageCount: packagesTotalPages,
          rowCount: packagesTotalItems,
          onPageChange: (pageIndex) => {
            if (isLoadingPackages) {
              return;
            }

            handlePackagesPageChange(pageIndex + 1);
          },
          onPageSizeChange: (pageSize) => {
            if (isLoadingPackages) {
              return;
            }

            handlePackagesRowsPerPageChange({
              target: { value: String(pageSize) },
            } as ChangeEvent<HTMLSelectElement>);
          },
        }}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        emptyState={
          <Box className="sticky left-0 flex min-h-[10rem] w-[100cqw] items-center justify-center gap-2 py-4 md:min-h-[11rem] md:py-5">
            <Box className="flex flex-col items-center justify-center gap-2">
              <Image alt="No package data" src={noData} width={128} />
              <Box as="span">No package data available</Box>
            </Box>
          </Box>
        }
        renderPagination={(table) => (
          <Box className="-mt-1">
            <CompactTablePagination
              table={table}
              pageSizeOptions={[10, 20, 30, 50, 100]}
              disabled={isLoadingPackages}
            />
          </Box>
        )}
        tableOptions={{
          manualPagination: true,
          enableColumnResizing: true,
          defaultColumn: {
            minSize: 72,
            size: 120,
          },
          getRowId: (row, index) => row?.id || `package-row-${packagesPage}-${index}`,
        }}
      />
    </Box>
  );
}
