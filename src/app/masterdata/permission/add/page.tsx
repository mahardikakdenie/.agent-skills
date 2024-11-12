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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Check, ChevronLeft, Plus, Trash2, Upload } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import {
  PermissionResponse,
  PermissionService,
} from "@/services/masterdata/permission.service";
import { usePermission } from "../hooks";

const AddPermission = ({ params }: { params: { id: string } }) => {
  useRequireAuth();
  const router = useRouter();
  const { id } = params;
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const path = usePathname();
  const permissionService = new PermissionService();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectPage, setSelectPage] = useState("");
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<any[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [totalItems, setTotalItems] = useState(0);
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [permission, setPermission] = useState<PermissionResponse[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<any>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [permissionFields, setPermissionFields] = useState<any[]>([
    { id: "", name: "" },
  ]);

  const { updatePermission, savePermission } = usePermission();

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
    defaultValues: {
      name,
      groups: selectedGroups,
      page,
    },
    values: {
      name,
      page,
    },
  });

  useEffect(() => {
    console.log(selectPage);

    if (selectPage) {
      const fetchPermission = async () => {
        setLoading(true);
        try {
          const result = await permissionService.getPermission(
            page,
            rowsPerPage,
            selectPage
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
      if (selectPage) {
        fetchPermission();
      }
    }
  }, [page, rowsPerPage, selectPage]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const result = await permissionService.getPages(page, rowsPerPage);
        setPages(result.data || []);
        if (!selectPage && result.data?.length > 0) {
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [page, rowsPerPage]);

  const selectTab = (selectedTab: any) => {
    setSelectPage(selectedTab);
    setPage(1);
  };

  const onSubmit = async (data: any) => {
    try {
      const existingPermissions = permission.map((perm) => perm.name);

      for (let i = 0; i < permissionFields.length; i++) {
        const permissionData = {
          page: selectPage,
          name: permissionFields[i].name,
        };

        if (
          permissionData.name &&
          !existingPermissions.includes(permissionData.name)
        ) {
          await savePermission(permissionData);
        }
      }

      setSaveSuccess(true);
    } catch (error) {
      console.error("Failed to save permissions:", error);
      setSaveSuccess(false);
    }
  };

  useEffect(() => {
    if (saveSuccess === true) {
      alert("Data berhasil disimpan!");
      router.back();
    } else if (saveSuccess === false) {
      alert("Terjadi kesalahan saat menyimpan data.");
    }
    setSaveSuccess(null);
  }, [saveSuccess, router]);

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

  const handleAddPermission = () => {
    const updateFormValue = [...permissionFields];
    updateFormValue.push({ id: "", name: "" });
    setPermissionFields(updateFormValue);
  };

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
                    Permission
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
              Add Permission
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
          <div className="p-4 sm:p-6 bg-white rounded-lg flex-col gap-4 grid sm:grid-cols-2">
            <div>
              <label
                htmlFor="page"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Page
              </label>
              <Controller
                name="page"
                control={control}
                rules={{ required: "Page is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      const pageValue = Number(value);
                      setValue("page", pageValue);
                      selectTab(value);
                    }}
                  >
                    <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                      <SelectValue placeholder="Select Page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {pages.map((page: any) => (
                          <SelectItem key={page.id} value={page.id}>
                            {page.name
                              .split("-")
                              .map(
                                (word: string) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message?.toString()}
                </p>
              )}
            </div>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-lg gap-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Permission Name <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col gap-3">
              {permissionFields.map((item, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-center">
                    <Input
                      type="text"
                      id="name"
                      placeholder="Insert Permission Name"
                      value={item.name}
                      onChange={(e) => {
                        handleChangeProduct(index, e.target.value);
                      }}
                      className={`mt-1 block w-full h-12 ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm`}
                    />
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
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="mt-4">
              <Button
                className="bg-[#F5BA41] hover:bg-[#e6a92d] text-black rounded-full px-5"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddPermission();
                }}
              >
                <Plus className="mr-1" width={18} height={18} />
                Add Permission
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const AddPermissionWithSidebar = (params: any) =>
  WithSidebar(AddPermission)(params);
export default AddPermissionWithSidebar;
