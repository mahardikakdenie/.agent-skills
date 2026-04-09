'use client';

import noData from '@public/images/no-data.webp';
import Image from 'next/image';
import { useMemo } from 'react';
import { Plus } from 'react-feather';

import { Box, Button, DataTable } from '@repo/ui';

import {
  createEmailTagTableColumns,
  type EmailTag,
} from '@/components/tableConfig/emailTagTableConfig';
import { CompactTablePagination } from '@/components/ui/compact-table-pagination';
import { useEmailTag } from '@/hooks/useEmailTag.hooks';

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

export default function EmailTagPage() {
  const {
    tags,
    totalPages,
    totalItems,
    page,
    rowsPerPage,
    hasAccess,
    canEdit,
    canCreate,
    canDelete,
    isLoading,
    setPage,
    handleRowsPerPageChange,
    handleEdit,
    handleDelete,
    addNewTag,
  } = useEmailTag();

  const tagNameColumnSize = useMemo(
    () =>
      Math.max(
        164,
        Math.ceil(
          Math.max(
            measureTextWidth('Tag Name', '500 14px Arial', 6.8),
            ((tags as EmailTag[]) || []).reduce((widest: number, item: EmailTag) => {
              const label = item?.tag || '-';
              return Math.max(widest, measureTextWidth(label, '400 13px Arial', 6.6));
            }, 0),
          ) + 28,
        ),
      ),
    [tags],
  );

  const journeyColumnSize = useMemo(
    () =>
      Math.max(
        164,
        Math.ceil(
          Math.max(
            measureTextWidth('Journey', '500 14px Arial', 6.8),
            ((tags as EmailTag[]) || []).reduce((widest: number, item: EmailTag) => {
              const label = item?.journey || '-';
              return Math.max(widest, measureTextWidth(label, '400 13px Arial', 6.6));
            }, 0),
          ) + 28,
        ),
      ),
    [tags],
  );

  const typeColumnSize = useMemo(
    () =>
      Math.max(
        130,
        Math.ceil(
          Math.max(
            measureTextWidth('Type', '500 14px Arial', 6.8),
            ((tags as EmailTag[]) || []).reduce((widest: number, item: EmailTag) => {
              const label = item?.type || '-';
              return Math.max(widest, measureTextWidth(label, '600 12px Arial', 6.2));
            }, 0),
          ) + 28,
        ),
      ),
    [tags],
  );

  const descriptionColumnSize = useMemo(
    () =>
      Math.max(
        164,
        Math.ceil(
          Math.max(
            measureTextWidth('Description', '500 14px Arial', 6.8),
            ((tags as EmailTag[]) || []).reduce((widest: number, item: EmailTag) => {
              const label = item?.description || '-';
              return Math.max(widest, measureTextWidth(label, '400 13px Arial', 6.6));
            }, 0),
          ) + 28,
        ),
      ),
    [tags],
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

  const columns = createEmailTagTableColumns({
    handleEdit,
    handleDelete,
    canEdit,
    canDelete,
    page,
    rowsPerPage,
    tagNameColumnSize,
    journeyColumnSize,
    typeColumnSize,
    descriptionColumnSize,
    actionColumnSize,
  });

  if (hasAccess === false) {
    return null;
  }

  return (
    <Box className="flex min-h-0 flex-1 w-full flex-col gap-3 p-4 md:p-6">
      <Box className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between 2xl:items-center">
        <Box as="h1" className="text-2xl font-bold text-black">
          Email Tag
        </Box>
        <Box className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 xl:w-auto 2xl:flex-nowrap">
          <Button
            onClick={addNewTag}
            disabled={!canCreate}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] sm:ml-auto xl:ml-0"
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Add New
          </Button>
        </Box>
      </Box>

      <DataTable
        className="!gap-3 pb-4 md:pb-6 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        loading={isLoading}
        data={tags}
        columns={columns}
        defaultState={{
          columnPinning: {
            left: ['index', 'tag'],
            right: ['action'],
          },
        }}
        enablePagination={true}
        pagination={{
          pageIndex: page - 1,
          pageSize: rowsPerPage,
          pageCount: totalPages,
          rowCount: totalItems,
          onPageChange: (pageIndex) => {
            if (isLoading) {
              return;
            }
            setPage(pageIndex + 1);
          },
          onPageSizeChange: (pageSize) => {
            if (isLoading) {
              return;
            }
            handleRowsPerPageChange(pageSize);
          },
        }}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        emptyState={
          <Box className="sticky left-0 flex min-h-[10rem] w-[100cqw] items-center justify-center gap-2 py-4 md:min-h-[11rem] md:py-5">
            <Box className="flex flex-col items-center justify-center gap-2">
              <Image alt="No email tag data" src={noData} width={128} />
              <Box as="span">No email tag data available</Box>
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
          getRowId: (row, index) => (row as any)?.id || `email-tag-row-${index}`,
        }}
      />
    </Box>
  );
}
