import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search } from "react-feather";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContentLoadingWrapper } from "../Loading/";
export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  classNameHeading?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pagination?: {
    page: number;
    totalPages: number;
    rowsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    rowsPerPageOptions?: number[];
  };
  search?: {
    placeholder?: string;
    onSearch: (value: string) => void;
  };
  noDataImage?: any;
  noDataText?: string;
  className?: string;
  getRowClassName?: (item: T, index: number) => string;
  loading?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pagination,
  search,
  noDataImage,
  noDataText = "No data available",
  className = "",
  getRowClassName,
  loading = false,
}: DataTableProps<T>) {
  const renderCell = (item: T, column: Column<T>, index: number) => {
    if (column.render) {
      return column.render(item, index);
    }

    const getValue = (obj: any, path: string) => {
      return path.split(".").reduce((current, key) => current?.[key], obj);
    };

    const value = getValue(item, column.key);
    return value ?? "-";
  };

  const defaultRowsPerPageOptions = [10, 20, 30, 50, 100];

  return (
    <div className="w-full bg-white rounded-lg p-4">
      {search && (
        <div className="relative w-full mb-4">
          <Input
            type="text"
            placeholder={search.placeholder || "Search..."}
            onChange={(e) => search.onSearch(e.target.value)}
            className="border p-3 rounded-md pr-10 w-full text-sm h-12"
          />
          <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#016da1]" />
        </div>
      )}

      <Table className={`table-auto ${className}`}>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={`whitespace-nowrap py-2 ${column.className || ""} ${
                  column.classNameHeading || ""
                }`}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow className="hover:!bg-white">
              <TableCell colSpan={columns.length}>
                <ContentLoadingWrapper isLoading={loading}>
                  <div className="h-[300px]"></div>
                </ContentLoadingWrapper>
              </TableCell>
            </TableRow>
          ) : data.length > 0 ? (
            data.map((item, index) => (
              <TableRow
                key={index}
                className={getRowClassName ? getRowClassName(item, index) : ""}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={column.className || ""}
                  >
                    {renderCell(item, column, index)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:!bg-white">
              <TableCell colSpan={columns.length}>
                <div className="flex flex-col gap-4 items-center justify-center py-14">
                  {noDataImage && (
                    <Image alt="no data" src={noDataImage} width={200} />
                  )}
                  {noDataText}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        {pagination && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className="flex justify-center items-center gap-2 font-normal">
                  <label htmlFor="rowsPerPage">Showing:</label>
                  <select
                    id="rowsPerPage"
                    value={pagination.rowsPerPage}
                    onChange={pagination.onRowsPerPageChange}
                    className="p-2 border rounded"
                  >
                    {(
                      pagination.rowsPerPageOptions || defaultRowsPerPageOptions
                    ).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span className="mr-2">of {pagination.totalItems} items</span>
                  <button
                    onClick={() => pagination.onPageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    title="Prev"
                    className="p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    onClick={() => pagination.onPageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    title="Next"
                    className="p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}
