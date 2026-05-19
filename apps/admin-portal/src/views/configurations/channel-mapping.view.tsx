'use client';

import noData from '@public/images/no-data.webp';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import { Edit, Trash } from 'react-feather';

import {
  Badge,
  Box,
  Button,
  DataTable,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Input,
  Label,
  type ColumnDef,
} from '@repo/ui';

import { CompactTablePagination } from '@/components/core/compact-table-pagination';
import { DebouncedSearchInput } from '@/components/core/debounced-search-input';
import { getHeaderPage } from '@/lib/app-utils';
import { useChannelMapping } from '@/hooks/useChannelMapping.hooks';
import { ChannelMapping } from '@/services/crm-config.service';

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100];

export const ChannelMappingView = () => {
  const path = usePathname();
  const {
    mappings,
    thirdParties,
    channels,
    isLoading,
    search,
    handleSearch,
    isCreateOpen,
    setIsCreateOpen,
    editingMapping,
    setEditingMapping,
    deletingMapping,
    setDeletingMapping,
    formData,
    setFormData,
    openCreate,
    openEdit,
    handleCreate,
    handleUpdate,
    handleDelete,
    resetForm,
    isCreating,
    isUpdating,
    isDeleting,
  } = useChannelMapping();

  // Build a lookup map from the already-fetched channels list
  const channelNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    channels.forEach((ch) => {
      map[ch.id] = ch.name || ch.id;
    });
    return map;
  }, [channels]);

  const columns: ColumnDef<ChannelMapping>[] = [
    {
      id: 'channel',
      accessorFn: (mapping) => channelNameMap[mapping.channel] || mapping.channel,
      header: 'Channel',
      enableSorting: false,
      size: 420,
      minSize: 360,
      meta: {
        headerCellClassName: 'whitespace-nowrap',
        cellClassName: 'align-middle',
        cellContentClassName: 'min-w-0 whitespace-nowrap',
      },
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Box className="flex min-w-0 items-center whitespace-nowrap">
            <Box as="span" className="font-medium text-slate-950">
              {channelNameMap[item.channel] || item.channel}
            </Box>
            {channelNameMap[item.channel] && channelNameMap[item.channel] !== item.channel && (
              <Box as="span" className="ml-2 text-xs text-slate-500">
                ({item.channel})
              </Box>
            )}
          </Box>
        );
      },
    },
    {
      id: 'third_party.name',
      accessorFn: (mapping) => mapping.third_party?.name || '-',
      header: 'CRM Provider',
      enableSorting: false,
      size: 150,
      minSize: 132,
      meta: {
        headerCellClassName: 'whitespace-nowrap',
        cellClassName: 'align-middle',
        cellContentClassName: 'whitespace-nowrap',
      },
      cell: ({ row }) => row.original.third_party?.name || '-',
    },
    {
      id: 'third_party.code',
      accessorFn: (mapping) => mapping.third_party?.code || '-',
      header: 'Code',
      enableSorting: false,
      enableResizing: false,
      size: 122,
      minSize: 106,
      meta: {
        headerCellClassName: 'whitespace-nowrap',
        cellClassName: 'align-middle',
        cellContentClassName: 'whitespace-nowrap',
      },
      cell: ({ row }) => {
        const item = row.original;
        return item.third_party?.code ? (
          <Badge variant="secondary" className="capitalize">
            {item.third_party.code}
          </Badge>
        ) : (
          '-'
        );
      },
    },
    {
      id: 'third_party.is_active',
      accessorFn: (mapping) => (mapping.third_party?.is_active ? 'Active' : 'Inactive'),
      header: 'Provider Status',
      enableSorting: false,
      enableResizing: false,
      size: 136,
      minSize: 124,
      meta: {
        headerCellClassName: 'whitespace-nowrap',
        cellClassName: 'align-middle',
        cellContentClassName: 'whitespace-nowrap',
      },
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Badge
            className={
              item.third_party?.is_active
                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-100'
            }
          >
            {item.third_party?.is_active ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      id: 'created_at',
      accessorFn: (mapping) => mapping.created_at || '-',
      header: 'Created At',
      enableSorting: false,
      enableResizing: false,
      size: 124,
      minSize: 116,
      meta: {
        headerCellClassName: 'whitespace-nowrap',
        cellClassName: 'align-middle',
        cellContentClassName: 'whitespace-nowrap',
      },
      cell: ({ row }) => {
        const item = row.original;
        return item.created_at
          ? new Date(item.created_at).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : '-';
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      enableResizing: false,
      size: 86,
      minSize: 78,
      meta: {
        headerCellClassName: 'whitespace-nowrap text-center',
        cellClassName: 'align-middle',
        cellContentClassName: 'whitespace-nowrap',
      },
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Box className="flex items-center justify-center gap-1.5">
            <Box
              as="button"
              type="button"
              aria-label={`Edit mapping for ${channelNameMap[item.channel] || item.channel}`}
              onClick={() => openEdit(item)}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
              title="Edit"
            >
              <Edit size={16} />
            </Box>
            <Box
              as="button"
              type="button"
              aria-label={`Delete mapping for ${channelNameMap[item.channel] || item.channel}`}
              onClick={() => setDeletingMapping(item)}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
              title="Delete"
            >
              <Trash size={16} />
            </Box>
          </Box>
        );
      },
    },
  ];

  const renderFormFields = (isEdit: boolean) => {
    const selectedChannel = channels.find((channel) => channel.id === formData.channel);
    const selectedChannelLabel = selectedChannel?.name
      ? `${selectedChannel.name} (${formData.channel})`
      : formData.channel;

    return (
      <Box className="grid gap-5 px-6 py-5">
        <Box className="grid gap-2.5">
          <Label htmlFor="channel">Channel *</Label>
          {isEdit ? (
            <Input id="channel" value={selectedChannelLabel} disabled />
          ) : (
            <Select
              value={formData.channel}
              onValueChange={(v) =>
                setFormData((prev: typeof formData) => ({
                  ...prev,
                  channel: v,
                }))
              }
            >
              <SelectTrigger className="min-h-10">
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>
              <SelectContent>
                {channels.map((ch) => (
                  <SelectItem key={ch.id} value={ch.id}>
                    {ch.name || ch.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Box as="p" className="max-w-[56ch] text-xs leading-5 text-slate-500">
            The channel identifier that clients send in their requests.
          </Box>
        </Box>

        <Box className="grid gap-2.5">
          <Label htmlFor="third_party_id">CRM Provider *</Label>
          <Select
            value={formData.third_party_id}
            onValueChange={(v) =>
              setFormData((prev: typeof formData) => ({
                ...prev,
                third_party_id: v,
              }))
            }
          >
            <SelectTrigger className="min-h-10">
              <SelectValue placeholder="Select CRM provider" />
            </SelectTrigger>
            <SelectContent>
              {thirdParties.map((tp) => (
                <SelectItem key={tp.id} value={tp.id}>
                  {tp.name} ({tp.code || '-'})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Box as="p" className="max-w-[56ch] text-xs leading-5 text-slate-500">
            Determines which CRM this channel routes to. Populated from Third Party Configuration.
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box className="flex min-h-0 w-full flex-1 flex-col gap-3 p-4 md:p-6">
      <Box className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between 2xl:items-center">
        <Box as="h1" className="text-2xl font-bold text-black">
          {getHeaderPage(2, path, true).pageName || 'Channel Mapping'}
        </Box>

        <Box className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 xl:w-auto 2xl:flex-nowrap">
          <Button onClick={openCreate}>Add Channel Mapping</Button>
        </Box>
      </Box>

      <DataTable<ChannelMapping>
        className="!gap-3 pb-4 md:pb-6 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        data={mappings}
        columns={columns}
        loading={isLoading}
        defaultState={{
          columnPinning: {
            left: ['channel'],
            right: ['actions'],
          },
        }}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        emptyState={
          <Box className="sticky left-0 flex min-h-[10rem] w-[100cqw] items-center justify-center gap-2 py-4 md:min-h-[11rem] md:py-5">
            <Box className="flex flex-col items-center justify-center gap-2">
              <Image alt="No channel mapping data" src={noData} width={128} />
              <Box as="span">No channel mappings available</Box>
            </Box>
          </Box>
        }
        renderToolbar={() => (
          <Box className="w-full">
            <DebouncedSearchInput
              value={search}
              ariaLabel="Search by channel or provider name"
              placeholder="Search by channel or provider name..."
              onDebouncedChange={handleSearch}
              className="h-10 rounded-xl border-slate-300 bg-white text-slate-900 shadow-none transition-colors placeholder:text-slate-400 focus-within:ring-0 focus-within:shadow-none"
            />
          </Box>
        )}
        renderPagination={(table) => (
          <Box className="-mt-1">
            <CompactTablePagination
              table={table}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              disabled={isLoading}
            />
          </Box>
        )}
        tableOptions={{
          enableColumnPinning: true,
          enableColumnResizing: true,
          defaultColumn: {
            minSize: 72,
            size: 120,
          },
          getRowId: (row, index) => row?.id || `channel-mapping-row-${index}`,
        }}
      />

      {/* Create Dialog */}
      <Dialog
        open={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          resetForm();
        }}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader className="gap-2">
            <DialogTitle>Add Channel Mapping</DialogTitle>
            <DialogDescription className="max-w-[60ch]">
              Map a channel to a CRM provider. This determines which CRM receives requests for this
              channel.
            </DialogDescription>
          </DialogHeader>
          {renderFormFields(false)}
          <DialogFooter>
            <Button
              variant="outline"
              className="min-w-24"
              onClick={() => {
                setIsCreateOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              className="min-w-24 disabled:border disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-100"
              onClick={handleCreate}
              disabled={isCreating || !formData.channel || !formData.third_party_id}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingMapping}
        onClose={() => {
          setEditingMapping(null);
          resetForm();
        }}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader className="gap-2">
            <DialogTitle>Edit Channel Mapping</DialogTitle>
            <DialogDescription className="max-w-[60ch]">
              Change the CRM destination while keeping the source channel fixed.
            </DialogDescription>
          </DialogHeader>
          {renderFormFields(true)}
          <DialogFooter>
            <Button
              variant="outline"
              className="min-w-24"
              onClick={() => {
                setEditingMapping(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              className="min-w-24 disabled:border disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-100"
              onClick={handleUpdate}
              disabled={isUpdating || !formData.third_party_id}
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingMapping} onClose={() => setDeletingMapping(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Channel Mapping</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove the mapping for channel &quot;
              {deletingMapping?.channel}&quot;? This channel will default to Zoho.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingMapping(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
