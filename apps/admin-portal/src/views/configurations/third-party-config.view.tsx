'use client';

import noData from '@public/images/no-data.webp';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { Edit, Eye, EyeOff, Trash } from 'react-feather';

import {
  Badge,
  Box,
  Button,
  DataTable,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Switch,
  type ColumnDef,
} from '@repo/ui';

import { CompactTablePagination } from '@/components/core/compact-table-pagination';
import { DebouncedSearchInput } from '@/components/core/debounced-search-input';
import { getHeaderPage } from '@/lib/app-utils';
import { useThirdPartyConfig } from '@/hooks/useThirdPartyConfig.hooks';
import { ThirdPartyConfig } from '@/services/crm-config.service';

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100];

export const ThirdPartyConfigView = () => {
  const path = usePathname();
  const {
    configurations,
    isLoading,
    search,
    handleSearch,
    isCreateOpen,
    setIsCreateOpen,
    editingConfig,
    setEditingConfig,
    deletingConfig,
    setDeletingConfig,
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
  } = useThirdPartyConfig();

  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({});
  const [configJsonStr, setConfigJsonStr] = useState('{}');

  const toggleFieldVisibility = (field: string) => {
    setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const maskValue = (value?: string) => {
    if (!value) return '-';
    if (value.length <= 8) return '********';
    return `${value.substring(0, 4)}****${value.substring(value.length - 4)}`;
  };

  const initConfigJson = (config?: Record<string, unknown>) => {
    setConfigJsonStr(
      config && Object.keys(config).length > 0 ? JSON.stringify(config, null, 2) : '{}',
    );
  };

  const columns: ColumnDef<ThirdPartyConfig>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: false,
      size: 280,
      minSize: 220,
      meta: {
        headerCellClassName: 'whitespace-nowrap',
        cellClassName: 'align-middle',
        cellContentClassName: 'min-w-0 whitespace-nowrap',
      },
      cell: ({ row }) => (
        <Box as="span" className="font-medium text-slate-950">
          {row.original.name}
        </Box>
      ),
    },
    {
      id: 'code',
      accessorFn: (config) => config.code || '-',
      header: 'Code',
      enableSorting: false,
      enableResizing: false,
      size: 132,
      minSize: 112,
      meta: {
        headerCellClassName: 'whitespace-nowrap',
        cellClassName: 'align-middle',
        cellContentClassName: 'whitespace-nowrap',
      },
      cell: ({ row }) =>
        row.original.code ? (
          <Badge variant="secondary" className="capitalize">
            {row.original.code}
          </Badge>
        ) : (
          '-'
        ),
    },
    {
      id: 'access_token',
      accessorFn: (config) => config.access_token || '-',
      header: 'Access Token',
      enableSorting: false,
      size: 180,
      minSize: 156,
      meta: {
        headerCellClassName: 'whitespace-nowrap',
        cellClassName: 'align-middle',
        cellContentClassName: 'whitespace-nowrap',
      },
      cell: ({ row }) => (
        <Box as="span" className="font-mono text-xs">
          {maskValue(row.original.access_token)}
        </Box>
      ),
    },
    {
      id: 'is_active',
      accessorFn: (config) => (config.is_active ? 'Active' : 'Inactive'),
      header: 'Status',
      enableSorting: false,
      enableResizing: false,
      size: 116,
      minSize: 104,
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
              item.is_active
                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-100'
            }
          >
            {item.is_active ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      id: 'updated_at',
      accessorFn: (config) => config.updated_at || '-',
      header: 'Updated At',
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
        return item.updated_at
          ? new Date(item.updated_at).toLocaleDateString('en-GB', {
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
              aria-label={`Edit configuration for ${item.name}`}
              onClick={() => {
                openEdit(item);
                initConfigJson(item.configuration);
              }}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
              title="Edit"
            >
              <Edit size={16} />
            </Box>
            <Box
              as="button"
              type="button"
              aria-label={`Delete configuration for ${item.name}`}
              onClick={() => setDeletingConfig(item)}
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

  const renderSensitiveField = (
    label: string,
    fieldKey: string,
    value: string,
    onChange: (val: string) => void,
    placeholder?: string,
  ) => (
    <Box className="grid gap-2.5">
      <Label htmlFor={fieldKey}>{label}</Label>
      <Box className="relative">
        <Input
          id={fieldKey}
          type={visibleFields[fieldKey] ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pr-10"
        />
        <Box
          as="button"
          type="button"
          aria-label={`${visibleFields[fieldKey] ? 'Hide' : 'Show'} ${label}`}
          onClick={() => toggleFieldVisibility(fieldKey)}
          className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-slate-50 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
        >
          {visibleFields[fieldKey] ? <EyeOff size={16} /> : <Eye size={16} />}
        </Box>
      </Box>
    </Box>
  );

  const renderFormFields = () => (
    <Box className="grid max-h-[60vh] gap-5 overflow-y-auto px-6 py-5 pr-2">
      <Box className="grid gap-2.5">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev: typeof formData) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          placeholder="e.g. Zoho CRM, Twenty CRM"
        />
      </Box>

      <Box className="grid gap-2.5">
        <Label htmlFor="code">Code</Label>
        <Input
          id="code"
          value={formData.code || ''}
          onChange={(e) =>
            setFormData((prev: typeof formData) => ({
              ...prev,
              code: e.target.value,
            }))
          }
          placeholder="e.g. zoho, twenty-crm"
        />
        <Box as="p" className="max-w-[56ch] text-xs leading-5 text-slate-500">
          Unique identifier. For CRM routing use &quot;zoho&quot; or &quot;twenty-crm&quot;.
        </Box>
      </Box>

      {renderSensitiveField(
        'Client ID',
        'client_id',
        formData.client_id || '',
        (val) =>
          setFormData((prev: typeof formData) => ({
            ...prev,
            client_id: val,
          })),
        'OAuth Client ID (Zoho only)',
      )}

      {renderSensitiveField(
        'Client Secret',
        'client_secret',
        formData.client_secret || '',
        (val) =>
          setFormData((prev: typeof formData) => ({
            ...prev,
            client_secret: val,
          })),
        'OAuth Client Secret (Zoho only)',
      )}

      {renderSensitiveField(
        'Access Token',
        'access_token',
        formData.access_token || '',
        (val) =>
          setFormData((prev: typeof formData) => ({
            ...prev,
            access_token: val,
          })),
        'OAuth token (Zoho) or API key (Twenty CRM)',
      )}

      {renderSensitiveField(
        'Refresh Token',
        'refresh_token',
        formData.refresh_token || '',
        (val) =>
          setFormData((prev: typeof formData) => ({
            ...prev,
            refresh_token: val,
          })),
        'OAuth Refresh Token (Zoho only)',
      )}

      <Box className="grid gap-2.5">
        <Label htmlFor="session_id">Session ID</Label>
        <Input
          id="session_id"
          value={formData.session_id || ''}
          onChange={(e) =>
            setFormData((prev: typeof formData) => ({
              ...prev,
              session_id: e.target.value,
            }))
          }
          placeholder="Session ID (optional)"
        />
      </Box>

      <Box className="grid gap-2.5">
        <Label htmlFor="module">Module</Label>
        <Input
          id="module"
          value={formData.module || ''}
          onChange={(e) =>
            setFormData((prev: typeof formData) => ({
              ...prev,
              module: e.target.value,
            }))
          }
          placeholder="Module identifier (optional)"
        />
      </Box>

      <Box className="grid gap-2.5">
        <Label htmlFor="configuration">Configuration (JSON)</Label>
        <Box
          as="textarea"
          id="configuration"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={configJsonStr}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setConfigJsonStr(e.target.value);
            try {
              const parsed = JSON.parse(e.target.value);
              setFormData((prev: typeof formData) => ({
                ...prev,
                configuration: parsed,
              }));
            } catch {
              // Allow typing invalid JSON temporarily
            }
          }}
          placeholder='{"key": "value"}'
        />
        <Box as="p" className="max-w-[56ch] text-xs leading-5 text-slate-500">
          Sensitive fields (password, systemId, client_id, client_secret) are auto-encrypted.
        </Box>
      </Box>

      <Box className="flex items-center gap-3">
        <Label htmlFor="is_active">Active</Label>
        <Switch
          id="is_active"
          checked={formData.is_active ?? true}
          onCheckedChange={(v) =>
            setFormData((prev: typeof formData) => ({
              ...prev,
              is_active: v,
            }))
          }
        />
      </Box>
    </Box>
  );

  return (
    <Box className="flex min-h-0 w-full flex-1 flex-col gap-3 p-4 md:p-6">
      <Box className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between 2xl:items-center">
        <Box as="h1" className="text-2xl font-bold text-black">
          {getHeaderPage(2, path, true).pageName || 'Third Party Configuration'}
        </Box>

        <Box className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 xl:w-auto 2xl:flex-nowrap">
          <Button onClick={openCreate}>Add Configuration</Button>
        </Box>
      </Box>

      <DataTable<ThirdPartyConfig>
        className="!gap-3 pb-4 md:pb-6 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        data={configurations}
        columns={columns}
        loading={isLoading}
        defaultState={{
          columnPinning: {
            left: ['name'],
            right: ['actions'],
          },
        }}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        emptyState={
          <Box className="sticky left-0 flex min-h-[10rem] w-[100cqw] items-center justify-center gap-2 py-4 md:min-h-[11rem] md:py-5">
            <Box className="flex flex-col items-center justify-center gap-2">
              <Image alt="No third party configuration data" src={noData} width={128} />
              <Box as="span">No third party configurations found</Box>
            </Box>
          </Box>
        }
        renderToolbar={() => (
          <Box className="w-full">
            <DebouncedSearchInput
              value={search}
              ariaLabel="Search by name or code"
              placeholder="Search by name or code..."
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
          getRowId: (row, index) => row?.id || `third-party-config-row-${index}`,
        }}
      />

      {/* Create Dialog */}
      <Dialog
        open={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          resetForm();
          setVisibleFields({});
          setConfigJsonStr('{}');
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader className="gap-2">
            <DialogTitle>Add Third Party Configuration</DialogTitle>
            <DialogDescription className="max-w-[60ch]">
              Create a new third party provider configuration (e.g. CRM, payment gateway).
            </DialogDescription>
          </DialogHeader>
          {renderFormFields()}
          <DialogFooter>
            <Button
              variant="outline"
              className="min-w-24"
              onClick={() => {
                setIsCreateOpen(false);
                resetForm();
                setVisibleFields({});
                setConfigJsonStr('{}');
              }}
            >
              Cancel
            </Button>
            <Button
              className="min-w-24 disabled:border disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-100"
              onClick={handleCreate}
              disabled={isCreating || !formData.name}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingConfig}
        onClose={() => {
          setEditingConfig(null);
          resetForm();
          setVisibleFields({});
          setConfigJsonStr('{}');
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader className="gap-2">
            <DialogTitle>Edit Third Party Configuration</DialogTitle>
            <DialogDescription className="max-w-[60ch]">
              Update the third party provider configuration.
            </DialogDescription>
          </DialogHeader>
          {renderFormFields()}
          <DialogFooter>
            <Button
              variant="outline"
              className="min-w-24"
              onClick={() => {
                setEditingConfig(null);
                resetForm();
                setVisibleFields({});
                setConfigJsonStr('{}');
              }}
            >
              Cancel
            </Button>
            <Button
              className="min-w-24 disabled:border disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-100"
              onClick={handleUpdate}
              disabled={isUpdating || !formData.name}
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingConfig} onClose={() => setDeletingConfig(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Third Party Configuration</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingConfig?.name}
              &quot;? This action will soft-delete the configuration.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingConfig(null)}>
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
