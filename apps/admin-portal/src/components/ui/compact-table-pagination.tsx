import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';

import {
  Box,
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type DataTableInstance,
  type RowData,
} from '@repo/ui';

type CompactTablePaginationProps<TData extends RowData> = {
  table: DataTableInstance<TData>;
  pageSizeOptions?: number[];
  disabled?: boolean;
  interactionCooldownMs?: number;
};

const formatCompactPaginationNumber = (value: number) =>
  new Intl.NumberFormat('id-ID').format(value);

export function CompactTablePagination<TData extends RowData>({
  table,
  pageSizeOptions = [10, 20, 30, 50, 100],
  disabled = false,
  interactionCooldownMs = 400,
}: CompactTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = Math.max(table.getPageCount(), 1);
  const rowCount = table.getRowCount();
  const currentPage = pageIndex + 1;
  const resolvedPageSizeOptions = Array.from(
    new Set(pageSizeOptions.filter((option) => option > 0)),
  );
  const [interactionLocked, setInteractionLocked] = useState(false);
  const interactionLockedRef = useRef(false);
  const waitingForFetchRef = useRef(false);
  const disabledRef = useRef(disabled);
  const interactionTimeoutRef = useRef<number | null>(null);

  const releaseInteractionLock = useCallback(() => {
    interactionLockedRef.current = false;
    waitingForFetchRef.current = false;
    setInteractionLocked(false);

    if (interactionTimeoutRef.current !== null) {
      window.clearTimeout(interactionTimeoutRef.current);
      interactionTimeoutRef.current = null;
    }
  }, []);

  const tryStartInteraction = useCallback(() => {
    if (disabledRef.current || interactionLockedRef.current) {
      return false;
    }

    interactionLockedRef.current = true;
    waitingForFetchRef.current = true;
    setInteractionLocked(true);

    if (interactionTimeoutRef.current !== null) {
      window.clearTimeout(interactionTimeoutRef.current);
    }

    interactionTimeoutRef.current = window.setTimeout(() => {
      if (waitingForFetchRef.current && !disabledRef.current) {
        releaseInteractionLock();
      }
    }, interactionCooldownMs);

    return true;
  }, [interactionCooldownMs, releaseInteractionLock]);

  useEffect(() => {
    disabledRef.current = disabled;

    if (disabled) {
      waitingForFetchRef.current = false;
      return;
    }

    if (interactionLockedRef.current && !waitingForFetchRef.current) {
      releaseInteractionLock();
    }
  }, [disabled, releaseInteractionLock]);

  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current !== null) {
        window.clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  const controlsDisabled = disabled || interactionLocked;

  return (
    <Box className="pt-1">
      <Box className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Box className="flex flex-wrap items-center gap-2 text-sm font-normal text-slate-500">
          <Box as="span" className="font-medium text-slate-600">
            Showing:
          </Box>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              if (!value || controlsDisabled) {
                return;
              }

              const nextPageSize = Number(value);
              if (Number.isNaN(nextPageSize) || nextPageSize === pageSize) {
                return;
              }

              if (!tryStartInteraction()) {
                return;
              }

              table.setPageSize(nextPageSize);
            }}
            disabled={controlsDisabled}
            size="sm"
            className="w-[5.5rem]"
          >
            <SelectTrigger className="h-8 min-h-8 w-[5.5rem] rounded-lg border-slate-200 bg-white px-2.5 text-xs shadow-none hover:border-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {resolvedPageSizeOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Box as="span">
            of{' '}
            <Box as="span" className="text-slate-900">
              {formatCompactPaginationNumber(rowCount)}
            </Box>{' '}
            items
          </Box>
        </Box>

        <Box className="flex items-center justify-between gap-3 md:justify-end">
          <Box as="span" className="text-xs font-medium text-slate-400">
            Page {formatCompactPaginationNumber(currentPage)} of{' '}
            {formatCompactPaginationNumber(pageCount)}
          </Box>
          <Box className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (!tryStartInteraction()) {
                  return;
                }

                table.setPageIndex(pageIndex - 1);
              }}
              disabled={controlsDisabled || !table.getCanPreviousPage()}
              title="Prev"
              aria-label="Go to previous page"
              className="h-8 w-8 rounded-full border-slate-200 p-0 text-slate-600 shadow-none transition-colors enabled:hover:border-sky-200 enabled:hover:bg-sky-50 enabled:hover:text-sky-700 enabled:hover:shadow-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (!tryStartInteraction()) {
                  return;
                }

                table.setPageIndex(pageIndex + 1);
              }}
              disabled={controlsDisabled || !table.getCanNextPage()}
              title="Next"
              aria-label="Go to next page"
              className="h-8 w-8 rounded-full border-slate-200 p-0 text-slate-600 shadow-none transition-colors enabled:hover:border-sky-200 enabled:hover:bg-sky-50 enabled:hover:text-sky-700 enabled:hover:shadow-none"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
