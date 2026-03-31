"use client";

import React, { useEffect } from "react";
import {
  Check,
  ChevronLeft,
  Plus,
  Trash2,
  X,
  Search,
  ChevronRight,
} from "react-feather";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui";
import { Input } from "@repo/ui";
import { Button } from "@repo/ui";
import { Controller } from "react-hook-form";
import { ContentLoadingWrapper } from "@/components/ui/loading";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { format } from "date-fns";
import Image from "next/image";
import noData from "@public/images/no-data.webp";

interface GroupFormProps {
  mode: "create" | "edit";
  groupId?: string;

  handleSubmit: any;
  control: any;
  errors: any;
  watch: any;
  setValue: any;

  groupName: string;
  groupRoles: any[];
  groupUsers: any[];
  availableRoles: any[];
  availableUsers: any[];

  isLoadingDetail: boolean;
  isLoadingRoles: boolean;
  isLoadingUsers: boolean;
  isSaving: boolean;

  onSave: (formData: any) => void;
  onBack: () => void;
  loadGroupDetail: (id: string) => void;
  onAddRole: (roleIds: string[]) => Promise<void>;
  onDeleteRole: (groupRoleId: string) => Promise<void>;
  onAddUser: (userIds: string[]) => Promise<void>;
  onDeleteUser: (groupUserId: string) => Promise<void>;
}

