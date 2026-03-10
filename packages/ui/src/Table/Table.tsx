import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import {
  tableBodyVariants,
  tableCaptionVariants,
  tableCellVariants,
  tableFooterVariants,
  tableHeadVariants,
  tableHeaderVariants,
  tableRootVariants,
  tableRowVariants,
} from './Table.variants';
import type {
  TableBodyProps,
  TableCaptionProps,
  TableCellProps,
  TableFooterProps,
  TableHeadProps,
  TableHeaderProps,
  TableProps,
  TableRowProps,
} from './Table.types';

/**
 * Structural table primitive for semantic table markup without data logic.
 */
export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <Box
      as="table"
      ref={ref}
      data-slot="table"
      className={cn(tableRootVariants(), className)}
      {...props}
    />
  ),
);

Table.displayName = 'Table';

/**
 * Semantic header section for column labels and grouped header rows.
 */
export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <Box
      as="thead"
      ref={ref}
      data-slot="table-header"
      className={cn(tableHeaderVariants(), className)}
      {...props}
    />
  ),
);

TableHeader.displayName = 'TableHeader';

/**
 * Semantic body section for table data rows.
 */
export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <Box
      as="tbody"
      ref={ref}
      data-slot="table-body"
      className={cn(tableBodyVariants(), className)}
      {...props}
    />
  ),
);

TableBody.displayName = 'TableBody';

/**
 * Semantic footer section for summary or total rows.
 */
export const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <Box
      as="tfoot"
      ref={ref}
      data-slot="table-footer"
      className={cn(tableFooterVariants(), className)}
      {...props}
    />
  ),
);

TableFooter.displayName = 'TableFooter';

/**
 * Shared row primitive used by header, body, and footer sections.
 */
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <Box
      as="tr"
      ref={ref}
      data-slot="table-row"
      className={cn(tableRowVariants(), className)}
      {...props}
    />
  ),
);

TableRow.displayName = 'TableRow';

/**
 * Semantic header cell primitive for column or row headings.
 */
export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <Box
      as="th"
      ref={ref}
      data-slot="table-head"
      className={cn(tableHeadVariants(), className)}
      {...props}
    />
  ),
);

TableHead.displayName = 'TableHead';

/**
 * Semantic body or footer cell primitive.
 */
export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <Box
      as="td"
      ref={ref}
      data-slot="table-cell"
      className={cn(tableCellVariants(), className)}
      {...props}
    />
  ),
);

TableCell.displayName = 'TableCell';

/**
 * Semantic table caption for summary or context copy.
 */
export const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <Box
      as="caption"
      ref={ref}
      data-slot="table-caption"
      className={cn(tableCaptionVariants(), className)}
      {...props}
    />
  ),
);

TableCaption.displayName = 'TableCaption';
