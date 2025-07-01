"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { hasPermission } from "@/context/auth.context";
import { FORBIDDEN, ROLES } from "@/constants/routes";

interface Permission {
  id: string;
  name: string;
}

interface MenuPermissionOption {
  id: string;
  permissions: Permission;
  isSelected?: false;
}

interface MenuPermissionForm {
  menuId: string;
  menu: string;
  permission: string[];
  isEditable: boolean;
}

const EditRolesPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const access = await hasPermission("Masterdata.Update");
      setHasAccess(access);
      if (!access) {
        router.push(FORBIDDEN);
      }
    };

    checkAccess();
  }, [router]);

  const { id } = params;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissionOptions, setPermissionOptions] = useState<any>({});
  const [menus, setMenus] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const roleService = new RoleService();
  const [permissionFields, setPermissionFields] = useState<
    MenuPermissionForm[]
  >([]);
  const { updateRole, fetchRoleById, addPermissionRole, deletePermissionRole } =
    useRole();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
    values: {
      id,
      name,
      description,
      menu: permissionFields.map((item) => item.menuId),
      permission: permissionFields.map((item) => item.permission),
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const res = await fetchRoleById(id);
          const groupedPermissions = res.data?.role_permissions.reduce(
            (acc: any, role: any) => {
              const menuName = role?.permissions?.pages?.name || "-";
              if (!acc[menuName]) {
                acc[menuName] = {
                  id: role.permissions.pages.id,
                  permissions: [],
                };
              }
              acc[menuName].permissions.push(role);
              return acc;
            },
            {}
          );

          const updatedPermissionOpt: any = {};
          const updatedPermissionFields = Object.keys(groupedPermissions).map(
            (key) => {
              const acquiredPermissions: string[] = [];
              const rolePermissionOpt: MenuPermissionOption[] = [];
              groupedPermissions[key].permissions.map((item: any) => {
                acquiredPermissions.push(item.permissions.id);
                rolePermissionOpt.push({
                  id: item.id,
                  permissions: {
                    id: item.permissions.id,
                    name: item.permissions.name,
                  },
                });
              });

              const menuId = groupedPermissions[key].id;
              if (!updatedPermissionOpt[menuId]) {
                updatedPermissionOpt[menuId] = [];
              }

              updatedPermissionOpt[menuId] = rolePermissionOpt;
              return {
                menu: key,
                menuId: groupedPermissions[key].id,
                permission: acquiredPermissions,
                isEditable: false,
              };
            }
          );
          setPermissionOptions(updatedPermissionOpt);
          setPermissionFields(updatedPermissionFields);
          setValue("name", res.data.name);
          setValue("description", res.data.description);
          setName(res.data.name);
          setDescription(res.data.description);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
        setMenus(result.data || []);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectMenu = async (value: string, field: any, index: number) => {
    const updateFormValue = [...permissionFields];
    updateFormValue[index].menu = menus.find((item) => item.id == value)?.name;
    updateFormValue[index].menuId = value;
    setPermissionFields(updateFormValue);
    field.onChange(value);

    try {
      const result: PermissionResponse = await roleService.getPermission(
        page,
        rowsPerPage,
        value
      );
      const updatedPermissionOpt: any = { ...permissionOptions };
      const permissionOption: MenuPermissionOption[] = result.data.map(
        (item: any) => ({
          id: "",
          permissions: {
            id: item.id,
            name: item.name,
          },
        })
      );
      updatedPermissionOpt[value] = permissionOption;
      setPermissionOptions(updatedPermissionOpt);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const handleTickPermission = async (
    isChecked: boolean,
    permissionId: string,
    index: number
  ) => {
    const updatedPermission = [...permissionFields];
    if (permissionFields[index]) {
      const currentPermission = permissionFields[index].permission;
      const menuId = permissionFields[index].menuId;
      const currentMenuPermission = permissionOptions[menuId];
      const updatedPermissionOptions = { ...permissionOptions };

      if (isChecked) {
        currentPermission.push(permissionId);

        const response = await addPermissionRole({
          role: id,
          permission: permissionId,
        });
        currentMenuPermission.map((item: MenuPermissionOption) => {
          let updatedData = item;
          if (item.permissions.id == permissionId) {
            updatedData.id = response.id;
          }

          return updatedData;
        });
      } else {
        const trxPermissionId = currentMenuPermission.find(
          (item: MenuPermissionOption) => item.permissions.id == permissionId
        )?.id;
        if (trxPermissionId) {
          await deletePermissionRole(trxPermissionId);
          currentMenuPermission.map((item: MenuPermissionOption) => {
            let updatedData = item;
            if (item.permissions.id == permissionId) {
              updatedData.id = "";
            }

            return updatedData;
          });

          const key = currentPermission.indexOf(permissionId);
          if (key > -1) {
            currentPermission.splice(key, 1);
          }
        }
      }

      updatedPermissionOptions[permissionFields[index].menuId] =
        currentMenuPermission;
      setPermissionOptions(updatedPermissionOptions);

      updatedPermission[index].permission = currentPermission;
      setPermissionFields(updatedPermission);
    }
  };

  const handleAddPermission = () => {
    const updateFormValue = [...permissionFields];
    updateFormValue.push({
      menu: "",
      menuId: "",
      permission: [],
      isEditable: true,
    });
    setPermissionFields(updateFormValue);
  };

  const handleDeletePermission = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this permission?")) {
      try {
        await roleService.deletePermission(id);
        // setPermissionFields((prevPermissions) =>
        //   prevPermissions.filter((perm) => perm.menuId !== id)
        // );
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete perm:", error);
      }
    }
  };

  const handleSaveRolePermission = async (index: any) => {
    try {
      const updateFormValue = [...permissionFields];
      updateFormValue[index].isEditable = false;
      setPermissionFields(updateFormValue);
    } catch (error) {
      console.error("Failed to add permission role:", error);
    }
  };

  const handleBulkEditPermission = async (index: number) => {
    try {
      const result = await roleService.getPermission(
        page,
        rowsPerPage,
        permissionFields[index].menuId
      );

      const menuId = permissionFields[index].menuId;
      const menuPermissionOpt = result.data.map((item: any) => {
        const authPermission = permissionOptions[menuId].find(
          (currentPermission: any) =>
            currentPermission.permissions.id == item.id
        );

        return {
          id: authPermission ? authPermission.id : "",
          permissions: {
            id: item.id,
            name: item.name,
          },
        };
      });
      const updatedPermissionOpt = { ...permissionOptions };
      updatedPermissionOpt[menuId] = menuPermissionOpt;
      setPermissionOptions(updatedPermissionOpt);

      const updateFormValue = [...permissionFields];
      updateFormValue[index].isEditable = true;
      setPermissionFields(updateFormValue);

      setValue(`menu.${index}`, updateFormValue[index].menuId);
      setValue(`permission.${index}`, updateFormValue[index].permission);
    } catch (error) {
      console.error("Failed to delete permission role:", error);
    }
  };

  const handleBulkDeleteRolePermission = async (index: number) => {
    if (
      window.confirm("Are you sure you want to delete this menu permission?")
    ) {
      try {
        const { menuId } = permissionFields[index];
        if (menuId) {
          for (let i = 0; i < permissionOptions[menuId].length; i++) {
            const trxPermissionId = permissionOptions[menuId][i].id;
            await deletePermissionRole(trxPermissionId);
          }

          const updatedPermissionFields = [...permissionFields];
          updatedPermissionFields.splice(index, 1);
          setPermissionFields(updatedPermissionFields);
        }
      } catch (error) {
        console.error("Failed to permission role:", error);
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
              href={ROLES}
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
                {permissionFields.map((item, indexPage) => (
                  <TableRow key={indexPage}>
                    {item.isEditable ? (
                      <>
                        <TableCell className="min-w-48 w-80">
                          <Controller
                            name={`menu.${indexPage}` as const}
                            control={control}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={(value: string) => {
                                  selectMenu(value, field, indexPage);
                                }}
                              >
                                <SelectTrigger className="w-full h-10 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2 rounded-xl min-w-28">
                                  <SelectValue placeholder="Select Menu" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {menus.map((menu: any) => (
                                      <SelectItem key={menu.id} value={menu.id}>
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
                            name={`permission.${indexPage}` as const}
                            control={control}
                            render={({ field }) => (
                              <div className="flex flex-wrap gap-5 bg-white border px-4 py-2 min-h-11 rounded-lg">
                                {permissionOptions[item.menuId]?.map(
                                  (
                                    perm: MenuPermissionOption,
                                    index: number
                                  ) => (
                                    <label
                                      key={index}
                                      className="flex items-center"
                                    >
                                      <Input
                                        type="checkbox"
                                        value={perm.permissions.id}
                                        checked={perm.id ? true : false}
                                        onChange={(event) => {
                                          event.stopPropagation();
                                          handleTickPermission(
                                            event.target.checked,
                                            perm.permissions.id,
                                            indexPage
                                          );
                                        }}
                                        className="w-4 h-4 max-h-4"
                                      />
                                      <span className="ml-2">
                                        {perm.permissions.name}
                                      </span>
                                    </label>
                                  )
                                )}
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
                                handleSaveRolePermission(indexPage);
                              }}
                            >
                              <Check className="w-5 h-5" />
                            </Button>
                            <Button
                              className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                              onClick={(e) => {
                                e.preventDefault();
                                handleBulkDeleteRolePermission(indexPage);
                              }}
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="py-1">{item.menu}</TableCell>
                        <TableCell className="py-3">
                          <div className="flex flex-wrap gap-2">
                            {permissionOptions[item.menuId]?.map(
                              (perm: MenuPermissionOption) => {
                                if (perm.id) {
                                  return (
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
                                  );
                                } else {
                                  return null;
                                }
                              }
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-1 text-center">
                          <div className="flex gap-2">
                            <Button
                              className="text-black/50 hover:text-black bg-transparent hover:bg-transparent p-0"
                              onClick={(e) => {
                                e.preventDefault();
                                handleBulkEditPermission(indexPage);
                              }}
                            >
                              <Edit className="w-5 h-5" />
                            </Button>
                            <Button
                              className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                              onClick={(e) => {
                                e.preventDefault();
                                handleBulkDeleteRolePermission(indexPage);
                              }}
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
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