export default function GroupForm({
  mode,
  groupId,
  handleSubmit,
  control,
  errors,
  watch,
  setValue,
  groupName,
  groupRoles,
  groupUsers,
  availableRoles,
  availableUsers,
  isLoadingDetail,
  isLoadingRoles,
  isLoadingUsers,
  isSaving,
  onSave,
  onBack,
  loadGroupDetail,
  onAddRole,
  onDeleteRole,
  onAddUser,
  onDeleteUser,
}: GroupFormProps) {
  const isEdit = mode === "edit";

  const [isRoleModalOpen, setIsRoleModalOpen] = React.useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = React.useState(false);

  const [selectedRoleIds, setSelectedRoleIds] = React.useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>([]);

  const [platformFilter, setPlatformFilter] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("");
  const [userFilter, setUserFilter] = React.useState("");

  const [pageRoles, setPageRoles] = React.useState(1);
  const [rowsPerPageRoles, setRowsPerPageRoles] = React.useState(10);
  const [pageUsers, setPageUsers] = React.useState(1);
  const [rowsPerPageUsers, setRowsPerPageUsers] = React.useState(10);

  useEffect(() => {
    if (isEdit && groupId) {
      loadGroupDetail(groupId);
    }
  }, [isEdit, groupId, loadGroupDetail]);

  const filteredRoles = availableRoles.filter((role: any) => {
    const matchesPlatform = platformFilter
      ? role.description === platformFilter
      : true;
    const matchesSearch = roleFilter
      ? role.name?.toLowerCase().includes(roleFilter.toLowerCase())
      : true;
    return matchesPlatform && matchesSearch;
  });

  const paginatedRoles = filteredRoles.slice(
    (pageRoles - 1) * rowsPerPageRoles,
    pageRoles * rowsPerPageRoles
  );

  const totalPagesRoles = Math.ceil(filteredRoles.length / rowsPerPageRoles);

  const filteredUsers = availableUsers.filter((user: any) => {
    const matchesSearch = userFilter
      ? user.name?.toLowerCase().includes(userFilter.toLowerCase())
      : true;
    return matchesSearch;
  });

  const paginatedUsers = filteredUsers.slice(
    (pageUsers - 1) * rowsPerPageUsers,
    pageUsers * rowsPerPageUsers
  );

  const totalPagesUsers = Math.ceil(filteredUsers.length / rowsPerPageUsers);

  const uniquePlatforms = Array.from(
    new Set(availableRoles.map((role: any) => role.description))
  );

  const handleCheckboxChange = (id: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(id) ? prev.filter((roleId) => roleId !== id) : [...prev, id]
    );
  };

  const handleSelectAllChange = () => {
    if (selectedRoleIds.length === filteredRoles.length) {
      setSelectedRoleIds([]);
    } else {
      setSelectedRoleIds(filteredRoles.map((role: any) => role.id));
    }
  };

  const handleCheckboxChangeUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const handleSelectAllChangeUser = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map((user: any) => user.id));
    }
  };

  const handleAddSelectedRoles = async () => {
    await onAddRole(selectedRoleIds);
    setSelectedRoleIds([]);
    setIsRoleModalOpen(false);
    setPlatformFilter("");
    setRoleFilter("");
    setPageRoles(1);
  };

  const handleAddSelectedUsers = async () => {
    await onAddUser(selectedUserIds);
    setSelectedUserIds([]);
    setIsUserModalOpen(false);
    setUserFilter("");
    setPageUsers(1);
  };

  const isAllSelectedRoles =
    selectedRoleIds.length === filteredRoles.length && filteredRoles.length > 0;
  const isAllSelectedUsers =
    selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0;

  return (
    <ContentLoadingWrapper isLoading={isSaving || isLoadingDetail}>
      <div className="flex flex-col w-full">
        <form onSubmit={handleSubmit(onSave)}>
          {/* Header */}
          <div className="bg-white md:px-6 p-4 flex items-center">
            <div>
              <Breadcrumb className="sm:block hidden">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink>Masterdata</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink className="cursor-pointer" onClick={onBack}>
                      Group
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{isEdit ? "Detail" : "Add"}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
                {isEdit ? "Detail Group" : "Add Group"}
              </h2>
            </div>

            <div className="flex ml-auto">
              <div
                onClick={onBack}
                className="font-semibold ml-auto items-center flex gap-1 text-red-700 text-sm cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </div>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-5 rounded-full px-5"
              >
                <Check className="mr-2 w-4 h-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex flex-col w-full p-4 md:p-6 gap-4">
            {/* Group Details */}
            <div className="p-4 sm:p-6 bg-white rounded-lg gap-4">
              <div className="text-primary font-bold mb-5">Group Details</div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Group Name <span className="text-red-500">*</span>
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
                      placeholder="Insert Group Name"
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
                    {errors.name.message?.toString()}
                  </p>
                )}
              </div>
            </div>

            {/* Group Roles Section */}
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
                {isEdit && (
                  <Dialog
                    open={isRoleModalOpen}
                    onClose={() => setIsRoleModalOpen(false)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        onClick={() => setIsRoleModalOpen(true)}
                        className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full ml-auto w-32"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Roles
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="p-0 w-[1000px] max-w-full overflow-hidden">
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
                            onChange={(e) => {
                              setPlatformFilter(e.target.value);
                              setPageRoles(1);
                            }}
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
                              value={roleFilter}
                              onChange={(e) => {
                                setRoleFilter(e.target.value);
                                setPageRoles(1);
                              }}
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
                                  checked={isAllSelectedRoles}
                                  onChange={handleSelectAllChange}
                                  className="w-4 h-4 mx-auto"
                                />
                              </TableHead>
                              <TableHead className="py-2">Roles</TableHead>
                              <TableHead className="py-2 w-52">
                                Platform
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedRoles.length > 0 ? (
                              paginatedRoles.map((role: any) => (
                                <TableRow
                                  key={role.id}
                                  className="cursor-pointer"
                                  onClick={() => handleCheckboxChange(role.id)}
                                >
                                  <TableCell align="center">
                                    <Input
                                      type="checkbox"
                                      checked={selectedRoleIds.includes(
                                        role.id
                                      )}
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
                                <TableCell colSpan={3}>
                                  <div className="flex flex-col gap-4 items-center justify-center py-14">
                                    <Image
                                      alt="no data"
                                      src={noData}
                                      width={200}
                                    />
                                    No roles available
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>

                          <TableFooter>
                            <TableRow>
                              <TableCell colSpan={3}>
                                <div className="flex justify-center items-center gap-2 font-normal">
                                  <label htmlFor="rowsPerPageRoles">
                                    Showing:
                                  </label>
                                  <select
                                    id="rowsPerPageRoles"
                                    value={rowsPerPageRoles}
                                    onChange={(e) => {
                                      setRowsPerPageRoles(
                                        Number(e.target.value)
                                      );
                                      setPageRoles(1);
                                    }}
                                    className="p-2 border rounded"
                                  >
                                    {[10, 20, 30, 50].map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="mr-2">
                                    of {filteredRoles.length} items
                                  </span>
                                  <button
                                    onClick={() =>
                                      setPageRoles((prev) =>
                                        Math.max(prev - 1, 1)
                                      )
                                    }
                                    disabled={pageRoles === 1}
                                    title="Prev"
                                    className="disabled:opacity-50"
                                  >
                                    <ChevronLeft />
                                  </button>
                                  <button
                                    onClick={() =>
                                      setPageRoles((prev) =>
                                        Math.min(prev + 1, totalPagesRoles)
                                      )
                                    }
                                    disabled={pageRoles === totalPagesRoles}
                                    title="Next"
                                    className="disabled:opacity-50"
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
                        <Button
                          type="button"
                          className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
                          onClick={handleAddSelectedRoles}
                          disabled={selectedRoleIds.length === 0}
                        >
                          <Check className="w-4 h-4 mr-2" /> Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                {!isEdit && (
                  <Button
                    type="button"
                    disabled
                    className="bg-gray-300 text-black hover:bg-gray-300 rounded-full ml-auto w-32"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Roles
                  </Button>
                )}
              </div>

              {isEdit && groupRoles.length > 0 && (
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
                      {groupRoles.map((role: any) => (
                        <TableRow key={role.id}>
                          <TableCell className="py-1">
                            {role?.roles?.name || "-"}
                          </TableCell>
                          <TableCell className="py-1">
                            {role?.roles?.description || "-"}
                          </TableCell>
                          <TableCell className="py-1 text-center">
                            <Button
                              type="button"
                              className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                              onClick={() => onDeleteRole(role.id)}
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

            {/* Group Users Section */}
            <div className="p-4 sm:p-6 bg-white rounded-lg gap-4">
              <div className="flex gap-4 items-center">
                <div>
                  <div className="text-primary font-bold mb-2">
                    Group Users ({groupUsers.length})
                  </div>
                  <p className="text-sm text-black/60">
                    <i>
                      All the users in the group will have permissions that are
                      defined in the selected group roles
                    </i>
                  </p>
                </div>
                {isEdit && (
                  <Dialog
                    open={isUserModalOpen}
                    onClose={() => setIsUserModalOpen(false)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        onClick={() => setIsUserModalOpen(true)}
                        className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full ml-auto w-32"
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="p-0 w-[1000px] max-w-full overflow-hidden">
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
                              onChange={(e) => {
                                setUserFilter(e.target.value);
                                setPageUsers(1);
                              }}
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
                                  checked={isAllSelectedUsers}
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
                            {paginatedUsers.length > 0 ? (
                              paginatedUsers.map((user: any) => (
                                <TableRow
                                  key={user.id}
                                  className="cursor-pointer"
                                  onClick={() =>
                                    handleCheckboxChangeUser(user.id)
                                  }
                                >
                                  <TableCell align="center">
                                    <Input
                                      type="checkbox"
                                      checked={selectedUserIds.includes(
                                        user.id
                                      )}
                                      onChange={(event) => {
                                        event.stopPropagation();
                                        handleCheckboxChangeUser(user.id);
                                      }}
                                      className="w-4 h-4"
                                    />
                                  </TableCell>
                                  <TableCell>{user?.name || "-"}</TableCell>
                                  <TableCell>{user?.email || "-"}</TableCell>
                                  <TableCell>
                                    {user?.phone_number || "-"}
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow className="hover:!bg-white">
                                <TableCell colSpan={4}>
                                  <div className="flex flex-col gap-4 items-center justify-center py-14">
                                    <Image
                                      alt="no data"
                                      src={noData}
                                      width={200}
                                    />
                                    No users available
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>

                          <TableFooter>
                            <TableRow>
                              <TableCell colSpan={4}>
                                <div className="flex justify-center items-center gap-2 font-normal">
                                  <label htmlFor="rowsPerPageUsers">
                                    Showing:
                                  </label>
                                  <select
                                    id="rowsPerPageUsers"
                                    value={rowsPerPageUsers}
                                    onChange={(e) => {
                                      setRowsPerPageUsers(
                                        Number(e.target.value)
                                      );
                                      setPageUsers(1);
                                    }}
                                    className="p-2 border rounded"
                                  >
                                    {[10, 20, 30, 50].map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="mr-2">
                                    of {filteredUsers.length} items
                                  </span>
                                  <button
                                    onClick={() =>
                                      setPageUsers((prev) =>
                                        Math.max(prev - 1, 1)
                                      )
                                    }
                                    disabled={pageUsers === 1}
                                    title="Prev"
                                    className="disabled:opacity-50"
                                  >
                                    <ChevronLeft />
                                  </button>
                                  <button
                                    onClick={() =>
                                      setPageUsers((prev) =>
                                        Math.min(prev + 1, totalPagesUsers)
                                      )
                                    }
                                    disabled={pageUsers === totalPagesUsers}
                                    title="Next"
                                    className="disabled:opacity-50"
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
                        <Button
                          type="button"
                          className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
                          onClick={handleAddSelectedUsers}
                          disabled={selectedUserIds.length === 0}
                        >
                          <Check className="w-4 h-4 mr-2" /> Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                {!isEdit && (
                  <Button
                    type="button"
                    disabled
                    className="bg-gray-300 text-black hover:bg-gray-300 rounded-full ml-auto w-32"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add User
                  </Button>
                )}
              </div>

              {isEdit && groupUsers.length > 0 && (
                <div className="w-full bg-white rounded-lg overflow-auto mt-5">
                  <Table className="table-search-params">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="py-2">Name</TableHead>
                        <TableHead className="py-2 w-52">
                          Last Activity
                        </TableHead>
                        <TableHead className="py-2 w-10">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupUsers.map((user: any) => (
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
                              type="button"
                              className="text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent p-0"
                              onClick={() => onDeleteUser(user.id)}
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
    </ContentLoadingWrapper>
  );
}
