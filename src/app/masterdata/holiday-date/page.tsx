"use client";
import useCalendar from "./hook";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/formatter";
import { HOLIDAY_ADD, HOLIDAY_DETAIL } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/context/loading.context";
import { ChevronLeft, ChevronRight, EditIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell, TableFooter, } from "@/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";

export default function HolidayPage() {
  const { getCalendarHoliday, createCalendar, updateCalendar, deleteCalendar, dataCalendar } = useCalendar();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const { setLoading } = useLoading();
  const [totalItems, setTotalItems] = useState(0);
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const [searchCountry, setSearchCountry] = useState("id");
  const [searchYear, setSearchYear] = useState<string>('');
  const [searchType, setSearchType] = useState<string | undefined>(undefined);
  // const { setLoading } = useLoading();

  const [types, setTypes] = useState<any[]>([
    { name: "All Holiday Type", code: undefined },
    { name: "Joint Leave", code: "Joint Leave" },
    { name: "National Holiday", code: "National Holiday" },
  ]);
  const [countries, setCountries] = useState<any[]>([
    { name: "Indonesia", code: "id" },
    { name: "Malaysia", code: "my" },
  ]);
  const [years, setYears] = useState<any[]>([
  ]);

  useEffect(() => {
    const currYear = new Date().getFullYear();
    setSearchYear(currYear.toString());

    let c = [{ name: currYear.toString(), code: currYear.toString() }];
    c.push({ name: (currYear + 1).toString(), code: (currYear + 1).toString(), });
    setYears(c);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let where: any = { year: searchYear, country: searchCountry, };
        if (searchType) {
          where.type = searchType;
        }
        await getCalendarHoliday(where, page, rowsPerPage);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, searchYear, searchType, searchCountry]);


  const router = useRouter();

  const handleRowsPerPageChange = (e: any) => {
    setRowsPerPage(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this row?")) {
      try {
        setLoading(true);
        await deleteCalendar(id);

        if (page === 1) {
          let where: any = { year: searchYear, country: searchCountry, };
          if (searchType) {
            where.type = searchType;
          }
          await getCalendarHoliday(where, page, rowsPerPage);
        } else {
          setPage(1);
        }
      } catch (error) {
        console.error(error);
        alert("Failed to delete calendar");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (dataCalendar && dataCalendar.data) {
      setTotalItems(dataCalendar.meta.total);
    }
  }, [dataCalendar]);

  const handleTypeChange = (v: string) => {
    setSearchType(v);
    setPage(1);
  };
  const handleYearChange = (v: string) => {
    setSearchYear(v);
    setPage(1);
  };
  const handleCountryChange = (v: string) => {
    setSearchCountry(v);
    setPage(1);
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6 ">
      <div className="flex flex-wrap justify-start gap-4 pb-4 items-center">
        <h1 className="text-black font-bold sm:text-2xl text-xl mt-2 mb-4">
          Holiday Date
        </h1>
        <div className="min-w-36 w-[100px] ml-auto">
          <Select
            value={searchCountry}
            onValueChange={handleCountryChange}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  countries.map((item, index) => (
                    <SelectItem key={index} value={item.code}>{item.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-36 w-[100px]">
          <Select
            value={searchYear}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  years.map((item, index) => (
                    <SelectItem key={index} value={item.code}>{item.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-52 w-[100px]">
          <Select
            value={searchType}
            onValueChange={handleTypeChange}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  types.map((item, index) => (
                    <SelectItem key={index} value={item.code}>{item.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => router.push(HOLIDAY_ADD)}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
        >
          <PlusIcon className="w-5 h-5 mr-1 " /> Create Holiday
        </Button>

      </div>
      <div className="w-full p-4 md:p-6 bg-white rounded-lg">
        <Table className="table-transactions">
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Holiday Name</TableHead>
              <TableHead>Holiday Type</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataCalendar?.data?.map((item: any, index: any) => (
              <TableRow key={item.id}>
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell>{formatDate(item.date, "DD-MM-YYYY")}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>

                <TableCell className="flex">
                  <div className="relative group">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(HOLIDAY_DETAIL(item.id))}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Edit
                    </span>
                  </div>
                  <div className="relative group">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </Button>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Delete
                    </span>
                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={10}>
                <div className="flex justify-center items-center gap-2 font-normal">
                  <label htmlFor="rowsPerPage">Showing:</label>
                  <select
                    id="rowsPerPage"
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    className="p-2 border rounded"
                  >
                    {[10, 20, 30, 50, 100].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span className="mr-2">of {totalItems} items</span>
                  <button
                    onClick={() => setPage((prevState) => prevState - 1)}
                    disabled={page === 1}
                    title="Prev"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    onClick={() => setPage((prevState) => prevState + 1)}
                    disabled={page === totalPages}
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
    </div>
  );
};