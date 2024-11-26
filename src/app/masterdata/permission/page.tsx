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
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash,
  X,
} from "react-feather";
import noData from "/public/images/no-data.webp";
import Image from "next/image";
import {
  PagesResponse,
  PermissionResponse,
  PermissionService,
} from "@/services/masterdata/permission.service";
import { SourceTextModule } from "vm";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { usePermission } from "./hooks";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const PermissionPage = ({ params }: { params: { id: string } }) => {
  useRequireAuth();
  const path = usePathname();
  const { id } = params;
  const permissionService = new PermissionService();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [tab, setTab] = useState("");
  const [permission, setPermission] = useState<PermissionResponse[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [menu, setMenu] = useState("");
  const [permissionId, setPermissionId] = useState<string | null>(null);

  const router = useRouter();
  const { updatePermission, fetchPermissionById } = usePermission();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
    defaultValues: {
      id,
      name,
      page,
      menu,
    },
  });

  const handleEdit = async (id: string) => {
    if (id) {
      try {
        const res = await fetchPermissionById(id);
        let menuNames = pages.filter((item) => item.id == res.data.page);
        setPermissionId(res.data.id);
        setValue("menu", menuNames[0].name);
        setValue("page", res.data.page);
        setValue("name", res.data.name);
        setIsModalOpen(true);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const onSubmit = async (data: any) => {
    const { menu, ...updatedData } = data;
    try {
      if (permissionId) {
        await updatePermission(updatedData, permissionId);
        setUpdateSuccess(true);
      } else {
        console.error("Permission ID is missing");
        setUpdateSuccess(false);
      }
    } catch (error) {
      console.error("Error updating permission:", error);
      setUpdateSuccess(false);
    }
  };

  useEffect(() => {
    if (updateSuccess === false) {
      alert("Terjadi kesalahan saat menyimpan data.");
    }
    setUpdateSuccess(null);
  }, [updateSuccess, router]);

  useEffect(() => {
    if (tab !== "") {
      const fetchPermission = async () => {
        setLoading(true);
        try {
          const result = await permissionService.getPermission(
            page,
            rowsPerPage,
            tab
          );
          setPermission(result.data);
          setTotalPages(result.meta.pageTotal);
          setTotalItems(result.meta.total);
        } catch (error) {
          console.error("Error fetching permissions:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPermission();
    }
  }, [page, rowsPerPage, tab, updateSuccess]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const result = await permissionService.getPages(page, rowsPerPage);
        setPages(result.data || []);
        if (result.data?.length > 0) {
          setTab(result.data[0].id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [page, rowsPerPage]);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        Loading...
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      try {
        await permissionService.deletePermission(id);
        setPermission((prevPermission) =>
          prevPermission.filter((permission) => permission.id !== id)
        );
      } catch (error) {
        console.error("Failed to delete permission:", error);
      }
    }
  };

  const selectTab = (tab: string) => {
    setTab(tab);
    setPage(1);
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex gap-2">
        <h1 className="text-black font-bold text-2xl mt-2 mb-4">Product</h1>
        <Button
          onClick={() => router.push(`${path}/add`)}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <Plus className="w-5 h-5 mr-1 " /> Add New
        </Button>
      </div>

      <div className="block bg-white rounded-md mb-3">
        <div className="w-full flex items-center overflow-auto">
          {pages.map((page) => (
            <div
              key={page.id}
              onClick={() => selectTab(page.id)}
              className={`cursor-pointer h-full flex items-center justify-center sm:px-7 px-5 ${
                tab === page.id
                  ? "border-b-[3px] border-primary sm:px-7 px-5"
                  : ""
              }`}
            >
              <button
                className={`text-sm py-5 ${
                  tab === page.id ? "text-primary" : ""
                }`}
              >
                {page.name
                  .split("-")
                  .map(
                    (word: string) =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                  )
                  .join(" ")}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full p-4 bg-white rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap w-12">No.</TableHead>
              <TableHead className="min-w-36">Permission</TableHead>
              <TableHead className="whitespace-nowrap w-12">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permission.length > 0 ? (
              permission.map((permission, index) => (
                <TableRow key={permission.id}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{permission.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                          <Button
                            color="warning"
                            className="bg-[#016DA1] hover:bg-[#016DA1] text-white px-4 rounded-full"
                            onClick={() => handleEdit(permission.id)}
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent
                          style={{ zIndex: 100 }}
                          className="p-0 w-[500px] max-w-full overflow-hidden"
                        >
                          <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
                            <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
                              Edit Permission
                              <DialogClose className="ml-auto">
                                <Button
                                  type="button"
                                  className="bg-transparent hover:bg-transparent text-black p-0"
                                >
                                  <X className="w-5 h-5" />
                                </Button>
                              </DialogClose>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="p-6">
                            <form onSubmit={handleSubmit(onSubmit)}>
                              <div className="mb-5">
                                <Controller
                                  name="page"
                                  control={control}
                                  rules={{
                                    required: "Group Name is required",
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      type="text"
                                      id="page"
                                      placeholder="Insert Group Name"
                                      disabled
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value.replace(/\s+/g, "-")
                                        )
                                      }
                                      className="mt-1 w-full h-12 bg-default-40 hidden"
                                    />
                                  )}
                                />
                                <label
                                  htmlFor="page"
                                  className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                  Group Name
                                </label>

                                <Controller
                                  name="menu"
                                  control={control}
                                  rules={{
                                    required: "Group Name is required",
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      type="text"
                                      id="menu"
                                      placeholder="Insert Group Name"
                                      disabled
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value.replace(/\s+/g, "-")
                                        )
                                      }
                                      className="mt-1 block w-full h-12 bg-default-40"
                                    />
                                  )}
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="name"
                                  className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                  Permission Name
                                </label>

                                <Controller
                                  name="name"
                                  control={control}
                                  defaultValue=""
                                  rules={{
                                    required: "Permission Name is required",
                                  }}
                                  render={({ field }) => (
                                    <Input
                                      type="text"
                                      id="name"
                                      placeholder="Insert Permission Name"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value.replace(/\s+/g, "-")
                                        )
                                      }
                                      className={`mt-1 block w-full h-12 ${
                                        errors.name
                                          ? "border-red-500"
                                          : "border-gray-300"
                                      } rounded-md shadow-sm`}
                                    />
                                  )}
                                />
                                {errors.name && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.name.message?.toString()}
                                  </p>
                                )}
                              </div>
                              <DialogClose className="w-full mt-5">
                                <Button
                                  type="submit"
                                  className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
                                >
                                  <Check className="w-4 h-4 mr-2" /> Save
                                </Button>
                              </DialogClose>
                            </form>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(permission.id)}
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
        </Table>
      </div>
    </div>
  );
};

const PermissionPageWithSidebar = (params: any) =>
  WithSidebar(PermissionPage)(params);
export default PermissionPageWithSidebar;
