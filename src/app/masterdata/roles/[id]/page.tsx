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
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, Edit, Plus, Trash2, X } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRole } from "../hooks";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MenuResponse,
  PermissionResponse,
  RoleService,
} from "@/services/masterdata/roles.service";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

const EditRolesPage = ({ params }: { params: { id: string } }) => {
  useRequireAuth();
  const router = useRouter();
  const { id } = params;
  const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuPage, setMenuPage] = useState<MenuResponse[]>([]);
  const [permission, setPermission] = useState<PermissionResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pages, setPages] = useState<any[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [rolePermission, setRolePermission] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<string[]>([]);
  const roleService = new RoleService();
  const [totalItems, setTotalItems] = useState(0);
  const [selectPage, setSelectPage] = useState("");
  const [permissionFields, setPermissionFields] = useState<any[]>([
    { id: "", menu: "", permission: "", isEdited: true },
  ]);

  const { updateRole, fetchRoleById, addPermissionRole } = useRole();

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
      description,
      menu: selectPage,
      permission: selectedPermission,
    },
    values: {
      id,
      name: "",
      description: "",
      menu: "",
      permission: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const res = await fetchRoleById(id);
          setSelectedPermission(
            res.data?.role_permissions.map((item: any) => item.permissions.id)
          );
          setRolePermission(res.data?.role_permissions);
          setValue("name", res.data.name);
          setValue("description", res.data.description);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchData();
  }, [id]);

  const groupedPermissions = rolePermission.reduce((acc: any, role: any) => {
    const menuName = role?.permissions?.pages?.name || "-";
    if (!acc[menuName]) {
      acc[menuName] = [];
    }
    acc[menuName].push(role);
    return acc;
  }, {});

  const onSubmit = async (data: any) => {
    try {
      await updateRole(data, id);
      setUpdateSuccess(true);
    } catch (error) {
      setUpdateSuccess(false);
    }
  };

  useEffect(() => {
    if (updateSuccess === true) {
      alert("Data berhasil disimpan!");
      router.back();
    } else if (updateSuccess === false) {
      alert("Terjadi kesalahan saat menyimpan data.");
    }
    setUpdateSuccess(null);
  }, [updateSuccess, router]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const result = await roleService.getMenu(page, rowsPerPage);
        setPages(result.data || []);
        if (!selectPage && result.data?.length > 0) {
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const selectMenu = async (value: string, field: any) => {
    field.onChange(value);
    try {
      const selectedPage = pages.find((page: any) => page.name === value);
      if (selectedPage) {
        const result = await roleService.getPermission(
          page,
          rowsPerPage,
          selectedPage.id
        );
        setPermission(result.data);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const handleAddPermission = () => {
    const updateFormValue = [...permissionFields];
    updateFormValue.push({
      id: "",
      menu: "",
      permission: "",
      isEdited: true,
    });
    setPermissionFields(updateFormValue);
  };

  const handleDeletePermission = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      try {
        await roleService.deletePermission(id);
        setPermissions((prevPermissions) =>
          prevPermissions.filter((perm) => perm.id !== id)
        );
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete perm:", error);
      }
    }
  };

  const handleAddPermissionRole = async (id: any) => {
    try {
      const roleId = await fetchRoleById(id);
      const data = {
        role: "",
        permission: "",
      };

      await addPermissionRole(data, id);
      console.log("Permission role added successfully:", data);
    } catch (error) {
      console.error("Failed to add permission role:", error);
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
                    Role
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Detail</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
              Edit Role
            </h2>
          </div>

          <div className="flex ml-auto">
            <a
              href="/masterdata/roles"
              className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </a>
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
          <div className="p-4 sm:p-6 bg-white rounded-lg gap-4">
            <div className="text-primary font-bold mb-1">Role Details</div>
            <p className="mb-5 text-sm text-gray-500">
              <i>
                Role defines what users can do and what responsibilities they
                have
              </i>
            </p>
            <div className="mb-5">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Role Name<span className="text-red-500">*</span>
              </label>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{
                  required: "Role Name is required",
                }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="name"
                    placeholder="Insert role description"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                    className={`mt-1 block w-full h-12 ${
                      errors.description ? "border-red-500" : "border-gray-300"
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
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Role Description
              </label>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Textarea
                    id="description"
                    rows={7}
                    placeholder="Insert role name"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\s+/g, "-"))
                    }
                    className={`mt-1 block w-full ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm`}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div>
              <div className="text-primary font-bold mb-2">Permissions</div>
              <p className="text-sm text-black/60">
                <i>
                  Permission is a type of menu access assigned to a specific
                  role
                </i>
              </p>
            </div>
            <Button
              color="warning"
              className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full ml-auto w-32"
              onClick={(e) => {
                e.preventDefault();
                handleAddPermission();
              }}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Menu
            </Button>
          </div>
          <div className="w-full bg-white rounded-lg overflow-auto">
            <Table className="table-search-params">
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap py-2">Menu</TableHead>
                  <TableHead className="py-2">Permission</TableHead>
                  <TableHead className="py-2 w-10 text-center"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(groupedPermissions).map(
                  ([menu, rolePermission]: [string, any]) => (
                    console.log(rolePermission),
                    (
                      <TableRow key={menu}>
                        <TableCell className="py-1">{menu}</TableCell>
                        <TableCell className="py-3">
                          <div className="flex flex-wrap gap-2">
                            {rolePermission.map((perm: any) => (
                              <span
                                key={perm.id}
                                className="inline-flex items-center gap-2 rounded-full bg-[#F0F1F5] border borer-[#E2E7EB] py-2 px-4"
                              >
                                {perm.permissions.name}
                                <Button
                                  className="text-default-300 bg-transparent hover:bg-transparent p-0 h-[20px]"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeletePermission(perm.id);
                                  }}
                                >
                                  <X className="w-5 h-5" />
                                </Button>
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="py-1 text-center">
                          <div className="flex gap-2">
                            <Button
                              className="text-black/50 hover:text-black bg-transparent hover:bg-transparent p-0"
                              onClick={(e) => {
                                e.preventDefault();
                              }}
                            >
                              <Edit className="w-5 h-5" />
                            </Button>
                            <Button
                              className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                              onClick={(e) => {
                                e.preventDefault();
                              }}
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  )
                )}
                {permissionFields.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="min-w-48 w-80">
                      <Controller
                        name="menu"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={
                              Array.isArray(field.value)
                                ? field.value[0] || ""
                                : field.value || ""
                            }
                            onValueChange={(value: string) =>
                              selectMenu(value, field)
                            }
                          >
                            <SelectTrigger className="w-full h-10 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2 rounded-xl min-w-28">
                              <SelectValue placeholder="Select Menu" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {pages.map((menu: any) => (
                                  <SelectItem key={menu.id} value={menu.name}>
                                    {menu?.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>

                    <TableCell className="py-3">
                      <Controller
                        name="permission"
                        control={control}
                        render={({ field }) => (
                          <div className="flex flex-wrap gap-5 bg-white border px-4 py-2 min-h-11 rounded-lg">
                            {permission.map((perm: any) => (
                              <label
                                key={perm.id}
                                className="flex items-center"
                              >
                                <Input
                                  type="checkbox"
                                  value={perm.id}
                                  onChange={(event) => {
                                    event.stopPropagation();
                                  }}
                                  className="w-4 h-4 max-h-4"
                                />
                                <span className="ml-2">{perm.name}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      />
                    </TableCell>

                    <TableCell className="py-1 text-center">
                      <div className="flex gap-2">
                        <Button
                          className="text-black/50 hover:text-black bg-transparent hover:bg-transparent p-0"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddPermissionRole(permission[0]?.id);
                          }}
                        >
                          <Check className="w-5 h-5" />
                        </Button>
                        <Button
                          className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </form>
    </div>
  );
};

const EditRolesWithSidebar = (params: any) =>
  WithSidebar(EditRolesPage)(params);
export default EditRolesWithSidebar;
