"use client";

import React, { useMemo } from "react";
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
import { useChannelMapping } from "@/hooks/useChannelMapping.hooks";
import { ChannelMapping } from "@/services/crm-config.service";
import { Edit, Trash } from "react-feather";

export const ChannelMappingView = () => {
  const path = usePathname();
  const { isMobileView } = useScreen();
  const {
    mappings,
    thirdParties,
    channels,
    isLoading,
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

  const columns: Column<ChannelMapping>[] = [
    {
      key: "channel",
      header: "Channel",
      render: (item) => (
        <div>
          <span className="font-medium">{channelNameMap[item.channel] || item.channel}</span>
          {channelNameMap[item.channel] && channelNameMap[item.channel] !== item.channel && (
            <span className="text-xs text-gray-500 ml-2">({item.channel})</span>
          )}
        </div>
      ),
    },
    {
      key: "third_party.name",
      header: "CRM Provider",
      render: (item) => item.third_party?.name || "-",
    },
    {
      key: "third_party.code",
      header: "Code",
      render: (item) =>
        item.third_party?.code ? (
          <Badge variant="secondary" className="capitalize">
            {item.third_party.code}
          </Badge>
        ) : (
          "-"
        ),
    },
    {
      key: "third_party.is_active",
      header: "Provider Status",
      render: (item) => (
        <Badge
          className={
            item.third_party?.is_active
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-gray-100 text-gray-600 hover:bg-gray-100"
          }
        >
          {item.third_party?.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "created_at",
      header: "Created At",
      render: (item) =>
        item.created_at
          ? new Date(item.created_at).toLocaleDateString("en-GB", {
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
          <button
            onClick={() => setDeletingMapping(item)}
            className="text-red-500 hover:text-red-700"
            title="Delete"
          >
            <Trash size={16} />
          </button>
        </div>
      ),
    },
  ];

  const renderFormFields = (isEdit: boolean) => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="channel">Channel *</Label>
        {isEdit ? (
          <Input id="channel" value={formData.channel} disabled />
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
            <SelectTrigger>
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
        )}
        <p className="text-xs text-gray-500">
          The channel identifier that clients send in their requests.
        </p>
      </div>

      <div className="grid gap-2">
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
          <SelectTrigger>
            <SelectValue placeholder="Select CRM provider" />
          </SelectTrigger>
          <SelectContent>
            {thirdParties.map((tp) => (
              <SelectItem key={tp.id} value={tp.id}>
                {tp.name} ({tp.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          Determines which CRM this channel routes to. Populated from Third
          Party Configuration.
        </p>
      </div>
    </div>
  );

  return (
    <div className="mx-auto py-5 px-7">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
        <p className={`font-bold text-lg ${isMobileView && "mb-2"}`}>
          {getHeaderPage(2, path, true).pageName || "Channel Mapping"}
        </p>

        <Button onClick={openCreate}>Add Channel Mapping</Button>
      </div>

      <DataTable<ChannelMapping>
        data={mappings}
        columns={columns}
        loading={isLoading}
        search={{
          placeholder: "Search by channel or provider name...",
          onSearch: handleSearch,
        }}
        noDataText="No channel mappings found. Channels without a mapping default to Zoho."
      />

      {/* Create Dialog */}
      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Channel Mapping</DialogTitle>
            <DialogDescription>
              Map a channel to a CRM provider. This determines which CRM
              receives requests for this channel.
            </DialogDescription>
          </DialogHeader>
          {renderFormFields(false)}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                isCreating || !formData.channel || !formData.third_party_id
              }
            >
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingMapping}
        onOpenChange={(open) => {
          if (!open) {
            setEditingMapping(null);
            resetForm();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Channel Mapping</DialogTitle>
            <DialogDescription>
              Change which CRM provider this channel routes to.
            </DialogDescription>
          </DialogHeader>
          {renderFormFields(true)}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingMapping(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating || !formData.third_party_id}
            >
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingMapping}
        onOpenChange={(open) => {
          if (!open) setDeletingMapping(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Channel Mapping</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove the mapping for channel &quot;
              {deletingMapping?.channel}&quot;? This channel will default to
              Zoho.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingMapping(null)}
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
