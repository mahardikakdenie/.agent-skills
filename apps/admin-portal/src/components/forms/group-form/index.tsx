'use client';

import noData from '@public/images/no-data.webp';
import { format } from 'date-fns';
import React, { useEffect } from 'react';
import { Check, Plus, Save, Search, Trash2, X } from 'react-feather';
import { Controller } from 'react-hook-form';

import {
  Box,
  Button,
  Checkbox,
  Combobox,
  DataTable,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Image,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type ColumnDef,
} from '@repo/ui';

import { PageHeader } from '@/components/core/page-header';
import { CompactTablePagination } from '@/components/core/compact-table-pagination';
import { ContentLoadingWrapper } from '@/components/core/loading';
import AppURL from '@/constants/app-url.const';

interface GroupFormProps {
  mode: 'create' | 'edit';
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

const ALL_PLATFORMS_VALUE = '__all_platforms__';

export default function GroupForm({
  mode,
  groupId,
  handleSubmit,
  control,
  errors,
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
  const isEdit = mode === 'edit';

  const [isRoleModalOpen, setIsRoleModalOpen] = React.useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = React.useState(false);

  const [selectedRoleIds, setSelectedRoleIds] = React.useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = React.useState<string[]>([]);

  const [platformFilter, setPlatformFilter] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState('');
  const [userFilter, setUserFilter] = React.useState('');

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
    const matchesPlatform = platformFilter ? role.description === platformFilter : true;
    const matchesSearch = roleFilter
      ? role.name?.toLowerCase().includes(roleFilter.toLowerCase())
      : true;
    return matchesPlatform && matchesSearch;
  });

  const paginatedRoles = filteredRoles.slice(
    (pageRoles - 1) * rowsPerPageRoles,
    pageRoles * rowsPerPageRoles,
  );

  const totalPagesRoles = Math.ceil(filteredRoles.length / rowsPerPageRoles);

  const filteredUsers = availableUsers.filter((user: any) => {
    const matchesSearch = userFilter
      ? [user.name, user.email, user.phone_number].some((value) =>
          value?.toLowerCase().includes(userFilter.toLowerCase()),
        )
      : true;
    return matchesSearch;
  });

  const paginatedUsers = filteredUsers.slice(
    (pageUsers - 1) * rowsPerPageUsers,
    pageUsers * rowsPerPageUsers,
  );

  const totalPagesUsers = Math.ceil(filteredUsers.length / rowsPerPageUsers);

  const uniquePlatforms = React.useMemo(
    () => Array.from(new Set(availableRoles.map((role: any) => role.description).filter(Boolean))),
    [availableRoles],
  );

  const platformOptions = React.useMemo(
    () => [
      { label: 'All Platforms', value: ALL_PLATFORMS_VALUE },
      ...uniquePlatforms.map((platform) => ({
        label: String(platform),
        value: String(platform),
      })),
    ],
    [uniquePlatforms],
  );

  const filteredRoleIds = React.useMemo(
    () => filteredRoles.map((role: any) => role.id),
    [filteredRoles],
  );
  const filteredUserIds = React.useMemo(
    () => filteredUsers.map((user: any) => user.id),
    [filteredUsers],
  );

