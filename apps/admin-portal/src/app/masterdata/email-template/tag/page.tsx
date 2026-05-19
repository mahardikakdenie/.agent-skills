'use client';

import noData from '@public/images/no-data.webp';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'react-feather';

import { Box, Button, DataTable } from '@repo/ui';

import { createEmailTagTableColumns } from '@/components/table-config/email-tag-table-config';
import { CompactTablePagination } from '@/components/core/compact-table-pagination';
import AppURL from '@/constants/app-url.const';

import { usePages } from '../hooks';

export default function EmailTagPage() {
  const router = useRouter();
  const { fetchEmailTag, emailTag, emailTagMeta, mailTemplateService } = usePages();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTags = async (p: number, rpp: number) => {
    setIsLoading(true);
    await fetchEmailTag({ page: p, pageSize: rpp });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTags(page, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const handleEdit = (id: string) => {
    router.push(`${AppURL.masterdataEmailTemplateTagDetail}/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this email tag?')) {
      try {
        await mailTemplateService.deleteEmailTag(id);
        fetchTags(page, rowsPerPage);
      } catch (error) {
        console.error('Failed to delete email tag:', error);
      }
    }
  };

  const columns = useMemo(() => {
    const allColumns = createEmailTagTableColumns({
      page,
      rowsPerPage,
      handleEdit,
      handleDelete,
      canEdit: true, // Assuming true as in original, or we can add permission check
      canDelete: true,
    });

    // Filter columns to match requested: No., Journey, Tag, Action
    // In email-tag-table-config: index (No.), journey (Journey), tag (Tag Name), action (Action)
    return allColumns
      .filter((col) => ['index', 'journey', 'tag', 'action'].includes(col.id as string))
      .map((col) => {
        if (col.id === 'tag') {
          return { ...col, header: 'Tag' };
        }
        return col;
      });
  }, [page, rowsPerPage]);

  return (
    <Box className="flex min-h-0 flex-1 w-full flex-col gap-3 p-4 md:p-6">
      <Box className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between 2xl:items-center">
        <Box as="h1" className="text-2xl font-bold text-black">
          Email Tags
        </Box>
        <Box className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 xl:w-auto 2xl:flex-nowrap">
          <Button
            onClick={() => router.push(AppURL.masterdataEmailTemplateTagAdd)}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] sm:ml-auto"
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Add New
          </Button>
        </Box>
      </Box>

      <DataTable
        className="!gap-3 pb-4 md:pb-6 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        loading={isLoading}
        data={emailTag}
        columns={columns}
        defaultState={{
          columnPinning: {
            left: ['index'],
            right: ['action'],
          },
        }}
        pagination={{
          pageIndex: page - 1,
          pageSize: rowsPerPage,
          pageCount: emailTagMeta?.pageTotal || 1,
          rowCount: emailTagMeta?.total || 0,
          onPageChange: (pageIndex) => {
            if (isLoading) return;
            setPage(pageIndex + 1);
          },
          onPageSizeChange: (pageSize) => {
            if (isLoading) return;
            setRowsPerPage(pageSize);
            setPage(1);
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
