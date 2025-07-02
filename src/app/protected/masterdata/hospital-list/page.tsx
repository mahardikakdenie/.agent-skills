"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, Search, ChevronLeft, ChevronRight } from "react-feather";
import _ from "lodash";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import WithSidebar from "@/hoc/with-sidebar";
import useRequireAuth from "@/hooks/useRequireAuth";
import noData from "/public/images/no-data.webp";
import { MdProductService, HospitalData } from "@/services/masterdata/product.service";
import { useLoading } from "@/context/loading.context";
import { HOSPITAL_LIST_UPLOAD } from "@/constants/routes";


const HospitalListPage = () => {
  useRequireAuth();
  const router = useRouter();
  const path = usePathname();
  const mdProduct = new MdProductService();
  const { setLoading } = useLoading();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchData, setSearchData] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hospitalList, setHospitalList] = useState<HospitalData[]>([]);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  useEffect(() => {
    const fetchHospitalList = async () => {
      setLoading(true)
      try {
        const res = await mdProduct.getHospitalList({
          name: searchData,
          page,
          pageSize: rowsPerPage,
        });
        setHospitalList(res.data || []);
        setTotalItems(res.meta?.total || 0);
        setTotalPages(res.meta?.pageTotal || 1);
        setHasFetchedOnce(true);
      } catch (error) {
        console.error("Failed to fetch hospital list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchData, page, rowsPerPage]);

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
          onClick={() => router.push(HOSPITAL_LIST_UPLOAD)}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <Upload className="w-5 h-5 mr-1" /> Upload
        </Button>
      </div>

      <div className="w-full sm:p-6 p-4 bg-white rounded-lg">
        <div className="relative ml-auto">
          <Input
            type="text"
            placeholder="Search"
            onChange={(e) => handleSearch(e.target.value)}
            className="border p-3 rounded-md pr-10 w-full"
            disabled={!hasFetchedOnce}
          />
          <Search
            className={`absolute top-1/2 right-3 transform -translate-y-1/2 transition-opacity ${
              hospitalList.length === 0 ? "text-gray-400 opacity-50" : "text-[#016da1] opacity-100"
            }`}
          />
        </div>

        <Table className="table-claims">
          {hospitalList.length > 0 ? (
            <>
              <TableHeader>
                <TableRow>
                  <TableHead className="py-2">No.</TableHead>
                  <TableHead className="py-2">Profile ID</TableHead>
                  <TableHead className="py-2">Provider Name</TableHead>
                  <TableHead className="py-2">Provider Type</TableHead>
                  <TableHead className="py-2">Province</TableHead>
                  <TableHead className="py-2">City</TableHead>
                  <TableHead className="whitespace-nowrap py-2">Address</TableHead>
                  <TableHead className="py-2">Longitude</TableHead>
                  <TableHead className="py-2">Latitude</TableHead>
                  <TableHead className="py-2">Facility OP</TableHead>
                  <TableHead className="py-2">Facility IP</TableHead>
                  <TableHead className="py-2">Phone</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {hospitalList.map((hospital, index) => (
                  <TableRow key={hospital.id}>
                    <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{renderValue(hospital.reference.id_provider)}</TableCell>
                    <TableCell>{renderValue(hospital.name)}</TableCell>
                    <TableCell>{renderValue(hospital.reference.provider_type)}</TableCell>
                    <TableCell>{renderValue(hospital.reference.name_province)}</TableCell>
                    <TableCell>{renderValue(hospital.reference.type_city)}</TableCell>
                    <TableCell>{renderValue(hospital.reference.address)}</TableCell>
                    <TableCell>{renderValue(hospital.reference.long)}</TableCell>
                    <TableCell>{renderValue(hospital.reference.lat)}</TableCell>
                    <TableCell>{renderValue(hospital.reference.outpatient)}</TableCell>
                    <TableCell>{renderValue(hospital.reference.inpatient)}</TableCell>
                    <TableCell>{renderValue(hospital.reference.phone)}</TableCell>
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