"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useRequireAuth from "@/hooks/useRequireAuth";
import { Input } from "@/components/ui/input";
import WithSidebar from "@/hoc/with-sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Check, ChevronLeft, Plus, Trash2 } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { usePages } from "../hooks";
import React from "react";
import {
  PermissionResponse,
  PermissionService,
} from "@/services/masterdata/permission.service";
import { usePermission } from "../permission.hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { hasPermission } from "@/context/auth.context";

interface PermissionField {
  id: string;
  name: string;
}

const EditPage = ({ params }: { params: { id: string } }) => {
  useRequireAuth();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const access = await hasPermission("Masterdata.Update");
      setHasAccess(access);
      if (!access) {
        router.push("/forbidden");
      }
    };

    checkAccess();
  }, [router]);
  const { id } = params;
  const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);
  const path = usePathname();

  const [name, setName] = useState("");
  const [pageData, setPageData] = useState();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [selectPage, setSelectPage] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageId, setPageId] = useState("");

  const { updatePages, fetchPagesById } = usePages();
  const [permissionFields, setPermissionFields] = useState<PermissionField[]>([
    { id: "", name: "" },
  ]);
  const permissionService = new PermissionService();

  const { savePermission } = usePermission();
  const [permission, setPermission] = useState<PermissionResponse[]>([]);

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
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const id = params.id;

      const existingPermissions = permission.map((perm) => perm.name);

      for (let i = 0; i < permissionFields.length; i++) {
        const permissionData = {
          page: pageId,
          name: permissionFields[i].name,
        };

        if (
          permissionData.name &&
          !existingPermissions.includes(permissionData.name)
        ) {
          await savePermission(permissionData);
        }
      }

      await updatePages(data, id);

      alert("Data berhasil disimpan!");
      router.push(`/masterdata/page-management`);
    } catch (error) {
      console.error("Failed to save permissions or update page:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
      setUpdateSuccess(false);
    }
  };

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await fetchPagesById(id);
          setName(res.data.name);
          setPageData(res);
          setPageId(res.data.id);
          setValue("name", res.data.name);
        } catch (error) {
          console.error("Error fetching category by ID:", error);
        }
      })();
    }
  }, [id, setValue]);

  useEffect(() => {
    if (pageId) {
      const fetchPermission = async () => {
        try {
          const result = await permissionService.getPermission(
            page,
            rowsPerPage,
            String(pageId)
          );
          setPermission(result.data);
          setTotalPages(result.meta.pageTotal);
          setTotalItems(result.meta.total);
        } catch (error) {
          console.error("Error fetching permissions:", error);
        }
      };

      fetchPermission();
    }
  }, [page, rowsPerPage, pageId]);

  useEffect(() => {
    if (permission.length > 0) {
      const updateFormValue = permission.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      setPermissionFields(updateFormValue);
    } else {
      setPermissionFields([{ id: "", name: "" }]);
    }
  }, [permission]);

  useEffect(() => {
    if (updateSuccess === true) {
      alert("Data berhasil disimpan!");
      router.back();
    } else if (updateSuccess === false) {
      alert("Terjadi kesalahan saat menyimpan data.");
    }
    setUpdateSuccess(null);
  }, [updateSuccess, router]);

  const handleChangeProduct = (index: number, value: string) => {
    const updateFormValue = [...permissionFields];
    updateFormValue[index] = { ...updateFormValue[index], name: value || "" };
    setPermissionFields(updateFormValue);
  };

  const handleDeletePermission = async (id: string) => {
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

  const handleAddPermission = () => {
    const updateFormValue = [...permissionFields];
    updateFormValue.push({ id: "", name: "" });
    setPermissionFields(updateFormValue);
  };

  return (
    <div className="flex flex-col w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white md:px-6 p-4 flex items-center">
          <div>
            <Breadcrumb className="sm:block hidden">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink>Masterdata</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="cursor-pointer"
                    onClick={() => router.back()}
                  >
                    Page Management
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
              Edit Page Management
            </h2>
          </div>

          <div className="flex ml-auto">
            <div
              onClick={() => router.back()}
              className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </div>
            <Button
              type="submit"
              className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-5 rounded-full px-5"
            >
              <Check className="mr-2 w-4 h-4" />
              Save
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-full p-4 md:p-6 gap-4">
          <div className="p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4">
            <div className="text-primary font-bold">Menu Details</div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Menu Name
              </label>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: "Menu Name is required" }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="name"
                    placeholder="Insert Menu Name"
                    {...field}
                    className={`mt-1 block w-full h-12 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm`}
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-white rounded-lg gap-4">
            <div className="flex gap-4 items-center">
              <div>
                <div className="text-primary font-bold mb-2">Permissions</div>
              </div>
              <Button
                className="bg-[#F5BA41] hover:bg-[#e6a92d] text-black rounded-full px-5 ml-auto"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddPermission();
                }}
              >
                <Plus className="mr-1" width={18} height={18} />
                Add Permission
              </Button>
            </div>
            <div className="w-full bg-white rounded-lg overflow-auto mt-5">
              <Table className="table-search-params">
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap py-2">
                      Name
                    </TableHead>
                    <TableHead className="py-2 w-10 text-center">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissionFields.map((item, index) => (
                    <React.Fragment key={index}>
                      <TableRow>
                        <TableCell className="py-1">
                          <Input
                            type="text"
                            id="name"
                            placeholder="Insert permission name"
                            value={item.name}
                            onChange={(e) => {
                              handleChangeProduct(index, e.target.value);
                            }}
                            className={`mt-1 block w-full h-12 ${
                              errors.name ? "border-red-500" : "border-gray-300"
                            } rounded-md shadow-sm`}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            className="text-red-500 hover:bg-transparent"
                            variant="ghost"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeletePermission(item.id);
                            }}
                          >
                            <Trash2 />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const EditPageWithSidebar = (params: any) => WithSidebar(EditPage)(params);
export default EditPageWithSidebar;
