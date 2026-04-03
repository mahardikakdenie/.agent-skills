import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import { Select } from '../Select';
import type { PaginationProps } from './Pagination.types';
import {
  paginationButtonVariants,
  paginationControlsVariants,
  paginationCurrentPageVariants,
  paginationEllipsisVariants,
  paginationListVariants,
  paginationMetaVariants,
  paginationPageSizeLabelVariants,
  paginationPageSizeSelectVariants,
  paginationRootVariants,
  paginationStatusVariants,
} from './Pagination.variants';

type PaginationRangeItem = number | 'ellipsis-left' | 'ellipsis-right';

function clampPage(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function sanitizePageSizeOptions(pageSize?: number, pageSizeOptions?: number[]) {
  const uniqueValues = new Set<number>();

  if (pageSize && Number.isFinite(pageSize) && pageSize > 0) {
    uniqueValues.add(Math.floor(pageSize));
  }

  for (const option of pageSizeOptions ?? []) {
    if (!Number.isFinite(option) || option <= 0) {
      continue;
    }

    uniqueValues.add(Math.floor(option));
  }

  return Array.from(uniqueValues).sort((left, right) => left - right);
}

// Keep the public API flat. The compact behavior is derived from large page
// counts instead of adding a dedicated boolean mode.
function buildPaginationRange(currentPage: number, totalPages: number): PaginationRangeItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 'ellipsis-right', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 'ellipsis-left', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    'ellipsis-left',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis-right',
    totalPages,
  ];
}

/**
 * Shared pagination shell with numeric page controls plus an optional page
 * size selector for generic list and table surfaces.
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      pageSize,
      onPageSizeChange,
      pageSizeOptions,
      variant = 'outline',
      className,
      ...props
    },
    ref,
  ) => {
    const resolvedTotalPages = Math.max(1, Math.floor(totalPages) || 1);
    const resolvedCurrentPage = clampPage(Math.floor(currentPage) || 1, 1, resolvedTotalPages);
    const resolvedPageSizeOptions = sanitizePageSizeOptions(pageSize, pageSizeOptions);
    const showPageSizeSelector =
      pageSize !== undefined &&
      typeof onPageSizeChange === 'function' &&
      resolvedPageSizeOptions.length > 1;
    const pageSizeLabelId = React.useId();
    const pageSizeSelectOptions = resolvedPageSizeOptions.map((option) => ({
      label: String(option),
      value: String(option),
    }));
    const isCompactRange = resolvedTotalPages > 7;
    const pageRange = buildPaginationRange(resolvedCurrentPage, resolvedTotalPages);
    const buttonSize = isCompactRange ? 'compact' : 'default';
    const canGoBackward = resolvedCurrentPage > 1;
    const canGoForward = resolvedCurrentPage < resolvedTotalPages;

    const triggerPageChange = (nextPage: number) => {
      const targetPage = clampPage(nextPage, 1, resolvedTotalPages);

      if (targetPage === resolvedCurrentPage) {
        return;
      }

      onPageChange(targetPage);
    };

    return (
      <Box
        as="nav"
        ref={ref}
        aria-label="Pagination"
        data-slot="pagination"
        className={cn(paginationRootVariants(), className)}
        {...props}
      >
        <Box data-slot="pagination-meta" className={paginationMetaVariants()}>
          {showPageSizeSelector ? (
            <Box data-slot="pagination-page-size" className={paginationPageSizeLabelVariants()}>
              <Box as="span" id={pageSizeLabelId} className="shrink-0 whitespace-nowrap">
                Rows per page
              </Box>
              <Select
                aria-labelledby={pageSizeLabelId}
                className={paginationPageSizeSelectVariants()}
                options={pageSizeSelectOptions}
                value={pageSize !== undefined ? String(pageSize) : undefined}
                onValueChange={(nextValue) => {
                  if (!nextValue) {
                    return;
                  }

                  onPageSizeChange?.(Number(nextValue));
                }}
              />
            </Box>
          ) : null}

          <Box
            as="p"
            data-slot="pagination-status"
            aria-live="polite"
            aria-atomic="true"
            className={paginationStatusVariants()}
          >
            Page{' '}
            <Box as="span" className="font-medium text-foreground tabular-nums">
              {resolvedCurrentPage}
            </Box>{' '}
            of{' '}
            <Box as="span" className="font-medium text-foreground tabular-nums">
              {resolvedTotalPages}
            </Box>
          </Box>
        </Box>

        <Box data-slot="pagination-controls" className={paginationControlsVariants()}>
          <Box as="ul" data-slot="pagination-list" className={paginationListVariants()}>
            <Box as="li">
              <Box
                as="button"
                type="button"
                aria-label="Go to first page"
                disabled={!canGoBackward}
                className={paginationButtonVariants({ variant, size: buttonSize })}
                onClick={() => {
                  triggerPageChange(1);
                }}
              >
                <ChevronsLeft aria-hidden="true" className="h-4 w-4" />
                <Box as="span" className="hidden sm:inline">
                  First
                </Box>
              </Box>
            </Box>

            <Box as="li">
              <Box
                as="button"
                type="button"
                aria-label="Go to previous page"
                disabled={!canGoBackward}
                className={paginationButtonVariants({ variant, size: buttonSize })}
                onClick={() => {
                  triggerPageChange(resolvedCurrentPage - 1);
                }}
              >
                <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                <Box as="span" className="hidden sm:inline">
                  Previous
                </Box>
              </Box>
            </Box>

            {pageRange.map((item, index) => (
              <Box as="li" key={typeof item === 'number' ? item : `${item}-${index}`}>
                {typeof item === 'number' ? (
                  item === resolvedCurrentPage ? (
                    <Box
                      as="span"
                      aria-current="page"
                      className={paginationCurrentPageVariants({ variant, size: buttonSize })}
                    >
                      {item}
                    </Box>
                  ) : (
                    <Box
                      as="button"
                      type="button"
                      aria-label={`Go to page ${item}`}
                      className={paginationButtonVariants({ variant, size: buttonSize })}
                      onClick={() => {
                        triggerPageChange(item);
                      }}
                    >
                      {item}
                    </Box>
                  )
                ) : (
                  <Box
                    as="span"
                    aria-hidden="true"
                    className={cn(
                      paginationEllipsisVariants(),
                      buttonSize === 'compact' ? 'h-8 text-xs' : undefined,
                    )}
                  >
                    <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
                  </Box>
                )}
              </Box>
            ))}

            <Box as="li">
              <Box
                as="button"
                type="button"
                aria-label="Go to next page"
                disabled={!canGoForward}
                className={paginationButtonVariants({ variant, size: buttonSize })}
                onClick={() => {
                  triggerPageChange(resolvedCurrentPage + 1);
                }}
              >
                <Box as="span" className="hidden sm:inline">
                  Next
                </Box>
                <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </Box>
            </Box>

            <Box as="li">
              <Box
                as="button"
                type="button"
                aria-label="Go to last page"
                disabled={!canGoForward}
                className={paginationButtonVariants({ variant, size: buttonSize })}
                onClick={() => {
                  triggerPageChange(resolvedTotalPages);
                }}
              >
                <Box as="span" className="hidden sm:inline">
                  Last
                </Box>
                <ChevronsRight aria-hidden="true" className="h-4 w-4" />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  },
);

Pagination.displayName = 'Pagination';
