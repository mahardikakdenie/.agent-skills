"use client";
import WithSidebar from "@/hoc/with-sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useRequireAuth from "@/hooks/useRequireAuth";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Search, Trash } from "react-feather";

import noData from "/public/images/no-data.webp";
import Image from "next/image";
import { User, UserService } from "@/services/masterdata/user.service";
import { hasPermission } from "@/context/auth.context";
import { Input } from "@/components/ui/input";
import _ from "lodash";

const PartnerIntegation = () => {
  useRequireAuth();
  const path = usePathname();
  const userService = new UserService();
  const [user, setUser] = useState<User[]>([]);
  const [filteredUser, setFilteredUser] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchData, setSearchData] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [canCreate, setCanCreate] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);

  useEffect(() => {
    const checkAccess = async () => {
      const access = await hasPermission("Masterdata.Read");
      const editBtn = await hasPermission("Masterdata.Update");
      const deleteBtn = await hasPermission("Masterdata.Delete");
      const createBtn = await hasPermission("Masterdata.Create");

      setCanEdit(editBtn);
      setCanDelete(deleteBtn);
      setHasAccess(access);
      setCanCreate(createBtn);
      if (!access) {
        router.push("/forbidden");
      }
    };

    checkAccess();
  }, [router]);
  useEffect(() => {
    if (searchData) {
      setPage(1);
    }
  }, [searchData]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await userService.getPartner(
          page,
          rowsPerPage,
          searchData
        );
        setUser(result.data);
        setFilteredUser(result.data);
        setTotalPages(result.meta.pageTotal);
        setTotalItems(result.meta.total);
      } catch (error) {
        console.error("Error fetching page:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, searchData]);

  const handleSearch = _.debounce((keyword: string) => {
    setSearchData(keyword);
  }, 100);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        Loading...
      </div>
    );
  }

  const handleEdit = (id: string) => {
    router.push(`${path}/${id}/edit`);
  };

  const handleDeletePlan = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      try {
        await userService.deleteUser(id);
        setUser((prevUser) => prevUser.filter((user) => user.id !== id));
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Inactive":
        return "text-gray-400 font-normal";
      case "Active":
        return "text-[#00AB4F]";
      default:
        return "text-[#7B5D21]";
    }
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex gap-4 pb-4 items-center">
        <h1 className="text-black font-bold sm:text-2xl text-xl sm:mt-2">
          Partner Management
        </h1>
        <div className="relative max-w-sm w-full ml-auto shadow-sm">
          <Input
            type="text"
            placeholder="Search by Name or Email"
            onChange={(e) => handleSearch(e.target.value)}
            className="border p-3 rounded-md pr-10 w-full"
          />
          <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#016da1]" />
        </div>
        <Button
          onClick={() => router.push(`${path}/add`)}
          disabled={!canCreate}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
        >
          <Plus className="w-5 h-5 mr-1 " /> Add New
        </Button>
      </div>

      <div className="w-full p-4 bg-white rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap w-12">No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="whitespace-nowrap w-36">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUser.length > 0 ? (
              filteredUser.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {user.name || "-"}
                  </TableCell>
                  <TableCell>{user.email || "-"}</TableCell>
                  <TableCell>{user.phone_number || "-"}</TableCell>
                  <TableCell>{user.role || "-"}</TableCell>
                  <TableCell className="font-semibold whitespace-nowrap">
                    <span className={getStatusColor(user.status)}>
                      {user.status || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-4 items-center">
                      <Button
                        variant="secondary"
                        disabled={!canEdit}
                        onClick={() => handleEdit(user.id)}
                        className="bg-[#016DA1] hover:bg-[#016DA1] text-white px-4 rounded-full"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        disabled={!canDelete}
                        onClick={() => handleDeletePlan(user.id)}
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
                <TableCell colSpan={7}>
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

const PartnerIntegationWithSidebar = (params: any) =>
  WithSidebar(PartnerIntegation)(params);
export default PartnerIntegationWithSidebar;
