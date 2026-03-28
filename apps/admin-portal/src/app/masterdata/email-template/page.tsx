"use client";

import { Button } from "@repo/ui";
import { Plus } from "react-feather";
import { DataTable } from "@/components/ui/DataTable";
import { useEmailTemplate } from "@/hooks/useEmailTemplate.hooks";
import { createEmailTemplateTableColumns } from "@/components/tableConfig/emailTemplateTableConfig";

export default function MailTemplate() {
  const {
    templates,
    totalPages,
    totalItems,
    categories,
    page,
    rowsPerPage,
    selectedTab,
    hasAccess,
    canEdit,
    canCreate,
    canDelete,
    isLoading,
    setPage,
    handleRowsPerPageChange,
    handleTabChange,
    handleEdit,
    handleDelete,
    addNewTemplate,
  } = useEmailTemplate();

  if (hasAccess === false) {
    return null;
  }

  const emailTemplateColumns = createEmailTemplateTableColumns({
    handleEdit,
    handleDelete,
    canEdit,
    canDelete,
    page,
    rowsPerPage,
  });

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex gap-2">
        <h1 className="text-black font-bold text-2xl mt-2 mb-4">
          Mail Template
        </h1>
        <Button
          onClick={addNewTemplate}
          disabled={!canCreate}
          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
        >
          <Plus className="w-5 h-5 mr-1" /> Add New
        </Button>
      </div>

      <div className="block bg-white rounded-md mb-3">
        <div className="w-full flex items-center overflow-auto">
          {categories.map((category: any) => (
            <div
              key={category.id}
              onClick={() => handleTabChange(category.id)}
              className={`cursor-pointer h-full flex items-center justify-center sm:px-7 px-5 ${
                selectedTab === category.id &&
                "border-b-[3px] border-primary sm:px-7 px-5"
              }`}
            >
              <button
                className={`text-sm py-5 ${
                  selectedTab === category.id && "text-primary"
                }`}
              >
                {category.name
                  .split("-")
                  .map(
                    (word: string) =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                  )
                  .join(" ")}
              </button>
            </div>
          ))}
        </div>
      </div>

      <DataTable
        loading={isLoading}
        data={templates}
        columns={emailTemplateColumns}
        pagination={{
          page,
          totalPages,
          totalItems,
          rowsPerPage,
          onPageChange: setPage,
          onRowsPerPageChange: handleRowsPerPageChange,
        }}
        className="email-template-table"
        noDataText="No email template data available"
      />
    </div>
  );
}