import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Download } from "react-feather";
import * as XLSX from "xlsx";

interface Column {
  key: string;
  label: string;
}

interface DetailTableProps {
  data: Record<string, any>[];
  columns: Column[];
}

const ITEMS_PER_PAGE = 10;

export default function DetailTable({ data, columns }: DetailTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = [...data].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sortedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "table_detail.xlsx");
  };

  return (
    <div className="h-full relative">
      <button className="bg-primary text-white flex text-xs font-semibold mb-2 px-3 py-2 rounded-full hover:bg-sky-900 absolute bottom-full right-0" onClick={downloadExcel} >
        <Download className="w-4 h-4 mr-2" /> Export
      </button>
      <div className="max-h-[451px] overflow-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-xs">
              <th className="p-3 border"></th>
              {columns.map((col) => (
                <th key={col.key} className="p-3 border text-left">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr key={item.id || index} className="text-xs">
                <td className="border p-3 text-center">{startIndex + index + 1}</td>
                {columns.map((col) => (
                  <td key={col.key} className="border p-3">{item[col.key] || "-"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="inline-flex ml-auto items-center">
          <span className="text-xs mr-3">Page {currentPage} of {totalPages}</span>
          <button className="disabled:opacity-40 p-0" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            <ChevronLeft />
          </button>
          <button className="disabled:opacity-40 p-0" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