  const handleCheckboxChange = React.useCallback((id: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(id) ? prev.filter((roleId) => roleId !== id) : [...prev, id],
    );
  }, []);

  const handleSelectAllChange = React.useCallback(() => {
    if (filteredRoleIds.every((roleId) => selectedRoleIds.includes(roleId))) {
      setSelectedRoleIds((prev) => prev.filter((roleId) => !filteredRoleIds.includes(roleId)));
    } else {
      setSelectedRoleIds((prev) => Array.from(new Set([...prev, ...filteredRoleIds])));
    }
  }, [filteredRoleIds, selectedRoleIds]);

  const handleCheckboxChangeUser = React.useCallback((id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id],
    );
  }, []);

  const handleSelectAllChangeUser = React.useCallback(() => {
    if (filteredUserIds.every((userId) => selectedUserIds.includes(userId))) {
      setSelectedUserIds((prev) => prev.filter((userId) => !filteredUserIds.includes(userId)));
    } else {
      setSelectedUserIds((prev) => Array.from(new Set([...prev, ...filteredUserIds])));
    }
  }, [filteredUserIds, selectedUserIds]);

  const handleAddSelectedRoles = async () => {
    await onAddRole(selectedRoleIds);
    setSelectedRoleIds([]);
    setIsRoleModalOpen(false);
    setPlatformFilter('');
    setRoleFilter('');
    setPageRoles(1);
  };

  const handleAddSelectedUsers = async () => {
    await onAddUser(selectedUserIds);
    setSelectedUserIds([]);
    setIsUserModalOpen(false);
    setUserFilter('');
    setPageUsers(1);
  };

  const isAllSelectedRoles =
    filteredRoleIds.length > 0 &&
    filteredRoleIds.every((roleId) => selectedRoleIds.includes(roleId));
  const isAllSelectedUsers =
    filteredUserIds.length > 0 &&
    filteredUserIds.every((userId) => selectedUserIds.includes(userId));

  const roleModalColumns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'select',
        header: () => (
          <Checkbox
            checked={isAllSelectedRoles}
            onCheckedChange={handleSelectAllChange}
            className="justify-center"
          />
        ),
        enableSorting: false,
        enableResizing: false,
        size: 56,
        minSize: 56,
        meta: {
          headerCellClassName: 'w-14 whitespace-nowrap text-center',
          cellClassName: 'w-14 text-center align-middle',
          cellContentClassName: 'flex items-center justify-center',
        },
        cell: ({ row }) => {
          const role = row.original;

          return (
            <Box onClick={(event) => event.stopPropagation()}>
              <Checkbox
                checked={selectedRoleIds.includes(role.id)}
                onCheckedChange={() => handleCheckboxChange(role.id)}
                className="justify-center"
              />
            </Box>
          );
        },
      },
      {
        id: 'name',
        accessorFn: (role) => role?.name || '-',
        header: 'Roles',
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
              onClick={() => handleCheckboxChange(role.id)}
            >
              {role?.name || '-'}
            </Box>
          );
        },
      },
      {
        id: 'platform',
        accessorFn: (role) => role?.description || '-',
        header: 'Platform',
        enableSorting: false,
        size: 280,
        minSize: 180,
        meta: {
          cellClassName: 'align-middle',
          cellContentClassName: 'whitespace-normal break-words',
        },
        cell: ({ row }) => {
          const role = row.original;

          return (
            <Box
              className="min-w-0 cursor-pointer break-words text-sm leading-5 text-slate-600"
              onClick={() => handleCheckboxChange(role.id)}
            >
              {role?.description || '-'}
            </Box>
          );
        },
      },
    ],
    [handleCheckboxChange, handleSelectAllChange, isAllSelectedRoles, selectedRoleIds],
  );

  const userModalColumns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: 'select',
        header: () => (
          <Checkbox
            checked={isAllSelectedUsers}
            onCheckedChange={handleSelectAllChangeUser}
            className="justify-center"
          />
        ),
        enableSorting: false,
        enableResizing: false,
        size: 56,
        minSize: 56,
        meta: {
          headerCellClassName: 'w-14 whitespace-nowrap text-center',
          cellClassName: 'w-14 text-center align-middle',
          cellContentClassName: 'flex items-center justify-center',
        },
        cell: ({ row }) => {
          const user = row.original;

          return (
            <Box onClick={(event) => event.stopPropagation()}>
              <Checkbox
                checked={selectedUserIds.includes(user.id)}
                onCheckedChange={() => handleCheckboxChangeUser(user.id)}
                className="justify-center"
              />
            </Box>
          );
        },
      },
      {
        id: 'name',
        accessorFn: (user) => user?.name || '-',
        header: 'Name',
        enableSorting: false,
        size: 260,
        minSize: 180,
        meta: {
          cellClassName: 'align-middle',
          cellContentClassName: 'whitespace-normal break-words',
        },
        cell: ({ row }) => {
          const user = row.original;

          return (
            <Box
              className="min-w-0 cursor-pointer break-words text-sm font-medium leading-5 text-slate-900"
              onClick={() => handleCheckboxChangeUser(user.id)}
            >
              {user?.name || '-'}
            </Box>
          );
        },
      },
      {
        id: 'email',
        accessorFn: (user) => user?.email || '-',
        header: 'Email',
        enableSorting: false,
        size: 300,
        minSize: 220,
        meta: {
          cellClassName: 'align-middle',
          cellContentClassName: 'whitespace-normal break-words',
        },
        cell: ({ row }) => {
          const user = row.original;

          return (
            <Box
              className="min-w-0 cursor-pointer break-words text-sm leading-5 text-slate-600"
              onClick={() => handleCheckboxChangeUser(user.id)}
            >
              {user?.email || '-'}
            </Box>
          );
        },
      },
      {
        id: 'phone_number',
        accessorFn: (user) => user?.phone_number || '-',
        header: 'Phone Number',
        enableSorting: false,
        size: 220,
        minSize: 160,
        meta: {
          cellClassName: 'align-middle',
          cellContentClassName: 'whitespace-normal break-words',
        },
        cell: ({ row }) => {
          const user = row.original;

          return (
            <Box
              className="min-w-0 cursor-pointer break-words text-sm leading-5 text-slate-600"
              onClick={() => handleCheckboxChangeUser(user.id)}
            >
              {user?.phone_number || '-'}
            </Box>
          );
        },
      },
    ],
    [handleCheckboxChangeUser, handleSelectAllChangeUser, isAllSelectedUsers, selectedUserIds],
  );

  const breadcrumbs = [
    { label: 'Groups', href: AppURL.masterdataGroup },
    { label: isEdit ? 'Detail' : 'Add', isCurrentPage: true },
  ];

  return (
    <ContentLoadingWrapper isLoading={isSaving || isLoadingDetail}>
      <Box className="flex flex-col w-full">
        <Box as="form" onSubmit={handleSubmit(onSave)}>
          <PageHeader
            title={isEdit ? 'Edit Group' : 'Add Group'}
            breadcrumbs={breadcrumbs}
            showBackButton={true}
            onBackClick={onBack}
          >
            <Button
              type="submit"
              disabled={isSaving}
              className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
              leftIcon={
                isSaving ? undefined : isEdit ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Save className="w-5 h-5" />
                )
              }
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </PageHeader>

          <Box className="flex flex-col w-full p-4 md:p-6 gap-6">
            <Box className="p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4 shadow-sm border border-slate-100">
              <Box>
                <Box className="text-primary font-bold mb-1">Group Details</Box>
                <Box as="p" className="mb-5 text-sm text-slate-500">
                  Group defines a collection of users and roles with shared access
                </Box>
              </Box>

              <Box>
                <Box
                  as="label"
                  htmlFor="name"
                  className="inline-block text-sm font-medium text-slate-700 mb-2 cursor-pointer"
                >
                  Group Name{' '}
                  <Box as="span" className="text-red-500">
                    *
                  </Box>
                </Box>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'Group Name is required',
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      size="lg"
                      placeholder="Insert group name"
                      error={!!errors.name}
                      className="bg-transparent"
                      onChange={(e) => field.onChange(e.target.value.replace(/\s+/g, '-'))}
                    />
                  )}
                />
                {errors.name && (
                  <Box as="p" className="text-red-500 text-xs mt-1">
                    {errors.name.message?.toString()}
                  </Box>
                )}
              </Box>
            </Box>

            <Box className="p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4 shadow-sm border border-slate-100">
              <Box className="flex gap-4 items-center">
                <Box>
                  <Box className="text-primary font-bold mb-2">
                    Group Role ({groupRoles.length})
                  </Box>
                  <Box as="p" className="text-sm text-black/60 italic">
                    The group will have permissions that are defined in the selected roles
                  </Box>
                </Box>
                <Dialog open={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      disabled={!isEdit || isLoadingRoles}
                      onClick={() => setIsRoleModalOpen(true)}
                      className={`h-10 rounded-full px-5 text-black ml-auto ${
                        isEdit ? 'bg-[#F5BA41] hover:bg-[#e6a92d]' : 'bg-gray-300 hover:bg-gray-300'
                      }`}
                      leftIcon={<Plus className="w-5 h-5" />}
                    >
                      Add Roles
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="flex max-h-[calc(100vh-48px)] w-[1000px] max-w-full flex-col overflow-hidden p-0">
                    <DialogHeader className="shrink-0 bg-[#F8F8F8] py-3 px-4 sm:px-6">
                      <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
                        Select Roles
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
                      <Box className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2">
                        <Combobox
                          aria-label="Platform"
                          size="lg"
                          value={platformFilter || ALL_PLATFORMS_VALUE}
                          options={platformOptions}
                          placeholder="All Platforms"
                          searchPlaceholder="Search Platform"
                          onValueChange={(value) => {
                            setPlatformFilter(value === ALL_PLATFORMS_VALUE ? '' : value || '');
                            setPageRoles(1);
                          }}
                          triggerClassName="bg-white"
                        />
                        <Input
                          aria-label="Roles Name"
                          size="lg"
                          type="text"
                          placeholder="Search Roles Name"
                          value={roleFilter}
                          onValueChange={(value) => {
                            setRoleFilter(value);
                            setPageRoles(1);
                          }}
                          rightIcon={<Search className="w-5 h-5 text-gray-500" />}
                          clearable
                          className="bg-white pr-3"
                        />
                      </Box>

                      <DataTable
                        className="!gap-3 [&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-2.5"
                        data={paginatedRoles}
                        columns={roleModalColumns}
                        pagination={{
                          pageIndex: pageRoles - 1,
                          pageSize: rowsPerPageRoles,
                          pageCount: Math.max(totalPagesRoles, 1),
                          rowCount: filteredRoles.length,
                          onPageChange: (pageIndex) => {
                            setPageRoles(pageIndex + 1);
                          },
                          onPageSizeChange: (pageSize) => {
                            setRowsPerPageRoles(pageSize);
                            setPageRoles(1);
                          },
                        }}
                        pageSizeOptions={[10, 20, 30, 50]}
                        getRowClassName={({ row }) =>
                          selectedRoleIds.includes(row.original.id)
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
                            <CompactTablePagination
                              table={table}
                              pageSizeOptions={[10, 20, 30, 50]}
                            />
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
                        onClick={handleAddSelectedRoles}
                        disabled={selectedRoleIds.length === 0}
                        leftIcon={<Check className="w-4 h-4" />}
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </Box>

              {isEdit && groupRoles.length > 0 && (
                <Box className="w-full bg-white rounded-lg overflow-auto mt-1">
                  <Table className="table-search-params border-collapse">
                    <TableHeader className="bg-[#0073A8] hover:bg-[#0073A8] border-none">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="whitespace-nowrap py-3 pl-4 pr-1 text-white font-bold h-11 border-none">
                          Platform
                        </TableHead>
                        <TableHead className="py-3 px-1 text-white font-bold h-11 border-none">
                          Role Name
                        </TableHead>
                        <TableHead className="py-3 pl-1 pr-4 w-20 text-center text-white font-bold h-11 border-none">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupRoles.map((role: any) => (
                        <TableRow
                          key={role.id}
                          className="transition-all duration-200 border-b border-slate-100 last:border-0 hover:bg-slate-50/80"
                        >
                          <TableCell className="py-4 pl-4 pr-1 border-none font-semibold text-slate-800">
                            {role?.roles?.name || '-'}
                          </TableCell>
                          <TableCell className="py-4 px-1 border-none">
                            {role?.roles?.description || '-'}
                          </TableCell>
                          <TableCell className="py-4 pl-1 pr-4 text-center border-none">
                            <Button
                              type="button"
                              variant="ghost"
                              size="xs"
                              className="h-9 w-9 p-0 rounded-full text-slate-600 hover:bg-red-50 hover:!text-red-600 active:!text-red-700 transition-all border border-transparent hover:border-red-100"
                              onClick={() => onDeleteRole(role.id)}
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

            <Box className="p-4 sm:p-6 bg-white rounded-lg flex flex-col gap-4 shadow-sm border border-slate-100">
              <Box className="flex gap-4 items-center">
                <Box>
                  <Box className="text-primary font-bold mb-2">
                    Group Users ({groupUsers.length})
                  </Box>
                  <Box as="p" className="text-sm text-black/60 italic">
                    All the users in the group will have permissions that are defined in the
                    selected group roles
                  </Box>
                </Box>
                <Dialog open={isUserModalOpen} onClose={() => setIsUserModalOpen(false)}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      disabled={!isEdit || isLoadingUsers}
                      onClick={() => setIsUserModalOpen(true)}
                      className={`h-10 rounded-full px-5 text-black ml-auto ${
                        isEdit ? 'bg-[#F5BA41] hover:bg-[#e6a92d]' : 'bg-gray-300 hover:bg-gray-300'
                      }`}
                      leftIcon={<Plus className="w-5 h-5" />}
                    >
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="flex max-h-[calc(100vh-48px)] w-[1000px] max-w-full flex-col overflow-hidden p-0">
                    <DialogHeader className="shrink-0 bg-[#F8F8F8] py-3 px-4 sm:px-6">
                      <DialogTitle className="text-[#016DA1] text-sm sm:text-base flex items-center">
                        Select User
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
                          aria-label="Users Name"
                          size="lg"
                          type="text"
                          placeholder="Search Users Name"
                          value={userFilter}
                          onValueChange={(value) => {
                            setUserFilter(value);
                            setPageUsers(1);
                          }}
                          rightIcon={<Search className="w-5 h-5 text-gray-500" />}
                          clearable
                          className="bg-white pr-3"
                        />
                      </Box>

                      <DataTable
                        className="!gap-3 [&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-2.5"
                        data={paginatedUsers}
                        columns={userModalColumns}
                        pagination={{
                          pageIndex: pageUsers - 1,
                          pageSize: rowsPerPageUsers,
                          pageCount: Math.max(totalPagesUsers, 1),
                          rowCount: filteredUsers.length,
                          onPageChange: (pageIndex) => {
                            setPageUsers(pageIndex + 1);
                          },
                          onPageSizeChange: (pageSize) => {
                            setRowsPerPageUsers(pageSize);
                            setPageUsers(1);
                          },
                        }}
                        pageSizeOptions={[10, 20, 30, 50]}
                        getRowClassName={({ row }) =>
                          selectedUserIds.includes(row.original.id)
                            ? 'bg-slate-50 hover:!bg-slate-50'
                            : undefined
                        }
                        emptyState={
                          <Box className="sticky left-0 flex min-h-[14rem] w-[100cqw] items-center justify-center py-6">
                            <Box className="flex flex-col items-center justify-center gap-3">
                              <Image alt="no data" src={noData.src} width={180} fit="contain" />
                              <Box as="span">No users available</Box>
                            </Box>
                          </Box>
                        }
                        renderPagination={(table) => (
                          <Box className="-mt-1">
                            <CompactTablePagination
                              table={table}
                              pageSizeOptions={[10, 20, 30, 50]}
                            />
                          </Box>
                        )}
                        tableOptions={{
                          manualPagination: true,
                          enableColumnResizing: false,
                          defaultColumn: {
                            minSize: 56,
                            size: 160,
                          },
                          getRowId: (user, index) => user?.id || `user-row-${index}`,
                        }}
                      />
                    </Box>

                    <DialogFooter className="shrink-0 sm:justify-center justify-center pb-4 sm:pb-6">
                      <Button
                        type="button"
                        className="bg-[#f1ac2d] hover:bg-[#dba237] rounded-full text-black"
                        onClick={handleAddSelectedUsers}
                        disabled={selectedUserIds.length === 0}
                        leftIcon={<Check className="w-4 h-4" />}
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </Box>

              {isEdit && groupUsers.length > 0 && (
                <Box className="w-full bg-white rounded-lg overflow-auto mt-1">
                  <Table className="table-search-params border-collapse">
                    <TableHeader className="bg-[#0073A8] hover:bg-[#0073A8] border-none">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="py-3 pl-4 pr-1 text-white font-bold h-11 border-none">
                          Name
                        </TableHead>
                        <TableHead className="py-3 px-1 w-52 text-white font-bold h-11 border-none">
                          Last Activity
                        </TableHead>
                        <TableHead className="py-3 pl-1 pr-4 w-20 text-center text-white font-bold h-11 border-none">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupUsers.map((user: any) => (
                        <TableRow
                          key={user.id}
                          className="transition-all duration-200 border-b border-slate-100 last:border-0 hover:bg-slate-50/80"
                        >
                          <TableCell className="py-4 pl-4 pr-1 border-none font-semibold text-slate-800">
                            {user?.accounts?.name || '-'}
                          </TableCell>
                          <TableCell className="py-4 px-1 border-none">
                            {user?.accounts?.updated_at
                              ? format(new Date(user.accounts.updated_at), 'dd-MM-yyyy')
                              : format(new Date(), 'dd-MM-yyyy')}
                          </TableCell>
                          <TableCell className="py-4 pl-1 pr-4 text-center border-none">
                            <Button
                              type="button"
                              variant="ghost"
                              size="xs"
                              className="h-9 w-9 p-0 rounded-full text-slate-600 hover:bg-red-50 hover:!text-red-600 active:!text-red-700 transition-all border border-transparent hover:border-red-100"
                              onClick={() => onDeleteUser(user.id)}
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
          </Box>
        </Box>
      </Box>
    </ContentLoadingWrapper>
  );
}
