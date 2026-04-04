import type { Header, RowData } from '@tanstack/react-table';
import * as React from 'react';

import { Box } from '../Box';
import type { DataTableInstance } from './DataTable.types';
import {
  dataTableResizeHandleGripVariants,
  dataTableResizeHandleVariants,
} from './DataTable.variants';

const DEFAULT_MIN_COLUMN_SIZE = 20;
const KEYBOARD_COLUMN_RESIZE_STEP = 16;
const KEYBOARD_COLUMN_RESIZE_LARGE_STEP = 40;

function clampColumnSize(nextSize: number, minSize: number, maxSize?: number) {
  const lowerBound = Math.max(minSize, DEFAULT_MIN_COLUMN_SIZE);

  if (typeof maxSize === 'number') {
    return Math.min(Math.max(nextSize, lowerBound), maxSize);
  }

  return Math.max(nextSize, lowerBound);
}

function resolveResizeBounds<TData extends RowData>(
  header: Header<TData, unknown>,
  table: DataTableInstance<TData>,
) {
  const columnDef = header.column.columnDef;
  const defaultColumn = table.options.defaultColumn;

  return {
    minSize: columnDef.minSize ?? defaultColumn?.minSize ?? DEFAULT_MIN_COLUMN_SIZE,
    maxSize: columnDef.maxSize ?? defaultColumn?.maxSize,
  };
}

function resolveResizeLabel<TData extends RowData>(header: Header<TData, unknown>) {
  return typeof header.column.columnDef.header === 'string'
    ? header.column.columnDef.header
    : header.column.id;
}

interface DataTableResizeHandleProps<TData extends RowData> {
  header: Header<TData, unknown>;
  table: DataTableInstance<TData>;
}

export function DataTableResizeHandle<TData extends RowData>({
  header,
  table,
}: DataTableResizeHandleProps<TData>) {
  const resizeHandler = header.getResizeHandler();
  const isResizing = header.column.getIsResizing();
  const resizeLabel = resolveResizeLabel(header);
  const currentSize = Math.round(header.getSize());
  const { minSize, maxSize } = resolveResizeBounds(header, table);
  const previewOffset =
    isResizing && table.options.columnResizeMode !== 'onChange'
      ? (table.getState().columnSizingInfo.deltaOffset ?? 0)
      : 0;
  const handleStyle = React.useMemo<React.CSSProperties>(
    () => ({
      transform: `translate3d(calc(35% + ${previewOffset}px), -50%, 0)`,
    }),
    [previewOffset],
  );

  const setColumnSize = React.useCallback(
    (nextSize: number) => {
      table.setColumnSizing((current) => ({
        ...current,
        [header.column.id]: clampColumnSize(nextSize, minSize, maxSize),
      }));
    },
    [header.column.id, maxSize, minSize, table],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const step = event.shiftKey ? KEYBOARD_COLUMN_RESIZE_LARGE_STEP : KEYBOARD_COLUMN_RESIZE_STEP;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          event.stopPropagation();
          setColumnSize(header.getSize() - step);
          break;
        case 'ArrowRight':
          event.preventDefault();
          event.stopPropagation();
          setColumnSize(header.getSize() + step);
          break;
        case 'Home':
          event.preventDefault();
          event.stopPropagation();
          setColumnSize(minSize);
          break;
        case 'End':
          if (typeof maxSize !== 'number') {
            return;
          }

          event.preventDefault();
          event.stopPropagation();
          setColumnSize(maxSize);
          break;
        case 'Backspace':
        case 'Delete':
          event.preventDefault();
          event.stopPropagation();
          header.column.resetSize();
          break;
        default:
          break;
      }
    },
    [header, maxSize, minSize, setColumnSize],
  );

  return (
    <Box
      as="div"
      role="separator"
      tabIndex={0}
      aria-label={`Resize ${resizeLabel} column`}
      aria-orientation="vertical"
      aria-valuenow={currentSize}
      aria-valuemin={minSize}
      aria-valuemax={maxSize}
      aria-valuetext={`${currentSize} pixels wide`}
      data-slot="data-table-resize-handle"
      data-resizing={isResizing ? 'true' : 'false'}
      title="Drag to resize. Use Left and Right Arrow keys to adjust width. Press Delete to reset."
      className={dataTableResizeHandleVariants({
        resizing: isResizing,
      })}
      style={handleStyle}
      onDoubleClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        header.column.resetSize();
      }}
      onMouseDown={resizeHandler}
      onTouchStart={resizeHandler}
      onKeyDown={handleKeyDown}
    >
      <Box
        as="span"
        aria-hidden="true"
        className={dataTableResizeHandleGripVariants({
          resizing: isResizing,
        })}
      />
    </Box>
  );
}
