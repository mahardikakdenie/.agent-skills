import { StaticImageData } from 'next/image';
import React from 'react';
import { Check, Plus, Search, Trash2, X } from 'react-feather';

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

export const UserGroups = (props: {
  userGroup: any[];
  selectedUserGroups: string[]; // ? Already correct
  handleSelectGroup: (ids: string[]) => void; // ? Change from (id: string) to (ids: string[])
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  group: any;
  groupFilter: string;
  setGroupFilter: (filter: string) => void;
  handleFilterGroup: (filter: string) => void;
  isAllSelected: boolean;
  handleSelectAllChange: () => void;
  handleCheckboxChange: (id: string) => void;
  isGroupSelected: (id: string) => boolean;
  rowsPerPageGroup: number;
  handleRowsPerPageChangeGroup: (pageSize: number) => void;
  totalItemsRoles: number;
  setPageRoles: (value: number | ((prevState: number) => number)) => void;
  page: number;
  totalPages: number;
  noData: StaticImageData;
  handleAddSelectedGroups: () => void;
  handleDeleteSelectedGroup: (id: string) => void;
  id: string;
}) => {
  const {
    groupFilter,
    group,
    userGroup,
    isAllSelected,
    selectedUserGroups,
    handleSelectGroup,
    isModalOpen,
    setIsModalOpen,
    handleFilterGroup,
    handleSelectAllChange,
    handleCheckboxChange,
    isGroupSelected,
    rowsPerPageGroup,
    handleRowsPerPageChangeGroup,
    totalItemsRoles,
    setPageRoles,
    page,
    totalPages,
    noData,
    handleAddSelectedGroups,
    handleDeleteSelectedGroup,
    setGroupFilter,
    id,
  } = props;

  const groupModalColumns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'select',
        header: () => (
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={handleSelectAllChange}
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
          const group = row.original;

          return (
            <Box onClick={(event) => event.stopPropagation()}>
              <Checkbox
                checked={isGroupSelected(group.id)}
                onCheckedChange={() => handleCheckboxChange(group.id)}
                className="justify-start"
              />
            </Box>
          );
        },
      },
      {
        id: 'name',
        accessorFn: (group) => group?.name || '-',
        header: 'Group Name',
        enableSorting: false,
        size: 420,
        minSize: 240,
        meta: {
          cellClassName: 'align-middle',
          cellContentClassName: 'whitespace-normal break-words',
        },
        cell: ({ row }) => {
          const group = row.original;

          return (
            <Box
              className="min-w-0 cursor-pointer break-words text-sm font-medium leading-5 text-slate-900"
              onClick={() => handleCheckboxChange(group.id)}
            >
              {group?.name || '-'}
            </Box>
          );
        },
      },
    ],
    [handleCheckboxChange, handleSelectAllChange, isAllSelected, isGroupSelected],
  );

  return (
    <Box className="p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4 shadow-sm border border-slate-100">
      <Box className="flex gap-4 items-center">
        <Box>
          <Box className="text-primary font-bold mb-2">User&apos;s Group ({userGroup.length})</Box>
          <Box as="p" className="text-sm text-black/60 italic">
            All the users in the group will have permissions that are defined in the selected group
            roles
          </Box>
        </Box>
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <DialogTrigger asChild>
            <Button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="h-10 rounded-full px-5 text-black ml-auto bg-[#F5BA41] hover:bg-[#e6a92d]"
              leftIcon={<Plus className="w-5 h-5" />}
            >
              Assign Group
            </Button>
          </DialogTrigger>
          <DialogContent className="flex max-h-[calc(100vh-48px)] w-[1000px] max-w-full flex-col overflow-hidden p-0">
            <DialogHeader className="shrink-0 bg-[#F8F8F8] py-3 px-4 sm:px-6">
              <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
                Select Group
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
              <Box className="mb-4">
                <Input
                  aria-label="Group Name"
                  size="lg"
                  type="text"
                  placeholder="Search Group Name"
                  value={groupFilter}
                  onValueChange={(value) => {
                    setGroupFilter(value);
                    handleFilterGroup(value);
                  }}
                  rightIcon={<Search className="w-5 h-5 text-gray-500" />}
                  clearable
                  className="bg-white pr-3"
                />
              </Box>

              <DataTable
                className="!gap-3 [&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-2.5"
                data={group}
                columns={groupModalColumns}
                pagination={{
                  pageIndex: page - 1,
                  pageSize: rowsPerPageGroup,
                  pageCount: Math.max(totalPages, 1),
                  rowCount: totalItemsRoles,
                  onPageChange: (pageIndex) => setPageRoles(pageIndex + 1),
                  onPageSizeChange: (pageSize) => handleRowsPerPageChangeGroup(pageSize),
                }}
                pageSizeOptions={[10, 20, 30, 50]}
                getRowClassName={({ row }) =>
                  selectedUserGroups.includes(row.original.id)
                    ? 'bg-slate-50 hover:!bg-slate-50'
                    : undefined
                }
                emptyState={
                  <Box className="sticky left-0 flex min-h-[14rem] w-[100cqw] items-center justify-center py-6">
                    <Box className="flex flex-col items-center justify-center gap-3">
                      <Image alt="no data" src={noData.src} width={180} fit="contain" />
                      <Box as="span">No groups available</Box>
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
                  getRowId: (group, index) => group?.id || `group-row-${index}`,
                }}
              />
            </Box>

            <DialogFooter className="shrink-0 sm:justify-center justify-center pb-4 sm:pb-6">
              <Button
                type="button"
                className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
                onClick={handleAddSelectedGroups}
                disabled={selectedUserGroups.length === 0}
                leftIcon={<Check className="w-4 h-4" />}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Box>

      {userGroup.length > 0 && (
        <Box className="w-full bg-white rounded-lg overflow-auto mt-1">
          <Table className="table-search-params border-collapse">
            <TableHeader className="bg-[#0073A8] hover:bg-[#0073A8] border-none">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="whitespace-nowrap py-3 pl-4 pr-1 w-52 text-white font-bold h-11 border-none">
                  Group
                </TableHead>
                <TableHead className="py-3 px-1 text-white font-bold h-11 border-none">
                  Role
                </TableHead>
                <TableHead className="py-3 pl-1 pr-4 w-20 text-center text-white font-bold h-11 border-none">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userGroup.map((group, index) => (
                <TableRow
                  key={group.id || index}
                  className="transition-all duration-200 border-b border-slate-100 last:border-0 hover:bg-slate-50/80"
                >
                  <TableCell className="py-4 pl-4 pr-1 border-none font-semibold text-slate-800">
                    {group?.groups?.name || '-'}
                  </TableCell>
                  <TableCell className="py-4 px-1 border-none">
                    <Box className="flex flex-wrap gap-2">
                      {group?.groups?.group_roles?.length > 0
                        ? group.groups.group_roles.map((groupRole: any, indexY: number) => (
                            <Box
                              as="span"
                              key={indexY}
                              className="border border-gray-300 bg-gray-100 rounded py-1 px-2"
                            >
                              {groupRole.roles?.name || '-'}
                            </Box>
                          ))
                        : '-'}
                    </Box>
                  </TableCell>
                  <TableCell className="py-4 pl-1 pr-4 text-center border-none">
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      className="h-9 w-9 p-0 rounded-full text-slate-600 hover:bg-red-50 hover:!text-red-600 active:!text-red-700 transition-all border border-transparent hover:border-red-100"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteSelectedGroup(group.id);
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
