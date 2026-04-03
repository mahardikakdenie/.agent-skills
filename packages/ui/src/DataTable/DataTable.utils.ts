import type { Column, FilterFn, RowData } from '@tanstack/react-table';
import { functionalUpdate } from '@tanstack/react-table';
import type { CSSProperties } from 'react';

import type {
  DataTableInstance,
  DataTableLayoutOptions,
  DataTablePaginationConfig,
  DataTableRenderContext,
  DataTableRenderable,
  DataTableState,
} from './DataTable.types';

export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50];
export const DEFAULT_LOADING_ROW_COUNT = 4;
export const SKELETON_WIDTHS = ['w-12', 'w-20', 'w-24', 'w-28', 'w-32', 'w-36'];

function normalizeSearchText(value: unknown): string {
  if (Array.isArray(value)) {
    return value
      .map((entry) => normalizeSearchText(entry))
      .filter(Boolean)
      .join(' ');
  }

  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>)
      .map((entry) => normalizeSearchText(entry))
      .filter(Boolean)
      .join(' ');
  }

  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function isSubsequenceMatch(haystack: string, needle: string) {
  if (!needle.length) {
    return true;
  }

  let needleIndex = 0;

  for (const character of haystack) {
    if (character === needle[needleIndex]) {
      needleIndex += 1;
    }

    if (needleIndex === needle.length) {
      return true;
    }
  }

  return false;
}

export const dataTableFacetedFilterFn: FilterFn<RowData> = (row, columnId, filterValue) => {
  if (!Array.isArray(filterValue) || filterValue.length === 0) {
    return true;
  }

  const rowValue = row.getValue(columnId);

  if (Array.isArray(rowValue)) {
    return rowValue.some((value) => filterValue.includes(String(value)));
  }

  return filterValue.includes(String(rowValue));
};

dataTableFacetedFilterFn.autoRemove = (value) => !Array.isArray(value) || value.length === 0;

export const dataTableFuzzyFilterFn: FilterFn<RowData> = (row, columnId, filterValue) => {
  const query = normalizeSearchText(filterValue);

  if (!query.length) {
    return true;
  }

  const searchableText = normalizeSearchText(row.getValue(columnId));

  if (!searchableText.length) {
    return false;
  }

  const spacedText = searchableText.replace(/\s+/g, ' ');

  if (spacedText.includes(query)) {
    return true;
  }

  const queryTokens = query.split(/\s+/).filter(Boolean);

  if (queryTokens.length > 1 && queryTokens.every((token) => spacedText.includes(token))) {
    return true;
  }

  return isSubsequenceMatch(spacedText.replace(/\s+/g, ''), query.replace(/\s+/g, ''));
};

dataTableFuzzyFilterFn.autoRemove = (value) => normalizeSearchText(value).length === 0;

export function resolvePageSizeOptions(pageSizeOptions?: number[]) {
  if (!pageSizeOptions?.length) {
    return DEFAULT_PAGE_SIZE_OPTIONS;
  }

  const uniqueValues = Array.from(new Set(pageSizeOptions.filter((option) => option > 0)));

  return uniqueValues.length ? uniqueValues : DEFAULT_PAGE_SIZE_OPTIONS;
}

export function getSortDirectionLabel(sortDirection: false | 'asc' | 'desc') {
  if (sortDirection === 'asc') {
    return 'ascending';
  }

  if (sortDirection === 'desc') {
    return 'descending';
  }

  return 'none';
}

export function hasMeaningfulFilterValue(value: unknown) {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== null && value !== undefined && value !== false;
}

export function getSkeletonWidthClass(rowIndex: number, cellIndex: number) {
  return SKELETON_WIDTHS[(rowIndex + cellIndex) % SKELETON_WIDTHS.length] ?? 'w-24';
}

export function createDataTableState(
  defaultState?: Partial<DataTableState>,
  pagination?: DataTablePaginationConfig,
): DataTableState {
  return {
    sorting: defaultState?.sorting ?? [],
    columnFilters: defaultState?.columnFilters ?? [],
    globalFilter: defaultState?.globalFilter ?? undefined,
    columnVisibility: defaultState?.columnVisibility ?? {},
    rowSelection: defaultState?.rowSelection ?? {},
    rowPinning: defaultState?.rowPinning ?? { top: [], bottom: [] },
    expanded: defaultState?.expanded ?? {},
    grouping: defaultState?.grouping ?? [],
    columnPinning: defaultState?.columnPinning ?? { left: [], right: [] },
    columnOrder: defaultState?.columnOrder ?? [],
    columnSizing: defaultState?.columnSizing ?? {},
    pagination: {
      pageIndex: pagination?.pageIndex ?? defaultState?.pagination?.pageIndex ?? 0,
      pageSize: pagination?.pageSize ?? defaultState?.pagination?.pageSize ?? DEFAULT_PAGE_SIZE,
    },
  };
}

