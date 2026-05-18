"use client";

import Image from "next/image";
import { useMemo, type ChangeEvent } from "react";
import { Plus, Search } from "react-feather";
import noData from "@public/images/no-data.webp";

import {
  Box,
  Button,
  DataTable,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@repo/ui";
import { Controller, useForm } from "react-hook-form";
import iconWarning from "@public/images/icon-warning.png";

import { CompactTablePagination } from "@/components/ui/compact-table-pagination";
import { useUsers } from "@/hooks/useUsers.hooks";
import { createUsersTableColumns } from "@/components/table-config/users-table-config";

let tableMeasureContext: CanvasRenderingContext2D | null = null;
function measureTextWidth(label: string, font: string, fallbackCharWidth: number) {
  if (typeof document === 'undefined') {
    return label.length * fallbackCharWidth;
  }

  if (!tableMeasureContext) {
    tableMeasureContext = document.createElement('canvas').getContext('2d');
  }

  if (!tableMeasureContext) {
    return label.length * fallbackCharWidth;
  }

  tableMeasureContext.font = font;

  return tableMeasureContext.measureText(label).width;
}

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

  const nameColumnSize = useMemo(
    () =>
      Math.max(
        164,
        Math.ceil(
          Math.max(
            measureTextWidth('Name', '500 14px Arial', 6.8),
            users.reduce((widest, user) => {
              const label = user?.name || '-';
              return Math.max(widest, measureTextWidth(label, '400 13px Arial', 6.6));
            }, 0),
          ) + 28,
        ),
      ),
    [users],
  );

  const emailColumnSize = useMemo(
    () =>
      Math.max(
        220,
        Math.ceil(
          Math.max(
            measureTextWidth('Email', '500 14px Arial', 6.8),
            users.reduce((widest, user) => {
              const label = user?.email || '-';
              return Math.max(widest, measureTextWidth(label, '400 13px Arial', 6.6));
            }, 0),
          ) + 28,
        ),
      ),
    [users],
  );

  const phoneNumberColumnSize = useMemo(
    () =>
      Math.max(
        160,
        Math.ceil(
          Math.max(
            measureTextWidth('Phone Number', '500 14px Arial', 6.8),
            users.reduce((widest, user) => {
              const label = user?.phone_number || '-';
              return Math.max(widest, measureTextWidth(label, '400 13px Arial', 6.6));
            }, 0),
          ) + 28,
        ),
      ),
    [users],
  );

  const roleColumnSize = useMemo(
    () =>
      Math.max(
        130,
        Math.ceil(
          Math.max(
            measureTextWidth('Role', '500 14px Arial', 6.8),
            users.reduce((widest, user) => {
              const label = user?.role || '-';
              return Math.max(widest, measureTextWidth(label, '600 12px Arial', 6.2));
            }, 0),
          ) + 28,
        ),
      ),
    [users],
  );

  const statusColumnSize = useMemo(
    () =>
      Math.max(
        72,
        Math.ceil(
          measureTextWidth('Status', '500 14px Arial', 6.8) + 32
        ),
      ),
    [],
  );

  const actionColumnSize = useMemo(
    () =>
      Math.max(
        120,
        Math.ceil(
          Math.max(
            measureTextWidth('Action', '500 14px Arial', 6.8),
            measureTextWidth('Edit', '500 13px Arial', 6.6) + 72,
          ) + 24,
        ),
      ),
    [],
  );

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
    nameColumnSize,
    emailColumnSize,
    phoneNumberColumnSize,
    roleColumnSize,
    statusColumnSize,
    actionColumnSize,
  });

  return (
    <Box className="flex w-full flex-col gap-3 p-4 md:p-6">
      <Box className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between 2xl:items-center">
        <Box as="h1" className="text-black font-bold sm:text-2xl text-xl sm:mt-2">
          User
        </Box>

        <Box className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 xl:w-auto 2xl:flex-nowrap">
          {canSearchAllAccount && (
            <Box className="w-full sm:min-w-52 sm:flex-1 xl:w-52 xl:flex-none">
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
                    <SelectTrigger className="w-full h-10 shadow-sm select-status bg-white hover:cursor-pointer py-2">
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
            </Box>
          )}
          <Box className="w-full sm:min-w-52 sm:flex-1 xl:w-64 xl:flex-none">
            <Input
              type="text"
              placeholder="Search by Name or Email"
              aria-label="Search users by name or email"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 shadow-sm"
              rightIcon={
                <Search
                  aria-hidden="true"
                  className="h-4 w-4 text-[#016da1]"
                />
              }
            />
          </Box>

          <Button
            onClick={addNewUser}
            disabled={!canCreate}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] sm:ml-auto xl:ml-0"
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Add New
          </Button>
        </Box>
      </Box>

      <DataTable
        className="!gap-3 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        loading={isLoading}
        data={users}
        columns={userTableColumns}
        defaultState={{
          columnPinning: {
            left: ['index', 'name'],
            right: ['action'],
          },
        }}
        pagination={{
          pageIndex: page - 1,
          pageSize: rowsPerPage,
          pageCount: totalPages,
          rowCount: totalItems,
          onPageChange: (pageIndex) => {
            if (isLoading) return;
            setPage(pageIndex + 1);
          },
          onPageSizeChange: (pageSize) => {
            if (isLoading) return;
            setRowsPerPage(pageSize);
          },
        }}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        emptyState={
          <Box className="sticky left-0 flex min-h-[10rem] w-[100cqw] items-center justify-center gap-2 py-4 md:min-h-[11rem] md:py-5">
            <Box className="flex flex-col items-center justify-center gap-2">
              <Image alt="No user data" src={noData} width={128} />
              <Box as="span">No user data available</Box>
            </Box>
          </Box>
        }
        renderPagination={(table) => (
          <Box className="-mt-1">
            <CompactTablePagination
              table={table}
              pageSizeOptions={[10, 20, 30, 50, 100]}
              disabled={isLoading}
            />
          </Box>
        )}
        tableOptions={{
          manualPagination: true,
          enableColumnPinning: true,
          enableColumnResizing: true,
          defaultColumn: {
            minSize: 48,
            size: 96,
          },
          getRowId: (row, index) => row?.id || `user-row-${index}`,
        }}
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
              className="btn min-w-[108px] rounded-full bg-[#F5BA41] text-black hover:bg-[#e6a92d]"
              onClick={handleUpdateStatus}
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
