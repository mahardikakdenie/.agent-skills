"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Trash } from "react-feather";

import noData from "/public/images/no-data.webp";
import Image from "next/image";
import {
  PagesResponse,
  PagesService,
} from "@/services/masterdata/page.service";
import { useAuth } from "@/context/auth.context";
import { FORBIDDEN, PAGE_MANAGEMENT_ADD, PAGE_MANAGEMENT_DETAIL } from "@/constants/routes";

export default function Pages() {
  const path = usePathname();
  const pagesService = new PagesService();
  const [pages, setPages] = useState<PagesResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const router = useRouter();


  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [canCreate, setCanCreate] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);
  const { permissionList } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes("Masterdata.Read");
      const editBtn = permissionList.includes("Masterdata.Update");
      const deleteBtn = permissionList.includes("Masterdata.Delete");
      const createBtn = permissionList.includes("Masterdata.Create");

      setCanEdit(editBtn)
      setCanDelete(deleteBtn);
      setHasAccess(access);
      setCanCreate(createBtn);
      if (!access) {
        router.push(FORBIDDEN);
      }
    };

    checkAccess();
  }, [router]);

  useEffect(() => {
    const fetchInsurance = async () => {
      setLoading(true);
      try {
        const result = await pagesService.getPages(page, rowsPerPage);
        setPages(result.data);
        setTotalPages(result.meta.pageTotal);
        setTotalItems(result.meta.total);
      } catch (error) {
        console.error("Error fetching insurance products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsurance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const handleEdit = (id: string) => {
    router.push(PAGE_MANAGEMENT_DETAIL(id));
  };

  const handleDeletePlan = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      try {
        await pagesService.deletePages(id);
        setPages((prevPages) => prevPages.filter((pages) => pages.id !== id));
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete page:", error);
      }
    }
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex gap-2 sm:flex-row flex-col pb-4">
        <h1 className="text-black font-bold sm:text-2xl text-xl sm:mt-2">
          Page Management
        </h1>
        <Button
          onClick={() => router.push(PAGE_MANAGEMENT_ADD)}
          disabled={!canCreate}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <Plus className="w-5 h-5 mr-1 " /> Add New
        </Button>
      </div>

      <div className="w-full p-4 bg-white rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap w-12">No.</TableHead>
              <TableHead className="min-w-36">Page Name</TableHead>
              <TableHead className="whitespace-nowrap w-36">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.length > 0 ? (
              pages.map((page, index) => (
                <TableRow key={page.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {page.name
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-4 items-center">
                      <Button
                        variant="secondary"
                        disabled={!canEdit}
                        onClick={() => handleEdit(page.id)}
                        className="bg-[#016DA1] hover:bg-[#016DA1] text-white px-4 rounded-full"
                      >
                        Manage
                      </Button>
                      <Button
                        variant="ghost"
                        disabled={!canDelete}
                        onClick={() => handleDeletePlan(page.id)}
                        className="text-red-600 px-0"
                      >
                        <Trash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:!bg-white">
                <TableCell colSpan={5}>
                  <div className="flex flex-col gap-4 items-center justify-center py-14">
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
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    className="p-2 border rounded"
                  >
                    {[10, 20, 30, 50].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span className="mr-2">of {totalItems} items</span>
                  <button
                    onClick={() =>
                      setPage((prevState) => Math.max(prevState - 1, 1))
                    }
                    disabled={page === 1}
                    title="Prev"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    onClick={() =>
                      setPage((prevState) =>
                        Math.min(prevState + 1, totalPages)
                      )
                    }
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