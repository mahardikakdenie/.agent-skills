'use client';

import noData from '@public/images/no-data.webp';
import Image from 'next/image';
import { useMemo } from 'react';
import { Plus } from 'react-feather';

import { Box, Button, Tabs, TabsList, TabsTrigger, DataTable } from '@repo/ui';

import { createEmailTemplateTableColumns } from '@/components/tableConfig/emailTemplateTableConfig';
import { CompactTablePagination } from '@/components/ui/compact-table-pagination';
import { useEmailTemplate } from '@/hooks/useEmailTemplate.hooks';

interface EmailTemplate {
  id: string;
  subject: string;
  journey: string;
  type: string;
}

interface Category {
  id: string;
  name: string;
}

let tableMeasureContext: CanvasRenderingContext2D | null = null;
function measureTextWidth(label: string, font: string, fallbackCharWidth: number) {
  if (typeof document === 'undefined') {
    return label.length * fallbackCharWidth;
  }

  if (!tableMeasureContext) {
    tableMeasureContext = document.createElement('canvas').getContext('2d');
  }

  if (!tableMeasureContext) {
    return label.length * fallbackCharWidth;
  }

  tableMeasureContext.font = font;

  return tableMeasureContext.measureText(label).width;
}

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

  const subjectColumnSize = useMemo(
    () =>
      Math.max(
        164,
        Math.ceil(
          Math.max(
            measureTextWidth('Subject', '500 14px Arial', 6.8),
            (templates as EmailTemplate[]).reduce((widest: number, item: EmailTemplate) => {
              const label = item?.subject || '-';
              return Math.max(widest, measureTextWidth(label, '400 13px Arial', 6.6));
            }, 0),
          ) + 28,
        ),
      ),
    [templates],
  );

  const journeyColumnSize = useMemo(
    () =>
      Math.max(
        164,
        Math.ceil(
          Math.max(
            measureTextWidth('Journey', '500 14px Arial', 6.8),
            (templates as EmailTemplate[]).reduce((widest: number, item: EmailTemplate) => {
              const label = item?.journey || '-';
              return Math.max(widest, measureTextWidth(label, '400 13px Arial', 6.6));
            }, 0),
          ) + 28,
        ),
      ),
    [templates],
  );

  const channelColumnSize = useMemo(
    () =>
      Math.max(
        130,
        Math.ceil(
          Math.max(
            measureTextWidth('Channel', '500 14px Arial', 6.8),
            (templates as EmailTemplate[]).reduce((widest: number, item: EmailTemplate) => {
              const label = item?.type || '-';
              return Math.max(widest, measureTextWidth(label, '600 12px Arial', 6.2));
            }, 0),
          ) + 28,
        ),
      ),
    [templates],
  );

  const actionColumnSize = useMemo(
    () =>
      Math.max(
        120,
        Math.ceil(
          Math.max(
            measureTextWidth('Action', '500 14px Arial', 6.8),
            measureTextWidth('Edit', '500 13px Arial', 6.6) + 72,
          ) + 24,
        ),
      ),
    [],
  );

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
    subjectColumnSize,
    journeyColumnSize,
    channelColumnSize,
    actionColumnSize,
  });

  return (
    <Box className="flex min-h-0 flex-1 w-full flex-col gap-3 p-4 md:p-6">
      <Box className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between 2xl:items-center">
        <Box as="h1" className="text-2xl font-bold text-black">
          Mail Template
        </Box>
        <Box className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 xl:w-auto 2xl:flex-nowrap">
          <Button
            onClick={addNewTemplate}
            disabled={!canCreate}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] sm:ml-auto"
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Add New
          </Button>
        </Box>
      </Box>

      <Box className="block rounded-xl bg-white">
        <Tabs
          value={selectedTab}
          onValueChange={handleTabChange}
          variant="underline"
          className="w-full [&_[data-slot=tabs-list-shell]]:rounded-md"
        >
          <TabsList
            aria-label="Email template categories tabs"
            className="w-full justify-start rounded-md border-0 bg-transparent p-0 text-inherit overflow-auto"
          >
            {(categories as Category[]).map((category: Category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                variant="underline"
                className="h-12 px-4 py-2.5 text-sm font-normal whitespace-nowrap"
              >
                <Box as="span" className="mr-2.5">
                  {category.name
                    .split('-')
                    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </Box>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Box>

      <DataTable
        className="!gap-3 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        loading={isLoading}
        data={templates}
        columns={emailTemplateColumns}
        defaultState={{
          columnPinning: {
            left: ['index', 'subject'],
            right: ['action'],
          },
        }}
        pagination={{
          pageIndex: page - 1,
          pageSize: rowsPerPage,
          pageCount: totalPages,
          rowCount: totalItems,
          onPageChange: (pageIndex) => {
            if (isLoading) return;
            setPage(pageIndex + 1);
          },
          onPageSizeChange: (pageSize) => {
            if (isLoading) return;
            handleRowsPerPageChange(pageSize);
          },
        }}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        emptyState={
          <Box className="sticky left-0 flex min-h-[10rem] w-[100cqw] items-center justify-center gap-2 py-4 md:min-h-[11rem] md:py-5">
            <Box className="flex flex-col items-center justify-center gap-2">
              <Image alt="No email template data" src={noData} width={128} />
              <Box as="span">No email template data available</Box>
            </Box>
          </Box>
        }
        renderPagination={(table) => (
          <Box className="-mt-1">
            <CompactTablePagination
              table={table}
              pageSizeOptions={[10, 20, 30, 50, 100]}
              disabled={isLoading}
            />
          </Box>
        )}
        tableOptions={{
          manualPagination: true,
          enableColumnPinning: true,
          enableColumnResizing: true,
          defaultColumn: {
            minSize: 48,
            size: 96,
          },
          getRowId: (row, index) => (row as any)?.id || `email-template-row-${index}`,
        }}
      />
    </Box>
  );
}
