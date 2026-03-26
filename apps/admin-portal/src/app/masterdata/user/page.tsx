"use client";

import Image from "next/image";
import { Plus, Search } from "react-feather";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@repo/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@repo/ui";
import { Controller, useForm } from "react-hook-form";
import iconWarning from "@public/images/icon-warning.png";
import { useUsers } from "@/hooks/useUsers.hooks";
import { createUsersTableColumns } from "@/components/tableConfig/usersTableConfig";

export default function Users() {
  const {
    users,
    totalPages,
    totalItems,
    page,
    rowsPerPage,
    roleFilter,
    roleOptions,
    selectedUserStatus,
    isModalChangeStatusOpen,
    hasAccess,
    canEdit,
    canCreate,
    canDelete,
    canToggleStatus,
    canSearchAllAccount,
    isLoading,
    setPage,
    setRowsPerPage,
    setRoleFilter,
    setSearchQuery,
    setIsModalChangeStatusOpen,
    handleEdit,
    handleDelete,
    handleStatusChange,
    handleUpdateStatus,
    addNewUser,
  } = useUsers();

  const { control } = useForm({
    shouldUnregister: false,
    defaultValues: { role: roleFilter },
  });

  if (hasAccess === false) {
    return null;
  }

  const userTableColumns = createUsersTableColumns({
    page,
    rowsPerPage,
    handleEdit,
    handleDelete,
    handleStatusChange,
    canEdit,
    canDelete,
    canToggleStatus,
  });

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex gap-4 pb-4 items-center">
        <h1 className="text-black font-bold sm:text-2xl text-xl sm:mt-2">
          User
        </h1>

        <div className="relative w-1/2 ml-auto shadow-sm">
          <div className="flex justify-end items-center">
            {canSearchAllAccount && (
              <div className="mr-3 w-1/2">
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setRoleFilter(value);
                      }}
                    >
                      <SelectTrigger className="w-full h-12 shadow border-0 select-status bg-white hover:cursor-pointer py-2">
                        <SelectValue placeholder="User" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {roleOptions.map((r: any) => (
                            <SelectItem key={r.id} value={r.name}>
                              {r.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}
            <div className="w-1/2">
              <Input
                type="text"
                placeholder="Search by Name or Email"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border p-3 rounded-md pr-10 w-full h-12"
              />
              <Search className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#016da1]" />
            </div>
          </div>
        </div>

        <Button
          onClick={addNewUser}
          disabled={!canCreate}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
        >
          <Plus className="w-5 h-5 mr-1" /> Add New
        </Button>
      </div>

      <DataTable
        loading={isLoading}
        data={users}
        columns={userTableColumns}
        pagination={{
          page,
          totalPages,
          totalItems,
          rowsPerPage,
          onPageChange: setPage,
          onRowsPerPageChange: (e) => setRowsPerPage(+e.target.value || 0),
        }}
        className="user-table"
        noDataText="No user data available"
      />

      <Dialog
        open={isModalChangeStatusOpen}
        onClose={() => setIsModalChangeStatusOpen(false)}
      >
        <DialogContent className="w-[90vw] md:w-[600px]">
          <DialogHeader className="items-center gap-4">
            <Image alt="icon warning" src={iconWarning} width={88} />
            <DialogTitle className="sm:text-center">
              {`Are you sure to ${
                selectedUserStatus?.status === "Active"
                  ? "deactivate"
                  : "activate"
              } the user account?`}
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              {`Once ${
                selectedUserStatus?.status === "Active"
                  ? "deactivated"
                  : "activated"
              }, the user will no longer have access to the portal.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-4">
            <Button
              variant="outline"
              className="min-w-[108px] rounded-full border border-red-500 text-red-500 hover:bg-red-100 hover:text-red-500"
              onClick={() => setIsModalChangeStatusOpen(false)}
            >
              No
            </Button>
            <Button
              className="btn min-w-[108px] rounded-full bg-[#F5BA41] text-black"
              onClick={handleUpdateStatus}
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

