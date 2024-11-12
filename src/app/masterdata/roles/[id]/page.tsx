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
import { useEffect, useState } from "react";
import { Check, ChevronLeft, Plus, Trash2, X } from "react-feather";
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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rolePermission, setRolePermission] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<string[]>([]);
  const roleService = new RoleService();
  const [selectedMenu, setSelectedMenu] = useState<string[]>([]);
  const [permissionFields, setPermissionFields] = useState<any[]>([
    { id: "", group: "", permission: "", isEdited: true },
  ]);

  const { updateRole, fetchRoleById, menu = [] } = useRole();

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
      menu: selectedMenu,
      permission: selectedPermission,
    },
    values: {
      id,
      name,
      description,
      menu,
      permission,
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
          setRolePermission(
            res.data?.role_permissions.map((item: any) => item)
          );
          setValue("name", res.data.name);
          setValue("description", res.data.description);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchData();
  }, [id, setValue]);

  const groupedPermissions = rolePermission.reduce((acc: any, role: any) => {
    const menuName = role?.permissions?.pages?.name || "-";
    if (!acc[menuName]) {
      acc[menuName] = [];
    }
    acc[menuName].push(role.permissions);
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
      setLoading(true);
      try {
        const result = await roleService.getMenu(page, rowsPerPage);
        setMenuPage(result.data);
      } catch (error) {
        console.error("Error fetching insurance products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [page, rowsPerPage]);
  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const result = await roleService.getMenu(page, rowsPerPage);
        setMenuPage(result.data);
      } catch (error) {
        console.error("Error fetching insurance products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [page, rowsPerPage]);

  const handleAddPermission = () => {
    const updateFormValue = [...permissionFields];
    updateFormValue.push({
      id: "",
      group: "",
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
          {Object.keys(groupedPermissions).length > 0 && (
            <div className="w-full bg-white rounded-lg overflow-auto">
              <Table className="table-search-params">
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap py-2">
                      Menu
                    </TableHead>
                    <TableHead className="py-2">Permission</TableHead>
                    <TableHead className="py-2 w-10 text-center"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(groupedPermissions).map(
                    ([menu, permissions]: [string, any]) => (
                      <TableRow key={menu}>
                        <TableCell className="py-1">{menu}</TableCell>
                        <TableCell className="py-3">
                          {permissions.map((perm: any) => (
                            <span
                              key={perm.id}
                              className="inline-flex items-center gap-2 mr-2 rounded-full bg-[#F0F1F5] border borer-[#E2E7EB] py-2 px-4"
                            >
                              {perm.name}
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
                        </TableCell>
                        <TableCell className="py-1 text-center">
                          <Button
                            className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                            onClick={(e) => {
                              e.preventDefault();
                              // handleDeleteSelectedRole(role.id);
                            }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  )}

                  <TableRow>
                    <TableCell>
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
                            onValueChange={(value: string) => {
                              field.onChange(value);
                            }}
                          >
                            <SelectTrigger className="w-full h-10 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2 rounded-xl min-w-28">
                              <SelectValue placeholder="Select Menu" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {menuPage.map((menu: any) => (
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
                          <Select
                            value={field.value.join(", ")} // Convert array to string for display
                            // onValueChange={(value: string) => {
                            //   // Toggle selection
                            //   const newValue = field.value.includes(value)
                            //     ? field.value.filter(
                            //         (item: string) => item !== value
                            //       ) // Remove if exists
                            //     : [...field.value, value]; // Add if not exists

                            //   field.onChange(newValue); // Update the field value
                            // }}
                          >
                            <SelectTrigger className="w-full h-10 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2 rounded-xl min-w-28">
                              <SelectValue placeholder="Select Permission" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {permission.map((prmission: any) => (
                                  <SelectItem
                                    key={prmission.id}
                                    value={prmission.name}
                                  >
                                    {prmission?.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </TableCell>

                    <TableCell className="py-1 text-center">
                      <Button
                        className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                        onClick={(e) => {
                          e.preventDefault();
                          // handleDeleteSelectedRole(role.id);
                        }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

const EditRolesWithSidebar = (params: any) =>
  WithSidebar(EditRolesPage)(params);
export default EditRolesWithSidebar;
