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
  Trash2,
  X,
} from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useGroup } from "../hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [groupRoles, setGroupRoles] = useState<any[]>([]);
  const [platformFilter, setPlatformFilter] = useState("");
  const [rolesFilter, setRolesFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
          setGroupUser(
            res.data?.account_groups.map((item: any) => item.accounts)
          );
          setSelectedRoles(
            res.data?.group_roles.map((item: any) => item.roles.id)
          );
          setGroupRoles(res.data?.group_roles.map((item: any) => item.roles));
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

  const selectRoles = () => {
    groupService.getRoles(page, rowsPerPage).then((res) => {
      setDataRoles(res.data);
    });
  };

  const handleSelectRoles = (id: string) => {
    selectRoles();
  };

  const handleAddSelectedRoles = () => {
    const selected = dataRoles.filter((role) =>
      selectedRoles.includes(role.id)
    );
    setGroupRoles(selected);
  };

  const handleDeleteSelectedRole = (id: string) => {
    setGroupRoles((prev) => prev.filter((role) => role.id !== id));
    setSelectedRoles((prev) => prev.filter((roleId) => roleId !== id));
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

  const filteredRoles = dataRoles.filter((role) => {
    const matchesPlatform = platformFilter
      ? role.description === platformFilter
      : true;
    const matchesRoles = rolesFilter
      ? role.name?.toLowerCase().includes(rolesFilter.toLowerCase())
      : true;
    return matchesPlatform && matchesRoles;
  });

  const uniquePlatforms = Array.from(
    new Set(dataRoles.map((role) => role.description))
  );

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const selectUser = () => {
    groupService.getUser(page, rowsPerPage).then((res) => {
      setDataUser(res.data);
    });
  };

  const handleSelectUser = (id: string) => {
    selectUser();
  };

  const handleAddSelectedUser = async () => {
    const selected = dataUser.filter((user) => selectedUser.includes(user.id));
    const selectedIds = [];
    for (let i = 0; i < selected.length; i++) {
      const response = await addGroupAccount({
        account: selected[i].id,
        group: id,
      });

      if (response) {
        selectedIds.push(response.id);
      }
    }
    setGroupUser(selected);
    setSelectedUser(selectedIds);
  };

  const handleDeleteSelectedUser = async (id: string) => {
    const response = await removeGroupAccount(id);
    if (response) {
      setGroupUser((prev) => prev.filter((user) => user.id !== id));
      setSelectedUser((prev) => prev.filter((userId) => userId !== id));
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

  const filteredUser = dataUser.filter((user) => {
    const matchesUser = userFilter
      ? user.name?.toLowerCase().includes(userFilter.toLowerCase())
      : true;
    return matchesUser;
  });

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

                      <Input
                        type="text"
                        placeholder="Search Roles Name"
                        value={rolesFilter}
                        onChange={(e) => setRolesFilter(e.target.value)}
                        className="px-4 text-sm border rounded-lg h-11"
                      />
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
                        {filteredRoles.length > 0 ? (
                          filteredRoles.map((role) => (
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
                                of {totalItems} items
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
                          {role?.description || "-"}
                        </TableCell>
                        <TableCell className="py-1">
                          {role?.name || "-"}
                        </TableCell>
                        <TableCell className="py-1 text-center">
                          <Button
                            className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                            onClick={() => handleDeleteSelectedRole(role.id)}
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
                  // if (open) handleSelectUser(id);
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
                      <Input
                        type="text"
                        placeholder="Search Users Name"
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                        className="px-4 text-sm border rounded-lg h-11"
                      />
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
                          <TableHead>Last Activity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUser.length > 0 ? (
                          filteredUser.map((user) => (
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
                              <TableCell className="w-36">
                                {user?.description || "-"}
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
                                of {totalItems} items
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
                      <TableHead className="py-2">Last Activity</TableHead>
                      <TableHead className="py-2 w-10">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupUser.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="py-1">
                          {user?.name || "-"}
                        </TableCell>
                        <TableCell className="py-1">
                          {user?.updated_at
                            ? format(new Date(user?.updated_at), "dd-MM-yyyy")
                            : "N/A"}
                        </TableCell>
                        <TableCell className="py-1 text-center">
                          <Button
                            className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                            onClick={() => handleDeleteSelectedUser(user.id)}
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

const EdiGroupWithSidebar = (params: any) => WithSidebar(EditGroup)(params);
export default EdiGroupWithSidebar;
