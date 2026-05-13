"use client";

import React, { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useScreen } from "@/context/screen.context";
import { getHeaderPage } from "@/helpers/app.helper";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useChannelProviders } from "@/hooks/useChannelProviders.hooks";
import { Edit, XCircle, Trash } from "react-feather";

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
    if (formData.type === "email") {
      return hasBasicFields && !!formData.fromEmail;
    }
    return hasBasicFields;
  }, [formData]);

  const isEditValid = useMemo(() => {
    const hasProvider = !!formData.provider;
    if (editingProvider?.type === "email") {
      return hasProvider && !!formData.fromEmail;
    }
    return hasProvider;
  }, [formData, editingProvider]);

  const columns: Column<ChannelProvider>[] = [
    {
      key: "channelId",
      header: "Channel",
      render: (item) => (
        <div>
          <span className="font-medium">{channelNameMap[item.channelId] || item.channelId}</span>
          {channelNameMap[item.channelId] && channelNameMap[item.channelId] !== item.channelId && (
            <span className="text-xs text-gray-500 ml-2">({item.channelId})</span>
          )}
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (item) => (
        <Badge variant="secondary" className="capitalize">
          {item.type}
        </Badge>
      ),
    },
    { key: "provider", header: "Provider" },
    {
      key: "fromEmail",
      header: "From Email",
      render: (item) => item.fromEmail || "-",
    },
    {
      key: "enabled",
      header: "Enabled",
      render: (item) => (
        <Badge
          className={
            item.enabled
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-gray-100 text-gray-600 hover:bg-gray-100"
          }
        >
          {item.enabled ? "Active" : "Disabled"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Created At",
      render: (item) =>
        item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-",
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEdit(item)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          {item.enabled && (
            <button
              onClick={() => setDisablingProvider(item)}
              className="text-red-500 hover:text-red-700"
              title="Disable"
            >
              <XCircle size={16} />
            </button>
          )}
          <button
            onClick={() => setDeletingProvider(item)}
            className="text-red-500 hover:text-red-700"
            title="Delete"
          >
            <Trash size={16} />
          </button>
        </div>
      ),
    },
  ];

  const renderFormFields = (isEdit: boolean) => {
    const showChannelError = submitted && !isEdit && !formData.channelId;
    const showTypeError = submitted && !isEdit && !formData.type;
    const showProviderError = submitted && !formData.provider;
    const showFromEmailError =
      submitted &&
      ((!isEdit && formData.type === "email" && !formData.fromEmail) ||
        (isEdit && editingProvider?.type === "email" && !formData.fromEmail));

    return (
      <div className="grid gap-4 py-4">
        {!isEdit && (
          <div className="grid gap-2">
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
              <SelectTrigger className={showChannelError ? "border-red-500" : ""}>
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
              <p className="text-xs text-red-500">Channel is required</p>
            )}
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="type">Type</Label>
          {isEdit ? (
            <Input value={formData.type} disabled className="capitalize" />
          ) : (
            <Select
              value={formData.type}
              onValueChange={(v) =>
                setFormData((prev: typeof formData) => ({ ...prev, type: v }))
              }
            >
              <SelectTrigger className={showTypeError ? "border-red-500" : ""}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          )}
          {showTypeError && (
            <p className="text-xs text-red-500">Type is required</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="provider">Provider</Label>
          <Select
            value={formData.provider}
            onValueChange={(v) =>
              setFormData((prev: typeof formData) => ({ ...prev, provider: v }))
            }
            disabled={!formData.type && !isEdit}
          >
            <SelectTrigger className={showProviderError ? "border-red-500" : ""}>
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
            <p className="text-xs text-red-500">Provider is required</p>
          )}
        </div>

        {(formData.type === "email" || (isEdit && editingProvider?.type === "email")) && (
          <div className="grid gap-2">
            <Label htmlFor="fromEmail">From Email</Label>
            <Input
              value={formData.fromEmail || ""}
              onChange={(e) =>
                setFormData((prev: typeof formData) => ({
                  ...prev,
                  fromEmail: e.target.value,
                }))
              }
              placeholder="sender@example.com"
              className={showFromEmailError ? "border-red-500" : ""}
            />
            {showFromEmailError && (
              <p className="text-xs text-red-500">From Email is required</p>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          <Label htmlFor="enabled">Enabled</Label>
          <Switch
            checked={formData.enabled}
            onCheckedChange={(v) =>
              setFormData((prev: typeof formData) => ({ ...prev, enabled: v }))
            }
          />
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto py-5 px-7">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
        <p className={`font-bold text-lg ${isMobileView && "mb-2"}`}>
          {getHeaderPage(2, path, true).pageName || "Configurations"}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <Select
              value={filterType || "all"}
              onValueChange={(v) => setFilterType(v === "all" ? "" : v)}
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
          </div>

          <DataTable<ChannelProvider>
            data={providers}
            columns={columns}
            loading={isLoading}
            noDataText="No communication providers found"
          />

      {/* Create Dialog */}
      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            resetForm();
            setSubmitted(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Channel Provider</DialogTitle>
            <DialogDescription>
              Create a new channel-to-provider mapping.
            </DialogDescription>
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
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingProvider}
        onOpenChange={(open) => {
          if (!open) {
            setEditingProvider(null);
            resetForm();
            setSubmitted(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Channel Provider</DialogTitle>
            <DialogDescription>
              Update the channel provider mapping.
            </DialogDescription>
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
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable Confirmation Dialog */}
      <Dialog
        open={!!disablingProvider}
        onOpenChange={(open) => {
          if (!open) setDisablingProvider(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable Channel Provider</DialogTitle>
            <DialogDescription>
              Are you sure you want to disable this channel provider? This will
              set the provider as inactive.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDisablingProvider(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisable}
              disabled={isDisabling}
            >
              {isDisabling ? "Disabling..." : "Disable"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingProvider}
        onOpenChange={(open) => {
          if (!open) setDeletingProvider(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Channel Provider</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this channel provider? This action cannot be undone.
              {deletingProvider?.enabled && (
                <span className="block mt-2 text-amber-600">
                  ⚠️ This provider is currently active. Deleting it may disrupt communications for the associated channel.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingProvider(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
