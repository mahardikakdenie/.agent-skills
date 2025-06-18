"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import WithSidebar from "@/hoc/with-sidebar";
import useRequireAuth from "@/hooks/useRequireAuth";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Upload, Search, ChevronLeft, ChevronRight } from "react-feather";
import { Input } from "@/components/ui/input";
import _ from "lodash";
import Image from "next/image";
import noData from "/public/images/no-data.webp";

const HospitalListPage = () => {
  useRequireAuth();
  const router = useRouter();
  const path = usePathname();
  const sampleData = [
    {
      "id": 6144,
      "provider_id": "6144",
      "type": "Klinik Umum",
      "province": "ACEH",
      "city": "ACEH BARAT",
      "full_name": "KLINIK CEMPAKA LIMA MEULABOH",
      "inpatient": false,
      "outpatient": true,
      "address": "JL. GAJAH MADA NO, 23 DRIEN RAMPAK , JOHAN PAHLAWAN ACEH BARAT",
      "phone": "+62823 61103699",
      "coordinate": "4.1518363,96.1331943"
    },
    {
      "id": 1292,
      "provider_id": "1292",
      "type": "Rumah Sakit (RS)",
      "province": "ACEH",
      "city": "BANDA ACEH",
      "full_name": "CEMPAKA AZ ZAHRA, RS",
      "inpatient": true,
      "outpatient": true,
      "address": "JL. POCUT BAREN NO. 36-40 KP. LAKSANA BANDA ACEH",
      "phone": "+62651 310666",
      "coordinate": "5.56154420,95.32297420"
    },
    {
      "id": 467,
      "provider_id": "467",
      "type": "Rumah Sakit (RS)",
      "province": "ACEH",
      "city": "BANDA ACEH",
      "full_name": "HARAPAN BUNDA BANDA ACEH, RS",
      "inpatient": true,
      "outpatient": false,
      "address": "JL. TEUKU UMAR NO. 181 - 211 KEC. BAITURRAHMAN BANDA ACEH",
      "phone": "+62651 48114",
      "coordinate": "5.52760820,95.29077550"
    }
  ]

  // const sampleData: any[] = [];

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchData, setSearchData] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = _.debounce((keyword: string) => {
    setSearchData(keyword);
  }, 100);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };
  
  const renderValue = (value: any) => {
    if (typeof value === "boolean") return value ? "YES" : "NO";
    return value ?? "" ? value : "-";
  };
  
  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex gap-4 pb-4 items-center">
        <h1 className="text-black font-bold text-2xl mt-2">Hospital List</h1>
        <Button
          onClick={() => router.push(`${path}/upload`)}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <Upload className="w-5 h-5 mr-1" /> Upload
        </Button>
      </div>

      <div className="w-full sm:p-6 p-4 bg-white rounded-lg">
        <div className="relative w-full ml-auto">
          <Input
            type="text"
            placeholder="Search"
            onChange={(e) => handleSearch(e.target.value)}
            className="border p-3 rounded-md pr-10 w-full"
            disabled={sampleData.length === 0}
          />
          <Search
            className={`absolute top-1/2 right-3 transform -translate-y-1/2 transition-opacity ${
              sampleData.length === 0 ? "text-gray-400 opacity-50" : "text-[#016da1] opacity-100"
            }`}
          />
        </div>

        <Table className="table-claims">
          {sampleData.length > 0 ? (
            <>
              <TableHeader>
                <TableRow>
                  <TableHead className="py-2">No.</TableHead>
                  <TableHead className="py-2">Provider ID</TableHead>
                  <TableHead className="py-2">Type</TableHead>
                  <TableHead className="py-2">Province</TableHead>
                  <TableHead className="py-2">City</TableHead>
                  <TableHead className="py-2">Full Name</TableHead>
                  <TableHead className="py-2">Inpatient</TableHead>
                  <TableHead className="py-2">Outpatient</TableHead>
                  <TableHead className="whitespace-nowrap py-2">Address</TableHead>
                  <TableHead className="py-2">Phone</TableHead>
                  <TableHead className="py-2">Maps/Coordinate</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sampleData.map((hospital, index) => (
                  <TableRow key={hospital.id}>
                    <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{renderValue(hospital.provider_id)}</TableCell>
                    <TableCell>{renderValue(hospital.type)}</TableCell>
                    <TableCell>{renderValue(hospital.province)}</TableCell>
                    <TableCell>{renderValue(hospital.city)}</TableCell>
                    <TableCell>{renderValue(hospital.full_name)}</TableCell>
                    <TableCell>{renderValue(hospital.inpatient)}</TableCell>
                    <TableCell>{renderValue(hospital.outpatient)}</TableCell>
                    <TableCell>{renderValue(hospital.address)}</TableCell>
                    <TableCell>{renderValue(hospital.phone)}</TableCell>
                    <TableCell>{renderValue(hospital.coordinate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          ) : (
            <TableBody>
              <TableRow className="hover:!bg-white">
                <TableCell colSpan={11}>
                  <div className="flex flex-col gap-4 items-center justify-center py-14">
                    <Image alt="no data" src={noData} width={200} /> No hospital list data available
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>

        <div className="flex justify-center items-center gap-2 font-normal text-sm pt-2 border-t">
          <label htmlFor="rowsPerPage">Showing:</label>
          <select id="rowsPerPage" value={rowsPerPage} onChange={handleRowsPerPageChange} className="p-2 border rounded">
            {[10, 20, 30, 50].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <span className="mr-2">of {totalItems} items</span>
          <button onClick={() => setPage((prevState) => prevState - 1)} disabled={page === 1} title="Prev">
            <ChevronLeft />
          </button>
          <button onClick={() => setPage((prevState) => prevState + 1)} disabled={page === totalPages} title="Next">
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

const HospitalListWithSidebar = (params: any) => WithSidebar(HospitalListPage)(params);
export default HospitalListWithSidebar;