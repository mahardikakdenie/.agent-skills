import { StaticImageData } from 'next/image';
import React from 'react';
import { AlertCircle, Check, Plus, Search, Trash2, X } from 'react-feather';

import { Box, Button, Checkbox, DataTable, Image, Input, type ColumnDef } from '@repo/ui';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui';

import { CompactTablePagination } from '@/components/core/compact-table-pagination';

export const UserRoles = (props: {
  groupRole: any[];
  selectedRoles: string[];
  isModalOpenUser: boolean;
  setIsModalOpenUser: (open: boolean) => void;
  handleSelectRole: (ids: string[]) => void;
  userFilter: string;
  handleSearch: (value: string) => void;
  isAllSelectedRole: boolean;
  handleSelectAllChangeRole: () => void;
  dataRole: any[];
  handleCheckboxChangeRole: (id: string) => void;
  isUserSelected: (id: string) => boolean;
  noData: StaticImageData;
  rowsPerPage: number;
  handleRowsPerPageChange: (pageSize: number) => void;
  totalItemsUser: number;
  page: number;
  selectRole: (page: number) => void;
  setPage: (value: number | ((prevState: number) => number)) => void;
  totalPages: number;
  handleAddSelectedRole: () => void;
  handleDeleteSelectedRole: (id: string) => void;
  id: string;
}) => {
  const {
    groupRole,
    selectedRoles,
    isModalOpenUser,
    setIsModalOpenUser,
    handleSelectRole,
    userFilter,
    handleSearch,
    isAllSelectedRole,
    handleSelectAllChangeRole,
    dataRole,
    handleCheckboxChangeRole,
    isUserSelected,
    noData,
    rowsPerPage,
    handleRowsPerPageChange,
    totalItemsUser,
    page,
    selectRole,
    setPage,
    totalPages,
    handleAddSelectedRole,
    handleDeleteSelectedRole,
    id,
  } = props;

  const roleModalColumns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'select',
        header: () => (
          <Checkbox
            checked={isAllSelectedRole}
            onCheckedChange={handleSelectAllChangeRole}
            className="justify-start"
          />
        ),
        enableSorting: false,
        enableResizing: false,
        size: 40,
        minSize: 40,
        meta: {
          headerCellClassName: 'w-10 whitespace-nowrap text-left',
          cellClassName: 'w-10 text-left align-middle',
          cellContentClassName: 'flex items-center justify-start',
        },
        cell: ({ row }) => {
          const role = row.original;

          return (
            <Box onClick={(event) => event.stopPropagation()}>
              <Checkbox
                checked={isUserSelected(role.id)}
                onCheckedChange={() => handleCheckboxChangeRole(role.id)}
                className="justify-start"
              />
            </Box>
          );
        },
      },
      {
        id: 'name',
        accessorFn: (role) => role?.name || '-',
        header: 'Role Name',
        enableSorting: false,
        size: 420,
        minSize: 240,
        meta: {
          cellClassName: 'align-middle',
          cellContentClassName: 'whitespace-normal break-words',
        },
        cell: ({ row }) => {
          const role = row.original;

          return (
            <Box
              className="min-w-0 cursor-pointer break-words text-sm font-medium leading-5 text-slate-900"
              onClick={() => handleCheckboxChangeRole(role.id)}
            >
              {role?.name
                ?.replace(/-/g, ' ')
                .replace(/\b\w/g, (char: string) => char.toUpperCase()) || '-'}
            </Box>
          );
        },
      },
    ],
    [handleCheckboxChangeRole, handleSelectAllChangeRole, isAllSelectedRole, isUserSelected],
  );

  return (
    <Box className="p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4 shadow-sm border border-slate-100">
      <Box className="flex gap-4 items-center">
        <Box>
          <Box className="text-primary font-bold mb-2">Additional Role ({groupRole.length})</Box>
          <Box as="p" className="text-sm text-black/60 italic">
            Assigned users to specific roles. If you are unable to find the one you require, please
            request the superadmin to create a new role
          </Box>
        </Box>
        <Dialog open={isModalOpenUser} onClose={() => setIsModalOpenUser(false)}>
          <DialogTrigger asChild>
            <Button
              type="button"
              onClick={() => setIsModalOpenUser(true)}
              className="h-10 rounded-full px-5 text-black ml-auto bg-[#F5BA41] hover:bg-[#e6a92d]"
              leftIcon={<Plus className="w-5 h-5" />}
            >
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="flex max-h-[calc(100vh-48px)] w-[1000px] max-w-full flex-col overflow-hidden p-0">
            <DialogHeader className="shrink-0 bg-[#F8F8F8] py-3 px-4 sm:px-6">
              <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
                Select Role
                <DialogClose className="ml-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    className="bg-transparent hover:bg-transparent text-black p-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </DialogClose>
              </DialogTitle>
            </DialogHeader>

            <Box className="min-h-0 flex-1 overflow-y-auto p-4">
              <Box className="grid grid-cols-1 gap-4 mb-4">
                <Input
                  aria-label="Role Name"
                  size="lg"
                  type="text"
                  placeholder="Search Role Name"
                  value={userFilter}
                  onValueChange={(value) => handleSearch(value)}
                  rightIcon={<Search className="w-5 h-5 text-gray-500" />}
                  clearable
                  className="bg-white pr-3"
                />
                <Box className="flex gap-4 italic text-xs items-center font-light bg-white shadow rounded py-2 px-4">
                  <AlertCircle className="text-blue-600 shrink-0" width={35} height={35} />
                  <Box as="span">
                    Assigned users to specific roles. If you are unable to find the one you require,
                    please request the superadmin to create a new role
                  </Box>
                </Box>
              </Box>

              <DataTable
                className="!gap-3 [&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-2.5"
                data={dataRole}
                columns={roleModalColumns}
                pagination={{
                  pageIndex: page - 1,
                  pageSize: rowsPerPage,
                  pageCount: Math.max(totalPages, 1),
                  rowCount: totalItemsUser,
                  onPageChange: (pageIndex) => setPage(pageIndex + 1),
                  onPageSizeChange: (pageSize) => handleRowsPerPageChange(pageSize),
                }}
                pageSizeOptions={[10, 20, 30, 50]}
                getRowClassName={({ row }) =>
                  selectedRoles.includes(row.original.id)
                    ? 'bg-slate-50 hover:!bg-slate-50'
                    : undefined
                }
                emptyState={
                  <Box className="sticky left-0 flex min-h-[14rem] w-[100cqw] items-center justify-center py-6">
                    <Box className="flex flex-col items-center justify-center gap-3">
                      <Image alt="no data" src={noData.src} width={180} fit="contain" />
                      <Box as="span">No roles available</Box>
                    </Box>
                  </Box>
                }
                renderPagination={(table) => (
                  <Box className="-mt-1">
                    <CompactTablePagination table={table} pageSizeOptions={[10, 20, 30, 50]} />
                  </Box>
                )}
                tableOptions={{
                  manualPagination: true,
                  enableColumnResizing: false,
                  defaultColumn: {
                    minSize: 56,
                    size: 160,
                  },
                  getRowId: (role, index) => role?.id || `role-row-${index}`,
                }}
              />
            </Box>

            <DialogFooter className="shrink-0 sm:justify-center justify-center pb-4 sm:pb-6">
              <Button
                type="button"
                className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
                onClick={handleAddSelectedRole}
                disabled={selectedRoles.length === 0}
                leftIcon={<Check className="w-4 h-4" />}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Box>
      {groupRole.length > 0 && (
        <Box className="w-full bg-white rounded-lg overflow-auto mt-1">
          <Table className="table-search-params border-collapse">
            <TableHeader className="bg-[#0073A8] hover:bg-[#0073A8] border-none">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="py-3 pl-4 pr-1 text-white font-bold h-11 border-none">
                  Name
                </TableHead>
                <TableHead className="py-3 pl-1 pr-4 w-20 text-center text-white font-bold h-11 border-none">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupRole.map((role) => (
                <TableRow
                  key={role.id}
                  className="transition-all duration-200 border-b border-slate-100 last:border-0 hover:bg-slate-50/80"
                >
                  <TableCell className="py-4 pl-4 pr-1 border-none font-semibold text-slate-800">
                    {role?.roles?.name
                      .replace(/-/g, ' ')
                      .replace(/\b\w/g, (char: any) => char.toUpperCase()) || '-'}
                  </TableCell>
                  <TableCell className="py-4 pl-1 pr-4 text-center border-none">
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      className="h-9 w-9 p-0 rounded-full text-slate-600 hover:bg-red-50 hover:!text-red-600 active:!text-red-700 transition-all border border-transparent hover:border-red-100"
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
        </Box>
      )}
    </Box>
  );
};
