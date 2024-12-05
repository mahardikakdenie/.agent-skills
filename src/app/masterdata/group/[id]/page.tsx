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
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Trash2,
  X,
} from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useGroup } from "../hooks";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AccountGroup,
  GroupResponse,
  GroupService,
  RoleResponse,
  UserResponse,
} from "@/services/masterdata/group.service";
import Image from "next/image";
import noData from "/public/images/no-data.webp";
import { format } from "date-fns";

const EditGroup = ({ params }: { params: { id: string } }) => {
  useRequireAuth();
  const router = useRouter();
  const { id } = params;
  const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);
  const path = usePathname();
  const groupService = new GroupService();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenUser, setIsModalOpenUser] = useState(false);

  const [name, setName] = useState("");

  const {
    updateGroup,
    fetchGroupById,
    addGroupRole,
    removeGroupRole,
    addGroupAccount,
    removeGroupAccount,
  } = useGroup();
  const [dataRoles, setDataRoles] = useState<any[]>([]);
  const [group, setGroup] = useState<GroupResponse[]>([]);
  const [role, setRole] = useState<RoleResponse[]>([]);
  const [account, setAccount] = useState<UserResponse[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [groupRoles, setGroupRoles] = useState<any[]>([]);
  const [platformFilter, setPlatformFilter] = useState("");
  const [rolesFilter, setRolesFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageRoles, setPageRoles] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalItemsRoles, setTotalItemsRoles] = useState(0);
  const [totalItemsUser, setTotalItemsUser] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsPerPageRoles, setRowsPerPageRoles] = useState(10);
  const [loading, setLoading] = useState(true);
  const [dataUser, setDataUser] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string[]>([]);
  const [groupUser, setGroupUser] = useState<AccountGroup[]>([]);
  const [userFilter, setUserFilter] = useState("");

  const isAllSelected = selectedRoles.length === dataRoles.length;
  const isAllSelectedUser = selectedUser.length === dataUser.length;

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

  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true);
      try {
        const result = await groupService.getGroup(page);
        setGroup(result.data);
        setTotalItems(result.meta.total);
      } catch (error) {
        console.error("Error fetching insurance products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [page]);

  const onSubmit = async (data: any) => {
    try {
      await updateGroup(data, id);
      setUpdateSuccess(true);
    } catch (error) {
      setUpdateSuccess(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const res = await fetchGroupById(id);
          setSelectedUser(
            res.data?.account_groups.map((item: any) => item.accounts.id)
          );
          setGroupUser(res.data?.account_groups.map((item: any) => item));
          setSelectedRoles(
            res.data?.group_roles.map((item: any) => item.roles.id)
          );
          setGroupRoles(res.data?.group_roles.map((item: any) => item));
          setValue("name", res.data.name);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchData();
  }, [id, setValue]);

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
    const fetchRole = async () => {
      setLoading(true);
      try {
        const result = await groupService.getRoles(pageRoles, rowsPerPageRoles);
        const filteredRoles = result.data.filter((role: any) => {
          const matchesPlatform = platformFilter
            ? role.description === platformFilter
            : true;
          const matchesRoles = rolesFilter
            ? role.name?.toLowerCase().includes(rolesFilter.toLowerCase())
            : true;
          return matchesPlatform && matchesRoles;
        });

        setRole(filteredRoles);
        setTotalPages(result.meta.pageTotal);
        setTotalItems(result.meta.total);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [pageRoles, rowsPerPageRoles, platformFilter, rolesFilter]);

  const selectRoles = () => {
    groupService.getRoles(page, rowsPerPage).then((res) => {
      setDataRoles(res.data);
      setTotalItemsRoles(res.meta.total);
    });
  };

  const handleSelectRoles = (id: string) => {
    selectRoles();
  };

  const handleAddSelectedRoles = async () => {
    const addedIds = groupRoles.map((item) => item.roles.id);
    const updatedGroupRoles = [...groupRoles];
    for (let i = 0; i < selectedRoles.length; i++) {
      if (!addedIds.includes(selectedRoles[i])) {
        const response = await addGroupRole({
          group: id,
          role: selectedRoles[i],
        });

        if (response) {
          const groupId = response.id;
          const userData = dataRoles.find(
            (item) => item.id == selectedRoles[i]
          );
          updatedGroupRoles.push({
            id: groupId,
            roles: userData,
          });
        }
      }
    }
    setGroupRoles(updatedGroupRoles);
  };

  const handleDeleteSelectedRole = async (id: string) => {
    const response = await removeGroupRole(id);
    if (response) {
      const selectedIds: string[] = [];
      const updatedGroupRoles: AccountGroup[] = [];
      groupRoles.map((group) => {
        if (group.id != id) {
          selectedIds.push(group.roles.id);
          updatedGroupRoles.push(group);
        }
      });

      setGroupRoles(updatedGroupRoles);
      setSelectedRoles(selectedIds);
    }
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedRoles((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((roleId) => roleId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAllChange = () => {
    if (isAllSelected) {
      setSelectedRoles([]);
    } else {
      setSelectedRoles(dataRoles.map((role) => role.id));
    }
  };

  const isRolesSelected = (id: string) => selectedRoles.includes(id);

  const uniquePlatforms = Array.from(
    new Set(dataRoles.map((role) => role.description))
  );

  const handleRowsPerPageChangeRoles = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPageRoles(Number(e.target.value));
    setPageRoles(1);
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const result = await groupService.getUser(page, rowsPerPage);
        const filteredUser = result.data.filter((user: any) => {
          const matchesUser = userFilter
            ? user.name?.toLowerCase().includes(userFilter.toLowerCase())
            : true;
          return matchesUser;
        });

        setAccount(filteredUser);
        setTotalPages(result.meta.pageTotal);
        setTotalItems(result.meta.total);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [page, rowsPerPage, platformFilter, userFilter]);

  const selectUser = () => {
    groupService.getUser(page, rowsPerPage).then((res) => {
      setDataUser(res.data);
      setTotalItemsUser(res.meta.total);
    });
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const handleSelectUser = (id: string) => {
    selectUser();
  };

  const handleAddSelectedUser = async () => {
    const addedIds = groupUser.map((item) => item.accounts.id);
    const updatedGroupUser = [...groupUser];
    for (let i = 0; i < selectedUser.length; i++) {
      if (!addedIds.includes(selectedUser[i])) {
        const response = await addGroupAccount({
          account: selectedUser[i],
          group: id,
        });

        if (response) {
          const groupId = response.id;
          const userData = dataUser.find((item) => item.id == selectedUser[i]);
          updatedGroupUser.push({
            id: groupId,
            accounts: userData,
          });
        }
      }
    }

    setGroupUser(updatedGroupUser);
  };

  const handleDeleteSelectedUser = async (id: string) => {
    const response = await removeGroupAccount(id);
    if (response) {
      const selectedIds: string[] = [];
      const updatedGroupUser: AccountGroup[] = [];
      groupUser.map((user) => {
        if (user.id != id) {
          selectedIds.push(user.accounts.id);
          updatedGroupUser.push(user);
        }
      });

      setGroupUser(updatedGroupUser);
      setSelectedUser(selectedIds);
    }
  };

  const handleSelectAllChangeUser = () => {
    if (isAllSelectedUser) {
      setSelectedUser([]);
    } else {
      setSelectedUser(dataUser.map((user) => user.id));
    }
  };

  const isUserSelected = (id: string) => selectedUser.includes(id);

  const handleCheckboxChangeUser = (id: string) => {
    setSelectedUser((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((userId) => userId !== id)
        : [...prevSelected, id]
    );
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
                    Group
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Detail</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
              Detail Group
            </h2>
          </div>

          <div className="flex ml-auto">
            <a
              href="/masterdata/group"
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
            <div className="text-primary font-bold mb-5">Group Details</div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Group Name
              </label>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{
                  required: "Group Name is required",
                }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="name"
                    placeholder="Insert Category Name"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\s+/g, "-"))
                    }
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
                <div className="text-primary font-bold mb-2">
                  Group Role ({groupRoles.length})
                </div>
                <p className="text-sm text-black/60">
                  <i>
                    The group will have permissions that are defined in the
                    selected roles
                  </i>
                </p>
              </div>
              <Dialog
                open={isModalOpen}
                onOpenChange={(open) => {
                  setIsModalOpen(open);
                  if (open) handleSelectRoles(id);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    color="warning"
                    className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full ml-auto w-32"
                    onClick={() => handleSelectRoles(id)}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Roles
                  </Button>
                </DialogTrigger>
                <DialogContent
                  style={{ zIndex: 100 }}
                  className="p-0 w-[1000px] max-w-full overflow-hidden"
                >
                  <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
                    <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
                      Select Roles
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

                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <select
                        value={platformFilter}
                        onChange={(e) => setPlatformFilter(e.target.value)}
                        className="px-4 text-sm border rounded-lg h-11"
                      >
                        <option value="">All Platforms</option>
                        {uniquePlatforms.map((platform) => (
                          <option key={platform} value={platform}>
                            {platform}
                          </option>
                        ))}
                      </select>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Search Roles Name"
                          value={rolesFilter}
                          onChange={(e) => setRolesFilter(e.target.value)}
                          className="px-4 text-sm border rounded-lg h-11"
                        />
                        <Search className="w-5 h-5 absolute right-3 top-3 text-gray-600" />
                      </div>
                    </div>

                    <Table className="table-claims">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap py-2 w-14">
                            <Input
                              type="checkbox"
                              checked={isAllSelected}
                              onChange={handleSelectAllChange}
                              className="w-4 h-4 mx-auto"
                            />
                          </TableHead>
                          <TableHead className="py-2">Roles</TableHead>
                          <TableHead className="py-2 w-52">Platform</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {role.length > 0 ? (
                          role.map((role) => (
                            <TableRow
                              key={role.id}
                              className="cursor-pointer"
                              onClick={() => handleCheckboxChange(role.id)}
                            >
                              <TableCell align="center">
                                <Input
                                  type="checkbox"
                                  checked={isRolesSelected(role.id)}
                                  onChange={(event) => {
                                    event.stopPropagation();
                                    handleCheckboxChange(role.id);
                                  }}
                                  className="w-4 h-4"
                                />
                              </TableCell>
                              <TableCell>{role?.name || "-"}</TableCell>
                              <TableCell className="w-36">
                                {role?.description || "-"}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow className="hover:!bg-white">
                            <TableCell colSpan={10}>
                              <div className="flex flex-col gap-4 items-center justify-center py-14">
                                <Image alt="no data" src={noData} width={200} />
                                No transaction data available
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>

                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={8}>
                            <div className="flex justify-center items-center gap-2 font-normal">
                              <label htmlFor="rowsPerPageRoles">Showing:</label>
                              <select
                                id="rowsPerPageRoles"
                                value={rowsPerPageRoles}
                                onChange={handleRowsPerPageChangeRoles}
                                className="p-2 border rounded"
                              >
                                {[10, 20, 30, 50].map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                              <span className="mr-2">
                                of {totalItemsRoles} items
                              </span>
                              <button
                                onClick={() =>
                                  setPageRoles((prevState) =>
                                    Math.max(prevState - 1, 1)
                                  )
                                }
                                disabled={page === 1}
                                title="Prev"
                              >
                                <ChevronLeft />
                              </button>
                              <button
                                onClick={() =>
                                  setPageRoles((prevState) =>
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

                  <DialogFooter className="sm:justify-center justify-center pb-4 sm:pb-6">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
                        onClick={handleAddSelectedRoles}
                      >
                        <Check className="w-4 h-4 mr-2" /> Save
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {groupRoles.length > 0 && (
              <div className="w-full bg-white rounded-lg overflow-auto mt-5">
                <Table className="table-search-params">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap py-2">
                        Platform
                      </TableHead>
                      <TableHead className="py-2">Role Name</TableHead>
                      <TableHead className="py-2 w-10 text-center">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="py-1">
                          {role?.roles?.name || "-"}
                        </TableCell>
                        <TableCell className="py-1">
                          {role?.roles?.description || "-"}
                        </TableCell>
                        <TableCell className="py-1 text-center">
                          <Button
                            className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteSelectedRole(role.id);
                            }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-lg gap-4">
            <div className="flex gap-4 items-center">
              <div>
                <div className="text-primary font-bold mb-2">
                  Group Users ({groupUser.length})
                </div>
                <p className="text-sm text-black/60">
                  <i>
                    All the users in the group will have permissions that are
                    defined in the selected group roles
                  </i>
                </p>
              </div>
              <Dialog
                open={isModalOpenUser}
                onOpenChange={(open) => {
                  setIsModalOpenUser(open);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    color="warning"
                    className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full ml-auto w-32"
                    onClick={() => handleSelectUser(id)}
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add User
                  </Button>
                </DialogTrigger>
                <DialogContent
                  style={{ zIndex: 100 }}
                  className="p-0 w-[1000px] max-w-full overflow-hidden"
                >
                  <DialogHeader className="bg-[#F8F8F8] py-3 px-4 sm:px-6">
                    <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
                      Select User
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

                  <div
                    className="p-4 overflow-auto"
                    style={{ maxHeight: "calc(100vh - 180px)" }}
                  >
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Search Users Name"
                          value={userFilter}
                          onChange={(e) => setUserFilter(e.target.value)}
                          className="px-4 text-sm border rounded-lg h-11"
                        />
                        <Search className="w-5 h-5 absolute right-3 top-3 text-gray-600" />
                      </div>
                    </div>

                    <Table className="table-claims">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap py-2 w-14">
                            <Input
                              type="checkbox"
                              checked={isAllSelectedUser}
                              onChange={handleSelectAllChangeUser}
                              className="w-4 h-4 mx-auto"
                            />
                          </TableHead>
                          <TableHead className="py-2">Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone Number</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {account.length > 0 ? (
                          account.map((user) => (
                            <TableRow
                              key={user.id}
                              className="cursor-pointer"
                              onClick={() => handleCheckboxChangeUser(user.id)}
                            >
                              <TableCell align="center">
                                <Input
                                  type="checkbox"
                                  checked={isUserSelected(user.id)}
                                  onChange={(event) => {
                                    event.stopPropagation();
                                    handleCheckboxChangeUser(user.id);
                                  }}
                                  className="w-4 h-4"
                                />
                              </TableCell>
                              <TableCell>{user?.name || "-"}</TableCell>
                              <TableCell>{user?.email || "-"}</TableCell>
                              <TableCell>{user?.phone_number || "-"}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow className="hover:!bg-white">
                            <TableCell colSpan={4}>
                              <div className="flex flex-col gap-4 items-center justify-center py-14">
                                <Image alt="no data" src={noData} width={200} />
                                No transaction data available
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
                              <span className="mr-2">
                                of {totalItemsUser} items
                              </span>
                              <button
                                onClick={() =>
                                  setPage((prevState) =>
                                    Math.max(prevState - 1, 1)
                                  )
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

                  <DialogFooter className="sm:justify-center justify-center pb-4 sm:pb-6">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
                        onClick={handleAddSelectedUser}
                      >
                        <Check className="w-4 h-4 mr-2" /> Save
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {groupUser.length > 0 && (
              <div className="w-full bg-white rounded-lg overflow-auto mt-5">
                <Table className="table-search-params">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="py-2">Name</TableHead>
                      <TableHead className="py-2 w-52">Last Activity</TableHead>
                      <TableHead className="py-2 w-10">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupUser.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="py-1">
                          {user?.accounts?.name || "-"}
                        </TableCell>
                        <TableCell className="py-1">
                          {user?.accounts?.updated_at
                            ? format(
                                new Date(user.accounts.updated_at),
                                "dd-MM-yyyy"
                              )
                            : format(new Date(), "dd-MM-yyyy")}
                        </TableCell>
                        <TableCell className="py-1 text-center">
                          <Button
                            className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteSelectedUser(user.id);
                            }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

const EditGroupWithSidebar = (params: any) => WithSidebar(EditGroup)(params);
export default EditGroupWithSidebar;
