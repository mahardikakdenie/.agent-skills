import { cva } from 'class-variance-authority';

export const tableRootVariants = cva('w-full caption-bottom text-sm');

export const tableHeaderVariants = cva('[&_tr]:border-b [&_tr:hover]:bg-transparent');

export const tableBodyVariants = cva(
  '[&_tr:last-child]:border-b-0 [&_tr[data-state=selected]]:bg-muted [&_tr[data-state=selected]:hover]:bg-muted [&_tr:hover]:bg-muted/50',
);

export const tableFooterVariants = cva(
  'border-t border-border bg-muted/40 font-medium [&_tr:last-child]:border-b-0 [&_tr:hover]:bg-transparent',
);

export const tableRowVariants = cva(
  'border-b border-border transition-colors motion-reduce:transition-none',
);

export const tableHeadVariants = cva(
  'h-11 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
);

export const tableCellVariants = cva('p-4 align-middle [&:has([role=checkbox])]:pr-0');

export const tableCaptionVariants = cva('mt-4 text-sm text-muted-foreground');
