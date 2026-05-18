"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useScreen } from "@/context/screen.context";
import { getHeaderPage } from "@/helpers/app.helper";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useThirdPartyConfig } from "@/hooks/useThirdPartyConfig.hooks";
import { ThirdPartyConfig } from "@/services/crm-config.service";
import { Edit, Trash, Eye, EyeOff } from "react-feather";

export const ThirdPartyConfigView = () => {
  const path = usePathname();
  const { isMobileView } = useScreen();
  const {
    configurations,
    isLoading,
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

  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>(
    {}
  );
  const [configJsonStr, setConfigJsonStr] = useState("{}");

  const toggleFieldVisibility = (field: string) => {
    setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const maskValue = (value?: string) => {
    if (!value) return "-";
    if (value.length <= 8) return "••••••••";
    return value.substring(0, 4) + "••••" + value.substring(value.length - 4);
  };

  const columns: Column<ThirdPartyConfig>[] = [
    { key: "name", header: "Name" },
    {
      key: "code",
      header: "Code",
      render: (item) => (
        <Badge variant="secondary" className="capitalize">
          {item.code}
        </Badge>
      ),
    },
    {
      key: "access_token",
      header: "Access Token",
      render: (item) => (
        <span className="font-mono text-xs">
          {maskValue(item.access_token)}
        </span>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      render: (item) => (
        <Badge
          className={
            item.is_active
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-gray-100 text-gray-600 hover:bg-gray-100"
          }
        >
          {item.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "updated_at",
      header: "Updated At",
      render: (item) =>
        item.updated_at
          ? new Date(item.updated_at).toLocaleDateString("en-GB", {
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
            onClick={() => {
              openEdit(item);
              initConfigJson(item.configuration);
            }}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => setDeletingConfig(item)}
            className="text-red-500 hover:text-red-700"
            title="Delete"
          >
            <Trash size={16} />
          </button>
        </div>
      ),
    },
  ];

  const renderSensitiveField = (
    label: string,
    fieldKey: string,
    value: string,
    onChange: (val: string) => void,
    placeholder?: string
  ) => (
    <div className="grid gap-2">
      <Label htmlFor={fieldKey}>{label}</Label>
      <div className="relative">
        <Input
          id={fieldKey}
          type={visibleFields[fieldKey] ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => toggleFieldVisibility(fieldKey)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {visibleFields[fieldKey] ? (
            <EyeOff size={16} />
          ) : (
            <Eye size={16} />
          )}
        </button>
      </div>
    </div>
  );

  const initConfigJson = (config?: Record<string, unknown>) => {
    setConfigJsonStr(
      config && Object.keys(config).length > 0
        ? JSON.stringify(config, null, 2)
        : "{}"
    );
  };

  const renderFormFields = () => (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
      <div className="grid gap-2">
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
      </div>

      <div className="grid gap-2">
        <Label htmlFor="code">Code</Label>
        <Input
          id="code"
          value={formData.code || ""}
          onChange={(e) =>
            setFormData((prev: typeof formData) => ({
              ...prev,
              code: e.target.value,
            }))
          }
          placeholder='e.g. zoho, twenty-crm'
        />
        <p className="text-xs text-gray-500">
          Unique identifier. For CRM routing use &quot;zoho&quot; or
          &quot;twenty-crm&quot;.
        </p>
      </div>

      {renderSensitiveField(
        "Client ID",
        "client_id",
        formData.client_id || "",
        (val) =>
          setFormData((prev: typeof formData) => ({
            ...prev,
            client_id: val,
          })),
        "OAuth Client ID (Zoho only)"
      )}

      {renderSensitiveField(
        "Client Secret",
        "client_secret",
        formData.client_secret || "",
        (val) =>
          setFormData((prev: typeof formData) => ({
            ...prev,
            client_secret: val,
          })),
        "OAuth Client Secret (Zoho only)"
      )}

      {renderSensitiveField(
        "Access Token",
        "access_token",
        formData.access_token || "",
        (val) =>
          setFormData((prev: typeof formData) => ({
            ...prev,
            access_token: val,
          })),
        "OAuth token (Zoho) or API key (Twenty CRM)"
      )}

      {renderSensitiveField(
        "Refresh Token",
        "refresh_token",
        formData.refresh_token || "",
        (val) =>
          setFormData((prev: typeof formData) => ({
            ...prev,
            refresh_token: val,
          })),
        "OAuth Refresh Token (Zoho only)"
      )}

      <div className="grid gap-2">
        <Label htmlFor="session_id">Session ID</Label>
        <Input
          id="session_id"
          value={formData.session_id || ""}
          onChange={(e) =>
            setFormData((prev: typeof formData) => ({
              ...prev,
              session_id: e.target.value,
            }))
          }
          placeholder="Session ID (optional)"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="module">Module</Label>
        <Input
          id="module"
          value={formData.module || ""}
          onChange={(e) =>
            setFormData((prev: typeof formData) => ({
              ...prev,
              module: e.target.value,
            }))
          }
          placeholder="Module identifier (optional)"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="configuration">Configuration (JSON)</Label>
        <textarea
          id="configuration"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={configJsonStr}
          onChange={(e) => {
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
        <p className="text-xs text-gray-500">
          Sensitive fields (password, systemId, client_id, client_secret) are
          auto-encrypted.
        </p>
      </div>

      <div className="flex items-center gap-3">
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
      </div>
    </div>
  );

  return (
    <div className="mx-auto py-5 px-7">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-5">
        <p className={`font-bold text-lg ${isMobileView && "mb-2"}`}>
          {getHeaderPage(2, path, true).pageName || "Third Party Configuration"}
        </p>

        <Button onClick={openCreate}>Add Configuration</Button>
      </div>

      <DataTable<ThirdPartyConfig>
        data={configurations}
        columns={columns}
        loading={isLoading}
        search={{
          placeholder: "Search by name or code...",
          onSearch: handleSearch,
        }}
        noDataText="No third party configurations found"
      />

      {/* Create Dialog */}
      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            resetForm();
            setVisibleFields({});
            setConfigJsonStr("{}");
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Third Party Configuration</DialogTitle>
            <DialogDescription>
              Create a new third party provider configuration (e.g. CRM, payment
              gateway).
            </DialogDescription>
          </DialogHeader>
          {renderFormFields()}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                resetForm();
                setVisibleFields({});
                setConfigJsonStr("{}");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isCreating || !formData.name}>
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingConfig}
        onOpenChange={(open) => {
          if (!open) {
            setEditingConfig(null);
            resetForm();
            setVisibleFields({});
            setConfigJsonStr("{}");
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Third Party Configuration</DialogTitle>
            <DialogDescription>
              Update the third party provider configuration.
            </DialogDescription>
          </DialogHeader>
          {renderFormFields()}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingConfig(null);
                resetForm();
                setVisibleFields({});
                setConfigJsonStr("{}");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating || !formData.name}>
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingConfig}
        onOpenChange={(open) => {
          if (!open) setDeletingConfig(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Third Party Configuration</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingConfig?.name}
              &quot;? This action will soft-delete the configuration.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingConfig(null)}
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
