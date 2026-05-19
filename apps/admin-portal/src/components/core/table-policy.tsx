"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { ChevronLeft, ChevronRight, Download } from "react-feather";
import * as XLSX from "xlsx";

interface Column {
  key: string;
  label: string;
}

interface DetailTableProps {
  data: Record<string, unknown>[];
  columns: Column[];
}

const ITEMS_PER_PAGE = 10;

function getCreatedAtTimestamp(item: Record<string, unknown>) {
  const createdAt = item.created_at;

  if (
    typeof createdAt === "string" ||
    typeof createdAt === "number" ||
    createdAt instanceof Date
  ) {
    return new Date(createdAt).getTime();
  }

  return 0;
}

export default function DetailTable({ data, columns }: DetailTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = [...data].sort(
    (a, b) => getCreatedAtTimestamp(b) - getCreatedAtTimestamp(a)
  );

  const totalPages = Math.max(1, Math.ceil(sortedData.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sortedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "table_detail.xlsx");
  };

  return (
    <Box className="relative h-full">
      <Button
        size="sm"
        className="absolute bottom-full right-0 mb-2 rounded-full text-xs font-semibold"
        onClick={downloadExcel}
        leftIcon={<Download className="h-4 w-4" />}
      >
        Export
      </Button>
      <Box className="max-h-[451px] overflow-auto">
        <Table className="min-w-full border border-gray-200 bg-white text-xs shadow-sm">
          <TableHeader className="[&_tr]:border-gray-200 [&_tr]:bg-gray-100 [&_tr]:text-gray-700">
            <TableRow>
              <TableHead className="border border-gray-200 p-3"></TableHead>
              {columns.map((col) => (
                <TableHead key={col.key} className="border border-gray-200 p-3 text-left">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:hover]:bg-transparent">
            {currentData.map((item, index) => (
              <TableRow key={String(item.id ?? index)}>
                <TableCell className="border border-gray-200 p-3 text-center">
                  {startIndex + index + 1}
                </TableCell>
                {columns.map((col) => (
                  <TableCell key={col.key} className="border border-gray-200 p-3">
                    {item[col.key] ? String(item[col.key]) : "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Box className="mt-4 flex items-center justify-between">
        <Box className="ml-auto inline-flex items-center gap-2">
          <Box as="span" className="mr-1 text-xs">
            Page {currentPage} of {totalPages}
          </Box>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