export function resolveRenderable<TData extends RowData>(
  renderable: DataTableRenderable<TData> | undefined,
  context: DataTableRenderContext<TData>,
) {
  if (typeof renderable === 'function') {
    return renderable(context);
  }

  return renderable;
}

export function resolveDataTableClassName<TContext>(
  className: string | ((context: TContext) => string | undefined) | undefined,
  context: TContext,
) {
  if (typeof className === 'function') {
    return className(context);
  }

  return className;
}

export function getPinnedColumnStyles<TData extends RowData>(
  column: Column<TData, unknown>,
): CSSProperties {
  const pinnedPosition = column.getIsPinned();
  const width = column.getSize();
  const styles: CSSProperties = {
    width,
    minWidth: width,
    maxWidth: width,
  };

  if (pinnedPosition === 'left') {
    styles.position = 'sticky';
    styles.left = column.getStart('left');
    styles.zIndex = 4;
    styles.backgroundColor = 'var(--data-table-pinned-bg-base, hsl(var(--background)))';
    styles.backgroundImage = 'var(--data-table-pinned-bg-overlay, none)';
    styles.backgroundClip = 'padding-box';
    styles.boxShadow = '1px 0 0 hsl(var(--border))';
  }

  if (pinnedPosition === 'right') {
    styles.position = 'sticky';
    styles.right = column.getAfter('right');
    styles.zIndex = 4;
    styles.backgroundColor = 'var(--data-table-pinned-bg-base, hsl(var(--background)))';
    styles.backgroundImage = 'var(--data-table-pinned-bg-overlay, none)';
    styles.backgroundClip = 'padding-box';
    styles.boxShadow = '-1px 0 0 hsl(var(--border))';
  }

  return styles;
}

export function getHeaderCellStyles<TData extends RowData>(
  column: Column<TData, unknown>,
  layout?: DataTableLayoutOptions,
): CSSProperties {
  const styles = getPinnedColumnStyles(column);

  if (layout?.stickyHeader) {
    styles.position = 'sticky';
    styles.top = 0;
    styles.zIndex = column.getIsPinned() ? 7 : 5;
    styles.backgroundColor = 'hsl(var(--background))';
  }

  return styles;
}

export function getFooterCellStyles<TData extends RowData>(
  column: Column<TData, unknown>,
  layout?: DataTableLayoutOptions,
): CSSProperties {
  const styles = getPinnedColumnStyles(column);

  if (layout?.stickyFooter) {
    styles.position = 'sticky';
    styles.bottom = '-1px';
    styles.zIndex = column.getIsPinned() ? 7 : 5;
    styles.backgroundColor = 'hsl(var(--background))';
  }

  return styles;
}

export function getViewportStyle(layout?: DataTableLayoutOptions): CSSProperties | undefined {
  const maxHeight = toCssDimension(layout?.maxBodyHeight);

  if (!maxHeight && !layout?.stickyHeader && !layout?.stickyFooter) {
    return undefined;
  }

  return {
    maxHeight,
    position: 'relative',
  };
}

export function getTableStyle<TData extends RowData>(
  table: DataTableInstance<TData>,
): CSSProperties {
  const totalWidth = table.getTotalSize();
  const resolvedWidth = totalWidth > 0 ? `max(100%, ${totalWidth}px)` : '100%';

  return {
    width: resolvedWidth,
    minWidth: '100%',
    tableLayout: 'fixed',
  };
}

export function toCssDimension(value?: number | string) {
  if (value === undefined) {
    return undefined;
  }

  return typeof value === 'number' ? `${value}px` : value;
}

export function getColumnFilterValueAsString(column?: { getFilterValue: () => unknown }) {
  const filterValue = column?.getFilterValue();

  return typeof filterValue === 'string' ? filterValue : '';
}

export function getColumnFilterValueAsArray(column?: { getFilterValue: () => unknown }) {
  const filterValue = column?.getFilterValue();

  return Array.isArray(filterValue) ? filterValue.map((value) => String(value)) : ([] as string[]);
}

export function getFacetedFilterOptions(column?: {
  getFacetedUniqueValues: () => Map<unknown, number>;
}) {
  if (!column) {
    return [] as Array<{ label: string; value: string; count: number }>;
  }

  return Array.from(column.getFacetedUniqueValues().entries())
    .map(([value, count]) => ({
      label: String(value),
      value: String(value),
      count,
    }))
    .sort((left, right) => left.label.localeCompare(right.label));
}

export function updateArrayFilterValue(currentValue: string[], nextValue: string) {
  return currentValue.includes(nextValue)
    ? currentValue.filter((value) => value !== nextValue)
    : [...currentValue, nextValue];
}

export function applyUpdater<T>(updater: T | ((old: T) => T), currentValue: T) {
  return functionalUpdate(updater, currentValue);
}
