'use client';

import { usePathname } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { Edit, XCircle, Trash } from 'react-feather';

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
  Switch,
  type ColumnDef,
} from '@repo/ui';

import { useScreen } from '@/context/screen.context';
import { getHeaderPage } from '@/helpers/app.helper';
import { useChannelProviders } from '@/hooks/useChannelProviders.hooks';

interface ChannelProvider {
  id: string;
  channelId: string;
  type: string;
  provider: string;
  fromEmail?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export const ConfigurationsView = () => {
  const path = usePathname();
  const { isMobileView } = useScreen();
  const {
    providers,
    channels,
    availableProviders,
    isLoading,
    filterType,
    setFilterType,
    isCreateOpen,
    setIsCreateOpen,
    editingProvider,
    setEditingProvider,
    disablingProvider,
    setDisablingProvider,
    deletingProvider,
    setDeletingProvider,
    formData,
    setFormData,
    openCreate,
    openEdit,
    handleCreate,
    handleUpdate,
    handleDisable,
    handleDelete,
    resetForm,
    isCreating,
    isUpdating,
    isDisabling,
    isDeleting,
  } = useChannelProviders();

  const channelNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    channels.forEach((ch: any) => {
      map[ch.id] = ch.name || ch.id;
    });
    return map;
  }, [channels]);

  const [submitted, setSubmitted] = useState(false);

  const isCreateValid = useMemo(() => {
    const hasBasicFields = !!(formData.channelId && formData.type && formData.provider);
    if (formData.type === 'email') {
      return hasBasicFields && !!formData.fromEmail;
    }
    return hasBasicFields;
  }, [formData]);

  const isEditValid = useMemo(() => {
    const hasBasicFields = !!(formData.channelId && formData.type && formData.provider);
    if (formData.type === 'email' || editingProvider?.type === 'email') {
      return hasBasicFields && !!formData.fromEmail;
    }
    return hasBasicFields;
  }, [formData, editingProvider]);

  const columns: ColumnDef<ChannelProvider>[] = [
    {
      id: 'channelId',
      header: 'Channel',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Box>
            <Box as="span" className="font-medium">
              {channelNameMap[item.channelId] || item.channelId}
            </Box>
            {channelNameMap[item.channelId] &&
              channelNameMap[item.channelId] !== item.channelId && (
                <Box as="span" className="text-xs text-gray-500 ml-2">
                  ({item.channelId})
                </Box>
              )}
          </Box>
        );
      },
    },
    {
      id: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="secondary" className="capitalize">
          {row.original.type}
        </Badge>
      ),
    },
    { accessorKey: 'provider', header: 'Provider' },
    {
      id: 'fromEmail',
      header: 'From Email',
      cell: ({ row }) => row.original.fromEmail || '-',
    },
    {
      id: 'enabled',
      header: 'Enabled',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Badge
            className={
              item.enabled
                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-100'
            }
          >
            {item.enabled ? 'Active' : 'Disabled'}
          </Badge>
        );
      },
    },
    {
      id: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => {
        const item = row.original;
        return item.createdAt
          ? new Date(item.createdAt).toLocaleDateString('en-GB', {
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
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Box className="flex gap-2">
            <Box
              as="button"
              type="button"
              onClick={() => openEdit(item)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit"
            >
              <Edit size={16} />
            </Box>
            {item.enabled && (
              <Box
                as="button"
                type="button"
                onClick={() => setDisablingProvider(item)}
                className="text-red-500 hover:text-red-700"
                title="Disable"
              >
                <XCircle size={16} />
              </Box>
            )}
            <Box
              as="button"
              type="button"
              onClick={() => setDeletingProvider(item)}
              className="text-red-500 hover:text-red-700"
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
    const showChannelError = submitted && !formData.channelId;
    const showTypeError = submitted && !isEdit && !formData.type;
    const showProviderError = submitted && !formData.provider;
    const showFromEmailError = submitted && formData.type === 'email' && !formData.fromEmail;

    return (
      <Box className="grid gap-4 py-4">
        <Box className="grid gap-2">
          <Label htmlFor="channel">Channel</Label>
          <Select
            value={formData.channelId}
            onValueChange={(v) =>
              setFormData((prev: typeof formData) => ({
                ...prev,
                channelId: v,
              }))
            }
          >
            <SelectTrigger className={showChannelError ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              {channels.map((ch: any) => (
                <SelectItem key={ch.id} value={ch.id}>
                  {ch.name || ch.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showChannelError && (
            <Box as="p" className="text-xs text-red-500">
              Channel is required
            </Box>
          )}
        </Box>

        <Box className="grid gap-2">
          <Label htmlFor="type">Type</Label>
          {isEdit ? (
            <Input value={formData.type} disabled className="capitalize" />
          ) : (
            <Select
              value={formData.type}
              onValueChange={(v) => setFormData((prev: typeof formData) => ({ ...prev, type: v }))}
            >
              <SelectTrigger className={showTypeError ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          )}
          {showTypeError && (
            <Box as="p" className="text-xs text-red-500">
              Type is required
            </Box>
          )}
        </Box>

        <Box className="grid gap-2">
          <Label htmlFor="provider">Provider</Label>
          <Select
            value={formData.provider}
            onValueChange={(v) =>
              setFormData((prev: typeof formData) => ({ ...prev, provider: v }))
            }
            disabled={!formData.type}
          >
            <SelectTrigger className={showProviderError ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              {availableProviders.map((p: string) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showProviderError && (
            <Box as="p" className="text-xs text-red-500">
              Provider is required
            </Box>
          )}
        </Box>

        {formData.type === 'email' && (
          <Box className="grid gap-2">
            <Label htmlFor="fromEmail">From Email</Label>
            <Input
              value={formData.fromEmail || ''}
              onChange={(e) =>
                setFormData((prev: typeof formData) => ({
                  ...prev,
                  fromEmail: e.target.value,
                }))
              }
              placeholder="sender@example.com"
              className={showFromEmailError ? 'border-red-500' : ''}
            />
            {showFromEmailError && (
              <Box as="p" className="text-xs text-red-500">
                From Email is required
              </Box>
            )}
          </Box>
        )}

        <Box className="flex items-center gap-3">
          <Label htmlFor="enabled">Enabled</Label>
          <Switch
            checked={formData.enabled}
            onCheckedChange={(v) =>
              setFormData((prev: typeof formData) => ({ ...prev, enabled: v }))
            }
          />
        </Box>
      </Box>
    );
  };

  return (
    <Box className="mx-auto py-5 px-7">
      <Box className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
        <Box as="p" className={`font-bold text-lg ${isMobileView && 'mb-2'}`}>
          {getHeaderPage(2, path, true).pageName || 'Configurations'}
        </Box>
      </Box>

      <Box className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <Select
          value={filterType || 'all'}
          onValueChange={(v) => setFilterType(v === 'all' ? '' : v)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={openCreate}>Add Channel Provider</Button>
      </Box>

      <DataTable<ChannelProvider>
        data={providers}
        columns={columns}
        loading={isLoading}
        emptyState="No communication providers found"
      />

      {/* Create Dialog */}
      <Dialog
        open={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          resetForm();
          setSubmitted(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Channel Provider</DialogTitle>
            <DialogDescription>Create a new channel-to-provider mapping.</DialogDescription>
          </DialogHeader>
          {renderFormFields(false)}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                resetForm();
                setSubmitted(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!isCreateValid) {
                  setSubmitted(true);
                } else {
                  handleCreate();
                }
              }}
              disabled={isCreating || !isCreateValid}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingProvider}
        onClose={() => {
          setEditingProvider(null);
          resetForm();
          setSubmitted(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Channel Provider</DialogTitle>
            <DialogDescription>Update the channel provider mapping.</DialogDescription>
          </DialogHeader>
          {renderFormFields(true)}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingProvider(null);
                resetForm();
                setSubmitted(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!isEditValid) {
                  setSubmitted(true);
                } else {
                  handleUpdate();
                }
              }}
              disabled={isUpdating || !isEditValid}
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable Confirmation Dialog */}
      <Dialog open={!!disablingProvider} onClose={() => setDisablingProvider(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable Channel Provider</DialogTitle>
            <DialogDescription>
              Are you sure you want to disable this channel provider? This will set the provider as
              inactive.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisablingProvider(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDisable} disabled={isDisabling}>
              {isDisabling ? 'Disabling...' : 'Disable'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingProvider} onClose={() => setDeletingProvider(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Channel Provider</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this channel provider? This action cannot
              be undone.
              {deletingProvider?.enabled && (
                <Box as="span" className="block mt-2 text-amber-600">
                  ⚠️ This provider is currently active. Deleting it may disrupt communications for
                  the associated channel.
                </Box>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingProvider(null)}>
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
